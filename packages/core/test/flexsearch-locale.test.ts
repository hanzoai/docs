import { describe, expect, test } from 'vitest';
import { pickFlexsearchIndex } from '../src/search/client/flexsearch-static';

function index(id: string) {
  return { id };
}

describe('flexsearch locale fallback', () => {
  const loaded = new Map([
    ['en', index('en')],
    ['es', index('es')],
  ]);

  test('uses the requested locale when that index exists', () => {
    expect(pickFlexsearchIndex(loaded, 'es')).toBe(loaded.get('es'));
  });

  test('falls back to English when the locale is missing or omitted', () => {
    expect(pickFlexsearchIndex(loaded, 'ar')).toBe(loaded.get('en'));
    expect(pickFlexsearchIndex(loaded, '')).toBe(loaded.get('en'));
  });
});
