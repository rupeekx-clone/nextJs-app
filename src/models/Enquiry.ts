import mongoose, { Schema, Document } from 'mongoose';

export interface IEnquiry extends Document {
  enquiry_id: string;
  name: string;
  email: string;
  phone_number: string;
  subject?: string;
  message: string;
  status: 'new' | 'in_progress' | 'resolved' | 'closed';
  assigned_to_user_id?: string;
  created_at: Date;
  updated_at: Date;
}

const enquirySchema: Schema<IEnquiry> = new Schema({
  enquiry_id: {
    type: String,
    required: true,
    unique: true,
    default: () => new mongoose.Types.ObjectId().toString()
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
    validate: {
      validator: function(v: string) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
      },
      message: 'Email must be a valid email address'
    }
  },
  phone_number: {
    type: String,
    required: true,
    trim: true
  },
  subject: {
    type: String,
    trim: true
  },
  message: {
    type: String,
    required: true,
    trim: true
  },
  status: {
    type: String,
    required: true,
    enum: ['new', 'in_progress', 'resolved', 'closed'],
    default: 'new'
  },
  assigned_to_user_id: {
    type: String,
    ref: 'User'
  }
}, {
  timestamps: true,
  toJSON: {
    transform(doc, ret) {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
      return ret;
    }
  }
});

// Indexes for performance
enquirySchema.index({ status: 1 });
enquirySchema.index({ assigned_to_user_id: 1 });
enquirySchema.index({ created_at: -1 });
enquirySchema.index({ email: 1 });

// Instance methods
enquirySchema.methods.isNew = function(): boolean {
  return this.status === 'new';
};

enquirySchema.methods.isInProgress = function(): boolean {
  return this.status === 'in_progress';
};

enquirySchema.methods.isResolved = function(): boolean {
  return this.status === 'resolved' || this.status === 'closed';
};

enquirySchema.methods.canBeAssigned = function(): boolean {
  return this.status === 'new' || this.status === 'in_progress';
};

enquirySchema.methods.assignTo = function(userId: string): void {
  if (this.canBeAssigned()) {
    this.assigned_to_user_id = userId;
    if (this.status === 'new') {
      this.status = 'in_progress';
    }
  }
};

export default mongoose.models.Enquiry || mongoose.model<IEnquiry>('Enquiry', enquirySchema);