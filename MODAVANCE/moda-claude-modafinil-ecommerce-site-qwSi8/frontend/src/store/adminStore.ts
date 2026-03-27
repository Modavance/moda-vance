import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AdminStore {
  isAuthenticated: boolean;
  email: string;
  password: string;
  login: (password: string) => boolean;
  logout: () => void;
  changePassword: (current: string, next: string) => boolean;
  changeEmail: (email: string) => void;
}

export const useAdminStore = create<AdminStore>()(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      email: 'admin@modavance.com',
      password: 'admin123',
      login: (password: string) => {
        if (password === get().password) {
          set({ isAuthenticated: true });
          return true;
        }
        return false;
      },
      logout: () => set({ isAuthenticated: false }),
      changePassword: (current: string, next: string) => {
        if (current !== get().password) return false;
        set({ password: next });
        return true;
      },
      changeEmail: (email: string) => set({ email }),
    }),
    { name: 'modavance-admin' }
  )
);

export const ADMIN_EMAIL = 'admin@modavance.com';
