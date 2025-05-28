import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs'; // Corrected import
import { generateAccessToken, generateRefreshToken } from '@/lib/jwt'; // Assuming these are the correct function names
import User, { IUser } from '@/models/User';
import { connectToDatabase } from '@/lib/mongodb';
import { generateOtp, sendOtp } from '@/lib/otpService';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Validate request body
    const { full_name, email, phone_number, password, address_line1, address_line2, city, pincode, user_type = 'customer' } = body;

    if (!full_name || !email || !phone_number || !password) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ message: 'Invalid email format' }, { status: 400 });
    }

    // Basic phone number validation (Indian format)
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(phone_number)) {
      return NextResponse.json({ message: 'Invalid phone number format' }, { status: 400 });
    }

    // Password strength validation
    if (password.length < 8) {
      return NextResponse.json({ message: 'Password must be at least 8 characters long' }, { status: 400 });
    }
    const db = await connectToDatabase();

    // Pincode validation (Indian format)
    if (pincode && !/^[1-9][0-9]{5}$/.test(pincode)) {
      return NextResponse.json({ message: 'Invalid pincode format' }, { status: 400 });
    }

    // User type validation
    if (user_type && !['customer', 'cash_lending_customer'].includes(user_type)) {
        return NextResponse.json({ message: 'Invalid user type' }, { status: 400 });
    }

    // Check if user already exists
    const existingUser = await db.collection('users').findOne({ $or: [{ email }, { phone_number }] });
    if (existingUser) {
      return NextResponse.json({ message: 'User with this email or phone number already exists' }, { status: 409 });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = {
      full_name,
      email,
      phone_number,
      password: hashedPassword,
      address: {
        line1: address_line1,
        line2: address_line2,
        city,
        pincode,
      },
      user_type,
      email_verified_at: null,
      phone_verified_at: null,
      created_at: new Date(),
      updated_at: new Date(),
    };

    const result = await db.collection('users').insertOne(newUser);
    const createdUser = { _id: result.insertedId, ...newUser };


    // Generate tokens
    const access_token = generateAccessToken({ userId: createdUser._id.toString(), email: createdUser.email, userType: createdUser.user_type });
    const refresh_token = generateRefreshToken({ userId: createdUser._id.toString(), userType: createdUser.user_type });

    return NextResponse.json({
      message: 'User registered successfully',
      user: {
        id: createdUser._id.toString(),
        full_name: createdUser.full_name,
        email: createdUser.email,
        phone_number: createdUser.phone_number,
        user_type: createdUser.user_type,
      },
      access_token,
      refresh_token,
    }, { status: 201 });

  } catch (error) {
    console.error('Error registering user:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
