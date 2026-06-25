import { storyTranslations } from '@hanzo/docs-story/i18n';
import { defineI18n } from '@hanzo/docs-core/i18n';
import { openapiTranslations } from '@hanzo/docs-openapi/i18n';
import { uiTranslations } from '@hanzo/docs-ui/i18n';
import { zhTW } from '../src/zh-tw';

const i18n = defineI18n({
  languages: ['en', 'cn'],
  defaultLanguage: 'en',
});

const t1 = i18n
  .translations()
  .extend(uiTranslations())
  .extend(openapiTranslations())
  .preset('cn', zhTW());

const t2 = i18n
  .translations()
  .extend(uiTranslations())
  .extend(openapiTranslations())
  .extend(storyTranslations())
  .preset('cn', zhTW());

console.log(t1, t2);
