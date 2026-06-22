// frontend/src/pages/LoginPage.tsx
import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { AxiosError } from 'axios';
import { authService } from '../services/authService';
import { useAuth } from '../hooks/useAuth';
import type { LoginPayload, ApiValidationError, UserRole } from '../types/auth';
import doctorsIllustration from '../assets/images/canva-doctor-and-nurse-medical-consultation-MAHHY3lElT4.png';

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
  const [showPassword, setShowPassword] = useState(false);
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
    <div className="fixed inset-0 flex flex-col lg:flex-row">
      {/* LEFT PANEL */}
      <div className="flex flex-1 items-center justify-center bg-[#f0fdf4] px-8 py-12">
        <div className="w-full max-w-sm">

          {successMessage && (
            <div className="mb-4 px-4 py-3 bg-[#f0fdf4] border border-[#bbf7d0] rounded-md text-sm text-[#15803d]" role="status">
              {successMessage}
            </div>
          )}

          {genericError && (
            <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-md text-sm text-red-700" role="alert">
              {genericError}
            </div>
          )}

          <h1 className="text-[40px] font-bold text-[#171923] mb-1 leading-tight">Sign in</h1>

          <p className="text-sm text-[#4a5568] mb-8">
            Don't have an account?{' '}
            <Link to="/register" className="text-[#059669] font-medium underline underline-offset-2">
              Create now
            </Link>
          </p>

          <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
            {/* Email */}
            <div className="flex flex-col gap-1">
              <label htmlFor="email" className="text-sm font-medium text-[#4a5568]">
                E-mail
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                autoComplete="email"
                placeholder="example@gmail.com"
                aria-invalid={!!fieldErrors.email}
                aria-describedby={fieldErrors.email ? 'email-error' : undefined}
                className={`px-3 py-2.5 text-sm border rounded-lg outline-none bg-white text-[#171923] placeholder:text-[#a0aec0] focus:ring-2 focus:ring-[#059669] focus:border-[#059669] ${
                  fieldErrors.email ? 'border-red-400' : 'border-[#cbd5e0]'
                }`}
              />
              {fieldErrors.email && (
                <span id="email-error" className="text-xs text-red-500" role="alert">
                  {fieldErrors.email}
                </span>
              )}
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1">
              <label htmlFor="password" className="text-sm font-medium text-[#4a5568]">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={form.password}
                  onChange={handleChange}
                  autoComplete="current-password"
                  placeholder="@#*%"
                  aria-invalid={!!fieldErrors.password}
                  aria-describedby={fieldErrors.password ? 'password-error' : undefined}
                  className={`w-full px-3 py-2.5 pr-10 text-sm border rounded-lg outline-none bg-white text-[#171923] placeholder:text-[#a0aec0] focus:ring-2 focus:ring-[#059669] focus:border-[#059669] ${
                    fieldErrors.password ? 'border-red-400' : 'border-[#cbd5e0]'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#718096] hover:text-[#4a5568]"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    {showPassword ? (
                      <>
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                        <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                        <line x1="1" y1="1" x2="23" y2="23" />
                      </>
                    ) : (
                      <>
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </>
                    )}
                  </svg>
                </button>
              </div>
              {fieldErrors.password && (
                <span id="password-error" className="text-xs text-red-500" role="alert">
                  {fieldErrors.password}
                </span>
              )}
            </div>

            {/* Remember me + Forgot password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm text-[#4a5568] cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="accent-[#059669] cursor-pointer"
                />
                Remember me
              </label>
              <Link to="/forgot-password" className="text-sm text-[#4a5568] hover:text-[#059669]">
                Forgot Password?
              </Link>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className={`mt-1 py-3 rounded-full text-sm font-semibold text-white transition-colors ${
                isLoading
                  ? 'bg-[#6ee7b7] cursor-not-allowed'
                  : 'bg-[#059669] hover:bg-[#047857] cursor-pointer'
              }`}
            >
              {isLoading ? 'Logging in...' : 'Login'}
            </button>
          </form>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="hidden lg:flex flex-1 flex-col items-center justify-between bg-[#059669] px-12 py-10">
        {/* Logo */}
        <div className="w-full flex items-center gap-2">
          <div className="w-10 h-10 bg-white rounded-md flex items-center justify-center">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" />
              <rect x="9" y="3" width="6" height="4" rx="2" />
              <path d="M12 11v4M10 13h4" />
            </svg>
          </div>
          <span className="text-white font-semibold text-lg">QueueNova</span>
        </div>

        {/* Illustration */}
        <div className="flex flex-col items-center gap-6 flex-1 justify-center">
          <div className="relative flex items-end justify-center">
            {/* Grey cloud blob behind illustration */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 w-72 h-64 rounded-full bg-[#b0b8b4] opacity-40 blur-sm" />
            <img
              src={doctorsIllustration}
              alt="Doctor and nurse illustration"
              className="relative z-10 w-72 h-auto object-contain drop-shadow-md"
            />
          </div>

          <p className="text-white text-2xl font-bold text-center">
            Welcome to QueueNova Health
          </p>
        </div>

        {/* Carousel dots */}
        <div className="flex items-center gap-3">
          <button className="text-white opacity-60 hover:opacity-100" aria-label="Previous">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6"/></svg>
          </button>
          <span className="w-2 h-2 rounded-full bg-white opacity-40 inline-block"/>
          <span className="w-6 h-2 rounded-full bg-white inline-block"/>
          <span className="w-2 h-2 rounded-full bg-white opacity-40 inline-block"/>
          <button className="text-white opacity-60 hover:opacity-100" aria-label="Next">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>
          </button>
        </div>
      </div>
    </div>
  );
}