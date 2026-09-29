import mongoose, { Schema } from 'mongoose';

const userNotificationSchema = new Schema(
  {
    userId: { type: String, required: true, index: true },
    kind: { type: String, required: true, index: true },
    title: { type: String, required: true },
    body: { type: String, required: true },
    targetType: { type: String },
    targetId: { type: String },
    channels: {
      inApp: { type: Boolean, default: true },
      sms: { type: Boolean, default: false },
      email: { type: Boolean, default: false },
    },
    smsStatus: {
      type: String,
      enum: ['mocked', 'sent', 'skipped', 'failed'],
    },
    emailStatus: {
      type: String,
      enum: ['mocked', 'sent', 'skipped', 'failed'],
    },
    readAt: { type: Date },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

userNotificationSchema.index({ userId: 1, createdAt: -1 });
userNotificationSchema.index({ userId: 1, readAt: 1 });

export const UserNotification = mongoose.model(
  'UserNotification',
  userNotificationSchema
);
