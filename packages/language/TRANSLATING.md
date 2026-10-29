# Translating Hanzo Docs

English is the source language. UI chrome for every supported locale lives in
`packages/language`. A site opts in by listing the locales and applying the packs:

```ts
import { defineI18n } from '@hanzo/docs-core/i18n';
import { uiTranslations } from '@hanzo/docs-ui/i18n';
import { applyLanguagePresets, supportedLocales } from '@hanzo/docs-language/presets';

export const i18n = defineI18n({
  defaultLanguage: 'en',
  languages: [...supportedLocales],
  hideLocale: 'default-locale',
  fallbackLanguage: null,
});

export const translations = applyLanguagePresets(
  i18n.translations().extend(uiTranslations()),
);
```

`extend()` installs the English catalog. `applyLanguagePresets()` overlays a
locale only where that locale has a string. Empty or missing keys render in
English (`withEnglishFallback`).

`<html lang>` should use the locale code (`pt-BR`, `zh-CN`). `<html dir>` is
`rtl` for Arabic. `RootProvider` sets direction from `i18n.locale` when `dir`
is omitted.

## Long-form pages

Translated MDX sits next to the English file. The dot parser reads the locale
from the filename:

```
content/docs/quickstart.mdx
content/docs/quickstart.es.mdx
content/docs/quickstart.zh-CN.mdx
```

Do not translate product names (Hanzo, Enso, Kai, Lux, Zoo, Zen), code,
commands, URLs, or frontmatter keys.

To fill pages that are still English-only:

```bash
export HANZO_API_KEY=...          # or OPENAI_API_KEY
export HANZO_API_BASE=https://api.hanzo.ai/v1   # optional
export HANZO_TRANSLATE_MODEL=gpt-4o-mini        # optional

node scripts/translate-mdx.mjs --check
node scripts/translate-mdx.mjs --root apps/docs/content/docs --locales es,ja --limit 10
```

`--check` lists pages that have no translation yet and does not call the API.
The script skips files that already exist.
