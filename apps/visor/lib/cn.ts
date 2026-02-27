import { twMerge } from 'tailwind-merge';
import { type ClassValue, cx } from 'class-variance-authority';

export function cn(...inputs: ClassValue[]) {
  return twMerge(cx(...inputs));
}
