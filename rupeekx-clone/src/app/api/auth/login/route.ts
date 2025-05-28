import { NextResponse } from 'next/server';
import { NextResponse } from 'next/server';
import User, { IUser } from '@/models/User'; // Adjusted path assuming src is baseUrl or similar setup
import connectMongoDB from '@/lib/mongodb';   // Adjusted path
import { generateAccessToken, generateRefreshToken, AuthPayload } from '@/lib/jwt'; // Import actual JWT functions

export async function POST(request: Request) {
  try {
    const { email_or_phone, password } = await request.json();

    // 1. Input Validation
    if (!email_or_phone || !password) {
      return NextResponse.json(
        { error: 'Validation failed', details: { message: 'Email/Phone and password are required.' } },
        { status: 400 }
      );
    }

    // 2. Connect to MongoDB
    await connectMongoDB();

    // 3. Find User by Email or Phone
    // Need to fetch password explicitly as it's select: false in schema
    const user = await User.findOne({ 
      $or: [{ email: email_or_phone }, { phone_number: email_or_phone }] 
    }).select('+password');

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 } // 401 Unauthorized
      );
    }

    // 4. Verify Password
    // The user object from findOne().select('+password') will have the password field.
    // The comparePassword method is defined in the User model.
    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 } // 401 Unauthorized
      );
    }

    // 5. Generate JWT
    const tokenPayload: AuthPayload = {
      userId: user._id.toString(), // Ensure userId is a string
      email: user.email, // email is already part of AuthPayload if you extend a base interface
      userType: user.user_type,
    };
    const accessToken = generateAccessToken(tokenPayload);
    const refreshToken = generateRefreshToken(tokenPayload);

    // 6. Return Response
    // The toJSON method in the schema handles removing the password and __v
    const userResponse = user.toJSON();

    return NextResponse.json(
      {
        user_id: userResponse._id, // In MongoDB, the ID is _id. This is consistent.
        full_name: userResponse.full_name,
        email: userResponse.email,
        user_type: userResponse.user_type,
        access_token: accessToken, // Use the actual generated token
        refresh_token: refreshToken, // Use the actual generated token
        message: 'Login successful',
      },
      { status: 200 } // 200 OK
    );

  } catch (error: any) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred', details: error.message },
      { status: 500 }
    );
  }
}
```
