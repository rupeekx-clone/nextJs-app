# Technical Context

## Technology Stack

### Core Framework
- **Next.js**: 15.3.2 (App Router)
- **React**: 19.0.0
- **TypeScript**: 5.x
- **Node.js**: Compatible with Next.js 15.3.2

### Database & Data Layer
- **MongoDB**: 6.16.0 (Primary database)
- **Mongoose**: 8.15.1 (Object Document Mapper)
- **MongoDB Native Driver**: For direct database operations

### Authentication & Security
- **JWT**: jsonwebtoken 9.0.2 (Access & refresh tokens)
- **Password Hashing**: bcryptjs 2.4.3
- **OTP Service**: Twilio 5.2.0 (SMS verification)

### Payment & Document Management
- **Razorpay**: 2.9.2 (Payment gateway integration)
- **AWS S3**: @aws-sdk/client-s3 3.700.0 (Document storage)
- **AWS S3 Presigner**: @aws-sdk/s3-request-presigner 3.700.0 (Secure URLs)

### Email & Communication
- **Nodemailer**: 6.9.15 (Email service)
- **Twilio**: 5.2.0 (SMS verification)

### UI Framework & Styling
- **Material-UI**: 7.1.0 (Component library)
  - @mui/material (Grid v7 API, responsive components)
  - @mui/icons-material (Icon library)
  - @emotion/react (CSS-in-JS runtime)
  - @emotion/styled (Styled components)
- **Tailwind CSS**: 4.x (Utility-first CSS)
- **PostCSS**: 4.x (CSS processing)
- **Professional Navigation**: Custom Header component with responsive design
- **Professional Footer**: Multi-column layout with newsletter subscription

### Form Management & Validation
- **React Hook Form**: 7.53.0 (Form management)
- **Zod**: 3.23.8 (Schema validation)
- **@hookform/resolvers**: 3.9.0 (Zod integration)

### Data Fetching & State Management
- **SWR**: 2.2.5 (Data fetching and caching)
- **Axios**: 1.9.0 (HTTP client)

### File Upload & Processing
- **Multer**: 1.4.5-lts.1 (File upload handling)

### HTTP & API
- **Next.js API Routes**: Built-in API handling

### Development Tools
- **ESLint**: 9.x (Code linting)
- **TypeScript**: 5.x (Type checking)
- **Next.js Linting**: eslint-config-next

## UI/UX Implementation Status

### Professional Navigation System ✅ Complete
- **Smart Header Component**: Responsive navigation with mobile hamburger menu
- **User Authentication Integration**: Complete user state management
- **Search Functionality**: Integrated search with suggestions
- **Notifications System**: Real-time notification system with badge
- **Membership Status Display**: Dynamic membership card display
- **Sticky Navigation**: Smooth scroll behavior with backdrop blur
- **Mobile Responsive**: Optimized for all screen sizes

### Professional Footer System ✅ Complete
- **Multi-Column Layout**: Organized sections for easy navigation
- **Company Information**: Contact details, address, and business hours
- **Quick Links**: Comprehensive navigation to all pages
- **Newsletter Subscription**: Email signup with validation
- **Social Media Links**: Integration with social platforms
- **Trust Badges**: Security and verification indicators
- **Back to Top**: Smooth scroll to top functionality
- **Security Notice**: Data protection assurance

### Grid v7 API Compliance ✅ Complete
- **Material-UI Grid v7**: Updated all components to use new Grid v7 API
- **Responsive Design**: Proper breakpoint usage with size prop
- **Migration Pattern**: Removed deprecated 'item' prop, moved breakpoints to 'size' object
- **Performance Optimized**: Efficient grid layout system

## Development Environment Setup

### Prerequisites
- **Node.js**: 18.x or higher
- **npm**: 9.x or higher
- **MongoDB**: 6.x or higher (local or cloud instance)

### Installation Steps

1. **Clone and Install Dependencies**
```bash
git clone <repository-url>
cd nextjs-app
npm install
```

2. **Environment Configuration**
Create `.env.local` file in project root:
```bash
# Database
MONGODB_URI=mongodb://localhost:27017/Blumiq_clone_db

# JWT Configuration
ACCESS_TOKEN_SECRET=your-access-token-secret-key-of-at-least-32-characters
REFRESH_TOKEN_SECRET=your-refresh-token-secret-key-of-at-least-32-characters
ACCESS_TOKEN_EXPIRATION=15m
REFRESH_TOKEN_EXPIRATION=7d

# Twilio Configuration
TWILIO_ACCOUNT_SID=your-twilio-account-sid
TWILIO_AUTH_TOKEN=your-twilio-auth-token
TWILIO_PHONE_NUMBER=+1234567890

# OTP Configuration
OTP_LENGTH=6

# Razorpay Configuration
RAZORPAY_KEY_ID=your-razorpay-key-id
RAZORPAY_KEY_SECRET=your-razorpay-key-secret
RAZORPAY_WEBHOOK_SECRET=your-razorpay-webhook-secret

# AWS S3 Configuration
AWS_ACCESS_KEY_ID=your-aws-access-key-id
AWS_SECRET_ACCESS_KEY=your-aws-secret-access-key
AWS_S3_BUCKET_NAME=your-s3-bucket-name
AWS_REGION=your-aws-region

# Email Configuration
SMTP_HOST=your-smtp-host
SMTP_PORT=587
SMTP_USER=your-smtp-username
SMTP_PASS=your-smtp-password
SMTP_FROM=noreply@Blumiq.com

# Environment
NODE_ENV=development
```

