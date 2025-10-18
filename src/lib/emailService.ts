import nodemailer from 'nodemailer';

// Email service configuration
const transporter = nodemailer.createTransport({
  service: 'gmail', // You can change this to other services
  auth: {
    user: process.env.EMAIL_USER!,
    pass: process.env.EMAIL_PASSWORD!,
  },
});

export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export interface EmailVerificationOptions {
  to: string;
  name: string;
  verificationToken: string;
}

export interface PasswordResetOptions {
  to: string;
  name: string;
  resetToken: string;
}

export class EmailService {
  /**
   * Send a generic email
   */
  static async sendEmail(options: EmailOptions): Promise<{ success: boolean; messageId?: string; error?: string }> {
    try {
      const mailOptions = {
        from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
        to: options.to,
        subject: options.subject,
        html: options.html,
        text: options.text,
      };

      const result = await transporter.sendMail(mailOptions);
      
      return {
        success: true,
        messageId: result.messageId,
      };
    } catch (error) {
      console.error('Email sending error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to send email',
      };
    }
  }

  /**
   * Send email verification email
   */
  static async sendVerificationEmail(options: EmailVerificationOptions): Promise<{ success: boolean; messageId?: string; error?: string }> {
    const verificationUrl = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/auth/verify-email?token=${options.verificationToken}`;
    
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Verify Your Email - Blumiq</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #1976d2;">Welcome to Blumiq!</h2>
            <p>Hi ${options.name},</p>
            <p>Thank you for registering with Blumiq. Please verify your email address to complete your registration.</p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${verificationUrl}" 
                 style="background-color: #1976d2; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
                Verify Email Address
              </a>
            </div>
            <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
            <p style="word-break: break-all; color: #666;">${verificationUrl}</p>
            <p>This link will expire in 24 hours.</p>
            <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
            <p style="font-size: 12px; color: #666;">
              If you didn't create an account with Blumiq, please ignore this email.
            </p>
          </div>
        </body>
      </html>
    `;

    const text = `
      Welcome to Blumiq!
      
      Hi ${options.name},
      
      Thank you for registering with Blumiq. Please verify your email address to complete your registration.
      
      Click this link to verify: ${verificationUrl}
      
      This link will expire in 24 hours.
      
      If you didn't create an account with Blumiq, please ignore this email.
    `;

    return this.sendEmail({
      to: options.to,
      subject: 'Verify Your Email - Blumiq',
      html,
      text,
    });
  }

  /**
   * Send password reset email
   */
  static async sendPasswordResetEmail(options: PasswordResetOptions): Promise<{ success: boolean; messageId?: string; error?: string }> {
    const resetUrl = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/customer/reset-password?token=${options.resetToken}`;
    
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Reset Your Password - Blumiq</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #1976d2;">Password Reset Request</h2>
            <p>Hi ${options.name},</p>
            <p>We received a request to reset your password for your Blumiq account.</p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetUrl}" 
                 style="background-color: #1976d2; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
                Reset Password
              </a>
            </div>
            <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
            <p style="word-break: break-all; color: #666;">${resetUrl}</p>
            <p>This link will expire in 1 hour.</p>
            <p><strong>If you didn't request a password reset, please ignore this email.</strong></p>
            <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
            <p style="font-size: 12px; color: #666;">
              For security reasons, this link can only be used once.
            </p>
          </div>
        </body>
      </html>
    `;

    const text = `
      Password Reset Request
      
      Hi ${options.name},
      
      We received a request to reset your password for your Blumiq account.
      
      Click this link to reset your password: ${resetUrl}
      
      This link will expire in 1 hour.
      
      If you didn't request a password reset, please ignore this email.
      
      For security reasons, this link can only be used once.
    `;

    return this.sendEmail({
      to: options.to,
      subject: 'Reset Your Password - Blumiq',
      html,
      text,
    });
  }

