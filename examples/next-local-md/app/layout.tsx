import { RootProvider } from '@hanzo/docs-ui/provider/next';
import './global.css';
import { ZenSans } from '@hanzo/font/sans';
import { ZenMono } from '@hanzo/font/mono';
import { DevClient } from '@hanzo/docs-local-md/dev/react-client';

export default function Layout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="en" className={ZenSans.className} suppressHydrationWarning>
      <body className="flex flex-col min-h-screen">
        <RootProvider>
          <DevClient />
          {children}
        </RootProvider>
      </body>
    </html>
  );
}
