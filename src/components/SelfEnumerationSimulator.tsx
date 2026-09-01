import React, { useState } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { UNIQUE_STATES_AND_UTS } from '../../server/services/knowledgeBase';
import {
  FileCheck2,
  Smartphone,
  Home,
  Users,
  CheckCircle2,
  QrCode,
  Printer,
  RotateCcw,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  UserPlus,
  Trash2,
  Lock
} from 'lucide-react';

interface Member {
  name: string;
  relationToHead: string;
  sex: string;
  age: number;
  maritalStatus: string;
  literacyStatus: string;
  motherTongue: string;
  occupation: string;
}

const PRESET_PROFILES = {
  sharma: {
    stateId: 'delhi',
    headOfHousehold: 'Rajesh Sharma',
    contactMobile: '98765-XXXXX',
    dwellingType: 'Permanent / Pucca (Burnt Brick & RCC)',
    drinkingWaterSource: 'Treated Tap Water (Within Premises)',
    latrineFacility: 'Flush to Piped Sewer System',
    cookingFuel: 'LPG / PNG Connection',
    electricitySource: 'Electricity',
    hasInternet: true,
    members: [
      { name: 'Rajesh Sharma', relationToHead: 'Self (Head)', sex: 'Male', age: 46, maritalStatus: 'Currently Married', literacyStatus: 'Literate (Graduate)', motherTongue: 'Hindi', occupation: 'Software Engineering Manager' },
      { name: 'Sunita Sharma', relationToHead: 'Spouse', sex: 'Female', age: 43, maritalStatus: 'Currently Married', literacyStatus: 'Literate (Post-Graduate)', motherTongue: 'Hindi', occupation: 'Senior School Teacher' },
      { name: 'Aarav Sharma', relationToHead: 'Son', sex: 'Male', age: 16, maritalStatus: 'Never Married', literacyStatus: 'Literate (Secondary Student)', motherTongue: 'Hindi', occupation: 'Student' }
    ]
  },
  patil: {
    stateId: 'maharashtra',
    headOfHousehold: 'Anand Patil',
    contactMobile: '99221-XXXXX',
    dwellingType: 'Permanent / Pucca',
    drinkingWaterSource: 'Treated Tap Water',
    latrineFacility: 'Septic Tank Latrine',
    cookingFuel: 'LPG Connection',
    electricitySource: 'Electricity',
    hasInternet: true,
    members: [
      { name: 'Anand Patil', relationToHead: 'Self (Head)', sex: 'Male', age: 52, maritalStatus: 'Currently Married', literacyStatus: 'Literate (Graduate)', motherTongue: 'Marathi', occupation: 'Agricultural Agro-Processing Entrepreneur' },
      { name: 'Kavita Patil', relationToHead: 'Spouse', sex: 'Female', age: 48, maritalStatus: 'Currently Married', literacyStatus: 'Literate (Higher Secondary)', motherTongue: 'Marathi', occupation: 'Household & Organic Farming' },
      { name: 'Tanvi Patil', relationToHead: 'Daughter', sex: 'Female', age: 22, maritalStatus: 'Never Married', literacyStatus: 'Literate (B.Tech Degree)', motherTongue: 'Marathi', occupation: 'Junior Data Analyst' }
    ]
  },
  murugan: {
    stateId: 'tamil-nadu',
    headOfHousehold: 'K. Murugan',
    contactMobile: '94432-XXXXX',
    dwellingType: 'Permanent / Pucca',
    drinkingWaterSource: 'Treated Tap Water',
    latrineFacility: 'Piped Sewer System',
    cookingFuel: 'LPG Connection',
    electricitySource: 'Electricity & Solar Rooftop',
    hasInternet: true,
    members: [
      { name: 'K. Murugan', relationToHead: 'Self (Head)', sex: 'Male', age: 49, maritalStatus: 'Currently Married', literacyStatus: 'Literate (Diploma)', motherTongue: 'Tamil', occupation: 'Precision Machinist' },
      { name: 'M. Selvi', relationToHead: 'Spouse', sex: 'Female', age: 45, maritalStatus: 'Currently Married', literacyStatus: 'Literate (Graduate)', motherTongue: 'Tamil', occupation: 'Bank Branch Executive' }
    ]
  }
};

