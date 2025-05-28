import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IMembershipCardType extends Document {
  name: string;
  description?: string;
  price: number;
  validity_months: number;
  benefits_description: string;
  loan_type_association?: 'personal' | 'business' | 'any';
  max_loan_amount_benefit?: number;
  processing_time_benefit?: string;
  is_active: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const membershipCardTypeSchema: Schema<IMembershipCardType> = new Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    description: { type: String },
    price: { type: Number, required: true, min: 0 },
    validity_months: { type: Number, required: true, min: 1 },
    benefits_description: { type: String, required: true },
    loan_type_association: { type: String, enum: ['personal', 'business', 'any'] },
    max_loan_amount_benefit: { type: Number, min: 0 },
    processing_time_benefit: { type: String },
    is_active: { type: Boolean, default: true, required: true },
  },
  {
    timestamps: true,
  }
);

const MembershipCardType: Model<IMembershipCardType> = mongoose.models.MembershipCardType || mongoose.model<IMembershipCardType>('MembershipCardType', membershipCardTypeSchema);

export default MembershipCardType; 