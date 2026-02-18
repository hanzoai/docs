/**
 * Convert OpenClaw/Bot docs from Mintlify .md → fumadocs .mdx
 *
 * - Copies all .md files preserving directory structure
 * - Converts frontmatter (summary → description, removes read_when)
 * - Rebrands OpenClaw → Hanzo Bot
 * - Creates meta.json for each directory
 * - Renames index.md → index.mdx
 */

import { readdir, readFile, writeFile, mkdir, stat } from 'fs/promises';
import { join, relative, basename, dirname, extname } from 'path';
import { existsSync } from 'fs';

const SRC = '/Users/z/work/hanzo/bot/docs';
const DEST = '/Users/z/work/hanzo/docs/apps/bot-docs/content/docs';

// Directories to include (top-level categories)
const CATEGORIES = [
  'install', 'start', 'concepts', 'cli', 'channels', 'providers',
  'tools', 'gateway', 'automation', 'platforms', 'nodes', 'web',
  'plugins', 'help', 'reference',
];

// Files to skip
const SKIP_FILES = new Set([
  '_config.yml', 'docs.json', 'CNAME', '.gitignore',
  'Gemfile', 'Gemfile.lock', '_layouts', '_includes',
]);

// Rebrand map
const REBRAND: [RegExp, string][] = [
  [/\bOpenClaw\b/g, 'Hanzo Bot'],
  [/\bopenclaw\b/g, 'hanzo-bot'],
  [/\bOPENCLAW\b/g, 'HANZO_BOT'],
  [/\bopenclaw\.ai\b/g, 'hanzo.bot'],
  [/\bClawdBot\b/g, 'Hanzo Bot'],
  [/\bclawdbot\b/g, 'hanzo-bot'],
  [/\bCLAWDBOT\b/g, 'BOT'],
  [/openclaw\.ai/g, 'hanzo.bot'],
  [/docs\.openclaw\.ai/g, 'hanzo.bot/docs'],
  // GitHub refs
  [/github\.com\/openclaw\/openclaw/g, 'github.com/hanzoai/bot'],
  [/github\.com\/bot\/bot/g, 'github.com/hanzoai/bot'],
  [/github\.com\/bot\/nix-bot/g, 'github.com/hanzoai/nix-bot'],
  [/github\.com\/bot\/bot-ansible/g, 'github.com/hanzoai/bot-ansible'],
  // Discord
  [/channels\.discord\.gg\/bot/g, 'discord.gg/XthHQQj'],
  [/discord\.gg\/hanzo\b/g, 'discord.gg/XthHQQj'],
  [/discord\.gg\/clawd\b/g, 'discord.gg/XthHQQj'],
  // Domain
  [/hanzo\.bot\/install/g, 'hanzo.bot/install'],
  // Hanzo Cloud messaging
];

// Category display names and ordering
const CATEGORY_META: Record<string, { title: string; pages?: string[] }> = {
  install: {
    title: 'Installation',
    pages: ['index', 'installer', 'node', 'docker', 'nix', 'ansible', 'bun', 'updating', 'development-channels', 'uninstall'],
  },
  start: {
    title: 'Getting Started',
    pages: ['getting-started', 'wizard', 'setup', 'bot', 'pairing', 'showcase', 'onboarding', 'hubs', 'lore'],
  },
  concepts: {
    title: 'Core Concepts',
  },
  cli: {
    title: 'CLI Reference',
  },
  channels: {
    title: 'Channels',
    pages: ['index', 'whatsapp', 'telegram', 'grammy', 'discord', 'slack', 'signal', 'bluebubbles', 'imessage', 'matrix', 'mattermost', 'googlechat', 'msteams', 'nostr', 'tlon', 'nextcloud-talk', 'zalo', 'zalouser', 'location', 'troubleshooting'],
  },
  providers: {
    title: 'LLM Providers',
    pages: ['index', 'openai', 'anthropic', 'ollama', 'qwen', 'openrouter', 'moonshot', 'minimax', 'venice', 'synthetic', 'vercel-ai-gateway', 'opencode', 'zai', 'glm', 'github-copilot', 'deepgram'],
  },
  tools: {
    title: 'Skills & Tools',
  },
  gateway: {
    title: 'Gateway',
  },
  automation: {
    title: 'Automation',
  },
  platforms: {
    title: 'Platforms',
  },
  nodes: {
    title: 'Nodes & Media',
  },
  web: {
    title: 'Web Interfaces',
  },
  plugins: {
    title: 'Plugins',
  },
  help: {
    title: 'Help',
  },
  reference: {
    title: 'Reference',
  },
};

