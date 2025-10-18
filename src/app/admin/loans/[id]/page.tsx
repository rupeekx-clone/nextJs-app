'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Container, Typography, Box, Grid, Card, CardContent, Button, Alert, Chip, List, ListItem, ListItemText, ListItemIcon } from '@mui/material';
import { ArrowBack, CheckCircle, Cancel, Description } from '@mui/icons-material';
import { useRouter, useParams } from 'next/navigation';
import StatusBadge from '@/components/Admin/StatusBadge';
import LoadingSpinner from '@/components/Common/LoadingSpinner';
import Modal from '@/components/Common/Modal';
import Input from '@/components/Common/Input';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const approvalSchema = z.object({
  approved_amount: z.number().min(1000, 'Minimum amount is ₹1,000'),
  interest_rate: z.number().min(1, 'Interest rate must be at least 1%').max(30, 'Interest rate cannot exceed 30%'),
  tenure_months: z.number().min(1, 'Tenure must be at least 1 month').max(60, 'Tenure cannot exceed 60 months'),
  processing_fee: z.number().min(0, 'Processing fee cannot be negative'),
  remarks: z.string().optional(),
});

const rejectionSchema = z.object({
  reason: z.string().min(1, 'Rejection reason is required'),
  remarks: z.string().optional(),
});

type ApprovalFormData = z.infer<typeof approvalSchema>;
type RejectionFormData = z.infer<typeof rejectionSchema>;

interface LoanApplication {
  _id: string;
  application_id: string;
  user_id: string;
  loan_type: 'personal' | 'business';
  amount_requested: number;
  amount_approved?: number;
  tenure_months_requested: number;
  tenure_months_final?: number;
  status: string;
  application_date: string;
  approved_date?: string;
  disbursed_date?: string;
  documents_submitted: Record<string, string>;
  admin_remarks?: string;
  rejection_reason?: string;
  interest_rate?: number;
  processing_fee?: number;
  user: {
    full_name: string;
    email: string;
    phone_number: string;
    address_line1?: string;
    city?: string;
    pincode?: string;
  };
}

