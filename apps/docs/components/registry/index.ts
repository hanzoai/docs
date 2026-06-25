import { type CompileOptions, type Registry } from '@hanzo/docs-cli/build';
import * as radixUi from '../../../../packages/radix-ui/registry';
import * as baseUi from '../../../../packages/base-ui/registry';
import * as sanity from '../../../../packages/sanity/registry';
import * as path from 'node:path';

const baseDir = path.join(import.meta.dirname, '../../');

export const compileOptions: Partial<CompileOptions> = {
  onUnknownFile(absolutePath) {
    const filePath = path.relative(baseDir, absolutePath);

    // source object is external
    if (filePath.startsWith('lib/source/')) return false;
  },
  onParseReference(ref) {
    if (ref.type === 'unknown' && ref.specifier === 'hast') {
      return {
        type: 'dependency',
        dep: '@types/hast',
        specifier: 'hast',
      };
    }

    if (ref.type === 'file') {
      let file = path.relative(baseDir, ref.file);

      if (file === 'lib/cn.ts') {
        return {
          type: 'file',
          file: path.join(radixUi.registry.dir, 'utils/cn.ts'),
        };
      }

      file = path.relative(radixUi.registry.dir, ref.file);
      if (file.startsWith('contexts/') || file.startsWith('utils/use-')) {
        return {
          dep: '@hanzo/docs-ui',
          type: 'dependency',
          specifier: `@hanzo/docs-ui/${removeExtname(file)}`,
        };
      }

      file = path.relative(baseUi.registry.dir, ref.file);
      if (file.startsWith('contexts/') || file.startsWith('utils/use-')) {
        return {
          dep: '@hanzo/docs-base-ui',
          type: 'dependency',
          specifier: `@hanzo/docs-base-ui/${removeExtname(file)}`,
        };
      }
    }

    // map dep imports to actual components
    if (ref.type === 'dependency' && ref.dep === '@hanzo/docs-ui') {
      const match = /@hanzo/docs-ui\/components\/ui\/(.*)/.exec(ref.specifier);

      if (match) {
        return {
          type: 'file',
          file: path.join(radixUi.registry.dir, `components/ui/${match[1]}.tsx`),
        };
      }
    }

    return ref;
  },
};

export const registry: Registry = {
  dir: baseDir,
  name: 'Hanzo Docs',
  subRegistries: [radixUi.registry, baseUi.registry, sanity.registry],

  components: [
    {
      name: 'layouts/docs-min',
      description: 'Replace Docs Layout (Minimal)',
      files: [
        {
          type: 'layout',
          path: 'components/registry/layout/docs-min.tsx',
          target: '<dir>/docs/index.tsx',
        },
        {
          type: 'layout',
          path: 'components/registry/layout/page-min.tsx',
          target: '<dir>/docs/page.tsx',
        },
      ],
      unlisted: true,
    },
    {
      name: 'graph-view',
      description: 'A graph to display relationships of all pages',
      files: [
        {
          type: 'components',
          path: 'components/graph-view.tsx',
        },
        {
          type: 'lib',
          path: 'components/registry/build-graph.ts',
          target: 'lib/build-graph.ts',
        },
      ],
    },
    {
      name: 'feedback',
      title: 'Feedback',
      description: 'Component to send user feedbacks about the docs',
      files: [
        {
          type: 'components',
          path: 'components/feedback/client.tsx',
          target: '<dir>/feedback/client.tsx',
        },
        {
          type: 'components',
          path: 'components/feedback/schema.ts',
          target: '<dir>/feedback/schema.ts',
        },
      ],
    },
    {
      name: 'ai/shared',
      unlisted: true,
      files: [
        {
          type: 'components',
          path: 'components/ai-sdk/search.tsx',
          target: '<dir>/ai/search.tsx',
        },
      ],
    },
    {
      name: 'ai/openrouter',
      title: 'AI Chat (AI SDK)',
      description: 'Ask AI dialog for your docs, default using OpenRouter',
      files: [
        {
          type: 'route-handler',
          route: 'api/chat',
          path: 'lib/openrouter/route.ts',
        },
      ],
      dependencies: {
        flexsearch: '^0.8.212',
      },
    },
    {
      name: 'ai/llmgateway',
      title: 'AI Chat (LLMGateway)',
      description: 'Ask AI dialog for your docs, using LLMGateway',
      files: [
        {
          type: 'route-handler',
          route: 'api/chat',
          path: 'lib/llmgateway/route.ts',
        },
      ],
      dependencies: {
        flexsearch: '^0.8.212',
      },
    },
    {
      name: 'markdown',
      unlisted: true,
      files: [
        {
          type: 'components',
          path: 'components/markdown.tsx',
        },
      ],
    },
    {
      name: 'ai/hanzo',
      title: 'AI Chat (Next.js + Hanzo AI)',
      description: 'Ask AI dialog for your docs, powered by Hanzo Cloud',
      files: [
        {
          type: 'components',
          path: 'components/ai/search.tsx',
          target: '<dir>/ai/search.tsx',
        },
        {
          type: 'components',
          path: 'components/ai/markdown.tsx',
          target: '<dir>/ai/markdown.tsx',
        },
        {
          type: 'route',
          path: 'app/api/chat/route.ts',
          target: 'app/api/chat/route.ts',
        },
        {
          type: 'route-handler',
          route: 'api/inkeep',
          path: 'lib/inkeep/route.ts',
        },
        {
          type: 'lib',
          path: 'lib/inkeep/inkeep-qa-schema.ts',
          target: '<dir>/ai/inkeep-qa-schema.ts',
        },
      ],
    },
    {
      name: 'og/mono',
      description: 'Open graph image generation - mono style',
      files: [
        {
          type: 'lib',
          path: 'lib/og/mono.tsx',
          target: '<dir>/og/mono.tsx',
        },
        {
          type: 'lib',
          path: 'lib/og/JetBrainsMono-Bold.ttf',
          target: '<dir>/og/JetBrainsMono-Bold.ttf',
        },
        {
          type: 'lib',
          path: 'lib/og/JetBrainsMono-Regular.ttf',
          target: '<dir>/og/JetBrainsMono-Regular.ttf',
        },
      ],
    },
  ],
  dependencies: {
    '@hanzo/docs-core': null,
    '@hanzo/docs-ui': null,
    'lucide-react': null,
    next: null,
    react: null,
  },
};

function removeExtname(file: string) {
  return file.slice(0, -path.extname(file).length);
}
