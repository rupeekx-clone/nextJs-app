/**
 * TypeScript types for admin API requests and responses
 */

// Admin Login
export interface AdminLoginRequest {
  email: string;
  password: string;
}

export interface AdminLoginResponse {
  success: boolean;
  message: string;
  accessToken: string;
  refreshToken: string;
  admin: {
    _id: string;
    email: string;
    role: string;
    created_at: string;
  };
}

// Get Admin Profile
export interface GetAdminProfileResponse {
  success: boolean;
  _id: string;
  email: string;
  role: string;
  created_at: string;
  updated_at: string;
}

// Get Dashboard Stats
export interface GetDashboardStatsResponse {
  success: boolean;
  stats: {
    totalUsers: number;
    totalApplications: number;
    pendingApplications: number;
    approvedApplications: number;
    rejectedApplications: number;
    totalRevenue: number;
    monthlyRevenue: number;
  };
}
