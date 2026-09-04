import { useState } from 'react';

export function useCopyButton() {
  const [copied, setCopied] = useState(false);
  const copy = (text: string) => {
    navigator.clipboard?.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return [copied, copy] as const;
}
