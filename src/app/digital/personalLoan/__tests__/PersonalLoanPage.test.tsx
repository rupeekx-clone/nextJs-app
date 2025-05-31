import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import PersonalLoanPage from '../page'; // The main page component

// Mock localStorage
const localStorageMock = (() => {
  let store: { [key: string]: string } = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

// Mock fetch
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ message: 'Application submitted successfully!' }),
  })
) as jest.Mock;

// Mocking useRouter - basic mock, expand if more navigation features are tested
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    // other router methods if needed
  }),
}));


describe('PersonalLoanPage Multiflow Integration', () => {
  beforeEach(() => {
    // Set a token for tests that require authentication for submission
    localStorageMock.setItem('accessToken', 'test-token');
    // Reset fetch mock for each test if needed
    (global.fetch as jest.Mock).mockClear();
    (global.fetch as jest.Mock).mockImplementation(() =>
        Promise.resolve({
            ok: true,
            json: () => Promise.resolve({ message: 'Application submitted successfully!' }),
        })
    );
  });

  test('renders initial step (LoanExplorerStep)', () => {
    render(<PersonalLoanPage />);
    expect(screen.getByText('Discover Your Perfect Loan Match')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Next/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Back/i })).toBeDisabled();
  });

  test('navigates to the next step on "Next" button click', () => {
    render(<PersonalLoanPage />);
    fireEvent.click(screen.getByRole('button', { name: /Next/i }));
    expect(screen.getByText("Let's Verify Your Identity")).toBeInTheDocument(); // Title of IdentityCheckStep
    expect(screen.getByRole('button', { name: /Back/i })).toBeEnabled();
  });

  test('navigates through all steps and checks final step button text', () => {
    render(<PersonalLoanPage />);
    const stepsTitles = [
      "Let's Verify Your Identity", // After 1st next
      "Tell Us About Your Work Life", // After 2nd next
      "Where Should We Reach You?",  // After 3rd next
      "Review & Unlock Your Offers!" // After 4th next (Final Step)
    ];

    for (const title of stepsTitles) {
      fireEvent.click(screen.getByRole('button', { name: /Next/i }));
      expect(screen.getByText(title)).toBeInTheDocument();
    }
    // On the final step
    expect(screen.getByRole('button', { name: /Pay ₹499 & See All Offers/i })).toBeInTheDocument();
  });

  test('submit button on final step is disabled if consent is not given, then enabled', async () => {
    render(<PersonalLoanPage />);
    // Navigate to final step
    for (let i = 0; i < 4; i++) {
      fireEvent.click(screen.getByRole('button', { name: /Next/i }));
    }
    expect(screen.getByText("Review & Unlock Your Offers!")).toBeInTheDocument();

    const submitButton = screen.getByRole('button', { name: /Pay ₹499 & See All Offers/i });
    expect(submitButton).toBeDisabled(); // Should be disabled because agreeToShare is false initially

    // Find the checkbox for "I agree to share details..."
    // Using testId might be more robust if label text changes or is complex
    // For now, assuming the label text is stable.
    const agreeCheckbox = screen.getByLabelText(/I agree to share my details with financial partners/i);
    fireEvent.click(agreeCheckbox); // Check the box

    expect(submitButton).toBeEnabled(); // Should now be enabled
  });

  test('handles form submission on the final step', async () => {
    render(<PersonalLoanPage />);
     // Navigate to final step
    for (let i = 0; i < 4; i++) {
      fireEvent.click(screen.getByRole('button', { name: /Next/i }));
    }
    // Check the consent box to enable submission
    const agreeCheckbox = screen.getByLabelText(/I agree to share my details with financial partners/i);
    fireEvent.click(agreeCheckbox);

    const submitButton = screen.getByRole('button', { name: /Pay ₹499 & See All Offers/i });
    fireEvent.click(submitButton);

    // Wait for loading state to resolve and fetch to be called
    await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(1));

    expect(global.fetch).toHaveBeenCalledWith(
      '/api/loans/apply',
      expect.objectContaining({
        method: 'POST',
        body: expect.any(String), // Check body more specifically if needed
      })
    );
    // Check for success message
    expect(await screen.findByText(/Application submitted successfully!/i)).toBeInTheDocument();
  });

});
