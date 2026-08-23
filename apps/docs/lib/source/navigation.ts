/**
 * The top-level area a page sits in, taken from its own address.
 *
 * It used to be a hand-kept table, and the table had drifted both ways:
 * four names in it (commerce, llm, mcp, services) matched no directory on
 * disk, and thirteen directories that do exist — cli, start, apps, concepts,
 * migrate, mcp-tools among them — matched nothing in it and fell to a default
 * of `services`, which is not a directory either. So the function answered
 * "services" for most of the site.
 *
 * Derived from the path now, so it cannot drift: adding a section is adding a
 * folder. Callers that want a per-section value must tolerate any section,
 * which they already do — every consumer reads it as a CSS custom property
 * with a fallback.
 */
export function getSection(path: string | undefined): string {
  if (!path) return '';
  const [dir] = path.split('/', 1);
  return dir ?? '';
}
