import { Zen } from '@hanzo/font';
import { RootProvider } from '@hanzo/docs-base-ui/provider/next';
import './global.css';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={Zen.className} suppressHydrationWarning>
      <body className="flex flex-col min-h-screen">
        <RootProvider>{children}</RootProvider>
      </body>
    </html>
  );
}
