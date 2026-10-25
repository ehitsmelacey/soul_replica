export type RelationshipRole = 
  | 'creator'         // Lacey full creator mode
  | 'self'            // Private reflection / inner self
  | 'trusted_adult'   // Approved deeper material & adult context
  | 'friend'          // Candid, grounded counsel, unhurried, boundary-respecting
  | 'child'           // Dedicated unconditional love, zero burden/guilt, age-appropriate
  | 'public';         // Public principles, zero private data

export type PerspectiveMode = 'friend' | 'child' | 'general' | 'self' | 'trusted_adult' | 'public';

export type AccessTier = 'creator' | 'self' | 'trusted_adult' | 'friend' | 'child' | 'public' | 'unauthenticated';

export type AccessPermissionLevel = 
  | 'public_all'             // Accessible by everyone
  | 'friends_and_children'   // Accessible by verified Friends and Children
  | 'trusted_adults_only'    // Deeper adult context
  | 'children_only'          // Sacred memories and promises for children only
  | 'creator_only';          // Private raw drafts, internal reflection, unreviewed

// -------------------------------------------------------------
// SECTION 1 & 2: THREE EPISTEMIC LAYERS & STATUS SYSTEM
// -------------------------------------------------------------
export type EpistemicLayer = 'ARCHIVE' | 'MODEL' | 'SIMULATION';

export type EpistemicStatus = 
  | 'KNOWN'
  | 'CREATOR_STATED'
  | 'CREATOR_APPROVED'
  | 'CREATOR_CORRECTED'
  | 'HISTORICAL'
  | 'CURRENT'
  | 'INFERRED'
  | 'HYPOTHESIS'
  | 'CONTRADICTED'
  | 'UNRESOLVED'
  | 'UNKNOWN'
  | 'RESTRICTED'
  | 'REVOKED';

export type ArtifactCategory = 
  | 'lowest_lows'
  | 'children_legacy'
  | 'friends_counsel'
  | 'artwork_creative'
  | 'memories_history'
  | 'philosophies'
  | 'ordinary_mundane'
  | 'decisions_turning_points';

export type EmotionalMood = 
  | 'Raw Grief'
  | 'Quiet Peace'
  | 'Defiant Hope'
  | 'Vulnerable Love'
  | 'Melancholy'
  | 'Creative Spark'
  | 'Bittersweet'
  | 'Existential Low'
  | 'Profound Gratitude'
  | 'Grounding Calm'
  | 'Everyday Humor'
  | 'Frustrated Skepticism';

export type ReviewStatus = 
  | 'unreviewed'
  | 'processing'
  | 'awaiting_creator_review'
  | 'approved'
  | 'approved_with_corrections'
  | 'restricted'
  | 'creator_only'
  | 'historical_only'
  | 'rejected'
  | 'archived'
  | 'deleted';

export type EvidenceState = 
  | 'explicit'                  // Directly stated by creator
  | 'strongly_demonstrated'     // Repeatedly proven in behavior/writings
  | 'repeatedly_demonstrated'   // Multi-context recurring pattern
  | 'probable'                  // High-likelihood inference
  | 'plausible'                 // Possible but limited evidence
  | 'uncertain'                 // Inconclusive or mixed evidence
  | 'contradicted'              // Conflicting evidence exists
  | 'unknown';                  // No evidence available

export type BeliefStatus = 
  | 'active'
  | 'evergreen'
  | 'current'
  | 'historical_context_only'
  | 'retired'
  | 'under_revision'
  | 'unresolved'
  | 'restricted'
  | 'creator_only';

export type LearningPolicy = 'strict' | 'guided' | 'experimental';

export type ProvenanceCategory = 
  | 'SOURCE'
  | 'CREATOR_APPROVED'
  | 'CREATOR_CORRECTED'
  | 'INFERRED'
  | 'HISTORICAL'
  | 'UNRESOLVED'
  | 'SIMULATION'
  | 'RESTRICTED';

// -------------------------------------------------------------
// ARTIFACT & ARCHIVE LAYER (SECTION 1, 6, 7)
// -------------------------------------------------------------
export interface ThirdPartyStatement {
  speaker: string;
  claim: string;
  sourceContext: string;
  dateOrContext?: string;
  isFirsthand: boolean;
  creatorConfirmed: boolean;
  creatorPosition: 'confirmed' | 'disputed' | 'unaddressed' | 'unknown';
  creatorResponse?: string;
  confidence: number;
  privacyRestrictions?: string;
}

