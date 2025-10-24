'use client';

import React from 'react';
import { Button, ButtonProps, CircularProgress, Box } from '@mui/material';

interface LoadingButtonProps extends Omit<ButtonProps, 'disabled'> {
  loading?: boolean;
  loadingText?: string;
  children: React.ReactNode;
  disabled?: boolean;
}

const LoadingButton: React.FC<LoadingButtonProps> = ({
  loading = false,
  loadingText,
  children,
  disabled,
  sx,
  ...props
}) => {
  return (
    <Button
      {...props}
      disabled={disabled || loading}
      sx={{
        position: 'relative',
        ...sx,
      }}
    >
      {loading && (
        <Box
          sx={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
            display: 'flex',
            alignItems: 'center',
            gap: 1,
          }}
        >
          <CircularProgress
            size={20}
            sx={{
              color: 'inherit',
            }}
          />
          {loadingText && (
            <Box component="span" sx={{ ml: 1 }}>
              {loadingText}
            </Box>
          )}
        </Box>
      )}
      <Box
        sx={{
          opacity: loading ? 0 : 1,
          transition: 'opacity 0.2s',
        }}
      >
        {children}
      </Box>
    </Button>
  );
};

export default LoadingButton;
