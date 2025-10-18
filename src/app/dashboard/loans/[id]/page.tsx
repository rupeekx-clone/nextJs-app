'use client';

import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Grid, Card, CardContent, Alert, Button, Chip, Divider, Paper } from '@mui/material';
import { ArrowBack, Download, Upload, CheckCircle, Cancel, Info } from '@mui/icons-material';
import StatusStepper from '@/components/Dashboard/StatusStepper';
import LoadingSpinner from '@/components/Common/LoadingSpinner';
import { useRouter } from 'next/navigation';

interface LoanApplication {
  application_id: string;
  loan_type: 'personal' | 'business';
  amount_requested: number;
  amount_approved?: number;
  status: string;
  application_date: string;
  approved_date?: string;
  bank_partner?: string;
  interest_rate?: number;
  tenure_months?: number;
  processing_fee?: number;
  purpose: string;
  employment_type: string;
  monthly_income: number;
  company_name: string;
  work_experience: number;
  address: {
    street: string;
    city: string;
    state: string;
    pincode: string;
    country: string;
  };
  admin_remarks?: string;
  rejection_reason?: string;
  documents: Array<{
    type: string;
    url: string;
    uploaded_at: string;
    verified: boolean;
  }>;
}

interface UserProfile {
  full_name: string;
  email: string;
  phone_number: string;
}

