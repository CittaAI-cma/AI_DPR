// @ts-nocheck
import { Request, Response } from 'express';
import jwt, { SignOptions } from 'jsonwebtoken';
import { User } from '../models/User.model';
import { AuditService } from '../services/audit.service';
import { getJwtSecret } from '../lib/jwtSecret';
import {
  GUARDIAN_MESSAGE,
  PRIVACY_NOTICE_VERSION,
  UNDER_18_CODE,
} from '../lib/privacyNotice';
import { ageFromDob } from '../lib/under18';

function signToken(user: { _id: unknown; email: string; role: string }) {
  return jwt.sign(
    {
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    },
    getJwtSecret(),
    { expiresIn: '7d' } as SignOptions
  );
}

function publicUser(user: any) {
  const noticeVersion = user.privacy?.noticeVersion || null;
  return {
    userId: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    udyamNumber: user.udyamNumber,
    location: user.location,
    phoneNumber: user.phoneNumber,
    dateOfBirth: user.dateOfBirth,
    privacy: {
      noticeVersion,
      accountConsent: !!user.privacy?.accountConsent,
      aiAssist: !!user.privacy?.aiAssist,
      analytics: !!user.privacy?.analytics,
      needsNoticeAcceptance: noticeVersion !== PRIVACY_NOTICE_VERSION,
      nominee: {
        name: user.privacy?.nominee?.name || '',
        phone: user.privacy?.nominee?.phone || '',
        email: user.privacy?.nominee?.email || '',
      },
    },
  };
}

function applyConsent(user: any, body: any, now: Date) {
  const accountConsent = body.accountConsent === true;
  const aiAssist = body.aiAssist === true;
  const analytics = body.analytics === true;
  const prevAi = !!user.privacy?.aiAssist;

  user.privacy = user.privacy || {};
  user.privacy.accountConsent = accountConsent;
  user.privacy.accountConsentAt = accountConsent ? now : undefined;
  user.privacy.aiAssist = aiAssist;
  user.privacy.aiAssistAt = aiAssist ? now : user.privacy.aiAssistAt;
  user.privacy.analytics = analytics;
  user.privacy.analyticsAt = analytics ? now : user.privacy.analyticsAt;
  user.privacy.noticeVersion = PRIVACY_NOTICE_VERSION;
  user.privacy.noticeAcceptedAt = now;

  return { accountConsent, aiAssist, prevAi };
}

