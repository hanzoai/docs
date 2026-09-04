import * as React from 'react';
import type { ButtonHTMLAttributes } from 'react';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

export function Button({ variant = 'primary', size = 'md', style, children, ...props }: ButtonProps) {
  const styles: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '0.5rem',
    fontWeight: 500,
    cursor: 'pointer',
    border: 'none',
    transition: 'all 0.15s ease',
    padding: size === 'sm' ? '0.25rem 0.5rem' : size === 'lg' ? '0.75rem 1.5rem' : '0.5rem 1rem',
    fontSize: size === 'sm' ? '0.75rem' : size === 'lg' ? '1rem' : '0.875rem',
    background: variant === 'primary' ? '#3b82f6' : variant === 'secondary' ? '#27272a' : 'transparent',
    color: '#fff',
    borderWidth: variant === 'outline' ? '1px' : 0,
    borderStyle: variant === 'outline' ? 'solid' : 'none',
    borderColor: '#3f3f46',
    ...style,
  };

  return (
    <button {...props} style={styles}>
      {children}
    </button>
  );
}

export const buttonVariants = () => '';
