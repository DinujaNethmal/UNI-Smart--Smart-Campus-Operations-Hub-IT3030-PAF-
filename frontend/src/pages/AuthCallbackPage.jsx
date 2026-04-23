import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { refreshAuth } from '../hooks/useAuth';

export default function AuthCallbackPage() {
  const navigate = useNavigate();

  useEffect(() => {
    async function loadSession() {
      try {
        const user = await refreshAuth();
        navigate(user ? '/' : '/login', { replace: true });
      } catch {
        navigate('/login', { replace: true });
      }
    }

    loadSession();
  }, [navigate]);

  return <div className="panel">Signing you in...</div>;
}
