'use client';

import React from 'react';
import { Card, CardContent, Typography, Box, LinearProgress } from '@mui/material';
import { CardMembership, AccessTime, CheckCircle } from '@mui/icons-material';
import Badge from '../Common/Badge';

interface MembershipStatusProps {
  membership: {
    card_type_name: string;
    purchase_date: string;
    expiry_date: string;
    status: string;
    benefits: string[];
  };
}

const MembershipStatus: React.FC<MembershipStatusProps> = ({ membership }) => {
  const isExpired = new Date(membership.expiry_date) < new Date();
  const daysRemaining = Math.ceil((new Date(membership.expiry_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
  const totalDays = Math.ceil((new Date(membership.expiry_date).getTime() - new Date(membership.purchase_date).getTime()) / (1000 * 60 * 60 * 24));
  const progressPercentage = Math.max(0, Math.min(100, ((totalDays - daysRemaining) / totalDays) * 100));

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  };

  const getStatusColor = () => {
    if (isExpired) return 'error';
    if (daysRemaining <= 30) return 'warning';
    return 'success';
  };

  const getStatusText = () => {
    if (isExpired) return 'Expired';
    if (daysRemaining <= 30) return 'Expiring Soon';
    return 'Active';
  };

  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <CardMembership sx={{ fontSize: 24, mr: 1, color: 'primary.main' }} />
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            {membership.card_type_name}
          </Typography>
        </Box>

        <Box sx={{ mb: 2 }}>
          <Badge 
            label={getStatusText()} 
            color={getStatusColor() as any}
            variant="filled"
          />
        </Box>

        {!isExpired && (
          <Box sx={{ mb: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2" color="text.secondary">
                Validity Progress
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {daysRemaining} days left
              </Typography>
            </Box>
            <LinearProgress 
              variant="determinate" 
              value={progressPercentage}
              sx={{
                height: 8,
                borderRadius: 4,
                backgroundColor: 'grey.200',
                '& .MuiLinearProgress-bar': {
                  backgroundColor: daysRemaining <= 30 ? 'warning.main' : 'success.main',
                },
              }}
            />
          </Box>
        )}

        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            <AccessTime sx={{ fontSize: 16, mr: 1, verticalAlign: 'middle' }} />
            Valid until: {formatDate(membership.expiry_date)}
          </Typography>
        </Box>

        <Box>
          <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>
            Your Benefits:
          </Typography>
          {membership.benefits.slice(0, 3).map((benefit, index) => (
            <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
              <CheckCircle sx={{ fontSize: 16, mr: 1, color: 'success.main' }} />
              <Typography variant="body2" color="text.secondary">
                {benefit}
              </Typography>
            </Box>
          ))}
          {membership.benefits.length > 3 && (
            <Typography variant="body2" color="primary.main" sx={{ mt: 1 }}>
              +{membership.benefits.length - 3} more benefits
            </Typography>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default MembershipStatus;
