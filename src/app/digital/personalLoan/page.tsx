'use client'; // For form interactions

import { useState, useEffect } from 'react'; // Added useEffect
import { Container, Typography, Box, TextField, Button, Grid, Paper, FormControl, InputLabel, Select, MenuItem, Alert, Stepper, Step, StepLabel, Slider, ToggleButtonGroup, ToggleButton, IconButton, SelectChangeEvent } from '@mui/material'; // Added SelectChangeEvent
import { Checkbox, FormControlLabel, Card, CardContent, CardMedia, Stack } from '@mui/material';
import CheckCircleOutline from '@mui/icons-material/CheckCircleOutline';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import UploadFileIcon from '@mui/icons-material/UploadFile'; // Added UploadFileIcon


// Define Steps
const steps = ['Loan Explorer', 'Quick Identity Check', 'Smart Employment Profiler', 'Location & Contact', 'Final Review'];

// Loan Explorer Step Component
type LoanExplorerFormData = typeof initialFormData & { customInterestRate: string };
interface LoanExplorerStepProps {
  formData: LoanExplorerFormData;
  handleGenericChange: (field: keyof LoanExplorerFormData, value: any) => void;
  loanPurposes: string[];
}

const LoanExplorerStep = ({ formData, handleGenericChange, loanPurposes }: LoanExplorerStepProps) => {
  const [calculatedEMI, setCalculatedEMI] = useState<string>('');

  const handleSliderChange = (_event: Event, newValue: number | number[]) => {
    handleGenericChange('loanAmount', newValue as number);
  };

  const handleTenureToggleChange = (_event: React.MouseEvent<HTMLElement>, newTenure: string | null) => {
    if (newTenure !== null) {
      handleGenericChange('tenure', newTenure);
      if (newTenure !== 'custom') {
        handleGenericChange('customTenure', ''); // Clear custom tenure
      }
    }
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
    <Box sx={{ py: 3, px:1 }}> {/* Added more padding to step content box */}
      <Typography variant="h4" component="h2" textAlign="center" gutterBottom sx={{ mb: 4, fontWeight: 'bold', color: 'primary.main' }}> {/* Enhanced Title */}
        Discover Your Perfect Loan Match
      </Typography>
      <Grid container spacing={3.5}> {/* Increased spacing */}
        {/* Loan Amount */}
        <Grid sx={{xs:12}}>
          <Typography gutterBottom sx={{ fontWeight: 'medium', fontSize: '1.1rem' }}>Loan Amount: <Typography component="span" sx={{fontWeight:'bold', color:'secondary.main'}}>₹{formData.loanAmount.toLocaleString()}</Typography></Typography> {/* Enhanced Label */}
          <Slider
            value={formData.loanAmount}
            onChange={handleSliderChange}
            aria-labelledby="loan-amount-slider"
            valueLabelDisplay="auto"
            step={1000}
            min={10000}
            max={500000}
            sx={{mt: 1, color: 'secondary.main'}}
          />
        </Grid>

        {/* Tenure Selector (Refactored to Select) */}
        <Grid sx={{xs:12}}>
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

        {/* Interest Rate Selector */}
        <Grid sx={{xs:12}}>
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

        {/* EMI Display */}
        <Grid sx={{xs:12, textAlign:'center', my:2.5}}>
          <Paper elevation={2} sx={{p:2.5, borderRadius: '8px', background: 'linear-gradient(to right, #e3f2fd, #f3e5f5)'}}> 
            <Typography variant="h5" component="p" sx={{ fontWeight: 'bold', color: 'primary.dark' }}>
              Your Estimated EMI: ₹{calculatedEMI}/month
            </Typography>
            <Typography variant="caption" display="block" sx={{mt: 0.5, color: 'text.secondary'}}>
              (Calculated at {formData.interestRate === 'custom' ? formData.customInterestRate || '0' : formData.interestRate}% annual interest rate)
            </Typography>
          </Paper>
        </Grid>

        {/* Loan Purpose */}
        <Grid sx={{xs:12}}>
         <Typography gutterBottom sx={{ fontWeight: 'medium', fontSize: '1.1rem', mb:1 }}>Loan Purpose</Typography>
          <FormControl fullWidth variant="outlined"> {/* Ensured variant for consistency */}
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
    <Box sx={{ py: 3, px:1 }}> {/* Consistent padding */}
      <Typography variant="h5" component="h2" textAlign="center" gutterBottom sx={{ mb: 4, fontWeight: 'bold' }}> {/* Enhanced Title */}
        Let's Verify Your Identity
      </Typography>
                
      <Typography variant="h6" gutterBottom sx={{ mt: 2, mb: 2.5, borderBottom: 1, borderColor: 'divider', pb:1, fontWeight:'medium' }}>
            Personal Details
          </Typography>
          <Grid container spacing={2.5}>
            <Grid sx={{xs:12, sm:6}}><TextField fullWidth label="Full Name" name="fullName" required autoComplete="name" /></Grid>
            <Grid sx={{xs:12, sm:6}}><TextField fullWidth label="Date of Birth" name="dob" type="date" InputLabelProps={{ shrink: true }} required /></Grid>
            <Grid sx={{xs:12, sm:6}}><TextField fullWidth label="PAN Card Number" name="pan" required /></Grid>
            <Grid sx={{xs:12, sm:6}}><TextField fullWidth label="Aadhaar Number" name="aadhaar" required /></Grid>
            <Grid sx={{xs:12}}><TextField fullWidth label="Current Address" name="address" multiline rows={3} required autoComplete="street-address" /></Grid>
            <Grid sx={{xs:12, sm:6}}><TextField fullWidth label="Mobile Number" name="mobile" type="tel" required autoComplete="tel" /></Grid>
            <Grid sx={{xs:12, sm:6}}><TextField fullWidth label="Email Address" name="email" type="email" required autoComplete="email" /></Grid>
          </Grid>


      <Grid container spacing={3}>
        {/* PAN Card Upload */}
        <Grid sx={{xs:12}}>
          <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'medium', mb:1 }}>PAN Card Upload</Typography>
          <Button variant="outlined" component="label" fullWidth startIcon={<UploadFileIcon />}> {/* Added Icon */}
            Upload PAN Card
            <input type="file" hidden accept="image/*,.pdf" onChange={(e) => handleFileChange(e, 'panFile')} />
          </Button>
          {formData.panFile && <Typography variant="body2" sx={{ mt: 1, textAlign:'center', color:'success.main' }}>Selected: {formData.panFile.name}</Typography>}
          <Typography variant="caption" display="block" sx={{ mt: 0.5, textAlign: 'center', color: 'text.secondary' }}>
            Drag & drop or take photo (Max file size: 5MB. Formats: JPG, PNG, PDF)
          </Typography>
        </Grid>

        {/* Aadhaar Upload */}
        <Grid sx={{xs:12}}>
          <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'medium', mt:2, mb:1 }}>Aadhaar Upload</Typography>
          <Grid container spacing={2}>
            <Grid sx={{xs:12, sm:6}}>
              <Button variant="outlined" component="label" fullWidth startIcon={<UploadFileIcon />}> {/* Added Icon */}
                Upload Aadhaar Front
                <input type="file" hidden accept="image/*,.pdf" onChange={(e) => handleFileChange(e, 'aadhaarFrontFile')} />
              </Button>
              {formData.aadhaarFrontFile && <Typography variant="body2" sx={{ mt: 1, textAlign:'center', color:'success.main' }}>Selected: {formData.aadhaarFrontFile.name}</Typography>}
            </Grid>
            <Grid sx={{xs:12, sm:6}}>
              <Button variant="outlined" component="label" fullWidth startIcon={<UploadFileIcon />}> {/* Added Icon */}
                Upload Aadhaar Back
                <input type="file" hidden accept="image/*,.pdf" onChange={(e) => handleFileChange(e, 'aadhaarBackFile')} />
              </Button>
              {formData.aadhaarBackFile && <Typography variant="body2" sx={{ mt: 1, textAlign:'center', color:'success.main' }}>Selected: {formData.aadhaarBackFile.name}</Typography>}
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
  handleGenericChange: (field: keyof typeof initialFormData, value: any) => void;
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
    <Box sx={{ py: 3, px:1 }}> {/* Consistent padding */}
      <Typography variant="h5" component="h2" textAlign="center" gutterBottom sx={{ mb: 4, fontWeight: 'bold' }}> {/* Enhanced Title */}
        Tell Us About Your Work Life
      </Typography>

      <Typography variant="h6" gutterBottom sx={{ mt: 4, mb: 2.5, borderBottom: 1, borderColor: 'divider', pb:1, fontWeight:'medium' }}>
            Employment Information
          </Typography>
          <Grid container spacing={2.5}>
            <Grid sx={{xs:12, sm:6}}>
              <FormControl fullWidth required>
                <InputLabel id="employment-type-label">Employment Type</InputLabel>
                <Select labelId="employment-type-label" label="Employment Type" name="employmentType" defaultValue="">
                 {employmentTypes.map((type) => (
                  <MenuItem key={type} value={type}>{type}</MenuItem>
                ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid sx={{xs:12, sm:6}}><TextField fullWidth label="Company Name (if salaried/employed)" name="companyName" /></Grid>
            <Grid sx={{xs:12, sm:6}}><TextField fullWidth label="Designation (if salaried/employed)" name="designation" /></Grid>
            <Grid sx={{xs:12, sm:6}}><TextField fullWidth label="Years in Current Employment/Business" name="yearsInService" type="number" required InputProps={{ inputProps: { min: 0 } }} /></Grid>
            <Grid sx={{xs:12, sm:6}}><TextField fullWidth label="Monthly Income (INR)" name="monthlyIncome" type="number" required InputProps={{ inputProps: { min: 0 } }} /></Grid>
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
            <Grid sx={{xs:12, sm:6}}>
              <TextField
                fullWidth
                label="Company Name"
                value={formData.companyName}
                onChange={(e) => handleGenericChange('companyName', e.target.value)}
                variant="outlined"
              />
            </Grid>
            <Grid sx={{xs:12, sm:6}}>
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
            <Grid sx={{xs:12, sm:6}}>
              <TextField
                fullWidth
                label="Business Name"
                // value={businessName} // Add state if needed
                // onChange={(e) => setBusinessName(e.target.value)}
                variant="outlined"
                helperText="Your registered business name"
              />
            </Grid>
            <Grid sx={{xs:12, sm:6}}>
              <TextField
                fullWidth
                label="Nature of Business"
                // value={natureOfBusiness} // Add state if needed
                // onChange={(e) => setNatureOfBusiness(e.target.value)}
                variant="outlined"
              />
            </Grid>
             <Grid sx={{xs:12}}>
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
        <Grid sx={{xs:12}}>
          <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'medium', mt: 2, mb:1 }}>
            Income Verification
          </Typography>
          <Grid container spacing={2} alignItems="center">
            <Grid sx={{xs:12, sm:6}}>
              <Button variant="outlined" component="label" fullWidth startIcon={<UploadFileIcon />}> {/* Added Icon */}
                Upload Salary Slip
                <input type="file" hidden accept="image/*,.pdf" onChange={handleSalarySlipUpload} />
              </Button>
              {formData.salarySlipFile && <Typography variant="body2" sx={{ mt: 1, textAlign:'center', color:'success.main' }}>Selected: {formData.salarySlipFile.name}</Typography>}
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
  handleGenericChange: (field: keyof typeof initialFormData, value: any) => void;
}

