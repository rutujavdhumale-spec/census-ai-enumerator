import React, { useState } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { FactCheckResult, analyzeMisinformation } from '../../server/services/misinformationAnalyzer';
import {
  AlertTriangle,
  Search,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Copy,
  Check,
  Share2,
  Sparkles
} from 'lucide-react';

export const MisinformationChecker: React.FC = () => {
  const { t, language } = useLanguage();
  const [claimInput, setClaimInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<FactCheckResult | null>(null);
  const [copied, setCopied] = useState(false);

  const sampleRumors = [
    'Digital Census requires paying a ₹500 registration charge online.',
    'If I don\'t do online self-enumeration, my Aadhaar card will be blocked.',
    'Census enumerators will ask for original property documents and land deeds.',
    'Self-enumeration means no enumerator will ever visit my house.',
    'Census 2027 is conducted in two phases: Houselisting and Population Enumeration.',
    'Census will ask for my bank account number and UPI PIN for direct welfare transfer.'
  ];

  const handleVerify = async (textToVerify?: string) => {
    const query = (textToVerify || claimInput).trim();
    if (!query) return;

    setLoading(true);
    setCopied(false);

    try {
      const res = await fetch('/api/fact-check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ claim: query, language })
      });

      if (!res.ok) {
        throw new Error('API request failed');
      }

      const resJson = await res.json();
      setResult(resJson.data);
    } catch (err) {
      // Local fallback
      const localResult = analyzeMisinformation(query);
      setResult(localResult);
    } finally {
      setLoading(false);
    }
  };

  const handleSampleClick = (sample: string) => {
    setClaimInput(sample);
    handleVerify(sample);
  };

  const copyDebunkText = () => {
    if (!result) return;
    navigator.clipboard.writeText(result.shareableDebunkText);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <section id="factcheck" className="section" style={{ backgroundColor: 'var(--color-bg)' }}>
      <div className="container">
        {/* Section Header */}
        <div className="section-title-wrap">
          <span className="section-badge">
            <AlertTriangle size={13} color="var(--color-saffron)" />
            {t('factBadge')}
          </span>
          <h2>{t('factTitle')}</h2>
          <p className="section-subtitle">
            {t('factSubtitle')}
          </p>
        </div>

        {/* Search & Verification Input Card */}
        <div className="card" style={{ maxWidth: '820px', margin: '0 auto 2rem auto', padding: '1.75rem' }}>
          <form
            onSubmit={(e) => { e.preventDefault(); handleVerify(); }}
            style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
          >
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label htmlFor="claim-input" className="form-label">
                <span>Enter WhatsApp Forward, SMS, or News Claim:</span>
                <span className="badge badge-blue" style={{ fontSize: '10px' }}>
                  <Sparkles size={10} /> AI Fact-Check Engine
                </span>
              </label>
              <textarea
                id="claim-input"
                rows={3}
                placeholder={t('factInputPlaceholder')}
                value={claimInput}
                onChange={(e) => setClaimInput(e.target.value)}
                className="form-control"
                style={{ resize: 'vertical' }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
              <div style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>
                Protected with prompt-injection and misinformation defense filters.
              </div>

              <button
                type="submit"
                disabled={loading || !claimInput.trim()}
                className="btn btn-primary"
                style={{ minWidth: '150px' }}
              >
                {loading ? (
                  <span>Checking Facts...</span>
                ) : (
                  <>
                    <Search size={16} />
                    <span>{t('factBtnCheck')}</span>
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Sample Rumor Chips */}
          <div style={{ marginTop: '1.5rem', paddingTop: '1.25rem', borderTop: '1px solid var(--color-border)' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--color-text-muted)', display: 'block', marginBottom: '0.5rem' }}>
              {t('factSampleHeading')}
            </span>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
              {sampleRumors.map((rumor, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleSampleClick(rumor)}
                  className="btn btn-secondary btn-sm"
                  style={{
                    fontSize: '11px',
                    padding: '0.3rem 0.65rem',
                    textAlign: 'left',
                    borderRadius: 'var(--radius-full)'
                  }}
                >
                  "{rumor.slice(0, 50)}..."
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Fact Check Result Card */}
        {result && (
          <div
            className="card"
            style={{
              maxWidth: '820px',
              margin: '0 auto',
              padding: '1.75rem',
              borderLeft: `6px solid ${
                result.veracity === 'TRUE' ? 'var(--color-emerald)' :
                result.veracity === 'FALSE' ? 'var(--color-danger)' :
                result.veracity === 'MISLEADING' ? 'var(--color-saffron)' : 'var(--color-text-light)'
              }`,
              boxShadow: 'var(--shadow-md)'
            }}
          >
            {/* Header Badge & Title */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1rem' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                  {result.veracity === 'TRUE' && (
                    <span className="badge badge-green" style={{ fontSize: '13px', padding: '0.25rem 0.75rem' }}>
                      <CheckCircle2 size={15} /> VERIFIED OFFICIAL FACT
                    </span>
                  )}
                  {result.veracity === 'FALSE' && (
                    <span className="badge badge-danger" style={{ fontSize: '13px', padding: '0.25rem 0.75rem' }}>
                      <XCircle size={15} /> FALSE / SCAM HOAX
                    </span>
                  )}
                  {result.veracity === 'MISLEADING' && (
                    <span className="badge badge-saffron" style={{ fontSize: '13px', padding: '0.25rem 0.75rem' }}>
                      <AlertTriangle size={15} /> MISLEADING / PARTIALLY TRUE
                    </span>
                  )}
                  {result.veracity === 'UNVERIFIED' && (
                    <span className="badge" style={{ backgroundColor: 'var(--color-bg-subtle)', color: 'var(--color-text-muted)', fontSize: '13px' }}>
                      <HelpCircle size={15} /> UNVERIFIED CLAIM
                    </span>
                  )}

                  <span style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>
                    Confidence: <strong>{result.confidenceScore}%</strong>
                  </span>
                </div>

                <h3 style={{ fontSize: '1.25rem', color: 'var(--color-text-main)', marginTop: '0.5rem' }}>
                  {result.title}
                </h3>
              </div>

              <span className="badge badge-blue" style={{ fontSize: '11px' }}>
                {result.matchedCategory}
              </span>
            </div>

            {/* Analyzed Claim */}
            <div
              style={{
                backgroundColor: 'var(--color-bg-subtle)',
                padding: '0.75rem 1rem',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.85rem',
                color: 'var(--color-text-muted)',
                marginBottom: '1.25rem',
                fontStyle: 'italic'
              }}
            >
              Checked Claim: "{result.query}"
            </div>

            {/* Official Fact Explanation */}
            <div style={{ marginBottom: '1.25rem' }}>
              <strong style={{ fontSize: '0.9rem', color: 'var(--color-primary)', display: 'block', marginBottom: '0.35rem' }}>
                📖 Official Fact & Clarification:
              </strong>
              <p style={{ fontSize: '0.9rem', color: 'var(--color-text-main)', lineHeight: 1.5 }}>
                {result.officialFact}
              </p>
            </div>

            {/* Detailed Grounded Analysis */}
            <div style={{ marginBottom: '1.25rem', fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
              <strong>Analysis: </strong>{result.detailedAnalysis}
            </div>

            {/* Legal Authority & Safety Advisory */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '0.75rem',
                padding: '0.85rem',
                backgroundColor: 'var(--color-bg-subtle)',
                borderRadius: 'var(--radius-md)',
                marginBottom: '1.5rem',
                fontSize: '0.82rem'
              }}
            >
              <div>
                <strong style={{ color: 'var(--color-primary)' }}>⚖️ Statutory Reference:</strong>
                <p style={{ marginTop: '0.15rem' }}>{result.legalReference}</p>
              </div>
              <div>
                <strong style={{ color: 'var(--color-emerald-dark)' }}>🛡️ Citizen Action Guidance:</strong>
                <p style={{ marginTop: '0.15rem' }}>{result.safetyAdvisory}</p>
              </div>
            </div>

            {/* Shareable Debunk Box */}
            <div
              style={{
                backgroundColor: '#ffffff',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-md)',
                padding: '1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '0.75rem'
              }}
            >
              <div>
                <span style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--color-text-main)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <Share2 size={14} /> {t('factShareTitle')}
                </span>
                <span style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>
                  Help stop fake news by sharing this verified debunk message on WhatsApp groups.
                </span>
              </div>

              <button
                onClick={copyDebunkText}
                className="btn btn-secondary btn-sm"
                style={{
                  backgroundColor: copied ? 'var(--color-emerald-light)' : 'var(--color-bg-subtle)',
                  color: copied ? 'var(--color-emerald-dark)' : 'var(--color-text-main)',
                  gap: '0.35rem'
                }}
              >
                {copied ? <Check size={14} /> : <Copy size={14} />}
                <span>{copied ? 'Copied to Clipboard!' : t('factCopyBtn')}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
