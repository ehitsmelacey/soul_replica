import React, { useState } from 'react';
import { PersonModelData, PersonFacet } from '../types';
import { Smile, Zap, BatteryLow, Shield, Heart, Plus, CheckCircle2, MessageSquare, AlertCircle } from 'lucide-react';

interface PersonModelViewProps {
  personModel: PersonModelData;
  onUpdatePersonModel?: (updated: PersonModelData) => void;
}

export const PersonModelView: React.FC<PersonModelViewProps> = ({
  personModel,
  onUpdatePersonModel,
}) => {
  const [activeTab, setActiveTab] = useState<'humor' | 'emotions' | 'exhaustion' | 'relational' | 'facets'>('humor');
  const [newFacetTopic, setNewFacetTopic] = useState('');
  const [newFacetReaction, setNewFacetReaction] = useState('');
  const [newFacetQuote, setNewFacetQuote] = useState('');
  const [showAddFacet, setShowAddFacet] = useState(false);

  const handleAddFacet = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFacetTopic.trim() || !newFacetReaction.trim()) return;

    const newFacet: PersonFacet = {
      id: `facet-${Date.now()}`,
      topic: newFacetTopic,
      observedReaction: newFacetReaction,
      evidenceCount: 1,
      supportingQuote: newFacetQuote ? `“${newFacetQuote}”` : undefined,
      context: 'Documented via creator direct entry in Person Model.',
      confidence: 100,
      approvalStatus: 'approved',
    };

    if (onUpdatePersonModel) {
      onUpdatePersonModel({
        ...personModel,
        facets: [newFacet, ...personModel.facets],
        lastUpdated: Date.now(),
      });
    }

    setNewFacetTopic('');
    setNewFacetReaction('');
    setNewFacetQuote('');
    setShowAddFacet(false);
  };

  return (
    <div id="person-model-container" className="max-w-6xl mx-auto space-y-6">
      {/* Header with clear architectural distinction */}
      <div id="person-model-header" className="bg-stone-900 border border-stone-800 rounded-xl p-6 text-stone-100 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono uppercase tracking-wider bg-amber-950/60 text-amber-300 border border-amber-800/50">
                Layer 2: Model • Human Being
              </span>
              <span className="text-xs text-stone-400 font-mono">
                Updated {new Date(personModel.lastUpdated).toLocaleDateString()}
              </span>
            </div>
            <h1 className="text-2xl font-serif tracking-tight text-stone-100">Person Model (The Human Being)</h1>
            <p className="text-stone-400 text-sm mt-1 max-w-3xl">
              Dedicated model representing {personModel.creatorName} as a living human being rather than an abstract reasoning engine. 
              Tracks what makes her laugh, soften, withdraw, or go silent under exhaustion.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-stone-800 text-stone-300 rounded-lg text-xs font-mono border border-stone-700">
              Fidelity &gt; Flattery Active
            </span>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-2 mt-6 pt-4 border-t border-stone-800">
          <button
            id="tab-humor"
            onClick={() => setActiveTab('humor')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'humor'
                ? 'bg-amber-600 text-stone-900 font-semibold shadow'
                : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800/60'
            }`}
          >
            <Smile className="w-4 h-4" />
            Humor & Absurdity
          </button>
          <button
            id="tab-emotions"
            onClick={() => setActiveTab('emotions')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'emotions'
                ? 'bg-amber-600 text-stone-900 font-semibold shadow'
                : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800/60'
            }`}
          >
            <Zap className="w-4 h-4" />
            Emotional Triggers
          </button>
          <button
            id="tab-exhaustion"
            onClick={() => setActiveTab('exhaustion')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'exhaustion'
                ? 'bg-amber-600 text-stone-900 font-semibold shadow'
                : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800/60'
            }`}
          >
            <BatteryLow className="w-4 h-4" />
            Exhaustion & Cave Mode
          </button>
          <button
            id="tab-relational"
            onClick={() => setActiveTab('relational')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'relational'
                ? 'bg-amber-600 text-stone-900 font-semibold shadow'
                : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800/60'
            }`}
          >
            <Heart className="w-4 h-4" />
            Relational Behavior
          </button>
          <button
            id="tab-facets"
            onClick={() => setActiveTab('facets')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'facets'
                ? 'bg-amber-600 text-stone-900 font-semibold shadow'
                : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800/60'
            }`}
          >
            <Shield className="w-4 h-4" />
            Observed Facets ({personModel.facets.length})
          </button>
        </div>
      </div>

      {/* Tab 1: Humor & Absurdity */}
      {activeTab === 'humor' && (
        <div id="section-humor" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-stone-900 border border-stone-800 rounded-xl p-6 space-y-4">
              <h2 className="text-lg font-serif text-amber-200 flex items-center gap-2">
                <Smile className="w-5 h-5 text-amber-400" />
                What Makes Her Laugh
              </h2>
              <ul className="space-y-2.5">
                {personModel.humorPatterns.whatMakesHerLaugh.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-stone-300 text-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-stone-900 border border-stone-800 rounded-xl p-6 space-y-4">
              <h2 className="text-lg font-serif text-amber-200 flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-amber-400" />
                What She Jokes About
              </h2>
              <ul className="space-y-2.5">
                {personModel.humorPatterns.whatSheJokesAbout.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-stone-300 text-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="bg-stone-900 border border-stone-800 rounded-xl p-6 space-y-4">
            <h2 className="text-lg font-serif text-stone-200">Humor Under Pressure & Dark Humor Boundaries</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-4 bg-stone-950/60 rounded-lg border border-stone-800/80">
                <span className="text-xs uppercase font-mono tracking-wider text-stone-400 block mb-1">Under Stress</span>
                <p className="text-stone-300 text-sm leading-relaxed">{personModel.humorPatterns.howHumorChangesUnderStress}</p>
              </div>
              <div className="p-4 bg-stone-950/60 rounded-lg border border-stone-800/80">
                <span className="text-xs uppercase font-mono tracking-wider text-stone-400 block mb-1">Boundaries</span>
                <p className="text-stone-300 text-sm leading-relaxed">{personModel.humorPatterns.darkHumorBoundaries}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Emotional Triggers */}
      {activeTab === 'emotions' && (
        <div id="section-emotions" className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-stone-900 border border-stone-800 rounded-xl p-6 space-y-3">
            <h2 className="text-base font-serif text-rose-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400" />
              What Makes Her Angry
            </h2>
            <ul className="space-y-2">
              {personModel.emotionalResponses.whatMakesHerAngry.map((item, idx) => (
                <li key={idx} className="text-stone-300 text-sm flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-1.5 shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-stone-900 border border-stone-800 rounded-xl p-6 space-y-3">
            <h2 className="text-base font-serif text-amber-300 flex items-center gap-2">
              <Shield className="w-4 h-4 text-amber-400" />
              What Makes Her Suspicious
            </h2>
            <ul className="space-y-2">
              {personModel.emotionalResponses.whatMakesHerSuspicious.map((item, idx) => (
                <li key={idx} className="text-stone-300 text-sm flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-stone-900 border border-stone-800 rounded-xl p-6 space-y-3">
            <h2 className="text-base font-serif text-emerald-300 flex items-center gap-2">
              <Heart className="w-4 h-4 text-emerald-400" />
              What Makes Her Soften
            </h2>
            <ul className="space-y-2">
              {personModel.emotionalResponses.whatMakesHerSoften.map((item, idx) => (
                <li key={idx} className="text-stone-300 text-sm flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-stone-900 border border-stone-800 rounded-xl p-6 space-y-3">
            <h2 className="text-base font-serif text-orange-300 flex items-center gap-2">
              <Shield className="w-4 h-4 text-orange-400" />
              What Makes Her Defensive
            </h2>
            <ul className="space-y-2">
              {personModel.emotionalResponses.whatMakesHerDefensive.map((item, idx) => (
                <li key={idx} className="text-stone-300 text-sm flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-orange-400 mt-1.5 shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-stone-900 border border-stone-800 rounded-xl p-6 space-y-3">
            <h2 className="text-base font-serif text-teal-300 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-teal-400" />
              What She Finds Beautiful
            </h2>
            <ul className="space-y-2">
              {personModel.emotionalResponses.whatSheFindsBeautiful.map((item, idx) => (
                <li key={idx} className="text-stone-300 text-sm flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-400 mt-1.5 shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-stone-900 border border-stone-800 rounded-xl p-6 space-y-3">
            <h2 className="text-base font-serif text-purple-300 flex items-center gap-2">
              <Zap className="w-4 h-4 text-purple-400" />
              What She Finds Absurd
            </h2>
            <ul className="space-y-2">
              {personModel.emotionalResponses.whatSheFindsAbsurd.map((item, idx) => (
                <li key={idx} className="text-stone-300 text-sm flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-1.5 shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Tab 3: Exhaustion & Cave Mode */}
      {activeTab === 'exhaustion' && (
        <div id="section-exhaustion" className="space-y-6">
          <div className="bg-stone-900 border border-stone-800 rounded-xl p-6 space-y-6">
            <div className="border-b border-stone-800 pb-4">
              <h2 className="text-lg font-serif text-stone-100 flex items-center gap-2">
                <BatteryLow className="w-5 h-5 text-amber-500" />
                Stress, Overload & Survival States
              </h2>
              <p className="text-stone-400 text-sm mt-1">
                Lacey's documented behavioral patterns across different nervous system capacities.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-5 bg-stone-950/70 rounded-xl border border-stone-800 space-y-2">
                <span className="text-xs font-mono uppercase tracking-wider text-rose-400 font-semibold">When Exhausted</span>
                <p className="text-stone-300 text-sm leading-relaxed">{personModel.stressAndExhaustionStates.whenExhausted}</p>
              </div>

              <div className="p-5 bg-stone-950/70 rounded-xl border border-stone-800 space-y-2">
                <span className="text-xs font-mono uppercase tracking-wider text-amber-400 font-semibold">When Overloaded</span>
                <p className="text-stone-300 text-sm leading-relaxed">{personModel.stressAndExhaustionStates.whenOverloaded}</p>
              </div>

              <div className="p-5 bg-stone-950/70 rounded-xl border border-stone-800 space-y-2">
                <span className="text-xs font-mono uppercase tracking-wider text-sky-400 font-semibold">When Afraid</span>
                <p className="text-stone-300 text-sm leading-relaxed">{personModel.stressAndExhaustionStates.whenAfraid}</p>
              </div>

              <div className="p-5 bg-stone-950/70 rounded-xl border border-stone-800 space-y-2">
                <span className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-semibold">When Comfortable</span>
                <p className="text-stone-300 text-sm leading-relaxed">{personModel.stressAndExhaustionStates.whenComfortable}</p>
              </div>
            </div>

            <div className="p-5 bg-stone-950/70 rounded-xl border border-stone-800 space-y-2">
              <span className="text-xs font-mono uppercase tracking-wider text-purple-400 font-semibold">Behavior Under Uncertainty</span>
              <p className="text-stone-300 text-sm leading-relaxed">{personModel.stressAndExhaustionStates.uncertaintyBehavior}</p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Relational Behavior */}
      {activeTab === 'relational' && (
        <div id="section-relational" className="bg-stone-900 border border-stone-800 rounded-xl p-6 space-y-6">
          <div className="border-b border-stone-800 pb-4">
            <h2 className="text-lg font-serif text-stone-100 flex items-center gap-2">
              <Heart className="w-5 h-5 text-amber-500" />
              How Lacey Navigates Human Relationships
            </h2>
            <p className="text-stone-400 text-sm mt-1">
              Affection, apologies, conflict, and non-negotiables.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <span className="text-xs font-mono uppercase tracking-wider text-stone-400 font-medium">Demonstrating Affection</span>
              <p className="text-stone-200 text-sm leading-relaxed bg-stone-950/60 p-4 rounded-lg border border-stone-800/80">
                {personModel.relationalBehavior.howSheDemonstratesAffection}
              </p>
            </div>

            <div className="space-y-1">
              <span className="text-xs font-mono uppercase tracking-wider text-stone-400 font-medium">Protecting Loved Ones</span>
              <p className="text-stone-200 text-sm leading-relaxed bg-stone-950/60 p-4 rounded-lg border border-stone-800/80">
                {personModel.relationalBehavior.howSheProtectsPeople}
              </p>
            </div>

            <div className="space-y-1">
              <span className="text-xs font-mono uppercase tracking-wider text-stone-400 font-medium">How She Apologizes</span>
              <p className="text-stone-200 text-sm leading-relaxed bg-stone-950/60 p-4 rounded-lg border border-stone-800/80">
                {personModel.relationalBehavior.howSheApologizes}
              </p>
            </div>

            <div className="space-y-1">
              <span className="text-xs font-mono uppercase tracking-wider text-stone-400 font-medium">Handling Disagreement</span>
              <p className="text-stone-200 text-sm leading-relaxed bg-stone-950/60 p-4 rounded-lg border border-stone-800/80">
                {personModel.relationalBehavior.howSheHandlesDisagreement}
              </p>
            </div>

            <div className="space-y-1">
              <span className="text-xs font-mono uppercase tracking-wider text-stone-400 font-medium">Changing Her Mind</span>
              <p className="text-stone-200 text-sm leading-relaxed bg-stone-950/60 p-4 rounded-lg border border-stone-800/80">
                {personModel.relationalBehavior.howSheChangesHerMind}
              </p>
            </div>

            <div className="space-y-1">
              <span className="text-xs font-mono uppercase tracking-wider text-stone-400 font-medium">Reacting to Being Wrong</span>
              <p className="text-stone-200 text-sm leading-relaxed bg-stone-950/60 p-4 rounded-lg border border-stone-800/80">
                {personModel.relationalBehavior.howSheReactsToBeingWrong}
              </p>
            </div>

            <div className="space-y-1">
              <span className="text-xs font-mono uppercase tracking-wider text-rose-400 font-medium">What She Refuses to Compromise</span>
              <p className="text-stone-200 text-sm leading-relaxed bg-stone-950/60 p-4 rounded-lg border border-stone-800/80">
                {personModel.relationalBehavior.whatSheRefusesToCompromise}
              </p>
            </div>

            <div className="space-y-1">
              <span className="text-xs font-mono uppercase tracking-wider text-amber-400 font-medium">Sincerity vs. Performance</span>
              <p className="text-stone-200 text-sm leading-relaxed bg-stone-950/60 p-4 rounded-lg border border-stone-800/80">
                {personModel.relationalBehavior.howSincerityDiffersFromPerformance}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 5: Facets */}
      {activeTab === 'facets' && (
        <div id="section-facets" className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-serif text-stone-100">Specific Human Facets ({personModel.facets.length})</h2>
            <button
              onClick={() => setShowAddFacet(!showAddFacet)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-stone-900 rounded-lg text-sm font-medium transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Facet
            </button>
          </div>

          {showAddFacet && (
            <form onSubmit={handleAddFacet} className="bg-stone-900 border border-amber-800/60 rounded-xl p-6 space-y-4">
              <h3 className="text-sm font-semibold text-amber-300 uppercase tracking-wider font-mono">Record New Human Facet</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-stone-400 mb-1">Topic / Characteristic</label>
                  <input
                    type="text"
                    value={newFacetTopic}
                    onChange={(e) => setNewFacetTopic(e.target.value)}
                    placeholder="e.g. Phone Call Anxiety"
                    className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3 py-2 text-stone-200 text-sm focus:outline-none focus:border-amber-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs text-stone-400 mb-1">Direct Creator Quote (Optional)</label>
                  <input
                    type="text"
                    value={newFacetQuote}
                    onChange={(e) => setNewFacetQuote(e.target.value)}
                    placeholder="e.g. If you call without texting first, my heart stops."
                    className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3 py-2 text-stone-200 text-sm focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs text-stone-400 mb-1">Observed Reaction / Behavior</label>
                <textarea
                  value={newFacetReaction}
                  onChange={(e) => setNewFacetReaction(e.target.value)}
                  placeholder="Describe the physical or emotional pattern in concrete, non-clinical terms..."
                  rows={3}
                  className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3 py-2 text-stone-200 text-sm focus:outline-none focus:border-amber-500"
                  required
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddFacet(false)}
                  className="px-4 py-2 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded-lg text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-stone-900 font-semibold rounded-lg text-xs"
                >
                  Save to Person Model
                </button>
              </div>
            </form>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {personModel.facets.map((facet) => (
              <div key={facet.id} className="bg-stone-900 border border-stone-800 rounded-xl p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-base font-serif text-amber-200 font-medium">{facet.topic}</span>
                  <span className="px-2 py-0.5 rounded text-xs font-mono bg-stone-800 text-stone-300 border border-stone-700">
                    Confidence {facet.confidence}%
                  </span>
                </div>
                <p className="text-stone-300 text-sm leading-relaxed">{facet.observedReaction}</p>
                {facet.supportingQuote && (
                  <p className="text-xs italic text-amber-300/90 font-serif border-l-2 border-amber-600/60 pl-3">
                    {facet.supportingQuote}
                  </p>
                )}
                <div className="flex items-center justify-between text-xs text-stone-500 pt-2 border-t border-stone-800 font-mono">
                  <span>{facet.context}</span>
                  <span>{facet.evidenceCount} evidence records</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
