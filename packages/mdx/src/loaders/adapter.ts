import type { CompilerOptions } from './mdx/build-mdx';
import type { LoadFnOutput, LoadHook } from 'node:module';
import { fileURLToPath } from 'node:url';
import fs from 'node:fs/promises';
import type { HookFilter, TransformPluginContext } from 'rolldown';
import type { Environment, TransformResult } from 'vite';
import { parse } from 'node:querystring';
import { ValidationError } from '../utils/validation';
import type { LoaderContext } from 'webpack';
import { readFileSync } from 'node:fs';

export interface LoaderInput {
  development: boolean;
  compiler: CompilerOptions;

  filePath: string;
  query: Record<string, string | string[] | undefined>;
  getSource: () => string | Promise<string>;
}

export interface LoaderOutput {
  code: string;
  map?: unknown;

  /**
   * Only supported in Vite 8.
   *
   * Explicitly define the transformed module type, for unsupported environments, you need to consider the differences between each bundler.
   */
  moduleType?: 'js' | 'json';
}

type Awaitable<T> = T | Promise<T>;

export interface Loader {
  /**
   * Filter file paths, the input can be either a file URL or file path.
   *
   * Must take resource query into consideration.
   */
  test?: RegExp;

  /**
   * Transform input into JavaScript.
   *
   * Returns:
   * - `LoaderOutput`: JavaScript code & source map.
   * - `null`: skip the loader. Fallback to default behaviour if possible, otherwise the adapter will try workarounds.
   */
  load: (input: LoaderInput) => Awaitable<LoaderOutput | null>;

  bun?: {
    /**
     * 1. Bun doesn't allow `null` in loaders.
     * 2. Bun requires sync result to support dynamic require().
     */
    load?: (source: string, input: LoaderInput) => Awaitable<Bun.OnLoadResult>;
  };
}

export function toNode(loader: Loader): LoadHook {
  return async (url, _context, nextLoad): Promise<LoadFnOutput> => {
    if (url.startsWith('file:///') && (!loader.test || loader.test.test(url))) {
      const parsedUrl = new URL(url);
      const filePath = fileURLToPath(parsedUrl);

      const result = await loader.load({
        filePath,
        query: Object.fromEntries(parsedUrl.searchParams.entries()),
        async getSource() {
          return await fs.readFile(filePath, 'utf-8');
        },
        development: false,
        compiler: {
          addDependency() {},
        },
      });

      if (result) {
        return {
          source: result.code,
          format: 'module',
          shortCircuit: true,
        };
      }
    }

    return nextLoad(url);
  };
}

export interface ViteLoader {
  filter: HookFilter;

  transform: (
    this: TransformPluginContext & { environment?: Environment },
    value: string,
    id: string,
  ) => Promise<TransformResult | null>;
}

export function toVite(loader: Loader): ViteLoader {
  return {
    filter: {
      id: loader.test,
    },
    async transform(value, id) {
      const [file, query = ''] = id.split('?', 2);

      try {
        const parsedQuery = parse(query);
        if ('raw' in parsedQuery) {
          return null;
        }

        const result = await loader.load({
          filePath: file,
          query: parsedQuery,
          getSource() {
            return value;
          },
          development: this.environment ? this.environment.mode === 'dev' : false,
          compiler: {
            addDependency: (file) => {
              this.addWatchFile(file);
            },
          },
        });

        if (result === null) return null;
        return {
          code: result.code,
          map: result.map as TransformResult['map'],
          moduleType: result.moduleType,
        };
      } catch (e) {
        if (e instanceof ValidationError) {
          throw new Error(await e.toStringFormatted(), { cause: e });
        }

        throw e;
      }
    },
  };
}

export type WebpackLoader = (
  this: LoaderContext<unknown>,
  source: string,
  callback: LoaderContext<unknown>['callback'],
) => Promise<void>;

/**
 * need to handle the `test` regex in Webpack config instead.
 */
