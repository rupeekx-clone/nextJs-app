import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { verifyToken } from '@/lib/jwt';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.json({
        error: 'Verification token is required'
      }, { status: 400 });
    }

    // Verify the email verification token
    const decoded = verifyToken(token, process.env.EMAIL_VERIFICATION_SECRET || process.env.ACCESS_TOKEN_SECRET!);
    
    if (!decoded || !decoded.userId) {
      return NextResponse.json({
        error: 'Invalid or expired verification token'
      }, { status: 400 });
    }

    const db = await connectToDatabase();
    const usersCollection = db.collection('users');

    // Update user's email verification status
    const result = await usersCollection.updateOne(
      { _id: decoded.userId },
      { 
        $set: { 
          email_verified_at: new Date(),
          updated_at: new Date()
        } 
      }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({
        error: 'User not found'
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Email verified successfully'
    }, { status: 200 });

  } catch (error) {
    console.error('Email verification error:', error);
    return NextResponse.json({
      error: 'Invalid or expired verification token'
    }, { status: 400 });
  }
}
