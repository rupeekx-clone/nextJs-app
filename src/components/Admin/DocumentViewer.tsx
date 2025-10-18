'use client';

import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  IconButton,
  Chip,
  LinearProgress,
  Alert,
} from '@mui/material';
import Image from 'next/image';
import {
  Close,
  Download,
  ZoomIn,
  ZoomOut,
  RotateRight,
  // Fullscreen,
  CheckCircle,
  Cancel,
} from '@mui/icons-material';

interface DocumentViewerProps {
  open: boolean;
  onClose: () => void;
  document: {
    id: string;
    name: string;
    type: string;
    url: string;
    verified?: boolean;
    uploadedAt: string;
  };
  onVerify?: (documentId: string, verified: boolean) => void;
  showVerification?: boolean;
}

const DocumentViewer: React.FC<DocumentViewerProps> = ({
  open,
  onClose,
  document,
  onVerify,
  showVerification = false,
}) => {
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 0.25, 3));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 0.25, 0.5));
  };

  const handleRotate = () => {
    setRotation(prev => (prev + 90) % 360);
  };

  const handleDownload = () => {
    const link = window.document.createElement('a');
    if (link) {
      link.href = document.url;
      link.download = document.name;
      link.target = '_blank';
      window.document.body.appendChild(link);
      link.click();
      window.document.body.removeChild(link);
    }
  };

  const handleVerify = (verified: boolean) => {
    if (onVerify) {
      onVerify(document.id, verified);
    }
  };

  const handleImageLoad = () => {
    setLoading(false);
    setError(null);
  };

  const handleImageError = () => {
    setLoading(false);
    setError('Failed to load document');
  };

  const isImage = document.type.startsWith('image/');
  const isPdf = document.type === 'application/pdf';

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: {
          height: '90vh',
          maxHeight: '90vh',
        }
      }}
    >
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            {document.name}
          </Typography>
          <Chip
            label={document.type}
            size="small"
            color="primary"
            variant="outlined"
          />
          {document.verified !== undefined && (
            <Chip
              label={document.verified ? 'Verified' : 'Pending'}
              size="small"
              color={document.verified ? 'success' : 'warning'}
              icon={document.verified ? <CheckCircle /> : <Cancel />}
            />
          )}
        </Box>
        <IconButton onClick={onClose}>
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 0, position: 'relative', overflow: 'hidden' }}>
        {loading && (
          <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 1 }}>
            <LinearProgress />
          </Box>
        )}

        {error ? (
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
            <Button variant="outlined" onClick={() => window.open(document.url, '_blank')}>
              Open in New Tab
            </Button>
          </Box>
        ) : (
          <Box
            sx={{
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#f5f5f5',
              position: 'relative',
            }}
          >
            {isImage ? (
              <Image
                src={document.url}
                alt={document.name}
                onLoad={handleImageLoad}
                onError={handleImageError}
                width={800}
                height={600}
                style={{
                  maxWidth: '100%',
                  maxHeight: '100%',
                  transform: `scale(${zoom}) rotate(${rotation}deg)`,
                  transition: 'transform 0.3s ease',
                  cursor: 'pointer',
                }}
                onClick={() => setZoom(zoom === 1 ? 2 : 1)}
              />
            ) : isPdf ? (
              <iframe
                src={document.url}
                width="100%"
                height="100%"
                style={{ border: 'none' }}
                onLoad={handleImageLoad}
                onError={handleImageError}
              />
            ) : (
              <Box sx={{ textAlign: 'center', p: 3 }}>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Document Preview Not Available
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  This file type cannot be previewed. Please download to view.
                </Typography>
                <Button variant="contained" onClick={handleDownload}>
                  Download Document
                </Button>
              </Box>
            )}
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 2, gap: 1 }}>
        {/* Document Controls */}
        <Box sx={{ display: 'flex', gap: 1, mr: 'auto' }}>
          {isImage && (
            <>
              <IconButton onClick={handleZoomOut} disabled={zoom <= 0.5}>
                <ZoomOut />
              </IconButton>
              <IconButton onClick={handleZoomIn} disabled={zoom >= 3}>
                <ZoomIn />
              </IconButton>
              <IconButton onClick={handleRotate}>
                <RotateRight />
              </IconButton>
            </>
          )}
          <IconButton onClick={handleDownload}>
            <Download />
          </IconButton>
        </Box>

        {/* Verification Controls */}
        {showVerification && onVerify && document.verified === undefined && (
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              variant="contained"
              color="success"
              startIcon={<CheckCircle />}
              onClick={() => handleVerify(true)}
            >
              Verify
            </Button>
            <Button
              variant="contained"
              color="error"
              startIcon={<Cancel />}
              onClick={() => handleVerify(false)}
            >
              Reject
            </Button>
          </Box>
        )}

        <Button onClick={onClose}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DocumentViewer;
