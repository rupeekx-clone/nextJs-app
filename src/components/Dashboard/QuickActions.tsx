'use client';

import React from 'react';
import { Card, CardContent, Typography, Box, Button, Grid } from '@mui/material';
import { 
  Add, 
  Upload, 
  Support, 
  CardMembership, 
  Description, 
  TrendingUp 
} from '@mui/icons-material';

interface QuickActionsProps {
  onApplyLoan?: () => void;
  onUploadDocuments?: () => void;
  onContactSupport?: () => void;
  onViewMembership?: () => void;
  onViewApplications?: () => void;
  onViewDocuments?: () => void;
}

const QuickActions: React.FC<QuickActionsProps> = ({
  onApplyLoan,
  onUploadDocuments,
  onContactSupport,
  onViewMembership,
  onViewApplications,
  onViewDocuments,
}) => {
  const actions = [
    {
      title: 'Apply for Loan',
      description: 'Start your loan application',
      icon: <Add />,
      color: 'primary' as const,
      onClick: onApplyLoan,
    },
    {
      title: 'Upload Documents',
      description: 'Submit required documents',
      icon: <Upload />,
      color: 'secondary' as const,
      onClick: onUploadDocuments,
    },
    {
      title: 'View Applications',
      description: 'Track your loan status',
      icon: <TrendingUp />,
      color: 'info' as const,
      onClick: onViewApplications,
    },
    {
      title: 'My Documents',
      description: 'Manage your documents',
      icon: <Description />,
      color: 'warning' as const,
      onClick: onViewDocuments,
    },
    {
      title: 'My Membership',
      description: 'View membership details',
      icon: <CardMembership />,
      color: 'success' as const,
      onClick: onViewMembership,
    },
    {
      title: 'Contact Support',
      description: 'Get help and support',
      icon: <Support />,
      color: 'error' as const,
      onClick: onContactSupport,
    },
  ];

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3 }}>
          Quick Actions
        </Typography>
        
        <Grid container spacing={2}>
          {actions.map((action, index) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={index}>
              <Button
                variant="outlined"
                color={action.color}
                startIcon={action.icon}
                onClick={action.onClick}
                sx={{
                  width: '100%',
                  height: '100%',
                  minHeight: 80,
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  justifyContent: 'flex-start',
                  p: 2,
                  textAlign: 'left',
                  '&:hover': {
                    backgroundColor: `${action.color}.light`,
                    borderColor: `${action.color}.main`,
                  },
                }}
              >
                <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                  {action.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {action.description}
                </Typography>
              </Button>
            </Grid>
          ))}
        </Grid>
      </CardContent>
    </Card>
  );
};

export default QuickActions;
