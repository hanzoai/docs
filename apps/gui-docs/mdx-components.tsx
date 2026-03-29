import type { MDXComponents } from 'mdx/types';
import defaultMdxComponents from '@hanzo/docs-base-ui/mdx';
import { Tab, Tabs as DocsTabs } from '@hanzo/docs-base-ui/components/tabs';
import { Callout } from '@hanzo/docs-base-ui/components/callout';
import { Step, Steps } from '@hanzo/docs-base-ui/components/steps';
import { File, Folder, Files } from '@hanzo/docs-base-ui/components/files';
import { Accordion, Accordions } from '@hanzo/docs-base-ui/components/accordion';
import type { ReactNode } from 'react';

function Notice({ children, theme }: { children: ReactNode; theme?: string }) {
  const colors: Record<string, string> = {
    blue: 'border-blue-500/30 bg-blue-500/5',
    green: 'border-green-500/30 bg-green-500/5',
    yellow: 'border-yellow-500/30 bg-yellow-500/5',
  };
  return (
    <div className={`my-4 rounded-lg border p-4 text-sm text-fd-muted-foreground ${colors[theme ?? ''] ?? 'bg-fd-card'}`}>
      {children}
    </div>
  );
}

function HeroContainer({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-xl border bg-fd-card p-6">
      {children}
    </div>
  );
}

function Preview({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-xl border bg-fd-background p-6 flex items-center justify-center min-h-[200px]">
      {children}
    </div>
  );
}

function PropsTable({ data }: { data: any[] }) {
  if (!data || !Array.isArray(data)) return null;
  return (
    <div className="my-6 overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b text-left">
            <th className="pb-2 pr-4 font-medium">Prop</th>
            <th className="pb-2 pr-4 font-medium">Type</th>
            <th className="pb-2 pr-4 font-medium">Default</th>
            <th className="pb-2 font-medium">Required</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row: any, i: number) => (
            <tr key={i} className="border-b border-fd-border">
              <td className="py-2 pr-4 font-mono text-xs">{row.name}</td>
              <td className="py-2 pr-4 font-mono text-xs text-fd-muted-foreground">{row.type}</td>
              <td className="py-2 pr-4 font-mono text-xs text-fd-muted-foreground">{row.default ?? '-'}</td>
              <td className="py-2 text-xs">{row.required ? '✓' : '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// Passthrough wrapper for GUI component names used in code examples within MDX
function Passthrough({ children }: { children?: ReactNode }) {
  return <>{children}</>;
}

// Compound Tabs component supporting both docs <Tabs>/<Tab> and old Tabs.Content/Tabs.List/Tabs.Tab patterns
const CompoundTabs = Object.assign(
  (props: any) => <DocsTabs {...props} />,
  {
    Content: Passthrough,
    List: Passthrough,
    Tab: Passthrough,
  }
);

export function getMDXComponents(components?: MDXComponents): MDXComponents {
  return {
    ...defaultMdxComponents,
    Tab,
    Tabs: CompoundTabs,
    Callout,
    Step,
    Steps,
    File,
    Folder,
    Files,
    Accordion,
    Accordions,
    Notice,
    HeroContainer,
    Preview,
    PropsTable,
    // GUI component names that appear in JSX examples within MDX prose
    // These are documentation references, not live components
    View: Passthrough,
    Text: Passthrough,
    Button: Passthrough,
    YStack: Passthrough,
    XStack: Passthrough,
    XGroup: Passthrough,
    YGroup: Passthrough,
    ZStack: Passthrough,
    Square: Passthrough,
    Input: Passthrough,
    Theme: Passthrough,
    GuiProvider: Passthrough,
    Dialog: Passthrough,
    Sheet: Passthrough,
    Select: Passthrough,
    Popover: Passthrough,
    Menu: Passthrough,
    ContextMenu: Passthrough,
    RovingFocusGroup: Passthrough,
    Toast: Passthrough,
    ToastViewport: Passthrough,
    Tooltip: Passthrough,
    TooltipSimple: Passthrough,
    AlertDialog: Passthrough,
    ListItem: Passthrough,
    Switch: Passthrough,
    Slider: Passthrough,
    Spinner: Passthrough,
    Checkbox: Passthrough,
    RadioGroup: Passthrough,
    ToggleGroup: Passthrough,
    Separator: Passthrough,
    Label: Passthrough,
    Image: Passthrough,
    Card: Passthrough,
    Avatar: Passthrough,
    ScrollView: Passthrough,
    LinearGradient: Passthrough,
    Form: Passthrough,
    FocusScope: Passthrough,
    Anchor: Passthrough,
    VisuallyHidden: Passthrough,
    Progress: Passthrough,
    Group: Passthrough,
    Portal: Passthrough,
    Adapt: Passthrough,
    AnimatePresence: Passthrough,
    Spacer: Passthrough,
    Configuration: Passthrough,
    Grid: Passthrough,
    Item: Passthrough,
    Features: Passthrough,
    InlineTabs: Object.assign(Passthrough, { Content: Passthrough, List: Passthrough, Tab: Passthrough }),
    TabsProvider: Passthrough,
    Heading: Passthrough,
    H: Passthrough,
    Paragraph: Passthrough,
    SizableText: Passthrough,
    Slot: Passthrough,
    Unspaced: Passthrough,
    Em: Passthrough,
    Strong: Passthrough,
    Circle: Passthrough,
    Stack: Passthrough,
    TextArea: Passthrough,
    Check: Passthrough,
    FontLanguage: Passthrough,
    Comp: Passthrough,
    Box: Passthrough,
    DemoButton: Passthrough,
    Blog: Object.assign(Passthrough, {
      ThemeBuilder: Object.assign(Passthrough, { ExamplePalette: Passthrough }),
    }),
    TableCell: Passthrough,
    TableCol: Passthrough,
    // Demo/chart components used in docs prose (render as passthrough)
    IntroParagraph: Passthrough,
    LogoCard: Passthrough,
    BenchmarkChart: Passthrough,
    BenchmarkChartNative: Passthrough,
    BenchmarkChartWeb: Passthrough,
    GuiExamplesCode: Passthrough,
    TokensDemo: Passthrough,
    ColorsDemo: Passthrough,
    SimpleTable: Passthrough,
    Table: Passthrough,
    Code: (props: any) => <code {...props} />,
    ...components,
  };
}
