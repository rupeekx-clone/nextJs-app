/**
 * Loan actions export
 * Provides clean API for all loan-related operations
 */

import {
  apply,
  getMyApplications,
  getApplication,
} from './actions';

// Export individual actions
export {
  apply,
  getMyApplications,
  getApplication,
};

// Export types for external use
export type {
  ApplyLoanRequest,
  ApplyLoanResponse,
  GetMyApplicationsResponse,
  GetApplicationResponse,
} from './types';

// Grouped actions for easier access
export const loanActions = {
  apply,
  getMyApplications,
  getApplication,
} as const;
