'use client'; // For form interactions

import { useState } from 'react'; // Added for state management
import { Container, Typography, Box, TextField, Button, Grid, Paper, FormControl, InputLabel, Select, MenuItem, Alert } from '@mui/material'; // Added Alert
// Stepper components are not imported for this iteration as per instructions.

export default function PersonalLoanPage() {
  const [loanAmount, setLoanAmount] = useState('');
  const [loanTenure, setLoanTenure] = useState('');
  // For simplicity, documents_submitted will be an empty object or a predefined structure if needed.
  // const [documentsSubmitted, setDocumentsSubmitted] = useState({}); 

  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setMessage(null);

    const token = localStorage.getItem('accessToken'); // Placeholder for token retrieval
    if (!token) {
      setMessage({ type: 'error', text: 'You must be logged in to apply. Please login first.' });
      setIsLoading(false);
      return;
    }

    if (!loanAmount || !loanTenure) {
      setMessage({ type: 'error', text: 'Please fill in Loan Amount and Loan Tenure.' });
      setIsLoading(false);
      return;
    }
    
    const amountRequested = parseFloat(loanAmount);
    const tenureMonthsRequested = parseInt(loanTenure, 10);

    if (isNaN(amountRequested) || amountRequested <= 0) {
        setMessage({ type: 'error', text: 'Please enter a valid loan amount.' });
        setIsLoading(false);
        return;
    }

    if (isNaN(tenureMonthsRequested) || tenureMonthsRequested <= 0) {
        setMessage({ type: 'error', text: 'Please select a valid loan tenure.' });
        setIsLoading(false);
        return;
    }

    try {
      const response = await fetch('/api/loans/apply', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          loan_type: 'personal',
          amount_requested: amountRequested,
          tenure_months_requested: tenureMonthsRequested,
          documents_submitted: { // Example: Can be expanded or made dynamic
            pan_card: "PAN_CARD_NUMBER_FROM_FORM_IF_AVAILABLE", // Placeholder
            aadhaar_card: "AADHAAR_NUMBER_FROM_FORM_IF_AVAILABLE" // Placeholder
          } 
        }),
      });

      const result = await response.json();

      if (response.ok) {
        setMessage({ type: 'success', text: result.message || 'Application submitted successfully!' });
        setLoanAmount(''); // Clear form
        setLoanTenure('');
        // Potentially reset other form fields here if they were also controlled
      } else {
        setMessage({ type: 'error', text: result.message || `Submission failed (Status: ${response.status})` });
      }
    } catch (error) {
      console.error('Loan application submission error:', error);
      setMessage({ type: 'error', text: 'An unexpected error occurred. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const employmentTypes = ['Salaried', 'Self-Employed/Business', 'Student', 'Retired', 'Other'];
  const loanPurposes = [
    'Debt Consolidation', 
    'Home Renovation/Improvement', 
    'Medical Emergency', 
    'Travel/Vacation', 
    'Wedding Expenses', 
    'Education Expenses',
    'Vehicle Purchase (Two-wheeler/Car)',
    'Business Expansion (for self-employed)',
    'Personal Use/Other'
  ];
  const loanTenures = ['12', '24', '36', '48', '60']; // Example in months

  return (
    <Container maxWidth="md" sx={{ py: { xs: 3, sm: 4, md: 6 } }}> {/* Adjusted padding */}
      <Paper elevation={3} sx={{ p: { xs: 2, sm: 3, md: 4 }, borderRadius: 2, boxShadow: '0 8px 24px rgba(0,0,0,0.12)' }}>
        <Typography variant="h4" component="h1" textAlign="center" gutterBottom sx={{ fontWeight: 'bold', mb: {xs: 3, md: 4} }}>
          Personal Loan Application
        </Typography>
        
        {/* Stepper could be introduced here in a future iteration */}

        <Box component="form" onSubmit={handleSubmit} noValidate>
          {/* Personal Details Section */}
          <Typography variant="h6" gutterBottom sx={{ mt: 2, mb: 2.5, borderBottom: 1, borderColor: 'divider', pb:1, fontWeight:'medium' }}>
            Personal Details
          </Typography>
          <Grid container spacing={2.5}> {/* Slightly increased spacing */}
            <Grid size={{ xs: 12, sm: 6 }}><TextField fullWidth label="Full Name" name="fullName" required autoComplete="name" /></Grid>
            <Grid size={{ xs: 12, sm: 6 }}><TextField fullWidth label="Date of Birth" name="dob" type="date" InputLabelProps={{ shrink: true }} required /></Grid>
            <Grid size={{ xs: 12, sm: 6 }}><TextField fullWidth label="PAN Card Number" name="pan" required /></Grid>
            <Grid size={{ xs: 12, sm: 6 }}><TextField fullWidth label="Aadhaar Number" name="aadhaar" required /></Grid>
            <Grid size={{ xs: 12 }}><TextField fullWidth label="Current Address" name="address" multiline rows={3} required autoComplete="street-address" /></Grid>
            <Grid size={{ xs: 12, sm: 6 }}><TextField fullWidth label="Mobile Number" name="mobile" type="tel" required autoComplete="tel" /></Grid>
            <Grid size={{ xs: 12, sm: 6 }}><TextField fullWidth label="Email Address" name="email" type="email" required autoComplete="email" /></Grid>
          </Grid>

          {/* Employment Information Section */}
          <Typography variant="h6" gutterBottom sx={{ mt: 4, mb: 2.5, borderBottom: 1, borderColor: 'divider', pb:1, fontWeight:'medium' }}>
            Employment Information
          </Typography>
          <Grid container spacing={2.5}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <FormControl fullWidth required>
                <InputLabel id="employment-type-label">Employment Type</InputLabel>
                <Select labelId="employment-type-label" label="Employment Type" name="employmentType" defaultValue="">
                  {employmentTypes.map(type => <MenuItem key={type} value={type}>{type}</MenuItem>)}
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}><TextField fullWidth label="Company Name (if salaried/employed)" name="companyName" /></Grid>
            <Grid size={{ xs: 12, sm: 6 }}><TextField fullWidth label="Designation (if salaried/employed)" name="designation" /></Grid>
            <Grid size={{ xs: 12, sm: 6 }}><TextField fullWidth label="Years in Current Employment/Business" name="yearsInService" type="number" required InputProps={{ inputProps: { min: 0 } }} /></Grid>
            <Grid size={{ xs: 12, sm: 6 }}><TextField fullWidth label="Monthly Income (INR)" name="monthlyIncome" type="number" required InputProps={{ inputProps: { min: 0 } }} /></Grid>
          </Grid>

          {/* Loan Requirements Section */}
          <Typography variant="h6" gutterBottom sx={{ mt: 4, mb: 2.5, borderBottom: 1, borderColor: 'divider', pb:1, fontWeight:'medium' }}>
            Loan Requirements
          </Typography>
          <Grid container spacing={2.5}>
            <Grid size={{ xs: 12, sm: 6 }}><TextField fullWidth label="Loan Amount Requested (INR)" name="loanAmount" type="number" required InputProps={{ inputProps: { min: 1000 } }} /></Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
                <FormControl fullWidth required>
                    <InputLabel id="loan-tenure-label">Preferred Loan Tenure (Months)</InputLabel>
                  <Select 
                    labelId="loan-tenure-label" 
                    label="Preferred Loan Tenure (Months)" 
                    name="loanTenure" 
                    value={loanTenure}
                    onChange={(e) => setLoanTenure(e.target.value)}
                  >
                        {loanTenures.map(tenure => <MenuItem key={tenure} value={tenure}>{tenure} Months</MenuItem>)}
                    </Select>
                </FormControl>
            </Grid>
            <Grid size={{ xs: 12 }}>
              <FormControl fullWidth required>
                <InputLabel id="loan-purpose-label">Purpose of Loan</InputLabel>
                <Select labelId="loan-purpose-label" label="Purpose of Loan" name="loanPurpose" defaultValue="">
                     {loanPurposes.map(purpose => <MenuItem key={purpose} value={purpose}>{purpose}</MenuItem>)}
                </Select>
              </FormControl>
            </Grid>
          </Grid>

          {message && (
            <Grid size={{ xs: 12 }} sx={{ mt: 2 }}>
              <Alert severity={message.type} onClose={() => setMessage(null)}>{message.text}</Alert>
            </Grid>
          )}
          <Box sx={{ textAlign: 'center', mt: 5, mb: 2 }}> {/* Increased top margin for button */}
            <Button 
              type="submit" 
              variant="contained" 
              color="primary" 
              size="large" 
              sx={{px: 6, py:1.5, fontWeight: 'medium'}}
              disabled={isLoading}
            >
              {isLoading ? 'Submitting...' : 'Submit Application'}
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
}
