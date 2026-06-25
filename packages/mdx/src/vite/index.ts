import { mergeConfig, type Plugin, type UserConfig } from 'vite';
import { buildConfig } from '../config/build';
import { ValidationError } from '../utils/validation';
import { createMdxLoader } from '../loaders/mdx';
import { toVite } from '../loaders/adapter';
import type { FSWatcher } from 'chokidar';
import { _Defaults, createCore } from '../core';
import { createIntegratedConfigLoader } from '../loaders/config';
import { createMetaLoader } from '../loaders/meta';
import indexFile, { IndexFilePluginOptions } from '../plugins/index-file';

export interface PluginOptions {
  /**
   * Generate index files for accessing content.
   *
   * @defaultValue true
   */
  index?: boolean | IndexFilePluginOptions;

  /**
   * @defaultValue source.config.ts
   */
  configPath?: string;

  /**
   * Update Vite config to fix module resolution of Hanzo Docs
   *
   * @defaultValue true
   */
  updateViteConfig?: boolean;

  /**
   * Output directory of generated files
   *
   * @defaultValue '.source'
   */
  outDir?: string;
}

export default async function mdx(
  _config?: Record<string, unknown> | Promise<Record<string, unknown>>,
  pluginOptions: PluginOptions = {},
): Promise<Plugin> {
  const options = applyDefaults(pluginOptions);
  const core = createViteCore(options);
  await core.init({
    config: buildConfig(config),
  });

  const configLoader = createIntegratedConfigLoader(core);
  const mdxLoader = toVite(createMdxLoader(configLoader));
  const metaLoader = toVite(
    createMetaLoader(configLoader, {
      // vite has built-in plugin for JSON files
      json: 'json',
    }),
  );

  return {
    name: '@hanzo/docs-mdx',
    // needed, otherwise other plugins will be executed before our `transform`.
    enforce: 'pre',
    config(config) {
      if (!options.updateViteConfig) return config;

      return mergeConfig(config, {
        resolve: {
          noExternal: ['@hanzo/docs-core', '@hanzo/docs-base-ui', '@hanzo/docs-openapi', '@hanzo/docs-base-ui'],
          // only dedupe for public, non-transitive libs
          dedupe: ['@hanzo/docs-core', '@hanzo/docs-base-ui', '@hanzo/docs-openapi', '@hanzo/docs-base-ui'],
        },
      } satisfies UserConfig);
    },
    async buildStart() {
      await core.emit({ write: true });
    },
    async configureServer(server) {
      await core.initServer({
        watcher: server.watcher as unknown as FSWatcher,
      });
    },
    async transform(value, id) {
      try {
        if (metaLoader.filter(id)) {
          return await metaLoader.transform.call(this, value, id);
        }

        if (mdxLoader.filter(id)) {
          return await mdxLoader.transform.call(this, value, id);
        }
      } catch (e) {
        if (e instanceof ValidationError) {
          throw new Error(await e.toStringFormatted(), { cause: e });
        }

        throw e;
      }
    },
  };
  const mdxPlugin: Plugin = {
    name: '@hanzo/docs-mdx:mdx',
  };

  return [
    {
      name: '@hanzo/docs-mdx',
      async config(config) {
        const root = config.root ?? process.cwd();
        const options = applyDefaults(root, pluginOptions);
        core = createViteCore(options);
        await core.init({
          config: buildConfig(
            (await _config) ??
              (await runnerImport<Record<string, unknown>>(options.configPath)).module,
            root,
          ),
        });

        const configLoader = createIntegratedConfigLoader(core);
        const mdxLoader = toVite(createMdxLoader(configLoader));
        const metaLoader = toVite(
          createMetaLoader(configLoader, {
            // vite has built-in plugin for JSON files
            json: 'json',
          }),
        );

        mdxPlugin.transform = {
          filter: mdxLoader.filter,
          order: 'pre',
          async handler(code, id) {
            // Vite RSC will pass the compiled MDX file's client module with ID `virtual:vite-rsc/client-references/group/facade:xxx.mdx`.
            // The format of `value` becomes JavaScript, which will break the MDX compiler.
            // We have to ignore them.
            if (id.includes('virtual:vite-rsc')) return null;
            return await mdxLoader.transform.call(this, code, id);
          },
        };
        metaPlugin.transform = {
          filter: metaLoader.filter,
          order: 'pre',
          handler: metaLoader.transform,
        };

        if ('_fumadocs_skipViteConfig' in config && config._fumadocs_skipViteConfig) return;
        if (!options.updateViteConfig) return;

        const { getConfig } = await import('@hanzo/docs-vite');
        return getConfig({ root });
      },
      async buildStart() {
        await core.emit({ write: true });
      },
      async configureServer(server) {
        await core.initServer({
          watcher: server.watcher as unknown as FSWatcher,
        });
      },
    },
    mdxPlugin,
    metaPlugin,
  ];
}

export async function postInstall(pluginOptions: PluginOptions = {}) {
  const { loadConfig } = await import('../config/load-from-file');
  const core = createViteCore(applyDefaults(pluginOptions));
  await core.init({
    config: loadConfig(core, true),
  });
  await core.emit({ write: true });
}

function createViteCore({ index, configPath, outDir }: Required<PluginOptions>) {
  if (index === true) index = {};

  return createCore({
    environment: 'vite',
    configPath,
    outDir,
    plugins: [
      index &&
        indexFile({
          ...index,
          target: index.target ?? 'vite',
        }),
    ],
  });
}

function applyDefaults(root: string, options: PluginOptions): Required<PluginOptions> {
  return {
    updateViteConfig: options.updateViteConfig ?? true,
    index: options.index ?? true,
    configPath: path.resolve(root, options.configPath ?? _Defaults.configPath),
    outDir: path.resolve(root, options.outDir ?? _Defaults.outDir),
  };
}