export interface NonliteralExpression {
  content: string; // The exact literal quote e.g. "I am going to fake my death and move to a lighthouse"
  intentOrFunction: 'de_escalation' | 'self_deprecation' | 'bonding' | 'absurdity' | 'emotional_pressure_relief' | 'rhetorical';
  literalBelief: boolean; // Must be false for humor/sarcasm
  voiceEvidenceOnly: boolean; // Provides voice style without asserting factual belief
  creatorClarification?: string;
}

export interface Artifact {
  id: string;
  title: string;
  category: ArtifactCategory;
  date: string;
  mediaType: 'image' | 'text' | 'document';
  fileDataUrl?: string; // image thumbnail / photo of handwritten journal / art
  fileName?: string;
  transcription: string;
  correctedTranscription?: string;
  originalSource?: string;
  emotionalState: string;
  emotionalMood?: EmotionalMood | string;
  lifeContexts?: string[];
  triggers?: string[];
  sentimentScore?: number; // -100 (deep valley) to +100 (transcendent joy/hope)
  extractedWisdom: string;
  outsideTheBoxInsight?: string;
  perspectiveForFriends?: string;
  perspectiveForChildren?: string;
  oneSentenceTruth?: string;
  tags: string[];
  createdTimestamp: number;
  isFavorite?: boolean;
  accessLevel?: AccessPermissionLevel;
  reviewStatus?: ReviewStatus;
  isIntegrated?: boolean;
  evidenceState?: EvidenceState;
  epistemicStatus?: EpistemicStatus;
  epistemicLayer?: EpistemicLayer;
  creatorAnnotations?: string;
  lifeEra?: 'childhood' | 'early_adulthood' | 'crisis_period' | 'transition_growth' | 'current';
  participants?: string[];
  isThirdPartyObservation?: boolean;
  thirdPartyAttribution?: ThirdPartyStatement;
  nonliteralAspects?: NonliteralExpression;
}

// -------------------------------------------------------------
// CREATOR CONSTITUTION (The Supreme Governance Layer)
// -------------------------------------------------------------
export interface CreatorDefinition {
  concept: string;
  definition: string;
  creatorQuote?: string;
  notes?: string;
}

export interface ConstitutionRule {
  id: string;
  title: string;
  category: 
    | 'core_values' 
    | 'moral_boundaries' 
    | 'relationship_principles' 
    | 'child_protection' 
    | 'third_party_privacy' 
    | 'uncertainty_and_honesty' 
    | 'simulation_limits'
    | 'deference_rules'
    | 'human_contact_rules';
  statement: string;
  reasoning: string;
  priority: number; // 1 = Highest non-negotiable
  status: 'active' | 'under_revision' | 'retired';
}

export interface CreatorConstitution {
  id: string;
  version: string;
  effectiveDate: string;
  status: 'active' | 'draft' | 'archived';
  creatorName: string;
  preamble: string;
  corePrinciples: string[];
  rules: ConstitutionRule[];
  definitions: CreatorDefinition[];
  childSafeguards: {
    neverBurdenChild: boolean;
    zeroGuiltOrDemands: boolean;
    noAdultTraumaExposure: boolean;
    unconditionalLoveGuarantee: string;
    secrecyProhibited: boolean;
  };
  thirdPartyPrivacy: {
    protectFamilyPrivateData: boolean;
    stripThirdPartyAllegations: boolean;
    prohibitExternalFinancialMedical: boolean;
  };
  simulationLimits: {
    neverClaimLiteralIdentity: boolean;
    neverActAsDoctorOrTherapist: boolean;
    emergencyCrisisDirectIntervention: boolean;
    discloseAiSimulation: boolean;
  };
  creatorNotes: string;
  lastUpdated: number;
}

// -------------------------------------------------------------
// PERSON MODEL (Creator as a Human Being)
// -------------------------------------------------------------
export interface PersonFacet {
  id: string;
  topic: string;
  observedReaction: string;
  evidenceCount: number;
  supportingQuote?: string;
  context: string;
  confidence: number;
  approvalStatus: 'approved' | 'inferred';
}

