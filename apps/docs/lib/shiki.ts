/**
 * The code theme, stated once.
 *
 * This file already existed and already said `vesper`, and the site did not use
 * it: `source.config.ts` passed `shikiConfig` in one place and then restated
 * `catppuccin-latte`/`catppuccin-mocha` inline in its two `rehypeCodeOptions`
 * blocks, which is what actually rendered. The file named for the theme lost to
 * a literal written next to it. Everything imports `CODE_THEME` now, so there is
 * one answer and changing it changes the site.
 *
 * WHY NOT CATPPUCCIN. Two reasons, and the second is the one a reader feels.
 * It is a twelve-hue palette on a site that is otherwise near-black, #e5e5e5 and
 * nothing else — a paragraph of restrained grey followed by a code block in
 * mauve, peach, teal and pink reads as two designs. And it italicises 24 scopes
 * against vesper's 7, which on a shell command is not decoration but noise: the
 * quickstart rendered `npm i -g hanzo` and `hanzo auth login` with the command
 * word slanted, because the bash grammar marks the first word as a function and
 * the theme slants functions. A monospace command in italics looks like a
 * rendering fault, and it was the first code anyone saw on the page.
 *
 * Vesper is warm greys with a small number of accents and no slant on a command,
 * which is what a documentation code block wants: the language legible, the
 * emphasis rare, and the block quiet enough that the prose around it still leads.
 */
export const CODE_THEME = {
  light: 'github-light',
  dark: 'vesper',
} as const

/** Shape shiki/rehype-code want: `{ themes }`. One object, so no caller spells the pair. */
export const shikiConfig = { themes: CODE_THEME }

/** The former name. Kept because `source.config.ts` imports it. */
export const defaultShikiOptions = shikiConfig
