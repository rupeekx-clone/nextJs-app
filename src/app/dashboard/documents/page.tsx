'use client';

import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Grid, 
  Button, 
  Chip, 
  Paper, 
  LinearProgress, 
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Collapse,
  Divider,
  Alert,
  Card,
  CardContent,
} from '@mui/material';
import { 
  ArrowBack, 
  CloudUpload, 
  Download, 
  Delete, 
  CheckCircle, 
  Error, 
  Info,
  ExpandMore,
  ExpandLess,
  Description,
} from '@mui/icons-material';
import DocumentUpload from '@/components/Dashboard/DocumentUpload';
import LoadingSpinner from '@/components/Common/LoadingSpinner';
import { useRouter } from 'next/navigation';
import { useAppSelector } from '@/store/hooks';
import { documentActions } from '@/actions/document';
import { LoaderKeys } from '@/actions/shared/constants';

interface Document {
  id: string;
  type: string;
  name: string;
  url: string;
  uploaded_at: string;
  verified: boolean;
  size: number;
  status: 'uploaded' | 'verified' | 'rejected' | 'pending';
}

interface DocumentType {
  id: string;
  name: string;
  description: string;
  required: boolean;
  accepted_formats: string[];
  max_size_mb: number;
}

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [documentTypes, setDocumentTypes] = useState<DocumentType[]>([]);
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const router = useRouter();
  const isLoading = useAppSelector(state => state.ui.activeLoaders[LoaderKeys.DOCUMENT_LOADING] || false);

  const toggleExpanded = (docTypeId: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(docTypeId)) {
      newExpanded.delete(docTypeId);
    } else {
      newExpanded.add(docTypeId);
    }
    setExpandedItems(newExpanded);
  };

  const fetchDocuments = async () => {
    try {
      const result = await documentActions.getMyDocuments.execute();
      
      if (result.success && result.data) {
        // Map API response to component Document interface
        const mappedDocuments = (result.data.documents || []).map(doc => ({
          id: doc._id,
          type: doc.document_type,
          name: doc.file_name,
          url: doc.file_url,
          uploaded_at: doc.uploaded_at,
          verified: doc.status === 'approved',
          size: doc.file_size,
          status: doc.status as 'uploaded' | 'verified' | 'rejected' | 'pending',
        }));
        setDocuments(mappedDocuments);
      }
    } catch (err) {
      console.error('Error fetching documents:', err);
    }
  };

  const fetchDocumentTypes = async () => {
    try {
      // Mock document types - in real app, fetch from API
      setDocumentTypes([
        {
          id: 'pan',
          name: 'PAN Card',
          description: 'Permanent Account Number card',
          required: true,
          accepted_formats: ['pdf', 'jpg', 'jpeg', 'png'],
          max_size_mb: 5
        },
        {
          id: 'aadhar',
          name: 'Aadhar Card',
          description: 'Aadhar card (front and back)',
          required: true,
          accepted_formats: ['pdf', 'jpg', 'jpeg', 'png'],
          max_size_mb: 5
        },
        {
          id: 'bank_statement',
          name: 'Bank Statement',
          description: 'Last 6 months bank statement',
          required: true,
          accepted_formats: ['pdf'],
          max_size_mb: 10
        },
        {
          id: 'salary_slip',
          name: 'Salary Slips',
          description: 'Last 3 months salary slips',
          required: true,
          accepted_formats: ['pdf', 'jpg', 'jpeg', 'png'],
          max_size_mb: 5
        },
        {
          id: 'itr',
          name: 'ITR/Form 16',
          description: 'Income Tax Return or Form 16',
          required: true,
          accepted_formats: ['pdf'],
          max_size_mb: 10
        },
        {
          id: 'address_proof',
          name: 'Address Proof',
          description: 'Utility bill, rental agreement, etc.',
          required: true,
          accepted_formats: ['pdf', 'jpg', 'jpeg', 'png'],
          max_size_mb: 5
        },
        {
          id: 'employment_certificate',
          name: 'Employment Certificate',
          description: 'Employment verification letter',
          required: false,
          accepted_formats: ['pdf', 'jpg', 'jpeg', 'png'],
          max_size_mb: 5
        },
        {
          id: 'business_registration',
          name: 'Business Registration',
          description: 'GST certificate, business license',
          required: false,
          accepted_formats: ['pdf', 'jpg', 'jpeg', 'png'],
          max_size_mb: 5
        }
      ]);
    } catch (err) {
      console.error('Error fetching document types:', err);
    }
  };

  const handleBack = () => {
    router.push('/dashboard');
  };

  // const handleUploadSuccess = (documentType: string, document: any) => {
  //   setDocuments(prev => [...prev, document]);
  // };

  const handleDeleteDocument = async (documentId: string) => {
    try {
      const response = await fetch(`/api/documents/${documentId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });
      
      if (response.ok) {
        setDocuments(prev => prev.filter(doc => doc.id !== documentId));
      }
    } catch (err) {
      console.error('Error deleting document:', err);
    }
  };

  const handleDownloadDocument = (document: Document) => {
    // Open document in new tab
    window.open(document.url, '_blank');
  };

  const getDocumentStatusColor = (status: string) => {
    switch (status) {
      case 'verified': return 'success';
      case 'rejected': return 'error';
      case 'pending': return 'warning';
      default: return 'default';
    }
  };

  const getDocumentStatusIcon = (status: string) => {
    switch (status) {
      case 'verified': return <CheckCircle />;
      case 'rejected': return <Error />;
      case 'pending': return <Info />;
      default: return <CloudUpload />;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getCompletionPercentage = () => {
    const requiredTypes = documentTypes.filter(type => type.required);
    const uploadedRequired = documents.filter(doc => 
      requiredTypes.some(type => type.id === doc.type) && doc.status !== 'rejected'
    );
    return Math.round((uploadedRequired.length / requiredTypes.length) * 100);
  };

  
  useEffect(() => {
    fetchDocuments();
    fetchDocumentTypes();
  }, []);


  if (isLoading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <LoadingSpinner />
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
        
        <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 2 }}>
          Document Management
        </Typography>
        
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Upload and manage your loan application documents. All required documents must be verified before your loan can be processed.
        </Typography>

        {/* Progress Bar */}
        <Paper sx={{ p: 3, mb: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              Document Completion
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
              {getCompletionPercentage()}%
            </Typography>
          </Box>
          <LinearProgress 
            variant="determinate" 
            value={getCompletionPercentage()} 
            sx={{ height: 8, borderRadius: 4 }}
          />
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            {documents.filter(doc => documentTypes.find(type => type.id === doc.type)?.required && doc.status !== 'rejected').length} of {documentTypes.filter(type => type.required).length} required documents uploaded
          </Typography>
        </Paper>
      </Box>

      <Grid container spacing={3}>
        {/* Document List */}
        <Grid size={{ xs: 12, lg: 8 }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3 }}>
            Document List
          </Typography>
          
          <Paper sx={{ overflow: 'hidden' }}>
            <List sx={{ p: 0 }}>
              {documentTypes.map((docType, index) => {
              const uploadedDoc = documents.find(doc => doc.type === docType.id);
              const isRequired = docType.required;
                const isExpanded = expandedItems.has(docType.id);
                const hasUploadedDoc = !!uploadedDoc;
              
              return (
                  <React.Fragment key={docType.id}>
                    <ListItem
                    sx={{ 
                        borderLeft: isRequired ? '4px solid' : '4px solid transparent',
                        borderLeftColor: isRequired ? 'primary.main' : 'transparent',
                        '&:hover': {
                          backgroundColor: 'action.hover',
                        },
                        cursor: 'pointer',
                      }}
                      onClick={() => toggleExpanded(docType.id)}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
                        <Description sx={{ color: 'primary.main', mr: 1 }} />
                      </Box>
                      
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                              {docType.name}
                            </Typography>
                    {isRequired && (
                      <Chip 
                        label="Required" 
                        size="small" 
                        color="primary" 
                                variant="outlined"
                              />
                            )}
                            {hasUploadedDoc && (
                            <Chip 
                              label={uploadedDoc.status} 
                              size="small" 
                              color={getDocumentStatusColor(uploadedDoc.status) as 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning'}
                                icon={getDocumentStatusIcon(uploadedDoc.status)}
                            />
                            )}
                          </Box>
                        }
                        secondary={
                          <Box>
                            <Typography variant="body2" color="text.secondary">
                              {docType.description}
                            </Typography>
                            {hasUploadedDoc && (
                              <Typography variant="caption" color="text.secondary">
                                {uploadedDoc.name} • {formatFileSize(uploadedDoc.size)} • {new Date(uploadedDoc.uploaded_at).toLocaleDateString()}
                              </Typography>
                            )}
                          </Box>
                        }
                      />
                      
                      <ListItemSecondaryAction>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          {hasUploadedDoc && (
                            <>
                              <IconButton
                                size="small"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDownloadDocument(uploadedDoc);
                                }}
                                color="primary"
                              >
                                <Download />
                              </IconButton>
                              <IconButton
                                size="small"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteDocument(uploadedDoc.id);
                                }}
                                color="error"
                              >
                                <Delete />
                              </IconButton>
                            </>
                          )}
                          <IconButton
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleExpanded(docType.id);
                            }}
                          >
                            {isExpanded ? <ExpandLess /> : <ExpandMore />}
                          </IconButton>
                        </Box>
                      </ListItemSecondaryAction>
                    </ListItem>
                    
                    <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                      <Box sx={{ px: 3, pb: 2, bgcolor: 'grey.50' }}>
                        <Divider sx={{ mb: 2 }} />
                        
                        <Typography variant="subtitle2" gutterBottom>
                          Document Requirements
                        </Typography>
                        
                        <Box sx={{ mb: 2 }}>
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                            <strong>Accepted formats:</strong> {docType.accepted_formats.join(', ').toUpperCase()}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            <strong>Maximum size:</strong> {docType.max_size_mb}MB
                          </Typography>
                        </Box>
                        
                        {hasUploadedDoc ? (
                          <Alert severity="success" sx={{ mb: 2 }}>
                            Document uploaded successfully. Status: {uploadedDoc.status}
                          </Alert>
                      ) : (
                          <Box>
                            <Typography variant="subtitle2" gutterBottom>
                              Upload Document
                            </Typography>
                        <DocumentUpload
                          documentType={docType.id}
                          acceptedFormats={docType.accepted_formats}
                          maxSizeMB={docType.max_size_mb}
                        />
                          </Box>
                      )}
                      </Box>
                    </Collapse>
                    
                    {index < documentTypes.length - 1 && <Divider />}
                  </React.Fragment>
              );
            })}
            </List>
          </Paper>
        </Grid>

        {/* Uploaded Documents Summary */}
        <Grid size={{ xs: 12, lg: 4 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3 }}>
                Uploaded Documents
              </Typography>
              
              {documents.length === 0 ? (
                <Typography variant="body2" color="text.secondary">
                  No documents uploaded yet.
                </Typography>
              ) : (
                <Box>
                  {documents.map((document, index) => (
                    <Box key={document.id}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Box sx={{ 
                          width: 8, 
                          height: 8, 
                          borderRadius: '50%', 
                          bgcolor: document.status === 'verified' ? 'success.main' : 
                                  document.status === 'rejected' ? 'error.main' : 'warning.main',
                          mr: 1
                        }} />
                        <Typography variant="body2" sx={{ fontWeight: 'medium', flex: 1 }}>
                          {document.name}
                        </Typography>
                        <Chip 
                          label={document.status} 
                          size="small" 
                          color={getDocumentStatusColor(document.status) as 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning'}
                        />
                      </Box>
                      
                      <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
                        {documentTypes.find(type => type.id === document.type)?.name} • {formatFileSize(document.size)}
                      </Typography>
                      
                      {index < documents.length - 1 && (
                        <Divider sx={{ my: 2 }} />
                      )}
                    </Box>
                  ))}
                </Box>
              )}
            </CardContent>
          </Card>

          {/* Tips */}
          <Card sx={{ mt: 3 }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                Upload Tips
              </Typography>
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  • Ensure documents are clear and readable
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  • Upload original documents, not photocopies
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  • Keep file sizes under the specified limits
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  • Use supported file formats only
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  • All required documents must be verified
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}