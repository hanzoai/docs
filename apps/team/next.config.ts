import type { NextConfig } from 'next';

const config: NextConfig = {
  // Both ship ESM with 'use client' boundaries, so the client/server split
  // and the JSX runtime resolve only when the app build compiles them.
  transpilePackages: ['@hanzogui/shell', '@hanzo/brand'],
  output: 'standalone',
  reactStrictMode: true,
};

export default config;
