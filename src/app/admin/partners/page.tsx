'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Container, Typography, Box, Grid, Card, CardContent, TextField, Button, FormControl, InputLabel, Select, MenuItem, Chip, Avatar, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { Search, FilterList, Add, AccountBalance, TrendingUp, Schedule } from '@mui/icons-material';
import DataTable, { Column } from '@/components/Admin/DataTable';
import StatusBadge from '@/components/Admin/StatusBadge';
import { useRouter } from 'next/navigation';

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
  performance_metrics?: {
    total_applications: number;
    approved_applications: number;
    approval_rate: number;
    average_processing_time: number;
  };
}

export default function AdminPartnersPage() {
  const [partners, setPartners] = useState<BankPartner[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [addPartnerModalOpen, setAddPartnerModalOpen] = useState(false);
  const router = useRouter();

  const fetchPartners = useCallback(async () => {
    try {
      setLoading(true);
      
      const params = new URLSearchParams({
        page: (page + 1).toString(),
        limit: rowsPerPage.toString(),
        ...(searchTerm && { search: searchTerm }),
        ...(statusFilter && { status: statusFilter }),
      });

      const response = await fetch(`/api/admin/partners?${params}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminAccessToken')}`,
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setPartners(data.data || []);
        setTotalCount(data.pagination?.total_entries || 0);
      } else {
        throw new Error('Failed to fetch bank partners');
      }
    } catch (err) {
      console.error('Partners fetch error:', err);
      setError(err instanceof Error ? err.message : 'Failed to load bank partners');
    } finally {
      setLoading(false);
    }
  }, [page, rowsPerPage, searchTerm, statusFilter]);

  useEffect(() => {
    fetchPartners();
  }, [fetchPartners]);

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

  const handleRowClick = (partner: BankPartner) => {
    router.push(`/admin/partners/${partner._id}`);
  };

  const handlePageChange = (newPage: number, newRowsPerPage: number) => {
    setPage(newPage);
    setRowsPerPage(newRowsPerPage);
  };

  const handleSearch = () => {
    setPage(0);
    fetchPartners();
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setStatusFilter('');
    setPage(0);
  };

  const handleAddPartner = () => {
    setAddPartnerModalOpen(true);
  };

  const columns: Column[] = [
    {
      id: 'name',
      label: 'Bank Partner',
      minWidth: 200,
      render: (value, row) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar 
            src={(row as BankPartner).logo_url} 
            sx={{ width: 40, height: 40, bgcolor: 'primary.main' }}
          >
            {String(value).charAt(0).toUpperCase()}
          </Avatar>
          <Box>
            <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
              {String(value)}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {(row as BankPartner).contact_person}
            </Typography>
          </Box>
        </Box>
      ),
    },
    {
      id: 'loan_types',
      label: 'Loan Types',
      minWidth: 150,
      render: (value) => (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
          {Array.isArray(value) && (value as string[]).map((type: string, index: number) => (
            <Chip
              key={index}
              label={type === 'personal' ? 'Personal' : 'Business'}
              color={type === 'personal' ? 'primary' : 'secondary'}
              size="small"
            />
          ))}
        </Box>
      ),
    },
    {
      id: 'max_loan_amount',
      label: 'Max Amount',
      minWidth: 120,
      align: 'right',
      render: (value) => (
        <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
          {formatCurrency(Number(value))}
        </Typography>
      ),
    },
    {
      id: 'min_interest_rate',
      label: 'Interest Rate',
      minWidth: 120,
      render: (value, row) => (
        <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
          {String(value)}% - {(row as BankPartner).max_interest_rate}%
        </Typography>
      ),
    },
    {
      id: 'processing_time_days',
      label: 'Processing Time',
      minWidth: 120,
      render: (value) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <Schedule sx={{ fontSize: 16, color: 'text.secondary' }} />
          <Typography variant="body2">
            {String(value)} days
          </Typography>
        </Box>
      ),
    },
    {
      id: 'performance_metrics',
      label: 'Performance',
      minWidth: 120,
      render: (value) => {
        const metrics = value as BankPartner['performance_metrics'];
        return (
          <Box>
            <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
              {String(metrics?.approval_rate || 0)}% approval
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {String(metrics?.total_applications || 0)} applications
            </Typography>
          </Box>
        );
      },
    },
    {
      id: 'status',
      label: 'Status',
      minWidth: 100,
      render: (value) => <StatusBadge status={String(value)} />,
    },
    {
      id: 'created_at',
      label: 'Added',
      minWidth: 100,
      render: (value) => (
        <Typography variant="body2">
          {formatDate(String(value))}
        </Typography>
      ),
    },
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
          Bank Partners
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={handleAddPartner}
          >
            Add Partner
          </Button>
        </Box>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card>
            <CardContent sx={{ display: 'flex', alignItems: 'center' }}>
              <AccountBalance sx={{ fontSize: 40, mr: 2, color: 'primary.main' }} />
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  {totalCount}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Partners
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
                  {partners.filter(partner => partner.status === 'active').length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Active Partners
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card>
            <CardContent sx={{ display: 'flex', alignItems: 'center' }}>
              <Schedule sx={{ fontSize: 40, mr: 2, color: 'info.main' }} />
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  {partners.length > 0 ? Math.round(partners.reduce((acc, partner) => acc + partner.processing_time_days, 0) / partners.length) : 0}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Avg Processing Time
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card>
            <CardContent sx={{ display: 'flex', alignItems: 'center' }}>
              <TrendingUp sx={{ fontSize: 40, mr: 2, color: 'warning.main' }} />
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  {partners.length > 0 ? Math.round(partners.reduce((acc, partner) => acc + (partner.performance_metrics?.approval_rate || 0), 0) / partners.length) : 0}%
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Avg Approval Rate
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Filters */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                fullWidth
                label="Search"
                placeholder="Search by name or contact person"
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
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="inactive">Inactive</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid size={{ xs: 12, md: 6 }}>
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

      {/* Partners Table */}
      <Card>
        <CardContent>
          {error && (
            <Typography variant="body2" color="error" sx={{ mb: 2 }}>
              {error}
            </Typography>
          )}
          
          <DataTable
            columns={columns}
            data={partners}
            loading={loading}
            onRowClick={(row) => handleRowClick(row as BankPartner)}
            onPageChange={handlePageChange}
            totalCount={totalCount}
            page={page}
            rowsPerPage={rowsPerPage}
            selectable={true}
            getRowId={(row) => (row as { _id: string })._id}
          />
        </CardContent>
      </Card>

      {/* Add Partner Modal */}
      <Dialog
        open={addPartnerModalOpen}
        onClose={() => setAddPartnerModalOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Add New Bank Partner</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary">
            Partner management form will be implemented here.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddPartnerModalOpen(false)}>
            Cancel
          </Button>
          <Button variant="contained">
            Add Partner
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
