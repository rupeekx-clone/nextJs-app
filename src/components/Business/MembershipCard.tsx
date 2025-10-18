'use client';

import React from 'react';
import { Box, Typography, Button, Card, CardContent, Chip } from '@mui/material';
import { CheckCircle, Star, Timer, Security } from '@mui/icons-material';

interface MembershipCardProps {
  type: 'silver' | 'gold';
  name: string;
  originalPrice: number;
  discountedPrice: number;
  validity: string;
  benefits: string[];
  loanAmount: string;
  processingTime: string;
  onPurchase: () => void;
  isPopular?: boolean;
}

const MembershipCard: React.FC<MembershipCardProps> = ({
  type,
  name,
  originalPrice,
  discountedPrice,
  validity,
  benefits,
  loanAmount,
  processingTime,
  onPurchase,
  isPopular = false,
}) => {
  const getCardColor = () => {
    switch (type) {
      case 'silver':
        return '#c0c0c0';
      case 'gold':
        return '#ffd700';
      default:
        return '#1976d2';
    }
  };

  const getTypeIcon = () => {
    switch (type) {
      case 'silver':
        return <Security sx={{ color: '#c0c0c0' }} />;
      case 'gold':
        return <Star sx={{ color: '#ffd700' }} />;
      default:
        return <CheckCircle sx={{ color: '#1976d2' }} />;
    }
  };

  return (
    <Card
      sx={{
        position: 'relative',
        maxWidth: 400,
        mx: 'auto',
        border: isPopular ? `3px solid ${getCardColor()}` : '1px solid #e0e0e0',
        borderRadius: 3,
        overflow: 'visible',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
        },
        transition: 'all 0.3s ease-in-out',
      }}
    >
      {isPopular && (
        <Chip
          label="Most Popular"
          sx={{
            position: 'absolute',
            top: -12,
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: getCardColor(),
            color: 'white',
            fontWeight: 'bold',
            zIndex: 1,
          }}
        />
      )}

      <CardContent sx={{ p: 3 }}>
        {/* Header */}
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 1 }}>
            {getTypeIcon()}
          </Box>
          <Typography variant="h5" component="h3" gutterBottom sx={{ fontWeight: 'bold' }}>
            {name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {type === 'silver' ? 'For Personal Loan Candidates' : 'For Business Loan Candidates'}
          </Typography>
        </Box>

        {/* Pricing */}
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'baseline', gap: 1 }}>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 'bold',
                color: getCardColor(),
              }}
            >
              ₹{discountedPrice}
            </Typography>
            <Typography
              variant="h6"
              sx={{
                textDecoration: 'line-through',
                color: 'text.secondary',
              }}
            >
              ₹{originalPrice}
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary">
            Valid for {validity}
          </Typography>
        </Box>

        {/* Key Features */}
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <CheckCircle sx={{ color: '#4caf50', mr: 1, fontSize: 20 }} />
            <Typography variant="body2">
              <strong>Loan Amount:</strong> {loanAmount}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <Timer sx={{ color: '#ff9800', mr: 1, fontSize: 20 }} />
            <Typography variant="body2">
              <strong>Processing Time:</strong> {processingTime}
            </Typography>
          </Box>
        </Box>

        {/* Benefits */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 'bold' }}>
            Key Benefits:
          </Typography>
          {benefits.map((benefit, index) => (
            <Box key={index} sx={{ display: 'flex', alignItems: 'flex-start', mb: 0.5 }}>
              <CheckCircle sx={{ color: '#4caf50', mr: 1, fontSize: 16, mt: 0.2 }} />
              <Typography variant="body2" color="text.secondary">
                {benefit}
              </Typography>
            </Box>
          ))}
        </Box>

        {/* Purchase Button */}
        <Button
          variant="contained"
          fullWidth
          size="large"
          onClick={onPurchase}
          sx={{
            backgroundColor: getCardColor(),
            color: 'white',
            fontWeight: 'bold',
            py: 1.5,
            '&:hover': {
              backgroundColor: type === 'silver' ? '#a8a8a8' : '#e6c200',
            },
          }}
        >
          Buy Now
        </Button>
      </CardContent>
    </Card>
  );
};

export default MembershipCard;
