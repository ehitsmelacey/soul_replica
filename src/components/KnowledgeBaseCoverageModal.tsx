import React from 'react';
import { Artifact } from '../types';
import { 
  X, 
  CheckCircle2, 
  Brain, 
  Sparkles, 
  Layers, 
  AlertCircle, 
  ShieldCheck, 
  Heart, 
  Users, 
  TrendingUp, 
  Compass,
  FileCheck
} from 'lucide-react';

interface KnowledgeBaseCoverageModalProps {
  isOpen: boolean;
  onClose: () => void;
  artifacts: Artifact[];
  onOpenVisualizer?: () => void;
  onOpenSentiment?: () => void;
}

export const KnowledgeBaseCoverageModal: React.FC<KnowledgeBaseCoverageModalProps> = ({
  isOpen,
  onClose,
  artifacts,
  onOpenVisualizer,
  onOpenSentiment,
}) => {
  if (!isOpen) return null;

  const total = artifacts.length;
  const integratedCount = artifacts.filter(a => a.isIntegrated !== false).length;
  const integrationPercent = total > 0 ? Math.round((integratedCount / total) * 100) : 0;

  // Category counts
  const lowestLowsCount = artifacts.filter(a => a.category === 'lowest_lows').length;
  const childrenLegacyCount = artifacts.filter(a => a.category === 'children_legacy').length;
  const friendsCounselCount = artifacts.filter(a => a.category === 'friends_counsel').length;
  const artworkCreativeCount = artifacts.filter(a => a.category === 'artwork_creative').length;
  const philosophiesCount = artifacts.filter(a => a.category === 'philosophies').length;
  const memoriesHistoryCount = artifacts.filter(a => a.category === 'memories_history').length;

  // Outside-the-box depth
  const outsideTheBoxCount = artifacts.filter(a => a.outsideTheBoxInsight && a.outsideTheBoxInsight.trim().length > 0).length;
  const outsideTheBoxPercent = total > 0 ? Math.round((outsideTheBoxCount / total) * 100) : 0;

  // Unique life contexts & triggers
  const uniqueLifeContexts = Array.from(new Set(artifacts.flatMap(a => a.lifeContexts || [])));
  const uniqueTriggers = Array.from(new Set(artifacts.flatMap(a => a.triggers || [])));
  const uniqueMoods = Array.from(new Set(artifacts.map(a => a.emotionalMood).filter(Boolean)));

  return (
    <div className="fixed inset-0 z-50 bg-stone-950/65 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-stone-50 border border-stone-300 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden my-6">
        {/* Header */}
        <div className="p-6 border-b border-stone-200 bg-stone-100/80 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-900 text-amber-50 flex items-center justify-center shadow-xs">
              <Brain className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif text-xl font-bold text-stone-900">
                  Knowledge Base Coverage
                </h3>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-900 border border-emerald-300 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-700" />
                  {integrationPercent}% Active
                </span>
              </div>
              <p className="text-xs text-stone-500 pt-0.5">
                Cognitive synthesis status of raw journals, lowest lows, and memories
              </p>
            </div>
          </div>

          <button
            type="button"
            id="btn-close-coverage-modal"
            onClick={onClose}
            className="p-2 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-200/60 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-stone-800">
          {/* Main Integration Banner */}
          <div className="p-4 rounded-xl bg-white border border-stone-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between text-xs font-semibold text-stone-600">
              <span className="flex items-center gap-1.5 uppercase tracking-wider text-amber-900">
                <FileCheck className="w-4 h-4 text-amber-700" />
                Synthesis Progress
              </span>
              <span className="font-mono text-stone-900">
                {integratedCount} of {total} Artifacts Synthesized ({integrationPercent}%)
              </span>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-3 bg-stone-100 rounded-full overflow-hidden border border-stone-200 p-0.5">
              <div
                className="h-full bg-linear-to-r from-amber-700 via-amber-600 to-emerald-600 rounded-full transition-all duration-700"
                style={{ width: `${integrationPercent}%` }}
              />
            </div>

            <p className="text-xs text-stone-600 leading-relaxed">
              Every processed document, photo of journal entries, and raw reflection is fully available to the AI's cognitive reasoning core. It uses all past experiences retrospectively to deduce your genuine mindset and outside-the-box perspective.
            </p>
          </div>

          {/* Metric Cards Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 bg-white border border-stone-200 rounded-xl space-y-1">
              <div className="text-[11px] font-medium text-stone-500 uppercase tracking-wider">
                Total Artifacts
              </div>
              <div className="text-xl font-serif font-bold text-stone-900">
                {total}
              </div>
              <div className="text-[11px] text-emerald-700 font-medium">
                {integratedCount} Ingested
              </div>
            </div>

            <div className="p-3 bg-white border border-stone-200 rounded-xl space-y-1">
              <div className="text-[11px] font-medium text-stone-500 uppercase tracking-wider">
                Outside-the-Box
              </div>
              <div className="text-xl font-serif font-bold text-amber-800">
                {outsideTheBoxPercent}%
              </div>
              <div className="text-[11px] text-stone-500">
                {outsideTheBoxCount} Lateral insights
              </div>
            </div>

            <div className="p-3 bg-white border border-stone-200 rounded-xl space-y-1">
              <div className="text-[11px] font-medium text-stone-500 uppercase tracking-wider">
                Life Contexts
              </div>
              <div className="text-xl font-serif font-bold text-stone-900">
                {uniqueLifeContexts.length}
              </div>
              <div className="text-[11px] text-stone-500">
                Anchors mapped
              </div>
            </div>

            <div className="p-3 bg-white border border-stone-200 rounded-xl space-y-1">
              <div className="text-[11px] font-medium text-stone-500 uppercase tracking-wider">
                Triggers Mapped
              </div>
              <div className="text-xl font-serif font-bold text-rose-800">
                {uniqueTriggers.length}
              </div>
              <div className="text-[11px] text-stone-500">
                Recall cues
              </div>
            </div>
          </div>

          {/* Category Coverage Breakdown */}
          <div className="bg-stone-100/70 border border-stone-200 rounded-xl p-4 space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-700 flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-stone-600" />
              Category Ingestion Breakdown
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div className="flex items-center justify-between p-2 rounded-lg bg-white border border-stone-200">
                <span className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-600" />
                  Lowest Lows & Survival
                </span>
                <span className="font-mono font-semibold text-stone-800">{lowestLowsCount} items</span>
              </div>

              <div className="flex items-center justify-between p-2 rounded-lg bg-white border border-stone-200">
                <span className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                  Children's Sacred Legacy
                </span>
                <span className="font-mono font-semibold text-stone-800">{childrenLegacyCount} items</span>
              </div>

              <div className="flex items-center justify-between p-2 rounded-lg bg-white border border-stone-200">
                <span className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-teal-600" />
                  Friends Counsel & Boundaries
                </span>
                <span className="font-mono font-semibold text-stone-800">{friendsCounselCount} items</span>
              </div>

              <div className="flex items-center justify-between p-2 rounded-lg bg-white border border-stone-200">
                <span className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-purple-600" />
                  Art & Creative Expression
                </span>
                <span className="font-mono font-semibold text-stone-800">{artworkCreativeCount} items</span>
              </div>

              <div className="flex items-center justify-between p-2 rounded-lg bg-white border border-stone-200">
                <span className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
                  Life Philosophies
                </span>
                <span className="font-mono font-semibold text-stone-800">{philosophiesCount} items</span>
              </div>

              <div className="flex items-center justify-between p-2 rounded-lg bg-white border border-stone-200">
                <span className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-stone-500" />
                  Memories & History
                </span>
                <span className="font-mono font-semibold text-stone-800">{memoriesHistoryCount} items</span>
              </div>
            </div>
          </div>

          {/* Active Moods and Contexts Cloud */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-700 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-700" />
              Emotional Moods Currently Synthesized
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {uniqueMoods.map(m => (
                <span key={m} className="px-2.5 py-1 text-xs rounded-lg bg-amber-100 text-amber-900 border border-amber-200 font-medium">
                  {m}
                </span>
              ))}
            </div>
          </div>

          {/* Quick Action Links */}
          <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
            {onOpenVisualizer && (
              <button
                type="button"
                id="btn-modal-open-visualizer"
                onClick={() => {
                  onClose();
                  onOpenVisualizer();
                }}
                className="w-full sm:w-1/2 py-2.5 px-3 rounded-xl border border-stone-300 hover:border-amber-700 bg-white hover:bg-amber-50 text-xs font-medium text-stone-800 flex items-center justify-center gap-2 transition"
              >
                <Brain className="w-4 h-4 text-amber-700" />
                View D3 Thought Visualizer
              </button>
            )}

            {onOpenSentiment && (
              <button
                type="button"
                id="btn-modal-open-sentiment"
                onClick={() => {
                  onClose();
                  onOpenSentiment();
                }}
                className="w-full sm:w-1/2 py-2.5 px-3 rounded-xl border border-stone-300 hover:border-teal-700 bg-white hover:bg-teal-50 text-xs font-medium text-stone-800 flex items-center justify-center gap-2 transition"
              >
                <TrendingUp className="w-4 h-4 text-teal-700" />
                View Sentiment Trend Analysis
              </button>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-stone-200 bg-stone-100/50 flex justify-end">
          <button
            type="button"
            id="btn-dismiss-coverage-modal"
            onClick={onClose}
            className="px-4 py-2 bg-stone-900 text-stone-50 text-xs font-medium rounded-lg hover:bg-stone-800 transition"
          >
            Close Summary
          </button>
        </div>
      </div>
    </div>
  );
};
