import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    // `apps/docs` and not `apps/*`: apps/platform/e2e holds Playwright specs,
    // which are not vitest's to run.
    projects: ['packages/*', 'apps/docs'],
  },
});
