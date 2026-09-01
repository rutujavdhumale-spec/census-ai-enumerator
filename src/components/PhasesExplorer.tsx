import React, { useState } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { CENSUS_PHASES, CensusParameter } from '../../server/services/knowledgeBase';
import {
  Layers,
  Home,
  Users,
  Search,
  HelpCircle,
  Shield,
  CheckCircle2,
  Calendar,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Tag
} from 'lucide-react';

export const PhasesExplorer: React.FC = () => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'hlo' | 'pe' | 'comparison'>('hlo');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [expandedItemId, setExpandedItemId] = useState<string | null>(null);

  const phase1 = CENSUS_PHASES.phase1;
  const phase2 = CENSUS_PHASES.phase2;

  const currentPhase = activeTab === 'hlo' ? phase1 : phase2;

  // Categories for the active phase
  const allCategories = ['all', ...Array.from(new Set(currentPhase.parameters.map(p => p.category)))];

  const filteredParameters = currentPhase.parameters.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.whyAsked.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const toggleExpand = (id: string) => {
    setExpandedItemId(prev => prev === id ? null : id);
  };

  return (
    <section id="phases" className="section" style={{ backgroundColor: 'var(--color-bg)' }}>
      <div className="container">
        {/* Section Header */}
        <div className="section-title-wrap">
          <span className="section-badge">
            <Layers size={13} />
            {t('phasesBadge')}
          </span>
          <h2>{t('phasesTitle')}</h2>
          <p className="section-subtitle">
            {t('phasesSubtitle')}
          </p>
        </div>

        {/* Phase Navigation Tabs */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '0.5rem',
            flexWrap: 'wrap',
            marginBottom: '2rem'
          }}
          role="tablist"
        >
          <button
            onClick={() => { setActiveTab('hlo'); setSelectedCategory('all'); }}
            className={`btn ${activeTab === 'hlo' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ padding: '0.65rem 1.25rem', borderRadius: 'var(--radius-lg)' }}
            role="tab"
            aria-selected={activeTab === 'hlo'}
          >
            <Home size={16} />
            <span>{t('phase1Tab')}</span>
            <span className="badge badge-blue" style={{ marginLeft: '0.35rem' }}>31 Items</span>
          </button>

          <button
            onClick={() => { setActiveTab('pe'); setSelectedCategory('all'); }}
            className={`btn ${activeTab === 'pe' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ padding: '0.65rem 1.25rem', borderRadius: 'var(--radius-lg)' }}
            role="tab"
            aria-selected={activeTab === 'pe'}
          >
            <Users size={16} />
            <span>{t('phase2Tab')}</span>
            <span className="badge badge-saffron" style={{ marginLeft: '0.35rem' }}>29 Items</span>
          </button>

          <button
            onClick={() => setActiveTab('comparison')}
            className={`btn ${activeTab === 'comparison' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ padding: '0.65rem 1.25rem', borderRadius: 'var(--radius-lg)' }}
            role="tab"
            aria-selected={activeTab === 'comparison'}
          >
            <Sparkles size={16} />
            <span>{t('phaseComparisonTab')}</span>
          </button>
        </div>

        {/* Phase Overview Card */}
        {activeTab !== 'comparison' && (
          <div className="card" style={{ marginBottom: '1.75rem', borderLeft: `5px solid ${activeTab === 'hlo' ? 'var(--color-primary-light)' : 'var(--color-saffron)'}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                  <span className={`badge ${activeTab === 'hlo' ? 'badge-blue' : 'badge-saffron'}`} style={{ fontSize: '12px' }}>
                    {currentPhase.code} Schedule
                  </span>
                  <h3 style={{ fontSize: '1.35rem' }}>{currentPhase.title}</h3>
                </div>
                <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem' }}>
                  {currentPhase.subtitle}
                </p>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                <span className="badge badge-green">
                  <CheckCircle2 size={12} />
                  Self-Enumeration Supported
                </span>
                <span className="badge badge-blue">
                  <Calendar size={12} />
                  {currentPhase.totalParameters} Questions
                </span>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem', marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--color-border)' }}>
              <div>
                <strong style={{ fontSize: '0.85rem', color: 'var(--color-primary)' }}>🎯 Core Objective:</strong>
                <p style={{ fontSize: '0.85rem', marginTop: '0.2rem' }}>{currentPhase.objective}</p>
              </div>
              <div>
                <strong style={{ fontSize: '0.85rem', color: 'var(--color-primary)' }}>🕒 Execution Timing:</strong>
                <p style={{ fontSize: '0.85rem', marginTop: '0.2rem' }}>{currentPhase.timingDescription}</p>
              </div>
            </div>
          </div>
        )}

        {/* Search & Category Filter Bar (for Phase 1 & 2) */}
        {activeTab !== 'comparison' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              {/* Search Box */}
              <div style={{ position: 'relative', flex: '1 1 280px' }}>
                <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-light)' }} />
                <input
                  type="text"
                  placeholder={`Search ${currentPhase.totalParameters} questions (e.g. water, electricity, literacy, language)...`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="form-control"
                  style={{ paddingLeft: '36px' }}
                  aria-label="Search census parameters"
                />
              </div>
            </div>

            {/* Category Chips */}
            <div style={{ display: 'flex', gap: '0.35rem', overflowX: 'auto', paddingBottom: '0.25rem' }}>
              {allCategories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`btn btn-sm ${selectedCategory === cat ? 'btn-primary' : 'btn-secondary'}`}
                  style={{
                    borderRadius: 'var(--radius-full)',
                    fontSize: '11px',
                    padding: '0.25rem 0.65rem',
                    textTransform: 'capitalize'
                  }}
                >
                  <Tag size={11} />
                  {cat === 'all' ? 'All Categories' : cat}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Phase 1 & 2 Question Grid */}
        {activeTab !== 'comparison' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {filteredParameters.length === 0 ? (
              <div className="card" style={{ textAlign: 'center', padding: '2.5rem' }}>
                <p>No questions found matching "{searchQuery}". Try a different keyword.</p>
              </div>
            ) : (
              filteredParameters.map((param: CensusParameter) => {
                const isExpanded = expandedItemId === param.id;
                return (
                  <div
                    key={param.id}
                    className="card"
                    style={{
                      padding: '1rem 1.25rem',
                      cursor: 'pointer',
                      borderLeft: isExpanded ? '4px solid var(--color-primary-light)' : '1px solid var(--color-border)'
                    }}
                    onClick={() => toggleExpand(param.id)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') toggleExpand(param.id); }}
                    aria-expanded={isExpanded}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div
                          style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: 'var(--radius-full)',
                            backgroundColor: activeTab === 'hlo' ? 'var(--color-primary-subtle)' : 'var(--color-saffron-light)',
                            color: activeTab === 'hlo' ? 'var(--color-primary)' : 'var(--color-saffron-dark)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 700,
                            fontSize: '12px',
                            flexShrink: 0
                          }}
                        >
                          #{param.itemNumber}
                        </div>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                            <h4 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--color-text-main)' }}>
                              {param.name}
                            </h4>
                            <span className="badge badge-blue" style={{ fontSize: '10px' }}>
                              {param.category}
                            </span>
                            {param.isConfidential ? (
                              <span className="badge badge-saffron" style={{ fontSize: '10px' }}>
                                <Shield size={10} /> Section 15 Confidential
                              </span>
                            ) : (
                              <span className="badge badge-green" style={{ fontSize: '10px' }}>
                                Public Indicator
                              </span>
                            )}
                          </div>
                          <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginTop: '0.2rem' }}>
                            {param.description}
                          </p>
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', color: 'var(--color-text-light)' }}>
                        {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                      </div>
                    </div>

                    {/* Expanded Drawer: Why Asked & Policy Purpose */}
                    {isExpanded && (
                      <div
                        style={{
                          marginTop: '0.85rem',
                          paddingTop: '0.85rem',
                          borderTop: '1px dashed var(--color-border)',
                          backgroundColor: 'var(--color-bg-subtle)',
                          padding: '0.85rem',
                          borderRadius: 'var(--radius-sm)'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                          <HelpCircle size={16} color="var(--color-primary-light)" style={{ flexShrink: 0, marginTop: '2px' }} />
                          <div>
                            <strong style={{ fontSize: '0.85rem', color: 'var(--color-primary)' }}>
                              Why is this collected by the Government?
                            </strong>
                            <p style={{ fontSize: '0.85rem', color: 'var(--color-text-main)', marginTop: '0.25rem' }}>
                              {param.whyAsked}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* Tab 3: Phase Comparison & Timeline Infographic */}
        {activeTab === 'comparison' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Side-by-Side Comparison Matrix */}
            <div className="grid-2">
              {/* Phase 1 Card */}
              <div className="card" style={{ borderTop: '4px solid var(--color-primary-light)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                  <Home size={20} color="var(--color-primary)" />
                  <h3 style={{ fontSize: '1.15rem' }}>Phase 1: Houselisting (HLO)</h3>
                </div>
                <ul style={{ paddingLeft: '1.25rem', fontSize: '0.875rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', color: 'var(--color-text-muted)' }}>
                  <li><strong>Target:</strong> Every physical dwelling, building, household amenities, and assets.</li>
                  <li><strong>Parameters:</strong> 31 standardized questions.</li>
                  <li><strong>Focus Areas:</strong> Wall/roof material, tap water, sanitation latrine type, LPG/PNG connection, electricity, internet, two-wheelers, cars.</li>
                  <li><strong>Output:</strong> Complete Master Register of Houses & Geo-referenced Enumeration Blocks.</li>
                  <li><strong>Duration:</strong> Typically 45 days prior to Phase 2.</li>
                </ul>
              </div>

              {/* Phase 2 Card */}
              <div className="card" style={{ borderTop: '4px solid var(--color-saffron)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                  <Users size={20} color="var(--color-saffron)" />
                  <h3 style={{ fontSize: '1.15rem' }}>Phase 2: Population Enumeration (PE)</h3>
                </div>
                <ul style={{ paddingLeft: '1.25rem', fontSize: '0.875rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', color: 'var(--color-text-muted)' }}>
                  <li><strong>Target:</strong> Every single human residing in the mapped census houses.</li>
                  <li><strong>Parameters:</strong> 29 in-depth socio-economic questions.</li>
                  <li><strong>Focus Areas:</strong> Age, sex, marital status, religion, SC/ST, mother tongue, literacy, occupation, migration reason, fertility.</li>
                  <li><strong>Output:</strong> Official Legal Population Count & Demographic Master Database.</li>
                  <li><strong>Duration:</strong> Synchronous nationwide count (typically February).</li>
                </ul>
              </div>
            </div>

            {/* Timeline Workflow */}
            <div className="card" style={{ padding: '1.75rem' }}>
              <h3 style={{ fontSize: '1.15rem', marginBottom: '1.25rem', textAlign: 'center' }}>
                Chronological Digital Enumeration Journey
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
                <div style={{ padding: '1rem', backgroundColor: 'var(--color-bg-subtle)', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
                  <div style={{ fontWeight: 800, color: 'var(--color-primary)', fontSize: '1.2rem', marginBottom: '0.25rem' }}>Step 1</div>
                  <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>Preparatory & GIS Mapping</div>
                  <p style={{ fontSize: '0.8rem', marginTop: '0.35rem', color: 'var(--color-text-muted)' }}>
                    Boundary freezing and digital enumeration block creation by ORGI.
                  </p>
                </div>

                <div style={{ padding: '1rem', backgroundColor: 'var(--color-bg-subtle)', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
                  <div style={{ fontWeight: 800, color: 'var(--color-primary)', fontSize: '1.2rem', marginBottom: '0.25rem' }}>Step 2</div>
                  <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>Phase 1 Houselisting</div>
                  <p style={{ fontSize: '0.8rem', marginTop: '0.35rem', color: 'var(--color-text-muted)' }}>
                    Mapping houses, living standards, water, sanitation, and kitchen fuel.
                  </p>
                </div>

                <div style={{ padding: '1rem', backgroundColor: 'var(--color-bg-subtle)', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
                  <div style={{ fontWeight: 800, color: 'var(--color-saffron)', fontSize: '1.2rem', marginBottom: '0.25rem' }}>Step 3</div>
                  <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>Citizen Self-Enumeration</div>
                  <p style={{ fontSize: '0.8rem', marginTop: '0.35rem', color: 'var(--color-text-muted)' }}>
                    Optional online self-filling for Phase 1 & 2 with QR code generation.
                  </p>
                </div>

                <div style={{ padding: '1rem', backgroundColor: 'var(--color-bg-subtle)', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
                  <div style={{ fontWeight: 800, color: 'var(--color-emerald-dark)', fontSize: '1.2rem', marginBottom: '0.25rem' }}>Step 4</div>
                  <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>Phase 2 Population Count</div>
                  <p style={{ fontSize: '0.8rem', marginTop: '0.35rem', color: 'var(--color-text-muted)' }}>
                    Enumerator visits every house, validates QR codes, and records remaining data.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
