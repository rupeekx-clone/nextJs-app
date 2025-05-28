import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
// User model is not directly used for instantiation here, but for schema reference if needed.
// We will interact directly with the 'users' collection.
import bcrypt from 'bcryptjs';
import { generateAccessToken, generateRefreshToken } from '@/lib/jwt'; // Assuming these are the correct function names

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email_or_phone, password } = body;

    // Validate request body
    if (!email_or_phone || !password) {
      return NextResponse.json({ message: 'Email/phone and password are required' }, { status: 400 });
    }

    const { db } = await connectToDatabase();

    // Find user by email or phone number
    // Make sure the User model's collection name is 'users'
    const user = await db.collection('users').findOne({
      $or: [
        { email: email_or_phone },
        { phone_number: email_or_phone },
      ],
    });

    if (!user) {
      // To prevent user enumeration, you might want to return a generic "Invalid credentials" message here as well.
      // However, the spec asks for 404 if user not found.
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    // Compare password
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
    }

    // Generate tokens
    // Ensure user._id is correctly passed and converted to string if necessary by generateAccessToken/generateRefreshToken
    const access_token = generateAccessToken({ userId: user._id.toString(), email: user.email, user_type: user.user_type });
    const refresh_token = generateRefreshToken({ userId: user._id.toString() });

    return NextResponse.json({
      message: 'Login successful',
      user: {
        id: user._id.toString(), // Ensure ID is returned as a string
        full_name: user.full_name,
        email: user.email,
        user_type: user.user_type,
      },
      access_token,
      refresh_token,
    }, { status: 200 });

  } catch (error) {
    console.error('Error logging in user:', error);
    // It's good practice to log the error on the server side.
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
