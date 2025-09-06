'use client'; // Can be a client component if we add interactions later, or server if static

import { Container, Typography, Box, List, ListItem, ListItemIcon, ListItemText, Grid } from '@mui/material';
import CheckCircleOutline from '@mui/icons-material/CheckCircleOutline';

export default function CompanyPage() {
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

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 4, md: 8 } }}>
      <Typography variant="h3" component="h1" textAlign="center" gutterBottom sx={{ fontWeight: 'bold' }}>
        About Our Company
      </Typography>
      <Typography variant="h5" component="p" textAlign="center" color="text.secondary" gutterBottom sx={{ fontStyle: 'italic', mb: 4 }}>
        When it comes to lightning fast loan services – nothing beats Rupeekx!
      </Typography>
      
      <Grid container spacing={5} justifyContent="center">
        <Grid size={{ xs: 12, md: 8 }}> {/* Main text column */}
          <Typography variant="body1" paragraph sx={{ lineHeight: 1.8, fontSize: '1.1rem', textAlign: 'justify' }}>
            Welcome to Rupeekx.com, we are the number one loan provider consult. We&apos;re dedicated to helping you in getting loans through membership cards, with an emphasis on saving your time and money. Get the best results on loans through multiple banks or NBFCs. We are aimed to provide easy quick loan approval. The company has garnered a great volume of acclaim due to its authentic services in giving the industry-best loan offerings.
          </Typography>
        </Grid>
        <Grid size={{ xs: 12, md: 10 }}> {/* Centered list below the main text */}
          <Typography variant="h6" component="h3" textAlign="center" gutterBottom sx={{ fontWeight: 'medium', mt: {xs: 1, md: 3}, mb: 2 }}>
            Our Commitment & Features
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center' }}> {/* Centering the list box */}
            <List sx={{ maxWidth: 600 }}> {/* Max width for the list for better readability */}
              {features.map((text, index) => (
                <ListItem key={index} disablePadding sx={{ mb: 1 }}>
                  <ListItemIcon sx={{ minWidth: 32, color: 'primary.main' }}> {/* Adjust icon spacing and color */}
                    <CheckCircleOutline />
                  </ListItemIcon>
                  <ListItemText primary={text} primaryTypographyProps={{ variant: 'body1' }} /> {/* Slightly larger text for features */}
                </ListItem>
              ))}
            </List>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
}