function convertFrontmatter(content: string): string {
  // Extract existing frontmatter
  const fmMatch = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!fmMatch) {
    return content;
  }

  const fm = fmMatch[1];
  let body = fmMatch[2];

  // Parse frontmatter fields
  const lines = fm.split('\n');
  let title = '';
  let description = '';
  let isIndex = false;

  for (const line of lines) {
    const summaryMatch = line.match(/^summary:\s*"(.+)"$/);
    if (summaryMatch) {
      description = summaryMatch[1];
    }
    const titleMatch = line.match(/^title:\s*"?(.+?)"?\s*$/);
    if (titleMatch) {
      title = titleMatch[1];
    }
  }

  // Extract title from first heading if not in frontmatter
  if (!title) {
    const headingMatch = body.match(/^#\s+(.+)$/m);
    if (headingMatch) {
      title = headingMatch[1];
      // Remove the heading from body since fumadocs uses frontmatter title
      body = body.replace(/^#\s+.+\n+/, '');
    }
  }

  if (!title) {
    title = 'Untitled';
  }

  if (!description) {
    description = title;
  }

  // Build new frontmatter
  const newFm = [
    '---',
    `title: "${title.replace(/"/g, '\\"')}"`,
    `description: "${description.replace(/"/g, '\\"')}"`,
  ];

  if (isIndex) {
    newFm.push('index: true');
  }

  newFm.push('---');

  return newFm.join('\n') + '\n\n' + body.trim() + '\n';
}

function applyRebrand(content: string): string {
  let result = content;
  for (const [pattern, replacement] of REBRAND) {
    result = result.replace(pattern, replacement);
  }

  // Add Hanzo Cloud callout to install/getting-started pages
  return result;
}

async function* walkDir(dir: string): AsyncGenerator<string> {
  const entries = await readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      if (!SKIP_FILES.has(entry.name) && !entry.name.startsWith('_') && !entry.name.startsWith('.')) {
        yield* walkDir(fullPath);
      }
    } else if (entry.name.endsWith('.md') && !SKIP_FILES.has(entry.name)) {
      yield fullPath;
    }
  }
}

async function convertFile(srcPath: string) {
  const relPath = relative(SRC, srcPath);
  const parts = relPath.split('/');

  // Only process files in our target categories or root-level
  const category = parts[0];
  if (parts.length > 1 && !CATEGORIES.includes(category)) {
    return;
  }

  // Skip root-level files that aren't in categories
  if (parts.length === 1 && parts[0] !== 'index.md') {
    // Root files that should go into specific categories
    const rootFileMap: Record<string, string> = {
      'tui.md': 'web/tui.mdx',
      'tts.md': 'nodes/tts.mdx',
      'environment.md': 'reference/environment.mdx',
      'scripts.md': 'reference/scripts.mdx',
      'testing.md': 'reference/testing.mdx',
      'debug.md': 'help/debug.mdx',
    };
    const mapped = rootFileMap[parts[0]];
    if (!mapped) return;

    const destPath = join(DEST, mapped);
    await mkdir(dirname(destPath), { recursive: true });
    let content = await readFile(srcPath, 'utf-8');
    content = convertFrontmatter(content);
    content = applyRebrand(content);
    await writeFile(destPath, content, 'utf-8');
    console.log(`  ${relPath} → ${mapped}`);
    return;
  }

  // Build dest path (.md → .mdx)
  let destRel = relPath.replace(/\.md$/, '.mdx');
  const destPath = join(DEST, destRel);

  await mkdir(dirname(destPath), { recursive: true });

  let content = await readFile(srcPath, 'utf-8');
  content = convertFrontmatter(content);
  content = applyRebrand(content);

  await writeFile(destPath, content, 'utf-8');
  console.log(`  ${relPath} → ${destRel}`);
}

async function createMetaFiles() {
  // Create meta.json for each category directory
  for (const [category, meta] of Object.entries(CATEGORY_META)) {
    const catDir = join(DEST, category);
    if (!existsSync(catDir)) continue;

    const metaContent: any = {};

    if (meta.title) {
      metaContent.title = meta.title;
    }

    if (meta.pages) {
      metaContent.pages = meta.pages;
    } else {
      // Auto-discover pages from directory
      try {
        const entries = await readdir(catDir);
        const pages = entries
          .filter(f => f.endsWith('.mdx') && f !== 'index.mdx')
          .map(f => f.replace('.mdx', ''))
          .sort();

        if (pages.length > 0) {
          // Put index first if it exists
          const hasIndex = entries.includes('index.mdx');
          if (hasIndex) {
            metaContent.pages = ['index', ...pages];
          } else {
            metaContent.pages = pages;
          }
        }
      } catch {
        // Directory might not exist yet
      }
    }

    await writeFile(
      join(catDir, 'meta.json'),
      JSON.stringify(metaContent, null, 2) + '\n',
      'utf-8'
    );
    console.log(`  Created ${category}/meta.json`);
  }

  // Handle subdirectories (platforms/mac, reference/templates)
  const subdirs = ['platforms/mac', 'reference/templates'];
  for (const subdir of subdirs) {
    const subdirPath = join(DEST, subdir);
    if (!existsSync(subdirPath)) continue;

    const entries = await readdir(subdirPath);
    const pages = entries
      .filter(f => f.endsWith('.mdx'))
      .map(f => f.replace('.mdx', ''))
      .sort();

    if (pages.length > 0) {
      await writeFile(
        join(subdirPath, 'meta.json'),
        JSON.stringify({ pages }, null, 2) + '\n',
        'utf-8'
      );
      console.log(`  Created ${subdir}/meta.json`);
    }
  }
}

async function main() {
  console.log('Converting OpenClaw docs → Hanzo Bot fumadocs MDX\n');
  console.log(`Source: ${SRC}`);
  console.log(`Dest:   ${DEST}\n`);

  let count = 0;

  // Convert all markdown files
  for await (const srcPath of walkDir(SRC)) {
    await convertFile(srcPath);
    count++;
  }

  console.log(`\nConverted ${count} files`);

  // Create meta.json files
  console.log('\nCreating meta.json files...');
  await createMetaFiles();

  console.log('\nDone!');
}

main().catch(console.error);
