'use client';

import { useState, useMemo } from 'react';
import { SearchIcon } from 'lucide-react';
import skillsData from '@/data/skills.json';

interface Skill {
  name: string;
  slug: string;
  author: string;
  description: string;
  emoji?: string;
  version: string;
  category?: string;
}

export default function SkillsPage() {
  const [query, setQuery] = useState('');

  const skills = useMemo(
    () => (skillsData as Skill[]).sort((a, b) => a.name.localeCompare(b.name)),
    [],
  );

  const totalAuthors = useMemo(
    () => new Set(skills.map((s) => s.author)).size,
    [skills],
  );

  const filtered = useMemo(() => {
    if (!query.trim()) return skills;
    const q = query.toLowerCase().trim();
    return skills.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q) ||
        s.author.toLowerCase().includes(q),
    );
  }, [skills, query]);

  return (
    <main className="relative z-[1] max-w-[1200px] mx-auto px-6 py-10">
      <div className="stars" />
      <div className="nebula" />

      <header className="text-center mb-8 animate-[fadeInUp_0.6s_ease-out]">
        <h1 className="text-3xl sm:text-4xl font-bold mb-3">
          <span className="text-brand">&#x27E9;</span> Skills Hub
        </h1>
        <p className="text-fd-muted-foreground text-lg mb-6">
          {skills.length} skills from {totalAuthors} contributors — install with one command
        </p>
        <div className="relative max-w-[480px] mx-auto">
          <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-fd-muted-foreground pointer-events-none" />
          <input
            type="text"
            placeholder="Search skills..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full py-3.5 px-4 pl-11 rounded-xl border border-fd-border bg-[rgba(10,15,26,0.8)] text-fd-foreground text-base outline-none transition-all focus:border-brand focus:shadow-[0_0_0_3px_rgba(255,77,77,0.15)] placeholder:text-fd-muted-foreground"
          />
        </div>
      </header>

      <div className="flex justify-center items-center gap-3 mb-8 text-sm text-fd-muted-foreground">
        <span className="text-[#00e5cc] font-medium">{skills.length} skills</span>
        <span className="opacity-40">·</span>
        <span className="text-[#00e5cc] font-medium">{totalAuthors} contributors</span>
        <span className="opacity-40">·</span>
        <span className="text-[#00e5cc] font-medium">Open source</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-[repeat(auto-fill,minmax(320px,1fr))] gap-4 mb-12">
        {filtered.map((skill) => (
          <div
            key={`${skill.author}/${skill.slug}`}
            className="flex flex-col gap-3 p-5 rounded-2xl border border-fd-border bg-[rgba(10,15,26,0.7)] backdrop-blur-sm transition-all hover:border-brand hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(255,77,77,0.12)]"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand to-[#991b1b] flex items-center justify-center font-bold text-lg text-white shrink-0">
                {skill.name.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-semibold text-fd-foreground truncate">{skill.name}</h3>
                <span className="text-xs text-fd-muted-foreground">by @{skill.author}</span>
              </div>
              <span className="text-xs text-fd-muted-foreground font-mono bg-[rgba(255,255,255,0.05)] px-2 py-0.5 rounded-md shrink-0">
                v{skill.version}
              </span>
            </div>
            {skill.description && (
              <p className="text-xs leading-relaxed text-fd-muted-foreground">
                {skill.description.length > 160 ? skill.description.slice(0, 160) + '...' : skill.description}
              </p>
            )}
            <div className="mt-auto pt-3 border-t border-fd-border">
              <code className="text-xs font-mono text-[#00e5cc] bg-[rgba(0,229,204,0.08)] px-2.5 py-1.5 rounded-lg block truncate">
                skills install {skill.author}/{skill.slug}
              </code>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 text-fd-muted-foreground text-lg">
          No skills found matching your search.
        </div>
      )}

      <section className="text-center p-12 rounded-2xl border border-fd-border bg-[rgba(10,15,26,0.7)] backdrop-blur-sm mb-12">
        <h2 className="text-2xl font-semibold mb-2">Build Your Own Skill</h2>
        <p className="text-fd-muted-foreground mb-6">Skills are just folders with a SKILL.md — your bot can build them too.</p>
        <div className="flex gap-4 justify-center flex-wrap">
          <a
            href="/docs"
            className="px-6 py-3 rounded-xl font-semibold text-white bg-gradient-to-br from-brand to-[#991b1b] no-underline transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(255,77,77,0.4)]"
          >
            Read the Docs
          </a>
          <a
            href="https://github.com/hanzoai/bot"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 rounded-xl font-semibold text-fd-foreground border border-fd-border bg-[rgba(255,255,255,0.08)] no-underline transition-all hover:-translate-y-0.5 hover:bg-[rgba(255,255,255,0.12)]"
          >
            View Source
          </a>
          <a
            href="https://discord.gg/hanzo"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 rounded-xl font-semibold text-[#5865F2] border border-[#5865F2] bg-[rgba(88,101,242,0.15)] no-underline transition-all hover:-translate-y-0.5 hover:bg-[rgba(88,101,242,0.25)]"
          >
            Join Discord
          </a>
        </div>
      </section>
    </main>
  );
}
