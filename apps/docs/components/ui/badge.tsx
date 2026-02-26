/**
 * Badge component from @hanzo/ui - copied locally to avoid monolithic bundle.
 * Source: https://github.com/hanzoai/react-sdk/blob/main/pkg/ui/primitives/badge.tsx
 */
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';
import { cn } from '@/lib/cn';

const badgeVariants = cva(
  'inline-flex items-center justify-center w-fit whitespace-nowrap shrink-0 rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus-visible:outline-none',
  {
    variants: {
      variant: {
        default:
          'bg-fd-primary text-fd-primary-foreground border-transparent shadow-sm',
        secondary:
          'bg-fd-secondary text-fd-secondary-foreground border-transparent',
        destructive:
          'bg-destructive text-white border-transparent shadow-sm',
        outline:
          'text-fd-foreground border-fd-input',
        ghost:
          'hover:bg-fd-accent hover:text-fd-accent-foreground border-transparent',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

function Badge({
  className,
  variant = 'default',
  asChild = false,
  ...props
}: React.ComponentProps<'span'> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : 'span';

  return (
    <Comp
      data-slot="badge"
      data-variant={variant}
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  );
}

export { Badge, badgeVariants };