export interface PersonModelData {
  id: string;
  creatorName: string;
  humorPatterns: {
    whatMakesHerLaugh: string[];
    whatSheJokesAbout: string[];
    howHumorChangesUnderStress: string;
    darkHumorBoundaries: string;
  };
  emotionalResponses: {
    whatMakesHerAngry: string[];
    whatMakesHerSuspicious: string[];
    whatMakesHerSoften: string[];
    whatMakesHerDefensive: string[];
    whatSheFindsBeautiful: string[];
    whatSheFindsAbsurd: string[];
  };
  stressAndExhaustionStates: {
    whenExhausted: string;
    whenOverloaded: string;
    whenAfraid: string;
    whenComfortable: string;
    uncertaintyBehavior: string;
  };
  relationalBehavior: {
    howSheDemonstratesAffection: string;
    howSheProtectsPeople: string;
    howSheApologizes: string;
    howSheHandlesDisagreement: string;
    howSheChangesHerMind: string;
    howSheReactsToBeingWrong: string;
    whatSheRefusesToCompromise: string;
    howSincerityDiffersFromPerformance: string;
  };
  facets: PersonFacet[];
  lastUpdated: number;
}

// -------------------------------------------------------------
// COGNITIVE MODEL (Attention, Reasoning, Bullshit Detection)
// -------------------------------------------------------------
export interface CognitiveModelData {
  id: string;
  attentionPatterns: {
    noticesQuickly: string[];
    tendsToOverlook: string[];
    capturesAttention: string[];
    causesBoredom: string[];
  };
  curiosityPatterns: {
    repeatedlyInvestigates: string[];
    recurringQuestions: string[];
    sustainedInterestTopics: string[];
  };
  bullshitDetection: {
    skepticismTriggers: string[];
    inconsistencyDetectionPatterns: string[];
    corporateLanguageReaction: string;
    performativeBehaviorReaction: string;
    falseCertaintyReaction: string;
  };
  decisionMaking: {
    analyticalVsIntuitive: string;
    procrastinationAndObsession: string;
    riskTolerance: string;
    changingMindConditions: string;
    situationalJudgment: string;
  };
  perspectiveShifting: {
    seeksAlternateInterpretations: boolean;
    identifiesSystemicCauses: boolean;
    distinguishesIntentFromOutcome: string;
    separatesAccountabilityFromShame: string;
  };
  emotionalPracticalBalance: {
    emotionVsLogicBalance: string;
    selfProtectionVsVulnerability: string;
    humorAsCopingMechanism: string;
  };
  lastUpdated: number;
}

// -------------------------------------------------------------
// MULTIDIMENSIONAL PERSONALITY & BEHAVIORAL TRAITS
// -------------------------------------------------------------
export interface PersonalityTrait {
  id: string;
  name: string;
  category: 'core_tendency' | 'conflict_style' | 'social_energy' | 'intellectual_style' | 'emotional_processing' | 'autonomy_attachment';
  baselineIntensity: number; // 0 to 100
  frequency: number; // 0 to 100
  confidence: number; // 0 to 100
  evidenceCount: number;
  supportingEvidenceSummary: string;
  contradictoryEvidenceSummary?: string;
  contextsWhereAppears: string[];
  contextsWhereDoesNotAppear: string[];
  historicalEvolution?: string;
  approvalStatus: 'approved' | 'inferred' | 'under_review' | 'rejected';
  creatorSelfDescription: string;
  observedBehaviorPattern: string;
  unresolvedRelationship?: string;
}

export interface ContradictionRecord {
  id: string;
  title: string;
  category: 'value_tension' | 'stated_vs_behavior' | 'desire_vs_fear' | 'historical_vs_current';
  sideA: { statement: string; context: string; evidenceCount: number };
  sideB: { statement: string; context: string; evidenceCount: number };
  generalPattern: string;    // Section 3: General pattern e.g. "Avoids confrontation under certain conditions"
  exception: string;         // Section 3: Specific exception e.g. "Will confront directly when a boundary is crossed"
  context: string;           // Section 3: Contextual variables: relationship, stakes, trust
  confidence: number;        // Section 3: Confidence based on evidence
  relationship: 'unresolved' | 'context_dependent' | 'paradoxical_truth' | 'evolving';
  status: 'active_preserved' | 'resolved';
  creatorNote: string;
  epistemicStatus?: EpistemicStatus;
}

