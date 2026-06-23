import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AxiosError } from 'axios';
import { authService } from '../services/authService';
import { useAuth } from '../hooks/useAuth';

export function LogoutButton() {
  const { clearAuth } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleLogout() {
    setIsLoading(true);
    setError('');

    try {
      await authService.logout();
      clearAuth();
      navigate('/login', { replace: true });
    } catch (err) {
      const axiosError = err as AxiosError;

      if (axiosError.response?.status === 401) {
        // Session already expired — clear state and redirect anyway
        clearAuth();
        navigate('/login', { replace: true });
      } else {
        setError('Logout failed. Please try again.');
        setIsLoading(false);
      }
    }
  }

  return (
    <div>
      {error && (
        <span style={styles.error} role="alert">
          {error}
        </span>
      )}
      <button
        onClick={handleLogout}
        disabled={isLoading}
        style={{
          ...styles.button,
          ...(isLoading ? styles.buttonDisabled : {}),
        }}
      >
        {isLoading ? 'Logging out...' : 'Logout'}
      </button>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  button: {
    padding: '8px 16px',
    backgroundColor: '#ef4444',
    color: '#ffffff',
    border: 'none',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: 600,
    cursor: 'pointer',
  },
  buttonDisabled: {
    backgroundColor: '#fca5a5',
    cursor: 'not-allowed',
  },
  error: {
    fontSize: '12px',
    color: '#ef4444',
    display: 'block',
    marginBottom: '8px',
  },
};