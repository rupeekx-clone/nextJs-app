import mongoose, { Schema, Document } from 'mongoose';

export interface IMembershipCard extends Document {
  membership_card_id: string;
  user_id: string;
  card_type_id: string;
  purchase_date: Date;
  expiry_date: Date;
  payment_id?: string;
  status: 'active' | 'expired' | 'cancelled';
  benefits_availed?: Record<string, any>;
  created_at: Date;
  updated_at: Date;
}

const membershipCardSchema: Schema<IMembershipCard> = new Schema({
  membership_card_id: {
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
  card_type_id: {
    type: String,
    required: true,
    ref: 'MembershipCardType'
  },
  purchase_date: {
    type: Date,
    default: Date.now
  },
  expiry_date: {
    type: Date,
    required: true
  },
  payment_id: {
    type: String
  },
  status: {
    type: String,
    required: true,
    enum: ['active', 'expired', 'cancelled'],
    default: 'active'
  },
  benefits_availed: {
    type: Schema.Types.Mixed,
    default: {}
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
membershipCardSchema.index({ user_id: 1 });
membershipCardSchema.index({ status: 1 });
membershipCardSchema.index({ expiry_date: 1 });

// Pre-save hook to set expiry date
membershipCardSchema.pre('save', async function(next) {
  if (this.isNew && !this.expiry_date) {
    const cardType = await mongoose.model('MembershipCardType').findById(this.card_type_id);
    if (cardType) {
      const expiryDate = new Date(this.purchase_date);
      expiryDate.setMonth(expiryDate.getMonth() + cardType.validity_months);
      this.expiry_date = expiryDate;
    }
  }
  next();
});

// Instance methods
membershipCardSchema.methods.isExpired = function(): boolean {
  return new Date() > this.expiry_date || this.status === 'expired';
};

membershipCardSchema.methods.isActive = function(): boolean {
  return this.status === 'active' && !this.isExpired();
};

membershipCardSchema.methods.daysUntilExpiry = function(): number {
  const now = new Date();
  const diffTime = this.expiry_date.getTime() - now.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

membershipCardSchema.methods.canApplyForLoan = function(loanType: 'personal' | 'business'): boolean {
  if (!this.isActive()) return false;
  
  // This would need to be populated with card type details
  // For now, return true if active
  return true;
};

export default mongoose.models.MembershipCard || mongoose.model<IMembershipCard>('MembershipCard', membershipCardSchema);