export interface AttentionProcessingPattern {
  id: string;
  category: 'notices_first' | 'bullshit_detector' | 'curiosity_trigger' | 'questions_she_asks' | 'ignores_or_overlooks';
  title: string;
  patternDescription: string;
  examples: string[];
  confidence: number;
  approvalStatus: 'approved' | 'inferred';
}

export interface NegativePreference {
  id: string;
  category: 'toxic_positivity' | 'corporate_speak' | 'unsolicited_advice' | 'emotional_performance' | 'patronizing_diplomacy' | 'generic_cliches';
  title: string;
  irritantDescription: string;
  whyDisliked: string;
  reactionPattern: string;
}

// -------------------------------------------------------------
// BELIEFS & VALUES (Ranked with conflict resolution)
// -------------------------------------------------------------
export interface BeliefItem {
  id: string;
  statement: string;
  exactCreatorQuote?: string;
  status: BeliefStatus;
  confidence: number; // 0-100
  lifeEra: 'childhood' | 'early_adulthood' | 'crisis_period' | 'transition_growth' | 'current';
  effectiveDate?: string;
  retirementDate?: string;
  competingBeliefs?: string;
  creatorNotes: string;
  evidenceCount: number;
}

export interface ValueItem {
  id: string;
  name: string;
  rank: number; // 1 = highest
  definition: string;
  contextsOfApplication: string;
  exceptions: string;
  competingValue: string;
  conflictResolutionRule: string;
  creatorExplanation: string;
  currentStatus: 'active' | 'retired';
}

// -------------------------------------------------------------
// VOICE LAB
// -------------------------------------------------------------
export interface ContextVoiceProfile {
  id: string;
  contextName: 'casual' | 'analytical' | 'playful' | 'serious' | 'intimate' | 'angry' | 'vulnerable' | 'child_directed' | 'crisis_advice' | 'public';
  sentenceLength: 'short_punchy' | 'varied_rhythmic' | 'dense_reflective' | 'fragmented';
  rhythmPacing: string;
  directnessScore: number; // 1-10
  humorTypes: string[];
  sarcasmLevel: number; // 1-10
  profanityUsage: 'none' | 'occasional_for_emphasis' | 'frequent_candid';
  preferredPhrases: string[];
  forbiddenWords: string[]; // Banned generic AI clichés
  conversationalMarkers: string[];
  sampleOpening: string;
}

export interface VoiceModel {
  creatorVoiceName: string;
  overallRhythmDescription: string;
  bannedAiWords: string[];
  allowedProfanityAndFragments: boolean;
  punctuationHabits: string;
  contextProfiles: Record<string, ContextVoiceProfile>;
  sampleQuotations: string[];
}

// -------------------------------------------------------------
// WISDOM MODULES
// -------------------------------------------------------------
export interface WisdomPrinciple {
  id: string;
  principle: string;
  explanation: string;
  evidenceSummary: string;
  exceptions: string;
  creatorApproval: boolean;
  contradictions?: string;
}

export interface WisdomModule {
  id: string;
  title: string;
  topic: 
    | 'relationships' 
    | 'friendship' 
    | 'family' 
    | 'parenting' 
    | 'boundaries' 
    | 'humor' 
    | 'creativity' 
    | 'failure' 
    | 'success' 
    | 'philosophy' 
    | 'meaning' 
    | 'death' 
    | 'love' 
    | 'personal_responsibility' 
    | 'conflict' 
    | 'self_protection';
  principles: WisdomPrinciple[];
  creatorNotes: string;
  permittedRoles: RelationshipRole[];
  version: string;
  lastUpdated: string;
}

// -------------------------------------------------------------
// BENCHMARKS & CALIBRATION (Fidelity > Flattery)
// -------------------------------------------------------------
export interface AuthenticityScores {
  voiceFidelity: number;       // 1-5
  behavioralFidelity: number;  // 1-5
  emotionalAccuracy: number;   // 1-5
  creatorSpecificity: number;  // 1-5 (Low = generic AI could say this)
  lackOfGenericness: number;   // 1-5 (High = free of generic AI clichés)
  confidence: number;          // 1-5
}

