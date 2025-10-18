'use client';

import { Container, Typography, Box, TextField, Button, Grid, Paper, FormControl, InputLabel, Select, MenuItem, Card, CardContent, List, ListItem, ListItemIcon, ListItemText, Chip } from '@mui/material';
import { CheckCircleOutline, Business, TrendingUp, Security, Speed, Support, AccountBalance } from '@mui/icons-material';
import { useState, useEffect, useMemo } from 'react';

export default function BusinessLoanPage() {
  const [formData, setFormData] = useState({
    fullName: '',
    dob: '',
    pan: '',
    aadhaar: '',
    address: '',
    mobile: '',
    email: '',
    businessName: '',
    businessType: '',
    yearsInBusiness: '',
    businessPan: '',
    gstNumber: '',
    industry: '',
    annualTurnover: '',
    businessAddress: '',
    loanAmount: '',
    loanTenure: '',
    loanPurpose: ''
  });

  // --- Cross-fade background logic ---
  const bgImages = useMemo(() => [
    '/personal-loan-bg-1.jpg',
    '/personal-loan-bg-2.jpg',
    '/personal-loan-bg-3.jpg',
  ], []);
  const [currentBg, setCurrentBg] = useState(0);
  const [nextBg, setNextBg] = useState(1);
  const [fade, setFade] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(true);
      setTimeout(() => {
        setCurrentBg(nextBg);
        setNextBg((nextBg + 1) % bgImages.length);
        setFade(false);
      }, 1000);
    }, 6000);
    return () => clearInterval(interval);
  }, [nextBg, bgImages.length]);

  useEffect(() => {
    bgImages.forEach((src) => {
      const img = new window.Image();
      img.src = src;
    });
  }, [bgImages]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log('Business Loan form submitted', formData);
    
    // Here you would typically send the data to your API
    // For now, just log it
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
  const loanTenures = ['12', '24', '36', '48', '60', '72', '84'];

  const businessLoanFeatures = [
    'Avail Business Financial Consultation for 4 Years',
    'Lowest Interest Rates (starting @ 11.5% p.a.)',
    'Very Quick Disbursal – up to Rs.1CR (from NBFCs)'
  ];

  const businessLoanBenefits = [
    'Get Business Loan - up to ₹1 crores',
    'Reasonable Interest Rate starting at 11.5%',
    '100% Paperless Procedure',
    'Safe And Secure process'
  ];

  const msmeBenefits = [
    'Special MSME interest rates',
    'Faster processing for MSMEs',
    'Government scheme benefits',
    'Priority lending support'
  ];

  return (
    <Box sx={{ position: 'relative', width: '100%', overflow: 'auto' }}>
      {/* Cross-fade background images */}
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100vh',
          backgroundImage: `url(${bgImages[currentBg]})`,
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          opacity: fade ? 0 : 0.25,
          zIndex: -2,
          pointerEvents: 'none',
          transition: 'opacity 2s ease',
        }}
      />
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100vh',
          backgroundImage: `url(${bgImages[nextBg]})`,
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          opacity: fade ? 0.25 : 0,
          zIndex: -1,
          pointerEvents: 'none',
          transition: 'opacity 5s ease',
        }}
      />
      
      {/* Hero Section */}
      <Box sx={{ 
        position: 'relative', 
        zIndex: 1, 
        textAlign: 'center', 
        py: 8, 
        background: 'linear-gradient(135deg, rgba(25, 118, 210, 0.1) 0%, rgba(156, 39, 176, 0.1) 100%)',
        mb: 4
      }}>
        <Container maxWidth="lg">
          <Typography variant="h2" component="h1" gutterBottom sx={{ fontWeight: 'bold', mb: 2 }}>
            Apply Super-Instantly in Partnered NBFCs
          </Typography>
          <Typography variant="h5" component="p" gutterBottom sx={{ color: 'text.secondary', mb: 4 }}>
            Easy Procedure | Paperless Process | Instant Service
          </Typography>
          
          {/* Key Features */}
          <Grid container spacing={2} justifyContent="center" sx={{ mb: 4 }}>
            {businessLoanFeatures.map((feature, index) => (
              <Grid size="auto" key={index}>
                <Chip label={feature} color="primary" variant="outlined" />
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: { xs: 3, sm: 4, md: 6 }, position: 'relative', zIndex: 1 }}>
        <Paper elevation={3} sx={{ p: { xs: 2, sm: 3, md: 4 }, borderRadius: 2, boxShadow: '0 8px 24px rgba(0,0,0,0.12)' }}>
          <Typography variant="h4" component="h1" textAlign="center" gutterBottom sx={{ fontWeight: 'bold', mb: {xs: 3, md: 4} }}>
            Avail Rs.1 Crore Business Loan With Online Process.
          </Typography>
          <Typography variant="h6" component="p" textAlign="center" gutterBottom sx={{ color: 'text.secondary', mb: 4 }}>
            Start Your Process Now:
          </Typography>
        
        <Box component="form" onSubmit={handleSubmit} noValidate>
          {/* Applicant / Promoter Details Section */}
          <Typography variant="h6" gutterBottom sx={{ mt: 2, mb: 2.5, borderBottom: 1, borderColor: 'divider', pb:1, fontWeight:'medium' }}>
            Applicant / Promoter Details
          </Typography>
          <Grid container spacing={2.5}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField 
                fullWidth 
                label="Full Name (Primary Applicant/Promoter)" 
                name="fullName" 
                value={formData.fullName}
                onChange={(e) => handleInputChange('fullName', e.target.value)}
                required 
                autoComplete="name" 
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField 
                fullWidth 
                label="Date of Birth" 
                name="dob" 
                type="date" 
                value={formData.dob}
                onChange={(e) => handleInputChange('dob', e.target.value)}
                InputLabelProps={{ shrink: true }} 
                required 
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField 
                fullWidth 
                label="PAN Card Number (Personal PAN)" 
                name="pan" 
                value={formData.pan}
                onChange={(e) => handleInputChange('pan', e.target.value)}
                required 
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField 
                fullWidth 
                label="Aadhaar Number" 
                name="aadhaar" 
                value={formData.aadhaar}
                onChange={(e) => handleInputChange('aadhaar', e.target.value)}
                required 
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField 
                fullWidth 
                label="Current Residential Address" 
                name="address" 
                multiline 
                rows={3} 
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                required 
                autoComplete="street-address" 
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField 
                fullWidth 
                label="Mobile Number" 
                name="mobile" 
                type="tel" 
                value={formData.mobile}
                onChange={(e) => handleInputChange('mobile', e.target.value)}
                required 
                autoComplete="tel" 
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField 
                fullWidth 
                label="Email Address" 
                name="email" 
                type="email" 
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                required 
                autoComplete="email" 
              />
            </Grid>
          </Grid>

          {/* Business Information Section */}
          <Typography variant="h6" gutterBottom sx={{ mt: 4, mb: 2.5, borderBottom: 1, borderColor: 'divider', pb:1, fontWeight:'medium' }}>
            Business Information
          </Typography>
          <Grid container spacing={2.5}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField 
                fullWidth 
                label="Registered Business Name" 
                name="businessName" 
                value={formData.businessName}
                onChange={(e) => handleInputChange('businessName', e.target.value)}
                required 
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <FormControl fullWidth required>
                <InputLabel id="business-type-label">Type of Business</InputLabel>
                <Select 
                  labelId="business-type-label" 
                  label="Type of Business" 
                  name="businessType" 
                  value={formData.businessType}
                  onChange={(e) => handleInputChange('businessType', e.target.value)}
                >
                  {businessTypes.map(type => <MenuItem key={type} value={type}>{type}</MenuItem>)}
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField 
                fullWidth 
                label="Years in Business" 
                name="yearsInBusiness" 
                type="number" 
                value={formData.yearsInBusiness}
                onChange={(e) => handleInputChange('yearsInBusiness', e.target.value)}
                required 
                InputProps={{ inputProps: { min: 0 } }} 
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField 
                fullWidth 
                label="Business PAN Number" 
                name="businessPan" 
                value={formData.businessPan}
                onChange={(e) => handleInputChange('businessPan', e.target.value)}
                required 
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField 
                fullWidth 
                label="GST Number (if applicable)" 
                name="gstNumber" 
                value={formData.gstNumber}
                onChange={(e) => handleInputChange('gstNumber', e.target.value)}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField 
                fullWidth 
                label="Nature of Business / Industry" 
                name="industry" 
                value={formData.industry}
                onChange={(e) => handleInputChange('industry', e.target.value)}
                required 
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField 
                fullWidth 
                label="Annual Business Turnover (INR)" 
                name="annualTurnover" 
                type="number" 
                value={formData.annualTurnover}
                onChange={(e) => handleInputChange('annualTurnover', e.target.value)}
                required 
                InputProps={{ inputProps: { min: 0 } }} 
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField 
                fullWidth 
                label="Business Office Address" 
                name="businessAddress" 
                multiline 
                rows={3} 
                value={formData.businessAddress}
                onChange={(e) => handleInputChange('businessAddress', e.target.value)}
                required 
              />
            </Grid>
          </Grid>

          {/* Loan Requirements Section */}
          <Typography variant="h6" gutterBottom sx={{ mt: 4, mb: 2.5, borderBottom: 1, borderColor: 'divider', pb:1, fontWeight:'medium' }}>
            Loan Requirements
          </Typography>
          <Grid container spacing={2.5}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField 
                fullWidth 
                label="Loan Amount Requested (INR)" 
                name="loanAmount" 
                type="number" 
                value={formData.loanAmount}
                onChange={(e) => handleInputChange('loanAmount', e.target.value)}
                required 
                InputProps={{ inputProps: { min: 50000 } }} 
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <FormControl fullWidth required>
                <InputLabel id="loan-tenure-label">Preferred Loan Tenure (Months)</InputLabel>
                <Select 
                  labelId="loan-tenure-label" 
                  label="Preferred Loan Tenure (Months)" 
                  name="loanTenure" 
                  value={formData.loanTenure}
                  onChange={(e) => handleInputChange('loanTenure', e.target.value)}
                >
                  {loanTenures.map(tenure => <MenuItem key={tenure} value={tenure}>{tenure} Months</MenuItem>)}
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12 }}>
              <FormControl fullWidth required>
                <InputLabel id="loan-purpose-label">Purpose of Loan</InputLabel>
                <Select 
                  labelId="loan-purpose-label" 
                  label="Purpose of Loan" 
                  name="loanPurpose" 
                  value={formData.loanPurpose}
                  onChange={(e) => handleInputChange('loanPurpose', e.target.value)}
                >
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

      {/* Additional Information Sections */}
      <Grid container spacing={4} sx={{ mt: 4 }}>
        {/* Business Loan Details */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 3 }}>
                What is Business loan?
              </Typography>
              <Typography variant="body1" paragraph sx={{ fontSize: '1.1rem', lineHeight: 1.8 }}>
                A business loan is a financing option designed specifically for business purposes such as working capital, 
                expansion, equipment purchase, or inventory management. It helps businesses meet their financial needs 
                and grow their operations.
              </Typography>
              
              <List>
                {businessLoanBenefits.map((benefit, index) => (
                  <ListItem key={index}>
                    <ListItemIcon>
                      <CheckCircleOutline color="primary" />
                    </ListItemIcon>
                    <ListItemText primary={benefit} />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* MSME Benefits */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 3 }}>
                MSME Benefits
              </Typography>
              <Typography variant="body1" paragraph sx={{ fontSize: '1.1rem', lineHeight: 1.8 }}>
                Special benefits and faster processing for Micro, Small, and Medium Enterprises (MSMEs) 
                to support business growth and development.
              </Typography>
              
              <List>
                {msmeBenefits.map((benefit, index) => (
                  <ListItem key={index}>
                    <ListItemIcon>
                      <CheckCircleOutline color="success" />
                    </ListItemIcon>
                    <ListItemText primary={benefit} />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Use Cases */}
        <Grid size={{ xs: 12 }}>
          <Card>
            <CardContent>
              <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 3, textAlign: 'center' }}>
                Business Loan Use Cases
              </Typography>
              <Grid container spacing={3}>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                  <Box sx={{ textAlign: 'center', p: 2 }}>
                    <Business sx={{ fontSize: 40, color: 'primary.main', mb: 2 }} />
                    <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                      Working Capital
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Manage day-to-day operations and cash flow
                    </Typography>
                  </Box>
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                  <Box sx={{ textAlign: 'center', p: 2 }}>
                    <TrendingUp sx={{ fontSize: 40, color: 'success.main', mb: 2 }} />
                    <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                      Business Expansion
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Scale your business to new markets
                    </Typography>
                  </Box>
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                  <Box sx={{ textAlign: 'center', p: 2 }}>
                    <AccountBalance sx={{ fontSize: 40, color: 'warning.main', mb: 2 }} />
                    <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                      Equipment Purchase
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Buy machinery and equipment for operations
                    </Typography>
                  </Box>
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                  <Box sx={{ textAlign: 'center', p: 2 }}>
                    <Security sx={{ fontSize: 40, color: 'info.main', mb: 2 }} />
                    <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                      Inventory Finance
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Stock up on inventory for business needs
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Contact Information */}
      <Card sx={{ mt: 4, bgcolor: 'grey.50' }}>
        <CardContent>
          <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 3, textAlign: 'center' }}>
            Contact Information
          </Typography>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 4 }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                Registered Office Address
              </Typography>
              <Typography variant="body2" color="text.secondary">
                44, 3rd Floor, Vijayraj Society,<br />
                Near Akshar Family Wear,<br />
                Singanpore Causeway Road,<br />
                Katargam, Surat, Gujarat, India - 395004
              </Typography>
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                Phone Number
              </Typography>
              <Typography variant="body2" color="text.secondary">
                +91-70263-73808
              </Typography>
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                Email Address
              </Typography>
              <Typography variant="body2" color="text.secondary">
                info@Blumiq.com
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Container>
    </Box>
  );
}
