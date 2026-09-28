import mongoose, { Schema } from 'mongoose';

const auditEventSchema = new Schema(
  {
    at: { type: Date, required: true, default: Date.now, index: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', index: true },
    role: { type: String },
    action: { type: String, required: true, index: true },
    targetType: { type: String },
    targetId: { type: String },
    ip: { type: String },
  },
  {
    timestamps: false,
    versionKey: false,
  }
);

auditEventSchema.index({ userId: 1, at: -1 });

export const AuditEvent = mongoose.model('AuditEvent', auditEventSchema);
