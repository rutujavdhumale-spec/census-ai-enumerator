import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { useAccessibility } from '../context/AccessibilityContext';
import {
  Bot,
  Send,
  Sparkles,
  Volume2,
  ShieldCheck,
  User,
  Lightbulb,
  CheckCircle2
} from 'lucide-react';

interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  source?: 'gemini' | 'grounded_kb';
  suggestedQuestions?: string[];
  timestamp: string;
}

export const GeminiAssistant: React.FC = () => {
  const { t, language } = useLanguage();
  const { speakText, stopSpeaking, isSpeaking } = useAccessibility();
  const [inputPrompt, setInputPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-msg',
      role: 'model',
      text: `Namaste! I am your grounded Census AI Assistant for India's upcoming Digital Census 2027. You can ask me about Phase 1 (Housing & Amenities - 31 questions), Phase 2 (Population Demographics - 29 questions), the Citizen Self-Enumeration process, or statutory privacy protections under Section 15 of the Census Act 1948. How can I assist you today?`,
      source: 'grounded_kb',
      suggestedQuestions: [
        'What questions are asked in Phase 1 Houselisting?',
        'How does Citizen Self-Enumeration work?',
        'Is Self-Enumeration mandatory?',
        'How is my data protected under Section 15 of the Census Act 1948?'
      ],
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputPrompt).trim();
    if (!query || loading) return;

    const userMessage: ChatMessage = {
      id: `usr-${Date.now()}`,
      role: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    setInputPrompt('');
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: query,
          language,
          conversationHistory: messages.slice(-4).map(m => ({ role: m.role, text: m.text }))
        })
      });

      if (!res.ok) {
        throw new Error('API server returned error');
      }

      const resJson = await res.json();
      const botMessage: ChatMessage = {
        id: `bot-${Date.now()}`,
        role: 'model',
        text: resJson.data.text,
        source: resJson.data.source,
        suggestedQuestions: resJson.data.suggestedQuestions,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (err) {
      // Offline / network error fallback
      const botMessage: ChatMessage = {
        id: `bot-${Date.now()}`,
        role: 'model',
        text: `Under Section 15 of the Census Act 1948, all individual census answers are strictly confidential. For Phase 1, 31 housing and amenity parameters are recorded; for Phase 2, 29 individual demographic questions are covered. Census is 100% free and never asks for banking credentials or fees.`,
        source: 'grounded_kb',
        suggestedQuestions: [
          'What are the 31 questions in Phase 1?',
          'How does self-enumeration work?',
          'How to verify an authentic enumerator?'
        ],
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, botMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleReadAloud = (text: string) => {
    if (isSpeaking) {
      stopSpeaking();
    } else {
      speakText(text, language);
    }
  };

  return (
    <section id="assistant" className="section" style={{ backgroundColor: 'var(--color-bg-subtle)' }}>
      <div className="container">
        {/* Section Header */}
        <div className="section-title-wrap">
          <span className="section-badge">
            <Bot size={13} />
            {t('aiBadge')}
          </span>
          <h2>{t('aiTitle')}</h2>
          <p className="section-subtitle">
            {t('aiSubtitle')}
          </p>
        </div>

        {/* Chat Window Card */}
        <div
          className="card"
          style={{
            maxWidth: '820px',
            margin: '0 auto',
            padding: 0,
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            height: '620px',
            boxShadow: 'var(--shadow-lg)'
          }}
        >
          {/* Chat Header */}
          <div
            style={{
              padding: '0.85rem 1.25rem',
              backgroundColor: 'var(--color-primary)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: 'var(--radius-full)',
                  backgroundColor: 'rgba(255,255,255,0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Bot size={18} />
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>Census Grounded AI Guide</div>
                <div style={{ fontSize: '11px', opacity: 0.85 }}>Strictly Grounded in Census Act 1948 & ORGI Directives</div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <span className="badge badge-green" style={{ fontSize: '10px' }}>
                <CheckCircle2 size={10} /> Active
              </span>
            </div>
          </div>

          {/* Messages Area */}
          <div
            style={{
              flex: 1,
              overflowY: 'auto',
              padding: '1.25rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
              backgroundColor: '#f8fafc'
            }}
          >
            {messages.map((msg) => (
              <div
                key={msg.id}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: msg.role === 'user' ? 'flex-end' : 'flex-start',
                  maxWidth: '100%'
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    gap: '0.5rem',
                    alignItems: 'flex-start',
                    maxWidth: '85%',
                    flexDirection: msg.role === 'user' ? 'row-reverse' : 'row'
                  }}
                >
                  <div
                    style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: 'var(--radius-full)',
                      backgroundColor: msg.role === 'user' ? 'var(--color-primary-light)' : 'var(--color-primary)',
                      color: '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      marginTop: '2px'
                    }}
                  >
                    {msg.role === 'user' ? <User size={14} /> : <Bot size={14} />}
                  </div>

                  <div
                    style={{
                      backgroundColor: msg.role === 'user' ? 'var(--color-primary)' : '#ffffff',
                      color: msg.role === 'user' ? '#ffffff' : 'var(--color-text-main)',
                      padding: '0.85rem 1rem',
                      borderRadius: 'var(--radius-lg)',
                      border: msg.role === 'user' ? 'none' : '1px solid var(--color-border)',
                      fontSize: '0.88rem',
                      lineHeight: 1.5,
                      boxShadow: 'var(--shadow-sm)',
                      position: 'relative'
                    }}
                  >
                    <p style={{ margin: 0, whiteSpace: 'pre-line', color: msg.role === 'user' ? '#ffffff' : 'var(--color-text-main)' }}>
                      {msg.text}
                    </p>

                    {/* Bot Message Meta (Source badge & TTS button) */}
                    {msg.role === 'model' && (
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          marginTop: '0.65rem',
                          paddingTop: '0.45rem',
                          borderTop: '1px solid #f1f5f9',
                          fontSize: '10px',
                          color: 'var(--color-text-light)'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                          <ShieldCheck size={11} color="var(--color-emerald-dark)" />
                          <span>Source: {msg.source === 'gemini' ? 'Google Gemini AI' : 'Grounded Census Knowledge Engine'}</span>
                        </div>

                        <button
                          onClick={() => handleReadAloud(msg.text)}
                          className="btn btn-secondary btn-sm"
                          style={{ padding: '0.15rem 0.4rem', fontSize: '10px', minHeight: '22px' }}
                          title="Read message aloud (Text-to-Speech)"
                          aria-label="Read message aloud"
                        >
                          <Volume2 size={11} /> Read
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Suggested Follow-up Question Chips */}
                {msg.role === 'model' && msg.suggestedQuestions && msg.suggestedQuestions.length > 0 && (
                  <div style={{ marginTop: '0.6rem', marginLeft: '2.5rem', display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                    {msg.suggestedQuestions.map((q, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSendMessage(q)}
                        className="btn btn-secondary btn-sm"
                        style={{
                          fontSize: '11px',
                          padding: '0.2rem 0.55rem',
                          borderRadius: 'var(--radius-full)',
                          backgroundColor: '#ffffff',
                          border: '1px solid var(--color-border)'
                        }}
                      >
                        <Lightbulb size={10} color="var(--color-saffron)" />
                        <span>{q}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginLeft: '2.5rem', color: 'var(--color-text-muted)', fontSize: '12px' }}>
                <Sparkles size={14} className="animate-spin" />
                <span>Census AI is formulating a verified grounded response...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Grounding Safety Notice */}
          <div
            style={{
              padding: '0.35rem 1rem',
              backgroundColor: '#fffbeb',
              borderTop: '1px solid #fef3c7',
              fontSize: '10px',
              color: '#92400e',
              textAlign: 'center'
            }}
          >
            🔒 {t('aiGroundingNotice')}
          </div>

          {/* Chat Input Bar */}
          <form
            onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }}
            style={{
              padding: '0.75rem 1rem',
              backgroundColor: '#ffffff',
              borderTop: '1px solid var(--color-border)',
              display: 'flex',
              gap: '0.5rem',
              alignItems: 'center'
            }}
          >
            <input
              type="text"
              placeholder={t('aiInputPlaceholder')}
              value={inputPrompt}
              onChange={(e) => setInputPrompt(e.target.value)}
              disabled={loading}
              className="form-control"
              style={{ flex: 1 }}
              aria-label="Ask census assistant"
            />
            <button
              type="submit"
              disabled={loading || !inputPrompt.trim()}
              className="btn btn-primary"
              style={{ padding: '0.65rem 1rem' }}
              aria-label="Send message"
            >
              <Send size={16} />
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};
