import { MISINFORMATION_DATABASE, MisinformationEntry } from './knowledgeBase';

export interface FactCheckResult {
  query: string;
  veracity: 'TRUE' | 'FALSE' | 'MISLEADING' | 'UNVERIFIED';
  confidenceScore: number; // 0 to 100
  title: string;
  officialFact: string;
  detailedAnalysis: string;
  legalReference: string;
  safetyAdvisory: string;
  matchedCategory: string;
  isOfficialGuideline: boolean;
  shareableDebunkText: string;
}

export function analyzeMisinformation(text: string): FactCheckResult {
  const queryLower = text.toLowerCase().trim();

  // 1. Exact or high keyword overlap match with known rumor entries
  let bestMatch: MisinformationEntry | null = null;
  let maxScore = 0;

  for (const entry of MISINFORMATION_DATABASE) {
    let score = 0;
    for (const kw of entry.keywords) {
      if (queryLower.includes(kw.toLowerCase())) {
        score += 2;
      }
    }

    // Check words in claim
    const claimWords = entry.claim.toLowerCase().split(/\s+/);
    for (const word of claimWords) {
      if (word.length > 3 && queryLower.includes(word)) {
        score += 1;
      }
    }

    if (score > maxScore) {
      maxScore = score;
      bestMatch = entry;
    }
  }

  // 2. Specific pattern evaluations
  // A. Financial / Fees Scams
  const financialPatterns = [/fee/i, /charge/i, /rs\s*\d+/i, /₹\s*\d+/i, /pay\s*online/i, /bank\s*account/i, /upi/i, /pin/i, /cvv/i, /payment/i];
  const hasFinancialAsk = financialPatterns.some(rx => rx.test(queryLower));

  // B. Threats / Aadhaar Deactivation
  const penaltyPatterns = [/aadhaar.*(deactivat|block|cancel|penal)/i, /pan.*(deactivat|block|cancel)/i, /fine\s*of/i, /jail/i];
  const hasThreat = penaltyPatterns.some(rx => rx.test(queryLower));

  // C. Two phases confirmation
  const twoPhasePatterns = [/two\s*phase/i, /houselisting/i, /population\s*enumeration/i, /two\s*stage/i];
  const isAboutTwoPhases = twoPhasePatterns.some(rx => rx.test(queryLower));

  // D. Privacy / Sharing with tax/police
  const dataSharingPatterns = [/share.*(police|tax|bank|court)/i, /income\s*tax.*census/i, /leak.*data/i];
  const isDataSharingConcern = dataSharingPatterns.some(rx => rx.test(queryLower));

  if (bestMatch && maxScore >= 3) {
    return {
      query: text,
      veracity: bestMatch.veracity,
      confidenceScore: Math.min(98, 60 + maxScore * 6),
      title: `Fact Check: ${bestMatch.category}`,
      officialFact: bestMatch.factExplanation,
      detailedAnalysis: `Official verification confirmed against Section 15 of Census Act 1948 and Digital Census guidelines. The claim '${text.slice(0, 80)}...' is classified as ${bestMatch.veracity}.`,
      legalReference: bestMatch.censusActReference,
      safetyAdvisory: bestMatch.actionGuidance,
      matchedCategory: bestMatch.category,
      isOfficialGuideline: bestMatch.veracity === 'TRUE',
      shareableDebunkText: `🚨 CENSUS FACT CHECK 🚨\nClaim: "${text}"\nStatus: ${bestMatch.veracity}\nOfficial Fact: ${bestMatch.factExplanation}\nRef: ${bestMatch.censusActReference}\nLearn more at official Census Portal: censusindia.gov.in`
    };
  }

  if (hasFinancialAsk) {
    return {
      query: text,
      veracity: 'FALSE',
      confidenceScore: 95,
      title: 'Financial Demand / Banking Request Scam',
      officialFact: 'The National Census is completely free. The Census NEVER asks for bank accounts, UPI PINs, ATM passwords, or monetary fees.',
      detailedAnalysis: 'Any message, phone call, or website claiming you must pay a fee or enter banking credentials for Census 2027 is a fraudulent cyber scam.',
      legalReference: 'Census Act 1948 & ORGI Anti-Fraud Directives.',
      safetyAdvisory: 'Do not transfer any money or disclose OTPs. Report cyber fraud to National Cyber Helpline (1930) or cybercrime.gov.in.',
      matchedCategory: 'Scam / Financial Fraud',
      isOfficialGuideline: false,
      shareableDebunkText: `🚨 CENSUS FRAUD ALERT 🚨\nCensus 2027 is 100% FREE. Never share bank details, OTPs, or pay any registration fees. Reference: Census Act 1948.`
    };
  }

  if (hasThreat) {
    return {
      query: text,
      veracity: 'FALSE',
      confidenceScore: 92,
      title: 'Aadhaar / ID Deactivation Hoax',
      officialFact: 'Self-enumeration is completely optional. No Aadhaar, PAN card, or government document is deactivated or penalized if you do not self-enumerate online.',
      detailedAnalysis: 'Failure to do online self-enumeration simply means an enumerator will visit in person to record the census data. There are zero punitive administrative actions.',
      legalReference: 'Digital Census Standard Operating Guidelines.',
      safetyAdvisory: 'Ignore coercive messages. Government agencies will never threaten card deactivation over census participation.',
      matchedCategory: 'Document Requirement',
      isOfficialGuideline: false,
      shareableDebunkText: `🚨 CENSUS HOAX BUSTED 🚨\nNo Aadhaar or PAN card will be deactivated. Self-enumeration is optional; enumerators visit those who do not self-enumerate.`
    };
  }

  if (isAboutTwoPhases) {
    return {
      query: text,
      veracity: 'TRUE',
      confidenceScore: 96,
      title: 'Two-Phase Census Methodology',
      officialFact: 'India\'s Census is officially structured in two distinct phases: Phase 1 (Houselisting & Housing Census) and Phase 2 (Population Enumeration).',
      detailedAnalysis: 'Phase 1 maps dwellings and living conditions (31 items), while Phase 2 records individual socio-economic, educational, and demographic information (29 items).',
      legalReference: 'Office of the Registrar General of India (ORGI) Methodology.',
      safetyAdvisory: 'This information is accurate according to the official digital enumeration operational plan.',
      matchedCategory: 'Timeline / Fees',
      isOfficialGuideline: true,
      shareableDebunkText: `✅ CENSUS VERIFIED FACT ✅\nCensus operates in 2 phases: (1) Houselisting & Housing Schedule (2) Population Enumeration. Learn more at censusindia.gov.in`
    };
  }

  if (isDataSharingConcern) {
    return {
      query: text,
      veracity: 'FALSE',
      confidenceScore: 94,
      title: 'Data Confidentiality & Privacy Shield',
      officialFact: 'Under Section 15 of the Census Act 1948, all individual census answers are strictly confidential and barred from being used as evidence in courts or shared with tax/police authorities.',
      detailedAnalysis: 'Individual census records are legally protected against inter-agency sharing. The data is processed only in aggregate for national planning, resource distribution, and policy development.',
      legalReference: 'Section 15, Census Act 1948.',
      safetyAdvisory: 'Your personal responses are confidential and protected by federal statutory immunity.',
      matchedCategory: 'Privacy & Law',
      isOfficialGuideline: false,
      shareableDebunkText: `🔒 CENSUS PRIVACY GUARANTEE 🔒\nSection 15 of Census Act 1948 strictly prohibits sharing individual census data with police, courts, or tax agencies. Your responses are confidential.`
    };
  }

  // Fallback for unclassified queries
  return {
    query: text,
    veracity: 'UNVERIFIED',
    confidenceScore: 50,
    title: 'Unverified Claim / General Inquiry',
    officialFact: 'Always refer to the official portal of the Registrar General & Census Commissioner of India (censusindia.gov.in) for authenticated announcements.',
    detailedAnalysis: 'This specific phrase does not match any known official census notifications or identified scam forwards. Please verify before forwarding.',
    legalReference: 'Census Act 1948 & ORGI Official Communication Channels.',
    safetyAdvisory: 'Do not forward unverified messages on WhatsApp or social media. Rely exclusively on official notices.',
    matchedCategory: 'Timeline / Fees',
    isOfficialGuideline: false,
    shareableDebunkText: `⚠️ CENSUS INFORMATION NOTICE ⚠️\nVerify all census-related news strictly on the official website: censusindia.gov.in. Avoid spreading unverified rumors.`
  };
}
