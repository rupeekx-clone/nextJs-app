'use client';

import { Container, Typography, Box, Grid, Button, List, ListItem, ListItemIcon, ListItemText, Paper, Card, CardContent, Stepper, Step, StepLabel } from '@mui/material';
import { CheckCircleOutline, Star, Security, Speed, TrendingUp, Business } from '@mui/icons-material';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function GoldMembershipCardPage() {
  const router = useRouter();
  const [isPurchasing, setIsPurchasing] = useState(false);

  const features = [
    "Access to Business Loans up to ₹1 Crore",
    "Expedited Approval Process (target within 48 hours)",
    "Flexible Repayment Options tailored for businesses",
    "Dedicated Relationship Manager for personalized service",
    "Priority Processing for all your applications",
    "Complimentary business financial health check consultation"
  ];

  const processSteps = [
    { label: "Purchase Membership", description: "Buy Gold Membership Card" },
    { label: "Complete Business Profile", description: "Fill in your business details" },
    { label: "Upload Documents", description: "Submit required business documents" },
    { label: "Get Pre-approved", description: "Receive business loan offers" },
    { label: "Choose Best Offer", description: "Select the best loan option" },
    { label: "Get Loan Disbursed", description: "Receive funds in your account" }
  ];

  const benefits = [
    "Document handling and verification",
    "Profile matching with best banks",
    "Time-saving process",
    "CIBIL score protection",
    "Expert guidance throughout",
    "Transparent process"
  ];

  const businessFeatures = [
    "Working Capital Support",
    "Business Expansion Funding",
    "Equipment Purchase Loans",
    "Inventory Finance",
    "Property Purchase for Business",
    "Technology Upgrade Funding"
  ];

  const handlePurchase = async () => {
    setIsPurchasing(true);
    try {
      // Here you would integrate with Razorpay payment gateway
      // For now, just simulate the process
      console.log('Initiating Gold Membership Card purchase...');
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Redirect to payment or success page
      router.push('/subscription/cashlending');
    } catch (error) {
      console.error('Purchase failed:', error);
    } finally {
      setIsPurchasing(false);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 4, md: 8 } }}>
      {/* Hero Section */}
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Typography variant="h2" component="h1" gutterBottom sx={{ fontWeight: 'bold', mb: 2 }}>
          Gold Membership Card
        </Typography>
        <Typography variant="h5" component="p" gutterBottom sx={{ color: 'text.secondary', mb: 3 }}>
          Gold Membership Card for Business Loan Candidate
        </Typography>
        <Typography variant="body1" paragraph sx={{ fontSize: '1.1rem', lineHeight: 1.8, maxWidth: 800, mx: 'auto' }}>
          Get Business Loan of up to ₹1 Crore in just 48 hours with our Gold Membership Card. 
          Designed for entrepreneurs and businesses looking for substantial funding with expedited processing.
        </Typography>
      </Box>

      {/* Pricing Section */}
      <Card sx={{ mb: 6, textAlign: 'center', border: '2px solid', borderColor: 'warning.main' }}>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 2 }}>
            Premium Business Solution
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 2, mb: 3 }}>
            <Typography variant="h6" sx={{ textDecoration: 'line-through', color: 'text.secondary' }}>
              Rs. 4999.00
            </Typography>
            <Typography variant="h3" sx={{ fontWeight: 'bold', color: 'warning.main' }}>
              Rs. 399.00 only
            </Typography>
          </Box>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            One-time payment • Valid for 4 years • No hidden charges
          </Typography>
          <Button 
            variant="contained" 
            color="warning" 
            size="large" 
            onClick={handlePurchase}
            disabled={isPurchasing}
            sx={{ px: 6, py: 2, fontSize: '1.1rem' }}
          >
            {isPurchasing ? 'Processing...' : 'GET NOW'}
          </Button>
        </CardContent>
      </Card>

      {/* Six Simple Steps */}
      <Box sx={{ mb: 6 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', textAlign: 'center', mb: 4 }}>
          Six simple steps to get business loan
        </Typography>
        <Paper sx={{ p: 4 }}>
          <Stepper activeStep={-1} alternativeLabel>
            {processSteps.map((step, index) => (
              <Step key={index}>
                <StepLabel>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                      {step.label}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {step.description}
                    </Typography>
                  </Box>
                </StepLabel>
              </Step>
            ))}
          </Stepper>
        </Paper>
      </Box>

      {/* Benefits Grid */}
      <Box sx={{ mb: 6 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', textAlign: 'center', mb: 4 }}>
          Card Benefits
        </Typography>
        <Grid container spacing={3}>
          {benefits.map((benefit, index) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={index}>
              <Card sx={{ height: '100%', textAlign: 'center' }}>
                <CardContent sx={{ p: 3 }}>
                  <CheckCircleOutline sx={{ fontSize: 40, color: 'warning.main', mb: 2 }} />
                  <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                    {benefit}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Business Features Section */}
      <Box sx={{ mb: 6 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', textAlign: 'center', mb: 4 }}>
          Business Loan Features
        </Typography>
        <Grid container spacing={3}>
          {businessFeatures.map((feature, index) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={index}>
              <Card sx={{ height: '100%', textAlign: 'center' }}>
                <CardContent sx={{ p: 3 }}>
                  <Business sx={{ fontSize: 40, color: 'primary.main', mb: 2 }} />
                  <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                    {feature}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Features Section */}
      <Box sx={{ mb: 6 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', textAlign: 'center', mb: 4 }}>
          Why Choose Gold Membership Card?
        </Typography>
        <Grid container spacing={4}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 3 }}>
                  Key Features
                </Typography>
                <List>
                  {features.map((feature, index) => (
                    <ListItem key={index} disablePadding>
                      <ListItemIcon sx={{ minWidth: 32 }}>
                        <CheckCircleOutline color="warning" />
                      </ListItemIcon>
                      <ListItemText primary={feature} />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid size={{ xs: 12, md: 6 }}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 3 }}>
                  What You Get
                </Typography>
                <List>
                  <ListItem>
                    <ListItemIcon>
                      <Star color="warning" />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Premium Business Support"
                      secondary="Dedicated relationship manager"
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <Security color="success" />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Secure Process"
                      secondary="Bank-level security for your data"
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <Speed color="info" />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Fast Processing"
                      secondary="Quick approval within 48 hours"
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <TrendingUp color="primary" />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Best Rates"
                      secondary="Competitive business loan rates"
                    />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>

      {/* Final CTA Section */}
      <Card sx={{ textAlign: 'center', bgcolor: 'warning.main', color: 'white' }}>
        <CardContent sx={{ p: 6 }}>
          <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 2 }}>
            Scale your business
          </Typography>
          <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
            Don&apos;t let funding constraints limit your business growth. Get your Gold Membership Card today and unlock the capital you need to scale your business.
          </Typography>
          <Button 
            variant="contained" 
            color="secondary" 
            size="large" 
            onClick={handlePurchase}
            disabled={isPurchasing}
            sx={{ px: 6, py: 2, fontSize: '1.1rem' }}
          >
            {isPurchasing ? 'Processing...' : 'Purchase Now - ₹399 Only'}
          </Button>
        </CardContent>
      </Card>
    </Container>
  );
}
