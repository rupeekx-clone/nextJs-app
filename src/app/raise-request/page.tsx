'use client';

import { Container, Typography, Box, TextField, Button, Grid, Paper, FormControl, InputLabel, Select, MenuItem } from '@mui/material';

export default function RaiseRequestPage() {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Dummy handler: Actual backend integration will be implemented later
    console.log('Raise a request form submitted');
    // Here you would typically gather form data
  };

  const requestTypes = [
    "Loan Inquiry", 
    "Account Issue", 
    "Subscription Question", 
    "Technical Support", 
    "Feedback", 
    "Other"
  ];

  return (
    <Container maxWidth="md" sx={{ py: { xs: 3, sm: 4, md: 6 } }}> {/* Consistent padding */}
      <Paper elevation={3} sx={{ p: { xs: 2, sm: 3, md: 4 }, borderRadius: 2, boxShadow: '0 8px 24px rgba(0,0,0,0.12)' }}>
        <Typography variant="h4" component="h1" textAlign="center" gutterBottom sx={{ fontWeight: 'bold', mb: {xs: 3, md: 4} }}>
          Raise a Request
        </Typography>
        
        <Box component="form" onSubmit={handleSubmit} noValidate>
          <Grid container spacing={2.5}> {/* Consistent spacing */}
            <Grid item xs={12} sm={6}>
              <TextField 
                fullWidth 
                label="Full Name" 
                name="fullName" 
                required 
                autoComplete="name" 
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField 
                fullWidth 
                label="Email Address" 
                name="email" 
                type="email" 
                required 
                autoComplete="email" 
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField 
                fullWidth 
                label="Customer ID (Optional)" 
                name="customerId" 
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel id="request-type-label">Request Type</InputLabel>
                <Select 
                  labelId="request-type-label" 
                  label="Request Type" 
                  name="requestType" 
                  defaultValue=""
                >
                  {requestTypes.map(type => <MenuItem key={type} value={type}>{type}</MenuItem>)}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField 
                fullWidth 
                label="Subject" 
                name="subject" 
                required 
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Describe Your Request"
                name="description"
                multiline
                rows={5}
                required
                placeholder="Please provide as much detail as possible."
              />
            </Grid>
          </Grid>
          <Box sx={{ textAlign: 'center', mt: 4, mb: 2 }}> {/* Adjusted margin */}
            <Button 
              type="submit" 
              variant="contained" 
              color="primary" 
              size="large" 
              sx={{px: 5, py: 1.5, fontWeight: 'medium'}} // Consistent button styling
            >
              Submit Request
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
}
