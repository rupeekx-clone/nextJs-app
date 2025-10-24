import { createAction } from '../shared/actionFactory';
import { LoaderKeys } from '../shared/constants';
import { loginSuccess } from '@/store/slices/authSlice';
import {
  MobileAuthRequest,
  MobileAuthResponse,
  VerifyMobileOtpRequest,
  VerifyMobileOtpResponse,
  RegisterRequest,
  RegisterResponse,
  VerifyOtpRequest,
  VerifyOtpResponse,
  ForgotPasswordRequest,
  ForgotPasswordResponse,
  ResetPasswordRequest,
  ResetPasswordResponse,
} from './types';

/**
 * Authentication actions with automatic Redux integration
 */

// Send OTP to mobile number
export const sendMobileOtp = createAction<MobileAuthRequest, MobileAuthResponse>({
  method: 'POST',
  url: '/auth/mobile-auth',
  loaderKey: LoaderKeys.AUTH_LOADING,
});

// Verify mobile OTP and login
export const verifyMobileOtp = createAction<VerifyMobileOtpRequest, VerifyMobileOtpResponse>({
  method: 'POST',
  url: '/auth/verify-mobile-otp',
  loaderKey: LoaderKeys.AUTH_LOADING,
  onSuccess: (data, dispatch) => {
    // Store tokens in localStorage
    localStorage.setItem('accessToken', data.tokens.accessToken);
    localStorage.setItem('refreshToken', data.tokens.refreshToken);
    localStorage.setItem('user', JSON.stringify(data.user));
    
    // Map API user data to Redux User type
    const mappedUser = {
      id: data.user._id,
      full_name: data.user.full_name,
      email: data.user.email,
      phone_number: data.user.phone_number,
      profile_picture_url: data.user.profile_picture_url,
      address_line1: data.user.address_line1,
      address_line2: data.user.address_line2,
      city: data.user.city,
      pincode: data.user.pincode,
      user_type: 'customer' as const,
      email_verified_at: data.user.email_verified_at,
      phone_verified_at: data.user.phone_verified_at,
      created_at: data.user.created_at,
      updated_at: data.user.updated_at,
    };
    
    // Dispatch Redux action to store user and tokens
    dispatch(loginSuccess({
      user: mappedUser,
      tokens: data.tokens
    }));
  },
});

// User registration
export const register = createAction<RegisterRequest, RegisterResponse>({
  method: 'POST',
  url: '/auth/register',
  loaderKey: LoaderKeys.AUTH_LOADING,
  onSuccess: (data) => {
    // Store access token in localStorage
    localStorage.setItem('accessToken', data.access_token);
  },
});

// Verify OTP (general)
export const verifyOtp = createAction<VerifyOtpRequest, VerifyOtpResponse>({
  method: 'POST',
  url: '/auth/verify-otp',
  loaderKey: LoaderKeys.AUTH_LOADING,
});

// Forgot password - send OTP
export const forgotPassword = createAction<ForgotPasswordRequest, ForgotPasswordResponse>({
  method: 'POST',
  url: '/auth/forgot-password',
  loaderKey: LoaderKeys.AUTH_LOADING,
});

// Reset password
export const resetPassword = createAction<ResetPasswordRequest, ResetPasswordResponse>({
  method: 'POST',
  url: '/auth/reset-password',
  loaderKey: LoaderKeys.AUTH_LOADING,
});
