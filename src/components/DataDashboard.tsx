import React, { useState } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { HISTORICAL_CENSUS_STATS } from '../../server/services/knowledgeBase';
import {
  BarChart3,
  TrendingUp,
  Download,
  Table as TableIcon,
  LineChart as LineChartIcon,
  PieChart as PieChartIcon
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';

export const DataDashboard: React.FC = () => {
  const { t } = useLanguage();
  const [activeChartTab, setActiveChartTab] = useState<'population' | 'literacy' | 'sexratio' | 'urbanization' | 'table'>('population');

  const downloadCSV = () => {
    const headers = ['Year', 'Census Milestone', 'Population (Millions)', 'Decadal Growth (%)', 'Overall Literacy (%)', 'Male Literacy (%)', 'Female Literacy (%)', 'Sex Ratio (per 1000)', 'Urbanization (%)'];
    const rows = HISTORICAL_CENSUS_STATS.map(s => [
      s.year,
      `"${s.keyMilestone}"`,
      s.totalPopulationMillions,
      s.decadalGrowthRatePercent,
      s.overallLiteracyPercent,
      s.maleLiteracyPercent,
      s.femaleLiteracyPercent,
      s.sexRatioPer1000,
      s.urbanizationPercent
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'india_census_demographics_1951_2027.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <section id="analytics" className="section" style={{ backgroundColor: 'var(--color-bg)' }}>
      <div className="container">
        {/* Section Header */}
        <div className="section-title-wrap">
          <span className="section-badge">
            <BarChart3 size={13} />
            {t('dataBadge')}
          </span>
          <h2>{t('dataTitle')}</h2>
          <p className="section-subtitle">
            {t('dataSubtitle')}
          </p>
        </div>

        {/* Chart Selector Tabs & CSV Export */}
        <div
          className="card"
          style={{
            marginBottom: '1.75rem',
            padding: '0.85rem 1.25rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '0.75rem'
          }}
        >
          <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }} role="tablist">
            <button
              onClick={() => setActiveChartTab('population')}
              className={`btn btn-sm ${activeChartTab === 'population' ? 'btn-primary' : 'btn-secondary'}`}
              role="tab"
              aria-selected={activeChartTab === 'population'}
            >
              <TrendingUp size={14} /> Population Growth
            </button>

            <button
              onClick={() => setActiveChartTab('literacy')}
              className={`btn btn-sm ${activeChartTab === 'literacy' ? 'btn-primary' : 'btn-secondary'}`}
              role="tab"
              aria-selected={activeChartTab === 'literacy'}
            >
              <LineChartIcon size={14} /> Literacy Trends
            </button>

            <button
              onClick={() => setActiveChartTab('sexratio')}
              className={`btn btn-sm ${activeChartTab === 'sexratio' ? 'btn-primary' : 'btn-secondary'}`}
              role="tab"
              aria-selected={activeChartTab === 'sexratio'}
            >
              <LineChartIcon size={14} /> Sex Ratio
            </button>

            <button
              onClick={() => setActiveChartTab('urbanization')}
              className={`btn btn-sm ${activeChartTab === 'urbanization' ? 'btn-primary' : 'btn-secondary'}`}
              role="tab"
              aria-selected={activeChartTab === 'urbanization'}
            >
              <PieChartIcon size={14} /> Urban vs Rural
            </button>

            <button
              onClick={() => setActiveChartTab('table')}
              className={`btn btn-sm ${activeChartTab === 'table' ? 'btn-primary' : 'btn-secondary'}`}
              role="tab"
              aria-selected={activeChartTab === 'table'}
            >
              <TableIcon size={14} /> Accessible Table
            </button>
          </div>

          <button
            onClick={downloadCSV}
            className="btn btn-secondary btn-sm"
            style={{ border: '1px solid var(--color-border-strong)', gap: '0.35rem' }}
          >
            <Download size={14} />
            <span>{t('dataExportCsv')}</span>
          </button>
        </div>

        {/* Visual Chart Container */}
        <div className="card" style={{ padding: '1.75rem', minHeight: '440px' }}>
          {/* TAB 1: POPULATION GROWTH */}
          {activeChartTab === 'population' && (
            <div>
              <div style={{ marginBottom: '1rem' }}>
                <h3 style={{ fontSize: '1.15rem' }}>{t('dataHistoricalGrowth')}</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                  Total population in millions from Census 1951 (361M) to Census 2011 (1,210M) and projected Census 2027 (1,445M).
                </p>
              </div>

              <div style={{ width: '100%', height: 340 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={HISTORICAL_CENSUS_STATS} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="popGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#1e3a8a" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#1e3a8a" stopOpacity={0.05}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                    <XAxis dataKey="year" stroke="var(--color-text-muted)" />
                    <YAxis stroke="var(--color-text-muted)" unit="M" />
                    <Tooltip contentStyle={{ backgroundColor: 'var(--color-bg-card)', borderColor: 'var(--color-border)', borderRadius: '8px' }} />
                    <Legend />
                    <Area type="monotone" dataKey="totalPopulationMillions" name="Population (Millions)" stroke="#1e3a8a" fillOpacity={1} fill="url(#popGrad)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* TAB 2: LITERACY RATE CONVERGENCE */}
          {activeChartTab === 'literacy' && (
            <div>
              <div style={{ marginBottom: '1rem' }}>
                <h3 style={{ fontSize: '1.15rem' }}>{t('dataLiteracyTrends')}</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                  Overall, Male, and Female literacy percentage evolution showing narrowing gender gap.
                </p>
              </div>

              <div style={{ width: '100%', height: 340 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={HISTORICAL_CENSUS_STATS} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                    <XAxis dataKey="year" stroke="var(--color-text-muted)" />
                    <YAxis stroke="var(--color-text-muted)" unit="%" domain={[0, 100]} />
                    <Tooltip contentStyle={{ backgroundColor: 'var(--color-bg-card)', borderColor: 'var(--color-border)', borderRadius: '8px' }} />
                    <Legend />
                    <Line type="monotone" dataKey="overallLiteracyPercent" name="Overall Literacy (%)" stroke="#1e3a8a" strokeWidth={3} dot={{ r: 4 }} />
                    <Line type="monotone" dataKey="maleLiteracyPercent" name="Male Literacy (%)" stroke="#2563eb" strokeWidth={2} strokeDasharray="4 4" />
                    <Line type="monotone" dataKey="femaleLiteracyPercent" name="Female Literacy (%)" stroke="#d97706" strokeWidth={3} dot={{ r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* TAB 3: SEX RATIO PROGRESS */}
          {activeChartTab === 'sexratio' && (
            <div>
              <div style={{ marginBottom: '1rem' }}>
                <h3 style={{ fontSize: '1.15rem' }}>{t('dataSexRatio')}</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                  Number of females per 1,000 males across post-independence censuses.
                </p>
              </div>

              <div style={{ width: '100%', height: 340 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={HISTORICAL_CENSUS_STATS} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                    <XAxis dataKey="year" stroke="var(--color-text-muted)" />
                    <YAxis stroke="var(--color-text-muted)" domain={[900, 970]} />
                    <Tooltip contentStyle={{ backgroundColor: 'var(--color-bg-card)', borderColor: 'var(--color-border)', borderRadius: '8px' }} />
                    <Legend />
                    <Bar dataKey="sexRatioPer1000" name="Sex Ratio (Females per 1000 Males)" fill="#059669" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* TAB 4: URBANIZATION SHIFT */}
          {activeChartTab === 'urbanization' && (
            <div>
              <div style={{ marginBottom: '1rem' }}>
                <h3 style={{ fontSize: '1.15rem' }}>{t('dataUrbanization')}</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                  Urban population proportion increasing from 17.3% in 1951 to estimated 37.5% in 2027.
                </p>
              </div>

              <div style={{ width: '100%', height: 340 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={HISTORICAL_CENSUS_STATS} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                    <XAxis dataKey="year" stroke="var(--color-text-muted)" />
                    <YAxis stroke="var(--color-text-muted)" unit="%" />
                    <Tooltip contentStyle={{ backgroundColor: 'var(--color-bg-card)', borderColor: 'var(--color-border)', borderRadius: '8px' }} />
                    <Legend />
                    <Area type="monotone" dataKey="urbanizationPercent" name="Urban Population (%)" stroke="#d97706" fill="#fef3c7" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* TAB 5: ACCESSIBLE DATA TABLE */}
          {activeChartTab === 'table' && (
            <div style={{ overflowX: 'auto' }}>
              <div style={{ marginBottom: '1rem' }}>
                <h3 style={{ fontSize: '1.15rem' }}>Complete Census Time-Series (1951 - 2027)</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                  Screen-reader accessible tabular dataset with export support.
                </p>
              </div>

              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
                <thead>
                  <tr style={{ backgroundColor: 'var(--color-bg-subtle)', borderBottom: '2px solid var(--color-border)' }}>
                    <th style={{ padding: '0.6rem 0.75rem', textAlign: 'left' }}>Year</th>
                    <th style={{ padding: '0.6rem 0.75rem', textAlign: 'left' }}>Population (Cr)</th>
                    <th style={{ padding: '0.6rem 0.75rem', textAlign: 'left' }}>Decadal Growth</th>
                    <th style={{ padding: '0.6rem 0.75rem', textAlign: 'left' }}>Total Literacy</th>
                    <th style={{ padding: '0.6rem 0.75rem', textAlign: 'left' }}>Female Literacy</th>
                    <th style={{ padding: '0.6rem 0.75rem', textAlign: 'left' }}>Sex Ratio</th>
                    <th style={{ padding: '0.6rem 0.75rem', textAlign: 'left' }}>Urban %</th>
                    <th style={{ padding: '0.6rem 0.75rem', textAlign: 'left' }}>Key Milestone</th>
                  </tr>
                </thead>
                <tbody>
                  {HISTORICAL_CENSUS_STATS.map((row) => (
                    <tr key={row.year} style={{ borderBottom: '1px solid var(--color-border)' }}>
                      <td style={{ padding: '0.6rem 0.75rem', fontWeight: 700 }}>{row.year}</td>
                      <td style={{ padding: '0.6rem 0.75rem' }}>{(row.totalPopulationMillions / 10).toFixed(1)} Cr</td>
                      <td style={{ padding: '0.6rem 0.75rem' }}>{row.decadalGrowthRatePercent}%</td>
                      <td style={{ padding: '0.6rem 0.75rem' }}>{row.overallLiteracyPercent}%</td>
                      <td style={{ padding: '0.6rem 0.75rem', color: 'var(--color-saffron-dark)', fontWeight: 600 }}>{row.femaleLiteracyPercent}%</td>
                      <td style={{ padding: '0.6rem 0.75rem', color: 'var(--color-emerald-dark)', fontWeight: 600 }}>{row.sexRatioPer1000}</td>
                      <td style={{ padding: '0.6rem 0.75rem' }}>{row.urbanizationPercent}%</td>
                      <td style={{ padding: '0.6rem 0.75rem', color: 'var(--color-text-muted)' }}>{row.keyMilestone}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
