'use client';
import { Check, Share } from 'lucide-react';
import { cn } from '@/lib/cn';
import { buttonVariants } from '@hanzo/docs-base-ui/components/ui/button';
import { useCopyButton } from '@hanzo/docs-base-ui/utils/use-copy-button';

export function ShareButton({ url }: { url: string }) {
  const [isChecked, onCopy] = useCopyButton(() => {
    void navigator.clipboard.writeText(`${window.location.origin}${url}`);
  });

  return (
    <button
      type="button"
      className={cn(buttonVariants({ variant: 'primary', size: 'md', className: 'gap-2' }))}
      onClick={onCopy}
    >
      {isChecked ? <Check className="size-4" /> : <Share className="size-4" />}
      {isChecked ? 'Copied URL' : 'Share Post'}
    </button>
  );
}
