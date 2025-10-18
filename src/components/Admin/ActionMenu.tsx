'use client';

import React, { useState } from 'react';
import { IconButton, Menu, MenuItem, ListItemIcon, ListItemText, Divider } from '@mui/material';
import { MoreVert, Edit, Visibility, Block, CheckCircle, Download } from '@mui/icons-material';

interface ActionMenuProps {
  actions: ActionItem[];
  onActionClick: (action: string, data?: unknown) => void;
  data?: unknown;
  size?: 'small' | 'medium' | 'large';
}

interface ActionItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  color?: 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success';
  disabled?: boolean;
  divider?: boolean;
}

const ActionMenu: React.FC<ActionMenuProps> = ({ 
  actions, 
  onActionClick, 
  data, 
  size = 'medium' 
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleActionClick = (actionId: string) => {
    onActionClick(actionId, data);
    handleClose();
  };

  const getIconColor = (color?: string) => {
    switch (color) {
      case 'error':
        return 'error.main';
      case 'warning':
        return 'warning.main';
      case 'success':
        return 'success.main';
      case 'info':
        return 'info.main';
      case 'secondary':
        return 'secondary.main';
      default:
        return 'primary.main';
    }
  };

  return (
    <>
      <IconButton
        onClick={handleClick}
        size={size}
        sx={{ color: 'text.secondary' }}
      >
        <MoreVert />
      </IconButton>
      
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        PaperProps={{
          sx: {
            minWidth: 160,
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          }
        }}
      >
        {actions.map((action, index) => (
          <React.Fragment key={action.id}>
            {action.divider && index > 0 && <Divider />}
            <MenuItem
              onClick={() => handleActionClick(action.id)}
              disabled={action.disabled}
              sx={{
                '&:hover': {
                  backgroundColor: 'action.hover',
                },
              }}
            >
              <ListItemIcon sx={{ color: getIconColor(action.color) }}>
                {action.icon}
              </ListItemIcon>
              <ListItemText 
                primary={action.label}
                primaryTypographyProps={{
                  color: action.disabled ? 'text.disabled' : 'text.primary',
                }}
              />
            </MenuItem>
          </React.Fragment>
        ))}
      </Menu>
    </>
  );
};

// Predefined action sets for common use cases
export const userActions: ActionItem[] = [
  {
    id: 'view',
    label: 'View Details',
    icon: <Visibility />,
    color: 'primary',
  },
  {
    id: 'edit',
    label: 'Edit User',
    icon: <Edit />,
    color: 'primary',
  },
  {
    id: 'suspend',
    label: 'Suspend User',
    icon: <Block />,
    color: 'warning',
  },
  {
    id: 'activate',
    label: 'Activate User',
    icon: <CheckCircle />,
    color: 'success',
  },
];

export const loanActions: ActionItem[] = [
  {
    id: 'view',
    label: 'View Details',
    icon: <Visibility />,
    color: 'primary',
  },
  {
    id: 'approve',
    label: 'Approve Loan',
    icon: <CheckCircle />,
    color: 'success',
  },
  {
    id: 'reject',
    label: 'Reject Loan',
    icon: <Block />,
    color: 'error',
  },
  {
    id: 'download',
    label: 'Download Documents',
    icon: <Download />,
    color: 'info',
  },
];

export const partnerActions: ActionItem[] = [
  {
    id: 'view',
    label: 'View Details',
    icon: <Visibility />,
    color: 'primary',
  },
  {
    id: 'edit',
    label: 'Edit Partner',
    icon: <Edit />,
    color: 'primary',
  },
  {
    id: 'deactivate',
    label: 'Deactivate',
    icon: <Block />,
    color: 'warning',
  },
  {
    id: 'activate',
    label: 'Activate',
    icon: <CheckCircle />,
    color: 'success',
  },
];

export default ActionMenu;
