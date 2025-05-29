import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { jwtDecode } from 'jwt-decode';
import { apiLogin, apiRegister } from '../services/authService';
import toast from 'react-hot-toast';

interface AuthContextType {
  isAuthenticated: boolean;
  user: UserType | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => void;
  checkAuth: () => void;
}

interface UserType {
  id: string;
  email: string;
}

interface AuthProviderProps {
  children: ReactNode;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  user: null,
  loading: false,
  login: async () => {},
  register: async () => {},
  logout: () => {},
  checkAuth: () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(false);

  const checkAuth = useCallback(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setIsAuthenticated(false);
      setUser(null);
      return;
    }

    try {
      const decoded = jwtDecode(token) as { id: string; email: string; exp: number };
      
      if (decoded.exp * 1000 < Date.now()) {
        // Token expired
        localStorage.removeItem('token');
        setIsAuthenticated(false);
        setUser(null);
        return;
      }

      setIsAuthenticated(true);
      setUser({ 
        id: decoded.id, 
        email: decoded.email 
      });
    } catch (error) {
      console.error('Invalid token:', error);
      localStorage.removeItem('token');
      setIsAuthenticated(false);
      setUser(null);
    }
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const { token } = await apiLogin(email, password);
      localStorage.setItem('token', token);
      
      const decoded = jwtDecode(token) as { id: string; email: string };
      setUser({ id: decoded.id, email: decoded.email });
      setIsAuthenticated(true);
      
      toast.success('Successfully logged in');
    } catch (error) {
      toast.error('Invalid credentials');
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  const register = async (email: string, password: string) => {
    setLoading(true);
    try {
      await apiRegister(email, password);
      toast.success('Registration successful! You can now log in.');
    } catch (error) {
      toast.error('Registration failed. Please try again.');
      console.error('Register error:', error);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    setUser(null);
    toast.success('Successfully logged out');
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        loading,
        login,
        register,
        logout,
        checkAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};