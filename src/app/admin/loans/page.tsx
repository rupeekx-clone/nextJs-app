'use client';

import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Grid, Card, CardContent, TextField, Button, FormControl, InputLabel, Select, MenuItem, Chip } from '@mui/material';
import { Search, FilterList, Download, Refresh } from '@mui/icons-material';
import DataTable, { Column } from '@/components/Admin/DataTable';
import StatusBadge from '@/components/Admin/StatusBadge';
import LoadingSpinner from '@/components/Common/LoadingSpinner';
import { useRouter } from 'next/navigation';

interface LoanApplication {
  _id: string;
  application_id: string;
  user_id: string;
  loan_type: 'personal' | 'business';
  amount_requested: number;
  amount_approved?: number;
  status: string;
  application_date: string;
  user_name?: string;
  user_phone?: string;
  user_email?: string;
}

export default function AdminLoansPage() {
  const [applications, setApplications] = useState<LoanApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [loanTypeFilter, setLoanTypeFilter] = useState('');
  const router = useRouter();

  useEffect(() => {
    fetchApplications();
  }, [page, rowsPerPage, searchTerm, statusFilter, loanTypeFilter]);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      
      const params = new URLSearchParams({
        page: (page + 1).toString(),
        limit: rowsPerPage.toString(),
        ...(searchTerm && { search: searchTerm }),
        ...(statusFilter && { status: statusFilter }),
        ...(loanTypeFilter && { loan_type: loanTypeFilter }),
      });

      const response = await fetch(`/api/admin/loans?${params}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminAccessToken')}`,
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setApplications(data.data || []);
        setTotalCount(data.pagination?.total_entries || 0);
      } else {
        throw new Error('Failed to fetch loan applications');
      }
    } catch (err) {
      console.error('Applications fetch error:', err);
      setError(err instanceof Error ? err.message : 'Failed to load applications');
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const handleRowClick = (application: LoanApplication) => {
    router.push(`/admin/loans/${application._id}`);
  };

  const handlePageChange = (newPage: number, newRowsPerPage: number) => {
    setPage(newPage);
    setRowsPerPage(newRowsPerPage);
  };

  const handleSearch = () => {
    setPage(0);
    fetchApplications();
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setStatusFilter('');
    setLoanTypeFilter('');
    setPage(0);
  };

  const handleExport = () => {
    // Implement export functionality
    console.log('Export applications');
  };

  const columns: Column[] = [
    {
      id: 'application_id',
      label: 'Application ID',
      minWidth: 150,
      render: (value) => (
        <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
          {value}
        </Typography>
      ),
    },
    {
      id: 'user_name',
      label: 'Applicant',
      minWidth: 200,
      render: (value, row) => (
        <Box>
          <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
            {value || 'N/A'}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {row.user_phone || 'N/A'}
          </Typography>
        </Box>
      ),
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
      render: (value) => (
        <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
          {formatCurrency(value)}
        </Typography>
      ),
    },
    {
      id: 'amount_approved',
      label: 'Amount Approved',
      minWidth: 150,
      align: 'right',
      render: (value) => (
        <Typography variant="body2" sx={{ fontWeight: 'medium', color: value ? 'success.main' : 'text.secondary' }}>
          {value ? formatCurrency(value) : 'Pending'}
        </Typography>
      ),
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
      render: (value) => (
        <Typography variant="body2">
          {formatDate(value)}
        </Typography>
      ),
    },
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
          Loan Applications
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<Download />}
            onClick={handleExport}
          >
            Export
          </Button>
          <Button
            variant="outlined"
            startIcon={<Refresh />}
            onClick={fetchApplications}
          >
            Refresh
          </Button>
        </Box>
      </Box>

      {/* Filters */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                fullWidth
                label="Search"
                placeholder="Search by application ID, name, or phone"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />,
                }}
              />
            </Grid>
            
            <Grid size={{ xs: 12, md: 2 }}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={statusFilter}
                  label="Status"
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <MenuItem value="">All Status</MenuItem>
                  <MenuItem value="submitted">Submitted</MenuItem>
                  <MenuItem value="under_review">Under Review</MenuItem>
                  <MenuItem value="requires_documents">Requires Documents</MenuItem>
                  <MenuItem value="approved">Approved</MenuItem>
                  <MenuItem value="rejected">Rejected</MenuItem>
                  <MenuItem value="disbursed">Disbursed</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid size={{ xs: 12, md: 2 }}>
              <FormControl fullWidth>
                <InputLabel>Loan Type</InputLabel>
                <Select
                  value={loanTypeFilter}
                  label="Loan Type"
                  onChange={(e) => setLoanTypeFilter(e.target.value)}
                >
                  <MenuItem value="">All Types</MenuItem>
                  <MenuItem value="personal">Personal</MenuItem>
                  <MenuItem value="business">Business</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid size={{ xs: 12, md: 4 }}>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  variant="contained"
                  startIcon={<Search />}
                  onClick={handleSearch}
                >
                  Search
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<FilterList />}
                  onClick={handleClearFilters}
                >
                  Clear
                </Button>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Applications Table */}
      <Card>
        <CardContent>
          {error && (
            <Typography variant="body2" color="error" sx={{ mb: 2 }}>
              {error}
            </Typography>
          )}
          
          <DataTable
            columns={columns}
            data={applications}
            loading={loading}
            onRowClick={handleRowClick}
            onPageChange={handlePageChange}
            totalCount={totalCount}
            page={page}
            rowsPerPage={rowsPerPage}
            selectable={true}
            getRowId={(row) => row._id}
          />
        </CardContent>
      </Card>
    </Container>
  );
}
