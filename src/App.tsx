import React, { useState, useEffect } from 'react';
import { 
  SoulProfile, 
  Artifact, 
  PerspectiveMode, 
  CreatorConstitution, 
  PersonalityTrait, 
  ContradictionRecord, 
  AttentionProcessingPattern, 
  NegativePreference, 
  ValueItem, 
  BeliefItem, 
  BenchmarkCase, 
  SystemHealthState, 
  VoiceModel,
  RelationshipRole,
  AuthenticityScores,
  PersonModelData,
  CognitiveModelData,
  WisdomModule,
  ReviewQueueItem,
  ReviewStatus,
  LongitudinalEmotionalRecord
} from './types';
import { 
  DEFAULT_PROFILE, 
  SEED_ARTIFACTS, 
  DEFAULT_CONSTITUTION, 
  SEED_TRAITS, 
  SEED_CONTRADICTIONS, 
  SEED_ATTENTION_PATTERNS, 
  SEED_NEGATIVE_PREFERENCES, 
  SEED_VALUES, 
  SEED_BELIEFS, 
  SEED_BENCHMARKS, 
  SEED_HEALTH_STATE, 
  DEFAULT_VOICE_MODEL,
  LACEY_PERSON_MODEL,
  LACEY_COGNITIVE_MODEL,
  LACEY_WISDOM_MODULES,
  LACEY_LONGITUDINAL_EMOTIONS,
  SEED_REVIEW_QUEUE
} from './data/seedData';
import { Navigation, MainTab } from './components/Navigation';
import { ChatView } from './components/ChatView';
import { VaultView } from './components/VaultView';
import { ConstitutionView } from './components/ConstitutionView';
import { ModelExplorerView } from './components/ModelExplorerView';
import { CalibrationLabView } from './components/CalibrationLabView';
import { AccessSecurityView } from './components/AccessSecurityView';
import { TestamentExportView } from './components/TestamentExportView';
import { RecipientView } from './components/RecipientView';
import { ThoughtProcessVisualizer } from './components/ThoughtProcessVisualizer';
import { SentimentAnalysisView } from './components/SentimentAnalysisView';
import { ArtifactModal } from './components/ArtifactModal';
import { PersonModelView } from './components/PersonModelView';
import { CognitiveModelView } from './components/CognitiveModelView';
import { VoiceLabView } from './components/VoiceLabView';
import { WisdomModulesView } from './components/WisdomModulesView';
import { ReviewQueueView } from './components/ReviewQueueView';
import { EmotionalContextView } from './components/EmotionalContextView';
import { ControlCenterView } from './components/ControlCenterView';
import { FirstRunGuideModal } from './components/FirstRunGuideModal';

