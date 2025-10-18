import { NextResponse } from 'next/server';
import { verifyToken, generateAccessToken } from '@/lib/jwt';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { refresh_token } = body;

    if (!refresh_token) {
      return NextResponse.json({
        error: 'Refresh token is required'
      }, { status: 400 });
    }

    // Verify the refresh token
    const decoded = verifyToken(refresh_token, process.env.REFRESH_TOKEN_SECRET!);
    
    if (!decoded) {
      return NextResponse.json({
        error: 'Invalid or expired refresh token'
      }, { status: 401 });
    }

    // Generate new access token
    const newAccessToken = generateAccessToken({
      userId: decoded.userId,
      email: decoded.email,
      userType: decoded.userType
    });

    return NextResponse.json({
      success: true,
      access_token: newAccessToken,
      message: 'Access token refreshed successfully'
    }, { status: 200 });

  } catch (error) {
    console.error('Token refresh error:', error);
    return NextResponse.json({
      error: 'Invalid or expired refresh token'
    }, { status: 401 });
  }
}
