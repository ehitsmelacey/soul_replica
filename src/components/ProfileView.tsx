import React, { useState } from 'react';
import { SoulProfile, Artifact } from '../types';
import { 
  User, 
  Heart, 
  Users, 
  Sparkles, 
  Save, 
  CheckCircle, 
  Compass, 
  MessageSquareQuote,
  ShieldAlert
} from 'lucide-react';

interface ProfileViewProps {
  profile: SoulProfile;
  artifacts: Artifact[];
  onSaveProfile: (profile: SoulProfile) => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  profile,
  artifacts,
  onSaveProfile,
}) => {
  const [formData, setFormData] = useState<SoulProfile>(profile);
  const [savedStatus, setSavedStatus] = useState(false);
  const [activeTab, setActiveTab] = useState<'general' | 'friends' | 'children'>('general');

  const handleChange = (field: keyof SoulProfile, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
      lastUpdated: Date.now(),
    }));
    setSavedStatus(false);
  };

  const handleChildrenChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      messageForChildren: {
        ...prev.messageForChildren,
        [field]: value,
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

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      {/* Overview */}
      <div className="bg-stone-50 border border-stone-200 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1 max-w-xl">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-900">
            <User className="w-4 h-4 text-amber-700" />
            Persona & Soulprint Calibration
          </div>
          <h2 className="text-2xl font-serif font-semibold text-stone-900">
            Calibrate how your replica thinks, loves, and responds
          </h2>
          <p className="text-stone-600 text-xs leading-relaxed">
            This profile shapes the bedrock consciousness of your AI replica. Everything here guides how it comforts your friends when you can't be there, and how it holds your children in eternal love.
          </p>
        </div>

        <button
          type="button"
          id="btn-save-soulprint"
          onClick={handleSave}
          className="flex items-center justify-center gap-2 px-5 py-2.5 bg-stone-900 hover:bg-stone-800 text-stone-50 rounded-xl text-xs font-medium transition shadow-sm shrink-0"
        >
          {savedStatus ? (
            <>
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              Saved to Engine
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              Save Calibration
            </>
          )}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-stone-200 pb-3">
        <button
          type="button"
          id="tab-profile-general"
          onClick={() => setActiveTab('general')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium transition ${
            activeTab === 'general'
              ? 'bg-stone-800 text-stone-50 shadow-xs'
              : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
          }`}
        >
          <Compass className="w-4 h-4" />
          Core Persona & Tone
        </button>

        <button
          type="button"
          id="tab-profile-friends"
          onClick={() => setActiveTab('friends')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium transition ${
            activeTab === 'friends'
              ? 'bg-stone-800 text-stone-50 shadow-xs'
              : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
          }`}
        >
          <Users className="w-4 h-4 text-teal-400" />
          For My Friends (Heavy World)
        </button>

        <button
          type="button"
          id="tab-profile-children"
          onClick={() => setActiveTab('children')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium transition ${
            activeTab === 'children'
              ? 'bg-stone-800 text-stone-50 shadow-xs'
              : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
          }`}
        >
          <Heart className="w-4 h-4 text-rose-400" />
          For My Children (Then, Now, Forever)
        </button>
      </div>

      {/* General Persona Tab */}
      {activeTab === 'general' && (
        <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-sm space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Your Full Name / Identity
              </label>
              <input
                type="text"
                id="input-creator-name"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                placeholder="e.g. Sam Winchester"
                className="w-full text-xs p-3 bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-700"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Preferred Name / Nickname (What friends & kids call you)
              </label>
              <input
                type="text"
                id="input-creator-preferred-name"
                value={formData.preferredName || ''}
                onChange={(e) => handleChange('preferredName', e.target.value)}
                placeholder="e.g. Dad, Mom, Sammy, Alex"
                className="w-full text-xs p-3 bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-700"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Core Life Philosophy (How you make sense of hardship and light)
            </label>
            <textarea
              id="input-core-philosophy"
              rows={4}
              value={formData.corePhilosophy}
              onChange={(e) => handleChange('corePhilosophy', e.target.value)}
              placeholder="Explain how you look at suffering, healing, grace, and survival..."
              className="w-full font-serif text-xs p-3.5 bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-700 leading-relaxed"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Communication Tone & Voice
              </label>
              <textarea
                id="input-communication-tone"
                rows={3}
                value={formData.communicationTone}
                onChange={(e) => handleChange('communicationTone', e.target.value)}
                placeholder="e.g. Gentle, poetic, unpretentious, doesn't sugarcoat pain, loves deeply..."
                className="w-full text-xs p-3 bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-700"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Phrases, Sayings & Idioms You Frequently Use
              </label>
              <textarea
                id="input-phrases"
                rows={3}
                value={formData.phrasesAndIdioms}
                onChange={(e) => handleChange('phrasesAndIdioms', e.target.value)}
                placeholder="e.g. 'Take what you need', 'Breathe through the seam', 'I love you then, now, and forever'..."
                className="w-full text-xs p-3 bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-700"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Deep Emotional Nuances (What you feel in your bones)
            </label>
            <textarea
              id="input-emotional-nuances"
              rows={3}
              value={formData.emotionalNuances}
              onChange={(e) => handleChange('emotionalNuances', e.target.value)}
              placeholder="e.g. Carries old wounds, draws art to process quiet grief, fears letting others down..."
              className="w-full text-xs p-3 bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-700"
            />
          </div>
        </div>
      )}

      {/* Friends Perspective Tab */}
      {activeTab === 'friends' && (
        <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-sm space-y-6">
          <div className="p-4 bg-teal-50/70 border border-teal-200 rounded-xl space-y-1">
            <h3 className="font-serif font-semibold text-teal-950 text-sm flex items-center gap-1.5">
              <Users className="w-4 h-4 text-teal-700" />
              For Friends in Moments Your World is Too Heavy
            </h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              When friends call or text and your energy is at zero, this persona steps in to represent your authentic perspective and warmth so they never feel abandoned.
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Why I Go Silent When the Sky Falls (Explaining your retreat)
            </label>
            <textarea
              id="input-when-world-is-heavy"
              rows={4}
              value={formData.whenWorldIsHeavy}
              onChange={(e) => handleChange('whenWorldIsHeavy', e.target.value)}
              placeholder="Explain why you retreat, that it's about survival and not losing love for them..."
              className="w-full font-serif text-xs p-3.5 bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-700 leading-relaxed"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Standing Message & Advice for Friends
            </label>
            <textarea
              id="input-message-for-friends"
              rows={4}
              value={formData.messageForFriends}
              onChange={(e) => handleChange('messageForFriends', e.target.value)}
              placeholder="What you would tell them if you were sitting on your porch together tonight..."
              className="w-full font-serif text-xs p-3.5 bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-700 leading-relaxed"
            />
          </div>
        </div>
      )}

      {/* Children Perspective Tab */}
      {activeTab === 'children' && (
        <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-sm space-y-6">
          <div className="p-4 bg-rose-50/70 border border-rose-200 rounded-xl space-y-1">
            <h3 className="font-serif font-semibold text-rose-950 text-sm flex items-center gap-1.5">
              <Heart className="w-4 h-4 text-rose-600" />
              For My Children: Then, Now, and Forever
            </h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              For adult or estranged children in case something happens before things can be healed in person. The absolute directive here is that they must never doubt they are loved beyond measure.
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Children's Names / How You Address Them
            </label>
            <input
              type="text"
              id="input-children-names"
              value={formData.messageForChildren.childrenNames}
              onChange={(e) => handleChildrenChange('childrenNames', e.target.value)}
              placeholder="e.g. Maya & Lucas, or My Dearest Children"
              className="w-full text-xs p-3 bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-700"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Unconditional Declaration of Love (The Unshakable Truth)
            </label>
            <textarea
              id="input-unconditional-message"
              rows={4}
              value={formData.messageForChildren.unconditionalMessage}
              onChange={(e) => handleChildrenChange('unconditionalMessage', e.target.value)}
              placeholder="Never let them doubt: no matter what happened or what silence was between you..."
              className="w-full font-serif text-xs p-3.5 bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-700 leading-relaxed"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Explanation of Hard Times & Your Lowest Lows (Without Defensiveness)
            </label>
            <textarea
              id="input-explanation-hard-times"
              rows={4}
              value={formData.messageForChildren.explanationOfHardTimes}
              onChange={(e) => handleChildrenChange('explanationOfHardTimes', e.target.value)}
              placeholder="Explain the battles you were fighting, take accountability, and make clear they were never the cause of pain..."
              className="w-full font-serif text-xs p-3.5 bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-700 leading-relaxed"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Core Childhood Memories to Keep Safe
              </label>
              <textarea
                id="input-core-memories"
                rows={3}
                value={formData.messageForChildren.coreMemoriesToHold}
                onChange={(e) => handleChildrenChange('coreMemoriesToHold', e.target.value)}
                placeholder="Specific moments: bedtime stories, rainy mornings, their laughter..."
                className="w-full font-serif text-xs p-3 bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-700"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                The Eternal Promise
              </label>
              <textarea
                id="input-eternal-promise"
                rows={3}
                value={formData.messageForChildren.eternalPromise}
                onChange={(e) => handleChildrenChange('eternalPromise', e.target.value)}
                placeholder="e.g. 'I love you then, now, and forever. Nothing can erase that.'"
                className="w-full font-serif text-xs p-3 bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-700"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
