import { NextResponse } from 'next/server';
import { NextResponse } from 'next/server';
import User, { IUser } from '@/models/User'; // Adjusted path if src is baseUrl
import connectMongoDB from '@/lib/mongodb'; // Adjusted path if src is baseUrl
import { generateAccessToken, generateRefreshToken, AuthPayload } from '@/lib/jwt'; // Import actual JWT functions

export async function POST(request: Request) {
  try {
    const { full_name, email, phone_number, password, user_type, address_line1, address_line2, city, pincode } = await request.json();

    // 1. Input Validation
    if (!full_name || !email || !phone_number || !password) {
      return NextResponse.json(
        { error: 'Validation failed', details: { message: 'Full name, email, phone number, and password are required.' } },
        { status: 400 }
      );
    }

    // Basic email format validation
    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Validation failed', details: { email: 'Invalid email format.' } },
        { status: 400 }
      );
    }

    // Basic password strength validation (e.g., min 8 characters)
    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Validation failed', details: { password: 'Password must be at least 8 characters long.' } },
        { status: 400 }
      );
    }
    
    // Basic phone number validation (e.g. Indian numbers)
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(phone_number)) {
        return NextResponse.json(
            { error: 'Validation failed', details: { phone_number: 'Invalid Indian phone number format.' } },
            { status: 400 }
        );
    }


    // 2. Connect to MongoDB
    await connectMongoDB();

    // 3. Check for Existing User
    const existingUser = await User.findOne({ $or: [{ email }, { phone_number }] });
    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email or phone number already exists' },
        { status: 409 } // 409 Conflict
      );
    }

    // 4. Create and Save New User
    const newUserPayload: Partial<IUser> = {
      full_name,
      email,
      phone_number,
      password, // Password will be hashed by the pre-save hook in the model
      user_type: user_type || 'customer', // Default to 'customer' if not provided
      address_line1,
      address_line2,
      city,
      pincode,
    };

    const newUser = new User(newUserPayload);
    await newUser.save();

    // 5. Generate JWT
    const tokenPayload: AuthPayload = {
      userId: newUser._id.toString(), // Ensure userId is a string
      email: newUser.email, // email is already part of AuthPayload if you extend a base interface
      userType: newUser.user_type,
    };
    const accessToken = generateAccessToken(tokenPayload);
    const refreshToken = generateRefreshToken(tokenPayload);


    // 6. Return Response
    // The toJSON method in the schema handles removing the password
    const userResponse = newUser.toJSON();

    return NextResponse.json(
      {
        user_id: userResponse._id, // In MongoDB, the ID is _id. This is consistent.
        full_name: userResponse.full_name,
        email: userResponse.email,
        phone_number: userResponse.phone_number,
        user_type: userResponse.user_type,
        access_token: accessToken, // Use the actual generated token
        refresh_token: refreshToken, // Use the actual generated token
        message: 'Registration successful. Please verify your email/phone.',
      },
      { status: 201 } // 201 Created
    );

  } catch (error: any) {
    console.error('Registration error:', error);
    // Check for Mongoose validation error
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map((err: any) => err.message);
      return NextResponse.json(
        { error: 'Validation failed', details: errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: 'An unexpected error occurred', details: error.message },
      { status: 500 }
    );
  }
}
```
