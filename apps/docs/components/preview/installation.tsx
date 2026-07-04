import { ServerCodeBlock } from '@hanzo/docs-ui/components/codeblock.rsc';

export function Installation({ name }: { name: string }) {
  return (
    <div className="p-3 border rounded-xl bg-fd-card text-fd-card-foreground my-6 text-sm not-prose">
      <p className="font-medium">Install to your codebase</p>
      <p className="mt-1 mb-4 text-fd-muted-foreground">Easier customization &amp; control.</p>

      <ServerCodeBlock code={`npx @hanzo/docs-cli@latest add ${name}`} lang="bash" />
    </div>
  );
}