const LocationContactStep = ({ formData, handleGenericChange }: LocationContactStepProps) => {
  // Local state for UI interaction, not part of main formData unless explicitly needed elsewhere
  const [isEditingMobile, setIsEditingMobile] = useState<boolean>(false);
  const [showBackupEmail, setShowBackupEmail] = useState<boolean>(false);


  return (
    <Box sx={{ py: 3, px:1 }}> {/* Consistent padding */}
      <Typography variant="h5" component="h2" textAlign="center" gutterBottom sx={{ mb: 4, fontWeight: 'bold' }}> {/* Enhanced Title */}
        Where Should We Reach You?
      </Typography>

      <Grid container spacing={3}>
        {/* Address Input UI */}
        <Grid sx={{xs:12}}>
          <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'medium' }}>Enter Your Current Address</Typography>
          <Typography variant="caption" display="block" color="text.secondary" sx={{ mb: 1.5 }}>
            Alternatively, move pin to your exact location (Conceptual Map UI)
          </Typography>
          <TextField
            fullWidth
            label="Building/Apartment Name"
            value={formData.building}
            onChange={(e) => handleGenericChange('building', e.target.value)}
            variant="outlined"
            sx={{ mb: 2 }}
          />
          <Grid container spacing={2}>
            <Grid sx={{xs:12, sm:6}}>
              <TextField
                fullWidth
                label="City"
                value={formData.city}
                onChange={(e) => handleGenericChange('city', e.target.value)}
                variant="outlined"
              />
            </Grid>
            <Grid sx={{xs:12, sm:6}}>
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

        {/* Auto-Filled Address Display (Conceptual) */}
        <Grid sx={{xs:12, mt:1}}>
          <Typography variant="caption" display="block" color="text.secondary" sx={{ fontWeight: 'medium' }}>
            AUTOFILLED ADDRESS (CONCEPTUAL):
          </Typography>
          <Paper elevation={1} sx={{ display: 'flex', alignItems: 'center', mt: 0.5, p:1.5, borderRadius:1, bgcolor: 'grey.50' }}> {/* Subtle background */}
            <Typography variant="body2" sx={{ flexGrow: 1, lineHeight:1.8 }}> {/* Improved line height */}
              Building: Orchid Towers <CheckCircleOutline color="success" sx={{ fontSize: '1rem', verticalAlign: 'middle' }} /> <br />
              City: Mumbai <CheckCircleOutline color="success" sx={{ fontSize: '1rem', verticalAlign: 'middle' }} /> <br />
              Pincode: 400001 <CheckCircleOutline color="success" sx={{ fontSize: '1rem', verticalAlign: 'middle' }} />
            </Typography>
          </Paper>
        </Grid>

        {/* Contact Preferences UI */}
        <Grid sx={{xs:12, mt:2}}>
          <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'medium', mb:1.5 }}>Contact Preferences</Typography>
          {/* Mobile Number */}
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
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
                Mobile: {formData.mobileNumber} <Typography component="span" variant="caption" color="success.main">(Verified)</Typography>
              </Typography>
            )}
            <IconButton onClick={() => setIsEditingMobile(!isEditingMobile)} size="small" sx={{ml:1}}>
              {isEditingMobile ? <SaveIcon /> : <EditIcon />}
            </IconButton>
          </Box>

          {/* Email Address */}
          <Box sx={{ mb: 1 }}>
            <Typography>
              Email: {formData.email} <Typography component="span" variant="caption" color="text.secondary">(Primary)</Typography>
            </Typography>
          </Box>
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
          )}
          <Button size="small" onClick={() => setShowBackupEmail(!showBackupEmail)} sx={{textTransform: 'none'}}> {/* Less shouty button */}
            {showBackupEmail ? 'Remove Backup Email' : 'Add Backup Email'}
          </Button>
        </Grid>

        {/* Send OTP Button */}
        <Grid sx={{xs:12, textAlign:'center', mt:2}}>
          <Button variant="contained" color="primary" sx={{px:5, py:1.5, fontWeight:'medium'}}> {/* Styled Button */}
            Send OTP & Continue
          </Button>
           <Typography variant="caption" display="block" sx={{ mt: 0.5, color: 'text.secondary' }}>
                (This is a UI placeholder. Use main 'Next' button to navigate.)
            </Typography>
        </Grid>
      </Grid>
    </Box>
  );
};

