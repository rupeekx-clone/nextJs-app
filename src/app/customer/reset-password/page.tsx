"use client";
import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Container, Typography, Box, TextField, Button, Paper } from "@mui/material";
import { useAxios } from "@/lib/useAxios";
import AuthBackgroundRotator from '@/components/AuthBackgroundRotator';

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const mobile = searchParams.get("mobile") || "";
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [success, setSuccess] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const { loading, error, sendRequest } = useAxios();
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSuccess(null);
    setFormError(null);
    if (password !== confirmPassword) {
      setFormError("Passwords do not match.");
      return;
    }
    if (password.length < 8) {
      setFormError("Password must be at least 8 characters long.");
      return;
    }
    try {
      const result = await sendRequest({
        method: "POST",
        url: "/auth/reset-password",
        data: { phone_number: mobile, new_password: password },
      });
      if (result.success) {
        setSuccess("Password reset successful! Redirecting to login...");
        setTimeout(() => {
          router.push("/customer");
        }, 1200);
      }
    } catch {
      setSuccess(null);
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
            Reset Password
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="password"
              label="New Password"
              name="password"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="confirmPassword"
              label="Confirm New Password"
              name="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
            />
            {formError && (
              <Typography color="error" sx={{ mt: 1, mb: 1 }}>
                {formError}
              </Typography>
            )}
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
              {loading ? "Resetting..." : "Reset Password"}
            </Button>
          </Box>
        </Paper>
      </Container>
    </>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResetPasswordForm />
    </Suspense>
  );
} 