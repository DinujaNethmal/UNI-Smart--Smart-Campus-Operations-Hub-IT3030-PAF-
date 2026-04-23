import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  CheckCircle2,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  ShieldCheck,
  Sparkles,
  UserRound,
  X,
  XCircle,
} from 'lucide-react';
import loginIllustration from '../assets/login-illustration.jpg';
import { loginWithPassword, redirectToGoogleLogin, registerUser } from '../api/authApi';
import { refreshAuth } from '../hooks/useAuth';

export default function LoginPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState('login');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [toast, setToast] = useState(null);
  const [errors, setErrors] = useState({});
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [submitting, setSubmitting] = useState(false);

  const pageCopy = useMemo(() => (
    mode === 'login'
      ? {
          title: 'Enter the campus command center',
          subtitle: 'Sign in to manage facilities, bookings, tickets, and notifications from one premium workspace.',
          button: 'Sign in to dashboard',
          switchLead: "Don't have an account?",
          switchAction: 'Create one',
        }
      : {
          title: 'Create your Smart Campus identity',
          subtitle: 'Register once, then move between campus services with secure access and real-time updates.',
          button: 'Create account',
          switchLead: 'Already registered?',
          switchAction: 'Sign in',
        }
  ), [mode]);

  useEffect(() => {
    if (!toast) {
      return undefined;
    }

    const timer = window.setTimeout(() => {
      setToast(null);
    }, 3200);

    return () => window.clearTimeout(timer);
  }, [toast]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    setErrors((current) => {
      if (!current[name]) {
        return current;
      }

      const next = { ...current };
      delete next[name];
      return next;
    });
  };

  const showToast = (type, message) => {
    setToast({ type, message });
  };

  const wait = (ms) => new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });

  const validateField = (fieldName, rawValue = form[fieldName]) => {
    const value = typeof rawValue === 'string' ? rawValue.trim() : rawValue;

    if (fieldName === 'name' && mode === 'register') {
      if (!value) {
        return 'Full name is required.';
      }

      if (value.length < 2) {
        return 'Full name must be at least 2 characters.';
      }

      if (value.length > 150) {
        return 'Full name must be 150 characters or fewer.';
      }

      if (!/^[A-Za-z][A-Za-z\s.'-]*$/.test(value)) {
        return 'Use letters and common name characters only.';
      }
    }

    if (fieldName === 'email') {
      if (!value) {
        return 'Email address is required.';
      }

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        return 'Enter a valid email address.';
      }
    }

    if (fieldName === 'password') {
      if (!rawValue) {
        return 'Password is required.';
      }

      if (mode === 'register') {
        if (rawValue.length < 8) {
          return 'Password must be at least 8 characters.';
        }

        if (rawValue.length > 100) {
          return 'Password must be 100 characters or fewer.';
        }

        if (!/(?=.*[A-Za-z])(?=.*\d)/.test(rawValue)) {
          return 'Password must include at least one letter and one number.';
        }
      }
    }

    if (fieldName === 'confirmPassword' && mode === 'register') {
      if (!rawValue) {
        return 'Please confirm your password.';
      }

      if (rawValue !== form.password) {
        return 'Password and confirm password must match.';
      }
    }

    return '';
  };

  const validateForm = () => {
    const nextErrors = {};
    const fields = mode === 'register'
      ? ['name', 'email', 'password', 'confirmPassword']
      : ['email', 'password'];

    fields.forEach((fieldName) => {
      const error = validateField(fieldName);
      if (error) {
        nextErrors[fieldName] = error;
      }
    });

    return nextErrors;
  };

  const handleBlur = (event) => {
    const { name } = event.target;
    const error = validateField(name);

    setErrors((current) => {
      if (!error && !current[name]) {
        return current;
      }

      const next = { ...current };
      if (error) {
        next[name] = error;
      } else {
        delete next[name];
      }
      return next;
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const nextErrors = validateForm();
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      showToast('error', Object.values(nextErrors)[0]);
      return;
    }

    setSubmitting(true);

    try {
      const normalizedForm = {
        name: form.name.trim(),
        email: form.email.trim().toLowerCase(),
        password: form.password,
      };

      if (mode === 'register') {
        await registerUser({
          name: normalizedForm.name,
          email: normalizedForm.email,
          password: normalizedForm.password,
        });
        showToast('success', 'Account created successfully. Signing you in...');
      }

      await loginWithPassword({
        email: normalizedForm.email,
        password: normalizedForm.password,
      });

      if (mode === 'login') {
        showToast('success', 'Login successful. Redirecting to your dashboard...');
      }

      await refreshAuth();
      await wait(1800);
      navigate('/', { replace: true });
    } catch (requestError) {
      const backendFieldErrors = requestError?.response?.data?.fieldErrors;
      if (backendFieldErrors && typeof backendFieldErrors === 'object') {
        setErrors((current) => ({ ...current, ...backendFieldErrors }));
      }

      const message = requestError?.response?.data?.message
        || (backendFieldErrors ? Object.values(backendFieldErrors)[0] : null)
        || 'Authentication failed. Please try again.';
      showToast('error', message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-screen">
      <div className="auth-screen-glow auth-screen-glow-one" />
      <div className="auth-screen-glow auth-screen-glow-two" />

      {toast && (
        <div className={`auth-toast auth-toast-${toast.type}`} role="status" aria-live="polite">
          <div className="auth-toast-icon">
            {toast.type === 'success' ? <CheckCircle2 size={18} /> : <XCircle size={18} />}
          </div>
          <div className="auth-toast-copy">{toast.message}</div>
          <button type="button" className="auth-toast-close" onClick={() => setToast(null)}>
            <X size={16} />
          </button>
        </div>
      )}

      <div className="auth-showcase-shell">
        <section className="auth-showcase-panel">
          <div className="auth-showcase-copy">
            <div className="auth-showcase-badge">
              <Sparkles size={15} />
              Smart Campus Operations Hub
            </div>

            <h1>Step into a calmer campus workspace.</h1>
            <p>
              Sign in once and manage bookings, notifications, approvals, and day-to-day
              operations from one simple place.
            </p>

            <div className="auth-showcase-stats">
              <div className="auth-showcase-stat">
                <strong>Google + email</strong>
                <span>Flexible sign-in for every user</span>
              </div>
              <div className="auth-showcase-stat">
                <strong>Live updates</strong>
                <span>Approvals and notifications stay in sync</span>
              </div>
            </div>
          </div>

          <div className="auth-showcase-art">
            <div className="auth-art-chip auth-art-chip-top">
              <ShieldCheck size={16} />
              <div>
                <strong>Protected access</strong>
                <span>Role-aware and session-based</span>
              </div>
            </div>

            <div className="auth-art-frame">
              <img
                src={loginIllustration}
                alt="Illustrated welcome character"
                className="auth-showcase-image"
              />
            </div>

            <div className="auth-art-chip auth-art-chip-bottom">
              <div className="auth-art-dot" />
              <div>
                <strong>Always in flow</strong>
                <span>Bookings, alerts, and status in one place</span>
              </div>
            </div>
          </div>
        </section>

        <section className="auth-form-panel">
          <div className="auth-card-header">
            <div className="auth-mode-switch">
              <button
                type="button"
                className={`auth-mode-button ${mode === 'login' ? 'active' : ''}`}
                onClick={() => {
                  setMode('login');
                  setToast(null);
                  setErrors({});
                }}
              >
                Login
              </button>
              <button
                type="button"
                className={`auth-mode-button ${mode === 'register' ? 'active' : ''}`}
                onClick={() => {
                  setMode('register');
                  setToast(null);
                  setErrors({});
                }}
              >
                Register
              </button>
            </div>

            <h2>{pageCopy.title}</h2>
            <p>{pageCopy.subtitle}</p>
          </div>

          <button className="auth-google-button auth-google-button-inline" type="button" onClick={redirectToGoogleLogin}>
            <span className="auth-google-mark">G</span>
            Continue with Google
          </button>

          <div className="auth-divider">
            <span>or continue with email</span>
          </div>

          <form className={`auth-form ${mode === 'register' ? 'is-register' : ''}`} onSubmit={handleSubmit}>
            {mode === 'register' && (
              <label className="auth-field">
                <span>Full name</span>
                <div className="auth-input-wrap">
                  <UserRound size={18} className="auth-input-icon" />
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Enter your full name"
                    className={errors.name ? 'has-error' : ''}
                    aria-invalid={Boolean(errors.name)}
                    required
                  />
                </div>
                {errors.name && <span className="auth-field-error">{errors.name}</span>}
              </label>
            )}

            <label className="auth-field">
              <span>Email address</span>
              <div className="auth-input-wrap">
                <Mail size={18} className="auth-input-icon" />
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="name@campus.edu"
                  className={errors.email ? 'has-error' : ''}
                  aria-invalid={Boolean(errors.email)}
                  required
                />
              </div>
              {errors.email && <span className="auth-field-error">{errors.email}</span>}
            </label>

            <label className="auth-field">
              <span>Password</span>
              <div className="auth-input-wrap">
                <LockKeyhole size={18} className="auth-input-icon" />
                <input
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={form.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Enter your password"
                  className={errors.password ? 'has-error' : ''}
                  aria-invalid={Boolean(errors.password)}
                  required
                />
                <button
                  type="button"
                  className="auth-password-toggle"
                  onClick={() => setShowPassword((value) => !value)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && <span className="auth-field-error">{errors.password}</span>}
            </label>

            {mode === 'register' && (
              <label className="auth-field">
                <span>Confirm password</span>
                <div className="auth-input-wrap">
                  <LockKeyhole size={18} className="auth-input-icon" />
                  <input
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={form.confirmPassword}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Re-enter your password"
                    className={errors.confirmPassword ? 'has-error' : ''}
                    aria-invalid={Boolean(errors.confirmPassword)}
                    required
                  />
                  <button
                    type="button"
                    className="auth-password-toggle"
                    onClick={() => setShowConfirmPassword((value) => !value)}
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.confirmPassword && <span className="auth-field-error">{errors.confirmPassword}</span>}
              </label>
            )}

            <button className="auth-submit-button" type="submit" disabled={submitting}>
              {submitting ? 'Please wait...' : pageCopy.button}
              {!submitting && <ArrowRight size={18} />}
            </button>
          </form>

          <div className="auth-switch-row">
            <span className="auth-switch-text">{pageCopy.switchLead}</span>
            <button
              className="auth-switch-link"
              type="button"
              onClick={() => {
                setToast(null);
                setErrors({});
                setMode((current) => (current === 'login' ? 'register' : 'login'));
              }}
            >
              {pageCopy.switchAction}
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
