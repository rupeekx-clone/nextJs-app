'use client';

import React from 'react';
import { Button as MuiButton, ButtonProps as MuiButtonProps, CircularProgress } from '@mui/material';

interface ButtonProps extends Omit<MuiButtonProps, 'variant'> {
  variant?: 'primary' | 'secondary' | 'outline' | 'text';
  loading?: boolean;
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  loading = false,
  disabled,
  children,
  sx,
  ...props
}) => {
  const getVariantProps = () => {
    switch (variant) {
      case 'primary':
        return {
          variant: 'contained' as const,
          sx: {
            backgroundColor: '#1976d2',
            color: 'white',
            '&:hover': {
              backgroundColor: '#1565c0',
            },
            ...sx,
          },
        };
      case 'secondary':
        return {
          variant: 'contained' as const,
          sx: {
            backgroundColor: '#424242',
            color: 'white',
            '&:hover': {
              backgroundColor: '#303030',
            },
            ...sx,
          },
        };
      case 'outline':
        return {
          variant: 'outlined' as const,
          sx: {
            borderColor: '#1976d2',
            color: '#1976d2',
            '&:hover': {
              borderColor: '#1565c0',
              backgroundColor: 'rgba(25, 118, 210, 0.04)',
            },
            ...sx,
          },
        };
      case 'text':
        return {
          variant: 'text' as const,
          sx: {
            color: '#1976d2',
            '&:hover': {
              backgroundColor: 'rgba(25, 118, 210, 0.04)',
            },
            ...sx,
          },
        };
      default:
        return { variant: 'contained' as const, sx };
    }
  };

  const variantProps = getVariantProps();

  return (
    <MuiButton
      {...props}
      {...variantProps}
      disabled={disabled || loading}
      startIcon={loading ? <CircularProgress size={20} color="inherit" /> : undefined}
    >
      {children}
    </MuiButton>
  );
};

export default Button;
