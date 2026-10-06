// @ts-nocheck
import mongoose, { Schema } from 'mongoose';

const schemeDocumentStyleSchema = new Schema(
  {
    schemeCode: { type: String, required: true, unique: true, uppercase: true, trim: true },
    documentStyle: { type: Schema.Types.Mixed, required: true },
  },
  { timestamps: true }
);

export const SchemeDocumentStyle = mongoose.model('SchemeDocumentStyle', schemeDocumentStyleSchema);
