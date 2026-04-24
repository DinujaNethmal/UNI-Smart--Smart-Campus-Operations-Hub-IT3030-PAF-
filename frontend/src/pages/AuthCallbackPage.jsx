import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, LoaderCircle, X, XCircle } from 'lucide-react';
import { refreshAuth } from '../hooks/useAuth';

export default function AuthCallbackPage() {
  const navigate = useNavigate();
  const [toast, setToast] = useState({
    type: 'loading',
    message: 'Completing your Google sign in...',
  });

  useEffect(() => {
    const wait = (ms) => new Promise((resolve) => {
      window.setTimeout(resolve, ms);
    });

    async function loadSession() {
      try {
        const user = await refreshAuth();

        if (user) {
          setToast({
            type: 'success',
            message: 'Google login successful. Redirecting to your dashboard...',
          });
          await wait(1800);
          navigate('/', { replace: true });
          return;
        }

        setToast({
          type: 'error',
          message: 'Google login could not be completed. Please try again.',
        });
        await wait(1800);
        navigate('/login', { replace: true });
      } catch {
        setToast({
          type: 'error',
          message: 'Google login failed. Please try again.',
        });
        await wait(1800);
        navigate('/login', { replace: true });
      }
    }

    loadSession();
  }, [navigate]);

  return (
    <div className="callback-shell">
      <header className="topbar callback-topbar">
        <div className="topbar-brand">
          <div className="topbar-logo">SC</div>
          <div className="topbar-title">
            Smart Campus
            <small>Operations Hub</small>
          </div>
        </div>
        <div className="topbar-spacer" />
        <div className="callback-topbar-skeleton" />
      </header>

      <aside className="sidebar callback-sidebar">
        <div className="callback-nav-item active" />
        <div className="callback-nav-item" />
        <div className="callback-nav-item" />
        <div className="callback-nav-item" />
        <div className="callback-sidebar-footer" />
      </aside>

      <main className="main callback-main">
        <div className="callback-page-header" />

        <div className="callback-stats-grid">
          <div className="callback-stat-card" />
          <div className="callback-stat-card" />
          <div className="callback-stat-card" />
        </div>

        <div className="callback-panel callback-panel-large" />
        <div className="callback-panel callback-panel-medium" />
      </main>

      <div
        className={`auth-toast callback-toast ${
          toast.type === 'success'
            ? 'auth-toast-success'
            : toast.type === 'error'
              ? 'auth-toast-error'
              : 'auth-toast-success'
        }`}
        role="status"
        aria-live="polite"
      >
        <div className="auth-toast-icon">
          {toast.type === 'loading' && <LoaderCircle size={18} className="auth-callback-spinner" />}
          {toast.type === 'success' && <CheckCircle2 size={18} />}
          {toast.type === 'error' && <XCircle size={18} />}
        </div>
        <div className="auth-toast-copy">{toast.message}</div>
        <button type="button" className="auth-toast-close" onClick={() => navigate('/login', { replace: true })}>
          <X size={16} />
        </button>
      </div>
    </div>
  );
}
