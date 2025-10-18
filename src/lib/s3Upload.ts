import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { v4 as uuidv4 } from 'uuid';

// Initialize S3 client
const s3Client = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

const BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME!;

export interface UploadOptions {
  file: Buffer;
  fileName: string;
  contentType: string;
  folder?: string;
}

export interface PresignedUrlOptions {
  fileName: string;
  contentType: string;
  folder?: string;
  expiresIn?: number; // seconds
}

export class S3Service {
  /**
   * Upload file directly to S3
   */
  static async uploadFile(options: UploadOptions): Promise<{ success: boolean; url?: string; error?: string }> {
    try {
      const key = options.folder 
        ? `${options.folder}/${uuidv4()}-${options.fileName}`
        : `${uuidv4()}-${options.fileName}`;

      const command = new PutObjectCommand({
        Bucket: BUCKET_NAME,
        Key: key,
        Body: options.file,
        ContentType: options.contentType,
        ACL: 'private', // Make files private by default
      });

      await s3Client.send(command);

      const url = `https://${BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
      
      return {
        success: true,
        url,
      };
    } catch (error) {
      console.error('S3 upload error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Upload failed',
      };
    }
  }

  /**
   * Generate presigned URL for direct client upload
   */
  static async generatePresignedUrl(options: PresignedUrlOptions): Promise<{ success: boolean; url?: string; key?: string; error?: string }> {
    try {
      const key = options.folder 
        ? `${options.folder}/${uuidv4()}-${options.fileName}`
        : `${uuidv4()}-${options.fileName}`;

      const command = new PutObjectCommand({
        Bucket: BUCKET_NAME,
        Key: key,
        ContentType: options.contentType,
        ACL: 'private',
      });

      const url = await getSignedUrl(s3Client, command, {
        expiresIn: options.expiresIn || 3600, // 1 hour default
      });

      return {
        success: true,
        url,
        key,
      };
    } catch (error) {
      console.error('S3 presigned URL error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to generate presigned URL',
      };
    }
  }

  /**
   * Generate presigned URL for file download
   */
  static async generateDownloadUrl(key: string, expiresIn: number = 3600): Promise<{ success: boolean; url?: string; error?: string }> {
    try {
      const command = new GetObjectCommand({
        Bucket: BUCKET_NAME,
        Key: key,
      });

      const url = await getSignedUrl(s3Client, command, { expiresIn });

      return {
        success: true,
        url,
      };
    } catch (error) {
      console.error('S3 download URL error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to generate download URL',
      };
    }
  }

  /**
   * Delete file from S3
   */
  static async deleteFile(key: string): Promise<{ success: boolean; error?: string }> {
    try {
      const command = new DeleteObjectCommand({
        Bucket: BUCKET_NAME,
        Key: key,
      });

      await s3Client.send(command);

      return { success: true };
    } catch (error) {
      console.error('S3 delete error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to delete file',
      };
    }
  }

  /**
   * Upload document for loan application
   */
  static async uploadDocument(file: Buffer, fileName: string, userId: string, documentType: string): Promise<{ success: boolean; url?: string; error?: string }> {
    const folder = `documents/${userId}/${documentType}`;
    const contentType = this.getContentType(fileName);

    return this.uploadFile({
      file,
      fileName,
      contentType,
      folder,
    });
  }

  /**
   * Generate presigned URL for document upload
   */
  static async generateDocumentUploadUrl(fileName: string, userId: string, documentType: string): Promise<{ success: boolean; url?: string; key?: string; error?: string }> {
    const folder = `documents/${userId}/${documentType}`;
    const contentType = this.getContentType(fileName);

    return this.generatePresignedUrl({
      fileName,
      contentType,
      folder,
      expiresIn: 3600, // 1 hour
    });
  }

  /**
   * Get content type based on file extension
   */
  private static getContentType(fileName: string): string {
    const extension = fileName.split('.').pop()?.toLowerCase();
    
    const contentTypes: Record<string, string> = {
      pdf: 'application/pdf',
      jpg: 'image/jpeg',
      jpeg: 'image/jpeg',
      png: 'image/png',
      gif: 'image/gif',
      doc: 'application/msword',
      docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      xls: 'application/vnd.ms-excel',
      xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    };

    return contentTypes[extension || ''] || 'application/octet-stream';
  }

  /**
   * Validate file type for documents
   */
  static isValidDocumentType(fileName: string): boolean {
    const allowedExtensions = ['pdf', 'jpg', 'jpeg', 'png', 'doc', 'docx'];
    const extension = fileName.split('.').pop()?.toLowerCase();
    return allowedExtensions.includes(extension || '');
  }

  /**
   * Validate file size (max 10MB)
   */
  static isValidFileSize(fileSize: number): boolean {
    const maxSize = 10 * 1024 * 1024; // 10MB
    return fileSize <= maxSize;
  }
}

export default S3Service;
