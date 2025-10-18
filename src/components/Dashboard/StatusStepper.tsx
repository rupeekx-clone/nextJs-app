'use client';

import React from 'react';
import { Stepper, Step, StepLabel, StepContent, Typography, Box } from '@mui/material';
import { 
  Description, 
  CheckCircle, 
  Schedule
} from '@mui/icons-material';

interface StatusStepperProps {
  status: string;
  applicationDate: string;
  approvedDate?: string;
  disbursedDate?: string;
}

const StatusStepper: React.FC<StatusStepperProps> = ({
  status,
  applicationDate,
  approvedDate,
  disbursedDate,
}) => {
  const getStepIcon = (stepStatus: string, currentStatus: string) => {
    if (stepStatus === currentStatus) {
      return <Schedule />;
    }
    
    const statusOrder = ['submitted', 'under_review', 'requires_documents', 'approved', 'disbursed', 'rejected'];
    const currentIndex = statusOrder.indexOf(currentStatus);
    const stepIndex = statusOrder.indexOf(stepStatus);
    
    if (stepIndex < currentIndex) {
      return <CheckCircle />;
    }
    
    return <Description />;
  };

  const getStepColor = (stepStatus: string, currentStatus: string) => {
    if (stepStatus === currentStatus) {
      return 'primary';
    }
    
    const statusOrder = ['submitted', 'under_review', 'requires_documents', 'approved', 'disbursed', 'rejected'];
    const currentIndex = statusOrder.indexOf(currentStatus);
    const stepIndex = statusOrder.indexOf(stepStatus);
    
    if (stepIndex < currentIndex) {
      return 'success';
    }
    
    return 'disabled';
  };

  const steps = [
    {
      label: 'Application Submitted',
      description: 'Your loan application has been submitted and is being reviewed.',
      date: applicationDate,
      status: 'submitted',
    },
    {
      label: 'Under Review',
      description: 'Our team is reviewing your application and documents.',
      date: applicationDate,
      status: 'under_review',
    },
    {
      label: 'Document Verification',
      description: 'We may request additional documents if needed.',
      date: applicationDate,
      status: 'requires_documents',
    },
    {
      label: 'Approved',
      description: 'Congratulations! Your loan has been approved.',
      date: approvedDate,
      status: 'approved',
    },
    {
      label: 'Disbursed',
      description: 'Funds have been transferred to your account.',
      date: disbursedDate,
      status: 'disbursed',
    },
  ];

  const rejectedStep = {
    label: 'Rejected',
    description: 'Unfortunately, your loan application could not be approved.',
    date: approvedDate,
    status: 'rejected',
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Pending';
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getCurrentStepIndex = () => {
    const statusOrder = ['submitted', 'under_review', 'requires_documents', 'approved', 'disbursed'];
    return statusOrder.indexOf(status);
  };

  const displaySteps = status === 'rejected' ? [rejectedStep] : steps.slice(0, getCurrentStepIndex() + 1);

  return (
    <Box>
      <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3 }}>
        Application Status
      </Typography>
      
      <Stepper activeStep={displaySteps.length - 1} orientation="vertical">
        {displaySteps.map((step) => (
          <Step key={step.status}>
            <StepLabel
              icon={getStepIcon(step.status, status)}
              sx={{
                '& .MuiStepLabel-iconContainer': {
                  color: getStepColor(step.status, status) === 'success' ? 'success.main' : 
                         getStepColor(step.status, status) === 'primary' ? 'primary.main' : 'grey.400',
                },
              }}
            >
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                {step.label}
              </Typography>
            </StepLabel>
            <StepContent>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                {step.description}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {formatDate(step.date)}
              </Typography>
            </StepContent>
          </Step>
        ))}
      </Stepper>
    </Box>
  );
};

export default StatusStepper;
