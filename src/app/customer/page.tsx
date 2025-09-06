'use client'; // For potential client-side interactions, even if basic for now

import { Container, Typography, Box, TextField, Button, Grid, Paper, Link as MuiLink } from '@mui/material';
import NextLink from 'next/link'; // For navigation links
import { useState } from 'react';
import { useAxios } from '@/lib/useAxios';
import AuthBackgroundRotator from '@/components/AuthBackgroundRotator';

export default function CustomerLoginPage() {
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [success, setSuccess] = useState<string | null>(null);
  const { loading, error, data, sendRequest } = useAxios();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSuccess(null);
    try {
      const result = await sendRequest({
        method: 'POST',
        url: '/auth/login',
        data: { phone_number: mobile, password },
      });
      if (result.success) {
        setSuccess('Login successful! Redirecting...');
        localStorage.setItem('accessToken', result.tokens.accessToken);
        setTimeout(() => {
          window.location.href = '/';
        }, 1200);
      } else if (result.verification_required) {
        setSuccess(null);
        // Optionally redirect to OTP verification page
      }
    } catch (err) {
      setSuccess(null);
      // Error is handled by the hook
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
          minHeight: 'calc(100vh - 120px)', // Adjust 120px based on header/footer height
          py: 4 
        }}
      >
        <Paper 
          elevation={6} 
          sx={{ 
            p: {xs: 2, sm: 4}, // Responsive padding
            width: '100%',
            borderRadius: 2
          }}
        >
          <Typography variant="h4" component="h1" textAlign="center" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
            Customer Login
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="mobile"
              label="Mobile Number"
              name="mobile"
              autoComplete="tel"
              autoFocus
              value={mobile}
              onChange={e => setMobile(e.target.value)}
              inputProps={{ maxLength: 10, pattern: '[0-9]*' }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={e => setPassword(e.target.value)}
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
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2, py: 1.5 }}
              disabled={loading}
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </Button>
            <Grid container>
              <Grid size={{ xs: 12 }}>
                <MuiLink component={NextLink} href="/customer/forgot-password" variant="body2">
                  Forgot password?
                </MuiLink>
              </Grid>
              <Grid size={{ xs: 12 }}>
                <MuiLink component={NextLink} href="/customer/signup" variant="body2">
                  {"Don't have an account? Sign Up"}
                </MuiLink>
              </Grid>
            </Grid>
          </Box>
        </Paper>
      </Container>
    </>
  );
}
