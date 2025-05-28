import twilio from 'twilio';

// --- Environment Variable Access ---
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;

// OTP Settings from environment variables, with defaults
const OTP_LENGTH = parseInt(process.env.OTP_LENGTH || '6', 10);
// OTP_VALIDITY_MINUTES is not directly used in this file but defined for completeness from prompt
// const OTP_VALIDITY_MINUTES = parseInt(process.env.OTP_VALIDITY_MINUTES || '10', 10); 

let twilioClient: twilio.Twilio | null = null;

if (accountSid && authToken && twilioPhoneNumber) {
  twilioClient = twilio(accountSid, authToken);
} else {
  console.warn(
    'Twilio credentials (TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, or TWILIO_PHONE_NUMBER) are missing or incomplete in environment variables. SMS sending will be disabled.'
  );
}

/**
 * Generates a random numeric OTP of a specified length.
 * @param length - The desired length of the OTP. Defaults to OTP_LENGTH from env or 6.
 * @returns The generated OTP string.
 */
export const generateOtp = (length: number = OTP_LENGTH): string => {
  if (length <= 0) {
    throw new Error('OTP length must be a positive integer.');
  }
  const digits = '0123456789';
  let otp = '';
  for (let i = 0; i < length; i++) {
    otp += digits[Math.floor(Math.random() * 10)];
  }
  return otp;
};

/**
 * Sends an OTP to a given phone number using Twilio.
 * @param phoneNumber - The recipient's phone number (should be in E.164 format, e.g., +1234567890).
 * @param otp - The OTP string to send.
 * @returns An object indicating success or failure, with an error message if applicable.
 */
export const sendOtp = async (
  phoneNumber: string,
  otp: string
): Promise<{ success: boolean; error?: string; messageId?: string }> => {
  if (!twilioClient) {
    console.error('Twilio client not initialized. Cannot send OTP. Check environment variables.');
    return { success: false, error: 'Twilio client not initialized. SMS functionality is disabled.' };
  }

  if (!twilioPhoneNumber) {
    console.error('Twilio phone number (TWILIO_PHONE_NUMBER) not configured. Cannot send OTP.');
    return { success: false, error: 'Twilio sender phone number not configured.' };
  }
  
  // Basic validation for phone number format (very simple, E.164 is complex)
  // For robustness, consider a library like 'google-libphonenumber' for validation and formatting.
  if (!/^\+[1-9]\d{1,14}$/.test(phoneNumber)) {
    console.warn(`Attempting to send OTP to a phone number not strictly in E.164 format: ${phoneNumber}. Twilio might reject it.`);
    // Depending on requirements, you might want to return an error here:
    // return { success: false, error: 'Invalid phone number format. E.164 format required (e.g., +1234567890).' };
  }


  const messageBody = `Your OTP for RupeekX Clone is: ${otp}`;

  try {
    const message = await twilioClient.messages.create({
      to: phoneNumber, // Twilio expects E.164 format for international numbers.
      from: twilioPhoneNumber,
      body: messageBody,
    });
    console.log(`OTP SMS sent successfully to ${phoneNumber}. Message SID: ${message.sid}`);
    return { success: true, messageId: message.sid };
  } catch (error: any) {
    console.error(`Failed to send OTP SMS to ${phoneNumber}:`, error);
    // Log more specific error details if available
    let errorMessage = 'Failed to send OTP.';
    if (error.message) {
        errorMessage += ` Details: ${error.message}`;
    }
    if (error.code) { // Twilio error codes can be helpful
        errorMessage += ` (Code: ${error.code})`;
    }
    return { success: false, error: errorMessage };
  }
};
