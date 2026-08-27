import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// `octokit` is lazy-imported inside createOctokit() so bun doesn't try
// to resolve the @octokit/plugin-retry pnpm symlink at top-level when
// the sync step is disabled (HANZO_DOCS_SYNC=0). The build pre-step
// short-circuits before createOctokit() runs in that case.
type Octokit = any;

/**
 * Forks of other people's demos and engine samples, carried under our org and
 * presented by the docs as Hanzo projects. Measured against the GitHub API: all
 * twelve are forks whose upstream owner is Unity-Technologies or BayatGames.
 *
 * A list rather than a rule, because "is this ours" is a judgement — a fork of
 * ClickHouse IS a Hanzo project (hanzoai/datastore) and a fork of a platformer
 * is not, and no field on the API tells them apart.
 */
const SAMPLE_FORKS = new Set([
  '2d-techdemos',
  'BoatAttack',
  'DOTSSample',
  'ECS-Network-Racing-Sample',
  'FPSSample',
  'Megacity-2019',
  'ProjectTinySamples',
  'RedRunner',
  'UIToolkitUnityRoyaleRuntimeDemo',
  'com.unity.multiplayer.samples.coop',
  'megacity-metro',
  'open-project-1',
]);

const SCRIPT_PATH = fileURLToPath(import.meta.url);
const SCRIPT_DIR = path.dirname(SCRIPT_PATH);
const APP_ROOT = path.resolve(SCRIPT_DIR, '..');
const REPO_ROOT = path.resolve(SCRIPT_DIR, '..', '..', '..');

type RepoRecord = {
  org: string;
  repo: string;
  slug: string;
  name: string;
  description: string | null;
  archived: boolean;
  repoUrl: string;
  route: string;
};

type Config = {
  orgs: string[];
  excludeRepos?: string[];
  pageRenames?: Record<string, string>;
  docsCandidates?: string[];
  localRoot?: string;
  outputDir?: string;
  manifestPath?: string;
  includePrivate?: boolean;
};

const DEFAULT_DOCS_CANDIDATES = [
  'docs',
  'documentation',
  'content/docs',
  'docs/content/docs',
  'docs/docs',
  'doc',
  'site/docs',
];

export async function syncProjectDocs() {
  const config = loadConfig();
  const orgs = resolveOrgs(config);
  if (orgs.length === 0) {
    console.warn('[sync-project-docs] No orgs configured.');
    return;
  }

  const localRoot = expandHome(
    process.env.HANZO_DOCS_LOCAL_ROOT ?? config.localRoot ?? '~/work/hanzo',
  );
  const outputDir = resolveRepoPath(config.outputDir ?? 'apps/docs/content/docs/projects');
  const manifestPath = resolveRepoPath(config.manifestPath ?? 'apps/docs/projects.json');
  const docsCandidates = config.docsCandidates ?? DEFAULT_DOCS_CANDIDATES;
  const excludeRepos = new Set(config.excludeRepos ?? []);
  const fetchRemote = process.env.HANZO_DOCS_FETCH_REMOTE !== '0';
  const dryRun = process.env.HANZO_DOCS_DRY_RUN === '1';
  const concurrency = Math.max(1, Number(process.env.HANZO_DOCS_CONCURRENCY ?? '4'));
  const includePrivate =
    process.env.HANZO_DOCS_INCLUDE_PRIVATE === '1' || config.includePrivate === true;
  const prune = process.env.HANZO_DOCS_PRUNE !== '0';

  const projects: RepoRecord[] = [];

  ensureDir(outputDir, dryRun);

  for (const org of orgs) {
    // Per org, because an installation token is issued to ONE installation and
    // an org is what an App is installed on.
    const octokit = await createOctokit(org);
    const repos = await listOrgRepos(octokit, org);
    const tasks = repos
      .filter((repo) => !excludeRepos.has(repo.name))
      // A fork of somebody's engine demo is not a Hanzo project. Twelve of these
      // were listed as ours: FPSSample, BoatAttack, Megacity-2019, RedRunner and
      // the rest, all forked from Unity-Technologies or BayatGames. They stay on
      // GitHub; they do not belong in the Open source rail.
      .filter((repo) => !SAMPLE_FORKS.has(repo.name))
      .filter((repo) => {
        const isPrivate = repo.private === true || repo.visibility === 'private' || repo.visibility === 'internal';
        return includePrivate || !isPrivate;
      })
      .map((repo) => () =>
        syncRepoDocs({
          org,
          repo,
          outputDir,
          localRoot,
          docsCandidates,
          fetchRemote,
          dryRun,
          octokit,
        }),
      );

    const records = await runWithConcurrency(tasks, concurrency);
    projects.push(...records);
  }

  const pageRenames = config.pageRenames ?? {};

  // Apply page renames: rename filesystem directories and update project records
  if (!dryRun) {
    applyPageRenames(outputDir, orgs, projects, pageRenames);
  }

  const manifest = {
    generatedAt: new Date().toISOString(),
    orgs,
    projects: projects.sort((a, b) => a.slug.localeCompare(b.slug)),
  };

  writeJson(manifestPath, manifest, dryRun);
  writeProjectIndexFiles(outputDir, orgs, projects, dryRun);
  if (prune) {
    pruneProjectOutput(outputDir, orgs, projects, dryRun);
  }
}

