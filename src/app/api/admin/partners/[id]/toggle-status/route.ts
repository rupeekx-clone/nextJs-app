import { NextResponse } from 'next/server';
import { withAdminAuth, NextRequestWithAdmin } from '@/lib/adminAuthMiddleware';
import { connectToDatabase } from '@/lib/mongodb';
import BankPartner from '@/models/BankPartner';

const toggleStatusHandler = async (req: NextRequestWithAdmin) => {
  try {
    const url = new URL(req.url);
    const pathParts = url.pathname.split('/');
    const partnerId = pathParts[pathParts.length - 2]; // toggle-status is the last part, so id is second to last

    await connectToDatabase();

    // Find the current partner
    const partner = await BankPartner.findById(partnerId);

    if (!partner) {
      return NextResponse.json({ error: 'Bank partner not found' }, { status: 404 });
    }

    // Toggle status
    const newStatus = partner.status === 'active' ? 'inactive' : 'active';

    const updatedPartner = await BankPartner.findByIdAndUpdate(
      partnerId,
      {
        status: newStatus,
        updatedAt: new Date(),
      },
      { new: true, runValidators: true }
    );

    return NextResponse.json({
      message: `Bank partner ${newStatus === 'active' ? 'activated' : 'deactivated'} successfully`,
      partner: updatedPartner,
    }, { status: 200 });

  } catch (error) {
    console.error('Error toggling partner status:', error);
    if (error instanceof Error && error.name === 'CastError') {
      return NextResponse.json({ error: 'Invalid partner ID format' }, { status: 400 });
    }
    return NextResponse.json({
      error: 'An unexpected error occurred'
    }, { status: 500 });
  }
};

export const POST = withAdminAuth(toggleStatusHandler);