export const SelfEnumerationSimulator: React.FC = () => {
  const { t } = useLanguage();
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [loadingSubmission, setLoadingSubmission] = useState(false);

  // Form State
  const [stateId, setStateId] = useState<string>('delhi');
  const [headOfHousehold, setHeadOfHousehold] = useState<string>('Rajesh Sharma');
  const [contactMobile, setContactMobile] = useState<string>('98765-43210');
  const [dwellingType, setDwellingType] = useState<string>('Permanent / Pucca (Burnt Brick & RCC)');
  const [drinkingWaterSource, setDrinkingWaterSource] = useState<string>('Treated Tap Water (Within Premises)');
  const [latrineFacility, setLatrineFacility] = useState<string>('Flush to Piped Sewer System');
  const [cookingFuel, setCookingFuel] = useState<string>('LPG / PNG Connection');
  const [electricitySource, setElectricitySource] = useState<string>('Electricity');
  const [hasInternet, setHasInternet] = useState<boolean>(true);

  const [members, setMembers] = useState<Member[]>([
    { name: 'Rajesh Sharma', relationToHead: 'Self (Head)', sex: 'Male', age: 46, maritalStatus: 'Currently Married', literacyStatus: 'Literate (Graduate)', motherTongue: 'Hindi', occupation: 'Software Engineering Manager' },
    { name: 'Sunita Sharma', relationToHead: 'Spouse', sex: 'Female', age: 43, maritalStatus: 'Currently Married', literacyStatus: 'Literate (Post-Graduate)', motherTongue: 'Hindi', occupation: 'Senior School Teacher' },
    { name: 'Aarav Sharma', relationToHead: 'Son', sex: 'Male', age: 16, maritalStatus: 'Never Married', literacyStatus: 'Literate (Secondary Student)', motherTongue: 'Hindi', occupation: 'Student' }
  ]);

  // Generated Result
  const [generatedSlip, setGeneratedSlip] = useState<{
    seReferenceId: string;
    generatedAt: string;
    qrData: string;
  } | null>(null);

  const loadPreset = (key: 'sharma' | 'patil' | 'murugan') => {
    const p = PRESET_PROFILES[key];
    setStateId(p.stateId);
    setHeadOfHousehold(p.headOfHousehold);
    setContactMobile(p.contactMobile);
    setDwellingType(p.dwellingType);
    setDrinkingWaterSource(p.drinkingWaterSource);
    setLatrineFacility(p.latrineFacility);
    setCookingFuel(p.cookingFuel);
    setElectricitySource(p.electricitySource);
    setHasInternet(p.hasInternet);
    setMembers(JSON.parse(JSON.stringify(p.members)));
  };

  const handleAddMember = () => {
    setMembers(prev => [
      ...prev,
      {
        name: '',
        relationToHead: 'Family Member',
        sex: 'Male',
        age: 25,
        maritalStatus: 'Never Married',
        literacyStatus: 'Literate',
        motherTongue: 'Hindi',
        occupation: 'Worker'
      }
    ]);
  };

  const handleRemoveMember = (idx: number) => {
    if (members.length <= 1) return;
    setMembers(prev => prev.filter((_, i) => i !== idx));
  };

  const handleMemberChange = (idx: number, field: keyof Member, val: any) => {
    setMembers(prev => {
      const updated = [...prev];
      updated[idx] = { ...updated[idx], [field]: val };
      return updated;
    });
  };

  const handleSubmitSimulation = async () => {
    setLoadingSubmission(true);
    try {
      const payload = {
        stateId,
        headOfHousehold,
        contactMobile,
        dwellingType,
        drinkingWaterSource,
        latrineFacility,
        cookingFuel,
        electricitySource,
        hasInternet,
        members
      };

      const res = await fetch('/api/simulation/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        throw new Error('Simulation endpoint returned error');
      }

      const resJson = await res.json();
      setGeneratedSlip({
        seReferenceId: resJson.data.seReferenceId,
        generatedAt: new Date(resJson.data.generatedAt).toLocaleString(),
        qrData: resJson.data.qrCodeRawString
      });
      setCurrentStep(5);
    } catch (err) {
      // Local fallback in case network error
      const mockRef = `CENSUS-2027-SE-${Math.floor(100000 + Math.random() * 900000)}`;
      setGeneratedSlip({
        seReferenceId: mockRef,
        generatedAt: new Date().toLocaleString(),
        qrData: `https://censusindia.gov.in/verify?se_ref=${mockRef}`
      });
      setCurrentStep(5);
    } finally {
      setLoadingSubmission(false);
    }
  };

  const resetSimulation = () => {
    setGeneratedSlip(null);
    setCurrentStep(1);
    loadPreset('sharma');
  };

  return (
    <section id="simulator" className="section" style={{ backgroundColor: 'var(--color-bg)' }}>
      <div className="container">
        {/* Section Header */}
        <div className="section-title-wrap">
          <span className="section-badge">
            <FileCheck2 size={13} />
            {t('simBadge')}
          </span>
          <h2>{t('simTitle')}</h2>
          <p className="section-subtitle">
            {t('simSubtitle')}
          </p>
        </div>

        {/* Prominent Educational Sandbox Disclaimer */}
        <div
          className="card"
          style={{
            backgroundColor: '#eff6ff',
            border: '1px solid #bfdbfe',
            marginBottom: '1.75rem',
            padding: '1rem 1.25rem'
          }}
          role="alert"
        >
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
            <Lock size={20} color="var(--color-primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
            <div>
              <strong style={{ fontSize: '0.9rem', color: 'var(--color-primary)' }}>
                {t('simNoticeTitle')}
              </strong>
              <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginTop: '0.15rem' }}>
                {t('simNoticeDesc')}
              </p>
            </div>
          </div>
        </div>

        {/* Preset Selector Bar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text-muted)' }}>
              <Sparkles size={14} style={{ display: 'inline', marginRight: '4px' }} />
              {t('simLoadPreset')}:
            </span>
            <button onClick={() => loadPreset('sharma')} className="btn btn-secondary btn-sm" style={{ fontSize: '11px' }}>
              {t('simPresetSharma')}
            </button>
            <button onClick={() => loadPreset('patil')} className="btn btn-secondary btn-sm" style={{ fontSize: '11px' }}>
              {t('simPresetPatil')}
            </button>
            <button onClick={() => loadPreset('murugan')} className="btn btn-secondary btn-sm" style={{ fontSize: '11px' }}>
              {t('simPresetMurugan')}
            </button>
          </div>

          <button onClick={resetSimulation} className="btn btn-secondary btn-sm" style={{ fontSize: '11px' }}>
            <RotateCcw size={12} /> {t('simBtnReset')}
          </button>
        </div>

        {/* Step Progress Bar */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '2rem',
            overflowX: 'auto',
            paddingBottom: '0.5rem'
          }}
          aria-label="Simulation steps progress"
        >
          {[
            { step: 1, label: t('simStep1') },
            { step: 2, label: t('simStep2') },
            { step: 3, label: t('simStep3') },
            { step: 4, label: t('simStep4') },
            { step: 5, label: t('simStep5') },
          ].map(s => {
            const isCurrent = currentStep === s.step;
            const isPast = currentStep > s.step;
            return (
              <button
                key={s.step}
                onClick={() => { if (s.step < currentStep || generatedSlip) setCurrentStep(s.step); }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  padding: '0.45rem 0.85rem',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '12px',
                  fontWeight: isCurrent ? 700 : 500,
                  backgroundColor: isCurrent ? 'var(--color-primary)' : isPast ? 'var(--color-emerald-light)' : 'var(--color-bg-subtle)',
                  color: isCurrent ? '#ffffff' : isPast ? 'var(--color-emerald-dark)' : 'var(--color-text-muted)',
                  border: isCurrent ? 'none' : '1px solid var(--color-border)',
                  cursor: (s.step < currentStep || generatedSlip) ? 'pointer' : 'default',
                  whiteSpace: 'nowrap'
                }}
              >
                {isPast ? <CheckCircle2 size={13} /> : null}
                <span>{s.label}</span>
              </button>
            );
          })}
        </div>

        {/* STEP 1: AUTHENTICATION SIMULATION */}
        {currentStep === 1 && (
          <div className="card" style={{ maxWidth: '640px', margin: '0 auto' }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Smartphone size={18} color="var(--color-primary)" />
              Citizen Login Simulation
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: '1.25rem' }}>
              In the real Digital Census, citizens initiate self-enumeration by entering their mobile number on the official Census portal to receive a secure OTP.
            </p>

            <div className="form-group">
              <label className="form-label">Simulated Mobile Number:</label>
              <input
                type="text"
                value={contactMobile}
                onChange={(e) => setContactMobile(e.target.value)}
                className="form-control"
                placeholder="Enter 10-digit mobile number"
              />
              <span className="form-hint">Synthetic demo contact for educational flow.</span>
            </div>

            <div className="form-group">
              <label className="form-label">Simulated OTP Code:</label>
              <input
                type="text"
                value="749210"
                disabled
                className="form-control"
                style={{ backgroundColor: 'var(--color-bg-subtle)', letterSpacing: '4px', fontWeight: 700 }}
              />
              <span className="form-hint">Pre-verified OTP for sandbox environment.</span>
            </div>

            <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setCurrentStep(2)}
                className="btn btn-primary"
              >
                <span>{t('simBtnNext')}</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: HOUSEHOLD IDENTIFICATION */}
        {currentStep === 2 && (
          <div className="card" style={{ maxWidth: '640px', margin: '0 auto' }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Users size={18} color="var(--color-primary)" />
              Household Identification & Location
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: '1.25rem' }}>
              Select the State/UT where your household normally resides and the Name of the Head of the Household.
            </p>

            <div className="form-group">
              <label className="form-label">State / Union Territory:</label>
              <select
                value={stateId}
                onChange={(e) => setStateId(e.target.value)}
                className="form-control"
              >
                {UNIQUE_STATES_AND_UTS.map(s => (
                  <option key={s.id} value={s.id}>{s.name} ({s.type})</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Name of Head of Household:</label>
              <input
                type="text"
                value={headOfHousehold}
                onChange={(e) => setHeadOfHousehold(e.target.value)}
                className="form-control"
                placeholder="e.g. Rajesh Sharma"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Total Normal Residents Count:</label>
              <input
                type="number"
                value={members.length}
                readOnly
                className="form-control"
                style={{ backgroundColor: 'var(--color-bg-subtle)' }}
              />
              <span className="form-hint">You will configure member details in Step 4.</span>
            </div>

            <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'space-between' }}>
              <button onClick={() => setCurrentStep(1)} className="btn btn-secondary">
                <ArrowLeft size={16} /> {t('simBtnPrev')}
              </button>
              <button onClick={() => setCurrentStep(3)} className="btn btn-primary">
                {t('simBtnNext')} <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: PHASE 1 HOUSING SCHEDULE */}
        {currentStep === 3 && (
          <div className="card" style={{ maxWidth: '720px', margin: '0 auto' }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Home size={18} color="var(--color-primary)" />
              Phase 1: Housing & Household Amenities Schedule
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: '1.25rem' }}>
              Answer standard Phase 1 parameters regarding your physical dwelling, water access, and sanitation facilities.
            </p>

            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">Dwelling Structure Type:</label>
                <select
                  value={dwellingType}
                  onChange={(e) => setDwellingType(e.target.value)}
                  className="form-control"
                >
                  <option value="Permanent / Pucca (Burnt Brick & RCC)">Permanent / Pucca (Burnt Brick & RCC)</option>
                  <option value="Semi-Permanent (Stone / Tile)">Semi-Permanent (Stone / Tile)</option>
                  <option value="Temporary / Kutcha (Thatch / Mud)">Temporary / Kutcha (Thatch / Mud)</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Main Source of Drinking Water:</label>
                <select
                  value={drinkingWaterSource}
                  onChange={(e) => setDrinkingWaterSource(e.target.value)}
                  className="form-control"
                >
                  <option value="Treated Tap Water (Within Premises)">Treated Tap Water (Within Premises)</option>
                  <option value="Untreated Tap Water">Untreated Tap Water</option>
                  <option value="Covered Well / Tubewell">Covered Well / Tubewell</option>
                  <option value="Handpump">Handpump</option>
                  <option value="Tanker / Truck Supply">Tanker / Truck Supply</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Latrine Facility Access:</label>
                <select
                  value={latrineFacility}
                  onChange={(e) => setLatrineFacility(e.target.value)}
                  className="form-control"
                >
                  <option value="Flush to Piped Sewer System">Flush to Piped Sewer System</option>
                  <option value="Septic Tank Latrine">Septic Tank Latrine</option>
                  <option value="Twin-Pit Latrine">Twin-Pit Latrine</option>
                  <option value="Public / Community Latrine">Public / Community Latrine</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Primary Cooking Fuel:</label>
                <select
                  value={cookingFuel}
                  onChange={(e) => setCookingFuel(e.target.value)}
                  className="form-control"
                >
                  <option value="LPG / PNG Connection">LPG / PNG Connection</option>
                  <option value="Biogas / Electric Induction">Biogas / Electric Induction</option>
                  <option value="Firewood / Crop Residue">Firewood / Crop Residue</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Source of Lighting:</label>
                <select
                  value={electricitySource}
                  onChange={(e) => setElectricitySource(e.target.value)}
                  className="form-control"
                >
                  <option value="Electricity">Electricity</option>
                  <option value="Electricity & Solar Rooftop">Electricity & Solar Rooftop</option>
                  <option value="Solar Energy Only">Solar Energy Only</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Internet Facility Access:</label>
                <select
                  value={hasInternet ? 'yes' : 'no'}
                  onChange={(e) => setHasInternet(e.target.value === 'yes')}
                  className="form-control"
                >
                  <option value="yes">Yes (Broadband / High-Speed Mobile 4G/5G)</option>
                  <option value="no">No Internet Access</option>
                </select>
              </div>
            </div>

            <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'space-between' }}>
              <button onClick={() => setCurrentStep(2)} className="btn btn-secondary">
                <ArrowLeft size={16} /> {t('simBtnPrev')}
              </button>
              <button onClick={() => setCurrentStep(4)} className="btn btn-primary">
                {t('simBtnNext')} <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: PHASE 2 POPULATION DEMOGRAPHICS */}
        {currentStep === 4 && (
          <div className="card" style={{ maxWidth: '840px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
              <div>
                <h3 style={{ fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Users size={18} color="var(--color-saffron)" />
                  Phase 2: Household Member Demographics
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                  Record socio-economic and demographic parameters for all {members.length} resident family members.
                </p>
              </div>

              <button onClick={handleAddMember} className="btn btn-secondary btn-sm">
                <UserPlus size={14} /> Add Member
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
              {members.map((member, idx) => (
                <div
                  key={idx}
                  style={{
                    backgroundColor: 'var(--color-bg-subtle)',
                    padding: '1rem',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--color-border)'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                    <span style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--color-primary)' }}>
                      Member #{idx + 1}: {member.name || 'Unnamed'} ({member.relationToHead})
                    </span>
                    {members.length > 1 && (
                      <button
                        onClick={() => handleRemoveMember(idx)}
                        className="btn btn-secondary btn-sm"
                        style={{ padding: '0.2rem 0.4rem', color: 'var(--color-danger)' }}
                        title="Remove member"
                      >
                        <Trash2 size={13} />
                      </button>
                    )}
                  </div>

                  <div className="grid-3" style={{ gap: '0.75rem' }}>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label style={{ fontSize: '11px', fontWeight: 600 }}>Full Name:</label>
                      <input
                        type="text"
                        value={member.name}
                        onChange={(e) => handleMemberChange(idx, 'name', e.target.value)}
                        className="form-control"
                        style={{ padding: '0.4rem' }}
                      />
                    </div>

                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label style={{ fontSize: '11px', fontWeight: 600 }}>Relation to Head:</label>
                      <input
                        type="text"
                        value={member.relationToHead}
                        onChange={(e) => handleMemberChange(idx, 'relationToHead', e.target.value)}
                        className="form-control"
                        style={{ padding: '0.4rem' }}
                      />
                    </div>

                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label style={{ fontSize: '11px', fontWeight: 600 }}>Sex:</label>
                      <select
                        value={member.sex}
                        onChange={(e) => handleMemberChange(idx, 'sex', e.target.value)}
                        className="form-control"
                        style={{ padding: '0.4rem' }}
                      >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Transgender">Transgender</option>
                      </select>
                    </div>

                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label style={{ fontSize: '11px', fontWeight: 600 }}>Age (Years):</label>
                      <input
                        type="number"
                        value={member.age}
                        onChange={(e) => handleMemberChange(idx, 'age', parseInt(e.target.value, 10) || 0)}
                        className="form-control"
                        style={{ padding: '0.4rem' }}
                      />
                    </div>

                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label style={{ fontSize: '11px', fontWeight: 600 }}>Mother Tongue:</label>
                      <input
                        type="text"
                        value={member.motherTongue}
                        onChange={(e) => handleMemberChange(idx, 'motherTongue', e.target.value)}
                        className="form-control"
                        style={{ padding: '0.4rem' }}
                      />
                    </div>

                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label style={{ fontSize: '11px', fontWeight: 600 }}>Occupation / Worker Status:</label>
                      <input
                        type="text"
                        value={member.occupation}
                        onChange={(e) => handleMemberChange(idx, 'occupation', e.target.value)}
                        className="form-control"
                        style={{ padding: '0.4rem' }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ marginTop: '1.75rem', display: 'flex', justifyContent: 'space-between' }}>
              <button onClick={() => setCurrentStep(3)} className="btn btn-secondary">
                <ArrowLeft size={16} /> {t('simBtnPrev')}
              </button>
              <button
                onClick={handleSubmitSimulation}
                disabled={loadingSubmission}
                className="btn btn-primary"
                style={{ backgroundColor: 'var(--color-emerald-dark)' }}
              >
                {loadingSubmission ? (
                  <span>Generating Verification Slip...</span>
                ) : (
                  <>
                    <CheckCircle2 size={16} />
                    <span>{t('simBtnSubmit')}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* STEP 5: ACKNOWLEDGEMENT SLIP & QR CODE (PRINTABLE) */}
        {currentStep === 5 && generatedSlip && (
          <div style={{ maxWidth: '680px', margin: '0 auto' }}>
            {/* Top action buttons */}
            <div className="no-print" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
              <button onClick={() => setCurrentStep(4)} className="btn btn-secondary btn-sm">
                <ArrowLeft size={14} /> Back to Forms
              </button>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  onClick={() => window.print()}
                  className="btn btn-primary btn-sm"
                  style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}
                >
                  <Printer size={14} /> {t('simBtnPrint')}
                </button>
                <button onClick={resetSimulation} className="btn btn-secondary btn-sm">
                  <RotateCcw size={14} /> {t('simBtnReset')}
                </button>
              </div>
            </div>

            {/* Official-Style Simulated Acknowledgement Slip */}
            <div
              className="card"
              style={{
                border: '2px solid var(--color-primary)',
                padding: '2rem',
                backgroundColor: '#ffffff',
                position: 'relative',
                boxShadow: 'var(--shadow-lg)'
              }}
            >
              {/* Slip Watermark */}
              <div
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%) rotate(-30deg)',
                  fontSize: '3.5rem',
                  fontWeight: 900,
                  color: 'rgba(30, 58, 138, 0.04)',
                  userSelect: 'none',
                  pointerEvents: 'none',
                  whiteSpace: 'nowrap'
                }}
              >
                DEMO CENSUS 2027
              </div>

              {/* Slip Header */}
              <div style={{ textAlign: 'center', borderBottom: '2px solid var(--color-primary)', paddingBottom: '1rem', marginBottom: '1.25rem' }}>
                <div style={{ fontSize: '24px', marginBottom: '0.2rem' }}>🏛️</div>
                <h3 style={{ fontSize: '1.25rem', color: 'var(--color-primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  {t('simSlipTitle')}
                </h3>
                <div style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>
                  Office of the Registrar General & Census Commissioner, India (Simulated Prototype)
                </div>
              </div>

              {/* SE Reference Number Badge */}
              <div
                style={{
                  backgroundColor: 'var(--color-primary-subtle)',
                  border: '1px dashed var(--color-primary)',
                  borderRadius: 'var(--radius-md)',
                  padding: '1rem',
                  textAlign: 'center',
                  marginBottom: '1.5rem'
                }}
              >
                <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-text-muted)' }}>
                  {t('simSlipRefId')}
                </div>
                <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--color-primary)', letterSpacing: '2px', fontFamily: 'monospace' }}>
                  {generatedSlip.seReferenceId}
                </div>
                <div style={{ fontSize: '11px', color: 'var(--color-text-muted)', marginTop: '0.2rem' }}>
                  Generated on: {generatedSlip.generatedAt}
                </div>
              </div>

              {/* Two Column Summary: QR Code & Household Details */}
              <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '1.5rem', alignItems: 'center', marginBottom: '1.5rem' }}>
                {/* Visual QR Code Generator Simulation */}
                <div
                  style={{
                    width: '140px',
                    height: '140px',
                    backgroundColor: '#ffffff',
                    border: '2px solid #000000',
                    padding: '8px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 'var(--radius-sm)'
                  }}
                  aria-label={`QR Code for ${generatedSlip.seReferenceId}`}
                >
                  <QrCode size={110} color="#000000" />
                  <span style={{ fontSize: '8px', fontWeight: 700, marginTop: '2px' }}>SCAN FOR ENUMERATOR</span>
                </div>

                {/* Details Table */}
                <div style={{ fontSize: '0.85rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.25rem 0', borderBottom: '1px solid var(--color-border)' }}>
                    <span style={{ color: 'var(--color-text-muted)' }}>Head of Household:</span>
                    <strong>{headOfHousehold}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.25rem 0', borderBottom: '1px solid var(--color-border)' }}>
                    <span style={{ color: 'var(--color-text-muted)' }}>State/UT:</span>
                    <strong>{UNIQUE_STATES_AND_UTS.find(s => s.id === stateId)?.name || stateId}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.25rem 0', borderBottom: '1px solid var(--color-border)' }}>
                    <span style={{ color: 'var(--color-text-muted)' }}>Total Members:</span>
                    <strong>{members.length} Persons</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.25rem 0', borderBottom: '1px solid var(--color-border)' }}>
                    <span style={{ color: 'var(--color-text-muted)' }}>Phase 1 Status:</span>
                    <span style={{ color: 'var(--color-emerald-dark)', fontWeight: 600 }}>Completed</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.25rem 0' }}>
                    <span style={{ color: 'var(--color-text-muted)' }}>Phase 2 Status:</span>
                    <span style={{ color: 'var(--color-emerald-dark)', fontWeight: 600 }}>Completed</span>
                  </div>
                </div>
              </div>

              {/* Instructions for Visiting Enumerator */}
              <div
                style={{
                  backgroundColor: '#f8fafc',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '0.85rem',
                  fontSize: '0.8rem',
                  color: 'var(--color-text-muted)'
                }}
              >
                <strong style={{ color: 'var(--color-primary)', display: 'block', marginBottom: '0.25rem' }}>
                  📌 Next Steps When Enumerator Visits:
                </strong>
                <ol style={{ paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                  <li>{t('simSlipNotice')}</li>
                  <li>The enumerator will scan your QR code with their official Census Mobile Application.</li>
                  <li>They will verify your physical address and confirm completion in under 2 minutes.</li>
                  <li>No fees or additional document submissions are ever required.</li>
                </ol>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
