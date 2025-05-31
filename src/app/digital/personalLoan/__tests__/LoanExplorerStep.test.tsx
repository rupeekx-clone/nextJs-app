import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
// Assuming LoanExplorerStep is exported from a file, e.g., '../../components/LoanExplorerStep'
// For this subtask, we'll assume it's made available for testing.
// If it remains internal to page.tsx, these tests would need to be adapted or run via PersonalLoanPage.
import { LoanExplorerStep } from '../page'; // This import will fail until page.tsx exports it

const mockFormData_LoanExplorer = {
  loanAmount: 500000,
  tenure: '24',
  customTenure: '',
  loanPurpose: '',
  // Add other fields from initialFormData to match the expected structure
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

const mockLoanPurposes = ['Home Renovation', 'Debt Consolidation', 'Education'];

describe('LoanExplorerStep Component', () => {
  const mockHandleGenericChange = jest.fn();

  // Mock useEffect for EMI calculation if it causes issues in test environment without full formData
  // For this example, we assume calculatedEMI state is handled internally and updates based on props.

  // Mocking initialFormData to be accessible if LoanExplorerStep relies on it indirectly
  // However, it's better if all dependencies are passed as props.
  // For now, we'll assume LoanExplorerStep is self-contained with its props.

  test('renders correctly with initial props', () => {
    render(
      <LoanExplorerStep
        formData={mockFormData_LoanExplorer}
        handleGenericChange={mockHandleGenericChange}
        loanPurposes={mockLoanPurposes}
      />
    );

    expect(screen.getByText('Discover Your Perfect Loan Match')).toBeInTheDocument();
    // Check for slider - using a more robust way if possible, like aria-label or role
    expect(screen.getByText(/Loan Amount:/)).toBeInTheDocument();
    expect(screen.getByRole('slider')).toBeInTheDocument();

    expect(screen.getByText('Tenure')).toBeInTheDocument();
    expect(screen.getByRole('group')).toBeInTheDocument(); // ToggleButtonGroup

    expect(screen.getByText(/Your Estimated EMI:/)).toBeInTheDocument();

    expect(screen.getByText('Loan Purpose')).toBeInTheDocument();
    // MUI Selects are tricky, check for the label or a button if it has one
    // For now, checking the label is a good start.
    // expect(screen.getByLabelText('Select Purpose')).toBeInTheDocument(); // If InputLabel is used correctly
  });

  test('EMI calculation updates conceptually when loanAmount changes', () => {
    const { rerender } = render(
      <LoanExplorerStep
        formData={mockFormData_LoanExplorer}
        handleGenericChange={mockHandleGenericChange}
        loanPurposes={mockLoanPurposes}
      />
    );
    const initialEmiText = screen.getByText(/Your Estimated EMI:/).textContent;

    const updatedFormData = { ...mockFormData_LoanExplorer, loanAmount: 1000000 };
    rerender(
      <LoanExplorerStep
        formData={updatedFormData}
        handleGenericChange={mockHandleGenericChange}
        loanPurposes={mockLoanPurposes}
      />
    );

    // This test is conceptual because calculatedEMI is internal state.
    // The change in formData.loanAmount should trigger useEffect, then internal setCalculatedEMI.
    // We are checking if the text content of the EMI display changes.
    // A more robust test would involve direct testing of calculateEMI or mocking its result.
    expect(screen.getByText(/Your Estimated EMI:/).textContent).not.toBe(initialEmiText);
    // Example: If EMI for 500k is X, and for 1M is Y, then check for Y.
    // For now, just checking it changed is a basic step.
  });
});
