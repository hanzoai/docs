import { describe, expect, test } from 'vitest';
import { defaultTranslations } from '@hanzo/docs-ui/i18n';
import { languagePacks } from '../src/presets';

// Every full translation surface must carry the Enso page action: the English
// defaults and every locale pack. A locale missing the keys would silently fall
// back at runtime only if typed Partial — these packs are complete by contract.
describe('Enso page action across translation surfaces', () => {
  const surfaces = [
    ['en', defaultTranslations],
    ...Object.entries(languagePacks).map(([code, load]) => [code, load().value.ui!] as const),
  ] as const;

  test.each(surfaces)('%s carries title and edit prompt', (_name, ui) => {
    expect(ui.pageActionsOpenEnso).toBeTruthy();
    expect(ui.pageActionsEditInLLMPrompt).toContain('{url}');
  });

  test.each(surfaces)('%s keeps edit and ask prompts distinct', (_name, ui) => {
    expect(ui.pageActionsEditInLLMPrompt).not.toBe(ui.pageActionsOpenInLLMPrompt);
  });
});
