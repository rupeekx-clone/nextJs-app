import mongoose, { Schema, Document, Model, Types } from 'mongoose';

export interface ICashLendingSubscription extends Document {
  user_id: Types.ObjectId;
  subscription_plan_id: Types.ObjectId;
  start_date: Date;
  end_date: Date;
  payment_id?: string;
  status: 'active' | 'expired' | 'cancelled' | 'grace_period';
  createdAt?: Date;
  updatedAt?: Date;
}

const cashLendingSubscriptionSchema: Schema<ICashLendingSubscription> = new Schema(
  {
    user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true, index: true },
    subscription_plan_id: { type: Schema.Types.ObjectId, ref: 'CashLendingSubscriptionPlan', required: true },
    start_date: { type: Date, default: Date.now, required: true },
    end_date: { type: Date, required: true },
    payment_id: { type: String },
    status: { type: String, enum: ['active', 'expired', 'cancelled', 'grace_period'], default: 'active', required: true },
  },
  {
    timestamps: true,
  }
);

const CashLendingSubscription: Model<ICashLendingSubscription> = mongoose.models.CashLendingSubscription || mongoose.model<ICashLendingSubscription>('CashLendingSubscription', cashLendingSubscriptionSchema);

export default CashLendingSubscription; 