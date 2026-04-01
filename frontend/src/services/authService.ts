import { api, adminApi, unwrap } from './api';
import type { User } from '@/types';

interface AuthResponse {
  user: User;
  token: string;
}

interface AdminAuthResponse {
  token: string;
  email: string;
}

export const authService = {
  register: async (data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  }): Promise<AuthResponse> => {
    const res = await api.post('/auth/register', data);
    return unwrap<AuthResponse>(res);
  },

  login: async (email: string, password: string): Promise<AuthResponse> => {
    const res = await api.post('/auth/login', { email, password });
    return unwrap<AuthResponse>(res);
  },

  getMe: async (): Promise<User> => {
    const res = await api.get('/auth/me');
    return unwrap<User>(res);
  },

  updateProfile: async (data: Partial<User>): Promise<User> => {
    const res = await api.put('/auth/me', data);
    return unwrap<User>(res);
  },
};

export const adminAuthService = {
  login: async (email: string, password: string): Promise<AdminAuthResponse> => {
    const res = await adminApi.post('/admin/auth/login', { email, password });
    const raw = unwrap<{ token: string; email?: string; admin?: { email: string } }>(res);
    return { token: raw.token, email: raw.email ?? raw.admin?.email ?? email };
  },

  changePassword: async (currentPassword: string, newPassword: string): Promise<void> => {
    await adminApi.put('/admin/auth/password', { currentPassword, newPassword });
  },

  changeEmail: async (email: string): Promise<void> => {
    await adminApi.put('/admin/auth/profile', { email });
  },
};
