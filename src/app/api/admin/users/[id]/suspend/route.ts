import { NextResponse } from 'next/server';
import { withAdminAuth, NextRequestWithAdmin } from '@/lib/adminAuthMiddleware';
import { connectToDatabase } from '@/lib/mongodb';
import User from '@/models/User';

const suspendUserHandler = async (req: NextRequestWithAdmin) => {
  try {
    const url = new URL(req.url);
    const pathParts = url.pathname.split('/');
    const userId = pathParts[pathParts.length - 2]; // suspend is the last part, so id is second to last

    await connectToDatabase();

    // Find the user
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Check if user is already suspended
    if (user.status === 'suspended') {
      return NextResponse.json({ error: 'User is already suspended' }, { status: 400 });
    }

    // Check if trying to suspend an admin
    if (user.user_type === 'admin') {
      return NextResponse.json({ error: 'Cannot suspend admin users' }, { status: 403 });
    }

    // Suspend the user
    user.status = 'suspended';
    user.updatedAt = new Date();
    await user.save();

    return NextResponse.json({
      message: 'User suspended successfully',
      user_id: user._id,
      status: user.status,
    }, { status: 200 });

  } catch (error) {
    console.error('Error suspending user:', error);
    if (error instanceof Error && error.name === 'CastError') {
      return NextResponse.json({ error: 'Invalid user ID format' }, { status: 400 });
    }
    return NextResponse.json({
      error: 'An unexpected error occurred while suspending the user.',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
};

export const POST = withAdminAuth(suspendUserHandler);
