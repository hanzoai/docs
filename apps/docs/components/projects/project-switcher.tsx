'use client';

import { useMemo } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import projectsManifest from '@/projects.json';

type Project = {
  org: string;
  repo: string;
  slug: string;
  name: string;
  description: string | null;
  archived: boolean;
  route: string;
};

type Manifest = {
  projects: Project[];
};

export function ProjectSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const manifest = projectsManifest as Manifest;
  const projects = manifest.projects ?? [];

  const grouped = useMemo(() => {
    const groups = new Map<string, Project[]>();
    for (const project of projects) {
      if (!groups.has(project.org)) groups.set(project.org, []);
      groups.get(project.org)!.push(project);
    }
    for (const entries of groups.values()) {
      entries.sort((a, b) => a.name.localeCompare(b.name));
    }
    return Array.from(groups.entries()).sort((a, b) => a[0].localeCompare(b[0]));
  }, [projects]);

  if (projects.length === 0) return null;

  const current = findCurrentProject(projects, pathname ?? '');
  const value = current?.route ?? '/docs/projects';

  return (
    <div className="flex flex-col gap-1">
      <span className="text-xs font-semibold uppercase tracking-wide text-fd-muted-foreground">
        Project
      </span>
      <select
        value={value}
        onChange={(event) => {
          const next = event.target.value;
          if (next) router.push(next);
        }}
        className="h-9 rounded-md border border-fd-border bg-fd-background px-2 text-sm text-fd-foreground"
        aria-label="Project switcher"
      >
        <option value="/docs/projects">All Projects</option>
        {grouped.map(([org, orgProjects]) => (
          <optgroup key={org} label={org}>
            {orgProjects.map((project) => (
              <option key={project.slug} value={project.route}>
                {project.name}{project.archived ? ' (archived)' : ''}
              </option>
            ))}
          </optgroup>
        ))}
      </select>
    </div>
  );
}

function findCurrentProject(projects: Project[], pathname: string) {
  let best: Project | null = null;
  for (const project of projects) {
    if (pathname.startsWith(project.route)) {
      if (!best || project.route.length > best.route.length) {
        best = project;
      }
    }
  }
  return best;
}
