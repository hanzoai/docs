import { describe, expect, test } from 'vitest';
import { defaultTranslations } from '../src/i18n';
import { renderTranslation } from '@hanzo/docs-core/i18n';

// The Enso page action is i18n-driven: a title key and an edit-intent prompt
// rendered with the page URL. These pin the contract ViewOptionsPopover builds
// its hanzo.chat deep link from.
describe('Enso page action translations', () => {
  const url = 'https://docs.hanzo.ai/docs/cloud';

  test('title and edit prompt exist', () => {
    expect(defaultTranslations.pageActionsOpenEnso).toBe('Edit with Enso');
    expect(defaultTranslations.pageActionsEditInLLMPrompt).toContain('{url}');
  });

  test('edit prompt renders the page URL with no residue', () => {
    const rendered = renderTranslation(defaultTranslations.pageActionsEditInLLMPrompt, { url });
    expect(rendered).toContain(url);
    expect(rendered).not.toContain('{url}');
  });

  test('edit intent stays distinct from the ask intent', () => {
    const edit = renderTranslation(defaultTranslations.pageActionsEditInLLMPrompt, { url });
    const ask = renderTranslation(defaultTranslations.pageActionsOpenInLLMPrompt, { url });
    expect(edit).not.toBe(ask);
  });
});
