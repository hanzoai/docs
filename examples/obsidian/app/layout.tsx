import { RootProvider } from '@hanzo/docs/ui/provider/next';
import './global.css';
import { ZenSans } from '@hanzo/font/sans';
import { ZenMono } from '@hanzo/font/mono';

export default function Layout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="en" className={ZenSans.className} suppressHydrationWarning>
      <body
        style={{
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
        }}
      >
        <RootProvider>{children}</RootProvider>
      </body>
    </html>
  );
}
