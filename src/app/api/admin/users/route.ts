import { NextRequest, NextResponse } from 'next/server';
import { withAdminAuth, NextRequestWithAdmin } from '@/lib/adminAuthMiddleware';
import { connectToDatabase } from '@/lib/mongodb';
import User from '@/models/User';

const getUsersHandler = async (req: NextRequestWithAdmin) => {
  try {
    const { searchParams } = new URL(req.url);
    
    // Parse query parameters
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || '';
    const userType = searchParams.get('user_type') || '';

    await connectToDatabase();

    // Build query
    const query: any = {};
    
    if (status) {
      query.status = status;
    }
    
    if (userType) {
      query.user_type = userType;
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Build aggregation pipeline for search
    const pipeline: any[] = [
      { $match: query },
    ];

    // Add search functionality
    if (search) {
      pipeline.push({
        $match: {
          $or: [
            { full_name: { $regex: search, $options: 'i' } },
            { email: { $regex: search, $options: 'i' } },
            { phone_number: { $regex: search, $options: 'i' } },
          ],
        },
      });
    }

    // Add sorting and pagination
    pipeline.push(
      { $sort: { createdAt: -1 } },
      { $skip: skip },
      { $limit: limit }
    );

    // Execute aggregation
    const users = await User.aggregate(pipeline);

    // Get total count for pagination
    const countPipeline = [...pipeline];
    countPipeline.splice(-3); // Remove sort, skip, and limit
    countPipeline.push({ $count: 'total' });
    
    const countResult = await User.aggregate(countPipeline);
    const totalEntries = countResult[0]?.total || 0;
    const totalPages = Math.ceil(totalEntries / limit);

    // Format response
    const formattedUsers = users.map(user => ({
      _id: user._id,
      full_name: user.full_name,
      email: user.email,
      phone_number: user.phone_number,
      user_type: user.user_type,
      status: user.status,
      created_at: user.createdAt,
      email_verified_at: user.email_verified_at,
      phone_verified_at: user.phone_verified_at,
      last_login: user.last_login,
    }));

    return NextResponse.json({
      data: formattedUsers,
      pagination: {
        current_page: page,
        per_page: limit,
        total_entries: totalEntries,
        total_pages: totalPages,
      },
    }, { status: 200 });

  } catch (error) {
    console.error('Error fetching admin users:', error);
    return NextResponse.json({
      error: 'An unexpected error occurred while fetching users.',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
};

export const GET = withAdminAuth(getUsersHandler);
