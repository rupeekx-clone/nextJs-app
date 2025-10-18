import jwt, { JwtPayload, Secret, SignOptions } from 'jsonwebtoken';

// --- Environment Variables ---
// These should be defined in your .env.local file for security and flexibility.
// Example .env.local:
// ACCESS_TOKEN_SECRET=your-access-token-secret-key-of-at-least-32-characters
// REFRESH_TOKEN_SECRET=your-refresh-token-secret-key-of-at-least-32-characters
// ACCESS_TOKEN_EXPIRATION=15m
// REFRESH_TOKEN_EXPIRATION=7d

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || 'default-access-secret-key-for-dev-must-be-32-chars';
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || 'default-refresh-secret-key-for-dev-must-be-32-chars';
const ACCESS_TOKEN_EXPIRATION = process.env.ACCESS_TOKEN_EXPIRATION || '15m';
const REFRESH_TOKEN_EXPIRATION = process.env.REFRESH_TOKEN_EXPIRATION || '7d';

if (ACCESS_TOKEN_SECRET === 'default-access-secret-key-for-dev-must-be-32-chars' && process.env.NODE_ENV === 'production') {
  console.warn('WARNING: Using default ACCESS_TOKEN_SECRET in production. Please set a secure secret in environment variables.');
}
if (REFRESH_TOKEN_SECRET === 'default-refresh-secret-key-for-dev-must-be-32-chars' && process.env.NODE_ENV === 'production') {
  console.warn('WARNING: Using default REFRESH_TOKEN_SECRET in production. Please set a secure secret in environment variables.');
}

export interface AuthPayload extends JwtPayload {
  userId: string;
  email: string;
  userType: string;
  // You can add other relevant, non-sensitive user details here
}

/**
 * Generates an access token.
 * @param payload - The payload to include in the token (e.g., { userId: string, userType: string }).
 * @returns The generated access token.
 */
export const generateAccessToken = (payload: AuthPayload): string => {
  return jwt.sign(payload, ACCESS_TOKEN_SECRET as Secret, { expiresIn: ACCESS_TOKEN_EXPIRATION } as SignOptions);
};

/**
 * Generates a refresh token.
 * @param payload - The payload to include in the token (typically the same as for the access token, or just userId).
 * @returns The generated refresh token.
 */
export const generateRefreshToken = (payload: AuthPayload): string => {
  return jwt.sign(payload, REFRESH_TOKEN_SECRET as Secret, { expiresIn: REFRESH_TOKEN_EXPIRATION } as SignOptions);
};

/**
 * Verifies a token using the provided secret.
 * @param token - The JWT to verify.
 * @param secret - The secret key used to sign the token.
 * @returns The decoded payload if verification is successful.
 * @throws Error if verification fails (e.g., token expired, signature invalid).
 */
export const verifyToken = (token: string, secret: string): AuthPayload => {
  try {
    const decoded = jwt.verify(token, secret) as AuthPayload;
    return decoded;
  } catch (error) {
    console.error('Token verification failed:', error);
    throw error; // Re-throw the error to be handled by the caller
  }
};