import { Docs } from '@/components/layouts/docs';
import { HanzoPreFooterCTA } from '@hanzogui/shell';
import { Footer } from '@/components/footer';

// The landing page carries the SAME chrome as /docs — page tree, sidebar
// filter, project switcher.
//
// It sat under (home)'s HomeLayout, which has no tree and therefore no sidebar:
// a reader arriving at / saw eight domain cards and had to click one before the
// site would show them what it contains. The sidebar is the table of contents
// for ~1,600 pages, and the front door is where it is worth the most.
//
// / gets its own route group because (home) also wraps /blog, an editorial
// page with no place in the docs tree, so it keeps the marketing chrome — and
// (home) keeps its name, which reads as "the pages using HomeLayout", the
// upstream component's own vocabulary.
export default function Layout({ children }: LayoutProps<'/'>) {
  return (
    <>
      {/* No theme switch, exactly as under HomeLayout. This page paints its own
          palette in literal white-on-neutral rather than fd- tokens, so a light
          theme would leave white cards on a white background. The switch stays
          on /docs, where the tokens do the work. */}
      <Docs themeSwitch={{ enabled: false }}>{children}</Docs>
      <HanzoPreFooterCTA surface="hanzo.ai" />
      <Footer />
    </>
  );
}
