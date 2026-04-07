import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { authService } from '../services/api';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  initials: string;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (credentials: any) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  const fetchMe = useCallback(async () => {
    try {
      const res = await authService.getMe();
      setUser(res.data.data);
    } catch (err) {
      console.error('Failed to fetch user', err);
      logout();
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (token) {
      fetchMe();
    } else {
      setLoading(false);
    }
  }, [token, fetchMe]);

  const login = async (credentials: any) => {
    setLoading(true);
    try {
      const res = await authService.login(credentials);
      const { token, user } = res.data;
      localStorage.setItem('token', token);
      setToken(token);
      setUser(user);
    } catch (err) {
      setLoading(false);
      throw err;
    }
  };

  const register = async (data: any) => {
    setLoading(true);
    try {
      const res = await authService.register(data);
      const { token, user } = res.data;
      localStorage.setItem('token', token);
      setToken(token);
      setUser(user);
    } catch (err) {
      setLoading(false);
      throw err;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{
      user, token, loading, login, register, logout, 
      isAuthenticated: !!token
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
