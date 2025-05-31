import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
// Assuming LocationContactStep is exported
import { LocationContactStep } from '../page'; // This import will fail until page.tsx exports it

const baseMockFormData_Location = {
  loanAmount: 0, tenure: '', customTenure: '', loanPurpose: '',
  panFile: null, aadhaarFrontFile: null, aadhaarBackFile: null,
  employmentType: '', companyName: '', designation: '',
  businessName: '', natureOfBusiness: '', yearsInBusiness: '',
  salarySlipFile: null,
  building: 'Test Building', city: 'Test City', pincode: '123456',
  mobileNumber: '9876543210', email: 'test@example.com', backupEmail: '',
  agreeToShare: false, getCreditReport: false,
};

describe('LocationContactStep Component', () => {
  const mockHandleGenericChange = jest.fn();

  test('renders correctly with initial props', () => {
    render(
      <LocationContactStep
        formData={baseMockFormData_Location}
        handleGenericChange={mockHandleGenericChange}
      />
    );

    expect(screen.getByText('Where Should We Reach You?')).toBeInTheDocument();
    expect(screen.getByLabelText('Building/Apartment Name')).toHaveValue(baseMockFormData_Location.building);
    expect(screen.getByLabelText('City')).toHaveValue(baseMockFormData_Location.city);
    expect(screen.getByLabelText('Pincode')).toHaveValue(baseMockFormData_Location.pincode);

    expect(screen.getByText(`Mobile: ${baseMockFormData_Location.mobileNumber}`)).toBeInTheDocument();
    expect(screen.getByText(`Email: ${baseMockFormData_Location.email}`)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Add Backup Email/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Send OTP & Continue/i })).toBeInTheDocument();
  });

  test('toggles mobile number editing', () => {
    render(
      <LocationContactStep
        formData={baseMockFormData_Location}
        handleGenericChange={mockHandleGenericChange}
      />
    );
    const editButton = screen.getByRole('button', { name: /edit/i }); // Assuming EditIcon has 'edit' in its accessible name
    fireEvent.click(editButton);
    expect(screen.getByLabelText('Mobile Number')).toBeInTheDocument(); // Now it's an input field

    const saveButton = screen.getByRole('button', { name: /save/i }); // Assuming SaveIcon has 'save'
    fireEvent.click(saveButton);
    expect(screen.getByText(`Mobile: ${baseMockFormData_Location.mobileNumber}`)).toBeInTheDocument(); // Back to text display
  });

  test('toggles backup email field', () => {
    render(
      <LocationContactStep
        formData={baseMockFormData_Location}
        handleGenericChange={mockHandleGenericChange}
      />
    );
    const addBackupButton = screen.getByRole('button', { name: /Add Backup Email/i });
    fireEvent.click(addBackupButton);
    expect(screen.getByLabelText('Backup Email Address')).toBeInTheDocument();

    const removeBackupButton = screen.getByRole('button', { name: /Remove Backup Email/i });
    fireEvent.click(removeBackupButton);
    expect(screen.queryByLabelText('Backup Email Address')).not.toBeInTheDocument();
  });
});
