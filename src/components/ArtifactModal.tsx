import React, { useState } from 'react';
import { Artifact, ArtifactCategory, AccessPermissionLevel, EmotionalMood } from '../types';
import { 
  X, 
  Calendar, 
  Tag, 
  Sparkles, 
  Heart, 
  Users, 
  Compass, 
  BookOpen, 
  Trash2, 
  Edit3, 
  Check, 
  ShieldCheck, 
  Activity,
  Layers,
  AlertCircle,
  Plus
} from 'lucide-react';

const PRESET_MOODS: EmotionalMood[] = [
  'Raw Grief',
  'Quiet Peace',
  'Defiant Hope',
  'Vulnerable Love',
  'Melancholy',
  'Creative Spark',
  'Bittersweet',
  'Existential Low',
  'Profound Gratitude',
  'Grounding Calm'
];

const PRESET_LIFE_CONTEXTS = [
  'Grief & Loss',
  'Parental Longing',
  'Isolation',
  'Survival & Rebuilding',
  'Artistic Breakdown',
  'Friendship & Boundaries',
  'Generational Healing',
  'Identity & Purpose',
  'Everyday Sanctuary'
];

const PRESET_TRIGGERS = [
  'Late Night Spirals',
  'Overwhelming Silence',
  'Anniversaries',
  'Seeing Children Milestones',
  'Social Battery Depletion',
  'Fear of Being Forgotten',
  'Scars & Regrets',
  'Thunderstorms & Night Quiet'
];

interface ArtifactModalProps {
  artifact: Artifact | null;
  onClose: () => void;
  onUpdate?: (updated: Artifact) => void;
  onDelete?: (id: string) => void;
}

