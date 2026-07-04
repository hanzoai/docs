'use client';

import type { ReactNode } from 'react';
import type { FeedbackBlockProps } from '@hanzo/docs-core/mdx-plugins/remark-feedback-block';
import { Feedback as FeedbackInner, FeedbackText as FeedbackBlockInner } from './client';
import type { ActionResponse, BlockFeedback, PageFeedback } from './schema';

async function mockPageAction(feedback: PageFeedback): Promise<ActionResponse> {
  console.log('Feedback submitted (static export):', feedback);
  return { githubUrl: '#' };
}

async function mockBlockAction(feedback: BlockFeedback): Promise<ActionResponse> {
  console.log('Block feedback submitted (static export):', feedback);
  return { githubUrl: '#' };
}

export function PageFeedback() {
  return <FeedbackInner onSendAction={mockPageAction} />;
}

export function PageFeedbackBlock({
  children,
  ...props
}: FeedbackBlockProps & { children: ReactNode }) {
  return (
    <FeedbackBlockInner {...props} onSendAction={mockBlockAction}>
      {children}
    </FeedbackBlockInner>
  );
}
