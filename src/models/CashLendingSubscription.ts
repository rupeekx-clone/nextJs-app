import mongoose, { Schema, Document } from 'mongoose';

export interface ICashLendingSubscription extends Document {
  subscription_id: string;
  user_id: string;
  subscription_plan_id: string;
  start_date: Date;
  end_date: Date;
  payment_id?: string;
  status: 'active' | 'expired' | 'cancelled' | 'grace_period';
  created_at: Date;
  updated_at: Date;
}

const cashLendingSubscriptionSchema: Schema<ICashLendingSubscription> = new Schema({
  subscription_id: {
    type: String,
    required: true,
    unique: true,
    default: () => new mongoose.Types.ObjectId().toString()
  },
  user_id: {
    type: String,
    required: true,
    unique: true,
    ref: 'User'
  },
  subscription_plan_id: {
    type: String,
    required: true,
    ref: 'CashLendingSubscriptionPlan'
  },
  start_date: {
    type: Date,
    default: Date.now
  },
  end_date: {
    type: Date,
    required: true
  },
  payment_id: {
    type: String
  },
  status: {
    type: String,
    required: true,
    enum: ['active', 'expired', 'cancelled', 'grace_period'],
    default: 'active'
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

// Indexes
// user_id index is automatically created by unique: true
cashLendingSubscriptionSchema.index({ status: 1 });
cashLendingSubscriptionSchema.index({ end_date: 1 });

// Pre-save hook to set end date
cashLendingSubscriptionSchema.pre('save', async function(next) {
  if (this.isNew && !this.end_date) {
    const plan = await mongoose.model('CashLendingSubscriptionPlan').findById(this.subscription_plan_id);
    if (plan) {
      const endDate = new Date(this.start_date);
      endDate.setDate(endDate.getDate() + plan.duration_days);
      this.end_date = endDate;
    }
  }
  next();
});

// Instance methods
cashLendingSubscriptionSchema.methods.isExpired = function(): boolean {
  return new Date() > this.end_date || this.status === 'expired';
};

cashLendingSubscriptionSchema.methods.isActive = function(): boolean {
  return this.status === 'active' && !this.isExpired();
};

cashLendingSubscriptionSchema.methods.daysUntilExpiry = function(): number {
  const now = new Date();
  const diffTime = this.end_date.getTime() - now.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

cashLendingSubscriptionSchema.methods.getRemainingDays = function(): number {
  if (this.isExpired()) return 0;
  return this.daysUntilExpiry();
};

export default mongoose.models.CashLendingSubscription || mongoose.model<ICashLendingSubscription>('CashLendingSubscription', cashLendingSubscriptionSchema);