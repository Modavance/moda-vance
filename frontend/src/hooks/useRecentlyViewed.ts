const KEY = 'modavance-recently-viewed';
const MAX = 8;

function readIds(): string[] {
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? '[]');
  } catch {
    return [];
  }
}

export function trackProductView(productId: string) {
  const ids = readIds().filter(id => id !== productId);
  ids.unshift(productId);
  localStorage.setItem(KEY, JSON.stringify(ids.slice(0, MAX)));
}

export function getRecentlyViewedIds(): string[] {
  return readIds();
}