export class AuthController {
  static async register(req: Request, res: Response): Promise<void> {
    try {
      const {
        name,
        email,
        password,
        role,
        udyamNumber,
        location,
        phoneNumber,
        dateOfBirth,
        accountConsent,
        aiAssist,
        analytics,
        noticeVersion,
      } = req.body;

      if (accountConsent !== true) {
        res.status(400).json({
          success: false,
          message: 'You must agree to the privacy notice to create an account.',
        });
        return;
      }

      if (noticeVersion && noticeVersion !== PRIVACY_NOTICE_VERSION) {
        res.status(400).json({
          success: false,
          message: 'Please read the current privacy notice and try again.',
        });
        return;
      }

      const phoneDigits = String(phoneNumber ?? '').replace(/\D/g, '');
      if (!/^\d{10}$/.test(phoneDigits)) {
        res.status(400).json({
          success: false,
          message: 'Phone number must be exactly 10 digits.',
        });
        return;
      }

      const age = ageFromDob(dateOfBirth);
      if (age == null) {
        res.status(400).json({
          success: false,
          message: 'Date of birth is required.',
        });
        return;
      }
      if (age < 18) {
        res.status(403).json({
          success: false,
          code: UNDER_18_CODE,
          message: GUARDIAN_MESSAGE,
        });
        return;
      }

      const existingUser = await User.findOne({ email });
      if (existingUser) {
        res.status(400).json({
          success: false,
          message: 'User already exists with this email',
        });
        return;
      }

      const now = new Date();
      const user = await User.create({
        name,
        email,
        passwordHash: password,
        role: role || 'entrepreneur',
        udyamNumber,
        location,
        phoneNumber: phoneDigits,
        dateOfBirth: new Date(dateOfBirth),
        privacy: {
          noticeVersion: PRIVACY_NOTICE_VERSION,
          noticeAcceptedAt: now,
          accountConsent: true,
          accountConsentAt: now,
          aiAssist: aiAssist === true,
          aiAssistAt: aiAssist === true ? now : undefined,
          analytics: analytics === true,
          analyticsAt: analytics === true ? now : undefined,
        },
      });

      await AuditService.log({
        action: 'register',
        userId: user._id.toString(),
        role: user.role,
        req,
      });
      await AuditService.log({
        action: 'notice_accepted',
        userId: user._id.toString(),
        role: user.role,
        targetId: PRIVACY_NOTICE_VERSION,
        req,
      });
      await AuditService.log({
        action: 'consent_given',
        userId: user._id.toString(),
        role: user.role,
        targetType: 'account',
        req,
      });
      if (aiAssist === true) {
        await AuditService.log({
          action: 'consent_given',
          userId: user._id.toString(),
          role: user.role,
          targetType: 'aiAssist',
          req,
        });
      }

      const token = signToken(user);

      res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: {
          ...publicUser(user),
          token,
        },
      });
    } catch (error: any) {
      console.error('Registration error:', error);
      res.status(500).json({
        success: false,
        message: 'Registration failed',
        error: error.message,
      });
    }
  }

  static async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;

      const user = await User.findOne({ email });
      if (!user) {
        await AuditService.log({ action: 'login_failed', req });
        res.status(401).json({
          success: false,
          message: 'Invalid credentials',
        });
        return;
      }

      const isPasswordValid = await user.comparePassword(password);
      if (!isPasswordValid) {
        await AuditService.log({
          action: 'login_failed',
          userId: user._id.toString(),
          role: user.role,
          req,
        });
        res.status(401).json({
          success: false,
          message: 'Invalid credentials',
        });
        return;
      }

      await AuditService.log({
        action: 'login_success',
        userId: user._id.toString(),
        role: user.role,
        req,
      });

      const token = signToken(user);

      res.status(200).json({
        success: true,
        message: 'Login successful',
        data: {
          ...publicUser(user),
          token,
        },
      });
    } catch (error: any) {
      console.error('Login error:', error);
      res.status(500).json({
        success: false,
        message: 'Login failed',
        error: error.message,
      });
    }
  }

  static async logout(req: Request, res: Response): Promise<void> {
    try {
      const authReq = req as any;
      await AuditService.log({
        action: 'logout',
        userId: authReq.user?.userId,
        role: authReq.user?.role,
        req,
      });
      res.status(200).json({ success: true, message: 'Logged out' });
    } catch (error: any) {
      res.status(200).json({ success: true, message: 'Logged out' });
    }
  }

  static async acceptConsent(req: Request, res: Response): Promise<void> {
    try {
      const authReq = req as any;
      const userId = authReq.user?.userId;
      const user = await User.findById(userId);
      if (!user) {
        res.status(404).json({ success: false, message: 'User not found' });
        return;
      }

      if (req.body.accountConsent !== true) {
        res.status(400).json({
          success: false,
          message: 'You must agree to the privacy notice to use this site.',
        });
        return;
      }

      const now = new Date();
      const { aiAssist, prevAi } = applyConsent(user, req.body, now);
      await user.save();

      await AuditService.log({
        action: 'notice_accepted',
        userId: user._id.toString(),
        role: user.role,
        targetId: PRIVACY_NOTICE_VERSION,
        req,
      });
      await AuditService.log({
        action: 'consent_given',
        userId: user._id.toString(),
        role: user.role,
        targetType: 'account',
        req,
      });
      if (aiAssist && !prevAi) {
        await AuditService.log({
          action: 'consent_given',
          userId: user._id.toString(),
          role: user.role,
          targetType: 'aiAssist',
          req,
        });
      } else if (!aiAssist && prevAi) {
        await AuditService.log({
          action: 'consent_withdrawn',
          userId: user._id.toString(),
          role: user.role,
          targetType: 'aiAssist',
          req,
        });
      }

      res.status(200).json({
        success: true,
        message: 'Consent saved',
        data: publicUser(user),
      });
    } catch (error: any) {
      console.error('Consent error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to save consent',
        error: error.message,
      });
    }
  }

  static async getProfile(req: Request, res: Response): Promise<void> {
    try {
      const authReq = req as any;
      const userId = authReq.user?.userId;

      const user = await User.findById(userId).select('-passwordHash');
      if (!user) {
        res.status(404).json({
          success: false,
          message: 'User not found',
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: publicUser(user),
      });
    } catch (error: any) {
      console.error('Get profile error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch profile',
        error: error.message,
      });
    }
  }

  static async updateProfile(req: Request, res: Response): Promise<void> {
    try {
      const authReq = req as any;
      const userId = authReq.user?.userId;
      const { name, udyamNumber, location, phoneNumber } = req.body;
      const user = await User.findByIdAndUpdate(
        userId,
        {
          ...(name !== undefined ? { name } : {}),
          ...(udyamNumber !== undefined ? { udyamNumber } : {}),
          ...(location !== undefined ? { location } : {}),
          ...(phoneNumber !== undefined ? { phoneNumber } : {}),
        },
        {
          new: true,
          runValidators: true,
        }
      ).select('-passwordHash');

      if (!user) {
        res.status(404).json({
          success: false,
          message: 'User not found',
        });
        return;
      }

      await AuditService.log({
        action: 'profile_change',
        userId,
        role: authReq.user?.role,
        req,
      });

      res.status(200).json({
        success: true,
        message: 'Profile updated successfully',
        data: publicUser(user),
      });
    } catch (error: any) {
      console.error('Update profile error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update profile',
        error: error.message,
      });
    }
  }
}
