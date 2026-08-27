'use client';

import { Select as Primitive } from '@base-ui/react/select';
import { Separator } from '@base-ui/react/separator';
import { Check, ChevronDown, ChevronUp } from 'lucide-react';
import { type ComponentProps } from 'react';
import { cn } from '@/utils/cn';

export const Select = Primitive.Root;

export const SelectGroup = Primitive.Group;

export const SelectValue = Primitive.Value;

export function SelectTrigger({
  className,
  children,
  ...props
}: ComponentProps<typeof Primitive.Trigger>) {
  return (
    <Primitive.Trigger
      className={(s) =>
        cn(
          'flex h-9 w-full items-center justify-between gap-2 rounded-lg border border-fd-border bg-fd-background px-3 py-2 text-sm text-fd-foreground transition-colors hover:border-fd-ring hover:bg-fd-accent/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fd-ring/40 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:truncate',
          typeof className === 'function' ? className(s) : className,
        )
      }
      {...props}
    >
      {children}
      <Primitive.Icon>
        <ChevronDown className="size-3.5 shrink-0 text-fd-muted-foreground" />
      </Primitive.Icon>
    </Primitive.Trigger>
  );
}

const arrowVariants = 'flex cursor-default items-center justify-center py-1';

export function SelectContent({
  className,
  children,
  ...props
}: ComponentProps<typeof Primitive.Popup>) {
  return (
    <Primitive.Portal>
      <Primitive.Positioner className="z-50" sideOffset={4}>
        <Primitive.Popup
          className={(s) =>
            cn(
              'max-h-72 min-w-[8rem] origin-(--transform-origin) overflow-hidden rounded-lg border border-fd-border bg-fd-popover text-fd-popover-foreground shadow-lg focus-visible:outline-none data-[closed]:animate-fd-popover-out data-[open]:animate-fd-popover-in',
              typeof className === 'function' ? className(s) : className,
            )
          }
          {...props}
        >
          <Primitive.ScrollUpArrow className={arrowVariants}>
            <ChevronUp className="size-3.5 text-fd-muted-foreground" />
          </Primitive.ScrollUpArrow>
          <Primitive.List className="p-1">{children}</Primitive.List>
          <Primitive.ScrollDownArrow className={arrowVariants}>
            <ChevronDown className="size-3.5 text-fd-muted-foreground" />
          </Primitive.ScrollDownArrow>
        </Primitive.Popup>
      </Primitive.Positioner>
    </Primitive.Portal>
  );
}

export function SelectLabel({
  className,
  ...props
}: ComponentProps<typeof Primitive.GroupLabel>) {
  return (
    <Primitive.GroupLabel
      className={(s) =>
        cn(
          'px-2 py-1.5 text-xs font-semibold uppercase tracking-wider text-fd-muted-foreground',
          typeof className === 'function' ? className(s) : className,
        )
      }
      {...props}
    />
  );
}

export function SelectItem({
  className,
  children,
  ...props
}: ComponentProps<typeof Primitive.Item>) {
  return (
    <Primitive.Item
      className={(s) =>
        cn(
          'relative flex w-full cursor-pointer select-none items-center rounded-md py-2 pl-2.5 pr-8 text-sm text-fd-muted-foreground transition-colors focus-visible:outline-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 data-[highlighted]:bg-fd-accent data-[highlighted]:text-fd-accent-foreground',
          typeof className === 'function' ? className(s) : className,
        )
      }
      {...props}
    >
      <Primitive.ItemIndicator className="absolute right-2 flex size-3.5 items-center justify-center">
        <Check className="size-3.5" />
      </Primitive.ItemIndicator>
      <Primitive.ItemText>{children}</Primitive.ItemText>
    </Primitive.Item>
  );
}

export function SelectSeparator({ className, ...props }: ComponentProps<typeof Separator>) {
  return (
    <Separator
      className={(state) =>
        cn(
          'mx-1 my-1 h-px bg-fd-border',
          typeof className === 'function' ? className(state) : className,
        )
      }
      {...props}
    />
  );
}
