import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import MembershipCardType from '@/models/MembershipCardType';

export async function GET() {
  try {
    await connectToDatabase();

    // Fetch all active membership card types
    const cardTypes = await MembershipCardType.find({ is_active: true })
      .sort({ price: 1 });

    const formattedCardTypes = cardTypes.map(cardType => ({
      card_type_id: cardType.card_type_id,
      name: cardType.name,
      description: cardType.description,
      price: cardType.price,
      validity_months: cardType.validity_months,
      benefits_description: cardType.benefits_description,
      loan_type_association: cardType.loan_type_association,
      max_loan_amount_benefit: cardType.max_loan_amount_benefit,
      processing_time_benefit: cardType.processing_time_benefit
    }));

    return NextResponse.json({
      data: formattedCardTypes
    }, { status: 200 });

  } catch (error) {
    console.error('Error fetching membership card types:', error);
    return NextResponse.json({
      error: 'An unexpected error occurred'
    }, { status: 500 });
  }
}
