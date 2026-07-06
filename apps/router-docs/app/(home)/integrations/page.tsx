import Link from 'next/link';
import {
  MessageSquareIcon, HashIcon, GlobeIcon, UsersIcon,
  BotIcon, BrainCircuitIcon, ZapIcon, MessageCircleIcon,
  StickyNoteIcon, CheckSquareIcon, ListTodoIcon,
  PenToolIcon, MusicIcon, BedIcon,
  MonitorSmartphoneIcon, MicIcon, ClockIcon, WebhookIcon,
  CloudSunIcon, ImageIcon, SearchIcon, EyeIcon, CameraIcon,
  MailIcon, ShoppingCartIcon, PrinterIcon, HeartIcon,
  UtensilsCrossedIcon, SmartphoneIcon,
} from 'lucide-react';
import automationsData from '@/data/automations.json';
import type { ReactNode } from 'react';

interface Integration {
  name: string;
  icon: ReactNode;
  color: string;
  desc: string;
  docs: string;
}

function IntegrationCard({ item }: { item: Integration }) {
  return (
    <a
      href={item.docs}
      target="_blank"
      rel="noopener noreferrer"
      className="flex flex-col items-center text-center p-6 rounded-2xl border border-fd-border bg-[rgba(10,15,26,0.6)] backdrop-blur-sm no-underline text-fd-foreground transition-all hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(255,77,77,0.2)]"
      style={{ '--accent': item.color } as React.CSSProperties}
    >
      <span className="flex items-center justify-center mb-3 drop-shadow-md" style={{ color: item.color }}>
        {item.icon}
      </span>
      <h3 className="text-sm font-semibold mb-1.5">{item.name}</h3>
      <p className="text-xs text-fd-muted-foreground leading-snug">{item.desc}</p>
    </a>
  );
}

function Section({ title, desc, children, className }: { title: string; desc: string; children: ReactNode; className?: string }) {
  return (
    <section className="mb-14">
      <h2 className="text-xl font-semibold flex items-center gap-2.5 mb-2">
        <span className="text-brand font-bold">&#x27E9;</span> {title}
      </h2>
      <p className="text-sm text-fd-muted-foreground mb-5 leading-relaxed">{desc}</p>
      <div className={className || 'grid grid-cols-2 sm:grid-cols-4 gap-4'}>
        {children}
      </div>
    </section>
  );
}

const I = (size = 32) => ({ className: `w-[${size}px] h-[${size}px]` });

const chatProviders: Integration[] = [
  { name: 'WhatsApp', icon: <MessageSquareIcon {...I()} />, color: '#25D366', desc: 'QR pairing via Baileys', docs: 'https://skills.hanzo.bot/skills/wacli' },
  { name: 'Telegram', icon: <SmartphoneIcon {...I()} />, color: '#26A5E4', desc: 'Bot API via grammY', docs: 'https://github.com/hanzoai/bot' },
  { name: 'Discord', icon: <MessageSquareIcon {...I()} />, color: '#5865F2', desc: 'Servers, channels & DMs', docs: 'https://skills.hanzo.bot/skills/discord' },
  { name: 'Slack', icon: <HashIcon {...I()} />, color: '#E01E5A', desc: 'Workspace apps via Bolt', docs: 'https://skills.hanzo.bot/skills/slack' },
  { name: 'Signal', icon: <MessageSquareIcon {...I()} />, color: '#3A76F0', desc: 'Privacy-focused via signal-cli', docs: 'https://skills.hanzo.bot/skills/sag' },
  { name: 'iMessage', icon: <SmartphoneIcon {...I()} />, color: '#007AFF', desc: 'AppleScript bridge', docs: 'https://github.com/hanzoai/bot' },
  { name: 'Teams', icon: <UsersIcon {...I()} />, color: '#6264A7', desc: 'Enterprise support', docs: 'https://github.com/hanzoai/bot' },
  { name: 'Matrix', icon: <GlobeIcon {...I()} />, color: '#FFFFFF', desc: 'Matrix protocol', docs: 'https://github.com/hanzoai/bot' },
  { name: 'Nostr', icon: <MessageCircleIcon {...I()} />, color: '#8F2CFF', desc: 'Decentralized DMs', docs: 'https://github.com/hanzoai/bot' },
  { name: 'WebChat', icon: <GlobeIcon {...I()} />, color: '#00E5CC', desc: 'Browser-based UI', docs: 'https://github.com/hanzoai/bot' },
];

