import { RootProvider } from '@hanzo/docs/ui/provider/next';
import './global.css';
import { Zen } from '@hanzo/font';

export default function Layout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="en" className={Zen.className} suppressHydrationWarning>
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
