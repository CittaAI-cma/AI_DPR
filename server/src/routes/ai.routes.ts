// @ts-nocheck
import { Router } from 'express';
import { body } from 'express-validator';
import { AIController } from '../controllers/ai.controller';
import { authenticate } from '../middleware/auth.middleware';
import { validate } from '../middleware/validation.middleware';

const router = Router();

// All routes require authentication
router.use(authenticate);

// Chat with AI
router.post(
  '/chat',
  validate([
    body('message').trim().notEmpty().withMessage('Message is required'),
  ]),
  AIController.chat
);

// Transcribe audio
router.post(
  '/transcribe',
  AIController.getUploadMiddleware(),
  AIController.transcribe
);

// Text-to-speech
router.post(
  '/tts',
  AIController.textToSpeech
);

// Scheme Finder option helper
router.post(
  '/venture-match/help',
  validate([
    body('questionId').trim().notEmpty().withMessage('questionId is required'),
    body('optionIds').isArray({ min: 1 }).withMessage('optionIds is required'),
  ]),
  AIController.ventureMatchHelp
);

export default router;

