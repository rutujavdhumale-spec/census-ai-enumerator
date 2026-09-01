import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

/**
 * Journey steps tracked across the application.
 * Each step is a meaningful interaction the citizen completes.
 */
export const JOURNEY_STEPS = {
  EXPLORED_PHASES: { id: 'explored_phases', label: 'Explored Census Phases', section: 'phases' },
  EXPLORED_STATES: { id: 'explored_states', label: 'Explored State Data', section: 'states' },
  COMPLETED_SIMULATOR: { id: 'completed_simulator', label: 'Completed Self-Enumeration', section: 'simulator' },
  EXPLORED_PRIVACY: { id: 'explored_privacy', label: 'Reviewed Privacy & Safety', section: 'privacy' },
  USED_FACTCHECKER: { id: 'used_factchecker', label: 'Used Fact-Checker', section: 'factcheck' },
  ASKED_ASSISTANT: { id: 'asked_assistant', label: 'Asked Census AI', section: 'assistant' },
  EXPLORED_DATA: { id: 'explored_data', label: 'Explored Data Insights', section: 'analytics' },
  COMPLETED_SAFETY_QUIZ: { id: 'completed_safety_quiz', label: 'Completed Safety Quiz', section: 'privacy' },
} as const;

export type JourneyStepId = typeof JOURNEY_STEPS[keyof typeof JOURNEY_STEPS]['id'];

const ALL_STEP_IDS: JourneyStepId[] = Object.values(JOURNEY_STEPS).map(s => s.id);
const STORAGE_KEY = 'census_journey_progress';

interface JourneyContextType {
  completedSteps: Set<JourneyStepId>;
  totalSteps: number;
  completedCount: number;
  progressPercent: number;
  markComplete: (stepId: JourneyStepId) => void;
  isComplete: (stepId: JourneyStepId) => boolean;
  reset: () => void;
  /** Returns the section ID of the first incomplete step, or null if all done */
  nextIncompleteSection: () => string | null;
}

const JourneyContext = createContext<JourneyContextType | undefined>(undefined);

export const JourneyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [completedSteps, setCompletedSteps] = useState<Set<JourneyStepId>>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as string[];
        return new Set(parsed.filter(id => ALL_STEP_IDS.includes(id as JourneyStepId)) as JourneyStepId[]);
      }
    } catch { /* ignore */ }
    return new Set<JourneyStepId>();
  });

  // Persist to localStorage whenever steps change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(completedSteps)));
    } catch { /* ignore */ }
  }, [completedSteps]);

  const totalSteps = ALL_STEP_IDS.length;
  const completedCount = completedSteps.size;
  const progressPercent = Math.round((completedCount / totalSteps) * 100);

  const markComplete = useCallback((stepId: JourneyStepId) => {
    setCompletedSteps(prev => {
      if (prev.has(stepId)) return prev;
      const next = new Set(prev);
      next.add(stepId);
      return next;
    });
  }, []);

  const isComplete = useCallback((stepId: JourneyStepId) => {
    return completedSteps.has(stepId);
  }, [completedSteps]);

  const reset = useCallback(() => {
    setCompletedSteps(new Set());
    try { localStorage.removeItem(STORAGE_KEY); } catch { /* ignore */ }
  }, []);

  const nextIncompleteSection = useCallback((): string | null => {
    const steps = Object.values(JOURNEY_STEPS);
    for (const step of steps) {
      if (!completedSteps.has(step.id)) {
        return step.section;
      }
    }
    return null;
  }, [completedSteps]);

  return (
    <JourneyContext.Provider
      value={{
        completedSteps,
        totalSteps,
        completedCount,
        progressPercent,
        markComplete,
        isComplete,
        reset,
        nextIncompleteSection
      }}
    >
      {children}
    </JourneyContext.Provider>
  );
};

export const useJourney = (): JourneyContextType => {
  const context = useContext(JourneyContext);
  if (!context) {
    throw new Error('useJourney must be used within a JourneyProvider');
  }
  return context;
};
