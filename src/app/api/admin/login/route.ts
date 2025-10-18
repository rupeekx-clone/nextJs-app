import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { generateAccessToken, generateRefreshToken } from '@/lib/jwt';
import User from '@/models/User';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = body;

    // Validate required fields
    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    await connectToDatabase();

    // Find admin user
    const admin = await User.findOne({ 
      email: email.toLowerCase(),
      user_type: 'admin'
    }).select('+password');

    if (!admin) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    // Check if admin is active
    if (admin.status !== 'active') {
      return NextResponse.json({ error: 'Admin account is not active' }, { status: 403 });
    }

    // Verify password
    const isPasswordValid = await admin.comparePassword(password);
    if (!isPasswordValid) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    // Generate tokens
    const accessToken = generateAccessToken({
      userId: (admin._id as { toString(): string }).toString(),
      email: admin.email,
      userType: admin.user_type,
    });

    const refreshToken = generateRefreshToken({
      userId: (admin._id as { toString(): string }).toString(),
      email: admin.email,
      userType: admin.user_type,
    });

    // Update last login
    (admin as { last_login?: Date }).last_login = new Date();
    await admin.save();

    const response = NextResponse.json({
      message: 'Admin login successful',
      accessToken,
      refreshToken,
      admin: {
        id: admin._id,
        email: admin.email,
        full_name: admin.full_name,
        user_type: admin.user_type,
      },
    }, { status: 200 });

    // Set refresh token as HTTP-only cookie
    response.cookies.set('adminRefreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: '/',
    });

    return response;

  } catch (error) {
    console.error('Admin login error:', error);
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
  }
}
