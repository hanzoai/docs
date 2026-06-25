'use client';
import dynamic from 'next/dynamic';

export const DynamicCodeBlock = dynamic(() => import('./dynamic-codeblock'));
export const Banner = dynamic(() =>
  import('@hanzo/docs-base-ui/components/banner').then((res) => res.Banner),
);
export const InlineTOC = dynamic(() =>
  import('@hanzo/docs-base-ui/components/inline-toc').then((res) => res.InlineTOC),
);

export const File = dynamic(() => import('@hanzo/docs-base-ui/components/files').then((res) => res.File));
export const Files = dynamic(() => import('@hanzo/docs-base-ui/components/files').then((res) => res.Files));
export const Folder = dynamic(() =>
  import('@hanzo/docs-base-ui/components/files').then((res) => res.Folder),
);

export const ImageZoom = dynamic(() =>
  import('@hanzo/docs-base-ui/components/image-zoom').then((res) => res.ImageZoom),
);

export const GraphView = dynamic(() =>
  import('@/components/graph-view').then((res) => res.GraphView),
);
