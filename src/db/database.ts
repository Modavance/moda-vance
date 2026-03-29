import Dexie, { type Table } from 'dexie';
import type { Product, Order, User, Review, BlogPost, Coupon, FAQItem, ContactSubmission, Setting, OrderStatusLog } from '@/types';

export class ModavanceDB extends Dexie {
  products!: Table<Product>;
  orders!: Table<Order>;
  users!: Table<User>;
  reviews!: Table<Review>;
  blogPosts!: Table<BlogPost>;
  coupons!: Table<Coupon>;
  faqItems!: Table<FAQItem>;
  contactSubmissions!: Table<ContactSubmission>;
  settings!: Table<Setting>;
  orderStatusLogs!: Table<OrderStatusLog>;

  constructor() {
    super('ModavanceDB');

    // If another tab holds an older connection open and blocks our upgrade,
    // reload so the user gets a fresh connection attempt.
    this.on('blocked', () => {
      window.location.reload();
    });

    // If a newer tab upgrades the DB, close this connection gracefully.
    this.on('versionchange', () => {
      this.close();
      window.location.reload();
    });

    // v1 — original schema
    this.version(1).stores({
      products:  'id, slug, category, brand, featured, inStock',
      orders:    'id, userId, status, createdAt',
      users:     'id, email',
      reviews:   'id, productId, userId, rating',
      blogPosts: 'id, slug, category',
      coupons:   'code',
    });

    // v2 — image URL update (runs on first migration from v1)
    this.version(2).stores({
      products:  'id, slug, category, brand, featured, inStock',
      orders:    'id, userId, status, createdAt',
      users:     'id, email',
      reviews:   'id, productId, userId, rating',
      blogPosts: 'id, slug, category',
      coupons:   'code',
    }).upgrade(tx =>
      tx.table('products').toCollection().modify((p: Record<string, unknown>) => {
        const map: Record<string, string> = {
          'modalert-200': 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&h=800&fit=crop&q=85',
          'modvigil-200': 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=800&h=800&fit=crop&q=85',
          'waklert-150':  'https://images.unsplash.com/photo-1576671081837-49000212a370?w=800&h=800&fit=crop&q=85',
          'artvigil-150': 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=800&h=800&fit=crop&q=85',
          'starter-pack': 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&h=800&fit=crop&q=85',
        };
        const img = map[p.id as string];
        if (img) p.image = img;
      })
    );

    // v3 — FAQ, contact submissions, settings
    this.version(3).stores({
      products:            'id, slug, category, brand, featured, inStock',
      orders:              'id, userId, status, createdAt',
      users:               'id, email',
      reviews:             'id, productId, userId, rating',
      blogPosts:           'id, slug, category',
      coupons:             'code',
      faqItems:            'id, section',
      contactSubmissions:  'id, createdAt',
      settings:            'key',
    });

    // v4 — order status change logs
    this.version(4).stores({
      products:            'id, slug, category, brand, featured, inStock',
      orders:              'id, userId, status, createdAt',
      users:               'id, email',
      reviews:             'id, productId, userId, rating',
      blogPosts:           'id, slug, category',
      coupons:             'code',
      faqItems:            'id, section',
      contactSubmissions:  'id, createdAt',
      settings:            'key',
      orderStatusLogs:     'id, orderId, changedAt',
    });

    // v5 — clear faqItems so new seed runs
    this.version(5).stores({
      products:            'id, slug, category, brand, featured, inStock',
      orders:              'id, userId, status, createdAt',
      users:               'id, email',
      reviews:             'id, productId, userId, rating',
      blogPosts:           'id, slug, category',
      coupons:             'code',
      faqItems:            'id, section',
      contactSubmissions:  'id, createdAt',
      settings:            'key',
      orderStatusLogs:     'id, orderId, changedAt',
    }).upgrade(tx => tx.table('faqItems').clear());

    // v6 — force FAQ reseed
    this.version(6).stores({
      products:            'id, slug, category, brand, featured, inStock',
      orders:              'id, userId, status, createdAt',
      users:               'id, email',
      reviews:             'id, productId, userId, rating',
      blogPosts:           'id, slug, category',
      coupons:             'code',
      faqItems:            'id, section',
      contactSubmissions:  'id, createdAt',
      settings:            'key',
      orderStatusLogs:     'id, orderId, changedAt',
    }).upgrade(tx => tx.table('faqItems').clear());

    // v7 — force reseed products and settings for all users
    this.version(7).stores({
      products:            'id, slug, category, brand, featured, inStock',
      orders:              'id, userId, status, createdAt',
      users:               'id, email',
      reviews:             'id, productId, userId, rating',
      blogPosts:           'id, slug, category',
      coupons:             'code',
      faqItems:            'id, section',
      contactSubmissions:  'id, createdAt',
      settings:            'key',
      orderStatusLogs:     'id, orderId, changedAt',
    }).upgrade(async tx => {
      await tx.table('products').clear();
      await tx.table('settings').clear();
      await tx.table('faqItems').clear();
    });
  }
}

export const db = new ModavanceDB();