const modelProviders: Integration[] = [
  { name: 'Anthropic', icon: <BrainCircuitIcon {...I()} />, color: '#D4A574', desc: 'Claude Opus 4.6', docs: 'https://github.com/hanzoai/bot' },
  { name: 'OpenAI', icon: <BotIcon {...I()} />, color: '#00A67E', desc: 'GPT-5, o3, o4-mini', docs: 'https://github.com/hanzoai/bot' },
  { name: 'Google', icon: <GlobeIcon {...I()} />, color: '#4285F4', desc: 'Gemini 3 Pro/Flash', docs: 'https://github.com/hanzoai/bot' },
  { name: 'xAI', icon: <ZapIcon {...I()} />, color: '#FFFFFF', desc: 'Grok 3 & 4', docs: 'https://github.com/hanzoai/bot' },
  { name: 'OpenRouter', icon: <ZapIcon {...I()} />, color: '#6366F1', desc: 'Unified API gateway', docs: 'https://github.com/hanzoai/bot' },
  { name: 'Mistral', icon: <BrainCircuitIcon {...I()} />, color: '#FF7000', desc: 'Mistral Large & Codestral', docs: 'https://github.com/hanzoai/bot' },
  { name: 'DeepSeek', icon: <BrainCircuitIcon {...I()} />, color: '#4D6BFE', desc: 'DeepSeek V3 & R1', docs: 'https://github.com/hanzoai/bot' },
  { name: 'Perplexity', icon: <SearchIcon {...I()} />, color: '#20B8CD', desc: 'Search-augmented AI', docs: 'https://github.com/hanzoai/bot' },
  { name: 'Hugging Face', icon: <BotIcon {...I()} />, color: '#FFD21E', desc: 'Open-source models', docs: 'https://github.com/hanzoai/bot' },
  { name: 'Local Models', icon: <BotIcon {...I()} />, color: '#FFFFFF', desc: 'Ollama, LM Studio', docs: 'https://github.com/hanzoai/bot' },
];

const productivityApps: Integration[] = [
  { name: 'Apple Notes', icon: <StickyNoteIcon {...I()} />, color: '#FFCC00', desc: 'Native macOS/iOS notes', docs: 'https://skills.hanzo.bot/skills/apple-notes' },
  { name: 'Apple Reminders', icon: <CheckSquareIcon {...I()} />, color: '#FF9500', desc: 'Task management', docs: 'https://skills.hanzo.bot/skills/apple-reminders' },
  { name: 'Things 3', icon: <ListTodoIcon {...I()} />, color: '#4A90D9', desc: 'GTD task manager', docs: 'https://skills.hanzo.bot/skills/things-mac' },
  { name: 'Notion', icon: <StickyNoteIcon {...I()} />, color: '#FFFFFF', desc: 'Workspace & databases', docs: 'https://skills.hanzo.bot/skills' },
  { name: 'Obsidian', icon: <PenToolIcon {...I()} />, color: '#7C3AED', desc: 'Knowledge graph notes', docs: 'https://skills.hanzo.bot/skills/obsidian' },
  { name: 'Trello', icon: <ListTodoIcon {...I()} />, color: '#0079BF', desc: 'Kanban boards', docs: 'https://skills.hanzo.bot/skills/trello' },
  { name: 'GitHub', icon: <GlobeIcon {...I()} />, color: '#FFFFFF', desc: 'Code, issues, PRs', docs: 'https://skills.hanzo.bot/skills' },
];

