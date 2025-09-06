import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { verifyToken } from '@/lib/jwt'; // Assuming verifyToken is the correct function
import { ObjectId } from 'mongodb';

export async function POST(req: NextRequest) {
  try {
    // 1. Verify JWT token
    const authHeader = req.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    const token = authHeader.split(' ')[1];

    let decodedToken;
    try {
      decodedToken = verifyToken(token, process.env.ACCESS_TOKEN_SECRET || 'default-access-secret-key-for-dev-must-be-32-chars'); // This should throw an error if invalid
      if (!decodedToken || !decodedToken.userId) {
        return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
      }
    } catch {
      return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
    }

    const userId = decodedToken.userId;

    // 2. Parse and validate request body
    const body = await req.json();
    const { loan_type, amount_requested, tenure_months_requested, documents_submitted } = body;

    if (!loan_type || !amount_requested || !tenure_months_requested) {
      return NextResponse.json({ message: 'Missing required fields: loan_type, amount_requested, tenure_months_requested' }, { status: 400 });
    }

    if (!['personal', 'business'].includes(loan_type)) {
      return NextResponse.json({ message: 'Invalid loan_type. Must be "personal" or "business".' }, { status: 400 });
    }

    if (typeof amount_requested !== 'number' || amount_requested <= 0) {
      return NextResponse.json({ message: 'Invalid amount_requested. Must be a positive number.' }, { status: 400 });
    }

    if (typeof tenure_months_requested !== 'number' || tenure_months_requested <= 0 || !Number.isInteger(tenure_months_requested)) {
      return NextResponse.json({ message: 'Invalid tenure_months_requested. Must be a positive integer.' }, { status: 400 });
    }
    
    if (documents_submitted && typeof documents_submitted !== 'object') {
        return NextResponse.json({ message: 'Invalid documents_submitted. Must be an object.' }, { status: 400 });
    }


    const db = await connectToDatabase();

    // 3. Create new loan application object
    const newLoanApplicationData = {
      user_id: new ObjectId(userId), // Ensure user_id is stored as ObjectId if your schema expects it
      loan_type,
      amount_requested,
      tenure_months_requested,
      documents_submitted: documents_submitted || {}, // Default to empty object if not provided
      status: 'submitted', // Default status as per common practice or model definition
      application_date: new Date(),
      created_at: new Date(),
      updated_at: new Date(),
      // Add other fields as per LoanApplication.ts, e.g., approved_amount, interest_rate, emi_amount could be null/default initially
      approved_amount: null,
      interest_rate: null,
      emi_amount: null,
      approved_tenure_months: null,
      processing_fee: null,
      approved_date: null,
      closed_date: null,
      rejection_reason: null,
      // outstanding_balance will be same as amount_requested initially if approved, or null
    };

    // 4. Save the new loan application
    const result = await db.collection('loan_applications').insertOne(newLoanApplicationData);
    
    // 5. Return 201 Created response
    // Construct the response object based on the inserted document
    const createdApplication = {
        application_id: result.insertedId.toString(),
        user_id: newLoanApplicationData.user_id.toString(),
        loan_type: newLoanApplicationData.loan_type,
        amount_requested: newLoanApplicationData.amount_requested,
        tenure_months_requested: newLoanApplicationData.tenure_months_requested,
        status: newLoanApplicationData.status,
        application_date: newLoanApplicationData.application_date.toISOString(), // Ensure ISO string format for dates
        documents_submitted: newLoanApplicationData.documents_submitted
    };

    return NextResponse.json({
      message: 'Loan application submitted successfully',
      data: createdApplication
    }, { status: 201 });

  } catch (error) {
    console.error('Error applying for loan:', error);
    // Check if the error is a known type, e.g., from MongoDB driver or JWT verification
    if (error instanceof Error && (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError')) {
        return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
    }
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
