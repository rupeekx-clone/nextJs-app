import { NextResponse } from 'next/server';
import User from '@/models/User';
import { connectToDatabase } from '@/lib/mongodb';
import { generateOtp, sendOtp } from '@/lib/otpService';

const OTP_VALIDITY_MINUTES = parseInt(process.env.OTP_VALIDITY_MINUTES || '10', 10);

export async function POST(request: Request) {
  try {
    const { phone_number } = await request.json();
    if (!phone_number) {
      return NextResponse.json({ success: false, message: 'Phone number is required.' }, { status: 400 });
    }
    await connectToDatabase();
    const user = await User.findOne({ phone_number });
    if (!user) {
      return NextResponse.json({ success: false, message: 'No user found with this mobile number.' }, { status: 404 });
    }
    // Generate OTP and set status to pending_verification
    const otp = generateOtp();
    const otpExpiresAt = new Date(Date.now() + OTP_VALIDITY_MINUTES * 60000);
    user.phone_otp = otp;
    user.phone_otp_expires_at = otpExpiresAt;
    user.status = 'pending_verification';
    await user.save();
    const otpSentResult = await sendOtp(`+91${user.phone_number}`, otp);
    if (!otpSentResult.success) {
      return NextResponse.json({ success: false, message: 'Failed to send OTP. Please try again.' }, { status: 500 });
    }
    return NextResponse.json({ success: true, message: 'OTP sent to your mobile number.', phone_number: user.phone_number }, { status: 200 });
  } catch (error: unknown) {
    return NextResponse.json({ success: false, message: 'An error occurred.', details: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
  }
} 