import { describe, expect, it } from 'vitest';
import type { Coupon } from '@/types';

// Mirror the validation logic from CheckoutPage.handleApplyCoupon
// so we can test it in isolation without mounting the full component.
function validateCoupon(
  coupon: Coupon,
  subtotal: number
): { valid: true; discount: number } | { valid: false; reason: string } {
  if (new Date(coupon.expiresAt) < new Date()) {
    return { valid: false, reason: 'expired' };
  }
  if (subtotal < coupon.minOrder) {
    return { valid: false, reason: 'min_order' };
  }
  const discount =
    coupon.type === 'percent'
      ? subtotal * (coupon.discount / 100)
      : coupon.discount;
  return { valid: true, discount };
}

function makeCoupon(overrides: Partial<Coupon> = {}): Coupon {
  return {
    code: 'TEST10',
    discount: 10,
    type: 'percent',
    minOrder: 0,
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
    ...overrides,
  };
}

describe('coupon validation — expiry', () => {
  it('accepts a coupon that expires in the future', () => {
    const result = validateCoupon(makeCoupon(), 100);
    expect(result.valid).toBe(true);
  });

  it('rejects a coupon that expired yesterday', () => {
    const expired = makeCoupon({ expiresAt: new Date('2020-01-01') });
    const result = validateCoupon(expired, 100);
    expect(result.valid).toBe(false);
    if (!result.valid) expect(result.reason).toBe('expired');
  });

  it('rejects a coupon that expired exactly now (boundary)', () => {
    const justExpired = makeCoupon({ expiresAt: new Date(Date.now() - 1) });
    const result = validateCoupon(justExpired, 100);
    expect(result.valid).toBe(false);
  });
});

describe('coupon validation — minimum order', () => {
  it('accepts when subtotal meets the minimum', () => {
    const coupon = makeCoupon({ minOrder: 50 });
    const result = validateCoupon(coupon, 50);
    expect(result.valid).toBe(true);
  });

  it('accepts when subtotal exceeds the minimum', () => {
    const coupon = makeCoupon({ minOrder: 50 });
    const result = validateCoupon(coupon, 100);
    expect(result.valid).toBe(true);
  });

  it('rejects when subtotal is below minimum', () => {
    const coupon = makeCoupon({ minOrder: 100 });
    const result = validateCoupon(coupon, 49.99);
    expect(result.valid).toBe(false);
    if (!result.valid) expect(result.reason).toBe('min_order');
  });
});

describe('coupon validation — discount calculation', () => {
  it('calculates percent discount correctly', () => {
    const coupon = makeCoupon({ type: 'percent', discount: 20 });
    const result = validateCoupon(coupon, 100);
    expect(result.valid).toBe(true);
    if (result.valid) expect(result.discount).toBe(20);
  });

  it('calculates fixed discount correctly', () => {
    const coupon = makeCoupon({ type: 'fixed', discount: 15 });
    const result = validateCoupon(coupon, 100);
    expect(result.valid).toBe(true);
    if (result.valid) expect(result.discount).toBe(15);
  });

  it('percent discount scales with subtotal', () => {
    const coupon = makeCoupon({ type: 'percent', discount: 10 });
    const r1 = validateCoupon(coupon, 200);
    const r2 = validateCoupon(coupon, 300);
    expect(r1.valid && r1.discount).toBe(20);
    expect(r2.valid && r2.discount).toBe(30);
  });

  it('fixed discount does not scale with subtotal', () => {
    const coupon = makeCoupon({ type: 'fixed', discount: 25 });
    const r1 = validateCoupon(coupon, 100);
    const r2 = validateCoupon(coupon, 500);
    expect(r1.valid && r1.discount).toBe(25);
    expect(r2.valid && r2.discount).toBe(25);
  });

  it('expired coupon takes priority over min order check', () => {
    // Expired + below min — should fail with 'expired', not 'min_order'
    const coupon = makeCoupon({ expiresAt: new Date('2020-01-01'), minOrder: 500 });
    const result = validateCoupon(coupon, 10);
    expect(result.valid).toBe(false);
    if (!result.valid) expect(result.reason).toBe('expired');
  });
});
