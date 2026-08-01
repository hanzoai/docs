import { HomeLayout } from '@hanzo/docs-base-ui/layouts/home';
import { baseOptions, linkItems } from '@/components/layouts/shared';
import { MeetHanzo } from '@/components/meet-hanzo';
import { HanzoPreFooterCTA } from '@hanzogui/shell';
import { Footer } from '@/components/footer';

export default function Layout({ children }: LayoutProps<'/'>) {
  return (
    <>
      <HomeLayout
        {...baseOptions()}
        themeSwitch={{ enabled: false }}
        links={[
          ...linkItems,
          {
            // NO `on`. useLinkItems routes 'nav' to the desktop rail ONLY — which is
            // max-lg:hidden and never reaches the mobile collapsible — so the home page
            // had no ecosystem menu at all below 1024px (measured at 390 and 834: zero
            // affordance). Omitting `on` puts the item in BOTH lists, which is what
            // "one affordance, every width" actually requires. The removed app launcher
            // carried the same shape and was equally invisible there, so this was never
            // a regression — just never true.
            type: 'custom',
            secondary: true,
            // NOT compact. This entry renders in the desktop rail AND in the mobile
            // collapsible — a VERTICAL list where every other row is a word, so a bare
            // glyph there is precisely the unlabeled affordance that was removed. The
            // home header has no sidebar competing for width, so the label costs it
            // nothing. `compact` exists for the docs header, which is a fixed 56px row.
            children: <MeetHanzo />,
          },
        ]}
        className="dark:bg-neutral-950 dark:[--color-fd-background:var(--color-neutral-950)]"
      >
        {children}
      </HomeLayout>
      <HanzoPreFooterCTA surface="hanzo.ai" />
      <Footer />
    </>
  );
}
