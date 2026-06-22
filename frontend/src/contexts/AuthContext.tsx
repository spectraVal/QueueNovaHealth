import {
    createContext,
    useState,
    useEffect,
    useCallback,
    type ReactNode,
  } from 'react';
  import type { AuthUser, AuthState, LoginResponseData } from '../types/auth';
  
  interface AuthContextValue extends AuthState {
    setAuth: (data: LoginResponseData) => void;
    clearAuth: () => void;
  }
  
  export const AuthContext = createContext<AuthContextValue | null>(null);
  
  const TOKEN_KEY = '__auth_token__';
  
  export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [token, setToken] = useState<string | null>(
      () => sessionStorage.getItem(TOKEN_KEY)
    );
  
    useEffect(() => {
      if (token) {
        sessionStorage.setItem(TOKEN_KEY, token);
      } else {
        sessionStorage.removeItem(TOKEN_KEY);
      }
    }, [token]);
  
    const setAuth = useCallback((data: LoginResponseData) => {
      setToken(data.token);
      setUser(data.user);
    }, []);
  
    const clearAuth = useCallback(() => {
      setToken(null);
      setUser(null);
    }, []);
  
    return (
      <AuthContext.Provider
        value={{
          user,
          token,
          isAuthenticated: !!token,
          setAuth,
          clearAuth,
        }}
      >
        {children}
      </AuthContext.Provider>
    );
  }