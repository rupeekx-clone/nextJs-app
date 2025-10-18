'use client'; // For form interactions

import { useState, useEffect, useMemo } from 'react'; // Added useEffect
import { Container, Typography, Box, TextField, Button, Grid, Paper, FormControl, InputLabel, Select, MenuItem, Alert, Stepper, Step, StepLabel, Slider, IconButton, SelectChangeEvent, List, ListItem, Chip, ListItemIcon, ListItemText } from '@mui/material'; // Added SelectChangeEvent
import { Checkbox, FormControlLabel, Card, CardContent, CardMedia } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import UploadFileIcon from '@mui/icons-material/UploadFile'; // Added UploadFileIcon
import CheckCircleOutline from '@mui/icons-material/CheckCircleOutline';


// Define Steps
const steps = ['Loan Explorer', 'Quick Identity Check', 'Smart Employment Profiler', 'Location & Contact', 'Final Review'];

// Loan Explorer Step Component
type LoanExplorerFormData = typeof initialFormData & { customInterestRate: string };
interface LoanExplorerStepProps {
  formData: LoanExplorerFormData;
  handleGenericChange: (field: keyof LoanExplorerFormData, value: unknown) => void;
  loanPurposes: string[];
}

const LoanExplorerStep = ({ formData, handleGenericChange, loanPurposes }: LoanExplorerStepProps) => {
  const [calculatedEMI, setCalculatedEMI] = useState<string>('');

  const handleSliderChange = (_event: Event, newValue: number | number[]) => {
    handleGenericChange('loanAmount', newValue as number);
  };


  const handleCustomTenureFieldChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    if (/^\d*$/.test(value) && value.length <= 3) {
      handleGenericChange('customTenure', value);
    }
  };

  const handleInterestRateChange = (event: SelectChangeEvent<string>) => {
    handleGenericChange('interestRate', event.target.value as string);
    if (event.target.value !== 'custom') {
      handleGenericChange('customInterestRate', '');
    }
  };

  const handleCustomInterestRateFieldChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    if (/^\d*\.?\d*$/.test(value) && value.length <= 5) {
      handleGenericChange('customInterestRate', value);
    }
  };

  const calculateEMI = (principal: number, annualRate: number, timeInMonths: number): string => {
    if (principal <= 0 || timeInMonths <= 0 || annualRate <= 0) {
      return '0.00';
    }
    const monthlyRate = annualRate / 12 / 100;
    const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, timeInMonths)) / (Math.pow(1 + monthlyRate, timeInMonths) - 1);
    return isNaN(emi) || !isFinite(emi) ? '0.00' : emi.toFixed(2);
  };

  useEffect(() => {
    const principal = formData.loanAmount;
    let annualInterestRate = 12;
    if (formData.interestRate === 'custom') {
      annualInterestRate = parseFloat(formData.customInterestRate) || 0;
    } else {
      annualInterestRate = parseFloat(formData.interestRate) || 0;
    }
    let tenureInMonths = 0;
    if (formData.tenure === 'custom') {
      tenureInMonths = parseInt(formData.customTenure, 10);
    } else {
      tenureInMonths = parseInt(formData.tenure, 10);
    }
    if (principal > 0 && tenureInMonths > 0 && annualInterestRate > 0) {
      const emi = calculateEMI(principal, annualInterestRate, tenureInMonths);
      setCalculatedEMI(emi);
    } else {
      setCalculatedEMI('0.00');
    }
  }, [formData.loanAmount, formData.tenure, formData.customTenure, formData.interestRate, formData.customInterestRate]);

  return (
    <Box sx={{ py: 3, px: 1 }}> {/* Added more padding to step content box */}
      <Typography variant="h4" component="h2" textAlign="center" gutterBottom sx={{ mb: 4, fontWeight: 'bold', color: 'primary.main' }}> {/* Enhanced Title */}
        Discover Your Perfect Loan Match
      </Typography>
      <Grid container spacing={3.5} direction="column" alignItems="flex-start">
      <Grid container spacing={3.5} direction="column" alignItems="center"> {/* Changed to "center" */}
          <Grid sx={{ xs:12, textAlign: 'center', my: 2.5 }}>
            <Paper elevation={2} sx={{ p: 2.5, borderRadius: '8px', background: 'linear-gradient(to right, #e3f2fd, #f3e5f5)', width: '100%', maxWidth: 400, mx: 'auto' }}>
              <Typography variant="h5" component="p" sx={{ fontWeight: 'bold', color: 'primary.dark' }}>
                Your Estimated EMI: ₹{calculatedEMI}/month
              </Typography>
              <Typography variant="caption" display="block" sx={{ mt: 0.5, color: 'text.secondary' }}>
                (Calculated at {formData.interestRate === 'custom' ? formData.customInterestRate || '0' : formData.interestRate}% annual interest rate)
              </Typography>
            </Paper>
          </Grid>
        </Grid>
        <Grid sx={{ xs: 12 }} size={10} alignItems='center'>
          <Typography gutterBottom sx={{ fontWeight: 'medium', fontSize: '1.1rem' }}>Loan Amount: <Typography component="span" sx={{ fontWeight: 'bold', color: 'secondary.main' }}>₹{formData.loanAmount.toLocaleString()}</Typography></Typography> {/* Enhanced Label */}
          <Slider
            value={formData.loanAmount}
            onChange={handleSliderChange}
            aria-labelledby="loan-amount-slider"
            valueLabelDisplay="auto"
            step={1000}
            min={10000}
            max={500000}
            sx={{ mt: 1, color: 'secondary.main' }}
          />
        </Grid>
        <Grid container spacing={2} alignItems="flex-start">
          {/* Tenure */}
          <Grid sx={{ xs: 12, md: 4 }}>
            <Typography gutterBottom sx={{ fontWeight: 'medium', fontSize: '1.1rem' }}>Tenure</Typography>
            <FormControl fullWidth variant="outlined" sx={{ mb: 1.5 }}>
              <InputLabel id="tenure-label">Select Tenure</InputLabel>
              <Select
                labelId="tenure-label"
                id="tenure-select"
                value={formData.tenure}
                label="Select Tenure"
                onChange={(e) => {
                  handleGenericChange('tenure', e.target.value);
                  if (e.target.value !== 'custom') handleGenericChange('customTenure', '');
                }}
              >
                {[12, 24, 36, 48, 60].map((t) => (
                  <MenuItem key={t} value={t.toString()}>{t} months</MenuItem>
                ))}
                <MenuItem value="custom">Custom</MenuItem>
              </Select>
            </FormControl>
            {formData.tenure === 'custom' && (
              <TextField
                fullWidth
                label="Custom Tenure (months)"
                value={formData.customTenure}
                onChange={handleCustomTenureFieldChange}
                type="tel"
                variant="outlined"
                size="small"
                inputProps={{ maxLength: 3 }}
                sx={{ mt: 1 }}
              />
            )}
          </Grid>

          {/* Interest Rate */}
          <Grid sx={{ xs: 12, md: 4 }}>
            <Typography gutterBottom sx={{ fontWeight: 'medium', fontSize: '1.1rem' }}>Interest Rate</Typography>
            <FormControl fullWidth variant="outlined" sx={{ mb: 1.5 }}>
              <InputLabel id="interest-rate-label">Select Rate</InputLabel>
              <Select
                labelId="interest-rate-label"
                id="interest-rate-select"
                value={formData.interestRate}
                label="Select Rate"
                onChange={handleInterestRateChange}
              >
                {[10, 12, 14, 16, 18].map((rate) => (
                  <MenuItem key={rate} value={rate.toString()}>{rate}%</MenuItem>
                ))}
                <MenuItem value="custom">Custom</MenuItem>
              </Select>
            </FormControl>
            {formData.interestRate === 'custom' && (
              <TextField
                fullWidth
                label="Custom Interest Rate (%)"
                value={formData.customInterestRate}
                onChange={handleCustomInterestRateFieldChange}
                type="tel"
                variant="outlined"
                size="small"
                inputProps={{ maxLength: 5 }}
                sx={{ mt: 1 }}
              />
            )}
          </Grid>

          {/* Loan Purpose */}
          <Grid sx={{ xs: 12, md: 4 }}>
            <Typography gutterBottom sx={{ fontWeight: 'medium', fontSize: '1.1rem' }}>Loan Purpose</Typography>
            <FormControl fullWidth variant="outlined">
              <InputLabel id="loan-purpose-label">Select Purpose</InputLabel>
              <Select
                labelId="loan-purpose-label"
                id="loan-purpose-select"
                value={formData.loanPurpose}
                label="Select Purpose"
                onChange={(e) => handleGenericChange('loanPurpose', e.target.value)}
              >
                {loanPurposes.map((purpose) => (
                  <MenuItem key={purpose} value={purpose}>
                    {purpose}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};

// Placeholder for File type, replace with actual File if needed for more complex handling
type FilePlaceholder = { name: string, size?: number, type?: string }; // Added optional size and type


interface IdentityCheckStepProps {
  formData: typeof initialFormData;
  handleFileMetaChange: (field: keyof typeof initialFormData, file: File | null) => void;
}

const IdentityCheckStep = ({ formData, handleFileMetaChange }: IdentityCheckStepProps) => {
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>, fieldName: keyof typeof initialFormData) => {
    const file = event.target.files && event.target.files[0] ? event.target.files[0] : null;
    handleFileMetaChange(fieldName, file);
  };

  return (
    <Box sx={{ py: 3, px: 1 }}> {/* Consistent padding */}
      <Typography variant="h4" component="h2" textAlign="center" gutterBottom sx={{ mb: 4, fontWeight: 'bold', color: 'primary.main' }}> {/* Enhanced Title */}
        Let&apos;s Verify Your Identity
      </Typography>

      <Typography variant="h6" gutterBottom sx={{ mt: 2, mb: 2.5, borderBottom: 1, borderColor: 'divider', pb: 1, fontWeight: 'medium' }}>
        Personal Details
      </Typography>
      <Grid container spacing={2.5}>
        <Grid sx={{ xs: 12, sm: 6 }}><TextField fullWidth label="Full Name" name="fullName" required autoComplete="name" /></Grid>
        <Grid sx={{ xs: 12, sm: 6 }}><TextField fullWidth label="Date of Birth" name="dob" type="date" InputLabelProps={{ shrink: true }} required /></Grid>
        <Grid sx={{ xs: 12, sm: 6 }}><TextField fullWidth label="PAN Card Number" name="pan" required /></Grid>
        <Grid sx={{ xs: 12, sm: 6 }}><TextField fullWidth label="Aadhaar Number" name="aadhaar" required /></Grid>
        <Grid sx={{ xs: 12 }}><TextField fullWidth label="Current Address" name="address" multiline rows={3} required autoComplete="street-address" /></Grid>
        <Grid sx={{ xs: 12, sm: 6 }}><TextField fullWidth label="Mobile Number" name="mobile" type="tel" required autoComplete="tel" /></Grid>
        <Grid sx={{ xs: 12, sm: 6 }}><TextField fullWidth label="Email Address" name="email" type="email" required autoComplete="email" /></Grid>
      </Grid>


      <Grid container spacing={3}>
        {/* PAN Card Upload */}
        <Grid sx={{ xs: 12 }}>
          <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'medium', mb: 1 }}>PAN Card Upload</Typography>
          <Button variant="outlined" component="label" fullWidth startIcon={<UploadFileIcon />}> {/* Added Icon */}
            Upload PAN Card
            <input type="file" hidden accept="image/*,.pdf" onChange={(e) => handleFileChange(e, 'panFile')} />
          </Button>
          {formData.panFile && <Typography variant="body2" sx={{ mt: 1, textAlign: 'center', color: 'success.main' }}>Selected: {formData.panFile.name}</Typography>}
          <Typography variant="caption" display="block" sx={{ mt: 0.5, textAlign: 'center', color: 'text.secondary' }}>
            Drag & drop or take photo (Max file size: 5MB. Formats: JPG, PNG, PDF)
          </Typography>
        </Grid>

        {/* Aadhaar Upload */}
        <Grid sx={{ xs: 12 }}>
          <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'medium', mt: 2, mb: 1 }}>Aadhaar Upload</Typography>
          <Grid container spacing={2}>
            <Grid sx={{ xs: 12, sm: 6 }}>
              <Button variant="outlined" component="label" fullWidth startIcon={<UploadFileIcon />}> {/* Added Icon */}
                Upload Aadhaar Front
                <input type="file" hidden accept="image/*,.pdf" onChange={(e) => handleFileChange(e, 'aadhaarFrontFile')} />
              </Button>
              {formData.aadhaarFrontFile && <Typography variant="body2" sx={{ mt: 1, textAlign: 'center', color: 'success.main' }}>Selected: {formData.aadhaarFrontFile.name}</Typography>}
            </Grid>
            <Grid sx={{ xs: 12, sm: 6 }}>
              <Button variant="outlined" component="label" fullWidth startIcon={<UploadFileIcon />}> {/* Added Icon */}
                Upload Aadhaar Back
                <input type="file" hidden accept="image/*,.pdf" onChange={(e) => handleFileChange(e, 'aadhaarBackFile')} />
              </Button>
              {formData.aadhaarBackFile && <Typography variant="body2" sx={{ mt: 1, textAlign: 'center', color: 'success.main' }}>Selected: {formData.aadhaarBackFile.name}</Typography>}
            </Grid>
          </Grid>
          <Typography variant="caption" display="block" sx={{ mt: 1, textAlign: 'center', color: 'text.secondary' }}>
            Ensure images are clear for instant validation. (Max file size: 5MB each. Formats: JPG, PNG, PDF)
          </Typography>
        </Grid>

        {/* Autofilled Information */}
        {/* <Grid sx={{xs:12, mt:3}}>
          <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'medium', color: 'text.secondary' }}>
            AUTOFILLED FROM DOCUMENTS (Conceptual):
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
            <TextField
              label="Full Name"
              value="Raj Sharma" // Dummy data
              InputProps={{
                readOnly: true,
                endAdornment: <CheckCircleOutline color="success" sx={{fontSize: '1.2rem'}} />,
              }}
              variant="filled"
              fullWidth
              size="small"
              sx={{ mr: 0.5 }}
            />
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', mt: 1.5 }}>
            <TextField
              label="Date of Birth"
              value="15-08-1990" // Dummy data
              InputProps={{
                readOnly: true,
                endAdornment: <CheckCircleOutline color="success" sx={{fontSize: '1.2rem'}}/>,
              }}
              variant="filled"
              fullWidth
              size="small"
               sx={{ mr: 0.5 }}
            />
          </Box>
        </Grid> */}
      </Grid>
    </Box>
  );
};

