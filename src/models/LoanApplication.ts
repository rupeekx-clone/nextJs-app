import mongoose, { Schema, Document, Model, Types } from 'mongoose';

export interface ILoanApplication extends Document {
  user_id: Types.ObjectId;
  loan_type: 'personal' | 'business';
  amount_requested: number;
  amount_approved?: number;
  interest_rate_proposed?: number;
  interest_rate_final?: number;
  tenure_months_requested: number;
  tenure_months_final?: number;
  status: 'draft' | 'submitted' | 'under_review' | 'requires_documents' | 'approved' | 'rejected' | 'disbursed' | 'closed' | 'cancelled';
  bank_partner_id?: Types.ObjectId;
  application_date: Date;
  documents_submitted?: Record<string, string>;
  admin_remarks?: string;
  approved_at?: Date;
  disbursed_at?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

const loanApplicationSchema: Schema<ILoanApplication> = new Schema(
  {
    user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    loan_type: { type: String, enum: ['personal', 'business'], required: true },
    amount_requested: { type: Number, required: true, min: 0 },
    amount_approved: { type: Number, min: 0 },
    interest_rate_proposed: { type: Number, min: 0 },
    interest_rate_final: { type: Number, min: 0 },
    tenure_months_requested: { type: Number, required: true, min: 1 },
    tenure_months_final: { type: Number, min: 1 },
    status: {
      type: String,
      enum: [
        'draft',
        'submitted',
        'under_review',
        'requires_documents',
        'approved',
        'rejected',
        'disbursed',
        'closed',
        'cancelled',
      ],
      default: 'draft',
      required: true,
      index: true,
    },
    bank_partner_id: { type: Schema.Types.ObjectId, ref: 'BankPartner' },
    application_date: { type: Date, default: Date.now, required: true },
    documents_submitted: { type: Schema.Types.Mixed },
    admin_remarks: { type: String },
    approved_at: { type: Date },
    disbursed_at: { type: Date },
  },
  {
    timestamps: true,
  }
);

const LoanApplication: Model<ILoanApplication> = mongoose.models.LoanApplication || mongoose.model<ILoanApplication>('LoanApplication', loanApplicationSchema);

export default LoanApplication; 