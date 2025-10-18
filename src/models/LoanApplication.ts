import mongoose, { Schema, Document } from 'mongoose';

export interface ILoanApplication extends Document {
  application_id: string;
  user_id: string;
  loan_type: 'personal' | 'business';
  amount_requested: number;
  amount_approved?: number;
  interest_rate_proposed?: number;
  interest_rate_final?: number;
  tenure_months_requested: number;
  tenure_months_final?: number;
  status: 'draft' | 'submitted' | 'under_review' | 'requires_documents' | 'approved' | 'rejected' | 'disbursed' | 'closed' | 'cancelled';
  bank_partner_id?: string;
  application_date: Date;
  documents_submitted?: Record<string, string>;
  admin_remarks?: string;
  approved_at?: Date;
  disbursed_at?: Date;
  created_at: Date;
  updated_at: Date;
}

const loanApplicationSchema: Schema<ILoanApplication> = new Schema({
  application_id: {
    type: String,
    required: true,
    unique: true,
    default: () => new mongoose.Types.ObjectId().toString()
  },
  user_id: {
    type: String,
    required: true,
    ref: 'User'
  },
  loan_type: {
    type: String,
    required: true,
    enum: ['personal', 'business']
  },
  amount_requested: {
    type: Number,
    required: true,
    min: 0
  },
  amount_approved: {
    type: Number,
    min: 0
  },
  interest_rate_proposed: {
    type: Number,
    min: 0,
    max: 100
  },
  interest_rate_final: {
    type: Number,
    min: 0,
    max: 100
  },
  tenure_months_requested: {
    type: Number,
    required: true,
    min: 1
  },
  tenure_months_final: {
    type: Number,
    min: 1
  },
  status: {
    type: String,
    required: true,
    enum: ['draft', 'submitted', 'under_review', 'requires_documents', 'approved', 'rejected', 'disbursed', 'closed', 'cancelled'],
    default: 'draft'
  },
  bank_partner_id: {
    type: String,
    ref: 'BankPartner'
  },
  application_date: {
    type: Date,
    default: Date.now
  },
  documents_submitted: {
    type: Schema.Types.Mixed,
    default: {}
  },
  admin_remarks: {
    type: String
  },
  approved_at: {
    type: Date
  },
  disbursed_at: {
    type: Date
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
loanApplicationSchema.index({ user_id: 1 });
loanApplicationSchema.index({ status: 1 });
loanApplicationSchema.index({ loan_type: 1 });
loanApplicationSchema.index({ application_date: -1 });

// Instance methods
loanApplicationSchema.methods.canBeUpdated = function(): boolean {
  return ['draft', 'submitted'].includes(this.status);
};

loanApplicationSchema.methods.isApproved = function(): boolean {
  return this.status === 'approved' || this.status === 'disbursed';
};

loanApplicationSchema.methods.requiresDocuments = function(): boolean {
  return this.status === 'requires_documents';
};

export default mongoose.models.LoanApplication || mongoose.model<ILoanApplication>('LoanApplication', loanApplicationSchema);