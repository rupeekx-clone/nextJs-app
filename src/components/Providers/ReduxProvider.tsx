'use client';

import { Provider } from 'react-redux';
import { store } from '@/store/store';
import { useEffect } from 'react';
import { useAppDispatch } from '@/store/hooks';
import { initializeAuth } from '@/store/slices/authSlice';

interface ReduxProviderProps {
  children: React.ReactNode;
}

function ReduxInitializer({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    // Initialize auth state from localStorage on app mount (only in browser environment)
    const initializeAuthFromStorage = () => {
      // Only run in browser environment
      if (typeof window === 'undefined') {
        return;
      }

      try {
        const accessToken = localStorage.getItem('accessToken');
        const refreshToken = localStorage.getItem('refreshToken');
        const userStr = localStorage.getItem('user');

        if (accessToken && refreshToken && userStr) {
          const user = JSON.parse(userStr);
          dispatch(initializeAuth({
            user,
            tokens: { accessToken, refreshToken }
          }));
        }
      } catch (error) {
        console.error('Error initializing auth from localStorage:', error);
        // Clear invalid data (only in browser environment)
        if (typeof window !== 'undefined') {
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('user');
        }
      }
    };

    initializeAuthFromStorage();
  }, [dispatch]);

  return <>{children}</>;
}

export default function ReduxProvider({ children }: ReduxProviderProps) {
  return (
    <Provider store={store}>
      <ReduxInitializer>
        {children}
      </ReduxInitializer>
    </Provider>
  );
}