if (import.meta.main) {
  syncProjectDocs().catch((error) => {
    console.error('[sync-project-docs] Failed', error);
    process.exit(1);
  });
}

function loadConfig(): Config {
  const configPath = path.join(APP_ROOT, 'projects.config.json');
  if (!fs.existsSync(configPath)) {
    return { orgs: [] };
  }
  return JSON.parse(fs.readFileSync(configPath, 'utf8')) as Config;
}

function resolveOrgs(config: Config): string[] {
  const envOrgs = process.env.HANZO_DOCS_ORGS;
  if (envOrgs) {
    return envOrgs
      .split(',')
      .map((org) => org.trim())
      .filter(Boolean);
  }
  return (config.orgs ?? []).map((org) => org.trim()).filter(Boolean);
}

function expandHome(input: string): string {
  if (input === '~') return os.homedir();
  if (input.startsWith('~/')) {
    return path.join(os.homedir(), input.slice(2));
  }
  return input;
}

function resolveRepoPath(target: string): string {
  if (path.isAbsolute(target)) return target;
  return path.join(REPO_ROOT, target);
}

function ensureDir(dir: string, dryRun: boolean) {
  if (dryRun) return;
  fs.mkdirSync(dir, { recursive: true });
}

// ONE CREDENTIAL, asked for by org, for every GitHub read in this file.
//
// A GitHub App installation token is preferred wherever the App is configured,
// because the quota it spends belongs to the installation rather than to a
// person. With no credential at all the sync gets 60 requests an hour and stops
// partway through the READMEs -- which is what it did, reporting `Request quota
// exhausted` and then rendering the pages it had.
//
// The App is the same one cloud's integrations product uses, so it is named the
// same way (GITHUB_APP_ID + GITHUB_APP_PRIVATE_KEY) and there is one spelling of
// it in the estate. Anything that goes wrong reaching it falls back to the token
// the caller already had: an App that cannot be asked is a reason to use the
// other credential, never a reason to fail the build.
const credentials = new Map<string, Promise<string | undefined>>();

function credential(org: string): Promise<string | undefined> {
  let token = credentials.get(org);
  if (!token) {
    token = mintCredential(org);
    credentials.set(org, token);
  }
  return token;
}

async function mintCredential(org: string): Promise<string | undefined> {
  const token = process.env.GITHUB_TOKEN || process.env.GH_TOKEN || process.env.GH_PAT;
  const appId = process.env.GITHUB_APP_ID?.trim();
  const privateKey = process.env.GITHUB_APP_PRIVATE_KEY?.trim();
  if (!appId || !privateKey) return token;
  try {
    const { App } = await import('octokit');
    const app = new App({ appId, privateKey: privateKey.replace(/\\n/g, '\n') });
    const installation = await app.octokit.request('GET /orgs/{org}/installation', { org });
    const installed = await app.getInstallationOctokit(installation.data.id);
    const auth = (await installed.auth({ type: 'installation' })) as { token?: string };
    return auth?.token ?? token;
  } catch (error) {
    console.warn(`[projects] ${org}: the App could not be asked (${(error as Error).message}); using the configured token`);
    return token;
  }
}

