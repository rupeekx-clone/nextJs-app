import { z } from 'zod';

// Common validation schemas
export const emailSchema = z.string().email('Invalid email format');
export const phoneSchema = z.string().regex(/^[6-9]\d{9}$/, 'Invalid Indian phone number format');
export const pincodeSchema = z.string().regex(/^[1-9][0-9]{5}$/, 'Invalid Indian pincode format');
export const passwordSchema = z.string().min(8, 'Password must be at least 8 characters');

// User validation schemas
export const userRegistrationSchema = z.object({
  full_name: z.string().min(2, 'Full name must be at least 2 characters'),
  email: emailSchema,
  phone_number: phoneSchema,
  password: passwordSchema,
  address_line1: z.string().optional(),
  address_line2: z.string().optional(),
  city: z.string().optional(),
  pincode: pincodeSchema.optional(),
  user_type: z.enum(['customer', 'cash_lending_customer', 'admin']).default('customer'),
});

export const userLoginSchema = z.object({
  email_or_phone: z.string().min(1, 'Email or phone is required'),
  password: z.string().min(1, 'Password is required'),
});

export const userProfileUpdateSchema = z.object({
  full_name: z.string().min(2, 'Full name must be at least 2 characters').optional(),
  address_line1: z.string().optional(),
  address_line2: z.string().optional(),
  city: z.string().optional(),
  pincode: pincodeSchema.optional(),
});

// Loan application validation schemas
export const loanApplicationSchema = z.object({
  loan_type: z.enum(['personal', 'business'], {
    errorMap: () => ({ message: 'Loan type must be either personal or business' })
  }),
  amount_requested: z.number().min(10000, 'Minimum loan amount is ₹10,000').max(10000000, 'Maximum loan amount is ₹1 crore'),
  tenure_months_requested: z.number().min(6, 'Minimum tenure is 6 months').max(60, 'Maximum tenure is 60 months'),
  documents_submitted: z.record(z.string()).optional(),
});

export const loanUpdateSchema = z.object({
  amount_requested: z.number().min(10000).max(10000000).optional(),
  tenure_months_requested: z.number().min(6).max(60).optional(),
  documents_submitted: z.record(z.string()).optional(),
});

// Membership card validation schemas
export const membershipPurchaseSchema = z.object({
  card_type_id: z.string().min(1, 'Card type ID is required'),
  payment_reference: z.string().min(1, 'Payment reference is required'),
});

// Cash lending subscription validation schemas
export const subscriptionPurchaseSchema = z.object({
  plan_id: z.string().min(1, 'Plan ID is required'),
  payment_reference: z.string().min(1, 'Payment reference is required'),
});

// Contact/Enquiry validation schemas
export const enquirySchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: emailSchema,
  phone_number: phoneSchema,
  subject: z.string().optional(),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

// Admin validation schemas
export const adminLoanUpdateSchema = z.object({
  status: z.enum(['draft', 'submitted', 'under_review', 'requires_documents', 'approved', 'rejected', 'disbursed', 'closed', 'cancelled']).optional(),
  amount_approved: z.number().min(0).optional(),
  interest_rate_final: z.number().min(0).max(100).optional(),
  tenure_months_final: z.number().min(1).optional(),
  bank_partner_id: z.string().optional(),
  admin_remarks: z.string().optional(),
});

export const bankPartnerSchema = z.object({
  name: z.string().min(2, 'Bank name must be at least 2 characters'),
  logo_url: z.string().url('Invalid logo URL').optional(),
  contact_person_name: z.string().optional(),
  contact_person_email: emailSchema.optional(),
  contact_person_phone: phoneSchema.optional(),
  is_active: z.boolean().default(true),
});

export const membershipCardTypeSchema = z.object({
  name: z.string().min(2, 'Card type name must be at least 2 characters'),
  description: z.string().optional(),
  price: z.number().min(0, 'Price must be positive'),
  validity_months: z.number().min(1, 'Validity must be at least 1 month'),
  benefits_description: z.string().min(10, 'Benefits description must be at least 10 characters'),
  loan_type_association: z.enum(['personal', 'business', 'any']).optional(),
  max_loan_amount_benefit: z.number().min(0).optional(),
  processing_time_benefit: z.string().optional(),
  is_active: z.boolean().default(true),
});

