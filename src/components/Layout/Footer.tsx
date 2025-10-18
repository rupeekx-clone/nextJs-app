'use client';

import React, { useState } from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  Link,
  IconButton,
  TextField,
  Button,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Paper,
  Chip,
} from '@mui/material';
import {
  Facebook,
  Twitter,
  Instagram,
  LinkedIn,
  YouTube,
  Email,
  Phone,
  LocationOn,
  AccessTime,
  Security,
  Verified,
  TrendingUp,
  Send,
  ArrowUpward,
} from '@mui/icons-material';

const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      // Handle newsletter subscription
      console.log('Newsletter subscription:', email);
      setIsSubscribed(true);
      setEmail('');
      setTimeout(() => setIsSubscribed(false), 3000);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const footerSections = [
    {
      title: 'Company',
      links: [
        { label: 'About Us', href: '/company' },
        { label: 'Our Mission', href: '/company#mission' },
        { label: 'Our Vision', href: '/company#vision' },
        { label: 'Our Values', href: '/company#values' },
        { label: 'Contact Us', href: '/contact' },
      ],
    },
    {
      title: 'Products',
      links: [
        { label: 'Silver Membership Card', href: '/products/silver-membership-card' },
        { label: 'Gold Membership Card', href: '/products/gold-membership-card' },
        { label: 'Cash Lending Subscription', href: '/products/cashlending-subscription' },
      ],
    },
    {
      title: 'Services',
      links: [
        { label: 'Personal Loan', href: '/digital/personalLoan' },
        { label: 'Business Loan', href: '/digital/businessLoan' },
        { label: 'Subscription Plan', href: '/subscription/cashlending' },
        { label: 'Document Upload', href: '/dashboard/documents' },
      ],
    },
    {
      title: 'Support',
      links: [
        { label: 'FAQs', href: '/faqs' },
        { label: 'Raise Request', href: '/raise-request' },
        { label: 'Important Updates', href: '/important-update' },
        { label: 'Help Center', href: '/contact' },
      ],
    },
    {
      title: 'Legal',
      links: [
        { label: 'Privacy Policy', href: '/privacy-policy' },
        { label: 'Terms & Conditions', href: '/terms-conditions' },
        { label: 'Disclaimer', href: '/disclaimer' },
        { label: 'Refund Policy', href: '/refund-policy' },
      ],
    },
  ];

  const socialLinks = [
    { icon: <Facebook />, href: '#', label: 'Facebook' },
    { icon: <Twitter />, href: '#', label: 'Twitter' },
    { icon: <Instagram />, href: '#', label: 'Instagram' },
    { icon: <LinkedIn />, href: '#', label: 'LinkedIn' },
    { icon: <YouTube />, href: '#', label: 'YouTube' },
  ];

  const trustBadges = [
    { icon: <Security />, label: 'Bank-Level Security' },
    { icon: <Verified />, label: 'Verified Partner' },
    { icon: <TrendingUp />, label: 'Trusted by 10K+ Users' },
  ];

  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: 'grey.900',
        color: 'white',
        mt: 'auto',
        position: 'relative',
      }}
    >
      {/* Main Footer Content */}
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Grid container spacing={4}>
          {/* Company Info */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <Box 
                  component="img"
                  src="/logo.svg"
                  alt="Blumiq"
                  sx={{ height: 36, width: 'auto' }}
                />
                <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'primary.light' }}>
                  Blumiq
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ mb: 3, lineHeight: 1.6, color: 'grey.300' }}>
                Your trusted partner for instant personal and business loans. We connect you with 
                the best lending partners to fulfill your financial needs with speed, security, and transparency.
              </Typography>
              
              {/* Trust Badges */}
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
                {trustBadges.map((badge, index) => (
                  <Chip
                    key={index}
                    icon={badge.icon}
                    label={badge.label}
                    size="small"
                    sx={{
                      backgroundColor: 'grey.800',
                      color: 'white',
                      '& .MuiChip-icon': {
                        color: 'primary.light',
                      },
                    }}
                  />
                ))}
              </Box>
            </Box>

            {/* Contact Info */}
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                Contact Information
              </Typography>
              <List dense>
                <ListItem sx={{ px: 0 }}>
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <Phone sx={{ color: 'primary.light' }} />
                  </ListItemIcon>
                  <ListItemText
                    primary="+91-70263-73808"
                    primaryTypographyProps={{ color: 'grey.300' }}
                  />
                </ListItem>
                <ListItem sx={{ px: 0 }}>
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <Email sx={{ color: 'primary.light' }} />
                  </ListItemIcon>
                  <ListItemText
                    primary="info@blumiq.com"
                    primaryTypographyProps={{ color: 'grey.300' }}
                  />
                </ListItem>
                <ListItem sx={{ px: 0 }}>
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <LocationOn sx={{ color: 'primary.light' }} />
                  </ListItemIcon>
                  <ListItemText
                    primary="44, 3rd Floor, Vijayraj Society, Near Akshar Family Wear, Singanpore Causeway Road, Katargam, Surat, Gujarat, India - 395004"
                    primaryTypographyProps={{ color: 'grey.300', fontSize: '0.875rem' }}
                  />
                </ListItem>
                <ListItem sx={{ px: 0 }}>
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <AccessTime sx={{ color: 'primary.light' }} />
                  </ListItemIcon>
                  <ListItemText
                    primary="Mon-Fri: 9AM-6PM"
                    primaryTypographyProps={{ color: 'grey.300' }}
                  />
                </ListItem>
              </List>
            </Box>
          </Grid>

          {/* Footer Links */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Grid container spacing={3}>
              {footerSections.map((section, index) => (
                <Grid key={index} size={{ xs: 6, sm: 4 }}>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, color: 'primary.light' }}>
                    {section.title}
                  </Typography>
                  <List dense>
                    {section.links.map((link, linkIndex) => (
                      <ListItem key={linkIndex} sx={{ px: 0 }}>
                        <Link
                          href={link.href}
                          sx={{
                            color: 'grey.300',
                            textDecoration: 'none',
                            fontSize: '0.875rem',
                            '&:hover': {
                              color: 'primary.light',
                              textDecoration: 'underline',
                            },
                          }}
                        >
                          {link.label}
                        </Link>
                      </ListItem>
                    ))}
                  </List>
                </Grid>
              ))}
            </Grid>
          </Grid>

          {/* Newsletter Subscription */}
          <Grid size={{ xs: 12, md: 2 }}>
            <Paper
              sx={{
                p: 3,
                backgroundColor: 'grey.800',
                border: '1px solid',
                borderColor: 'grey.700',
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, color: 'primary.light' }}>
                Newsletter
              </Typography>
              <Typography variant="body2" sx={{ mb: 2, color: 'grey.300' }}>
                Stay updated with our latest offers and financial tips.
              </Typography>
              
              <Box component="form" onSubmit={handleSubscribe}>
                <TextField
                  fullWidth
                  size="small"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  required
                  sx={{
                    mb: 2,
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: 'grey.900',
                      '& fieldset': {
                        borderColor: 'grey.600',
                      },
                      '&:hover fieldset': {
                        borderColor: 'primary.light',
                      },
                    },
                  }}
                />
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  endIcon={<Send />}
                  sx={{
                    textTransform: 'none',
                    backgroundColor: 'primary.main',
                    '&:hover': {
                      backgroundColor: 'primary.dark',
                    },
                  }}
                >
                  Subscribe
                </Button>
              </Box>
              
              {isSubscribed && (
                <Typography variant="body2" sx={{ mt: 1, color: 'success.light' }}>
                  Thank you for subscribing!
                </Typography>
              )}
            </Paper>
          </Grid>
        </Grid>
      </Container>

      <Divider sx={{ borderColor: 'grey.700' }} />

      {/* Bottom Footer */}
      <Container maxWidth="lg" sx={{ py: 3 }}>
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 2
        }}>
          {/* Copyright */}
          <Typography variant="body2" sx={{ color: 'grey.400' }}>
            © {new Date().getFullYear()} Blumiq. All rights reserved.
          </Typography>

          {/* Social Links */}
          <Box sx={{ display: 'flex', gap: 1 }}>
            {socialLinks.map((social, index) => (
              <IconButton
                key={index}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  color: 'grey.400',
                  '&:hover': {
                    color: 'primary.light',
                    backgroundColor: 'grey.800',
                  },
                }}
                aria-label={social.label}
              >
                {social.icon}
              </IconButton>
            ))}
          </Box>

          {/* Back to Top */}
          <IconButton
            onClick={scrollToTop}
            sx={{
              color: 'grey.400',
              '&:hover': {
                color: 'primary.light',
                backgroundColor: 'grey.800',
              },
            }}
            aria-label="Back to top"
          >
            <ArrowUpward />
          </IconButton>
        </Box>
      </Container>

      {/* Security Notice */}
      <Box
        sx={{
          backgroundColor: 'grey.800',
          py: 2,
          borderTop: '1px solid',
          borderColor: 'grey.700',
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center',
            gap: 2,
            flexWrap: 'wrap'
          }}>
            <Security sx={{ color: 'primary.light', fontSize: 20 }} />
            <Typography variant="body2" sx={{ color: 'grey.400', textAlign: 'center' }}>
              Your data is protected with bank-level security. We are committed to keeping your information safe and secure.
            </Typography>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default Footer;