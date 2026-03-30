import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AdminStore {
  isAuthenticated: boolean;
  email: string;
  token: string | null;
  login: (email: string, token: string) => void;
  logout: () => void;
}

export const useAdminStore = create<AdminStore>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      email: 'admin@modavance.com',
      token: null,

      login: (email, token) => set({ isAuthenticated: true, email, token }),
      logout: () => set({ isAuthenticated: false, token: null }),
    }),
    { name: 'modavance-admin' }
  )
);

export const ADMIN_EMAIL = 'admin@modavance.com';