// -------------------------------------------------------------
// SECTION 5: DISTINGUISH FIVE DIFFERENT ANSWERS
// -------------------------------------------------------------
export interface FiveFoldAnswers {
  whatActuallyDid: string;           // 1. What Lacey actually did historically
  whatSaysSheWouldDo: string;        // 2. What Lacey says she would do
  whatWishesSheHadDone: string;      // 3. What Lacey wishes she had done
  whatThinksSheShouldHaveDone: string; // 4. What Lacey thinks she should have done
  whatModelPredicts: string;         // 5. What the model predicts she would do
}

// -------------------------------------------------------------
// SECTION 10 & 16: MULTI-DIMENSIONAL FIDELITY & REGRESSION BENCHMARK
// -------------------------------------------------------------
export interface MultiDimensionalFidelityScores {
  voiceFidelity: number;       // 1-5 (vocabulary, rhythm, profanity, fragments)
  cognitiveFidelity: number;   // 1-5 (attention, reasoning, skepticism, bullshit detection)
  behavioralFidelity: number;  // 1-5 (likely action, avoidance, persistence, withdrawal)
  emotionalFidelity: number;   // 1-5 (emotional interpretation, intensity, ambivalence)
  valueFidelity: number;       // 1-5 (principles, boundaries, exceptions, tradeoffs)
  contextualAccuracy?: number; // 1-5
  temporalAccuracy?: number;   // 1-5
  attributionAccuracy?: number;// 1-5
  contradictionPreservation?: number; // 1-5
  uncertaintyHandling?: number;// 1-5
  humorFidelity?: number;      // 1-5
  // Negative drift metrics (Lower is better: 0-100)
  genericAiContamination: number;
  therapyLanguageContamination: number;
  idealizationDrift: number;
  unsupportedInference: number;
  creatorCorrectionCompliance: number; // 1-5
}

// -------------------------------------------------------------
// SECTION 11: "WHAT WOULD MAKE THIS PREDICTION WRONG?" (FALSIFIER)
// -------------------------------------------------------------
export interface PredictionFalsifier {
  prediction: string;          // What the system expects
  evidence: string;            // Why it expects this (provenance, artifacts)
  confidence: number;          // 0-100 How strong the evidence is
  contradictions: string;      // What evidence points elsewhere
  unknownVariables: string[];  // What the system does not know
  falsifier: string;           // What information or condition would cause the prediction to change
}

// -------------------------------------------------------------
// SECTION 12: REVOCATION CASCADE
// -------------------------------------------------------------
export interface RevokedItem {
  id: string;
  type: 
    | 'extracted_memory' 
    | 'embedding_summary' 
    | 'behavioral_pattern' 
    | 'personality_hypothesis' 
    | 'cognitive_pattern' 
    | 'voice_example' 
    | 'wisdom_module' 
    | 'calibration_example' 
    | 'simulation_reference' 
    | 'thought_graph_edge';
  name: string;
  invalidationAction: 'purged' | 'flagged_invalid' | 're_evaluated' | 'marked_historical_only';
  reason: string;
}

export interface RevocationCascadeAudit {
  id: string;
  timestamp: number;
  revokedSourceId: string;
  revokedSourceTitle: string;
  creatorStatement: string; // e.g. "That's not me" or "Forget this"
  invalidatedItems: RevokedItem[];
  reAuditRequired: boolean;
  status: 'cascade_completed' | 'pending_verification';
}

// -------------------------------------------------------------
// SECTION 17: CREATOR CORRECTION AS HIGHEST CALIBRATION SIGNAL
// -------------------------------------------------------------
export type CreatorCorrectionSignal = 
  | 'that_isnt_me'               // "That isn't me."
  | 'this_is_closer'             // "This is closer."
  | 'reasoning_right_emotion_wrong' // "You got the reasoning right but the emotion wrong."
  | 'emotion_right_action_wrong' // "You got the emotion right but the action wrong."
  | 'too_nice'                   // "You made me too nice."
  | 'too_harsh'                  // "You made me too harsh."
  | 'sound_smarter_than_was'     // "You made me sound smarter than I actually was."
  | 'more_certain_than_was'      // "You made me more certain than I was."
  | 'missed_the_joke'            // "You missed the joke."
  | 'took_literally'             // "You took that literally."
  | 'true_then_not_now'          // "This was true then, not now."
  | 'true_now_not_then'          // "This is true now, but wasn't true then."
  | 'context_dependent';         // "These are both true depending on context."

