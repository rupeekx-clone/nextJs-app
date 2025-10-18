import { NextRequest, NextResponse } from 'next/server';
import { withAdminAuth, NextRequestWithAdmin } from '@/lib/adminAuthMiddleware';
import { connectToDatabase } from '@/lib/mongodb';
import User from '@/models/User';
import LoanApplication from '@/models/LoanApplication';
import MembershipCard from '@/models/MembershipCard';

const getUserHandler = async (req: NextRequestWithAdmin) => {
  try {
    const url = new URL(req.url);
    const pathParts = url.pathname.split('/');
    const userId = pathParts[pathParts.length - 1];

    await connectToDatabase();

    // Find the user
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Get user's loan applications
    const loanApplications = await LoanApplication.find({ user_id: userId })
      .sort({ application_date: -1 })
      .select('application_id loan_type amount_requested amount_approved status application_date');

    // Get user's membership cards
    const membershipCards = await MembershipCard.find({ user_id: userId })
      .populate('card_type_id', 'name')
      .sort({ purchase_date: -1 })
      .select('card_type_id purchase_date expiry_date status');

    // Format membership cards
    const formattedMembershipCards = membershipCards.map(card => ({
      _id: card._id,
      card_type_name: (card.card_type_id as any)?.name || 'Unknown',
      purchase_date: card.purchase_date,
      expiry_date: card.expiry_date,
      status: card.status,
    }));

    return NextResponse.json({
      user: {
        _id: user._id,
        full_name: user.full_name,
        email: user.email,
        phone_number: user.phone_number,
        user_type: user.user_type,
        status: user.status,
        address_line1: user.address_line1,
        address_line2: user.address_line2,
        city: user.city,
        pincode: user.pincode,
        created_at: user.createdAt,
        email_verified_at: user.email_verified_at,
        phone_verified_at: user.phone_verified_at,
        last_login: user.last_login,
      },
      loanApplications,
      membershipCards: formattedMembershipCards,
    }, { status: 200 });

  } catch (error) {
    console.error('Error fetching admin user:', error);
    if (error instanceof Error && error.name === 'CastError') {
      return NextResponse.json({ error: 'Invalid user ID format' }, { status: 400 });
    }
    return NextResponse.json({
      error: 'An unexpected error occurred while fetching the user.',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
};

export const GET = withAdminAuth(getUserHandler);
