'use client';

import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Alert,
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const rejectionSchema = z.object({
  reason: z.string().min(1, 'Rejection reason is required'),
  remarks: z.string().optional(),
});

type RejectionFormData = z.infer<typeof rejectionSchema>;

interface RejectionModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: RejectionFormData) => void;
  loading?: boolean;
}

const rejectionReasons = [
  {
    value: 'insufficient_income',
    label: 'Insufficient Income',
    description: 'Applicant\'s income does not meet the minimum requirements',
  },
  {
    value: 'poor_credit_score',
    label: 'Poor Credit Score',
    description: 'Credit score is below the minimum threshold',
  },
  {
    value: 'incomplete_documents',
    label: 'Incomplete Documents',
    description: 'Required documents are missing or incomplete',
  },
  {
    value: 'employment_verification_failed',
    label: 'Employment Verification Failed',
    description: 'Unable to verify employment details',
  },
  {
    value: 'address_verification_failed',
    label: 'Address Verification Failed',
    description: 'Unable to verify residential address',
  },
  {
    value: 'duplicate_application',
    label: 'Duplicate Application',
    description: 'Multiple applications found for the same applicant',
  },
  {
    value: 'fraud_detected',
    label: 'Fraud Detected',
    description: 'Suspicious activity or fraudulent information detected',
  },
  {
    value: 'business_verification_failed',
    label: 'Business Verification Failed',
    description: 'Unable to verify business details (for business loans)',
  },
  {
    value: 'age_criteria_not_met',
    label: 'Age Criteria Not Met',
    description: 'Applicant does not meet age requirements',
  },
  {
    value: 'loan_amount_too_high',
    label: 'Loan Amount Too High',
    description: 'Requested amount exceeds maximum limit',
  },
  {
    value: 'other',
    label: 'Other',
    description: 'Other reason not listed above',
  },
];

const RejectionModal: React.FC<RejectionModalProps> = ({
  open,
  onClose,
  onSubmit,
  loading = false,
}) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<RejectionFormData>({
    resolver: zodResolver(rejectionSchema),
    defaultValues: {
      reason: '',
      remarks: '',
    },
  });

  const selectedReason = watch('reason');
  const selectedReasonData = rejectionReasons.find(r => r.value === selectedReason);

  const handleFormSubmit = (data: RejectionFormData) => {
    onSubmit(data);
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
        }
      }}
    >
      <DialogTitle>
        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
          Reject Loan Application
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Please provide a reason for rejecting this loan application
        </Typography>
      </DialogTitle>

      <DialogContent>
        <Box component="form" onSubmit={handleSubmit(handleFormSubmit)}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 1 }}>
            <Controller
              name="reason"
              control={control}
              render={({ field }) => (
                <FormControl fullWidth error={!!errors.reason}>
                  <InputLabel>Rejection Reason</InputLabel>
                  <Select
                    {...field}
                    label="Rejection Reason"
                  >
                    {rejectionReasons.map((reason) => (
                      <MenuItem key={reason.value} value={reason.value}>
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                            {reason.label}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {reason.description}
                          </Typography>
                        </Box>
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.reason && (
                    <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.5 }}>
                      {errors.reason.message}
                    </Typography>
                  )}
                </FormControl>
              )}
            />

            {selectedReasonData && (
              <Alert severity="info">
                <Typography variant="body2">
                  <strong>{selectedReasonData.label}:</strong> {selectedReasonData.description}
                </Typography>
              </Alert>
            )}

            <Controller
              name="remarks"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Additional Remarks (Optional)"
                  multiline
                  rows={4}
                  fullWidth
                  error={!!errors.remarks}
                  helperText={errors.remarks?.message || 'Provide any additional details or instructions for the applicant'}
                  placeholder="e.g., Applicant can reapply after 6 months with updated documents..."
                />
              )}
            />
          </Box>

          <Alert severity="warning" sx={{ mt: 3 }}>
            <Typography variant="body2">
              <strong>Important:</strong> Once rejected, this application cannot be approved. 
              The applicant will be notified via email and SMS about the rejection.
            </Typography>
          </Alert>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 3, gap: 1 }}>
        <Button
          onClick={handleClose}
          disabled={loading}
          variant="outlined"
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit(handleFormSubmit)}
          disabled={loading}
          variant="contained"
          color="error"
        >
          {loading ? 'Rejecting...' : 'Reject Application'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default RejectionModal;