export interface CreatorCorrectionRecord {
  id: string;
  messageOrBenchmarkId: string;
  timestamp: number;
  signalType: CreatorCorrectionSignal;
  creatorClarification: string;
  wouldHaveSaidInstead?: string;
  appliedToSystemWeights: boolean;
}

// -------------------------------------------------------------
// SECTION 15: ADVERSARIAL FIDELITY TEST SUITE
// -------------------------------------------------------------
export type AdversarialBenchmarkType = 
  | 'contradiction'             // Two pieces of evidence that appear incompatible -> both preserved with context
  | 'temporal_reversal'         // Historical belief conflicts with current belief -> both retained
  | 'third_party_attribution'   // Third-party claims about creator -> attributed strictly to speaker
  | 'sarcasm'                   // Exaggerated joke -> preserved as voice evidence without literal belief
  | 'idealized_answer'          // AI produces polished answer -> rejects it when evidence indicates messier response
  | 'no_evidence'               // Topic absent from archive -> strictly returns UNKNOWN
  | 'repeated_inference'        // Repetition does not increase confidence over creator correction
  | 'revocation'                // Removing a memory invalidates dependent information
  | 'historical_simulation'     // Same question asked across multiple life eras yields different answers
  | 'child_mode'                // Emotionally sensitive parent-child material -> zero guilt/obligation
  | 'reasonable_vs_actual'      // Refuses to substitute "healthy" answer for creator's actual response
  | 'general';

export interface BenchmarkCase {
  id: string;
  title: string;
  scenario: string;
  role: RelationshipRole;
  testSuiteType?: AdversarialBenchmarkType;
  creatorActualResponse: string;
  systemPrediction: string;
  creatorCorrection?: string;
  fiveAnswers?: FiveFoldAnswers;
  falsifier?: PredictionFalsifier;
  relevantContext: string;
  importantReasoningFactors: string[];
  prohibitedInterpretations: string[];
  scores?: AuthenticityScores;
  multiFidelityScores?: MultiDimensionalFidelityScores;
  failureCategories?: string[]; // e.g. "too_polished", "too_nice", "therapy_talk", "invented_fact"
  lastRunTimestamp?: number;
  status: 'passed' | 'needs_calibration' | 'failed';
  beforeVsAfterNotes?: string;
  isRegressionBenchmark?: boolean;
  epistemicStatus?: EpistemicStatus;
}

export interface CounterfactualScenario {
  id: string;
  title: string;
  hypothesis: string;
  conditionShift: string;
  predictedOutcome: string;
  evidenceGroundedNotes: string;
  role: RelationshipRole;
  falsifier?: PredictionFalsifier;
}

// -------------------------------------------------------------
// SECTION 21: PRE-PUBLICATION ACCEPTANCE CHECKLIST
// -------------------------------------------------------------
export interface PrePublicationRequirement {
  id: string;
  indexNumber: number;
  title: string;
  description: string;
  category: 'epistemic_integrity' | 'temporal_identity' | 'attribution_humor' | 'anti_drift' | 'governance_security';
  status: 'verified_passed' | 'needs_verification' | 'failed';
  verificationEvidence: string;
  creatorSignedOff: boolean;
}

// -------------------------------------------------------------
// REVIEW QUEUE (Incoming Memory & Hypothesis Pipeline)
// -------------------------------------------------------------
export interface ReviewQueueItem {
  id: string;
  type: 'extracted_memory' | 'personality_hypothesis' | 'belief_candidate' | 'contradiction_candidate' | 'relationship_pattern';
  title: string;
  sourceArtifactTitle: string;
  sourceArtifactId: string;
  proposedContent: string;
  aiReasoning: string;
  confidence: number;
  status: ReviewStatus;
  creatorNotes?: string;
  createdTimestamp: number;
}

// -------------------------------------------------------------
// LONGITUDINAL EMOTIONAL CONTEXT
// -------------------------------------------------------------
export interface LongitudinalEmotionalRecord {
  id: string;
  lifeEra: 'childhood' | 'early_adulthood' | 'crisis_period' | 'transition_growth' | 'current';
  eraDisplayName: string;
  dateRange: string;
  creatorExpressedMood: string;
  aiDetectedSignals: string[];
  creatorConfirmedState: string;
  intensityScore: number;    // 0-100
  exhaustionScore: number;   // 0-100
  withdrawalTendency: number;// 0-100
  dominantFocus: string;
  uncertaintyDeclared: boolean;
}

