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

/**
 * A Go package doc opens with the package's own name — `gofmt` and every linter
 * require it — so the synopsis every product page is cut from arrives as
 * "Package ads is your paid ad campaigns". That sentence is correct Go and wrong
 * product prose twice over: it names an identifier no caller can see, and where
 * the package is not named after the capability it names the WRONG one
 * (`hanzo audit` read "Package auditlog is …", `hanzo authz` read "Package serve
 * is …").
 *
 * The convention is stripped where it is READ rather than fixed where it is
 * written, because it is not wrong where it is written. Same shape as zip
 * dropping a handler's own name from a lifted doc comment.
 *
 * Only an exact leading match goes: "Package <ident> is " or "Package <ident> ",
 * and what follows is re-capitalised. Prose that merely opens with the word
 * "Package" — a sentence about packaging — keeps it.
 */
export const unpackage = (s: string): string => {
  const m = String(s ?? '').match(/^Package\s+([A-Za-z_][A-Za-z0-9_]*)\s+(is\s+)?/);
  if (!m) return String(s ?? '');
  const rest = String(s).slice(m[0].length);
  return rest ? rest[0].toUpperCase() + rest.slice(1) : '';
};

/**
 * The first sentence, for a description or a card blurb.
 *
 * A sentence that fits comes back whole. One that does not is cut at the last
 * sentence boundary inside the budget, and where the budget holds no boundary,
 * at a word boundary with an ellipsis. The ellipsis is the point: a cell cut
 * mid-clause otherwise reads as a complete sentence the source never wrote, and
 * a reader has no way to tell there is more.
 */
export const firstSentence = (s: string, max = 200): string => {
  const t = String(s ?? '').replace(/\s+/g, ' ').trim();
  if (t.length <= max) {
    const m = t.match(/^(.+?[.!?])(\s|$)/);
    return (m ? m[1] : t).trim();
  }
  const head = t.slice(0, max);
  const stop = head.lastIndexOf('. ');
  if (stop > 40) return head.slice(0, stop + 1).trim();
  const word = head.lastIndexOf(' ');
  return (word > 40 ? head.slice(0, word) : head).trim() + '…';
};

export const fence = (lang: string, body: string): string[] => ['```' + lang, body, '```'];
