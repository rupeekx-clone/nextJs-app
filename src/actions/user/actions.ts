import { createAction } from '../shared/actionFactory';
import { LoaderKeys } from '../shared/constants';
import { updateUser } from '@/store/slices/authSlice';
import {
  GetProfileResponse,
  UpdateProfileRequest,
  UpdateProfileResponse,
  UploadProfilePictureRequest,
  UploadProfilePictureResponse,
} from './types';

/**
 * User actions with automatic Redux integration
 */

// Get user profile
export const getProfile = createAction<undefined, GetProfileResponse>({
  method: 'GET',
  url: '/users/profile',
  loaderKey: LoaderKeys.USER_LOADING,
});

// Update user profile
export const updateProfile = createAction<UpdateProfileRequest, UpdateProfileResponse>({
  method: 'PUT',
  url: '/users/profile',
  loaderKey: LoaderKeys.USER_LOADING,
  onSuccess: (data, dispatch) => {
    // Update Redux store with new user data
    dispatch(updateUser({
      full_name: data.user.full_name,
      address_line1: data.user.address_line1,
      address_line2: data.user.address_line2,
      city: data.user.city,
      pincode: data.user.pincode,
    }));
  },
});

// Upload profile picture
export const uploadProfilePicture = createAction<UploadProfilePictureRequest, UploadProfilePictureResponse>({
  method: 'POST',
  url: '/users/profile/picture',
  loaderKey: LoaderKeys.PROFILE_PICTURE_UPLOAD,
  onSuccess: (data, dispatch) => {
    // Update Redux store with new profile picture URL
    dispatch(updateUser({
      profile_picture_url: data.profile_picture_url,
    }));
  },
});
