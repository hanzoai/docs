import * as React from 'react';

export function ImageZoom(props: any) {
  return <img {...props} style={{ maxWidth: '100%', height: 'auto', borderRadius: '0.5rem' }} />;
}
