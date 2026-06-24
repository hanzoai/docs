import defaultMdxComponents from 'fumadocs-ui/mdx';
import { Files, File, Folder } from 'fumadocs-ui/components/files';
import { Tabs, Tab, TabsContent, TabsList, TabsTrigger } from 'fumadocs-ui/components/tabs';
import { Steps, Step } from 'fumadocs-ui/components/steps';
import type { MDXComponents } from 'mdx/types';
import { Accordion, Accordions } from 'fumadocs-ui/components/accordion';
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
