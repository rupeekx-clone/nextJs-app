import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
// Assuming FinalReviewStep is exported
import { FinalReviewStep } from '../page'; // This import will fail until page.tsx exports it

const baseMockFormData_Review = {
  loanAmount: 500000, tenure: '24', customTenure: '', loanPurpose: 'Home Renovation',
  panFile: { name: 'pan.pdf' }, aadhaarFrontFile: { name: 'aadhaar_f.pdf' }, aadhaarBackFile: { name: 'aadhaar_b.pdf' },
  employmentType: 'Salaried', companyName: 'TestCorp', designation: 'Engineer',
  businessName: '', natureOfBusiness: '', yearsInBusiness: '',
  salarySlipFile: { name: 'salary.pdf' },
  building: 'Test Building', city: 'Test City', pincode: '123456',
  mobileNumber: '9876543210', email: 'test@example.com', backupEmail: '',
  agreeToShare: false,
  getCreditReport: false,
};

describe('FinalReviewStep Component', () => {
  const mockHandleGenericChange = jest.fn();

  test('renders correctly with initial props', () => {
    render(
      <FinalReviewStep
        formData={baseMockFormData_Review}
        handleGenericChange={mockHandleGenericChange}
      />
    );

    expect(screen.getByText('Review & Unlock Your Offers!')).toBeInTheDocument();
    expect(screen.getByText(/PERSONALIZED LOAN MATCHES/i)).toBeInTheDocument();
    // Check for one of the mock bank names
    expect(screen.getByText('Axis Bank')).toBeInTheDocument();
    expect(screen.getByText('HDFC Bank')).toBeInTheDocument();
    expect(screen.getByText('ICICI Bank')).toBeInTheDocument();

    expect(screen.getByText(/One-Time Processing Fee: ₹499/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/I agree to share my details with financial partners/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Yes, get my free credit report/i)).toBeInTheDocument();
  });

  test('checkboxes reflect formData and call handler on change', () => {
    const { rerender } = render(
      <FinalReviewStep
        formData={baseMockFormData_Review} // agreeToShare is false
        handleGenericChange={mockHandleGenericChange}
      />
    );

    const agreeCheckbox = screen.getByLabelText(/I agree to share my details/i);
    expect(agreeCheckbox).not.toBeChecked();
    fireEvent.click(agreeCheckbox);
    expect(mockHandleGenericChange).toHaveBeenCalledWith('agreeToShare', true);

    // Rerender with updated prop to simulate state change
    rerender(
        <FinalReviewStep
            formData={{ ...baseMockFormData_Review, agreeToShare: true }}
            handleGenericChange={mockHandleGenericChange}
        />
    );
    expect(screen.getByLabelText(/I agree to share my details/i)).toBeChecked();


    const creditReportCheckbox = screen.getByLabelText(/Yes, get my free credit report/i);
    expect(creditReportCheckbox).not.toBeChecked();
    fireEvent.click(creditReportCheckbox);
    expect(mockHandleGenericChange).toHaveBeenCalledWith('getCreditReport', true);
     rerender(
        <FinalReviewStep
            formData={{ ...baseMockFormData_Review, getCreditReport: true }}
            handleGenericChange={mockHandleGenericChange}
        />
    );
    expect(screen.getByLabelText(/Yes, get my free credit report/i)).toBeChecked();
  });
});
