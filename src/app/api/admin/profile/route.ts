import { NextResponse } from 'next/server';
import { withAdminAuth, NextRequestWithAdmin } from '@/lib/adminAuthMiddleware';
import { connectToDatabase } from '@/lib/mongodb';
import User from '@/models/User';

const getAdminProfileHandler = async (req: NextRequestWithAdmin) => {
  try {
    const adminId = req.admin!.adminId;
    await connectToDatabase();

    const admin = await User.findById(adminId).select('-password -phone_otp');

    if (!admin) {
      return NextResponse.json({ error: 'Admin profile not found' }, { status: 404 });
    }

    const adminProfile = admin.toJSON();

    return NextResponse.json({
      id: adminProfile._id,
      full_name: adminProfile.full_name,
      email: adminProfile.email,
      user_type: adminProfile.user_type,
      status: adminProfile.status,
      created_at: adminProfile.createdAt,
      last_login: (adminProfile as { last_login?: string }).last_login,
    }, { status: 200 });

  } catch (error: unknown) {
    console.error('Get Admin Profile error:', error);
    if (error instanceof Error && error.name === 'CastError') {
      return NextResponse.json({ error: 'Invalid admin ID format' }, { status: 400 });
    }
    return NextResponse.json({
      error: 'An unexpected error occurred while fetching the admin profile.',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
};

export const GET = withAdminAuth(getAdminProfileHandler);
