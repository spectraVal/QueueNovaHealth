import {
  createContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from 'react';
import type { AuthUser, AuthState, LoginResponseData } from '../types/auth';
import { authService } from '../services/authService';

interface AuthContextValue extends AuthState {
  setAuth: (data: LoginResponseData) => void;
  clearAuth: () => void;
  isLoading: boolean;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    authService
      .getMe()
      .then((response) => {
        setUser(response.data);
      })
      .catch(() => {
        setUser(null);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const setAuth = useCallback((data: LoginResponseData) => {
    setUser(data.user);
  }, []);

  const clearAuth = useCallback(() => {
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        setAuth,
        clearAuth,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}