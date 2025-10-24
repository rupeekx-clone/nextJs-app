'use client';

import React, { useState } from 'react';
import { Box, Grid, Typography, Alert, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Input from '../Common/Input';
import Button from '../Common/Button';
import { useAppSelector } from '@/store/hooks';
import { loanActions } from '@/actions/loan';
import { LoaderKeys } from '@/actions/shared/constants';
// import { validateData, loanApplicationSchema } from '@/lib/validation';

const loanFormSchema = z.object({
  loan_type: z.enum(['personal', 'business'], {
    errorMap: () => ({ message: 'Please select a loan type' })
  }),
  amount_requested: z.number().min(10000, 'Minimum loan amount is ₹10,000').max(10000000, 'Maximum loan amount is ₹1 crore'),
  tenure_months_requested: z.number().min(6, 'Minimum tenure is 6 months').max(60, 'Maximum tenure is 60 months'),
});

type LoanFormData = z.infer<typeof loanFormSchema>;

interface LoanApplicationFormProps {
  onSubmit?: (data: LoanFormData) => Promise<void>;
  userMembership?: {
    card_type: string;
    is_active: boolean;
    expiry_date: string;
  };
}

const LoanApplicationForm: React.FC<LoanApplicationFormProps> = ({ 
  onSubmit, 
  userMembership 
}) => {
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isLoading = useAppSelector(state => state.ui.activeLoaders[LoaderKeys.LOAN_LOADING] || false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<LoanFormData>({
    resolver: zodResolver(loanFormSchema),
    defaultValues: {
      loan_type: 'personal',
      amount_requested: 100000,
      tenure_months_requested: 12,
    },
  });

  const selectedLoanType = watch('loan_type');

  const handleFormSubmit = async (data: LoanFormData) => {
    setError(null);

    try {
      if (onSubmit) {
        await onSubmit(data);
      } else {
        // Default API call using actions
        const result = await loanActions.apply.execute(data);

        if (!result.success) {
          throw new Error(result.error || 'Failed to submit loan application');
        }
      }

      setSuccess(true);
      reset();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  if (success) {
    return (
      <Box textAlign="center" py={4}>
        <Alert severity="success" sx={{ mb: 2 }}>
          Your loan application has been submitted successfully! We will review it and get back to you within 24-48 hours.
        </Alert>
        <Button
          variant="outline"
          onClick={() => setSuccess(false)}
        >
          Apply for Another Loan
        </Button>
      </Box>
    );
  }

  if (!userMembership?.is_active) {
    return (
      <Box textAlign="center" py={4}>
        <Alert severity="warning" sx={{ mb: 2 }}>
          You need an active membership card to apply for loans. Please purchase a membership card first.
        </Alert>
        <Button
          variant="primary"
          href="/products/silver-membership-card"
        >
          Buy Membership Card
        </Button>
      </Box>
    );
  }

  return (
    <Box component="form" onSubmit={handleSubmit(handleFormSubmit)}>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        <Grid size={{ xs: 12 }}>
          <FormControl fullWidth error={!!errors.loan_type}>
            <InputLabel>Loan Type</InputLabel>
            <Select
              {...register('loan_type')}
              label="Loan Type"
              defaultValue="personal"
            >
              <MenuItem value="personal">Personal Loan</MenuItem>
              <MenuItem value="business">Business Loan</MenuItem>
            </Select>
            {errors.loan_type && (
              <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.75 }}>
                {errors.loan_type.message}
              </Typography>
            )}
          </FormControl>
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <Input
            {...register('amount_requested', { valueAsNumber: true })}
            label="Loan Amount (₹)"
            type="number"
            fullWidth
            required
            error={!!errors.amount_requested}
            helperText={errors.amount_requested?.message}
            inputProps={{
              min: 10000,
              max: selectedLoanType === 'personal' ? 1500000 : 10000000,
              step: 1000,
            }}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <Input
            {...register('tenure_months_requested', { valueAsNumber: true })}
            label="Tenure (Months)"
            type="number"
            fullWidth
            required
            error={!!errors.tenure_months_requested}
            helperText={errors.tenure_months_requested?.message}
            inputProps={{
              min: 6,
              max: 60,
            }}
          />
        </Grid>

        <Grid size={{ xs: 12 }}>
          <Alert severity="info" sx={{ mb: 2 }}>
            <Typography variant="body2">
              <strong>Your Membership:</strong> {userMembership.card_type} (Valid until: {new Date(userMembership.expiry_date).toLocaleDateString()})
            </Typography>
          </Alert>
        </Grid>

        <Grid size={{ xs: 12 }}>
          <Box display="flex" alignItems="center" gap={1}>
            <input
              type="checkbox"
              id="loan-consent"
              required
              style={{ marginRight: '8px' }}
            />
            <Typography variant="body2" component="label" htmlFor="loan-consent">
              I agree to the{' '}
              <a href="/terms-conditions" target="_blank" rel="noopener noreferrer">
                Terms & Conditions
              </a>{' '}
              and understand that loan approval is subject to bank verification and eligibility criteria.
            </Typography>
          </Box>
        </Grid>

        <Grid size={{ xs: 12 }}>
        <Button
          type="submit"
          variant="primary"
          loading={isLoading}
          fullWidth
          size="large"
        >
          Submit Loan Application
        </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default LoanApplicationForm;
