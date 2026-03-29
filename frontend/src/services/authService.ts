import { api } from './api';

export const authService = {
  register: async (data: { email: string; password: string; firstName: string; lastName: string }) => {
    const res = await api('/auth/register', { method: 'POST', body: JSON.stringify(data) });
    if (res.token) localStorage.setItem('token', res.token);
    return res;
  },
  login: async (email: string, password: string) => {
    const res = await api('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) });
    if (res.token) localStorage.setItem('token', res.token);
    return res;
  },
  logout: () => localStorage.removeItem('token'),
  getMe: () => api('/auth/me'),
  updateProfile: (data: any) => api('/auth/me', { method: 'PUT', body: JSON.stringify(data) }),
};
