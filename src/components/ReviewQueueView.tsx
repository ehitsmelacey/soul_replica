import React, { useState } from 'react';
import { ReviewQueueItem, ReviewStatus } from '../types';
import { CheckSquare, Check, X, Edit3, ShieldAlert, History, Lock, AlertCircle, FileText } from 'lucide-react';

interface ReviewQueueViewProps {
  queueItems: ReviewQueueItem[];
  onReviewAction: (itemId: string, action: ReviewStatus, notes?: string) => void;
}

export const ReviewQueueView: React.FC<ReviewQueueViewProps> = ({
  queueItems,
  onReviewAction,
}) => {
  const [filter, setFilter] = useState<'awaiting' | 'approved' | 'all'>('awaiting');
  const [correctionModalItem, setCorrectionModalItem] = useState<ReviewQueueItem | null>(null);
  const [correctionNotes, setCorrectionNotes] = useState('');

  const filteredItems = queueItems.filter((item) => {
    if (filter === 'awaiting') return item.status === 'awaiting_creator_review' || item.status === 'unreviewed';
    if (filter === 'approved') return item.status === 'approved' || item.status === 'approved_with_corrections';
    return true;
  });

  const handleOpenCorrection = (item: ReviewQueueItem) => {
    setCorrectionModalItem(item);
    setCorrectionNotes(item.creatorNotes || '');
  };

  const handleSubmitCorrection = (e: React.FormEvent) => {
    e.preventDefault();
    if (!correctionModalItem) return;
    onReviewAction(correctionModalItem.id, 'approved_with_corrections', correctionNotes);
    setCorrectionModalItem(null);
    setCorrectionNotes('');
  };

  return (
    <div id="review-queue-container" className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div id="review-queue-header" className="bg-stone-900 border border-stone-800 rounded-xl p-6 text-stone-100 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono uppercase tracking-wider bg-amber-950/60 text-amber-300 border border-amber-800/50">
                Governance Layer • Learning Control
              </span>
              <span className="text-xs text-stone-400 font-mono">
                {queueItems.filter((i) => i.status === 'awaiting_creator_review').length} Awaiting Approval
              </span>
            </div>
            <h1 className="text-2xl font-serif tracking-tight text-stone-100">Creator Review Queue</h1>
            <p className="text-stone-400 text-sm mt-1 max-w-3xl">
              AI hypotheses, extracted memories, and behavioral patterns never enter the authoritative model without review. 
              Approve, correct, restrict to creator-only, or mark historical-only.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-stone-950 p-1 rounded-lg border border-stone-800">
            <button
              onClick={() => setFilter('awaiting')}
              className={`px-3 py-1.5 rounded-md text-xs font-mono transition-colors ${
                filter === 'awaiting' ? 'bg-amber-600 text-stone-900 font-semibold' : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              Pending ({queueItems.filter((i) => i.status === 'awaiting_creator_review').length})
            </button>
            <button
              onClick={() => setFilter('approved')}
              className={`px-3 py-1.5 rounded-md text-xs font-mono transition-colors ${
                filter === 'approved' ? 'bg-amber-600 text-stone-900 font-semibold' : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              Approved ({queueItems.filter((i) => i.status === 'approved' || i.status === 'approved_with_corrections').length})
            </button>
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1.5 rounded-md text-xs font-mono transition-colors ${
                filter === 'all' ? 'bg-amber-600 text-stone-900 font-semibold' : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              All Items ({queueItems.length})
            </button>
          </div>
        </div>
      </div>

      {/* Queue Items List */}
      <div className="space-y-4">
        {filteredItems.length === 0 ? (
          <div className="text-center py-16 bg-stone-900/60 border border-stone-800 rounded-xl text-stone-400">
            <CheckSquare className="w-10 h-10 mx-auto mb-3 text-stone-600" />
            <p className="text-base font-serif text-stone-300">No items currently in this queue view.</p>
            <p className="text-xs text-stone-500 mt-1">All extracted knowledge candidates have been processed.</p>
          </div>
        ) : (
          filteredItems.map((item) => (
            <div
              key={item.id}
              className="bg-stone-900 border border-stone-800 rounded-xl p-6 space-y-4 transition-all hover:border-stone-700"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-800 pb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider bg-stone-800 text-stone-300 border border-stone-700">
                      {item.type.replace('_', ' ')}
                    </span>
                    <span className="text-xs text-stone-400 font-mono">
                      Confidence {item.confidence}%
                    </span>
                  </div>
                  <h2 className="text-lg font-serif text-stone-100">{item.title}</h2>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-stone-400 font-mono">
                  <FileText className="w-3.5 h-3.5 text-stone-500" />
                  <span>Source: {item.sourceArtifactTitle}</span>
                </div>
              </div>

              {/* Proposed Content */}
              <div className="p-4 bg-stone-950/70 rounded-lg border border-stone-800/90 space-y-2">
                <span className="text-xs font-mono uppercase tracking-wider text-amber-400 font-semibold block">
                  Candidate Extraction / Hypothesis:
                </span>
                <p className="text-stone-200 text-sm leading-relaxed">{item.proposedContent}</p>
                <div className="text-xs text-stone-400 pt-1 font-mono">
                  <span className="text-stone-500">AI Reasoning:</span> {item.aiReasoning}
                </div>
              </div>

              {/* Notes if already corrected */}
              {item.creatorNotes && (
                <div className="p-3 bg-amber-950/20 border border-amber-800/40 rounded-lg text-xs text-amber-200 font-serif italic">
                  <span className="font-mono text-amber-400 uppercase tracking-wider block mb-1">Creator Ratification Notes:</span>
                  “{item.creatorNotes}”
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-stone-500 font-mono">Current Status:</span>
                  <span className={`px-2 py-0.5 rounded text-xs font-mono capitalize ${
                    item.status.includes('approved')
                      ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-800/50'
                      : 'bg-amber-950/60 text-amber-300 border border-amber-800/50'
                  }`}>
                    {item.status.replace(/_/g, ' ')}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => onReviewAction(item.id, 'approved')}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-stone-900 rounded-lg text-xs font-semibold transition-colors"
                  >
                    <Check className="w-3.5 h-3.5" />
                    Approve Cleanly
                  </button>

                  <button
                    onClick={() => handleOpenCorrection(item)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-amber-300 rounded-lg text-xs font-medium border border-stone-700 transition-colors"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    Approve with Correction
                  </button>

                  <button
                    onClick={() => onReviewAction(item.id, 'historical_only')}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded-lg text-xs font-medium border border-stone-700 transition-colors"
                    title="True only historically, not current identity"
                  >
                    <History className="w-3.5 h-3.5" />
                    Historical Only
                  </button>

                  <button
                    onClick={() => onReviewAction(item.id, 'creator_only')}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded-lg text-xs font-medium border border-stone-700 transition-colors"
                    title="Restrict access strictly to Creator"
                  >
                    <Lock className="w-3.5 h-3.5" />
                    Creator Only
                  </button>

                  <button
                    onClick={() => onReviewAction(item.id, 'rejected')}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-stone-800 hover:bg-rose-950/60 text-rose-300 rounded-lg text-xs font-medium border border-stone-700 transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                    Reject
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Correction Modal */}
      {correctionModalItem && (
        <div className="fixed inset-0 bg-stone-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form onSubmit={handleSubmitCorrection} className="bg-stone-900 border border-amber-800/80 rounded-xl p-6 max-w-lg w-full space-y-4">
            <h3 className="text-base font-serif text-stone-100">Approve with Creator Correction</h3>
            <p className="text-xs text-stone-400 leading-relaxed">
              Record your exact refinement or nuance. This ensures the model learns the reality rather than the raw AI deduction.
            </p>
            <div>
              <label className="block text-xs font-mono text-stone-300 mb-1">Your Specific Correction / Nuance</label>
              <textarea
                value={correctionNotes}
                onChange={(e) => setCorrectionNotes(e.target.value)}
                placeholder="e.g. This was true during 2021, but only applied to office lighting, not sunlight..."
                rows={4}
                className="w-full bg-stone-950 border border-stone-800 rounded-lg p-3 text-stone-200 text-sm focus:outline-none focus:border-amber-500"
                required
              />
            </div>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setCorrectionModalItem(null)}
                className="px-4 py-2 bg-stone-800 text-stone-300 rounded-lg text-xs"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-stone-900 font-semibold rounded-lg text-xs"
              >
                Save Correction & Approve
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