// Final Review Step Component
interface FinalReviewStepProps { // Ensure this interface is correctly defined or use inline props
  formData: typeof initialFormData;
  handleGenericChange: (field: keyof typeof initialFormData, value: any) => void;
}

const FinalReviewStep = ({ formData, handleGenericChange }: FinalReviewStepProps) => {
  // Local states for agreeToShare and getCreditReport are removed. Values are read from formData prop.

  const mockOffers = [
    { bankLogo: '/axis-bank-seeklogo.png', bankName: 'Axis Bank', offer: 'Pre-approved: ₹5L @ 10.5% p.a.', apr: '10.5%', processingFee: '₹999' },
    { bankLogo: '/hdfc-bank-seeklogo.png', bankName: 'HDFC Bank', offer: 'Special Offer: ₹7L @ 11.2% p.a.', apr: '11.2%', processingFee: '₹1499' },
    { bankLogo: '/icici-bank-seeklogo.png', bankName: 'ICICI Bank', offer: 'Low Interest: ₹6.5L @ 9.8% p.a.', apr: '9.8%', processingFee: '₹799' },
  ];

  return (
    <Box sx={{ py: 3, px:1 }}> {/* Consistent padding */}
      
      <Typography variant="h5" component="h2" textAlign="center" gutterBottom sx={{ mb: 3, fontWeight: 'bold' }}> {/* Enhanced Title */}
        Review & Unlock Your Offers!
      </Typography>

      {/* Personalized Loan Matches (Conceptual) */}
      <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'medium', mb: 2, color: 'text.primary' }}>
        PERSONALIZED LOAN MATCHES (Conceptual Offers):
      </Typography>
      <Grid container spacing={2.5}>
        {mockOffers.map((offer, index) => (
          <Grid sx={{xs:12, md:4}} key={index}>
            <Card elevation={3} sx={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between', borderRadius: '12px', transition: '0.3s', '&:hover': {transform: 'translateY(-5px)', boxShadow:6} }}> {/* Added hover effect & border radius */}
              <CardMedia
                component="img"
                height="80" /* Increased height */
                image={offer.bankLogo}
                alt={`${offer.bankName} logo`}
                sx={{ p: 2, objectFit: 'contain', borderBottom: '1px solid #eee' }}
              />
              <CardContent sx={{flexGrow: 1, textAlign:'center'}}> {/* Centered content */}
                <Typography gutterBottom variant="h6" component="div" sx={{fontSize: '1.2rem', fontWeight:'bold'}}> {/* Bolder bank name */}
                  {offer.bankName}
                </Typography>
                <Typography variant="body1" color="primary.main" sx={{fontWeight:'bold', mb:1, fontSize:'1.1rem'}}> {/* Larger offer text */}
                  {offer.offer}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Est. APR: {offer.apr}
                </Typography>
                 <Typography variant="body2" color="text.secondary">
                  Processing Fee: <Typography component="span" sx={{textDecoration: offer.bankName === 'Axis Bank' ? 'line-through': 'none', fontWeight: offer.bankName === 'Axis Bank' ? 'normal' : 'bold'}}>{offer.processingFee}</Typography> {offer.bankName === 'Axis Bank' ? <Typography component="span" color="success.main" sx={{fontWeight:'bold'}}>FREE</Typography> : ''}
                </Typography>
              </CardContent>
               <Button size="medium" variant="contained" sx={{m:2, alignSelf:'center', fontWeight:'medium'}}>View Details & Apply</Button> {/* Styled button */}
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Processing Fee Information */}
      <Paper elevation={2} sx={{ textAlign: 'center', p: 2, mt: 4, mb:3, backgroundColor: 'secondary.light', color: 'secondary.contrastText', borderRadius: '8px' }}> {/* Distinct styling */}
        <Typography variant="h6" component="p" sx={{fontWeight:'bold'}}>
          One-Time Processing Fee: ₹499
        </Typography>
        <Typography variant="body1"> {/* Slightly larger body */}
           (Waived if loan is approved through select partners!)
        </Typography>
      </Paper>

      {/* Secure Submission Section */}
      <Box sx={{ mt: 3, p:2.5, border: '1px solid #ddd', borderRadius: '8px', bgcolor: 'background.paper' }}> {/* Added padding and border radius */}
        <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'medium', mb:1.5 }}>
          SECURE SUBMISSION & CONSENTS:
        </Typography>
        <FormControlLabel
          control={<Checkbox checked={formData.agreeToShare} onChange={(e) => handleGenericChange('agreeToShare', e.target.checked)} color="primary"/>} /* Added color */
          label="I agree to share my details with financial partners to find the best loan offers."
          sx={{mb:1}}
        />
        <FormControlLabel
          control={<Checkbox checked={formData.getCreditReport} onChange={(e) => handleGenericChange('getCreditReport', e.target.checked)} color="primary"/>} /* Added color */
          label="Yes, get my free credit report to pre-check eligibility (soft inquiry, won't affect score)."
        />
      </Box>
       <Typography variant="caption" display="block" sx={{ mt: 2, textAlign: 'center', color: 'text.secondary' }}>
          By clicking "Pay ₹499 & See All Offers", you agree to our Terms & Conditions.
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
  building: '',
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

  const handleGenericChange = (field: keyof typeof initialFormData, fieldValue: any) => {
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
           building: formData.building,
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
    <Container maxWidth="lg" sx={{ py: { xs: 3, sm: 4, md: 6 } }}>
      <Paper elevation={3} sx={{ p: { xs: 2, sm: 3, md: 4 }, borderRadius: 2, boxShadow: '0 8px 24px rgba(0,0,0,0.12)' }}>
        <Typography variant="h4" component="h1" textAlign="center" gutterBottom sx={{ fontWeight: 'bold', mb: {xs: 3, md: 4} }}>
          Personal Loan Application
        </Typography>

        <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
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

        <Box component="form" onSubmit={activeStep === steps.length -1 ? handleSubmit : (e) => { e.preventDefault(); handleNext();}} noValidate>
          {message && (
            <Grid sx={{xs:12, mb:2}}>
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
                sx={{px: 3, py:1}}
              >
                {isLoading ? 'Submitting...' : 'Pay ₹499 & See All Offers'}
              </Button>
            ) : (
              <Button
                variant="contained"
                color="primary"
                onClick={handleNext}
                disabled={isLoading}
                type="button"
                sx={{px: 3, py:1}}
              >
                Next
              </Button>
            )}
          </Box>
        </Box>
      </Paper>
    </Container>
  );
}
