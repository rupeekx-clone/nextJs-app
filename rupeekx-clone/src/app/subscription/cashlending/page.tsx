'use client';

import { Container, Typography, Box, TextField, Button, Grid, Paper, FormControl, InputLabel, Select, MenuItem, FormControlLabel, Checkbox, Link as MuiLink } from '@mui/material';
import NextLink from 'next/link';

export default function SubscriptionCashlendingPage() {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Dummy handler: Actual backend integration will be implemented later
    console.log('Subscription application submitted');
    // Here you would typically gather form data
  };

  const subscriptionPlans = ['Basic Access', 'Premium Tier', 'Pro Lender']; // Placeholder plans

  return (
    <Container maxWidth="md" sx={{ py: { xs: 3, sm: 4, md: 6 } }}>
      <Paper elevation={3} sx={{ p: { xs: 2, sm: 3, md: 4 }, borderRadius: 2, boxShadow: '0 8px 24px rgba(0,0,0,0.12)' }}>
        <Typography variant="h4" component="h1" textAlign="center" gutterBottom sx={{ fontWeight: 'bold', mb: {xs: 3, md: 4} }}>
          Cash Lending Subscription Application
        </Typography>
        
        <Box component="form" onSubmit={handleSubmit} noValidate>
          {/* Personal Details Section */}
          <Typography variant="h6" gutterBottom sx={{ mt: 2, mb: 2.5, borderBottom: 1, borderColor: 'divider', pb:1, fontWeight:'medium' }}>
            Your Details
          </Typography>
          <Grid container spacing={2.5}>
            <Grid item xs={12} sm={6}><TextField fullWidth label="Full Name" name="fullName" required autoComplete="name" /></Grid>
            <Grid item xs={12} sm={6}><TextField fullWidth label="Mobile Number" name="mobile" type="tel" required autoComplete="tel" /></Grid>
            <Grid item xs={12} sm={6}><TextField fullWidth label="Email Address" name="email" type="email" required autoComplete="email" /></Grid>
            <Grid item xs={12} sm={6}><TextField fullWidth label="PAN Card Number" name="pan" required /></Grid>
          </Grid>

          {/* Subscription Choice Section */}
          <Typography variant="h6" gutterBottom sx={{ mt: 4, mb: 2.5, borderBottom: 1, borderColor: 'divider', pb:1, fontWeight:'medium' }}>
            Subscription Choice
          </Typography>
          <Grid container spacing={2.5}>
            <Grid item xs={12}>
              <FormControl fullWidth required>
                <InputLabel id="subscription-plan-label">Choose Subscription Plan</InputLabel>
                <Select labelId="subscription-plan-label" label="Choose Subscription Plan" name="subscriptionPlan" defaultValue="">
                  {subscriptionPlans.map(plan => <MenuItem key={plan} value={plan}>{plan}</MenuItem>)}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
          
          {/* Create Your Account Section */}
          <Typography variant="h6" gutterBottom sx={{ mt: 4, mb: 2.5, borderBottom: 1, borderColor: 'divider', pb:1, fontWeight:'medium' }}>
            Create Your Account
          </Typography>
          <Grid container spacing={2.5}>
            <Grid item xs={12} sm={6}><TextField fullWidth label="Create Password" name="password" type="password" required /></Grid>
            <Grid item xs={12} sm={6}><TextField fullWidth label="Confirm Password" name="confirmPassword" type="password" required /></Grid>
          </Grid>

          {/* Terms and Conditions Section */}
          <Grid item xs={12} sx={{ mt: 3, mb:1 }}> {/* Adjusted margin */}
            <FormControlLabel
              control={<Checkbox name="agreeTerms" required />}
              label={
                <Typography variant="body2">
                  I agree to the{' '}
                  <MuiLink component={NextLink} href="/terms-conditions" target="_blank" rel="noopener noreferrer" underline="always">
                    Terms & Conditions
                  </MuiLink>
                </Typography>
              }
            />
          </Grid>

          <Box sx={{ textAlign: 'center', mt: 4, mb: 2 }}> {/* Adjusted margin */}
            <Button type="submit" variant="contained" color="primary" size="large" sx={{px: 5, py:1.5, fontWeight: 'medium'}}>
              Sign Up & Activate Subscription
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
}
