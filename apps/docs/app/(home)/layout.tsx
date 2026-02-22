import { HomeLayout } from '@hanzo/docs-base-ui/layouts/home';
import { baseOptions, linkItems } from '@/components/layouts/shared';
import {
  NavbarMenu,
  NavbarMenuContent,
  NavbarMenuLink,
  NavbarMenuTrigger,
} from '@hanzo/docs-base-ui/layouts/home/navbar';
import Link from '@hanzo/docs-core/link';
import {
  Cloud,
  Cpu,
  Database,
  Globe,
  Layers,
  Monitor,
  Zap,
} from 'lucide-react';
import { AuthButtons } from '@/components/auth-buttons';
import { TryHanzoDropdown } from '@/components/try-hanzo-dropdown';
import { Footer } from '@/components/footer';

export default function Layout({ children }: LayoutProps<'/'>) {
  return (
    <>
      <HomeLayout
        {...baseOptions()}
        links={[
          {
            type: 'menu',
            on: 'menu',
            text: 'Services',
            items: [
              {
                text: 'All Services',
                url: '/docs/services',
                icon: <Layers />,
              },
              {
                text: 'API Reference',
                url: '/docs/openapi',
                icon: <Globe />,
              },
            ],
          },
          {
            type: 'custom',
            on: 'nav',
            children: (
              <NavbarMenu>
                <NavbarMenuTrigger>
                  <Link href="/docs/services">Services</Link>
                </NavbarMenuTrigger>
                <NavbarMenuContent>
                  <NavbarMenuLink
                    href="/docs/services/cloud"
                    className="md:row-span-2"
                  >
                    <Cloud className="bg-[#fd4444] text-white p-1 mb-2 rounded-md" />
                    <p className="font-medium">AI &amp; Intelligence</p>
                    <p className="text-fd-muted-foreground text-sm">
                      LLM gateway, chat, search, agents, vector DB, and ML
                      pipelines.
                    </p>
                  </NavbarMenuLink>

                  <NavbarMenuLink
                    href="/docs/services/paas"
                    className="lg:col-start-2"
                  >
                    <Database className="bg-fd-primary text-fd-primary-foreground p-1 mb-2 rounded-md" />
                    <p className="font-medium">Infrastructure</p>
                    <p className="text-fd-muted-foreground text-sm">
                      PaaS, databases, storage, queues, edge functions.
                    </p>
                  </NavbarMenuLink>

                  <NavbarMenuLink
                    href="/docs/services/flow"
                    className="lg:col-start-2"
                  >
                    <Zap className="bg-fd-primary text-fd-primary-foreground p-1 mb-2 rounded-md" />
                    <p className="font-medium">Automation</p>
                    <p className="text-fd-muted-foreground text-sm">
                      Visual workflows, event-driven tasks, browser automation.
                    </p>
                  </NavbarMenuLink>

                  <NavbarMenuLink
                    href="/docs/services/iam"
                    className="lg:col-start-3 lg:row-start-1"
                  >
                    <Monitor className="bg-fd-primary text-fd-primary-foreground p-1 mb-2 rounded-md" />
                    <p className="font-medium">Platform</p>
                    <p className="text-fd-muted-foreground text-sm">
                      IAM, identity, commerce, gateway, observability.
                    </p>
                  </NavbarMenuLink>

                  <NavbarMenuLink
                    href="/docs/services/engine"
                    className="lg:col-start-3 lg:row-start-2"
                  >
                    <Cpu className="bg-fd-primary text-fd-primary-foreground p-1 mb-2 rounded-md" />
                    <p className="font-medium">Operations</p>
                    <p className="text-fd-muted-foreground text-sm">
                      Inference engine, o11y, DNS, zero-trust networking.
                    </p>
                  </NavbarMenuLink>
                </NavbarMenuContent>
              </NavbarMenu>
            ),
          },
          ...linkItems,
          {
            type: 'custom',
            on: 'nav',
            children: <TryHanzoDropdown />,
          },
          {
            type: 'custom',
            on: 'nav',
            children: <AuthButtons />,
          },
        ]}
        className="dark:bg-neutral-950 dark:[--color-fd-background:var(--color-neutral-950)] [--color-fd-primary:var(--color-brand)]"
      >
        {children}
      </HomeLayout>
      <Footer />
    </>
  );
}
