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
            <Grid size={{ xs: 12, sm: 'auto' }}> {/* Full width on extra small, auto on small and up */}
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
            <Grid size={{ xs: 12, sm: 'auto' }}> {/* Full width on extra small, auto on small and up */}
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
            <Grid size={{ xs: 12, md: 6 }}> {/* Full width on extra small, auto on small and up */}
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
            <Grid size={{ xs: 12, md: 6 }}> {/* Full width on extra small, auto on small and up */}
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
            <Grid size={{ xs: 12, md: 6 }}> {/* Full width on extra small, auto on small and up */}
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
            <Grid size={{ xs: 12, md: 6 }}> {/* Full width on extra small, auto on small and up */}
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
            <Grid size={{ xs: 12, md: 6 }}> {/* Full width on extra small, auto on small and up */}
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
            <Grid size={{ xs: 12, md: 6 }}> {/* Full width on extra small, auto on small and up */}
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

      {/* New Section: Why Choose Us */}
      <Box sx={{ py: { xs: 4, md: 8 }, backgroundColor: 'background.default' }}>
        <Container maxWidth="lg">
          <Typography variant="h4" component="h2" textAlign="center" gutterBottom sx={{ fontWeight: 'bold', mb: { xs: 3, md: 5 } }}>
            Why Choose Rupeekx
          </Typography>
          <Typography variant="subtitle1" textAlign="center" color="text.secondary" paragraph sx={{ mb: { xs: 3, md: 5 }, maxWidth: '700px', mx: 'auto' }}>
            Join thousands of satisfied customers who have transformed their financial future with our services.
          </Typography>
          {/* Stat Cards */}
          <Grid container spacing={4} justifyContent="center" sx={{ mb: { xs: 4, md: 8 } }}>
            {[
              { label: '₹250Cr+', desc: 'Loans Funded' },
              { label: '98%', desc: 'Customer Satisfaction' },
              { label: '24/7', desc: 'Customer Support' },
              { label: '50,000+', desc: 'Happy Customers' },
            ].map((stat, idx) => (
              <Grid size={{ xs: 12, sm: 6, md: 3 }} key={idx}>
                <Card sx={{ p: 3, textAlign: 'center', boxShadow: 2, borderRadius: 3, height: '100%' }}>
                  <Typography variant="h4" color="primary" sx={{ fontWeight: 'bold', mb: 1 }}>{stat.label}</Typography>
                  <Typography color="text.secondary">{stat.desc}</Typography>
                </Card>
              </Grid>
            ))}
          </Grid>
          {/* Two Columns: Benefits */}
          <Grid container spacing={6}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Box component="img" src="https://readdy.ai/api/search-image?query=professional%20illustration%20of%20diverse%20people%20managing%20finances%20with%20digital%20tools%2C%20showing%20happiness%20and%20relief.%20Modern%2C%20clean%20design%20with%20blue%20accents%20that%20match%20the%20website%20theme.%20Professional%20fintech%20visual%20showing%20financial%20freedom%20and%20success&width=600&height=500&seq=16&orientation=landscape" alt="Financial Freedom" sx={{ width: '100%', borderRadius: 3, boxShadow: 2, mb: 3 }} />
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>Financial Freedom at Your Fingertips</Typography>
              <List>
                {["Access funds when you need them most without lengthy approval processes", "Consolidate high-interest debt into a single, manageable payment", "Use funds for major purchases without depleting your savings"].map((text, i) => (
                  <ListItem key={i} sx={{ py: 0 }}>
                    <ListItemIcon sx={{ minWidth: 32 }}>
                      <CheckCircleOutline color="success" fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary={text} primaryTypographyProps={{ variant: 'body2' }} />
                  </ListItem>
                ))}
              </List>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Box component="img" src="https://readdy.ai/api/search-image?query=professional%20illustration%20of%20secure%20digital%20financial%20transactions%20with%20protection%20shields%2C%20encryption%20symbols%2C%20and%20user%20privacy%20elements.%20Modern%2C%20clean%20design%20with%20blue%20accents%20that%20match%20the%20website%20theme.%20Professional%20fintech%20visual%20showing%20security%20and%20trust&width=600&height=500&seq=17&orientation=landscape" alt="Security and Trust" sx={{ width: '100%', borderRadius: 3, boxShadow: 2, mb: 3 }} />
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>Security and Trust You Can Count On</Typography>
              <List>
                {["Bank-level 256-bit encryption protects your personal and financial information", "Transparent terms with no hidden fees or surprise charges", "Regulated and compliant with all industry standards and requirements"].map((text, i) => (
                  <ListItem key={i} sx={{ py: 0 }}>
                    <ListItemIcon sx={{ minWidth: 32 }}>
                      <CheckCircleOutline color="success" fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary={text} primaryTypographyProps={{ variant: 'body2' }} />
                  </ListItem>
                ))}
              </List>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* New Section: How It Works */}
      <Box sx={{ py: { xs: 4, md: 8 }, backgroundColor: 'alternate.main' }}>
        <Container maxWidth="lg">
          <Typography variant="h4" component="h2" textAlign="center" gutterBottom sx={{ fontWeight: 'bold', mb: { xs: 3, md: 5 } }}>
            How It Works
          </Typography>
          <Typography variant="subtitle1" textAlign="center" color="text.secondary" paragraph sx={{ mb: { xs: 3, md: 5 }, maxWidth: '700px', mx: 'auto' }}>
            Our streamlined process makes getting financial assistance quick and hassle-free.
          </Typography>
          <Box sx={{ position: 'relative', mt: 6 }}>
            {/* Timeline vertical line for md+ */}
            <Box sx={{ display: { xs: 'none', md: 'block' }, position: 'absolute', left: '50%', top: 0, bottom: 0, width: 4, bgcolor: 'primary.light', transform: 'translateX(-50%)', borderRadius: 2, zIndex: 0 }} />
            {/* Steps */}
            {[
              {
                title: 'Apply Online',
                desc: 'Fill out our simple application form in just minutes. No paperwork, no branch visits required.',
                img: 'https://readdy.ai/api/search-image?query=3D%20illustration%20of%20person%20filling%20out%20online%20application%20on%20laptop%20or%20mobile%20device.%20Modern%2C%20clean%20design%20with%20blue%20accents%20that%20match%20the%20website%20theme.%20Professional%20fintech%20visual%20showing%20ease%20of%20application%20process%20with%20digital%20form%20elements&width=400&height=300&seq=12&orientation=landscape',
              },
              {
                title: 'Get Instant Decision',
                desc: 'Our advanced system evaluates your application instantly and provides an immediate decision.',
                img: 'https://readdy.ai/api/search-image?query=3D%20illustration%20of%20instant%20approval%20with%20checkmark%2C%20timer%2C%20and%20digital%20verification%20elements.%20Modern%2C%20clean%20design%20with%20blue%20accents%20that%20match%20the%20website%20theme.%20Professional%20fintech%20visual%20showing%20quick%20decision%20process%20with%20approval%20notification&width=400&height=300&seq=13&orientation=landscape',
              },
              {
                title: 'Review Your Offer',
                desc: 'Review your personalized loan terms, including interest rate, monthly payment, and repayment period.',
                img: 'https://readdy.ai/api/search-image?query=3D%20illustration%20of%20person%20reviewing%20financial%20offer%20on%20digital%20device%20with%20loan%20terms%2C%20interest%20rates%2C%20and%20payment%20schedule.%20Modern%2C%20clean%20design%20with%20blue%20accents%20that%20match%20the%20website%20theme.%20Professional%20fintech%20visual%20showing%20decision-making%20process&width=400&height=300&seq=14&orientation=landscape',
              },
              {
                title: 'Receive Funds',
                desc: 'Once approved, funds are transferred directly to your bank account as soon as the next business day.',
                img: 'https://readdy.ai/api/search-image?query=3D%20illustration%20of%20money%20transfer%20to%20bank%20account%20with%20flowing%20coins%2C%20digital%20wallet%2C%20and%20bank%20building.%20Modern%2C%20clean%20design%20with%20blue%20accents%20that%20match%20the%20website%20theme.%20Professional%20fintech%20visual%20showing%20fund%20disbursement%20process&width=400&height=300&seq=15&orientation=landscape',
              },
            ].map((step, idx) => (
              <Box key={idx} sx={{ position: 'relative', mb: { xs: 6, md: 10 }, minHeight: { md: 180 } }}>
                {/* Step Bubble - absolutely centered on the vertical line for md+ */}
                <Box
                  sx={{
                    display: { xs: 'none', md: 'block' }, // Only show on md+
                    justifyContent: 'center',
                    alignItems: 'center',
                    position: { xs: 'static', md: 'absolute' },
                    left: { md: '50%' },
                    top: { md: '50%' },
                    transform: { md: 'translate(-50%, -50%)' },
                    zIndex: 2,
                  }}
                >
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      bgcolor: idx % 2 === 0 ? 'primary.main' : 'warning.main',
                      color: 'white',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 'bold',
                      fontSize: 24,
                      boxShadow: 2,
                      mb: { xs: 2, md: 0 },
                    }}
                  >
                    {idx + 1}
                  </Box>
                </Box>
                <Grid container alignItems="center" sx={{ flexDirection: { xs: 'column', md: idx % 2 === 0 ? 'row' : 'row-reverse' } }}>
                  {/* Text */}
                  <Grid size={{ xs: 12, md: 6 }} sx={{
                    textAlign: { xs: 'center', md: idx % 2 === 0 ? 'right' : 'left' },
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: { xs: 'center', md: idx % 2 === 0 ? 'flex-end' : 'flex-start' },
                    justifyContent: 'center',
                    minHeight: 180,
                    pr: { md: idx % 2 === 0 ? 6 : 0 },
                    pl: { md: idx % 2 !== 0 ? 6 : 0 },
                  }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: { xs: 'center', md: idx % 2 === 0 ? 'flex-end' : 'flex-start' }, mb: 2 }}>
                      {/* Hide bubble here for md+ (it's absolutely positioned) */}
                      <Box sx={{ display: { xs: 'block', md: 'none' }, mr: 2 }}>
                        <Box sx={{
                          width: 48,
                          height: 48,
                          bgcolor: idx % 2 === 0 ? 'primary.main' : 'warning.main',
                          color: 'white',
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 'bold',
                          fontSize: 24,
                          boxShadow: 2,
                        }}>{idx + 1}</Box>
                      </Box>
                      <Typography variant="h6" sx={{ fontWeight: 'bold' }}>{step.title}</Typography>
                    </Box>
                    <Typography color="text.secondary" sx={{ mb: 2 }}>{step.desc}</Typography>
                  </Grid>
                  {/* Image */}
                  <Grid size={{ xs: 12, md: 6 }} sx={{ 
                    display: 'flex', 
                    justifyContent: { xs: 'center', md: idx % 2 === 0 ? 'flex-start' : 'flex-end' }, 
                    alignItems: 'center', 
                    minHeight: 180,
                    ml: { md: idx % 2 === 0 ? 4 : 0 },
                    mr: { md: idx % 2 !== 0 ? 4 : 0 },
                  }}>
                    <Box component="img" src={step.img} alt={step.title} sx={{ width: '100%', maxWidth: 420, borderRadius: 3, boxShadow: 2 }} />
                  </Grid>
                </Grid>
              </Box>
            ))}
          </Box>
        </Container>
      </Box>

      {/* New Section: "Our Bank & NBFC Partners" - Infinite Carousel */}
      <Box sx={{ py: { xs: 4, md: 8 }, backgroundColor: 'background.default' }}>
        <Container maxWidth="lg">
          <Typography variant="h4" component="h2" textAlign="center" gutterBottom sx={{ fontWeight: 'bold', mb: {xs: 3, md: 5} }}>
            Our Bank & NBFC Partners
          </Typography>
          {/* Carousel Container */}
          <Box
            sx={{
              overflow: 'hidden',
              width: '100%',
              position: 'relative',
              py: 2,
            }}
          >
            {/* Carousel Track */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: { xs: 4, sm: 6, md: 8 },
                animation: 'scrollLeft 30s linear infinite',
                // Duplicate the list for seamless looping
                '@keyframes scrollLeft': {
                  '0%': { transform: 'translateX(0)' },
                  '100%': { transform: 'translateX(-50%)' },
                },
                width: 'max-content',
              }}
            >
              {/* Partner Logos - Duplicated for infinite effect */}
              {[
                { src: '/axis-bank-seeklogo.png', alt: 'Axis Bank' },
                { src: '/hdfc-bank-seeklogo.png', alt: 'HDFC Bank' },
                { src: '/icici-bank-seeklogo.png', alt: 'ICICI Bank' },
                { src: '/idfc-first-bank-seeklogo.png', alt: 'IDFC First Bank' },
                { src: '/indian-bank-1907-seeklogo.png', alt: 'Indian Bank' },
                { src: '/kotak-mahindra-bank-seeklogo.png', alt: 'Kotak Mahindra Bank' },
                { src: '/sbi-state-bank-of-india-seeklogo.png', alt: 'SBI' },
                { src: '/yes-bank-seeklogo.png', alt: 'Yes Bank' },
                // Add more as needed
              ].concat([
                { src: '/axis-bank-seeklogo.png', alt: 'Axis Bank' },
                { src: '/hdfc-bank-seeklogo.png', alt: 'HDFC Bank' },
                { src: '/icici-bank-seeklogo.png', alt: 'ICICI Bank' },
                { src: '/idfc-first-bank-seeklogo.png', alt: 'IDFC First Bank' },
                { src: '/indian-bank-1907-seeklogo.png', alt: 'Indian Bank' },
                { src: '/kotak-mahindra-bank-seeklogo.png', alt: 'Kotak Mahindra Bank' },
                { src: '/sbi-state-bank-of-india-seeklogo.png', alt: 'SBI' },
                { src: '/yes-bank-seeklogo.png', alt: 'Yes Bank' },
              ]) // duplicate for seamless loop
                .map((partner, idx) => (
                  <Box key={idx} sx={{ minWidth: { xs: 100, sm: 120, md: 140 }, mx: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Box
                      component="img"
                      src={partner.src}
                      alt={partner.alt}
                      sx={{
                        height: { xs: 40, sm: 50, md: 60 },
                        width: 'auto',
                        objectFit: 'contain',
                        mb: 1,
                        filter: 'drop-shadow(0 2px 6px rgba(0,0,0,0.08))',
                        background: '#fff',
                        borderRadius: 2,
                        p: 1,
                        boxShadow: 1,
                      }}
                    />
                    <Typography variant="caption" sx={{ textAlign: 'center', color: 'text.secondary' }}>{partner.alt}</Typography>
                  </Box>
                ))}
            </Box>
          </Box>
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
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={item}>
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
