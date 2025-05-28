import mongoose, { Schema, Document, Model, Types } from 'mongoose';

export interface IStaticContent extends Document {
  slug: string;
  title: string;
  content_body: string;
  meta_description?: string;
  last_updated_by?: Types.ObjectId;
  is_published: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const staticContentSchema: Schema<IStaticContent> = new Schema(
  {
    slug: { type: String, required: true, unique: true, trim: true },
    title: { type: String, required: true },
    content_body: { type: String, required: true },
    meta_description: { type: String },
    last_updated_by: { type: Schema.Types.ObjectId, ref: 'User' },
    is_published: { type: Boolean, default: true, required: true },
  },
  {
    timestamps: true,
  }
);

const StaticContent: Model<IStaticContent> = mongoose.models.StaticContent || mongoose.model<IStaticContent>('StaticContent', staticContentSchema);

export default StaticContent; 