'use client';
import { DynamicCodeBlock } from '@hanzo/docs/ui/components/dynamic-codeblock';
import { useState } from 'react';
import { bundledLanguages } from 'shiki';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function Example() {
  const [lang, setLang] = useState('js');
  const [code, setCode] = useState('console.log("This is pre-rendered")');

  return (
    <div className="prose flex flex-col gap-4 rounded-lg bg-fd-background p-4">
      <div className="not-prose flex flex-col gap-2 rounded-lg bg-fd-secondary text-fd-secondary-foreground p-2">
        <Select value={lang} onValueChange={setLang}>
          <SelectTrigger className="w-fit min-w-[140px] h-8 text-xs bg-transparent border-fd-border/50">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="max-h-60">
            {Object.keys(bundledLanguages).map((l) => (
              <SelectItem value={l} key={l} className="text-xs">
                {l}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="bg-transparent px-4 py-2 text-sm focus-visible:outline-none"
        />
      </div>
      <DynamicCodeBlock
        lang={lang}
        code={code}
        options={{
          themes: {
            light: 'catppuccin-latte',
            dark: 'catppuccin-mocha',
          },
        }}
      />
    </div>
  );
}
