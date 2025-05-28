'use client';

import { Container, Typography, Box, Grid, Button, List, ListItem, ListItemIcon, ListItemText, Paper } from '@mui/material';
import CheckCircleOutline from '@mui/icons-material/CheckCircleOutline';
import Link from 'next/link'; // For the button link

export default function CashLendingSubscriptionPage() {
  const features = [
    "Priority access to a range of cash loans",
    "Flexible loan amounts based on your subscription tier",
    "Simplified and faster loan renewal process",
    "Reduced processing fees for active subscribers",
    "Dedicated support hotline for quick assistance",
    "Exclusive access to financial planning tools and resources"
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
              <Typography variant="h6" color="text.secondary">Subscription Service Icon/Image</Typography>
            </Box>
          </Grid>

          {/* Content Column */}
          <Grid item xs={12} md={8}>
            <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
              Cash Lending Subscription
            </Typography>
            <Typography variant="h6" color="text.secondary" paragraph sx={{ mb: 2 }}>
              Our Cash Lending Subscription provides you with ongoing access to flexible cash loan options. Subscribe today for priority service and tailored lending solutions to meet your recurring financial needs.
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
              color="primary" 
              size="large" 
              component={Link} 
              href="#view-plans" 
              sx={{ mt: 2, px: 4, py: 1.5 }}
            >
              Subscribe Now
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
}
