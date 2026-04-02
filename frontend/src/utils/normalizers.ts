/**
 * Normalizers: convert backend uppercase enums to frontend lowercase/mapped values.
 * Backend uses Prisma enums (PENDING, SUN_PHARMA, PERCENT…),
 * frontend types use lowercase / title-case equivalents.
 */

const BRAND_MAP: Record<string, string> = {
  SUN_PHARMA: 'Sun Pharma',
  HAB_PHARMA: 'HAB Pharma',
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function normalizeProduct(p: any): any {
  return {
    ...p,
    category: typeof p.category === 'string' ? p.category.toLowerCase() : p.category,
    brand:    typeof p.brand    === 'string' ? (BRAND_MAP[p.brand] ?? p.brand) : p.brand,
    badge:    typeof p.badge    === 'string' ? p.badge.toLowerCase()            : p.badge,
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function normalizeOrder(o: any): any {
  return {
    ...o,
    status:        typeof o.status        === 'string' ? o.status.toLowerCase()        : o.status,
    paymentMethod: typeof o.paymentMethod === 'string' ? o.paymentMethod.toLowerCase() : o.paymentMethod,
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function normalizeCoupon(c: any): any {
  return {
    ...c,
    type: typeof c.type === 'string' ? c.type.toLowerCase() : c.type,
  };
}
