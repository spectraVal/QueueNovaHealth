import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import { LogoutButton } from '../../components/LogoutButton';
import { authService } from '../../services/authService';
import type { AuthState, LoginResponseData } from '../../types/auth';

vi.mock('../../services/authService');

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return { ...actual, useNavigate: () => mockNavigate };
});

const mockClearAuth = vi.fn<() => void>();

const mockAuthContextValue = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  setAuth: vi.fn<(data: LoginResponseData) => void>(),
  clearAuth: mockClearAuth,
} satisfies AuthState & {
  isLoading: boolean;
  setAuth: (data: LoginResponseData) => void;
  clearAuth: () => void;
};

function renderLogoutButton() {
  return render(
    <MemoryRouter>
      <AuthContext.Provider value={mockAuthContextValue}>
        <LogoutButton />
      </AuthContext.Provider>
    </MemoryRouter>
  );
}

describe('LogoutButton', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders logout button', () => {
    renderLogoutButton();
    expect(
      screen.getByRole('button', { name: 'Logout' })
    ).toBeInTheDocument();
  });

  it('calls authService.logout, clears auth, and redirects to /login on success', async () => {
    vi.mocked(authService.logout).mockResolvedValueOnce(undefined);

    renderLogoutButton();
    fireEvent.click(screen.getByRole('button', { name: 'Logout' }));

    await waitFor(() => {
      expect(authService.logout).toHaveBeenCalledOnce();
      expect(mockClearAuth).toHaveBeenCalledOnce();
      expect(mockNavigate).toHaveBeenCalledWith('/login', { replace: true });
    });
  });

  it('clears auth and redirects on 401 — session already expired', async () => {
    const { AxiosError } = await import('axios');
    const error = new AxiosError('Unauthorized');
    error.response = {
      status: 401,
      data: { message: 'Unauthenticated.' },
    } as never;

    vi.mocked(authService.logout).mockRejectedValueOnce(error);

    renderLogoutButton();
    fireEvent.click(screen.getByRole('button', { name: 'Logout' }));

    await waitFor(() => {
      expect(mockClearAuth).toHaveBeenCalledOnce();
      expect(mockNavigate).toHaveBeenCalledWith('/login', { replace: true });
    });
  });

  it('shows generic error and does not clear auth on non-401 error', async () => {
    const { AxiosError } = await import('axios');
    const error = new AxiosError('Server Error');
    error.response = {
      status: 500,
      data: { message: 'Server Error.' },
    } as never;

    vi.mocked(authService.logout).mockRejectedValueOnce(error);

    renderLogoutButton();
    fireEvent.click(screen.getByRole('button', { name: 'Logout' }));

    await waitFor(() => {
      expect(
        screen.getByText('Logout failed. Please try again.')
      ).toBeInTheDocument();
      expect(mockClearAuth).not.toHaveBeenCalled();
      expect(mockNavigate).not.toHaveBeenCalled();
    });
  });

  it('disables button while loading', async () => {
    vi.mocked(authService.logout).mockImplementation(
      () => new Promise(() => {})
    );

    renderLogoutButton();
    fireEvent.click(screen.getByRole('button', { name: 'Logout' }));

    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: 'Logging out...' })
      ).toBeDisabled();
    });
  });
});