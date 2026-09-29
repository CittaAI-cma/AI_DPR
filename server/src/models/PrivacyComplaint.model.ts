import mongoose, { Schema } from 'mongoose';

const privacyComplaintSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    name: { type: String, trim: true },
    subject: { type: String, required: true, trim: true, maxlength: 200 },
    message: { type: String, required: true, trim: true, maxlength: 4000 },
    inbox: { type: String, required: true },
    status: {
      type: String,
      enum: ['open', 'closed'],
      default: 'open',
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

privacyComplaintSchema.index({ createdAt: -1 });

export const PrivacyComplaint = mongoose.model(
  'PrivacyComplaint',
  privacyComplaintSchema
);
