'use client'; // This page needs to be a client component for form handling

import { useState } from 'react';
import { Container, Typography, TextField, Button, Box, Grid, Alert } from '@mui/material';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [responseMessage, setResponseMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    setResponseMessage(null);
    setErrorMessage(null);

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const result = await res.json();

      if (res.ok) {
        setResponseMessage(result.message || 'Form submitted successfully!');
        setFormData({ name: '', email: '', subject: '', message: '' }); // Reset form
      } else {
        setErrorMessage(result.message || 'An error occurred.');
      }
    } catch (error) {
      console.error('Form submission error:', error);
      setErrorMessage('An unexpected error occurred. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: { xs: 4, md: 8 } }}>
      <Typography variant="h4" component="h1" gutterBottom textAlign="center" sx={{ fontWeight: 'bold' }}>
        Contact Us
      </Typography>
      <Typography variant="subtitle1" textAlign="center" color="text.secondary" paragraph sx={{ mb: { xs: 3, md: 5 }, maxWidth: '700px', mx: 'auto' }}>
        Have questions or feedback? Fill out the form below to get in touch with us.
      </Typography>
      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
        <Grid container spacing={3}> {/* Increased spacing for better visual separation */}
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              aria-describedby="name-helper-text"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              aria-describedby="email-helper-text"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Subject"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              aria-describedby="subject-helper-text"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Message"
              name="message"
              multiline
              rows={5} // Increased rows for more space
              value={formData.message}
              onChange={handleChange}
              required
              aria-describedby="message-helper-text"
            />
          </Grid>
          <Grid item xs={12} sx={{ textAlign: 'center', mt: 2 }}> {/* Added margin top for the button */}
            <Button type="submit" variant="contained" color="primary" disabled={submitting} size="large">
              {submitting ? 'Submitting...' : 'Send Message'}
            </Button>
          </Grid>
        </Grid>
      </Box>
      {responseMessage && <Alert severity="success" sx={{ mt: 3 }}>{responseMessage}</Alert>}
      {errorMessage && <Alert severity="error" sx={{ mt: 3 }}>{errorMessage}</Alert>}
    </Container>
  );
}
