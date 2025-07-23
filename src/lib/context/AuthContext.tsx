// context/AuthContext.tsx - Professional Auth & Theme Context
import { useState, useEffect, createContext, useContext, ReactNode, useCallback, useMemo } from 'react';
import axios from 'axios';
import { toast } from 'sonner';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:8000';

// Error handling interfaces
interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
  message?: string;
}

// Enhanced TypeScript interfaces
interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role?: string;
  preferences?: {
    theme?: 'light' | 'dark' | 'system';
    language?: string;
  };
}

type Theme = 'light' | 'dark' | 'system';

interface AuthContextType {
  // User authentication
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  signup: (formData: SignupFormData) => Promise<void>;
  refreshTokens: () => Promise<boolean>;
  isAuthenticated: boolean;
  loading: boolean;
  
  // Theme management
  theme: Theme;
  setTheme: (theme: Theme) => void;
  isDarkMode: boolean;
}

interface SignupFormData {
  name: string;
  email: string;
  birthday: string;
  password: string;
  confirm_password: string;
}


const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Theme utilities
const getSystemTheme = (): 'light' | 'dark' => {
  if (typeof window === 'undefined') return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

const getStoredTheme = (): Theme => {
  if (typeof window === 'undefined') return 'system';
  return (localStorage.getItem('theme') as Theme) || 'system';
};

const applyTheme = (theme: Theme) => {
  if (typeof window === 'undefined') return;
  
  const root = window.document.documentElement;
  const isDark = theme === 'dark' || (theme === 'system' && getSystemTheme() === 'dark');
  
  root.classList.toggle('dark', isDark);
  localStorage.setItem('theme', theme);
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [theme, setThemeState] = useState<Theme>('system');

  // Theme management
  const setTheme = useCallback((newTheme: Theme) => {
    setThemeState(newTheme);
    applyTheme(newTheme);
  }, []);

  const isDarkMode = useMemo(() => {
    return theme === 'dark' || (theme === 'system' && getSystemTheme() === 'dark');
  }, [theme]);

  // Initialize theme
  useEffect(() => {
    const storedTheme = getStoredTheme();
    setThemeState(storedTheme);
    applyTheme(storedTheme);

    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      if (theme === 'system') {
        applyTheme('system');
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme]);

  // Authentication check
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/auth/me`, {
          withCredentials: true,
        });
        
        // Ensure response matches User interface
        setUser({
          id: response.data.id,
          email: response.data.email,
          name: response.data.name,
          avatar: response.data.avatar,
          role: response.data.role,
          preferences: response.data.preferences || {}
        });

        // Apply user's preferred theme if available
        if (response.data.preferences?.theme) {
          setTheme(response.data.preferences.theme);
        }
      } catch (error) {
        setUser(null);
        console.debug('Auth check failed - user not authenticated');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [setTheme]);

  // Enhanced login with better error handling
  const login = useCallback(async (email: string, password: string) => {
    try {
      setLoading(true);
      await axios.post(`${BASE_URL}/auth/login`, { email, password }, { withCredentials: true });
      
      // Verify login was successful and get user data
      const meResponse = await axios.get(`${BASE_URL}/auth/me`, { withCredentials: true });
      
      const userData: User = {
        id: meResponse.data.id,
        email: meResponse.data.email,
        name: meResponse.data.name,
        avatar: meResponse.data.avatar,
        role: meResponse.data.role,
        preferences: meResponse.data.preferences || {}
      };
      
      setUser(userData);
      
      // Apply user's theme preference
      if (userData.preferences?.theme) {
        setTheme(userData.preferences.theme);
      }
      
      toast.success('Welcome back!');
    } catch (error) {
      console.error('Login failed:', error);
      const apiError = error as ApiError;
      const message = apiError.response?.data?.message || 'Login failed. Please check your credentials.';
      toast.error(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  }, [setTheme]);

  // Enhanced logout with cleanup
  const logout = useCallback(async () => {
    try {
      await axios.post(`${BASE_URL}/auth/logout`, {}, { withCredentials: true });
      setUser(null);
      
      // Reset theme to system default on logout
      setTheme('system');

      toast.success('Logged out successfully');
    } catch (error) {
      console.error('Logout failed:', error);
      // Even if logout fails on server, clear local state
      setUser(null);
      setTheme('system');
    }
  }, [setTheme]);

  // Enhanced refresh tokens
  const refreshTokens = useCallback(async (): Promise<boolean> => {
    try {
      await axios.post(`${BASE_URL}/auth/refresh`, {}, { withCredentials: true });
      return true;
    } catch (error) {
      console.debug('Token refresh failed:', error);
      return false;
    }
  }, []);

  // Enhanced signup with better error handling
  const signup = useCallback(async (formData: SignupFormData) => {
    try {
      setLoading(true);
      await axios.post(`${BASE_URL}/auth/signup`, formData, { withCredentials: true });
      
      // Get the user info after signup
      const meResponse = await axios.get(`${BASE_URL}/auth/me`, { withCredentials: true });
      
      const userData: User = {
        id: meResponse.data.id,
        email: meResponse.data.email,
        name: meResponse.data.name,
        avatar: meResponse.data.avatar,
        role: meResponse.data.role,
        preferences: meResponse.data.preferences || {}
      };
      
      setUser(userData);
      toast.success('Account created successfully!');
    } catch (error) {
      console.error('Signup failed:', error);
      const apiError = error as ApiError;
      const message = apiError.response?.data?.message || 'Signup failed. Please try again.';
      toast.error(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Memoized context value for performance
  const value = useMemo(() => ({
    // User authentication
    user,
    login,
    logout,
    signup,
    refreshTokens,
    isAuthenticated: !!user,
    loading,
    
    // Theme management
    theme,
    setTheme,
    isDarkMode
  }), [user, login, logout, signup, refreshTokens, loading, theme, setTheme, isDarkMode]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Custom hook for theme management only
export function useTheme() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useTheme must be used within an AuthProvider');
  }
  
  return {
    theme: context.theme,
    setTheme: context.setTheme,
    isDarkMode: context.isDarkMode
  };
}

// Custom hook for user authentication only
export function useUser() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useUser must be used within an AuthProvider');
  }
  
  return {
    user: context.user,
    isAuthenticated: context.isAuthenticated,
    loading: context.loading
  };
}