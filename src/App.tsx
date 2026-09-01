import React, { useState, useEffect } from 'react';
import { LanguageProvider } from './i18n/LanguageContext';
import { AccessibilityProvider } from './context/AccessibilityContext';
import { AccessibilityBar } from './components/AccessibilityBar';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { PhasesExplorer } from './components/PhasesExplorer';
import { StateExplorer } from './components/StateExplorer';
import { SelfEnumerationSimulator } from './components/SelfEnumerationSimulator';
import { PrivacyCenter } from './components/PrivacyCenter';
import { MisinformationChecker } from './components/MisinformationChecker';
import { GeminiAssistant } from './components/GeminiAssistant';
import { DataDashboard } from './components/DataDashboard';
import { Footer } from './components/Footer';
import { Bot } from 'lucide-react';

export const AppContent: React.FC = () => {
  const [activeSection, setActiveSection] = useState<string>('hero');

  useEffect(() => {
    // Force scroll to top on initial page load, overriding any
    // browser scroll restoration or lingering URL hash.
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);
  }, []);

  const handleNavigate = (sectionId: string) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Top Accessibility Bar */}
      <AccessibilityBar />

      {/* Main Navbar */}
      <Navbar activeSection={activeSection} setActiveSection={handleNavigate} />

      {/* Main Content Area */}
      <main id="main-content" tabIndex={-1} style={{ flex: 1 }}>
        <Hero onNavigate={handleNavigate} />
        <PhasesExplorer />
        <StateExplorer />
        <SelfEnumerationSimulator />
        <PrivacyCenter />
        <MisinformationChecker />
        <GeminiAssistant />
        <DataDashboard />
      </main>

      {/* Footer */}
      <Footer />

      {/* Floating Quick Action Button for AI Assistant */}
      <div
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          zIndex: 999
        }}
        className="no-print"
      >
        <button
          onClick={() => handleNavigate('assistant')}
          className="btn btn-primary btn-lg"
          style={{
            borderRadius: 'var(--radius-full)',
            boxShadow: 'var(--shadow-xl)',
            padding: '0.75rem 1.25rem',
            gap: '0.5rem',
            backgroundColor: 'var(--color-primary)',
            border: '2px solid rgba(255,255,255,0.3)'
          }}
          title="Open Grounded Census AI Assistant"
          aria-label="Open Grounded Census AI Assistant"
        >
          <Bot size={20} />
          <span style={{ fontSize: '14px', fontWeight: 700 }}>Ask Census AI</span>
        </button>
      </div>
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <LanguageProvider>
      <AccessibilityProvider>
        <AppContent />
      </AccessibilityProvider>
    </LanguageProvider>
  );
};

export default App;
