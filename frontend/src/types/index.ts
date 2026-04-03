export interface Product {
  id: string;
  name: string;
  slug: string;
  brand: 'Sun Pharma' | 'HAB Pharma';
  category: 'modafinil' | 'armodafinil' | 'mix';
  strength: string;
  pillsPerStrip: number;
  description: string;
  shortDescription: string;
  image: string;
  images: string[];
  variants: ProductVariant[];
  effects: string[];
  ingredients: string;
  manufacturer: string;
  rating: number;
  reviewCount: number;
  badge?: 'bestseller' | 'new' | 'sale' | 'popular';
  inStock: boolean;
  featured: boolean;
  createdAt: Date;
}

export interface ProductVariant {
  id: string;
  quantity: number; // number of pills
  price: number;    // USD
  originalPrice?: number;
  savings?: number;
  label?: string;   // e.g. "Best Value"
}

export interface CartItem {
  id: string;
  productId: string;
  variantId: string;
  quantity: number; // number of packs
  product: Product;
  variant: ProductVariant;
}

export interface Cart {
  items: CartItem[];
  couponCode?: string;
  discount?: number;
}

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  status: OrderStatus;
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
  shippingAddress: Address;
  shippingCenter?: string;
  paymentMethod: PaymentMethod;
  trackingNumber?: string;
  estimatedDelivery?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled';

export interface OrderItem {
  productId: string;
  productName: string;
  variantId: string;
  quantity: number;
  pillCount: number;
  price: number;
  image: string;
}

export interface Address {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  street: string;
  apt?: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

export type PaymentMethod = 'bitcoin' | 'ethereum' | 'zelle' | 'bill';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  passwordHash: string;
  createdAt: Date;
  loyaltyPoints: number;
  savedAddress?: Address;
}

export interface Review {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  rating: number;
  title: string;
  body: string;
  verified: boolean;
  createdAt: Date;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  image: string;
  author: string;
  category: string;
  readTime: number;
  createdAt: Date;
}

export interface Coupon {
  code: string;
  discount: number; // percentage
  type: 'percent' | 'fixed';
  minOrder: number;
  expiresAt: Date;
}

export interface OrderStatusLog {
  id: string;
  orderId: string;
  fromStatus: OrderStatus | null; // null = initial creation
  toStatus: OrderStatus;
  changedAt: Date;
  note?: string;
}

export interface FAQItem {
  id: string;
  section: string;
  question: string;
  answer: string;
  order: number;
  createdAt: Date;
}

export interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  read: boolean;
  createdAt: Date;
}

export interface Setting {
  key: string;
  value: string;
}

export interface CheckoutFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  street: string;
  apt: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  paymentMethod: PaymentMethod;
  couponCode: string;
  agreeTerms: boolean;
}