async function createOctokit(org: string): Promise<Octokit> {
  // Dynamic import so the octokit dep tree only loads when the sync
  // step is actually running. Avoids a bun-vs-pnpm-symlink ENOENT at
  // top-level import time during local builds with HANZO_DOCS_SYNC=0.
  const { Octokit } = await import('octokit');
  return new Octokit({ auth: (await credential(org)) || undefined });
}

async function listOrgRepos(octokit: Octokit, org: string) {
  const repos: Array<{
    name: string;
    description: string | null;
    archived: boolean;
    visibility?: string;
    private?: boolean;
    html_url: string;
    default_branch: string;
    // Whose work this is, and on what terms. The listing already returns all
    // three; they were dropped, which is why a page could present a fork of
    // somebody else's project as ours with no attribution and no licence.
    fork: boolean;
    license: string | null;
    homepage: string | null;
    language: string | null;
  }> = [];

  let page = 1;
  while (true) {
    const response = await octokit.request('GET /orgs/{org}/repos', {
      org,
      per_page: 100,
      page,
      type: 'all',
      sort: 'full_name',
      direction: 'asc',
      headers: {
        accept: 'application/vnd.github+json',
        'x-github-api-version': '2022-11-28',
      },
    });

    const data = response.data;
    if (!data.length) break;

    for (const repo of data) {
      repos.push({
        name: repo.name,
        description: repo.description,
        archived: repo.archived,
        visibility: (repo as { visibility?: string }).visibility,
        private: repo.private,
        html_url: repo.html_url,
        default_branch: repo.default_branch,
        fork: repo.fork === true,
        license: (repo as { license?: { spdx_id?: string } }).license?.spdx_id ?? null,
        homepage: (repo as { homepage?: string | null }).homepage ?? null,
        language: (repo as { language?: string | null }).language ?? null,
      });
    }

    if (data.length < 100) break;
    page += 1;
  }

  return repos;
}

/** The repo's README, rendered as the project page when it ships no docs/ dir. */
async function readReadme(octokit: Octokit | undefined, org: string, repo: string): Promise<string | null> {
  if (!octokit) return null;
  try {
    const r = await octokit.request('GET /repos/{owner}/{repo}/readme', {
      owner: org,
      repo,
      headers: { accept: 'application/vnd.github.raw+json' },
    });
    return typeof r.data === 'string' ? r.data : null;
  } catch {
    // No README, or unreadable. The page falls back to the description.
    return null;
  }
}

/** Whose work a fork is, and on what terms. The org listing does not carry it. */
async function upstreamOf(
  octokit: Octokit | undefined,
  org: string,
  repo: string,
): Promise<{ parent: string; license: string | null } | null> {
  if (!octokit) return null;
  try {
    const r = await octokit.request('GET /repos/{owner}/{repo}', { owner: org, repo });
    const parent = (r.data as { parent?: { full_name?: string; license?: { spdx_id?: string } } }).parent;
    if (!parent?.full_name) return null;
    return { parent: parent.full_name, license: parent.license?.spdx_id ?? null };
  } catch {
    return null;
  }
}

async function syncRepoDocs({
  org,
  repo,
  outputDir,
  localRoot,
  docsCandidates,
  fetchRemote,
  dryRun,
  octokit,
}: {
  org: string;
  repo: {
    name: string;
    description: string | null;
    archived: boolean;
    visibility?: string;
    private?: boolean;
    html_url: string;
    default_branch: string;
    fork?: boolean;
    license?: string | null;
    homepage?: string | null;
    language?: string | null;
  };
  outputDir: string;
  localRoot: string;
  docsCandidates: string[];
  fetchRemote: boolean;
  dryRun: boolean;
  octokit?: Octokit;
}): Promise<RepoRecord> {
  const slug = repo.name;
  const route = `/docs/projects/${org}/${slug}`;
  const outputRepoDir = path.join(outputDir, org, slug);

  let docsPath: string | null = null;
  const localRepoPath = path.join(localRoot, repo.name);

  if (fs.existsSync(localRepoPath)) {
    docsPath = findDocsPath(localRepoPath, docsCandidates);
    if (docsPath) {
      copyDocs({
        sourceDir: docsPath,
        destDir: outputRepoDir,
        dryRun,
      });
    }
  }

  if (!docsPath && fetchRemote) {
    docsPath = await fetchDocsFromRemote({
      org,
      repo,
      docsCandidates,
      destDir: outputRepoDir,
      dryRun,
    });
  }

  ensureDir(outputRepoDir, dryRun);
  if (!docsPath) {
    const [readme, lineage] = await Promise.all([
      readReadme(octokit, org, repo.name),
      repo.fork ? upstreamOf(octokit, org, repo.name) : Promise.resolve(null),
    ]);
    writeFallbackDocs(
      outputRepoDir,
      org,
      { ...repo, upstream: lineage?.parent ?? null, upstreamLicense: lineage?.license ?? null },
      dryRun,
      readme,
    );
  }
  else ensureLanding(outputRepoDir, repo.name, repo.description, dryRun);
  writeProjectMeta(outputRepoDir, repo.name, repo.description, dryRun);

  return {
    org,
    repo: repo.name,
    slug,
    name: humanize(repo.name),
    description: repo.description,
    archived: repo.archived,
    repoUrl: repo.html_url,
    route,
  };
}

