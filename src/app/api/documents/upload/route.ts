import { NextRequest, NextResponse } from 'next/server';
import { withAuth, NextRequestWithUser } from '@/lib/authMiddleware';
import { S3Service } from '@/lib/s3Upload';
import { validateData } from '@/lib/validation';
import { z } from 'zod';

const uploadDocumentSchema = z.object({
  fileName: z.string().min(1, 'File name is required'),
  fileSize: z.number().max(10 * 1024 * 1024, 'File size must be less than 10MB'),
  contentType: z.string().min(1, 'Content type is required'),
  documentType: z.enum(['address_proof', 'identity_proof', 'income_proof', 'bank_statement', 'other']),
});

const uploadDocumentHandler = async (req: NextRequestWithUser) => {
  try {
    const userId = req.user!.userId;
    const body = await req.json();

    // Validate the request body
    const validation = validateData(uploadDocumentSchema, body);
    if (!validation.success) {
      return NextResponse.json({
        error: 'Validation failed',
        details: validation.errors
      }, { status: 400 });
    }

    const validatedData = validation.data as any;

    // Validate file type
    if (!S3Service.isValidDocumentType(validatedData.fileName)) {
      return NextResponse.json({
        error: 'Invalid file type. Only PDF, JPG, JPEG, PNG, DOC, DOCX files are allowed'
      }, { status: 400 });
    }

    // Validate file size
    if (!S3Service.isValidFileSize(validatedData.fileSize)) {
      return NextResponse.json({
        error: 'File size too large. Maximum size is 10MB'
      }, { status: 400 });
    }

    // Generate presigned URL for document upload
    const uploadResult = await S3Service.generateDocumentUploadUrl(
      validatedData.fileName,
      userId,
      validatedData.documentType
    );

    if (!uploadResult.success) {
      return NextResponse.json({
        error: 'Failed to generate upload URL',
        details: uploadResult.error
      }, { status: 500 });
    }

    return NextResponse.json({
      upload_url: uploadResult.url,
      file_key: uploadResult.key,
      document_type: validatedData.documentType,
      message: 'Upload URL generated successfully'
    }, { status: 200 });

  } catch (error) {
    console.error('Error generating upload URL:', error);
    return NextResponse.json({
      error: 'An unexpected error occurred'
    }, { status: 500 });
  }
};

export const POST = withAuth(uploadDocumentHandler);
