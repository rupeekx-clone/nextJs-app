'use client';

import React, { useState } from 'react';
import { Box, Typography, Alert } from '@mui/material';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Input from '../Common/Input';
import Button from '../Common/Button';
import { validateData, enquirySchema } from '@/lib/validation';

const contactFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email format'),
  phone_number: z.string().regex(/^[6-9]\d{9}$/, 'Invalid Indian phone number format'),
  subject: z.string().optional(),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

type ContactFormData = z.infer<typeof contactFormSchema>;

interface ContactFormProps {
  onSubmit?: (data: ContactFormData) => Promise<void>;
}

const ContactForm: React.FC<ContactFormProps> = ({ onSubmit }) => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
  });

  const handleFormSubmit = async (data: ContactFormData) => {
    setLoading(true);
    setError(null);

    try {
      if (onSubmit) {
        await onSubmit(data);
      } else {
        // Default API call
        const response = await fetch('/api/contact', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to submit enquiry');
        }
      }

      setSuccess(true);
      reset();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <Box textAlign="center" py={4}>
        <Alert severity="success" sx={{ mb: 2 }}>
          Thank you for your enquiry! We will get back to you soon.
        </Alert>
        <Button
          variant="outline"
          onClick={() => setSuccess(false)}
        >
          Send Another Message
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

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
          <Box sx={{ flex: 1 }}>
            <Input
              {...register('name')}
              label="Full Name"
              fullWidth
              required
              error={!!errors.name}
              helperText={errors.name?.message}
            />
          </Box>
          <Box sx={{ flex: 1 }}>
            <Input
              {...register('phone_number')}
              label="Mobile Number"
              fullWidth
              required
              error={!!errors.phone_number}
              helperText={errors.phone_number?.message}
            />
          </Box>
        </Box>

        <Input
          {...register('email')}
          label="Email ID"
          type="email"
          fullWidth
          required
          error={!!errors.email}
          helperText={errors.email?.message}
        />

        <Input
          {...register('subject')}
          label="Subject"
          fullWidth
          error={!!errors.subject}
          helperText={errors.subject?.message}
        />

        <Input
          {...register('message')}
          label="Message"
          multiline
          rows={4}
          fullWidth
          required
          error={!!errors.message}
          helperText={errors.message?.message}
        />

        <Box display="flex" alignItems="center" gap={1}>
          <input
            type="checkbox"
            id="consent"
            required
            style={{ marginRight: '8px' }}
          />
          <Typography variant="body2" component="label" htmlFor="consent">
            By submitting the form & proceeding, you agree to the{' '}
            <a href="/terms-conditions" target="_blank" rel="noopener noreferrer">
              Terms of Use
            </a>{' '}
            and{' '}
            <a href="/privacy-policy" target="_blank" rel="noopener noreferrer">
              Privacy Policy
            </a>{' '}
            of Blumiq.com
          </Typography>
        </Box>

        <Button
          type="submit"
          variant="primary"
          loading={loading}
          fullWidth
          size="large"
        >
          Submit
        </Button>
      </Box>
    </Box>
  );
};

export default ContactForm;
