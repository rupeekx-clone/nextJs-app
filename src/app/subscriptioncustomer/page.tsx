'use client'; // For potential client-side interactions, even if basic for now

import { Container, Typography, Box, TextField, Button, Grid, Paper, Link as MuiLink } from '@mui/material';
import NextLink from 'next/link'; // For navigation links

export default function SubscriptionCustomerLoginPage() { // Function name changed
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Dummy handler: Actual logic will be implemented later
    console.log('Subscription Login form submitted'); 
  };

  return (
    <Container 
      maxWidth="xs" 
      sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center', 
        minHeight: 'calc(100vh - 120px)', // Adjust 120px based on header/footer height
        py: 4 
      }}
    >
      <Paper 
        elevation={6} 
        sx={{ 
          p: {xs: 2, sm: 4}, // Responsive padding
          width: '100%',
          borderRadius: 2
        }}
      >
        <Typography variant="h4" component="h1" textAlign="center" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
          Cash Lending Login {/* Title Changed */}
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address or Subscription ID" // Label can be more specific
            name="emailOrSubscriptionId" // Name updated
            autoComplete="email" // Keep email for now, or use a custom one
            autoFocus
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2, py: 1.5 }} // Larger button
          >
            Sign In
          </Button>
          <Grid container>
            <Grid item xs>
              <MuiLink component={NextLink} href="#" variant="body2">
                Forgot password?
              </MuiLink>
            </Grid>
            <Grid item>
              <MuiLink component={NextLink} href="#" variant="body2"> {/* Link to a future signup page or subscription info */}
                {"Don't have a subscription? Learn More"} {/* Text can be adjusted */}
              </MuiLink>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Container>
  );
}
