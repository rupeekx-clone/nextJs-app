import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
// Assuming EmploymentProfilerStep is exported from a file
import { EmploymentProfilerStep } from '../page'; // This import will fail until page.tsx exports it

const mockEmploymentTypes = ['Salaried', 'Self-Employed/Business', 'Student', 'Other'];

const baseMockFormData_Employment = {
  loanAmount: 0, tenure: '', customTenure: '', loanPurpose: '',
  panFile: null, aadhaarFrontFile: null, aadhaarBackFile: null,
  companyName: '', designation: '',
  businessName: '', natureOfBusiness: '', yearsInBusiness: '',
  salarySlipFile: null,
  building: '', city: '', pincode: '',
  mobileNumber: '', email: '', backupEmail: '',
  agreeToShare: false, getCreditReport: false,
};

describe('EmploymentProfilerStep Component', () => {
  const mockHandleGenericChange = jest.fn();
  const mockHandleFileMetaChange = jest.fn();

  test('renders correctly with initial props', () => {
    render(
      <EmploymentProfilerStep
        formData={{ ...baseMockFormData_Employment, employmentType: '' }}
        handleGenericChange={mockHandleGenericChange}
        handleFileMetaChange={mockHandleFileMetaChange}
        employmentTypes={mockEmploymentTypes}
      />
    );

    expect(screen.getByText('Tell Us About Your Work Life')).toBeInTheDocument();
    // MUI Select is rendered as a button before interaction
    expect(screen.getByRole('button', { name: /Employment Type/i })).toBeInTheDocument();
    expect(screen.getByText('Income Verification')).toBeInTheDocument();
  });

  test('shows Salaried fields when employmentType is "Salaried"', () => {
    render(
      <EmploymentProfilerStep
        formData={{ ...baseMockFormData_Employment, employmentType: 'Salaried' }}
        handleGenericChange={mockHandleGenericChange}
        handleFileMetaChange={mockHandleFileMetaChange}
        employmentTypes={mockEmploymentTypes}
      />
    );
    expect(screen.getByLabelText('Company Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Designation')).toBeInTheDocument();
  });

  test('does not show Salaried fields when employmentType is not "Salaried"', () => {
    render(
      <EmploymentProfilerStep
        formData={{ ...baseMockFormData_Employment, employmentType: 'Student' }}
        handleGenericChange={mockHandleGenericChange}
        handleFileMetaChange={mockHandleFileMetaChange}
        employmentTypes={mockEmploymentTypes}
      />
    );
    expect(screen.queryByLabelText('Company Name')).not.toBeInTheDocument();
    expect(screen.queryByLabelText('Designation')).not.toBeInTheDocument();
  });

  test('shows Self-Employed/Business fields when employmentType is "Self-Employed/Business"', () => {
    render(
      <EmploymentProfilerStep
        formData={{ ...baseMockFormData_Employment, employmentType: 'Self-Employed/Business' }}
        handleGenericChange={mockHandleGenericChange}
        handleFileMetaChange={mockHandleFileMetaChange}
        employmentTypes={mockEmploymentTypes}
      />
    );
    expect(screen.getByLabelText('Business Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Nature of Business')).toBeInTheDocument();
    expect(screen.getByLabelText('Years in Business')).toBeInTheDocument();
  });
});
