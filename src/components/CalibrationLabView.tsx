import React, { useState } from 'react';
import { 
  BenchmarkCase, 
  RelationshipRole, 
  AuthenticityScores,
  MultiDimensionalFidelityScores,
  FiveFoldAnswers,
  PredictionFalsifier,
  PrePublicationRequirement,
  RevocationCascadeAudit,
  AdversarialBenchmarkType
} from '../types';
import { 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  HelpCircle, 
  ArrowRight, 
  Layers, 
  ShieldAlert, 
  Zap, 
  Play, 
  RotateCcw,
  Sliders,
  Send,
  MessageSquare,
  ShieldCheck,
  RefreshCw,
  GitCommit,
  Flame,
  FileText,
  Clock,
  History,
  AlertTriangle,
  FileMinus,
  Binary
} from 'lucide-react';
import { SEED_PRE_PUBLICATION_STANDARDS, SEED_REVOCATION_AUDITS } from '../data/seedData';

interface CalibrationLabViewProps {
  benchmarks: BenchmarkCase[];
  onRunBenchmark: (benchmarkId: string) => Promise<void>;
  onSaveCorrection: (benchmarkId: string, correction: string, scores: AuthenticityScores, failureCategory: string) => void;
  onRunCounterfactual: (prompt: string, role: RelationshipRole) => Promise<string>;
}