export const ArtifactModal: React.FC<ArtifactModalProps> = ({
  artifact,
  onClose,
  onUpdate,
  onDelete,
}) => {
  if (!artifact) return null;

  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(artifact.title);
  const [editedTranscription, setEditedTranscription] = useState(artifact.transcription);
  const [editedWisdom, setEditedWisdom] = useState(artifact.extractedWisdom);
  const [editedOutsideTheBoxInsight, setEditedOutsideTheBoxInsight] = useState(artifact.outsideTheBoxInsight || '');
  const [editedEmotionalState, setEditedEmotionalState] = useState(artifact.emotionalState);
  const [editedMood, setEditedMood] = useState<string>(artifact.emotionalMood || 'Quiet Peace');
  const [editedLifeContexts, setEditedLifeContexts] = useState<string[]>(artifact.lifeContexts || []);
  const [editedTriggers, setEditedTriggers] = useState<string[]>(artifact.triggers || []);
  const [editedSentimentScore, setEditedSentimentScore] = useState<number>(artifact.sentimentScore ?? 20);
  const [editedCategory, setEditedCategory] = useState<ArtifactCategory>(artifact.category);
  const [editedAccessLevel, setEditedAccessLevel] = useState<AccessPermissionLevel>(artifact.accessLevel || 'friends_and_children');
  
  const [newCustomContext, setNewCustomContext] = useState('');
  const [newCustomTrigger, setNewCustomTrigger] = useState('');

  const handleSave = () => {
    if (onUpdate) {
      onUpdate({
        ...artifact,
        title: editedTitle,
        transcription: editedTranscription,
        extractedWisdom: editedWisdom,
        outsideTheBoxInsight: editedOutsideTheBoxInsight,
        emotionalState: editedEmotionalState,
        emotionalMood: editedMood,
        lifeContexts: editedLifeContexts,
        triggers: editedTriggers,
        sentimentScore: editedSentimentScore,
        category: editedCategory,
        accessLevel: editedAccessLevel,
      });
    }
    setIsEditing(false);
  };

  const toggleContext = (ctx: string) => {
    setEditedLifeContexts(prev => 
      prev.includes(ctx) ? prev.filter(c => c !== ctx) : [...prev, ctx]
    );
  };

  const addCustomContext = () => {
    if (newCustomContext.trim() && !editedLifeContexts.includes(newCustomContext.trim())) {
      setEditedLifeContexts(prev => [...prev, newCustomContext.trim()]);
      setNewCustomContext('');
    }
  };

  const toggleTrigger = (trig: string) => {
    setEditedTriggers(prev => 
      prev.includes(trig) ? prev.filter(t => t !== trig) : [...prev, trig]
    );
  };

  const addCustomTrigger = () => {
    if (newCustomTrigger.trim() && !editedTriggers.includes(newCustomTrigger.trim())) {
      setEditedTriggers(prev => [...prev, newCustomTrigger.trim()]);
      setNewCustomTrigger('');
    }
  };

  const getCategoryBadge = (cat: ArtifactCategory) => {
    switch (cat) {
      case 'lowest_lows':
        return { label: 'Lowest Lows & Raw Truths', color: 'bg-amber-100 text-amber-900 border-amber-300' };
      case 'children_legacy':
        return { label: 'For My Children', color: 'bg-rose-100 text-rose-900 border-rose-300' };
      case 'friends_counsel':
        return { label: 'For My Friends', color: 'bg-teal-100 text-teal-900 border-teal-300' };
      case 'artwork_creative':
        return { label: 'Art & Expression', color: 'bg-purple-100 text-purple-900 border-purple-300' };
      case 'philosophies':
        return { label: 'Life Philosophies', color: 'bg-blue-100 text-blue-900 border-blue-300' };
      default:
        return { label: 'Memories & History', color: 'bg-stone-100 text-stone-800 border-stone-300' };
    }
  };

  const badge = getCategoryBadge(artifact.category);

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-stone-50 border border-stone-300 rounded-2xl w-full max-w-3xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden my-6">
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-stone-200 bg-stone-100/70 flex items-start justify-between">
          <div className="space-y-1.5 flex-1 mr-4">
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`px-2.5 py-0.5 text-xs font-medium rounded-full border ${badge.color}`}>
                {badge.label}
              </span>

              {/* Mood Tag */}
              <span className="px-2.5 py-0.5 text-xs font-medium rounded-full bg-amber-100/80 text-amber-900 border border-amber-300/80 flex items-center gap-1">
                <Activity className="w-3 h-3 text-amber-700" />
                {artifact.emotionalMood || 'Uncategorized Mood'}
              </span>

              {/* Clearance Tier Badge */}
              <span className={`px-2.5 py-0.5 text-xs font-semibold rounded-full border flex items-center gap-1 ${
                (artifact.accessLevel || editedAccessLevel) === 'children_only'
                  ? 'bg-rose-50 text-rose-800 border-rose-300'
                  : (artifact.accessLevel || editedAccessLevel) === 'creator_only'
                  ? 'bg-stone-800 text-stone-100 border-stone-900'
                  : 'bg-teal-50 text-teal-800 border-teal-300'
              }`}>
                <ShieldCheck className="w-3 h-3" />
                {(artifact.accessLevel || editedAccessLevel) === 'children_only'
                  ? 'Child Clearance Only'
                  : (artifact.accessLevel || editedAccessLevel) === 'creator_only'
                  ? 'Creator Only'
                  : 'Friends & Children'}
              </span>
            </div>

            {isEditing ? (
              <input
                type="text"
                id="edit-artifact-title"
                value={editedTitle}
                onChange={(e) => setEditedTitle(e.target.value)}
                className="w-full font-serif text-xl font-semibold text-stone-900 bg-white border border-stone-300 rounded-lg px-2.5 py-1 focus:outline-none focus:ring-2 focus:ring-amber-700"
              />
            ) : (
              <h3 className="font-serif text-xl sm:text-2xl font-semibold text-stone-900 leading-snug">
                {artifact.title}
              </h3>
            )}

            <div className="flex items-center gap-3 text-xs text-stone-500 pt-1 flex-wrap">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                {artifact.date || 'Undated Memory'}
              </span>
              <span>•</span>
              <span className="capitalize">{artifact.mediaType} Artifact</span>
              {typeof artifact.sentimentScore === 'number' && (
                <>
                  <span>•</span>
                  <span className="font-mono text-stone-600">
                    Valence Score: {artifact.sentimentScore > 0 ? `+${artifact.sentimentScore}` : artifact.sentimentScore}
                  </span>
                </>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {onUpdate && (
              <button
                type="button"
                id="btn-toggle-edit-artifact"
                onClick={() => {
                  if (isEditing) {
                    handleSave();
                  } else {
                    setIsEditing(true);
                  }
                }}
                className={`p-2 rounded-lg text-xs font-medium border transition flex items-center gap-1.5 ${
                  isEditing 
                    ? 'bg-amber-800 text-white border-amber-900' 
                    : 'bg-white text-stone-700 border-stone-300 hover:bg-stone-50'
                }`}
              >
                {isEditing ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Save</span>
                  </>
                ) : (
                  <>
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </>
                )}
              </button>
            )}

            <button
              type="button"
              id="btn-close-artifact-modal"
              onClick={onClose}
              className="p-2 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-200/60 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1">
          {/* Visual asset display */}
          {artifact.fileDataUrl && (
            <div className="rounded-xl overflow-hidden bg-stone-900/5 border border-stone-200 max-h-72 flex items-center justify-center p-2">
              <img
                src={artifact.fileDataUrl}
                alt={artifact.title}
                className="max-h-64 max-w-full object-contain rounded-lg shadow-sm"
              />
            </div>
          )}

          {/* EDITING CONTROLS FOR CATEGORY & MOOD */}
          {isEditing && (
            <div className="bg-stone-100/90 border border-stone-200 rounded-xl p-4 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">
                    Category:
                  </label>
                  <select
                    id="edit-artifact-category"
                    value={editedCategory}
                    onChange={(e) => setEditedCategory(e.target.value as ArtifactCategory)}
                    className="w-full text-xs bg-white border border-stone-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-amber-700"
                  >
                    <option value="lowest_lows">Lowest Lows & Raw Truths</option>
                    <option value="children_legacy">For My Children</option>
                    <option value="friends_counsel">For My Friends</option>
                    <option value="artwork_creative">Art & Expression</option>
                    <option value="philosophies">Life Philosophies</option>
                    <option value="memories_history">Memories & History</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">
                    Emotional Mood Tag:
                  </label>
                  <select
                    id="edit-artifact-mood"
                    value={editedMood}
                    onChange={(e) => setEditedMood(e.target.value)}
                    className="w-full text-xs bg-white border border-stone-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-amber-700"
                  >
                    {PRESET_MOODS.map(m => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  Sentiment Tone Valence (-100 dark valley to +100 transcendent peace):
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min="-100"
                    max="100"
                    value={editedSentimentScore}
                    onChange={(e) => setEditedSentimentScore(parseInt(e.target.value))}
                    className="flex-1 accent-amber-700"
                  />
                  <span className="font-mono text-xs w-12 text-right text-stone-800 font-semibold">
                    {editedSentimentScore > 0 ? `+${editedSentimentScore}` : editedSentimentScore}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* LIFE CONTEXTS & TRIGGERS SECTION */}
          <div className="space-y-4 bg-amber-50/40 border border-amber-200/60 rounded-xl p-4">
            {/* Life Contexts */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="flex items-center gap-1.5 text-xs font-semibold text-amber-950 uppercase tracking-wider">
                  <Layers className="w-3.5 h-3.5 text-amber-700" />
                  Associated Life Contexts
                </span>
                <span className="text-[10px] text-stone-500">
                  Used by AI to identify relevant periods
                </span>
              </div>

              {isEditing ? (
                <div className="space-y-2">
                  <div className="flex flex-wrap gap-1.5">
                    {PRESET_LIFE_CONTEXTS.map(ctx => {
                      const isSelected = editedLifeContexts.includes(ctx);
                      return (
                        <button
                          key={ctx}
                          type="button"
                          onClick={() => toggleContext(ctx)}
                          className={`px-2.5 py-1 text-xs rounded-lg transition font-medium border ${
                            isSelected
                              ? 'bg-amber-800 text-white border-amber-900 shadow-xs'
                              : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-100'
                          }`}
                        >
                          {isSelected && '✓ '}
                          {ctx}
                        </button>
                      );
                    })}
                  </div>
                  <div className="flex items-center gap-2 pt-1">
                    <input
                      type="text"
                      placeholder="Add custom context..."
                      value={newCustomContext}
                      onChange={(e) => setNewCustomContext(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addCustomContext())}
                      className="text-xs px-2.5 py-1.5 bg-white border border-stone-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-700"
                    />
                    <button
                      type="button"
                      onClick={addCustomContext}
                      className="text-xs px-2.5 py-1.5 bg-stone-200 hover:bg-stone-300 text-stone-800 rounded-lg flex items-center gap-1"
                    >
                      <Plus className="w-3 h-3" /> Add
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-wrap gap-1.5">
                  {(artifact.lifeContexts && artifact.lifeContexts.length > 0) ? (
                    artifact.lifeContexts.map(ctx => (
                      <span
                        key={ctx}
                        className="px-2.5 py-1 bg-amber-100 text-amber-950 text-xs font-medium rounded-lg border border-amber-200"
                      >
                        {ctx}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-stone-400 italic">No specific life contexts tagged.</span>
                  )}
                </div>
              )}
            </div>

            {/* Triggers */}
            <div className="pt-3 border-t border-amber-200/50">
              <div className="flex items-center justify-between mb-2">
                <span className="flex items-center gap-1.5 text-xs font-semibold text-rose-950 uppercase tracking-wider">
                  <AlertCircle className="w-3.5 h-3.5 text-rose-700" />
                  Emotional Triggers & Conditions
                </span>
                <span className="text-[10px] text-stone-500">
                  Activates recall when caller feels this condition
                </span>
              </div>

              {isEditing ? (
                <div className="space-y-2">
                  <div className="flex flex-wrap gap-1.5">
                    {PRESET_TRIGGERS.map(trig => {
                      const isSelected = editedTriggers.includes(trig);
                      return (
                        <button
                          key={trig}
                          type="button"
                          onClick={() => toggleTrigger(trig)}
                          className={`px-2.5 py-1 text-xs rounded-lg transition font-medium border ${
                            isSelected
                              ? 'bg-rose-800 text-white border-rose-900 shadow-xs'
                              : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-100'
                          }`}
                        >
                          {isSelected && '✓ '}
                          {trig}
                        </button>
                      );
                    })}
                  </div>
                  <div className="flex items-center gap-2 pt-1">
                    <input
                      type="text"
                      placeholder="Add custom trigger..."
                      value={newCustomTrigger}
                      onChange={(e) => setNewCustomTrigger(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addCustomTrigger())}
                      className="text-xs px-2.5 py-1.5 bg-white border border-stone-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-rose-700"
                    />
                    <button
                      type="button"
                      onClick={addCustomTrigger}
                      className="text-xs px-2.5 py-1.5 bg-stone-200 hover:bg-stone-300 text-stone-800 rounded-lg flex items-center gap-1"
                    >
                      <Plus className="w-3 h-3" /> Add
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-wrap gap-1.5">
                  {(artifact.triggers && artifact.triggers.length > 0) ? (
                    artifact.triggers.map(trig => (
                      <span
                        key={trig}
                        className="px-2.5 py-1 bg-rose-100/70 text-rose-950 text-xs font-medium rounded-lg border border-rose-200"
                      >
                        ⚡ {trig}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-stone-400 italic">No specific triggers tagged.</span>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Raw Content / Transcription */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-stone-700 font-medium text-xs uppercase tracking-wider">
              <BookOpen className="w-4 h-4 text-stone-500" />
              Raw Journal Content / Document Transcription
            </div>
            {isEditing ? (
              <textarea
                id="edit-artifact-transcription"
                rows={8}
                value={editedTranscription}
                onChange={(e) => setEditedTranscription(e.target.value)}
                className="w-full text-sm font-serif text-stone-800 bg-white border border-stone-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-amber-700"
              />
            ) : (
              <div className="font-serif text-sm leading-relaxed text-stone-800 bg-stone-100/70 border border-stone-200 rounded-xl p-4 whitespace-pre-wrap">
                {artifact.transcription}
              </div>
            )}
          </div>

          {/* Extracted Wisdom */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-stone-700 font-medium text-xs uppercase tracking-wider">
              <Compass className="w-4 h-4 text-stone-500" />
              Core Wisdom & Perspective Distillation
            </div>
            {isEditing ? (
              <textarea
                id="edit-extracted-wisdom"
                rows={3}
                value={editedWisdom}
                onChange={(e) => setEditedWisdom(e.target.value)}
                className="w-full text-sm text-stone-800 bg-white border border-stone-300 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-amber-700"
              />
            ) : (
              <div className="text-sm text-stone-700 bg-stone-100/50 border border-stone-200 rounded-xl p-3.5 leading-normal">
                {artifact.extractedWisdom || 'No specific wisdom summary recorded.'}
              </div>
            )}
          </div>

          {/* Outside-the-Box Insight & Retrospective Mindset */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-amber-900 font-medium text-xs uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-amber-700" />
              Outside-the-Box Deductive Mindset (Why Friends Call You)
            </div>
            {isEditing ? (
              <textarea
                id="edit-outside-the-box"
                rows={3}
                value={editedOutsideTheBoxInsight}
                onChange={(e) => setEditedOutsideTheBoxInsight(e.target.value)}
                placeholder="How this experience forged your unorthodox perspective or chain-of-thought..."
                className="w-full text-sm text-stone-800 bg-white border border-amber-300 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-amber-700"
              />
            ) : (
              <div className="text-sm text-stone-800 bg-amber-50/50 border border-amber-200 rounded-xl p-3.5 leading-normal">
                {artifact.outsideTheBoxInsight || artifact.extractedWisdom || 'Consulted in retrospective chain-of-thought to formulate unconventional clarity and candid advice.'}
              </div>
            )}
          </div>

          {/* Audience Specific Perspectives */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {artifact.perspectiveForFriends && (
              <div className="bg-teal-50/60 border border-teal-200/70 rounded-xl p-3.5 space-y-1">
                <div className="flex items-center gap-1.5 text-teal-900 font-medium text-xs">
                  <Users className="w-3.5 h-3.5 text-teal-700" />
                  What this means for Friends
                </div>
                <p className="text-xs text-stone-700 leading-relaxed">
                  {artifact.perspectiveForFriends}
                </p>
              </div>
            )}

            {artifact.perspectiveForChildren && (
              <div className="bg-rose-50/60 border border-rose-200/70 rounded-xl p-3.5 space-y-1">
                <div className="flex items-center gap-1.5 text-rose-900 font-medium text-xs">
                  <Heart className="w-3.5 h-3.5 text-rose-700" />
                  What this means for Children (Sacred)
                </div>
                <p className="text-xs text-stone-700 leading-relaxed">
                  {artifact.perspectiveForChildren}
                </p>
              </div>
            )}
          </div>

          {/* Tags */}
          {artifact.tags && artifact.tags.length > 0 && (
            <div className="flex items-center gap-2 flex-wrap pt-2">
              <Tag className="w-3.5 h-3.5 text-stone-400" />
              {artifact.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-0.5 bg-stone-200/80 text-stone-700 text-xs rounded-md"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-stone-200 bg-stone-100/50 flex items-center justify-between">
          {onDelete ? (
            <button
              type="button"
              id="btn-delete-artifact"
              onClick={() => {
                if (window.confirm('Are you sure you want to remove this artifact from your replica memory?')) {
                  onDelete(artifact.id);
                  onClose();
                }
              }}
              className="flex items-center gap-1.5 text-xs text-red-700 hover:text-red-900 hover:bg-red-50 px-3 py-1.5 rounded-lg transition"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Delete Memory
            </button>
          ) : <div />}

          <button
            type="button"
            id="btn-done-artifact"
            onClick={onClose}
            className="px-4 py-2 bg-stone-800 text-stone-50 text-xs font-medium rounded-lg hover:bg-stone-900 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
