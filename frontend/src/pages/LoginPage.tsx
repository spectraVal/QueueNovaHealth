import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { AxiosError } from 'axios';
import { authService } from '../services/authService';
import { useAuth } from '../hooks/useAuth';
import type { LoginPayload, ApiValidationError, UserRole } from '../types/auth';

type FieldErrors = Partial<Record<keyof LoginPayload, string>>;

const ROLE_REDIRECT: Record<UserRole, string> = {
  patient: '/dashboard',
  doctor: '/dashboard',
  nurse: '/dashboard',
  admin: '/dashboard',
};

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { setAuth } = useAuth();

  const successMessage = (location.state as { successMessage?: string } | null)
    ?.successMessage;

  const [form, setForm] = useState<LoginPayload>({ email: '', password: '' });
  const [rememberMe, setRememberMe] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [genericError, setGenericError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setFieldErrors((prev) => ({ ...prev, [name]: undefined }));
    setGenericError('');
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    setFieldErrors({});
    setGenericError('');

    try {
      const response = await authService.login(form);
      setAuth(response.data);
      navigate(ROLE_REDIRECT[response.data.user.role], { replace: true });
    } catch (err) {
      const error = err as AxiosError<ApiValidationError & { message: string }>;

      if (error.response?.status === 422 && error.response.data.errors) {
        const raw = error.response.data.errors;
        const mapped: FieldErrors = {};
        for (const key of Object.keys(raw) as Array<keyof LoginPayload>) {
          mapped[key] = raw[key][0];
        }
        setFieldErrors(mapped);
      } else if (error.response?.status === 401) {
        setGenericError('Email atau password salah.');
      } else {
        setGenericError('Terjadi kesalahan. Silakan coba lagi.');
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.header}>
          <h1 style={styles.title}>QueueNova Health</h1>
          <p style={styles.subtitle}>Masuk ke akun Anda</p>
        </div>

        {successMessage && (
          <div style={styles.successBanner} role="status">
            {successMessage}
          </div>
        )}

        {genericError && (
          <div style={styles.genericError} role="alert">
            {genericError}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate style={styles.form}>
          <div style={styles.fieldWrapper}>
            <label htmlFor="email" style={styles.label}>
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              autoComplete="email"
              placeholder="contoh@gmail.com"
              aria-invalid={!!fieldErrors.email}
              aria-describedby={fieldErrors.email ? 'email-error' : undefined}
              style={{
                ...styles.input,
                ...(fieldErrors.email ? styles.inputError : {}),
              }}
            />
            {fieldErrors.email && (
              <span id="email-error" style={styles.fieldError} role="alert">
                {fieldErrors.email}
              </span>
            )}
          </div>

          <div style={styles.fieldWrapper}>
            <label htmlFor="password" style={styles.label}>
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              autoComplete="current-password"
              placeholder="••••••••"
              aria-invalid={!!fieldErrors.password}
              aria-describedby={
                fieldErrors.password ? 'password-error' : undefined
              }
              style={{
                ...styles.input,
                ...(fieldErrors.password ? styles.inputError : {}),
              }}
            />
            {fieldErrors.password && (
              <span id="password-error" style={styles.fieldError} role="alert">
                {fieldErrors.password}
              </span>
            )}
          </div>

          <div style={styles.rememberRow}>
            <label style={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                style={styles.checkbox}
              />
              Ingat saya
            </label>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            style={{
              ...styles.button,
              ...(isLoading ? styles.buttonDisabled : {}),
            }}
          >
            {isLoading ? 'Masuk...' : 'Masuk'}
          </button>
        </form>

        <p style={styles.footer}>
          Belum punya akun?{' '}
          <Link to="/register" style={styles.link}>
            Daftar sekarang
          </Link>
        </p>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f5f7fa',
    padding: '24px',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: '8px',
    border: '1px solid #e2e8f0',
    padding: '40px',
    width: '100%',
    maxWidth: '400px',
  },
  header: {
    marginBottom: '28px',
  },
  title: {
    fontSize: '20px',
    fontWeight: 700,
    color: '#1a202c',
    margin: 0,
  },
  subtitle: {
    fontSize: '14px',
    color: '#64748b',
    marginTop: '4px',
    marginBottom: 0,
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  fieldWrapper: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  label: {
    fontSize: '13px',
    fontWeight: 500,
    color: '#374151',
  },
  input: {
    padding: '10px 12px',
    fontSize: '14px',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    outline: 'none',
    color: '#1a202c',
    backgroundColor: '#ffffff',
  },
  inputError: {
    borderColor: '#ef4444',
  },
  fieldError: {
    fontSize: '12px',
    color: '#ef4444',
  },
  successBanner: {
    padding: '10px 14px',
    backgroundColor: '#f0fdf4',
    border: '1px solid #bbf7d0',
    borderRadius: '6px',
    fontSize: '13px',
    color: '#15803d',
    marginBottom: '16px',
  },
  genericError: {
    padding: '10px 14px',
    backgroundColor: '#fef2f2',
    border: '1px solid #fecaca',
    borderRadius: '6px',
    fontSize: '13px',
    color: '#b91c1c',
    marginBottom: '16px',
  },
  rememberRow: {
    display: 'flex',
    alignItems: 'center',
  },
  checkboxLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '13px',
    color: '#374151',
    cursor: 'pointer',
  },
  checkbox: {
    cursor: 'pointer',
  },
  button: {
    marginTop: '4px',
    padding: '11px',
    backgroundColor: '#2563eb',
    color: '#ffffff',
    border: 'none',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: 600,
    cursor: 'pointer',
  },
  buttonDisabled: {
    backgroundColor: '#93c5fd',
    cursor: 'not-allowed',
  },
  footer: {
    marginTop: '20px',
    fontSize: '13px',
    color: '#64748b',
    textAlign: 'center',
  },
  link: {
    color: '#2563eb',
    textDecoration: 'none',
    fontWeight: 500,
  },
};