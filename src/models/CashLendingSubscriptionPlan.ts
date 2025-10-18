import mongoose, { Schema, Document } from 'mongoose';

export interface ICashLendingSubscriptionPlan extends Document {
  plan_id: string;
  name: string;
  description?: string;
  price: number;
  duration_days: number;
  features?: Record<string, unknown>;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

const cashLendingSubscriptionPlanSchema: Schema<ICashLendingSubscriptionPlan> = new Schema({
  plan_id: {
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
  duration_days: {
    type: Number,
    required: true,
    min: 1
  },
  features: {
    type: Schema.Types.Mixed,
    default: {}
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

// Index for active plans
cashLendingSubscriptionPlanSchema.index({ is_active: 1 });

// Instance methods
cashLendingSubscriptionPlanSchema.methods.getDurationInMonths = function(): number {
  return Math.round(this.duration_days / 30);
};

cashLendingSubscriptionPlanSchema.methods.getDailyPrice = function(): number {
  return this.price / this.duration_days;
};

export default mongoose.models.CashLendingSubscriptionPlan || mongoose.model<ICashLendingSubscriptionPlan>('CashLendingSubscriptionPlan', cashLendingSubscriptionPlanSchema);