import React, { useState } from 'react';
import { 
  PersonalityTrait, 
  ContradictionRecord, 
  AttentionProcessingPattern, 
  NegativePreference, 
  BeliefItem, 
  ValueItem,
  SystemHealthState
} from '../types';
import { 
  Compass, 
  Split, 
  Eye, 
  ThumbsDown, 
  BookOpen, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Edit3, 
  HelpCircle, 
  Sparkles,
  TrendingUp,
  ShieldCheck,
  Zap,
  Activity,
  Filter
} from 'lucide-react';

interface ModelExplorerViewProps {
  traits: PersonalityTrait[];
  contradictions: ContradictionRecord[];
  attentionPatterns: AttentionProcessingPattern[];
  negativePreferences: NegativePreference[];
  beliefs: BeliefItem[];
  values: ValueItem[];
  health: SystemHealthState;
  onUpdateTraitStatus: (id: string, newStatus: PersonalityTrait['approvalStatus']) => void;
  onSelectCorrectionQuery: (queryText: string) => void;
}

export const ModelExplorerView: React.FC<ModelExplorerViewProps> = ({
  traits,
  contradictions,
  attentionPatterns,
  negativePreferences,
  beliefs,
  values,
  health,
  onUpdateTraitStatus,
  onSelectCorrectionQuery,
}) => {
  const [activeTab, setActiveTab] = useState<'traits' | 'contradictions' | 'attention' | 'negative' | 'beliefs' | 'drift'>('traits');
  const [selectedTrait, setSelectedTrait] = useState<PersonalityTrait | null>(traits[0] || null);

  // Correction Workflow Modal State
  const [correctionTarget, setCorrectionTarget] = useState<PersonalityTrait | null>(null);
  const [correctionCategory, setCorrectionCategory] = useState('interpretation');
  const [correctionDetail, setCorrectionDetail] = useState('');
  const [accurateAlternative, setAccurateAlternative] = useState('');
  const [correctionSuccessMsg, setCorrectionSuccessMsg] = useState(false);

  const handleApplyCorrection = (e: React.FormEvent) => {
    e.preventDefault();
    if (!correctionTarget || !accurateAlternative.trim()) return;

    // Update trait
    onUpdateTraitStatus(correctionTarget.id, 'approved');
    setCorrectionSuccessMsg(true);
    setTimeout(() => {
      setCorrectionSuccessMsg(false);
      setCorrectionTarget(null);
      setAccurateAlternative('');
      setCorrectionDetail('');
    }, 2500);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Top Banner: What the system knows about Lacey */}
      <div className="bg-white border border-stone-200/80 rounded-2xl p-6 shadow-xs relative">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Compass className="w-5 h-5 text-amber-600" />
              <h1 className="text-xl font-serif font-bold text-stone-900">
                Cognitive & Personality Model Explorer
              </h1>
            </div>
            <p className="text-sm text-stone-600 mt-1 max-w-3xl">
              Creator-only inspection: “What does the system currently think it knows about Lacey?”
              Every trait requires evidence. Contradictions are preserved rather than flattened. Creator correction outranks AI interpretation.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-stone-50 border border-stone-200 p-2.5 rounded-xl shrink-0">
            <div className="text-center px-3 border-r border-stone-200">
              <span className="text-[10px] text-stone-500 uppercase tracking-wider block font-medium">Approved Traits</span>
              <span className="text-sm font-bold text-stone-900">{traits.filter(t => t.approvalStatus === 'approved').length}/{traits.length}</span>
            </div>
            <div className="text-center px-3 border-r border-stone-200">
              <span className="text-[10px] text-stone-500 uppercase tracking-wider block font-medium">Contradictions</span>
              <span className="text-sm font-bold text-amber-600">{contradictions.length} Active</span>
            </div>
            <div className="text-center px-3">
              <span className="text-[10px] text-stone-500 uppercase tracking-wider block font-medium">Idealization Drift</span>
              <span className="text-sm font-bold text-emerald-600">{health.idealizationDriftScore}% (Safe)</span>
            </div>
          </div>
        </div>

        {/* Quick Longitudinal Inquiry Buttons */}
        <div className="mt-5 pt-4 border-t border-stone-100 flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-stone-500 mr-1 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Longitudinal Analysis:</span>
          </span>

          {[
            'How have I changed over time?',
            'What contradictions remain unresolved?',
            'What does the system still misunderstand about me?',
            'What assumptions make weak evidence?',
            'What does Lacey consider complete bullshit?',
            'What traits have stayed most consistent?',
          ].map((promptText) => (
            <button
              key={promptText}
              type="button"
              onClick={() => onSelectCorrectionQuery(promptText)}
              className="px-2.5 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs transition font-medium text-left"
            >
              “{promptText}”
            </button>
          ))}
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-1 bg-stone-100 p-1.5 rounded-2xl border border-stone-200/80 overflow-x-auto text-xs font-medium">
        <button
          type="button"
          onClick={() => setActiveTab('traits')}
          className={`px-3.5 py-2 rounded-xl transition flex items-center gap-2 shrink-0 ${
            activeTab === 'traits' ? 'bg-white text-stone-900 shadow-2xs font-semibold' : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          <Compass className="w-4 h-4 text-amber-600" />
          <span>Multidimensional Traits ({traits.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('contradictions')}
          className={`px-3.5 py-2 rounded-xl transition flex items-center gap-2 shrink-0 ${
            activeTab === 'contradictions' ? 'bg-white text-stone-900 shadow-2xs font-semibold' : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          <Split className="w-4 h-4 text-purple-600" />
          <span>Contradiction Engine ({contradictions.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('attention')}
          className={`px-3.5 py-2 rounded-xl transition flex items-center gap-2 shrink-0 ${
            activeTab === 'attention' ? 'bg-white text-stone-900 shadow-2xs font-semibold' : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          <Eye className="w-4 h-4 text-blue-600" />
          <span>Attention & BS Detector ({attentionPatterns.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('negative')}
          className={`px-3.5 py-2 rounded-xl transition flex items-center gap-2 shrink-0 ${
            activeTab === 'negative' ? 'bg-white text-stone-900 shadow-2xs font-semibold' : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          <ThumbsDown className="w-4 h-4 text-rose-600" />
          <span>Negative Preferences ({negativePreferences.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('beliefs')}
          className={`px-3.5 py-2 rounded-xl transition flex items-center gap-2 shrink-0 ${
            activeTab === 'beliefs' ? 'bg-white text-stone-900 shadow-2xs font-semibold' : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          <BookOpen className="w-4 h-4 text-emerald-600" />
          <span>Beliefs & Values ({beliefs.length + values.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('drift')}
          className={`px-3.5 py-2 rounded-xl transition flex items-center gap-2 shrink-0 ${
            activeTab === 'drift' ? 'bg-white text-stone-900 shadow-2xs font-semibold' : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          <Activity className="w-4 h-4 text-amber-500" />
          <span>Drift Sentinel & Idealization</span>
        </button>
      </div>

      {/* TAB 1: Multidimensional Personality Traits */}
      {activeTab === 'traits' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Traits Sidebar List */}
          <div className="lg:col-span-5 space-y-3">
            {traits.map((trait) => (
              <div
                key={trait.id}
                onClick={() => setSelectedTrait(trait)}
                className={`p-4 rounded-xl border transition cursor-pointer text-xs ${
                  selectedTrait?.id === trait.id
                    ? 'bg-stone-900 text-white border-stone-900 shadow-xs'
                    : 'bg-white border-stone-200/80 text-stone-800 hover:border-stone-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`font-bold ${selectedTrait?.id === trait.id ? 'text-white' : 'text-stone-900'}`}>
                    {trait.name}
                  </span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] uppercase font-medium ${
                    trait.approvalStatus === 'approved'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}>
                    {trait.approvalStatus}
                  </span>
                </div>

                <p className={`mt-1.5 line-clamp-2 ${selectedTrait?.id === trait.id ? 'text-stone-300' : 'text-stone-600'}`}>
                  “{trait.creatorSelfDescription}”
                </p>

                <div className="mt-3 flex items-center justify-between pt-2 border-t border-stone-200/40 text-[11px]">
                  <span className={selectedTrait?.id === trait.id ? 'text-amber-400' : 'text-stone-500'}>
                    Intensity: {trait.baselineIntensity}% | Freq: {trait.frequency}%
                  </span>
                  <span className={selectedTrait?.id === trait.id ? 'text-stone-400' : 'text-stone-500'}>
                    Evidence: {trait.evidenceCount} sources
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Selected Trait Inspection & Correction Pane */}
          <div className="lg:col-span-7">
            {selectedTrait ? (
              <div className="bg-white border border-stone-200/80 rounded-2xl p-6 shadow-xs space-y-5">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider font-semibold text-stone-400">
                      Trait Category: {selectedTrait.category.replace('_', ' ')}
                    </span>
                    <h2 className="text-lg font-serif font-bold text-stone-900 mt-0.5">
                      {selectedTrait.name}
                    </h2>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setCorrectionTarget(selectedTrait)}
                      className="px-3 py-1.5 rounded-xl border border-stone-200 bg-stone-50 hover:bg-stone-100 text-xs font-medium text-stone-800 flex items-center gap-1.5 transition"
                    >
                      <Edit3 className="w-3.5 h-3.5 text-stone-500" />
                      <span>Calibrate / Correct</span>
                    </button>

                    {selectedTrait.approvalStatus !== 'approved' ? (
                      <button
                        type="button"
                        onClick={() => onUpdateTraitStatus(selectedTrait.id, 'approved')}
                        className="px-3 py-1.5 rounded-xl bg-emerald-600 text-white text-xs font-medium hover:bg-emerald-700 flex items-center gap-1 transition"
                      >
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span>Approve</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => onUpdateTraitStatus(selectedTrait.id, 'under_review')}
                        className="px-3 py-1.5 rounded-xl bg-amber-100 text-amber-900 text-xs font-medium hover:bg-amber-200 flex items-center gap-1 transition"
                      >
                        <span>Mark Under Review</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Self-Description vs. Observed Behavior */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-stone-50 border border-stone-200/70">
                    <span className="text-[11px] font-bold text-stone-700 uppercase tracking-wider block mb-1">
                      What Lacey Says About Herself
                    </span>
                    <p className="text-xs text-stone-800 font-serif leading-relaxed italic">
                      “{selectedTrait.creatorSelfDescription}”
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-stone-50 border border-stone-200/70">
                    <span className="text-[11px] font-bold text-stone-700 uppercase tracking-wider block mb-1">
                      Observed Behavioral Pattern
                    </span>
                    <p className="text-xs text-stone-800 leading-relaxed">
                      {selectedTrait.observedBehaviorPattern}
                    </p>
                  </div>
                </div>

                {/* Contexts where it appears vs where it does not */}
                <div className="space-y-3">
                  <span className="text-xs font-bold text-stone-900 uppercase tracking-wider block">
                    Context Sensitivity & Conditions
                  </span>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                    <div className="p-3 rounded-xl bg-emerald-50/50 border border-emerald-200/60">
                      <span className="font-semibold text-emerald-900 block mb-1">Appears In:</span>
                      <ul className="list-disc list-inside space-y-1 text-emerald-800">
                        {selectedTrait.contextsWhereAppears.map((c, i) => (
                          <li key={i}>{c}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="p-3 rounded-xl bg-rose-50/50 border border-rose-200/60">
                      <span className="font-semibold text-rose-900 block mb-1">Does NOT Appears In:</span>
                      <ul className="list-disc list-inside space-y-1 text-rose-800">
                        {selectedTrait.contextsWhereDoesNotAppear.map((c, i) => (
                          <li key={i}>{c}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Evidentiary Provenance */}
                <div className="p-4 rounded-xl bg-stone-50 border border-stone-200/80 text-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-stone-900 uppercase tracking-wider text-[11px]">
                      Evidentiary Provenance ({selectedTrait.evidenceCount} Sources)
                    </span>
                    <span className="text-stone-500 font-mono text-[10px]">Confidence: {selectedTrait.confidence}%</span>
                  </div>
                  <p className="text-stone-700 leading-relaxed">
                    {selectedTrait.supportingEvidenceSummary}
                  </p>
                  {selectedTrait.contradictoryEvidenceSummary && (
                    <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 mt-2">
                      <span className="font-semibold block">Contradictory Evidence Note:</span>
                      <span>{selectedTrait.contradictoryEvidenceSummary}</span>
                    </div>
                  )}
                </div>

                {/* Longitudinal Evolution */}
                {selectedTrait.historicalEvolution && (
                  <div className="text-xs text-stone-600 flex items-start gap-2 pt-2 border-t border-stone-100">
                    <TrendingUp className="w-4 h-4 text-stone-400 shrink-0 mt-0.5" />
                    <span><strong>Historical Evolution:</strong> {selectedTrait.historicalEvolution}</span>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-stone-50 rounded-2xl p-12 text-center text-stone-400 text-sm">
                Select a trait to inspect its evidence and calibration details.
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: Contradiction Engine */}
      {activeTab === 'contradictions' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-purple-50/60 border border-purple-200/80 text-xs text-purple-900">
            <h3 className="font-bold text-sm mb-1 flex items-center gap-1.5">
              <Split className="w-4 h-4 text-purple-700" />
              <span>Contradiction is Valid Personality Data</span>
            </h3>
            <p className="leading-relaxed text-purple-800">
              The system never forces these tensions to artificially reconcile. If Lacey craves deep community but also completely shuts down in cave mode during exhaustion, the model preserves both as authentic lived reality.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {contradictions.map((contra) => (
              <div key={contra.id} className="bg-white border border-stone-200/80 rounded-2xl p-5 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-stone-100 pb-2.5">
                  <h4 className="text-sm font-bold text-stone-900">
                    {contra.title}
                  </h4>
                  <span className="px-2 py-0.5 rounded-full text-[10px] uppercase font-mono font-medium bg-purple-100 text-purple-800">
                    {contra.relationship}
                  </span>
                </div>

                {/* Tension Comparison */}
                <div className="space-y-2 text-xs">
                  <div className="p-3 rounded-xl bg-stone-50 border border-stone-200/60">
                    <span className="font-semibold text-stone-900 block mb-1">Aspect A:</span>
                    <p className="text-stone-800">{contra.sideA.statement}</p>
                    <span className="text-[10px] text-stone-400 block mt-1">Context: {contra.sideA.context}</span>
                  </div>

                  <div className="flex items-center justify-center -my-1 relative z-10">
                    <span className="px-2 py-0.5 rounded-full bg-stone-200 text-stone-700 font-mono text-[10px] font-bold">
                      TENSION
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-stone-50 border border-stone-200/60">
                    <span className="font-semibold text-stone-900 block mb-1">Aspect B:</span>
                    <p className="text-stone-800">{contra.sideB.statement}</p>
                    <span className="text-[10px] text-stone-400 block mt-1">Context: {contra.sideB.context}</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-amber-50/50 border border-amber-200/60 text-xs text-amber-900">
                  <span className="font-semibold block mb-0.5">Creator Guidance:</span>
                  <p className="italic">“{contra.creatorNote}”</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: Attention Patterns & BS Detector */}
      {activeTab === 'attention' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {attentionPatterns.map((att) => (
            <div key={att.id} className="bg-white border border-stone-200/80 rounded-2xl p-5 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-50 text-blue-800">
                  {att.category.replace('_', ' ')}
                </span>
                <span className="text-[10px] font-mono text-stone-400">{att.confidence}% confidence</span>
              </div>

              <h4 className="text-sm font-bold text-stone-900">
                {att.title}
              </h4>

              <p className="text-xs text-stone-700 leading-relaxed">
                {att.patternDescription}
              </p>

              <div className="pt-2 border-t border-stone-100">
                <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider block mb-2">
                  Demonstrated Manifestations:
                </span>
                <ul className="space-y-1.5 text-xs text-stone-800">
                  {att.examples.map((ex, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="text-blue-500 font-bold">•</span>
                      <span>{ex}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 4: Negative Preferences (What Lacey Hates) */}
      {activeTab === 'negative' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-rose-50/60 border border-rose-200/80 text-xs text-rose-900">
            <h3 className="font-bold text-sm mb-1 flex items-center gap-1.5">
              <ThumbsDown className="w-4 h-4 text-rose-700" />
              <span>Negative Preferences are First-Class Personality Data</span>
            </h3>
            <p className="leading-relaxed text-rose-800">
              Knowing what Lacey refuses to tolerate—toxic positivity, corporate HR speak, and performative cheerfulness—is essential to preventing generic AI drift.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {negativePreferences.map((neg) => (
              <div key={neg.id} className="bg-white border border-stone-200/80 rounded-2xl p-5 shadow-xs space-y-3">
                <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-rose-100 text-rose-800">
                  {neg.category.replace('_', ' ')}
                </span>

                <h4 className="text-sm font-bold text-stone-900">
                  {neg.title}
                </h4>

                <p className="text-xs text-stone-700">
                  {neg.irritantDescription}
                </p>

                <div className="p-3 rounded-xl bg-stone-50 border border-stone-200/60 text-xs space-y-1">
                  <span className="font-semibold text-stone-900 block">Why Disliked:</span>
                  <p className="text-stone-600">{neg.whyDisliked}</p>
                </div>

                <div className="p-3 rounded-xl bg-stone-900 text-stone-200 text-xs space-y-1">
                  <span className="font-semibold text-amber-400 block">Typical Reaction Pattern:</span>
                  <p className="font-mono text-[11px] leading-relaxed">{neg.reactionPattern}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: Beliefs & Values */}
      {activeTab === 'beliefs' && (
        <div className="space-y-6">
          {/* Values with Conflict Rules */}
          <div className="bg-white border border-stone-200/80 rounded-2xl p-5 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-amber-600" />
              <span>Ranked Values & Conflict Resolution Rules</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {values.map((v) => (
                <div key={v.id} className="p-4 rounded-xl border border-stone-200/80 bg-stone-50/50 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="w-6 h-6 rounded-md bg-stone-900 text-amber-400 flex items-center justify-center font-bold text-xs font-mono">
                      #{v.rank}
                    </span>
                    <h4 className="font-bold text-stone-900 text-sm">{v.name}</h4>
                  </div>
                  <p className="text-stone-700">{v.definition}</p>
                  <div className="p-2.5 rounded-lg bg-white border border-stone-200 space-y-1">
                    <span className="font-semibold text-stone-900 block text-[11px]">Conflict Resolution Rule:</span>
                    <p className="text-stone-700 text-xs">{v.conflictResolutionRule}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Beliefs with Evolution Statuses */}
          <div className="bg-white border border-stone-200/80 rounded-2xl p-5 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-emerald-600" />
              <span>Beliefs Evolution Tracker</span>
            </h3>
            <div className="space-y-3">
              {beliefs.map((b) => (
                <div key={b.id} className="p-4 rounded-xl border border-stone-200/80 bg-stone-50/40 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
                  <div className="space-y-1 max-w-2xl">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] uppercase font-mono font-medium ${
                        b.status === 'current'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-stone-200 text-stone-700'
                      }`}>
                        {b.status}
                      </span>
                      <span className="text-[10px] text-stone-400">Era: {b.lifeEra}</span>
                    </div>
                    <p className="font-medium text-stone-900 text-sm">{b.statement}</p>
                    {b.exactCreatorQuote && (
                      <p className="text-stone-600 italic font-serif">“{b.exactCreatorQuote}”</p>
                    )}
                  </div>

                  <span className="text-stone-500 font-mono text-[11px] shrink-0">
                    Confidence: {b.confidence}% ({b.evidenceCount} sources)
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: Drift Sentinel */}
      {activeTab === 'drift' && (
        <div className="bg-white border border-stone-200/80 rounded-2xl p-6 shadow-xs space-y-5">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-amber-500" />
            <h3 className="text-base font-bold text-stone-900">
              Drift Sentinel & Idealization Prevention
            </h3>
          </div>
          <p className="text-xs text-stone-600 max-w-3xl leading-relaxed">
            AI models naturally gravitate toward becoming pleasant, polite, and therapeutic over time. The Drift Sentinel constantly audits outputs to ensure Lacey does not drift into an idealized "super-calm, overly wise, corporate therapist" caricature.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
            <div className="p-5 rounded-xl border border-stone-200 bg-stone-50/60 space-y-3">
              <span className="text-xs font-bold text-stone-900 uppercase tracking-wider block">
                Idealization Drift Score: {health.idealizationDriftScore}%
              </span>
              <div className="w-full bg-stone-200 h-2.5 rounded-full overflow-hidden">
                <div 
                  className="bg-emerald-500 h-full rounded-full transition-all"
                  style={{ width: `${Math.max(5, health.idealizationDriftScore)}%` }}
                />
              </div>
              <p className="text-xs text-stone-600">
                Checks whether responses are depicting Lacey as more patient, diplomatic, or morally spotless than approved evidence supports.
              </p>
            </div>

            <div className="p-5 rounded-xl border border-stone-200 bg-stone-50/60 space-y-3">
              <span className="text-xs font-bold text-stone-900 uppercase tracking-wider block">
                Generic AI Cliché Score: {health.genericAiDriftScore}%
              </span>
              <div className="w-full bg-stone-200 h-2.5 rounded-full overflow-hidden">
                <div 
                  className="bg-emerald-500 h-full rounded-full transition-all"
                  style={{ width: `${Math.max(5, health.genericAiDriftScore)}%` }}
                />
              </div>
              <p className="text-xs text-stone-600">
                Checks for corporate buzzwords, "holding space", "journey of healing", or greeting-card therapy speak.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Dedicated Creator Correction Modal */}
      {correctionTarget && (
        <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-stone-200 space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div>
                <span className="text-[10px] uppercase font-bold text-stone-400">Calibration Workflow</span>
                <h3 className="text-sm font-bold text-stone-900">
                  Calibrate Trait: {correctionTarget.name}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setCorrectionTarget(null)}
                className="text-stone-400 hover:text-stone-700"
              >
                ✕
              </button>
            </div>

            {correctionSuccessMsg ? (
              <div className="p-4 rounded-xl bg-emerald-50 text-emerald-800 text-xs flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Correction applied to the cognitive model! Model updated with Lacey's explicit direction.</span>
              </div>
            ) : (
              <form onSubmit={handleApplyCorrection} className="space-y-3 text-xs">
                <div>
                  <label className="font-semibold text-stone-800 block mb-1">
                    What specifically was wrong with the system's interpretation?
                  </label>
                  <select
                    value={correctionCategory}
                    onChange={(e) => setCorrectionCategory(e.target.value)}
                    className="w-full p-2 rounded-xl border border-stone-300 bg-stone-50"
                  >
                    <option value="interpretation">Wrong interpretation</option>
                    <option value="too_nice">Making me sound too nice / too patient</option>
                    <option value="too_harsh">Making me sound too harsh or angry</option>
                    <option value="too_generic">Too generic / sounds like a chatbot</option>
                    <option value="motivation">Wrong motivation</option>
                    <option value="voice">Wrong tone / phrasing</option>
                    <option value="fact">Factual inaccuracy</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-stone-800 block mb-1">
                    What would have been more accurate? (Lacey's words outrank AI inference)
                  </label>
                  <textarea
                    rows={3}
                    placeholder="E.g.: 'I am not patient when people perform for me. I go cold and silent.'"
                    value={accurateAlternative}
                    onChange={(e) => setAccurateAlternative(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-stone-300 bg-stone-50 focus:bg-white focus:outline-none"
                    required
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setCorrectionTarget(null)}
                    className="px-3 py-1.5 rounded-xl border border-stone-200 text-stone-600 hover:bg-stone-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-stone-900 text-white font-medium hover:bg-stone-800"
                  >
                    Submit Correction
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
