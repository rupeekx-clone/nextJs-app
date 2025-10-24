'use client';

import { 
  Container, 
  Typography, 
  Box, 
  Grid, 
  Button, 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText, 
  Paper, 
  Card, 
  CardContent, 
  Stepper, 
  Step, 
  StepLabel,
  Divider,
  Alert,
  Checkbox,
  FormControlLabel,
  Chip,
} from '@mui/material';
import { 
  CheckCircleOutline, 
  ArrowBack,
  ArrowForward,
  CreditCard,
  Receipt,
} from '@mui/icons-material';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import LoadingButton from '@/components/Common/LoadingButton';

export default function SilverMembershipCardPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);

  const steps = ['Review Details', 'Payment', 'Confirmation'];

  const membershipDetails = {
    name: 'Silver Membership Card',
    originalPrice: 2999,
    discountedPrice: 677,
    validity: '4 years',
    benefits: [
      "Access to Personal Loans up to ₹15 Lacs",
      "Quick Approval Process (target within 30 minutes)",
      "Streamlined application with minimal paperwork",
      "Competitive interest rates",
      "Exclusive offers and discounts for members",
      "Dedicated customer support"
    ]
  };


  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handlePayment = async () => {
    setIsProcessing(true);
    try {
      // Here you would integrate with Razorpay payment gateway
      console.log('Processing payment...');
      
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Move to confirmation step
      setCurrentStep(2);
    } catch (error) {
      console.error('Payment failed:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleComplete = () => {
    router.push('/dashboard');
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 3 }}>
              Review Membership Details
            </Typography>
            
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                  {membershipDetails.name}
                    </Typography>
                
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <Typography variant="h6" sx={{ textDecoration: 'line-through', color: 'text.secondary' }}>
                    ₹{membershipDetails.originalPrice}
        </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                    ₹{membershipDetails.discountedPrice}
                  </Typography>
                  <Chip label="77% OFF" color="error" />
      </Box>

                <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                  One-time payment • Valid for {membershipDetails.validity} • No hidden charges
        </Typography>
                
                <Divider sx={{ my: 2 }} />
                
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 2 }}>
                  What&apos;s Included:
                </Typography>
                <List>
                  {membershipDetails.benefits.map((benefit, index) => (
                    <ListItem key={index} disablePadding>
                      <ListItemIcon sx={{ minWidth: 32 }}>
                        <CheckCircleOutline color="primary" />
                      </ListItemIcon>
                      <ListItemText primary={benefit} />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Box>
        );
        
      case 1:
        return (
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 3 }}>
              Payment Details
            </Typography>
          
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, md: 8 }}>
                <Card>
              <CardContent>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                      Payment Method
                    </Typography>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                      <CreditCard sx={{ color: 'primary.main' }} />
                      <Typography variant="body1">
                        Razorpay Secure Payment Gateway
                </Typography>
                    </Box>
                    
                    <Alert severity="info" sx={{ mb: 3 }}>
                      Your payment is secured with bank-level encryption. We accept all major credit/debit cards, UPI, net banking, and wallets.
                    </Alert>
                    
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={termsAccepted}
                          onChange={(e) => setTermsAccepted(e.target.checked)}
                        />
                      }
                      label="I agree to the Terms and Conditions and Privacy Policy"
                    />
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid size={{ xs: 12, md: 4 }}>
                <Card sx={{ position: 'sticky', top: 20 }}>
                  <CardContent>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                      Order Summary
                    </Typography>
                    
                    <Box sx={{ mb: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2">Membership</Typography>
                        <Typography variant="body2">₹{membershipDetails.originalPrice}</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2" color="success.main">Discount</Typography>
                        <Typography variant="body2" color="success.main">-₹{membershipDetails.originalPrice - membershipDetails.discountedPrice}</Typography>
                      </Box>
                      <Divider sx={{ my: 1 }} />
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Total</Typography>
                        <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                          ₹{membershipDetails.discountedPrice}
                        </Typography>
                      </Box>
                    </Box>
                    
                    <Typography variant="caption" color="text.secondary">
                      Valid for {membershipDetails.validity}
                    </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
        );
        
      case 2:
        return (
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 3 }}>
              Payment Successful!
            </Typography>
            
            <Card sx={{ maxWidth: 500, mx: 'auto', mb: 3 }}>
              <CardContent>
                <CheckCircleOutline sx={{ fontSize: 80, color: 'success.main', mb: 2 }} />
                
                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                  Welcome to Silver Membership!
                </Typography>
                
                <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                  Your membership has been activated successfully. You can now access all premium features and apply for personal loans.
                </Typography>
                
                <Box sx={{ bgcolor: 'grey.50', p: 2, borderRadius: 1, mb: 3 }}>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Order ID:</strong> SM-{Date.now()}
          </Typography>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Valid Until:</strong> {new Date(Date.now() + 4 * 365 * 24 * 60 * 60 * 1000).toLocaleDateString()}
          </Typography>
                </Box>
                
          <Button 
            variant="contained" 
            size="large" 
                  startIcon={<Receipt />}
                  sx={{ mb: 2 }}
          >
                  Download Receipt
          </Button>
        </CardContent>
      </Card>
          </Box>
        );
        
      default:
        return null;
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 4, md: 8 } }}>
      {/* Header */}
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
          {membershipDetails.name}
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Complete your purchase in 3 simple steps
        </Typography>
      </Box>

      {/* Stepper */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Stepper activeStep={currentStep} alternativeLabel>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
      </Paper>

      {/* Step Content */}
      <Paper sx={{ p: 4, mb: 4 }}>
        {renderStepContent()}
      </Paper>

      {/* Navigation Buttons */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Button
          variant="outlined"
          startIcon={<ArrowBack />}
          onClick={handleBack}
          disabled={currentStep === 0}
        >
          Back
        </Button>

        <Box sx={{ display: 'flex', gap: 2 }}>
          {currentStep === 0 && (
            <Button
              variant="contained"
              endIcon={<ArrowForward />}
              onClick={handleNext}
            >
              Proceed to Payment
            </Button>
          )}
          
          {currentStep === 1 && (
            <LoadingButton
              variant="contained"
              loading={isProcessing}
              loadingText="Processing Payment..."
              onClick={handlePayment}
              disabled={!termsAccepted}
            >
              Pay ₹{membershipDetails.discountedPrice}
            </LoadingButton>
          )}
          
          {currentStep === 2 && (
            <Button
              variant="contained"
              onClick={handleComplete}
            >
              Go to Dashboard
            </Button>
          )}
        </Box>
      </Box>
    </Container>
  );
}
