'use client';

import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Grid, Card, CardContent, Alert, Chip, Button } from '@mui/material';
import { Person, TrendingUp, AccessTime, AccountBalance, Notifications, Share, Download } from '@mui/icons-material';
import ApplicationCard from '@/components/Dashboard/ApplicationCard';
import MembershipStatus from '@/components/Dashboard/MembershipStatus';
import QuickActions from '@/components/Dashboard/QuickActions';
import LoadingSpinner from '@/components/Common/LoadingSpinner';
import { useRouter } from 'next/navigation';

interface UserProfile {
  user_id: string;
  full_name: string;
  email: string;
  phone_number: string;
  user_type: string;
  created_at: string;
}

interface Membership {
  membership_card_id: string;
  card_type_name: string;
  purchase_date: string;
  expiry_date: string;
  status: string;
  benefits: string[];
}

interface LoanApplication {
  application_id: string;
  loan_type: 'personal' | 'business';
  amount_requested: number;
  amount_approved?: number;
  status: string;
  application_date: string;
  bank_partner?: string;
  interest_rate?: number;
  tenure_months?: number;
  processing_fee?: number;
}

interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  date: string;
  read: boolean;
}

export default function DashboardPage() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [membership, setMembership] = useState<Membership | null>(null);
  const [applications, setApplications] = useState<LoanApplication[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch user profile
      const profileResponse = await fetch('/api/users/profile', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });
      
      if (!profileResponse.ok) {
        throw new Error('Failed to fetch user profile');
      }
      
      const profileData = await profileResponse.json();
      setUser(profileData);

      // Fetch membership
      try {
        const membershipResponse = await fetch('/api/memberships/me', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
          },
        });
        
        if (membershipResponse.ok) {
          const membershipData = await membershipResponse.json();
          setMembership(membershipData);
        }
      } catch {
        // Membership not found is okay
        console.log('No active membership found');
      }

      // Fetch loan applications
      const applicationsResponse = await fetch('/api/loans', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });
      
      if (applicationsResponse.ok) {
        const applicationsData = await applicationsResponse.json();
        setApplications(applicationsData.data || []);
      }

      // Mock notifications for now - in real app, fetch from API
      setNotifications([
        {
          id: '1',
          type: 'success',
          title: 'Loan Application Approved',
          message: 'Your personal loan application has been approved for ₹5,00,000',
          date: new Date().toISOString(),
          read: false
        },
        {
          id: '2',
          type: 'info',
          title: 'Document Required',
          message: 'Please upload your latest bank statement for verification',
          date: new Date(Date.now() - 86400000).toISOString(),
          read: true
        }
      ]);

    } catch (err) {
      console.error('Dashboard data fetch error:', err);
      setError(err instanceof Error ? err.message : 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleApplyLoan = () => {
    router.push('/digital/personalLoan');
  };

  const handleUploadDocuments = () => {
    router.push('/dashboard/documents');
  };

  const handleViewApplications = () => {
    // Scroll to applications section
    const element = document.getElementById('applications-section');
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleViewDocuments = () => {
    router.push('/dashboard/documents');
  };

  const handleViewMembership = () => {
    if (membership) {
      router.push('/products/silver-membership-card');
    } else {
      router.push('/products/silver-membership-card');
    }
  };

  const handleContactSupport = () => {
    router.push('/contact');
  };

  const handleApplicationClick = (applicationId: string) => {
    router.push(`/dashboard/loans/${applicationId}`);
  };

  const handleReferralShare = () => {
    const referralLink = `${window.location.origin}/customer?ref=${user?.user_id}`;
    navigator.clipboard.writeText(referralLink);
    // Show success message
  };

  const handleDownloadStatement = () => {
    // Generate and download account statement
    console.log('Downloading account statement...');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'success';
      case 'rejected': return 'error';
      case 'under_review': return 'warning';
      case 'submitted': return 'info';
      default: return 'default';
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <LoadingSpinner />
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Welcome Section */}
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
            Welcome back, {user?.full_name}!
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Here&apos;s an overview of your account and recent activities.
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="outlined"
            startIcon={<Share />}
            onClick={handleReferralShare}
            size="small"
          >
            Share Referral
          </Button>
          <Button
            variant="outlined"
            startIcon={<Download />}
            onClick={handleDownloadStatement}
            size="small"
          >
            Download Statement
          </Button>
        </Box>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card>
            <CardContent sx={{ display: 'flex', alignItems: 'center' }}>
              <Person sx={{ fontSize: 40, mr: 2, color: 'primary.main' }} />
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  {user?.user_type === 'customer' ? 'Standard' : 'Premium'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Account Type
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card>
            <CardContent sx={{ display: 'flex', alignItems: 'center' }}>
              <TrendingUp sx={{ fontSize: 40, mr: 2, color: 'success.main' }} />
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  {applications.length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Applications
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card>
            <CardContent sx={{ display: 'flex', alignItems: 'center' }}>
              <AccessTime sx={{ fontSize: 40, mr: 2, color: 'warning.main' }} />
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  {applications.filter(app => app.status === 'under_review').length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Pending Review
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card>
            <CardContent sx={{ display: 'flex', alignItems: 'center' }}>
              <AccountBalance sx={{ fontSize: 40, mr: 2, color: 'info.main' }} />
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  {applications.filter(app => app.status === 'approved').length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Approved Loans
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Left Column */}
        <Grid size={{ xs: 12, lg: 8 }}>
          {/* Quick Actions */}
          <Box sx={{ mb: 4 }}>
            <QuickActions
              onApplyLoan={handleApplyLoan}
              onUploadDocuments={handleUploadDocuments}
              onContactSupport={handleContactSupport}
              onViewMembership={handleViewMembership}
              onViewApplications={handleViewApplications}
              onViewDocuments={handleViewDocuments}
            />
          </Box>

          {/* Recent Applications */}
          <Box id="applications-section">
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3 }}>
              Recent Applications
            </Typography>
            
            {applications.length === 0 ? (
              <Card>
                <CardContent sx={{ textAlign: 'center', py: 4 }}>
                  <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                    You haven&apos;t applied for any loans yet.
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Start by applying for a personal or business loan to get the funds you need.
                  </Typography>
                </CardContent>
              </Card>
            ) : (
              <Grid container spacing={2}>
                {applications.slice(0, 4).map((application) => (
                  <Grid size={{ xs: 12, sm: 6 }} key={application.application_id}>
                    <ApplicationCard
                      application={application}
                      onClick={() => handleApplicationClick(application.application_id)}
                    />
                  </Grid>
                ))}
              </Grid>
            )}
          </Box>
        </Grid>

        {/* Right Column */}
        <Grid size={{ xs: 12, lg: 4 }}>
          {/* Membership Status */}
          {membership ? (
            <Box sx={{ mb: 3 }}>
              <MembershipStatus membership={membership} />
            </Box>
          ) : (
            <Card sx={{ mb: 3 }}>
              <CardContent sx={{ textAlign: 'center', py: 4 }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                  No Active Membership
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  Get a membership card to enjoy faster loan processing and exclusive benefits.
                </Typography>
                <Typography variant="body2" color="primary.main">
                  View Membership Options
                </Typography>
              </CardContent>
            </Card>
          )}

          {/* Notifications */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Notifications sx={{ mr: 1 }} />
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  Notifications
                </Typography>
                {notifications.filter(n => !n.read).length > 0 && (
                  <Chip 
                    label={notifications.filter(n => !n.read).length} 
                    size="small" 
                    color="primary" 
                    sx={{ ml: 1 }}
                  />
                )}
              </Box>
              
              {notifications.length === 0 ? (
                <Typography variant="body2" color="text.secondary">
                  No notifications to show.
                </Typography>
              ) : (
                <Box>
                  {notifications.slice(0, 3).map((notification, index) => (
                    <Box key={notification.id} sx={{ mb: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                        <Box sx={{ 
                          width: 8, 
                          height: 8, 
                          borderRadius: '50%', 
                          bgcolor: notification.type === 'success' ? 'success.main' : 
                                  notification.type === 'error' ? 'error.main' :
                                  notification.type === 'warning' ? 'warning.main' : 'info.main',
                          mt: 0.5,
                          mr: 1,
                          opacity: notification.read ? 0.5 : 1
                        }} />
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="body2" sx={{ fontWeight: notification.read ? 'normal' : 'medium' }}>
                            {notification.title}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.875rem' }}>
                            {notification.message}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {new Date(notification.date).toLocaleDateString()}
                          </Typography>
                        </Box>
                      </Box>
                      {index < notifications.length - 1 && (
                        <Box sx={{ borderBottom: '1px solid', borderColor: 'divider', mt: 2 }} />
                      )}
                    </Box>
                  ))}
                </Box>
              )}
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3 }}>
                Recent Activity
              </Typography>
              
              {applications.length === 0 ? (
                <Typography variant="body2" color="text.secondary">
                  No recent activity to show.
                </Typography>
              ) : (
                <Box>
                  {applications.slice(0, 3).map((application, index) => (
                    <Box key={application.application_id} sx={{ mb: 2 }}>
                      <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                        {application.loan_type === 'personal' ? 'Personal' : 'Business'} Loan Application
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                        <Typography variant="body2" color="text.secondary">
                          Status:
                        </Typography>
                        <Chip 
                          label={application.status.replace('_', ' ')} 
                          size="small" 
                          color={getStatusColor(application.status) as 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning'}
                        />
                      </Box>
                      <Typography variant="caption" color="text.secondary">
                        {new Date(application.application_date).toLocaleDateString()}
                      </Typography>
                      {index < applications.length - 1 && (
                        <Box sx={{ borderBottom: '1px solid', borderColor: 'divider', mt: 2 }} />
                      )}
                    </Box>
                  ))}
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}
