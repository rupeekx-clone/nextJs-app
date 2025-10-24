/**
 * Loading state keys for Redux UI slice
 * Used to track loading states across different actions
 */
export const LoaderKeys = {
  // Existing
  AUTH_LOADING: 'AUTH_LOADING',
  USER_LOADING: 'USER_LOADING',
  PROFILE_PICTURE_UPLOAD: 'PROFILE_PICTURE_UPLOAD',
  
  // New
  ADMIN_LOADING: 'ADMIN_LOADING',
  LOAN_LOADING: 'LOAN_LOADING',
  MEMBERSHIP_LOADING: 'MEMBERSHIP_LOADING',
  CONTACT_LOADING: 'CONTACT_LOADING',
  DOCUMENT_LOADING: 'DOCUMENT_LOADING',
} as const;

export type LoaderKey = typeof LoaderKeys[keyof typeof LoaderKeys];
