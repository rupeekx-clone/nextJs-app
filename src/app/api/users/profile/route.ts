import { NextResponse } from 'next/server';
import User from '@/models/User';
import { connectToDatabase } from '@/lib/mongodb';
import { withAuth, NextRequestWithUser } from '@/lib/authMiddleware';
import { validateData, userProfileUpdateSchema } from '@/lib/validation';

const getProfileHandler = async (req: NextRequestWithUser) => {
  try {
    const userId = req.user!.userId;
    await connectToDatabase();

    const user = await User.findById(userId).select('-password -phone_otp');

    if (!user) {
      return NextResponse.json({ error: 'User profile not found' }, { status: 404 });
    }

    const userProfile = user.toJSON();

    return NextResponse.json({
      user_id: userProfile._id,
      full_name: userProfile.full_name,
      email: userProfile.email,
      phone_number: userProfile.phone_number,
      address_line1: userProfile.address_line1,
      address_line2: userProfile.address_line2,
      city: userProfile.city,
      pincode: userProfile.pincode,
      user_type: userProfile.user_type,
      email_verified_at: userProfile.email_verified_at,
      phone_verified_at: userProfile.phone_verified_at,
      created_at: userProfile.createdAt,
      updated_at: userProfile.updatedAt,
    }, { status: 200 });

  } catch (error: unknown) {
    console.error('Get User Profile error:', error);
    if (error instanceof Error && error.name === 'CastError') {
      return NextResponse.json({ error: 'Invalid user ID format' }, { status: 400 });
    }
    return NextResponse.json({
      error: 'An unexpected error occurred while fetching the user profile.',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
};

const updateProfileHandler = async (req: NextRequestWithUser) => {
  try {
    const userId = req.user!.userId;
    const body = await req.json();

    // Validate the request body
    const validation = validateData(userProfileUpdateSchema, body);
    if (!validation.success) {
      return NextResponse.json({
        error: 'Validation failed',
        details: validation.errors
      }, { status: 400 });
    }

    await connectToDatabase();

    // Update user profile
    const user = await User.findByIdAndUpdate(
      userId,
      { 
        ...(validation.data as { full_name?: string; phone_number?: string; address_line1?: string; address_line2?: string; city?: string; pincode?: string; }),
        updated_at: new Date()
      },
      { new: true, runValidators: true }
    ).select('-password -phone_otp');

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const userProfile = user.toJSON();

    return NextResponse.json({
      user_id: userProfile._id,
      full_name: userProfile.full_name,
      email: userProfile.email,
      phone_number: userProfile.phone_number,
      address_line1: userProfile.address_line1,
      address_line2: userProfile.address_line2,
      city: userProfile.city,
      pincode: userProfile.pincode,
      user_type: userProfile.user_type,
      email_verified_at: userProfile.email_verified_at,
      phone_verified_at: userProfile.phone_verified_at,
      updated_at: userProfile.updatedAt,
      message: 'Profile updated successfully'
    }, { status: 200 });

  } catch (error: unknown) {
    console.error('Update User Profile error:', error);
    return NextResponse.json({
      error: 'An unexpected error occurred while updating the user profile.',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
};

export const GET = withAuth(getProfileHandler);
export const PUT = withAuth(updateProfileHandler);

