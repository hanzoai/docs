import { execSync } from 'child_process';

console.log('Running pre-build...');

try {
  // Use node directly instead of npx — pnpm workspace links exist but bin
  // symlinks may not be created if packages weren't built before pnpm install
  execSync('node ./node_modules/fumadocs-mdx/dist/bin.js', { stdio: 'inherit' });
  console.log('Pre-build complete');
} catch (error) {
  console.error('Pre-build failed:', error);
  process.exit(1);
}
