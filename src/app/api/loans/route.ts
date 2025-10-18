import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { withAuth, NextRequestWithUser } from '@/lib/authMiddleware';
import { validateQueryParams, loanQuerySchema } from '@/lib/validation';
import LoanApplication from '@/models/LoanApplication';

const getLoansHandler = async (req: NextRequestWithUser) => {
  try {
    const userId = req.user!.userId;
    const { searchParams } = new URL(req.url);

    // Validate query parameters
    const validation = validateQueryParams(loanQuerySchema, searchParams);
    if (!validation.success) {
      return NextResponse.json({
        error: 'Invalid query parameters',
        details: validation.errors
      }, { status: 400 });
    }

    await connectToDatabase();

    // Build query
    const validatedData = validation.data as { page: number; limit: number; status?: string; loan_type?: string; };
    const query: Record<string, unknown> = { user_id: userId };
    if (validatedData.status) {
      query.status = validatedData.status;
    }
    if (validatedData.loan_type) {
      query.loan_type = validatedData.loan_type;
    }

    // Calculate pagination
    const skip = (validatedData.page - 1) * validatedData.limit;

    // Fetch loan applications
    const applications = await LoanApplication.find(query)
      .sort({ application_date: -1 })
      .skip(skip)
      .limit(validatedData.limit)
      .select('application_id loan_type amount_requested amount_approved status application_date updated_at');

    // Get total count
    const totalEntries = await LoanApplication.countDocuments(query);
    const totalPages = Math.ceil(totalEntries / validatedData.limit);

    // Format response
    const formattedApplications = applications.map(app => ({
      application_id: app.application_id,
      loan_type: app.loan_type,
      amount_requested: app.amount_requested,
      amount_approved: app.amount_approved,
      status: app.status,
      application_date: app.application_date,
      updated_at: app.updated_at
    }));

    return NextResponse.json({
      data: formattedApplications,
      pagination: {
        current_page: validatedData.page,
        per_page: validatedData.limit,
        total_entries: totalEntries,
        total_pages: totalPages
      }
    }, { status: 200 });

  } catch (error) {
    console.error('Error fetching loan applications:', error);
    return NextResponse.json({
      error: 'An unexpected error occurred'
    }, { status: 500 });
  }
};

export const GET = withAuth(getLoansHandler);
