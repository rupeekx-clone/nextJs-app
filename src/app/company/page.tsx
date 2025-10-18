'use client';

import { Container, Typography, Box, List, ListItem, ListItemIcon, ListItemText, Grid, Card, CardContent, Button, Paper, Stepper, Step, StepLabel, Chip } from '@mui/material';
import { CheckCircleOutline, Visibility, Flag, Star, Timeline, Description, AccountBalance, Verified } from '@mui/icons-material';
import { useRouter } from 'next/navigation';

export default function CompanyPage() {
  const router = useRouter();
  
  const features = [
    "Available in 5000+ Indian Cities",
    "Avail loans sitting at home",
    "100% Digital Loan Process",
    "Trusted by more than 1 Cr users",
    "On-Call Assistance",
    "Partnered With Multiple Banks & NBFCs",
    "100% Paperless Procedure",
    "Safe And Secure process"
  ];

  const values = [
    "Keeping Customer Integrity Intact",
    "Push Monetary Diversity Further",
    "Promote Financial Equality",
    "Keep it simple process",
    "Nurture grow up to more achievement"
  ];

  const processSteps = [
    { label: "Easy Registration", description: "Sign up with basic details" },
    { label: "Check Eligibility", description: "Quick eligibility verification" },
    { label: "Buy Membership Card", description: "Choose Silver or Gold membership" },
    { label: "Upload Documents", description: "Submit required documents" },
    { label: "Bank Verification", description: "Partner banks verify your application" },
    { label: "Loan Sanction", description: "Get your loan approved and disbursed" }
  ];

  const detailedProcessSteps = [
    { 
      step: "Verification And Submit Documents", 
      time: "24 hours",
      description: "Upload all required documents for verification"
    },
    { 
      step: "Check your eligibility", 
      time: "2 Mins",
      description: "Quick eligibility check based on your profile"
    },
    { 
      step: "Get a Pre-approval loan offer", 
      time: "24 hours",
      description: "Receive pre-approved loan offers from partner banks"
    },
    { 
      step: "Sign your loan agreement", 
      time: "24 hours",
      description: "Review and sign the loan agreement"
    },
    { 
      step: "Fulfil Your Dreams", 
      time: "Immediate",
      description: "Get your loan disbursed and achieve your goals"
    }
  ];

  const requiredDocuments = [
    "Address Proof",
    "Age Proof", 
    "Identity Proof",
    "Salary Slips (last 6 months for salaried)",
    "Bank Statement (last 6 months)",
    "ITR or Form 16",
    "Financial Statements/Income Proof (for self-employed)"
  ];

  const benefits = [
    "Document handling and verification",
    "Profile matching with best banks",
    "Time-saving process",
    "CIBIL score protection",
    "Expert guidance throughout",
    "Transparent process"
  ];

  const handleGetMembership = () => {
    router.push('/products/silver-membership-card');
  };

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 4, md: 8 } }}>
      {/* Hero Section */}
      <Box sx={{ textAlign: 'center', mb: 8 }}>
        <Typography variant="h2" component="h1" gutterBottom sx={{ fontWeight: 'bold', mb: 2 }}>
          WHO ARE WE?
        </Typography>
        <Typography variant="h4" component="h2" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main', mb: 3 }}>
          ONE OF THE FASTEST GROWING COMPANY IN INDIA
        </Typography>
        <Typography variant="body1" paragraph sx={{ lineHeight: 1.8, fontSize: '1.1rem', textAlign: 'justify', maxWidth: 800, mx: 'auto' }}>
          Welcome to Blumiq.com, we are the number one loan provider consult. We&apos;re dedicated to helping you in getting loans through membership cards, with an emphasis on saving your time and money. Get the best results on loans through multiple banks or NBFCs. We are aimed to provide easy quick loan approval. The company has garnered a great volume of acclaim due to its authentic services in giving the industry-best loan offerings.
        </Typography>
        <Typography variant="body1" paragraph sx={{ lineHeight: 1.8, fontSize: '1.1rem', textAlign: 'justify', maxWidth: 800, mx: 'auto' }}>
          With over 10,000+ satisfied clients and growing, we have established ourselves as a trusted partner in the financial services industry. Our commitment to excellence and customer satisfaction has made us one of the fastest-growing companies in India.
        </Typography>
      </Box>

      {/* Vision, Mission, Values */}
      <Grid container spacing={4} sx={{ mb: 8 }}>
        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ height: '100%', textAlign: 'center' }}>
            <CardContent sx={{ p: 4 }}>
              <Visibility sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
              <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2 }}>
                VISION
              </Typography>
              <Typography variant="body1" color="text.secondary">
                To be the most trusted and preferred loan consultation platform in India, providing seamless financial solutions to every customer.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ height: '100%', textAlign: 'center' }}>
            <CardContent sx={{ p: 4 }}>
              <Flag sx={{ fontSize: 60, color: 'success.main', mb: 2 }} />
              <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2 }}>
                MISSION
              </Typography>
              <Typography variant="body1" color="text.secondary">
                To open opportunities for financial assistance by connecting customers with the best loan options through our innovative membership card system.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ height: '100%', textAlign: 'center' }}>
            <CardContent sx={{ p: 4 }}>
              <Star sx={{ fontSize: 60, color: 'warning.main', mb: 2 }} />
              <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2 }}>
                VALUES
              </Typography>
              <List dense>
                {values.map((value, index) => (
                  <ListItem key={index} disablePadding>
                    <ListItemIcon sx={{ minWidth: 32, color: 'primary.main' }}>
                      <CheckCircleOutline />
                    </ListItemIcon>
                    <ListItemText 
                      primary={value} 
                      primaryTypographyProps={{ variant: 'body2' }}
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Features Grid */}
      <Box sx={{ mb: 8 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', textAlign: 'center', mb: 4 }}>
          Our Commitment & Features
        </Typography>
        <Grid container spacing={3}>
          {features.map((feature, index) => (
            <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
              <Card sx={{ height: '100%', textAlign: 'center' }}>
                <CardContent sx={{ p: 3 }}>
                  <CheckCircleOutline sx={{ fontSize: 40, color: 'primary.main', mb: 2 }} />
                  <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                    {feature}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Membership Cards Showcase */}
      <Box sx={{ mb: 8 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', textAlign: 'center', mb: 4 }}>
          Our Innovative Loan-Oriented Products
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center', mb: 4, maxWidth: 600, mx: 'auto' }}>
          Choose from our membership cards designed to provide you with the best loan options and exclusive benefits.
        </Typography>
        
        <Grid container spacing={4} justifyContent="center">
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <Card sx={{ height: '100%', textAlign: 'center', border: '2px solid', borderColor: 'primary.main' }}>
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2, color: 'primary.main' }}>
                  Silver Membership Card
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                  Get Personal Loan of up to ₹15 Lacs in just 30 minutes
                </Typography>
                <Button variant="contained" onClick={handleGetMembership}>
                  LEARN MORE
                </Button>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <Card sx={{ height: '100%', textAlign: 'center', border: '2px solid', borderColor: 'warning.main' }}>
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2, color: 'warning.main' }}>
                  Gold Membership Card
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                  Get Business Loan of up to ₹1 Crore in just 48 hours
                </Typography>
                <Button variant="contained" color="warning" onClick={handleGetMembership}>
                  LEARN MORE
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>

      {/* Card Benefits */}
      <Box sx={{ mb: 8 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', textAlign: 'center', mb: 4 }}>
          Card Benefits
        </Typography>
        <Grid container spacing={3}>
          {benefits.map((benefit, index) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={index}>
              <Card sx={{ height: '100%' }}>
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Verified sx={{ color: 'success.main', mr: 1 }} />
                    <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                      {benefit}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Instant Loan Application Process */}
      <Box sx={{ mb: 8 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', textAlign: 'center', mb: 4 }}>
          Instant Loan Application Process
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

      {/* Documents Required */}
      <Box sx={{ mb: 8 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', textAlign: 'center', mb: 4 }}>
          Documents Required For Personal Loan
        </Typography>
        <Grid container spacing={2}>
          {requiredDocuments.map((doc, index) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={index}>
              <Card sx={{ height: '100%' }}>
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Description sx={{ color: 'primary.main', mr: 2 }} />
                    <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                      {doc}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Detailed Process */}
      <Box sx={{ mb: 8 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', textAlign: 'center', mb: 4 }}>
          What&apos;s the process we follow after you purchase the Membership Card?
        </Typography>
        <Grid container spacing={3}>
          {detailedProcessSteps.map((step, index) => (
            <Grid size={{ xs: 12, md: 6 }} key={index}>
              <Card sx={{ height: '100%' }}>
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                    <Chip 
                      label={`Step ${index + 1}`} 
                      color="primary" 
                      sx={{ mr: 2, minWidth: 60 }}
                    />
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                        {step.step}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        {step.description}
                      </Typography>
                      <Chip 
                        label={step.time} 
                        size="small" 
                        color="success" 
                        icon={<Timeline />}
                      />
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Bank Partners */}
      <Box sx={{ textAlign: 'center' }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 4 }}>
          Our Bank & NBFC Partners
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          We are partnered with leading banks and NBFCs to provide you with the best loan options.
        </Typography>
        <Grid container spacing={2} justifyContent="center">
          {['HDFC Bank', 'ICICI Bank', 'Axis Bank', 'SBI', 'Kotak Mahindra', 'Bajaj Finserv'].map((bank, index) => (
            <Grid size="auto" key={index}>
              <Chip 
                label={bank} 
                variant="outlined" 
                icon={<AccountBalance />}
                sx={{ m: 1 }}
              />
            </Grid>
          ))}
        </Grid>
      </Box>
    </Container>
  );
}
