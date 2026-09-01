import React, { useState } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { CENSUS_ACT_LEGAL_POINTS } from '../../server/services/knowledgeBase';
import {
  ShieldCheck,
  Lock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  PhoneCall,
  ExternalLink,
  UserCheck
} from 'lucide-react';

export const PrivacyCenter: React.FC = () => {
  const { t } = useLanguage();
  const [checkedItems, setCheckedItems] = useState<Record<number, boolean>>({});

  const toggleCheck = (idx: number) => {
    setCheckedItems(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  const verificationRules = [
    { id: 1, title: 'Official Photo ID Card with QR Code', desc: 'Every genuine enumerator must display an official photo identity card issued by the Directorate of Census Operations / District Collector.' },
    { id: 2, title: 'Official Government Census Tablet / Mobile App', desc: 'Enumerators operate exclusively through the official secured Government Census digital app with watermarked departmental seals.' },
    { id: 3, title: 'Zero Fee or Payment Demand', desc: 'The Census is 100% free of cost. If someone asks for cash, online payments, or registration charges, they are an impostor.' },
    { id: 4, title: 'Zero Banking or OTP Inquiries', desc: 'Enumerators will never ask for your bank account, ATM PIN, UPI PIN, CVV, or banking OTP.' }
  ];

  const allVerified = verificationRules.every((_, i) => checkedItems[i]);

  return (
    <section id="privacy" className="section" style={{ backgroundColor: 'var(--color-bg-subtle)' }}>
      <div className="container">
        {/* Section Header */}
        <div className="section-title-wrap">
          <span className="section-badge">
            <ShieldCheck size={13} />
            {t('privacyBadge')}
          </span>
          <h2>{t('privacyTitle')}</h2>
          <p className="section-subtitle">
            {t('privacySubtitle')}
          </p>
        </div>

        {/* Section 1: The Census Act 1948 Statutory Privacy Shield */}
        <div className="card" style={{ marginBottom: '2rem', borderTop: '4px solid var(--color-emerald)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
            <Lock size={22} color="var(--color-emerald-dark)" />
            <h3 style={{ fontSize: '1.25rem' }}>{t('privacyLegalShield')}</h3>
          </div>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
            Individual census declarations enjoy absolute statutory immunity under Indian law. By mandate of Parliament, your individual answers cannot be subpoenaed, inspected by administrative agencies, or used against you in any legal proceeding.
          </p>

          <div className="grid-2">
            {CENSUS_ACT_LEGAL_POINTS.map((point, idx) => (
              <div
                key={idx}
                style={{
                  backgroundColor: 'var(--color-bg-card)',
                  padding: '1rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--color-border)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.35rem' }}>
                  <ShieldCheck size={16} color="var(--color-emerald-dark)" />
                  <h4 style={{ fontSize: '0.95rem', color: 'var(--color-text-main)' }}>{point.title}</h4>
                </div>
                <p style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', lineHeight: 1.45 }}>
                  {point.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Section 2: Interactive "What Census Asks vs What Scammers Ask" */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.25rem' }}>{t('privacyScamCheckerTitle')}</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
              Know the clear boundary between legitimate statistical inquiries and malicious cyber scams.
            </p>
          </div>

          <div className="grid-2">
            {/* What Official Census Asks */}
            <div className="card" style={{ borderTop: '4px solid var(--color-emerald)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                <CheckCircle2 size={20} color="var(--color-emerald-dark)" />
                <h4 style={{ fontSize: '1.1rem', color: 'var(--color-emerald-dark)' }}>
                  {t('privacyScamCensusSays')}
                </h4>
              </div>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.85rem' }}>
                <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                  <CheckCircle2 size={16} color="var(--color-emerald-dark)" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span>Household member names, ages, relationships, and genders.</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                  <CheckCircle2 size={16} color="var(--color-emerald-dark)" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span>Dwelling condition, floor/wall/roof material, and living room count.</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                  <CheckCircle2 size={16} color="var(--color-emerald-dark)" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span>Sources of drinking water, latrine facilities, and cooking fuel (LPG).</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                  <CheckCircle2 size={16} color="var(--color-emerald-dark)" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span>Mother tongue, other languages spoken, and literacy status.</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                  <CheckCircle2 size={16} color="var(--color-emerald-dark)" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span>General worker status, industry of work, and migration reason.</span>
                </li>
              </ul>
            </div>

            {/* What Scammers Ask */}
            <div className="card" style={{ borderTop: '4px solid var(--color-danger)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                <XCircle size={20} color="var(--color-danger)" />
                <h4 style={{ fontSize: '1.1rem', color: 'var(--color-danger)' }}>
                  {t('privacyScamFraudsterSays')}
                </h4>
              </div>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.85rem' }}>
                <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                  <XCircle size={16} color="var(--color-danger)" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span><strong>Bank Account Number, IFSC, ATM Card PIN, or CVV.</strong></span>
                </li>
                <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                  <XCircle size={16} color="var(--color-danger)" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span><strong>One-Time Passwords (OTPs) sent by your bank or payment apps.</strong></span>
                </li>
                <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                  <XCircle size={16} color="var(--color-danger)" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span><strong>Registration fees, processing charges (₹250 / ₹500), or UPI payments.</strong></span>
                </li>
                <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                  <XCircle size={16} color="var(--color-danger)" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span><strong>Biometric iris / fingerprint scanner verification at your doorstep.</strong></span>
                </li>
                <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                  <XCircle size={16} color="var(--color-danger)" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span><strong>Original physical property deeds, land registries, or passport surrender.</strong></span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Section 3: Interactive 4-Point Enumerator Verification Checklist */}
        <div className="card" style={{ padding: '1.75rem', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <UserCheck size={20} color="var(--color-primary)" />
              <h3 style={{ fontSize: '1.2rem' }}>{t('privacyVerifierTitle')}</h3>
            </div>
            {allVerified && (
              <span className="badge badge-green">
                <CheckCircle2 size={12} /> All 4 Checks Passed — Safe to Enumerate
              </span>
            )}
          </div>

          <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: '1.25rem' }}>
            Perform these 4 quick verification checks whenever someone arrives at your home identifying as a Census official:
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {verificationRules.map((rule, idx) => (
              <label
                key={rule.id}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '0.75rem',
                  padding: '0.85rem',
                  backgroundColor: checkedItems[idx] ? 'var(--color-primary-subtle)' : 'var(--color-bg-subtle)',
                  borderRadius: 'var(--radius-md)',
                  cursor: 'pointer',
                  border: checkedItems[idx] ? '1px solid var(--color-primary-light)' : '1px solid var(--color-border)',
                  transition: 'all var(--transition-fast)'
                }}
              >
                <input
                  type="checkbox"
                  checked={Boolean(checkedItems[idx])}
                  onChange={() => toggleCheck(idx)}
                  style={{ width: '18px', height: '18px', marginTop: '2px', cursor: 'pointer' }}
                />
                <div>
                  <span style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--color-text-main)' }}>
                    {rule.id}. {rule.title}
                  </span>
                  <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: '0.15rem' }}>
                    {rule.desc}
                  </p>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Emergency Cyber Reporting Banner */}
        <div
          style={{
            backgroundColor: '#fef2f2',
            border: '1px solid #fecaca',
            borderRadius: 'var(--radius-lg)',
            padding: '1.25rem 1.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <AlertTriangle size={24} color="var(--color-danger)" />
            <div>
              <h4 style={{ fontSize: '1rem', color: '#991b1b' }}>Encountered a Census Impostor or Cyber Scam?</h4>
              <p style={{ fontSize: '0.82rem', color: '#b91c1c' }}>
                Immediately report fraudulent calls, websites, or phishing links to the Ministry of Home Affairs Cyber Crime Division.
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <a
              href="tel:1930"
              className="btn btn-sm"
              style={{ backgroundColor: 'var(--color-danger)', color: '#ffffff', gap: '0.35rem' }}
            >
              <PhoneCall size={14} />
              <span>Call Helpline 1930</span>
            </a>
            <a
              href="https://cybercrime.gov.in"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-secondary btn-sm"
              style={{ gap: '0.35rem' }}
            >
              <span>cybercrime.gov.in</span>
              <ExternalLink size={13} />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
