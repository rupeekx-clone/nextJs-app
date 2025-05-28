import { NextResponse } from 'next/server';
import User, { IUser } from '@/models/User';
import connectMongoDB from '@/lib/mongodb';
import { generateAccessToken, generateRefreshToken, AuthPayload } from '@/lib/jwt';
import { generateOtp, sendOtp } from '@/lib/otpService';

// Retrieve OTP validity duration from environment variables, default to 10 minutes
const OTP_VALIDITY_MINUTES = parseInt(process.env.OTP_VALIDITY_MINUTES || '10', 10);

export async function POST(request: Request) {
  try {
    const { phone_number, password } = await request.json();

    // 1. Input Validation
    if (!phone_number || !password) {
      return NextResponse.json(
        { success: false, message: 'Phone number and password are required.' },
        { status: 400 }
      );
    }

    // 2. Connect to MongoDB
    await connectMongoDB();

    // 3. Find User and Validate Password
    const user = await User.findOne({ phone_number })
                           .select('+password +is_phone_verified +status +phone_otp +phone_otp_expires_at');

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Invalid credentials.' }, // Generic message for security
        { status: 401 }
      );
    }

    const isPasswordMatch = await user.comparePassword(password);
    if (!isPasswordMatch) {
      return NextResponse.json(
        { success: false, message: 'Invalid credentials.' }, // Generic message
        { status: 401 }
      );
    }

    // 4. Handle Password Validation Success
    if (user.status === 'active' && user.is_phone_verified === true) {
      // User is fully active and verified
      const tokenPayload: AuthPayload = {
        userId: user._id.toString(),
        userType: user.user_type,
      };
      const accessToken = generateAccessToken(tokenPayload);
      const refreshToken = generateRefreshToken(tokenPayload);

      const serializedUser = user.toJSON(); // Excludes sensitive fields via model's toJSON

      return NextResponse.json(
        {
          success: true,
          message: 'Login successful.',
          tokens: { accessToken, refreshToken },
          user: { // Construct user object as per API design
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
    } else {
      // Account needs phone verification (e.g., status is 'pending_verification' or phone not verified)
      const newOtp = generateOtp();
      const otpExpiresAt = new Date(Date.now() + OTP_VALIDITY_MINUTES * 60000);

      user.phone_otp = newOtp;
      user.phone_otp_expires_at = otpExpiresAt;
      // Ensure status is pending_verification if it wasn't already (e.g. if it was suspended and we allow re-verification this way)
      user.status = 'pending_verification'; 
      user.is_phone_verified = false; // Ensure this is false until OTP is verified

      await user.save();

      // Prefix with +91 for Indian numbers when sending OTP
      const otpSentResult = await sendOtp(`+91${user.phone_number}`, newOtp);
      if (!otpSentResult.success) {
        console.error('Failed to send OTP during login for unverified user:', otpSentResult.error);
        // Even if OTP sending fails, the user's OTP fields are updated.
        // They can try verifying later or request OTP again via another mechanism if available.
        return NextResponse.json(
          { success: false, message: 'Account pending verification. Error sending OTP, please try registering again to get a new OTP or contact support.' },
          { status: 500 } // Internal server error because OTP should have been sent
        );
      }

      return NextResponse.json(
        {
          success: false, // Or a specific code indicating OTP verification is needed
          message: 'Account pending verification. New OTP sent to your mobile number.',
          verification_required: true,
          phone_number: user.phone_number, // Return phone_number to assist client if needed
        },
        { status: 403 } // 403 Forbidden - user is known, but not allowed access yet
      );
    }

  } catch (error: any) {
    console.error('Login API error:', error);
    return NextResponse.json(
      { success: false, message: 'An unexpected error occurred during login.', details: error.message },
      { status: 500 }
    );
  }
}
```
