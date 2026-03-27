import { db } from '@/db/database';
import type { User } from '@/types';

// Simple hash (not for production use)
function simpleHash(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash).toString(36);
}

export const authService = {
  register: async (data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  }): Promise<User> => {
    const existing = await db.users.where('email').equals(data.email).first();
    if (existing) throw new Error('An account with this email already exists.');

    const user: User = {
      id: `usr-${Date.now()}-${Math.random().toString(36).slice(2)}`,
      email: data.email.toLowerCase().trim(),
      firstName: data.firstName,
      lastName: data.lastName,
      passwordHash: simpleHash(data.password),
      createdAt: new Date(),
      loyaltyPoints: 0,
    };

    await db.users.add(user);
    return user;
  },

  login: async (email: string, password: string): Promise<User> => {
    const user = await db.users.where('email').equals(email.toLowerCase().trim()).first();
    if (!user) throw new Error('No account found with this email address.');
    if (user.passwordHash !== simpleHash(password)) throw new Error('Incorrect password.');
    return user;
  },
};
