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
      {/* `dark` on the route, because this page paints its own palette in
          literal white-on-neutral rather than fd- tokens and only reads on a
          dark ground. Hiding the theme switch does not make it dark: the class
          is stored globally, so a reader who chose light on /docs and clicked
          the wordmark arrived at a 72px white headline on a white page. `.dark`
          is a plain class selector, so nesting it redefines the tokens for
          everything below — chrome included, which is why it sits here and not
          on the page's own <main>. */}
      {/* The rail starts collapsed HERE only. The tree is still one click away
          via the sidebar trigger, but the front door leads with the page, not
          with 12 rows of nav — a reader who typed the domain has not yet asked
          for the table of contents. /docs/** keeps it open, where they have. */}
      <div className="dark bg-fd-background text-fd-foreground">
        <Docs themeSwitch={{ enabled: false }} sidebar={{ defaultCollapsed: true }}>
          {children}
        </Docs>
      </div>
      <HanzoPreFooterCTA surface="hanzo.ai" />
      <Footer />
    </>
  );
}
