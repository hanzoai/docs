import { execSync } from 'child_process';

console.log('Running pre-build...');
try {
  execSync('npx @hanzo/docs-mdx', { stdio: 'inherit' });
  console.log('Pre-build complete');
} catch (error) {
  console.error('Pre-build failed:', error);
  process.exit(1);
}
