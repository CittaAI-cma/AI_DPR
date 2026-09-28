import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types';
import { User } from '../models/User.model';
import { AuditService } from '../services/audit.service';
import { AI_CONSENT_CODE, AI_REFUSED_MESSAGE } from '../lib/privacyNotice';

export async function requireAiConsent(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ success: false, message: 'Authentication required' });
      return;
    }

    const user = await User.findById(userId).select('privacy role');
    if (!user) {
      res.status(401).json({ success: false, message: 'User not found' });
      return;
    }

    if (!user.privacy?.aiAssist) {
      res.status(403).json({
        success: false,
        code: AI_CONSENT_CODE,
        message: AI_REFUSED_MESSAGE,
      });
      return;
    }

    await AuditService.log({
      action: 'ai_call',
      userId,
      role: user.role,
      targetType: 'route',
      targetId: req.originalUrl || req.path,
      req,
    });

    next();
  } catch (error: any) {
    console.error('AI consent check failed:', error.message);
    res.status(500).json({ success: false, message: 'Failed to verify AI consent' });
  }
}
