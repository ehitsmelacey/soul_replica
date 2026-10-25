import React, { useState } from 'react';
import { SoulProfile, Artifact, PerspectiveMode, AccessTier } from '../types';
import { 
  Heart, 
  Users, 
  BookOpen, 
  ArrowLeft, 
  Lock, 
  ShieldCheck, 
  Key, 
  CheckCircle, 
  AlertCircle,
  HelpCircle,
  Unlock,
  Shield
} from 'lucide-react';
import { ChatView } from './ChatView';
import { ArtifactModal } from './ArtifactModal';

interface RecipientViewProps {
  profile: SoulProfile;
  artifacts: Artifact[];
  onExitRecipientMode: () => void;
}

export const RecipientView: React.FC<RecipientViewProps> = ({
  profile,
  artifacts,
  onExitRecipientMode,
}) => {
  const [activeTab, setActiveTab] = useState<'welcome' | 'chat' | 'vault'>('welcome');
  const [authenticatedTier, setAuthenticatedTier] = useState<AccessTier>('unauthenticated');
  const [selectedArtifact, setSelectedArtifact] = useState<Artifact | null>(null);

  // Gateway Modal State
  const [pendingTier, setPendingTier] = useState<'friend' | 'child' | null>(null);
  const [inputPasskey, setInputPasskey] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);

  const security = profile.securityConfig || {
    friendPassphrase: '',
    friendHint: '',
    childPassphrase: '',
    childHint: '',
    secretFamilyQuestion: '',
    secretFamilyAnswer: '',
  };

  const handleOpenGateway = (tier: 'friend' | 'child') => {
    setPendingTier(tier);
    setInputPasskey('');
    setAuthError(null);
  };

  const handleVerifyPasskey = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pendingTier) return;

    setIsVerifying(true);
    setAuthError(null);

    try {
      const res = await fetch('/api/auth/verify-access', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          passkey: inputPasskey,
          securityConfig: security,
          type: pendingTier,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setAuthenticatedTier(data.tier);
        setPendingTier(null);
        setActiveTab('chat');
      } else {
        setAuthError(data.error || 'Access verification failed. Please check the passphrase or memory answer.');
      }
    } catch (err: any) {
      setAuthError('Error verifying credentials: ' + err.message);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleLockSession = () => {
    setAuthenticatedTier('unauthenticated');
    setActiveTab('welcome');
  };

  // Filter artifacts according to active tier
  const accessibleArtifacts = artifacts.filter((art) => {
    if (art.accessLevel === 'creator_only') return false;
    if (authenticatedTier === 'child') {
      return true; // Child can see public, shared, and children_only
    }
    if (authenticatedTier === 'friend') {
      return art.accessLevel !== 'children_only' && art.category !== 'children_legacy';
    }
    // Unauthenticated: only general public artwork
    return art.accessLevel === 'public_all';
  });

  return (
    <div className="min-h-screen bg-[#fcfbf9] text-stone-900 flex flex-col">
      {/* Top Navigation & Status Bar */}
      <header className="border-b border-stone-200/80 bg-stone-50/90 backdrop-blur-xs px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-3 sticky top-0 z-30 shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-900 font-serif font-semibold text-sm">
            {profile.name[0] || 'S'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-serif font-medium text-stone-900 text-sm leading-none">
                {profile.name}'s Presence & Perspective
              </h1>
              {authenticatedTier === 'child' && (
                <span className="inline-flex items-center gap-1 text-[10px] font-semibold bg-rose-100 text-rose-800 px-2 py-0.5 rounded-full border border-rose-200">
                  <Heart className="w-2.5 h-2.5 fill-rose-600 text-rose-600" />
                  Sacred Child Tier Active
                </span>
              )}
              {authenticatedTier === 'friend' && (
                <span className="inline-flex items-center gap-1 text-[10px] font-semibold bg-teal-100 text-teal-800 px-2 py-0.5 rounded-full border border-teal-200">
                  <Users className="w-2.5 h-2.5 text-teal-700" />
                  Friend Tier Active
                </span>
              )}
              {authenticatedTier === 'unauthenticated' && (
                <span className="inline-flex items-center gap-1 text-[10px] font-medium bg-stone-200 text-stone-700 px-2 py-0.5 rounded-full">
                  <Lock className="w-2.5 h-2.5" />
                  Locked Gateway
                </span>
              )}
            </div>
            <p className="text-[11px] text-stone-500 mt-0.5">
              Protected by distinct memory permissions & Empathy Support Modules
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {authenticatedTier !== 'unauthenticated' && (
            <>
              <button
                type="button"
                id="btn-recipient-chat-tab"
                onClick={() => setActiveTab('chat')}
                className={`text-xs px-3 py-1.5 rounded-lg transition ${
                  activeTab === 'chat'
                    ? 'bg-stone-900 text-stone-50'
                    : 'border border-stone-200 hover:bg-stone-100 text-stone-700'
                }`}
              >
                Conversation
              </button>

              <button
                type="button"
                id="btn-recipient-vault-tab"
                onClick={() => setActiveTab('vault')}
                className={`text-xs px-3 py-1.5 rounded-lg transition ${
                  activeTab === 'vault'
                    ? 'bg-stone-900 text-stone-50'
                    : 'border border-stone-200 hover:bg-stone-100 text-stone-700'
                }`}
              >
                Memories ({accessibleArtifacts.length})
              </button>

              <button
                type="button"
                id="btn-relock-session"
                onClick={handleLockSession}
                className="text-xs px-2.5 py-1.5 rounded-lg text-stone-600 hover:bg-stone-200/70 transition flex items-center gap-1"
                title="Lock session"
              >
                <Lock className="w-3 h-3" />
                <span>Switch Tier</span>
              </button>
            </>
          )}

          <button
            type="button"
            id="btn-exit-recipient"
            onClick={onExitRecipientMode}
            className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-stone-200/80 hover:bg-stone-300 text-stone-800 transition font-medium"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Exit Preview</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-5xl w-full mx-auto p-4 sm:p-8 flex flex-col justify-center">
        {/* WELCOME / GATEWAY SCREEN */}
        {activeTab === 'welcome' && (
          <div className="max-w-2xl mx-auto text-center space-y-8 py-6 animate-fade-in">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-200/80 text-amber-900 text-xs font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-700" />
              Secure Identity Gateway
            </div>

            <div className="space-y-3">
              <h2 className="font-serif text-3xl sm:text-4xl text-stone-900 tracking-tight leading-tight">
                "I am here with you, even when the silence is loud."
              </h2>
              <p className="font-serif text-stone-600 text-sm sm:text-base leading-relaxed italic max-w-xl mx-auto">
                "{profile.messageForChildren.eternalPromise || 'I love you then, now, and forever.'}"
              </p>
            </div>

            {/* Select Tier Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-left pt-2">
              {/* For Friends Card */}
              <div
                id="recipient-card-friends"
                className="bg-white border border-stone-200 hover:border-teal-600/80 p-6 rounded-2xl shadow-xs hover:shadow-md transition flex flex-col justify-between group space-y-4"
              >
                <div className="space-y-2.5">
                  <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-800">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-serif font-semibold text-lg text-stone-900 group-hover:text-teal-900 transition">
                      I am a Friend Reaching Out
                    </h3>
                    <span className="text-[11px] text-teal-700 font-semibold tracking-wide">
                      Outside-the-Box Perspective & Counsel
                    </span>
                  </div>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    If you called and my world was too heavy to answer: talk with my replica. It thinks with my exact outside-the-box perspective, lived philosophies, and unfiltered empathy.
                  </p>
                </div>
                
                <div className="pt-3 border-t border-stone-100 flex flex-col gap-2">
                  <button
                    type="button"
                    id="btn-direct-enter-friend"
                    onClick={() => {
                      setAuthenticatedTier('friend');
                      setActiveTab('chat');
                    }}
                    className="w-full py-2 px-3 bg-teal-800 hover:bg-teal-900 text-teal-50 rounded-xl text-xs font-medium transition flex items-center justify-center gap-1.5"
                  >
                    <span>Connect with My Perspective</span>
                    <ArrowLeft className="w-3 h-3 rotate-180" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleOpenGateway('friend')}
                    className="text-[11px] text-stone-500 hover:text-stone-700 text-center"
                  >
                    Or enter with Friend Passphrase &rarr;
                  </button>
                </div>
              </div>

              {/* For Children Card */}
              <div
                id="recipient-card-children"
                className="bg-white border border-stone-200 hover:border-rose-500/80 p-6 rounded-2xl shadow-xs hover:shadow-md transition flex flex-col justify-between group space-y-4"
              >
                <div className="space-y-2.5">
                  <div className="w-10 h-10 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-800">
                    <Heart className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-serif font-semibold text-lg text-stone-900 group-hover:text-rose-900 transition">
                      I am Your Child
                    </h3>
                    <span className="text-[11px] text-rose-700 font-semibold tracking-wide">
                      Unconditional Love & Deepest Memories
                    </span>
                  </div>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    Never doubt that you are loved then, now, and forever. Revisit personal letters, childhood memories, and hear the words I wanted you to always carry in your heart.
                  </p>
                </div>
                
                <div className="pt-3 border-t border-stone-100 flex flex-col gap-2">
                  <button
                    type="button"
                    id="btn-direct-enter-child"
                    onClick={() => {
                      setAuthenticatedTier('child');
                      setActiveTab('chat');
                    }}
                    className="w-full py-2 px-3 bg-rose-800 hover:bg-rose-900 text-rose-50 rounded-xl text-xs font-medium transition flex items-center justify-center gap-1.5"
                  >
                    <span>Enter Sacred Sanctuary</span>
                    <ArrowLeft className="w-3 h-3 rotate-180" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleOpenGateway('child')}
                    className="text-[11px] text-stone-500 hover:text-stone-700 text-center"
                  >
                    Or enter with Sacred Key &rarr;
                  </button>
                </div>
              </div>
            </div>

            {/* Public Artwork Preview */}
            <div className="pt-2">
              <button
                type="button"
                id="btn-recipient-browse-vault-public"
                onClick={() => {
                  setAuthenticatedTier('unauthenticated');
                  setActiveTab('vault');
                }}
                className="inline-flex items-center gap-2 text-xs font-medium text-stone-600 hover:text-stone-900 py-2 px-4 rounded-lg hover:bg-stone-100 transition"
              >
                <BookOpen className="w-4 h-4 text-stone-400" />
                Browse public artworks & essays ({artifacts.filter(a => a.accessLevel === 'public_all').length})
              </button>
            </div>
          </div>
        )}

        {/* CHAT TAB */}
        {activeTab === 'chat' && authenticatedTier !== 'unauthenticated' && (
          <div className="space-y-4">
            <ChatView
              profile={profile}
              artifacts={artifacts}
              activeMode={authenticatedTier === 'child' ? 'child' : 'friend'}
              onModeChange={() => {}}
              accessTier={authenticatedTier}
            />
          </div>
        )}

        {/* MEMORY VAULT TAB */}
        {activeTab === 'vault' && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-200 pb-4">
              <div>
                <h2 className="font-serif text-2xl font-semibold text-stone-900">
                  {authenticatedTier === 'child'
                    ? 'Sacred Memory Vault (All Clearance Unlocked)'
                    : authenticatedTier === 'friend'
                    ? 'Preserved Memories & Art (Friend Clearance)'
                    : 'Public Creative Artworks & Thoughts'}
                </h2>
                <p className="text-xs text-stone-500 mt-1">
                  Showing {accessibleArtifacts.length} memories permitted under your clearance tier.
                  {authenticatedTier === 'friend' && ' (Private childhood letters are protected and hidden)'}
                </p>
              </div>

              {authenticatedTier === 'unauthenticated' && (
                <button
                  type="button"
                  onClick={() => setActiveTab('welcome')}
                  className="text-xs px-3 py-1.5 bg-stone-900 text-stone-50 rounded-lg"
                >
                  Authenticate Tier
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {accessibleArtifacts.map((art) => (
                <div
                  key={art.id}
                  onClick={() => setSelectedArtifact(art)}
                  className="bg-white border border-stone-200 rounded-xl p-5 hover:border-amber-700/60 cursor-pointer transition shadow-xs hover:shadow-sm space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-medium text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                      {art.category.replace('_', ' ')}
                    </span>
                    {art.accessLevel === 'children_only' && (
                      <span className="text-[10px] font-semibold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200 flex items-center gap-1">
                        <Heart className="w-2.5 h-2.5" />
                        Child Exclusive
                      </span>
                    )}
                  </div>

                  <h3 className="font-serif font-semibold text-stone-900 text-sm">
                    {art.title}
                  </h3>

                  <p className="font-serif text-xs text-stone-600 line-clamp-3 italic">
                    "{art.transcription}"
                  </p>

                  <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-[11px] text-amber-800 font-medium">
                    <span>Read whole entry &rarr;</span>
                    <span className="text-stone-400 text-[10px]">{art.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* GATEWAY PASSKEY MODAL */}
      {pendingTier && (
        <div className="fixed inset-0 z-50 bg-stone-950/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white border border-stone-200 rounded-2xl max-w-md w-full p-6 shadow-xl space-y-5">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                  pendingTier === 'child' ? 'bg-rose-100 text-rose-700' : 'bg-teal-100 text-teal-700'
                }`}>
                  {pendingTier === 'child' ? <Heart className="w-4 h-4" /> : <Users className="w-4 h-4" />}
                </div>
                <h3 className="font-serif font-semibold text-stone-900 text-base">
                  {pendingTier === 'child' ? 'Sacred Child Clearance' : 'Friend Perspective Gateway'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setPendingTier(null)}
                className="text-stone-400 hover:text-stone-600 text-sm"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-stone-600 leading-relaxed">
              {pendingTier === 'child'
                ? 'This public archive contains the included memories and letters. This passphrase screen is a prototype interface, not a privacy boundary.'
                : 'This public archive can be read by anyone who has the repository or site. This passphrase screen is not a privacy boundary.'}
            </p>

            {/* Secret question if child */}
            {pendingTier === 'child' && security.secretFamilyQuestion && (
              <div className="p-3 bg-rose-50/70 border border-rose-200 rounded-xl space-y-1">
                <span className="text-[11px] font-semibold text-rose-900 uppercase tracking-wider flex items-center gap-1">
                  <HelpCircle className="w-3 h-3" />
                  Secret Memory Question:
                </span>
                <p className="text-xs font-serif text-stone-800 italic">
                  "{security.secretFamilyQuestion}"
                </p>
              </div>
            )}

            <form onSubmit={handleVerifyPasskey} className="space-y-4">
              <div>
                <label className="block text-[11px] font-semibold text-stone-700 uppercase tracking-wider mb-1">
                  {pendingTier === 'child' ? 'Passphrase or Memory Answer' : 'Friend Passphrase'}
                </label>
                <input
                  type="text"
                  id="input-gateway-passkey"
                  value={inputPasskey}
                  onChange={(e) => setInputPasskey(e.target.value)}
                  placeholder={pendingTier === 'child' ? 'Enter configured passphrase or family answer' : 'Enter configured passphrase'}
                  autoFocus
                  required
                  className="w-full text-xs p-3 bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-stone-800 font-mono"
                />
              </div>

              {/* Error indicator */}
              {authError && (
                <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-700 flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{authError}</span>
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setPendingTier(null)}
                  className="px-4 py-2 text-xs text-stone-600 hover:bg-stone-100 rounded-xl transition"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  id="btn-submit-gateway-passkey"
                  disabled={isVerifying}
                  className="flex items-center gap-1.5 px-5 py-2 bg-stone-900 hover:bg-stone-800 text-stone-50 rounded-xl text-xs font-medium transition shadow-xs"
                >
                  {isVerifying ? (
                    'Verifying...'
                  ) : (
                    <>
                      <Unlock className="w-3.5 h-3.5" />
                      Verify & Enter Sanctuary
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ArtifactModal
        artifact={selectedArtifact}
        onClose={() => setSelectedArtifact(null)}
      />
    </div>
  );
};
