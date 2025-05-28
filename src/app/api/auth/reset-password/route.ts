import { NextResponse } from 'next/server';
import User from '@/models/User';
import { connectToDatabase } from '@/lib/mongodb';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  try {
    const { phone_number, new_password } = await request.json();
    if (!phone_number || !new_password) {
      return NextResponse.json({ success: false, message: 'Phone number and new password are required.' }, { status: 400 });
    }
    if (new_password.length < 8) {
      return NextResponse.json({ success: false, message: 'Password must be at least 8 characters long.' }, { status: 400 });
    }
    await connectToDatabase();
    const user = await User.findOne({ phone_number });
    if (!user) {
      return NextResponse.json({ success: false, message: 'No user found with this mobile number.' }, { status: 404 });
    }
    if (user.status !== 'pending_verification') {
      return NextResponse.json({ success: false, message: 'Password reset not allowed. Please request OTP again.' }, { status: 400 });
    }
    // Hash new password
    const hashedPassword = await bcrypt.hash(new_password, 10);
    user.password = hashedPassword;
    user.status = 'active';
    user.is_phone_verified = true;
    user.phone_otp = undefined;
    user.phone_otp_expires_at = undefined;
    await user.save();
    return NextResponse.json({ success: true, message: 'Password reset successful. You can now log in.' }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: 'An error occurred.', details: error.message }, { status: 500 });
  }
} 