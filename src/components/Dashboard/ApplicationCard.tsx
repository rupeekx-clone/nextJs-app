'use client';

import React from 'react';
import { Card, CardContent, Typography, Box, Chip } from '@mui/material';
import { AccessTime, AccountBalance, TrendingUp } from '@mui/icons-material';
import Badge from '../Common/Badge';

interface ApplicationCardProps {
  application: {
    application_id: string;
    loan_type: 'personal' | 'business';
    amount_requested: number;
    amount_approved?: number;
    status: string;
    application_date: string;
    bank_partner?: string;
  };
  onClick?: () => void;
}

const ApplicationCard: React.FC<ApplicationCardProps> = ({ application, onClick }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'success';
      case 'rejected':
        return 'error';
      case 'under_review':
        return 'warning';
      case 'requires_documents':
        return 'info';
      case 'disbursed':
        return 'success';
      default:
        return 'default';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <Card 
      sx={{ 
        cursor: onClick ? 'pointer' : 'default',
        transition: 'all 0.2s ease-in-out',
        '&:hover': onClick ? {
          transform: 'translateY(-2px)',
          boxShadow: 3,
        } : {},
      }}
      onClick={onClick}
    >
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 0.5 }}>
              {application.loan_type === 'personal' ? 'Personal Loan' : 'Business Loan'}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              ID: {application.application_id}
            </Typography>
          </Box>
          <Badge 
            label={application.status.replace('_', ' ').toUpperCase()} 
            color={getStatusColor(application.status) as any}
          />
        </Box>

        <Box sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <TrendingUp sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
            <Typography variant="body2" color="text.secondary">
              Requested Amount
            </Typography>
          </Box>
          <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
            {formatCurrency(application.amount_requested)}
          </Typography>
          
          {application.amount_approved && (
            <>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, mt: 1 }}>
                <AccountBalance sx={{ fontSize: 16, mr: 1, color: 'success.main' }} />
                <Typography variant="body2" color="text.secondary">
                  Approved Amount
                </Typography>
              </Box>
              <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'success.main' }}>
                {formatCurrency(application.amount_approved)}
              </Typography>
            </>
          )}
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <AccessTime sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
            <Typography variant="body2" color="text.secondary">
              {formatDate(application.application_date)}
            </Typography>
          </Box>
          
          {application.bank_partner && (
            <Typography variant="body2" color="text.secondary">
              {application.bank_partner}
            </Typography>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default ApplicationCard;
