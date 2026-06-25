import { HomeLayout } from '@hanzo/docs-base-ui/layouts/home';
import { baseOptions, linkItems } from '@/components/layouts/shared';
import { TryHanzoDropdown } from '@/components/try-hanzo-dropdown';
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
            type: 'custom',
            secondary: true,
            on: 'nav',
            children: <TryHanzoDropdown />,
          },
        ]}
        className="dark:bg-neutral-950 dark:[--color-fd-background:var(--color-neutral-950)]"
      >
        {children}
      </HomeLayout>
      <Footer />
    </>
  );
}
