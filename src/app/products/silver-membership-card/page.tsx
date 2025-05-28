'use client';

import { Container, Typography, Box, Grid, Button, List, ListItem, ListItemIcon, ListItemText, Paper } from '@mui/material';
import CheckCircleOutline from '@mui/icons-material/CheckCircleOutline';
import Link from 'next/link'; // For the button link

export default function SilverMembershipCardPage() {
  const features = [
    "Access to Personal Loans up to ₹15 Lacs",
    "Quick Approval Process (target within 30 minutes)",
    "Streamlined application with minimal paperwork",
    "Competitive interest rates",
    "Exclusive offers and discounts for members",
    "Dedicated customer support"
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
              Silver Membership Card
            </Typography>
            <Typography variant="h6" color="text.secondary" paragraph sx={{ mb: 2 }}>
              Unlock exclusive access to fast personal loans up to ₹15 Lacs, processed swiftly to meet your urgent financial needs. The Silver Membership Card is your key to a world of convenience and benefits.
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
              href="/digital/personalLoan" // Or a dedicated application page
              sx={{ mt: 2, px: 4, py: 1.5 }}
            >
              Apply for Silver Card
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
}
