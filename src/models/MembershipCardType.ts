import mongoose, { Schema, Document } from 'mongoose';

export interface IMembershipCardType extends Document {
  card_type_id: string;
  name: string;
  description?: string;
  price: number;
  validity_months: number;
  benefits_description: string;
  loan_type_association?: 'personal' | 'business' | 'any';
  max_loan_amount_benefit?: number;
  processing_time_benefit?: string;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

const membershipCardTypeSchema: Schema<IMembershipCardType> = new Schema({
  card_type_id: {
    type: String,
    required: true,
    unique: true,
    default: () => new mongoose.Types.ObjectId().toString()
  },
  name: {
    type: String,
    required: true,
    unique: true
  },
  description: {
    type: String
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  validity_months: {
    type: Number,
    required: true,
    min: 1
  },
  benefits_description: {
    type: String,
    required: true
  },
  loan_type_association: {
    type: String,
    enum: ['personal', 'business', 'any']
  },
  max_loan_amount_benefit: {
    type: Number,
    min: 0
  },
  processing_time_benefit: {
    type: String
  },
  is_active: {
    type: Boolean,
    default: true
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

// Index for active card types
membershipCardTypeSchema.index({ is_active: 1 });

// Instance methods
membershipCardTypeSchema.methods.isForPersonalLoans = function(): boolean {
  return this.loan_type_association === 'personal' || this.loan_type_association === 'any';
};

membershipCardTypeSchema.methods.isForBusinessLoans = function(): boolean {
  return this.loan_type_association === 'business' || this.loan_type_association === 'any';
};

export default mongoose.models.MembershipCardType || mongoose.model<IMembershipCardType>('MembershipCardType', membershipCardTypeSchema);