export function toWebpack(loader: Loader): WebpackLoader {
  return async function (source, callback) {
    try {
      const isProjectDoc =
        this.resourcePath.includes('content/docs/projects/') ||
        this.resourcePath.includes('content\\docs\\projects\\');

      // For upstream project docs, pre-process the raw MDX source to
      // escape curly-brace template placeholders (e.g. {region}) that
      // MDX would otherwise interpret as JavaScript expressions.
      const processedSource = isProjectDoc
        ? escapeTemplatePlaceholders(source)
        : source;

      const result = await loader.load({
        filePath: this.resourcePath,
        query: parse(this.resourceQuery.slice(1)),
        getSource() {
          return processedSource;
        },
        development: this.mode === 'development',
        compiler: this,
      });

      if (result === null) {
        callback(undefined, source);
      } else {
        let code = result.code;

        // For upstream project docs, wrap the default export in try/catch
        // so that runtime errors (undefined variables from template
        // placeholders, etc.) don't crash the entire SSG build.
        if (this.resourcePath.includes('content/docs/projects/') ||
            this.resourcePath.includes('content\\docs\\projects\\')) {
          code = wrapMdxExportSafe(code);
        }

        callback(undefined, code, result.map as string);
      }
    } catch (error) {
      if (error instanceof ValidationError) {
        return callback(new Error(await error.toStringFormatted()));
      }

      // Resilience: instead of crashing the entire build on a bad page,
      // emit a warning and return a fallback component that renders an
      // error message at runtime.  This lets the rest of the site build
      // even when upstream imported docs contain unsupported syntax.
      const filePath = this.resourcePath;
      const msg =
        error instanceof Error ? error.message : String(error);

      this.emitWarning(
        new Error(
          `[hanzo-docs] Skipping page due to compilation error: ${filePath}\n${msg}`,
        ),
      );

      // The fallback must match the failing module's type. `.json` meta files
      // are webpack `type: 'json'` modules — emitting JS (`export const …`)
      // there makes webpack JSON-parse JS and crash the whole build. Meta
      // files (json/yaml) fall back to an empty meta object in their own
      // module shape; only MDX pages get the React error-page fallback.
      let fallback: string;
      if (filePath.endsWith('.json')) {
        fallback = '{}';
      } else if (filePath.endsWith('.yaml') || filePath.endsWith('.yml')) {
        fallback = 'export default {};';
      } else {
        fallback = [
          `export const frontmatter = {};`,
          `export const toc = [];`,
          `export const structuredData = { headings: [], contents: [] };`,
          `export default function ErrorPage() {`,
          `  return null;`,
          `}`,
        ].join('\n');
      }

      callback(undefined, fallback);
    }
  };
}

/**
 * Wrap the compiled MDX default export in a try/catch so that runtime
 * errors during SSG prerendering (e.g. undefined template variables,
 * broken expressions from upstream docs) render null instead of
 * crashing the entire build.
 */
function wrapMdxExportSafe(code: string): string {
  // Match the MDX default export function.
  // MDX v3 compiles to: function MDXContent(props = {}) { ... }
  // then: export default MDXContent;
  // OR: export default function MDXContent(props = {}) { ... }
  //
  // Strategy: rename the original function and create a safe wrapper.
  const renamed = code.replace(
    /function\s+MDXContent\s*\(/,
    'function _UnsafeMDXContent(',
  );

  if (renamed === code) {
    // If the pattern didn't match, return as-is
    return code;
  }

  // Replace the export to point to our wrapper
  const withWrapper = renamed.replace(
    /export\s+default\s+MDXContent\b/,
    [
      'function MDXContent(props) {',
      '  try { return _UnsafeMDXContent(props); }',
      '  catch (e) { return null; }',
      '}',
      'export default MDXContent',
    ].join('\n'),
  );

  return withWrapper;
}

/**
 * Escape curly-brace template placeholders in upstream MDX source so
 * that MDX doesn't interpret them as JavaScript expressions.
 *
 * Targets patterns like `{region}`, `{variable_name}`, `{account-id}`
 * that appear outside of fenced code blocks.  Inside code fences the
 * content is already treated as literal text by the MDX parser.
 *
 * In MDX, `\{` produces a literal `{` character.
 */
function escapeTemplatePlaceholders(source: string): string {
  const lines = source.split('\n');
  let inCodeFence = false;
  const result: string[] = [];

  for (const line of lines) {
    // Track fenced code blocks (``` or ~~~)
    if (/^(\s*)(```|~~~)/.test(line)) {
      inCodeFence = !inCodeFence;
      result.push(line);
      continue;
    }

    if (inCodeFence) {
      result.push(line);
      continue;
    }

    // Outside code fences: escape {identifier} patterns that look like
    // template placeholders (e.g. {region}, {account-id}).  Only targets
    // lowercase identifiers to avoid interfering with JSX expressions.
    result.push(
      line.replace(
        /\{([a-z][a-z0-9_-]*)\}/g,
        (match, identifier) => {
          // Don't escape known MDX/JSX expression patterns
          if (['children', 'props', 'true', 'false', 'null', 'undefined'].includes(identifier)) {
            return match;
          }
          return `\\{${identifier}\\}`;
        },
      ),
    );
  }

  return result.join('\n');
}

export function toBun(loader: Loader) {
  function toResult(output: LoaderOutput | null): Bun.OnLoadResult {
    // it errors, treat this as an exception
    if (!output) return;

    return {
      contents: output.code,
      loader: output.moduleType ?? 'js',
    };
  }

  return (build: Bun.PluginBuilder) => {
    // avoid using async here, because it will cause dynamic require() to fail
    build.onLoad({ filter: loader.test ?? /.+/ }, (args) => {
      const [filePath, query = ''] = args.path.split('?', 2);
      const input: LoaderInput = {
        async getSource() {
          return Bun.file(filePath).text();
        },
        query: parse(query),
        filePath,
        development: false,
        compiler: {
          addDependency() {},
        },
      };

      if (loader.bun?.load) {
        return loader.bun.load(readFileSync(filePath, 'utf-8'), input);
      }

      const result = loader.load(input);
      if (result instanceof Promise) {
        return result.then(toResult);
      }
      return toResult(result);
    });
  };
}
