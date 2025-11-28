/**
 * Authentication hook for managing user session
 */

import { useState, useCallback } from 'react';
import type { LoginCredentials, AuthState } from '../types';
import type { User } from '../../../shared/types/core';
import { MOCK_USERS } from '../../../data/mockData';
import { storageUtils } from '../../../shared/utils/storage';

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>(() => {
    // Try to restore session from storage
    const savedUser = storageUtils.getUserSession();
    return {
      user: savedUser,
      isAuthenticated: !!savedUser,
      isLoading: false,
      error: null
    };
  });

  const login = useCallback(async (credentials: LoginCredentials): Promise<boolean> => {
    setAuthState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));

      // Find user in mock database
      const user = MOCK_USERS.find(
        u => u.username.toLowerCase() === credentials.username.toLowerCase() && 
             u.password === credentials.password
      );

      if (user) {
        // Save session to storage
        storageUtils.saveUserSession(user);
        
        setAuthState({
          user,
          isAuthenticated: true,
          isLoading: false,
          error: null
        });
        
        return true;
      } else {
        setAuthState(prev => ({
          ...prev,
          isLoading: false,
          error: 'Invalid username or password'
        }));
        return false;
      }
    } catch (error) {
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: 'Login failed. Please try again.'
      }));
      return false;
    }
  }, []);

  const logout = useCallback(() => {
    storageUtils.clearUserSession();
    setAuthState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null
    });
  }, []);

  const clearError = useCallback(() => {
    setAuthState(prev => ({ ...prev, error: null }));
  }, []);

  return {
    ...authState,
    login,
    logout,
    clearError
  };
};