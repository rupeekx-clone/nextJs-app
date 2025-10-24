import { createAction } from '../shared/actionFactory';
import { LoaderKeys } from '../shared/constants';
import {
  AdminLoginRequest,
  AdminLoginResponse,
  GetAdminProfileResponse,
  GetDashboardStatsResponse,
} from './types';

/**
 * Admin actions with automatic Redux integration
 */

// Admin login
export const login = createAction<AdminLoginRequest, AdminLoginResponse>({
  method: 'POST',
  url: '/admin/login',
  loaderKey: LoaderKeys.ADMIN_LOADING,
  onSuccess: (data) => {
    // Store admin tokens in localStorage
    localStorage.setItem('adminAccessToken', data.accessToken);
    localStorage.setItem('adminRefreshToken', data.refreshToken);
  },
});

// Get admin profile
export const getProfile = createAction<undefined, GetAdminProfileResponse>({
  method: 'GET',
  url: '/admin/profile',
  loaderKey: LoaderKeys.ADMIN_LOADING,
});

// Get dashboard statistics
export const getDashboardStats = createAction<undefined, GetDashboardStatsResponse>({
  method: 'GET',
  url: '/admin/dashboard/stats',
  loaderKey: LoaderKeys.ADMIN_LOADING,
});
