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
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Divider,
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const approvalSchema = z.object({
  approved_amount: z.number().min(1000, 'Minimum amount is ₹1,000'),
  interest_rate: z.number().min(1, 'Interest rate must be at least 1%').max(30, 'Interest rate cannot exceed 30%'),
  tenure_months: z.number().min(1, 'Tenure must be at least 1 month').max(60, 'Tenure cannot exceed 60 months'),
  processing_fee: z.number().min(0, 'Processing fee cannot be negative'),
  remarks: z.string().optional(),
});

type ApprovalFormData = z.infer<typeof approvalSchema>;

interface ApprovalFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: ApprovalFormData) => void;
  loading?: boolean;
  initialData?: Partial<ApprovalFormData>;
  requestedAmount?: number;
  requestedTenure?: number;
}

const ApprovalForm: React.FC<ApprovalFormProps> = ({
  open,
  onClose,
  onSubmit,
  loading = false,
  initialData,
  requestedAmount = 0,
  requestedTenure = 0,
}) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<ApprovalFormData>({
    resolver: zodResolver(approvalSchema),
    defaultValues: {
      approved_amount: initialData?.approved_amount || requestedAmount,
      interest_rate: initialData?.interest_rate || 12.5,
      tenure_months: initialData?.tenure_months || requestedTenure,
      processing_fee: initialData?.processing_fee || 0,
      remarks: initialData?.remarks || '',
    },
  });

  const watchedAmount = watch('approved_amount');
  const watchedRate = watch('interest_rate');
  const watchedTenure = watch('tenure_months');

  // Calculate EMI
  const calculateEMI = (principal: number, rate: number, months: number) => {
    if (principal <= 0 || rate <= 0 || months <= 0) return 0;
    
    const monthlyRate = rate / (12 * 100);
    const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) / 
                (Math.pow(1 + monthlyRate, months) - 1);
    
    return Math.round(emi);
  };

  const emi = calculateEMI(watchedAmount, watchedRate, watchedTenure);
  const totalAmount = emi * watchedTenure;

  const handleFormSubmit = (data: ApprovalFormData) => {
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
          Approve Loan Application
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Set the approved loan terms and conditions
        </Typography>
      </DialogTitle>

      <DialogContent>
        <Box component="form" onSubmit={handleSubmit(handleFormSubmit)}>
          {/* Loan Terms */}
          <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 2, mt: 1 }}>
            Loan Terms
          </Typography>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Controller
              name="approved_amount"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Approved Amount (₹)"
                  type="number"
                  fullWidth
                  error={!!errors.approved_amount}
                  helperText={errors.approved_amount?.message}
                  InputProps={{
                    inputProps: { min: 1000, step: 1000 }
                  }}
                />
              )}
            />

            <Controller
              name="interest_rate"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Interest Rate (% per annum)"
                  type="number"
                  fullWidth
                  error={!!errors.interest_rate}
                  helperText={errors.interest_rate?.message}
                  InputProps={{
                    inputProps: { min: 1, max: 30, step: 0.1 }
                  }}
                />
              )}
            />

            <Controller
              name="tenure_months"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Tenure (Months)"
                  type="number"
                  fullWidth
                  error={!!errors.tenure_months}
                  helperText={errors.tenure_months?.message}
                  InputProps={{
                    inputProps: { min: 1, max: 60 }
                  }}
                />
              )}
            />

            <Controller
              name="processing_fee"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Processing Fee (₹)"
                  type="number"
                  fullWidth
                  error={!!errors.processing_fee}
                  helperText={errors.processing_fee?.message}
                  InputProps={{
                    inputProps: { min: 0, step: 100 }
                  }}
                />
              )}
            />

            <Controller
              name="remarks"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Remarks (Optional)"
                  multiline
                  rows={3}
                  fullWidth
                  error={!!errors.remarks}
                  helperText={errors.remarks?.message}
                  placeholder="Any additional notes or conditions..."
                />
              )}
            />
          </Box>

          <Divider sx={{ my: 3 }} />

          {/* EMI Calculation */}
          <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 2 }}>
            Loan Summary
          </Typography>

          <Box sx={{ 
            p: 2, 
            backgroundColor: 'grey.50', 
            borderRadius: 1,
            border: '1px solid',
            borderColor: 'divider'
          }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2" color="text.secondary">
                Principal Amount:
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                ₹{watchedAmount.toLocaleString()}
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2" color="text.secondary">
                Interest Rate:
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                {watchedRate}% per annum
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2" color="text.secondary">
                Tenure:
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                {watchedTenure} months
              </Typography>
            </Box>
            
            <Divider sx={{ my: 1 }} />
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                Monthly EMI:
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                ₹{emi.toLocaleString()}
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="body2" color="text.secondary">
                Total Amount:
              </Typography>
              <Typography variant="body2" color="text.secondary">
                ₹{totalAmount.toLocaleString()}
              </Typography>
            </Box>
          </Box>

          {requestedAmount > 0 && (
            <Alert severity="info" sx={{ mt: 2 }}>
              <Typography variant="body2">
                <strong>Requested Amount:</strong> ₹{requestedAmount.toLocaleString()}
                {watchedAmount !== requestedAmount && (
                  <span style={{ color: watchedAmount < requestedAmount ? '#d32f2f' : '#2e7d32' }}>
                    {' '}({watchedAmount < requestedAmount ? 'Reduced' : 'Increased'} by ₹{Math.abs(watchedAmount - requestedAmount).toLocaleString()})
                  </span>
                )}
              </Typography>
            </Alert>
          )}
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
          color="success"
        >
          {loading ? 'Approving...' : 'Approve Loan'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ApprovalForm;
