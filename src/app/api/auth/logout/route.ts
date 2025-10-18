import { NextRequest, NextResponse } from 'next/server';
import { withAuth, NextRequestWithUser } from '@/lib/authMiddleware';

const logoutHandler = async (req: NextRequestWithUser) => {
  try {
    // In a stateless JWT system, logout is primarily handled client-side
    // by removing the token from storage. However, we can implement
    // server-side token blacklisting if needed in the future.
    
    // For now, we'll just return a success response
    // The client should remove the token from localStorage/sessionStorage
    
    return NextResponse.json({
      success: true,
      message: 'Logout successful'
    }, { status: 200 });
    
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json({
      error: 'Internal server error'
    }, { status: 500 });
  }
};

export const POST = withAuth(logoutHandler);
