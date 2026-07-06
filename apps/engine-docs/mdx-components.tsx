import type { MDXComponents } from 'mdx/types';
import type { FC, ReactNode } from 'react';
import defaultMdxComponents from '@hanzo/docs-base-ui/mdx';
import { Tab, Tabs } from '@hanzo/docs-base-ui/components/tabs';
import { Callout } from '@hanzo/docs-base-ui/components/callout';
import { Step, Steps } from '@hanzo/docs-base-ui/components/steps';
import { Card, Cards } from '@hanzo/docs-base-ui/components/card';
import { File, Folder, Files } from '@hanzo/docs-base-ui/components/files';
import { Accordion, Accordions } from '@hanzo/docs-base-ui/components/accordion';

// Mintlify compatibility wrappers
const CardGroup: FC<{ cols?: number; children?: ReactNode }> = ({ children }) => (
  <Cards>{children}</Cards>
);
const Info: FC<{ children?: ReactNode }> = ({ children }) => (
  <Callout type="info">{children}</Callout>
);
const Warning: FC<{ children?: ReactNode }> = ({ children }) => (
  <Callout type="warn">{children}</Callout>
);
const Note: FC<{ children?: ReactNode }> = ({ children }) => (
  <Callout>{children}</Callout>
);

export function getMDXComponents(components?: MDXComponents): MDXComponents {
  return {
    ...defaultMdxComponents,
    Tab,
    Tabs,
    Callout,
    Step,
    Steps,
    Card,
    Cards,
    CardGroup,
    Info,
    Warning,
    Note,
    File,
    Folder,
    Files,
    Accordion,
    Accordions,
    ...components,
  };
}
