import { Router, Request, Response } from 'express';
import { z } from 'zod';
import {
  CENSUS_PHASES,
  UNIQUE_STATES_AND_UTS,
  HISTORICAL_CENSUS_STATS,
  CENSUS_ACT_LEGAL_POINTS,
  MISINFORMATION_DATABASE,
  GROUNDED_FAQS
} from '../services/knowledgeBase';
import { askCensusAssistant, checkMisinformationWithGemini } from '../services/geminiService';
import { aiLimiter, promptSecurityGuard } from '../middleware/security';
import { config } from '../config';

const router = Router();

// 1. Health & Status
router.get('/health', (req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'census-ai-enumerator-backend',
    environment: config.nodeEnv,
    geminiEnabled: Boolean(config.geminiApiKey),
    model: config.geminiApiKey ? config.geminiModel : 'Grounded Knowledge Base (Local Mode)',
    totalStatesSupported: UNIQUE_STATES_AND_UTS.length,
    censusPhases: ['Phase 1: HLO (31 params)', 'Phase 2: PE (29 params)']
  });
});

// 2. Census Phases
router.get('/phases', (req: Request, res: Response) => {
  res.json({
    success: true,
    data: CENSUS_PHASES
  });
});

// 3. States & UTs
router.get('/states', (req: Request, res: Response) => {
  const { zone, type, search } = req.query;

  let filtered = [...UNIQUE_STATES_AND_UTS];

  if (zone && typeof zone === 'string') {
    filtered = filtered.filter(s => s.zone.toLowerCase() === zone.toLowerCase());
  }

  if (type && typeof type === 'string') {
    filtered = filtered.filter(s => s.type.toLowerCase() === type.toLowerCase());
  }

  if (search && typeof search === 'string') {
    const q = search.toLowerCase();
    filtered = filtered.filter(s =>
      s.name.toLowerCase().includes(q) ||
      s.capital.toLowerCase().includes(q) ||
      s.officialLanguages.some(l => l.toLowerCase().includes(q))
    );
  }

  res.json({
    success: true,
    total: filtered.length,
    data: filtered
  });
});

router.get('/states/:id', (req: Request, res: Response) => {
  const stateId = req.params.id.toLowerCase();
  const state = UNIQUE_STATES_AND_UTS.find(s => s.id === stateId);

  if (!state) {
    return res.status(404).json({
      success: false,
      error: `State or Union Territory with ID '${stateId}' not found.`
    });
  }

  res.json({
    success: true,
    data: state
  });
});

// 4. Historical Stats & Trends
router.get('/stats', (req: Request, res: Response) => {
  res.json({
    success: true,
    data: {
      historicalTrends: HISTORICAL_CENSUS_STATS,
      summary: {
        baselinePopulation2011: 1210854977,
        estimatedPopulation2027: 1445000000,
        baselineLiteracy2011: 74.04,
        estimatedLiteracy2027: 85.50,
        baselineSexRatio2011: 940,
        estimatedSexRatio2027: 955,
        totalEnumerationBlocksProjected: 3200000,
        digitalAdoptionTarget: '100% Digital Data Capture via Mobile App & Self-Enumeration'
      }
    }
  });
});

// 5. Legal Shield & Privacy Information
router.get('/legal', (req: Request, res: Response) => {
  res.json({
    success: true,
    data: {
      actName: 'The Census Act, 1948 (Act No. 37 of 1948)',
      sections: CENSUS_ACT_LEGAL_POINTS,
      faqs: GROUNDED_FAQS
    }
  });
});

// 6. Misinformation Samples
router.get('/misinformation/samples', (req: Request, res: Response) => {
  res.json({
    success: true,
    data: MISINFORMATION_DATABASE
  });
});

// 7. Grounded AI Chat Endpoint
const ChatSchema = z.object({
  prompt: z.string().min(1, 'Prompt cannot be empty').max(1500),
  language: z.string().optional().default('en'),
  conversationHistory: z.array(z.object({
    role: z.enum(['user', 'model']),
    text: z.string()
  })).optional().default([])
});

