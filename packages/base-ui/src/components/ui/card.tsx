import { type ComponentProps } from 'react';
import { cn } from '@/utils/cn';

export function Card({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      className={cn(
        'flex flex-col gap-6 rounded-xl border bg-fd-card py-6 text-fd-card-foreground shadow-sm',
        className,
      )}
      {...props}
    />
  );
}

export function CardHeader({ className, ...props }: ComponentProps<'div'>) {
  return <div className={cn('flex flex-col gap-2 px-6', className)} {...props} />;
}

export function CardTitle({ className, ...props }: ComponentProps<'div'>) {
  return <div className={cn('font-semibold leading-none', className)} {...props} />;
}

export function CardDescription({ className, ...props }: ComponentProps<'div'>) {
  return <div className={cn('text-sm text-fd-muted-foreground', className)} {...props} />;
}

export function CardContent({ className, ...props }: ComponentProps<'div'>) {
  return <div className={cn('px-6', className)} {...props} />;
}

export function CardFooter({ className, ...props }: ComponentProps<'div'>) {
  return <div className={cn('flex items-center px-6', className)} {...props} />;
}
