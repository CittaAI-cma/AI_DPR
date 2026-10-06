// @ts-nocheck
import { Response } from 'express';
import { AuthRequest } from '../types';
import { SchemeDocumentStyle } from '../models/SchemeDocumentStyle.model';
import { canSaveSchemeDefault, cleanDocumentStyle, SCHEME_CODE } from '../lib/schemeStyleRules';

export class SchemeStyleController {
  static async get(req: AuthRequest, res: Response): Promise<void> {
    try {
      const schemeCode = String(req.params.schemeCode || '').toUpperCase();
      if (!SCHEME_CODE.test(schemeCode)) {
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
      if (!canSaveSchemeDefault(role)) {
        res.status(403).json({ success: false, message: 'Only a super admin can save the scheme default' });
        return;
      }
      const schemeCode = String(req.params.schemeCode || '').toUpperCase();
      if (!SCHEME_CODE.test(schemeCode)) {
        res.status(400).json({ success: false, message: 'Unknown scheme' });
        return;
      }
      const documentStyle = cleanDocumentStyle(req.body?.documentStyle);
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
