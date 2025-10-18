import { NextResponse } from 'next/server';
import { withAdminAuth, NextRequestWithAdmin } from '@/lib/adminAuthMiddleware';
import { connectToDatabase } from '@/lib/mongodb';
import { validateData, loanRejectionSchema } from '@/lib/validation';
import LoanApplication from '@/models/LoanApplication';
import EmailService from '@/lib/emailService';

const rejectLoanHandler = async (req: NextRequestWithAdmin) => {
  try {
    const url = new URL(req.url);
    const pathParts = url.pathname.split('/');
    const applicationId = pathParts[pathParts.length - 2]; // reject is the last part, so id is second to last
    const body = await req.json();

    // Validate the request body
    const validation = validateData(loanRejectionSchema, body);
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

    // Check if application can be rejected
    if (application.status !== 'under_review' && application.status !== 'requires_documents') {
      return NextResponse.json({
        error: 'Application cannot be rejected in its current status'
      }, { status: 400 });
    }

    const validatedData = validation.data as {
      reason: string;
      remarks?: string;
    };

    // Update the application with rejection details
    application.status = 'rejected';
    application.rejection_reason = validatedData.reason;
    application.admin_remarks = validatedData.remarks;
    application.updated_at = new Date();

    await application.save();

    // Send rejection email to user
    try {
      // Get user details for email
      const userResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/users/${application.user_id}`, {
        headers: {
          'Authorization': `Bearer ${req.headers.get('authorization')}`,
        },
      });
      
      if (userResponse.ok) {
        const user = await userResponse.json();
        await EmailService.sendLoanRejectionNotification(
          user.email,
          user.full_name,
          application.application_id,
          validatedData.reason,
          validatedData.remarks
        );
      }
    } catch (emailError) {
      console.error('Failed to send rejection email:', emailError);
      // Don't fail the rejection if email fails
    }

    return NextResponse.json({
      message: 'Loan application rejected successfully',
      application_id: application.application_id,
      status: application.status,
      rejection_reason: application.rejection_reason,
      admin_remarks: application.admin_remarks,
    }, { status: 200 });

  } catch (error) {
    console.error('Error rejecting loan application:', error);
    if (error instanceof Error && error.name === 'CastError') {
      return NextResponse.json({ error: 'Invalid application ID format' }, { status: 400 });
    }
    return NextResponse.json({
      error: 'An unexpected error occurred while rejecting the loan application.',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
};

export const POST = withAdminAuth(rejectLoanHandler);
