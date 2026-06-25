// @ts-nocheck
/// <reference types="vite/client" />
import { dynamic } from '@hanzo/docs-mdx/runtime/dynamic';
import * as Config from '../source.config';

const create = await dynamic<typeof Config, import("@hanzo/docs-mdx/runtime/types").InternalTypeConfig & {
  DocData: {
  }
}>(Config, {"configPath":"source.config.ts","environment":"vite","outDir":"docs"}, {"doc":{"passthroughs":["extractedReferences"]}});