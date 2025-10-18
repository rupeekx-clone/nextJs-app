import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { withAuth, NextRequestWithUser } from '@/lib/authMiddleware';
import { validateData, loanUpdateSchema } from '@/lib/validation';
import LoanApplication from '@/models/LoanApplication';

const getLoanHandler = async (req: NextRequestWithUser, context: { params: { id: string } }) => {
  try {
    const userId = req.user!.userId;
    const applicationId = context.params.id;

    await connectToDatabase();

    // Find the loan application
    const application = await LoanApplication.findOne({
      application_id: applicationId,
      user_id: userId
    }).populate('bank_partner_id', 'name logo_url');

    if (!application) {
      return NextResponse.json({
        error: 'Loan application not found'
      }, { status: 404 });
    }

    const applicationData = application.toJSON();

    return NextResponse.json({
      application_id: applicationData.application_id,
      user_id: applicationData.user_id,
      loan_type: applicationData.loan_type,
      amount_requested: applicationData.amount_requested,
      amount_approved: applicationData.amount_approved,
      interest_rate_proposed: applicationData.interest_rate_proposed,
      interest_rate_final: applicationData.interest_rate_final,
      tenure_months_requested: applicationData.tenure_months_requested,
      tenure_months_final: applicationData.tenure_months_final,
      status: applicationData.status,
      bank_partner_id: applicationData.bank_partner_id,
      bank_partner_name: applicationData.bank_partner_id?.name,
      application_date: applicationData.application_date,
      documents_submitted: applicationData.documents_submitted,
      admin_remarks: applicationData.admin_remarks,
      approved_at: applicationData.approved_at,
      disbursed_at: applicationData.disbursed_at,
      created_at: applicationData.created_at,
      updated_at: applicationData.updated_at
    }, { status: 200 });

  } catch (error) {
    console.error('Error fetching loan application:', error);
    return NextResponse.json({
      error: 'An unexpected error occurred'
    }, { status: 500 });
  }
};

const updateLoanHandler = async (req: NextRequestWithUser, context: { params: { id: string } }) => {
  try {
    const userId = req.user!.userId;
    const applicationId = context.params.id;
    const body = await req.json();

    // Validate the request body
    const validation = validateData(loanUpdateSchema, body);
    if (!validation.success) {
      return NextResponse.json({
        error: 'Validation failed',
        details: validation.errors
      }, { status: 400 });
    }

    await connectToDatabase();

    // Find the loan application
    const application = await LoanApplication.findOne({
      application_id: applicationId,
      user_id: userId
    });

    if (!application) {
      return NextResponse.json({
        error: 'Loan application not found'
      }, { status: 404 });
    }

    // Check if application can be updated by user
    if (!application.canBeUpdated()) {
      return NextResponse.json({
        error: 'This loan application cannot be updated'
      }, { status: 403 });
    }

    // Update the application
    Object.assign(application, validation.data as any);
    application.updated_at = new Date();
    await application.save();

    const applicationData = application.toJSON();

    return NextResponse.json({
      application_id: applicationData.application_id,
      user_id: applicationData.user_id,
      loan_type: applicationData.loan_type,
      amount_requested: applicationData.amount_requested,
      amount_approved: applicationData.amount_approved,
      interest_rate_proposed: applicationData.interest_rate_proposed,
      interest_rate_final: applicationData.interest_rate_final,
      tenure_months_requested: applicationData.tenure_months_requested,
      tenure_months_final: applicationData.tenure_months_final,
      status: applicationData.status,
      bank_partner_id: applicationData.bank_partner_id,
      application_date: applicationData.application_date,
      documents_submitted: applicationData.documents_submitted,
      admin_remarks: applicationData.admin_remarks,
      approved_at: applicationData.approved_at,
      disbursed_at: applicationData.disbursed_at,
      created_at: applicationData.created_at,
      updated_at: applicationData.updated_at,
      message: 'Loan application updated successfully'
    }, { status: 200 });

  } catch (error) {
    console.error('Error updating loan application:', error);
    return NextResponse.json({
      error: 'An unexpected error occurred'
    }, { status: 500 });
  }
};

export const GET = withAuth(getLoanHandler);
export const PUT = withAuth(updateLoanHandler);
