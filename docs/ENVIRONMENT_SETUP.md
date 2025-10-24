# Environment Variables Setup Guide

This document provides a comprehensive guide for setting up environment variables for the Blumiq loan application platform.

## Quick Setup

1. Copy the environment variables below to a new file called `.env.local` in your project root
2. Replace all placeholder values with your actual credentials
3. Never commit `.env.local` to version control

## Environment Variables Template

```bash
# ===========================================
# BLUMIQ - LOAN APPLICATION PLATFORM
# Environment Variables Configuration
# ===========================================

# ===========================================
# DATABASE CONFIGURATION
# ===========================================
# MongoDB connection string
# For local development: mongodb://localhost:27017/blumiq
# For production: mongodb://username:password@host:port/database
MONGODB_URI=mongodb://localhost:27017/blumiq

# ===========================================
# JWT AUTHENTICATION
# ===========================================
# Generate secure random strings for production
# You can use: openssl rand -base64 32
ACCESS_TOKEN_SECRET=your-super-secure-access-token-secret-key-here-min-32-chars
REFRESH_TOKEN_SECRET=your-super-secure-refresh-token-secret-key-here-min-32-chars

# JWT token expiration times (optional - defaults provided)
# ACCESS_TOKEN_EXPIRATION=7d  # Changed from 15m to 7d for mobile auth
# REFRESH_TOKEN_EXPIRATION=7d

# ===========================================
# RAZORPAY PAYMENT GATEWAY
# ===========================================
# Get these from your Razorpay Dashboard: https://dashboard.razorpay.com/
RAZORPAY_KEY_ID=rzp_test_your_key_id_here
RAZORPAY_KEY_SECRET=your_razorpay_key_secret_here

# ===========================================
# TWILIO SMS SERVICE
# ===========================================
# Get these from your Twilio Console: https://console.twilio.com/
TWILIO_ACCOUNT_SID=your_twilio_account_sid_here
TWILIO_AUTH_TOKEN=your_twilio_auth_token_here
TWILIO_PHONE_NUMBER=+1234567890

# OTP Configuration
OTP_LENGTH=6
OTP_VALIDITY_MINUTES=10

# ===========================================
# EMAIL SERVICE (SMTP)
# ===========================================
# Gmail SMTP configuration (or your preferred email service)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-specific-password

# Alternative email services:
# For Outlook/Hotmail: smtp-mail.outlook.com
# For Yahoo: smtp.mail.yahoo.com
# For custom SMTP: your-smtp-server.com

# ===========================================
# AWS S3 STORAGE
# ===========================================
# For document storage and file uploads
AWS_ACCESS_KEY_ID=your_aws_access_key_id
AWS_SECRET_ACCESS_KEY=your_aws_secret_access_key
AWS_REGION=us-east-1
AWS_S3_BUCKET=your-s3-bucket-name

# ===========================================
# NEXT.JS CONFIGURATION
# ===========================================
# Application URL
NEXTAUTH_URL=http://localhost:3000

# NextAuth secret for production
NEXTAUTH_SECRET=your-nextauth-secret-key-here

# ===========================================
# APPLICATION SETTINGS
# ===========================================
# Environment (development, staging, production)
NODE_ENV=development

# Application port (optional - defaults to 3000)
# PORT=3000

# ===========================================
# SECURITY SETTINGS
# ===========================================
# CORS origins (comma-separated for multiple origins)
# CORS_ORIGINS=http://localhost:3000,https://yourdomain.com

# Rate limiting (requests per minute)
# RATE_LIMIT_REQUESTS=100

# ===========================================
# FEATURE FLAGS
# ===========================================
# Enable/disable features
# ENABLE_SMS_VERIFICATION=true
# ENABLE_EMAIL_VERIFICATION=true
# ENABLE_PAYMENT_PROCESSING=true
# ENABLE_DOCUMENT_UPLOAD=true

# ===========================================
# LOGGING & MONITORING
# ===========================================
# Log level (error, warn, info, debug)
# LOG_LEVEL=info

# External monitoring services (optional)
# SENTRY_DSN=your_sentry_dsn_here
# NEW_RELIC_LICENSE_KEY=your_new_relic_key_here

# ===========================================
# BANK PARTNER INTEGRATIONS
# ===========================================
# API keys for bank partner integrations (when available)
# BANK_PARTNER_1_API_KEY=your_bank_partner_1_key
# BANK_PARTNER_2_API_KEY=your_bank_partner_2_key

# ===========================================
# DEVELOPMENT SETTINGS
# ===========================================
# Skip email verification in development
# SKIP_EMAIL_VERIFICATION=false

# Use mock payment gateway in development
# USE_MOCK_PAYMENTS=false

# Enable debug mode
# DEBUG=true

# ===========================================
# PRODUCTION SETTINGS
# ===========================================
# SSL/TLS settings
# SSL_CERT_PATH=/path/to/ssl/cert.pem
# SSL_KEY_PATH=/path/to/ssl/private.key

# Database connection pool settings
# DB_MAX_POOL_SIZE=10
# DB_MIN_POOL_SIZE=2
```

