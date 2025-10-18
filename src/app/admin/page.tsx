'use client';

import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Grid, Card, CardContent, List, ListItem, ListItemText, ListItemIcon, Chip } from '@mui/material';
import { 
  People, 
  Description, 
  CardMembership, 
  TrendingUp, 
  AccessTime
} from '@mui/icons-material';
import StatsCard from '@/components/Admin/StatsCard';
import LoadingSpinner from '@/components/Common/LoadingSpinner';

interface DashboardStats {
  totalUsers: number;
  pendingApplications: number;
  activeMemberships: number;
  monthlyRevenue: number;
  userGrowth: number;
  approvalRate: number;
  recentActivities: Array<{
    id: string;
    type: string;
    description: string;
    timestamp: string;
    status: string;
  }>;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      
      const response = await fetch('/api/admin/dashboard/stats', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminAccessToken')}`,
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      } else {
        throw 'Failed to fetch dashboard stats';
      }
    } catch (err) {
      console.error('Dashboard stats fetch error:', err);
      setError(typeof err === 'string' ? err : 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'user_registration':
        return <People />;
      case 'loan_application':
        return <Description />;
      case 'membership_purchase':
        return <CardMembership />;
      default:
        return <TrendingUp />;
    }
  };

  const getActivityColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'success';
      case 'pending':
        return 'warning';
      case 'error':
        return 'error';
      default:
        return 'default';
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <LoadingSpinner />
      </Container>
    );
  }

  if (error || !stats) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h6" color="error">
          {error || 'Failed to load dashboard data'}
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 4 }}>
        Admin Dashboard
      </Typography>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatsCard
            title="Total Users"
            value={stats.totalUsers.toLocaleString()}
            subtitle="Registered users"
            icon={<People />}
            trend={{ value: stats.userGrowth, isPositive: stats.userGrowth > 0 }}
            color="primary"
          />
        </Grid>
        
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatsCard
            title="Pending Applications"
            value={stats.pendingApplications}
            subtitle="Awaiting review"
            icon={<AccessTime />}
            color="warning"
          />
        </Grid>
        
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatsCard
            title="Active Memberships"
            value={stats.activeMemberships}
            subtitle="Current members"
            icon={<CardMembership />}
            color="success"
          />
        </Grid>
        
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatsCard
            title="Monthly Revenue"
            value={formatCurrency(stats.monthlyRevenue)}
            subtitle="This month"
            icon={<TrendingUp />}
            color="info"
          />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Left Column */}
        <Grid size={{ xs: 12, lg: 8 }}>
          {/* Quick Actions */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3 }}>
                Quick Actions
              </Typography>
              
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                  <Card sx={{ p: 2, textAlign: 'center', cursor: 'pointer', '&:hover': { backgroundColor: 'primary.light' } }}>
                    <Description sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                      Review Applications
                    </Typography>
                  </Card>
                </Grid>
                
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                  <Card sx={{ p: 2, textAlign: 'center', cursor: 'pointer', '&:hover': { backgroundColor: 'success.light' } }}>
                    <People sx={{ fontSize: 40, color: 'success.main', mb: 1 }} />
                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                      Manage Users
                    </Typography>
                  </Card>
                </Grid>
                
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                  <Card sx={{ p: 2, textAlign: 'center', cursor: 'pointer', '&:hover': { backgroundColor: 'info.light' } }}>
                    <CardMembership sx={{ fontSize: 40, color: 'info.main', mb: 1 }} />
                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                      View Memberships
                    </Typography>
                  </Card>
                </Grid>
                
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                  <Card sx={{ p: 2, textAlign: 'center', cursor: 'pointer', '&:hover': { backgroundColor: 'warning.light' } }}>
                    <TrendingUp sx={{ fontSize: 40, color: 'warning.main', mb: 1 }} />
                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                      View Reports
                    </Typography>
                  </Card>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* Performance Metrics */}
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3 }}>
                Performance Metrics
              </Typography>
              
              <Grid container spacing={3}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box sx={{ textAlign: 'center', p: 2 }}>
                    <Typography variant="h3" sx={{ fontWeight: 'bold', color: 'success.main', mb: 1 }}>
                      {stats.approvalRate}%
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      Loan Approval Rate
                    </Typography>
                  </Box>
                </Grid>
                
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box sx={{ textAlign: 'center', p: 2 }}>
                    <Typography variant="h3" sx={{ fontWeight: 'bold', color: 'primary.main', mb: 1 }}>
                      {stats.userGrowth > 0 ? '+' : ''}{stats.userGrowth}%
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      User Growth (30 days)
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Right Column */}
        <Grid size={{ xs: 12, lg: 4 }}>
          {/* Recent Activities */}
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3 }}>
                Recent Activities
              </Typography>
              
              <List>
                {stats.recentActivities.map((activity) => (
                  <ListItem key={activity.id} sx={{ px: 0 }}>
                    <ListItemIcon>
                      {getActivityIcon(activity.type)}
                    </ListItemIcon>
                    <ListItemText
                      primary={activity.description}
                      secondary={new Date(activity.timestamp).toLocaleString()}
                    />
                    <Chip
                      label={activity.status}
                      color={getActivityColor(activity.status) as 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning'}
                      size="small"
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}
