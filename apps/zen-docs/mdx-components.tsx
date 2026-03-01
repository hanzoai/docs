import type { MDXComponents } from 'mdx/types';
import defaultComponents from '@hanzo/docs-ui/mdx';
import { DynamicModelTable, DynamicCostExamples } from './components/DynamicModelTable';
import { ModelTable } from './components/ModelTable';

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...defaultComponents,
    DynamicModelTable,
    DynamicCostExamples,
    ModelTable,
    ...components,
  };
}
