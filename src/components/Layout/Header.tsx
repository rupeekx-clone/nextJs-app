'use client';

import React, { useState, useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  Collapse,
  Divider,
  Avatar,
  Badge,
  useMediaQuery,
  useTheme,
  alpha,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Close as CloseIcon,
  Notifications,
  ExpandMore,
  ExpandLess,
  Login,
  Dashboard,
  Logout,
  Phone,
  Email,
} from '@mui/icons-material';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface NavItem {
  label: string;
  path?: string;
  children?: NavItem[];
  icon?: React.ReactNode;
  badge?: string;
}

const navItems: NavItem[] = [
  { label: 'Home', path: '/' },
  { 
    label: 'Company', 
    path: '/company',
    children: [
      { label: 'About Us', path: '/company' },
      { label: 'Our Mission', path: '/company#mission' },
      { label: 'Our Vision', path: '/company#vision' },
      { label: 'Our Values', path: '/company#values' },
    ]
  },
  {
    label: 'Products',
    children: [
      { label: 'Silver Membership Card', path: '/products/silver-membership-card' },
      { label: 'Gold Membership Card', path: '/products/gold-membership-card' },
      { label: 'Cash Lending Subscription', path: '/products/cashlending-subscription' },
    ],
  },
  {
    label: 'Apply Now',
    children: [
      { label: 'Personal Loan', path: '/digital/personalLoan' },
      { label: 'Business Loan', path: '/digital/businessLoan' },
      { label: 'Subscription Plan', path: '/subscription/cashlending' },
    ],
  },
  { label: 'FAQs', path: '/faqs' },
  { label: 'Contact Us', path: '/contact' },
];

