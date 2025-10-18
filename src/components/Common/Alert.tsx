'use client';

import React from 'react';
import { Alert as MuiAlert, AlertTitle, Snackbar } from '@mui/material';
import { CheckCircle, Error, Warning, Info } from '@mui/icons-material';

interface AlertProps {
  open: boolean;
  onClose: () => void;
  severity: 'success' | 'error' | 'warning' | 'info';
  title?: string;
  message: string;
  autoHideDuration?: number;
}

const Alert: React.FC<AlertProps> = ({
  open,
  onClose,
  severity,
  title,
  message,
  autoHideDuration = 6000,
}) => {
  const getIcon = () => {
    switch (severity) {
      case 'success':
        return <CheckCircle />;
      case 'error':
        return <Error />;
      case 'warning':
        return <Warning />;
      case 'info':
        return <Info />;
      default:
        return <Info />;
    }
  };

  return (
    <Snackbar
      open={open}
      autoHideDuration={autoHideDuration}
      onClose={onClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
    >
      <MuiAlert
        onClose={onClose}
        severity={severity}
        icon={getIcon()}
        sx={{ width: '100%' }}
      >
        {title && <AlertTitle>{title}</AlertTitle>}
        {message}
      </MuiAlert>
    </Snackbar>
  );
};

export default Alert;
