import { NextRequest, NextResponse } from 'next/server';
import { withAdminAuth, NextRequestWithAdmin } from '@/lib/adminAuthMiddleware';
import { connectToDatabase } from '@/lib/mongodb';
import LoanApplication from '@/models/LoanApplication';

const getLoanHandler = async (req: NextRequestWithAdmin) => {
  try {
    const url = new URL(req.url);
    const pathParts = url.pathname.split('/');
    const applicationId = pathParts[pathParts.length - 1];

    await connectToDatabase();

    // Find the loan application with user details
    const application = await LoanApplication.aggregate([
      { $match: { _id: applicationId } },
      {
        $lookup: {
          from: 'users',
          localField: 'user_id',
          foreignField: '_id',
          as: 'user',
        },
      },
      {
        $unwind: '$user',
      },
      {
        $project: {
          _id: 1,
          application_id: 1,
          user_id: 1,
          loan_type: 1,
          amount_requested: 1,
          amount_approved: 1,
          tenure_months_requested: 1,
          tenure_months_final: 1,
          status: 1,
          application_date: 1,
          approved_date: 1,
          disbursed_date: 1,
          documents_submitted: 1,
          admin_remarks: 1,
          rejection_reason: 1,
          interest_rate: 1,
          processing_fee: 1,
          user: {
            full_name: 1,
            email: 1,
            phone_number: 1,
            address_line1: 1,
            city: 1,
            pincode: 1,
          },
        },
      },
    ]);

    if (!application || application.length === 0) {
      return NextResponse.json({ error: 'Loan application not found' }, { status: 404 });
    }

    return NextResponse.json(application[0], { status: 200 });

  } catch (error) {
    console.error('Error fetching admin loan application:', error);
    if (error instanceof Error && error.name === 'CastError') {
      return NextResponse.json({ error: 'Invalid application ID format' }, { status: 400 });
    }
    return NextResponse.json({
      error: 'An unexpected error occurred while fetching the loan application.',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
};

export const GET = withAdminAuth(getLoanHandler);
