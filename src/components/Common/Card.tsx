'use client';

import React from 'react';
import { Card as MuiCard, CardProps as MuiCardProps, CardContent, CardActions } from '@mui/material';

interface CardProps extends MuiCardProps {
  children: React.ReactNode;
  actions?: React.ReactNode;
}

const Card: React.FC<CardProps> = ({
  children,
  actions,
  sx,
  ...props
}) => {
  return (
    <MuiCard
      {...props}
      sx={{
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        borderRadius: 2,
        '&:hover': {
          boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
        },
        transition: 'box-shadow 0.3s ease-in-out',
        ...sx,
      }}
    >
      <CardContent>
        {children}
      </CardContent>
      {actions && (
        <CardActions>
          {actions}
        </CardActions>
      )}
    </MuiCard>
  );
};

export default Card;
