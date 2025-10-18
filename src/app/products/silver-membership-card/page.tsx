'use client';

import { Container, Typography, Box, Grid, Button, List, ListItem, ListItemIcon, ListItemText, Paper, Card, CardContent, Chip, Stepper, Step, StepLabel, Divider } from '@mui/material';
import { CheckCircleOutline, Star, Security, Speed, Support, TrendingUp, CreditCard, AccessTime } from '@mui/icons-material';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SilverMembershipCardPage() {
  const router = useRouter();
  const [isPurchasing, setIsPurchasing] = useState(false);

  const features = [
    "Access to Personal Loans up to ₹15 Lacs",
    "Quick Approval Process (target within 30 minutes)",
    "Streamlined application with minimal paperwork",
    "Competitive interest rates",
    "Exclusive offers and discounts for members",
    "Dedicated customer support"
  ];

  const processSteps = [
    { label: "Purchase Membership", description: "Buy Silver Membership Card" },
    { label: "Complete Profile", description: "Fill in your personal details" },
    { label: "Upload Documents", description: "Submit required documents" },
    { label: "Get Pre-approved", description: "Receive loan offers" },
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

  const handlePurchase = async () => {
    setIsPurchasing(true);
    try {
      // Here you would integrate with Razorpay payment gateway
      // For now, just simulate the process
      console.log('Initiating Silver Membership Card purchase...');
      
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
          Silver Membership Card
        </Typography>
        <Typography variant="h5" component="p" gutterBottom sx={{ color: 'text.secondary', mb: 3 }}>
          Silver Membership Card for Personal Loan Candidate
        </Typography>
        <Typography variant="body1" paragraph sx={{ fontSize: '1.1rem', lineHeight: 1.8, maxWidth: 800, mx: 'auto' }}>
          Get Personal Loan of up to ₹10 Lakhs in just 30 minutes with our Silver Membership Card. 
          Enjoy exclusive benefits and faster processing for all your personal loan needs.
        </Typography>
      </Box>

      {/* Pricing Section */}
      <Card sx={{ mb: 6, textAlign: 'center', border: '2px solid', borderColor: 'primary.main' }}>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 2 }}>
            Special Offer - Limited Time!
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 2, mb: 3 }}>
            <Typography variant="h6" sx={{ textDecoration: 'line-through', color: 'text.secondary' }}>
              Rs. 2999.00
            </Typography>
            <Typography variant="h3" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
              Rs. 677.00 only
            </Typography>
          </Box>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            One-time payment • Valid for 4 years • No hidden charges
          </Typography>
          <Button 
            variant="contained" 
            color="primary" 
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
          Six simple steps to get loan
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
                  <CheckCircleOutline sx={{ fontSize: 40, color: 'primary.main', mb: 2 }} />
                  <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                    {benefit}
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
          Why Choose Silver Membership Card?
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
                        <CheckCircleOutline color="primary" />
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
                      primary="Premium Support"
                      secondary="Dedicated customer support team"
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
                      secondary="Quick approval within 30 minutes"
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <TrendingUp color="primary" />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Best Rates"
                      secondary="Competitive interest rates"
                    />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>

      {/* Final CTA Section */}
      <Card sx={{ textAlign: 'center', bgcolor: 'primary.main', color: 'white' }}>
        <CardContent sx={{ p: 6 }}>
          <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 2 }}>
            Upgrade your dream
          </Typography>
          <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
            Don't let financial constraints hold you back. Get your Silver Membership Card today and unlock the door to your dreams.
          </Typography>
          <Button 
            variant="contained" 
            color="secondary" 
            size="large" 
            onClick={handlePurchase}
            disabled={isPurchasing}
            sx={{ px: 6, py: 2, fontSize: '1.1rem' }}
          >
            {isPurchasing ? 'Processing...' : 'Purchase Now - ₹677 Only'}
          </Button>
        </CardContent>
      </Card>
    </Container>
  );
}
