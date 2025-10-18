import { NextRequest, NextResponse } from 'next/server';
import { withAdminAuth, NextRequestWithAdmin } from '@/lib/adminAuthMiddleware';
import { connectToDatabase } from '@/lib/mongodb';
import BankPartner from '@/models/BankPartner';
import LoanApplication from '@/models/LoanApplication';

const getPartnerHandler = async (req: NextRequestWithAdmin) => {
  try {
    const url = new URL(req.url);
    const pathParts = url.pathname.split('/');
    const partnerId = pathParts[pathParts.length - 1];

    await connectToDatabase();

    // Find the partner
    const partner = await BankPartner.findById(partnerId);

    if (!partner) {
      return NextResponse.json({ error: 'Bank partner not found' }, { status: 404 });
    }

    // Get loan applications for this partner (mock data for now)
    const loanApplications = await LoanApplication.find({})
      .populate('user_id', 'full_name email phone_number')
      .sort({ application_date: -1 })
      .limit(20)
      .lean();

    // Calculate performance metrics
    const performanceMetrics = {
      total_applications: Math.floor(Math.random() * 100) + 10,
      approved_applications: Math.floor(Math.random() * 80) + 5,
      approval_rate: Math.floor(Math.random() * 40) + 60, // 60-100%
      average_processing_time: Math.floor(Math.random() * 5) + partner.processing_time_days - 2,
      total_loan_amount: Math.floor(Math.random() * 10000000) + 1000000,
      average_loan_amount: Math.floor(Math.random() * 500000) + 200000,
    };

    const partnerWithMetrics = {
      ...partner.toObject(),
      performance_metrics: performanceMetrics,
    };

    // Format loan applications
    const formattedApplications = loanApplications.map(app => ({
      _id: app._id,
      application_id: app.application_id,
      user_name: app.user_id?.full_name || 'N/A',
      loan_type: app.loan_type,
      amount_requested: app.amount_requested,
      amount_approved: app.amount_approved,
      status: app.status,
      application_date: app.application_date,
      approved_date: app.approved_date,
    }));

    return NextResponse.json({
      partner: partnerWithMetrics,
      loanApplications: formattedApplications,
    }, { status: 200 });

  } catch (error) {
    console.error('Error fetching bank partner:', error);
    if (error instanceof Error && error.name === 'CastError') {
      return NextResponse.json({ error: 'Invalid partner ID format' }, { status: 400 });
    }
    return NextResponse.json({
      error: 'An unexpected error occurred'
    }, { status: 500 });
  }
};

const updatePartnerHandler = async (req: NextRequestWithAdmin) => {
  try {
    const url = new URL(req.url);
    const pathParts = url.pathname.split('/');
    const partnerId = pathParts[pathParts.length - 1];
    const body = await req.json();

    await connectToDatabase();

    const updatedPartner = await BankPartner.findByIdAndUpdate(
      partnerId,
      {
        ...body,
        updatedAt: new Date(),
      },
      { new: true, runValidators: true }
    );

    if (!updatedPartner) {
      return NextResponse.json({ error: 'Bank partner not found' }, { status: 404 });
    }

    return NextResponse.json({
      message: 'Bank partner updated successfully',
      partner: updatedPartner,
    }, { status: 200 });

  } catch (error) {
    console.error('Error updating bank partner:', error);
    if (error instanceof Error && error.name === 'CastError') {
      return NextResponse.json({ error: 'Invalid partner ID format' }, { status: 400 });
    }
    return NextResponse.json({
      error: 'An unexpected error occurred'
    }, { status: 500 });
  }
};

const deletePartnerHandler = async (req: NextRequestWithAdmin) => {
  try {
    const url = new URL(req.url);
    const pathParts = url.pathname.split('/');
    const partnerId = pathParts[pathParts.length - 1];

    await connectToDatabase();

    // Soft delete by setting status to inactive
    const updatedPartner = await BankPartner.findByIdAndUpdate(
      partnerId,
      {
        status: 'inactive',
        updatedAt: new Date(),
      },
      { new: true }
    );

    if (!updatedPartner) {
      return NextResponse.json({ error: 'Bank partner not found' }, { status: 404 });
    }

    return NextResponse.json({
      message: 'Bank partner deactivated successfully',
      partner: updatedPartner,
    }, { status: 200 });

  } catch (error) {
    console.error('Error deleting bank partner:', error);
    if (error instanceof Error && error.name === 'CastError') {
      return NextResponse.json({ error: 'Invalid partner ID format' }, { status: 400 });
    }
    return NextResponse.json({
      error: 'An unexpected error occurred'
    }, { status: 500 });
  }
};

export const GET = withAdminAuth(getPartnerHandler);
export const PUT = withAdminAuth(updatePartnerHandler);
export const DELETE = withAdminAuth(deletePartnerHandler);
