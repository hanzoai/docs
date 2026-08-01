'use client';

import { PreviewCard as Primitive } from '@base-ui/react/preview-card';
import { type ComponentProps } from 'react';
import Link from '@hanzo/docs-core/link';
import { cn } from '@/utils/cn';

export const HoverCard = Primitive.Root;

export function HoverCardTrigger(props: ComponentProps<typeof Link>) {
  return <Primitive.Trigger render={<Link {...props} />} />;
}

export function HoverCardContent({
  className,
  align = 'center',
  sideOffset = 4,
  ...props
}: ComponentProps<typeof Primitive.Popup> &
  Pick<Primitive.Positioner.Props, 'sideOffset' | 'align'>) {
  return (
    <Primitive.Portal>
      <Primitive.Positioner align={align} side="bottom" sideOffset={sideOffset} className="z-50">
        <Primitive.Popup
          className={(s) =>
            cn(
              'w-72 origin-(--transform-origin) rounded-lg border bg-fd-popover p-4 text-fd-popover-foreground shadow-md focus-visible:outline-none data-[closed]:animate-fd-popover-out data-[open]:animate-fd-popover-in',
              typeof className === 'function' ? className(s) : className,
            )
          }
          {...props}
        />
      </Primitive.Positioner>
    </Primitive.Portal>
  );
}
