import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  checkAuth: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const checkAuth = useCallback((): boolean => {
    const authStatus = localStorage.getItem('adminAuthenticated');
    const loginTime = localStorage.getItem('adminLoginTime');
    
    if (authStatus === 'true' && loginTime) {
      // Check if login is still valid (24 hours)
      const loginDate = new Date(loginTime);
      const now = new Date();
      const hoursDiff = (now.getTime() - loginDate.getTime()) / (1000 * 60 * 60);
      
      if (hoursDiff < 24) {
        setIsAuthenticated(true);
        return true;
      } else {
        // Session expired
        logout();
        return false;
      }
    }
    
    setIsAuthenticated(false);
    return false;
  }, []);

  // Check authentication status on mount
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const login = async (username: string, password: string): Promise<boolean> => {
    // Default credentials
    const DEFAULT_USERNAME = 'admin';
    const DEFAULT_PASSWORD = 'pass';

    if (username === DEFAULT_USERNAME && password === DEFAULT_PASSWORD) {
      localStorage.setItem('adminAuthenticated', 'true');
      localStorage.setItem('adminLoginTime', new Date().toISOString());
      setIsAuthenticated(true);
      return true;
    }
    
    return false;
  };

  const logout = () => {
    localStorage.removeItem('adminAuthenticated');
    localStorage.removeItem('adminLoginTime');
    setIsAuthenticated(false);
  };

  const value = {
    isAuthenticated,
    login,
    logout,
    checkAuth,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 