import { cva, type VariantProps } from 'class-variance-authority';
import { type ComponentProps } from 'react';
import { cn } from '@/utils/cn';

export const badgeVariants = cva(
  'inline-flex w-fit shrink-0 items-center justify-center whitespace-nowrap rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus-visible:outline-none',
  {
    variants: {
      variant: {
        primary: 'border-transparent bg-fd-primary text-fd-primary-foreground shadow-sm',
        secondary: 'border-transparent bg-fd-secondary text-fd-secondary-foreground',
        outline: 'border-fd-input text-fd-foreground',
        ghost: 'border-transparent hover:bg-fd-accent hover:text-fd-accent-foreground',
      },
    },
    defaultVariants: {
      variant: 'primary',
    },
  },
);

export type BadgeProps = ComponentProps<'span'> & VariantProps<typeof badgeVariants>;

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}