// Employment Profiler Step Component
interface EmploymentProfilerStepProps {
  formData: typeof initialFormData;
  handleGenericChange: (field: keyof typeof initialFormData, value: unknown) => void;
  handleFileMetaChange: (field: keyof typeof initialFormData, file: File | null) => void;
  employmentTypes: string[];
}

const EmploymentProfilerStep = ({ formData, handleGenericChange, handleFileMetaChange, employmentTypes }: EmploymentProfilerStepProps) => {
  // monthlyIncomeDisplay is local UI state for simulating processing and display.
  // The actual income value if needed by other steps or submission would be part of formData.
  const [monthlyIncomeDisplay, setMonthlyIncomeDisplay] = useState<string>(formData.employmentType ? '₹1,20,000 ✓' : 'Enter details to see');

  const handleSalarySlipUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files && event.target.files[0] ? event.target.files[0] : null;
    handleFileMetaChange('salarySlipFile', file);
    if (file) {
      setMonthlyIncomeDisplay('Processing...');
      setTimeout(() => setMonthlyIncomeDisplay('₹1,25,000 ✓'), 2000); // Simulate updated income
    }
  };

  // Update monthlyIncomeDisplay if employmentType changes and it was showing the default
  useEffect(() => {
    if (formData.employmentType && monthlyIncomeDisplay === 'Enter details to see') {
      setMonthlyIncomeDisplay('₹1,20,000 ✓');
    } else if (!formData.employmentType && monthlyIncomeDisplay !== 'Processing...') { // Avoid resetting if processing
      // setMonthlyIncomeDisplay('Enter details to see'); // Or keep current if already processed
    }
  }, [formData.employmentType, monthlyIncomeDisplay]);


  return (
    <Box sx={{ py: 3, px: 1 }}> {/* Consistent padding */}
      <Typography variant="h4" component="h2" textAlign="center" gutterBottom sx={{ mb: 4, fontWeight: 'bold', color: 'primary.main' }}> {/* Enhanced Title */}
        Tell Us About Your Work Life
      </Typography>

      <Typography variant="h6" gutterBottom sx={{ mt: 4, mb: 2.5, borderBottom: 1, borderColor: 'divider', pb: 1, fontWeight: 'medium' }}>
        Employment Information
      </Typography>
      <Grid container spacing={2.5}>
        <Grid sx={{ xs: 12, sm: 6 }}>
          <FormControl fullWidth required>
            <InputLabel id="employment-type-label">Employment Type</InputLabel>
            <Select labelId="employment-type-label" label="Employment Type" name="employmentType" defaultValue="">
              {employmentTypes.map((type) => (
                <MenuItem key={type} value={type}>{type}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid sx={{ xs: 12, sm: 6 }}><TextField fullWidth label="Company Name (if salaried/employed)" name="companyName" /></Grid>
        <Grid sx={{ xs: 12, sm: 6 }}><TextField fullWidth label="Designation (if salaried/employed)" name="designation" /></Grid>
        <Grid sx={{ xs: 12, sm: 6 }}><TextField fullWidth label="Years in Current Employment/Business" name="yearsInService" type="number" required InputProps={{ inputProps: { min: 0 } }} /></Grid>
        <Grid sx={{ xs: 12, sm: 6 }}><TextField fullWidth label="Monthly Income (INR)" name="monthlyIncome" type="number" required InputProps={{ inputProps: { min: 0 } }} /></Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Employment Type */}
        {/* <Grid sx={{xs:12}}>
          <FormControl fullWidth required variant="outlined">
            <InputLabel id="employment-type-label">Employment Type</InputLabel>
            <Select
              labelId="employment-type-label"
              value={formData.employmentType}
              label="Employment Type"
              onChange={(e) => handleGenericChange('employmentType', e.target.value)}
            >
              {employmentTypes.map((type) => (
                <MenuItem key={type} value={type}>{type}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid> */}

        {/* Conditional Fields for Salaried */}
        {formData.employmentType === 'Salaried' && (
          <>
            <Grid sx={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Company Name"
                value={formData.companyName}
                onChange={(e) => handleGenericChange('companyName', e.target.value)}
                variant="outlined"
              />
            </Grid>
            <Grid sx={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Designation"
                value={formData.designation}
                onChange={(e) => handleGenericChange('designation', e.target.value)}
                variant="outlined"
              />
            </Grid>
          </>
        )}

        {formData.employmentType === 'Self-Employed/Business' && (
          <>
            <Grid sx={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Business Name"
                // value={businessName} // Add state if needed
                // onChange={(e) => setBusinessName(e.target.value)}
                variant="outlined"
                helperText="Your registered business name"
              />
            </Grid>
            <Grid sx={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Nature of Business"
                // value={natureOfBusiness} // Add state if needed
                // onChange={(e) => setNatureOfBusiness(e.target.value)}
                variant="outlined"
              />
            </Grid>
            <Grid sx={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Years in Business"
                type="number"
                // value={yearsInBusiness} // Add state if needed
                // onChange={(e) => setYearsInBusiness(e.target.value)}
                variant="outlined"
              />
            </Grid>
          </>
        )}

        {/* Income Verification */}
        <Grid sx={{ xs: 12 }}>
          <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'medium', mt: 2, mb: 1 }}>
            Income Verification
          </Typography>
          <Grid container spacing={2} alignItems="center">
            <Grid sx={{ xs: 12, sm: 6 }}>
              <Button variant="outlined" component="label" fullWidth startIcon={<UploadFileIcon />}> {/* Added Icon */}
                Upload Salary Slip
                <input type="file" hidden accept="image/*,.pdf" onChange={handleSalarySlipUpload} />
              </Button>
              {formData.salarySlipFile && <Typography variant="body2" sx={{ mt: 1, textAlign: 'center', color: 'success.main' }}>Selected: {formData.salarySlipFile.name}</Typography>}
            </Grid>
            {/* <Grid sx={{xs:12, sm:6}}>
              <Button variant="outlined" color="secondary" fullWidth> 
                Connect Bank Account
              </Button>
               <Typography variant="caption" display="block" sx={{ mt: 0.5, textAlign: 'center', color:'text.secondary' }}>
                (Securely connect via Plaid/Setu - UI Only)
              </Typography>
            </Grid> */}
          </Grid>
        </Grid>

        {/* Auto-calculated Monthly Income */}
        {/* <Grid sx={{xs:12, mt:1}}>
          <Typography variant="caption" display="block" color="text.secondary" sx={{mb:0.5}}>
            [Auto-calculated from upload/bank connection]
          </Typography>
          <TextField
            label="Monthly Income"
            value={monthlyIncomeDisplay}
            InputProps={{
              readOnly: true,
              // endAdornment: monthlyIncome.includes('✓') ? <CheckCircleOutline color="success" sx={{fontSize: '1.2rem'}} /> : null,
            }}
            variant="filled"
            fullWidth
            size="small"
          />
        </Grid> */}
      </Grid>
    </Box>
  );
};

// Location & Contact Step Component
interface LocationContactStepProps {
  formData: typeof initialFormData;
  handleGenericChange: (field: keyof typeof initialFormData, value: unknown) => void;
}

const LocationContactStep = ({ formData, handleGenericChange }: LocationContactStepProps) => {
  const [isEditingMobile, setIsEditingMobile] = useState<boolean>(false);
  const [isEditingEmail, setIsEditingEmail] = useState<boolean>(false);
  const [addressLine1Error, setAddressLine1Error] = useState<string>('');

  const handleAddressLine1Change = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleGenericChange('addressLine1', e.target.value);
    if (!e.target.value.trim()) {
      setAddressLine1Error('Address Line 1 is required');
    } else {
      setAddressLine1Error('');
    }
  };

  return (
    <Box sx={{ py: 3, px: 1 }}>
      <Typography variant="h4" component="h2" textAlign="center" gutterBottom sx={{ mb: 4, fontWeight: 'bold', color: 'primary.main' }}>
        Where Should We Reach You?
      </Typography>
      <Paper elevation={0} sx={{ p: 3, borderRadius: 2, mb: 3 }}>
        <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'medium' }}>Enter Your Address & Contact Details</Typography>
        <Grid container spacing={3} direction="column" alignItems="flex-start">
          {/* Address Line 1 */}
          <Grid size={10} sx={{ xs: 12 }}>
            <TextField
              fullWidth
              required
              label="Address Line 1"
              value={formData.addressLine1}
              onChange={handleAddressLine1Change}
              variant="outlined"
              error={!!addressLine1Error}
              rows={2}
              multiline
            />
          </Grid>

          {/* Address Line 2 */}
          <Grid size={10} sx={{ xs: 12 }}>
            <TextField
              fullWidth
              label="Address Line 2 (optional)"
              value={formData.addressLine2}
              onChange={(e) => handleGenericChange('addressLine2', e.target.value)}
              variant="outlined"
              rows={2}
              multiline
            />
          </Grid>

          {/* City and Pincode in Column */}
          <Grid size={10} sx={{ xs: 12 }}>
            <Grid container direction="row" spacing={2}>
              <Grid>
                <TextField
                  fullWidth
                  label="City"
                  value={formData.city}
                  onChange={(e) => handleGenericChange('city', e.target.value)}
                  variant="outlined"
                />
              </Grid>
              <Grid>
                <TextField
                  fullWidth
                  label="Pincode"
                  value={formData.pincode}
                  onChange={(e) => handleGenericChange('pincode', e.target.value)}
                  variant="outlined"
                  type="tel"
                />
              </Grid>
            </Grid>
          </Grid>

          {/* Mobile Number */}
          <Grid sx={{ xs: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              {isEditingMobile ? (
                <TextField
                  label="Mobile Number"
                  value={formData.mobileNumber}
                  onChange={(e) => handleGenericChange('mobileNumber', e.target.value)}
                  variant="outlined"
                  size="small"
                  sx={{ flexGrow: 1 }}
                />
              ) : (
                <Typography sx={{ flexGrow: 1 }}>
                  Mobile: {formData.mobileNumber}{' '}
                  <Typography component="span" variant="caption" color="success.main">
                    (Verified)
                  </Typography>
                </Typography>
              )}
              <IconButton onClick={() => setIsEditingMobile(!isEditingMobile)} size="small" sx={{ ml: 1 }}>
                {isEditingMobile ? <SaveIcon /> : <EditIcon />}
              </IconButton>
            </Box>
          </Grid>

          {/* Email Address with Edit Icon */}
          <Grid sx={{ xs: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              {isEditingEmail ? (
                <TextField
                  label="Email Address"
                  value={formData.email}
                  onChange={(e) => handleGenericChange('email', e.target.value)}
                  variant="outlined"
                  size="small"
                  fullWidth
                />
              ) : (
                <Typography sx={{ flexGrow: 1 }}>
                  Email: {formData.email}{' '}
                  <Typography component="span" variant="caption" color="text.secondary">
                    (Primary)
                  </Typography>
                </Typography>
              )}
              <IconButton onClick={() => setIsEditingEmail(!isEditingEmail)} size="small" sx={{ ml: 1 }}>
                {isEditingEmail ? <SaveIcon /> : <EditIcon />}
              </IconButton>
            </Box>
          </Grid>

          {/* Backup Email */}
          {/* <Grid sx={{ xs: 3 }}>
            {showBackupEmail && (
              <TextField
                fullWidth
                label="Backup Email Address"
                value={formData.backupEmail}
                onChange={(e) => handleGenericChange('backupEmail', e.target.value)}
                variant="outlined"
                size="small"
                sx={{ mb: 1 }}
              />
            )} */}
          {/* <Button size="small" onClick={() => setShowBackupEmail(!showBackupEmail)} sx={{ textTransform: 'none' }}>
              {showBackupEmail ? 'Remove Backup Email' : 'Add Backup Email'}
            </Button> */}
          {/* </Grid> */}
        </Grid>

      </Paper>
    </Box>
  );
};

// Final Review Step Component
interface FinalReviewStepProps { // Ensure this interface is correctly defined or use inline props
  formData: typeof initialFormData;
  handleGenericChange: (field: keyof typeof initialFormData, value: unknown) => void;
}

const FinalReviewStep = ({ formData, handleGenericChange }: FinalReviewStepProps) => {
  // Local states for agreeToShare and getCreditReport are removed. Values are read from formData prop.

  const mockOffers = [
    { bankLogo: '/axis-bank-seeklogo.png', bankName: 'Axis Bank', offer: 'Pre-approved: ₹5L @ 10.5% p.a.', apr: '10.5%', processingFee: '₹999' },
    { bankLogo: '/hdfc-bank-seeklogo.png', bankName: 'HDFC Bank', offer: 'Special Offer: ₹7L @ 11.2% p.a.', apr: '11.2%', processingFee: '₹1499' },
    { bankLogo: '/icici-bank-seeklogo.png', bankName: 'ICICI Bank', offer: 'Low Interest: ₹6.5L @ 9.8% p.a.', apr: '9.8%', processingFee: '₹799' },
  ];

  return (
    <Box sx={{ py: 3, px: 1 }}> {/* Consistent padding */}

      <Typography variant="h4" component="h2" textAlign="center" gutterBottom sx={{ mb: 4, fontWeight: 'bold', color: 'primary.main' }}>
        Review & Unlock Your Offers!
      </Typography>


      {/* Personalized Loan Matches (Conceptual) */}
      <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'medium', mb: 2, color: 'text.primary' }}>
        PERSONALIZED LOAN MATCHES (Conceptual Offers):
      </Typography>
      <Grid container spacing={2.5}>
        {mockOffers.map((offer, index) => (
          <Grid sx={{ xs: 12, md: 4 }} key={index}>
            <Card elevation={3} sx={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between', borderRadius: '12px', transition: '0.3s', '&:hover': { transform: 'translateY(-5px)', boxShadow: 6 } }}> {/* Added hover effect & border radius */}
              <CardMedia
                component="img"
                height="80" /* Increased height */
                image={offer.bankLogo}
                alt={`${offer.bankName} logo`}
                sx={{ p: 2, objectFit: 'contain', borderBottom: '1px solid #eee' }}
              />
              <CardContent sx={{ flexGrow: 1, textAlign: 'center' }}> {/* Centered content */}
                <Typography gutterBottom variant="h6" component="div" sx={{ fontSize: '1.2rem', fontWeight: 'bold' }}> {/* Bolder bank name */}
                  {offer.bankName}
                </Typography>
                <Typography variant="body1" color="primary.main" sx={{ fontWeight: 'bold', mb: 1, fontSize: '1.1rem' }}> {/* Larger offer text */}
                  {offer.offer}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Est. APR: {offer.apr}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Processing Fee: <Typography component="span" sx={{ textDecoration: offer.bankName === 'Axis Bank' ? 'line-through' : 'none', fontWeight: offer.bankName === 'Axis Bank' ? 'normal' : 'bold' }}>{offer.processingFee}</Typography> {offer.bankName === 'Axis Bank' ? <Typography component="span" color="success.main" sx={{ fontWeight: 'bold' }}>FREE</Typography> : ''}
                </Typography>
              </CardContent>
              <Button size="medium" variant="contained" sx={{ m: 2, alignSelf: 'center', fontWeight: 'medium' }}>View Details & Apply</Button> {/* Styled button */}
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Processing Fee Information */}
      <Paper elevation={2} sx={{ textAlign: 'center', p: 2, mt: 4, mb: 3, backgroundColor: 'secondary.light', color: 'secondary.contrastText', borderRadius: '8px' }}> {/* Distinct styling */}
        <Typography variant="h6" component="p" sx={{ fontWeight: 'bold' }}>
          One-Time Processing Fee: ₹499
        </Typography>
        <Typography variant="body1"> {/* Slightly larger body */}
          (Waived if loan is approved through select partners!)
        </Typography>
      </Paper>

      {/* Secure Submission Section */}
      <Box sx={{ mt: 3, p: 2.5, border: '1px solid #ddd', borderRadius: '8px', bgcolor: 'background.paper' }}> {/* Added padding and border radius */}
        <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'medium', mb: 1.5 }}>
          SECURE SUBMISSION & CONSENTS:
        </Typography>
        <FormControlLabel
          control={<Checkbox checked={formData.agreeToShare} onChange={(e) => handleGenericChange('agreeToShare', e.target.checked)} color="primary" />} /* Added color */
          label="I agree to share my details with financial partners to find the best loan offers."
          sx={{ mb: 1 }}
        />
        <FormControlLabel
          control={<Checkbox checked={formData.getCreditReport} onChange={(e) => handleGenericChange('getCreditReport', e.target.checked)} color="primary" />} /* Added color */
          label="Yes, get my free credit report to pre-check eligibility (soft inquiry, won't affect score)."
        />
      </Box>
      <Typography variant="caption" display="block" sx={{ mt: 2, textAlign: 'center', color: 'text.secondary' }}>
        By clicking &quot;Pay ₹499 &amp; See All Offers&quot;, you agree to our Terms &amp; Conditions.
      </Typography>
    </Box>
  );
};


const initialFormData = {
  // Step 1: Loan Explorer
  loanAmount: 500000,
  tenure: '24', // months or 'custom'
  customTenure: '', // months
  interestRate: '12', // new field, default 12%
  customInterestRate: '', // new field for custom rate
  loanPurpose: '',
  // Step 2: Identity Check
  panFile: null as FilePlaceholder | null,
  aadhaarFrontFile: null as FilePlaceholder | null,
  aadhaarBackFile: null as FilePlaceholder | null,
  // Step 3: Employment Profiler
  employmentType: '',
  companyName: '',
  designation: '',
  businessName: '',
  natureOfBusiness: '',
  yearsInBusiness: '',
  salarySlipFile: null as FilePlaceholder | null,
  // Step 4: Location & Contact
  addressLine1: '', // required
  addressLine2: '', // optional
  city: '',
  pincode: '',
  mobileNumber: '98******90', // Default or prefill
  email: 'raj****@gmail.com', // Default or prefill
  backupEmail: '',
  // Step 5: Final Review
  agreeToShare: false,
  getCreditReport: false,
};

export default function PersonalLoanPage() {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState(initialFormData);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  // --- Cross-fade background logic ---
  const bgImages = useMemo(() => [
    '/personal-loan-bg-1.jpg',
    '/personal-loan-bg-2.jpg',
    '/personal-loan-bg-3.jpg',
  ], []);
  const [currentBg, setCurrentBg] = useState(0);
  const [nextBg, setNextBg] = useState(1);
  const [fade, setFade] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(true); // Start fade
      setTimeout(() => {
        setCurrentBg(nextBg);
        setNextBg((nextBg + 1) % bgImages.length);
        setFade(false); // Reset fade
      }, 1000); // Fade duration (ms)
    }, 6000); // Change every 6 seconds
    return () => clearInterval(interval);
  }, [nextBg, bgImages.length]);

  // Preload images for smooth transition
  useEffect(() => {
    bgImages.forEach((src) => {
      const img = new window.Image();
      img.src = src;
    });
  }, [bgImages]);
  // --- End cross-fade logic ---

  const handleGenericChange = (field: keyof typeof initialFormData, fieldValue: unknown) => {
    setFormData(prev => ({ ...prev, [field]: fieldValue }));
  };

  // Specific handler for file metadata if needed, or can be part of generic change with careful value setting
  const handleFileMetaChange = (field: keyof typeof initialFormData, file: File | null) => {
    if (file) {
      handleGenericChange(field, { name: file.name, size: file.size, type: file.type });
    } else {
      handleGenericChange(field, null);
    }
  };


  const loanPurposesList = [
    'Debt Consolidation',
    'Home Renovation/Improvement',
    'Medical Emergency',
    'Travel/Vacation',
    'Wedding Expenses',
    'Education Expenses',
    'Vehicle Purchase (Two-wheeler/Car)',
    'Business Expansion (for self-employed)',
    'Personal Use/Other'
  ];

  const employmentTypesList = ['Salaried', 'Self-Employed/Business', 'Student', 'Retired', 'Other'];


  const handleNext = () => {
    if (activeStep < steps.length - 1) {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const getStepContent = (step: number) => {
    switch (step) {
      case 0:
        return <LoanExplorerStep
          formData={formData}
          handleGenericChange={handleGenericChange}
          loanPurposes={loanPurposesList}
        />;
      case 1:
        return <IdentityCheckStep
          formData={formData}
          handleFileMetaChange={handleFileMetaChange}
        />;
      case 2:
        return <EmploymentProfilerStep
          formData={formData}
          handleGenericChange={handleGenericChange}
          handleFileMetaChange={handleFileMetaChange}
          employmentTypes={employmentTypesList}
        />;
      case 3:
        return <LocationContactStep
          formData={formData}
          handleGenericChange={handleGenericChange}
        />;
      case 4:
        return <FinalReviewStep
          formData={formData}
          handleGenericChange={handleGenericChange}
        />;
      default:
        return <Typography>Unknown Step</Typography>;
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setMessage(null);
    console.log("Submitting Data:", formData);

    const token = localStorage.getItem('accessToken');
    if (!token) {
      setMessage({ type: 'error', text: 'Authentication token not found. Please login again.' });
      setIsLoading(false);
      return;
    }

    const { panFile, aadhaarFrontFile, aadhaarBackFile, salarySlipFile, ...otherFormData } = formData;

    const submissionData = {
      ...otherFormData,
      loan_type: 'personal',
      amount_requested: formData.loanAmount,
      tenure_months_requested: formData.tenure === 'custom' ? parseInt(formData.customTenure, 10) : parseInt(formData.tenure, 10),
      documents_submitted: {
        pan_card: panFile ? panFile.name : "NOT_UPLOADED",
        aadhaar_front: aadhaarFrontFile ? aadhaarFrontFile.name : "NOT_UPLOADED",
        aadhaar_back: aadhaarBackFile ? aadhaarBackFile.name : "NOT_UPLOADED",
        salary_slip: salarySlipFile ? salarySlipFile.name : "NOT_UPLOADED",
      },
      contact_details: {
        mobile: formData.mobileNumber,
        email: formData.email,
        backup_email: formData.backupEmail,
      },
      address_details: {
        address_line_1: formData.addressLine1,
        address_line_2: formData.addressLine2,
        city: formData.city,
        pincode: formData.pincode,
      },
      employment_details: {
        type: formData.employmentType,
        company_name: formData.companyName,
        designation: formData.designation,
        business_name: formData.businessName,
        nature_of_business: formData.natureOfBusiness,
        years_in_business: formData.yearsInBusiness,
      },
      consents: {
        agree_to_share: formData.agreeToShare,
        get_credit_report: formData.getCreditReport,
      }
    };

    if (isNaN(submissionData.amount_requested) || submissionData.amount_requested <= 0) {
      setMessage({ type: 'error', text: 'Invalid loan amount. Please review Step 1.' });
      setIsLoading(false);
      return;
    }
    if (isNaN(submissionData.tenure_months_requested) || submissionData.tenure_months_requested <= 0) {
      setMessage({ type: 'error', text: 'Invalid loan tenure. Please review Step 1.' });
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/loans/apply', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(submissionData),
      });

      const result = await response.json();

      if (response.ok) {
        setMessage({ type: 'success', text: result.message || 'Application submitted successfully! You will be redirected shortly.' });
        setFormData(initialFormData); // Reset form
        setTimeout(() => {
          setActiveStep(0);
          setMessage(null);
        }, 3000);
      } else {
        setMessage({ type: 'error', text: result.message || `Submission failed (Status: ${response.status}). Please try again.` });
      }
    } catch (error) {
      console.error('Loan application submission error:', error);
      setMessage({ type: 'error', text: 'An unexpected error occurred during submission. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box sx={{ position: 'relative', width: '100%', overflow: 'auto' }}>
      {/* Cross-fade background images */}
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100vh',
          backgroundImage: `url(${bgImages[currentBg]})`,
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          opacity: fade ? 0 : 0.25,
          zIndex: -2,
          pointerEvents: 'none',
          transition: 'opacity 2s ease',
        }}
      />
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100vh',
          backgroundImage: `url(${bgImages[nextBg]})`,
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          opacity: fade ? 0.25 : 0,
          zIndex: -1,
          pointerEvents: 'none',
          transition: 'opacity 5s ease',
        }}
      />
      
      {/* Hero Section */}
      <Box sx={{ 
        position: 'relative', 
        zIndex: 1, 
        textAlign: 'center', 
        py: 8, 
        background: 'linear-gradient(135deg, rgba(25, 118, 210, 0.1) 0%, rgba(156, 39, 176, 0.1) 100%)',
        mb: 4
      }}>
        <Container maxWidth="lg">
          <Typography variant="h2" component="h1" gutterBottom sx={{ fontWeight: 'bold', mb: 2 }}>
            Unlock Best Personal Loan Offers for meeting your Capital Requirements
          </Typography>
          <Typography variant="h5" component="p" gutterBottom sx={{ color: 'text.secondary', mb: 4 }}>
            Enjoy an Easy Life With | Instant Paperless Loan
          </Typography>
          
          {/* Key Features */}
          <Grid container spacing={2} justifyContent="center" sx={{ mb: 4 }}>
            <Grid size="auto">
              <Chip label="Best Offers from 15+ lenders" color="primary" variant="outlined" />
            </Grid>
            <Grid size="auto">
              <Chip label="Hassle-Free Documentation" color="primary" variant="outlined" />
            </Grid>
            <Grid size="auto">
              <Chip label="Quick Disbursal" color="primary" variant="outlined" />
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Foreground content */}
      <Container maxWidth="lg" sx={{ py: { xs: 3, sm: 4, md: 6 }, position: 'relative', zIndex: 1 }}>
        <Paper elevation={3} sx={{ p: { xs: 2, sm: 3, md: 4 }, borderRadius: 2, boxShadow: '0 8px 24px rgba(0,0,0,0.12)' }}>
          <Typography variant="h4" component="h1" textAlign="center" gutterBottom sx={{ fontWeight: 'bold', mb: { xs: 3, md: 4 } }}>
            Apply for Rs. 5 Lakhs Personal Loan in Minutes!
          </Typography>

          {/* Responsive Stepper Wrapper */}
          <Box
            sx={{
              overflowX: { xs: 'auto', sm: 'auto', md: 'visible' },
              whiteSpace: { xs: 'nowrap', sm: 'nowrap', md: 'normal' },
              WebkitOverflowScrolling: 'touch',
              msOverflowStyle: 'none', // IE/Edge
              scrollbarWidth: 'none', // Firefox
              '&::-webkit-scrollbar': { display: 'none' }, // Chrome/Safari
              mb: 4,
            }}
          >
            <Stepper
              activeStep={activeStep}
              alternativeLabel
              sx={{
                minWidth: { xs: '600px', sm: '700px', md: '0' },
                mb: 0,
                // Ensure Stepper doesn't wrap steps
                flexWrap: { xs: 'nowrap', sm: 'nowrap', md: 'wrap' },
              }}
            >
              {steps.map((label, idx) => (
                <Step key={label}>
                  <StepLabel>
                    <Box
                      component="span"
                      onClick={() => setActiveStep(idx)}
                      sx={{ cursor: 'pointer', display: 'inline-block', px: 1 }}
                    >
                      {label}
                    </Box>
                  </StepLabel>
                </Step>
              ))}
            </Stepper>
          </Box>

          <Box component="form" onSubmit={activeStep === steps.length - 1 ? handleSubmit : (e) => { e.preventDefault(); handleNext(); }} noValidate>
            {message && (
              <Grid sx={{ xs: 12, mb: 2 }}>
                <Alert severity={message.type} onClose={() => setMessage(null)}>{message.text}</Alert>
              </Grid>
            )}

            {getStepContent(activeStep)}

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4 }}>
              <Button
                disabled={activeStep === 0 || isLoading}
                onClick={handleBack}
                sx={{ mr: 1 }}
              >
                Back
              </Button>
              {activeStep === steps.length - 1 ? (
                <Button
                  variant="contained"
                  color="primary"
                  disabled={isLoading || !formData.agreeToShare}
                  type="submit"
                  sx={{ px: 3, py: 1 }}
                >
                  {isLoading ? 'Submitting...' : 'Pay ₹499 &amp; See All Offers'}
                </Button>
              ) : (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleNext}
                  disabled={isLoading}
                  type="button"
                  sx={{ px: 3, py: 1 }}
                >
                  Next
                </Button>
              )}
            </Box>
          </Box>
        </Paper>

        {/* Additional Information Sections */}
        <Grid container spacing={4} sx={{ mt: 4 }}>
          {/* Eligibility Criteria */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 3 }}>
                  Salaried Person Eligibility Criteria
                </Typography>
                <List>
                  <ListItem>
                    <ListItemIcon>
                      <CheckCircleOutline color="success" />
                    </ListItemIcon>
                    <ListItemText primary="Minimum salary Rs. 15,000/- per month" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <CheckCircleOutline color="success" />
                    </ListItemIcon>
                    <ListItemText primary="1 year job stability" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <CheckCircleOutline color="success" />
                    </ListItemIcon>
                    <ListItemText primary="Minimum age 21 years" />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 3 }}>
                  Self-Employed Person Eligibility Criteria
                </Typography>
                <List>
                  <ListItem>
                    <ListItemIcon>
                      <CheckCircleOutline color="success" />
                    </ListItemIcon>
                    <ListItemText primary="Minimum 1 year IT return" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <CheckCircleOutline color="success" />
                    </ListItemIcon>
                    <ListItemText primary="1 year business stability" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <CheckCircleOutline color="success" />
                    </ListItemIcon>
                    <ListItemText primary="Minimum age 21 years" />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>

          {/* Membership Card Benefits */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 3 }}>
                  Membership Card Benefits
                </Typography>
                <List>
                  <ListItem>
                    <ListItemIcon>
                      <CheckCircleOutline color="primary" />
                    </ListItemIcon>
                    <ListItemText primary="Faster loan processing" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <CheckCircleOutline color="primary" />
                    </ListItemIcon>
                    <ListItemText primary="Priority customer support" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <CheckCircleOutline color="primary" />
                    </ListItemIcon>
                    <ListItemText primary="Exclusive loan offers" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <CheckCircleOutline color="primary" />
                    </ListItemIcon>
                    <ListItemText primary="Document assistance" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <CheckCircleOutline color="primary" />
                    </ListItemIcon>
                    <ListItemText primary="CIBIL score protection" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <CheckCircleOutline color="primary" />
                    </ListItemIcon>
                    <ListItemText primary="30% referral rewards" />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>

          {/* Why Blumiq */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 3 }}>
                  Why Blumiq?
                </Typography>
                <List>
                  <ListItem>
                    <ListItemIcon>
                      <CheckCircleOutline color="success" />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Multiple Bank Options"
                      secondary="Access to 15+ leading banks and NBFCs"
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <CheckCircleOutline color="success" />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Best Interest Rates"
                      secondary="Competitive rates starting from 10.25%"
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <CheckCircleOutline color="success" />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Quick Processing"
                      secondary="Get approved within 30 minutes"
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <CheckCircleOutline color="success" />
                    </ListItemIcon>
                    <ListItemText 
                      primary="100% Digital Process"
                      secondary="Complete your application online"
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <CheckCircleOutline color="success" />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Expert Support"
                      secondary="Dedicated customer support team"
                    />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Personal Loan Details */}
        <Card sx={{ mt: 4 }}>
          <CardContent>
            <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 3, textAlign: 'center' }}>
              What is Personal loan?
            </Typography>
            <Typography variant="body1" paragraph sx={{ fontSize: '1.1rem', lineHeight: 1.8 }}>
              A personal loan is an unsecured loan that you can use for any personal purpose such as debt consolidation, 
              home renovation, medical emergencies, travel, wedding expenses, or any other financial need. Unlike home 
              loans or car loans, personal loans don't require any collateral or security.
            </Typography>
            
            <Grid container spacing={3} sx={{ mt: 3 }}>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <Box sx={{ textAlign: 'center', p: 2 }}>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'primary.main', mb: 1 }}>
                    Get Personal Loan - up to ₹15 Lakhs
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    High loan amounts for all your needs
                  </Typography>
                </Box>
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <Box sx={{ textAlign: 'center', p: 2 }}>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'primary.main', mb: 1 }}>
                    Reasonable Interest Rate starting at 10.25%
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Competitive rates for better affordability
                  </Typography>
                </Box>
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <Box sx={{ textAlign: 'center', p: 2 }}>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'primary.main', mb: 1 }}>
                    100% Paperless Procedure
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Complete digital application process
                  </Typography>
                </Box>
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <Box sx={{ textAlign: 'center', p: 2 }}>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'primary.main', mb: 1 }}>
                    Safe And Secure process
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Bank-level security for your data
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card sx={{ mt: 4, bgcolor: 'grey.50' }}>
          <CardContent>
            <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 3, textAlign: 'center' }}>
              Contact Information
            </Typography>
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, md: 4 }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                  Registered Office Address
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  44, 3rd Floor, Vijayraj Society,<br />
                  Near Akshar Family Wear,<br />
                  Singanpore Causeway Road,<br />
                  Katargam, Surat, Gujarat, India - 395004
                </Typography>
              </Grid>
              <Grid size={{ xs: 12, md: 4 }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                  Phone Number
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  +91-70263-73808
                </Typography>
              </Grid>
              <Grid size={{ xs: 12, md: 4 }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                  Email Address
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  info@Blumiq.com
                </Typography>
              </Grid>
            </Grid>
            
            <Box sx={{ mt: 3, p: 2, bgcolor: 'warning.light', borderRadius: 1 }}>
              <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.875rem' }}>
                <strong>Disclaimer:</strong> APR (Annual Percentage Rate) example: For a loan of ₹1,00,000 at 12% p.a. for 12 months, 
                the EMI would be ₹8,885. Total amount payable: ₹1,06,620. Processing fee and other charges may apply.
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}
