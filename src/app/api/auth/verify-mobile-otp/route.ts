import { NextResponse } from 'next/server';
import User from '@/models/User';
import { connectMongoose } from '@/lib/mongoose';
import { generateAccessToken, generateRefreshToken, AuthPayload } from '@/lib/jwt';

export async function POST(request: Request) {
  try {
    const { phone_number, otp } = await request.json();

    // 1. Input Validation
    if (!phone_number || !otp) {
      return NextResponse.json(
        { success: false, message: 'Phone number and OTP are required.' },
        { status: 400 }
      );
    }

    // Validate phone number format
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(phone_number)) {
      return NextResponse.json(
        { success: false, message: 'Invalid phone number format.' },
        { status: 400 }
      );
    }

    // Validate OTP format (6 digits)
    const otpRegex = /^\d{6}$/;
    if (!otpRegex.test(otp)) {
      return NextResponse.json(
        { success: false, message: 'Invalid OTP format. Please enter 6 digits.' },
        { status: 400 }
      );
    }

    // 2. Connect to MongoDB via Mongoose
    await connectMongoose();

    // 3. Find user and validate OTP conditions
    const user = await User.findOne({ phone_number })
                           .select('+phone_otp +phone_otp_expires_at +status');

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found. Please request OTP again.' },
        { status: 404 }
      );
    }

    // 4. Check if OTP is pending
    if (!user.phone_otp || !user.phone_otp_expires_at) {
      return NextResponse.json(
        { success: false, message: 'No OTP pending for this number. Please request a new OTP.' },
        { status: 400 }
      );
    }

    // 5. Check OTP expiry
    if (new Date() > user.phone_otp_expires_at) {
      // Clear expired OTP
      user.phone_otp = undefined;
      user.phone_otp_expires_at = undefined;
      await user.save();

      return NextResponse.json(
        { success: false, message: 'OTP has expired. Please request a new one.' },
        { status: 400 }
      );
    }

    // 6. Verify OTP
    if (otp !== user.phone_otp) {
      return NextResponse.json(
        { success: false, message: 'Invalid OTP. Please check and try again.' },
        { status: 400 }
      );
    }

    // 7. OTP is valid - update user status
    user.is_phone_verified = true;
    user.phone_verified_at = new Date();
    user.status = 'active';
    user.phone_otp = undefined; // Clear OTP
    user.phone_otp_expires_at = undefined; // Clear OTP expiry

    await user.save();

    // 8. Generate JWT tokens (7-day access token)
    const tokenPayload: AuthPayload = {
      userId: (user._id as { toString(): string }).toString(),
      email: user.email || '', // May be empty for mobile-only users
      userType: user.user_type,
    };

    const accessToken = generateAccessToken(tokenPayload);
    const refreshToken = generateRefreshToken(tokenPayload);

    // 9. Prepare user data for response (excluding sensitive fields)
    const serializedUser = user.toJSON();

    console.log(`User ${phone_number} successfully verified and logged in`);

    return NextResponse.json(
      {
        success: true,
        message: 'Login successful! Welcome to Blumiq.',
        tokens: {
          accessToken,
          refreshToken
        },
        user: {
          user_id: serializedUser._id,
          full_name: serializedUser.full_name,
          phone_number: serializedUser.phone_number,
          user_type: serializedUser.user_type,
          is_phone_verified: serializedUser.is_phone_verified,
          status: serializedUser.status,
          created_at: serializedUser.createdAt,
          updated_at: serializedUser.updatedAt,
        }
      },
      { status: 200 }
    );

  } catch (error: unknown) {
    console.error('Verify mobile OTP error:', error);

    // Handle Mongoose validation errors
    if (error instanceof Error && error.name === 'ValidationError') {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Validation error during verification.' 
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { 
        success: false, 
        message: 'An unexpected error occurred during verification. Please try again.' 
      },
      { status: 500 }
    );
  }
}
