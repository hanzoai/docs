import Link from 'next/link';
import { cn } from '@/lib/cn';
import { cva } from 'class-variance-authority';
import {
  PaletteIcon,
  SmartphoneIcon,
  ComponentIcon,
  ZapIcon,
} from 'lucide-react';

const headingVariants = cva('font-medium tracking-tight', {
  variants: {
    variant: {
      h1: 'text-4xl lg:text-5xl xl:text-6xl',
      h2: 'text-3xl lg:text-4xl',
      h3: 'text-xl lg:text-2xl',
    },
  },
});

const buttonVariants = cva(
  'inline-flex justify-center px-5 py-3 rounded-full font-medium tracking-tight transition-colors',
  {
    variants: {
      variant: {
        primary: 'bg-brand text-brand-foreground hover:bg-brand-200',
        secondary: 'border bg-fd-secondary text-fd-secondary-foreground hover:bg-fd-accent',
      },
    },
    defaultVariants: {
      variant: 'primary',
    },
  },
);

const cardVariants = cva('rounded-2xl text-sm p-6 bg-origin-border shadow-lg', {
  variants: {
    variant: {
      secondary: 'bg-brand-secondary text-brand-secondary-foreground',
      default: 'border bg-fd-card',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

const HanzoMark = ({ size = 20 }: { size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 20 20"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
    aria-label="Hanzo"
  >
    <path d="M2.5 2.5h3v6.25h9V2.5h3v15h-3V11.25h-9V17.5h-3z" />
  </svg>
);

const year = new Date().getFullYear();

export default function Page() {
  return (
    <>
      <main className="text-landing-foreground pt-4 pb-6 dark:text-landing-foreground-dark md:pb-12">
        {/* Hero */}
        <div className="relative flex min-h-[600px] h-[70vh] max-h-[900px] border rounded-2xl overflow-hidden mx-auto w-full max-w-[1400px] bg-gradient-to-br from-brand/10 via-transparent to-brand-secondary/10">
          <div className="absolute inset-0 bg-grid-pattern opacity-5" />
          <div className="flex flex-col z-2 px-4 size-full md:p-12 max-md:items-center max-md:text-center">
            <div className="flex items-center gap-2 mt-12 text-xs text-brand font-medium rounded-full p-2 border border-brand/50 w-fit">
              <HanzoMark size={14} />
              Hanzo GUI · Universal UI Framework
            </div>
            <h1 className={cn(headingVariants({ variant: 'h1' }), 'my-8 leading-tight')}>
              <span className="text-brand">One Codebase</span>,
              <br />
              Every Platform
            </h1>
            <p className="text-lg text-fd-muted-foreground max-w-2xl mb-8">
              Universal UI framework for React Native and Web. Build cross-platform
              apps with optimizing compiler, themes, tokens, and responsive styles.
            </p>
            <div className="flex flex-row items-center justify-center gap-4 flex-wrap w-fit">
              <Link href="/docs/intro/introduction" className={cn(buttonVariants(), 'max-sm:text-sm')}>
                Get Started
              </Link>
              <a
                href="https://github.com/hanzoai/gui"
                target="_blank"
                rel="noreferrer noopener"
                className={cn(buttonVariants({ variant: 'secondary' }), 'max-sm:text-sm')}
              >
                View on GitHub
              </a>
            </div>
            <div className="mt-12 w-full max-w-3xl mx-auto">
              <div className="bg-fd-card border rounded-xl overflow-hidden shadow-2xl">
                <div className="flex items-center gap-2 px-4 py-2 border-b bg-fd-muted/50">
                  <div className="flex gap-1.5">
                    <div className="size-3 rounded-full bg-red-500" />
                    <div className="size-3 rounded-full bg-yellow-500" />
                    <div className="size-3 rounded-full bg-green-500" />
                  </div>
                  <span className="text-xs text-fd-muted-foreground ml-2">App.tsx</span>
                </div>
                <pre className="p-4 text-sm overflow-x-auto font-mono"><code>{`import { Button, H1, Paragraph, YStack } from '@hanzo/gui'

export function App() {
  return (
    <YStack padding="$4" gap="$3">
      <H1>Welcome</H1>
      <Paragraph theme="alt2">
        Build once, run on Web and Native.
      </Paragraph>
      <Button theme="active" onPress={() => alert('Pressed!')}>
        Get Started
      </Button>
    </YStack>
  )
}`}</code></pre>
              </div>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 gap-10 mt-12 px-6 mx-auto w-full max-w-[1400px] md:px-12 lg:grid-cols-2">
          <p className="text-2xl tracking-tight leading-snug font-light col-span-full md:text-3xl xl:text-4xl">
            Build with <span className="text-brand font-medium">optimizing compiler</span>,{' '}
            <span className="text-brand font-medium">design tokens</span>, and{' '}
            <span className="text-brand font-medium">universal components</span>.
          </p>

          <div className={cn(cardVariants())}>
            <SmartphoneIcon className="size-8 text-brand mb-4" />
            <h3 className={cn(headingVariants({ variant: 'h3', className: 'mb-4' }))}>Cross-Platform</h3>
            <ul className="space-y-3 text-fd-muted-foreground">
              <li><span className="text-brand">React Native</span> and Web from one codebase</li>
              <li><span className="text-brand">SSR</span> with full server-side rendering support</li>
              <li><span className="text-brand">Responsive</span> styles with media queries</li>
              <li><span className="text-brand">Accessible</span> with built-in ARIA support</li>
            </ul>
          </div>

          <div className={cn(cardVariants({ variant: 'secondary' }))}>
            <PaletteIcon className="size-8 mb-4" />
            <h3 className={cn(headingVariants({ variant: 'h3', className: 'mb-4' }))}>Themes & Tokens</h3>
            <p className="mb-4">Type-safe design tokens with automatic dark mode, sub-themes, and CSS variable generation.</p>
            <pre className="bg-black/20 rounded-lg p-3 text-xs overflow-x-auto font-mono">{`const tokens = createTokens({
  size: { sm: 4, md: 8, lg: 16 },
  color: { brand: '#6366f1' },
  radius: { sm: 4, lg: 12 },
})`}</pre>
          </div>

          <div className={cn(cardVariants())}>
            <ZapIcon className="size-8 text-brand mb-4" />
            <h3 className={cn(headingVariants({ variant: 'h3', className: 'mb-4' }))}>Optimizing Compiler</h3>
            <p className="text-fd-muted-foreground mb-4">Flattens component trees and extracts styles at build time into atomic CSS on web and optimized StyleSheet.create on native.</p>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="p-3 rounded-lg border"><p className="font-medium">Flatten</p><p className="text-xs text-fd-muted-foreground">Removes nested views</p></div>
              <div className="p-3 rounded-lg border"><p className="font-medium">Extract</p><p className="text-xs text-fd-muted-foreground">Atomic CSS at build</p></div>
              <div className="p-3 rounded-lg border"><p className="font-medium">Dead Code</p><p className="text-xs text-fd-muted-foreground">Removes unused styles</p></div>
              <div className="p-3 rounded-lg border"><p className="font-medium">Partial</p><p className="text-xs text-fd-muted-foreground">Eval what it can</p></div>
            </div>
          </div>

          <div className={cn(cardVariants())}>
            <ComponentIcon className="size-8 text-brand mb-4" />
            <h3 className={cn(headingVariants({ variant: 'h3', className: 'mb-4' }))}>Rich Component Library</h3>
            <p className="text-fd-muted-foreground mb-4">50+ universal components including sheets, dialogs, popovers, forms, and more. All accessible, themeable, and animated.</p>
            <pre className="bg-fd-muted/30 rounded-lg p-3 text-xs overflow-x-auto font-mono">{`import { Sheet, Button } from '@hanzo/gui'

<Sheet modal snapPoints={[50]}>
  <Sheet.Trigger asChild>
    <Button>Open Sheet</Button>
  </Sheet.Trigger>
  <Sheet.Frame>
    <Sheet.Handle />
  </Sheet.Frame>
</Sheet>`}</pre>
          </div>

          <div className={cn(cardVariants(), 'col-span-full')}>
            <h3 className={cn(headingVariants({ variant: 'h3', className: 'mb-6' }))}>Documentation</h3>
            <div className="flex flex-wrap gap-4">
              {[
                { name: 'Getting Started', desc: 'Installation, introduction, themes', href: '/docs/intro/introduction' },
                { name: 'Core', desc: 'Styled, variants, tokens, themes', href: '/docs/core/configuration' },
                { name: 'Guides', desc: 'Next.js, Vite, Expo setup', href: '/docs/guides/next-js' },
                { name: 'Components', desc: '50+ universal components', href: '/docs/components/button' },
              ].map((s) => (
                <Link key={s.name} href={s.href} className="flex items-center gap-3 px-4 py-3 rounded-lg border hover:bg-fd-accent transition-colors">
                  <span className="font-medium">{s.name}</span>
                  <span className="text-xs text-fd-muted-foreground">{s.desc}</span>
                </Link>
              ))}
            </div>
          </div>

          <div className={cn(cardVariants(), 'col-span-full text-center py-12')}>
            <h2 className={cn(headingVariants({ variant: 'h2', className: 'mb-4' }))}>Ready to Build?</h2>
            <p className="text-fd-muted-foreground mb-8 max-w-2xl mx-auto">
              Start building universal apps with Hanzo GUI. One codebase for React Native and Web with optimizing compiler, themes, and 50+ components.
            </p>
            <div className="flex flex-row items-center justify-center gap-4">
              <Link href="/docs/intro/introduction" className={cn(buttonVariants())}>Read the Docs</Link>
              <a href="https://github.com/hanzoai/gui" target="_blank" rel="noreferrer noopener" className={cn(buttonVariants({ variant: 'secondary' }))}>GitHub</a>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t py-10 px-6 mx-auto w-full max-w-[1400px] md:px-12">
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <HanzoMark size={20} />
              <span className="font-semibold text-sm">Hanzo GUI</span>
            </div>
            <p className="text-xs text-fd-muted-foreground max-w-xs">
              Universal UI framework for React Native and Web, built by{' '}
              <a href="https://hanzo.ai" target="_blank" rel="noreferrer noopener" className="underline underline-offset-2 hover:text-fd-foreground transition-colors">Hanzo AI</a>.
            </p>
            <p className="text-xs text-fd-muted-foreground">© {year} Hanzo AI, Inc. All rights reserved.</p>
          </div>
          <div className="grid grid-cols-2 gap-8 text-sm sm:grid-cols-3">
            <div className="flex flex-col gap-2">
              <p className="font-medium text-xs uppercase tracking-wider text-fd-muted-foreground mb-1">Docs</p>
              <Link href="/docs/intro/introduction" className="text-fd-muted-foreground hover:text-fd-foreground transition-colors">Introduction</Link>
              <Link href="/docs/intro/installation" className="text-fd-muted-foreground hover:text-fd-foreground transition-colors">Installation</Link>
              <Link href="/docs/core/configuration" className="text-fd-muted-foreground hover:text-fd-foreground transition-colors">Configuration</Link>
              <Link href="/docs/components/button" className="text-fd-muted-foreground hover:text-fd-foreground transition-colors">Components</Link>
            </div>
            <div className="flex flex-col gap-2">
              <p className="font-medium text-xs uppercase tracking-wider text-fd-muted-foreground mb-1">Guides</p>
              <Link href="/docs/guides/next-js" className="text-fd-muted-foreground hover:text-fd-foreground transition-colors">Next.js</Link>
              <Link href="/docs/guides/expo" className="text-fd-muted-foreground hover:text-fd-foreground transition-colors">Expo</Link>
              <Link href="/docs/guides/vite" className="text-fd-muted-foreground hover:text-fd-foreground transition-colors">Vite</Link>
              <Link href="/docs/guides/metro" className="text-fd-muted-foreground hover:text-fd-foreground transition-colors">Metro</Link>
            </div>
            <div className="flex flex-col gap-2">
              <p className="font-medium text-xs uppercase tracking-wider text-fd-muted-foreground mb-1">Resources</p>
              <a href="https://github.com/hanzoai/gui" target="_blank" rel="noreferrer noopener" className="text-fd-muted-foreground hover:text-fd-foreground transition-colors">GitHub</a>
              <a href="https://www.npmjs.com/package/@hanzo/gui" target="_blank" rel="noreferrer noopener" className="text-fd-muted-foreground hover:text-fd-foreground transition-colors">npm</a>
              <a href="https://hanzo.ai" target="_blank" rel="noreferrer noopener" className="text-fd-muted-foreground hover:text-fd-foreground transition-colors">Hanzo AI</a>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
