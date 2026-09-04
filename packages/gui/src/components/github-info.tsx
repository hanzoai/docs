import * as React from 'react';

export function GitHubInfo({ repo }: { repo: string }) {
  return <a href={`https://github.com/${repo}`} target="_blank" rel="noreferrer">{repo}</a>;
}
