import { RootProvider } from '@hanzo/docs-base-ui/provider/next';
import './global.css';
import { ZenSans } from '@hanzo/font/sans';
import { ZenMono } from '@hanzo/font/mono';

export default function Layout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="en" className={ZenSans.className} suppressHydrationWarning>
      <body className="flex flex-col min-h-screen">
        <RootProvider>{children}</RootProvider>
      </body>
    </html>
  );
}
