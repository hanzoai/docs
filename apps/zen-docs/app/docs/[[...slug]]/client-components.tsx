'use client';

import dynamic from 'next/dynamic';

export const DynamicModelTable = dynamic(
  () => import('@/components/DynamicModelTable').then((m) => m.DynamicModelTable),
  { ssr: false }
);

export const DynamicCostExamples = dynamic(
  () => import('@/components/DynamicModelTable').then((m) => m.DynamicCostExamples),
  { ssr: false }
);
