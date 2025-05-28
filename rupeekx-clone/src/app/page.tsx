'use client'; // Required for event handlers and hooks

import * as React from 'react';
import { 
  Container, Typography, Button, Grid, Box, Card, CardContent, CardActions,
  List, ListItem, ListItemIcon, ListItemText, Paper, Avatar
} from '@mui/material'; // Added Paper, Avatar
import Link from 'next/link';
import CheckCircleOutline from '@mui/icons-material/CheckCircleOutline'; // Import the icon
import PersonIcon from '@mui/icons-material/Person'; // Import PersonIcon

export default function HomePage() {
  return (
    // Using React.Fragment to return multiple top-level elements
    <React.Fragment>
      {/* Hero Section (existing code) */}
      <Box 
        sx={{ 
          textAlign: 'center', 
          py: { xs: 5, sm: 8, md: 10 }, // Responsive vertical padding
          backgroundColor: 'background.paper', // Optional: to give a slight background
          minHeight: '70vh', // Ensure it takes a good portion of the viewport height
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Container maxWidth="md">
          <Typography 
            variant="h3" 
            component="h1" 
            gutterBottom 
            sx={{ 
              fontWeight: 'bold',
              fontSize: { xs: '2.5rem', sm: '3rem', md: '3.5rem' } // Responsive font size
            }}
          >
            Welcome to the Simplest & Fastest Way to Apply for Instant Loan
          </Typography>
          <Typography 
            variant="h6" 
            component="p" 
            color="text.secondary" 
            paragraph 
            sx={{
              mb: { xs: 3, sm: 4 }, // Responsive margin bottom
              fontSize: { xs: '1rem', sm: '1.125rem', md: '1.25rem' } // Responsive font size
            }}
          >
            Get personal & business loan offers from multiple banks
          </Typography>
          <Grid container spacing={2} justifyContent="center" sx={{ mt: { xs: 2, sm: 3 } }}>
            <Grid item xs={12} sm="auto"> {/* Full width on extra small, auto on small and up */}
              <Button 
                variant="contained" 
                color="primary" 
                component={Link} 
                href="/digital/personalLoan" 
                size="large"
                sx={{ 
                  py: 1.5, 
                  px: { xs: 3, sm: 4 }, // Responsive padding
                  width: { xs: '100%', sm: 'auto' } // Full width on xs
                }}
              >
                Personal Loan
              </Button>
            </Grid>
            <Grid item xs={12} sm="auto"> {/* Full width on extra small, auto on small and up */}
              <Button 
                variant="contained" 
                color="secondary" 
                component={Link} 
                href="/digital/businessLoan" 
                size="large"
                sx={{ 
                  py: 1.5, 
                  px: { xs: 3, sm: 4 }, // Responsive padding
                  width: { xs: '100%', sm: 'auto' } // Full width on xs
                }}
              >
                Business Loan
              </Button>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Section: "We Offer Expertized Loan Solutions!" */}
      <Box sx={{ py: { xs: 4, md: 8 }, backgroundColor: 'alternate.main' /* Or any other color for distinction */ }}>
        <Container maxWidth="lg">
          <Typography variant="h4" component="h2" textAlign="center" gutterBottom sx={{ fontWeight: 'bold' }}>
            We Offer Expertized Loan Solutions!
          </Typography>
          <Typography variant="subtitle1" textAlign="center" color="text.secondary" paragraph sx={{ mb: { xs: 3, md: 5 } }}>
            We Believe That Access to Financial Services Is a Basic Right of All Individuals. All require some extent of help and consultation about loan services.
          </Typography>
          <Grid container spacing={4} justifyContent="center">
            {/* Personal Loans Card */}
            <Grid item xs={12} md={6}>
              <Card sx={{ display: 'flex', flexDirection: 'column', height: '100%', boxShadow: 3 }}> {/* Added shadow */}
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" component="h3" gutterBottom sx={{ fontWeight: 'medium' }}>
                    Personal Loans
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Apply For Personal Loan Upto Rs.15 Lakhs With Attractive Interest Rates 12.5%, Minimum Paperwork, Quick Approval Within 30 Munits*
                  </Typography>
                </CardContent>
                <CardActions sx={{ justifyContent: 'flex-start', px: 2, pb: 2 }}> {/* Added padding */}
                  <Button size="small" component={Link} href="/digital/personalLoan" variant="outlined">
                    Read More
                  </Button>
                </CardActions>
              </Card>
            </Grid>
            {/* Business Loans Card */}
            <Grid item xs={12} md={6}>
              <Card sx={{ display: 'flex', flexDirection: 'column', height: '100%', boxShadow: 3 }}> {/* Added shadow */}
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" component="h3" gutterBottom sx={{ fontWeight: 'medium' }}>
                    Business Loans
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Apply For Business Loans Up To 1 Cr. Without Collateral With Flexi EMI Options, Minimum Documentation And Quick Approval Within 48 Hours*
                  </Typography>
                </CardContent>
                <CardActions sx={{ justifyContent: 'flex-start', px: 2, pb: 2 }}> {/* Added padding */}
                  <Button size="small" component={Link} href="/digital/businessLoan" variant="outlined">
                    Read More
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* New Section: "About us" snippet */}
      <Box sx={{ py: { xs: 4, md: 8 }, backgroundColor: 'background.default' /* Or a slightly different shade */ }}>
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center"> {/* alignItems="center" for vertical alignment */}
            {/* Textual Content */}
            <Grid item xs={12} md={6}>
              <Typography variant="h4" component="h2" gutterBottom sx={{ fontWeight: 'bold' }}>
                About us
              </Typography>
              <Typography variant="h6" component="p" color="text.secondary" gutterBottom sx={{ fontStyle: 'italic' }}>
                When it comes to lightning fast loan services – nothing beats Rupeekx!
              </Typography>
              <Typography variant="body1" paragraph>
                Welcome to Rupeekx.com, we are the number one loan provider consult. We're dedicated to helping you in getting loans through membership cards, with an emphasis on saving your time and money. Get the best results on loans through multiple banks or NBFCs. We are aimed to provide easy quick loan approval. The company has garnered a great volume of acclaim due to its authentic services in giving the industry-best loan offerings.
              </Typography>
              <Button variant="contained" component={Link} href="/company" sx={{ mt: 2 }}>
                Know More
              </Button>
            </Grid>
            {/* Key Features List */}
            <Grid item xs={12} md={6}>
              <List>
                {[
                  "Available in 5000+ Indian Cities",
                  "Avail loans sitting at home",
                  "100% Digital Loan Process",
                  "Trusted by more than 1 Cr users",
                  "On-Call Assistance",
                  "Partnered With Multiple Banks & NBFCs",
                  "100% Paperless Procedure",
                  "Safe And Secure process"
                ].map((text, index) => (
                  <ListItem key={index} disablePadding sx={{ py: 0.5 }}> {/* Added small vertical padding to list items */}
                    <ListItemIcon sx={{minWidth: 'auto', mr: 1.5, color: 'primary.main' }}> {/* Styled icon */}
                      <CheckCircleOutline fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary={text} primaryTypographyProps={{ variant: 'body2' }} />
                  </ListItem>
                ))}
              </List>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* New Section: "Our Innovative Loan-Oriented Products" */}
      <Box sx={{ py: { xs: 4, md: 8 }, backgroundColor: 'alternate.main' }}> {/* Example of alternating background */}
        <Container maxWidth="lg">
          <Typography variant="h4" component="h2" textAlign="center" gutterBottom sx={{ fontWeight: 'bold' }}>
            Our Innovative Loan-Oriented Products
          </Typography>
          <Typography variant="subtitle1" textAlign="center" color="text.secondary" paragraph sx={{ mb: { xs: 3, md: 5 } }}>
            With a Rupeekx Membership Card, you get more effective benefits that prove to be a great addition to the perk of availing the instant pre-approved loan offers from multiple banks.
          </Typography>
          <Grid container spacing={4} justifyContent="center">
            {/* Silver Membership Card */}
            <Grid item xs={12} md={6}>
              <Card sx={{ display: 'flex', flexDirection: 'column', height: '100%', boxShadow: 3 }}>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" component="h3" gutterBottom sx={{ fontWeight: 'medium' }}>
                    Silver Membership Card
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Get Personal Loan of up to ₹15 Lacs in just 30 minutes
                  </Typography>
                </CardContent>
                <CardActions sx={{ justifyContent: 'center', p: 2 }}> {/* Centered button */}
                  <Button variant="contained" component={Link} href="/products/silver-membership-card">
                    Get Now
                  </Button>
                </CardActions>
              </Card>
            </Grid>
            {/* Gold Membership Card */}
            <Grid item xs={12} md={6}>
              <Card sx={{ display: 'flex', flexDirection: 'column', height: '100%', boxShadow: 3 }}>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" component="h3" gutterBottom sx={{ fontWeight: 'medium' }}>
                    Gold Membership Card
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Get Business Loan of up to ₹1 Crore in just 48 hours
                  </Typography>
                </CardContent>
                <CardActions sx={{ justifyContent: 'center', p: 2 }}> {/* Centered button */}
                  <Button variant="contained" component={Link} href="/products/gold-membership-card">
                    Get Now
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* New Section: "Our Bank & NBFC Partners" */}
      <Box sx={{ py: { xs: 4, md: 8 }, backgroundColor: 'background.default' }}>
        <Container maxWidth="lg">
          <Typography variant="h4" component="h2" textAlign="center" gutterBottom sx={{ fontWeight: 'bold', mb: {xs: 3, md: 5} }}>
            Our Bank & NBFC Partners
          </Typography>
          <Grid container spacing={{ xs: 2, md: 3 }} justifyContent="center">
            {[
              "prefer", "Ziploan", "Faircent.com", "Union Bank", 
              "Werise", "Money View", "KREDITBEE", "Upward", 
              "Incred", "PaySense", "IIFL", "Yes Bank"
            ].map((partnerName, index) => (
              <Grid item key={index} xs={6} sm={4} md={2}> {/* Adjusted for 12 items: 2 on xs, 3 on sm, 6 on md */}
                <Paper 
                  variant="outlined" 
                  sx={{ 
                    p: {xs: 1, sm: 2}, 
                    textAlign: 'center', 
                    height: '100%', 
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: {xs: 60, sm: 80} 
                  }}
                >
                  <Typography variant="caption" component="p"> 
                    {partnerName}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* New Section: "What Our Customers Say" */}
      <Box sx={{ py: { xs: 4, md: 8 }, backgroundColor: 'alternate.main' }}>
        <Container maxWidth="lg">
          <Typography variant="h4" component="h2" textAlign="center" gutterBottom sx={{ fontWeight: 'bold' }}>
            What Our Customers Say
          </Typography>
          <Typography variant="subtitle1" textAlign="center" color="text.secondary" paragraph sx={{ mb: { xs: 3, md: 5 }, maxWidth: '700px', mx: 'auto' }}>
            We're dedicated to helping you in getting loans through membership cards, with an emphasis on saving your time and money. Get the best results on loans through multiple banks or NBFCs. We are aimed to provide easy quick loan approval.
          </Typography>
          <Grid container spacing={4} justifyContent="center">
            {[1, 2, 3].map((item) => ( // Creating 3 placeholder testimonials
              <Grid item key={item} xs={12} sm={6} md={4}>
                <Card sx={{ display: 'flex', flexDirection: 'column', height: '100%', boxShadow: 3 }}>
                  <CardContent sx={{ flexGrow: 1, textAlign: 'center' }}> {/* Centering card content */}
                    <Avatar sx={{ mx: 'auto', mb: 2, bgcolor: 'primary.main' }}>
                      <PersonIcon />
                    </Avatar>
                    <Typography variant="body1" fontStyle="italic" paragraph>
                      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer posuere erat a ante. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas."
                    </Typography>
                    <Typography variant="subtitle2" component="p" sx={{ fontWeight: 'bold' }}>
                      - Customer Name {item}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
    </React.Fragment>
  );
}
