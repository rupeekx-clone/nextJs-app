"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Container, Typography, Box, TextField, Button, Paper } from "@mui/material";
import { authActions } from "@/actions/auth";
import AuthBackgroundRotator from '@/components/AuthBackgroundRotator';

export default function ForgotPasswordPage() {
  const [mobile, setMobile] = useState("");
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSuccess(null);
    setError(null);
    setLoading(true);

    try {
      const result = await authActions.forgotPassword.execute({
        phone_number: mobile,
      });

      if (result.success) {
        setSuccess("OTP sent! Redirecting to verification...");
        setTimeout(() => {
          router.push(`/customer/verify-otp?mobile=${encodeURIComponent(mobile)}&reset=1`);
        }, 1200);
      } else {
        setError(result.error || 'Failed to send OTP. Please try again.');
      }
    } catch {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
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
            Forgot Password
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
              inputProps={{ maxLength: 10, pattern: "[0-9]*" }}
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
              {loading ? "Sending OTP..." : "Send OTP"}
            </Button>
          </Box>
        </Paper>
      </Container>
    </>
  );
} 