  /**
   * Send loan application confirmation email
   */
  static async sendLoanApplicationConfirmation(
    to: string, 
    name: string, 
    applicationId: string, 
    loanType: string, 
    amount: number
  ): Promise<{ success: boolean; messageId?: string; error?: string }> {
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Loan Application Submitted - Blumiq</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #1976d2;">Loan Application Submitted Successfully</h2>
            <p>Hi ${name},</p>
            <p>Your loan application has been submitted successfully. Here are the details:</p>
            <div style="background-color: #f5f5f5; padding: 20px; border-radius: 5px; margin: 20px 0;">
              <p><strong>Application ID:</strong> ${applicationId}</p>
              <p><strong>Loan Type:</strong> ${loanType.charAt(0).toUpperCase() + loanType.slice(1)} Loan</p>
              <p><strong>Amount Requested:</strong> ₹${amount.toLocaleString()}</p>
              <p><strong>Status:</strong> Submitted</p>
            </div>
            <p>Our team will review your application and get back to you within 24-48 hours.</p>
            <p>You can track your application status by logging into your account.</p>
            <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
            <p style="font-size: 12px; color: #666;">
              If you have any questions, please contact our support team.
            </p>
          </div>
        </body>
      </html>
    `;

    return this.sendEmail({
      to,
      subject: 'Loan Application Submitted - Blumiq',
      html,
    });
  }

  /**
   * Send membership card purchase confirmation
   */
  static async sendMembershipConfirmation(
    to: string, 
    name: string, 
    cardType: string, 
    expiryDate: Date
  ): Promise<{ success: boolean; messageId?: string; error?: string }> {
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Membership Card Activated - Blumiq</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #1976d2;">Welcome to Blumiq Membership!</h2>
            <p>Hi ${name},</p>
            <p>Congratulations! Your ${cardType} membership card has been activated successfully.</p>
            <div style="background-color: #f5f5f5; padding: 20px; border-radius: 5px; margin: 20px 0;">
              <p><strong>Membership Type:</strong> ${cardType}</p>
              <p><strong>Valid Until:</strong> ${expiryDate.toLocaleDateString()}</p>
              <p><strong>Status:</strong> Active</p>
            </div>
            <p>You can now enjoy all the benefits of your membership, including faster loan processing and exclusive offers.</p>
            <p>Thank you for choosing Blumiq!</p>
            <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
            <p style="font-size: 12px; color: #666;">
              If you have any questions about your membership, please contact our support team.
            </p>
          </div>
        </body>
      </html>
    `;

    return this.sendEmail({
      to,
      subject: 'Membership Card Activated - Blumiq',
      html,
    });
  }

  /**
   * Send loan approval notification
   */
  static async sendLoanApprovalNotification(
    to: string,
    name: string,
    applicationId: string,
    approvedAmount: number,
    interestRate: number,
    tenureMonths: number
  ): Promise<{ success: boolean; messageId?: string; error?: string }> {
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Loan Application Approved - Blumiq</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #4caf50;">🎉 Congratulations! Your Loan is Approved</h2>
            <p>Hi ${name},</p>
            <p>Great news! Your loan application has been approved. Here are the details:</p>
            <div style="background-color: #e8f5e8; padding: 20px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #4caf50;">
              <p><strong>Application ID:</strong> ${applicationId}</p>
              <p><strong>Approved Amount:</strong> ₹${approvedAmount.toLocaleString()}</p>
              <p><strong>Interest Rate:</strong> ${interestRate}% per annum</p>
              <p><strong>Loan Tenure:</strong> ${tenureMonths} months</p>
              <p><strong>Status:</strong> Approved</p>
            </div>
            <p>Next steps:</p>
            <ul>
              <li>Review the loan terms and conditions</li>
              <li>Sign the loan agreement</li>
              <li>Complete any remaining documentation</li>
              <li>Funds will be disbursed within 24-48 hours</li>
            </ul>
            <p>You can log into your account to view the complete loan details and next steps.</p>
            <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
            <p style="font-size: 12px; color: #666;">
              If you have any questions, please contact our support team.
            </p>
          </div>
        </body>
      </html>
    `;

    return this.sendEmail({
      to,
      subject: 'Loan Application Approved - Blumiq',
      html,
    });
  }

  /**
   * Send loan rejection notification
   */
  static async sendLoanRejectionNotification(
    to: string,
    name: string,
    applicationId: string,
    reason: string,
    remarks?: string
  ): Promise<{ success: boolean; messageId?: string; error?: string }> {
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Loan Application Update - Blumiq</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #f44336;">Loan Application Update</h2>
            <p>Hi ${name},</p>
            <p>We have reviewed your loan application and unfortunately, we are unable to approve it at this time.</p>
            <div style="background-color: #ffebee; padding: 20px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #f44336;">
              <p><strong>Application ID:</strong> ${applicationId}</p>
              <p><strong>Status:</strong> Not Approved</p>
              <p><strong>Reason:</strong> ${reason}</p>
              ${remarks ? `<p><strong>Additional Notes:</strong> ${remarks}</p>` : ''}
            </div>
            <p>Don't worry! You can:</p>
            <ul>
              <li>Apply again after addressing the mentioned concerns</li>
              <li>Contact our support team for guidance</li>
              <li>Consider our other loan products</li>
            </ul>
            <p>We appreciate your interest in Blumiq and look forward to serving you in the future.</p>
            <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
            <p style="font-size: 12px; color: #666;">
              If you have any questions, please contact our support team.
            </p>
          </div>
        </body>
      </html>
    `;

    return this.sendEmail({
      to,
      subject: 'Loan Application Update - Blumiq',
      html,
    });
  }

  /**
   * Send membership purchase confirmation (alias for backward compatibility)
   */
  static async sendMembershipPurchaseConfirmation(
    to: string,
    name: string,
    cardType: string,
    price: number,
    purchaseDate: Date
  ): Promise<{ success: boolean; messageId?: string; error?: string }> {
    const expiryDate = new Date(purchaseDate);
    expiryDate.setFullYear(expiryDate.getFullYear() + 4); // 4 years validity
    
    return this.sendMembershipConfirmation(to, name, cardType, expiryDate);
  }
}

export default EmailService;
