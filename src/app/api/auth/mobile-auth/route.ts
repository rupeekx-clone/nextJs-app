import { NextResponse } from 'next/server';
import User from '@/models/User';
import { connectMongoose } from '@/lib/mongoose';
import { generateOtp, sendOtp } from '@/lib/otpService';

// Retrieve OTP validity duration from environment variables, default to 10 minutes
const OTP_VALIDITY_MINUTES = parseInt(process.env.OTP_VALIDITY_MINUTES || '10', 10);

export async function POST(request: Request) {
  try {
    const { phone_number } = await request.json();

    // 1. Input Validation
    if (!phone_number) {
      return NextResponse.json(
        { success: false, message: 'Phone number is required.' },
        { status: 400 }
      );
    }

    // Validate Indian phone number format (10 digits starting with 6-9)
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(phone_number)) {
      return NextResponse.json(
        { success: false, message: 'Invalid phone number format. Please enter a valid 10-digit Indian mobile number.' },
        { status: 400 }
      );
    }

    // 2. Connect to MongoDB via Mongoose
    await connectMongoose();

    // 3. Check if user exists
    let user = await User.findOne({ phone_number });

    if (!user) {
      // 4a. Create new user with minimal data
      const newUser = new User({
        phone_number,
        full_name: 'User', // Temporary name, editable later
        user_type: 'customer',
        status: 'pending_verification',
        is_phone_verified: false,
        // email and password are optional (undefined)
      });

      user = await newUser.save();
      console.log(`New user created with phone: ${phone_number}`);
    } else {
      console.log(`Existing user found with phone: ${phone_number}`);
    }

    // 5. Generate OTP and set expiry
    const newOtp = generateOtp();
    const otpExpiresAt = new Date(Date.now() + OTP_VALIDITY_MINUTES * 60000);

    // 6. Update user with OTP
    user.phone_otp = newOtp;
    user.phone_otp_expires_at = otpExpiresAt;
    user.status = 'pending_verification';
    user.is_phone_verified = false;

    await user.save();

    // 7. Send OTP via Twilio (prepend +91 for Indian numbers)
    const formattedPhone = `+91${phone_number}`;
    const otpSentResult = await sendOtp(formattedPhone, newOtp);

    if (!otpSentResult.success) {
      console.error('Failed to send OTP:', otpSentResult.error);
      return NextResponse.json(
        { 
          success: false, 
          message: 'Failed to send OTP. Please try again or contact support.' 
        },
        { status: 500 }
      );
    }

    console.log(`OTP sent successfully to ${formattedPhone}`);

    // 8. Return success response
    return NextResponse.json(
      {
        success: true,
        message: 'OTP sent successfully to your mobile number.',
        phone_number: phone_number
      },
      { status: 200 }
    );

  } catch (error: unknown) {
    console.error('Mobile auth API error:', error);
    
    // Handle specific MongoDB errors
    if (error instanceof Error && error.name === 'ValidationError') {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Validation error. Please check your phone number format.' 
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { 
        success: false, 
        message: 'An unexpected error occurred. Please try again.' 
      },
      { status: 500 }
    );
  }
}
