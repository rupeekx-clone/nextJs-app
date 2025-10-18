import { NextResponse } from 'next/server';
import { withAdminAuth, NextRequestWithAdmin } from '@/lib/adminAuthMiddleware';
import { connectToDatabase } from '@/lib/mongodb';
import LoanApplication from '@/models/LoanApplication';
// import User from '@/models/User';

const getLoansHandler = async (req: NextRequestWithAdmin) => {
  try {
    const { searchParams } = new URL(req.url);
    
    // Parse query parameters
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || '';
    const loanType = searchParams.get('loan_type') || '';

    await connectToDatabase();

    // Build query
    const query: Record<string, unknown> = {};
    
    if (status) {
      query.status = status;
    }
    
    if (loanType) {
      query.loan_type = loanType;
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Build aggregation pipeline for search and user data
    const pipeline: unknown[] = [
      { $match: query },
      {
        $lookup: {
          from: 'users',
          localField: 'user_id',
          foreignField: '_id',
          as: 'user',
        },
      },
      {
        $unwind: {
          path: '$user',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $addFields: {
          user_name: '$user.full_name',
          user_phone: '$user.phone_number',
          user_email: '$user.email',
        },
      },
    ];

    // Add search functionality
    if (search) {
      pipeline.push({
        $match: {
          $or: [
            { application_id: { $regex: search, $options: 'i' } },
            { user_name: { $regex: search, $options: 'i' } },
            { user_phone: { $regex: search, $options: 'i' } },
            { user_email: { $regex: search, $options: 'i' } },
          ],
        },
      });
    }

    // Add sorting and pagination
    pipeline.push(
      { $sort: { application_date: -1 } },
      { $skip: skip },
      { $limit: limit }
    );

    // Execute aggregation
    const applications = await LoanApplication.aggregate(pipeline as never[]);

    // Get total count for pagination
    const countPipeline = [...pipeline];
    countPipeline.splice(-3); // Remove sort, skip, and limit
    countPipeline.push({ $count: 'total' });
    
    const countResult = await LoanApplication.aggregate(countPipeline as never[]);
    const totalEntries = countResult[0]?.total || 0;
    const totalPages = Math.ceil(totalEntries / limit);

    // Format response
    const formattedApplications = applications.map(app => ({
      _id: app._id,
      application_id: app.application_id,
      user_id: app.user_id,
      loan_type: app.loan_type,
      amount_requested: app.amount_requested,
      amount_approved: app.amount_approved,
      status: app.status,
      application_date: app.application_date,
      user_name: app.user_name,
      user_phone: app.user_phone,
      user_email: app.user_email,
    }));

    return NextResponse.json({
      data: formattedApplications,
      pagination: {
        current_page: page,
        per_page: limit,
        total_entries: totalEntries,
        total_pages: totalPages,
      },
    }, { status: 200 });

  } catch (error) {
    console.error('Error fetching admin loans:', error);
    return NextResponse.json({
      error: 'An unexpected error occurred while fetching loan applications.',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
};

export const GET = withAdminAuth(getLoansHandler);
