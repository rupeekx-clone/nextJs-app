'use client';

import React from 'react';
import { Chip } from '@mui/material';
import { 
  CheckCircle, 
  Cancel, 
  AccessTime, 
  Warning, 
  Info,
  Schedule
} from '@mui/icons-material';

interface StatusBadgeProps {
  status: string;
  size?: 'small' | 'medium';
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'small' }) => {
  const getStatusConfig = (status: string) => {
    switch (status.toLowerCase()) {
      case 'approved':
      case 'active':
      case 'completed':
      case 'disbursed':
        return {
          color: 'success' as const,
          icon: <CheckCircle />,
          label: status.charAt(0).toUpperCase() + status.slice(1),
        };
      
      case 'rejected':
      case 'cancelled':
      case 'suspended':
      case 'inactive':
        return {
          color: 'error' as const,
          icon: <Cancel />,
          label: status.charAt(0).toUpperCase() + status.slice(1),
        };
      
      case 'pending':
      case 'submitted':
      case 'under_review':
        return {
          color: 'warning' as const,
          icon: <AccessTime />,
          label: status.replace('_', ' ').charAt(0).toUpperCase() + status.replace('_', ' ').slice(1),
        };
      
      case 'requires_documents':
      case 'pending_verification':
        return {
          color: 'info' as const,
          icon: <Info />,
          label: status.replace('_', ' ').charAt(0).toUpperCase() + status.replace('_', ' ').slice(1),
        };
      
      case 'processing':
      case 'in_progress':
        return {
          color: 'primary' as const,
          icon: <Schedule />,
          label: status.replace('_', ' ').charAt(0).toUpperCase() + status.replace('_', ' ').slice(1),
        };
      
      default:
        return {
          color: 'default' as const,
          icon: <Info />,
          label: status.charAt(0).toUpperCase() + status.slice(1),
        };
    }
  };

  const config = getStatusConfig(status);

  return (
    <Chip
      icon={config.icon}
      label={config.label}
      color={config.color}
      size={size}
      sx={{
        fontWeight: 500,
        '& .MuiChip-label': {
          fontSize: size === 'small' ? '0.75rem' : '0.875rem',
        },
      }}
    />
  );
};

export default StatusBadge;
