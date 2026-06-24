import type { MDXComponents } from 'mdx/types';
import defaultMdxComponents from '@fumadocs/base-ui/mdx';
import { Tab, Tabs } from '@fumadocs/base-ui/components/tabs';
import { Callout } from '@fumadocs/base-ui/components/callout';
import { Step, Steps } from '@fumadocs/base-ui/components/steps';
import { File, Folder, Files } from '@fumadocs/base-ui/components/files';
import { Accordion, Accordions } from '@fumadocs/base-ui/components/accordion';

export function getMDXComponents(components?: MDXComponents): MDXComponents {
  return {
    ...defaultMdxComponents,
    Tab,
    Tabs,
    Callout,
    Step,
    Steps,
    File,
    Folder,
    Files,
    Accordion,
    Accordions,
    ...components,
  };
}
