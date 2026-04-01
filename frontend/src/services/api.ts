import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL ?? 'https://api.modavance.co';

// ── User API instance ────────────────────────────────────────────────────────
export const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  try {
    const raw = localStorage.getItem('modavance-auth');
    if (raw) {
      const token: string | undefined = JSON.parse(raw)?.state?.token;
      if (token) config.headers.Authorization = `Bearer ${token}`;
    }
  } catch {
    // ignore parse errors
  }
  return config;
});

// ── Admin API instance ───────────────────────────────────────────────────────
export const adminApi = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

adminApi.interceptors.request.use((config) => {
  try {
    const raw = localStorage.getItem('modavance-admin');
    if (raw) {
      const token: string | undefined = JSON.parse(raw)?.state?.token;
      if (token) config.headers.Authorization = `Bearer ${token}`;
    }
  } catch {
    // ignore parse errors
  }
  return config;
});

adminApi.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('modavance-admin');
      window.location.href = '/admin/login';
    }
    return Promise.reject(error);
  },
);

// ── Helper: unwrap backend envelope { data: T } ──────────────────────────────
export function unwrap<T>(response: { data: { data: T } }): T {
  return response.data.data;
}

export const apiUrl = BASE_URL;
