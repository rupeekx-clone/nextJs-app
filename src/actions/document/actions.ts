import { createAction } from '../shared/actionFactory';
import { LoaderKeys } from '../shared/constants';
import {
  GetMyDocumentsResponse,
} from './types';

/**
 * Document actions with automatic Redux integration
 */

// Get my documents
export const getMyDocuments = createAction<undefined, GetMyDocumentsResponse>({
  method: 'GET',
  url: '/documents',
  loaderKey: LoaderKeys.DOCUMENT_LOADING,
});
