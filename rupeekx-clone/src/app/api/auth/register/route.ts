import { NextResponse } from 'next/server';
import User, { IUser } from '@/models/User';
import connectMongoDB from '@/lib/mongodb';
import { generateOtp, sendOtp } from '@/lib/otpService';

// Retrieve OTP validity duration from environment variables, default to 10 minutes
const OTP_VALIDITY_MINUTES = parseInt(process.env.OTP_VALIDITY_MINUTES || '10', 10);

export async function POST(request: Request) {
  try {
    const { full_name, phone_number, password } = await request.json();

    // 1. Input Validation
    if (!full_name || !phone_number || !password) {
      return NextResponse.json(
        { success: false, message: 'Full name, phone number, and password are required.' },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { success: false, message: 'Password must be at least 8 characters long.' },
        { status: 400 }
      );
    }
    
    const phoneRegex = /^[6-9]\d{9}$/; 
    if (!phoneRegex.test(phone_number)) {
        return NextResponse.json(
            { success: false, message: 'Invalid Indian phone number format. It should be 10 digits starting with 6, 7, 8, or 9.' },
            { status: 400 }
        );
    }

    await connectMongoDB();

    const existingUser = await User.findOne({ phone_number })
                                   .select('+phone_otp +phone_otp_expires_at +status +password'); 

    const newOtp = generateOtp();
    const otpExpiresAt = new Date(Date.now() + OTP_VALIDITY_MINUTES * 60000);

    if (existingUser) {
      if (existingUser.status === 'active') {
        return NextResponse.json(
          { success: false, message: 'Phone number already registered and active.' },
          { status: 409 }
        );
      }

      existingUser.phone_otp = newOtp;
      existingUser.phone_otp_expires_at = otpExpiresAt;
      existingUser.status = 'pending_verification'; 
      existingUser.is_phone_verified = false;

      // If password is provided in the payload, update it.
      // The pre-save hook in the User model will hash it if it's modified.
      if (password) {
        existingUser.password = password;
      }

      await existingUser.save();

      // Prefix with +91 for Indian numbers when sending OTP
      const otpSentResult = await sendOtp(`+91${phone_number}`, newOtp); 
      if (!otpSentResult.success) {
        console.error('Failed to send OTP for existing user:', otpSentResult.error);
        return NextResponse.json(
          { success: false, message: 'Error sending OTP. Please try again.' },
          { status: 500 }
        );
      }

      return NextResponse.json(
        { success: true, message: 'OTP re-sent. Please verify to complete registration.' },
        { status: 200 }
      );
    }

    // New User
    const newUserPayload: Partial<IUser> = {
      full_name,
      phone_number,
      password, 
      phone_otp: newOtp,
      phone_otp_expires_at: otpExpiresAt,
      status: 'pending_verification',
      is_phone_verified: false,
    };

    const newUser = new User(newUserPayload);
    await newUser.save();

    const otpSentResult = await sendOtp(`+91${phone_number}`, newOtp);
    if (!otpSentResult.success) {
      console.error('Failed to send OTP for new user:', otpSentResult.error);
      // Optional: Attempt to delete the user if OTP sending fails critically
      // await User.deleteOne({ _id: newUser._id });
      return NextResponse.json(
        { success: false, message: 'User created, but failed to send OTP. Please try verifying later or contact support.' },
        { status: 500 } 
      );
    }

    return NextResponse.json(
      { success: true, message: 'OTP sent to your mobile number. Please verify to complete registration.' },
      { status: 201 }
    );

  } catch (error: any) {
    console.error('Registration error:', error);
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map((err: any) => err.message);
      return NextResponse.json(
        { success: false, message: 'Validation failed', details: errors },
        { status: 400 }
      );
    }
    if (error.code === 11000 && error.keyPattern && error.keyPattern.phone_number) {
        return NextResponse.json(
            { success: false, message: "This phone number is already registered." },
            { status: 409 }
        );
    }
    return NextResponse.json(
      { success: false, message: 'An unexpected error occurred during registration.', details: error.message },
      { status: 500 }
    );
  }
}
```