function findDocsPath(repoPath: string, candidates: string[]): string | null {
  for (const candidate of candidates) {
    const target = path.join(repoPath, candidate);
    if (fs.existsSync(target) && fs.statSync(target).isDirectory()) {
      return target;
    }
  }

  const overridePath = path.join(repoPath, 'hanzo.docs.json');
  if (fs.existsSync(overridePath)) {
    try {
      const override = JSON.parse(fs.readFileSync(overridePath, 'utf8')) as { docsPath?: string };
      if (override.docsPath) {
        const candidate = path.join(repoPath, override.docsPath);
        if (fs.existsSync(candidate) && fs.statSync(candidate).isDirectory()) {
          return candidate;
        }
      }
    } catch {
      // ignore
    }
  }

  return null;
}

function copyDocs({ sourceDir, destDir, dryRun }: { sourceDir: string; destDir: string; dryRun: boolean }) {
  if (dryRun) return;
  fs.rmSync(destDir, { recursive: true, force: true });
  fs.mkdirSync(destDir, { recursive: true });
  fs.cpSync(sourceDir, destDir, {
    recursive: true,
    filter: (filePath) => {
      const base = path.basename(filePath);
      if (base === 'node_modules' || base === '.git' || base === '.next') return false;
      if (base === 'dist' || base === 'build' || base === 'out') return false;
      return true;
    },
  });
}

async function fetchDocsFromRemote({
  org,
  repo,
  docsCandidates,
  destDir,
  dryRun,
}: {
  org: string;
  repo: {
    name: string;
    default_branch: string;
  };
  docsCandidates: string[];
  destDir: string;
  dryRun: boolean;
}): Promise<string | null> {
  if (dryRun) return null;

  const tarballUrl = `https://codeload.github.com/${org}/${repo.name}/tar.gz/${repo.default_branch}`;

  const headers: Record<string, string> = {};
  const token = await credential(org);
  if (token) headers.Authorization = `token ${token}`;

  for (let attempt = 1; attempt <= 2; attempt += 1) {
    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), `hanzo-docs-${repo.name}-`));
    const archivePath = path.join(tmpDir, 'repo.tgz');

    try {
      const response = await fetch(tarballUrl, { headers });
      if (!response.ok) {
        fs.rmSync(tmpDir, { recursive: true, force: true });
        return null;
      }

      const buffer = Buffer.from(await response.arrayBuffer());
      fs.writeFileSync(archivePath, buffer);
      execFileSync('tar', ['-xzf', archivePath, '-C', tmpDir]);

      const extractedRoot = fs
        .readdirSync(tmpDir)
        .find((entry) => entry.startsWith(`${repo.name}-`));

      if (!extractedRoot) {
        fs.rmSync(tmpDir, { recursive: true, force: true });
        return null;
      }

      const repoRoot = path.join(tmpDir, extractedRoot);
      const docsPath = findDocsPath(repoRoot, docsCandidates);

      if (docsPath) {
        copyDocs({ sourceDir: docsPath, destDir, dryRun: false });
      }

      fs.rmSync(tmpDir, { recursive: true, force: true });
      return docsPath;
    } catch (error) {
      fs.rmSync(tmpDir, { recursive: true, force: true });
      if (attempt === 2) {
        console.warn(`[sync-project-docs] Remote fetch failed for ${org}/${repo.name}.`);
        return null;
      }
    }
  }

  return null;
}

