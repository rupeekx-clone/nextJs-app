import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { withAuth, NextRequestWithUser } from '@/lib/authMiddleware';
import { validateData, loanApplicationSchema } from '@/lib/validation';
import LoanApplication from '@/models/LoanApplication';
import MembershipCard from '@/models/MembershipCard';
import EmailService from '@/lib/emailService';

const applyLoanHandler = async (req: NextRequestWithUser) => {
  try {
    const userId = req.user!.userId;
    const body = await req.json();

    // Validate the request body
    const validation = validateData(loanApplicationSchema, body);
    if (!validation.success) {
      return NextResponse.json({
        error: 'Validation failed',
        details: validation.errors
      }, { status: 400 });
    }

    await connectToDatabase();

    // Check if user has an active membership card for the loan type
    const membershipCard = await MembershipCard.findOne({ 
      user_id: userId, 
      status: 'active' 
    }).populate('card_type_id');

    if (!membershipCard || membershipCard.isExpired()) {
      return NextResponse.json({
        error: 'Active membership card required to apply for loans'
      }, { status: 403 });
    }

    // Check if membership card supports this loan type
    const cardType = membershipCard.card_type_id as any;
    const validatedData = validation.data as any;
    
    if (validatedData.loan_type === 'personal' && !cardType.isForPersonalLoans()) {
      return NextResponse.json({
        error: 'Your membership card does not support personal loans'
      }, { status: 403 });
    }
    
    if (validatedData.loan_type === 'business' && !cardType.isForBusinessLoans()) {
      return NextResponse.json({
        error: 'Your membership card does not support business loans'
      }, { status: 403 });
    }

    // Create new loan application
    const loanApplication = new LoanApplication({
      user_id: userId,
      loan_type: validatedData.loan_type,
      amount_requested: validatedData.amount_requested,
      tenure_months_requested: validatedData.tenure_months_requested,
      documents_submitted: validatedData.documents_submitted || {},
      status: 'submitted',
      application_date: new Date()
    });

    await loanApplication.save();

    // Send confirmation email
    try {
      await EmailService.sendLoanApplicationConfirmation(
        req.user!.email,
        'User', // You might want to fetch the user's name
        loanApplication.application_id,
        validatedData.loan_type,
        validatedData.amount_requested
      );
    } catch (emailError) {
      console.error('Failed to send confirmation email:', emailError);
      // Don't fail the loan application if email fails
    }

    return NextResponse.json({
      application_id: loanApplication.application_id,
      user_id: loanApplication.user_id,
      loan_type: loanApplication.loan_type,
      amount_requested: loanApplication.amount_requested,
      tenure_months_requested: loanApplication.tenure_months_requested,
      status: loanApplication.status,
      application_date: loanApplication.application_date,
      documents_submitted: loanApplication.documents_submitted,
      message: 'Loan application submitted successfully.'
    }, { status: 201 });

  } catch (error) {
    console.error('Error applying for loan:', error);
    return NextResponse.json({
      error: 'An unexpected error occurred'
    }, { status: 500 });
  }
};

export const POST = withAuth(applyLoanHandler);
