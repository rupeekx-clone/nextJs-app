import { NextApiRequest, NextApiResponse } from 'next'; // For traditional Next.js API routes if needed
import { NextRequest, NextResponse } from 'next/server'; // For Next.js Edge/Node.js runtimes (app router)
import { verifyToken, AuthPayload } from './jwt'; // Assuming jwt.ts is in the same lib directory

// Define a custom interface extending NextApiRequest to include the user property
export interface NextApiRequestWithUser extends NextApiRequest {
  user?: AuthPayload;
}

// Define a custom interface extending NextRequest to include the user property (for app router)
export interface NextRequestWithUser extends NextRequest {
  user?: AuthPayload;
}

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || 'default-access-secret-key-for-dev-must-be-32-chars';

/**
 * Higher-Order Function (HOF) for protecting Next.js API routes.
 * This version is more aligned with the Next.js App Router (using NextRequest, NextResponse).
 *
 * @param handler - The API route handler function to protect.
 *                  It will receive a NextRequestWithUser object.
 * @returns A new handler function that includes authentication and authorization logic.
 */
type AppRouterApiHandler = (req: NextRequestWithUser, params?: { params: any }) => Promise<NextResponse>;

export const withAuth = (handler: AppRouterApiHandler): AppRouterApiHandler => {
  return async (req: NextRequestWithUser, params?: { params: any }): Promise<NextResponse> => {
    try {
      const authHeader = req.headers.get('Authorization');

      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return NextResponse.json({ error: 'Unauthorized: No token provided' }, { status: 401 });
      }

      const token = authHeader.substring(7); // Remove "Bearer " prefix

      if (!token) {
        return NextResponse.json({ error: 'Unauthorized: Token is missing' }, { status: 401 });
      }

      // Verify the token
      const decodedPayload = verifyToken(token, ACCESS_TOKEN_SECRET);
      
      // Attach the user payload to the request object
      // For NextRequest, direct modification isn't standard like with old req object.
      // One common pattern is to pass it differently or use headers if absolutely needed downstream.
      // However, for simplicity in this HOF, we'll assume it can be handled if this HOF is
      // used as a wrapper before the main logic of the route handler.
      // A more robust way in app router might involve passing it as an argument or using a context.
      // For this example, we'll conceptually extend the request for the handler's use.
      req.user = decodedPayload;


      // Call the original handler with the modified request
      return handler(req, params);

    } catch (error: any) {
      console.error('Auth error:', error.message);
      if (error.name === 'TokenExpiredError') {
        return NextResponse.json({ error: 'Unauthorized: Token expired' }, { status: 401 });
      }
      if (error.name === 'JsonWebTokenError') {
        return NextResponse.json({ error: 'Unauthorized: Invalid token' }, { status: 401 });
      }
      return NextResponse.json({ error: 'Internal Server Error during authentication' }, { status: 500 });
    }
  };
};

/**
 * Example Usage (conceptual, for an App Router API route):
 *
 * import { withAuth, NextRequestWithUser } from '@/lib/authMiddleware';
 * import { NextResponse } from 'next/server';
 *
 * const myProtectedHandler = async (req: NextRequestWithUser) => {
 *   // req.user is available here
 *   const user = req.user;
 *   return NextResponse.json({ message: `Hello ${user?.userId}`, user });
 * };
 *
 * export const GET = withAuth(myProtectedHandler); // Protect the GET method
 */

// --- Considerations for Next.js Middleware (`middleware.ts`) ---
//
// While the HOF pattern (`withAuth`) is useful for server-side logic within API handlers,
// Next.js Middleware (`middleware.ts` at the root of `src` or `app`) offers a way to run
// code *before* a request is completed and can be applied to broader path patterns.
//
// Structure of `middleware.ts`:
//
// import { NextRequest, NextResponse } from 'next/server';
// import { verifyToken } from './lib/jwt'; // Adjust path
// const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || 'default-access-secret-key';
//
// export async function middleware(req: NextRequest) {
//   const { pathname } = req.nextUrl;
//
//   // Define protected paths
//   const protectedPaths = ['/api/users', '/api/loans', '/api/profile']; // Example paths
//
//   if (protectedPaths.some(path => pathname.startsWith(path))) {
//     const authHeader = req.headers.get('Authorization');
//     let token;
//
//     if (authHeader && authHeader.startsWith('Bearer ')) {
//       token = authHeader.substring(7);
//     }
//
//     if (!token) {
//       return NextResponse.json({ error: 'Unauthorized: Token missing' }, { status: 401 });
//     }
//
//     try {
//       const decoded = verifyToken(token, ACCESS_TOKEN_SECRET);
//       // If verification is successful, allow the request to proceed.
//       // To pass user data to the API route from Edge Middleware:
//       // 1. Add custom request headers:
//       const requestHeaders = new Headers(req.headers);
//       requestHeaders.set('x-user-id', decoded.userId);
//       requestHeaders.set('x-user-type', decoded.userType);
//       // Add other necessary decoded info
//       // return NextResponse.next({ request: { headers: requestHeaders } });
//       // Then, in your API route, you'd read these headers.
//       return NextResponse.next(); // Or use the headers approach above
//     } catch (error) {
//       // Handle token verification errors (expired, invalid)
//       return NextResponse.json({ error: 'Unauthorized: Invalid or expired token' }, { status: 401 });
//     }
//   }
//
//   return NextResponse.next(); // Allow other requests to pass through
// }
//
// export const config = {
//   matcher: ['/api/:path*'], // Apply middleware to all API routes or specific ones
// };
//
// Pros of Edge Middleware:
// - Performance: Runs on Edge Functions, closer to the user.
// - Centralized Logic: Applies to multiple routes based on path matching.
// - Early Exit: Can block unauthorized requests before they hit API route logic.
//
// Cons of Edge Middleware:
// - Limited Environment: Cannot use Node.js specific APIs directly (though `jsonwebtoken` often works with polyfills or is compatible).
// - Request Object Modification: Direct modification like `req.user = ...` is not possible. Data is typically passed via headers.
//
// The HOF approach (`withAuth`) is generally simpler for directly modifying the request object
// for use within the same Node.js runtime context of an API handler, especially if you are not using Edge.
// For App Router API Routes (which can be Node.js or Edge runtime), passing data via headers from middleware.ts
// or using the HOF pattern are both viable. The HOF can be more straightforward for adding `req.user`.
```
