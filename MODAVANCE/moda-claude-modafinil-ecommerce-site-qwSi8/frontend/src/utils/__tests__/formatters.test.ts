import { describe, expect, it } from 'vitest';
import { formatPrice, formatPricePerPill, formatDate, slugify } from '@/utils/formatters';

describe('formatPrice', () => {
  it('formats whole dollar amounts', () => {
    expect(formatPrice(139)).toBe('$139');
    expect(formatPrice(0)).toBe('$0');
    expect(formatPrice(1000)).toBe('$1,000');
  });

  it('rounds to nearest dollar (no cents shown)', () => {
    expect(formatPrice(99.99)).toBe('$100');
    expect(formatPrice(9.49)).toBe('$9');
  });
});

describe('formatPricePerPill', () => {
  it('calculates price per pill correctly', () => {
    expect(formatPricePerPill(100, 100)).toBe('$1.00/pill');
    expect(formatPricePerPill(139, 100)).toBe('$1.39/pill');
    expect(formatPricePerPill(50, 30)).toBe('$1.67/pill');
  });
});

describe('formatDate', () => {
  it('formats a date as human-readable', () => {
    const result = formatDate(new Date('2024-12-15'));
    expect(result).toMatch(/December/);
    expect(result).toMatch(/2024/);
    expect(result).toMatch(/15/);
  });

  it('accepts Date objects and strings', () => {
    const fromDate = formatDate(new Date('2024-01-01'));
    expect(fromDate).toMatch(/January/);
  });
});

describe('slugify', () => {
  it('converts to lowercase', () => {
    expect(slugify('Modalert 200mg')).toBe('modalert-200mg');
  });

  it('replaces spaces with hyphens', () => {
    expect(slugify('sun pharma')).toBe('sun-pharma');
  });

  it('removes special characters', () => {
    expect(slugify('Hello, World!')).toBe('hello-world');
  });

  it('collapses multiple spaces/hyphens into one', () => {
    expect(slugify('one   two')).toBe('one-two');
  });

  it('trims leading and trailing hyphens', () => {
    expect(slugify('  hello  ')).toBe('hello');
  });
});
