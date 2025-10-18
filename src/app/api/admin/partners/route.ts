import { NextRequest, NextResponse } from 'next/server';
import { withAdminAuth, NextRequestWithAdmin } from '@/lib/adminAuthMiddleware';
import { connectToDatabase } from '@/lib/mongodb';
import BankPartner from '@/models/BankPartner';

const getPartnersHandler = async (req: NextRequestWithAdmin) => {
  try {
    const url = new URL(req.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '10');
    const search = url.searchParams.get('search') || '';
    const status = url.searchParams.get('status') || '';

    await connectToDatabase();

    // Build query
    const query: any = {};
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { contact_person: { $regex: search, $options: 'i' } },
        { contact_email: { $regex: search, $options: 'i' } },
      ];
    }
    
    if (status) {
      query.status = status;
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Get partners with pagination
    const partners = await BankPartner.find(query)
      .sort({ created_at: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    // Get total count for pagination
    const totalEntries = await BankPartner.countDocuments(query);

    // Calculate performance metrics for each partner
    const partnersWithMetrics = await Promise.all(
      partners.map(async (partner) => {
        // This would typically involve aggregating data from loan applications
        // For now, we'll return mock data
        const performanceMetrics = {
          total_applications: Math.floor(Math.random() * 100) + 10,
          approved_applications: Math.floor(Math.random() * 80) + 5,
          approval_rate: Math.floor(Math.random() * 40) + 60, // 60-100%
          average_processing_time: Math.floor(Math.random() * 5) + partner.processing_time_days - 2,
        };

        return {
          ...partner,
          performance_metrics: performanceMetrics,
        };
      })
    );

    return NextResponse.json({
      data: partnersWithMetrics,
      pagination: {
        current_page: page,
        total_pages: Math.ceil(totalEntries / limit),
        total_entries,
        entries_per_page: limit,
      },
    }, { status: 200 });

  } catch (error) {
    console.error('Error fetching bank partners:', error);
    return NextResponse.json({
      error: 'An unexpected error occurred'
    }, { status: 500 });
  }
};

const createPartnerHandler = async (req: NextRequestWithAdmin) => {
  try {
    const body = await req.json();

    await connectToDatabase();

    // Validate required fields
    const requiredFields = ['name', 'contact_email', 'contact_phone', 'contact_person', 'loan_types', 'max_loan_amount', 'min_interest_rate', 'max_interest_rate', 'processing_time_days'];
    
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json({
          error: `Missing required field: ${field}`
        }, { status: 400 });
      }
    }

    // Create new partner
    const newPartner = new BankPartner({
      ...body,
      status: 'active',
      created_at: new Date(),
    });

    const savedPartner = await newPartner.save();

    return NextResponse.json({
      message: 'Bank partner created successfully',
      partner: savedPartner,
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating bank partner:', error);
    return NextResponse.json({
      error: 'An unexpected error occurred'
    }, { status: 500 });
  }
};

export const GET = withAdminAuth(getPartnersHandler);
export const POST = withAdminAuth(createPartnerHandler);