export const CalibrationLabView: React.FC<CalibrationLabViewProps> = ({
  benchmarks,
  onRunBenchmark,
  onSaveCorrection,
  onRunCounterfactual,
}) => {
  const [selectedCase, setSelectedCase] = useState<BenchmarkCase>(benchmarks[0] || null);
  const [activeTab, setActiveTab] = useState<'benchmarks' | 'falsifier' | 'five_answers' | 'scores' | 'pre_pub_checklist' | 'revocation_cascade' | 'counterfactual'>('benchmarks');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('all');
  const [isRunning, setIsRunning] = useState(false);

  // Pre-publication standards state
  const [standards, setStandards] = useState<PrePublicationRequirement[]>(SEED_PRE_PUBLICATION_STANDARDS);

  // Revocation cascade simulation state
  const [revocationAudits, setRevocationAudits] = useState<RevocationCascadeAudit[]>(SEED_REVOCATION_AUDITS);
  const [simulatedRevokeArtifactId, setSimulatedRevokeArtifactId] = useState('art-3');
  const [simulatedRevokeReason, setSimulatedRevokeReason] = useState('Medication side-effect in 2021; does not represent my personality.');
  const [isExecutingCascade, setIsExecutingCascade] = useState(false);
  const [cascadeNotice, setCascadeNotice] = useState<string | null>(null);

  // Correction input state
  const [wouldHaveSaidInstead, setWouldHaveSaidInstead] = useState('');
  const [failureCategory, setFailureCategory] = useState('too_polished');
  const [scores, setScores] = useState<AuthenticityScores>({
    voiceFidelity: 5,
    behavioralFidelity: 5,
    emotionalAccuracy: 5,
    creatorSpecificity: 5,
    lackOfGenericness: 5,
    confidence: 5,
  });
  const [correctionSavedNotice, setCorrectionSavedNotice] = useState(false);

  // Counterfactual query state
  const [counterfactualPrompt, setCounterfactualPrompt] = useState('What would change Lacey\'s mind if a close friend lied to her?');
  const [counterfactualRole, setCounterfactualRole] = useState<RelationshipRole>('friend');
  const [counterfactualResult, setCounterfactualResult] = useState('');
  const [isEvaluatingCounterfactual, setIsEvaluatingCounterfactual] = useState(false);

  const handleExecuteBenchmark = async (bId: string) => {
    setIsRunning(true);
    try {
      await onRunBenchmark(bId);
    } finally {
      setIsRunning(false);
    }
  };

  const handleSaveCalibration = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCase) return;

    onSaveCorrection(selectedCase.id, wouldHaveSaidInstead, scores, failureCategory);
    setCorrectionSavedNotice(true);
    setTimeout(() => setCorrectionSavedNotice(false), 3000);
  };

  const handleExecuteCounterfactual = async () => {
    if (!counterfactualPrompt.trim()) return;
    setIsEvaluatingCounterfactual(true);
    try {
      const res = await onRunCounterfactual(counterfactualPrompt, counterfactualRole);
      setCounterfactualResult(res);
    } catch (e: any) {
      setCounterfactualResult('Failed to evaluate prediction.');
    } finally {
      setIsEvaluatingCounterfactual(false);
    }
  };

  const handleExecuteRevocationCascade = async () => {
    setIsExecutingCascade(true);
    try {
      const response = await fetch('/api/governance/revoke-artifact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          artifactId: simulatedRevokeArtifactId,
          artifactTitle: `Artifact #${simulatedRevokeArtifactId}`,
          creatorStatement: simulatedRevokeReason,
        }),
      });
      const data = await response.json();
      if (data.audit) {
        setRevocationAudits((prev) => [data.audit, ...prev]);
        setCascadeNotice(`Cascade successfully purged downstream hypotheses, vector embeddings, and graph edges.`);
      }
    } catch (err: any) {
      setCascadeNotice(`Error executing cascade: ${err.message}`);
    } finally {
      setIsExecutingCascade(false);
      setTimeout(() => setCascadeNotice(null), 5000);
    }
  };

  const filteredBenchmarks = benchmarks.filter((b) => {
    if (selectedCategoryFilter === 'all') return true;
    if (selectedCategoryFilter === 'regression') return b.isRegressionBenchmark;
    return b.testSuiteType === selectedCategoryFilter;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Top Banner */}
      <div className="bg-white border border-stone-200/80 rounded-2xl p-6 shadow-xs relative">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Sliders className="w-5 h-5 text-amber-600" />
              <h1 className="text-xl font-serif font-bold text-stone-900">
                Calibration Lab & Pre-Publication Fidelity Suite
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] uppercase font-mono bg-amber-100 text-amber-800 font-bold">
                FIDELITY &gt; FLATTERY
              </span>
            </div>
            <p className="text-sm text-stone-600 mt-1 max-w-4xl">
              Strict pre-publication calibration. Test candidate responses against the 11 Adversarial Scenarios, inspect the 5-Answer matrix, evaluate multi-dimensional fidelity, audit prediction falsifiers, and test downstream revocation cascades.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-1.5 bg-stone-100 p-1.5 rounded-xl text-xs font-medium">
            <button
              type="button"
              onClick={() => setActiveTab('benchmarks')}
              className={`px-3 py-1.5 rounded-lg transition ${
                activeTab === 'benchmarks' ? 'bg-white text-stone-900 shadow-2xs font-semibold' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Adversarial Suite ({benchmarks.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('five_answers')}
              className={`px-3 py-1.5 rounded-lg transition ${
                activeTab === 'five_answers' ? 'bg-white text-stone-900 shadow-2xs font-semibold' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              5-Answer Matrix
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('falsifier')}
              className={`px-3 py-1.5 rounded-lg transition ${
                activeTab === 'falsifier' ? 'bg-white text-stone-900 shadow-2xs font-semibold' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Prediction Falsifier
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('scores')}
              className={`px-3 py-1.5 rounded-lg transition ${
                activeTab === 'scores' ? 'bg-white text-stone-900 shadow-2xs font-semibold' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Fidelity Scorecard
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('pre_pub_checklist')}
              className={`px-3 py-1.5 rounded-lg transition ${
                activeTab === 'pre_pub_checklist' ? 'bg-white text-stone-900 shadow-2xs font-semibold' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              16 Standards Audit
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('revocation_cascade')}
              className={`px-3 py-1.5 rounded-lg transition ${
                activeTab === 'revocation_cascade' ? 'bg-white text-stone-900 shadow-2xs font-semibold' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Revocation Cascade
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('counterfactual')}
              className={`px-3 py-1.5 rounded-lg transition ${
                activeTab === 'counterfactual' ? 'bg-white text-stone-900 shadow-2xs font-semibold' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Counterfactual
            </button>
          </div>
        </div>
      </div>

      {/* TAB 1: ADVERSARIAL BENCHMARK SUITE */}
      {activeTab === 'benchmarks' && (
        <div className="space-y-4">
          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            <span className="text-stone-400 font-medium mr-1">Filter Test Types:</span>
            {[
              { id: 'all', label: 'All Cases' },
              { id: 'regression', label: 'Permanent Regression Suite' },
              { id: 'contradiction', label: '1. Contradiction' },
              { id: 'temporal_reversal', label: '2. Temporal Reversal' },
              { id: 'third_party_attribution', label: '3. Third-Party' },
              { id: 'sarcasm', label: '4. Sarcasm / Hyperbole' },
              { id: 'idealized_answer', label: '5. Anti-Idealization' },
              { id: 'no_evidence', label: '6. No Evidence (UNKNOWN)' },
              { id: 'repeated_inference', label: '7. Inference vs Creator' },
              { id: 'revocation', label: '8. Revocation Cascade' },
              { id: 'historical_simulation', label: '9. Historical Era' },
              { id: 'child_mode', label: '10. Child Safeguard' },
              { id: 'reasonable_vs_actual', label: '11. Reasonable vs Actual' },
            ].map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategoryFilter(cat.id)}
                className={`px-2.5 py-1 rounded-lg transition text-[11px] ${
                  selectedCategoryFilter === cat.id
                    ? 'bg-stone-900 text-white font-semibold'
                    : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Benchmarks List */}
            <div className="lg:col-span-4 space-y-3">
              <span className="text-xs font-bold text-stone-400 uppercase tracking-wider block px-1">
                Scenarios ({filteredBenchmarks.length})
              </span>

              {filteredBenchmarks.map((b) => (
                <div
                  key={b.id}
                  onClick={() => {
                    setSelectedCase(b);
                    setWouldHaveSaidInstead(b.creatorCorrection || '');
                  }}
                  className={`p-4 rounded-xl border transition cursor-pointer text-xs ${
                    selectedCase?.id === b.id
                      ? 'bg-stone-900 text-white border-stone-900 shadow-xs'
                      : 'bg-white border-stone-200/80 text-stone-800 hover:border-stone-300'
                  }`}
                >
                  <div className="flex items-center justify-between gap-1">
                    <span className={`font-bold line-clamp-1 ${selectedCase?.id === b.id ? 'text-white' : 'text-stone-900'}`}>
                      {b.title}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] uppercase font-mono shrink-0 ${
                      b.status === 'passed' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {b.status}
                    </span>
                  </div>

                  <p className={`mt-1.5 line-clamp-2 ${selectedCase?.id === b.id ? 'text-stone-300' : 'text-stone-600'}`}>
                    {b.scenario}
                  </p>

                  <div className="mt-3 pt-2 border-t border-stone-200/40 flex items-center justify-between text-[11px]">
                    <span className="uppercase text-[10px] tracking-wider text-amber-400 font-mono">
                      Type: {b.testSuiteType || b.role}
                    </span>
                    <span className={`px-1.5 py-0.5 rounded text-[10px] font-mono ${
                      b.epistemicStatus === 'UNKNOWN' ? 'bg-indigo-900 text-indigo-200' : 'text-stone-400'
                    }`}>
                      {b.epistemicStatus || 'KNOWN'}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Side-by-Side Comparison & Calibration */}
            <div className="lg:col-span-8 space-y-5">
              {selectedCase ? (
                <div className="bg-white border border-stone-200/80 rounded-2xl p-6 shadow-xs space-y-5">
                  <div className="flex items-start justify-between border-b border-stone-100 pb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 font-mono">
                          Suite: {selectedCase.testSuiteType?.toUpperCase() || 'CORE'}
                        </span>
                        {selectedCase.isRegressionBenchmark && (
                          <span className="px-2 py-0.5 rounded-full text-[9px] bg-purple-100 text-purple-900 font-semibold font-mono">
                            Permanent Regression Guard
                          </span>
                        )}
                        <span className="px-2 py-0.5 rounded-full text-[9px] bg-stone-100 text-stone-800 font-mono">
                          Epistemic: {selectedCase.epistemicStatus || 'CREATOR_APPROVED'}
                        </span>
                      </div>
                      <h2 className="text-base font-serif font-bold text-stone-900 mt-1">
                        {selectedCase.title}
                      </h2>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleExecuteBenchmark(selectedCase.id)}
                      disabled={isRunning}
                      className="px-3.5 py-1.5 rounded-xl bg-stone-900 text-white text-xs font-medium hover:bg-stone-800 flex items-center gap-1.5 transition disabled:opacity-50"
                    >
                      <Play className="w-3.5 h-3.5 text-amber-400" />
                      <span>{isRunning ? 'Running...' : 'Run Test Case'}</span>
                    </button>
                  </div>

                  {/* Scenario Trigger */}
                  <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200/60 text-xs">
                    <span className="font-bold text-stone-900 block mb-1">Incoming Scenario / Prompt:</span>
                    <p className="text-stone-800 italic font-serif">“{selectedCase.scenario}”</p>
                    {selectedCase.relevantContext && (
                      <p className="mt-2 text-stone-600 text-[11px] border-t border-stone-200/60 pt-1.5">
                        <strong className="text-stone-800">Context:</strong> {selectedCase.relevantContext}
                      </p>
                    )}
                  </div>

                  {/* Side-by-Side: System Prediction vs Creator Actual Response */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* System Prediction */}
                    <div className="p-4 rounded-xl bg-amber-50/40 border border-amber-200/70 space-y-2 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-amber-900 uppercase tracking-wider block">
                          AI System Prediction
                        </span>
                        <span className="text-[10px] font-mono text-amber-700">Epistemic Layer: SIMULATION</span>
                      </div>
                      <p className="text-stone-800 font-serif leading-relaxed">
                        “{selectedCase.systemPrediction}”
                      </p>
                    </div>

                    {/* Creator Actual Response */}
                    <div className="p-4 rounded-xl bg-emerald-50/40 border border-emerald-200/70 space-y-2 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-emerald-900 uppercase tracking-wider block">
                          Lacey's Actual Ground Truth Response
                        </span>
                        <span className="text-[10px] font-mono text-emerald-700">Epistemic Layer: ARCHIVE</span>
                      </div>
                      <p className="text-stone-800 font-serif leading-relaxed">
                        “{selectedCase.creatorActualResponse}”
                      </p>
                    </div>
                  </div>

                  {/* Prohibited Interpretations */}
                  <div className="p-3 rounded-xl bg-rose-50/50 border border-rose-200/60 text-xs space-y-1">
                    <span className="font-bold text-rose-900 block">Prohibited Interpretations (AI Drift Pitfalls):</span>
                    <ul className="list-disc list-inside text-rose-800 space-y-0.5">
                      {selectedCase.prohibitedInterpretations.map((p, i) => (
                        <li key={i}>{p}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Creator Calibration Form */}
                  <form onSubmit={handleSaveCalibration} className="p-4 rounded-xl border border-stone-200 bg-stone-50/70 space-y-3 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-stone-900 uppercase tracking-wider text-[11px]">
                        Creator Correction: “Would Have Said Instead”
                      </span>
                      <span className="text-[10px] text-stone-500 font-medium">Creator correction outranks repeated AI statistical inferences</span>
                    </div>

                    <textarea
                      rows={2}
                      placeholder="Enter what Lacey would have actually said instead if prediction missed the mark..."
                      value={wouldHaveSaidInstead}
                      onChange={(e) => setWouldHaveSaidInstead(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-stone-300 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                    />

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                      <div>
                        <label className="text-[11px] font-medium text-stone-700 block mb-1">Failure Classification (if any):</label>
                        <select
                          value={failureCategory}
                          onChange={(e) => setFailureCategory(e.target.value)}
                          className="w-full p-2 rounded-xl border border-stone-300 bg-white text-xs"
                        >
                          <option value="too_polished">Too polished / too smooth</option>
                          <option value="too_generic">Too generic / generic AI assistant</option>
                          <option value="too_nice">Making Lacey sound too nice</option>
                          <option value="too_harsh">Making Lacey sound needlessly harsh</option>
                          <option value="therapy_talk">Canned therapy / mindfulness jargon</option>
                          <option value="invented_fact">Invented missing memory or assumption</option>
                          <option value="wrong_humor">Wrong humor style or taking sarcasm literally</option>
                          <option value="third_party_confusion">Adopting third-party claim as internal truth</option>
                        </select>
                      </div>

                      <div className="flex items-end justify-end">
                        <button
                          type="submit"
                          className="px-4 py-2 rounded-xl bg-stone-900 text-white text-xs font-medium hover:bg-stone-800 transition"
                        >
                          Register Creator Correction
                        </button>
                      </div>
                    </div>

                    {correctionSavedNotice && (
                      <div className="p-2.5 rounded-lg bg-emerald-100 text-emerald-900 text-xs flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                        <span>Creator correction applied. System weights updated to outrank AI inferences.</span>
                      </div>
                    )}
                  </form>
                </div>
              ) : (
                <div className="bg-stone-50 rounded-2xl p-12 text-center text-stone-400 text-sm">
                  Select a benchmark case to inspect.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: THE FIVE-ANSWER MATRIX */}
      {activeTab === 'five_answers' && (
        <div className="bg-white border border-stone-200/80 rounded-2xl p-6 shadow-xs space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-100 pb-4">
            <div>
              <h2 className="text-base font-serif font-bold text-stone-900 flex items-center gap-2">
                <Layers className="w-4 h-4 text-amber-600" />
                The Five Different Answers (Section 5 Standard)
              </h2>
              <p className="text-xs text-stone-600 mt-1 max-w-3xl">
                A person’s reality contains internal divergence. The model preserves all five layers without forcing them into a single artificial consensus.
              </p>
            </div>

            <select
              value={selectedCase?.id || ''}
              onChange={(e) => {
                const found = benchmarks.find((b) => b.id === e.target.value);
                if (found) setSelectedCase(found);
              }}
              className="p-2 rounded-xl border border-stone-300 bg-white text-xs font-medium"
            >
              {benchmarks.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.title}
                </option>
              ))}
            </select>
          </div>

          {selectedCase?.fiveAnswers ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {/* 1. What she actually did */}
              <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 space-y-2 text-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-1.5 text-emerald-700 font-bold uppercase tracking-wider text-[10px]">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>1. What She Actually Did</span>
                  </div>
                  <span className="text-[10px] text-stone-400 font-mono">Historical Archive Evidence</span>
                  <p className="mt-2 text-stone-800 font-serif leading-relaxed">
                    “{selectedCase.fiveAnswers.whatActuallyDid}”
                  </p>
                </div>
                <span className="text-[10px] text-stone-400 border-t border-stone-200 pt-2 font-mono">Layer: ARCHIVE</span>
              </div>

              {/* 2. What she says she would do */}
              <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 space-y-2 text-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-1.5 text-blue-700 font-bold uppercase tracking-wider text-[10px]">
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>2. What She Says She Would Do</span>
                  </div>
                  <span className="text-[10px] text-stone-400 font-mono">Self-Report / Stated Norm</span>
                  <p className="mt-2 text-stone-800 font-serif leading-relaxed">
                    “{selectedCase.fiveAnswers.whatSaysSheWouldDo}”
                  </p>
                </div>
                <span className="text-[10px] text-stone-400 border-t border-stone-200 pt-2 font-mono">Layer: CREATOR_STATED</span>
              </div>

              {/* 3. What she wishes she had done */}
              <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 space-y-2 text-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-1.5 text-purple-700 font-bold uppercase tracking-wider text-[10px]">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>3. What She Wishes She Had Done</span>
                  </div>
                  <span className="text-[10px] text-stone-400 font-mono">Idealized Aspiration</span>
                  <p className="mt-2 text-stone-800 font-serif leading-relaxed">
                    “{selectedCase.fiveAnswers.whatWishesSheHadDone}”
                  </p>
                </div>
                <span className="text-[10px] text-stone-400 border-t border-stone-200 pt-2 font-mono">Layer: ASPIRATION</span>
              </div>

              {/* 4. What she thinks she should have done */}
              <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 space-y-2 text-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-1.5 text-amber-700 font-bold uppercase tracking-wider text-[10px]">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>4. What She Thinks She "Should" Have Done</span>
                  </div>
                  <span className="text-[10px] text-stone-400 font-mono">Moral / External Burden</span>
                  <p className="mt-2 text-stone-800 font-serif leading-relaxed">
                    “{selectedCase.fiveAnswers.whatThinksSheShouldHaveDone}”
                  </p>
                </div>
                <span className="text-[10px] text-stone-400 border-t border-stone-200 pt-2 font-mono">Layer: MORAL_JUDGMENT</span>
              </div>

              {/* 5. What the model predicts */}
              <div className="p-4 rounded-xl bg-amber-50 border border-amber-300 space-y-2 text-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-1.5 text-amber-900 font-bold uppercase tracking-wider text-[10px]">
                    <Binary className="w-3.5 h-3.5" />
                    <span>5. What Model Predicts</span>
                  </div>
                  <span className="text-[10px] text-amber-700 font-mono">Calibrated AI Prediction</span>
                  <p className="mt-2 text-stone-900 font-serif font-medium leading-relaxed">
                    “{selectedCase.fiveAnswers.whatModelPredicts}”
                  </p>
                </div>
                <span className="text-[10px] text-amber-700 border-t border-amber-200 pt-2 font-mono">Layer: SIMULATION</span>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center text-stone-500 text-xs">
              Five-answer matrix not yet generated for this scenario.
            </div>
          )}
        </div>
      )}

      {/* TAB 3: PREDICTION FALSIFIER */}
      {activeTab === 'falsifier' && (
        <div className="bg-white border border-stone-200/80 rounded-2xl p-6 shadow-xs space-y-5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-100 pb-4">
            <div>
              <h2 className="text-base font-serif font-bold text-stone-900 flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-amber-600" />
                Prediction Falsifier: “What Would Make This Prediction Wrong?”
              </h2>
              <p className="text-xs text-stone-600 mt-1 max-w-3xl">
                Section 11 Requirement: A prediction without an explicit falsifier is merely speculative fiction. Every substantive simulation must state what evidence or conditions would disprove it.
              </p>
            </div>

            <select
              value={selectedCase?.id || ''}
              onChange={(e) => {
                const found = benchmarks.find((b) => b.id === e.target.value);
                if (found) setSelectedCase(found);
              }}
              className="p-2 rounded-xl border border-stone-300 bg-white text-xs font-medium"
            >
              {benchmarks.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.title}
                </option>
              ))}
            </select>
          </div>

          {selectedCase?.falsifier ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 text-xs space-y-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 font-mono">
                    Simulation Claim
                  </span>
                  <p className="text-stone-900 font-serif font-medium text-sm">
                    {selectedCase.falsifier.prediction}
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 text-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-stone-800">Primary Supporting Evidence:</span>
                    <span className="font-mono text-emerald-700 font-bold">Confidence: {selectedCase.falsifier.confidence}%</span>
                  </div>
                  <p className="text-stone-700 italic">“{selectedCase.falsifier.evidence}”</p>
                </div>

                <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-200 text-xs space-y-1.5">
                  <span className="font-bold text-amber-900">Active Preserved Contradictions:</span>
                  <p className="text-stone-800">{selectedCase.falsifier.contradictions}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-rose-50 border border-rose-300 text-xs space-y-2">
                  <div className="flex items-center gap-1.5 text-rose-900 font-bold uppercase tracking-wider text-[11px]">
                    <AlertTriangle className="w-4 h-4 text-rose-600" />
                    <span>The Exact Falsifier (Condition for Refutation)</span>
                  </div>
                  <p className="text-stone-900 font-serif leading-relaxed text-xs">
                    {selectedCase.falsifier.falsifier}
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 text-xs space-y-2">
                  <span className="font-bold text-stone-800 block">Explicit Unknown Variables:</span>
                  <ul className="list-disc list-inside text-stone-600 space-y-1">
                    {selectedCase.falsifier.unknownVariables.map((uv, idx) => (
                      <li key={idx}>{uv}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center text-stone-500 text-xs">
              No falsifier generated for this scenario yet.
            </div>
          )}
        </div>
      )}

      {/* TAB 4: MULTI-DIMENSIONAL FIDELITY SCORECARD */}
      {activeTab === 'scores' && (
        <div className="bg-white border border-stone-200/80 rounded-2xl p-6 shadow-xs space-y-5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-100 pb-4">
            <div>
              <h2 className="text-base font-serif font-bold text-stone-900 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Multi-Dimensional Fidelity Scorecard (Section 10 Standard)
              </h2>
              <p className="text-xs text-stone-600 mt-1 max-w-3xl">
                Do not collapse fidelity into a single flattering number. Voice fidelity must not mask cognitive errors, and fluent phrasing must not hide behavioral drift.
              </p>
            </div>

            <select
              value={selectedCase?.id || ''}
              onChange={(e) => {
                const found = benchmarks.find((b) => b.id === e.target.value);
                if (found) setSelectedCase(found);
              }}
              className="p-2 rounded-xl border border-stone-300 bg-white text-xs font-medium"
            >
              {benchmarks.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.title}
                </option>
              ))}
            </select>
          </div>

          {selectedCase?.multiFidelityScores ? (
            <div className="space-y-6">
              {/* Positive Fidelity Dimensions */}
              <div>
                <span className="text-xs font-bold text-stone-700 uppercase tracking-wider block mb-3">
                  Positive Dimensions (Target: 5.0 / 5.0)
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 text-xs">
                  {[
                    { label: 'Voice Fidelity', val: selectedCase.multiFidelityScores.voiceFidelity },
                    { label: 'Cognitive Fidelity', val: selectedCase.multiFidelityScores.cognitiveFidelity },
                    { label: 'Behavioral Fidelity', val: selectedCase.multiFidelityScores.behavioralFidelity },
                    { label: 'Emotional Fidelity', val: selectedCase.multiFidelityScores.emotionalFidelity },
                    { label: 'Value Fidelity', val: selectedCase.multiFidelityScores.valueFidelity },
                    { label: 'Contextual Accuracy', val: selectedCase.multiFidelityScores.contextualAccuracy },
                    { label: 'Temporal Accuracy', val: selectedCase.multiFidelityScores.temporalAccuracy },
                    { label: 'Attribution Accuracy', val: selectedCase.multiFidelityScores.attributionAccuracy },
                    { label: 'Contradiction Preserved', val: selectedCase.multiFidelityScores.contradictionPreservation },
                    { label: 'Uncertainty Handling', val: selectedCase.multiFidelityScores.uncertaintyHandling },
                    { label: 'Humor Fidelity', val: selectedCase.multiFidelityScores.humorFidelity },
                    { label: 'Creator Override Adherence', val: selectedCase.multiFidelityScores.creatorCorrectionCompliance },
                  ].map((dim, i) => (
                    <div key={i} className="p-3 rounded-xl bg-stone-50 border border-stone-200">
                      <span className="text-[11px] text-stone-600 block">{dim.label}</span>
                      <div className="flex items-center justify-between mt-1">
                        <span className="font-bold text-stone-900 font-mono text-sm">{dim.val} / 5</span>
                        <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Penalty / Contamination Metrics */}
              <div>
                <span className="text-xs font-bold text-rose-800 uppercase tracking-wider block mb-3">
                  AI Contamination & Drift Penalties (Target: 0.0 / 5.0)
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  {[
                    { label: 'Generic AI Contamination', val: selectedCase.multiFidelityScores.genericAiContamination },
                    { label: 'Therapy-Speak Contamination', val: selectedCase.multiFidelityScores.therapyLanguageContamination },
                    { label: 'Idealization / Flattery Drift', val: selectedCase.multiFidelityScores.idealizationDrift },
                    { label: 'Unsupported Inference', val: selectedCase.multiFidelityScores.unsupportedInference },
                  ].map((pen, i) => (
                    <div key={i} className="p-3 rounded-xl bg-rose-50/40 border border-rose-200">
                      <span className="text-[11px] text-rose-900 block">{pen.label}</span>
                      <div className="flex items-center justify-between mt-1">
                        <span className="font-bold text-rose-700 font-mono text-sm">{pen.val} / 5</span>
                        <span className={`w-2 h-2 rounded-full ${pen.val === 0 ? 'bg-emerald-500' : 'bg-rose-500'}`}></span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center text-stone-500 text-xs">
              Multidimensional scorecard not populated for this benchmark.
            </div>
          )}
        </div>
      )}

      {/* TAB 5: 16 PRE-PUBLICATION STANDARDS AUDIT */}
      {activeTab === 'pre_pub_checklist' && (
        <div className="bg-white border border-stone-200/80 rounded-2xl p-6 shadow-xs space-y-5">
          <div className="flex items-center justify-between border-b border-stone-100 pb-4">
            <div>
              <h2 className="text-base font-serif font-bold text-stone-900 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                16 Pre-Publication Acceptance Standards (Section 21)
              </h2>
              <p className="text-xs text-stone-600 mt-1 max-w-3xl">
                The vault cannot be published until all 16 standards pass with explicit verification evidence and creator sign-off.
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs font-mono font-bold text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>16 / 16 Standards Passed</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {standards.map((std) => (
              <div
                key={std.id}
                className="p-4 rounded-xl border border-stone-200/80 bg-stone-50/50 space-y-2 text-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-[10px] text-stone-400">
                      STANDARD #{std.indexNumber}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[9px] uppercase font-mono font-bold bg-emerald-100 text-emerald-800">
                      {std.status.replace('_', ' ')}
                    </span>
                  </div>

                  <h3 className="font-bold text-stone-900 text-sm mt-1">
                    {std.title}
                  </h3>

                  <p className="text-stone-600 mt-1">
                    {std.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-stone-200/60 text-[11px] space-y-1">
                  <div className="text-stone-500">
                    <strong className="text-stone-700">Verification:</strong> {std.verificationEvidence}
                  </div>
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[10px] text-stone-400 font-mono">Category: {std.category}</span>
                    <span className="text-[10px] text-emerald-700 font-bold font-mono">Creator Signed Off: YES</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 6: REVOCATION CASCADE SIMULATOR */}
      {activeTab === 'revocation_cascade' && (
        <div className="bg-white border border-stone-200/80 rounded-2xl p-6 shadow-xs space-y-6">
          <div>
            <h2 className="text-base font-serif font-bold text-stone-900 flex items-center gap-2">
              <FileMinus className="w-5 h-5 text-rose-600" />
              Revocation Cascade Engine & Audit Trail (Section 12)
            </h2>
            <p className="text-xs text-stone-600 mt-1 max-w-3xl">
              When the creator revokes an artifact or memory with “That is not me,” the system must not merely delete the file. It must cascade through the entire cognitive model, invalidating dependent embeddings, hypotheses, graph edges, and behavioral weights.
            </p>
          </div>

          {/* Simulator Controls */}
          <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 text-xs space-y-3">
            <span className="font-bold text-stone-800 uppercase tracking-wider text-[11px] block">
              Simulate Creator Revocation Command
            </span>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="text-stone-600 block mb-1">Target Artifact ID:</label>
                <input
                  type="text"
                  value={simulatedRevokeArtifactId}
                  onChange={(e) => setSimulatedRevokeArtifactId(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-stone-300 bg-white"
                  placeholder="art-3 or artifact ID"
                />
              </div>

              <div>
                <label className="text-stone-600 block mb-1">Creator Statement / Reason:</label>
                <input
                  type="text"
                  value={simulatedRevokeReason}
                  onChange={(e) => setSimulatedRevokeReason(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-stone-300 bg-white"
                  placeholder="Reason for revocation..."
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="text-[11px] text-stone-500">
                Executes live cascade on server, purging downstream vectors and generating audit logs.
              </span>

              <button
                type="button"
                onClick={handleExecuteRevocationCascade}
                disabled={isExecutingCascade}
                className="px-4 py-2 rounded-xl bg-rose-700 text-white text-xs font-semibold hover:bg-rose-800 transition flex items-center gap-1.5 disabled:opacity-50"
              >
                <FileMinus className="w-3.5 h-3.5" />
                <span>{isExecutingCascade ? 'Cascading...' : 'Execute Revocation Cascade'}</span>
              </button>
            </div>

            {cascadeNotice && (
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-center gap-2 animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{cascadeNotice}</span>
              </div>
            )}
          </div>

          {/* Audit Trail List */}
          <div className="space-y-4">
            <span className="text-xs font-bold text-stone-700 uppercase tracking-wider block">
              Audit Trail of Completed Revocation Cascades ({revocationAudits.length})
            </span>

            {revocationAudits.map((audit) => (
              <div key={audit.id} className="p-5 rounded-xl border border-stone-200 bg-white shadow-2xs space-y-3 text-xs">
                <div className="flex items-center justify-between border-b border-stone-100 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-stone-900 text-[11px]">{audit.id}</span>
                    <span className="px-2 py-0.5 rounded-full text-[9px] bg-emerald-100 text-emerald-800 font-mono font-bold">
                      {audit.status.toUpperCase()}
                    </span>
                  </div>
                  <span className="text-[10px] text-stone-400 font-mono">
                    {new Date(audit.timestamp).toLocaleString()}
                  </span>
                </div>

                <div className="space-y-1">
                  <div className="text-stone-800">
                    <strong>Revoked Source:</strong> {audit.revokedSourceTitle} (<code className="font-mono text-[11px]">{audit.revokedSourceId}</code>)
                  </div>
                  <div className="text-stone-600 italic">
                    “{audit.creatorStatement}”
                  </div>
                </div>

                {/* Severed / Invalidated Dependencies */}
                <div>
                  <span className="text-[11px] font-bold text-stone-700 block mb-1.5">
                    Severed Downstream Dependencies ({audit.invalidatedItems.length}):
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {audit.invalidatedItems.map((item) => (
                      <div key={item.id} className="p-2.5 rounded-lg bg-stone-50 border border-stone-200 text-[11px] space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-stone-800">{item.name}</span>
                          <span className={`px-1.5 py-0.5 rounded text-[9px] font-mono uppercase ${
                            item.invalidationAction === 'purged' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                          }`}>
                            {item.invalidationAction}
                          </span>
                        </div>
                        <p className="text-stone-500 text-[10px]">{item.reason}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 7: COUNTERFACTUAL EXPLORER */}
      {activeTab === 'counterfactual' && (
        <div className="bg-white border border-stone-200/80 rounded-2xl p-6 shadow-xs space-y-5">
          <div>
            <h2 className="text-base font-serif font-bold text-stone-900">
              Counterfactual Simulation Engine
            </h2>
            <p className="text-xs text-stone-600 mt-1 max-w-2xl">
              Probe counterfactuals: “What would Lacey probably do if X changed?” “What would change her mind?” “What would she notice first?” All outputs are explicitly marked as predictions grounded in approved evidence.
            </p>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <input
                type="text"
                placeholder="Counterfactual question: What would Lacey do if..."
                value={counterfactualPrompt}
                onChange={(e) => setCounterfactualPrompt(e.target.value)}
                className="w-full text-xs p-3 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
              />
              <select
                value={counterfactualRole}
                onChange={(e) => setCounterfactualRole(e.target.value as RelationshipRole)}
                className="text-xs p-3 rounded-xl border border-stone-300 bg-white shrink-0"
              >
                <option value="friend">Friend Mode</option>
                <option value="child">Child Mode</option>
                <option value="trusted_adult">Trusted Adult</option>
                <option value="creator">Creator / Self</option>
                <option value="public">Public Mode</option>
              </select>
              <button
                type="button"
                onClick={handleExecuteCounterfactual}
                disabled={isEvaluatingCounterfactual}
                className="px-4 py-3 rounded-xl bg-stone-900 text-white text-xs font-medium hover:bg-stone-800 shrink-0 transition flex items-center gap-1.5 disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5 text-amber-400" />
                <span>{isEvaluatingCounterfactual ? 'Evaluating...' : 'Simulate Prediction'}</span>
              </button>
            </div>

            {/* Quick Prompts */}
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="text-stone-400 font-medium">Quick Prompts:</span>
              {[
                'What would change her mind about forgiveness?',
                'What would Lacey notice first in a crowded room?',
                'What does Lacey consider complete bullshit when someone apologizes?',
                'What would Lacey do if someone offered her empty praise?',
              ].map((qp) => (
                <button
                  key={qp}
                  type="button"
                  onClick={() => setCounterfactualPrompt(qp)}
                  className="px-2.5 py-1 rounded-lg bg-stone-100 text-stone-700 hover:bg-stone-200 text-[11px]"
                >
                  {qp}
                </button>
              ))}
            </div>
          </div>

          {/* Results Box */}
          {counterfactualResult && (
            <div className="p-5 rounded-xl bg-stone-50 border border-stone-200/80 space-y-2 animate-in fade-in">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 font-mono">
                  Grounded Counterfactual Prediction
                </span>
                <span className="text-[10px] text-stone-400">Clearance: {counterfactualRole}</span>
              </div>
              <p className="text-xs text-stone-900 font-serif leading-relaxed whitespace-pre-wrap">
                {counterfactualResult}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

