const API_URL = import.meta.env.VITE_API_URL || 'http://146.190.78.135:3000';

export async function api(path: string, options: RequestInit = {}) {
  const token = localStorage.getItem('token');
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${API_URL}${path}`, { ...options, headers });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: 'Network error' }));
    throw new Error(err.message || 'Request failed');
  }
  const json = await res.json();
  return json.data !== undefined ? json.data : json;
}

export const apiUrl = API_URL;