export const cashLendingPlanSchema = z.object({
  name: z.string().min(2, 'Plan name must be at least 2 characters'),
  description: z.string().optional(),
  price: z.number().min(0, 'Price must be positive'),
  duration_days: z.number().min(1, 'Duration must be at least 1 day'),
  features: z.record(z.any()).optional(),
  is_active: z.boolean().default(true),
});

export const staticContentSchema = z.object({
  slug: z.string().regex(/^[a-z0-9-]+$/, 'Slug must contain only lowercase letters, numbers, and hyphens'),
  title: z.string().min(2, 'Title must be at least 2 characters'),
  content_body: z.string().min(10, 'Content must be at least 10 characters'),
  meta_description: z.string().max(500, 'Meta description must be less than 500 characters').optional(),
  is_published: z.boolean().default(true),
});

// Query parameter validation schemas
export const paginationSchema = z.object({
  page: z.string().transform(val => parseInt(val) || 1).pipe(z.number().min(1)),
  limit: z.string().transform(val => parseInt(val) || 10).pipe(z.number().min(1).max(100)),
});

export const loanQuerySchema = z.object({
  status: z.enum(['draft', 'submitted', 'under_review', 'requires_documents', 'approved', 'rejected', 'disbursed', 'closed', 'cancelled']).optional(),
  loan_type: z.enum(['personal', 'business']).optional(),
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
});

// OTP validation
export const otpSchema = z.object({
  otp: z.string().regex(/^\d{6}$/, 'OTP must be 6 digits'),
});

// Password reset validation
export const forgotPasswordSchema = z.object({
  email: emailSchema,
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Reset token is required'),
  password: passwordSchema,
});

// File upload validation
export const fileUploadSchema = z.object({
  fileName: z.string().min(1, 'File name is required'),
  fileSize: z.number().max(10 * 1024 * 1024, 'File size must be less than 10MB'),
  contentType: z.string().min(1, 'Content type is required'),
});

// Payment validation
export const paymentVerificationSchema = z.object({
  razorpay_order_id: z.string().min(1, 'Order ID is required'),
  razorpay_payment_id: z.string().min(1, 'Payment ID is required'),
  razorpay_signature: z.string().min(1, 'Signature is required'),
});

// Loan approval and rejection validation
export const loanApprovalSchema = z.object({
  approved_amount: z.number().min(1000, 'Minimum amount is ₹1,000'),
  interest_rate: z.number().min(1, 'Interest rate must be at least 1%').max(30, 'Interest rate cannot exceed 30%'),
  tenure_months: z.number().min(1, 'Tenure must be at least 1 month').max(60, 'Tenure cannot exceed 60 months'),
  processing_fee: z.number().min(0, 'Processing fee cannot be negative'),
  remarks: z.string().optional(),
});

export const loanRejectionSchema = z.object({
  reason: z.string().min(1, 'Rejection reason is required'),
  remarks: z.string().optional(),
});

// Utility functions for validation
export const validateData = <T>(schema: z.ZodSchema<T>, data: unknown): { success: true; data: T } | { success: false; errors: Record<string, string> } => {
  try {
    const validatedData = schema.parse(data);
    return { success: true, data: validatedData };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors: Record<string, string> = {};
      error.errors.forEach((err) => {
        const path = err.path.join('.');
        errors[path] = err.message;
      });
      return { success: false, errors };
    }
    return { success: false, errors: { general: 'Validation failed' } };
  }
};

export const validateQueryParams = <T extends z.ZodTypeAny>(schema: T, searchParams: URLSearchParams): { success: true; data: z.infer<T> } | { success: false; errors: Record<string, string> } => {
  const params: Record<string, string> = {};
  searchParams.forEach((value, key) => {
    params[key] = value;
  });
  
  try {
    const validatedData = schema.parse(params);
    return { success: true, data: validatedData };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors: Record<string, string> = {};
      error.errors.forEach((err) => {
        const path = err.path.join('.');
        errors[path] = err.message;
      });
      return { success: false, errors };
    }
    return { success: false, errors: { general: 'Validation failed' } };
  }
};