export default function LoanDetailPage({ params }: { params: { id: string } }) {
  const [application, setApplication] = useState<LoanApplication | null>(null);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetchLoanDetails();
  }, [params.id]);

  const fetchLoanDetails = async () => {
    try {
      setLoading(true);
      
      const response = await fetch(`/api/loans/${params.id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch loan details');
      }
      
      const data = await response.json();
      setApplication(data);
      setUser(data.user_details || null);

    } catch (err) {
      console.error('Loan details fetch error:', err);
      setError(err instanceof Error ? err.message : 'Failed to load loan details');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    router.push('/dashboard');
  };

  const handleAcceptOffer = () => {
    // Implement accept offer logic
    console.log('Accepting loan offer...');
  };

  const handleRejectOffer = () => {
    // Implement reject offer logic
    console.log('Rejecting loan offer...');
  };

  const handleCancelApplication = () => {
    // Implement cancel application logic
    console.log('Cancelling application...');
  };

  const handleDownloadDocuments = () => {
    // Implement download all documents logic
    console.log('Downloading all documents...');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'success';
      case 'rejected': return 'error';
      case 'under_review': return 'warning';
      case 'submitted': return 'info';
      case 'requires_documents': return 'warning';
      case 'disbursed': return 'success';
      case 'closed': return 'default';
      case 'cancelled': return 'error';
      default: return 'default';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const calculateEMI = (principal: number, rate: number, months: number) => {
    const monthlyRate = rate / 100 / 12;
    const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) / 
                (Math.pow(1 + monthlyRate, months) - 1);
    return Math.round(emi);
  };

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
          {error || 'Loan application not found'}
        </Alert>
        <Button startIcon={<ArrowBack />} onClick={handleBack}>
          Back to Dashboard
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Button 
          startIcon={<ArrowBack />} 
          onClick={handleBack}
          sx={{ mb: 2 }}
        >
          Back to Dashboard
        </Button>
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
              Loan Application #{application.application_id}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Chip 
                label={application.status.replace('_', ' ').toUpperCase()} 
                color={getStatusColor(application.status) as any}
                size="medium"
              />
              <Typography variant="body2" color="text.secondary">
                Applied on {new Date(application.application_date).toLocaleDateString()}
              </Typography>
            </Box>
          </Box>
          
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              variant="outlined"
              startIcon={<Download />}
              onClick={handleDownloadDocuments}
            >
              Download Documents
            </Button>
          </Box>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {/* Left Column */}
        <Grid size={{ xs: 12, lg: 8 }}>
          {/* Application Status Stepper */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3 }}>
                Application Status
              </Typography>
              <StatusStepper 
                status={application.status}
                applicationDate={application.application_date}
                approvedDate={application.approved_date}
              />
            </CardContent>
          </Card>

          {/* Loan Details */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3 }}>
                Loan Details
              </Typography>
              
              <Grid container spacing={3}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Loan Type
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                      {application.loan_type === 'personal' ? 'Personal Loan' : 'Business Loan'}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Amount Requested
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                      {formatCurrency(application.amount_requested)}
                    </Typography>
                  </Box>
                  
                  {application.amount_approved && (
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary">
                        Amount Approved
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 'medium', color: 'success.main' }}>
                        {formatCurrency(application.amount_approved)}
                      </Typography>
                    </Box>
                  )}
                </Grid>
                
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Purpose
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                      {application.purpose}
                    </Typography>
                  </Box>
                  
                  {application.interest_rate && (
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary">
                        Interest Rate
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                        {application.interest_rate}% per annum
                      </Typography>
                    </Box>
                  )}
                  
                  {application.tenure_months && (
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary">
                        Loan Tenure
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                        {application.tenure_months} months
                      </Typography>
                    </Box>
                  )}
                </Grid>
              </Grid>

              {/* EMI Calculation */}
              {application.amount_approved && application.interest_rate && application.tenure_months && (
                <Paper sx={{ p: 3, mt: 3, bgcolor: 'grey.50' }}>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                    EMI Calculation
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                    {formatCurrency(calculateEMI(application.amount_approved, application.interest_rate, application.tenure_months))}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Monthly EMI for {application.tenure_months} months
                  </Typography>
                </Paper>
              )}
            </CardContent>
          </Card>

          {/* Personal Information */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3 }}>
                Personal Information
              </Typography>
              
              <Grid container spacing={3}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Full Name
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                      {user?.full_name}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Email
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                      {user?.email}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Phone Number
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                      {user?.phone_number}
                    </Typography>
                  </Box>
                </Grid>
                
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Employment Type
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                      {application.employment_type === 'salaried' ? 'Salaried' : 'Self-Employed'}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Monthly Income
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                      {formatCurrency(application.monthly_income)}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Work Experience
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                      {application.work_experience} years
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* Document Management Section */}
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3 }}>
                Document Management
              </Typography>
              
              {application.documents && application.documents.length > 0 ? (
                <Box>
                  {application.documents.map((doc, index) => (
                    <Box key={index} sx={{ mb: 2, p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 'medium' }}>
                          {doc.type.replace('_', ' ').toUpperCase()}
                        </Typography>
                        <Chip 
                          label={doc.verified ? 'Verified' : 'Pending'} 
                          color={doc.verified ? 'success' : 'warning'}
                          size="small"
                        />
                      </Box>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        Uploaded: {new Date(doc.uploaded_at).toLocaleDateString()}
                      </Typography>
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => window.open(doc.url, '_blank')}
                      >
                        View Document
                      </Button>
                    </Box>
                  ))}
                </Box>
              ) : (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <Typography variant="body1" color="text.secondary">
                    No documents uploaded yet.
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    Documents will appear here once uploaded.
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Right Column */}
        <Grid size={{ xs: 12, lg: 4 }}>
          {/* Admin Remarks */}
          {application.admin_remarks && (
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                  Admin Remarks
                </Typography>
                <Alert severity="info" icon={<Info />}>
                  {application.admin_remarks}
                </Alert>
              </CardContent>
            </Card>
          )}

          {/* Rejection Reason */}
          {application.rejection_reason && (
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                  Rejection Reason
                </Typography>
                <Alert severity="error" icon={<Cancel />}>
                  {application.rejection_reason}
                </Alert>
              </CardContent>
            </Card>
          )}

          {/* Actions */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3 }}>
                Actions
              </Typography>
              
              {application.status === 'approved' && (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Button
                    variant="contained"
                    startIcon={<CheckCircle />}
                    onClick={handleAcceptOffer}
                    fullWidth
                  >
                    Accept Loan Offer
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<Cancel />}
                    onClick={handleRejectOffer}
                    fullWidth
                  >
                    Reject Loan Offer
                  </Button>
                </Box>
              )}
              
              {application.status === 'submitted' && (
                <Button
                  variant="outlined"
                  startIcon={<Cancel />}
                  onClick={handleCancelApplication}
                  fullWidth
                >
                  Cancel Application
                </Button>
              )}
              
              {application.status === 'requires_documents' && (
                <Alert severity="warning" sx={{ mb: 2 }}>
                  Please upload the required documents to continue processing your application.
                </Alert>
              )}
            </CardContent>
          </Card>

          {/* Bank Partner */}
          {application.bank_partner && (
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                  Bank Partner
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                  {application.bank_partner}
                </Typography>
              </CardContent>
            </Card>
          )}
        </Grid>
      </Grid>
    </Container>
  );
}