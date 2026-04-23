import { useEffect, useState } from 'react';
import { fetchCurrentUser, logoutUser, redirectToGoogleLogin } from '../api/authApi';

let listeners = [];
let authState = {
  user: null,
  loading: true,
};
let refreshPromise = null;
let hasInitialized = false;

export function useAuth() {
  const [state, setState] = useState(authState);

  useEffect(() => {
    const listener = (nextState) => setState(nextState);
    listeners.push(listener);

    if (!hasInitialized && window.location.pathname !== '/login') {
      hasInitialized = true;
      refreshAuth();
    } else {
      setState(authState);
    }

    return () => {
      listeners = listeners.filter((item) => item !== listener);
    };
  }, []);

  const login = () => {
    redirectToGoogleLogin();
  };

  const logout = async () => {
    await logoutUser();
    broadcast({ user: null, loading: false });
  };

  return {
    user: state.user,
    loading: state.loading,
    isAuthenticated: Boolean(state.user),
    isAdmin: state.user?.role === 'ADMIN',
    login,
    logout,
    refreshAuth,
  };
}

export async function refreshAuth() {
  if (refreshPromise) {
    return refreshPromise;
  }

  broadcast({ ...authState, loading: true });

  refreshPromise = fetchCurrentUser()
    .then((user) => {
      hasInitialized = true;
      broadcast({ user, loading: false });
      return user;
    })
    .catch((error) => {
      hasInitialized = true;

      if (error?.response?.status === 401) {
        broadcast({ user: null, loading: false });
        return null;
      }

      broadcast({ user: null, loading: false });
      throw error;
    })
    .finally(() => {
      refreshPromise = null;
    });

  return refreshPromise;
}

function broadcast(nextState) {
  authState = nextState;
  listeners.forEach((listener) => listener(nextState));
}