const Header: React.FC = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [currentMenu, setCurrentMenu] = useState<string | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerOpenMenus, setDrawerOpenMenus] = useState<{ [key: string]: boolean }>({});
  const [userMenuAnchor, setUserMenuAnchor] = useState<null | HTMLElement>(null);
  // const [searchQuery, setSearchQuery] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('lg'));
  const router = useRouter();
  // const pathname = usePathname();

  // Check if user is logged in
  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    const user = localStorage.getItem('user');
    setIsLoggedIn(!!token);
    if (user) {
      try {
        const userData = JSON.parse(user);
        setUserName(userData.full_name || 'User');
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }
  }, []);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, label: string) => {
    setAnchorEl(event.currentTarget);
    setCurrentMenu(label);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setCurrentMenu(null);
  };

  const handleDrawerToggle = () => {
    setDrawerOpen((prev) => !prev);
  };

  const handleDrawerMenuToggle = (label: string) => {
    setDrawerOpenMenus((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  const handleUserMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setUserMenuAnchor(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setUserMenuAnchor(null);
  };

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    setUserName('');
    handleUserMenuClose();
    router.push('/');
  };

  // const handleSearch = (e: React.FormEvent) => {
  //   e.preventDefault();
  //   if (searchQuery.trim()) {
  //     router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
  //   }
  // };

  const handleLogin = () => {
    router.push('/customer');
  };

  const handleDashboard = () => {
    router.push('/dashboard');
  };

  // Drawer navigation rendering
  const renderDrawerNav = () => (
    <Box sx={{ width: 300 }} role="presentation">
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box 
            component="img"
            src="/logo.svg"
            alt="Blumiq"
            sx={{ height: 28, width: 'auto' }}
          />
          <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
            Blumiq
          </Typography>
        </Box>
        <IconButton onClick={() => setDrawerOpen(false)}>
          <CloseIcon />
        </IconButton>
      </Box>
      
      <Divider />
      
      {/* User Section */}
      {isLoggedIn ? (
        <Box sx={{ p: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <Avatar sx={{ bgcolor: 'primary.main' }}>
              {userName.charAt(0).toUpperCase()}
            </Avatar>
            <Box>
              <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                {userName}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Welcome back!
              </Typography>
            </Box>
          </Box>
          <Button
            variant="contained"
            fullWidth
            startIcon={<Dashboard />}
            onClick={() => {
              handleDashboard();
              setDrawerOpen(false);
            }}
          >
            Dashboard
          </Button>
        </Box>
      ) : (
        <Box sx={{ p: 2 }}>
          <Button
            variant="contained"
            fullWidth
            startIcon={<Login />}
            onClick={() => {
              handleLogin();
              setDrawerOpen(false);
            }}
          >
            Login
          </Button>
        </Box>
      )}
      
      <Divider />
      
      <List>
        {navItems.map((item) => (
          <React.Fragment key={item.label}>
            {item.children ? (
              <>
                <ListItem disablePadding>
                  <ListItemButton onClick={() => handleDrawerMenuToggle(item.label)}>
                    <ListItemText primary={item.label} />
                    {drawerOpenMenus[item.label] ? <ExpandLess /> : <ExpandMore />}
                  </ListItemButton>
                </ListItem>
                <Collapse in={!!drawerOpenMenus[item.label]} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
                    {item.children.map((child) => (
                      <ListItem disablePadding key={child.label}>
                        <Link href={child.path || '#'} passHref legacyBehavior>
                          <ListItemButton component="a" sx={{ pl: 4 }}>
                            <ListItemText primary={child.label} />
                          </ListItemButton>
                        </Link>
                      </ListItem>
                    ))}
                  </List>
                </Collapse>
              </>
            ) : (
              <ListItem disablePadding>
                <Link href={item.path || '#'} passHref legacyBehavior>
                  <ListItemButton component="a">
                    <ListItemText primary={item.label} />
                  </ListItemButton>
                </Link>
              </ListItem>
            )}
          </React.Fragment>
        ))}
      </List>
      
      <Divider />
      
      {/* Contact Info */}
      <Box sx={{ p: 2 }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>
          Contact Us
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
          <Phone sx={{ fontSize: 16, color: 'text.secondary' }} />
          <Typography variant="body2" color="text.secondary">
            +91-70263-73808
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Email sx={{ fontSize: 16, color: 'text.secondary' }} />
          <Typography variant="body2" color="text.secondary">
            info@blumiq.com
          </Typography>
        </Box>
      </Box>
    </Box>
  );

  return (
    <>
      <AppBar 
        position="fixed" 
        elevation={isScrolled ? 4 : 0}
        sx={{
          backgroundColor: isScrolled ? alpha(theme.palette.background.paper, 0.95) : 'background.paper',
          backdropFilter: isScrolled ? 'blur(10px)' : 'none',
          borderBottom: '1px solid',
          borderColor: 'divider',
          transition: 'all 0.3s ease',
        }}
      >
        <Toolbar sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          minHeight: { xs: 56, md: 64 }
        }}>
          {/* Logo */}
          <Link href="/" passHref legacyBehavior>
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              cursor: 'pointer',
              textDecoration: 'none'
            }}>
              <Box 
                component="img"
                src="/logo.svg"
                alt="Blumiq"  
                sx={{
                  height: { xs: 32, md: 40 },
                  width: 'auto',
                }}
              />
              <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'primary.main' }}>Blumiq</Typography>
            </Box>
          </Link>

          {/* Desktop Navigation */}
          {!isMobile && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {navItems.map((item) => (
                <Box key={item.label} sx={{ position: 'relative' }}>
                  {item.children ? (
                    <>
                      <Button
                        aria-controls={currentMenu === item.label ? 'simple-menu' : undefined}
                        aria-haspopup="true"
                        aria-expanded={currentMenu === item.label ? 'true' : undefined}
                        onClick={(e) => handleMenuOpen(e, item.label)}
                        sx={{
                          color: 'text.primary',
                          textTransform: 'none',
                          fontWeight: 'medium',
                          '&:hover': {
                            backgroundColor: alpha(theme.palette.primary.main, 0.1),
                          },
                        }}
                        endIcon={<ExpandMore />}
                      >
                        {item.label}
                      </Button>
                      <Menu
                        id="simple-menu"
                        anchorEl={anchorEl}
                        open={currentMenu === item.label}
                        onClose={handleMenuClose}
                        PaperProps={{
                          sx: {
                            mt: 1,
                            minWidth: 200,
                            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                            borderRadius: 2,
                          }
                        }}
                      >
                        {item.children.map((child) => (
                          <MenuItem
                            key={child.label}
                            onClick={handleMenuClose}
                            component={Link}
                            href={child.path || '#'}
                            sx={{
                              '&:hover': {
                                backgroundColor: alpha(theme.palette.primary.main, 0.1),
                              },
                            }}
                          >
                            {child.label}
                          </MenuItem>
                        ))}
                      </Menu>
                    </>
                  ) : (
                    <Button
                      component={Link}
                      href={item.path || '#'}
                      sx={{
                        color: 'text.primary',
                        textTransform: 'none',
                        fontWeight: 'medium',
                        '&:hover': {
                          backgroundColor: alpha(theme.palette.primary.main, 0.1),
                        },
                      }}
                    >
                      {item.label}
                    </Button>
                  )}
                </Box>
              ))}
            </Box>
          )}

          {/* Right Side Actions */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {/* Search */}
            {/* {!isMobile && (
              <Box component="form" onSubmit={handleSearch}>
                <TextField
                  size="small"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Search sx={{ fontSize: 20 }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    width: 200,
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                    },
                  }}
                />
              </Box>
            )} */}

            {/* Notifications */}
            {isLoggedIn && (
              <IconButton color="inherit">
                <Badge badgeContent={3} color="error">
                  <Notifications />
                </Badge>
              </IconButton>
            )}

            {/* User Menu */}
            {isLoggedIn ? (
              <>
                <IconButton
                  onClick={handleUserMenuOpen}
                  sx={{ ml: 1 }}
                >
                  <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>
                    {userName.charAt(0).toUpperCase()}
                  </Avatar>
                </IconButton>
                <Menu
                  anchorEl={userMenuAnchor}
                  open={Boolean(userMenuAnchor)}
                  onClose={handleUserMenuClose}
                  PaperProps={{
                    sx: {
                      mt: 1,
                      minWidth: 200,
                      boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                      borderRadius: 2,
                    }
                  }}
                >
                  <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
                    <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                      {userName}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Welcome back!
                    </Typography>
                  </Box>
                  <MenuItem onClick={() => { handleDashboard(); handleUserMenuClose(); }}>
                    <Dashboard sx={{ mr: 1 }} />
                    Dashboard
                  </MenuItem>
                  <MenuItem onClick={handleLogout}>
                    <Logout sx={{ mr: 1 }} />
                    Logout
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <Button
                variant="contained"
                startIcon={<Login />}
                onClick={handleLogin}
                sx={{
                  textTransform: 'none',
                  borderRadius: 2,
                  px: 3,
                }}
              >
                Login
              </Button>
            )}

            {/* Mobile Menu Button */}
            {isMobile && (
              <IconButton
                edge="end"
                color="inherit"
                aria-label="menu"
                onClick={handleDrawerToggle}
                sx={{ ml: 1 }}
              >
                <MenuIcon />
              </IconButton>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={handleDrawerToggle}
        PaperProps={{
          sx: {
            width: 300,
          }
        }}
      >
        {renderDrawerNav()}
      </Drawer>

      {/* Spacer for fixed header */}
      <Box sx={{ height: { xs: 56, md: 64 } }} />
    </>
  );
};

export default Header;