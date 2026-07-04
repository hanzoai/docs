#!/usr/bin/env node
/**
 * Custom CF Pages deployment script that handles large file counts
 * by batching uploads in smaller chunks to avoid EPIPE errors.
 */
import { createHash } from 'crypto';
import { readdir, readFile, stat } from 'fs/promises';
import { join, relative } from 'path';

const ACCOUNT_ID = '94a3e3f299092abb1feda2a7481ea845';
const PROJECT_NAME = 'hanzo-docs';
const API_TOKEN = process.env.CLOUDFLARE_API_TOKEN || 'bBEtGaPXpGSmvC5w2WbpE2V7zx08VDWspCS-E30g';
const BASE_URL = `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/pages/projects/${PROJECT_NAME}`;
const BATCH_SIZE = 50; // files per upload batch
const MAX_RETRIES = 3;

async function getAllFiles(dir) {
  const files = [];
  const entries = await readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...await getAllFiles(fullPath));
    } else {
      files.push(fullPath);
    }
  }
  return files;
}

async function hashFile(filePath) {
  const content = await readFile(filePath);
  const hash = createHash('sha256').update(content).digest('hex');
  return { path: filePath, hash, content, size: content.length };
}

async function apiCall(url, options = {}) {
  const resp = await fetch(url, {
    ...options,
    headers: {
      'Authorization': `Bearer ${API_TOKEN}`,
      ...options.headers,
    },
  });
  const data = await resp.json();
  if (!data.success) {
    throw new Error(`CF API error: ${JSON.stringify(data.errors)}`);
  }
  return data;
}

async function createDeployment(hashes) {
  // Step 1: Create deployment with manifest
  const manifest = {};
  for (const { relativePath, hash } of hashes) {
    manifest[`/${relativePath}`] = hash;
  }

  const formData = new FormData();
  formData.append('manifest', JSON.stringify(manifest));
  formData.append('branch', process.env.CF_PAGES_BRANCH || 'main');

  console.log(`Creating deployment with ${Object.keys(manifest).length} files...`);
  const data = await apiCall(`${BASE_URL}/deployments`, {
    method: 'POST',
    body: formData,
  });

  return data.result;
}

async function uploadBatch(files, jwt) {
  const formData = new FormData();
  for (const file of files) {
    formData.append(file.hash, new Blob([file.content]), file.relativePath);
  }

  const resp = await fetch('https://api.cloudflare.com/client/v4/pages/assets/upload', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${jwt}`,
    },
    body: formData,
  });

  if (!resp.ok) {
    const text = await resp.text();
    throw new Error(`Upload failed (${resp.status}): ${text}`);
  }

  return resp.json();
}

async function main() {
  const outDir = process.argv[2] || 'apps/docs/out';

  console.log(`Scanning ${outDir}...`);
  const allFiles = await getAllFiles(outDir);
  console.log(`Found ${allFiles.length} files`);

  // Hash all files
  console.log('Hashing files...');
  const fileInfos = await Promise.all(
    allFiles.map(async (filePath) => {
      const info = await hashFile(filePath);
      return {
        ...info,
        relativePath: relative(outDir, filePath),
      };
    })
  );

  // Create deployment (gets JWT token and list of missing files)
  const deployment = await createDeployment(fileInfos);
  console.log(`Deployment ID: ${deployment.id}`);
  console.log(`URL: ${deployment.url}`);

  const jwt = deployment.jwt;
  if (!jwt) {
    console.log('No JWT returned - all files already uploaded!');
    return;
  }

  // Find which files need uploading
  const missingHashes = new Set(deployment.required_hashes || []);
  const filesToUpload = missingHashes.size > 0
    ? fileInfos.filter(f => missingHashes.has(f.hash))
    : fileInfos; // upload all if no required_hashes returned

  console.log(`Need to upload ${filesToUpload.length} files (${fileInfos.length - filesToUpload.length} already cached)`);

  // Upload in batches
  const batches = [];
  for (let i = 0; i < filesToUpload.length; i += BATCH_SIZE) {
    batches.push(filesToUpload.slice(i, i + BATCH_SIZE));
  }

  let uploaded = 0;
  for (let i = 0; i < batches.length; i++) {
    const batch = batches[i];
    let retries = 0;
    while (retries < MAX_RETRIES) {
      try {
        await uploadBatch(batch, jwt);
        uploaded += batch.length;
        process.stdout.write(`\rUploaded ${uploaded}/${filesToUpload.length} (batch ${i + 1}/${batches.length})`);
        break;
      } catch (err) {
        retries++;
        if (retries >= MAX_RETRIES) {
          console.error(`\nFailed batch ${i + 1} after ${MAX_RETRIES} retries: ${err.message}`);
          throw err;
        }
        console.warn(`\nRetrying batch ${i + 1} (attempt ${retries + 1})...`);
        await new Promise(r => setTimeout(r, 1000 * retries));
      }
    }
  }

  console.log(`\nDeployment complete: ${deployment.url}`);
}

main().catch(err => {
  console.error('Deploy failed:', err.message);
  process.exit(1);
});
