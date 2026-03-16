import defaultMdxComponents from '@hanzo/docs/ui/mdx';
import type { MDXComponents } from 'mdx/types';
import * as Python from '@hanzo/docs/python/components';

export function getMDXComponents(components?: MDXComponents) {
  return {
    ...defaultMdxComponents,
    ...Python,
    ...components,
  } satisfies MDXComponents;
}
