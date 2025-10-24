import { NextResponse } from 'next/server';
import { withAuth, NextRequestWithUser } from '@/lib/authMiddleware';
import { connectToDatabase } from '@/lib/mongodb';
import User from '@/models/User';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

// Initialize S3 client
const s3Client = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

const uploadProfilePictureHandler = async (req: NextRequestWithUser) => {
  try {
    const userId = req.user!.userId;
    await connectToDatabase();

    // Get the form data
    const formData = await req.formData();
    const file = formData.get('profilePicture') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ 
        error: 'Invalid file type. Only JPEG, JPG, and PNG files are allowed.' 
      }, { status: 400 });
    }

    // Validate file size (5MB max)
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if (file.size > maxSize) {
      return NextResponse.json({ 
        error: 'File size too large. Maximum size is 5MB.' 
      }, { status: 400 });
    }

    // Convert file to buffer
    const buffer = Buffer.from(await file.arrayBuffer());
    
    // Generate unique filename
    const timestamp = Date.now();
    const fileExtension = file.name.split('.').pop();
    const fileName = `profile-pictures/${userId}_${timestamp}.${fileExtension}`;

    // Upload to S3
    const uploadParams = {
      Bucket: process.env.AWS_S3_BUCKET_NAME!,
      Key: fileName,
      Body: buffer,
      ContentType: file.type,
      ACL: 'private' as const,
    };

    await s3Client.send(new PutObjectCommand(uploadParams));

    // Generate the S3 URL
    const profilePictureUrl = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;

    // Update user profile with new picture URL
    const user = await User.findByIdAndUpdate(
      userId,
      { 
        profile_picture_url: profilePictureUrl,
        updatedAt: new Date()
      },
      { new: true }
    ).select('-password -phone_otp');

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      profile_picture_url: profilePictureUrl,
      message: 'Profile picture updated successfully'
    }, { status: 200 });

  } catch (error: unknown) {
    console.error('Profile picture upload error:', error);
    return NextResponse.json({
      error: 'An unexpected error occurred while uploading the profile picture.',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
};

export const POST = withAuth(uploadProfilePictureHandler);
