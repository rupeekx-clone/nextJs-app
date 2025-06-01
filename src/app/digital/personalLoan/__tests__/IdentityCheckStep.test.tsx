import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
// Assuming IdentityCheckStep is exported from a file
import { IdentityCheckStep } from '../page'; // This import will fail until page.tsx exports it

const mockFormData_IdentityCheck = {
  loanAmount: 0, // Default or ensure all fields from initialFormData are present
  tenure: '',
  customTenure: '',
  loanPurpose: '',
  panFile: null,
  aadhaarFrontFile: null,
  aadhaarBackFile: null,
  employmentType: '',
  companyName: '',
  designation: '',
  businessName: '',
  natureOfBusiness: '',
  yearsInBusiness: '',
  salarySlipFile: null,
  building: '',
  city: '',
  pincode: '',
  mobileNumber: '',
  email: '',
  backupEmail: '',
  agreeToShare: false,
  getCreditReport: false,
};

describe('IdentityCheckStep Component', () => {
  const mockHandleFileMetaChange = jest.fn();

  test('renders correctly with initial props', () => {
    render(
      <IdentityCheckStep
        formData={mockFormData_IdentityCheck}
        handleFileMetaChange={mockHandleFileMetaChange}
      />
    );

    expect(screen.getByText("Let's Verify Your Identity")).toBeInTheDocument();
    expect(screen.getByText('PAN Card Upload')).toBeInTheDocument();
    // Check for buttons by their accessible name (text content)
    expect(screen.getByRole('button', { name: /Upload PAN Card/i })).toBeInTheDocument();

    expect(screen.getByText('Aadhaar Upload')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Upload Aadhaar Front/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Upload Aadhaar Back/i })).toBeInTheDocument();

    expect(screen.getByText(/AUTOFILLED FROM DOCUMENTS/i)).toBeInTheDocument();
    // Check for dummy autofilled data - these are TextField labels
    expect(screen.getByLabelText('Full Name')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Raj Sharma')).toBeInTheDocument();
    expect(screen.getByLabelText('Date of Birth')).toBeInTheDocument();
    expect(screen.getByDisplayValue('15-08-1990')).toBeInTheDocument();
  });
});
