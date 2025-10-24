/**
 * Admin actions export
 * Provides clean API for all admin-related operations
 */

import {
  login,
  getProfile,
  getDashboardStats,
} from './actions';

// Export individual actions
export {
  login,
  getProfile,
  getDashboardStats,
};

// Export types for external use
export type {
  AdminLoginRequest,
  AdminLoginResponse,
  GetAdminProfileResponse,
  GetDashboardStatsResponse,
} from './types';

// Grouped actions for easier access
export const adminActions = {
  login,
  getProfile,
  getDashboardStats,
} as const;
