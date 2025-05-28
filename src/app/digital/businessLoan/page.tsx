'use client'; // For form interactions

import { Container, Typography, Box, TextField, Button, Grid, Paper, FormControl, InputLabel, Select, MenuItem } from '@mui/material';

export default function BusinessLoanPage() { // Renamed function
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log('Business Loan form submitted'); 
  };

  const businessTypes = ['Proprietorship', 'Partnership', 'Private Limited Company', 'Limited Liability Partnership (LLP)', 'Other'];
  const businessLoanPurposes = [
    'Working Capital', 
    'Business Expansion', 
    'Equipment Purchase', 
    'Inventory Finance', 
    'Property Purchase/Renovation (for business)',
    'Other Business Needs'
  ];
  const loanTenures = ['12', '24', '36', '48', '60', '72', '84']; // Example in months, potentially longer for business loans

  return (
    <Container maxWidth="md" sx={{ py: { xs: 3, sm: 4, md: 6 } }}>
      <Paper elevation={3} sx={{ p: { xs: 2, sm: 3, md: 4 }, borderRadius: 2, boxShadow: '0 8px 24px rgba(0,0,0,0.12)' }}>
        <Typography variant="h4" component="h1" textAlign="center" gutterBottom sx={{ fontWeight: 'bold', mb: {xs: 3, md: 4} }}>
          Business Loan Application {/* Renamed title */}
        </Typography>
        
        <Box component="form" onSubmit={handleSubmit} noValidate>
          {/* Applicant / Promoter Details Section */}
          <Typography variant="h6" gutterBottom sx={{ mt: 2, mb: 2.5, borderBottom: 1, borderColor: 'divider', pb:1, fontWeight:'medium' }}>
            Applicant / Promoter Details
          </Typography>
          <Grid container spacing={2.5}>
            <Grid item xs={12} sm={6}><TextField fullWidth label="Full Name (Primary Applicant/Promoter)" name="fullName" required autoComplete="name" /></Grid>
            <Grid item xs={12} sm={6}><TextField fullWidth label="Date of Birth" name="dob" type="date" InputLabelProps={{ shrink: true }} required /></Grid>
            <Grid item xs={12} sm={6}><TextField fullWidth label="PAN Card Number (Personal PAN)" name="pan" required /></Grid>
            <Grid item xs={12} sm={6}><TextField fullWidth label="Aadhaar Number" name="aadhaar" required /></Grid>
            <Grid item xs={12}><TextField fullWidth label="Current Residential Address" name="address" multiline rows={3} required autoComplete="street-address" /></Grid>
            <Grid item xs={12} sm={6}><TextField fullWidth label="Mobile Number" name="mobile" type="tel" required autoComplete="tel" /></Grid>
            <Grid item xs={12} sm={6}><TextField fullWidth label="Email Address" name="email" type="email" required autoComplete="email" /></Grid>
          </Grid>

          {/* Business Information Section */}
          <Typography variant="h6" gutterBottom sx={{ mt: 4, mb: 2.5, borderBottom: 1, borderColor: 'divider', pb:1, fontWeight:'medium' }}>
            Business Information
          </Typography>
          <Grid container spacing={2.5}>
            <Grid item xs={12} sm={6}><TextField fullWidth label="Registered Business Name" name="businessName" required /></Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel id="business-type-label">Type of Business</InputLabel>
                <Select labelId="business-type-label" label="Type of Business" name="businessType" defaultValue="">
                  {businessTypes.map(type => <MenuItem key={type} value={type}>{type}</MenuItem>)}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}><TextField fullWidth label="Years in Business" name="yearsInBusiness" type="number" required InputProps={{ inputProps: { min: 0 } }} /></Grid>
            <Grid item xs={12} sm={6}><TextField fullWidth label="Business PAN Number" name="businessPan" required /></Grid>
            <Grid item xs={12} sm={6}><TextField fullWidth label="GST Number (if applicable)" name="gstNumber" /></Grid>
            <Grid item xs={12} sm={6}><TextField fullWidth label="Nature of Business / Industry" name="industry" required /></Grid>
            <Grid item xs={12}><TextField fullWidth label="Annual Business Turnover (INR)" name="annualTurnover" type="number" required InputProps={{ inputProps: { min: 0 } }} /></Grid>
            <Grid item xs={12}><TextField fullWidth label="Business Office Address" name="businessAddress" multiline rows={3} required /></Grid>
          </Grid>

          {/* Loan Requirements Section */}
          <Typography variant="h6" gutterBottom sx={{ mt: 4, mb: 2.5, borderBottom: 1, borderColor: 'divider', pb:1, fontWeight:'medium' }}>
            Loan Requirements
          </Typography>
          <Grid container spacing={2.5}>
            <Grid item xs={12} sm={6}><TextField fullWidth label="Loan Amount Requested (INR)" name="loanAmount" type="number" required InputProps={{ inputProps: { min: 50000 } }} /></Grid>
            <Grid item xs={12} sm={6}>
                <FormControl fullWidth required>
                    <InputLabel id="loan-tenure-label">Preferred Loan Tenure (Months)</InputLabel>
                    <Select labelId="loan-tenure-label" label="Preferred Loan Tenure (Months)" name="loanTenure" defaultValue="">
                        {loanTenures.map(tenure => <MenuItem key={tenure} value={tenure}>{tenure} Months</MenuItem>)}
                    </Select>
                </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth required>
                <InputLabel id="loan-purpose-label">Purpose of Loan</InputLabel>
                <Select labelId="loan-purpose-label" label="Purpose of Loan" name="loanPurpose" defaultValue="">
                     {businessLoanPurposes.map(purpose => <MenuItem key={purpose} value={purpose}>{purpose}</MenuItem>)}
                </Select>
              </FormControl>
            </Grid>
          </Grid>

          <Box sx={{ textAlign: 'center', mt: 5, mb: 2 }}>
            <Button type="submit" variant="contained" color="primary" size="large" sx={{px: 6, py:1.5, fontWeight: 'medium'}}>
              Submit Business Loan Application
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
}
