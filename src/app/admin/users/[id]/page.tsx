'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Container, Typography, Box, Grid, Card, CardContent, Button, Alert, Chip, List, ListItem, ListItemText, ListItemIcon, Tabs, Tab } from '@mui/material';
import { ArrowBack, Person, Email, Phone, LocationOn, CalendarToday, Security, Block, CheckCircle } from '@mui/icons-material';
import { useRouter, useParams } from 'next/navigation';
import StatusBadge from '@/components/Admin/StatusBadge';
import LoadingSpinner from '@/components/Common/LoadingSpinner';
import DataTable, { Column } from '@/components/Admin/DataTable';

interface User {
  _id: string;
  full_name: string;
  email: string;
  phone_number: string;
  user_type: 'customer' | 'cash_lending_customer' | 'admin';
  status: 'pending_verification' | 'active' | 'suspended';
  address_line1?: string;
  address_line2?: string;
  city?: string;
  pincode?: string;
  created_at: string;
  email_verified_at?: string;
  phone_verified_at?: string;
  last_login?: string;
}

interface LoanApplication {
  _id: string;
  application_id: string;
  loan_type: 'personal' | 'business';
  amount_requested: number;
  amount_approved?: number;
  status: string;
  application_date: string;
}

interface MembershipCard {
  _id: string;
  card_type_name: string;
  purchase_date: string;
  expiry_date: string;
  status: string;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

export default function AdminUserDetailPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loanApplications, setLoanApplications] = useState<LoanApplication[]>([]);
  const [membershipCards, setMembershipCards] = useState<MembershipCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tabValue, setTabValue] = useState(0);
  const router = useRouter();
  const params = useParams();
  const userId = params.id as string;

  const fetchUserDetails = useCallback(async () => {
    try {
      setLoading(true);
      
      const response = await fetch(`/api/admin/users/${userId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminAccessToken')}`,
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        setLoanApplications(data.loanApplications || []);
        setMembershipCards(data.membershipCards || []);
      } else {
        throw new Error('Failed to fetch user details');
      }
    } catch (err) {
      console.error('User fetch error:', err);
      setError(err instanceof Error ? err.message : 'Failed to load user details');
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    if (userId) {
      fetchUserDetails();
    }
  }, [userId, fetchUserDetails]);

  const handleSuspendUser = async () => {
    if (!confirm('Are you sure you want to suspend this user?')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/users/${userId}/suspend`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminAccessToken')}`,
        },
      });

      if (response.ok) {
        fetchUserDetails(); // Refresh data
      } else {
        throw new Error('Failed to suspend user');
      }
    } catch (err) {
      console.error('Suspend user error:', err);
      setError(err instanceof Error ? err.message : 'Failed to suspend user');
    }
  };

  const handleActivateUser = async () => {
    try {
      const response = await fetch(`/api/admin/users/${userId}/activate`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminAccessToken')}`,
        },
      });

      if (response.ok) {
        fetchUserDetails(); // Refresh data
      } else {
        throw new Error('Failed to activate user');
      }
    } catch (err) {
      console.error('Activate user error:', err);
      setError(err instanceof Error ? err.message : 'Failed to activate user');
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const loanColumns: Column[] = [
    {
      id: 'application_id',
      label: 'Application ID',
      minWidth: 150,
    },
    {
      id: 'loan_type',
      label: 'Loan Type',
      minWidth: 120,
      render: (value) => (
        <Chip
          label={value === 'personal' ? 'Personal' : 'Business'}
          color={value === 'personal' ? 'primary' : 'secondary'}
          size="small"
        />
      ),
    },
    {
      id: 'amount_requested',
      label: 'Amount Requested',
      minWidth: 150,
      align: 'right',
      render: (value) => formatCurrency(Number(value)),
    },
    {
      id: 'amount_approved',
      label: 'Amount Approved',
      minWidth: 150,
      align: 'right',
      render: (value) => value ? formatCurrency(Number(value)) : 'Pending',
    },
    {
      id: 'status',
      label: 'Status',
      minWidth: 150,
      render: (value) => <StatusBadge status={String(value)} />,
    },
    {
      id: 'application_date',
      label: 'Application Date',
      minWidth: 120,
      render: (value) => formatDate(String(value)),
    },
  ];

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <LoadingSpinner />
      </Container>
    );
  }

  if (error || !user) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error || 'User not found'}
        </Alert>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => router.push('/admin/users')}
        >
          Back to Users
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => router.push('/admin/users')}
          sx={{ mr: 2 }}
        >
          Back
        </Button>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
            User Details
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {user.full_name} - {user.email}
          </Typography>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Left Column - User Info */}
        <Grid size={{ xs: 12, lg: 4 }}>
          {/* User Profile Card */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Person sx={{ fontSize: 40, mr: 2, color: 'primary.main' }} />
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    {user.full_name}
                  </Typography>
                  <StatusBadge status={user.status} size="medium" />
                </Box>
              </Box>

              <List>
                <ListItem sx={{ px: 0 }}>
                  <ListItemIcon>
                    <Email />
                  </ListItemIcon>
                  <ListItemText
                    primary="Email"
                    secondary={
                      <Box>
                        <Typography variant="body2">{user.email}</Typography>
                        {user.email_verified_at && (
                          <Chip
                            label="Verified"
                            color="success"
                            size="small"
                            icon={<CheckCircle />}
                            sx={{ mt: 0.5 }}
                          />
                        )}
                      </Box>
                    }
                  />
                </ListItem>

                <ListItem sx={{ px: 0 }}>
                  <ListItemIcon>
                    <Phone />
                  </ListItemIcon>
                  <ListItemText
                    primary="Phone"
                    secondary={
                      <Box>
                        <Typography variant="body2">{user.phone_number}</Typography>
                        {user.phone_verified_at && (
                          <Chip
                            label="Verified"
                            color="success"
                            size="small"
                            icon={<CheckCircle />}
                            sx={{ mt: 0.5 }}
                          />
                        )}
                      </Box>
                    }
                  />
                </ListItem>

                {user.address_line1 && (
                  <ListItem sx={{ px: 0 }}>
                    <ListItemIcon>
                      <LocationOn />
                    </ListItemIcon>
                    <ListItemText
                      primary="Address"
                      secondary={`${user.address_line1}${user.address_line2 ? `, ${user.address_line2}` : ''}${user.city ? `, ${user.city}` : ''}${user.pincode ? ` - ${user.pincode}` : ''}`}
                    />
                  </ListItem>
                )}

                <ListItem sx={{ px: 0 }}>
                  <ListItemIcon>
                    <CalendarToday />
                  </ListItemIcon>
                  <ListItemText
                    primary="Joined"
                    secondary={formatDate(user.created_at)}
                  />
                </ListItem>

                {user.last_login && (
                  <ListItem sx={{ px: 0 }}>
                    <ListItemIcon>
                      <Security />
                    </ListItemIcon>
                    <ListItemText
                      primary="Last Login"
                      secondary={formatDate(user.last_login)}
                    />
                  </ListItem>
                )}
              </List>
            </CardContent>
          </Card>

          {/* Actions */}
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3 }}>
                Actions
              </Typography>
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {user.status === 'active' ? (
                  <Button
                    variant="contained"
                    color="error"
                    startIcon={<Block />}
                    onClick={handleSuspendUser}
                    fullWidth
                  >
                    Suspend User
                  </Button>
                ) : (
                  <Button
                    variant="contained"
                    color="success"
                    startIcon={<CheckCircle />}
                    onClick={handleActivateUser}
                    fullWidth
                  >
                    Activate User
                  </Button>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Right Column - Tabs */}
        <Grid size={{ xs: 12, lg: 8 }}>
          <Card>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs value={tabValue} onChange={handleTabChange}>
                <Tab label="Loan Applications" />
                <Tab label="Membership Cards" />
                <Tab label="Activity Log" />
              </Tabs>
            </Box>

            <TabPanel value={tabValue} index={0}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3 }}>
                Loan Applications ({loanApplications.length})
              </Typography>
              
              {loanApplications.length === 0 ? (
                <Typography variant="body2" color="text.secondary">
                  No loan applications found.
                </Typography>
              ) : (
                <DataTable
                  columns={loanColumns}
                  data={loanApplications}
                  loading={false}
                />
              )}
            </TabPanel>

            <TabPanel value={tabValue} index={1}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3 }}>
                Membership Cards ({membershipCards.length})
              </Typography>
              
              {membershipCards.length === 0 ? (
                <Typography variant="body2" color="text.secondary">
                  No membership cards found.
                </Typography>
              ) : (
                <List>
                  {membershipCards.map((card) => (
                    <ListItem key={card._id} sx={{ px: 0 }}>
                      <ListItemText
                        primary={card.card_type_name}
                        secondary={
                          <Box>
                            <Typography variant="body2" color="text.secondary">
                              Purchased: {formatDate(card.purchase_date)}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Expires: {formatDate(card.expiry_date)}
                            </Typography>
                            <StatusBadge status={card.status} size="small" />
                          </Box>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              )}
            </TabPanel>

            <TabPanel value={tabValue} index={2}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3 }}>
                Activity Log
              </Typography>
              
              <Typography variant="body2" color="text.secondary">
                Activity log feature coming soon.
              </Typography>
            </TabPanel>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}
