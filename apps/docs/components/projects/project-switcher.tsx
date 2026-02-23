'use client';

import { useMemo } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { FolderOpen } from 'lucide-react';
import projectsManifest from '@/projects.json';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

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
    <div className="flex flex-col gap-1.5">
      <span className="text-xs font-semibold uppercase tracking-wide text-fd-muted-foreground">
        Project
      </span>
      <Select
        value={value}
        onValueChange={(next) => {
          if (next) router.push(next);
        }}
      >
        <SelectTrigger aria-label="Project switcher">
          <FolderOpen className="h-3.5 w-3.5 shrink-0 text-fd-muted-foreground mr-1.5" />
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="/docs/projects">All Projects</SelectItem>
          {grouped.map(([org, orgProjects], idx) => (
            <SelectGroup key={org}>
              {idx > 0 && <SelectSeparator />}
              <SelectLabel>{org}</SelectLabel>
              {orgProjects.map((project) => (
                <SelectItem key={project.slug} value={project.route}>
                  {project.name}{project.archived ? ' (archived)' : ''}
                </SelectItem>
              ))}
            </SelectGroup>
          ))}
        </SelectContent>
      </Select>
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
