import mongoose, { Schema, Document, Model, Types } from 'mongoose';

export interface IEnquiry extends Document {
  name: string;
  email: string;
  phone_number: string;
  subject?: string;
  message: string;
  status: 'new' | 'in_progress' | 'resolved' | 'closed';
  assigned_to_user_id?: Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}

const enquirySchema: Schema<IEnquiry> = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone_number: { type: String, required: true },
    subject: { type: String },
    message: { type: String, required: true },
    status: { type: String, enum: ['new', 'in_progress', 'resolved', 'closed'], default: 'new', required: true, index: true },
    assigned_to_user_id: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  {
    timestamps: true,
  }
);

enquirySchema.index({ status: 1 });
enquirySchema.index({ assigned_to_user_id: 1 });

const Enquiry: Model<IEnquiry> = mongoose.models.Enquiry || mongoose.model<IEnquiry>('Enquiry', enquirySchema);

export default Enquiry; 