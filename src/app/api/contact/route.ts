import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { validateData, enquirySchema } from '@/lib/validation';
import Enquiry from '@/models/Enquiry';
import EmailService from '@/lib/emailService';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Validate the request body
    const validation = validateData(enquirySchema, body);
    if (!validation.success) {
      return NextResponse.json({
        error: 'Validation failed',
        details: validation.errors
      }, { status: 400 });
    }

    await connectToDatabase();

    // Create new enquiry
    const enquiry = new Enquiry(validation.data as any);
    await enquiry.save();

    // Send notification email to admin (optional)
    try {
      await EmailService.sendEmail({
        to: process.env.ADMIN_EMAIL || 'admin@Blumiq.com',
        subject: `New Contact Enquiry from ${validation.data.name}`,
        html: `
          <h3>New Contact Enquiry</h3>
          <p><strong>Name:</strong> ${validation.data.name}</p>
          <p><strong>Email:</strong> ${validation.data.email}</p>
          <p><strong>Phone:</strong> ${validation.data.phone_number}</p>
          <p><strong>Subject:</strong> ${validation.data.subject || 'No subject'}</p>
          <p><strong>Message:</strong></p>
          <p>${validation.data.message}</p>
        `
      });
    } catch (emailError) {
      console.error('Failed to send admin notification email:', emailError);
      // Don't fail the enquiry if email fails
    }

    return NextResponse.json({
      enquiry_id: enquiry.enquiry_id,
      message: 'Enquiry submitted successfully. We will get back to you soon.'
    }, { status: 201 });

  } catch (error) {
    console.error('Error submitting enquiry:', error);
    return NextResponse.json({
      error: 'An unexpected error occurred'
    }, { status: 500 });
  }
}