const musicAudio: Integration[] = [
  { name: 'Spotify', icon: <MusicIcon {...I()} />, color: '#1DB954', desc: 'Music playback control', docs: 'https://skills.hanzo.bot/skills/spotify-player' },
  { name: 'Sonos', icon: <MusicIcon {...I()} />, color: '#FFFFFF', desc: 'Multi-room audio', docs: 'https://skills.hanzo.bot/skills/sonoscli' },
  { name: 'Shazam', icon: <SearchIcon {...I()} />, color: '#0088FF', desc: 'Song recognition', docs: 'https://skills.hanzo.bot/skills/songsee' },
];

const smartHome: Integration[] = [
  { name: 'Philips Hue', icon: <ZapIcon {...I()} />, color: '#0065D3', desc: 'Smart lighting', docs: 'https://skills.hanzo.bot/skills/openhue' },
  { name: '8Sleep', icon: <BedIcon {...I()} />, color: '#00B4D8', desc: 'Smart mattress', docs: 'https://skills.hanzo.bot/skills/eightctl' },
  { name: 'Home Assistant', icon: <GlobeIcon {...I()} />, color: '#41BDF5', desc: 'Home automation hub', docs: 'https://skills.hanzo.bot/skills/homeassistant' },
];

const tools: Integration[] = [
  { name: 'Browser', icon: <GlobeIcon {...I()} />, color: '#4285F4', desc: 'Chrome/Chromium control', docs: 'https://skills.hanzo.bot/skills/verify-on-browser' },
  { name: 'Canvas', icon: <MonitorSmartphoneIcon {...I()} />, color: '#FF4500', desc: 'Visual workspace + A2UI', docs: 'https://github.com/hanzoai/bot' },
  { name: 'Voice', icon: <MicIcon {...I()} />, color: '#9B59B6', desc: 'Voice Wake + Talk Mode', docs: 'https://skills.hanzo.bot/skills/voice-transcribe' },
  { name: 'Gmail', icon: <MailIcon {...I()} />, color: '#EA4335', desc: 'Pub/Sub email triggers', docs: 'https://github.com/hanzoai/bot' },
  { name: 'Cron', icon: <ClockIcon {...I()} />, color: '#F39C12', desc: 'Scheduled tasks', docs: 'https://github.com/hanzoai/bot' },
  { name: 'Webhooks', icon: <WebhookIcon {...I()} />, color: '#1ABC9C', desc: 'External triggers', docs: 'https://github.com/hanzoai/bot' },
  { name: 'Weather', icon: <CloudSunIcon {...I()} />, color: '#FFB300', desc: 'Forecasts & conditions', docs: 'https://skills.hanzo.bot/skills/weather' },
];

const mediaCreative: Integration[] = [
  { name: 'Image Gen', icon: <ImageIcon {...I()} />, color: '#E91E63', desc: 'AI image generation', docs: 'https://skills.hanzo.bot/skills' },
  { name: 'GIF Search', icon: <SearchIcon {...I()} />, color: '#00DCDC', desc: 'Find the perfect GIF', docs: 'https://skills.hanzo.bot/skills/gifgrep' },
  { name: 'Peekaboo', icon: <EyeIcon {...I()} />, color: '#FF6B6B', desc: 'Screen capture & control', docs: 'https://skills.hanzo.bot/skills/peekaboo' },
  { name: 'Camera', icon: <CameraIcon {...I()} />, color: '#607D8B', desc: 'Photo/video capture', docs: 'https://skills.hanzo.bot/skills' },
];

const socialComms: Integration[] = [
  { name: 'Twitter/X', icon: <GlobeIcon {...I()} />, color: '#FFFFFF', desc: 'Tweet, reply, search', docs: 'https://skills.hanzo.bot/skills/bird' },
  { name: 'Email', icon: <MailIcon {...I()} />, color: '#D44638', desc: 'Send & read emails', docs: 'https://skills.hanzo.bot/skills/himalaya' },
];

