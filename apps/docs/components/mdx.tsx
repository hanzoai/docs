import defaultMdxComponents from '@hanzo/docs-ui/mdx';
import { Files, File, Folder } from '@hanzo/docs-ui/components/files';
import { Tabs, Tab, TabsContent, TabsList, TabsTrigger } from '@hanzo/docs-ui/components/tabs';
import { Steps, Step } from '@hanzo/docs-ui/components/steps';
import type { MDXComponents } from 'mdx/types';
import { Accordion, Accordions } from '@hanzo/docs-ui/components/accordion';
import * as icons from 'lucide-react';

export function getMDXComponents(components?: MDXComponents): MDXComponents {
  return {
    ...defaultMdxComponents,
    Tabs,
    Tab,
    TabsContent,
    TabsList,
    TabsTrigger,
    Steps,
    Step,
    Files,
    File,
    Folder,
    Accordion,
    Accordions,
    ...components,
  };
}

export const useMDXComponents = getMDXComponents;

declare global {
  type MDXProvidedComponents = ReturnType<typeof getMDXComponents>;
}
