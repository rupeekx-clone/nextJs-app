'use client';

import React from 'react';
import { Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Typography, Box, Divider, Avatar } from '@mui/material';
import { 
  Dashboard, 
  People, 
  AccountBalance, 
  Business, 
  Assessment, 
  Settings, 
  Logout,
  Menu as MenuIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import { useRouter, usePathname } from 'next/navigation';

interface SidebarProps {
  open: boolean;
  onClose: () => void;
  variant?: 'permanent' | 'persistent' | 'temporary';
}

interface MenuItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  path: string;
  badge?: number;
}

const menuItems: MenuItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: <Dashboard />,
    path: '/admin',
  },
  {
    id: 'users',
    label: 'User Management',
    icon: <People />,
    path: '/admin/users',
  },
  {
    id: 'loans',
    label: 'Loan Applications',
    icon: <AccountBalance />,
    path: '/admin/loans',
  },
  {
    id: 'partners',
    label: 'Bank Partners',
    icon: <Business />,
    path: '/admin/partners',
  },
  {
    id: 'reports',
    label: 'Reports & Analytics',
    icon: <Assessment />,
    path: '/admin/reports',
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: <Settings />,
    path: '/admin/settings',
  },
];

const Sidebar: React.FC<SidebarProps> = ({ open, onClose, variant = 'persistent' }) => {
  const router = useRouter();
  const pathname = usePathname();

  const handleNavigation = (path: string) => {
    router.push(path);
    if (variant === 'temporary') {
      onClose();
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminAccessToken');
    localStorage.removeItem('adminRefreshToken');
    router.push('/admin/login');
  };

  const drawerContent = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box 
            component="img"
            src="/logo.svg"
            alt="Blumiq"
            sx={{ height: 32, width: 'auto' }}
          />
          <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
            Admin
          </Typography>
        </Box>
        {variant === 'temporary' && (
          <CloseIcon 
            onClick={onClose} 
            sx={{ cursor: 'pointer', color: 'text.secondary' }}
          />
        )}
      </Box>

      <Divider />

      {/* Admin Profile */}
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
        <Avatar sx={{ bgcolor: 'primary.main' }}>
          A
        </Avatar>
        <Box>
          <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
            Admin User
          </Typography>
          <Typography variant="caption" color="text.secondary">
            System Administrator
          </Typography>
        </Box>
      </Box>

      <Divider />

      {/* Navigation Menu */}
      <List sx={{ flex: 1, px: 1 }}>
        {menuItems.map((item) => {
          const isActive = pathname === item.path;
          
          return (
            <ListItem key={item.id} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                onClick={() => handleNavigation(item.path)}
                sx={{
                  borderRadius: 1,
                  backgroundColor: isActive ? 'primary.light' : 'transparent',
                  color: isActive ? 'primary.main' : 'text.primary',
                  '&:hover': {
                    backgroundColor: isActive ? 'primary.light' : 'action.hover',
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    color: isActive ? 'primary.main' : 'text.secondary',
                    minWidth: 40,
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText 
                  primary={item.label}
                  primaryTypographyProps={{
                    fontWeight: isActive ? 'medium' : 'normal',
                  }}
                />
                {item.badge && item.badge > 0 && (
                  <Box
                    sx={{
                      bgcolor: 'error.main',
                      color: 'white',
                      borderRadius: '50%',
                      minWidth: 20,
                      height: 20,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.75rem',
                      fontWeight: 'bold',
                    }}
                  >
                    {item.badge}
                  </Box>
                )}
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      <Divider />

      {/* Logout */}
      <List sx={{ px: 1 }}>
        <ListItem disablePadding>
          <ListItemButton
            onClick={handleLogout}
            sx={{
              borderRadius: 1,
              color: 'error.main',
              '&:hover': {
                backgroundColor: 'error.light',
                color: 'error.dark',
              },
            }}
          >
            <ListItemIcon sx={{ color: 'error.main', minWidth: 40 }}>
              <Logout />
            </ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <Drawer
      variant={variant}
      open={open}
      onClose={onClose}
      sx={{
        width: 280,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: 280,
          boxSizing: 'border-box',
          borderRight: '1px solid',
          borderColor: 'divider',
        },
      }}
    >
      {drawerContent}
    </Drawer>
  );
};

export default Sidebar;