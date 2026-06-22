import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AxiosError } from 'axios';
import { authService } from '../services/authService';
import type { RegisterPayload, ApiValidationError } from '../types/auth';

type FieldErrors = Partial<Record<keyof RegisterPayload, string>>;

export default function RegisterPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState<RegisterPayload>({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    phone: '',
  });

  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [genericError, setGenericError] = useState<string>('');
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
      await authService.register(form);
      navigate('/login', {
        state: { successMessage: 'Registrasi berhasil. Silakan login.' },
      });
    } catch (err) {
      const error = err as AxiosError<ApiValidationError>;

      if (error.response?.status === 422 && error.response.data.errors) {
        const raw = error.response.data.errors;
        const mapped: FieldErrors = {};
        for (const key of Object.keys(raw) as Array<keyof RegisterPayload>) {
          mapped[key] = raw[key][0];
        }
        setFieldErrors(mapped);
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
          <p style={styles.subtitle}>Buat akun baru</p>
        </div>

        {genericError && (
          <div style={styles.genericError} role="alert">
            {genericError}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate style={styles.form}>
          <Field
            label="Nama Lengkap"
            name="name"
            type="text"
            value={form.name}
            onChange={handleChange}
            error={fieldErrors.name}
            autoComplete="name"
          />
          <Field
            label="Email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            error={fieldErrors.email}
            autoComplete="email"
          />
          <Field
            label="No. Telepon"
            name="phone"
            type="tel"
            value={form.phone}
            onChange={handleChange}
            error={fieldErrors.phone}
            autoComplete="tel"
          />
          <Field
            label="Password"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            error={fieldErrors.password}
            autoComplete="new-password"
          />
          <Field
            label="Konfirmasi Password"
            name="password_confirmation"
            type="password"
            value={form.password_confirmation}
            onChange={handleChange}
            error={fieldErrors.password_confirmation}
            autoComplete="new-password"
          />

          <button
            type="submit"
            disabled={isLoading}
            style={{
              ...styles.button,
              ...(isLoading ? styles.buttonDisabled : {}),
            }}
          >
            {isLoading ? 'Mendaftar...' : 'Daftar'}
          </button>
        </form>

        <p style={styles.footer}>
          Sudah punya akun?{' '}
          <Link to="/login" style={styles.link}>
            Masuk
          </Link>
        </p>
      </div>
    </div>
  );
}

interface FieldProps {
  label: string;
  name: string;
  type: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  autoComplete?: string;
}

function Field({ label, name, type, value, onChange, error, autoComplete }: FieldProps) {
  return (
    <div style={styles.fieldWrapper}>
      <label htmlFor={name} style={styles.label}>
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        autoComplete={autoComplete}
        aria-invalid={!!error}
        aria-describedby={error ? `${name}-error` : undefined}
        style={{
          ...styles.input,
          ...(error ? styles.inputError : {}),
        }}
      />
      {error && (
        <span id={`${name}-error`} style={styles.fieldError} role="alert">
          {error}
        </span>
      )}
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
    maxWidth: '420px',
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
    transition: 'border-color 0.15s',
  },
  inputError: {
    borderColor: '#ef4444',
  },
  fieldError: {
    fontSize: '12px',
    color: '#ef4444',
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