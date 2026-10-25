import React, { useState } from 'react';
import { VoiceModel } from '../types';
import { Mic, Ban, Sliders, Quote, AlertTriangle, Check, Sparkles } from 'lucide-react';

interface VoiceLabViewProps {
  voiceModel: VoiceModel;
  onUpdateVoiceModel?: (updated: VoiceModel) => void;
}

export const VoiceLabView: React.FC<VoiceLabViewProps> = ({
  voiceModel,
  onUpdateVoiceModel,
}) => {
  const [selectedContext, setSelectedContext] = useState<string>('crisis_advice');
  const [newBannedWord, setNewBannedWord] = useState('');

  const currentProfile = voiceModel.contextProfiles[selectedContext] || voiceModel.contextProfiles['casual'];

  const handleAddBannedWord = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBannedWord.trim()) return;
    const word = newBannedWord.trim().toLowerCase();
    if (voiceModel.bannedAiWords.includes(word)) return;

    if (onUpdateVoiceModel) {
      onUpdateVoiceModel({
        ...voiceModel,
        bannedAiWords: [...voiceModel.bannedAiWords, word],
      });
    }
    setNewBannedWord('');
  };

  const handleRemoveBannedWord = (wordToRemove: string) => {
    if (onUpdateVoiceModel) {
      onUpdateVoiceModel({
        ...voiceModel,
        bannedAiWords: voiceModel.bannedAiWords.filter((w) => w !== wordToRemove),
      });
    }
  };

  return (
    <div id="voice-lab-container" className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div id="voice-lab-header" className="bg-stone-900 border border-stone-800 rounded-xl p-6 text-stone-100 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono uppercase tracking-wider bg-purple-950/60 text-purple-300 border border-purple-800/50">
                Layer 2: Model • Voice & Cadence
              </span>
              <span className="text-xs text-stone-400 font-mono">
                {voiceModel.creatorVoiceName}
              </span>
            </div>
            <h1 className="text-2xl font-serif tracking-tight text-stone-100">Voice Lab & Cadence Calibration</h1>
            <p className="text-stone-400 text-sm mt-1 max-w-3xl">
              Strictly calibrates sentence pacing, physical fragments, directness, sarcasm levels, and banned AI clichés. 
              Prevents the model from lapsing into generic wellness or therapist-speak.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-stone-800 text-stone-300 rounded-lg text-xs font-mono border border-stone-700">
              Anti-Drift Guard: Active
            </span>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Context Profiles */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-stone-900 border border-stone-800 rounded-xl p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-stone-800 pb-4">
              <div className="flex items-center gap-2">
                <Sliders className="w-5 h-5 text-amber-500" />
                <h2 className="text-lg font-serif text-stone-100">Context Profiles</h2>
              </div>
              <div className="flex gap-2">
                {Object.keys(voiceModel.contextProfiles).map((key) => (
                  <button
                    key={key}
                    onClick={() => setSelectedContext(key)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono capitalize transition-colors ${
                      selectedContext === key
                        ? 'bg-amber-600 text-stone-900 font-semibold'
                        : 'bg-stone-800 text-stone-400 hover:text-stone-200'
                    }`}
                  >
                    {key.replace('_', ' ')}
                  </button>
                ))}
              </div>
            </div>

            {/* Selected Profile Details */}
            {currentProfile && (
              <div className="space-y-6">
                <div>
                  <span className="text-xs font-mono uppercase tracking-wider text-amber-400 block mb-1">Rhythm & Pacing</span>
                  <p className="text-stone-300 text-sm leading-relaxed bg-stone-950/60 p-4 rounded-lg border border-stone-800/80">
                    {currentProfile.rhythmPacing}
                  </p>
                </div>

                {/* Quantitative Sliders */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 bg-stone-950/60 border border-stone-800 rounded-lg space-y-2">
                    <div className="flex justify-between items-center text-xs font-mono">
                      <span className="text-stone-400">Directness Score</span>
                      <span className="text-amber-400 font-bold">{currentProfile.directnessScore} / 10</span>
                    </div>
                    <div className="w-full bg-stone-800 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-amber-500 h-full rounded-full transition-all"
                        style={{ width: `${(currentProfile.directnessScore / 10) * 100}%` }}
                      />
                    </div>
                    <span className="text-[11px] text-stone-500 block">High score = No beating around the bush</span>
                  </div>

                  <div className="p-4 bg-stone-950/60 border border-stone-800 rounded-lg space-y-2">
                    <div className="flex justify-between items-center text-xs font-mono">
                      <span className="text-stone-400">Sarcasm / Gallows Humor</span>
                      <span className="text-purple-400 font-bold">{currentProfile.sarcasmLevel} / 10</span>
                    </div>
                    <div className="w-full bg-stone-800 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-purple-500 h-full rounded-full transition-all"
                        style={{ width: `${(currentProfile.sarcasmLevel / 10) * 100}%` }}
                      />
                    </div>
                    <span className="text-[11px] text-stone-500 block">Low in child-mode, higher in crisis de-escalation</span>
                  </div>
                </div>

                {/* Sample Opening & Conversational Markers */}
                <div className="space-y-4">
                  <div>
                    <span className="text-xs font-mono uppercase tracking-wider text-stone-400 block mb-1">Authentic Sample Opening</span>
                    <p className="text-amber-200 text-sm font-serif italic bg-amber-950/20 border border-amber-800/40 p-3 rounded-lg">
                      “{currentProfile.sampleOpening}”
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <span className="text-xs font-mono uppercase tracking-wider text-emerald-400 block mb-2">Preferred Natural Phrases</span>
                      <div className="flex flex-wrap gap-2">
                        {currentProfile.preferredPhrases.map((phrase, idx) => (
                          <span key={idx} className="px-2.5 py-1 bg-emerald-950/40 border border-emerald-800/50 text-emerald-300 text-xs rounded-md">
                            {phrase}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <span className="text-xs font-mono uppercase tracking-wider text-rose-400 block mb-2">Forbidden Words in this Context</span>
                      <div className="flex flex-wrap gap-2">
                        {currentProfile.forbiddenWords.map((word, idx) => (
                          <span key={idx} className="px-2.5 py-1 bg-rose-950/40 border border-rose-800/50 text-rose-300 text-xs rounded-md flex items-center gap-1">
                            <Ban className="w-3 h-3 text-rose-400" />
                            {word}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Quotation Library */}
          <div className="bg-stone-900 border border-stone-800 rounded-xl p-6 space-y-4">
            <h2 className="text-lg font-serif text-stone-100 flex items-center gap-2">
              <Quote className="w-5 h-5 text-amber-500" />
              Creator Approved Voice Samples
            </h2>
            <div className="space-y-3">
              {voiceModel.sampleQuotations.map((q, idx) => (
                <div key={idx} className="p-4 bg-stone-950/70 border border-stone-800/80 rounded-lg text-stone-300 text-sm font-serif italic border-l-2 border-amber-600">
                  {q}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Global Banned AI Words */}
        <div className="space-y-6">
          <div className="bg-stone-900 border border-stone-800 rounded-xl p-6 space-y-4">
            <div className="flex items-center gap-2">
              <Ban className="w-5 h-5 text-rose-500" />
              <div>
                <h2 className="text-base font-serif text-stone-100">Banned AI-isms & Clichés</h2>
                <p className="text-xs text-stone-400 mt-0.5">Strict prohibition list to prevent robotic flattery</p>
              </div>
            </div>

            <form onSubmit={handleAddBannedWord} className="flex gap-2">
              <input
                type="text"
                value={newBannedWord}
                onChange={(e) => setNewBannedWord(e.target.value)}
                placeholder="Add banned word or cliché..."
                className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3 py-2 text-xs text-stone-200 focus:outline-none focus:border-rose-500"
              />
              <button
                type="submit"
                className="px-3 py-2 bg-rose-600 hover:bg-rose-500 text-stone-900 font-semibold rounded-lg text-xs shrink-0"
              >
                Add
              </button>
            </form>

            <div className="flex flex-wrap gap-2 pt-2">
              {voiceModel.bannedAiWords.map((word) => (
                <span
                  key={word}
                  className="px-2.5 py-1 bg-stone-950 border border-stone-800 hover:border-rose-800 text-stone-300 text-xs rounded-md flex items-center gap-1.5 transition-colors group"
                >
                  <span className="text-rose-400">✕</span>
                  <span>{word}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveBannedWord(word)}
                    className="text-stone-500 hover:text-rose-300 text-xs ml-1"
                    title="Remove word"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>

            <div className="p-4 bg-stone-950/60 rounded-lg border border-stone-800/80 text-xs text-stone-400 space-y-2 mt-4">
              <div className="flex items-center gap-1.5 text-amber-400 font-medium font-mono">
                <AlertTriangle className="w-3.5 h-3.5" />
                Anti-Drift Rule
              </div>
              <p>
                If a candidate simulation response generates any of these words or phrases, the Anti-Drift Sentinel 
                penalizes the generation and forces an earthy, concrete rewrite.
              </p>
            </div>
          </div>

          {/* Syntactic Structure Rules */}
          <div className="bg-stone-900 border border-stone-800 rounded-xl p-6 space-y-3">
            <h2 className="text-base font-serif text-stone-100 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-400" />
              Punctuation & Syntax Habits
            </h2>
            <p className="text-stone-300 text-xs leading-relaxed bg-stone-950/60 p-3 rounded-lg border border-stone-800">
              {voiceModel.punctuationHabits}
            </p>
            <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 pt-1">
              <Check className="w-4 h-4" />
              Fragments & Profanity Allowed For Emphasis
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
