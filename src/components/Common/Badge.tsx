'use client';

import React from 'react';
import { Chip } from '@mui/material';

interface BadgeProps {
  label: string;
  color?: 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning';
  variant?: 'filled' | 'outlined';
  size?: 'small' | 'medium';
  icon?: React.ReactNode;
}

const Badge: React.FC<BadgeProps> = ({
  label,
  color = 'default',
  variant = 'filled',
  size = 'small',
  icon,
}) => {
  return (
    <Chip
      label={label}
      color={color}
      variant={variant}
      size={size}
      icon={icon}
      sx={{
        fontWeight: 500,
        '& .MuiChip-label': {
          fontSize: '0.75rem',
        },
      }}
    />
  );
};

export default Badge;
