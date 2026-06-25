import { Tabs, TabsContent, TabsList, TabsTrigger } from '@hanzo/docs-base-ui/components/ui/tabs';
import { ServerCodeBlock } from '@hanzo/docs-ui/components/codeblock.rsc';

export function Installation({ name }: { name: string }) {
  const tabs = [{ name: 'Hanzo Docs CLI', value: 'hanzo-docs-cli' }];

  return (
    <div className="p-3 border rounded-xl bg-fd-card text-fd-card-foreground my-6 text-sm not-prose">
      <p className="font-medium">Install to your codebase</p>
      <p className="mt-1 mb-4 text-fd-muted-foreground">Easier customization & control.</p>

      <TabsContent value="hanzo-docs-cli">
        <ServerCodeBlock code={`npx @hanzo/docs-cli@latest add ${name}`} lang="bash" />
      </TabsContent>
    </Tabs>
  );
}
