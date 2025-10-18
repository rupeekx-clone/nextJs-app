'use client';

import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  useMediaQuery,
  useTheme,
  Container,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const Header: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const router = useRouter();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const navigationItems = [
    { label: 'Home', href: '/' },
    { label: 'Company', href: '/company' },
    { label: 'Personal Loan', href: '/digital/personalLoan' },
    { label: 'Business Loan', href: '/digital/businessLoan' },
    { label: 'Silver Membership', href: '/products/silver-membership-card' },
    { label: 'Gold Membership', href: '/products/gold-membership-card' },
    { label: 'FAQs', href: '/faqs' },
    { label: 'Contact', href: '/contact' },
    { label: 'Career', href: '/career' },
  ];

  const drawer = (
    <Box sx={{ width: 250 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2 }}>
        <Typography variant="h6" component="div">
          RupeekX
        </Typography>
        <IconButton onClick={handleDrawerToggle}>
          <CloseIcon />
        </IconButton>
      </Box>
      <List>
        {navigationItems.map((item) => (
          <ListItem key={item.label} onClick={handleDrawerToggle}>
            <ListItemText
              primary={item.label}
              onClick={() => router.push(item.href)}
              sx={{ cursor: 'pointer' }}
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <>
      <AppBar position="static" sx={{ backgroundColor: 'white', color: 'black', boxShadow: 1 }}>
        {/* Top Bar */}
        <Box sx={{ backgroundColor: '#1976d2', color: 'white', py: 0.5 }}>
          <Container maxWidth="lg">
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="body2">
                India's most trustable loan consultant company
              </Typography>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Typography variant="body2">
                  📞 +91-70263-73808
                </Typography>
                <Typography variant="body2">
                  ✉️ info@rupeekx.com
                </Typography>
              </Box>
            </Box>
          </Container>
        </Box>

        {/* Main Header */}
        <Container maxWidth="lg">
          <Toolbar sx={{ justifyContent: 'space-between' }}>
            {/* Logo */}
            <Typography
              variant="h5"
              component={Link}
              href="/"
              sx={{
                fontWeight: 'bold',
                color: '#1976d2',
                textDecoration: 'none',
                '&:hover': {
                  color: '#1565c0',
                },
              }}
            >
              RupeekX
            </Typography>

            {/* Desktop Navigation */}
            {!isMobile && (
              <Box sx={{ display: 'flex', gap: 1 }}>
                {navigationItems.map((item) => (
                  <Button
                    key={item.label}
                    component={Link}
                    href={item.href}
                    sx={{
                      color: 'black',
                      textTransform: 'none',
                      '&:hover': {
                        backgroundColor: 'rgba(25, 118, 210, 0.04)',
                      },
                    }}
                  >
                    {item.label}
                  </Button>
                ))}
              </Box>
            )}

            {/* CTA Buttons */}
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                variant="outlined"
                sx={{
                  borderColor: '#1976d2',
                  color: '#1976d2',
                  textTransform: 'none',
                  '&:hover': {
                    borderColor: '#1565c0',
                    backgroundColor: 'rgba(25, 118, 210, 0.04)',
                  },
                }}
                component={Link}
                href="/products/silver-membership-card"
              >
                Buy Now
              </Button>
              <Button
                variant="contained"
                sx={{
                  backgroundColor: '#1976d2',
                  textTransform: 'none',
                  '&:hover': {
                    backgroundColor: '#1565c0',
                  },
                }}
                component={Link}
                href="/digital/personalLoan"
              >
                Apply Now
              </Button>
            </Box>

            {/* Mobile Menu Button */}
            {isMobile && (
              <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="start"
                onClick={handleDrawerToggle}
              >
                <MenuIcon />
              </IconButton>
            )}
          </Toolbar>
        </Container>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        anchor="right"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
      >
        {drawer}
      </Drawer>
    </>
  );
};

export default Header;
