import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb'; // Using import alias

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, subject, message } = body;

    // Basic validation
    if (!name || !email || !message) {
      return NextResponse.json({ message: 'Missing required fields (name, email, message).' }, { status: 400 });
    }
    
    // Validate email format (basic)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ message: 'Invalid email format.' }, { status: 400 });
    }

    // Sanitize or provide default for optional fields
    subject = subject || ''; // Ensure subject is not undefined if it's optional

    try {
      const db = await connectToDatabase();
      const collection = db.collection('contact_submissions');
      
      const submissionData = {
        name,
        email,
        subject,
        message,
        submittedAt: new Date(),
      };

      await collection.insertOne(submissionData);

      console.log('Contact form submission stored in MongoDB:', submissionData);
      // Return 201 for successful resource creation
      return NextResponse.json({ message: 'Form submitted successfully and stored!' }, { status: 201 }); 

    } catch (dbError) {
      console.error('MongoDB Error:', dbError);
      const errorMessage = dbError instanceof Error ? dbError.message : 'Unknown database error';
      return NextResponse.json({ message: `Database operation failed: ${errorMessage}` }, { status: 500 });
    }

  } catch (error) { // Catches errors from request.json() or other synchronous parts
    console.error('API Route Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error processing request';
    if (error instanceof SyntaxError) { // Specifically for JSON parsing errors
        return NextResponse.json({ message: 'Invalid JSON payload.' }, { status: 400 });
    }
    return NextResponse.json({ message: `Error processing request: ${errorMessage}` }, { status: 500 });
  }
}
