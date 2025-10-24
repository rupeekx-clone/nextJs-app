"use client";
import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Container, Typography, Box, TextField, Button, Paper } from "@mui/material";
import { authActions } from "@/actions/auth";
import AuthBackgroundRotator from "@/components/AuthBackgroundRotator";

function VerifyOtpForm() {
  const searchParams = useSearchParams();
  const mobile = searchParams.get("mobile") || "";
  const isReset = searchParams.get("reset") === "1";
  const [otp, setOtp] = useState("");
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
      const result = await authActions.verifyOtp.execute({
        phone_number: mobile,
        otp_entered: otp,
      });

      if (result.success) {
        setSuccess("OTP verified!");
        setTimeout(() => {
          if (isReset) {
            router.push(`/customer/reset-password?mobile=${encodeURIComponent(mobile)}`);
          } else {
            router.push("/customer");
          }
        }, 1200);
      } else {
        setError(result.error || 'Invalid OTP. Please try again.');
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
          Enter OTP
        </Typography>
        <Typography variant="body1" textAlign="center" sx={{ mb: 2 }}>
          Please enter the OTP sent to your mobile number ending with {mobile.slice(-4)}
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="otp"
            label="OTP"
            name="otp"
            autoFocus
            value={otp}
            onChange={e => setOtp(e.target.value)}
            inputProps={{ maxLength: 6, pattern: "[0-9]*" }}
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
            {loading ? "Verifying..." : "Verify OTP"}
          </Button>
        </Box>
      </Paper>
    </Container>
    </>
  );
}

export default function VerifyOtpPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VerifyOtpForm />
    </Suspense>
  );
} 