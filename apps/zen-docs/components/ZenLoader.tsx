import { ZenEnso } from './ZenEnso';

interface ZenLoaderProps {
  size?: number;
  message?: string;
}

/**
 * Full-screen loading overlay using the Zen enso animation.
 */
export function ZenLoader({ size = 80, message }: ZenLoaderProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <ZenEnso size={size} animate loop />
      {message && (
        <p className="text-sm text-fd-muted-foreground animate-pulse">{message}</p>
      )}
    </div>
  );
}

export default ZenLoader;
