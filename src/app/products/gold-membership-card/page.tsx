'use client';

import { Container, Typography, Box, Grid, Button, List, ListItem, ListItemIcon, ListItemText, Paper } from '@mui/material';
import CheckCircleOutline from '@mui/icons-material/CheckCircleOutline';
import Link from 'next/link'; // For the button link

export default function GoldMembershipCardPage() {
  const features = [
    "Access to Business Loans up to ₹1 Crore",
    "Expedited Approval Process (target within 48 hours)",
    "Flexible Repayment Options tailored for businesses",
    "Dedicated Relationship Manager for personalized service",
    "Priority Processing for all your applications",
    "Complimentary business financial health check consultation"
  ];

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 4, md: 8 } }}>
      <Paper elevation={3} sx={{ p: { xs: 2, md: 4 }, borderRadius: 2 }}>
        <Grid container spacing={4} alignItems="center">
          {/* Optional Image/Icon Column */}
          <Grid item xs={12} md={4} sx={{ textAlign: 'center' }}>
            <Box 
              sx={{ 
                width: '100%', 
                height: {xs: 200, md: 300}, 
                backgroundColor: 'grey.200', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                borderRadius: 1 
              }}
            >
              <Typography variant="h6" color="text.secondary">Product Image/Icon Placeholder</Typography>
            </Box>
          </Grid>

          {/* Content Column */}
          <Grid item xs={12} md={8}>
            <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
              Gold Membership Card
            </Typography>
            <Typography variant="h6" color="text.secondary" paragraph sx={{ mb: 2 }}>
              Experience premium access to business loans up to ₹1 Crore with our Gold Membership Card, designed for entrepreneurs and businesses looking for substantial funding with expedited processing.
            </Typography>
            
            <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 'medium', mt: 3 }}>
              Key Features & Benefits:
            </Typography>
            <List sx={{ mb: 3 }}>
              {features.map((feature, index) => (
                <ListItem key={index} disablePadding>
                  <ListItemIcon sx={{minWidth: 32}}>
                    <CheckCircleOutline color="primary" />
                  </ListItemIcon>
                  <ListItemText primary={feature} />
                </ListItem>
              ))}
            </List>

            <Button 
              variant="contained" 
              color="primary" // Consider 'secondary' or a custom gold color if theme supports
              size="large" 
              component={Link} 
              href="/digital/businessLoan" 
              sx={{ mt: 2, px: 4, py: 1.5 }}
            >
              Apply for Gold Card
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
}
