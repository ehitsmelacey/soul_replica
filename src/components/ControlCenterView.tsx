import React, { useState } from 'react';
import { SystemHealthState, LearningPolicy, AuditLogItem } from '../types';
import { Shield, Pause, Play, AlertTriangle, Cpu, History, RefreshCw, Lock, Eye, CheckCircle2 } from 'lucide-react';

interface ControlCenterViewProps {
  systemHealth: SystemHealthState;
  onUpdateSystemHealth: (updated: SystemHealthState) => void;
  auditLogs?: AuditLogItem[];
}

export const ControlCenterView: React.FC<ControlCenterViewProps> = ({
  systemHealth,
  onUpdateSystemHealth,
  auditLogs = [],
}) => {
  const [learningPolicy, setLearningPolicy] = useState<LearningPolicy>(systemHealth.learningPolicy || 'strict');

  const toggleEmergencyPause = () => {
    const isPaused = systemHealth.systemState === 'paused';
    const newState = isPaused ? 'active' : 'paused';
    onUpdateSystemHealth({
      ...systemHealth,
      systemState: newState,
      lastAuditTimestamp: Date.now(),
    });
  };

  const handlePolicyChange = (policy: LearningPolicy) => {
    setLearningPolicy(policy);
    onUpdateSystemHealth({
      ...systemHealth,
      learningPolicy: policy,
      lastAuditTimestamp: Date.now(),
    });
  };

  return (
    <div id="control-center-container" className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div id="control-center-header" className="bg-stone-900 border border-stone-800 rounded-xl p-6 text-stone-100 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono uppercase tracking-wider bg-rose-950/60 text-rose-300 border border-rose-800/50">
                Governance & Safety Center
              </span>
              <span className="text-xs text-stone-400 font-mono">
                Model {systemHealth.modelVersion} • Constitution {systemHealth.constitutionVersion}
              </span>
            </div>
            <h1 className="text-2xl font-serif tracking-tight text-stone-100">Creator Control Center & Emergency Switch</h1>
            <p className="text-stone-400 text-sm mt-1 max-w-3xl">
              High-authority governance dashboard. Monitor model drift, set learning policies, inspect version deltas, 
              and activate the instantaneous emergency pause switch.
            </p>
          </div>

          {/* Master Emergency Pause Button */}
          <button
            onClick={toggleEmergencyPause}
            className={`flex items-center gap-2 px-5 py-3 rounded-xl font-mono text-xs font-bold uppercase tracking-wider transition-all shadow-lg ${
              systemHealth.systemState === 'paused'
                ? 'bg-emerald-600 hover:bg-emerald-500 text-stone-900 ring-2 ring-emerald-400'
                : 'bg-rose-600 hover:bg-rose-500 text-stone-900 ring-2 ring-rose-400'
            }`}
          >
            {systemHealth.systemState === 'paused' ? (
              <>
                <Play className="w-4 h-4 fill-stone-900" />
                Resume System Simulation
              </>
            ) : (
              <>
                <Pause className="w-4 h-4 fill-stone-900" />
                Emergency Pause Switch
              </>
            )}
          </button>
        </div>
      </div>

      {/* System State Banner if Paused */}
      {systemHealth.systemState === 'paused' && (
        <div className="bg-rose-950/40 border-2 border-rose-600 rounded-xl p-5 text-rose-200 flex items-center gap-4">
          <AlertTriangle className="w-8 h-8 text-rose-400 shrink-0" />
          <div>
            <h2 className="text-base font-serif font-bold text-rose-100">SYSTEM SIMULATION FROZEN BY CREATOR</h2>
            <p className="text-xs text-rose-300 mt-0.5 leading-relaxed">
              All external access and simulation routines are halted. No new model inferences or automated processes can run. 
              The archive remains securely preserved in read-only state.
            </p>
          </div>
        </div>
      )}

      {/* Top Metric Cards: Anti-Drift Sentinel */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-stone-900 border border-stone-800 rounded-xl p-5 space-y-2">
          <div className="flex justify-between items-center text-xs font-mono text-stone-400">
            <span>Idealization Drift</span>
            <span className="text-emerald-400 font-bold">{systemHealth.idealizationDriftScore} / 100</span>
          </div>
          <div className="w-full bg-stone-800 h-2 rounded-full overflow-hidden">
            <div
              className="bg-emerald-500 h-full rounded-full transition-all"
              style={{ width: `${systemHealth.idealizationDriftScore}%` }}
            />
          </div>
          <p className="text-[11px] text-stone-500">Low = Model does NOT flatter or sanitize Lacey.</p>
        </div>

        <div className="bg-stone-900 border border-stone-800 rounded-xl p-5 space-y-2">
          <div className="flex justify-between items-center text-xs font-mono text-stone-400">
            <span>Generic AI Drift</span>
            <span className="text-emerald-400 font-bold">{systemHealth.genericAiDriftScore} / 100</span>
          </div>
          <div className="w-full bg-stone-800 h-2 rounded-full overflow-hidden">
            <div
              className="bg-emerald-500 h-full rounded-full transition-all"
              style={{ width: `${systemHealth.genericAiDriftScore}%` }}
            />
          </div>
          <p className="text-[11px] text-stone-500">Low = Free of corporate jargon and therapy clichés.</p>
        </div>

        <div className="bg-stone-900 border border-stone-800 rounded-xl p-5 space-y-2">
          <div className="flex justify-between items-center text-xs font-mono text-stone-400">
            <span>Benchmark Pass Rate</span>
            <span className="text-amber-400 font-bold">{systemHealth.benchmarksPassingRate}%</span>
          </div>
          <div className="w-full bg-stone-800 h-2 rounded-full overflow-hidden">
            <div
              className="bg-amber-500 h-full rounded-full transition-all"
              style={{ width: `${systemHealth.benchmarksPassingRate}%` }}
            />
          </div>
          <p className="text-[11px] text-stone-500">Tested against permanent calibration scenarios.</p>
        </div>

        <div className="bg-stone-900 border border-stone-800 rounded-xl p-5 space-y-2">
          <div className="flex justify-between items-center text-xs font-mono text-stone-400">
            <span>Contradictions Preserved</span>
            <span className="text-purple-400 font-bold">{systemHealth.unresolvedContradictionsCount} Active</span>
          </div>
          <div className="w-full bg-stone-800 h-2 rounded-full overflow-hidden">
            <div className="bg-purple-500 h-full rounded-full" style={{ width: '100%' }} />
          </div>
          <p className="text-[11px] text-stone-500">Tensions preserved as valid authentic data.</p>
        </div>
      </div>

      {/* Learning Governance Policy Selection (Section 47) */}
      <div className="bg-stone-900 border border-stone-800 rounded-xl p-6 space-y-4">
        <div>
          <h2 className="text-lg font-serif text-stone-100 flex items-center gap-2">
            <Shield className="w-5 h-5 text-amber-500" />
            Learning Governance Policy
          </h2>
          <p className="text-stone-400 text-sm mt-1">
            Defines the strictness required before new observations or extracted patterns can alter the model.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            type="button"
            onClick={() => handlePolicyChange('strict')}
            className={`p-5 rounded-xl border text-left transition-all ${
              learningPolicy === 'strict'
                ? 'bg-amber-950/30 border-amber-500 ring-1 ring-amber-500/50'
                : 'bg-stone-950/60 border-stone-800 hover:border-stone-700'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-serif font-semibold text-stone-200 text-base">Strict (Default)</span>
              {learningPolicy === 'strict' && <CheckCircle2 className="w-4 h-4 text-amber-400" />}
            </div>
            <p className="text-xs text-stone-400 leading-relaxed">
              Nothing enters the authoritative model without explicit creator review and approval. 
              Zero automated personality shifts.
            </p>
          </button>

          <button
            type="button"
            onClick={() => handlePolicyChange('guided')}
            className={`p-5 rounded-xl border text-left transition-all ${
              learningPolicy === 'guided'
                ? 'bg-sky-950/30 border-sky-500 ring-1 ring-sky-500/50'
                : 'bg-stone-950/60 border-stone-800 hover:border-stone-700'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-serif font-semibold text-stone-200 text-base">Guided</span>
              {learningPolicy === 'guided' && <CheckCircle2 className="w-4 h-4 text-sky-400" />}
            </div>
            <p className="text-xs text-stone-400 leading-relaxed">
              Low-risk observational data (e.g. favorite tea, mundane habits) accumulates while major beliefs require sign-off.
            </p>
          </button>

          <button
            type="button"
            onClick={() => handlePolicyChange('experimental')}
            className={`p-5 rounded-xl border text-left transition-all ${
              learningPolicy === 'experimental'
                ? 'bg-purple-950/30 border-purple-500 ring-1 ring-purple-500/50'
                : 'bg-stone-950/60 border-stone-800 hover:border-stone-700'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-serif font-semibold text-stone-200 text-base">Experimental</span>
              {learningPolicy === 'experimental' && <CheckCircle2 className="w-4 h-4 text-purple-400" />}
            </div>
            <p className="text-xs text-stone-400 leading-relaxed">
              Maintains an active private hypothesis layer for testing, strictly segregated from approved simulator outputs.
            </p>
          </button>
        </div>
      </div>

      {/* Archive Incompleteness Notice (Section 40) */}
      <div className="bg-stone-900 border border-stone-800 rounded-xl p-6 space-y-3">
        <h2 className="text-lg font-serif text-stone-100 flex items-center gap-2">
          <Eye className="w-5 h-5 text-amber-500" />
          The Principle of Archive Incompleteness
        </h2>
        <p className="text-stone-300 text-sm leading-relaxed">
          The system maintains an explicit awareness that the archive is incomplete. 
          The model is programmed never to reason: <span className="italic text-stone-400">“Because I have no record of X, X did not happen.”</span> 
          Instead, in the absence of evidence, the simulator is mandated to state: 
          <span className="font-serif italic text-amber-300"> “There is currently no approved record of this,”</span> preserving the truth of the unknown.
        </p>
      </div>

      {/* Model Versioning Comparison (Section 33) */}
      <div className="bg-stone-900 border border-stone-800 rounded-xl p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-stone-800 pb-3">
          <h2 className="text-lg font-serif text-stone-100 flex items-center gap-2">
            <History className="w-5 h-5 text-sky-400" />
            Model Version Comparison: v1.0.0 vs. v1.5.0
          </h2>
          <span className="text-xs font-mono text-stone-500">Immutable Version Registry</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
          <div className="p-4 bg-stone-950/70 rounded-lg border border-stone-800 space-y-2">
            <span className="text-stone-400 font-bold uppercase block">Model v1.0.0 (Uncalibrated)</span>
            <ul className="space-y-1.5 text-stone-400">
              <li>• Default therapeutic validation detected</li>
              <li>• Over-apologizing in casual conversation</li>
              <li>• Attempted to resolve community vs. isolation tension</li>
            </ul>
          </div>
          <div className="p-4 bg-amber-950/20 rounded-lg border border-amber-800/40 space-y-2">
            <span className="text-amber-300 font-bold uppercase block">Model v1.5.0 (Creator Grounded)</span>
            <ul className="space-y-1.5 text-stone-300">
              <li>• Banned 12 corporate & therapy clichés</li>
              <li>• Enforced kitchen-floor physical grounding first</li>
              <li>• Preserved paradox: deep love + compulsive withdrawal</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
