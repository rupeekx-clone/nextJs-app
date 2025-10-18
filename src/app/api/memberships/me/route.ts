import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { withAuth, NextRequestWithUser } from '@/lib/authMiddleware';
import MembershipCard from '@/models/MembershipCard';

const getMyMembershipHandler = async (req: NextRequestWithUser) => {
  try {
    const userId = req.user!.userId;

    await connectToDatabase();

    // Find the user's active membership card
    const membershipCard = await MembershipCard.findOne({
      user_id: userId,
      status: 'active'
    }).populate('card_type_id');

    if (!membershipCard) {
      return NextResponse.json({
        error: 'No active membership card found for this user'
      }, { status: 404 });
    }

    const cardType = membershipCard.card_type_id as { name: string; benefits_description: string; };
    const membershipData = membershipCard.toJSON();

    return NextResponse.json({
      membership_card_id: membershipData.membership_card_id,
      user_id: membershipData.user_id,
      card_type_id: membershipData.card_type_id,
      card_type_name: cardType.name,
      purchase_date: membershipData.purchase_date,
      expiry_date: membershipData.expiry_date,
      status: membershipData.status,
      benefits_availed: membershipData.benefits_availed,
      benefits_description: cardType.benefits_description,
      created_at: membershipData.created_at,
      updated_at: membershipData.updated_at
    }, { status: 200 });

  } catch (error) {
    console.error('Error fetching membership card:', error);
    return NextResponse.json({
      error: 'An unexpected error occurred'
    }, { status: 500 });
  }
};

export const GET = withAuth(getMyMembershipHandler);
