'use client';

import { Container, Typography, Box, Divider, Card, CardContent, Chip, Grid, Alert, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import { Announcement, Info, Warning, CheckCircle, Phone, Email, AccessTime } from '@mui/icons-material';
import { useState, useEffect } from 'react';

export default function ImportantUpdatePage() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const updates = [
    {
      id: 1,
      date: "December 15, 2024",
      title: "Enhanced Loan Processing System",
      content: "We have upgraded our loan processing system to provide faster approvals and better user experience. Personal loans can now be approved within 15 minutes, and business loans within 24 hours. The new system includes improved document verification and real-time status updates.",
      type: "announcement",
      priority: "high",
      category: "System Update"
    },
    {
      id: 2,
      date: "December 10, 2024",
      title: "New Interest Rate Structure",
      content: "We are pleased to announce our new competitive interest rates starting from 9.99% for personal loans and 10.99% for business loans. These rates are available for customers with excellent credit scores and membership card holders.",
      type: "announcement",
      priority: "medium",
      category: "Rate Update"
    },
    {
      id: 3,
      date: "December 5, 2024",
      title: "Holiday Season Service Hours",
      content: "During the holiday season (December 20, 2024 - January 2, 2025), our customer support will be available with reduced hours. Phone support: 10 AM - 4 PM, Email support: 24/7. Emergency loan processing will continue as usual.",
      type: "notice",
      priority: "medium",
      category: "Service Update"
    },
    {
      id: 4,
      date: "November 28, 2024",
      title: "New Bank Partner Added",
      content: "We are excited to announce our partnership with State Bank of India (SBI) for business loans. This partnership allows us to offer competitive rates and faster processing for business loan applications up to ₹2 crores.",
      type: "announcement",
      priority: "high",
      category: "Partnership"
    },
    {
      id: 5,
      date: "November 20, 2024",
      title: "Document Upload Enhancement",
      content: "We have improved our document upload system with better file compression and faster processing. You can now upload documents up to 10MB in size, and the system supports additional formats including HEIC images from mobile devices.",
      type: "feature",
      priority: "low",
      category: "Feature Update"
    }
  ];

  const serviceHours = [
    { day: "Monday - Friday", hours: "9:00 AM - 6:00 PM" },
    { day: "Saturday", hours: "10:00 AM - 4:00 PM" },
    { day: "Sunday", hours: "Closed" },
    { day: "Emergency Support", hours: "24/7 (Phone only)" }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'error';
      case 'medium': return 'warning';
      case 'low': return 'success';
      default: return 'default';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'announcement': return <Announcement color="primary" />;
      case 'notice': return <Info color="info" />;
      case 'feature': return <CheckCircle color="success" />;
      case 'warning': return <Warning color="warning" />;
      default: return <Info color="action" />;
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 4, md: 8 } }}>
      {/* Header Section */}
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold', mb: 2 }}>
          Important Updates & Notices
        </Typography>
        <Typography variant="h6" component="p" gutterBottom sx={{ color: 'text.secondary', mb: 3 }}>
          Stay informed about the latest updates, service changes, and important announcements from Blumiq.
        </Typography>
        <Alert severity="info" sx={{ maxWidth: 600, mx: 'auto' }}>
          <Typography variant="body2">
            <strong>Current Time:</strong> {currentTime.toLocaleString('en-IN', { 
              timeZone: 'Asia/Kolkata',
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit'
            })}
          </Typography>
        </Alert>
      </Box>

      <Grid container spacing={4}>
        {/* Updates Section */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
            <Announcement color="primary" />
            Latest Updates
          </Typography>
          
          {updates.length > 0 ? (
            <Box>
              {updates.map((update) => (
                <Card 
                  key={update.id} 
                  elevation={2} 
                  sx={{ 
                    mb: 3, 
                    borderRadius: 2,
                    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                    borderLeft: `4px solid ${
                      update.priority === 'high' ? '#f44336' : 
                      update.priority === 'medium' ? '#ff9800' : '#4caf50'
                    }`
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {getTypeIcon(update.type)}
                        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                          {update.title}
                        </Typography>
                      </Box>
                      <Chip 
                        label={update.priority.toUpperCase()} 
                        color={getPriorityColor(update.priority) as 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning'}
                        size="small"
                      />
                    </Box>
                    
                    <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                      <Chip 
                        label={update.category} 
                        variant="outlined" 
                        size="small"
                      />
                      <Typography 
                        variant="caption" 
                        color="text.secondary"
                        sx={{ alignSelf: 'center' }}
                      >
                        Posted on: {update.date}
                      </Typography>
                    </Box>
                    
                    <Divider sx={{ my: 2 }} />
                    
                    <Typography 
                      variant="body1" 
                      sx={{ 
                        lineHeight: 1.75,
                        color: 'text.primary'
                      }}
                    >
                      {update.content}
                    </Typography>
                  </CardContent>
                </Card>
              ))}
            </Box>
          ) : (
            <Card elevation={1} sx={{ p: 4, textAlign: 'center', backgroundColor: 'grey.50' }}>
              <Typography variant="h6" component="p" sx={{ fontWeight: 'normal' }}>
                No important updates at this time. Please check back later.
              </Typography>
            </Card>
          )}
        </Grid>

        {/* Sidebar Information */}
        <Grid size={{ xs: 12, md: 4 }}>
          {/* Service Hours */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                <AccessTime color="primary" />
                Service Hours
              </Typography>
              <List dense>
                {serviceHours.map((schedule, index) => (
                  <ListItem key={index} disablePadding>
                    <ListItemText 
                      primary={schedule.day}
                      secondary={schedule.hours}
                      primaryTypographyProps={{ variant: 'body2', fontWeight: 'medium' }}
                      secondaryTypographyProps={{ variant: 'body2', color: 'text.secondary' }}
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                <Phone color="primary" />
                Contact Information
              </Typography>
              <List dense>
                <ListItem disablePadding>
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <Phone color="action" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Phone Support"
                    secondary="+91-70263-73808"
                    primaryTypographyProps={{ variant: 'body2', fontWeight: 'medium' }}
                    secondaryTypographyProps={{ variant: 'body2', color: 'text.secondary' }}
                  />
                </ListItem>
                <ListItem disablePadding>
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <Email color="action" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Email Support"
                    secondary="info@Blumiq.com"
                    primaryTypographyProps={{ variant: 'body2', fontWeight: 'medium' }}
                    secondaryTypographyProps={{ variant: 'body2', color: 'text.secondary' }}
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>

          {/* Quick Links */}
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3 }}>
                Quick Links
              </Typography>
              <List dense>
                <ListItem disablePadding>
                  <ListItemText 
                    primary="Apply for Personal Loan"
                    primaryTypographyProps={{ variant: 'body2', color: 'primary.main' }}
                    sx={{ cursor: 'pointer' }}
                    onClick={() => window.location.href = '/digital/personalLoan'}
                  />
                </ListItem>
                <ListItem disablePadding>
                  <ListItemText 
                    primary="Apply for Business Loan"
                    primaryTypographyProps={{ variant: 'body2', color: 'primary.main' }}
                    sx={{ cursor: 'pointer' }}
                    onClick={() => window.location.href = '/digital/businessLoan'}
                  />
                </ListItem>
                <ListItem disablePadding>
                  <ListItemText 
                    primary="Raise a Request"
                    primaryTypographyProps={{ variant: 'body2', color: 'primary.main' }}
                    sx={{ cursor: 'pointer' }}
                    onClick={() => window.location.href = '/raise-request'}
                  />
                </ListItem>
                <ListItem disablePadding>
                  <ListItemText 
                    primary="View FAQs"
                    primaryTypographyProps={{ variant: 'body2', color: 'primary.main' }}
                    sx={{ cursor: 'pointer' }}
                    onClick={() => window.location.href = '/faqs'}
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}
