// Pre-build script for Tasks docs
// Generates MDX collection files via workspace dependency

import { execSync } from 'child_process';

console.log('Running pre-build...');

try {
  // Generate MDX collections using the workspace-linked CLI
  execSync('pnpm exec docs-mdx', { stdio: 'inherit' });
  console.log('Pre-build complete');
} catch (error) {
  // docs-mdx may not be available as CLI in all environments;
  // fall through gracefully since next build can still succeed
  console.warn('Pre-build warning: docs-mdx not found, skipping MDX generation');
}
