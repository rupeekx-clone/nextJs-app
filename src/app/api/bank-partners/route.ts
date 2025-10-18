import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import BankPartner from '@/models/BankPartner';

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();

    // Fetch all active bank partners
    const bankPartners = await BankPartner.find({ is_active: true })
      .sort({ name: 1 });

    const formattedPartners = bankPartners.map(partner => ({
      bank_partner_id: partner.bank_partner_id,
      name: partner.name,
      logo_url: partner.logo_url,
      contact_person_name: partner.contact_person_name,
      contact_person_email: partner.contact_person_email,
      contact_person_phone: partner.contact_person_phone,
      has_contact_info: partner.hasContactInfo()
    }));

    return NextResponse.json({
      data: formattedPartners
    }, { status: 200 });

  } catch (error) {
    console.error('Error fetching bank partners:', error);
    return NextResponse.json({
      error: 'An unexpected error occurred'
    }, { status: 500 });
  }
}
