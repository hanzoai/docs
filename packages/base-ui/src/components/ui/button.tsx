import { cva, type VariantProps } from 'class-variance-authority';

const variants = {
  primary: 'bg-fd-primary text-fd-primary-foreground hover:bg-fd-primary/80',
  outline: 'border hover:bg-fd-accent hover:text-fd-accent-foreground',
  ghost: 'hover:bg-fd-accent hover:text-fd-accent-foreground',
  secondary:
    'border bg-fd-secondary text-fd-secondary-foreground hover:bg-fd-accent hover:text-fd-accent-foreground',
  link: 'text-fd-primary underline-offset-4 hover:underline',
} as const;

export const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md p-2 text-sm font-medium transition-colors duration-100 disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fd-ring',
  {
    variants: {
      variant: variants,
      // hanzo-docs use `color` instead of `variant`
      color: variants,
      size: {
        xs: 'gap-1 px-2 py-1 text-xs',
        sm: 'gap-1 px-2 py-1.5 text-xs',
        md: 'h-9 gap-2 px-4 py-2',
        lg: 'h-10 gap-2 px-6',
        icon: 'p-1.5 [&_svg]:size-5',
        'icon-sm': 'p-1.5 [&_svg]:size-4.5',
        'icon-xs': 'p-1 [&_svg]:size-4',
      },
    },
  },
);

export type ButtonProps = VariantProps<typeof buttonVariants>;
