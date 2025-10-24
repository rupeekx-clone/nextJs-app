/**
 * TypeScript types for user API requests and responses
 */

// Get User Profile
export interface GetProfileResponse {
  success: boolean;
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
}

// Update User Profile
export interface UpdateProfileRequest {
  full_name: string;
  address_line1?: string;
  address_line2?: string;
  city?: string;
  pincode?: string;
}

export interface UpdateProfileResponse {
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
}

// Upload Profile Picture
export interface UploadProfilePictureRequest {
  profilePicture: File;
}

export interface UploadProfilePictureResponse {
  success: boolean;
  message: string;
  profile_picture_url: string;
}