3. **MongoDB Setup**
```bash
# Start MongoDB (if running locally)
mongod

# Or use MongoDB Atlas (cloud)
# Update MONGODB_URI with Atlas connection string
```

4. **Development Server**
```bash
npm run dev
# Server runs on http://localhost:3000
```

### Available Scripts

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build", 
    "start": "next start",
    "lint": "next lint"
  }
}
```

## Environment Variables

### Required Variables

| Variable | Description | Example | Required |
|----------|-------------|---------|----------|
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/Blumiq_clone_db` | ✅ |
| `ACCESS_TOKEN_SECRET` | JWT access token secret (32+ chars) | `your-secret-key-here` | ✅ |
| `REFRESH_TOKEN_SECRET` | JWT refresh token secret (32+ chars) | `your-refresh-secret-here` | ✅ |
| `ACCESS_TOKEN_EXPIRATION` | Access token expiry time | `15m` | ✅ |
| `REFRESH_TOKEN_EXPIRATION` | Refresh token expiry time | `7d` | ✅ |
| `TWILIO_ACCOUNT_SID` | Twilio account SID | `ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxx` | ✅ |
| `TWILIO_AUTH_TOKEN` | Twilio auth token | `your-twilio-auth-token` | ✅ |
| `TWILIO_PHONE_NUMBER` | Twilio phone number (E.164) | `+1234567890` | ✅ |
| `OTP_LENGTH` | OTP code length | `6` | ✅ |
| `RAZORPAY_KEY_ID` | Razorpay API key ID | `rzp_test_xxxxxxxxxxxxx` | ✅ |
| `RAZORPAY_KEY_SECRET` | Razorpay API key secret | `your-razorpay-secret` | ✅ |
| `RAZORPAY_WEBHOOK_SECRET` | Razorpay webhook secret | `your-webhook-secret` | ✅ |
| `AWS_ACCESS_KEY_ID` | AWS access key ID | `AKIAIOSFODNN7EXAMPLE` | ✅ |
| `AWS_SECRET_ACCESS_KEY` | AWS secret access key | `wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY` | ✅ |
| `AWS_S3_BUCKET_NAME` | AWS S3 bucket name | `Blumiq-documents` | ✅ |
| `AWS_REGION` | AWS region | `us-east-1` | ✅ |
| `SMTP_HOST` | SMTP server host | `smtp.gmail.com` | ✅ |
| `SMTP_PORT` | SMTP server port | `587` | ✅ |
| `SMTP_USER` | SMTP username | `your-email@gmail.com` | ✅ |
| `SMTP_PASS` | SMTP password | `your-app-password` | ✅ |
| `SMTP_FROM` | From email address | `noreply@Blumiq.com` | ✅ |
| `NODE_ENV` | Environment mode | `development` | ✅ |

### Optional Variables

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `PORT` | Server port | `3000` | ❌ |
| `NEXTAUTH_URL` | Base URL for auth callbacks | `http://localhost:3000` | ❌ |
| `NEXTAUTH_SECRET` | NextAuth secret key | - | ❌ |

### Environment-Specific Configurations

#### Development
```bash
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/Blumiq_clone_db_dev
ACCESS_TOKEN_EXPIRATION=1h
REFRESH_TOKEN_EXPIRATION=7d
```

#### Production
```bash
NODE_ENV=production
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/Blumiq_prod
ACCESS_TOKEN_EXPIRATION=15m
REFRESH_TOKEN_EXPIRATION=7d
```

## Database Configuration

### MongoDB Connection

```typescript
// src/lib/mongodb.ts
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/Blumiq_clone_db";
let cachedDb: Db | null = null;

export async function connectToDatabase(): Promise<Db> {
  if (cachedDb) {
    return cachedDb;
  }
  
  const client = new MongoClient(MONGODB_URI);
  await client.connect();
  const dbName = MONGODB_URI.split('/').pop()?.split('?')[0];
  const db = client.db(dbName);
  cachedDb = db;
  return db;
}
```

### Database Collections

Based on the schema, the following collections are expected:

- `users` - User accounts and profiles
- `loan_applications` - Loan application records
- `membership_cards` - User membership cards
- `membership_card_types` - Available membership types
- `cash_lending_subscriptions` - User subscriptions
- `cash_lending_subscription_plans` - Available subscription plans
- `bank_partners` - Partner bank information
- `enquiries` - Customer support enquiries
- `static_content` - CMS content (FAQs, policies)

### Mongoose Models

```typescript
// Example model structure
import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  full_name: string;
  phone_number: string;
  password?: string;
  user_type: 'customer' | 'cash_lending_customer' | 'admin';
  // ... other fields
}

const userSchema = new Schema<IUser>({
  // Schema definition
}, {
  timestamps: true,
  toJSON: { transform: (doc, ret) => { delete ret.password; return ret; } }
});

export default mongoose.models.User || mongoose.model<IUser>('User', userSchema);
```

