'use client';

import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Grid, Card, CardContent, Button, Alert, Divider, Chip, List, ListItem, ListItemText, ListItemIcon, Tabs, Tab, Avatar } from '@mui/material';
import { ArrowBack, AccountBalance, Email, Phone, Person, TrendingUp, Schedule, CheckCircle, Cancel } from '@mui/icons-material';
import { useRouter, useParams } from 'next/navigation';
import StatusBadge from '@/components/Admin/StatusBadge';
import LoadingSpinner from '@/components/Common/LoadingSpinner';
import DataTable, { Column } from '@/components/Admin/DataTable';

interface BankPartner {
  _id: string;
  name: string;
  logo_url?: string;
  contact_email: string;
  contact_phone: string;
  contact_person: string;
  loan_types: string[];
  max_loan_amount: number;
  min_interest_rate: number;
  max_interest_rate: number;
  processing_time_days: number;
  status: 'active' | 'inactive';
  created_at: string;
  description?: string;
  website?: string;
  address?: string;
  performance_metrics?: {
    total_applications: number;
    approved_applications: number;
    approval_rate: number;
    average_processing_time: number;
    total_loan_amount: number;
    average_loan_amount: number;
  };
}

interface LoanApplication {
  _id: string;
  application_id: string;
  user_name: string;
  loan_type: 'personal' | 'business';
  amount_requested: number;
  amount_approved?: number;
  status: string;
  application_date: string;
  approved_date?: string;
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

export default function AdminPartnerDetailPage() {
  const [partner, setPartner] = useState<BankPartner | null>(null);
  const [loanApplications, setLoanApplications] = useState<LoanApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tabValue, setTabValue] = useState(0);
  const router = useRouter();
  const params = useParams();
  const partnerId = params.id as string;

  useEffect(() => {
    if (partnerId) {
      fetchPartnerDetails();
    }
  }, [partnerId]);

  const fetchPartnerDetails = async () => {
    try {
      setLoading(true);
      
      const response = await fetch(`/api/admin/partners/${partnerId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminAccessToken')}`,
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setPartner(data.partner);
        setLoanApplications(data.loanApplications || []);
      } else {
        throw new Error('Failed to fetch partner details');
      }
    } catch (err) {
      console.error('Partner fetch error:', err);
      setError(err instanceof Error ? err.message : 'Failed to load partner details');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async () => {
    if (!confirm(`Are you sure you want to ${partner?.status === 'active' ? 'deactivate' : 'activate'} this partner?`)) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/partners/${partnerId}/toggle-status`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminAccessToken')}`,
        },
      });

