import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import RegisterPage from '../../pages/RegisterPage';
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

function renderRegisterPage() {
  return render(
    <MemoryRouter>
      <AuthContext.Provider value={mockAuthContextValue}>
        <RegisterPage />
      </AuthContext.Provider>
    </MemoryRouter>
  );
}

describe('RegisterPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders all form fields and submit button', () => {
    renderRegisterPage();
    expect(screen.getByLabelText('Full Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByLabelText('Confirm Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Register' })).toBeInTheDocument();
  });

  it('calls authService.register with form values on submit', async () => {
    vi.mocked(authService.register).mockResolvedValueOnce({
      message: 'Registrasi berhasil.',
      data: {} as never,
    });

    renderRegisterPage();

    fireEvent.change(screen.getByLabelText('Full Name'), {
      target: { value: 'Ucok Sitorus' },
    });
    fireEvent.change(screen.getByLabelText('Email'), {
      target: { value: 'ucok@example.com' },
    });
    fireEvent.change(screen.getByLabelText('Password'), {
      target: { value: 'password123' },
    });
    fireEvent.change(screen.getByLabelText('Confirm Password'), {
      target: { value: 'password123' },
    });

    fireEvent.click(screen.getByRole('button', { name: 'Register' }));

    await waitFor(() => {
      expect(authService.register).toHaveBeenCalledWith({
        name: 'Ucok Sitorus',
        email: 'ucok@example.com',
        password: 'password123',
        password_confirmation: 'password123',
      });
    });
  });

  it('redirects to /login with success message on 201', async () => {
    vi.mocked(authService.register).mockResolvedValueOnce({
      message: 'Registrasi berhasil.',
      data: {} as never,
    });

    renderRegisterPage();
    fireEvent.change(screen.getByLabelText('Email'), {
      target: { value: 'ucok@example.com' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Register' }));

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/login', {
        state: { successMessage: 'Registrasi berhasil. Silakan login.' },
      });
    });
  });

  it('displays per-field errors on 422', async () => {
    const { AxiosError } = await import('axios');
    const error = new AxiosError('Validation error');
    error.response = {
      status: 422,
      data: {
        message: 'The given data was invalid.',
        errors: { email: ['The email has already been taken.'] },
      },
    } as never;

    vi.mocked(authService.register).mockRejectedValueOnce(error);

    renderRegisterPage();
    fireEvent.click(screen.getByRole('button', { name: 'Register' }));

    await waitFor(() => {
      expect(
        screen.getByText('The email has already been taken.')
      ).toBeInTheDocument();
    });
  });

  it('displays generic error on network failure', async () => {
    vi.mocked(authService.register).mockRejectedValueOnce(new Error('Network Error'));

    renderRegisterPage();
    fireEvent.click(screen.getByRole('button', { name: 'Register' }));

    await waitFor(() => {
      expect(
        screen.getByText('Terjadi kesalahan. Silakan coba lagi.')
      ).toBeInTheDocument();
    });
  });

  it('disables submit button while loading', async () => {
    vi.mocked(authService.register).mockImplementation(
      () => new Promise(() => {})
    );

    renderRegisterPage();
    fireEvent.click(screen.getByRole('button', { name: 'Register' }));

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Register...' })).toBeDisabled();
    });
  });
});