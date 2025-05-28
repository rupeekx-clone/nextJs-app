'use client';

import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Link from 'next/link'; // Import NextLink

// Define navigation items
interface NavItem {
  label: string;
  path?: string;
  children?: NavItem[];
}

const navItems: NavItem[] = [
  { label: 'Home', path: '/' },
  { label: 'Company', path: '/company' },
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
  {
    label: 'Login',
    children: [
      { label: 'Customer Login', path: '/customer' },
      { label: 'Cash Lending Login', path: '/subscriptioncustomer' },
    ],
  },
  { label: 'Contact Us', path: '/contact' },
  // Add other top-level navigation items here
];

const Navbar: React.FC = () => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [currentMenu, setCurrentMenu] = React.useState<string | null>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, label: string) => {
    setAnchorEl(event.currentTarget);
    setCurrentMenu(label);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setCurrentMenu(null);
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      {navItems.map((item) => (
        <Box key={item.label} sx={{ mx: 1 }}>
          {item.children ? (
            <>
              <Button
                aria-controls={currentMenu === item.label ? 'simple-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={currentMenu === item.label ? 'true' : undefined}
                onClick={(e) => handleMenuOpen(e, item.label)}
                color="inherit"
              >
                {item.label}
              </Button>
              <Menu
                id="simple-menu"
                anchorEl={anchorEl}
                open={currentMenu === item.label}
                onClose={handleMenuClose}
                MenuListProps={{
                  'aria-labelledby': 'basic-button',
                }}
              >
                {item.children.map((child) => (
                  <MenuItem
                    key={child.label}
                    onClick={handleMenuClose}
                    component={Link} // Use NextLink for navigation
                    href={child.path || '#'} // Ensure path is defined
                  >
                    {child.label}
                  </MenuItem>
                ))}
              </Menu>
            </>
          ) : (
            <Button
              color="inherit"
              component={Link} // Use NextLink for navigation
              href={item.path || '#'} // Ensure path is defined
            >
              {item.label}
            </Button>
          )}
        </Box>
      ))}
    </Box>
  );
};

export default Navbar;
