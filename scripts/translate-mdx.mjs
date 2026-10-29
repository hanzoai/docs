#!/usr/bin/env node
/**
 * Translate Hanzo Docs MDX into locale files for the dot parser (`page.es.mdx`).
 *
 * English stays the source. Existing translations are left in place.
 * Code fences, inline code, URLs, JSX tags, frontmatter keys, and these
 * product names are not translated: Hanzo, Enso, Kai, Lux, Zoo, Zen.
 *
 *   HANZO_API_KEY or OPENAI_API_KEY   required to call the API
 *   HANZO_API_BASE                    default https://api.hanzo.ai/v1
 *   HANZO_TRANSLATE_MODEL             default gpt-4o-mini
 *
 *   node scripts/translate-mdx.mjs --root apps/docs/content/docs --locales es,fr
 *   node scripts/translate-mdx.mjs --check
 *   node scripts/translate-mdx.mjs --dry-run --limit 5
 *
 * A missing UI key falls back to English at runtime (`withEnglishFallback`).
 * This script is for long-form pages. It does not commit secrets.
 */
import fs from 'node:fs';
import path from 'node:path';

const LOCALES = [
  'es',
  'fr',
  'de',
  'it',
  'pt-BR',
  'ru',
  'tr',
  'ar',
  'hi',
  'id',
  'vi',
  'th',
  'ja',
  'ko',
  'zh-CN',
  'zh-TW',
];

const args = process.argv.slice(2);
const flag = (name, fallback) => {
  const index = args.indexOf(`--${name}`);
  if (index === -1) return fallback;
  return args[index + 1] && !args[index + 1].startsWith('--') ? args[index + 1] : true;
};

const root = path.resolve(flag('root', 'apps/docs/content/docs'));
const locales = String(flag('locales', LOCALES.join(',')))
  .split(',')
  .map((item) => item.trim())
  .filter(Boolean);
const limit = Number(flag('limit', '0')) || Infinity;
const dryRun = args.includes('--dry-run');
const check = args.includes('--check');

function walk(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, out);
    else if (entry.name.endsWith('.mdx') || entry.name.endsWith('.md')) out.push(full);
  }
  return out;
}

function localeOf(file) {
  const base = path.basename(file).replace(/\.mdx?$/, '');
  const match = base.match(/\.([a-z]{2}(?:-[A-Z]{2})?)$/);
  return match ? match[1] : null;
}

function targetFor(file, locale) {
  const ext = path.extname(file);
  const base = path.basename(file, ext).replace(/\.([a-z]{2}(?:-[A-Z]{2})?)$/, '');
  return path.join(path.dirname(file), `${base}.${locale}${ext}`);
}

const files = walk(root).filter((file) => !localeOf(file));
const missing = [];
for (const file of files) {
  for (const locale of locales) {
    if (!fs.existsSync(targetFor(file, locale))) missing.push({ file, locale });
  }
}

if (check || dryRun) {
  console.log(`${missing.length} missing translations under ${root}`);
  for (const item of missing.slice(0, 40)) {
    console.log(`  ${path.relative(process.cwd(), item.file)} → ${item.locale}`);
  }
  if (missing.length > 40) console.log(`  … ${missing.length - 40} more`);
  if (check || dryRun) process.exit(0);
}

const key = process.env.HANZO_API_KEY || process.env.OPENAI_API_KEY;
if (!key) {
  console.error('Set HANZO_API_KEY or OPENAI_API_KEY. Nothing was sent.');
  process.exit(1);
}

const base = (process.env.HANZO_API_BASE || 'https://api.hanzo.ai/v1').replace(/\/$/, '');
const model = process.env.HANZO_TRANSLATE_MODEL || 'gpt-4o-mini';

async function translate(source, locale) {
  const response = await fetch(`${base}/chat/completions`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${key}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model,
      temperature: 0.2,
      messages: [
        {
          role: 'system',
          content: [
            `Translate the Markdown/MDX document into ${locale}.`,
            'Keep the structure identical: frontmatter keys, JSX/MDX components, code fences, inline code, URLs, and link targets.',
            'Do not translate product names Hanzo, Enso, Kai, Lux, Zoo, Zen, or command lines.',
            'Return only the translated document.',
          ].join(' '),
        },
        { role: 'user', content: source },
      ],
    }),
  });
  if (!response.ok) {
    throw new Error(`${response.status} ${await response.text()}`);
  }
  const payload = await response.json();
  const text = payload.choices?.[0]?.message?.content;
  if (!text) throw new Error('empty completion');
  return text.replace(/^```(?:mdx|markdown)?\n/, '').replace(/\n```$/, '');
}

let wrote = 0;
for (const item of missing) {
  if (wrote >= limit) break;
  const source = fs.readFileSync(item.file, 'utf8');
  const translated = await translate(source, item.locale);
  const dest = targetFor(item.file, item.locale);
  fs.writeFileSync(dest, translated.endsWith('\n') ? translated : `${translated}\n`);
  wrote += 1;
  console.log('wrote', path.relative(process.cwd(), dest));
}

console.log(`translated ${wrote} file${wrote === 1 ? '' : 's'}`);
