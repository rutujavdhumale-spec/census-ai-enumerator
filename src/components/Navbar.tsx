import React, { useState } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { SupportedLanguage } from '../i18n/translations';
import {
  Globe,
  Menu,
  X,
  Layers,
  MapPin,
  FileCheck2,
  ShieldCheck,
  AlertTriangle,
  Bot,
  BarChart3,
  Check
} from 'lucide-react';

interface NavbarProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeSection, setActiveSection }) => {
  const { language, setLanguage, t, languages, currentLanguageMeta } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);

  const navItems = [
    { id: 'phases', label: t('navPhases'), icon: Layers },
    { id: 'states', label: t('navStates'), icon: MapPin },
    { id: 'simulator', label: t('navSimulator'), icon: FileCheck2 },
    { id: 'privacy', label: t('navPrivacy'), icon: ShieldCheck },
    { id: 'factcheck', label: t('navFactCheck'), icon: AlertTriangle },
    { id: 'assistant', label: t('navAssistant'), icon: Bot },
    { id: 'analytics', label: t('navAnalytics'), icon: BarChart3 },
  ];

  const handleNavClick = (id: string) => {
    setActiveSection(id);
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleLanguageChange = (langCode: SupportedLanguage) => {
    setLanguage(langCode);
    setLangDropdownOpen(false);
  };

  return (
    <header className="navbar" style={{ position: 'sticky', top: 0, zIndex: 100, backgroundColor: 'var(--color-bg-card)', borderBottom: '1px solid var(--color-border)', boxShadow: 'var(--shadow-sm)' }}>
      {/* Top Civic Disclaimer Banner */}
      <div className="civic-disclaimer-banner" role="banner">
        <span>🇮🇳</span>
        <span>{t('disclaimerBanner')}</span>
      </div>

      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem 1.25rem' }}>
        {/* Brand Logo & Name */}
        <div
          onClick={() => handleNavClick('hero')}
          style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => { if (e.key === 'Enter') handleNavClick('hero'); }}
          aria-label="Census AI Enumerator Homepage"
        >
          <div
            style={{
              width: '38px',
              height: '38px',
              borderRadius: 'var(--radius-md)',
              background: 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              boxShadow: 'var(--shadow-md)',
              fontWeight: 800,
              fontSize: '18px',
              border: '2px solid rgba(255,255,255,0.2)'
            }}
          >
            🏛️
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.15rem', color: 'var(--color-primary)', letterSpacing: '-0.02em' }}>
                CensusAI
              </span>
              <span style={{ fontWeight: 600, fontSize: '1.15rem', color: 'var(--color-saffron)' }}>
                Enumerator
              </span>
              <span className="badge badge-blue" style={{ fontSize: '10px', padding: '0.1rem 0.35rem' }}>
                2027
              </span>
            </div>
            <div style={{ fontSize: '11px', color: 'var(--color-text-muted)', lineHeight: 1 }}>
              {t('appSubtitle')}
            </div>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav
          style={{ display: 'none', alignItems: 'center', gap: '0.25rem' }}
          className="desktop-nav"
          aria-label="Main Navigation"
        >
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`btn btn-sm ${isActive ? 'btn-primary' : 'btn-secondary'}`}
                style={{
                  border: isActive ? 'none' : '1px solid transparent',
                  borderRadius: 'var(--radius-md)',
                  padding: '0.45rem 0.75rem',
                  fontSize: '13px',
                  fontWeight: isActive ? 600 : 500
                }}
                aria-current={isActive ? 'page' : undefined}
              >
                <Icon size={14} aria-hidden="true" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Actions (Language Switcher + Mobile Toggle) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {/* Language Switcher Dropdown */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setLangDropdownOpen(prev => !prev)}
              className="btn btn-secondary btn-sm"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                padding: '0.4rem 0.75rem',
                border: '1px solid var(--color-border-strong)',
                fontSize: '12px'
              }}
              aria-haspopup="true"
              aria-expanded={langDropdownOpen}
              aria-label="Select Language"
            >
              <Globe size={14} aria-hidden="true" />
              <span style={{ fontWeight: 600 }}>{currentLanguageMeta.nativeName}</span>
            </button>

            {langDropdownOpen && (
              <div
                style={{
                  position: 'absolute',
                  right: 0,
                  top: '105%',
                  backgroundColor: 'var(--color-bg-card)',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-md)',
                  boxShadow: 'var(--shadow-lg)',
                  padding: '0.35rem',
                  minWidth: '180px',
                  zIndex: 200,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.2rem'
                }}
                role="menu"
                aria-label="Languages"
              >
                {languages.map((l) => (
                  <button
                    key={l.code}
                    onClick={() => handleLanguageChange(l.code)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0.45rem 0.75rem',
                      fontSize: '13px',
                      background: language === l.code ? 'var(--color-primary-subtle)' : 'transparent',
                      color: language === l.code ? 'var(--color-primary)' : 'var(--color-text-main)',
                      border: 'none',
                      borderRadius: 'var(--radius-sm)',
                      cursor: 'pointer',
                      textAlign: 'left'
                    }}
                    role="menuitem"
                  >
                    <div>
                      <span style={{ fontWeight: 600 }}>{l.nativeName}</span>
                      <span style={{ fontSize: '11px', color: 'var(--color-text-muted)', marginLeft: '0.35rem' }}>
                        ({l.name})
                      </span>
                    </div>
                    {language === l.code && <Check size={14} />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(prev => !prev)}
            className="btn btn-secondary btn-sm mobile-menu-btn"
            style={{ padding: '0.4rem', border: '1px solid var(--color-border-strong)' }}
            aria-label={mobileMenuOpen ? 'Close Navigation Menu' : 'Open Navigation Menu'}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div
          style={{
            backgroundColor: 'var(--color-bg-card)',
            borderTop: '1px solid var(--color-border)',
            padding: '1rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.4rem',
          }}
          className="mobile-drawer"
        >
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.65rem 1rem',
                  fontSize: '14px',
                  fontWeight: isActive ? 700 : 500,
                  backgroundColor: isActive ? 'var(--color-primary-subtle)' : 'transparent',
                  color: isActive ? 'var(--color-primary)' : 'var(--color-text-main)',
                  border: 'none',
                  borderRadius: 'var(--radius-md)',
                  cursor: 'pointer',
                  textAlign: 'left'
                }}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      )}

      <style>{`
        @media (min-width: 960px) {
          .desktop-nav { display: flex !important; }
          .mobile-menu-btn { display: none !important; }
          .mobile-drawer { display: none !important; }
        }
      `}</style>
    </header>
  );
};
