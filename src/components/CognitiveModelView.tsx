import React, { useState } from 'react';
import { CognitiveModelData } from '../types';
import { Brain, Eye, Search, AlertOctagon, Scale, Compass, CheckCircle2 } from 'lucide-react';

interface CognitiveModelViewProps {
  cognitiveModel: CognitiveModelData;
  onUpdateCognitiveModel?: (updated: CognitiveModelData) => void;
}

export const CognitiveModelView: React.FC<CognitiveModelViewProps> = ({
  cognitiveModel,
}) => {
  const [activeTab, setActiveTab] = useState<'attention' | 'curiosity' | 'bullshit' | 'decisions' | 'perspective' | 'balance'>('attention');

  return (
    <div id="cognitive-model-container" className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div id="cognitive-model-header" className="bg-stone-900 border border-stone-800 rounded-xl p-6 text-stone-100 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono uppercase tracking-wider bg-sky-950/60 text-sky-300 border border-sky-800/50">
                Layer 2: Model • Reasoning & Attention
              </span>
              <span className="text-xs text-stone-400 font-mono">
                Updated {new Date(cognitiveModel.lastUpdated).toLocaleDateString()}
              </span>
            </div>
            <h1 className="text-2xl font-serif tracking-tight text-stone-100">Cognitive Model (Reasoning & Perception)</h1>
            <p className="text-stone-400 text-sm mt-1 max-w-3xl">
              Inspects what Lacey notices first, what she overlooks, what triggers her skepticism, how she deconstructs problems, 
              and how she balances visceral intuition against practical grounding.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-stone-800 text-stone-300 rounded-lg text-xs font-mono border border-stone-700">
              Cognitive Architecture Active
            </span>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-2 mt-6 pt-4 border-t border-stone-800">
          <button
            id="tab-attention"
            onClick={() => setActiveTab('attention')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'attention'
                ? 'bg-sky-600 text-stone-900 font-semibold shadow'
                : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800/60'
            }`}
          >
            <Eye className="w-4 h-4" />
            Attention Patterns
          </button>
          <button
            id="tab-curiosity"
            onClick={() => setActiveTab('curiosity')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'curiosity'
                ? 'bg-sky-600 text-stone-900 font-semibold shadow'
                : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800/60'
            }`}
          >
            <Search className="w-4 h-4" />
            Curiosity & Inquiries
          </button>
          <button
            id="tab-bullshit"
            onClick={() => setActiveTab('bullshit')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'bullshit'
                ? 'bg-sky-600 text-stone-900 font-semibold shadow'
                : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800/60'
            }`}
          >
            <AlertOctagon className="w-4 h-4" />
            Bullshit Detector
          </button>
          <button
            id="tab-decisions"
            onClick={() => setActiveTab('decisions')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'decisions'
                ? 'bg-sky-600 text-stone-900 font-semibold shadow'
                : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800/60'
            }`}
          >
            <Scale className="w-4 h-4" />
            Decision Making
          </button>
          <button
            id="tab-perspective"
            onClick={() => setActiveTab('perspective')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'perspective'
                ? 'bg-sky-600 text-stone-900 font-semibold shadow'
                : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800/60'
            }`}
          >
            <Compass className="w-4 h-4" />
            Perspective Shifting
          </button>
          <button
            id="tab-balance"
            onClick={() => setActiveTab('balance')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'balance'
                ? 'bg-sky-600 text-stone-900 font-semibold shadow'
                : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800/60'
            }`}
          >
            <Brain className="w-4 h-4" />
            Emotional / Practical Balance
          </button>
        </div>
      </div>

      {/* Tab 1: Attention Patterns */}
      {activeTab === 'attention' && (
        <div id="section-attention" className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-stone-900 border border-stone-800 rounded-xl p-6 space-y-4">
            <h2 className="text-lg font-serif text-emerald-300 flex items-center gap-2">
              <Eye className="w-5 h-5 text-emerald-400" />
              What She Notices Quickly
            </h2>
            <ul className="space-y-3">
              {cognitiveModel.attentionPatterns.noticesQuickly.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-stone-300 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-stone-900 border border-stone-800 rounded-xl p-6 space-y-4">
            <h2 className="text-lg font-serif text-amber-300 flex items-center gap-2">
              <Compass className="w-5 h-5 text-amber-400" />
              What She Tends to Overlook
            </h2>
            <ul className="space-y-3">
              {cognitiveModel.attentionPatterns.tendsToOverlook.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-stone-300 text-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-2 shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-stone-900 border border-stone-800 rounded-xl p-6 space-y-4">
            <h2 className="text-lg font-serif text-sky-300 flex items-center gap-2">
              <Search className="w-5 h-5 text-sky-400" />
              What Captures Attention
            </h2>
            <ul className="space-y-3">
              {cognitiveModel.attentionPatterns.capturesAttention.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-stone-300 text-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-sky-400 mt-2 shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-stone-900 border border-stone-800 rounded-xl p-6 space-y-4">
            <h2 className="text-lg font-serif text-rose-300 flex items-center gap-2">
              <AlertOctagon className="w-5 h-5 text-rose-400" />
              What Causes Boredom
            </h2>
            <ul className="space-y-3">
              {cognitiveModel.attentionPatterns.causesBoredom.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-stone-300 text-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-2 shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Tab 2: Curiosity & Inquiries */}
      {activeTab === 'curiosity' && (
        <div id="section-curiosity" className="space-y-6">
          <div className="bg-stone-900 border border-stone-800 rounded-xl p-6 space-y-4">
            <h2 className="text-lg font-serif text-stone-100 flex items-center gap-2">
              <Search className="w-5 h-5 text-sky-400" />
              Questions She Returns To Repeatedly
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {cognitiveModel.curiosityPatterns.recurringQuestions.map((q, idx) => (
                <div key={idx} className="p-4 bg-stone-950/70 border border-stone-800 rounded-lg text-sky-200 text-sm font-serif italic">
                  {q}
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-stone-900 border border-stone-800 rounded-xl p-6 space-y-4">
              <h2 className="text-base font-serif text-stone-200">Repeatedly Investigates</h2>
              <ul className="space-y-2.5">
                {cognitiveModel.curiosityPatterns.repeatedlyInvestigates.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-stone-300 text-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-sky-400 mt-2 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-stone-900 border border-stone-800 rounded-xl p-6 space-y-4">
              <h2 className="text-base font-serif text-stone-200">Sustained Interest Topics</h2>
              <ul className="space-y-2.5">
                {cognitiveModel.curiosityPatterns.sustainedInterestTopics.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-stone-300 text-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-teal-400 mt-2 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Bullshit Detector */}
      {activeTab === 'bullshit' && (
        <div id="section-bullshit" className="space-y-6">
          <div className="bg-stone-900 border border-stone-800 rounded-xl p-6 space-y-6">
            <div className="border-b border-stone-800 pb-4">
              <h2 className="text-lg font-serif text-amber-200 flex items-center gap-2">
                <AlertOctagon className="w-5 h-5 text-amber-400" />
                The BS Detector (Observed Skepticism Patterns)
              </h2>
              <p className="text-stone-400 text-sm mt-1">
                Lacey's documented triggers for insincerity, corporate manipulation, and performative pretense.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-5 bg-stone-950/60 rounded-xl border border-stone-800 space-y-3">
                <span className="text-xs font-mono uppercase tracking-wider text-rose-400 font-semibold">Immediate Skepticism Triggers</span>
                <ul className="space-y-2">
                  {cognitiveModel.bullshitDetection.skepticismTriggers.map((trig, idx) => (
                    <li key={idx} className="text-stone-300 text-sm flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 shrink-0" />
                      <span>{trig}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-5 bg-stone-950/60 rounded-xl border border-stone-800 space-y-3">
                <span className="text-xs font-mono uppercase tracking-wider text-amber-400 font-semibold">Inconsistency Detection</span>
                <ul className="space-y-2">
                  {cognitiveModel.bullshitDetection.inconsistencyDetectionPatterns.map((inc, idx) => (
                    <li key={idx} className="text-stone-300 text-sm flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                      <span>{inc}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              <div className="p-4 bg-stone-950/70 border border-stone-800 rounded-lg space-y-1.5">
                <span className="text-xs font-mono text-stone-400 block">Corporate Speak Reaction</span>
                <p className="text-stone-300 text-sm">{cognitiveModel.bullshitDetection.corporateLanguageReaction}</p>
              </div>
              <div className="p-4 bg-stone-950/70 border border-stone-800 rounded-lg space-y-1.5">
                <span className="text-xs font-mono text-stone-400 block">Performative Behavior</span>
                <p className="text-stone-300 text-sm">{cognitiveModel.bullshitDetection.performativeBehaviorReaction}</p>
              </div>
              <div className="p-4 bg-stone-950/70 border border-stone-800 rounded-lg space-y-1.5">
                <span className="text-xs font-mono text-stone-400 block">False Certainty</span>
                <p className="text-stone-300 text-sm">{cognitiveModel.bullshitDetection.falseCertaintyReaction}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Decision Making */}
      {activeTab === 'decisions' && (
        <div id="section-decisions" className="bg-stone-900 border border-stone-800 rounded-xl p-6 space-y-6">
          <div className="border-b border-stone-800 pb-4">
            <h2 className="text-lg font-serif text-stone-100 flex items-center gap-2">
              <Scale className="w-5 h-5 text-sky-400" />
              How Lacey Makes Decisions
            </h2>
            <p className="text-stone-400 text-sm mt-1">
              Deconstructing fact gathering, risk appetite, and conditions for shifting course.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-4 bg-stone-950/60 rounded-lg border border-stone-800 space-y-1.5">
              <span className="text-xs font-mono uppercase tracking-wider text-sky-400 font-semibold">Analytical vs. Intuitive</span>
              <p className="text-stone-300 text-sm leading-relaxed">{cognitiveModel.decisionMaking.analyticalVsIntuitive}</p>
            </div>

            <div className="p-4 bg-stone-950/60 rounded-lg border border-stone-800 space-y-1.5">
              <span className="text-xs font-mono uppercase tracking-wider text-amber-400 font-semibold">Procrastination & Obsession</span>
              <p className="text-stone-300 text-sm leading-relaxed">{cognitiveModel.decisionMaking.procrastinationAndObsession}</p>
            </div>

            <div className="p-4 bg-stone-950/60 rounded-lg border border-stone-800 space-y-1.5">
              <span className="text-xs font-mono uppercase tracking-wider text-rose-400 font-semibold">Risk Tolerance</span>
              <p className="text-stone-300 text-sm leading-relaxed">{cognitiveModel.decisionMaking.riskTolerance}</p>
            </div>

            <div className="p-4 bg-stone-950/60 rounded-lg border border-stone-800 space-y-1.5">
              <span className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-semibold">Changing Her Mind</span>
              <p className="text-stone-300 text-sm leading-relaxed">{cognitiveModel.decisionMaking.changingMindConditions}</p>
            </div>
          </div>

          <div className="p-4 bg-stone-950/60 rounded-lg border border-stone-800 space-y-1.5">
            <span className="text-xs font-mono uppercase tracking-wider text-purple-400 font-semibold">Situational Judgment</span>
            <p className="text-stone-300 text-sm leading-relaxed">{cognitiveModel.decisionMaking.situationalJudgment}</p>
          </div>
        </div>
      )}

      {/* Tab 5: Perspective Shifting */}
      {activeTab === 'perspective' && (
        <div id="section-perspective" className="bg-stone-900 border border-stone-800 rounded-xl p-6 space-y-6">
          <div className="border-b border-stone-800 pb-4">
            <h2 className="text-lg font-serif text-stone-100 flex items-center gap-2">
              <Compass className="w-5 h-5 text-sky-400" />
              Perspective Shifting & Mental Flexibility
            </h2>
            <p className="text-stone-400 text-sm mt-1">
              Separating intent from damage, and accountability from paralyzing shame.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-5 bg-stone-950/70 rounded-xl border border-stone-800 space-y-2">
              <span className="text-xs font-mono uppercase tracking-wider text-stone-400 block">Intent vs. Outcome</span>
              <p className="text-stone-300 text-sm leading-relaxed">{cognitiveModel.perspectiveShifting.distinguishesIntentFromOutcome}</p>
            </div>

            <div className="p-5 bg-stone-950/70 rounded-xl border border-stone-800 space-y-2">
              <span className="text-xs font-mono uppercase tracking-wider text-stone-400 block">Accountability vs. Shame</span>
              <p className="text-stone-300 text-sm leading-relaxed">{cognitiveModel.perspectiveShifting.separatesAccountabilityFromShame}</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-4 pt-2">
            <div className="flex items-center gap-2 px-3 py-2 bg-stone-800/80 rounded-lg text-xs font-mono text-stone-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Seeks Alternate Explanations
            </div>
            <div className="flex items-center gap-2 px-3 py-2 bg-stone-800/80 rounded-lg text-xs font-mono text-stone-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Identifies Systemic Causes
            </div>
          </div>
        </div>
      )}

      {/* Tab 6: Emotional / Practical Balance */}
      {activeTab === 'balance' && (
        <div id="section-balance" className="bg-stone-900 border border-stone-800 rounded-xl p-6 space-y-6">
          <div className="border-b border-stone-800 pb-4">
            <h2 className="text-lg font-serif text-stone-100 flex items-center gap-2">
              <Brain className="w-5 h-5 text-sky-400" />
              Emotional & Practical Equilibrium
            </h2>
            <p className="text-stone-400 text-sm mt-1">
              How she resolves the pull between visceral sensitivity and physical reality.
            </p>
          </div>

          <div className="space-y-4">
            <div className="p-5 bg-stone-950/60 rounded-xl border border-stone-800 space-y-2">
              <span className="text-xs font-mono uppercase tracking-wider text-sky-400 font-semibold">Emotion vs. Logic</span>
              <p className="text-stone-300 text-sm leading-relaxed">{cognitiveModel.emotionalPracticalBalance.emotionVsLogicBalance}</p>
            </div>

            <div className="p-5 bg-stone-950/60 rounded-xl border border-stone-800 space-y-2">
              <span className="text-xs font-mono uppercase tracking-wider text-amber-400 font-semibold">Self-Protection vs. Vulnerability</span>
              <p className="text-stone-300 text-sm leading-relaxed">{cognitiveModel.emotionalPracticalBalance.selfProtectionVsVulnerability}</p>
            </div>

            <div className="p-5 bg-stone-950/60 rounded-xl border border-stone-800 space-y-2">
              <span className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-semibold">Humor as Coping Mechanism</span>
              <p className="text-stone-300 text-sm leading-relaxed">{cognitiveModel.emotionalPracticalBalance.humorAsCopingMechanism}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
