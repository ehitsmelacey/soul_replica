import React, { useState } from 'react';
import { LongitudinalEmotionalRecord } from '../types';
import { Activity, BatteryCharging, ShieldAlert, Sparkles, Clock, AlertCircle } from 'lucide-react';

interface EmotionalContextViewProps {
  records: LongitudinalEmotionalRecord[];
}

export const EmotionalContextView: React.FC<EmotionalContextViewProps> = ({
  records,
}) => {
  const [selectedEraId, setSelectedEraId] = useState<string>(records[2]?.id || records[0]?.id || '');
  const activeRecord = records.find((r) => r.id === selectedEraId) || records[0];

  return (
    <div id="emotional-context-container" className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div id="emotional-context-header" className="bg-stone-900 border border-stone-800 rounded-xl p-6 text-stone-100 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono uppercase tracking-wider bg-amber-950/60 text-amber-300 border border-amber-800/50">
                Layer 2: Model • Longitudinal Emotional Context
              </span>
              <span className="text-xs text-stone-400 font-mono">
                {records.length} Distinct Life Eras
              </span>
            </div>
            <h1 className="text-2xl font-serif tracking-tight text-stone-100">Emotional Context & Longitudinal States</h1>
            <p className="text-stone-400 text-sm mt-1 max-w-3xl">
              Distinguishes creator-expressed emotion, AI-detected signals, and creator-confirmed reality across time. 
              Tracks changes in emotional intensity and exhaustion without imposing a false, Hollywood "healing" or redemption arc.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-stone-800 text-stone-300 rounded-lg text-xs font-mono border border-stone-700">
              No Redemption Arc Bias
            </span>
          </div>
        </div>

        {/* Era Selector Ribbon */}
        <div className="flex flex-wrap gap-2 mt-6 pt-4 border-t border-stone-800">
          {records.map((rec) => (
            <button
              key={rec.id}
              onClick={() => setSelectedEraId(rec.id)}
              className={`px-4 py-2 rounded-lg text-xs font-mono transition-all text-left ${
                selectedEraId === rec.id
                  ? 'bg-amber-600 text-stone-900 font-bold shadow'
                  : 'bg-stone-800/80 text-stone-400 hover:text-stone-200 hover:bg-stone-700/60'
              }`}
            >
              <div className="font-sans font-medium text-sm">{rec.eraDisplayName}</div>
              <div className="text-[11px] opacity-80">{rec.dateRange}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Active Record Details */}
      {activeRecord && (
        <div className="space-y-6">
          {/* Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-stone-900 border border-stone-800 rounded-xl p-5 space-y-3">
              <div className="flex justify-between items-center text-xs font-mono text-stone-400">
                <span>Emotional Intensity</span>
                <span className="text-amber-400 font-bold">{activeRecord.intensityScore} / 100</span>
              </div>
              <div className="w-full bg-stone-800 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-amber-500 h-full rounded-full transition-all"
                  style={{ width: `${activeRecord.intensityScore}%` }}
                />
              </div>
              <p className="text-[11px] text-stone-500">Degree of visceral sensory & neurological charge.</p>
            </div>

            <div className="bg-stone-900 border border-stone-800 rounded-xl p-5 space-y-3">
              <div className="flex justify-between items-center text-xs font-mono text-stone-400">
                <span>Neurochemical Exhaustion</span>
                <span className="text-rose-400 font-bold">{activeRecord.exhaustionScore} / 100</span>
              </div>
              <div className="w-full bg-stone-800 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-rose-500 h-full rounded-full transition-all"
                  style={{ width: `${activeRecord.exhaustionScore}%` }}
                />
              </div>
              <p className="text-[11px] text-stone-500">Depletion of cognitive and conversational battery.</p>
            </div>

            <div className="bg-stone-900 border border-stone-800 rounded-xl p-5 space-y-3">
              <div className="flex justify-between items-center text-xs font-mono text-stone-400">
                <span>Withdrawal / Cave Mode Tendency</span>
                <span className="text-purple-400 font-bold">{activeRecord.withdrawalTendency} / 100</span>
              </div>
              <div className="w-full bg-stone-800 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-purple-500 h-full rounded-full transition-all"
                  style={{ width: `${activeRecord.withdrawalTendency}%` }}
                />
              </div>
              <p className="text-[11px] text-stone-500">Impulse to shut down communication to preserve baseline.</p>
            </div>
          </div>

          {/* Qualitative Synthesis & Four-Layer Distinction */}
          <div className="bg-stone-900 border border-stone-800 rounded-xl p-6 space-y-6">
            <h2 className="text-lg font-serif text-stone-100 border-b border-stone-800 pb-3">
              Four-Layer Observation vs. Interpretation Breakdown
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-5 bg-stone-950/70 border border-stone-800 rounded-xl space-y-2">
                <span className="text-xs font-mono uppercase tracking-wider text-amber-400 font-semibold block">
                  1. Creator-Expressed Emotion (Direct Evidence)
                </span>
                <p className="text-stone-200 text-sm leading-relaxed">{activeRecord.creatorExpressedMood}</p>
                <span className="text-[11px] text-stone-500 font-mono block pt-1">Directly extracted from raw journals and transcripts</span>
              </div>

              <div className="p-5 bg-stone-950/70 border border-stone-800 rounded-xl space-y-2">
                <span className="text-xs font-mono uppercase tracking-wider text-sky-400 font-semibold block">
                  2. AI-Detected Signals (Hypothesis Layer)
                </span>
                <div className="flex flex-wrap gap-2 pt-1">
                  {activeRecord.aiDetectedSignals.map((sig, idx) => (
                    <span key={idx} className="px-2.5 py-1 bg-sky-950/40 border border-sky-800/50 text-sky-300 text-xs rounded-md">
                      {sig}
                    </span>
                  ))}
                </div>
                <span className="text-[11px] text-stone-500 font-mono block pt-1">Automated lexical and cadence detection</span>
              </div>

              <div className="p-5 bg-stone-950/70 border border-stone-800 rounded-xl space-y-2">
                <span className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-semibold block">
                  3. Creator-Confirmed State (Authoritative Knowledge)
                </span>
                <p className="text-stone-200 text-sm leading-relaxed">{activeRecord.creatorConfirmedState}</p>
                <span className="text-[11px] text-stone-500 font-mono block pt-1">Ratified by creator during review</span>
              </div>

              <div className="p-5 bg-stone-950/70 border border-stone-800 rounded-xl space-y-2">
                <span className="text-xs font-mono uppercase tracking-wider text-stone-400 font-semibold block">
                  4. Dominant Life Focus & Uncertainty
                </span>
                <p className="text-stone-200 text-sm leading-relaxed">{activeRecord.dominantFocus}</p>
                <div className="flex items-center gap-2 pt-2 text-xs font-mono text-stone-400">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Era span: {activeRecord.dateRange}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
