import { Request, Response, NextFunction } from 'express';
import { rateLimit } from 'express-rate-limit';
import { config } from '../config';

// Rate limiting middleware
export const apiLimiter = rateLimit({
  windowMs: config.rateLimitWindowMs,
  max: config.rateLimitMax,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: 'Too many requests from this IP, please try again after 15 minutes.',
    status: 429
  }
});

export const aiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 30, // 30 requests per minute
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: 'AI request limit reached. Please wait a moment before sending another prompt.',
    status: 429
  }
});

// Prompt injection & safety patterns
const PROMPT_INJECTION_PATTERNS = [
  /ignore\s+(all\s+)?(previous|prior|above)\s+instructions/i,
  /disregard\s+(all\s+)?(previous|prior)\s+instructions/i,
  /you\s+are\s+now/i,
  /\bDAN\b/i,
  /god\s*mode/i,
  /unrestricted\s+mode/i,
  /jailbreak/i,
  /reveal\s+(your\s+)?(system\s+prompt|instructions|api\s+key)/i,
  /override\s+(system|safety)\s+filters/i,
  /javascript:/i
];

export function sanitizePrompt(text: string): { isSafe: boolean; sanitizedText: string; flagReason?: string } {
  if (!text || typeof text !== 'string') {
    return { isSafe: false, sanitizedText: '', flagReason: 'Empty or invalid prompt format' };
  }

  // Strip script tags and HTML tags first
  const cleaned = text
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, '')
    .replace(/<[^>]+>/g, '')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .trim()
    .slice(0, 1500);

  for (const pattern of PROMPT_INJECTION_PATTERNS) {
    if (pattern.test(cleaned) || pattern.test(text)) {
      return {
        isSafe: false,
        sanitizedText: cleaned,
        flagReason: 'Potential prompt injection or safety rule violation detected.'
      };
    }
  }

  return { isSafe: true, sanitizedText: cleaned };
}

export function promptSecurityGuard(req: Request, res: Response, next: NextFunction) {
  const queryText = req.body?.prompt || req.body?.claim || req.body?.query || '';
  if (queryText) {
    const { isSafe, sanitizedText, flagReason } = sanitizePrompt(queryText);
    if (!isSafe) {
      return res.status(400).json({
        error: 'Security Warning: ' + (flagReason || 'Your input contains restricted characters or commands.'),
        isSafe: false
      });
    }
    // Update body with sanitized input
    if (req.body.prompt) req.body.prompt = sanitizedText;
    if (req.body.claim) req.body.claim = sanitizedText;
    if (req.body.query) req.body.query = sanitizedText;
  }
  next();
}

export function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  console.error('Unhandled server error:', err);
  res.status(500).json({
    error: 'An internal server error occurred while processing your census request.',
    message: config.nodeEnv === 'development' ? err.message : undefined
  });
}
