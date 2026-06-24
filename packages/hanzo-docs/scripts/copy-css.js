import { cpSync, mkdirSync, existsSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');

// Copy twoslash.css from @hanzo/docs-twoslash (styles folder)
const twoslashStylesSource = join(root, 'node_modules/@hanzo/docs-twoslash/styles');
const twoslashDistDest = join(root, 'dist/twoslash');

// Copy openapi CSS from fumadocs-openapi
const openapiCssSource = join(root, 'node_modules/fumadocs-openapi/css');
const openapiCssDest = join(root, 'dist/openapi/css');

try {
  // Copy twoslash.css if it exists
  mkdirSync(twoslashDistDest, { recursive: true });
  const twoslashCssSrc = join(twoslashStylesSource, 'twoslash.css');
  if (existsSync(twoslashCssSrc)) {
    cpSync(twoslashCssSrc, join(twoslashDistDest, 'twoslash.css'));
    console.log('Copied twoslash.css');
  }

  // Copy openapi CSS if it exists
  if (existsSync(openapiCssSource)) {
    mkdirSync(openapiCssDest, { recursive: true });
    cpSync(openapiCssSource, openapiCssDest, { recursive: true });
    console.log('Copied openapi CSS');
  }

  console.log('CSS files copied successfully');
} catch (error) {
  console.error('Error copying CSS files:', error);
  // Don't fail build if CSS copy fails - these are optional
  console.log('Continuing without CSS files');
}
