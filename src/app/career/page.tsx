'use client';

import { Container, Typography, Box, Grid, Paper, ListItemIcon, ListItemText, Button, Link as MuiLink } from '@mui/material';
import CheckCircleOutline from '@mui/icons-material/CheckCircleOutline'; // Or other relevant icons

export default function CareerPage() {
  const benefits = [
    "Competitive salary and benefits package",
    "Opportunities for professional growth and development",
    "A dynamic, innovative, and supportive work environment",
    "Commitment to work-life balance",
    "Be part of a team transforming financial services"
  ];

  // Placeholder job openings - set to empty array to show "no openings" message
  const jobOpenings: {title: string, description: string, link?: string}[] = [
    // Example of how to add jobs:
    // { title: "Senior Software Engineer", description: "Join our tech team to build cutting-edge financial solutions. We are looking for experienced engineers proficient in modern web technologies.", link: "#" },
    // { title: "Product Manager - Loans", description: "Define and drive the product strategy for our loan offerings. You will work closely with engineering, design, and marketing teams.", link: "#" },
  ];

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 4, md: 8 } }}>
      <Typography variant="h3" component="h1" textAlign="center" gutterBottom sx={{ fontWeight: 'bold', mb: {xs:3, sm:4, md:5} }}>
        Careers at Rupeekx Clone
      </Typography>
      
      <Paper elevation={0} sx={{ p: {xs: 2, sm: 3, md:4}, backgroundColor: 'alternate.main', borderRadius: 2, mb: {xs:4, sm:5, md:6} }}>
        <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 'medium', color: 'primary.main' }}>
          Join Our Mission
        </Typography>
        <Typography variant="body1" paragraph sx={{ lineHeight: 1.75, fontSize: '1.1rem' }}>
          At Rupeekx Clone, we are dedicated to simplifying access to financial services through innovative technology and customer-centric solutions. We are passionate about building a platform that empowers individuals and businesses. If you are driven, talented, and eager to make an impact, we invite you to explore a career with us.
        </Typography>
      </Paper>

      <Box sx={{ mb: {xs:4, sm:5, md:6} }}>
        <Typography variant="h4" component="h2" textAlign="center" gutterBottom sx={{ fontWeight: 'bold', mb: {xs:3, sm:4} }}>
          Why Work With Us?
        </Typography>
        <Grid container spacing={3} justifyContent="center"> {/* Increased spacing */}
            {benefits.map((benefit, index) => (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={index}>
                <Paper elevation={2} sx={{p:2.5, display: 'flex', alignItems: 'center', height: '100%', borderRadius: '8px' }}> {/* Slightly more padding and rounded corners */}
                    <ListItemIcon sx={{minWidth: 38, color: 'primary.dark'}}> {/* Adjusted icon size and color */}
                        <CheckCircleOutline fontSize="medium" />
                    </ListItemIcon>
                    <ListItemText primary={benefit} primaryTypographyProps={{variant: 'body1'}} />
                </Paper>
            </Grid>
            ))}
        </Grid>
      </Box>

      <Box>
        <Typography variant="h4" component="h2" textAlign="center" gutterBottom sx={{ fontWeight: 'bold', mb: 4 }}>
          Current Openings
        </Typography>
        {jobOpenings.length > 0 ? (
          <Grid container spacing={3}>
            {jobOpenings.map((job, index) => (
              <Grid size={{ xs: 12, md: 6 }} key={index}>
                <Paper elevation={3} sx={{ p: 3, borderRadius: 2, height: '100%', display: 'flex', flexDirection: 'column', transition: 'box-shadow 0.3s', '&:hover': {boxShadow: 6} }}>
                  <Typography variant="h6" component="h3" gutterBottom sx={{ fontWeight: 'medium' }}>
                    {job.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph sx={{flexGrow: 1}}>
                    {job.description}
                  </Typography>
                  <Button variant="contained" component="a" href={job.link || "#"} sx={{ mt: 'auto', alignSelf: 'flex-start' }}> 
                    Learn More & Apply
                  </Button>
                </Paper>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Paper elevation={1} sx={{p:{xs:2, sm:3, md:4}, textAlign: 'center', backgroundColor: 'alternate.light', borderRadius: 2}}>
            <Typography variant="h6" component="p" gutterBottom sx={{fontWeight: 'medium'}}>
              We are constantly growing!
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              While we don&apos;t have specific openings listed right now, we are always interested in hearing from passionate and talented individuals.
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Feel free to send your resume and a cover letter to{' '}
              <MuiLink href="mailto:careers@example.com" sx={{fontWeight:'medium'}}>careers@example.com</MuiLink>.
            </Typography>
          </Paper>
        )}
      </Box>
    </Container>
  );
}
