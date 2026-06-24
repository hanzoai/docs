export * from './define';
export * from './preset';
export { remarkInclude } from '../loaders/mdx/remark-include';

export type { PostprocessOptions } from '../loaders/mdx/remark-postprocess';
export {
  metaSchema,
  pageSchema as frontmatterSchema,
  accessSchema,
} from 'fumadocs-core/source/schema';
