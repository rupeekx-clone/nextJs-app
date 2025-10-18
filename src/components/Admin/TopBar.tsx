'use client';

import React, { useState } from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  IconButton, 
  Badge, 
  Menu, 
  MenuItem, 
  Avatar, 
  Box,
  Button
} from '@mui/material';
import { 
  Notifications, 
  AccountCircle, 
  Menu as MenuIcon,
  Search,
  Fullscreen,
  FullscreenExit
} from '@mui/icons-material';

interface TopBarProps {
  onMenuClick: () => void;
  title?: string;
}

const TopBar: React.FC<TopBarProps> = ({ onMenuClick, title = 'Admin Dashboard' }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [notificationAnchor, setNotificationAnchor] = useState<null | HTMLElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleNotificationMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setNotificationAnchor(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setNotificationAnchor(null);
  };

  const handleFullscreenToggle = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminAccessToken');
    localStorage.removeItem('adminRefreshToken');
    window.location.href = '/admin/login';
  };

  const notifications = [
    { id: 1, message: 'New loan application submitted', time: '2 min ago', type: 'info' },
    { id: 2, message: 'User verification pending', time: '5 min ago', type: 'warning' },
    { id: 3, message: 'Payment received for membership', time: '10 min ago', type: 'success' },
  ];

  return (
    <AppBar 
      position="fixed" 
      sx={{ 
        zIndex: (theme) => theme.zIndex.drawer + 1,
        backgroundColor: 'white',
        color: 'text.primary',
        boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
      }}
    >
      <Toolbar>
        {/* Menu Button */}
        <IconButton
          color="inherit"
          aria-label="open drawer"
          onClick={onMenuClick}
          edge="start"
          sx={{ mr: 2 }}
        >
          <MenuIcon />
        </IconButton>

        {/* Title */}
        <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
          {title}
        </Typography>

        {/* Search Button */}
        <IconButton color="inherit" sx={{ mr: 1 }}>
          <Search />
        </IconButton>

        {/* Fullscreen Toggle */}
        <IconButton color="inherit" onClick={handleFullscreenToggle} sx={{ mr: 1 }}>
          {isFullscreen ? <FullscreenExit /> : <Fullscreen />}
        </IconButton>

        {/* Notifications */}
        <IconButton
          color="inherit"
          onClick={handleNotificationMenuOpen}
          sx={{ mr: 1 }}
        >
          <Badge badgeContent={notifications.length} color="error">
            <Notifications />
          </Badge>
        </IconButton>

        {/* Profile Menu */}
        <IconButton
          size="large"
          edge="end"
          aria-label="account of current user"
          aria-controls="primary-search-account-menu"
          aria-haspopup="true"
          onClick={handleProfileMenuOpen}
          color="inherit"
        >
          <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>
            A
          </Avatar>
        </IconButton>

        {/* Profile Dropdown Menu */}
        <Menu
          anchorEl={anchorEl}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          keepMounted
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={handleMenuClose}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <AccountCircle sx={{ mr: 1 }} />
              Profile
            </Box>
          </MenuItem>
          <MenuItem onClick={handleMenuClose}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <AccountCircle sx={{ mr: 1 }} />
              Settings
            </Box>
          </MenuItem>
          <MenuItem onClick={handleLogout}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'error.main' }}>
              <AccountCircle sx={{ mr: 1 }} />
              Logout
            </Box>
          </MenuItem>
        </Menu>

        {/* Notifications Dropdown Menu */}
        <Menu
          anchorEl={notificationAnchor}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          keepMounted
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          open={Boolean(notificationAnchor)}
          onClose={handleMenuClose}
          PaperProps={{
            sx: { width: 320, maxHeight: 400 }
          }}
        >
          <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              Notifications
            </Typography>
          </Box>
          
          {notifications.length === 0 ? (
            <Box sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                No new notifications
              </Typography>
            </Box>
          ) : (
            notifications.map((notification) => (
              <MenuItem key={notification.id} onClick={handleMenuClose}>
                <Box sx={{ width: '100%' }}>
                  <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                    {notification.message}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {notification.time}
                  </Typography>
                </Box>
              </MenuItem>
            ))
          )}
          
          <Box sx={{ p: 1, borderTop: '1px solid', borderColor: 'divider' }}>
            <Button fullWidth size="small">
              View All Notifications
            </Button>
          </Box>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default TopBar;
