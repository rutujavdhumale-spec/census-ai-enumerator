import { describe, it, expect } from 'vitest';
import request from 'supertest';
import express from 'express';
import cors from 'cors';
import apiRoutes from '../../server/routes/api';

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api', apiRoutes);

describe('Backend API Integration Tests', () => {
  it('GET /api/health returns status healthy and metadata', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('healthy');
    expect(res.body.totalStatesSupported).toBe(36);
  });

  it('GET /api/phases returns both Phase 1 and Phase 2 data', async () => {
    const res = await request(app).get('/api/phases');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.phase1.parameters.length).toBe(31);
    expect(res.body.data.phase2.parameters.length).toBe(29);
  });

  it('GET /api/states returns 36 states and supports filtering', async () => {
    const resAll = await request(app).get('/api/states');
    expect(resAll.status).toBe(200);
    expect(resAll.body.total).toBe(36);

    const resZone = await request(app).get('/api/states?zone=Southern');
    expect(resZone.status).toBe(200);
    expect(resZone.body.data.every((s: any) => s.zone === 'Southern')).toBe(true);
  });

  it('POST /api/fact-check successfully processes rumor claims', async () => {
    const res = await request(app)
      .post('/api/fact-check')
      .send({ claim: 'You have to pay ₹250 registration fee for census self-enumeration' });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.veracity).toBe('FALSE');
  });

  it('POST /api/chat responds with grounded assistant data', async () => {
    const res = await request(app)
      .post('/api/chat')
      .send({ prompt: 'What is Phase 1 of Census 2027?' });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.text).toBeDefined();
    expect(res.body.data.text.length).toBeGreaterThan(20);
  });

  it('POST /api/simulation/submit validates input and generates SE reference slip', async () => {
    const validPayload = {
      stateId: 'maharashtra',
      headOfHousehold: 'Anand Patil',
      contactMobile: '9922110000',
      dwellingType: 'Permanent / Pucca',
      drinkingWaterSource: 'Treated Tap Water',
      latrineFacility: 'Septic Tank',
      cookingFuel: 'LPG',
      electricitySource: 'Electricity',
      hasInternet: true,
      members: [
        {
          name: 'Anand Patil',
          relationToHead: 'Self (Head)',
          sex: 'Male',
          age: 50,
          maritalStatus: 'Currently Married',
          literacyStatus: 'Literate',
          motherTongue: 'Marathi',
          occupation: 'Farmer'
        }
      ]
    };

    const res = await request(app)
      .post('/api/simulation/submit')
      .send(validPayload);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.seReferenceId).toMatch(/^CENSUS-2027-SE-\d+$/);
    expect(res.body.data.qrCodeRawString).toContain('se_ref=');
  });
});
