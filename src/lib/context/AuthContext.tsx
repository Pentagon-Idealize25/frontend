// context/AuthContext.tsx
import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import axios from 'axios';


interface User {
  id: string;
  email: string;
  name: string;
  // Add other user properties as needed
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  loading: boolean;
  signup: (formData: SignupFormData) => Promise<void>;         // <-- Add this
  refreshTokens: () => Promise<boolean>;    
}
 type SignupFormData = {
  name: string;
  email: string;
  birthday: string;
  password: string;
  confirm_password: string;
};


const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const [loading, setLoading] = useState(true);

// In AuthContext.tsx
useEffect(() => {
  const checkAuth = async () => {
    try {
      const response = await axios.get('http://localhost:8000/auth/me', {
        withCredentials: true,
      });
      
      // Ensure response matches your User interface
      setUser({
        id: response.data.id,
        email: response.data.email,
        name: response.data.name
      });
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  checkAuth();
}, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await axios.post('http://localhost:8000/auth/login',{ email, password }, {withCredentials: true});
      
      // Verify login was successful
      const meResponse = await axios.get('http://localhost:8000/auth/me', {withCredentials: true});
      
      setUser(meResponse.data);
    } catch (error) {
      console.error('Login failed:', error);
      throw new Error('Login failed');
    }
  };

  const logout = async () => {
    try {
      await axios.post(
        'http://localhost:8000/auth/logout', 
        {},
        { withCredentials: true }
      );
      setUser(null);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

const refreshTokens = async () => {
  try {
    await axios.post(
      'http://localhost:8000/auth/refresh',
      {},
      { withCredentials: true }
    );
    return true;
  } catch (error) {
    return false;
  }
};


const signup = async (formData: SignupFormData) => {
  try {
    let birthday;
    try {
      // Ensure the date is in ISO format
      if (!formData.birthday) {
        throw new Error('Birthday is required');
      }
      birthday = new Date(formData.birthday).toISOString().split('T')[0];
    } catch (e) {
      throw new Error('Invalid date format. Please use YYYY-MM-DD');
    }

    const formattedData = {
      ...formData,
      birthday
    };

    const response = await axios.post(
      'http://localhost:8000/auth/signup',
      formattedData,
      { 
        withCredentials: true,
        validateStatus: (status) => status < 500 // Don't reject if the status code is less than 500
      }
    );

    if (response.data.status === 'error') {
      throw new Error(response.data.message || 'Signup failed');
    }

    if (response.data.status === 'success' && response.data.data) {
      // Set the user directly from the signup response
      setUser(response.data.data);
    } else {
      console.error('Unexpected response format:', response.data);
      throw new Error('Invalid response format from server');
    }
  } catch (error: any) {
    console.error('Signup failed:', error.response?.data || error);
    
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    } else if (error.message) {
      throw new Error(error.message);
    } else {
      throw new Error('An unexpected error occurred during signup');
    }
  }
};

  
  const value = {
    user,
    login,
    logout,
    refreshTokens,
    isAuthenticated: !!user,
    loading,
    signup
  };

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