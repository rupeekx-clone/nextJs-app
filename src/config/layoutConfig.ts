export interface LayoutVisibility {
  showHeader: boolean;
  showFooter: boolean;
}

export interface LayoutConfig {
  [route: string]: LayoutVisibility;
}

// Configuration for controlling Header and Footer visibility on specific routes
export const layoutConfig: LayoutConfig = {
  // Customer authentication pages - show header but hide footer
  '/customer': { showHeader: true, showFooter: false },
  '/customer/signup': { showHeader: true, showFooter: false },
  '/customer/forgot-password': { showHeader: true, showFooter: false },
  '/customer/reset-password': { showHeader: true, showFooter: false },
  '/customer/verify-otp': { showHeader: true, showFooter: false },
  '/customer/mobile-login': { showHeader: true, showFooter: false },
  
  // Admin authentication pages - show header but hide footer
  '/admin/login': { showHeader: true, showFooter: false },
  
  // Add more routes as needed
  // Example: '/dashboard': { showHeader: true, showFooter: false },
  // Example: '/api/*': { showHeader: false, showFooter: false },
};

// Default visibility settings (when route is not in config)
export const defaultLayoutVisibility: LayoutVisibility = {
  showHeader: true,
  showFooter: true,
};
