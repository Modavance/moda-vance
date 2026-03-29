import { create } from 'zustand';

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message?: string;
  duration?: number;
}

interface NotificationStore {
  notifications: Notification[];
  add: (n: Omit<Notification, 'id'>) => void;
  remove: (id: string) => void;
  success: (title: string, message?: string) => void;
  error: (title: string, message?: string) => void;
  info: (title: string, message?: string) => void;
}

export const useNotificationStore = create<NotificationStore>((set, get) => ({
  notifications: [],

  add: (n) => {
    const id = Math.random().toString(36).slice(2);
    const notification: Notification = { ...n, id };
    set({ notifications: [...get().notifications, notification] });

    const duration = n.duration ?? 4000;
    if (duration > 0) {
      setTimeout(() => get().remove(id), duration);
    }
  },

  remove: (id) =>
    set({ notifications: get().notifications.filter((n) => n.id !== id) }),

  success: (title, message) => get().add({ type: 'success', title, message }),
  error: (title, message) => get().add({ type: 'error', title, message }),
  info: (title, message) => get().add({ type: 'info', title, message }),
}));
