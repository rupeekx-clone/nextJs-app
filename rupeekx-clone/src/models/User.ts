import mongoose, { Schema, Document, Model } from 'mongoose';
import bcrypt from 'bcryptjs';

// Interface for User document
export interface IUser extends Document {
  full_name: string;
  email: string;
  phone_number: string;
  password?: string; // Optional because it will be removed in toJSON
  user_type: 'customer' | 'cash_lending_customer' | 'admin';
  address_line1?: string;
  address_line2?: string;
  city?: string;
  pincode?: string;
  email_verified_at?: Date;
  phone_verified_at?: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

// Interface for User model statics (if any needed in future)
// interface IUserModel extends Model<IUser> {
//   // findBySomething(param: string): Promise<IUser | null>;
// }

const userSchema: Schema<IUser> = new Schema(
  {
    full_name: {
      type: String,
      required: [true, 'Full name is required.'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required.'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Please fill a valid email address',
      ],
    },
    phone_number: {
      type: String,
      required: [true, 'Phone number is required.'],
      unique: true,
      trim: true,
      // Add a regex for Indian phone numbers if necessary, e.g.,
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
      // Add pincode validation if necessary
    },
    email_verified_at: {
      type: Date,
    },
    phone_verified_at: {
      type: Date,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt automatically
    toJSON: {
      virtuals: true,
      transform(doc, ret) {
        delete ret.password; // Do not send password hash to client
        delete ret.__v;
        return ret;
      },
    },
    toObject: {
      virtuals: true,
      transform(doc, ret) {
        delete ret.password;
        delete ret.__v;
        return ret;
      },
    },
  }
);

// Pre-save hook to hash password
userSchema.pre<IUser>('save', async function (next) {
  // Only hash the password if it has been modified (or is new)
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

// Export the model, handling Next.js hot-reloading
// The IUserModel type can be used here if statics were defined
const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', userSchema);

export default User;
```
