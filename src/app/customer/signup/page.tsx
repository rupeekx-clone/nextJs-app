'use client';

import { Container, Typography, Box, TextField, Grid, Paper, Link as MuiLink, FormControlLabel, Checkbox } from '@mui/material';
import NextLink from 'next/link';
import { useState } from 'react';
import { useAppSelector } from '@/store/hooks';
import { authActions } from '@/actions/auth';
import { LoaderKeys } from '@/actions/shared/constants';
import LoadingButton from '@/components/Common/LoadingButton';
import AuthBackgroundRotator from '@/components/AuthBackgroundRotator';

export default function CustomerSignupPage() {
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone_number: '',
    password: '',
    confirmPassword: '',
    address_line1: '',
    address_line2: '',
    city: '',
    pincode: '',
    agreeTerms: false
  });
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const isLoading = useAppSelector(state => state.ui.activeLoaders[LoaderKeys.AUTH_LOADING] || false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSuccess(null);
    setError(null);

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    // Validate terms agreement
    if (!formData.agreeTerms) {
      setError('Please agree to the terms and conditions');
      return;
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { confirmPassword, agreeTerms, ...registrationData } = formData;
    const result = await authActions.register.execute(registrationData);
    
    if (result.success) {
      setSuccess('Registration successful! Redirecting to login...');
      setTimeout(() => {
        window.location.href = '/customer';
      }, 2000);
    } else {
      setError(result.error || 'Registration failed. Please try again.');
    }
  };

  return (
    <>
      <AuthBackgroundRotator />
      <Container 
        maxWidth="sm" 
        sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          justifyContent: 'center', 
          minHeight: 'calc(100vh - 120px)',
          py: 4 
        }}
      >
        <Paper 
          elevation={6} 
          sx={{ 
            p: {xs: 2, sm: 4},
            width: '100%',
            borderRadius: 2
          }}
        >
          <Typography variant="h4" component="h1" textAlign="center" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
            Customer Sign Up
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            {/* Personal Information */}
            <Typography variant="h6" sx={{ mb: 2, mt: 2, color: 'primary.main' }}>
              Personal Information
            </Typography>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12 }}>
                <TextField
                  required
                  fullWidth
                  id="full_name"
                  label="Full Name"
                  name="full_name"
                  autoComplete="name"
                  autoFocus
                  value={formData.full_name}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={formData.email}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  required
                  fullWidth
                  id="phone_number"
                  label="Phone Number"
                  name="phone_number"
                  type="tel"
                  autoComplete="tel"
                  value={formData.phone_number}
                  onChange={handleInputChange}
                  inputProps={{ maxLength: 10, pattern: '[0-9]*' }}
                />
              </Grid>
            </Grid>

            {/* Password Section */}
            <Typography variant="h6" sx={{ mb: 2, mt: 3, color: 'primary.main' }}>
              Password
            </Typography>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                  value={formData.password}
                  onChange={handleInputChange}
                  helperText="Minimum 8 characters"
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  required
                  fullWidth
                  name="confirmPassword"
                  label="Confirm Password"
                  type="password"
                  id="confirmPassword"
                  autoComplete="new-password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  error={formData.password !== formData.confirmPassword && formData.confirmPassword !== ''}
                  helperText={formData.password !== formData.confirmPassword && formData.confirmPassword !== '' ? "Passwords don't match" : ""}
                />
              </Grid>
            </Grid>

            {/* Address Section */}
            <Typography variant="h6" sx={{ mb: 2, mt: 3, color: 'primary.main' }}>
              Address (Optional)
            </Typography>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  id="address_line1"
                  label="Address Line 1"
                  name="address_line1"
                  autoComplete="address-line1"
                  value={formData.address_line1}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  id="address_line2"
                  label="Address Line 2"
                  name="address_line2"
                  autoComplete="address-line2"
                  value={formData.address_line2}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  id="city"
                  label="City"
                  name="city"
                  autoComplete="address-level2"
                  value={formData.city}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  id="pincode"
                  label="Pincode"
                  name="pincode"
                  autoComplete="postal-code"
                  value={formData.pincode}
                  onChange={handleInputChange}
                  inputProps={{ maxLength: 6, pattern: '[0-9]*' }}
                />
              </Grid>
            </Grid>

            {/* Terms and Conditions */}
            <Grid size={{ xs: 12 }} sx={{ mt: 3, mb: 1 }}>
              <FormControlLabel
                control={
                  <Checkbox 
                    name="agreeTerms" 
                    required 
                    checked={formData.agreeTerms}
                    onChange={handleInputChange}
                  />
                }
                label={
                  <Typography variant="body2">
                    I agree to the{' '}
                    <MuiLink component={NextLink} href="/terms-conditions" target="_blank" rel="noopener noreferrer" underline="always">
                      Terms & Conditions
                    </MuiLink>
                    {' '}and{' '}
                    <MuiLink component={NextLink} href="/privacy-policy" target="_blank" rel="noopener noreferrer" underline="always">
                      Privacy Policy
                    </MuiLink>
                  </Typography>
                }
              />
            </Grid>

            {error && (
              <Typography color="error" sx={{ mt: 1, mb: 1 }}>
                {error}
              </Typography>
            )}
            {success && (
              <Typography color="success.main" sx={{ mt: 1, mb: 1 }}>
                {success}
              </Typography>
            )}

            <LoadingButton
              type="submit"
              fullWidth
              variant="contained"
              loading={isLoading}
              loadingText="Creating Account..."
              sx={{ mt: 3, mb: 2, py: 1.5 }}
              disabled={!formData.agreeTerms || formData.password !== formData.confirmPassword}
            >
              Sign Up
            </LoadingButton>

            <Grid container>
              <Grid size={{ xs: 12 }}>
                <MuiLink component={NextLink} href="/customer" variant="body2">
                  Already have an account? Sign In
                </MuiLink>
              </Grid>
            </Grid>
          </Box>
        </Paper>
      </Container>
    </>
  );
}
