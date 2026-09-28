import { Request } from 'express';
import { AuditEvent } from '../models/AuditEvent.model';

export type AuditAction =
  | 'register'
  | 'login_success'
  | 'login_failed'
  | 'logout'
  | 'consent_given'
  | 'consent_withdrawn'
  | 'notice_accepted'
  | 'ai_call';

function clientIp(req?: Request): string | undefined {
  if (!req) return undefined;
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string' && forwarded.trim()) {
    return forwarded.split(',')[0].trim();
  }
  return req.ip;
}

export const AuditService = {
  async log(input: {
    action: AuditAction | string;
    userId?: string;
    role?: string;
    targetType?: string;
    targetId?: string;
    req?: Request;
  }): Promise<void> {
    try {
      await AuditEvent.create({
        at: new Date(),
        userId: input.userId || undefined,
        role: input.role,
        action: input.action,
        targetType: input.targetType,
        targetId: input.targetId,
        ip: clientIp(input.req),
      });
    } catch (error) {
      console.error('Audit log failed:', (error as Error).message);
    }
  },
};
