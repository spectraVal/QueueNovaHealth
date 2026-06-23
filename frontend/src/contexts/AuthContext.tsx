import {
  createContext,
  useState,
  useCallback,
  type ReactNode,
} from 'react';
import type { AuthUser, AuthState, LoginResponseData } from '../types/auth';

interface AuthContextValue extends AuthState {
  setAuth: (data: LoginResponseData) => void;
  clearAuth: () => void;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);

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
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}