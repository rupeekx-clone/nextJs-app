'use client';

import React, { useState, useCallback } from 'react';
import { Box, Typography, Button, LinearProgress, Alert } from '@mui/material';
import { CloudUpload, CheckCircle, Error } from '@mui/icons-material';

interface DocumentUploadProps {
  documentType: string;
  acceptedFormats: string[];
  maxSizeMB: number;
  onUpload?: (file: File) => Promise<{ success: boolean; url?: string; error?: string }>;
  existingUrl?: string;
  onDelete?: () => Promise<void>;
}

const DocumentUpload: React.FC<DocumentUploadProps> = ({
  documentType,
  acceptedFormats,
  maxSizeMB,
  onUpload,
  existingUrl,
  onDelete,
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleFileUpload = useCallback(async (file: File) => {
    // Validate file type
    const allowedMimeTypes = acceptedFormats.map(format => {
      switch (format.toLowerCase()) {
        case 'pdf':
          return 'application/pdf';
        case 'jpg':
        case 'jpeg':
          return 'image/jpeg';
        case 'png':
          return 'image/png';
        case 'doc':
          return 'application/msword';
        case 'docx':
          return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
        default:
          return format;
      }
    });

    if (!allowedMimeTypes.includes(file.type)) {
      setError(`Invalid file type. Accepted formats: ${acceptedFormats.join(', ')}`);
      return;
    }

    // Validate file size
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      setError(`File size exceeds ${maxSizeMB}MB limit`);
      return;
    }

    setError(null);
    setUploading(true);
    setUploadProgress(0);
    setSuccess(false);

    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 100);

      if (onUpload) {
        const result = await onUpload(file);
        clearInterval(progressInterval);
        setUploadProgress(100);
        
        if (result.success) {
          setSuccess(true);
          setTimeout(() => setSuccess(false), 3000);
        } else {
          setError(result.error || 'Upload failed');
        }
      } else {
        // Default upload behavior - just simulate success
        clearInterval(progressInterval);
        setUploadProgress(100);
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      }
    } catch (err) {
      setError(err instanceof Error ? (err as Error).message : 'Upload failed');
    } finally {
      setUploading(false);
    }
  }, [acceptedFormats, maxSizeMB, onUpload]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  }, [handleFileUpload]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileUpload(files[0]);
    }
  };


  const handleDelete = async () => {
    if (onDelete) {
      try {
        await onDelete();
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      } catch (err: unknown) {
        setError(err instanceof Error ? (err as Error).message : 'Delete failed');
      }
    }
  };

  return (
    <Box>
      <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 2 }}>
        {documentType.replace('_', ' ').toUpperCase()}
      </Typography>

      {existingUrl ? (
        <Box sx={{ p: 2, border: '1px solid', borderColor: 'success.main', borderRadius: 1, backgroundColor: 'success.light' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <CheckCircle sx={{ color: 'success.main', mr: 1 }} />
            <Typography variant="body2" color="success.dark">
              Document uploaded successfully
            </Typography>
          </Box>
          <Button
            size="small"
            variant="outlined"
            color="error"
            onClick={handleDelete}
            disabled={uploading}
          >
            Delete Document
          </Button>
        </Box>
      ) : (
        <Box
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          sx={{
            border: '2px dashed',
            borderColor: isDragOver ? 'primary.main' : 'grey.300',
            borderRadius: 2,
            p: 3,
            textAlign: 'center',
            backgroundColor: isDragOver ? 'primary.light' : 'grey.50',
            cursor: 'pointer',
            transition: 'all 0.2s ease-in-out',
            '&:hover': {
              borderColor: 'primary.main',
              backgroundColor: 'primary.light',
            },
          }}
        >
          <CloudUpload sx={{ fontSize: 48, color: 'grey.400', mb: 2 }} />
          
          <Typography variant="body1" sx={{ mb: 1 }}>
            {isDragOver ? 'Drop your file here' : 'Drag and drop your file here'}
          </Typography>
          
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            or click to browse files
          </Typography>
          
          <input
            type="file"
            accept={acceptedFormats.map(format => `.${format}`).join(',')}
            onChange={handleFileSelect}
            style={{ display: 'none' }}
            id={`file-input-${documentType}`}
            disabled={uploading}
          />
          
          <label htmlFor={`file-input-${documentType}`}>
            <Button
              variant="contained"
              component="span"
              disabled={uploading}
              sx={{ mb: 1 }}
            >
              Choose File
            </Button>
          </label>
          
          <Typography variant="caption" display="block" color="text.secondary">
            Supported formats: {acceptedFormats.join(', ').toUpperCase()} (Max {maxSizeMB}MB)
          </Typography>
        </Box>
      )}

      {uploading && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            Uploading... {uploadProgress}%
          </Typography>
          <LinearProgress variant="determinate" value={uploadProgress} />
        </Box>
      )}

      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Error sx={{ mr: 1 }} />
            {error}
          </Box>
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mt: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <CheckCircle sx={{ mr: 1 }} />
            Operation completed successfully
          </Box>
        </Alert>
      )}
    </Box>
  );
};

export default DocumentUpload;
