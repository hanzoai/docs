import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Octokit } from 'octokit';

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

  const octokit = createOctokit();
  const projects: RepoRecord[] = [];

  ensureDir(outputDir, dryRun);

  for (const org of orgs) {
    const repos = await listOrgRepos(octokit, org);
    const tasks = repos
      .filter((repo) => !excludeRepos.has(repo.name))
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

function createOctokit() {
  const token = process.env.GITHUB_TOKEN || process.env.GH_TOKEN || process.env.GH_PAT;
  return new Octokit({
    auth: token || undefined,
  });
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
      });
    }

    if (data.length < 100) break;
    page += 1;
  }

  return repos;
}

async function syncRepoDocs({
  org,
  repo,
  outputDir,
  localRoot,
  docsCandidates,
  fetchRemote,
  dryRun,
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
  };
  outputDir: string;
  localRoot: string;
  docsCandidates: string[];
  fetchRemote: boolean;
  dryRun: boolean;
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

  if (!docsPath) {
    ensureDir(outputRepoDir, dryRun);
    writeFallbackDocs(outputRepoDir, org, repo, dryRun);
  } else {
    ensureBaseMeta(outputRepoDir, repo.name, repo.description, dryRun);
  }

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
  const token = process.env.GITHUB_TOKEN || process.env.GH_TOKEN || process.env.GH_PAT;
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

function writeFallbackDocs(destDir: string, org: string, repo: { name: string; description: string | null; html_url: string }, dryRun: boolean) {
  const title = humanize(repo.name);
  const description = repo.description ?? `Documentation for ${title}.`;
  const content = `---\ntitle: ${escapeYaml(title)}\ndescription: ${escapeYaml(description)}\n---\n\n# ${title}\n\nDocs are not available yet for this project.\n\n- Repository: ${repo.html_url}\n- Org: ${org}\n\nIf this repo has docs in a non-standard location, add a \`hanzo.docs.json\` file with \`docsPath\` in the repo root.`;

  if (dryRun) return;
  fs.mkdirSync(destDir, { recursive: true });
  fs.writeFileSync(path.join(destDir, 'index.mdx'), content, 'utf8');
  fs.writeFileSync(
    path.join(destDir, 'meta.json'),
    JSON.stringify({ title, description, pages: ['index'] }, null, 2),
    'utf8',
  );
}

function ensureBaseMeta(destDir: string, repoName: string, description: string | null, dryRun: boolean) {
  if (dryRun) return;
  const metaPath = path.join(destDir, 'meta.json');
  if (!fs.existsSync(metaPath)) {
    const title = humanize(repoName);
    fs.writeFileSync(
      metaPath,
      JSON.stringify({ title, description: description ?? undefined, pages: ['index'] }, null, 2),
      'utf8',
    );
  }
  const indexPath = path.join(destDir, 'index.mdx');
  if (!fs.existsSync(indexPath)) {
    const title = humanize(repoName);
    const body = `---\ntitle: ${escapeYaml(title)}\ndescription: ${escapeYaml(description ?? `Documentation for ${title}.`)}\n---\n\n# ${title}\n\nDocumentation imported from repository content.`;
    fs.writeFileSync(indexPath, body, 'utf8');
  }
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
  const rootMeta = {
    title: 'Projects',
    description: 'Documentation for all Hanzo projects.',
    pages: ['index', ...orgs],
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
      if (!repoEntry.isDirectory()) continue;
      const key = `${org}/${repoEntry.name}`;
      if (!allowed.has(key)) {
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
