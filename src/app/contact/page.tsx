'use client';

import { Container, Typography, Box, Card, CardContent } from '@mui/material';
import { Phone, Email, LocationOn } from '@mui/icons-material';
import ContactForm from '@/components/Forms/ContactForm';

export default function ContactPage() {
  return (
    <Container maxWidth="lg" sx={{ py: { xs: 4, md: 8 } }}>
      <Typography variant="h4" component="h1" gutterBottom textAlign="center" sx={{ fontWeight: 'bold' }}>
        Contact Us
      </Typography>
      <Typography variant="subtitle1" textAlign="center" color="text.secondary" paragraph sx={{ mb: { xs: 3, md: 5 }, maxWidth: '700px', mx: 'auto' }}>
        Have questions or feedback? Fill out the form below to get in touch with us.
      </Typography>

      <Box sx={{ display: 'flex', gap: 4, flexDirection: { xs: 'column', md: 'row' } }}>
        {/* Contact Information */}
        <Box sx={{ flex: { xs: 1, md: '0 0 300px' } }}>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
            Get in touch
          </Typography>
          
          <Card sx={{ mb: 2 }}>
            <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Phone sx={{ color: '#1976d2' }} />
              <Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                  Phone
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  +91-70263-73808
                </Typography>
              </Box>
            </CardContent>
          </Card>

          <Card sx={{ mb: 2 }}>
            <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Email sx={{ color: '#1976d2' }} />
              <Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                  Email
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  info@Blumiq.com
                </Typography>
              </Box>
            </CardContent>
          </Card>

          <Card sx={{ mb: 2 }}>
            <CardContent sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
              <LocationOn sx={{ color: '#1976d2', mt: 0.5 }} />
              <Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                  Registered Office
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  44, 3rd Floor, Vijayraj Society,<br />
                  Near Akshar Family Wear,<br />
                  Singanpore Causeway Road,<br />
                  Katargam, Surat, Gujarat, India - 395004
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Box>

        {/* Contact Form */}
        <Box sx={{ flex: 1 }}>
          <ContactForm />
        </Box>
      </Box>
    </Container>
  );
}
