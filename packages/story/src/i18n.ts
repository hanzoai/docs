import type { TranslationsAPIExtension } from '@hanzo/docs-core/i18n';

export const defaultTranslations = {
  noVariant: 'No Variant',
  props: 'Props',
  renderError: 'Encountered error when rendering the component.',
  reset: 'Reset',
  unset: 'Unset',
  booleanTrue: 'True',
  booleanFalse: 'False',
  dateInputPlaceholder: 'Enter date',
  numberInputPlaceholder: 'Enter number',
  bigintInputPlaceholder: 'Enter bigint',
  textInputPlaceholder: 'Enter text',
  arrayInputRemoveItem: 'Remove Item',
  arrayInputAddItem: 'New Item',
};

export type Translations = typeof defaultTranslations;

export function storyTranslations(): TranslationsAPIExtension<'story', Translations> {
  return {
    namespace: 'story',
    defaultValue: defaultTranslations,
  };
}
