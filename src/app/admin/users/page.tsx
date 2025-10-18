'use client';

import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Grid, Card, CardContent, TextField, Button, FormControl, InputLabel, Select, MenuItem, Chip, Avatar } from '@mui/material';
import { Search, FilterList, Download, Refresh, Person, Email, Phone } from '@mui/icons-material';
import DataTable, { Column } from '@/components/Admin/DataTable';
import StatusBadge from '@/components/Admin/StatusBadge';
import LoadingSpinner from '@/components/Common/LoadingSpinner';
import { useRouter } from 'next/navigation';

interface User {
  _id: string;
  full_name: string;
  email: string;
  phone_number: string;
  user_type: 'customer' | 'cash_lending_customer' | 'admin';
  status: 'pending_verification' | 'active' | 'suspended';
  created_at: string;
  email_verified_at?: string;
  phone_verified_at?: string;
  last_login?: string;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [userTypeFilter, setUserTypeFilter] = useState('');
  const router = useRouter();

  useEffect(() => {
    fetchUsers();
  }, [page, rowsPerPage, searchTerm, statusFilter, userTypeFilter]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      
      const params = new URLSearchParams({
        page: (page + 1).toString(),
        limit: rowsPerPage.toString(),
        ...(searchTerm && { search: searchTerm }),
        ...(statusFilter && { status: statusFilter }),
        ...(userTypeFilter && { user_type: userTypeFilter }),
      });

      const response = await fetch(`/api/admin/users?${params}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminAccessToken')}`,
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setUsers(data.data || []);
        setTotalCount(data.pagination?.total_entries || 0);
      } else {
        throw new Error('Failed to fetch users');
      }
    } catch (err) {
      console.error('Users fetch error:', err);
      setError(err instanceof Error ? err.message : 'Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const handleRowClick = (user: User) => {
    router.push(`/admin/users/${user._id}`);
  };

  const handlePageChange = (newPage: number, newRowsPerPage: number) => {
    setPage(newPage);
    setRowsPerPage(newRowsPerPage);
  };

  const handleSearch = () => {
    setPage(0);
    fetchUsers();
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setStatusFilter('');
    setUserTypeFilter('');
    setPage(0);
  };

  const handleExport = () => {
    // Implement export functionality
    console.log('Export users');
  };

  const columns: Column[] = [
    {
      id: 'full_name',
      label: 'User',
      minWidth: 200,
      render: (value, row) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>
            {value.charAt(0).toUpperCase()}
          </Avatar>
          <Box>
            <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
              {value}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              ID: {row._id.slice(-8)}
            </Typography>
          </Box>
        </Box>
      ),
    },
    {
      id: 'email',
      label: 'Email',
      minWidth: 200,
      render: (value, row) => (
        <Box>
          <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
            {value}
          </Typography>
          {row.email_verified_at && (
            <Chip
              label="Verified"
              color="success"
              size="small"
              sx={{ mt: 0.5 }}
            />
          )}
        </Box>
      ),
    },
    {
      id: 'phone_number',
      label: 'Phone',
      minWidth: 150,
      render: (value, row) => (
        <Box>
          <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
            {value}
          </Typography>
          {row.phone_verified_at && (
            <Chip
              label="Verified"
              color="success"
              size="small"
              sx={{ mt: 0.5 }}
            />
          )}
        </Box>
      ),
    },
    {
      id: 'user_type',
      label: 'User Type',
      minWidth: 120,
      render: (value) => (
        <Chip
          label={value === 'customer' ? 'Customer' : value === 'cash_lending_customer' ? 'Cash Lending' : 'Admin'}
          color={value === 'admin' ? 'error' : value === 'cash_lending_customer' ? 'secondary' : 'primary'}
          size="small"
        />
      ),
    },
    {
      id: 'status',
      label: 'Status',
      minWidth: 150,
      render: (value) => <StatusBadge status={value} />,
    },
    {
      id: 'created_at',
      label: 'Joined',
      minWidth: 120,
      render: (value) => (
        <Typography variant="body2">
          {formatDate(value)}
        </Typography>
      ),
    },
    {
      id: 'last_login',
      label: 'Last Login',
      minWidth: 120,
      render: (value) => (
        <Typography variant="body2" color="text.secondary">
          {value ? formatDate(value) : 'Never'}
        </Typography>
      ),
    },
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
          User Management
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
            onClick={fetchUsers}
          >
            Refresh
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
                  {totalCount}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Users
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card>
            <CardContent sx={{ display: 'flex', alignItems: 'center' }}>
              <Email sx={{ fontSize: 40, mr: 2, color: 'success.main' }} />
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  {users.filter(user => user.email_verified_at).length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Email Verified
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card>
            <CardContent sx={{ display: 'flex', alignItems: 'center' }}>
              <Phone sx={{ fontSize: 40, mr: 2, color: 'info.main' }} />
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  {users.filter(user => user.phone_verified_at).length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Phone Verified
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card>
            <CardContent sx={{ display: 'flex', alignItems: 'center' }}>
              <Person sx={{ fontSize: 40, mr: 2, color: 'warning.main' }} />
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  {users.filter(user => user.status === 'active').length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Active Users
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
                placeholder="Search by name, email, or phone"
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
                  <MenuItem value="pending_verification">Pending Verification</MenuItem>
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="suspended">Suspended</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid size={{ xs: 12, md: 2 }}>
              <FormControl fullWidth>
                <InputLabel>User Type</InputLabel>
                <Select
                  value={userTypeFilter}
                  label="User Type"
                  onChange={(e) => setUserTypeFilter(e.target.value)}
                >
                  <MenuItem value="">All Types</MenuItem>
                  <MenuItem value="customer">Customer</MenuItem>
                  <MenuItem value="cash_lending_customer">Cash Lending</MenuItem>
                  <MenuItem value="admin">Admin</MenuItem>
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

      {/* Users Table */}
      <Card>
        <CardContent>
          {error && (
            <Typography variant="body2" color="error" sx={{ mb: 2 }}>
              {error}
            </Typography>
          )}
          
          <DataTable
            columns={columns}
            data={users}
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
