// MDX SAFETY, in one place.
//
// Every generator writes MDX from prose that was written as Go doc comments or
// JSON Schema descriptions — markdown at best, and full of `{`, `<T>` and `|`,
// each of which is syntax to MDX or to a GFM table. Escaping it is the same
// problem for every generator, so it is solved once here rather than re-solved
// slightly differently in each.

/** Inline code inside a table cell: collapse newlines, escape the cell pipe. */
export const code = (s: unknown): string =>
  String(s ?? '')
    .replace(/[\r\n]+/g, ' ')
    .trim()
    .replace(/\|/g, '\\|');

/** Table or heading text: neutralise the cell pipe, JSX and MDX expressions. */
export const text = (s: unknown): string =>
  String(s ?? '')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/\|/g, '\\|')
    .replace(/[<>]/g, (c) => (c === '<' ? '&lt;' : '&gt;'))
    .replace(/[{}]/g, (c) => (c === '{' ? '&#123;' : '&#125;'));

/**
 * Running prose. Escapes MDX expressions and JSX in the narrative while leaving
 * fenced blocks and inline code spans verbatim — MDX parses neither.
 */
export function prose(s: string): string {
  if (!s) return '';
  return String(s)
    .split(/(```[\s\S]*?```|`[^`\n]*`)/g)
    .map((part, i) =>
      i % 2 === 1
        ? part
        : part
            .replace(/[{}]/g, (c) => (c === '{' ? '&#123;' : '&#125;'))
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;'),
    )
    .join('')
    .trim();
}

/** A frontmatter scalar that survives any punctuation in the source prose. */
export const yamlString = (s: string): string =>
  JSON.stringify(String(s ?? '').replace(/\s+/g, ' ').trim());

/** The first sentence, for a description or a card blurb. */
export const firstSentence = (s: string, max = 200): string => {
  const t = String(s ?? '').replace(/\s+/g, ' ').trim();
  if (t.length <= max) {
    const m = t.match(/^(.+?[.!?])(\s|$)/);
    return (m ? m[1] : t).trim();
  }
  const head = t.slice(0, max);
  const stop = head.lastIndexOf('. ');
  return (stop > 40 ? head.slice(0, stop + 1) : head).trim();
};

export const fence = (lang: string, body: string): string[] => ['```' + lang, body, '```'];
