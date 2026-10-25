import React, { useState } from 'react';
import { CheckCircle2, Circle, ArrowRight, X, Sparkles, BookOpen, Shield, Brain } from 'lucide-react';

interface FirstRunGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToTab?: (tabId: string) => void;
}

interface StepItem {
  id: number;
  title: string;
  description: string;
  tabTarget?: string;
}

export const FirstRunGuideModal: React.FC<FirstRunGuideModalProps> = ({
  isOpen,
  onClose,
  onNavigateToTab,
}) => {
  const [completedSteps, setCompletedSteps] = useState<number[]>([1, 2, 3, 4]);

  const steps: StepItem[] = [
    {
      id: 1,
      title: '1. Authenticate Creator Account',
      description: 'Establish high-privilege master access and verify encryption keys.',
      tabTarget: 'access',
    },
    {
      id: 2,
      title: '2. Ratify Creator Constitution',
      description: 'Review the supreme governing rules, child absolution laws, and privacy shields.',
      tabTarget: 'constitution',
    },
    {
      id: 3,
      title: '3. Define Privacy & Role Clearances',
      description: 'Configure access tiers for Friends, Children, Trusted Adults, and Public release.',
      tabTarget: 'access',
    },
    {
      id: 4,
      title: '4. Set Learning Strictness',
      description: 'Confirm that only creator-reviewed items can enter the authoritative model (Strict mode).',
      tabTarget: 'control_center',
    },
    {
      id: 5,
      title: '5. Ingest Initial Source Artifacts',
      description: 'Upload handwritten journals, transcripts, voice notes, and raw observations.',
      tabTarget: 'vault',
    },
    {
      id: 6,
      title: '6. Review Extracted Memories in Queue',
      description: 'Audit the incoming extraction pipeline: approve, add nuances, or reject AI assumptions.',
      tabTarget: 'review_queue',
    },
    {
      id: 7,
      title: '7. Approve Person & Cognitive Facets',
      description: 'Calibrate what makes you laugh, your BS detector triggers, and your cave-mode patterns.',
      tabTarget: 'person_model',
    },
    {
      id: 8,
      title: '8. Complete First Calibration Benchmark',
      description: 'Run the 2:00 AM panic scenario and verify the AI output against your actual response.',
      tabTarget: 'calibration',
    },
    {
      id: 9,
      title: '9. Generate First Private Simulation',
      description: 'Converse in Creator-Self mode and inspect provenance chips and uncertainty declarations.',
      tabTarget: 'chat',
    },
    {
      id: 10,
      title: '10. Audit for Generic-AI Drift',
      description: 'Ensure no corporate jargon, therapy slogans, or unsolicited silver linings appear.',
      tabTarget: 'voice_lab',
    },
  ];

  if (!isOpen) return null;

  const toggleStep = (id: number) => {
    if (completedSteps.includes(id)) {
      setCompletedSteps(completedSteps.filter((s) => s !== id));
    } else {
      setCompletedSteps([...completedSteps, id]);
    }
  };

  const handleStepClick = (step: StepItem) => {
    if (step.tabTarget && onNavigateToTab) {
      onNavigateToTab(step.tabTarget);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-stone-950/85 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-stone-900 border border-stone-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl p-6 sm:p-8 space-y-6">
        {/* Modal Header */}
        <div className="flex items-start justify-between border-b border-stone-800 pb-4">
          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-amber-400 font-semibold block mb-1">
              Foundational Onboarding
            </span>
            <h2 className="text-2xl font-serif text-stone-100">“I don't know you yet. Let's build the evidence.”</h2>
            <p className="text-stone-400 text-sm mt-1.5 leading-relaxed">
              This system does not begin with generic assumptions. Follow these ten foundational steps to build an authentic, 
              evidence-grounded representation that honors your true voice and sharp edges.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-200 hover:bg-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="space-y-1.5">
          <div className="flex justify-between items-center text-xs font-mono text-stone-400">
            <span>Onboarding Progress</span>
            <span className="text-amber-400 font-bold">{completedSteps.length} of 10 Completed</span>
          </div>
          <div className="w-full bg-stone-800 h-2 rounded-full overflow-hidden">
            <div
              className="bg-amber-500 h-full rounded-full transition-all duration-300"
              style={{ width: `${(completedSteps.length / 10) * 100}%` }}
            />
          </div>
        </div>

        {/* Step Items */}
        <div className="space-y-3">
          {steps.map((step) => {
            const isDone = completedSteps.includes(step.id);
            return (
              <div
                key={step.id}
                className={`p-4 rounded-xl border transition-all flex items-start justify-between gap-4 ${
                  isDone
                    ? 'bg-stone-950/40 border-stone-800/80 text-stone-400'
                    : 'bg-stone-950/80 border-stone-700/80 text-stone-200'
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggleStep(step.id)}
                  className="mt-0.5 shrink-0 text-stone-400 hover:text-amber-400 transition-colors"
                  title={isDone ? 'Mark uncompleted' : 'Mark completed'}
                >
                  {isDone ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  ) : (
                    <Circle className="w-5 h-5 text-stone-600" />
                  )}
                </button>

                <div className="flex-1 space-y-0.5">
                  <h3 className={`text-sm font-serif font-medium ${isDone ? 'line-through text-stone-500' : 'text-stone-200'}`}>
                    {step.title}
                  </h3>
                  <p className="text-xs text-stone-400 leading-relaxed">{step.description}</p>
                </div>

                {step.tabTarget && onNavigateToTab && (
                  <button
                    type="button"
                    onClick={() => handleStepClick(step)}
                    className="flex items-center gap-1 text-xs font-mono text-amber-400 hover:text-amber-300 shrink-0 mt-0.5 pt-1"
                  >
                    <span>Open</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-stone-800">
          <span className="text-xs text-stone-500 font-mono">
            Relaunchable anytime via the top navigation bar.
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 bg-amber-600 hover:bg-amber-500 text-stone-900 font-semibold rounded-lg text-xs transition-colors"
          >
            Continue to Workspace
          </button>
        </div>
      </div>
    </div>
  );
};
