'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Container, Typography, Box, TextField, Paper } from '@mui/material';
import { useAppSelector } from '@/store/hooks';
import LoadingButton from '@/components/Common/LoadingButton';
import AuthBackgroundRotator from '@/components/AuthBackgroundRotator';
import { LoaderKeys } from '@/actions/shared/constants';
import { authActions } from '@/actions/auth';

function MobileVerifyForm() {
  const searchParams = useSearchParams();
  const mobile = searchParams.get('mobile') || '';
  const [otp, setOtp] = useState('');
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes in seconds
  const router = useRouter();
  const isVerifying = useAppSelector(state => state.ui.activeLoaders[LoaderKeys.AUTH_LOADING] || false);
  const isResending = useAppSelector(state => state.ui.activeLoaders[LoaderKeys.AUTH_LOADING] || false);

  // Countdown timer for OTP expiry
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSuccess(null);
    setError(null);

    if (otp.length !== 6) {
      setError('Please enter a valid 6-digit OTP');
      return;
    }

    const result = await authActions.verifyMobileOtp.execute({ 
      phone_number: mobile, 
      otp: otp 
    });

    if (result.success) {
      setSuccess('Login successful! Redirecting...');
      // Redirect to dashboard
      setTimeout(() => {
        router.push('/dashboard');
      }, 1500);
    } else {
      setError(result.error || 'Invalid OTP. Please try again.');
    }
  };

  const handleResendOtp = async () => {
    setError(null);

    const result = await authActions.sendMobileOtp.execute({ phone_number: mobile });

    if (result.success) {
      setTimeLeft(600); // Reset timer
      setSuccess('New OTP sent successfully!');
      setOtp(''); // Clear current OTP input
    } else {
      setError(result.error || 'Failed to resend OTP');
    }
  };

  const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, ''); // Remove non-digits
    if (value.length <= 6) {
      setOtp(value);
    }
  };

  if (!mobile) {
    return (
      <Container maxWidth="xs" sx={{ mt: 4 }}>
        <Typography color="error" textAlign="center">
          No mobile number provided. Please go back and try again.
        </Typography>
      </Container>
    );
  }

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
            Verify OTP
          </Typography>
          
          <Typography variant="body1" textAlign="center" sx={{ mb: 2 }}>
            Please enter the OTP sent to your mobile number
          </Typography>
          
          <Typography variant="body2" textAlign="center" sx={{ mb: 3, color: 'primary.main', fontWeight: 'bold' }}>
            +91 {mobile.slice(0, 2)}****{mobile.slice(-2)}
          </Typography>

          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="otp"
              label="Enter OTP"
              name="otp"
              autoFocus
              value={otp}
              onChange={handleOtpChange}
              placeholder="123456"
              inputProps={{ 
                maxLength: 6,
                pattern: '[0-9]*',
                inputMode: 'numeric'
              }}
              helperText={`Enter the 6-digit OTP (Expires in ${formatTime(timeLeft)})`}
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
              loading={isVerifying}
              loadingText="Verifying..."
              sx={{ mt: 3, mb: 2, py: 1.5 }}
              disabled={otp.length !== 6 || timeLeft === 0}
            >
              Verify OTP
            </LoadingButton>

            <Box sx={{ textAlign: 'center', mt: 2 }}>
              <LoadingButton
                variant="text"
                onClick={handleResendOtp}
                loading={isResending}
                loadingText="Sending..."
                disabled={timeLeft > 540} // Disable for first minute
                sx={{ textTransform: 'none' }}
              >
                {timeLeft > 540 ? `Resend OTP (${formatTime(timeLeft - 540)})` : 'Resend OTP'}
              </LoadingButton>
            </Box>

            {timeLeft === 0 && (
              <Typography color="error" textAlign="center" sx={{ mt: 2 }}>
                OTP has expired. Please request a new one.
              </Typography>
            )}
          </Box>
        </Paper>
      </Container>
    </>
  );
}

export default function MobileVerifyPage() {
  return (
    <Suspense fallback={
      <Container maxWidth="xs" sx={{ mt: 4 }}>
        <Typography textAlign="center">Loading...</Typography>
      </Container>
    }>
      <MobileVerifyForm />
    </Suspense>
  );
}
