'use client';

import type { ComponentProps } from 'react';
import { useDocsPage } from '..';
import { cn } from '@/utils/cn';

export function Container(props: ComponentProps<'article'>) {
  const { full } = useDocsPage();

  return (
    <article
      id="nd-page"
      data-full={full}
      {...props}
      className={cn(
        // STILL FLEX, deliberately — the rest of this layout is grid now.
        //
        // The shell gives `main` a 1fr row against a min-height of the viewport,
        // so on a short page this article is TALLER than its content, and the
        // thing that decides where the leftover goes is `flex-1` on the prose
        // body (layouts/docs/page/index.tsx) — that is what holds the footer at
        // the bottom instead of letting it ride up under the last paragraph.
        //
        // Under grid that `flex-1` is inert, and the row that should be 1fr
        // cannot be named from here: the children are whatever the CONSUMER
        // composes into DocsPage (breadcrumb, title, description, body, footer,
        // any of them absent), so there is no stable index to put the 1fr on.
        // Converting it means moving the growth contract into the public slot
        // API, which is a change to what consumers pass, not a change of layout.
        //
        // Left as it is on purpose. Do not swap the class alone.
        'flex flex-col w-full max-w-[900px] mx-auto [grid-area:main] px-4 py-6 gap-4 md:px-6 md:pt-8 xl:px-8 xl:pt-14',
        full && 'max-w-[1168px]',
        props.className,
      )}
    >
      {props.children}
    </article>
  );
}
