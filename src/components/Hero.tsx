import React from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import {
  ShieldCheck,
  FileCheck2,
  Layers,
  AlertTriangle,
  Lock,
  Smartphone,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';

interface HeroProps {
  onNavigate: (sectionId: string) => void;
}

export const Hero: React.FC<HeroProps> = ({ onNavigate }) => {
  const { t } = useLanguage();

  return (
    <section
      id="hero"
      style={{
        paddingTop: '3rem',
        paddingBottom: '3.5rem',
        background: 'linear-gradient(180deg, #ffffff 0%, var(--color-bg-subtle) 100%)',
        borderBottom: '1px solid var(--color-border)',
        position: 'relative'
      }}
    >
      <div className="container">
        {/* Top Badges */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.6rem', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
          <span className="section-badge">
            <ShieldCheck size={13} />
            {t('heroBadge')}
          </span>
          <span className="badge badge-saffron" style={{ fontSize: '11px', padding: '0.2rem 0.6rem' }}>
            {t('disclaimerBadge')}
          </span>
        </div>

        {/* Main Hero Header */}
        <div style={{ textAlign: 'center', maxWidth: '840px', margin: '0 auto 2.25rem auto' }}>
          <h1
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(2rem, 4.5vw, 2.9rem)',
              color: 'var(--color-primary)',
              lineHeight: 1.2,
              marginBottom: '1rem',
              letterSpacing: '-0.02em'
            }}
          >
            {t('heroTitle')}
          </h1>
          <p
            style={{
              fontSize: 'clamp(1rem, 2vw, 1.15rem)',
              color: 'var(--color-text-muted)',
              lineHeight: 1.6,
              maxWidth: '740px',
              margin: '0 auto'
            }}
          >
            {t('heroDescription')}
          </p>
        </div>

        {/* Call to Actions */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.85rem', flexWrap: 'wrap', marginBottom: '3rem' }}>
          <button
            onClick={() => onNavigate('simulator')}
            className="btn btn-primary btn-lg"
            style={{ boxShadow: 'var(--shadow-md)' }}
          >
            <FileCheck2 size={18} />
            <span>{t('heroBtnSimulator')}</span>
            <ArrowRight size={16} />
          </button>

          <button
            onClick={() => onNavigate('phases')}
            className="btn btn-secondary btn-lg"
            style={{ border: '1px solid var(--color-border-strong)' }}
          >
            <Layers size={18} />
            <span>{t('heroBtnPhases')}</span>
          </button>

          <button
            onClick={() => onNavigate('factcheck')}
            className="btn btn-secondary btn-lg"
            style={{ border: '1px solid var(--color-border-strong)' }}
          >
            <AlertTriangle size={18} color="var(--color-saffron)" />
            <span>{t('heroBtnFactCheck')}</span>
          </button>
        </div>

        {/* 4 Trust Pillars / Stat Cards */}
        <div className="grid-4">
          {/* Card 1 */}
          <div className="card" style={{ borderLeft: '4px solid var(--color-primary-light)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
              <div style={{ padding: '0.35rem', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--color-primary-subtle)', color: 'var(--color-primary)' }}>
                <Layers size={18} />
              </div>
              <h4 style={{ fontSize: '1rem', color: 'var(--color-text-main)' }}>
                {t('statPhases')}
              </h4>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', lineHeight: 1.4 }}>
              {t('statPhasesDesc')}
            </p>
          </div>

          {/* Card 2 */}
          <div className="card" style={{ borderLeft: '4px solid var(--color-emerald)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
              <div style={{ padding: '0.35rem', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--color-emerald-light)', color: 'var(--color-emerald-dark)' }}>
                <Lock size={18} />
              </div>
              <h4 style={{ fontSize: '1rem', color: 'var(--color-text-main)' }}>
                {t('statConfidentiality')}
              </h4>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', lineHeight: 1.4 }}>
              {t('statConfidentialityDesc')}
            </p>
          </div>

          {/* Card 3 */}
          <div className="card" style={{ borderLeft: '4px solid var(--color-saffron)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
              <div style={{ padding: '0.35rem', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--color-saffron-light)', color: 'var(--color-saffron-dark)' }}>
                <Smartphone size={18} />
              </div>
              <h4 style={{ fontSize: '1rem', color: 'var(--color-text-main)' }}>
                {t('statStates')}
              </h4>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', lineHeight: 1.4 }}>
              {t('statStatesDesc')}
            </p>
          </div>

          {/* Card 4 */}
          <div className="card" style={{ borderLeft: '4px solid #10b981' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
              <div style={{ padding: '0.35rem', borderRadius: 'var(--radius-sm)', backgroundColor: '#ecfdf5', color: '#047857' }}>
                <CheckCircle2 size={18} />
              </div>
              <h4 style={{ fontSize: '1rem', color: 'var(--color-text-main)' }}>
                {t('statFree')}
              </h4>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', lineHeight: 1.4 }}>
              {t('statFreeDesc')}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