## Required vs Optional Variables

### Required for Basic Functionality
- `MONGODB_URI` - Database connection
- `ACCESS_TOKEN_SECRET` - JWT authentication
- `REFRESH_TOKEN_SECRET` - JWT authentication

### Required for Full Functionality
- `RAZORPAY_KEY_ID` & `RAZORPAY_KEY_SECRET` - Payment processing
- `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_PHONE_NUMBER` - SMS verification
- `EMAIL_HOST`, `EMAIL_PORT`, `EMAIL_USER`, `EMAIL_PASS` - Email notifications
- `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_REGION`, `AWS_S3_BUCKET` - Document storage

### Optional
- All other variables are optional and have sensible defaults

## Service Setup Guides

### 1. MongoDB Setup
```bash
# Local development
MONGODB_URI=mongodb://localhost:27017/blumiq

# MongoDB Atlas (cloud)
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/blumiq
```

### 2. Razorpay Setup
1. Sign up at [Razorpay Dashboard](https://dashboard.razorpay.com/)
2. Get your API keys from Settings > API Keys
3. Use test keys for development, live keys for production

### 3. Twilio Setup
1. Sign up at [Twilio Console](https://console.twilio.com/)
2. Get your Account SID and Auth Token from the dashboard
3. Purchase a phone number for SMS sending

### 4. Email Setup (Gmail)
1. Enable 2-factor authentication on your Gmail account
2. Generate an App Password: Google Account > Security > App passwords
3. Use the app password as `EMAIL_PASS`

### 5. AWS S3 Setup
1. Create an AWS account and S3 bucket
2. Create IAM user with S3 permissions
3. Get Access Key ID and Secret Access Key

## Security Best Practices

1. **Never commit `.env.local` to version control**
2. **Use strong, unique secrets for production**
3. **Rotate secrets regularly**
4. **Use environment-specific values**
5. **Never expose secrets in client-side code**

## Development vs Production

### Development
- Use test API keys and credentials
- Enable debug logging
- Use local database instances
- Skip some verifications for faster development

### Production
- Use live API keys and credentials
- Disable debug logging
- Use production database instances
- Enable all security features
- Use HTTPS and secure headers

## Troubleshooting

### Common Issues

1. **Build fails with "key_id or oauthToken is mandatory"**
   - Add Razorpay credentials or the app will handle missing credentials gracefully

2. **SMS not sending**
   - Check Twilio credentials and phone number format
   - Ensure you have sufficient Twilio credits

3. **Email not sending**
   - Check SMTP credentials and settings
   - For Gmail, use App Password instead of regular password

4. **Database connection fails**
   - Check MongoDB URI format
   - Ensure MongoDB is running (for local development)
   - Check network connectivity (for cloud databases)

5. **File upload fails**
   - Check AWS S3 credentials and bucket permissions
   - Ensure bucket exists and is accessible

## Environment File Structure

```
project-root/
├── .env.local          # Your local environment variables (DO NOT COMMIT)
├── .env.example        # Template file (safe to commit)
├── .env.development    # Development environment (optional)
├── .env.production     # Production environment (optional)
└── docs/
    └── ENVIRONMENT_SETUP.md  # This documentation
```

## Next Steps

1. Create your `.env.local` file with the template above
2. Fill in your actual credentials
3. Test the application with `npm run dev`
4. Verify all features work correctly
5. For production deployment, set environment variables in your hosting platform

## Support

If you encounter issues with environment setup:
1. Check this documentation first
2. Verify all required variables are set
3. Check service-specific documentation (Razorpay, Twilio, AWS)
4. Review application logs for specific error messages
