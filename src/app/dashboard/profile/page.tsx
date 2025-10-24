'use client';

import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  TextField,
  Button,
  Avatar,
  Grid,
  Divider,
  Alert,
  Chip,
  IconButton,
} from '@mui/material';
import {
  PhotoCamera,
  Save,
  Cancel,
  CheckCircle,
} from '@mui/icons-material';
import { useAppSelector } from '@/store/hooks';
import { userActions } from '@/actions/user';
import { LoaderKeys } from '@/actions/shared/constants';
import LoadingButton from '@/components/Common/LoadingButton';

interface ProfileData {
  full_name: string;
  email?: string;
  phone_number: string;
  address_line1?: string;
  address_line2?: string;
  city?: string;
  pincode?: string;
  profile_picture_url?: string;
  email_verified_at?: string;
  phone_verified_at?: string;
}

export default function ProfileSettingsPage() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { user } = useAppSelector(state => state.auth);
  
  const [profileData, setProfileData] = useState<ProfileData>({
    full_name: '',
    email: '',
    phone_number: '',
    address_line1: '',
    address_line2: '',
    city: '',
    pincode: '',
    profile_picture_url: '',
  });
  
  const [originalData, setOriginalData] = useState<ProfileData>(profileData);
  const [hasChanges, setHasChanges] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const isSaving = useAppSelector(state => state.ui.activeLoaders[LoaderKeys.USER_LOADING] || false);
  const isUploading = useAppSelector(state => state.ui.activeLoaders[LoaderKeys.PROFILE_PICTURE_UPLOAD] || false);

  // Load user profile data
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const result = await userActions.getProfile.execute();

        if (result.success && result.data) {
          const data = {
            full_name: result.data.full_name || '',
            email: result.data.email || '',
            phone_number: result.data.phone_number || '',
            address_line1: result.data.address_line1 || '',
            address_line2: result.data.address_line2 || '',
            city: result.data.city || '',
            pincode: result.data.pincode || '',
            profile_picture_url: result.data.profile_picture_url || '',
            email_verified_at: result.data.email_verified_at,
            phone_verified_at: result.data.phone_verified_at,
          };
          setProfileData(data);
          setOriginalData(data);
        }
      } catch (error) {
        console.error('Error loading profile:', error);
        setError('Failed to load profile data');
      }
    };

    loadProfile();
  }, []);

  // Check for changes
  useEffect(() => {
    const changed = JSON.stringify(profileData) !== JSON.stringify(originalData);
    setHasChanges(changed);
  }, [profileData, originalData]);

  const handleInputChange = (field: keyof ProfileData) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setProfileData(prev => ({
      ...prev,
      [field]: event.target.value,
    }));
    setError(null);
    setSuccess(null);
  };

  const handleSaveProfile = async () => {
    setError(null);
    setSuccess(null);

    const result = await userActions.updateProfile.execute({
      full_name: profileData.full_name,
      address_line1: profileData.address_line1,
      address_line2: profileData.address_line2,
      city: profileData.city,
      pincode: profileData.pincode,
    });

    if (result.success) {
      setSuccess('Profile updated successfully!');
      setOriginalData(profileData);
    } else {
      setError(result.error || 'Failed to update profile. Please try again.');
    }
  };

  const handleCancelChanges = () => {
    setProfileData(originalData);
    setError(null);
    setSuccess(null);
  };

  const handleProfilePictureUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (!allowedTypes.includes(file.type)) {
      setError('Invalid file type. Only JPEG, JPG, and PNG files are allowed.');
      return;
    }

    // Validate file size (5MB max)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      setError('File size too large. Maximum size is 5MB.');
      return;
    }

    setError(null);
    setSuccess(null);

    const result = await userActions.uploadProfilePicture.execute({
      profilePicture: file,
    });

    if (result.success && result.data) {
      setProfileData(prev => ({
        ...prev,
        profile_picture_url: result.data!.profile_picture_url,
      }));
      setSuccess('Profile picture updated successfully!');
    } else {
      setError(result.error || 'Failed to upload profile picture. Please try again.');
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold', mb: 4 }}>
        Profile Settings
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 3 }} onClose={() => setSuccess(null)}>
          {success}
        </Alert>
      )}

      <Grid container spacing={4}>
        {/* Profile Picture Section */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h6" gutterBottom>
              Profile Picture
            </Typography>
            
            <Box sx={{ position: 'relative', display: 'inline-block', mb: 2 }}>
              <Avatar
                src={profileData.profile_picture_url}
                sx={{ 
                  width: 120, 
                  height: 120, 
                  mx: 'auto',
                  fontSize: '3rem',
                  bgcolor: 'primary.main'
                }}
              >
                {profileData.full_name?.charAt(0).toUpperCase() || 'U'}
              </Avatar>
              
              <IconButton
                color="primary"
                aria-label="upload picture"
                component="label"
                disabled={isUploading}
                sx={{
                  position: 'absolute',
                  bottom: 0,
                  right: 0,
                  bgcolor: 'background.paper',
                  border: '2px solid',
                  borderColor: 'primary.main',
                  '&:hover': {
                    bgcolor: 'primary.light',
                    color: 'primary.contrastText',
                  },
                }}
              >
                <PhotoCamera />
                <input
                  type="file"
                  hidden
                  accept="image/jpeg,image/jpg,image/png"
                  onChange={handleProfilePictureUpload}
                />
              </IconButton>
            </Box>

            <Typography variant="body2" color="text.secondary">
              Click the camera icon to upload a new profile picture
            </Typography>
            <Typography variant="caption" color="text.secondary" display="block">
              Max size: 5MB • JPG, PNG formats only
            </Typography>
          </Paper>
        </Grid>

        {/* Personal Information Section */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Personal Information
            </Typography>
            
            <Grid container spacing={3}>
              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  label="Full Name"
                  value={profileData.full_name}
                  onChange={handleInputChange('full_name')}
                  variant="outlined"
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="Email"
                  value={profileData.email || ''}
                  disabled
                  variant="outlined"
                  InputProps={{
                    endAdornment: profileData.email_verified_at ? (
                      <Chip
                        icon={<CheckCircle />}
                        label="Verified"
                        color="success"
                        size="small"
                      />
                    ) : (
                      <Chip
                        label="Not Verified"
                        color="default"
                        size="small"
                      />
                    ),
                  }}
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="Phone Number"
                  value={profileData.phone_number}
                  disabled
                  variant="outlined"
                  InputProps={{
                    endAdornment: profileData.phone_verified_at ? (
                      <Chip
                        icon={<CheckCircle />}
                        label="Verified"
                        color="success"
                        size="small"
                      />
                    ) : (
                      <Chip
                        label="Not Verified"
                        color="default"
                        size="small"
                      />
                    ),
                  }}
                />
              </Grid>

              <Grid size={{ xs: 12 }}>
                <Divider sx={{ my: 2 }} />
                <Typography variant="subtitle1" gutterBottom>
                  Address Information
                </Typography>
              </Grid>

              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  label="Address Line 1"
                  value={profileData.address_line1 || ''}
                  onChange={handleInputChange('address_line1')}
                  variant="outlined"
                />
              </Grid>

              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  label="Address Line 2"
                  value={profileData.address_line2 || ''}
                  onChange={handleInputChange('address_line2')}
                  variant="outlined"
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="City"
                  value={profileData.city || ''}
                  onChange={handleInputChange('city')}
                  variant="outlined"
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="Pincode"
                  value={profileData.pincode || ''}
                  onChange={handleInputChange('pincode')}
                  variant="outlined"
                />
              </Grid>
            </Grid>

            {/* Action Buttons */}
            <Box sx={{ mt: 4, display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
              <Button
                variant="outlined"
                startIcon={<Cancel />}
                onClick={handleCancelChanges}
                disabled={!hasChanges || isSaving}
              >
                Cancel
              </Button>
              
              <LoadingButton
                variant="contained"
                startIcon={<Save />}
                loading={isSaving}
                loadingText="Saving..."
                onClick={handleSaveProfile}
                disabled={!hasChanges}
              >
                Save Changes
              </LoadingButton>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}