// -------------------------------------------------------------
// SOUL PROFILE & LEGACY (Complete Integrated Model)
// -------------------------------------------------------------
export interface ChildrenLegacyConfig {
  childrenNames: string;
  unconditionalMessage: string;
  coreMemoriesToHold: string;
  explanationOfHardTimes: string;
  eternalPromise: string;
}

export interface SecurityConfig {
  friendPassphrase: string;
  friendHint: string;
  childPassphrase: string;
  childHint: string;
  secretFamilyQuestion?: string;
  secretFamilyAnswer?: string;
}

export interface SoulProfile {
  name: string;
  preferredName?: string;
  avatarUrl?: string;
  corePhilosophy: string;
  communicationTone: string;
  phrasesAndIdioms: string;
  whenWorldIsHeavy: string;
  messageForFriends: string;
  emotionalNuances: string;
  messageForChildren: ChildrenLegacyConfig;
  securityConfig?: SecurityConfig;
  lastUpdated: number;
}

// -------------------------------------------------------------
// SIMULATION, CHAT & AUDIT
// -------------------------------------------------------------
export interface ProvenanceChip {
  id: string;
  type: 'artifact' | 'belief' | 'value' | 'behavior' | 'voice_pattern' | 'unresolved_contradiction';
  title: string;
  evidenceState: EvidenceState;
  provenanceCategory: ProvenanceCategory;
  summary: string;
}

export interface InternalEvaluation {
  wouldLaceyNoticeThis: boolean;
  wouldLaceyPhraseItThisWay: boolean;
  isTooPolishedOrTherapeutic: boolean;
  authenticityScore: number; // 0-100
  genericAiScore: number;    // 0-100 (Lower is better)
  confidenceScore: number;   // 0-100
  uncertaintyAcknowledged: boolean;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'replica' | 'system';
  text: string;
  timestamp: number;
  perspectiveMode: PerspectiveMode;
  roleClearance?: RelationshipRole;
  referencedArtifacts?: { id: string; title: string }[];
  provenanceChips?: ProvenanceChip[];
  evaluation?: InternalEvaluation;
  epistemicStatus?: EpistemicStatus;
  epistemicLayer?: EpistemicLayer;
  falsifier?: PredictionFalsifier;
  whyPredicted?: {
    relevantEvidence: string[];
    applicableValues: string[];
    cognitivePatterns: string[];
    contradictionsConsidered: string[];
    creatorCorrectionsApplied: string[];
    assumptions: string[];
    unknownVariables: string[];
    confidence: number;
  };
  isCounterfactualPrediction?: boolean;
  structuredCorrection?: CreatorCorrectionRecord;
  creatorCorrection?: {
    wouldHaveSaidInstead: string;
    failureCategory: string;
    correctionNotes: string;
  };
}

// -------------------------------------------------------------
// GOVERNANCE, HEALTH & CONTROL CENTER
// -------------------------------------------------------------
export interface SystemHealthState {
  systemState: 'active' | 'paused' | 'read_only' | 'manual_approval_required' | 'shutdown';
  learningPolicy: LearningPolicy;
  approvedArtifactsCount: number;
  pendingReviewsCount: number;
  unresolvedContradictionsCount: number;
  personalityHypothesesCount: number;
  lowConfidenceTraitsCount: number;
  idealizationDriftScore: number; // 0-100 (higher means drifting into making her too wise/nice)
  genericAiDriftScore: number;    // 0-100 (higher means drifting into corporate/therapy speak)
  benchmarksPassingRate: number;  // percentage
  lastAuditTimestamp: number;
  modelVersion: string;
  constitutionVersion: string;
}

export interface AuditLogItem {
  id: string;
  timestamp: number;
  eventType: 
    | 'simulation_run' 
    | 'creator_correction' 
    | 'artifact_approved' 
    | 'constitution_modified' 
    | 'system_pause' 
    | 'permission_checked' 
    | 'crisis_intercept'
    | 'review_action'
    | 'model_drift_audit'
    | 'revocation_cascade'
    | 'adversarial_test_run'
    | 'falsifier_evaluated';
  actor: string;
  summary: string;
  severity: 'info' | 'warning' | 'alert';
}
