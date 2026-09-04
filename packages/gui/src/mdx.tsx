import * as React from 'react';
import { Tabs, Tab } from './components/tabs';
import { Card, Cards } from './components/card';
import { Callout } from './components/callout';
import { Accordion, Accordions } from './components/accordion';
import { Steps, Step } from './components/steps';
import { TypeTable } from './components/type-table';
import { CodeBlock, Pre } from './components/codeblock';
import { Files, Folder, File } from './components/files';
import { Banner } from './components/banner';
import { Heading } from './components/heading';

export const defaultMdxComponents = {
  Tabs,
  Tab,
  Card,
  Cards,
  Callout,
  Accordion,
  Accordions,
  Steps,
  Step,
  TypeTable,
  CodeBlock,
  pre: Pre,
  Files,
  Folder,
  File,
  Banner,
  h1: (props: any) => <Heading as="h1" {...props} />,
  h2: (props: any) => <Heading as="h2" {...props} />,
  h3: (props: any) => <Heading as="h3" {...props} />,
  h4: (props: any) => <Heading as="h4" {...props} />,
};

export default defaultMdxComponents;