export default function App() {
  // Soul profile state
  const [profile, setProfile] = useState<SoulProfile>(() => {
    const saved = localStorage.getItem('soul_replica_profile');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return DEFAULT_PROFILE;
  });

  // Memory artifacts state
  const [artifacts, setArtifacts] = useState<Artifact[]>(() => {
    const saved = localStorage.getItem('soul_replica_artifacts');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return SEED_ARTIFACTS;
  });

  // Constitution state
  const [constitution, setConstitution] = useState<CreatorConstitution>(() => {
    const saved = localStorage.getItem('soul_replica_constitution');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return DEFAULT_CONSTITUTION;
  });

  // Person Model (Layer 2)
  const [personModel, setPersonModel] = useState<PersonModelData>(() => {
    const saved = localStorage.getItem('soul_replica_person_model');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return LACEY_PERSON_MODEL;
  });

  // Cognitive Model (Layer 2)
  const [cognitiveModel, setCognitiveModel] = useState<CognitiveModelData>(() => {
    const saved = localStorage.getItem('soul_replica_cognitive_model');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return LACEY_COGNITIVE_MODEL;
  });

  // Wisdom Modules
  const [wisdomModules, setWisdomModules] = useState<WisdomModule[]>(() => {
    const saved = localStorage.getItem('soul_replica_wisdom_modules');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return LACEY_WISDOM_MODULES;
  });

  // Review Queue
  const [reviewQueue, setReviewQueue] = useState<ReviewQueueItem[]>(() => {
    const saved = localStorage.getItem('soul_replica_review_queue');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return SEED_REVIEW_QUEUE;
  });

  // Longitudinal Emotional Records
  const [emotionalRecords] = useState<LongitudinalEmotionalRecord[]>(LACEY_LONGITUDINAL_EMOTIONS);

  // Traits state
  const [traits, setTraits] = useState<PersonalityTrait[]>(() => {
    const saved = localStorage.getItem('soul_replica_traits');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return SEED_TRAITS;
  });

  // Contradictions state
  const [contradictions, setContradictions] = useState<ContradictionRecord[]>(() => {
    const saved = localStorage.getItem('soul_replica_contradictions');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return SEED_CONTRADICTIONS;
  });

  // Attention Patterns
  const [attentionPatterns] = useState<AttentionProcessingPattern[]>(SEED_ATTENTION_PATTERNS);

  // Negative Preferences
  const [negativePreferences] = useState<NegativePreference[]>(SEED_NEGATIVE_PREFERENCES);

  // Values & Beliefs
  const [values] = useState<ValueItem[]>(SEED_VALUES);
  const [beliefs] = useState<BeliefItem[]>(SEED_BELIEFS);

  // Benchmarks
  const [benchmarks, setBenchmarks] = useState<BenchmarkCase[]>(() => {
    const saved = localStorage.getItem('soul_replica_benchmarks');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return SEED_BENCHMARKS;
  });

  // System Health
  const [health, setHealth] = useState<SystemHealthState>(() => {
    const saved = localStorage.getItem('soul_replica_health');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return SEED_HEALTH_STATE;
  });

  // Voice Model
  const [voiceModel, setVoiceModel] = useState<VoiceModel>(() => {
    const saved = localStorage.getItem('soul_replica_voice_model');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return DEFAULT_VOICE_MODEL;
  });

  // Navigation tab
  const [currentTab, setCurrentTab] = useState<MainTab>('chat');
  const [activeChatMode, setActiveChatMode] = useState<PerspectiveMode>('friend');
  const [isRecipientMode, setIsRecipientMode] = useState(false);
  const [inspectedArtifact, setInspectedArtifact] = useState<Artifact | null>(null);
  const [prefilledChatPrompt, setPrefilledChatPrompt] = useState<string>('');
  const [isGuideOpen, setIsGuideOpen] = useState(false);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('soul_replica_profile', JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    localStorage.setItem('soul_replica_artifacts', JSON.stringify(artifacts));
  }, [artifacts]);

  useEffect(() => {
    localStorage.setItem('soul_replica_constitution', JSON.stringify(constitution));
  }, [constitution]);

  useEffect(() => {
    localStorage.setItem('soul_replica_traits', JSON.stringify(traits));
  }, [traits]);

  useEffect(() => {
    localStorage.setItem('soul_replica_benchmarks', JSON.stringify(benchmarks));
  }, [benchmarks]);

  useEffect(() => {
    localStorage.setItem('soul_replica_person_model', JSON.stringify(personModel));
  }, [personModel]);

  useEffect(() => {
    localStorage.setItem('soul_replica_cognitive_model', JSON.stringify(cognitiveModel));
  }, [cognitiveModel]);

  useEffect(() => {
    localStorage.setItem('soul_replica_wisdom_modules', JSON.stringify(wisdomModules));
  }, [wisdomModules]);

  useEffect(() => {
    localStorage.setItem('soul_replica_review_queue', JSON.stringify(reviewQueue));
  }, [reviewQueue]);

  useEffect(() => {
    localStorage.setItem('soul_replica_voice_model', JSON.stringify(voiceModel));
  }, [voiceModel]);

  useEffect(() => {
    localStorage.setItem('soul_replica_health', JSON.stringify(health));
  }, [health]);

  // Handlers for artifacts
  const handleAddArtifact = (newArt: Artifact) => {
    setArtifacts((prev) => [newArt, ...prev]);
  };

  const handleUpdateArtifact = (updated: Artifact) => {
    setArtifacts((prev) => prev.map((a) => (a.id === updated.id ? updated : a)));
  };

  const handleDeleteArtifact = (id: string) => {
    setArtifacts((prev) => prev.filter((a) => a.id !== id));
    if (inspectedArtifact?.id === id) {
      setInspectedArtifact(null);
    }
  };

  // Trait status update
  const handleUpdateTraitStatus = (id: string, newStatus: PersonalityTrait['approvalStatus']) => {
    setTraits((prev) =>
      prev.map((t) => (t.id === id ? { ...t, approvalStatus: newStatus } : t))
    );
  };

  // Review Queue action
  const handleReviewAction = (itemId: string, action: ReviewStatus, notes?: string) => {
    setReviewQueue((prev) =>
      prev.map((item) =>
        item.id === itemId
          ? {
              ...item,
              status: action,
              creatorNotes: notes !== undefined ? notes : item.creatorNotes,
              reviewedAt: new Date().toISOString(),
            }
          : item
      )
    );
  };

  // Prompt inquiry to chat
  const handleSelectCorrectionQuery = (queryText: string) => {
    setPrefilledChatPrompt(queryText);
    setCurrentTab('chat');
  };

  // Run benchmark case via API
  const handleRunBenchmark = async (benchmarkId: string) => {
    const targetCase = benchmarks.find((b) => b.id === benchmarkId);
    if (!targetCase) return;

    try {
      const response = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            {
              id: 'bench-q',
              sender: 'user',
              text: targetCase.scenario,
              timestamp: Date.now(),
              roleClearance: targetCase.role,
            },
          ],
          mode: targetCase.role === 'child' ? 'child' : targetCase.role === 'friend' ? 'friend' : 'general',
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
          accessTier: targetCase.role,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setBenchmarks((prev) =>
          prev.map((b) =>
            b.id === benchmarkId
              ? {
                  ...b,
                  systemPrediction: data.text,
                  status: 'passed',
                  lastRunTimestamp: Date.now(),
                }
              : b
          )
        );
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Save benchmark correction
  const handleSaveBenchmarkCorrection = (
    benchmarkId: string,
    correction: string,
    scores: AuthenticityScores,
    failureCategory: string
  ) => {
    setBenchmarks((prev) =>
      prev.map((b) =>
        b.id === benchmarkId
          ? {
              ...b,
              creatorCorrection: correction,
              scores,
              failureCategory,
              status: 'passed',
            }
          : b
      )
    );
  };

  // Counterfactual query execution
  const handleRunCounterfactual = async (prompt: string, role: RelationshipRole): Promise<string> => {
    const response = await fetch('/api/gemini/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: [
          {
            id: 'cf-q',
            sender: 'user',
            text: `[Counterfactual Query]: ${prompt}`,
            timestamp: Date.now(),
            roleClearance: role,
            isCounterfactualPrediction: true,
          },
        ],
        mode: role === 'child' ? 'child' : role === 'friend' ? 'friend' : 'general',
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
        accessTier: role,
        isCounterfactual: true,
      }),
    });

    if (!response.ok) {
      throw new Error('Simulation failed');
    }

    const data = await response.json();
    return data.text;
  };

  // Recipient Mode Preview
  if (isRecipientMode) {
    return (
      <RecipientView
        profile={profile}
        artifacts={artifacts}
        onExitRecipientMode={() => setIsRecipientMode(false)}
      />
    );
  }

  const pendingReviewCount = reviewQueue.filter(
    (i) => i.status === 'awaiting_creator_review' || i.status === 'unreviewed'
  ).length;

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col font-sans selection:bg-amber-900/50 selection:text-amber-200">
      {/* Top Navigation */}
      <Navigation
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        artifactCount={artifacts.length}
        pendingReviewCount={pendingReviewCount}
        systemState={health.systemState}
        onTogglePause={() => {
          setHealth((prev) => ({
            ...prev,
            systemState: prev.systemState === 'paused' ? 'active' : 'paused',
            lastAuditTimestamp: Date.now(),
          }));
        }}
        onEnterRecipientMode={() => setIsRecipientMode(true)}
        onOpenFirstRunGuide={() => setIsGuideOpen(true)}
      />

      {/* Main Workspace */}
      <main 
        key={currentTab}
        className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6"
      >
        {/* System Paused Warning Banner if paused */}
        {health.systemState === 'paused' && (
          <div className="mb-6 p-4 rounded-xl bg-rose-950/60 border border-rose-600 text-rose-200 flex items-center justify-between shadow-lg">
            <div>
              <span className="font-bold text-sm block font-serif">System Simulation Paused by Creator</span>
              <span className="text-xs text-rose-300">
                All external interactions and personality predictions are halted. Archive in read-only preservation.
              </span>
            </div>
            <button
              type="button"
              onClick={() => setHealth((prev) => ({ ...prev, systemState: 'active' }))}
              className="px-3 py-1.5 rounded-lg bg-rose-600 text-stone-900 text-xs font-bold hover:bg-rose-500 transition-colors"
            >
              Resume System
            </button>
          </div>
        )}

        {currentTab === 'chat' && (
          <ChatView
            profile={profile}
            artifacts={artifacts}
            activeMode={activeChatMode}
            onModeChange={setActiveChatMode}
            accessTier="creator"
            constitution={constitution}
            traits={traits}
            contradictions={contradictions}
            attentionPatterns={attentionPatterns}
            negativePreferences={negativePreferences}
            values={values}
            beliefs={beliefs}
            voiceModel={voiceModel}
            initialInputText={prefilledChatPrompt}
            onSaveCreatorCorrection={(msgId, saidInstead, cat) => {
              console.log('Correction recorded for message', msgId, saidInstead, cat);
            }}
          />
        )}

        {currentTab === 'vault' && (
          <VaultView
            artifacts={artifacts}
            onAddArtifact={handleAddArtifact}
            onUpdateArtifact={handleUpdateArtifact}
            onDeleteArtifact={handleDeleteArtifact}
            onOpenVisualizer={() => setCurrentTab('visualizer')}
            onOpenSentiment={() => setCurrentTab('emotional_context')}
          />
        )}

        {currentTab === 'person_model' && (
          <PersonModelView
            personModel={personModel}
            onUpdatePersonModel={setPersonModel}
          />
        )}

        {currentTab === 'cognitive_model' && (
          <CognitiveModelView
            cognitiveModel={cognitiveModel}
            onUpdateCognitiveModel={setCognitiveModel}
          />
        )}

        {currentTab === 'voice_lab' && (
          <VoiceLabView
            voiceModel={voiceModel}
            onUpdateVoiceModel={setVoiceModel}
          />
        )}

        {currentTab === 'wisdom' && (
          <WisdomModulesView
            wisdomModules={wisdomModules}
            onUpdateWisdomModules={setWisdomModules}
          />
        )}

        {currentTab === 'review_queue' && (
          <ReviewQueueView
            queueItems={reviewQueue}
            onReviewAction={handleReviewAction}
          />
        )}

        {currentTab === 'emotional_context' && (
          <EmotionalContextView
            records={emotionalRecords}
          />
        )}

        {currentTab === 'control_center' && (
          <ControlCenterView
            systemHealth={health}
            onUpdateSystemHealth={setHealth}
          />
        )}

        {currentTab === 'constitution' && (
          <ConstitutionView
            constitution={constitution}
            onSaveConstitution={setConstitution}
          />
        )}

        {currentTab === 'calibration' && (
          <CalibrationLabView
            benchmarks={benchmarks}
            onRunBenchmark={handleRunBenchmark}
            onSaveCorrection={handleSaveBenchmarkCorrection}
            onRunCounterfactual={handleRunCounterfactual}
          />
        )}

        {currentTab === 'visualizer' && (
          <ThoughtProcessVisualizer
            artifacts={artifacts}
            onSelectArtifact={(art) => setInspectedArtifact(art)}
            onNavigateToChat={() => setCurrentTab('chat')}
          />
        )}

        {currentTab === 'security' && (
          <AccessSecurityView
            profile={profile}
            artifacts={artifacts}
            onSaveProfile={setProfile}
            onUpdateArtifact={handleUpdateArtifact}
          />
        )}

        {currentTab === 'testament' && (
          <TestamentExportView
            profile={profile}
            artifacts={artifacts}
            onToggleRecipientMode={() => setIsRecipientMode(true)}
          />
        )}
      </main>

      {/* Global Artifact Inspector Modal */}
      <ArtifactModal
        artifact={inspectedArtifact}
        onClose={() => setInspectedArtifact(null)}
        onUpdate={(updated) => {
          handleUpdateArtifact(updated);
          setInspectedArtifact(updated);
        }}
        onDelete={(id) => {
          handleDeleteArtifact(id);
          setInspectedArtifact(null);
        }}
      />

      {/* First-Run Onboarding Guide Modal */}
      <FirstRunGuideModal
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
        onNavigateToTab={(tabId) => setCurrentTab(tabId as MainTab)}
      />

      {/* Master Footer */}
      <footer className="border-t border-stone-800/80 py-4 bg-stone-950 text-center text-xs text-stone-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>
            Lacey's Soul Replica &amp; Memory Vault • Supreme Constitution Active • Fidelity &gt; Flattery
          </span>
          <span className="font-serif italic text-amber-400/90">
            "{profile.messageForChildren.eternalPromise || 'I love you then, now, and forever.'}"
          </span>
        </div>
      </footer>
    </div>
  );
}
