import { getToken } from './authService.js';

const BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

/** Internal fetch wrapper that attaches the Bearer token. */
async function request(path, options = {}) {
  const token = await getToken();
  console.log(`[API] ${options.method || 'GET'} ${path}`);
  const res = await fetch(`${BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Request failed');
  return data;
}

// ─── Tasks ───────────────────────────────────────────────────────────────────
export const getTasks   = (params = {}) => {
  const qs = new URLSearchParams(params).toString();
  return request(`/tasks${qs ? '?' + qs : ''}`);
};
export const createTask = (body)       => request('/tasks',            { method: 'POST',   body: JSON.stringify(body) });
export const updateTask = (id, body)   => request(`/tasks/${id}`,      { method: 'PUT',    body: JSON.stringify(body) });
export const deleteTask = (id)         => request(`/tasks/${id}`,      { method: 'DELETE' });
export const toggleTask = (id)         => request(`/tasks/${id}/toggle`,{ method: 'PATCH' });

// ─── Stats ────────────────────────────────────────────────────────────────────
export const getStats = () => request('/stats');
