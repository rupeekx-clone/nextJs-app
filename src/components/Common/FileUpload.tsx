'use client';

import React, { useState, useRef } from 'react';
import { 
  Box, 
  Button, 
  Typography, 
  LinearProgress, 
  Alert,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
  Paper
} from '@mui/material';
import { 
  CloudUpload, 
  InsertDriveFile, 
  Delete, 
  CheckCircle, 
  Error as ErrorIcon 
} from '@mui/icons-material';

interface FileUploadProps {
  onFileSelect: (files: File[]) => void;
  onFileRemove?: (file: File) => void;
  acceptedTypes?: string[];
  maxSize?: number; // in MB
  maxFiles?: number;
  multiple?: boolean;
  disabled?: boolean;
  label?: string;
  description?: string;
  showPreview?: boolean;
  showProgress?: boolean;
  uploadProgress?: { [key: string]: number };
  uploadStatus?: { [key: string]: 'uploading' | 'success' | 'error' };
  uploadedFiles?: File[];
}

const FileUpload: React.FC<FileUploadProps> = ({
  onFileSelect,
  onFileRemove,
  acceptedTypes = ['image/*', 'application/pdf'],
  maxSize = 10, // 10MB
  maxFiles = 5,
  multiple = true,
  disabled = false,
  label = 'Upload Files',
  description = 'Drag and drop files here, or click to select',
  showPreview = true,
  showProgress = true,
  uploadProgress = {},
  uploadStatus = {},
  uploadedFiles = [],
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): string | null => {
    // Check file size
    if (file.size > maxSize * 1024 * 1024) {
      return `File "${file.name}" is too large. Maximum size is ${maxSize}MB.`;
    }

    // Check file type
    if (acceptedTypes.length > 0) {
      const isValidType = acceptedTypes.some(type => {
        if (type.endsWith('/*')) {
          return file.type.startsWith(type.slice(0, -1));
        }
        return file.type === type;
      });

      if (!isValidType) {
        return `File "${file.name}" has an invalid type. Accepted types: ${acceptedTypes.join(', ')}`;
      }
    }

    return null;
  };

  const handleFiles = (files: FileList | null) => {
    if (!files) return;

    setError(null);
    const fileArray = Array.from(files);
    const validFiles: File[] = [];
    const errors: string[] = [];

    // Check max files limit
    if (fileArray.length > maxFiles) {
      errors.push(`Maximum ${maxFiles} files allowed.`);
    }

    // Validate each file
    fileArray.forEach(file => {
      const validationError = validateFile(file);
      if (validationError) {
        errors.push(validationError);
      } else {
        validFiles.push(file);
      }
    });

    if (errors.length > 0) {
      setError(errors.join(' '));
    }

    if (validFiles.length > 0) {
      onFileSelect(validFiles);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (disabled) return;
    
    handleFiles(e.dataTransfer.files);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files);
  };

  const handleButtonClick = () => {
    if (disabled) return;
    fileInputRef.current?.click();
  };

  const handleRemoveFile = (file: File) => {
    if (onFileRemove) {
      onFileRemove(file);
    }
  };

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) {
      return '🖼️';
    } else if (file.type === 'application/pdf') {
      return '📄';
    } else if (file.type.includes('word')) {
      return '📝';
    } else if (file.type.includes('excel') || file.type.includes('spreadsheet')) {
      return '📊';
    } else {
      return '📁';
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <Box>
      {/* Upload Area */}
      <Paper
        sx={{
          p: 3,
          border: '2px dashed',
          borderColor: dragActive ? 'primary.main' : 'divider',
          backgroundColor: dragActive ? 'primary.light' : 'background.paper',
          cursor: disabled ? 'not-allowed' : 'pointer',
          opacity: disabled ? 0.6 : 1,
          transition: 'all 0.3s ease',
          '&:hover': {
            borderColor: disabled ? 'divider' : 'primary.main',
            backgroundColor: disabled ? 'background.paper' : 'primary.light',
          },
        }}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={handleButtonClick}
      >
        <Box sx={{ textAlign: 'center' }}>
          <CloudUpload sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
          <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
            {label}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {description}
          </Typography>
          <Button
            variant="contained"
            disabled={disabled}
            onClick={(e) => {
              e.stopPropagation();
              handleButtonClick();
            }}
          >
            Choose Files
          </Button>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
            Max {maxSize}MB per file • {maxFiles} files max
          </Typography>
        </Box>
      </Paper>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple={multiple}
        accept={acceptedTypes.join(',')}
        onChange={handleFileInputChange}
        style={{ display: 'none' }}
        disabled={disabled}
      />

      {/* Error Display */}
      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}

      {/* File List */}
      {showPreview && uploadedFiles.length > 0 && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>
            Selected Files ({uploadedFiles.length})
          </Typography>
          <List dense>
            {uploadedFiles.map((file, index) => (
              <ListItem
                key={`${file.name}-${index}`}
                sx={{
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 1,
                  mb: 1,
                }}
              >
                <ListItemIcon>
                  <Typography sx={{ fontSize: 24 }}>
                    {getFileIcon(file)}
                  </Typography>
                </ListItemIcon>
                
                <ListItemText
                  primary={file.name}
                  secondary={
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        {formatFileSize(file.size)}
                      </Typography>
                      {showProgress && uploadProgress[file.name] !== undefined && (
                        <Box sx={{ mt: 1 }}>
                          <LinearProgress
                            variant="determinate"
                            value={uploadProgress[file.name]}
                            sx={{ height: 4, borderRadius: 2 }}
                          />
                          <Typography variant="caption" color="text.secondary">
                            {uploadProgress[file.name]}%
                          </Typography>
                        </Box>
                      )}
                      {uploadStatus[file.name] === 'success' && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
                          <CheckCircle sx={{ fontSize: 16, color: 'success.main' }} />
                          <Typography variant="caption" color="success.main">
                            Uploaded successfully
                          </Typography>
                        </Box>
                      )}
                      {uploadStatus[file.name] === 'error' && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
                          <ErrorIcon sx={{ fontSize: 16, color: 'error.main' }} />
                          <Typography variant="caption" color="error.main">
                            Upload failed
                          </Typography>
                        </Box>
                      )}
                    </Box>
                  }
                />
                
                {onFileRemove && (
                  <IconButton
                    size="small"
                    onClick={() => handleRemoveFile(file)}
                    color="error"
                  >
                    <Delete />
                  </IconButton>
                )}
              </ListItem>
            ))}
          </List>
        </Box>
      )}
    </Box>
  );
};

export default FileUpload;
