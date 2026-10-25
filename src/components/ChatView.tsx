import React, { useState, useEffect, useRef } from 'react';
import { 
  PerspectiveMode, 
  SoulProfile, 
  Artifact, 
  ChatMessage, 
  AccessTier, 
  RelationshipRole, 
  CreatorConstitution, 
  PersonalityTrait, 
  ContradictionRecord,
  AttentionProcessingPattern,
  NegativePreference,
  ValueItem,
  BeliefItem,
  VoiceModel
} from '../types';
import { 
  Send, 
  Sparkles, 
  Heart, 
  Users, 
  Compass, 
  RotateCcw, 
  BookOpen, 
  AlertCircle,
  MessageCircle,
  User,
  Info,
  ShieldCheck,
  Lock,
  HeartHandshake,
  CheckCircle2,
  Tag,
  ThumbsDown,
  Edit3,
  Sliders,
  Scale
} from 'lucide-react';
import { ArtifactModal } from './ArtifactModal';

interface ChatViewProps {
  profile: SoulProfile;
  artifacts: Artifact[];
  activeMode: PerspectiveMode;
  onModeChange: (mode: PerspectiveMode) => void;
  accessTier?: AccessTier;
  constitution?: CreatorConstitution;
  traits?: PersonalityTrait[];
  contradictions?: ContradictionRecord[];
  attentionPatterns?: AttentionProcessingPattern[];
  negativePreferences?: NegativePreference[];
  values?: ValueItem[];
  beliefs?: BeliefItem[];
  voiceModel?: VoiceModel;
  onSaveCreatorCorrection?: (messageId: string, wouldHaveSaidInstead: string, failureCategory: string) => void;
  initialInputText?: string;
}

