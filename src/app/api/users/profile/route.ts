import { NextResponse, NextRequest } from 'next/server';
import User from '@/models/User'; // Adjust path as per your project structure
import { connectToDatabase } from '@/lib/mongodb'; // Adjust path
import { verifyToken } from '@/lib/jwt'; // Adjust path

export async function GET(req: NextRequest) {
  try {
    // 1. Verify JWT token
    const authHeader = req.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized: No token provided' }, { status: 401 });
    }
    const token = authHeader.split(' ')[1];
    
    let decodedToken;
    try {
      decodedToken = verifyToken(token, process.env.ACCESS_TOKEN_SECRET || 'default-access-secret-key-for-dev-must-be-32-chars');
      if (!decodedToken || !decodedToken.userId) {
        return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
      }
    } catch {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }
    
    const userId = decodedToken.userId;

    // 2. Connect to MongoDB
    await connectToDatabase();

    // 3. Fetch User Data
    // Explicitly exclude the password field. Other fields are returned by default.
    // The User model's toJSON method also handles password exclusion, but select here is a good practice.
    const user = await User.findById(userId).select('-password');

    if (!user) {
      // This might happen if the user was deleted after the token was issued.
      return NextResponse.json({ error: 'User profile not found' }, { status: 404 });
    }

    // 4. Return User Profile
    // The toJSON method in the User schema should handle removing __v and potentially transforming _id to user_id if needed.
    // However, the response structure in api_endpoints.md for GET /api/users/me uses the fields directly from the User model.
    // Let's ensure the response matches the UserResponse schema from openapi.yaml or api_endpoints.md
    
    const userProfile = user.toJSON(); // Leverages the toJSON transform in the User model

    return NextResponse.json(
      {
        user_id: userProfile._id,
        full_name: userProfile.full_name,
        phone_number: userProfile.phone_number,
        address_line1: userProfile.address_line1,
        address_line2: userProfile.address_line2,
        city: userProfile.city,
        pincode: userProfile.pincode,
        user_type: userProfile.user_type,
        is_phone_verified: userProfile.is_phone_verified, // Added this field
        status: userProfile.status, // Added this field
        created_at: userProfile.createdAt,
        updated_at: userProfile.updatedAt,
      },
      { status: 200 }
    );

  } catch (error: unknown) {
    console.error('Get User Profile error:', error);
    // Check if it's a CastError (e.g., invalid ObjectId format for userId)
    if (error instanceof Error && error.name === 'CastError') {
      return NextResponse.json({ error: 'Invalid user ID format' }, { status: 400 });
    }
    return NextResponse.json(
      { error: 'An unexpected error occurred while fetching the user profile.', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
};

