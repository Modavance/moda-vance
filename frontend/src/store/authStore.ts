import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '@/types';

interface AuthStore {
  user: User | null;
  isLoading: boolean;
  login: (user: User) => void;
  logout: () => void;
  updateUser: (data: Partial<User>) => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      isLoading: false,

      login: (user) => set({ user }),
      logout: () => set({ user: null }),
      updateUser: (data) => {
        const current = get().user;
        if (current) set({ user: { ...current, ...data } });
      },
    }),
    {
      name: 'modavance-auth',
    }
  )
);
