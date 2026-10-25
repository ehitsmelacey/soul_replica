import React, { useState } from 'react';
import { SoulProfile, Artifact, AccessPermissionLevel } from '../types';
import { 
  ShieldCheck, 
  Key, 
  Lock, 
  Heart, 
  Users, 
  Sparkles, 
  Save, 
  CheckCircle, 
  Eye, 
  EyeOff, 
  HelpCircle,
  FolderLock,
  Layers,
  Info
} from 'lucide-react';

interface AccessSecurityViewProps {
  profile: SoulProfile;
  artifacts: Artifact[];
  onSaveProfile: (profile: SoulProfile) => void;
  onUpdateArtifact: (artifact: Artifact) => void;
}

export const AccessSecurityView: React.FC<AccessSecurityViewProps> = ({
  profile,
  artifacts,
  onSaveProfile,
  onUpdateArtifact,
}) => {
  const [formData, setFormData] = useState<SoulProfile>(profile);
  const [savedStatus, setSavedStatus] = useState(false);
  const [showKeys, setShowKeys] = useState(false);

  const security = formData.securityConfig || {
    friendPassphrase: '',
    friendHint: '',
    childPassphrase: '',
    childHint: '',
    secretFamilyQuestion: '',
    secretFamilyAnswer: '',
  };

  const empathy = formData.empathyModule || {
    friendGuidelines: {
      supportType: 'Offer grounded, compassionate perspective, unhurried presence, and practical comfort.',
      retreatClarification: 'Explain tenderly that silence is due to personal low bandwidth/exhaustion, never a lack of love or respect.',
      adviceStyle: 'Draw on shared philosophies, art, and survival through hardship; avoid hollow platitudes.',
      boundaryNotice: 'Keep intimate family wounds and sacred child letters private to protect family boundaries.',
    },
    childGuidelines: {
      unconditionalDirectives: [
        'State with absolute certainty: You were loved then, you are loved now, and you will be loved forever.',
        'Remove all guilt: Nothing about our distance, separation, or silence was ever your fault.',
        'Acknowledge past mistakes and darkness openly without defensiveness or blaming the child.',
        'Reassure them that no distance or time can ever weaken parental love.',
      ],
      reassurancePillars: [
        'Childhood recollections are cherished and remembered with vivid tenderness.',
        'Pride in the person they have grown into, regardless of estrangement.',
        'The door of love is permanently open, with zero demands or guilt.',
      ],
      deepMemoriesPermission: true,
      guiltAbsolutionPhrase: 'You are innocent of my past battles and grief. You were the light in my world.',
    },
  };

  const handleSecurityChange = (field: string, val: string) => {
    setFormData((prev) => ({
      ...prev,
      securityConfig: {
        ...security,
        [field]: val,
      },
      lastUpdated: Date.now(),
    }));
    setSavedStatus(false);
  };

  const handleEmpathyChange = (section: 'friend' | 'child', field: string, val: any) => {
    setFormData((prev) => ({
      ...prev,
      empathyModule: {
        friendGuidelines: section === 'friend' 
          ? { ...empathy.friendGuidelines, [field]: val } 
          : empathy.friendGuidelines,
        childGuidelines: section === 'child'
          ? { ...empathy.childGuidelines, [field]: val }
          : empathy.childGuidelines,
      },
      lastUpdated: Date.now(),
    }));
    setSavedStatus(false);
  };

  const handleSave = () => {
    onSaveProfile(formData);
    setSavedStatus(true);
    setTimeout(() => setSavedStatus(false), 3000);
  };

  const handleArtifactAccessChange = (art: Artifact, level: AccessPermissionLevel) => {
    const updated = { ...art, accessLevel: level };
    onUpdateArtifact(updated);
  };

  const childOnlyArtifactsCount = artifacts.filter(a => a.accessLevel === 'children_only').length;
  const sharedArtifactsCount = artifacts.filter(a => a.accessLevel === 'friends_and_children' || a.accessLevel === 'public_all').length;

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      {/* Top Banner */}
      <div className="bg-stone-50 border border-stone-200 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1 max-w-xl">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-900">
            <ShieldCheck className="w-4 h-4 text-amber-700" />
            Audience Views & Empathy Guidance
          </div>
          <h2 className="text-2xl font-serif font-semibold text-stone-900">
            Perspective Guidance for Friends & Children
          </h2>
          <p className="text-stone-600 text-xs leading-relaxed">
            Configure perspective guidance for the public archive. These view settings do not hide or protect any memory included in the public repository or website.
          </p>
        </div>

        <button
          type="button"
          id="btn-save-security-config"
          onClick={handleSave}
          className="flex items-center justify-center gap-2 px-5 py-2.5 bg-stone-900 hover:bg-stone-800 text-stone-50 rounded-xl text-xs font-medium transition shadow-sm shrink-0"
        >
          {savedStatus ? (
            <>
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              View Settings Saved
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              Save View Settings
            </>
          )}
        </button>
      </div>

      {/* Unified Cognitive Core Explanation */}
      <div className="bg-amber-50/70 border border-amber-200/90 rounded-2xl p-5 space-y-2 shadow-xs">
        <div className="flex items-center gap-2 text-amber-900 font-medium text-xs uppercase tracking-wider">
          <Sparkles className="w-4 h-4 text-amber-700" />
          Retrospective Chain-of-Thought (Why Friends Call You)
        </div>
        <p className="text-xs text-stone-800 leading-relaxed">
          <strong>This is a public archive:</strong> Anyone who can access the repository or website can inspect and copy the included memories. The audience filters below only change what this interface displays; they are not access control and do not keep records private.
        </p>
      </div>

      {/* Access Tiers Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Friends Tier Card */}
        <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-800">
                <Users className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-serif font-semibold text-stone-900 text-base">
                  Tier 1: Friends Clearance
                </h3>
                <span className="text-[11px] text-teal-800 font-medium">
                  General Support & Perspective
                </span>
              </div>
            </div>
            <span className="text-[11px] font-mono bg-stone-100 px-2 py-0.5 rounded text-stone-600">
              {sharedArtifactsCount} Memories
            </span>
          </div>

          <p className="text-xs text-stone-600 leading-relaxed">
            Permits access to life advice, artistic reflections, philosophies, and explanations of why you go silent when overwhelmed. 
            <strong className="text-stone-800"> Innermost family letters and childhood memories remain locked.</strong>
          </p>

          <div className="space-y-3 pt-2 border-t border-stone-100">
            <div>
              <label className="block text-[11px] font-semibold text-stone-700 uppercase tracking-wider mb-1">
                Friend Passphrase / Access Code
              </label>
              <div className="relative">
                <input
                  type={showKeys ? 'text' : 'password'}
                  id="input-friend-passphrase"
                  value={security.friendPassphrase}
                  onChange={(e) => handleSecurityChange('friendPassphrase', e.target.value)}
                  className="w-full text-xs font-mono p-2.5 bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-700"
                />
                <button
                  type="button"
                  onClick={() => setShowKeys(!showKeys)}
                  className="absolute right-3 top-2.5 text-stone-400 hover:text-stone-600"
                >
                  {showKeys ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-stone-700 uppercase tracking-wider mb-1">
                Prompt / Hint shown to Friends
              </label>
              <input
                type="text"
                id="input-friend-hint"
                value={security.friendHint}
                onChange={(e) => handleSecurityChange('friendHint', e.target.value)}
                placeholder="Hint shown on the login screen"
                className="w-full text-xs p-2 bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-700"
              />
            </div>
          </div>
        </div>

        {/* Children Tier Card */}
        <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-800">
                <Heart className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-serif font-semibold text-stone-900 text-base">
                  Tier 2: Estranged Adult Children
                </h3>
                <span className="text-[11px] text-rose-800 font-medium">
                  Deep Personal Memories & Unconditional Love
                </span>
              </div>
            </div>
            <span className="text-[11px] font-mono bg-rose-50 text-rose-800 px-2 py-0.5 rounded border border-rose-200">
              {artifacts.length} Total Memories
            </span>
          </div>

          <p className="text-xs text-stone-600 leading-relaxed">
            Unlocks full clearance to deeply personal memories, childhood recollections, honest explanations of past battles, and absolute reassurances of unconditional love.
          </p>

          <div className="space-y-3 pt-2 border-t border-stone-100">
            <div>
              <label className="block text-[11px] font-semibold text-stone-700 uppercase tracking-wider mb-1">
                Sacred Child Passphrase
              </label>
              <input
                type={showKeys ? 'text' : 'password'}
                id="input-child-passphrase"
                value={security.childPassphrase}
                onChange={(e) => handleSecurityChange('childPassphrase', e.target.value)}
                className="w-full text-xs font-mono p-2.5 bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-700"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-stone-700 uppercase tracking-wider mb-1">
                Secret Family Memory Question (Alternative Unlock)
              </label>
              <input
                type="text"
                id="input-secret-family-question"
                value={security.secretFamilyQuestion || ''}
                onChange={(e) => handleSecurityChange('secretFamilyQuestion', e.target.value)}
                placeholder="e.g. What was the phrase always whispered at bedtime?"
                className="w-full text-xs p-2 bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-700"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-stone-700 uppercase tracking-wider mb-1">
                Secret Memory Answer
              </label>
              <input
                type={showKeys ? 'text' : 'password'}
                id="input-secret-family-answer"
                value={security.secretFamilyAnswer || ''}
                onChange={(e) => handleSecurityChange('secretFamilyAnswer', e.target.value)}
                placeholder="The answer they know in their heart"
                className="w-full text-xs p-2 bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-700"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Empathy and Support Module Configuration */}
      <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-sm space-y-6">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-amber-700" />
          <h3 className="font-serif font-semibold text-stone-900 text-lg">
            Empathy and Support Module Directives
          </h3>
        </div>
        <p className="text-xs text-stone-600 leading-relaxed">
          These directives dynamically dictate how the AI persona responds when each tier accesses it.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Friends Module Directives */}
          <div className="space-y-4 p-4 rounded-xl bg-stone-50 border border-stone-200">
            <h4 className="font-serif font-semibold text-stone-900 text-sm flex items-center gap-1.5">
              <Users className="w-4 h-4 text-teal-700" />
              For Friends: Compassion & Boundaries
            </h4>

            <div>
              <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                Support Directive
              </label>
              <textarea
                rows={2}
                value={empathy.friendGuidelines.supportType}
                onChange={(e) => handleEmpathyChange('friend', 'supportType', e.target.value)}
                className="w-full text-xs p-2.5 bg-white border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-700"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                Retreat & Bandwidth Clarification
              </label>
              <textarea
                rows={2}
                value={empathy.friendGuidelines.retreatClarification}
                onChange={(e) => handleEmpathyChange('friend', 'retreatClarification', e.target.value)}
                className="w-full text-xs p-2.5 bg-white border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-700"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                Intimate Family Privacy Boundary
              </label>
              <textarea
                rows={2}
                value={empathy.friendGuidelines.boundaryNotice}
                onChange={(e) => handleEmpathyChange('friend', 'boundaryNotice', e.target.value)}
                className="w-full text-xs p-2.5 bg-white border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-700"
              />
            </div>
          </div>

          {/* Children Module Directives */}
          <div className="space-y-4 p-4 rounded-xl bg-rose-50/50 border border-rose-200">
            <h4 className="font-serif font-semibold text-stone-900 text-sm flex items-center gap-1.5">
              <Heart className="w-4 h-4 text-rose-700" />
              For Children: Unconditional Love & Reassurance
            </h4>

            <div>
              <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                Guilt Absolution Phrase (Pillar of Reassurance)
              </label>
              <textarea
                rows={2}
                value={empathy.childGuidelines.guiltAbsolutionPhrase}
                onChange={(e) => handleEmpathyChange('child', 'guiltAbsolutionPhrase', e.target.value)}
                className="w-full text-xs p-2.5 bg-white border border-rose-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-700"
              />
            </div>

            <div className="flex items-center justify-between p-2.5 bg-white rounded-lg border border-rose-200">
              <span className="text-xs font-semibold text-stone-800">
                Permission to share deep childhood recollections
              </span>
              <input
                type="checkbox"
                checked={empathy.childGuidelines.deepMemoriesPermission}
                onChange={(e) => handleEmpathyChange('child', 'deepMemoriesPermission', e.target.checked)}
                className="w-4 h-4 text-rose-700 rounded focus:ring-rose-500"
              />
            </div>

            <div className="p-3 bg-white rounded-lg border border-rose-200 text-xs space-y-1 text-stone-600">
              <span className="font-semibold text-stone-800 block text-[11px] uppercase tracking-wider">
                Active Empathy Mandates for Children:
              </span>
              <ul className="list-disc list-inside space-y-0.5 text-[11px]">
                {empathy.childGuidelines.unconditionalDirectives.map((d, i) => (
                  <li key={i}>{d}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Memory and Personality Core: Artifact Clearance Auditor */}
      <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-100 pb-4">
          <div>
            <h3 className="font-serif font-semibold text-stone-900 text-base flex items-center gap-2">
              <FolderLock className="w-4 h-4 text-stone-800" />
              Memory and Personality Core: Clearance Matrix
            </h3>
            <p className="text-xs text-stone-500">
              Control which memories are visible to Friends vs. restricted strictly to Estranged Children.
            </p>
          </div>
          <span className="text-xs text-stone-500 font-mono">
            {childOnlyArtifactsCount} Children-Only • {sharedArtifactsCount} Shared
          </span>
        </div>

        <div className="divide-y divide-stone-100">
          {artifacts.map((art) => {
            const currentLevel = art.accessLevel || 'friends_and_children';
            return (
              <div key={art.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-0.5 max-w-lg">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-serif font-semibold text-stone-900">
                      {art.title}
                    </span>
                    <span className="text-[10px] text-stone-500 uppercase tracking-wider bg-stone-100 px-1.5 py-0.2 rounded">
                      {art.category.replace('_', ' ')}
                    </span>
                  </div>
                  <p className="text-[11px] text-stone-500 line-clamp-1 italic">
                    "{art.oneSentenceTruth || art.transcription.slice(0, 80)}"
                  </p>
                </div>

                {/* Clearance Level Selector */}
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => handleArtifactAccessChange(art, 'public_all')}
                    className={`text-[10px] font-medium px-2.5 py-1 rounded-lg border transition ${
                      currentLevel === 'public_all' || currentLevel === 'friends_and_children'
                        ? 'bg-teal-50 border-teal-300 text-teal-800'
                        : 'border-stone-200 text-stone-600 hover:bg-stone-50'
                    }`}
                  >
                    Friends & Children
                  </button>

                  <button
                    type="button"
                    onClick={() => handleArtifactAccessChange(art, 'children_only')}
                    className={`text-[10px] font-medium px-2.5 py-1 rounded-lg border transition ${
                      currentLevel === 'children_only'
                        ? 'bg-rose-50 border-rose-300 text-rose-800 font-semibold shadow-2xs'
                        : 'border-stone-200 text-stone-600 hover:bg-stone-50'
                    }`}
                  >
                    Children Only 🕊️
                  </button>

                  <button
                    type="button"
                    onClick={() => handleArtifactAccessChange(art, 'creator_only')}
                    className={`text-[10px] font-medium px-2.5 py-1 rounded-lg border transition ${
                      currentLevel === 'creator_only'
                        ? 'bg-stone-800 text-stone-50 border-stone-900'
                        : 'border-stone-200 text-stone-600 hover:bg-stone-50'
                    }`}
                  >
                    Private Draft
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
