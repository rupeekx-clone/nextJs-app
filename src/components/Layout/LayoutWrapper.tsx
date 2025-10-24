'use client';

import { usePathname } from 'next/navigation';
import { Box } from '@mui/material';
import Header from './Header';
import Footer from './Footer';
import { layoutConfig, defaultLayoutVisibility } from '@/config/layoutConfig';

interface LayoutWrapperProps {
  children: React.ReactNode;
}

export default function LayoutWrapper({ children }: LayoutWrapperProps) {
  const pathname = usePathname();
  
  // Function to check if a route matches a pattern (supports wildcards)
  const matchesRoute = (route: string, pattern: string): boolean => {
    if (pattern.endsWith('*')) {
      const basePattern = pattern.slice(0, -1);
      return route.startsWith(basePattern);
    }
    return route === pattern;
  };
  
  // Find the layout configuration for the current route
  const getLayoutVisibility = () => {
    // First, try exact match
    if (layoutConfig[pathname]) {
      return layoutConfig[pathname];
    }
    
    // Then, try wildcard patterns
    for (const [pattern, visibility] of Object.entries(layoutConfig)) {
      if (matchesRoute(pathname, pattern)) {
        return visibility;
      }
    }
    
    // Return default if no match found
    return defaultLayoutVisibility;
  };
  
  const visibility = getLayoutVisibility();
  
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {visibility.showHeader && <Header />}
      <Box component="main" sx={{ flexGrow: 1 }}>
        {children}
      </Box>
      {visibility.showFooter && <Footer />}
    </Box>
  );
}
