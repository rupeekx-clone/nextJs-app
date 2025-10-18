import { NextRequest, NextResponse } from 'next/server';
import { withAdminAuth, NextRequestWithAdmin } from '@/lib/adminAuthMiddleware';
import { connectToDatabase } from '@/lib/mongodb';
import User from '@/models/User';

const activateUserHandler = async (req: NextRequestWithAdmin) => {
  try {
    const url = new URL(req.url);
    const pathParts = url.pathname.split('/');
    const userId = pathParts[pathParts.length - 2]; // activate is the last part, so id is second to last

    await connectToDatabase();

    // Find the user
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Check if user is already active
    if (user.status === 'active') {
      return NextResponse.json({ error: 'User is already active' }, { status: 400 });
    }

    // Activate the user
    user.status = 'active';
    user.updated_at = new Date();
    await user.save();

    return NextResponse.json({
      message: 'User activated successfully',
      user_id: user._id,
      status: user.status,
    }, { status: 200 });

  } catch (error) {
    console.error('Error activating user:', error);
    if (error instanceof Error && error.name === 'CastError') {
      return NextResponse.json({ error: 'Invalid user ID format' }, { status: 400 });
    }
    return NextResponse.json({
      error: 'An unexpected error occurred while activating the user.',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
};

export const POST = withAdminAuth(activateUserHandler);