/**
 * What a project page carries when the repo ships no docs/ directory.
 *
 * It used to say "Docs are not available yet for this project" — true of the
 * docs directory and false of the project, which has a README describing it.
 * A reader who followed a link from the Open source rail was told nothing and
 * sent to GitHub to find out.
 *
 * So: the README is the page. On top of it go the two things a README does not
 * know — where the work came from, and on what terms — because a page that
 * presents somebody else's project under our org with neither is a claim we
 * should not be making. 83 of the public repos are forks.
 */
function writeFallbackDocs(
  destDir: string,
  org: string,
  repo: {
    name: string;
    description: string | null;
    html_url: string;
    fork?: boolean;
    license?: string | null;
    homepage?: string | null;
    upstream?: string | null;
    upstreamLicense?: string | null;
  },
  dryRun: boolean,
  readme?: string | null,
) {
  const title = humanize(repo.name);
  const description = repo.description ?? `Documentation for ${title}.`;

  const L: string[] = [];
  L.push('---');
  L.push(`title: ${escapeYaml(title)}`);
  L.push(`description: ${escapeYaml(description)}`);
  L.push('---');
  L.push('');

  // A fork says whose work it is BEFORE the work, not in a footnote.
  if (repo.fork && repo.upstream) {
    const terms = repo.upstreamLicense && repo.upstreamLicense !== 'NOASSERTION' ? repo.upstreamLicense : null;
    L.push(
      `> Forked from [${repo.upstream}](https://github.com/${repo.upstream})` +
        (terms ? `, under ${terms}.` : '.') +
        ' Upstream holds the copyright; changes here are ours.',
    );
    L.push('');
  }

  if (readme && readme.trim()) {
    // The README's own H1 repeats the title the page already renders.
    L.push(readme.replace(/^#\s+.*\n+/, '').trim());
  } else {
    L.push(`# ${title}`);
    L.push('');
    L.push(description);
  }

  L.push('');
  L.push('## Links');
  L.push('');
  L.push(`- [Source](${repo.html_url})`);
  if (repo.homepage && /^https?:\/\//.test(repo.homepage)) L.push(`- [Project site](${repo.homepage})`);
  // Terms only where they are detectable. NOASSERTION is GitHub failing to
  // identify a licence, which is not a licence — saying nothing beats guessing.
  if (repo.license && repo.license !== 'NOASSERTION') L.push(`- Licence: ${repo.license}`);

  if (dryRun) return;
  fs.mkdirSync(destDir, { recursive: true });
  fs.writeFileSync(path.join(destDir, 'index.mdx'), L.join('\n') + '\n', 'utf8');
}

function ensureLanding(destDir: string, repoName: string, description: string | null, dryRun: boolean) {
  if (dryRun) return;
  const indexPath = path.join(destDir, 'index.mdx');
  if (fs.existsSync(indexPath)) return;
  const title = humanize(repoName);
  const body = `---\ntitle: ${escapeYaml(title)}\ndescription: ${escapeYaml(description ?? `Documentation for ${title}.`)}\n---\n\n# ${title}\n\nDocumentation imported from repository content.`;
  fs.writeFileSync(indexPath, body, 'utf8');
}

/**
 * ONE ROW PER PROJECT.
 *
 * `pages` decides what the rail shows, and an EMPTY list is not the same as no
 * list. No `pages` means "every child", recursively — that is how one synced
 * repo puts 762 rows ten levels deep into a rail of 113 projects. `["index"]`
 * looks like the fix and is not: naming the index takes it OUT of the folder's
 * index slot and puts it back as a child, so the project row stops being a link
 * and grows a second row with the same name under it. Measured over the 278
 * project folders on disk: 556 rows, two per project, every one wearing a
 * chevron that opens a list of one.
 *
 * `[]` keeps the index in its slot and gives the folder no children, so the row
 * IS the project page. `collapsible: false` drops the chevron, so it reads as
 * the link it is rather than a disclosure that opens nothing.
 *
 * Written unconditionally, and last, because the shape of our rail is not a
 * decision a synced repo gets to make. A vendored meta.json arrives with the
 * copied docs and carries the upstream's own navigation; three are in the tree
 * today (`ai` and `index` list every child, `commerce` grafts four upstream
 * rows), and under the old `ensureBaseMeta` — which wrote only when no file was
 * there — the next repo to add one changed this sidebar without touching this
 * repo. Its title and description are kept: upstream names the project ("Hanzo
 * Commerce" beats humanize()'s "Commerce"), we decide the rail.
 *
 * The pages underneath stay published. A route comes from a file being in the
 * collection — `source.getPages()`, which reads the file list and never a
 * meta.json — which is why the sitemap, the search index, llms.txt and
 * llms-full.txt all read the pages rather than the tree. The same shape already
 * generates the API reference, where the `openapi/ai` folder publishes 296
 * operation pages behind a single row.
 */
function writeProjectMeta(destDir: string, repoName: string, description: string | null, dryRun: boolean) {
  if (dryRun) return;
  const metaPath = path.join(destDir, 'meta.json');
  let vendored: { title?: string; description?: string } = {};
  if (fs.existsSync(metaPath)) {
    try {
      vendored = JSON.parse(fs.readFileSync(metaPath, 'utf8'));
    } catch {
      // malformed upstream meta: ours stands
    }
  }
  fs.writeFileSync(
    metaPath,
    JSON.stringify(
      {
        title: vendored.title ?? humanize(repoName),
        description: vendored.description ?? description ?? undefined,
        pages: [],
        collapsible: false,
      },
      null,
      2,
    ) + '\n',
    'utf8',
  );
}

function applyPageRenames(
  outputDir: string,
  orgs: string[],
  projects: RepoRecord[],
  renames: Record<string, string>,
) {
  const renameEntries = Object.entries(renames);
  if (renameEntries.length === 0) return;

  for (const [oldSlug, newSlug] of renameEntries) {
    for (const org of orgs) {
      const oldDir = path.join(outputDir, org, oldSlug);
      const newDir = path.join(outputDir, org, newSlug);

      if (fs.existsSync(oldDir)) {
        fs.rmSync(newDir, { recursive: true, force: true });
        fs.renameSync(oldDir, newDir);
        console.log(`[sync-project-docs] Renamed ${org}/${oldSlug} -> ${org}/${newSlug}`);

        // Update the inner meta.json title to match the new slug
        const innerMeta = path.join(newDir, 'meta.json');
        if (fs.existsSync(innerMeta)) {
          try {
            const meta = JSON.parse(fs.readFileSync(innerMeta, 'utf8'));
            meta.title = humanize(newSlug);
            fs.writeFileSync(innerMeta, JSON.stringify(meta, null, 2), 'utf8');
          } catch {
            // ignore malformed meta.json
          }
        }
      }
    }

    // Update the project record in-place so meta.json and manifest reflect the new name
    for (const project of projects) {
      if (project.slug === oldSlug) {
        project.slug = newSlug;
        project.name = humanize(newSlug);
        project.route = `/docs/projects/${project.org}/${newSlug}`;
      }
    }
  }
}

function writeProjectIndexFiles(outputDir: string, orgs: string[], projects: RepoRecord[], dryRun: boolean) {
  const projectsRoot = outputDir;
  // ONE org means the org folder can only ever have one value, and a rail level
  // with one child says nothing — it read "Projects › hanzoai › arc", three
  // clicks deep to reach a project whose org was never in question.
  //
  // The level is collapsed in the SIDEBAR and nowhere else: the files stay at
  // projects/<org>/<slug>, so every /docs/projects/hanzoai/... URL that has ever
  // been linked still resolves. Fumadocs takes a nested path in `pages`, so the
  // root names each project directly and the org folder is simply not listed.
  //
  // It comes back on its own the day a second org is configured, because then
  // the level distinguishes something. That is why this branches on the count
  // rather than deleting the dimension.
  const flat = orgs.length === 1;
  const rootMeta = {
    title: 'Projects',
    description: 'Documentation for all Hanzo projects.',
    pages: flat
      ? [
          'index',
          ...projects
            .filter((project) => project.org === orgs[0])
            .sort((a, b) => a.slug.localeCompare(b.slug))
            .map((project) => `${orgs[0]}/${project.slug}`),
        ]
      : ['index', ...orgs],
  };

  if (!dryRun) {
    fs.mkdirSync(projectsRoot, { recursive: true });
    fs.writeFileSync(path.join(projectsRoot, 'meta.json'), JSON.stringify(rootMeta, null, 2), 'utf8');
    fs.writeFileSync(path.join(projectsRoot, 'index.mdx'), buildRootIndex(), 'utf8');
  }

  for (const org of orgs) {
    const orgProjects = projects
      .filter((project) => project.org === org)
      .sort((a, b) => a.slug.localeCompare(b.slug));

    const orgDir = path.join(projectsRoot, org);
    const orgMeta = {
      title: org,
      description: `Projects in the ${org} organization.`,
      pages: ['index', ...orgProjects.map((project) => project.slug)],
    };

    if (!dryRun) {
      fs.mkdirSync(orgDir, { recursive: true });
      fs.writeFileSync(path.join(orgDir, 'meta.json'), JSON.stringify(orgMeta, null, 2), 'utf8');
      fs.writeFileSync(path.join(orgDir, 'index.mdx'), buildOrgIndex(org, orgProjects), 'utf8');
    }
  }
}

function pruneProjectOutput(outputDir: string, orgs: string[], projects: RepoRecord[], dryRun: boolean) {
  const allowed = new Set(projects.map((project) => `${project.org}/${project.slug}`));

  for (const entry of fs.readdirSync(outputDir, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const org = entry.name;
    const orgPath = path.join(outputDir, org);

    if (!orgs.includes(org)) {
      if (!dryRun) fs.rmSync(orgPath, { recursive: true, force: true });
      continue;
    }

    for (const repoEntry of fs.readdirSync(orgPath, { withFileTypes: true })) {
      // Files are pruned too. A project is a FOLDER here, but an older
      // generation of this sync wrote `<slug>.mdx` at the org root, and those
      // resolve to the same route as `<slug>/index.mdx` — 47 slugs were served
      // by two files, and 27 of the flat ones said "Docs are not available yet"
      // while the folder beside them held the actual documentation. Skipping
      // files meant prune could never reach them, so the duplicate could only
      // ever be removed by hand.
      const name = repoEntry.isDirectory() ? repoEntry.name : repoEntry.name.replace(/\.mdx?$/, '');
      // The org's own index and meta are ours, not a project's.
      if (!repoEntry.isDirectory() && (name === 'index' || name === 'meta')) continue;
      const key = `${org}/${name}`;
      if (!allowed.has(key) || (!repoEntry.isDirectory() && fs.existsSync(path.join(orgPath, name, 'index.mdx')))) {
        if (!dryRun) fs.rmSync(path.join(orgPath, repoEntry.name), { recursive: true, force: true });
      }
    }
  }
}

async function runWithConcurrency<T>(tasks: Array<() => Promise<T>>, limit: number): Promise<T[]> {
  const results: T[] = [];
  let index = 0;

  const runners = Array.from({ length: Math.min(limit, tasks.length) }).map(async () => {
    while (index < tasks.length) {
      const current = index;
      index += 1;
      results[current] = await tasks[current]();
    }
  });

  await Promise.all(runners);
  return results;
}

function buildRootIndex() {
  return `---\ntitle: Projects\ndescription: Aggregated documentation across Hanzo organizations.\n---\n\n# Projects\n\nThis hub aggregates HanzoAI projects by default. Other Hanzo orgs can maintain their own\nindependent docs deployments.\n\nUse the project switcher to jump directly to a repo.`;
}

function buildOrgIndex(org: string, projects: RepoRecord[]) {
  const lines = projects
    .map((project) => `- [${project.name}](${project.route})${project.archived ? ' (archived)' : ''}`)
    .join('\n');

  return `---\ntitle: ${escapeYaml(org)}\ndescription: Projects in the ${escapeYaml(org)} organization.\n---\n\n# ${org}\n\n${lines || 'No projects found.'}`;
}

function writeJson(filePath: string, data: unknown, dryRun: boolean) {
  if (dryRun) return;
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
}

function humanize(input: string) {
  return input
    .replace(/[-_]+/g, ' ')
    .replace(/\b\w/g, (value) => value.toUpperCase());
}

function escapeYaml(input: string) {
  return input.replace(/:/g, '\\:');
}
