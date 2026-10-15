import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User, UserRole } from '../types';
import { api } from '../services/api';
import { soundFx } from '../services/audio';

interface AuthContextType {
  currentUser: User | null;
  isLoading: boolean;
  isBackendConnected: boolean | null;
  error: string | null;
  signin: (email: string) => Promise<boolean>;
  signup: (name: string, email: string, role: UserRole) => Promise<boolean>;
  signout: () => void;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('hail_mary_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isBackendConnected, setIsBackendConnected] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check backend health
    api.checkHealth().then((connected) => {
      setIsBackendConnected(connected);
    });

    const interval = setInterval(() => {
      api.checkHealth().then((connected) => {
        setIsBackendConnected(connected);
      });
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  const signin = async (email: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.signin(email.trim());
      if (response && response.data) {
        setCurrentUser(response.data);
        localStorage.setItem('hail_mary_user', JSON.stringify(response.data));
        soundFx.playOverrideSuccess();
        return true;
      }
      return false;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Authentication failure';
      setError(message);
      soundFx.playAlert();
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (name: string, email: string, role: UserRole): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.signup(name.trim(), email.trim(), role);
      if (response && response.data) {
        setCurrentUser(response.data);
        localStorage.setItem('hail_mary_user', JSON.stringify(response.data));
        soundFx.playOverrideSuccess();
        return true;
      }
      return false;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Registration failed';
      setError(message);
      soundFx.playAlert();
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const signout = () => {
    setCurrentUser(null);
    localStorage.removeItem('hail_mary_user');
    soundFx.playKeyClick();
  };

  const clearError = () => setError(null);

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isLoading,
        isBackendConnected,
        error,
        signin,
        signup,
        signout,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
