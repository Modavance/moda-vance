import { beforeEach, describe, expect, it } from 'vitest';
import { db } from '@/db/database';
import type { OrderStatusLog } from '@/types';

function makeLog(overrides: Partial<OrderStatusLog> & { id: string; orderId: string }): OrderStatusLog {
  return {
    fromStatus: 'confirmed',
    toStatus: 'processing',
    changedAt: new Date(),
    ...overrides,
  };
}

beforeEach(async () => {
  await db.orderStatusLogs.clear();
});

describe('orderStatusLogs DB table', () => {
  it('persists a log entry', async () => {
    await db.orderStatusLogs.add(makeLog({ id: 'log1', orderId: 'ORD-1' }));
    const stored = await db.orderStatusLogs.get('log1');
    expect(stored).toBeDefined();
    expect(stored?.orderId).toBe('ORD-1');
  });

  it('queries logs by orderId', async () => {
    await db.orderStatusLogs.bulkAdd([
      makeLog({ id: 'l1', orderId: 'ORD-A', toStatus: 'processing' }),
      makeLog({ id: 'l2', orderId: 'ORD-B', toStatus: 'shipped' }),
      makeLog({ id: 'l3', orderId: 'ORD-A', toStatus: 'shipped' }),
    ]);

    const result = await db.orderStatusLogs.where('orderId').equals('ORD-A').toArray();
    expect(result).toHaveLength(2);
    result.forEach(l => expect(l.orderId).toBe('ORD-A'));
  });

  it('returns logs sorted by changedAt ascending', async () => {
    await db.orderStatusLogs.bulkAdd([
      makeLog({ id: 'l1', orderId: 'ORD-1', changedAt: new Date('2024-03-01'), toStatus: 'shipped' }),
      makeLog({ id: 'l2', orderId: 'ORD-1', changedAt: new Date('2024-01-01'), toStatus: 'confirmed' }),
      makeLog({ id: 'l3', orderId: 'ORD-1', changedAt: new Date('2024-02-01'), toStatus: 'processing' }),
    ]);

    const result = await db.orderStatusLogs.where('orderId').equals('ORD-1').sortBy('changedAt');
    expect(result[0].toStatus).toBe('confirmed');
    expect(result[1].toStatus).toBe('processing');
    expect(result[2].toStatus).toBe('shipped');
  });

  it('stores optional note correctly', async () => {
    await db.orderStatusLogs.add(
      makeLog({ id: 'l1', orderId: 'ORD-1', toStatus: 'shipped', note: 'Tracking #TRK123' })
    );

    const result = await db.orderStatusLogs.get('l1');
    expect(result?.note).toBe('Tracking #TRK123');
  });

  it('stores null fromStatus for initial entries', async () => {
    await db.orderStatusLogs.add(
      makeLog({ id: 'l1', orderId: 'ORD-1', fromStatus: null, toStatus: 'confirmed' })
    );

    const result = await db.orderStatusLogs.get('l1');
    expect(result?.fromStatus).toBeNull();
  });

  it('returns empty array for order with no logs', async () => {
    const result = await db.orderStatusLogs.where('orderId').equals('NO-LOGS').toArray();
    expect(result).toHaveLength(0);
  });
});

describe('status transition logic', () => {
  it('records all status transitions for an order', async () => {
    const orderId = 'ORD-FLOW';
    const transitions: Array<{ from: OrderStatusLog['fromStatus']; to: OrderStatusLog['toStatus'] }> = [
      { from: null,          to: 'confirmed' },
      { from: 'confirmed',   to: 'processing' },
      { from: 'processing',  to: 'shipped' },
      { from: 'shipped',     to: 'delivered' },
    ];

    for (let i = 0; i < transitions.length; i++) {
      const t = transitions[i];
      await db.orderStatusLogs.add({
        id: `log-${i}`,
        orderId,
        fromStatus: t.from,
        toStatus: t.to,
        changedAt: new Date(Date.now() + i * 1000),
      });
    }

    const logs = await db.orderStatusLogs.where('orderId').equals(orderId).sortBy('changedAt');
    expect(logs).toHaveLength(4);
    expect(logs[logs.length - 1].toStatus).toBe('delivered');
  });
});
