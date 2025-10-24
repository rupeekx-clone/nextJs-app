/**
 * User actions export
 * Provides clean API for all user-related operations
 */

import {
  getProfile,
  updateProfile,
  uploadProfilePicture,
} from './actions';

// Export individual actions
export {
  getProfile,
  updateProfile,
  uploadProfilePicture,
};

// Export types for external use
export type {
  GetProfileResponse,
  UpdateProfileRequest,
  UpdateProfileResponse,
  UploadProfilePictureRequest,
  UploadProfilePictureResponse,
} from './types';

// Grouped actions for easier access
export const userActions = {
  getProfile,
  updateProfile,
  uploadProfilePicture,
} as const;
