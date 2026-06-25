import type { MDXComponents } from 'mdx/types';
import defaultComponents from '@hanzo/docs-ui/mdx';

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...defaultComponents,
    ...components,
  };
}
