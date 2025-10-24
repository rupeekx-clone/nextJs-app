/**
 * Document actions export
 * Provides clean API for all document-related operations
 */

import {
  getMyDocuments,
} from './actions';

// Export individual actions
export {
  getMyDocuments,
};

// Export types for external use
export type {
  GetMyDocumentsResponse,
} from './types';

// Grouped actions for easier access
export const documentActions = {
  getMyDocuments,
} as const;