## Authentication Configuration

### JWT Configuration

```typescript
// src/lib/jwt.ts
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || 'default-secret';
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || 'default-refresh-secret';
const ACCESS_TOKEN_EXPIRATION = process.env.ACCESS_TOKEN_EXPIRATION || '15m';
const REFRESH_TOKEN_EXPIRATION = process.env.REFRESH_TOKEN_EXPIRATION || '7d';

export const generateAccessToken = (payload: AuthPayload): string => {
  return jwt.sign(payload, ACCESS_TOKEN_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRATION });
};

export const generateRefreshToken = (payload: AuthPayload): string => {
  return jwt.sign(payload, REFRESH_TOKEN_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRATION });
};
```

### Password Security

```typescript
// Password hashing configuration
const SALT_ROUNDS = 10;

// Hash password
const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

// Verify password
const isValid = await bcrypt.compare(candidatePassword, hashedPassword);
```

## Twilio Configuration

### SMS Service Setup

```typescript
// src/lib/otpService.ts
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;

const twilioClient = twilio(accountSid, authToken);

export const sendOtp = async (phoneNumber: string, otp: string) => {
  const message = await twilioClient.messages.create({
    to: phoneNumber,
    from: twilioPhoneNumber,
    body: `Your OTP for Blumiq is: ${otp}`
  });
  return { success: true, messageId: message.sid };
};
```

### Phone Number Format

- **Input Format**: Indian format `9876543210`
- **Twilio Format**: E.164 format `+919876543210`
- **Validation**: `/^[6-9]\d{9}$/` for Indian numbers

## UI Framework Configuration

### Material-UI Theme

```typescript
// src/components/ThemeRegistry/theme.ts
import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
  typography: {
    fontFamily: 'Geist, Arial, sans-serif',
  },
});
```

### Tailwind CSS Configuration

```javascript
// postcss.config.mjs
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

## API Configuration

### CORS and Headers

```typescript
// API route headers
const headers = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': process.env.NODE_ENV === 'production' ? 'https://yourdomain.com' : '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};
```

### Rate Limiting (Future Implementation)

```typescript
// Rate limiting configuration
const RATE_LIMIT = {
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP'
};
```

## Build and Deployment

### Build Configuration

```typescript
// next.config.ts
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  experimental: {
    appDir: true,
  },
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
};

export default nextConfig;
```

### Production Build

```bash
# Build for production
npm run build

# Start production server
npm start
```

### Deployment Considerations

#### Vercel (Recommended)
- Automatic deployments from Git
- Built-in environment variable management
- MongoDB Atlas integration
- Edge functions support

#### Docker Deployment
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

#### Environment Variables in Production
- Use secure secret management
- Never commit `.env` files
- Use different secrets for different environments
- Rotate secrets regularly

## Performance Optimization

### Database Optimization

```typescript
// Index creation for performance
await db.collection('users').createIndex({ email: 1 }, { unique: true });
await db.collection('users').createIndex({ phone_number: 1 }, { unique: true });
await db.collection('loan_applications').createIndex({ user_id: 1 });
await db.collection('loan_applications').createIndex({ status: 1 });
```

### Caching Strategy

```typescript
// Connection caching
let cachedDb: Db | null = null;

// Response caching for static data
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
```

### Bundle Optimization

```typescript
// Dynamic imports for code splitting
const DynamicComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <p>Loading...</p>,
});
```

## Security Configuration

### Security Headers

```typescript
// middleware.ts
export function middleware(request: NextRequest) {
  const response = NextResponse.next();
  
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'origin-when-cross-origin');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  
  return response;
}
```

### Input Validation

```typescript
// Validation schemas
const userSchema = z.object({
  email: z.string().email(),
  phone: z.string().regex(/^[6-9]\d{9}$/),
  password: z.string().min(8),
});
```

## Monitoring and Logging

### Error Logging

```typescript
// Error handling in API routes
export async function POST(req: NextRequest) {
  try {
    // API logic
  } catch (error) {
    console.error('API Error:', {
      error: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString(),
      url: req.url,
    });
    
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
```

### Performance Monitoring

```typescript
// Performance tracking
const startTime = Date.now();
// ... operation
const duration = Date.now() - startTime;
console.log(`Operation completed in ${duration}ms`);
```

## Development Workflow

### Code Quality

```bash
# Linting
npm run lint

# Type checking
npx tsc --noEmit

# Format code (if using Prettier)
npx prettier --write .
```

### Testing Setup (Future)

```bash
# Install testing dependencies
npm install --save-dev jest @testing-library/react @testing-library/jest-dom

# Run tests
npm test
```

### Git Hooks (Future)

```json
// package.json
{
  "husky": {
    "hooks": {
      "pre-commit": "lint-staged"
    }
  },
  "lint-staged": {
    "*.{js,jsx,ts,tsx}": ["eslint --fix", "git add"]
  }
}
```
