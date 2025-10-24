/**
 * Authentication actions export
 * Provides clean API for all auth-related operations
 */

import {
  sendMobileOtp,
  verifyMobileOtp,
  register,
  verifyOtp,
  forgotPassword,
  resetPassword,
} from './actions';

// Export individual actions
export {
  sendMobileOtp,
  verifyMobileOtp,
  register,
  verifyOtp,
  forgotPassword,
  resetPassword,
};

// Export types for external use
export type {
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

// Grouped actions for easier access
export const authActions = {
  sendMobileOtp,
  verifyMobileOtp,
  register,
  verifyOtp,
  forgotPassword,
  resetPassword,
} as const;
