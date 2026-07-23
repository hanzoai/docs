import defaultMdxComponents from '@hanzo/docs-ui/mdx';
import { Files, File, Folder } from '@hanzo/docs-ui/components/files';
import { Tabs, Tab, TabsContent, TabsList, TabsTrigger } from '@hanzo/docs-ui/components/tabs';
import { Steps, Step } from '@hanzo/docs-ui/components/steps';
import type { MDXComponents } from 'mdx/types';
import { Accordion, Accordions } from '@hanzo/docs-ui/components/accordion';
import { Card, Cards } from '@hanzo/docs-base-ui/components/card';
import * as icons from 'lucide-react';

export function getMDXComponents(components?: MDXComponents): MDXComponents {
  return {
    ...defaultMdxComponents,
    // Card/Cards were missing here, so every <Cards> in MDX content rendered as
    // unstyled run-on text (the "Browse by product" grids collapsed to a wall of
    // sentences). Register them so the card layout + titles + links render.
    Card,
    Cards,
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