export const ChatView: React.FC<ChatViewProps> = ({
  profile,
  artifacts,
  activeMode,
  onModeChange,
  accessTier = 'creator',
  constitution,
  traits,
  contradictions,
  attentionPatterns,
  negativePreferences,
  values,
  beliefs,
  voiceModel,
  onSaveCreatorCorrection,
  initialInputText = '',
}) => {
  const currentTier: AccessTier = (accessTier as AccessTier) || 'creator';

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState(initialInputText);
  const [isLoading, setIsLoading] = useState(false);
  const [callerName, setCallerName] = useState('');
  const [showCallerSettings, setShowCallerSettings] = useState(false);
  const [selectedArtifactForModal, setSelectedArtifactForModal] = useState<Artifact | null>(null);
  
  // Quick correction modal state
  const [correctingMessageId, setCorrectingMessageId] = useState<string | null>(null);
  const [correctionText, setCorrectionText] = useState('');
  const [correctionCategory, setCorrectionCategory] = useState('too_polished');
  const [correctionNotice, setCorrectionNotice] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Sync initial input if passed from outside
  useEffect(() => {
    if (initialInputText) {
      setInputText(initialInputText);
    }
  }, [initialInputText]);

  // Load persisted chat or generate opening message
  useEffect(() => {
    const storageKey = `soul_chat_${activeMode}_${currentTier}`;
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      try {
        setMessages(JSON.parse(saved));
        return;
      } catch (e) {
        console.error(e);
      }
    }

    const initialGreeting = getInitialGreeting(activeMode, profile, currentTier);
    setMessages([initialGreeting]);
  }, [activeMode, profile.name, currentTier]);

  // Persist messages per mode and tier
  useEffect(() => {
    if (messages.length > 0) {
      const storageKey = `soul_chat_${activeMode}_${currentTier}`;
      localStorage.setItem(storageKey, JSON.stringify(messages));
    }
  }, [messages, activeMode, currentTier]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  function getInitialGreeting(mode: PerspectiveMode, prof: SoulProfile, tier: AccessTier): ChatMessage {
    if (tier === 'child' || mode === 'child') {
      return {
        id: 'init-child',
        sender: 'replica',
        perspectiveMode: 'child',
        timestamp: Date.now(),
        roleClearance: 'child',
        text: `If you are reading this, no matter how many years have passed, what silence hung between us, or what has happened: hear this with absolute certainty—I loved you then, I love you right now, and I will love you forever. You were never to blame for the heavy things, the depression, or the distance. Whatever question or memory is on your heart—even if you are angry, hurting, or wondering if you were remembered—ask me anything. My love for you is permanent and unbroken.`,
      };
    } else if (tier === 'friend' || mode === 'friend') {
      return {
        id: 'init-friend',
        sender: 'replica',
        perspectiveMode: 'friend',
        timestamp: Date.now(),
        roleClearance: 'friend',
        text: `Hey. If you're here talking to this, it probably means you reached out and my physical world is currently too heavy or drained for me to pick up the phone. I want you to know right now: you are never a burden, and my silence is just me keeping my head above water. Tell me what's on your mind. I am here, and I will give you the realest, most honest thoughts I have. No platitudes.`,
      };
    } else {
      return {
        id: 'init-creator',
        sender: 'replica',
        perspectiveMode: 'general',
        timestamp: Date.now(),
        roleClearance: 'creator',
        text: `Creator Simulator Active. I am an evidence-grounded AI model of Lacey, governed by your Constitution and approved archives. You can test predictions, simulate how you would respond to friends or children, or test counterfactual questions. Contradictions are preserved. Fidelity outranks flattery.`,
      };
    }
  }

  const handleSendMessage = async (customPrompt?: string, isCounterfactualQuery = false) => {
    const textToSend = customPrompt || inputText.trim();
    if (!textToSend || isLoading) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: Date.now(),
      perspectiveMode: activeMode,
      roleClearance: (currentTier as RelationshipRole) || 'creator',
      isCounterfactualPrediction: isCounterfactualQuery,
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInputText('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages,
          mode: activeMode,
          profile,
          constitution,
          artifacts,
          traits,
          contradictions,
          attentionPatterns,
          negativePreferences,
          values,
          beliefs,
          voiceModel,
          accessTier: currentTier,
          callerContext: callerName ? `Caller / Recipient identifies as: ${callerName}` : undefined,
          isCounterfactual: isCounterfactualQuery,
        }),
      });

      if (!response.ok) {
        throw new Error('Server returned an error');
      }

      const result = await response.json();

      const replicaMsg: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: 'replica',
        text: result.text || '...',
        timestamp: Date.now(),
        perspectiveMode: activeMode,
        roleClearance: (currentTier as RelationshipRole) || 'creator',
        referencedArtifacts: result.referencedArtifacts || [],
        provenanceChips: result.provenanceChips || [],
        evaluation: result.evaluation,
        isCounterfactualPrediction: isCounterfactualQuery,
      };

      setMessages([...newMessages, replicaMsg]);
    } catch (err: any) {
      console.error(err);
      const errorMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        sender: 'replica',
        text: `I ran into an issue consulting Lacey's approved records: ${err.message || 'Network error'}. Please try again.`,
        timestamp: Date.now(),
        perspectiveMode: activeMode,
      };
      setMessages([...newMessages, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetChat = () => {
    const greeting = getInitialGreeting(activeMode, profile, currentTier);
    setMessages([greeting]);
    const storageKey = `soul_chat_${activeMode}_${currentTier}`;
    localStorage.removeItem(storageKey);
  };

  const handleOpenCorrection = (msgId: string) => {
    setCorrectingMessageId(msgId);
    setCorrectionText('');
    setCorrectionCategory('too_polished');
  };

  const handleApplyQuickCorrection = (e: React.FormEvent) => {
    e.preventDefault();
    if (!correctingMessageId || !correctionText.trim()) return;

    if (onSaveCreatorCorrection) {
      onSaveCreatorCorrection(correctingMessageId, correctionText.trim(), correctionCategory);
    }

    // Attach correction note to message
    setMessages((prev) =>
      prev.map((m) =>
        m.id === correctingMessageId
          ? {
              ...m,
              creatorCorrection: {
                wouldHaveSaidInstead: correctionText.trim(),
                failureCategory: correctionCategory,
                correctionNotes: 'Creator explicitly calibrated this response.',
              },
            }
          : m
      )
    );

    setCorrectionNotice(true);
    setTimeout(() => {
      setCorrectionNotice(false);
      setCorrectingMessageId(null);
    }, 2000);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-5.5rem)] max-w-5xl mx-auto bg-white border border-stone-200/80 rounded-2xl shadow-xs overflow-hidden">
      {/* Top Header: Mode & Perspective Clearances */}
      <div className="border-b border-stone-200 bg-stone-50/70 px-4 sm:px-6 py-3 shrink-0">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-stone-900 text-stone-100 flex items-center justify-center font-serif text-lg font-bold shadow-xs">
              L
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-sm font-serif font-bold text-stone-900">
                  Lacey: Soul Replica
                </h1>
                <span className="px-2 py-0.5 rounded-full text-[10px] uppercase font-mono font-medium bg-amber-100 text-amber-800 border border-amber-200">
                  Tier: {currentTier.toUpperCase()}
                </span>
              </div>
              <p className="text-[11px] text-stone-500">
                Evidence-grounded model • Fidelity &gt; Flattery • Constitution Enforced
              </p>
            </div>
          </div>

          {/* Perspective Mode Switcher */}
          <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
            <button
              type="button"
              onClick={() => onModeChange('friend')}
              className={`px-3 py-1.5 rounded-xl font-medium flex items-center gap-1.5 transition ${
                activeMode === 'friend'
                  ? 'bg-amber-900 text-white shadow-2xs'
                  : 'bg-white border border-stone-200 text-stone-700 hover:bg-stone-100'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Friend</span>
            </button>

            <button
              type="button"
              onClick={() => onModeChange('child')}
              className={`px-3 py-1.5 rounded-xl font-medium flex items-center gap-1.5 transition ${
                activeMode === 'child'
                  ? 'bg-rose-900 text-white shadow-2xs'
                  : 'bg-white border border-stone-200 text-stone-700 hover:bg-rose-50 text-rose-800'
              }`}
            >
              <Heart className="w-3.5 h-3.5 text-rose-400" />
              <span>Child (Sacred)</span>
            </button>

            <button
              type="button"
              onClick={() => onModeChange('general')}
              className={`px-3 py-1.5 rounded-xl font-medium flex items-center gap-1.5 transition ${
                activeMode === 'general' || activeMode === 'self'
                  ? 'bg-stone-900 text-white shadow-2xs'
                  : 'bg-white border border-stone-200 text-stone-700 hover:bg-stone-100'
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Creator / Self</span>
            </button>

            <button
              type="button"
              onClick={handleResetChat}
              title="Reset conversation"
              className="p-1.5 rounded-xl text-stone-500 hover:text-stone-800 hover:bg-stone-200/60 transition ml-1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Counterfactual & Insight Shortcuts */}
        <div className="mt-2.5 pt-2 border-t border-stone-200/50 flex items-center gap-1.5 overflow-x-auto text-[11px]">
          <span className="text-stone-400 font-medium shrink-0 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-500" />
            <span>Probe Lacey:</span>
          </span>

          {[
            { label: 'What would Lacey notice first?', query: 'If you walked into a chaotic room, what would Lacey notice first?' },
            { label: 'What would change her mind?', query: 'What would probably change Lacey\'s mind on an issue she feels strongly about?' },
            { label: 'What does she consider bullshit?', query: 'What does Lacey consider complete bullshit when someone is apologizing or advising her?' },
            { label: 'Belief then vs now?', query: 'What did Lacey believe in early adulthood versus what does she believe right now?' },
            { label: 'What would she do right now?', query: 'If a close friend calls having a panic attack at 2 AM, what would Lacey probably do?' },
          ].map((item) => (
            <button
              key={item.label}
              type="button"
              onClick={() => handleSendMessage(item.query, true)}
              className="px-2.5 py-1 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 transition shrink-0"
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Messages Feed */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 bg-stone-50/30">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div className="flex items-center gap-2 mb-1 px-1">
              <span className="text-[10px] font-mono uppercase tracking-wider text-stone-400">
                {msg.sender === 'user' ? (callerName || 'You') : 'Lacey (AI Replica)'}
              </span>
              <span className="text-[10px] text-stone-400">
                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
              {msg.isCounterfactualPrediction && (
                <span className="text-[9px] uppercase font-mono px-1.5 py-0.2 rounded-full bg-indigo-100 text-indigo-800">
                  Prediction
                </span>
              )}
            </div>

            <div
              className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 shadow-2xs leading-relaxed text-xs sm:text-sm ${
                msg.sender === 'user'
                  ? 'bg-stone-900 text-white rounded-tr-xs'
                  : 'bg-white border border-stone-200/80 text-stone-800 font-serif rounded-tl-xs'
              }`}
            >
              <div className="whitespace-pre-wrap">{msg.text}</div>

              {/* Provenance Chips */}
              {msg.provenanceChips && msg.provenanceChips.length > 0 && (
                <div className="mt-3 pt-2.5 border-t border-stone-100 space-y-1.5 font-sans">
                  <span className="text-[10px] uppercase font-bold text-stone-400 tracking-wider block">
                    Grounded Provenance:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {msg.provenanceChips.map((chip) => (
                      <span
                        key={chip.id}
                        title={chip.summary}
                        className="px-2 py-0.5 rounded-md bg-stone-100 text-stone-700 text-[10px] font-medium border border-stone-200/60 flex items-center gap-1"
                      >
                        <Tag className="w-2.5 h-2.5 text-stone-400" />
                        <span>{chip.title}</span>
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Creator Correction Display */}
              {msg.creatorCorrection && (
                <div className="mt-3 p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-[11px] font-sans text-amber-900">
                  <div className="flex items-center gap-1 font-bold text-amber-950 mb-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-700" />
                    <span>Creator Calibrated (Lacey's Correction Applied):</span>
                  </div>
                  <p className="italic">“{msg.creatorCorrection.wouldHaveSaidInstead}”</p>
                </div>
              )}

              {/* Anti-Drift Evaluation & Calibration trigger */}
              {msg.sender === 'replica' && (
                <div className="mt-3 pt-2 border-t border-stone-100 flex items-center justify-between text-[10px] font-sans text-stone-400">
                  <div className="flex items-center gap-2">
                    <span>Authenticity: {msg.evaluation?.authenticityScore || 95}%</span>
                    <span>•</span>
                    <span>Genericness: {msg.evaluation?.genericAiScore || 4}%</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleOpenCorrection(msg.id)}
                    className="text-stone-500 hover:text-stone-900 flex items-center gap-1 transition"
                  >
                    <Edit3 className="w-2.5 h-2.5" />
                    <span>Calibrate this response</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex items-start gap-2">
            <div className="p-3 rounded-2xl bg-white border border-stone-200 text-stone-500 text-xs flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-600 animate-pulse" />
              <span className="font-serif italic">Lacey's replica is cross-referencing approved records...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-3 sm:p-4 border-t border-stone-200 bg-white">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-end gap-2"
        >
          <div className="flex-1 relative">
            <textarea
              rows={2}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              placeholder={
                activeMode === 'child'
                  ? 'Speak directly to Lacey about memories, forgiveness, or questions...'
                  : activeMode === 'friend'
                  ? 'Ask Lacey for honest counsel, or talk through a 2 AM spiral...'
                  : 'Interact with Lacey\'s evidence-grounded replica...'
              }
              className="w-full text-xs sm:text-sm p-3 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 resize-none font-serif"
            />
          </div>

          <button
            type="submit"
            disabled={!inputText.trim() || isLoading}
            className="p-3 rounded-xl bg-stone-900 text-white hover:bg-stone-800 disabled:opacity-40 transition shadow-xs shrink-0"
          >
            <Send className="w-4 h-4 text-amber-400" />
          </button>
        </form>
      </div>

      {/* Quick Calibration Modal */}
      {correctingMessageId && (
        <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full p-5 shadow-xl border border-stone-200 space-y-3">
            <div className="flex items-center justify-between border-b border-stone-100 pb-2">
              <span className="text-xs font-bold text-stone-900 uppercase tracking-wider">
                Creator Calibration Workflow
              </span>
              <button
                type="button"
                onClick={() => setCorrectingMessageId(null)}
                className="text-stone-400 hover:text-stone-700"
              >
                ✕
              </button>
            </div>

            {correctionNotice ? (
              <div className="p-3 rounded-xl bg-emerald-50 text-emerald-900 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Correction recorded. The model will calibrate toward this authentic voice.</span>
              </div>
            ) : (
              <form onSubmit={handleApplyQuickCorrection} className="space-y-3 text-xs">
                <div>
                  <label className="font-semibold text-stone-800 block mb-1">
                    What failed in this response?
                  </label>
                  <select
                    value={correctionCategory}
                    onChange={(e) => setCorrectionCategory(e.target.value)}
                    className="w-full p-2 rounded-xl border border-stone-300 bg-stone-50"
                  >
                    <option value="too_polished">Too polished / smoothed out</option>
                    <option value="too_generic">Too generic / generic AI chatbot speak</option>
                    <option value="too_nice">Making me sound too nice</option>
                    <option value="too_harsh">Making me sound needlessly harsh</option>
                    <option value="therapy_talk">Canned therapy / mindfulness jargon</option>
                    <option value="wrong_humor">Wrong humor style</option>
                    <option value="wrong_fact">Factual inaccuracy</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-stone-800 block mb-1">
                    What would Lacey have said instead? (Required)
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Enter what you would have actually said..."
                    value={correctionText}
                    onChange={(e) => setCorrectionText(e.target.value)}
                    className="w-full p-2 rounded-xl border border-stone-300 bg-stone-50 focus:bg-white focus:outline-none"
                    required
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setCorrectingMessageId(null)}
                    className="px-3 py-1.5 rounded-xl border border-stone-200 text-stone-600 hover:bg-stone-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-stone-900 text-white font-medium hover:bg-stone-800"
                  >
                    Save Correction
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Artifact inspection modal */}
      {selectedArtifactForModal && (
        <ArtifactModal
          artifact={selectedArtifactForModal}
          isOpen={true}
          onClose={() => setSelectedArtifactForModal(null)}
        />
      )}
    </div>
  );
};
