import Link from 'next/link';
import { cn } from '@/lib/cn';
import { cva } from 'class-variance-authority';
import {
  LayoutIcon,
  PaletteIcon,
  SmartphoneIcon,
  MonitorIcon,
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

export default function Page() {
  return (
    <main className="text-landing-foreground pt-4 pb-6 dark:text-landing-foreground-dark md:pb-12">
      {/* Hero Section */}
      <div className="relative flex min-h-[600px] h-[70vh] max-h-[900px] border rounded-2xl overflow-hidden mx-auto w-full max-w-[1400px] bg-gradient-to-br from-brand/10 via-transparent to-brand-secondary/10">
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
        <div className="flex flex-col z-2 px-4 size-full md:p-12 max-md:items-center max-md:text-center">
          <div className="flex items-center gap-2 mt-12 text-xs text-brand font-medium rounded-full p-2 border border-brand/50 w-fit">
            <LayoutIcon className="size-4" />
            Universal UI Framework
          </div>
          <h1 className={cn(headingVariants({ variant: 'h1' }), 'my-8 leading-tight')}>
            <span className="text-brand">Hanzo GUI</span> — One Codebase,
            <br />
            Every Platform
          </h1>
          <p className="text-lg text-fd-muted-foreground max-w-2xl mb-8">
            Universal UI framework for React Native and Web. Build cross-platform
            apps with optimizing compiler, themes, tokens, and responsive styles.
          </p>
          <div className="flex flex-row items-center justify-center gap-4 flex-wrap w-fit">
            <Link href="/docs" className={cn(buttonVariants(), 'max-sm:text-sm')}>
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

          {/* Code Preview */}
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
              <pre className="p-4 text-sm overflow-x-auto font-mono">
                <code>{`import { Button, H1, Paragraph, YStack } from '@hanzo/gui'

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
}`}</code>
              </pre>
            </div>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 gap-10 mt-12 px-6 mx-auto w-full max-w-[1400px] md:px-12 lg:grid-cols-2">
        <p className="text-2xl tracking-tight leading-snug font-light col-span-full md:text-3xl xl:text-4xl">
          Build with <span className="text-brand font-medium">optimizing compiler</span>,{' '}
          <span className="text-brand font-medium">design tokens</span>, and{' '}
          <span className="text-brand font-medium">universal components</span>.
        </p>

        {/* Cross-Platform */}
        <div className={cn(cardVariants())}>
          <SmartphoneIcon className="size-8 text-brand mb-4" />
          <h3 className={cn(headingVariants({ variant: 'h3', className: 'mb-4' }))}>
            Cross-Platform
          </h3>
          <ul className="space-y-3 text-fd-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="text-brand">React Native</span> and Web from one codebase
            </li>
            <li className="flex items-start gap-2">
              <span className="text-brand">SSR</span> with full server-side rendering support
            </li>
            <li className="flex items-start gap-2">
              <span className="text-brand">Responsive</span> styles with media queries
            </li>
            <li className="flex items-start gap-2">
              <span className="text-brand">Accessible</span> with built-in ARIA support
            </li>
          </ul>
        </div>

        {/* Themes & Tokens */}
        <div className={cn(cardVariants({ variant: 'secondary' }))}>
          <PaletteIcon className="size-8 mb-4" />
          <h3 className={cn(headingVariants({ variant: 'h3', className: 'mb-4' }))}>
            Themes & Tokens
          </h3>
          <p className="mb-4">
            Type-safe design tokens with automatic dark mode, sub-themes,
            and CSS variable generation. Full theme nesting support.
          </p>
          <pre className="bg-black/20 rounded-lg p-3 text-xs overflow-x-auto font-mono">
{`const tokens = createTokens({
  size: { sm: 4, md: 8, lg: 16 },
  color: { brand: '#6366f1' },
  radius: { sm: 4, lg: 12 },
})`}
          </pre>
        </div>

        {/* Optimizing Compiler */}
        <div className={cn(cardVariants())}>
          <ZapIcon className="size-8 text-brand mb-4" />
          <h3 className={cn(headingVariants({ variant: 'h3', className: 'mb-4' }))}>
            Optimizing Compiler
          </h3>
          <p className="text-fd-muted-foreground mb-4">
            Flattens component trees and extracts styles at build time.
            Turns inline styles into atomic CSS on web and optimized
            StyleSheet.create on native.
          </p>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="p-3 rounded-lg border">
              <p className="font-medium">Flatten</p>
              <p className="text-xs text-fd-muted-foreground">Removes nested views</p>
            </div>
            <div className="p-3 rounded-lg border">
              <p className="font-medium">Extract</p>
              <p className="text-xs text-fd-muted-foreground">Atomic CSS at build</p>
            </div>
            <div className="p-3 rounded-lg border">
              <p className="font-medium">Dead Code</p>
              <p className="text-xs text-fd-muted-foreground">Removes unused styles</p>
            </div>
            <div className="p-3 rounded-lg border">
              <p className="font-medium">Partial</p>
              <p className="text-xs text-fd-muted-foreground">Eval what it can</p>
            </div>
          </div>
        </div>

        {/* Components */}
        <div className={cn(cardVariants())}>
          <ComponentIcon className="size-8 text-brand mb-4" />
          <h3 className={cn(headingVariants({ variant: 'h3', className: 'mb-4' }))}>
            Rich Component Library
          </h3>
          <p className="text-fd-muted-foreground mb-4">
            50+ universal components including sheets, dialogs, popovers,
            forms, lists, and more. All accessible, themeable, and animated.
          </p>
          <pre className="bg-fd-muted/30 rounded-lg p-3 text-xs overflow-x-auto font-mono">
{`import { Sheet, Button } from '@hanzo/gui'

<Sheet modal snapPoints={[50]}>
  <Sheet.Trigger asChild>
    <Button>Open Sheet</Button>
  </Sheet.Trigger>
  <Sheet.Frame>
    <Sheet.Handle />
    {/* content */}
  </Sheet.Frame>
</Sheet>`}
          </pre>
        </div>

        {/* Docs Sections */}
        <div className={cn(cardVariants(), 'col-span-full')}>
          <MonitorIcon className="size-8 text-brand mb-4" />
          <h3 className={cn(headingVariants({ variant: 'h3', className: 'mb-6' }))}>
            Documentation
          </h3>
          <div className="flex flex-wrap gap-4">
            {[
              { name: 'Introduction', desc: 'Get started with Hanzo GUI', href: '/docs/intro' },
              { name: 'Core', desc: 'Styled, variants, tokens, themes', href: '/docs/core' },
              { name: 'Guides', desc: 'Next.js, Vite, Expo setup', href: '/docs/guides' },
              { name: 'Components', desc: '50+ universal components', href: '/docs/components' },
            ].map((section) => (
              <Link
                key={section.name}
                href={section.href}
                className="flex items-center gap-3 px-4 py-3 rounded-lg border hover:bg-fd-accent transition-colors"
              >
                <span className="font-medium">{section.name}</span>
                <span className="text-xs text-fd-muted-foreground">{section.desc}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className={cn(cardVariants(), 'col-span-full text-center py-12')}>
          <h2 className={cn(headingVariants({ variant: 'h2', className: 'mb-4' }))}>
            Ready to Build?
          </h2>
          <p className="text-fd-muted-foreground mb-8 max-w-2xl mx-auto">
            Start building universal apps with Hanzo GUI. One codebase for
            React Native and Web with optimizing compiler, themes, and 50+ components.
          </p>
          <div className="flex flex-row items-center justify-center gap-4">
            <Link href="/docs" className={cn(buttonVariants())}>
              Read the Docs
            </Link>
            <a
              href="https://github.com/hanzoai/gui"
              target="_blank"
              rel="noreferrer noopener"
              className={cn(buttonVariants({ variant: 'secondary' }))}
            >
              GitHub
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
