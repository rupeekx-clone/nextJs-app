import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { verifyToken } from '@/lib/jwt'; // Assuming verifyToken is the correct function
// LoanApplication model is not directly instantiated but its schema is relevant for querying 'loan_applications'
import { ObjectId } from 'mongodb';
import { NextURL } from 'next/dist/server/web/next-url';

export async function GET(req: NextRequest) {
  try {
    // 1. Verify JWT token
    const authHeader = req.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ message: 'Unauthorized: Missing or invalid token format' }, { status: 401 });
    }
    const token = authHeader.split(' ')[1];

    let decodedToken;
    try {
      decodedToken = verifyToken(token, process.env.ACCESS_TOKEN_SECRET || 'default-access-secret-key-for-dev-must-be-32-chars'); // This should throw an error if invalid
      if (!decodedToken || !decodedToken.userId) {
        return NextResponse.json({ message: 'Unauthorized: Invalid token payload' }, { status: 401 });
      }
    } catch (error) {
      console.error('Token verification error:', error);
      return NextResponse.json({ message: 'Unauthorized: Token verification failed' }, { status: 401 });
    }

    const userId = decodedToken.userId;

    // 2. Parse query parameters
    const { searchParams } = new NextURL(req.url);
    const pageParam = searchParams.get('page');
    const limitParam = searchParams.get('limit');
    const status = searchParams.get('status');
    const loan_type = searchParams.get('loan_type');

    const page = pageParam ? parseInt(pageParam, 10) : 1;
    const limit = limitParam ? parseInt(limitParam, 10) : 10;

    if (isNaN(page) || page <= 0) {
      return NextResponse.json({ message: 'Invalid page number. Must be a positive integer.' }, { status: 400 });
    }
    if (isNaN(limit) || limit <= 0) {
      return NextResponse.json({ message: 'Invalid limit number. Must be a positive integer.' }, { status: 400 });
    }

    // 3. Construct MongoDB query object
    const query: Record<string, unknown> = { user_id: new ObjectId(userId) }; // Filter by authenticated user
    if (status) {
      query.status = status;
    }
    if (loan_type) {
      query.loan_type = loan_type;
    }

    const db  = await connectToDatabase();
    const loanApplicationsCollection = db.collection('loan_applications');

    // 4. Execute the query to find matching loan applications with pagination
    const skip = (page - 1) * limit;
    const applicationsCursor = loanApplicationsCollection.find(query).skip(skip).limit(limit);
    const applications = await applicationsCursor.toArray();

    // 5. Get the total count of matching documents for the filter criteria
    const total_entries = await loanApplicationsCollection.countDocuments(query);
    const total_pages = Math.ceil(total_entries / limit);

    // 6. Format the retrieved applications
    const formattedApplications = applications.map((app: Record<string, unknown>) => ({
      application_id: (app._id as { toString(): string }).toString(),
      user_id: (app.user_id as { toString(): string }).toString(), // Ensure user_id is also stringified
      loan_type: app.loan_type,
      amount_requested: app.amount_requested,
      tenure_months_requested: app.tenure_months_requested,
      status: app.status,
      application_date: (app.application_date as Date).toISOString(), // Format date to ISO string
      documents_submitted: app.documents_submitted, // Include if needed, or select specific fields
      // Add other fields as per api_endpoints.md if necessary
      // e.g., approved_amount, interest_rate, emi_amount if they should be part of the list view
    }));

    // 7. Return a 200 OK response
    return NextResponse.json({
      data: formattedApplications,
      pagination: {
        current_page: page,
        per_page: limit,
        total_entries: total_entries,
        total_pages: total_pages,
      },
    }, { status: 200 });

  } catch (error) {
    console.error('Error fetching loan applications:', error);
    // Check if the error is a known type, e.g., from MongoDB driver or JWT verification
    if (error instanceof Error && (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError')) {
        // This case should ideally be caught by the specific try-catch around verifyToken
        return NextResponse.json({ message: 'Unauthorized: Invalid token' }, { status: 401 });
    }
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