router.post('/chat', aiLimiter, promptSecurityGuard, async (req: Request, res: Response) => {
  try {
    const parseResult = ChatSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({
        success: false,
        error: parseResult.error.errors[0]?.message || 'Invalid request body'
      });
    }

    const { prompt, language, conversationHistory } = parseResult.data;
    const response = await askCensusAssistant(prompt, language, conversationHistory);

    res.json({
      success: true,
      data: response
    });
  } catch (err: any) {
    console.error('Chat endpoint error:', err);
    res.status(500).json({
      success: false,
      error: 'Failed to process chat query with Census assistant.'
    });
  }
});

// 8. Misinformation Fact Checker Endpoint
const FactCheckSchema = z.object({
  claim: z.string().min(3, 'Claim message must have at least 3 characters').max(2000),
  language: z.string().optional().default('en')
});

router.post('/fact-check', aiLimiter, promptSecurityGuard, async (req: Request, res: Response) => {
  try {
    const parseResult = FactCheckSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({
        success: false,
        error: parseResult.error.errors[0]?.message || 'Invalid claim text'
      });
    }

    const { claim, language } = parseResult.data;
    const factCheckResult = await checkMisinformationWithGemini(claim, language);

    res.json({
      success: true,
      data: factCheckResult
    });
  } catch (err: any) {
    console.error('Fact check endpoint error:', err);
    res.status(500).json({
      success: false,
      error: 'Failed to complete rumor fact check.'
    });
  }
});

// 9. Self-Enumeration Submission & Token Generation (Safe Educational Simulation)
const SimulationSubmitSchema = z.object({
  stateId: z.string(),
  headOfHousehold: z.string().min(2, 'Name of Head of Household is required'),
  contactMobile: z.string().optional(),
  dwellingType: z.string().min(1),
  drinkingWaterSource: z.string().min(1),
  latrineFacility: z.string().min(1),
  cookingFuel: z.string().min(1),
  electricitySource: z.string().min(1),
  hasInternet: z.boolean().default(true),
  members: z.array(z.object({
    name: z.string().min(1),
    relationToHead: z.string().min(1),
    sex: z.string().min(1),
    age: z.number().min(0).max(120),
    maritalStatus: z.string().min(1),
    literacyStatus: z.string().min(1),
    motherTongue: z.string().min(1),
    occupation: z.string().min(1)
  })).min(1, 'At least 1 member is required in household')
});

router.post('/simulation/submit', (req: Request, res: Response) => {
  try {
    const parseResult = SimulationSubmitSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({
        success: false,
        error: parseResult.error.errors[0]?.message || 'Invalid submission payload'
      });
    }

    const data = parseResult.data;

    // Generate unique mock SE Reference ID
    const randomSuffix = Math.floor(100000 + Math.random() * 900000);
    const seReferenceId = `CENSUS-2027-SE-${randomSuffix}`;
    const generatedAt = new Date().toISOString();

    // Data minimization: Clean payload for token payload
    const summaryPayload = {
      refId: seReferenceId,
      state: data.stateId,
      head: data.headOfHousehold,
      totalMembers: data.members.length,
      isSelfEnumerationVerified: true,
      timestamp: generatedAt,
      disclaimer: 'Educational Simulation Token. Not valid for official government legal filing.'
    };

    res.json({
      success: true,
      message: 'Self-Enumeration Simulation completed successfully!',
      data: {
        seReferenceId,
        generatedAt,
        summary: summaryPayload,
        qrCodeRawString: `https://censusindia.gov.in/verify?se_ref=${seReferenceId}&token=${Buffer.from(JSON.stringify(summaryPayload)).toString('base64').slice(0, 32)}`,
        nextSteps: [
          'Save or print your Self-Enumeration Acknowledgment Slip with the QR code.',
          'When the official Census Enumerator visits your home, show this QR code / SE Reference ID.',
          'The enumerator will scan your QR code on the official Census App, verify your address, and complete the visit in under 2 minutes.'
        ]
      }
    });
  } catch (err: any) {
    console.error('Simulation submission error:', err);
    res.status(500).json({
      success: false,
      error: 'Failed to process self-enumeration simulation.'
    });
  }
});

export default router;
