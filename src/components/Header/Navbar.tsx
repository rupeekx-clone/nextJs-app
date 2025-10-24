'use client';

import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Link from 'next/link'; // Import NextLink
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import ListItemButton from '@mui/material/ListItemButton';

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
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [drawerOpenMenus, setDrawerOpenMenus] = React.useState<{ [key: string]: boolean }>({});
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

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

  // Drawer navigation rendering
  const renderDrawerNav = () => (
    <Box sx={{ width: 250 }} role="presentation" onClick={() => setDrawerOpen(false)}>
      <List>
        {navItems.map((item) => (
          <React.Fragment key={item.label}>
            {item.children ? (
              <>
                <ListItem disablePadding>
                  <ListItemButton onClick={e => { e.stopPropagation(); handleDrawerMenuToggle(item.label); }}>
                    <ListItemText primary={item.label} />
                  </ListItemButton>
                </ListItem>
                <Collapse in={!!drawerOpenMenus[item.label]} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
                    {item.children.map((child) => (
                      <ListItem disablePadding key={child.label}>
                        <Link href={child.path || '#'}>
                          {/* @next-codemod-error This Link previously used the now removed `legacyBehavior` prop, and has a child that might not be an anchor. The codemod bailed out of lifting the child props to the Link. Check that the child component does not render an anchor, and potentially move the props manually to Link. */
                          }
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
                <Link href={item.path || '#'}>
                  {/* @next-codemod-error This Link previously used the now removed `legacyBehavior` prop, and has a child that might not be an anchor. The codemod bailed out of lifting the child props to the Link. Check that the child component does not render an anchor, and potentially move the props manually to Link. */
                  }
                  <ListItemButton component="a">
                    <ListItemText primary={item.label} />
                  </ListItemButton>
                </Link>
              </ListItem>
            )}
            <Divider />
          </React.Fragment>
        ))}
      </List>
    </Box>
  );

  return (
    <AppBar position="static" color="default" elevation={1}>
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        {/* Left: Blumiq icon or text */}
        <Typography variant="h6" component={Link} href="/" sx={{ textDecoration: 'none', color: 'inherit', fontWeight: 'bold' }}>
          Blumiq
        </Typography>
        {/* Desktop Nav */}
        {!isMobile && (
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
                          component={Link}
                          href={child.path || '#'}
                        >
                          {child.label}
                        </MenuItem>
                      ))}
                    </Menu>
                  </>
                ) : (
                  <Button
                    color="inherit"
                    component={Link}
                    href={item.path || '#'}
                  >
                    {item.label}
                  </Button>
                )}
              </Box>
            ))}
          </Box>
        )}
        {/* Mobile Hamburger */}
        {isMobile && (
          <IconButton edge="end" color="inherit" aria-label="menu" onClick={handleDrawerToggle}>
            <MenuIcon />
          </IconButton>
        )}
        <Drawer anchor="right" open={drawerOpen} onClose={handleDrawerToggle}>
          {renderDrawerNav()}
        </Drawer>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
