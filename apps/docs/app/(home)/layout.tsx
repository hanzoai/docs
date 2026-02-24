import { HomeLayout } from '@hanzo/docs-base-ui/layouts/home';
import { baseOptions, linkItems } from '@/components/layouts/shared';
import { AuthButtons } from '@/components/auth-buttons';
import { TryHanzoDropdown } from '@/components/try-hanzo-dropdown';
import { Footer } from '@/components/footer';

export default function Layout({ children }: LayoutProps<'/'>) {
  return (
    <>
      <HomeLayout
        {...baseOptions()}
        links={[
          ...linkItems,
          {
            type: 'custom',
            on: 'nav',
            children: (
              <div className="flex items-center gap-3">
                <TryHanzoDropdown />
                <AuthButtons />
              </div>
            ),
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
