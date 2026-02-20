import defaultMdxComponents from '@hanzo/docs/ui/mdx';
import { Files, File, Folder } from '@hanzo/docs/ui/components/files';
import { Tabs, Tab, TabsContent, TabsList, TabsTrigger } from '@hanzo/docs/ui/components/tabs';
import type { MDXComponents } from 'mdx/types';
import { Accordion, Accordions } from '@hanzo/docs/ui/components/accordion';
import * as icons from 'lucide-react';
import type { ReactNode } from 'react';

// Passthrough for undefined MDX components from upstream docs
// (Mintlify, Docusaurus, GitBook, etc. use <Note>, <Warning>, <Tip>,
// <CodeGroup>, <Steps>, <Step>, <Frame>, <ParamField>, etc.)
function Passthrough({ children }: { children?: ReactNode }) {
  return <>{children}</>;
}

const proxyHandler: ProxyHandler<MDXComponents> = {
  get(target, prop, receiver) {
    if (typeof prop === 'symbol') {
      return Reflect.get(target, prop, receiver);
    }
    if (prop in target) {
      return Reflect.get(target, prop, receiver);
    }
    // Unknown component name -- render children through instead of crashing
    return Passthrough;
  },
};

export function getMDXComponents(components?: MDXComponents): MDXComponents {
  const merged: MDXComponents = {
    ...(icons as unknown as MDXComponents),
    ...defaultMdxComponents,
    Tabs,
    Tab,
    TabsContent,
    TabsList,
    TabsTrigger,
    Files,
    File,
    Folder,
    Accordion,
    Accordions,
    ...components,
  };
  return new Proxy(merged, proxyHandler);
}

declare module 'mdx/types.js' {
  // Augment the MDX types to make it understand React.
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    type Element = React.JSX.Element;
    type ElementClass = React.JSX.ElementClass;
    type ElementType = React.JSX.ElementType;
    type IntrinsicElements = React.JSX.IntrinsicElements;
  }
}

declare global {
  type MDXProvidedComponents = ReturnType<typeof getMDXComponents>;
}
