'use client';

import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Grid, Card, CardContent, FormControl, InputLabel, Select, MenuItem, Button, Paper, Chip } from '@mui/material';
import { DateRange, Download, TrendingUp, People, AccountBalance, Assessment, Schedule } from '@mui/icons-material';
import StatsCard from '@/components/Admin/StatsCard';
import LoadingSpinner from '@/components/Common/LoadingSpinner';

interface ReportData {
  users: {
    total: number;
    new_this_month: number;
    active: number;
    growth_rate: number;
  };
  loans: {
    total_applications: number;
    approved_applications: number;
    rejected_applications: number;
    pending_applications: number;
    total_amount_requested: number;
    total_amount_approved: number;
    approval_rate: number;
    average_processing_time: number;
  };
  memberships: {
    total_sold: number;
    silver_sold: number;
    gold_sold: number;
    revenue: number;
    growth_rate: number;
  };
  partners: {
    total_partners: number;
    active_partners: number;
    average_approval_rate: number;
    top_performing_partner: string;
  };
}

export default function AdminReportsPage() {
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1), // First day of current month
    endDate: new Date(), // Today
  });
  const [reportType, setReportType] = useState('overview');

  useEffect(() => {
    fetchReportData();
  }, [dateRange, reportType]);

  const fetchReportData = async () => {
    try {
      setLoading(true);
      
      const params = new URLSearchParams({
        start_date: dateRange.startDate.toISOString(),
        end_date: dateRange.endDate.toISOString(),
        report_type: reportType,
      });

      const response = await fetch(`/api/admin/reports/overview?${params}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminAccessToken')}`,
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setReportData(data);
      } else {
        throw new Error('Failed to fetch report data');
      }
    } catch (err) {
      console.error('Report fetch error:', err);
      setError(err instanceof Error ? err.message : 'Failed to load report data');
    } finally {
      setLoading(false);
    }
  };

  const handleExportReport = (format: 'pdf' | 'csv') => {
    // Implement export functionality
    console.log(`Exporting ${reportType} report as ${format}`);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <LoadingSpinner />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
            Reports & Analytics
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="outlined"
              startIcon={<Download />}
              onClick={() => handleExportReport('pdf')}
            >
              Export PDF
            </Button>
            <Button
              variant="outlined"
              startIcon={<Download />}
              onClick={() => handleExportReport('csv')}
            >
              Export CSV
            </Button>
          </Box>
        </Box>

        {/* Filters */}
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Grid container spacing={3} alignItems="center">
              <Grid size={{ xs: 12, md: 3 }}>
                <FormControl fullWidth>
                  <InputLabel>Report Type</InputLabel>
                  <Select
                    value={reportType}
                    label="Report Type"
                    onChange={(e) => setReportType(e.target.value)}
                  >
                    <MenuItem value="overview">Overview</MenuItem>
                    <MenuItem value="users">User Analytics</MenuItem>
                    <MenuItem value="loans">Loan Analytics</MenuItem>
                    <MenuItem value="memberships">Membership Analytics</MenuItem>
                    <MenuItem value="partners">Partner Analytics</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid size={{ xs: 12, md: 3 }}>
                <input
                  type="date"
                  value={dateRange.startDate.toISOString().split('T')[0]}
                  onChange={(e) => setDateRange(prev => ({ ...prev, startDate: new Date(e.target.value) }))}
                  style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
                />
              </Grid>
              
              <Grid size={{ xs: 12, md: 3 }}>
                <input
                  type="date"
                  value={dateRange.endDate.toISOString().split('T')[0]}
                  onChange={(e) => setDateRange(prev => ({ ...prev, endDate: new Date(e.target.value) }))}
                  style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
                />
              </Grid>
              
              <Grid size={{ xs: 12, md: 3 }}>
                <Button
                  variant="contained"
                  startIcon={<DateRange />}
                  onClick={fetchReportData}
                  fullWidth
                >
                  Generate Report
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {error && (
          <Typography variant="body2" color="error" sx={{ mb: 3 }}>
            {error}
          </Typography>
        )}

        {reportData && (
          <>
            {/* Overview Stats */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <StatsCard
                  title="Total Users"
                  value={reportData.users.total.toLocaleString()}
                  icon={<People />}
                  trend={{ value: reportData.users.growth_rate, isPositive: reportData.users.growth_rate >= 0 }}
                  color="primary"
                />
              </Grid>
              
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <StatsCard
                  title="Total Applications"
                  value={reportData.loans.total_applications.toLocaleString()}
                  icon={<AccountBalance />}
                  trend={{ value: reportData.loans.approval_rate, isPositive: true }}
                  color="success"
                />
              </Grid>
              
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <StatsCard
                  title="Memberships Sold"
                  value={reportData.memberships.total_sold.toLocaleString()}
                  icon={<Assessment />}
                  trend={{ value: reportData.memberships.growth_rate, isPositive: reportData.memberships.growth_rate >= 0 }}
                  color="info"
                />
              </Grid>
              
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <StatsCard
                  title="Total Revenue"
                  value={formatCurrency(reportData.memberships.revenue)}
                  icon={<TrendingUp />}
                  trend={{ value: reportData.memberships.growth_rate, isPositive: reportData.memberships.growth_rate >= 0 }}
                  color="warning"
                />
              </Grid>
            </Grid>

            {/* Detailed Analytics */}
            <Grid container spacing={3}>
              {/* User Analytics */}
              <Grid size={{ xs: 12, md: 6 }}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3 }}>
                      User Analytics
                    </Typography>
                    
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="body2" color="text.secondary">
                          New Users This Month
                        </Typography>
                        <Chip
                          label={reportData.users.new_this_month}
                          color="primary"
                          variant="outlined"
                        />
                      </Box>
                      
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="body2" color="text.secondary">
                          Active Users
                        </Typography>
                        <Chip
                          label={reportData.users.active}
                          color="success"
                          variant="outlined"
                        />
                      </Box>
                      
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="body2" color="text.secondary">
                          Growth Rate
                        </Typography>
                        <Chip
                          label={formatPercentage(reportData.users.growth_rate)}
                          color={reportData.users.growth_rate >= 0 ? 'success' : 'error'}
                          variant="outlined"
                        />
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>

              {/* Loan Analytics */}
              <Grid size={{ xs: 12, md: 6 }}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3 }}>
                      Loan Analytics
                    </Typography>
                    
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="body2" color="text.secondary">
                          Approved Applications
                        </Typography>
                        <Chip
                          label={reportData.loans.approved_applications}
                          color="success"
                          variant="outlined"
                        />
                      </Box>
                      
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="body2" color="text.secondary">
                          Rejected Applications
                        </Typography>
                        <Chip
                          label={reportData.loans.rejected_applications}
                          color="error"
                          variant="outlined"
                        />
                      </Box>
                      
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="body2" color="text.secondary">
                          Pending Applications
                        </Typography>
                        <Chip
                          label={reportData.loans.pending_applications}
                          color="warning"
                          variant="outlined"
                        />
                      </Box>
                      
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="body2" color="text.secondary">
                          Total Amount Requested
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                          {formatCurrency(reportData.loans.total_amount_requested)}
                        </Typography>
                      </Box>
                      
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="body2" color="text.secondary">
                          Total Amount Approved
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                          {formatCurrency(reportData.loans.total_amount_approved)}
                        </Typography>
                      </Box>
                      
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="body2" color="text.secondary">
                          Average Processing Time
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <Schedule sx={{ fontSize: 16, color: 'text.secondary' }} />
                          <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                            {reportData.loans.average_processing_time} days
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>

              {/* Membership Analytics */}
              <Grid size={{ xs: 12, md: 6 }}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3 }}>
                      Membership Analytics
                    </Typography>
                    
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="body2" color="text.secondary">
                          Silver Memberships
                        </Typography>
                        <Chip
                          label={reportData.memberships.silver_sold}
                          color="info"
                          variant="outlined"
                        />
                      </Box>
                      
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="body2" color="text.secondary">
                          Gold Memberships
                        </Typography>
                        <Chip
                          label={reportData.memberships.gold_sold}
                          color="warning"
                          variant="outlined"
                        />
                      </Box>
                      
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="body2" color="text.secondary">
                          Total Revenue
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                          {formatCurrency(reportData.memberships.revenue)}
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>

              {/* Partner Analytics */}
              <Grid size={{ xs: 12, md: 6 }}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3 }}>
                      Partner Analytics
                    </Typography>
                    
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="body2" color="text.secondary">
                          Total Partners
                        </Typography>
                        <Chip
                          label={reportData.partners.total_partners}
                          color="primary"
                          variant="outlined"
                        />
                      </Box>
                      
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="body2" color="text.secondary">
                          Active Partners
                        </Typography>
                        <Chip
                          label={reportData.partners.active_partners}
                          color="success"
                          variant="outlined"
                        />
                      </Box>
                      
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="body2" color="text.secondary">
                          Average Approval Rate
                        </Typography>
                        <Chip
                          label={formatPercentage(reportData.partners.average_approval_rate)}
                          color="info"
                          variant="outlined"
                        />
                      </Box>
                      
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="body2" color="text.secondary">
                          Top Performing Partner
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                          {reportData.partners.top_performing_partner}
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </>
        )}
      </Container>
  );
}
