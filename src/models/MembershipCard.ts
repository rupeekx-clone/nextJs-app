import mongoose, { Schema, Document, Model, Types } from 'mongoose';

export interface IMembershipCard extends Document {
  user_id: Types.ObjectId;
  card_type_id: Types.ObjectId;
  purchase_date: Date;
  expiry_date: Date;
  payment_id?: string;
  status: 'active' | 'expired' | 'cancelled';
  benefits_availed?: Record<string, any>;
  createdAt?: Date;
  updatedAt?: Date;
}

const membershipCardSchema: Schema<IMembershipCard> = new Schema(
  {
    user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true, index: true },
    card_type_id: { type: Schema.Types.ObjectId, ref: 'MembershipCardType', required: true },
    purchase_date: { type: Date, default: Date.now, required: true },
    expiry_date: { type: Date, required: true },
    payment_id: { type: String },
    status: { type: String, enum: ['active', 'expired', 'cancelled'], default: 'active', required: true },
    benefits_availed: { type: Schema.Types.Mixed },
  },
  {
    timestamps: true,
  }
);

const MembershipCard: Model<IMembershipCard> = mongoose.models.MembershipCard || mongoose.model<IMembershipCard>('MembershipCard', membershipCardSchema);

export default MembershipCard; 