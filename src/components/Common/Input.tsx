'use client';

import React from 'react';
import { TextField, TextFieldProps } from '@mui/material';

interface InputProps extends Omit<TextFieldProps, 'variant'> {
  variant?: 'outlined' | 'filled' | 'standard';
}

const Input: React.FC<InputProps> = ({
  variant = 'outlined',
  sx,
  ...props
}) => {
  return (
    <TextField
      {...props}
      variant={variant}
      sx={{
        '& .MuiOutlinedInput-root': {
          '& fieldset': {
            borderColor: '#e0e0e0',
          },
          '&:hover fieldset': {
            borderColor: '#1976d2',
          },
          '&.Mui-focused fieldset': {
            borderColor: '#1976d2',
          },
        },
        ...sx,
      }}
    />
  );
};

export default Input;
