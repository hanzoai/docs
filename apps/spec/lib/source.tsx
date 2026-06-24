import {
  type InferMetaType,
  type InferPageType,
  loader,
} from 'fumadocs-core/source';
import { docs } from '@/.source/index';
import { lucideIconsPlugin } from 'fumadocs-core/source/lucide-icons';

export const source = loader({
  source: docs.toSource(),
  baseUrl: '/docs',
  plugins: [lucideIconsPlugin()],
});

export type Page = InferPageType<typeof source>;
export type Meta = InferMetaType<typeof source>;
