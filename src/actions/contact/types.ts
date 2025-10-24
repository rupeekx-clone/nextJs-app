/**
 * TypeScript types for contact API requests and responses
 */

// Submit Contact Enquiry
export interface SubmitEnquiryRequest {
  name: string;
  email: string;
  phone_number: string;
  subject?: string;
  message: string;
}

export interface SubmitEnquiryResponse {
  success: boolean;
  message: string;
  enquiry: {
    _id: string;
    name: string;
    email: string;
    phone_number: string;
    subject?: string;
    message: string;
    status: 'new' | 'in_progress' | 'resolved';
    created_at: string;
  };
}
