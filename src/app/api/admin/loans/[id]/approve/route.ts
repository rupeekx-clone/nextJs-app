import { NextResponse } from 'next/server';
import { withAdminAuth, NextRequestWithAdmin } from '@/lib/adminAuthMiddleware';
import { connectToDatabase } from '@/lib/mongodb';
import { validateData, loanApprovalSchema } from '@/lib/validation';
import LoanApplication from '@/models/LoanApplication';
import EmailService from '@/lib/emailService';

const approveLoanHandler = async (req: NextRequestWithAdmin) => {
  try {
    const url = new URL(req.url);
    const pathParts = url.pathname.split('/');
    const applicationId = pathParts[pathParts.length - 2]; // approve is the last part, so id is second to last
    const body = await req.json();

    // Validate the request body
    const validation = validateData(loanApprovalSchema, body);
    if (!validation.success) {
      return NextResponse.json({
        error: 'Validation failed',
        details: validation.errors
      }, { status: 400 });
    }

    await connectToDatabase();

    // Find the loan application
    const application = await LoanApplication.findById(applicationId);
    if (!application) {
      return NextResponse.json({ error: 'Loan application not found' }, { status: 404 });
    }

    // Check if application can be approved
    if (application.status !== 'under_review' && application.status !== 'requires_documents') {
      return NextResponse.json({
        error: 'Application cannot be approved in its current status'
      }, { status: 400 });
    }

    const validatedData = validation.data as {
      approved_amount: number;
      tenure_months: number;
      interest_rate: number;
      processing_fee: number;
      remarks?: string;
    };

    // Update the application with approval details
    application.status = 'approved';
    application.amount_approved = validatedData.approved_amount;
    application.tenure_months_final = validatedData.tenure_months;
    application.interest_rate = validatedData.interest_rate;
    application.processing_fee = validatedData.processing_fee;
    application.approved_date = new Date();
    application.admin_remarks = validatedData.remarks;
    application.updated_at = new Date();

    await application.save();

    // Send approval email to user
    try {
      // Get user details for email
      const userResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/users/${application.user_id}`, {
        headers: {
          'Authorization': `Bearer ${req.headers.get('authorization')}`,
        },
      });
      
      if (userResponse.ok) {
        const user = await userResponse.json();
        await EmailService.sendLoanApprovalNotification(
          user.email,
          user.full_name,
          application.application_id,
          validatedData.approved_amount,
          validatedData.interest_rate,
          validatedData.tenure_months
        );
      }
    } catch (emailError) {
      console.error('Failed to send approval email:', emailError);
      // Don't fail the approval if email fails
    }

    return NextResponse.json({
      message: 'Loan application approved successfully',
      application_id: application.application_id,
      status: application.status,
      approved_amount: application.amount_approved,
      interest_rate: application.interest_rate,
      tenure_months: application.tenure_months_final,
      processing_fee: application.processing_fee,
      approved_date: application.approved_date,
    }, { status: 200 });

  } catch (error) {
    console.error('Error approving loan application:', error);
    if (error instanceof Error && error.name === 'CastError') {
      return NextResponse.json({ error: 'Invalid application ID format' }, { status: 400 });
    }
    return NextResponse.json({
      error: 'An unexpected error occurred while approving the loan application.',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
};

export const POST = withAdminAuth(approveLoanHandler);
