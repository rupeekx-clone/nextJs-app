/**
 * TypeScript types for document API requests and responses
 */

// Get My Documents
export interface GetMyDocumentsResponse {
  success: boolean;
  documents: Array<{
    _id: string;
    user_id: string;
    document_type: string;
    file_name: string;
    file_url: string;
    file_size: number;
    mime_type: string;
    status: 'pending' | 'approved' | 'rejected';
    uploaded_at: string;
    reviewed_at?: string;
    remarks?: string;
  }>;
}
