import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ICashLendingSubscriptionPlan extends Document {
  name: string;
  description?: string;
  price: number;
  duration_days: number;
  features?: Record<string, unknown>;
  is_active: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const cashLendingSubscriptionPlanSchema: Schema<ICashLendingSubscriptionPlan> = new Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    description: { type: String },
    price: { type: Number, required: true, min: 0 },
    duration_days: { type: Number, required: true, min: 1 },
    features: { type: Schema.Types.Mixed },
    is_active: { type: Boolean, default: true, required: true },
  },
  {
    timestamps: true,
  }
);

const CashLendingSubscriptionPlan: Model<ICashLendingSubscriptionPlan> = mongoose.models.CashLendingSubscriptionPlan || mongoose.model<ICashLendingSubscriptionPlan>('CashLendingSubscriptionPlan', cashLendingSubscriptionPlanSchema);

export default CashLendingSubscriptionPlan; 