const showcase: Integration[] = [
  { name: 'Tesco Autopilot', icon: <ShoppingCartIcon {...I()} />, color: '#00539F', desc: 'Automated grocery shopping', docs: 'https://github.com/hanzoai/bot' },
  { name: 'Bambu Control', icon: <PrinterIcon {...I()} />, color: '#00AE42', desc: '3D printer management', docs: 'https://github.com/hanzoai/bot' },
  { name: 'Oura Ring', icon: <HeartIcon {...I()} />, color: '#E4B363', desc: 'Health data insights', docs: 'https://github.com/hanzoai/bot' },
  { name: 'Food Ordering', icon: <UtensilsCrossedIcon {...I()} />, color: '#FF5A5F', desc: 'Foodora integration', docs: 'https://github.com/hanzoai/bot' },
];

const popularIntegrations = [
  'Slack', 'HubSpot', 'Google Sheets', 'GitHub', 'Shopify', 'Stripe', 'Jira Cloud',
  'Microsoft Excel 365', 'Notion', 'Mailchimp', 'Salesforce', 'Zendesk',
  'Airtable', 'Twilio', 'Discord', 'OpenAI', 'Google Drive',
];

export const metadata = {
  title: 'Integrations — Hanzo Bot',
};

export default function IntegrationsPage() {
  const autoCategories = automationsData.categories
    .filter((c: any) => c.id !== 'OTHER' && c.id !== 'CORE' && c.id !== 'FLOW_CONTROL' && c.id !== 'UNIVERSAL_AI')
    .slice(0, 14);

  return (
    <main className="relative z-[1] max-w-[1000px] mx-auto px-6 py-10">
      <div className="stars" />
      <div className="nebula" />

      <header className="text-center mb-12 animate-[fadeInUp_0.6s_ease-out]">
        <h1 className="text-3xl sm:text-4xl font-bold mb-4 bg-gradient-to-br from-fd-foreground via-brand to-[#00e5cc] bg-[length:200%_200%] bg-clip-text text-transparent">
          Integrations
        </h1>
        <p className="text-lg text-fd-muted-foreground max-w-[600px] mx-auto leading-relaxed">
          600+ integrations with the apps and services you already use.
          <br />
          Chat from your phone, control from your desktop, automate everything.
        </p>
      </header>

      <Section title="Chat Providers" desc="Message your bot from any chat app — it responds right where you are.">
        {chatProviders.map((p) => <IntegrationCard key={p.name + p.desc} item={p} />)}
      </Section>

      <Section title="AI Models" desc="Use any model you want — cloud or local. Your keys, your choice.">
        {modelProviders.map((p) => <IntegrationCard key={p.name} item={p} />)}
      </Section>

      <Section title="Productivity" desc="Notes, tasks, wikis, and code — your bot works with your favorite tools.">
        {productivityApps.map((p) => <IntegrationCard key={p.name} item={p} />)}
      </Section>

      <Section title="Music & Audio" desc="Control playback, identify songs, and manage multi-room audio." className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {musicAudio.map((p) => <IntegrationCard key={p.name} item={p} />)}
      </Section>

      <Section title="Smart Home" desc="Lights, thermostats, and IoT devices — all voice-controllable." className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {smartHome.map((p) => <IntegrationCard key={p.name} item={p} />)}
      </Section>

      <Section title="Tools & Automation" desc="Browser control, scheduled tasks, email triggers, and more.">
        {tools.map((p) => <IntegrationCard key={p.name} item={p} />)}
      </Section>

      <Section title="Media & Creative" desc="Generate images, capture screens, and find the perfect GIF.">
        {mediaCreative.map((p) => <IntegrationCard key={p.name} item={p} />)}
      </Section>

      <Section title="Social" desc="Post tweets, manage email, and stay connected." className="grid grid-cols-2 max-w-[500px] gap-4">
        {socialComms.map((p) => <IntegrationCard key={p.name} item={p} />)}
      </Section>

      <Section title="Community Showcase" desc="Impressive integrations built by the community.">
        {showcase.map((p) => <IntegrationCard key={p.name} item={p} />)}
      </Section>

      {/* Automation Platform */}
      <section className="mb-14">
        <h2 className="text-xl font-semibold flex items-center gap-2.5 mb-2">
          <span className="text-brand font-bold">&#x27E9;</span> Automation Platform
        </h2>
        <p className="text-sm text-fd-muted-foreground mb-5 leading-relaxed">
          {automationsData.total} automation integrations powered by <strong>Hanzo Auto</strong> — connect any service, trigger any workflow, automate anything.
        </p>
        <div className="grid grid-cols-[repeat(auto-fill,minmax(140px,1fr))] gap-3 mb-6">
          {autoCategories.map((cat: any) => (
            <div key={cat.id} className="flex flex-col items-center gap-1 p-4 rounded-xl border border-fd-border bg-[rgba(10,15,26,0.6)] backdrop-blur-sm transition-all hover:border-[#00e5cc] hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(0,229,204,0.12)]">
              <span className="text-xl font-bold text-[#00e5cc]">{cat.count}</span>
              <span className="text-xs text-fd-muted-foreground text-center leading-snug">{cat.label}</span>
            </div>
          ))}
        </div>
        <div className="mt-4">
          <p className="text-xs text-fd-muted-foreground mb-3">Popular integrations:</p>
          <div className="flex flex-wrap gap-2">
            {popularIntegrations.map((name) => (
              <span key={name} className="inline-flex items-center px-3.5 py-1.5 rounded-full border border-fd-border bg-[rgba(10,15,26,0.5)] text-xs text-fd-muted-foreground transition-all hover:border-brand hover:text-fd-foreground">
                {name}
              </span>
            ))}
            <span className="inline-flex items-center px-3.5 py-1.5 rounded-full border border-[#00e5cc] text-xs text-[#00e5cc] font-medium">
              +{automationsData.total - popularIntegrations.length} more
            </span>
          </div>
        </div>
        <div className="text-center mt-6">
          <a
            href="https://app.hanzo.bot"
            className="inline-block px-7 py-3 rounded-xl bg-gradient-to-br from-[#00e5cc] to-[#14b8a6] text-[#050810] font-semibold no-underline transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(0,229,204,0.4)]"
          >
            Launch Hanzo Auto →
          </a>
        </div>
      </section>

      {/* CTA */}
      <section className="text-center p-12 rounded-2xl border border-fd-border bg-[rgba(10,15,26,0.6)] backdrop-blur-sm mb-10">
        <h2 className="text-2xl font-semibold mb-2">Ready to get started?</h2>
        <p className="text-fd-muted-foreground mb-6">Install Hanzo Bot and connect your first provider in minutes.</p>
        <Link
          href="/"
          className="inline-block px-8 py-3.5 rounded-xl bg-gradient-to-br from-brand to-[#991b1b] text-white font-semibold no-underline transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(255,77,77,0.4)]"
        >
          Get Started
        </Link>
      </section>

      {/* Skills CTA */}
      <section className="text-center p-12 rounded-2xl border border-fd-border bg-[rgba(10,15,26,0.6)] backdrop-blur-sm mb-10">
        <h2 className="text-2xl font-semibold mb-2">Want More Skills?</h2>
        <p className="text-fd-muted-foreground mb-6 max-w-[600px] mx-auto">
          Discover 700+ community-built skills on the Hanzo Skill Hub — the public registry for sharing and discovering agent capabilities.
        </p>
        <Link
          href="/skills"
          className="inline-block px-8 py-3.5 rounded-xl bg-gradient-to-br from-[#00e5cc] to-[#14b8a6] text-[#050810] font-semibold no-underline transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(0,229,204,0.4)]"
        >
          Browse Skill Hub →
        </Link>
      </section>
    </main>
  );
}
