import mongoose, { Schema } from 'mongoose';

const kycFileSchema = new Schema(
  {
    userId: { type: String, required: true, index: true },
    projectId: { type: String, index: true },
    originalName: { type: String, required: true, trim: true },
    mimeType: { type: String, required: true },
    storagePath: { type: String, required: true },
    encrypted: { type: Boolean, default: false },
    size: { type: Number, default: 0 },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

kycFileSchema.index({ userId: 1, createdAt: -1 });

export const KycFile = mongoose.model('KycFile', kycFileSchema);
