const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL || 'https://nexum-5u3y.onrender.com';

async function request(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Request failed');
  return data;
}

export const api = {
  register: (email, name, avatar) =>
    request('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, name, avatar }),
    }),

  getUser: (userId) => request(`/api/users/${userId}`),

  getUserByEmail: (email) => request(`/api/users/by-email/${encodeURIComponent(email)}`),

  createCouple: (userId) =>
    request('/api/couples', {
      method: 'POST',
      body: JSON.stringify({ user_id: userId }),
    }),

  joinCouple: (code, userId) =>
    request('/api/couples/join', {
      method: 'POST',
      body: JSON.stringify({ code, user_id: userId }),
    }),

  getCouple: (userId) => request(`/api/couples/${userId}`),

  getSubscription: (userId) => request(`/api/subscription/${userId}`),

  checkUsage: (userId, action) =>
    request('/api/usage/check', {
      method: 'POST',
      body: JSON.stringify({ user_id: userId, action }),
    }),

  trackUsage: (userId, field, amount) =>
    request('/api/usage/track', {
      method: 'POST',
      body: JSON.stringify({ user_id: userId, field, amount }),
    }),
};
