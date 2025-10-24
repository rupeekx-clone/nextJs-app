/**
 * TypeScript types for authentication API requests and responses
 */

// Mobile Auth (Send OTP)
export interface MobileAuthRequest {
  phone_number: string;
}

export interface MobileAuthResponse {
  success: boolean;
  message: string;
}

// Verify Mobile OTP
export interface VerifyMobileOtpRequest {
  phone_number: string;
  otp: string;
}

export interface VerifyMobileOtpResponse {
  success: boolean;
  message: string;
  user: {
    _id: string;
    full_name: string;
    email?: string;
    phone_number: string;
    address_line1?: string;
    address_line2?: string;
    city?: string;
    pincode?: string;
    profile_picture_url?: string;
    email_verified_at?: string;
    phone_verified_at?: string;
    created_at: string;
    updated_at: string;
  };
  tokens: {
    accessToken: string;
    refreshToken: string;
  };
}

// User Registration
export interface RegisterRequest {
  full_name: string;
  email: string;
  phone_number: string;
  password: string;
  address_line1?: string;
  address_line2?: string;
  city?: string;
  pincode?: string;
}

export interface RegisterResponse {
  success: boolean;
  message: string;
  access_token: string;
  user: {
    _id: string;
    full_name: string;
    email: string;
    phone_number: string;
    created_at: string;
  };
}

// Verify OTP (General)
export interface VerifyOtpRequest {
  phone_number: string;
  otp_entered: string;
}

export interface VerifyOtpResponse {
  success: boolean;
  message: string;
}

// Forgot Password
export interface ForgotPasswordRequest {
  phone_number: string;
}

export interface ForgotPasswordResponse {
  success: boolean;
  message: string;
}

// Reset Password
export interface ResetPasswordRequest {
  phone_number: string;
  new_password: string;
}

export interface ResetPasswordResponse {
  success: boolean;
  message: string;
}
