import { NextResponse } from 'next/server';
import User, { IUser } from '@/models/User';
import connectMongoDB from '@/lib/mongodb';
import { generateAccessToken, generateRefreshToken, AuthPayload } from '@/lib/jwt';

export async function POST(request: Request) {
  try {
    const { phone_number, otp_entered } = await request.json();

    // 1. Input Validation
    if (!phone_number || !otp_entered) {
      return NextResponse.json(
        { success: false, message: 'Phone number and OTP are required.' },
        { status: 400 }
      );
    }

    // 2. Connect to MongoDB
    await connectMongoDB();

    // 3. Find User and Validate OTP conditions
    const user = await User.findOne({ phone_number })
                           .select('+phone_otp +phone_otp_expires_at +status'); // Also select 'status'

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Verification failed. User not found for this number.' },
        { status: 400 } // Or 404 if preferred for "user not found"
      );
    }
    
    if (user.status !== 'pending_verification' || !user.phone_otp || !user.phone_otp_expires_at) {
      return NextResponse.json(
        { success: false, message: 'Verification failed. No OTP pending for this number or user not awaiting verification.' },
        { status: 400 }
      );
    }

    // Check OTP Expiry
    if (new Date() > user.phone_otp_expires_at) {
      user.phone_otp = undefined; // Clear OTP fields
      user.phone_otp_expires_at = undefined;
      // Optionally, you might want to keep status as 'pending_verification' or change it.
      // For now, just clearing OTP and letting them re-register/re-request OTP.
      await user.save();
      return NextResponse.json(
        { success: false, message: 'OTP has expired. Please request a new one.' },
        { status: 400 }
      );
    }

    // Compare OTP (Direct string comparison)
    if (otp_entered !== user.phone_otp) {
      return NextResponse.json(
        { success: false, message: 'Invalid OTP.' },
        { status: 400 }
      );
    }

    // 4. Handle Valid OTP: Update user document
    user.is_phone_verified = true;
    user.status = 'active';
    user.phone_otp = undefined; // Clear OTP
    user.phone_otp_expires_at = undefined; // Clear OTP expiry

    await user.save();

    // 5. Generate JWTs
    const tokenPayload: AuthPayload = {
      userId: user._id.toString(),
      userType: user.user_type, // Assuming user_type is part of IUser and schema
      // Add other relevant details to payload if needed, like email if it were present
    };
    const accessToken = generateAccessToken(tokenPayload);
    const refreshToken = generateRefreshToken(tokenPayload);

    // 6. Prepare user details for response (excluding sensitive fields)
    // The toJSON method in the User model should handle stripping password, OTP fields, __v
    const serializedUser = user.toJSON(); 

    return NextResponse.json(
      {
        success: true,
        message: 'Phone verified successfully. Logged in.',
        tokens: { accessToken, refreshToken },
        user: { // Construct user object as per API design, ensuring sensitive data excluded
            user_id: serializedUser._id,
            full_name: serializedUser.full_name,
            phone_number: serializedUser.phone_number,
            user_type: serializedUser.user_type,
            is_phone_verified: serializedUser.is_phone_verified,
            status: serializedUser.status,
            // Include other non-sensitive fields as needed, e.g., address if available and desired
            created_at: serializedUser.createdAt,
            updated_at: serializedUser.updatedAt,
        }
      },
      { status: 200 }
    );

  } catch (error: any) {
    console.error('Verify OTP error:', error);
    // Check for Mongoose validation error (though less likely here unless save fails)
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map((err: any) => err.message);
      return NextResponse.json(
        { success: false, message: 'Validation error during update.', details: errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, message: 'An unexpected error occurred during OTP verification.', details: error.message },
      { status: 500 }
    );
  }
}
