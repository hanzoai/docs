'use client';

import { useState, useEffect, useCallback } from 'react';
import { CopyIcon, CheckIcon, DownloadIcon } from 'lucide-react';

type Mode = 'oneliner' | 'quick' | 'hackable' | 'macos';
type PM = 'npm' | 'pnpm';
type OS = 'unix' | 'windows';
type WinShell = 'powershell' | 'cmd';
type HackableMode = 'installer' | 'pnpm';

const WINDOWS_PS = 'iwr -useb https://hanzo.bot/install.ps1 | iex';
const WINDOWS_PS_BETA = '& ([scriptblock]::Create((iwr -useb https://hanzo.bot/install.ps1))) -Tag beta';
const WINDOWS_CMD = 'curl -fsSL https://hanzo.bot/install.cmd -o install.cmd && install.cmd && del install.cmd';
const WINDOWS_CMD_BETA = 'curl -fsSL https://hanzo.bot/install.cmd -o install.cmd && install.cmd --tag beta && del install.cmd';

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const copy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  }, [text]);

  return (
    <button
      onClick={copy}
      className={`opacity-60 group-hover/line:opacity-100 ml-auto flex items-center justify-center w-7 h-7 border-none rounded-md cursor-pointer transition-all shrink-0 ${
        copied ? 'bg-[rgba(0,229,204,0.2)] text-[#00e5cc]' : 'bg-[rgba(255,255,255,0.1)] text-fd-muted-foreground hover:bg-[rgba(255,255,255,0.2)] hover:text-fd-foreground'
      }`}
      title="Copy"
    >
      {copied ? <CheckIcon className="w-3.5 h-3.5" /> : <CopyIcon className="w-3.5 h-3.5" />}
    </button>
  );
}

function TabButton({ active, onClick, children, variant = 'mode' }: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  variant?: 'mode' | 'option' | 'beta';
}) {
  const base = 'font-mono text-[0.7rem] px-2.5 py-1 border-none rounded cursor-pointer transition-all';
  const styles = {
    mode: active
      ? `${base} bg-[#00e5cc] text-[#050810] font-semibold`
      : `${base} bg-transparent text-fd-muted-foreground hover:text-fd-secondary-foreground`,
    option: active
      ? `${base} bg-brand text-[#050810] font-semibold`
      : `${base} bg-transparent text-fd-muted-foreground hover:text-fd-secondary-foreground`,
    beta: active
      ? `${base} bg-[rgba(0,229,204,0.15)] border border-[#00e5cc] text-[#00e5cc]`
      : `${base} bg-transparent border border-fd-border text-fd-muted-foreground hover:border-[#00e5cc] hover:text-[#00e5cc]`,
  };
  return <button onClick={onClick} className={styles[variant]}>{children}</button>;
}

