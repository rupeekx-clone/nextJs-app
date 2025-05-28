import mongoose, { Schema, Document, Model } from 'mongoose';
import bcrypt from 'bcryptjs';

// Interface for User document
export interface IUser extends Document {
  full_name: string;
  phone_number: string;
  password?: string; // Optional because it will be removed in toJSON
  user_type: 'customer' | 'cash_lending_customer' | 'admin';
  address_line1?: string;
  address_line2?: string;
  city?: string;
  pincode?: string;
  
  // OTP and Verification fields
  phone_otp?: string;
  phone_otp_expires_at?: Date;
  is_phone_verified: boolean;
  
  // User status
  status: 'pending_verification' | 'active' | 'suspended';

  comparePassword(candidatePassword: string): Promise<boolean>;

  createdAt?: Date;
  updatedAt?: Date;
}

const userSchema: Schema<IUser> = new Schema(
  {
    full_name: {
      type: String,
      required: [true, 'Full name is required.'],
      trim: true,
    },
    phone_number: {
      type: String,
      required: [true, 'Phone number is required.'],
      unique: true,
      trim: true,
      // Example regex for Indian phone numbers (adjust as needed)
      // match: [/^[6-9]\d{9}$/, 'Please fill a valid Indian phone number']
    },
    password: {
      type: String,
      required: [true, 'Password is required.'],
      select: false, // Do not return password by default
    },
    user_type: {
      type: String,
      enum: ['customer', 'cash_lending_customer', 'admin'],
      default: 'customer',
    },
    address_line1: {
      type: String,
      trim: true,
    },
    address_line2: {
      type: String,
      trim: true,
    },
    city: {
      type: String,
      trim: true,
    },
    pincode: {
      type: String,
      trim: true,
    },
    phone_otp: {
      type: String,
      required: false,
      select: false,
    },
    phone_otp_expires_at: {
      type: Date,
      required: false,
      select: false,
    },
    is_phone_verified: {
      type: Boolean,
      default: false,
      required: true,
    },
    status: {
      type: String,
      enum: ['pending_verification', 'active', 'suspended'],
      default: 'pending_verification',
      required: true,
      index: true, // Add index to status field
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt automatically
    toJSON: {
      virtuals: true,
      transform(doc, ret) {
        delete ret.password; // Do not send password hash to client
        delete ret.phone_otp; // Do not send OTP to client
        delete ret.phone_otp_expires_at; // Do not send OTP expiry to client
        delete ret.__v;
        return ret;
      },
    },
    toObject: {
      virtuals: true,
      transform(doc, ret) {
        delete ret.password;
        delete ret.phone_otp;
        delete ret.phone_otp_expires_at;
        delete ret.__v;
        return ret;
      },
    },
  }
);

// Pre-save hook to hash password
userSchema.pre<IUser>('save', async function (next) {
  if (!this.isModified('password') || !this.password) {
    return next();
  }
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error: any) {
    next(error);
  }
});

// Method to compare candidate password with the stored hashed password
userSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  if (!this.password) {
    return false;
  }
  return bcrypt.compare(candidatePassword, this.password);
};

const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', userSchema);

export default User;
