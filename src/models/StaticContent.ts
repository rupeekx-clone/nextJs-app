import mongoose, { Schema, Document } from 'mongoose';

export interface IStaticContent extends Document {
  content_id: string;
  slug: string;
  title: string;
  content_body: string;
  meta_description?: string;
  last_updated_by?: string;
  is_published: boolean;
  created_at: Date;
  updated_at: Date;
}

const staticContentSchema: Schema<IStaticContent> = new Schema({
  content_id: {
    type: String,
    required: true,
    unique: true,
    default: () => new mongoose.Types.ObjectId().toString()
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    validate: {
      validator: function(v: string) {
        return /^[a-z0-9-]+$/.test(v);
      },
      message: 'Slug must contain only lowercase letters, numbers, and hyphens'
    }
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  content_body: {
    type: String,
    required: true
  },
  meta_description: {
    type: String,
    maxlength: 500,
    trim: true
  },
  last_updated_by: {
    type: String,
    ref: 'User'
  },
  is_published: {
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

// Indexes
// slug index is automatically created by unique: true
staticContentSchema.index({ is_published: 1 });
staticContentSchema.index({ last_updated_by: 1 });

// Pre-save hook to update last_updated_by
staticContentSchema.pre('save', function(next) {
  if (this.isModified() && !this.isNew) {
    // This would be set by the API route when updating
    // this.last_updated_by = req.user.userId;
  }
  next();
});

// Instance methods
staticContentSchema.methods.isPublished = function(): boolean {
  return this.is_published;
};

staticContentSchema.methods.getExcerpt = function(maxLength: number = 200): string {
  if (this.content_body.length <= maxLength) {
    return this.content_body;
  }
  return this.content_body.substring(0, maxLength) + '...';
};

staticContentSchema.methods.getWordCount = function(): number {
  return this.content_body.split(/\s+/).length;
};

// Static methods
staticContentSchema.statics.findBySlug = function(slug: string) {
  return this.findOne({ slug, is_published: true });
};

staticContentSchema.statics.findPublished = function() {
  return this.find({ is_published: true }).sort({ updated_at: -1 });
};

export default mongoose.models.StaticContent || mongoose.model<IStaticContent>('StaticContent', staticContentSchema);