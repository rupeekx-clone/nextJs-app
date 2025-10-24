'use client';

import React, { useState } from 'react';
import { Container, Typography, Box, Alert } from '@mui/material';
import { useRouter } from 'next/navigation';
import Input from '@/components/Common/Input';
import Button from '@/components/Common/Button';
import LoadingSpinner from '@/components/Common/LoadingSpinner';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAppSelector } from '@/store/hooks';
import { adminActions } from '@/actions/admin';
import { LoaderKeys } from '@/actions/shared/constants';

const adminLoginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type AdminLoginFormData = z.infer<typeof adminLoginSchema>;

export default function AdminLoginPage() {
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const isLoading = useAppSelector(state => state.ui.activeLoaders[LoaderKeys.ADMIN_LOADING] || false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AdminLoginFormData>({
    resolver: zodResolver(adminLoginSchema),
  });

  const onSubmit = async (data: AdminLoginFormData) => {
    setError(null);

    const result = await adminActions.login.execute(data);

    if (result.success) {
      // Redirect to admin dashboard
      router.push('/admin');
    } else {
      setError(result.error || 'Login failed');
    }
  };

  if (isLoading) {
    return (
      <Container maxWidth="sm" sx={{ py: 8, display: 'flex', justifyContent: 'center' }}>
        <LoadingSpinner />
      </Container>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 2 }}>
          Admin Login
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Sign in to access the admin dashboard
        </Typography>
      </Box>

      <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 3 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Box sx={{ mb: 3 }}>
          <Input
            {...register('email')}
            label="Email Address"
            type="email"
            fullWidth
            required
            error={!!errors.email}
            helperText={errors.email?.message}
          />
        </Box>

        <Box sx={{ mb: 3 }}>
          <Input
            {...register('password')}
            label="Password"
            type="password"
            fullWidth
            required
            error={!!errors.password}
            helperText={errors.password?.message}
          />
        </Box>

        <Button
          type="submit"
          variant="primary"
          fullWidth
          size="large"
          loading={isLoading}
        >
          Sign In
        </Button>
      </Box>

      <Box sx={{ mt: 4, textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          Forgot your password? Contact system administrator.
        </Typography>
      </Box>
    </Container>
  );
}
