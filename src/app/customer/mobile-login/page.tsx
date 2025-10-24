'use client';

import { Container, Typography, Box, TextField, Paper, Link as MuiLink } from '@mui/material';
import NextLink from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppSelector } from '@/store/hooks';
import { authActions } from '@/actions/auth';
import { LoaderKeys } from '@/actions/shared/constants';
import LoadingButton from '@/components/Common/LoadingButton';
import AuthBackgroundRotator from '@/components/AuthBackgroundRotator';

export default function MobileLoginPage() {
  const [phone, setPhone] = useState('');
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const isLoading = useAppSelector(state => state.ui.activeLoaders[LoaderKeys.AUTH_LOADING] || false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSuccess(null);
    setError(null);

    // Validate phone number format
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(phone)) {
      setError('Please enter a valid 10-digit mobile number');
      return;
    }

    const result = await authActions.sendMobileOtp.execute({ phone_number: phone });

    if (result.success) {
      setSuccess('OTP sent successfully! Redirecting...');
      // Navigate to OTP verification page with phone number
      setTimeout(() => {
        router.push(`/customer/mobile-verify?mobile=${encodeURIComponent(phone)}`);
      }, 1500);
    } else {
      setError(result.error || 'Failed to send OTP');
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, ''); // Remove non-digits
    if (value.length <= 10) {
      setPhone(value);
    }
  };

  return (
    <>
      <AuthBackgroundRotator />
      <Container 
        maxWidth="xs" 
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
            Mobile Login
          </Typography>
          
          <Typography variant="body2" textAlign="center" sx={{ mb: 3, color: 'text.secondary' }}>
            Enter your mobile number to receive an OTP for login
          </Typography>

          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="phone"
              label="Mobile Number"
              name="phone"
              autoComplete="tel"
              autoFocus
              value={phone}
              onChange={handlePhoneChange}
              placeholder="9876543210"
              inputProps={{ 
                maxLength: 10,
                pattern: '[0-9]*',
                inputMode: 'numeric'
              }}
              InputProps={{
                startAdornment: (
                  <Typography variant="body1" sx={{ mr: 1, color: 'text.secondary' }}>
                    +91
                  </Typography>
                )
              }}
              helperText="Enter your 10-digit Indian mobile number"
            />

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
              loadingText="Sending OTP..."
              sx={{ mt: 3, mb: 2, py: 1.5 }}
              disabled={phone.length !== 10}
            >
              Send OTP
            </LoadingButton>

            <Box sx={{ textAlign: 'center', mt: 2 }}>
              <MuiLink component={NextLink} href="/customer" variant="body2">
                Back to Login with Password
              </MuiLink>
            </Box>
          </Box>
        </Paper>
      </Container>
    </>
  );
}
