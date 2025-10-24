/**
 * TypeScript types for loan API requests and responses
 */

// Apply for Loan
export interface ApplyLoanRequest {
  loan_type: 'personal' | 'business';
  amount_requested: number;
  tenure_months_requested: number;
  purpose?: string;
  employment_type?: 'salaried' | 'self_employed';
  monthly_income?: number;
  company_name?: string;
  work_experience?: number;
  address?: {
    street: string;
    city: string;
    state: string;
    pincode: string;
    country: string;
  };
}

export interface ApplyLoanResponse {
  success: boolean;
  message: string;
  application: {
    _id: string;
    user_id: string;
    loan_type: 'personal' | 'business';
    amount_requested: number;
    tenure_months_requested: number;
    status: 'pending' | 'approved' | 'rejected' | 'under_review';
    application_date: string;
  };
}

// Get My Loan Applications
export interface GetMyApplicationsResponse {
  success: boolean;
  applications: Array<{
    _id: string;
    user_id: string;
    loan_type: 'personal' | 'business';
    amount_requested: number;
    amount_approved?: number;
    tenure_months_requested: number;
    tenure_months_approved?: number;
    status: 'pending' | 'approved' | 'rejected' | 'under_review';
    application_date: string;
    bank_partner?: string;
    interest_rate?: number;
    processing_fee?: number;
    remarks?: string;
  }>;
}

// Get Single Loan Application
export interface GetApplicationResponse {
  success: boolean;
  application: {
    _id: string;
    user_id: string;
    loan_type: 'personal' | 'business';
    amount_requested: number;
    amount_approved?: number;
    tenure_months_requested: number;
    tenure_months_approved?: number;
    status: 'pending' | 'approved' | 'rejected' | 'under_review';
    application_date: string;
    bank_partner?: string;
    interest_rate?: number;
    processing_fee?: number;
    remarks?: string;
    documents?: Array<{
      _id: string;
      document_type: string;
      file_url: string;
      uploaded_at: string;
    }>;
  };
}
