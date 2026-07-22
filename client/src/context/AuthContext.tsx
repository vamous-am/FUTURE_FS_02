import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from 'react';
import api from '../lib/api.js';
import { authRef } from '../lib/authRef.js';

interface AuthUser {
  username: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

/**
 * Returns the AuthContext value. Must be used inside AuthProvider.
 */
export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

interface AuthProviderProps {
  children: ReactNode;
}

/**
 * Provides authentication state and actions to the component tree.
 * Rehydrates auth state on mount via GET /api/auth/me.
 * Registers logout() in authRef so the Axios interceptor can call it.
 */
export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  const logout = useCallback(async () => {
    setUser(null);
    try {
      await api.post('/api/auth/logout');
    } catch {
      // Cookie is cleared server-side; local state is already null
    }
  }, []);

  useEffect(() => {
    // Register logout in the module-level ref for the Axios interceptor
    authRef.logout = () => {
      setUser(null);
    };
  }, []);

  useEffect(() => {
    api
      .get<{ success: boolean; data: { username: string } }>('/api/auth/me')
      .then((res) => setUser({ username: res.data.data.username }))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  const login = useCallback(
    async (username: string, password: string): Promise<void> => {
      const res = await api.post<{
        success: boolean;
        data: { username: string };
      }>('/api/auth/login', { username, password });
      setUser({ username: res.data.data.username });
    },
    [],
  );

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
