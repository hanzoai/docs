import { describe, expect, test } from 'vitest';
import { defaultTranslations } from '@hanzo/docs-ui/i18n';
import { zhCN } from '../src/zh-cn';
import { zhTW } from '../src/zh-tw';

// Every full translation surface must carry the Enso page action: the English
// defaults and both locale packs. A locale missing the keys would silently fall
// back at runtime only if typed Partial — these packs are complete by contract.
describe('Enso page action across translation surfaces', () => {
  const surfaces = [
    ['en', defaultTranslations],
    ['zh-CN', zhCN().value.ui!],
    ['zh-TW', zhTW().value.ui!],
  ] as const;

  test.each(surfaces)('%s carries title and edit prompt', (_name, ui) => {
    expect(ui.pageActionsOpenEnso).toBeTruthy();
    expect(ui.pageActionsEditInLLMPrompt).toContain('{url}');
  });

  test.each(surfaces)('%s keeps edit and ask prompts distinct', (_name, ui) => {
    expect(ui.pageActionsEditInLLMPrompt).not.toBe(ui.pageActionsOpenInLLMPrompt);
  });
});
