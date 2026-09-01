import React, { useState } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { UNIQUE_STATES_AND_UTS, StateCensusData } from '../../server/services/knowledgeBase';
import {
  MapPin,
  Search,
  Smartphone,
  PhoneCall,
  ExternalLink,
  Scale,
  X,
  CheckCircle,
  Building
} from 'lucide-react';

export const StateExplorer: React.FC = () => {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedZone, setSelectedZone] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  
  // State Comparison modal
  const [compareModalOpen, setCompareModalOpen] = useState(false);
  const [stateAId, setStateAId] = useState<string>('maharashtra');
  const [stateBId, setStateBId] = useState<string>('kerala');

  const zones = ['all', 'Northern', 'Southern', 'Western', 'Eastern', 'Central', 'North-Eastern', 'Island / UT'];

  const filteredStates = UNIQUE_STATES_AND_UTS.filter(state => {
    const matchesSearch = state.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          state.capital.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          state.officialLanguages.some(l => l.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesZone = selectedZone === 'all' || state.zone === selectedZone;
    const matchesType = selectedType === 'all' || state.type === selectedType;
    return matchesSearch && matchesZone && matchesType;
  });

  const stateA = UNIQUE_STATES_AND_UTS.find(s => s.id === stateAId) || UNIQUE_STATES_AND_UTS[0];
  const stateB = UNIQUE_STATES_AND_UTS.find(s => s.id === stateBId) || UNIQUE_STATES_AND_UTS[1];

  const formatPopulation = (num: number) => {
    if (num >= 10000000) {
      return `${(num / 10000000).toFixed(2)} Cr`;
    }
    return `${(num / 100000).toFixed(1)} Lakh`;
  };

  return (
    <section id="states" className="section" style={{ backgroundColor: 'var(--color-bg-subtle)' }}>
      <div className="container">
        {/* Section Header */}
        <div className="section-title-wrap">
          <span className="section-badge">
            <MapPin size={13} />
            {t('statesBadge')}
          </span>
          <h2>{t('statesTitle')}</h2>
          <p className="section-subtitle">
            {t('statesSubtitle')}
          </p>
        </div>

        {/* Controls Bar: Search, Zone Filters, Compare Button */}
        <div className="card" style={{ marginBottom: '2rem', padding: '1.25rem' }}>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
            {/* Search */}
            <div style={{ position: 'relative', flex: '1 1 260px' }}>
              <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-light)' }} />
              <input
                type="text"
                placeholder={t('stateSearchPlaceholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="form-control"
                style={{ paddingLeft: '36px' }}
                aria-label="Search states"
              />
            </div>

            {/* Type selector (State vs UT) */}
            <div style={{ display: 'flex', gap: '0.25rem' }}>
              <button
                onClick={() => setSelectedType('all')}
                className={`btn btn-sm ${selectedType === 'all' ? 'btn-primary' : 'btn-secondary'}`}
                style={{ fontSize: '12px' }}
              >
                All (36)
              </button>
              <button
                onClick={() => setSelectedType('State')}
                className={`btn btn-sm ${selectedType === 'State' ? 'btn-primary' : 'btn-secondary'}`}
                style={{ fontSize: '12px' }}
              >
                States (28)
              </button>
              <button
                onClick={() => setSelectedType('Union Territory')}
                className={`btn btn-sm ${selectedType === 'Union Territory' ? 'btn-primary' : 'btn-secondary'}`}
                style={{ fontSize: '12px' }}
              >
                UTs (8)
              </button>
            </div>

            {/* Compare States Modal Trigger */}
            <button
              onClick={() => setCompareModalOpen(true)}
              className="btn btn-saffron btn-sm"
              style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}
            >
              <Scale size={14} />
              <span>{t('stateCompareBtn')}</span>
            </button>
          </div>

          {/* Zone Filter Chips */}
          <div style={{ display: 'flex', gap: '0.35rem', overflowX: 'auto', marginTop: '1rem', paddingTop: '0.75rem', borderTop: '1px solid var(--color-border)' }}>
            {zones.map(zone => (
              <button
                key={zone}
                onClick={() => setSelectedZone(zone)}
                className={`btn btn-sm ${selectedZone === zone ? 'btn-primary' : 'btn-secondary'}`}
                style={{
                  borderRadius: 'var(--radius-full)',
                  fontSize: '11px',
                  padding: '0.2rem 0.65rem'
                }}
              >
                {zone === 'all' ? t('stateFilterZoneAll') : zone}
              </button>
            ))}
          </div>
        </div>

        {/* States Cards Grid */}
        <div className="grid-3">
          {filteredStates.map((state: StateCensusData) => (
            <div
              key={state.id}
              className="card"
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                borderTop: `4px solid ${state.type === 'State' ? 'var(--color-primary-light)' : 'var(--color-saffron)'}`
              }}
            >
              <div>
                {/* State Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                  <div>
                    <h3 style={{ fontSize: '1.15rem', color: 'var(--color-text-main)' }}>{state.name}</h3>
                    <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: '0.3rem', marginTop: '0.1rem' }}>
                      <Building size={12} />
                      <span>Capital: <strong>{state.capital}</strong></span>
                      <span>•</span>
                      <span>{state.zone}</span>
                    </div>
                  </div>

                  <span className={`badge ${state.type === 'State' ? 'badge-blue' : 'badge-saffron'}`} style={{ fontSize: '10px' }}>
                    {state.type}
                  </span>
                </div>

                {/* Rollout Status Badge */}
                <div style={{ marginBottom: '0.85rem' }}>
                  <span className="badge badge-green" style={{ fontSize: '10px' }}>
                    <CheckCircle size={10} /> Phase 1: {state.simulatedPhase1Status}
                  </span>
                </div>

                {/* Metrics Grid */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '0.6rem',
                    backgroundColor: 'var(--color-bg-subtle)',
                    padding: '0.75rem',
                    borderRadius: 'var(--radius-md)',
                    marginBottom: '0.85rem',
                    fontSize: '0.8rem'
                  }}
                >
                  <div>
                    <span style={{ color: 'var(--color-text-muted)', display: 'block', fontSize: '11px' }}>
                      {t('statePopulation2011')}
                    </span>
                    <strong style={{ color: 'var(--color-text-main)' }}>
                      {formatPopulation(state.census2011Population)}
                    </strong>
                  </div>
                  <div>
                    <span style={{ color: 'var(--color-text-muted)', display: 'block', fontSize: '11px' }}>
                      {t('stateEstPopulation')}
                    </span>
                    <strong style={{ color: 'var(--color-primary)' }}>
                      {formatPopulation(state.estimated2027Population)}
                    </strong>
                  </div>
                  <div>
                    <span style={{ color: 'var(--color-text-muted)', display: 'block', fontSize: '11px' }}>
                      {t('stateLiteracy')}
                    </span>
                    <strong style={{ color: 'var(--color-emerald-dark)' }}>
                      {state.literacyRate2011}% → {state.estimatedLiteracyRate2027}%
                    </strong>
                  </div>
                  <div>
                    <span style={{ color: 'var(--color-text-muted)', display: 'block', fontSize: '11px' }}>
                      {t('stateSexRatio')}
                    </span>
                    <strong style={{ color: 'var(--color-saffron-dark)' }}>
                      {state.sexRatio2011}
                    </strong>
                  </div>
                </div>

                {/* Digital Readiness Bar */}
                <div style={{ marginBottom: '0.85rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginBottom: '0.2rem' }}>
                    <span style={{ color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <Smartphone size={11} /> {t('stateDigitalReadiness')}
                    </span>
                    <span style={{ fontWeight: 700, color: 'var(--color-primary)' }}>{state.digitalReadinessScore}/100</span>
                  </div>
                  <div style={{ width: '100%', height: '6px', backgroundColor: 'var(--color-border)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                    <div
                      style={{
                        width: `${state.digitalReadinessScore}%`,
                        height: '100%',
                        backgroundColor: state.digitalReadinessScore > 85 ? 'var(--color-emerald)' : state.digitalReadinessScore > 75 ? 'var(--color-primary-light)' : 'var(--color-saffron)',
                        borderRadius: 'var(--radius-full)'
                      }}
                    />
                  </div>
                </div>

                {/* Languages & Highlight */}
                <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginBottom: '0.75rem' }}>
                  <span>Languages: <strong>{state.officialLanguages.join(', ')}</strong></span>
                </div>
                <p style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', fontStyle: 'italic', lineHeight: 1.35, marginBottom: '0.75rem' }}>
                  "{state.highlightNote}"
                </p>
              </div>

              {/* Card Footer: Helpline & Quick Actions */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '0.75rem', borderTop: '1px solid var(--color-border)', fontSize: '0.8rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: 'var(--color-primary)' }}>
                  <PhoneCall size={13} />
                  <span style={{ fontWeight: 600 }}>{state.helpline}</span>
                </div>

                <a
                  href={state.portalLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-secondary btn-sm"
                  style={{ padding: '0.2rem 0.5rem', fontSize: '11px', gap: '0.25rem' }}
                >
                  <span>ORGI Portal</span>
                  <ExternalLink size={11} />
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* State Comparison Modal */}
        {compareModalOpen && (
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(15, 23, 42, 0.65)',
              backdropFilter: 'blur(4px)',
              zIndex: 1000,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '1rem'
            }}
            role="dialog"
            aria-modal="true"
            aria-label="Compare States"
          >
            <div
              className="card"
              style={{
                width: '100%',
                maxWidth: '780px',
                maxHeight: '90vh',
                overflowY: 'auto',
                padding: '1.75rem',
                backgroundColor: 'var(--color-bg-card)',
                boxShadow: 'var(--shadow-xl)',
                position: 'relative'
              }}
            >
              {/* Modal Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Scale size={20} color="var(--color-primary)" />
                  <h3 style={{ fontSize: '1.25rem' }}>Side-by-Side State Demographic Comparison</h3>
                </div>
                <button
                  onClick={() => setCompareModalOpen(false)}
                  className="btn btn-secondary btn-sm"
                  style={{ padding: '0.35rem' }}
                  aria-label="Close comparison modal"
                >
                  <X size={18} />
                </button>
              </div>

              {/* State Selectors */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '1.5rem' }}>
                <div>
                  <label className="form-label">Select State A:</label>
                  <select
                    value={stateAId}
                    onChange={(e) => setStateAId(e.target.value)}
                    className="form-control"
                  >
                    {UNIQUE_STATES_AND_UTS.map(s => (
                      <option key={s.id} value={s.id}>{s.name} ({s.type})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="form-label">Select State B:</label>
                  <select
                    value={stateBId}
                    onChange={(e) => setStateBId(e.target.value)}
                    className="form-control"
                  >
                    {UNIQUE_STATES_AND_UTS.map(s => (
                      <option key={s.id} value={s.id}>{s.name} ({s.type})</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Comparison Table */}
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                <thead>
                  <tr style={{ backgroundColor: 'var(--color-bg-subtle)', borderBottom: '2px solid var(--color-border)' }}>
                    <th style={{ padding: '0.65rem 0.75rem', textAlign: 'left' }}>Indicator</th>
                    <th style={{ padding: '0.65rem 0.75rem', textAlign: 'left', color: 'var(--color-primary)' }}>{stateA.name}</th>
                    <th style={{ padding: '0.65rem 0.75rem', textAlign: 'left', color: 'var(--color-saffron-dark)' }}>{stateB.name}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
                    <td style={{ padding: '0.65rem 0.75rem', fontWeight: 600 }}>Capital</td>
                    <td style={{ padding: '0.65rem 0.75rem' }}>{stateA.capital}</td>
                    <td style={{ padding: '0.65rem 0.75rem' }}>{stateB.capital}</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
                    <td style={{ padding: '0.65rem 0.75rem', fontWeight: 600 }}>Census 2011 Baseline</td>
                    <td style={{ padding: '0.65rem 0.75rem' }}>{formatPopulation(stateA.census2011Population)} ({stateA.census2011Population.toLocaleString()})</td>
                    <td style={{ padding: '0.65rem 0.75rem' }}>{formatPopulation(stateB.census2011Population)} ({stateB.census2011Population.toLocaleString()})</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
                    <td style={{ padding: '0.65rem 0.75rem', fontWeight: 600 }}>2027 Projected Population</td>
                    <td style={{ padding: '0.65rem 0.75rem', fontWeight: 700, color: 'var(--color-primary)' }}>{formatPopulation(stateA.estimated2027Population)}</td>
                    <td style={{ padding: '0.65rem 0.75rem', fontWeight: 700, color: 'var(--color-saffron-dark)' }}>{formatPopulation(stateB.estimated2027Population)}</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
                    <td style={{ padding: '0.65rem 0.75rem', fontWeight: 600 }}>Literacy Rate (2011 → 2027)</td>
                    <td style={{ padding: '0.65rem 0.75rem' }}>{stateA.literacyRate2011}% → <strong>{stateA.estimatedLiteracyRate2027}%</strong></td>
                    <td style={{ padding: '0.65rem 0.75rem' }}>{stateB.literacyRate2011}% → <strong>{stateB.estimatedLiteracyRate2027}%</strong></td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
                    <td style={{ padding: '0.65rem 0.75rem', fontWeight: 600 }}>Sex Ratio (Females/1000 Males)</td>
                    <td style={{ padding: '0.65rem 0.75rem' }}>{stateA.sexRatio2011}</td>
                    <td style={{ padding: '0.65rem 0.75rem' }}>{stateB.sexRatio2011}</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
                    <td style={{ padding: '0.65rem 0.75rem', fontWeight: 600 }}>Urban vs Rural Split</td>
                    <td style={{ padding: '0.65rem 0.75rem' }}>{stateA.urbanPercentage}% Urban / {stateA.ruralPercentage}% Rural</td>
                    <td style={{ padding: '0.65rem 0.75rem' }}>{stateB.urbanPercentage}% Urban / {stateB.ruralPercentage}% Rural</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
                    <td style={{ padding: '0.65rem 0.75rem', fontWeight: 600 }}>Digital Readiness Index</td>
                    <td style={{ padding: '0.65rem 0.75rem', fontWeight: 700 }}>{stateA.digitalReadinessScore}/100</td>
                    <td style={{ padding: '0.65rem 0.75rem', fontWeight: 700 }}>{stateB.digitalReadinessScore}/100</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
                    <td style={{ padding: '0.65rem 0.75rem', fontWeight: 600 }}>Official Languages</td>
                    <td style={{ padding: '0.65rem 0.75rem' }}>{stateA.officialLanguages.join(', ')}</td>
                    <td style={{ padding: '0.65rem 0.75rem' }}>{stateB.officialLanguages.join(', ')}</td>
                  </tr>
                  <tr>
                    <td style={{ padding: '0.65rem 0.75rem', fontWeight: 600 }}>Districts Count</td>
                    <td style={{ padding: '0.65rem 0.75rem' }}>{stateA.districtsCount} Districts</td>
                    <td style={{ padding: '0.65rem 0.75rem' }}>{stateB.districtsCount} Districts</td>
                  </tr>
                </tbody>
              </table>

              <div style={{ marginTop: '1.5rem', textAlign: 'right' }}>
                <button
                  onClick={() => setCompareModalOpen(false)}
                  className="btn btn-primary btn-sm"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
