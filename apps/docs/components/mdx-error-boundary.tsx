'use client';

import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
}

/**
 * Error boundary for MDX content rendering.
 *
 * Upstream project docs may contain constructs that fail at render time
 * (e.g. undefined variables from template placeholders, incompatible
 * component APIs, etc.). Wrapping in this boundary prevents a single
 * broken page from crashing the entire static export build.
 */
export class MdxErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.warn('[hanzo-docs] MDX render error caught by boundary:', error.message);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback ?? null;
    }
    return this.props.children;
  }
}
