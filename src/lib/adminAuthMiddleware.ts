import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from './jwt';

export interface NextRequestWithAdmin extends NextRequest {
  admin?: {
    adminId: string;
    email: string;
    role: string;
  };
}

export const withAdminAuth = (handler: (req: NextRequestWithAdmin) => Promise<NextResponse>) => {
  return async (req: NextRequestWithAdmin): Promise<NextResponse> => {
    try {
      const authHeader = req.headers.get('authorization');
      
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return NextResponse.json({ error: 'Authorization header missing or invalid' }, { status: 401 });
      }

      const token = authHeader.substring(7);
      
      try {
        const decoded = verifyToken(token, process.env.ACCESS_TOKEN_SECRET!);
        
        // Check if user is admin
        if (decoded.userType !== 'admin') {
          return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
        }

        // Attach admin info to request
        req.admin = {
          adminId: decoded.userId,
          email: decoded.email,
          role: decoded.userType,
        };

        return await handler(req);
      } catch (tokenError) {
        console.error('Token verification failed:', tokenError);
        return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 });
      }
    } catch (error) {
      console.error('Admin auth middleware error:', error);
      return NextResponse.json({ error: 'Authentication failed' }, { status: 500 });
    }
  };
};
