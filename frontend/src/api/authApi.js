import axios from 'axios';

const API_BASE = 'http://localhost:8081';

export const authClient = axios.create({
  baseURL: `${API_BASE}/api/auth`,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

export async function fetchCurrentUser() {
  const response = await authClient.get('/me');
  return response.data;
}

export async function loginWithPassword(payload) {
  const response = await authClient.post('/login', payload);
  return response.data;
}

export async function registerUser(payload) {
  const response = await authClient.post('/register', payload);
  return response.data;
}

export async function logoutUser() {
  await authClient.post('/logout');
}

export function redirectToGoogleLogin() {
  window.location.href = `${API_BASE}/oauth2/authorization/google`;
}
