import { execSync } from 'child_process';

console.log('Running pre-build...');

try {
  execSync('pnpm exec docs-mdx', { stdio: 'inherit' });
  console.log('Pre-build complete');
} catch (error) {
  console.warn('Pre-build warning: docs-mdx not found, skipping MDX generation');
}
