'use client';

import React from 'react';
import { Card, CardContent, Typography, Box, Button, Chip, LinearProgress, List, ListItem, ListItemText, ListItemIcon } from '@mui/material';
import { Share, People, TrendingUp, AccountBalance, CheckCircle } from '@mui/icons-material';

interface ReferralData {
  totalReferrals: number;
  successfulReferrals: number;
  pendingReferrals: number;
  totalEarnings: number;
  pendingEarnings: number;
  referralCode: string;
  referralLink: string;
}

interface ReferralTrackerProps {
  referralData: ReferralData;
  onShare?: () => void;
}

const ReferralTracker: React.FC<ReferralTrackerProps> = ({ referralData, onShare }) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const successRate = referralData.totalReferrals > 0 
    ? (referralData.successfulReferrals / referralData.totalReferrals) * 100 
    : 0;

  const recentReferrals = [
    { name: 'John Doe', status: 'completed', amount: 199, date: '2024-01-15' },
    { name: 'Jane Smith', status: 'pending', amount: 199, date: '2024-01-14' },
    { name: 'Mike Johnson', status: 'completed', amount: 399, date: '2024-01-13' },
  ];

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Join Blumiq - Get Instant Loans',
        text: 'Get instant personal and business loans with Blumiq. Use my referral code for special benefits!',
        url: referralData.referralLink,
      });
    } else {
      navigator.clipboard.writeText(referralData.referralLink);
      // You could show a toast notification here
    }
    
    if (onShare) {
      onShare();
    }
  };

  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            Referral Program
          </Typography>
          <Chip
            label="30% Commission"
            color="success"
            size="small"
            icon={<TrendingUp />}
          />
        </Box>

        {/* Referral Stats */}
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <Box sx={{ textAlign: 'center', flex: 1 }}>
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                {referralData.totalReferrals}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Referrals
              </Typography>
            </Box>
            <Box sx={{ textAlign: 'center', flex: 1 }}>
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'success.main' }}>
                {referralData.successfulReferrals}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Successful
              </Typography>
            </Box>
            <Box sx={{ textAlign: 'center', flex: 1 }}>
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'warning.main' }}>
                {referralData.pendingReferrals}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Pending
              </Typography>
            </Box>
          </Box>

          <Box sx={{ mb: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2" color="text.secondary">
                Success Rate
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                {successRate.toFixed(1)}%
              </Typography>
            </Box>
            <LinearProgress 
              variant="determinate" 
              value={successRate} 
              sx={{ height: 8, borderRadius: 4 }}
            />
          </Box>
        </Box>

        {/* Earnings */}
        <Box sx={{ mb: 3, p: 2, backgroundColor: 'grey.50', borderRadius: 1 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>
            Earnings Summary
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2" color="text.secondary">
              Total Earned:
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 'medium', color: 'success.main' }}>
              {formatCurrency(referralData.totalEarnings)}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="body2" color="text.secondary">
              Pending:
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 'medium', color: 'warning.main' }}>
              {formatCurrency(referralData.pendingEarnings)}
            </Typography>
          </Box>
        </Box>

        {/* Referral Code */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>
            Your Referral Code
          </Typography>
          <Box sx={{ 
            p: 2, 
            backgroundColor: 'primary.light', 
            borderRadius: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
              {referralData.referralCode}
            </Typography>
            <Button
              size="small"
              variant="contained"
              startIcon={<Share />}
              onClick={handleShare}
            >
              Share
            </Button>
          </Box>
        </Box>

        {/* Recent Referrals */}
        <Box>
          <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 2 }}>
            Recent Referrals
          </Typography>
          <List dense>
            {recentReferrals.map((referral, index) => (
              <ListItem key={index} sx={{ px: 0 }}>
                <ListItemIcon>
                  <People sx={{ fontSize: 20 }} />
                </ListItemIcon>
                <ListItemText
                  primary={referral.name}
                  secondary={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Chip
                        label={referral.status}
                        size="small"
                        color={referral.status === 'completed' ? 'success' : 'warning'}
                        icon={referral.status === 'completed' ? <CheckCircle /> : undefined}
                      />
                      <Typography variant="caption" color="text.secondary">
                        {formatCurrency(referral.amount)} • {referral.date}
                      </Typography>
                    </Box>
                  }
                />
              </ListItem>
            ))}
          </List>
        </Box>

        {/* How it Works */}
        <Box sx={{ mt: 3, p: 2, backgroundColor: 'info.light', borderRadius: 1 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>
            How Referrals Work
          </Typography>
          <Typography variant="body2" color="text.secondary">
            • Share your referral code with friends and family
            <br />
            • When they purchase a membership, you earn 30% commission
            <br />
            • Earnings are credited to your account within 24 hours
            <br />
            • No limit on the number of referrals you can make
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default ReferralTracker;
