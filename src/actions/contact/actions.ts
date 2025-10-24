import { createAction } from '../shared/actionFactory';
import { LoaderKeys } from '../shared/constants';
import {
  SubmitEnquiryRequest,
  SubmitEnquiryResponse,
} from './types';

/**
 * Contact actions with automatic Redux integration
 */

// Submit contact enquiry
export const submitEnquiry = createAction<SubmitEnquiryRequest, SubmitEnquiryResponse>({
  method: 'POST',
  url: '/contact',
  loaderKey: LoaderKeys.CONTACT_LOADING,
});
