import { useState, useEffect } from 'react';

const STORAGE_KEY = 'smart_campus_user';

const DEFAULT_USERS = {
  student: { id: 1, name: 'John Doe', role: 'USER' },
  admin: { id: 99, name: 'John Doe', role: 'ADMIN' },
};

const getStoredUser = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return DEFAULT_USERS.admin;
};

let listeners = [];

export function useAuth() {
  const [user, setUser] = useState(getStoredUser);

  useEffect(() => {
    const listener = (u) => setUser(u);
    listeners.push(listener);
    return () => { listeners = listeners.filter(l => l !== listener); };
  }, []);

  const switchRole = (roleKey) => {
    const next = DEFAULT_USERS[roleKey] || DEFAULT_USERS.student;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    setUser(next);
    listeners.forEach(l => l(next));
  };

  const logout = () => {
    localStorage.removeItem(STORAGE_KEY);
    window.location.href = '/';
  };

  return { user, switchRole, logout, isAdmin: user.role === 'ADMIN' };
}
