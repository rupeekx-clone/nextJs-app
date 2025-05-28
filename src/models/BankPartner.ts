import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IBankPartner extends Document {
  name: string;
  logo_url?: string;
  contact_person_name?: string;
  contact_person_email?: string;
  contact_person_phone?: string;
  is_active: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const bankPartnerSchema: Schema<IBankPartner> = new Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    logo_url: { type: String },
    contact_person_name: { type: String },
    contact_person_email: { type: String },
    contact_person_phone: { type: String },
    is_active: { type: Boolean, default: true, required: true },
  },
  {
    timestamps: true,
  }
);

const BankPartner: Model<IBankPartner> = mongoose.models.BankPartner || mongoose.model<IBankPartner>('BankPartner', bankPartnerSchema);

export default BankPartner; 