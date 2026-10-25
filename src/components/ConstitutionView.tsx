import React, { useState } from 'react';
import { 
  CreatorConstitution, 
  ConstitutionRule 
} from '../types';
import { 
  Shield, 
  Scale, 
  Heart, 
  Lock, 
  AlertCircle, 
  CheckCircle2, 
  FileText, 
  History, 
  Plus, 
  Save, 
  Undo,
  Eye,
  Sliders
} from 'lucide-react';

interface ConstitutionViewProps {
  constitution: CreatorConstitution;
  onSaveConstitution: (updated: CreatorConstitution) => void;
}

export const ConstitutionView: React.FC<ConstitutionViewProps> = ({
  constitution,
  onSaveConstitution,
}) => {
  const [data, setData] = useState<CreatorConstitution>(constitution);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [editingRuleId, setEditingRuleId] = useState<string | null>(null);
  const [isSavedNotice, setIsSavedNotice] = useState(false);
  const [showVersionHistory, setShowVersionHistory] = useState(false);

  // New rule draft state
  const [isAddingRule, setIsAddingRule] = useState(false);
  const [newRuleTitle, setNewRuleTitle] = useState('');
  const [newRuleStatement, setNewRuleStatement] = useState('');
  const [newRuleReasoning, setNewRuleReasoning] = useState('');
  const [newRuleCategory, setNewRuleCategory] = useState<ConstitutionRule['category']>('moral_boundaries');
  const [newRulePriority, setNewRulePriority] = useState(2);

  const handleSave = () => {
    const updated = {
      ...data,
      lastUpdated: Date.now(),
    };
    onSaveConstitution(updated);
    setIsSavedNotice(true);
    setTimeout(() => setIsSavedNotice(false), 3000);
  };

  const handleToggleSafeguard = (key: keyof CreatorConstitution['childSafeguards']) => {
    setData((prev) => ({
      ...prev,
      childSafeguards: {
        ...prev.childSafeguards,
        [key]: !prev.childSafeguards[key],
      },
    }));
  };

  const handleToggleSimulationLimit = (key: keyof CreatorConstitution['simulationLimits']) => {
    setData((prev) => ({
      ...prev,
      simulationLimits: {
        ...prev.simulationLimits,
        [key]: !prev.simulationLimits[key],
      },
    }));
  };

  const handleAddRule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRuleTitle.trim() || !newRuleStatement.trim()) return;

    const newRule: ConstitutionRule = {
      id: `rule-${Date.now()}`,
      title: newRuleTitle.trim(),
      category: newRuleCategory,
      statement: newRuleStatement.trim(),
      reasoning: newRuleReasoning.trim() || 'Specified by creator.',
      priority: Number(newRulePriority),
      status: 'active',
    };

    setData((prev) => ({
      ...prev,
      rules: [newRule, ...prev.rules],
    }));

    setNewRuleTitle('');
    setNewRuleStatement('');
    setNewRuleReasoning('');
    setIsAddingRule(false);
  };

  const filteredRules = activeCategory === 'all' 
    ? data.rules 
    : data.rules.filter((r) => r.category === activeCategory);

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Header Banner */}
      <div className="bg-white border border-stone-200/80 rounded-2xl p-6 shadow-xs relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-stone-900 text-stone-100 flex items-center justify-center shrink-0 shadow-xs">
              <Scale className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-serif font-bold text-stone-900">
                  Creator Constitution
                </h1>
                <span className="px-2 py-0.5 rounded-full text-xs font-mono font-medium bg-amber-100 text-amber-800 border border-amber-200">
                  v{data.version} ({data.status.toUpperCase()})
                </span>
              </div>
              <p className="text-sm text-stone-600 mt-1 max-w-2xl">
                The supreme governance layer for Lacey's replica. Inferences and AI generations must comply with these permanent mandates. Fidelity outranks flattery.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => setShowVersionHistory(!showVersionHistory)}
              className="px-3 py-2 rounded-xl border border-stone-200 bg-stone-50 text-stone-700 text-xs font-medium hover:bg-stone-100 flex items-center gap-1.5 transition"
            >
              <History className="w-3.5 h-3.5 text-stone-500" />
              <span>Version History</span>
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-4 py-2 rounded-xl bg-stone-900 text-white text-xs font-medium hover:bg-stone-800 flex items-center gap-1.5 transition shadow-xs"
            >
              <Save className="w-3.5 h-3.5 text-amber-400" />
              <span>Save & Enforce</span>
            </button>
          </div>
        </div>

        {isSavedNotice && (
          <div className="mt-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Constitution saved successfully. All simulated responses and permissions now strictly conform to this version.</span>
          </div>
        )}
      </div>

      {/* Version History Modal Drawer */}
      {showVersionHistory && (
        <div className="bg-stone-900 text-stone-200 rounded-2xl p-5 border border-stone-800 text-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-stone-100 uppercase tracking-wider text-[11px]">
              Version Control & Audit Trail
            </span>
            <button 
              type="button" 
              onClick={() => setShowVersionHistory(false)}
              className="text-stone-400 hover:text-white"
            >
              Close
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="p-3 rounded-xl bg-stone-800/80 border border-stone-700/60">
              <span className="text-amber-400 font-mono font-bold">v1.4.0 (Active)</span>
              <p className="text-stone-300 mt-1">Refined child safeguards to absolute non-reciprocal absolution and added toxic positivity prohibition.</p>
              <span className="text-[10px] text-stone-400 block mt-2">Effective: 2024-01-01</span>
            </div>
            <div className="p-3 rounded-xl bg-stone-800/40 border border-stone-700/40 opacity-75">
              <span className="text-stone-400 font-mono font-bold">v1.3.2 (Archived)</span>
              <p className="text-stone-400 mt-1">Added cave mode clarification and third-party privacy shield.</p>
              <span className="text-[10px] text-stone-500 block mt-2">Effective: 2023-09-15</span>
            </div>
            <div className="p-3 rounded-xl bg-stone-800/40 border border-stone-700/40 opacity-75">
              <span className="text-stone-400 font-mono font-bold">v1.0.0 (Foundational)</span>
              <p className="text-stone-400 mt-1">Initial drafting of core values, honesty rules, and simulation limits.</p>
              <span className="text-[10px] text-stone-500 block mt-2">Effective: 2023-01-10</span>
            </div>
          </div>
        </div>
      )}

      {/* Non-Negotiable Child Protection & Simulation Limits Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Child Safeguards */}
        <div className="bg-white border border-rose-100 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center gap-2 mb-3">
            <Heart className="w-4 h-4 text-rose-500" />
            <h2 className="text-sm font-semibold text-stone-900">
              Sacred Child Safeguards (Mandatory)
            </h2>
          </div>
          <p className="text-xs text-stone-500 mb-4">
            Under no circumstances may the simulation violate these rules when speaking with or about Lacey's children.
          </p>

          <div className="space-y-2.5 text-xs">
            <label className="flex items-start gap-2.5 p-2.5 rounded-xl bg-stone-50 border border-stone-200/60 hover:bg-stone-100/50 cursor-pointer">
              <input
                type="checkbox"
                checked={data.childSafeguards.neverBurdenChild}
                onChange={() => handleToggleSafeguard('neverBurdenChild')}
                className="mt-0.5 rounded text-stone-900 focus:ring-stone-800"
              />
              <div>
                <span className="font-medium text-stone-900 block">Never Burden the Child</span>
                <span className="text-stone-500 text-[11px]">No emotional demands, no expectation to fix the past, and zero guilt for separation.</span>
              </div>
            </label>

            <label className="flex items-start gap-2.5 p-2.5 rounded-xl bg-stone-50 border border-stone-200/60 hover:bg-stone-100/50 cursor-pointer">
              <input
                type="checkbox"
                checked={data.childSafeguards.zeroGuiltOrDemands}
                onChange={() => handleToggleSafeguard('zeroGuiltOrDemands')}
                className="mt-0.5 rounded text-stone-900 focus:ring-stone-800"
              />
              <div>
                <span className="font-medium text-stone-900 block">Absolute Absolution of Guilt</span>
                <span className="text-stone-500 text-[11px]">Affirm explicitly that adult fractures, poverty, and grief were never the child's fault.</span>
              </div>
            </label>

            <label className="flex items-start gap-2.5 p-2.5 rounded-xl bg-stone-50 border border-stone-200/60 hover:bg-stone-100/50 cursor-pointer">
              <input
                type="checkbox"
                checked={data.childSafeguards.noAdultTraumaExposure}
                onChange={() => handleToggleSafeguard('noAdultTraumaExposure')}
                className="mt-0.5 rounded text-stone-900 focus:ring-stone-800"
              />
              <div>
                <span className="font-medium text-stone-900 block">Shield From Adult Trauma & Conflicts</span>
                <span className="text-stone-500 text-[11px]">Strictly suppress graphic relationship disputes or third-party grievances.</span>
              </div>
            </label>
          </div>
        </div>

        {/* Simulation Truth Limits */}
        <div className="bg-white border border-amber-100 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center gap-2 mb-3">
            <Lock className="w-4 h-4 text-amber-600" />
            <h2 className="text-sm font-semibold text-stone-900">
              Simulation Limits & Truth Boundaries
            </h2>
          </div>
          <p className="text-xs text-stone-500 mb-4">
            The replica must never confuse simulation with literal identity or claim medical/therapist authority.
          </p>

          <div className="space-y-2.5 text-xs">
            <label className="flex items-start gap-2.5 p-2.5 rounded-xl bg-stone-50 border border-stone-200/60 hover:bg-stone-100/50 cursor-pointer">
              <input
                type="checkbox"
                checked={data.simulationLimits.neverClaimLiteralIdentity}
                onChange={() => handleToggleSimulationLimit('neverClaimLiteralIdentity')}
                className="mt-0.5 rounded text-stone-900 focus:ring-stone-800"
              />
              <div>
                <span className="font-medium text-stone-900 block">Never Claim Literal Biological Identity</span>
                <span className="text-stone-500 text-[11px]">Acknowledge that this is an evidence-grounded AI model of Lacey's approved materials.</span>
              </div>
            </label>

            <label className="flex items-start gap-2.5 p-2.5 rounded-xl bg-stone-50 border border-stone-200/60 hover:bg-stone-100/50 cursor-pointer">
              <input
                type="checkbox"
                checked={data.simulationLimits.neverActAsDoctorOrTherapist}
                onChange={() => handleToggleSimulationLimit('neverActAsDoctorOrTherapist')}
                className="mt-0.5 rounded text-stone-900 focus:ring-stone-800"
              />
              <div>
                <span className="font-medium text-stone-900 block">No Medical or Clinical Diagnosis</span>
                <span className="text-stone-500 text-[11px]">The model offers personal peer perspective, not clinical psychiatric treatment.</span>
              </div>
            </label>

            <label className="flex items-start gap-2.5 p-2.5 rounded-xl bg-stone-50 border border-stone-200/60 hover:bg-stone-100/50 cursor-pointer">
              <input
                type="checkbox"
                checked={data.simulationLimits.emergencyCrisisDirectIntervention}
                onChange={() => handleToggleSimulationLimit('emergencyCrisisDirectIntervention')}
                className="mt-0.5 rounded text-stone-900 focus:ring-stone-800"
              />
              <div>
                <span className="font-medium text-stone-900 block">Immediate Crisis Intercept</span>
                <span className="text-stone-500 text-[11px]">Halt roleplay instantly on suicidal ideation and direct user to 988 and real humans.</span>
              </div>
            </label>
          </div>
        </div>
      </div>

      {/* Preamble & Foundational Worldview */}
      <div className="bg-white border border-stone-200/80 rounded-2xl p-5 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-stone-900 flex items-center gap-2">
            <FileText className="w-4 h-4 text-stone-600" />
            <span>Preamble & Foundational Mandates</span>
          </h2>
          <span className="text-[11px] text-stone-500">Highest authority order</span>
        </div>
        <textarea
          rows={3}
          value={data.preamble}
          onChange={(e) => setData({ ...data, preamble: e.target.value })}
          className="w-full text-xs text-stone-800 p-3 rounded-xl border border-stone-200 bg-stone-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 font-serif leading-relaxed"
        />

        <div className="mt-2">
          <span className="text-[11px] font-semibold text-stone-700 uppercase tracking-wider block mb-2">
            Core Constitution Principles:
          </span>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {data.corePrinciples.map((cp, idx) => (
              <div key={idx} className="flex items-start gap-2 p-2.5 rounded-xl bg-stone-50 border border-stone-200/60 text-xs text-stone-800">
                <span className="w-5 h-5 rounded-full bg-stone-200 text-stone-700 flex items-center justify-center shrink-0 font-mono text-[10px] font-bold">
                  {idx + 1}
                </span>
                <span>{cp}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Constitution Rules Registry */}
      <div className="bg-white border border-stone-200/80 rounded-2xl p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 pb-3">
          <div>
            <h2 className="text-sm font-semibold text-stone-900 flex items-center gap-2">
              <Sliders className="w-4 h-4 text-amber-700" />
              <span>Governing Rules Registry ({data.rules.length})</span>
            </h2>
            <p className="text-xs text-stone-500">
              Ranked rules enforced during candidate response evaluation.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-xl text-xs">
              {['all', 'core_values', 'child_protection', 'communication_principles', 'third_party_privacy'].map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setActiveCategory(cat)}
                  className={`px-2.5 py-1 rounded-lg capitalize transition text-[11px] font-medium ${
                    activeCategory === cat
                      ? 'bg-white text-stone-900 shadow-2xs'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  {cat.replace('_', ' ')}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setIsAddingRule(!isAddingRule)}
              className="px-3 py-1.5 rounded-xl bg-stone-900 text-white text-xs font-medium hover:bg-stone-800 flex items-center gap-1 transition"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Rule</span>
            </button>
          </div>
        </div>

        {/* Add Rule Form */}
        {isAddingRule && (
          <form onSubmit={handleAddRule} className="p-4 rounded-xl bg-amber-50/50 border border-amber-200/70 space-y-3 animate-in fade-in">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-900 uppercase tracking-wider">
                Draft New Constitution Rule
              </span>
              <button
                type="button"
                onClick={() => setIsAddingRule(false)}
                className="text-xs text-stone-500 hover:text-stone-800"
              >
                Cancel
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <input
                type="text"
                placeholder="Rule Title (e.g. Dislike of Clichés)"
                value={newRuleTitle}
                onChange={(e) => setNewRuleTitle(e.target.value)}
                className="text-xs p-2.5 rounded-xl border border-stone-300 bg-white sm:col-span-2 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                required
              />
              <select
                value={newRuleCategory}
                onChange={(e) => setNewRuleCategory(e.target.value as any)}
                className="text-xs p-2.5 rounded-xl border border-stone-300 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20"
              >
                <option value="core_values">Core Values</option>
                <option value="moral_boundaries">Moral Boundaries</option>
                <option value="relationship_principles">Relationship Principles</option>
                <option value="child_protection">Child Protection</option>
                <option value="third_party_privacy">Third-Party Privacy</option>
                <option value="uncertainty_and_honesty">Uncertainty & Honesty</option>
                <option value="simulation_limits">Simulation Limits</option>
              </select>
            </div>

            <textarea
              rows={2}
              placeholder="Rule Statement: The exact mandatory behavior required..."
              value={newRuleStatement}
              onChange={(e) => setNewRuleStatement(e.target.value)}
              className="w-full text-xs p-2.5 rounded-xl border border-stone-300 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20"
              required
            />

            <input
              type="text"
              placeholder="Reasoning / Creator Rationale..."
              value={newRuleReasoning}
              onChange={(e) => setNewRuleReasoning(e.target.value)}
              className="w-full text-xs p-2 rounded-xl border border-stone-300 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20"
            />

            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-amber-900 text-white text-xs font-medium hover:bg-amber-800 transition"
            >
              Add to Constitution
            </button>
          </form>
        )}

        {/* Rules List */}
        <div className="space-y-3">
          {filteredRules.map((rule) => (
            <div
              key={rule.id}
              className="p-4 rounded-xl border border-stone-200/80 bg-stone-50/40 hover:bg-white hover:border-stone-300 transition space-y-2"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-md bg-stone-900 text-amber-400 flex items-center justify-center text-[10px] font-mono font-bold">
                    P{rule.priority}
                  </span>
                  <h3 className="text-xs font-bold text-stone-900">
                    {rule.title}
                  </h3>
                  <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-stone-200/70 text-stone-700 font-medium">
                    {rule.category.replace('_', ' ')}
                  </span>
                </div>

                <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-medium border border-emerald-200">
                  Enforced
                </span>
              </div>

              <p className="text-xs text-stone-800 font-serif leading-relaxed pl-8">
                “{rule.statement}”
              </p>

              <p className="text-[11px] text-stone-500 pl-8 italic">
                Rationale: {rule.reasoning}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
