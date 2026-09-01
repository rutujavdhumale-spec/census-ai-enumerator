import { describe, it, expect } from 'vitest';
import {
  CENSUS_PHASES,
  UNIQUE_STATES_AND_UTS,
  HISTORICAL_CENSUS_STATS,
  CENSUS_ACT_LEGAL_POINTS
} from '../../server/services/knowledgeBase';

describe('Census Knowledge Base Integrity', () => {
  it('contains Phase 1 with exactly 31 standardized parameters', () => {
    expect(CENSUS_PHASES.phase1.totalParameters).toBe(31);
    expect(CENSUS_PHASES.phase1.parameters.length).toBe(31);
    expect(CENSUS_PHASES.phase1.parameters[0].itemNumber).toBe(1);
    expect(CENSUS_PHASES.phase1.parameters[30].itemNumber).toBe(31);
  });

  it('contains Phase 2 with exactly 29 standardized parameters', () => {
    expect(CENSUS_PHASES.phase2.totalParameters).toBe(29);
    expect(CENSUS_PHASES.phase2.parameters.length).toBe(29);
    expect(CENSUS_PHASES.phase2.parameters[0].name).toContain('Full Name');
    expect(CENSUS_PHASES.phase2.parameters[28].category).toBe('Fertility & Health');
  });

  it('contains complete coverage of all 36 States and Union Territories', () => {
    expect(UNIQUE_STATES_AND_UTS.length).toBe(36);
    const states = UNIQUE_STATES_AND_UTS.filter(s => s.type === 'State');
    const uts = UNIQUE_STATES_AND_UTS.filter(s => s.type === 'Union Territory');
    expect(states.length).toBe(28);
    expect(uts.length).toBe(8);
  });

  it('contains continuous historical census time series from 1951 to 2027', () => {
    expect(HISTORICAL_CENSUS_STATS.length).toBe(8);
    expect(HISTORICAL_CENSUS_STATS[0].year).toBe(1951);
    expect(HISTORICAL_CENSUS_STATS[7].year).toBe(2027);
  });

  it('contains statutory provisions for Section 15 of Census Act 1948', () => {
    const sec15 = CENSUS_ACT_LEGAL_POINTS.find(p => p.title.includes('Section 15'));
    expect(sec15).toBeDefined();
    expect(sec15?.title).toContain('Confidentiality');
    expect(sec15?.description.toLowerCase()).toContain('court');
  });
});
