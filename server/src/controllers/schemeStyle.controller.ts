// @ts-nocheck
import { Response } from 'express';
import { AuthRequest } from '../types';
import { SchemeDocumentStyle } from '../models/SchemeDocumentStyle.model';

const CODE = /^[A-Z0-9_-]{2,40}$/;

function cleanStyle(input: unknown): Record<string, unknown> | null {
  if (!input || typeof input !== 'object' || Array.isArray(input)) return null;
  let json = '';
  try {
    json = JSON.stringify(input);
  } catch {
    return null;
  }
  if (json.length > 1_500_000) return null;
  return JSON.parse(json);
}

export class SchemeStyleController {
  static async get(req: AuthRequest, res: Response): Promise<void> {
    try {
      const schemeCode = String(req.params.schemeCode || '').toUpperCase();
      if (!CODE.test(schemeCode)) {
        res.status(400).json({ success: false, message: 'Unknown scheme' });
        return;
      }
      const doc = await SchemeDocumentStyle.findOne({ schemeCode }).lean();
      res.json({ success: true, data: { documentStyle: doc?.documentStyle || null } });
    } catch (error) {
      console.error('scheme style read failed', error);
      res.status(500).json({ success: false, message: 'Could not load the scheme style' });
    }
  }

  static async save(req: AuthRequest, res: Response): Promise<void> {
    try {
      const role = req.user?.role;
      if (role !== 'super_admin' && role !== 'admin') {
        res.status(403).json({ success: false, message: 'Only a super admin can save the scheme default' });
        return;
      }
      const schemeCode = String(req.params.schemeCode || '').toUpperCase();
      if (!CODE.test(schemeCode)) {
        res.status(400).json({ success: false, message: 'Unknown scheme' });
        return;
      }
      const documentStyle = cleanStyle(req.body?.documentStyle);
      if (!documentStyle) {
        res.status(400).json({ success: false, message: 'Style is missing or too large' });
        return;
      }
      const doc = await SchemeDocumentStyle.findOneAndUpdate(
        { schemeCode },
        { schemeCode, documentStyle },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      ).lean();
      res.json({ success: true, data: { documentStyle: doc?.documentStyle || documentStyle } });
    } catch (error) {
      console.error('scheme style save failed', error);
      res.status(500).json({ success: false, message: 'Could not save the scheme style' });
    }
  }
}