export default function AdminLoanDetailPage() {
  const [application, setApplication] = useState<LoanApplication | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [approvalModalOpen, setApprovalModalOpen] = useState(false);
  const [rejectionModalOpen, setRejectionModalOpen] = useState(false);
  const [processing, setProcessing] = useState(false);
  const router = useRouter();
  const params = useParams();
  const applicationId = params.id as string;

  const {
    register: registerApproval,
    handleSubmit: handleApprovalSubmit,
    formState: { errors: approvalErrors },
    reset: resetApproval,
  } = useForm<ApprovalFormData>({
    resolver: zodResolver(approvalSchema),
    defaultValues: {
      approved_amount: 0,
      interest_rate: 12.5,
      tenure_months: 24,
      processing_fee: 0,
    },
  });

  const {
    register: registerRejection,
    handleSubmit: handleRejectionSubmit,
    formState: { errors: rejectionErrors },
  } = useForm<RejectionFormData>({
    resolver: zodResolver(rejectionSchema),
  });

  const fetchApplicationDetails = useCallback(async () => {
    try {
      setLoading(true);
      
      const response = await fetch(`/api/admin/loans/${applicationId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminAccessToken')}`,
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setApplication(data);
        
        // Pre-fill approval form with requested values
        resetApproval({
          approved_amount: data.amount_requested,
          interest_rate: 12.5,
          tenure_months: data.tenure_months_requested,
          processing_fee: 0,
        });
      } else {
        throw new Error('Failed to fetch application details');
      }
    } catch (err) {
      console.error('Application fetch error:', err);
      setError(err instanceof Error ? err.message : 'Failed to load application details');
    } finally {
      setLoading(false);
    }
  }, [applicationId, resetApproval]);

  useEffect(() => {
    if (applicationId) {
      fetchApplicationDetails();
    }
  }, [applicationId, fetchApplicationDetails]);

  const handleApproval = async (data: ApprovalFormData) => {
    try {
      setProcessing(true);
      
      const response = await fetch(`/api/admin/loans/${applicationId}/approve`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('adminAccessToken')}`,
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setApprovalModalOpen(false);
        fetchApplicationDetails(); // Refresh data
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to approve application');
      }
    } catch (err) {
      console.error('Approval error:', err);
      setError(err instanceof Error ? err.message : 'Failed to approve application');
    } finally {
      setProcessing(false);
    }
  };

  const handleRejection = async (data: RejectionFormData) => {
    try {
      setProcessing(true);
      
      const response = await fetch(`/api/admin/loans/${applicationId}/reject`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('adminAccessToken')}`,
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setRejectionModalOpen(false);
        fetchApplicationDetails(); // Refresh data
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to reject application');
      }
    } catch (err) {
      console.error('Rejection error:', err);
      setError(err instanceof Error ? err.message : 'Failed to reject application');
    } finally {
      setProcessing(false);
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

  const canApprove = application?.status === 'under_review' || application?.status === 'requires_documents';
  const canReject = application?.status === 'under_review' || application?.status === 'requires_documents';
  const isApproved = application?.status === 'approved';
  const isRejected = application?.status === 'rejected';

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <LoadingSpinner />
      </Container>
    );
  }

  if (error || !application) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error || 'Application not found'}
        </Alert>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => router.push('/admin/loans')}
        >
          Back to Applications
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
          onClick={() => router.push('/admin/loans')}
          sx={{ mr: 2 }}
        >
          Back
        </Button>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
            Loan Application Details
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Application ID: {application.application_id}
          </Typography>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Left Column */}
        <Grid size={{ xs: 12, lg: 8 }}>
          {/* Application Details */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3 }}>
                Application Information
              </Typography>
              
              <Grid container spacing={3}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Loan Type
                    </Typography>
                    <Chip
                      label={application.loan_type === 'personal' ? 'Personal Loan' : 'Business Loan'}
                      color={application.loan_type === 'personal' ? 'primary' : 'secondary'}
                    />
                  </Box>
                </Grid>
                
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Application Date
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                      {formatDate(application.application_date)}
                    </Typography>
                  </Box>
                </Grid>
                
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Requested Amount
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                      {formatCurrency(application.amount_requested)}
                    </Typography>
                  </Box>
                </Grid>
                
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Requested Tenure
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                      {application.tenure_months_requested} months
                    </Typography>
                  </Box>
                </Grid>

                {application.amount_approved && (
                  <>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="body2" color="text.secondary">
                          Approved Amount
                        </Typography>
                        <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'success.main' }}>
                          {formatCurrency(application.amount_approved)}
                        </Typography>
                      </Box>
                    </Grid>
                    
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="body2" color="text.secondary">
                          Approved Tenure
                        </Typography>
                        <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                          {application.tenure_months_final} months
                        </Typography>
                      </Box>
                    </Grid>
                  </>
                )}

                {application.interest_rate && (
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary">
                        Interest Rate
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                        {application.interest_rate}% per annum
                      </Typography>
                    </Box>
                  </Grid>
                )}

                {application.processing_fee && (
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary">
                        Processing Fee
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                        {formatCurrency(application.processing_fee)}
                      </Typography>
                    </Box>
                  </Grid>
                )}
              </Grid>
            </CardContent>
          </Card>

          {/* User Information */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3 }}>
                Applicant Information
              </Typography>
              
              <Grid container spacing={3}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Full Name
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                      {application.user.full_name}
                    </Typography>
                  </Box>
                </Grid>
                
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Email
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                      {application.user.email}
                    </Typography>
                  </Box>
                </Grid>
                
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Phone Number
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                      {application.user.phone_number}
                    </Typography>
                  </Box>
                </Grid>
                
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Address
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                      {application.user.address_line1 || 'N/A'}
                      {application.user.city && `, ${application.user.city}`}
                      {application.user.pincode && ` - ${application.user.pincode}`}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* Documents */}
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3 }}>
                Submitted Documents
              </Typography>
              
              {Object.keys(application.documents_submitted).length === 0 ? (
                <Typography variant="body2" color="text.secondary">
                  No documents submitted yet.
                </Typography>
              ) : (
                <List>
                  {Object.entries(application.documents_submitted).map(([docType, docUrl]) => (
                    <ListItem key={docType} sx={{ px: 0 }}>
                      <ListItemIcon>
                        <Description />
                      </ListItemIcon>
                      <ListItemText
                        primary={docType.replace('_', ' ').toUpperCase()}
                        secondary={docUrl}
                      />
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => window.open(docUrl, '_blank')}
                      >
                        View
                      </Button>
                    </ListItem>
                  ))}
                </List>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Right Column */}
        <Grid size={{ xs: 12, lg: 4 }}>
          {/* Current Status */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                Current Status
              </Typography>
              <StatusBadge status={application.status} size="medium" />
            </CardContent>
          </Card>

          {/* Actions */}
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3 }}>
                Actions
              </Typography>
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {canApprove && (
                  <Button
                    variant="contained"
                    color="success"
                    startIcon={<CheckCircle />}
                    onClick={() => setApprovalModalOpen(true)}
                    fullWidth
                  >
                    Approve Application
                  </Button>
                )}
                
                {canReject && (
                  <Button
                    variant="contained"
                    color="error"
                    startIcon={<Cancel />}
                    onClick={() => setRejectionModalOpen(true)}
                    fullWidth
                  >
                    Reject Application
                  </Button>
                )}
                
                {isApproved && (
                  <Button
                    variant="contained"
                    color="success"
                    startIcon={<CheckCircle />}
                    disabled
                    fullWidth
                  >
                    Application Approved
                  </Button>
                )}
                
                {isRejected && (
                  <Button
                    variant="contained"
                    color="error"
                    startIcon={<Cancel />}
                    disabled
                    fullWidth
                  >
                    Application Rejected
                  </Button>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Approval Modal */}
      <Modal
        open={approvalModalOpen}
        onClose={() => setApprovalModalOpen(false)}
        title="Approve Loan Application"
        maxWidth="sm"
      >
        <Box component="form" onSubmit={handleApprovalSubmit(handleApproval)}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Input
              {...registerApproval('approved_amount', { valueAsNumber: true })}
              label="Approved Amount"
              type="number"
              fullWidth
              required
              error={!!approvalErrors.approved_amount}
              helperText={approvalErrors.approved_amount?.message}
            />
            
            <Input
              {...registerApproval('interest_rate', { valueAsNumber: true })}
              label="Interest Rate (%)"
              type="number"
              fullWidth
              required
              error={!!approvalErrors.interest_rate}
              helperText={approvalErrors.interest_rate?.message}
            />
            
            <Input
              {...registerApproval('tenure_months', { valueAsNumber: true })}
              label="Tenure (Months)"
              type="number"
              fullWidth
              required
              error={!!approvalErrors.tenure_months}
              helperText={approvalErrors.tenure_months?.message}
            />
            
            <Input
              {...registerApproval('processing_fee', { valueAsNumber: true })}
              label="Processing Fee"
              type="number"
              fullWidth
              error={!!approvalErrors.processing_fee}
              helperText={approvalErrors.processing_fee?.message}
            />
            
            <Input
              {...registerApproval('remarks')}
              label="Remarks (Optional)"
              multiline
              rows={3}
              fullWidth
              error={!!approvalErrors.remarks}
              helperText={approvalErrors.remarks?.message}
            />
          </Box>
          
          <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
            <Button
              type="button"
              variant="outlined"
              onClick={() => setApprovalModalOpen(false)}
              fullWidth
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="success"
              loading={processing}
              fullWidth
            >
              Approve Application
            </Button>
          </Box>
        </Box>
      </Modal>

      {/* Rejection Modal */}
      <Modal
        open={rejectionModalOpen}
        onClose={() => setRejectionModalOpen(false)}
        title="Reject Loan Application"
        maxWidth="sm"
      >
        <Box component="form" onSubmit={handleRejectionSubmit(handleRejection)}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Input
              {...registerRejection('reason')}
              label="Rejection Reason"
              fullWidth
              required
              error={!!rejectionErrors.reason}
              helperText={rejectionErrors.reason?.message}
            />
            
            <Input
              {...registerRejection('remarks')}
              label="Additional Remarks (Optional)"
              multiline
              rows={3}
              fullWidth
              error={!!rejectionErrors.remarks}
              helperText={rejectionErrors.remarks?.message}
            />
          </Box>
          
          <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
            <Button
              type="button"
              variant="outlined"
              onClick={() => setRejectionModalOpen(false)}
              fullWidth
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="error"
              loading={processing}
              fullWidth
            >
              Reject Application
            </Button>
          </Box>
        </Box>
      </Modal>
    </Container>
  );
}
