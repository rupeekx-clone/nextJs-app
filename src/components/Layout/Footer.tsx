'use client';

import React from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  Link,
  IconButton,
} from '@mui/material';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import YouTubeIcon from '@mui/icons-material/YouTube';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = [
    { label: 'Important Update', href: '/important-update' },
    { label: 'Raise a Request', href: '/raise-request' },
    { label: 'Privacy Policy', href: '/privacy-policy' },
    { label: 'Terms & Conditions', href: '/terms-conditions' },
    { label: 'Disclaimer', href: '/disclaimer' },
    { label: 'Refund & Return Policy', href: '/refund-policy' },
  ];

  const socialLinks = [
    { icon: <FacebookIcon />, href: '#', label: 'Facebook' },
    { icon: <TwitterIcon />, href: '#', label: 'Twitter' },
    { icon: <InstagramIcon />, href: '#', label: 'Instagram' },
    { icon: <LinkedInIcon />, href: '#', label: 'LinkedIn' },
    { icon: <YouTubeIcon />, href: '#', label: 'YouTube' },
    { icon: <WhatsAppIcon />, href: '#', label: 'WhatsApp' },
  ];

  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: '#f5f5f5',
        borderTop: '1px solid #e0e0e0',
        mt: 'auto',
      }}
    >
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Grid container spacing={4}>
          {/* Company Info */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: '#1976d2' }}>
              RupeekX
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              India's most trustable loan consultant company, connecting customers with multiple banks and NBFCs for personal and business loans.
            </Typography>
            
            {/* Contact Info */}
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary">
                📞 +91-70263-73808
              </Typography>
              <Typography variant="body2" color="text.secondary">
                ✉️ info@rupeekx.com
              </Typography>
            </Box>

            {/* Address */}
            <Typography variant="body2" color="text.secondary">
              <strong>Registered Office:</strong><br />
              44, 3rd Floor, Vijayraj Society,<br />
              Near Akshar Family Wear,<br />
              Singanpore Causeway Road,<br />
              Katargam, Surat, Gujarat, India - 395004
            </Typography>
          </Grid>

          {/* Quick Links */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
              Quick Links
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {footerLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  color="text.secondary"
                  underline="hover"
                  sx={{ textDecoration: 'none' }}
                >
                  {link.label}
                </Link>
              ))}
            </Box>
          </Grid>

          {/* Social Media */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
              Stay Connected
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
              {socialLinks.map((social, index) => (
                <IconButton
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{
                    color: '#1976d2',
                    '&:hover': {
                      backgroundColor: 'rgba(25, 118, 210, 0.04)',
                    },
                  }}
                  aria-label={social.label}
                >
                  {social.icon}
                </IconButton>
              ))}
            </Box>

            {/* Membership Cards */}
            <Box sx={{ mt: 2 }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                <strong>Our Products:</strong>
              </Typography>
              <Typography variant="body2" color="text.secondary">
                • Silver Membership Card - Personal Loans up to ₹15 Lakhs
              </Typography>
              <Typography variant="body2" color="text.secondary">
                • Gold Membership Card - Business Loans up to ₹1 Crore
              </Typography>
            </Box>
          </Grid>
        </Grid>

        {/* Bottom Bar */}
        <Box
          sx={{
            borderTop: '1px solid #e0e0e0',
            mt: 3,
            pt: 2,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 1,
          }}
        >
          <Typography variant="body2" color="text.secondary">
            © {currentYear} RupeekX. All rights reserved.
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Powered by Ruby
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
