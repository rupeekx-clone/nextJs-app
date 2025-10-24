/**
 * Contact actions export
 * Provides clean API for all contact-related operations
 */

import {
  submitEnquiry,
} from './actions';

// Export individual actions
export {
  submitEnquiry,
};

// Export types for external use
export type {
  SubmitEnquiryRequest,
  SubmitEnquiryResponse,
} from './types';

// Grouped actions for easier access
export const contactActions = {
  submitEnquiry,
} as const;
