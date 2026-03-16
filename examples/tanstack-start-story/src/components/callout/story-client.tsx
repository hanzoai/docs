import { createStoryClient } from '@hanzo/docs-story/client';
import { CalloutStory } from '.';
import type { story } from './story';

export const storyClient = createStoryClient<typeof story>({
  Component: CalloutStory,
});
