import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import LoginPage from '../../pages/LoginPage';
import { authService } from '../../services/authService';
import type { AuthState, LoginResponseData } from '../../types/auth';

vi.mock('../../services/authService');

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return { ...actual, useNavigate: () => mockNavigate };
});

const mockSetAuth = vi.fn<(data: LoginResponseData) => void>();
const mockClearAuth = vi.fn<() => void>();

const mockAuthContextValue = {
    user: null,
    token: null,
    isAuthenticated: false,
    setAuth: mockSetAuth,
    clearAuth: mockClearAuth,
  } satisfies AuthState & {
    setAuth: (data: LoginResponseData) => void;
    clearAuth: () => void;
  };

function renderLoginPage() {
  return render(
    <MemoryRouter>
      <AuthContext.Provider value={mockAuthContextValue}>
        <LoginPage />
      </AuthContext.Provider>
    </MemoryRouter>
  );
}

const mockLoginResponse: { message: string; data: LoginResponseData } = {
  message: 'Login berhasil.',
  data: {
    token: 'test-token-123',
    token_type: 'Bearer',
    user: {
      user_id: 10,
      email: 'ucok@example.com',
      role: 'patient',
      status: 'active',
      profile: {
        patient_id: 5,
        name: 'Ucok Sitorus',
        phone: '081234567890',
        bpjs_number: null,
        birth_place: null,
        birth_date: null,
        gender: null,
      },
    },
  },
};

describe('LoginPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders email, password fields and submit button', () => {
    renderLoginPage();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Masuk' })).toBeInTheDocument();
  });

  it('calls authService.login with correct payload on submit', async () => {
    vi.mocked(authService.login).mockResolvedValueOnce(mockLoginResponse);

    renderLoginPage();

    fireEvent.change(screen.getByLabelText('Email'), {
      target: { value: 'ucok@example.com' },
    });
    fireEvent.change(screen.getByLabelText('Password'), {
      target: { value: 'password123' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Masuk' }));

    await waitFor(() => {
      expect(authService.login).toHaveBeenCalledWith({
        email: 'ucok@example.com',
        password: 'password123',
      });
    });
  });

  it('calls setAuth and navigates to /dashboard on successful login', async () => {
    vi.mocked(authService.login).mockResolvedValueOnce(mockLoginResponse);

    renderLoginPage();
    fireEvent.change(screen.getByLabelText('Email'), {
      target: { value: 'ucok@example.com' },
    });
    fireEvent.change(screen.getByLabelText('Password'), {
      target: { value: 'password123' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Masuk' }));

    await waitFor(() => {
      expect(mockSetAuth).toHaveBeenCalledWith(mockLoginResponse.data);
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard', { replace: true });
    });
  });

  it('displays "Email atau password salah" on 401', async () => {
    const { AxiosError } = await import('axios');
    const error = new AxiosError('Unauthorized');
    error.response = {
      status: 401,
      data: { message: 'Email atau password salah.' },
    } as never;

    vi.mocked(authService.login).mockRejectedValueOnce(error);

    renderLoginPage();
    fireEvent.click(screen.getByRole('button', { name: 'Masuk' }));

    await waitFor(() => {
      expect(
        screen.getByText('Email atau password salah.')
      ).toBeInTheDocument();
    });
  });

  it('displays per-field errors on 422', async () => {
    const { AxiosError } = await import('axios');
    const error = new AxiosError('Validation error');
    error.response = {
      status: 422,
      data: {
        message: 'The given data was invalid.',
        errors: { email: ['The email field is required.'] },
      },
    } as never;

    vi.mocked(authService.login).mockRejectedValueOnce(error);

    renderLoginPage();
    fireEvent.click(screen.getByRole('button', { name: 'Masuk' }));

    await waitFor(() => {
      expect(
        screen.getByText('The email field is required.')
      ).toBeInTheDocument();
    });
  });

  it('disables submit button while loading', async () => {
    vi.mocked(authService.login).mockImplementation(
      () => new Promise(() => {})
    );

    renderLoginPage();
    fireEvent.click(screen.getByRole('button', { name: 'Masuk' }));

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Masuk...' })).toBeDisabled();
    });
  });

  it('renders success message passed via location state', () => {
    render(
      <MemoryRouter
        initialEntries={[
          { pathname: '/login', state: { successMessage: 'Registrasi berhasil. Silakan login.' } },
        ]}
      >
        <AuthContext.Provider value={mockAuthContextValue}>
          <LoginPage />
        </AuthContext.Provider>
      </MemoryRouter>
    );

    expect(
      screen.getByText('Registrasi berhasil. Silakan login.')
    ).toBeInTheDocument();
  });
});