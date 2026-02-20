/**
 * Frontmatter parser - inspired by gray-matter
 */
import { load } from 'js-yaml';

interface FrontmatterOutput {
  /**
   * The frontmatter section, including the delimiter.
   */
  matter: string;
  content: string;
  data: unknown;
}

const regex = /^---\r?\n(.+?)\r?\n---\r?\n?/s;

/**
 * Strip null values from a plain object (YAML null !== JS undefined).
 * Zod `.optional()` accepts `undefined` but rejects `null`, so we
 * normalise at the YAML boundary.
 */
function stripNulls(obj: Record<string, unknown>): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(obj)) {
    if (v !== null) out[k] = v;
  }
  return out;
}

/**
 * Parse YAML frontmatter from markdown content.
 *
 * Resilient to malformed YAML: on parse failure the frontmatter is
 * silently dropped and downstream fallbacks (e.g. filename-derived
 * title) take over.
 */
export function parseFrontmatter(input: string): FrontmatterOutput {
  const output: FrontmatterOutput = { matter: '', data: {}, content: input };
  const match = regex.exec(input);
  if (!match) {
    return output;
  }

  // get the raw front-matter block
  output.matter = match[0];
  output.content = input.slice(match[0].length);

  try {
    const loaded = load(match[1]);
    output.data =
      loaded && typeof loaded === 'object' && !Array.isArray(loaded)
        ? stripNulls(loaded as Record<string, unknown>)
        : loaded ?? {};
  } catch (e) {
    // Malformed YAML (bad indentation, unquoted special chars, etc.)
    // Return empty data so filename-derived defaults are used instead.
    console.warn(
      `[MDX] failed to parse frontmatter YAML, using defaults: ${
        e instanceof Error ? e.message : String(e)
      }`,
    );
    output.data = {};
  }

  return output;
}
