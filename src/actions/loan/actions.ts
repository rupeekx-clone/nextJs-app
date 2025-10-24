import { createAction } from '../shared/actionFactory';
import { LoaderKeys } from '../shared/constants';
import {
  ApplyLoanRequest,
  ApplyLoanResponse,
  GetMyApplicationsResponse,
  GetApplicationResponse,
} from './types';

/**
 * Loan actions with automatic Redux integration
 */

// Apply for loan
export const apply = createAction<ApplyLoanRequest, ApplyLoanResponse>({
  method: 'POST',
  url: '/loans/apply',
  loaderKey: LoaderKeys.LOAN_LOADING,
});

// Get my loan applications
export const getMyApplications = createAction<undefined, GetMyApplicationsResponse>({
  method: 'GET',
  url: '/loans',
  loaderKey: LoaderKeys.LOAN_LOADING,
});

// Get single loan application
export const getApplication = createAction<{ id: string }, GetApplicationResponse>({
  method: 'GET',
  url: (data: { id: string }) => `/loans/${data.id}`,
  loaderKey: LoaderKeys.LOAN_LOADING,
});
