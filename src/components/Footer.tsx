import React from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import {
  ExternalLink,
  PhoneCall,
  Lock,
  Accessibility
} from 'lucide-react';

export const Footer: React.FC = () => {
  const { t } = useLanguage();

  return (
    <footer
      className="footer"
      style={{
        backgroundColor: 'var(--color-primary-dark)',
        color: '#ffffff',
        paddingTop: '3rem',
        paddingBottom: '2rem',
        marginTop: 'auto',
        borderTop: '1px solid #334155'
      }}
    >
      <div className="container">
        <div className="grid-3" style={{ gap: '2rem', marginBottom: '2.5rem' }}>
          {/* Brand & Purpose */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.75rem' }}>
              <div style={{ fontSize: '22px' }}>🏛️</div>
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.25rem', color: '#ffffff' }}>
                CensusAI Enumerator
              </span>
            </div>
            <p style={{ fontSize: '0.85rem', color: '#94a3b8', lineHeight: 1.5, marginBottom: '1rem' }}>
              A high-trust, accessible civic technology platform designed to educate citizens on India's upcoming Digital Census 2027, the two census phases, safe self-enumeration simulation, statutory privacy, and rumor verification.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '11px', color: '#cbd5e1' }}>
              <Accessibility size={14} color="#38bdf8" />
              <span>WCAG 2.2 Level AA Compliant</span>
            </div>
          </div>

          {/* Official Portals */}
          <div>
            <h4 style={{ fontSize: '1rem', color: '#ffffff', marginBottom: '1rem', borderBottom: '1px solid #334155', paddingBottom: '0.35rem' }}>
              {t('footerOfficialLinks')}
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.85rem' }}>
              <li>
                <a
                  href="https://censusindia.gov.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: '#93c5fd', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
                >
                  <span>Office of the Registrar General of India (ORGI)</span>
                  <ExternalLink size={12} />
                </a>
              </li>
              <li>
                <a
                  href="https://mha.gov.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: '#93c5fd', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
                >
                  <span>Ministry of Home Affairs (MHA)</span>
                  <ExternalLink size={12} />
                </a>
              </li>
              <li>
                <a
                  href="https://cybercrime.gov.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: '#93c5fd', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
                >
                  <span>National Cyber Crime Reporting Portal</span>
                  <ExternalLink size={12} />
                </a>
              </li>
            </ul>
          </div>

          {/* Legal & Safety Help */}
          <div>
            <h4 style={{ fontSize: '1rem', color: '#ffffff', marginBottom: '1rem', borderBottom: '1px solid #334155', paddingBottom: '0.35rem' }}>
              Citizen Safety & Helplines
            </h4>
            <div style={{ backgroundColor: '#1e293b', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid #334155' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#f87171', fontWeight: 700, fontSize: '0.9rem', marginBottom: '0.3rem' }}>
                <PhoneCall size={15} />
                <span>{t('footerCyberHelpline')}</span>
              </div>
              <p style={{ fontSize: '0.78rem', color: '#94a3b8', lineHeight: 1.4 }}>
                For reporting fraudulent census calls, spoofed SMS messages, or financial extortion attempts.
              </p>
              <div style={{ marginTop: '0.75rem', fontSize: '11px', color: '#10b981', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <Lock size={12} />
                <span>Census Act 1948 Section 15 Guarantee</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Copyright & Disclaimer */}
        <div
          style={{
            borderTop: '1px solid #334155',
            paddingTop: '1.5rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1rem',
            fontSize: '0.8rem',
            color: '#94a3b8'
          }}
        >
          <div>
            {t('footerRights')}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <span>Built with civic care for India's digital future</span>
            <span>🇮🇳</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