export function InstallTabs() {
  const [mode, setMode] = useState<Mode>('oneliner');
  const [pm, setPm] = useState<PM>('npm');
  const [os, setOs] = useState<OS>('unix');
  const [winShell, setWinShell] = useState<WinShell>('powershell');
  const [hackable, setHackable] = useState<HackableMode>('installer');
  const [beta, setBeta] = useState(false);
  const [osPickerOpen, setOsPickerOpen] = useState(false);

  useEffect(() => {
    if (typeof navigator !== 'undefined') {
      const isWin = navigator.platform?.toLowerCase().includes('win') ||
        navigator.userAgent?.toLowerCase().includes('windows');
      if (isWin) setOs('windows');
    }
  }, []);

  const getOnelinerCmd = () => {
    if (os === 'unix') return beta
      ? 'curl -fsSL https://hanzo.bot/install.sh | bash -s -- --beta'
      : 'curl -fsSL https://hanzo.bot/install.sh | bash';
    if (winShell === 'cmd') return beta ? WINDOWS_CMD_BETA : WINDOWS_CMD;
    return beta ? WINDOWS_PS_BETA : WINDOWS_PS;
  };

  const getInstallCmd = () => {
    const suffix = beta ? '@beta' : '';
    return pm === 'npm' ? `npm i -g hanzo-bot${suffix}` : `pnpm add -g hanzo-bot${suffix}`;
  };

  const comments = {
    oneliner: beta
      ? "# Living on the edge. Bugs are features you found first."
      : "# Works everywhere. Installs everything. You're welcome.",
    quickInstall: beta ? '# Install Hanzo Bot (beta)' : '# Install Hanzo Bot',
    quickOnboard: beta ? '# Meet your experimental bot' : '# Meet your bot',
  };

  return (
    <section className="mb-14">
      <h2 className="text-xl font-semibold flex items-center gap-2.5 mb-5">
        <span className="text-brand font-bold">&#x27E9;</span> Quick Start
      </h2>
      <div className="rounded-xl border border-fd-border bg-fd-muted/30 overflow-hidden">
        {/* Header */}
        <div className="flex items-center gap-2 px-4 py-3 bg-[rgba(0,0,0,0.3)] border-b border-fd-border flex-wrap">
          <span className="w-3 h-3 rounded-full bg-[#ff5f57]" />
          <span className="w-3 h-3 rounded-full bg-[#febc2e]" />
          <span className="w-3 h-3 rounded-full bg-[#28c840]" />

          <div className="flex gap-1 bg-[rgba(0,0,0,0.3)] p-0.5 rounded-md ml-2">
            {(['oneliner', 'quick', 'hackable', 'macos'] as Mode[]).map((m) => (
              <TabButton key={m} active={mode === m} onClick={() => { setMode(m); setOsPickerOpen(false); }} variant="mode">
                {m === 'oneliner' ? 'One-liner' : m === 'quick' ? 'npm' : m === 'hackable' ? 'Hackable' : 'macOS'}
              </TabButton>
            ))}
          </div>

          {mode === 'oneliner' && !osPickerOpen && (
            <div className="flex items-center gap-2 ml-auto font-mono text-xs text-fd-muted-foreground">
              <span className="text-fd-secondary-foreground">{os === 'unix' ? 'macOS/Linux' : 'Windows'}</span>
              <button
                onClick={() => setOsPickerOpen(true)}
                className="bg-none border-none text-brand font-mono text-[0.7rem] cursor-pointer px-1.5 py-0.5 rounded hover:bg-[rgba(255,77,77,0.15)] hover:text-[#00e5cc] transition-all"
              >
                change
              </button>
            </div>
          )}

          {mode === 'oneliner' && osPickerOpen && (
            <div className="flex gap-1 bg-[rgba(0,0,0,0.3)] p-0.5 rounded-md ml-auto">
              <TabButton active={os === 'unix'} onClick={() => { setOs('unix'); setOsPickerOpen(false); }} variant="option">macOS/Linux</TabButton>
              <TabButton active={os === 'windows'} onClick={() => { setOs('windows'); setOsPickerOpen(false); }} variant="option">Windows</TabButton>
            </div>
          )}

          {mode === 'oneliner' && os === 'windows' && (
            <div className="flex gap-1 bg-[rgba(0,0,0,0.3)] p-0.5 rounded-md ml-2">
              <TabButton active={winShell === 'powershell'} onClick={() => setWinShell('powershell')} variant="option">PowerShell</TabButton>
              <TabButton active={winShell === 'cmd'} onClick={() => setWinShell('cmd')} variant="option">CMD</TabButton>
            </div>
          )}

          {mode === 'quick' && (
            <div className="flex gap-1 bg-[rgba(0,0,0,0.3)] p-0.5 rounded-md ml-auto">
              <TabButton active={pm === 'npm'} onClick={() => setPm('npm')} variant="option">npm</TabButton>
              <TabButton active={pm === 'pnpm'} onClick={() => setPm('pnpm')} variant="option">pnpm</TabButton>
            </div>
          )}

          {mode === 'hackable' && (
            <div className="flex gap-1 bg-[rgba(0,0,0,0.3)] p-0.5 rounded-md ml-auto">
              <TabButton active={hackable === 'installer'} onClick={() => setHackable('installer')} variant="option">installer</TabButton>
              <TabButton active={hackable === 'pnpm'} onClick={() => setHackable('pnpm')} variant="option">pnpm</TabButton>
            </div>
          )}

          {(mode === 'oneliner' || mode === 'quick') && (
            <div className="ml-2">
              <TabButton active={beta} onClick={() => setBeta(!beta)} variant="beta">
                <span className="font-bold text-[0.8rem]">β</span>{' '}
                <span className="uppercase tracking-wider">Beta</span>
              </TabButton>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="px-5 py-4 font-mono text-sm leading-relaxed">
          {mode === 'oneliner' && (
            <>
              <div className="text-fd-muted-foreground italic py-1">{comments.oneliner}</div>
              <div className="flex items-center gap-2 py-1 group/line">
                <span className="text-brand select-none">$</span>
                <span>{getOnelinerCmd()}</span>
                <CopyButton text={getOnelinerCmd()} />
              </div>
            </>
          )}

          {mode === 'quick' && (
            <>
              <div className="text-fd-muted-foreground italic py-1">{comments.quickInstall}</div>
              <div className="flex items-center gap-2 py-1 group/line">
                <span className="text-brand select-none">$</span>
                <span className="text-[#00e5cc]">{getInstallCmd()}</span>
                <CopyButton text={getInstallCmd()} />
              </div>
              <div className="text-fd-muted-foreground italic py-1">{comments.quickOnboard}</div>
              <div className="flex items-center gap-2 py-1 group/line">
                <span className="text-brand select-none">$</span>
                <span>hanzo-bot onboard</span>
                <CopyButton text="hanzo-bot onboard" />
              </div>
            </>
          )}

          {mode === 'hackable' && hackable === 'installer' && (
            <>
              <div className="text-fd-muted-foreground italic py-1"># For those who read source code for fun</div>
              <div className="flex items-center gap-2 py-1 group/line">
                <span className="text-brand select-none">$</span>
                <span>curl -fsSL https://hanzo.bot/install.sh | bash -s -- --install-method git</span>
                <CopyButton text="curl -fsSL https://hanzo.bot/install.sh | bash -s -- --install-method git" />
              </div>
            </>
          )}

          {mode === 'hackable' && hackable === 'pnpm' && (
            <>
              <div className="text-fd-muted-foreground italic py-1"># You clearly know what you&apos;re doing</div>
              <div className="flex items-center gap-2 py-1 group/line">
                <span className="text-brand select-none">$</span>
                <span>git clone https://github.com/hanzoai/bot.git</span>
                <CopyButton text="git clone https://github.com/hanzoai/bot.git" />
              </div>
              <div className="flex items-center gap-2 py-1 group/line">
                <span className="text-brand select-none">$</span>
                <span>cd hanzo-bot && pnpm install && pnpm run build</span>
                <CopyButton text="cd hanzo-bot && pnpm install && pnpm run build" />
              </div>
              <div className="text-fd-muted-foreground italic py-1"># You built it, now meet it</div>
              <div className="flex items-center gap-2 py-1 group/line">
                <span className="text-brand select-none">$</span>
                <span>pnpm run hanzo-bot onboard</span>
                <CopyButton text="pnpm run hanzo-bot onboard" />
              </div>
            </>
          )}

          {mode === 'macos' && (
            <div className="flex flex-col items-center gap-4 py-6 text-center">
              <div className="flex flex-col gap-1">
                <span className="text-lg font-semibold text-fd-foreground">Companion App (Beta)</span>
                <span className="text-sm text-fd-muted-foreground">Menubar access to your bot. Works great alongside the CLI.</span>
              </div>
              <a
                href="https://github.com/hanzoai/bot/releases/latest"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 px-7 py-3.5 bg-gradient-to-br from-brand to-[#991b1b] rounded-xl text-white font-semibold no-underline transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(255,77,77,0.4)]"
              >
                <DownloadIcon className="w-5 h-5" />
                Download for macOS
              </a>
              <span className="text-xs text-fd-muted-foreground">Requires macOS 14+ · Universal Binary</span>
            </div>
          )}
        </div>
      </div>
      <p className="mt-4 text-sm text-fd-muted-foreground text-center">
        Works on macOS, Windows & Linux. The one-liner installs Node.js and everything else for you.
      </p>
    </section>
  );
}
