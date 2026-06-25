// @ts-nocheck
/// <reference types="vite/client" />
import { server } from '@hanzo/docs-mdx/runtime/server';
import type * as Config from '../source.config';

const create = server<typeof Config, import("@hanzo/docs-mdx/runtime/types").InternalTypeConfig & {
  DocData: {
  }
}>({"doc":{"passthroughs":["extractedReferences"]}});

export const docs = await create.docs("docs", "content/docs", import.meta.glob(["./**/*.{json,yaml}"], {
  "base": "./../content/docs",
  "query": {
    "collection": "docs"
  },
  "import": "default",
  "eager": true
}), import.meta.glob(["./**/*.{mdx,md}"], {
  "base": "./../content/docs",
  "query": {
    "collection": "docs"
  },
  "eager": true
}));