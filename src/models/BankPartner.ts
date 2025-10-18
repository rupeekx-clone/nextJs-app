import mongoose, { Schema, Document } from 'mongoose';

export interface IBankPartner extends Document {
  bank_partner_id: string;
  name: string;
  logo_url?: string;
  contact_person_name?: string;
  contact_person_email?: string;
  contact_person_phone?: string;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

const bankPartnerSchema: Schema<IBankPartner> = new Schema({
  bank_partner_id: {
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
  logo_url: {
    type: String,
    validate: {
      validator: function(v: string) {
        if (!v) return true; // Allow empty
        return /^https?:\/\/.+/.test(v);
      },
      message: 'Logo URL must be a valid HTTP/HTTPS URL'
    }
  },
  contact_person_name: {
    type: String
  },
  contact_person_email: {
    type: String,
    validate: {
      validator: function(v: string) {
        if (!v) return true; // Allow empty
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
      },
      message: 'Contact email must be a valid email address'
    }
  },
  contact_person_phone: {
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

// Index for active bank partners
bankPartnerSchema.index({ is_active: 1 });

// Instance methods
bankPartnerSchema.methods.hasContactInfo = function(): boolean {
  return !!(this.contact_person_name || this.contact_person_email || this.contact_person_phone);
};

bankPartnerSchema.methods.getDisplayName = function(): string {
  return this.name;
};

export default mongoose.models.BankPartner || mongoose.model<IBankPartner>('BankPartner', bankPartnerSchema);