      if (response.ok) {
        fetchPartnerDetails(); // Refresh data
      } else {
        throw new Error('Failed to update partner status');
      }
    } catch (err) {
      console.error('Status update error:', err);
      setError(err instanceof Error ? err.message : 'Failed to update partner status');
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
      id: 'user_name',
      label: 'Applicant',
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
      render: (value) => formatCurrency(value),
    },
    {
      id: 'amount_approved',
      label: 'Amount Approved',
      minWidth: 150,
      align: 'right',
      render: (value) => value ? formatCurrency(value) : 'Pending',
    },
    {
      id: 'status',
      label: 'Status',
      minWidth: 150,
      render: (value) => <StatusBadge status={value} />,
    },
    {
      id: 'application_date',
      label: 'Application Date',
      minWidth: 120,
      render: (value) => formatDate(value),
    },
  ];

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <LoadingSpinner />
      </Container>
    );
  }

  if (error || !partner) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error || 'Partner not found'}
        </Alert>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => router.push('/admin/partners')}
        >
          Back to Partners
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
          onClick={() => router.push('/admin/partners')}
          sx={{ mr: 2 }}
        >
          Back
        </Button>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar 
            src={partner.logo_url} 
            sx={{ width: 60, height: 60, bgcolor: 'primary.main' }}
          >
            {partner.name.charAt(0).toUpperCase()}
          </Avatar>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
              {partner.name}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {partner.contact_person} • {partner.contact_email}
            </Typography>
          </Box>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Left Column - Partner Info */}
        <Grid size={{ xs: 12, lg: 4 }}>
          {/* Partner Details Card */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <AccountBalance sx={{ fontSize: 40, mr: 2, color: 'primary.main' }} />
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    {partner.name}
                  </Typography>
                  <StatusBadge status={partner.status} size="medium" />
                </Box>
              </Box>

              <List>
                <ListItem sx={{ px: 0 }}>
                  <ListItemIcon>
                    <Email />
                  </ListItemIcon>
                  <ListItemText
                    primary="Email"
                    secondary={partner.contact_email}
                  />
                </ListItem>

                <ListItem sx={{ px: 0 }}>
                  <ListItemIcon>
                    <Phone />
                  </ListItemIcon>
                  <ListItemText
                    primary="Phone"
                    secondary={partner.contact_phone}
                  />
                </ListItem>

                <ListItem sx={{ px: 0 }}>
                  <ListItemIcon>
                    <Person />
                  </ListItemIcon>
                  <ListItemText
                    primary="Contact Person"
                    secondary={partner.contact_person}
                  />
                </ListItem>

                {partner.website && (
                  <ListItem sx={{ px: 0 }}>
                    <ListItemIcon>
                      <AccountBalance />
                    </ListItemIcon>
                    <ListItemText
                      primary="Website"
                      secondary={
                        <Button
                          size="small"
                          onClick={() => window.open(partner.website, '_blank')}
                        >
                          Visit Website
                        </Button>
                      }
                    />
                  </ListItem>
                )}

                {partner.address && (
                  <ListItem sx={{ px: 0 }}>
                    <ListItemIcon>
                      <AccountBalance />
                    </ListItemIcon>
                    <ListItemText
                      primary="Address"
                      secondary={partner.address}
                    />
                  </ListItem>
                )}
              </List>
            </CardContent>
          </Card>

          {/* Loan Terms */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3 }}>
                Loan Terms
              </Typography>
              
              <List>
                <ListItem sx={{ px: 0 }}>
                  <ListItemText
                    primary="Maximum Loan Amount"
                    secondary={formatCurrency(partner.max_loan_amount)}
                  />
                </ListItem>

                <ListItem sx={{ px: 0 }}>
                  <ListItemText
                    primary="Interest Rate Range"
                    secondary={`${partner.min_interest_rate}% - ${partner.max_interest_rate}% per annum`}
                  />
                </ListItem>

                <ListItem sx={{ px: 0 }}>
                  <ListItemText
                    primary="Processing Time"
                    secondary={`${partner.processing_time_days} days`}
                  />
                </ListItem>

                <ListItem sx={{ px: 0 }}>
                  <ListItemText
                    primary="Supported Loan Types"
                    secondary={
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 1 }}>
                        {partner.loan_types.map((type, index) => (
                          <Chip
                            key={index}
                            label={type === 'personal' ? 'Personal' : 'Business'}
                            color={type === 'personal' ? 'primary' : 'secondary'}
                            size="small"
                          />
                        ))}
                      </Box>
                    }
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>

          {/* Performance Metrics */}
          {partner.performance_metrics && (
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3 }}>
                  Performance Metrics
                </Typography>
                
                <List>
                  <ListItem sx={{ px: 0 }}>
                    <ListItemText
                      primary="Total Applications"
                      secondary={partner.performance_metrics.total_applications}
                    />
                  </ListItem>

                  <ListItem sx={{ px: 0 }}>
                    <ListItemText
                      primary="Approved Applications"
                      secondary={partner.performance_metrics.approved_applications}
                    />
                  </ListItem>

                  <ListItem sx={{ px: 0 }}>
                    <ListItemText
                      primary="Approval Rate"
                      secondary={`${partner.performance_metrics.approval_rate}%`}
                    />
                  </ListItem>

                  <ListItem sx={{ px: 0 }}>
                    <ListItemText
                      primary="Average Processing Time"
                      secondary={`${partner.performance_metrics.average_processing_time} days`}
                    />
                  </ListItem>

                  <ListItem sx={{ px: 0 }}>
                    <ListItemText
                      primary="Total Loan Amount"
                      secondary={formatCurrency(partner.performance_metrics.total_loan_amount)}
                    />
                  </ListItem>

                  <ListItem sx={{ px: 0 }}>
                    <ListItemText
                      primary="Average Loan Amount"
                      secondary={formatCurrency(partner.performance_metrics.average_loan_amount)}
                    />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          )}

          {/* Actions */}
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3 }}>
                Actions
              </Typography>
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Button
                  variant="contained"
                  color={partner.status === 'active' ? 'error' : 'success'}
                  startIcon={partner.status === 'active' ? <Cancel /> : <CheckCircle />}
                  onClick={handleToggleStatus}
                  fullWidth
                >
                  {partner.status === 'active' ? 'Deactivate Partner' : 'Activate Partner'}
                </Button>
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
                <Tab label="Performance Analytics" />
              </Tabs>
            </Box>

            <TabPanel value={tabValue} index={0}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3 }}>
                Loan Applications ({loanApplications.length})
              </Typography>
              
              {loanApplications.length === 0 ? (
                <Typography variant="body2" color="text.secondary">
                  No loan applications found for this partner.
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
                Performance Analytics
              </Typography>
              
              <Typography variant="body2" color="text.secondary">
                Performance analytics charts and detailed metrics will be implemented here.
              </Typography>
            </TabPanel>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}
