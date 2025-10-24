import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface User {
  id: string;
  full_name: string;
  email?: string;
  phone_number: string;
  profile_picture_url?: string;
  address_line1?: string;
  address_line2?: string;
  city?: string;
  pincode?: string;
  user_type: 'customer' | 'cash_lending_customer' | 'admin';
  email_verified_at?: string;
  phone_verified_at?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Tokens {
  accessToken: string;
  refreshToken: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  tokens: Tokens | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  tokens: null,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Set loading state
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },

    // Set error state
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },

    // Login success - store user and tokens
    loginSuccess: (state, action: PayloadAction<{ user: User; tokens: Tokens }>) => {
      state.user = action.payload.user;
      state.tokens = action.payload.tokens;
      state.isAuthenticated = true;
      state.loading = false;
      state.error = null;
    },

    // Update user profile data
    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },

    // Logout - clear all auth data
    logout: (state) => {
      state.user = null;
      state.tokens = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;
    },

    // Initialize auth state from localStorage
    initializeAuth: (state, action: PayloadAction<{ user: User; tokens: Tokens } | null>) => {
      if (action.payload) {
        state.user = action.payload.user;
        state.tokens = action.payload.tokens;
        state.isAuthenticated = true;
      }
    },

    // Clear error
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  setLoading,
  setError,
  loginSuccess,
  updateUser,
  logout,
  initializeAuth,
  clearError,
} = authSlice.actions;

export default authSlice.reducer;
