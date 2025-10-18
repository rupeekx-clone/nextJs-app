'use client';

import { Container, Typography, Box, TextField, Button, Grid, Paper, FormControl, InputLabel, Select, MenuItem, Card, CardContent, Accordion, AccordionSummary, AccordionDetails, Alert, Chip, Divider } from '@mui/material';
import { ExpandMore, Support, CheckCircle, Info, Warning, Error } from '@mui/icons-material';
import { useState } from 'react';
// import { useRouter } from 'next/navigation';

export default function RaiseRequestPage() {
  //  const router = useRouter();
  const [formData, setFormData] = useState({
    userType: '',
    fullName: '',
    email: '',
    phone: '',
    customerId: '',
    requestType: '',
    priority: '',
    subject: '',
    description: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const userTypes = [
    { value: 'customer', label: 'Existing Customer' },
    { value: 'guest', label: 'Guest User' },
    { value: 'prospect', label: 'Prospective Customer' }
  ];

  const requestTypes = [
    { value: 'loan_inquiry', label: 'Loan Inquiry', icon: <Info color="primary" /> },
    { value: 'account_issue', label: 'Account Issue', icon: <Warning color="warning" /> },
    { value: 'membership_question', label: 'Membership Question', icon: <CheckCircle color="success" /> },
    { value: 'technical_support', label: 'Technical Support', icon: <Error color="error" /> },
    { value: 'payment_issue', label: 'Payment Issue', icon: <Warning color="warning" /> },
    { value: 'document_help', label: 'Document Upload Help', icon: <Info color="primary" /> },
    { value: 'feedback', label: 'Feedback & Suggestions', icon: <CheckCircle color="success" /> },
    { value: 'other', label: 'Other', icon: <Support color="action" /> }
  ];

  const priorityLevels = [
    { value: 'low', label: 'Low', color: 'success' },
    { value: 'medium', label: 'Medium', color: 'warning' },
    { value: 'high', label: 'High', color: 'error' },
    { value: 'urgent', label: 'Urgent', color: 'error' }
  ];

  const faqs = [
    {
      question: "How long does it take to process a loan application?",
      answer: "Personal loans are typically processed within 30 minutes to 24 hours, while business loans may take 24-48 hours for approval."
    },
    {
      question: "What documents are required for loan application?",
      answer: "You'll need PAN card, Aadhaar card, bank statements (last 6 months), salary slips (for salaried), and ITR/Form 16."
    },
    {
      question: "How can I check my loan application status?",
      answer: "You can check your application status by logging into your dashboard or contacting our support team."
    },
    {
      question: "What are the interest rates for loans?",
      answer: "Interest rates start from 10.25% for personal loans and 11.5% for business loans, depending on your profile and loan amount."
    },
    {
      question: "How do I upload documents?",
      answer: "You can upload documents through your dashboard under the 'Documents' section. Supported formats are JPG, PNG, and PDF."
    },
    {
      question: "What is the membership card benefit?",
      answer: "Membership cards provide faster processing, priority support, exclusive offers, and document assistance for your loan applications."
    }
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      // Here you would integrate with your support ticket API
      console.log('Submitting support request:', formData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setSubmitStatus('success');
      
      // Reset form after successful submission
      setTimeout(() => {
        setFormData({
          userType: '',
          fullName: '',
          email: '',
          phone: '',
          customerId: '',
          requestType: '',
          priority: '',
          subject: '',
          description: ''
        });
        setSubmitStatus('idle');
      }, 3000);
      
    } catch (error) {
      console.error('Error submitting request:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 3, sm: 4, md: 6 } }}>
      {/* Header Section */}
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold', mb: 2 }}>
          Raise a Request
        </Typography>
        <Typography variant="h6" component="p" gutterBottom sx={{ color: 'text.secondary', mb: 3 }}>
          We&apos;re here to help! Submit your request and our support team will get back to you within 24 hours.
        </Typography>
      </Box>

      <Grid container spacing={4}>
        {/* Support Form */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Paper elevation={3} sx={{ p: { xs: 2, sm: 3, md: 4 }, borderRadius: 2, boxShadow: '0 8px 24px rgba(0,0,0,0.12)' }}>
            <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
              Submit Your Request
            </Typography>
            
            {submitStatus === 'success' && (
              <Alert severity="success" sx={{ mb: 3 }}>
                Your request has been submitted successfully! We&apos;ll get back to you within 24 hours.
              </Alert>
            )}
            
            {submitStatus === 'error' && (
              <Alert severity="error" sx={{ mb: 3 }}>
                There was an error submitting your request. Please try again or contact us directly.
              </Alert>
            )}
            
            <Box component="form" onSubmit={handleSubmit} noValidate>
              <Grid container spacing={3}>
                {/* User Type Selection */}
                <Grid size={{ xs: 12 }}>
                  <FormControl fullWidth required>
                    <InputLabel id="user-type-label">I am a</InputLabel>
                    <Select 
                      labelId="user-type-label" 
                      label="I am a" 
                      name="userType" 
                      value={formData.userType}
                      onChange={(e) => handleInputChange('userType', e.target.value)}
                    >
                      {userTypes.map(type => (
                        <MenuItem key={type.value} value={type.value}>
                          {type.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                {/* Personal Information */}
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField 
                    fullWidth 
                    label="Full Name" 
                    name="fullName" 
                    value={formData.fullName}
                    onChange={(e) => handleInputChange('fullName', e.target.value)}
                    required 
                    autoComplete="name" 
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField 
                    fullWidth 
                    label="Email Address" 
                    name="email" 
                    type="email" 
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    required 
                    autoComplete="email" 
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField 
                    fullWidth 
                    label="Phone Number" 
                    name="phone" 
                    type="tel" 
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    required 
                    autoComplete="tel" 
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField 
                    fullWidth 
                    label="Customer ID (Optional)" 
                    name="customerId" 
                    value={formData.customerId}
                    onChange={(e) => handleInputChange('customerId', e.target.value)}
                    helperText="If you're an existing customer"
                  />
                </Grid>

                {/* Request Details */}
                <Grid size={{ xs: 12, sm: 6 }}>
                  <FormControl fullWidth required>
                    <InputLabel id="request-type-label">Request Type</InputLabel>
                    <Select 
                      labelId="request-type-label" 
                      label="Request Type" 
                      name="requestType" 
                      value={formData.requestType}
                      onChange={(e) => handleInputChange('requestType', e.target.value)}
                    >
                      {requestTypes.map(type => (
                        <MenuItem key={type.value} value={type.value}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            {type.icon}
                            {type.label}
                          </Box>
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <FormControl fullWidth required>
                    <InputLabel id="priority-label">Priority</InputLabel>
                    <Select 
                      labelId="priority-label" 
                      label="Priority" 
                      name="priority" 
                      value={formData.priority}
                      onChange={(e) => handleInputChange('priority', e.target.value)}
                    >
                      {priorityLevels.map(level => (
                        <MenuItem key={level.value} value={level.value}>
                          <Chip 
                            label={level.label} 
                            color={level.color as 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning'} 
                            size="small" 
                            sx={{ mr: 1 }}
                          />
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <TextField 
                    fullWidth 
                    label="Subject" 
                    name="subject" 
                    value={formData.subject}
                    onChange={(e) => handleInputChange('subject', e.target.value)}
                    required 
                    placeholder="Brief description of your request"
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <TextField
                    fullWidth
                    label="Describe Your Request"
                    name="description"
                    multiline
                    rows={5}
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    required
                    placeholder="Please provide as much detail as possible to help us assist you better."
                  />
                </Grid>
              </Grid>
              
              <Box sx={{ textAlign: 'center', mt: 4, mb: 2 }}>
                <Button 
                  type="submit" 
                  variant="contained" 
                  color="primary" 
                  size="large" 
                  disabled={isSubmitting}
                  sx={{ px: 6, py: 1.5, fontWeight: 'medium' }}
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Request'}
                </Button>
              </Box>
            </Box>
          </Paper>
        </Grid>

        {/* FAQ Section */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ height: 'fit-content' }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                <Support color="primary" />
                Frequently Asked Questions
              </Typography>
              
              {faqs.map((faq, index) => (
                <Accordion key={index} sx={{ mb: 1 }}>
                  <AccordionSummary expandIcon={<ExpandMore />}>
                    <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                      {faq.question}
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography variant="body2" color="text.secondary">
                      {faq.answer}
                    </Typography>
                  </AccordionDetails>
                </Accordion>
              ))}
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card sx={{ mt: 3 }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                Contact Information
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                <strong>Phone:</strong> +91-70263-73808
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                <strong>Email:</strong> info@Blumiq.com
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                <strong>Hours:</strong> Mon-Fri 9AM-6PM
              </Typography>
              <Divider sx={{ my: 2 }} />
              <Typography variant="body2" color="text.secondary">
                For urgent matters, please call us directly. We aim to respond to all requests within 24 hours.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}
