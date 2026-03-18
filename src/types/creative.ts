// ============================================================
// Core Types - All data is AI-generated, these are the shapes
// ============================================================

export type ScenarioType = "v3" | "v4" | "v5";

// V3 = mobile app ads (features, benefits, purpose)
// V4 = any product ads (generic)
// V5 = any product ads + GPT for creatives (comparison)

export interface IProjectInput {
  scenario: ScenarioType;
  productName: string;
  productDescription: string;
  creatorBrief?: string; // Creator's insider knowledge: winning angles, audience insights, what excites them
  // V3-specific
  featureName?: string;
  appId?: string;
  featureId?: string;
  appFeatures?: string;
  appBenefits?: string;
  appPurpose?: string;
  // V4-specific
  targetAudience?: string;
  uniqueSellingPoint?: string;
}

// --- Creative Tree ---

export interface IEmotionalAngle {
  id: string;
  name: string;
  mechanism: string;
  color: string;
  relevanceScore: number;
}

export interface IFramework {
  id: string;
  name: string;
  abbreviation: string;
  color: string;
  description: string;
}

export interface IAdScript {
  frameworkId: string;
  steps: IScriptStep[];
  hooks: string[];
}

export interface IScriptStep {
  label: string;
  type: "problem" | "agitate" | "solution" | "cta" | "before" | "after" | "attention" | "interest" | "desire" | "full" | "mechanism";
  text: string;
  hidden?: true;
}

export interface IPlatformFormat {
  platform: string;
  formats: { type: string; description: string }[];
}

export interface ICreativeTreeData {
  emotionalAngles: IEmotionalAngle[];
  frameworks: IFramework[];
  scripts: Record<string, IAdScript[]>; // keyed by emotionalAngle.id
  platformFormats: IPlatformFormat[];
}

// --- Psyche Map ---

export interface IBrainRegion {
  id: string;
  name: string;
  role: string;
  description: string;
  adTip: string;
  active: boolean;
  color: string;
  x: number;
  y: number;
  r: number;
}

export interface ICognitiveProfile {
  name: string;
  emoji: string;
  color: string;
  description: string;
  mechanism: string;
  difficulty: string;
  conversionPotential: string;
  retentionRisk: string;
}

export interface IDopamineArchitecture {
  trigger: string;
  triggerPct: number;
  schedule: string;
  schedulePct: number;
  anticipation: string;
  retention: string;
  retentionPct: number;
}

export interface ICognitiveBias {
  name: string;
  strength: number;
  color: string;
  description: string;
  example: string;
}

export interface IHabitLoop {
  cue: string;
  routine: string;
  reward: string;
}

export interface IPersuasionStackLayer {
  num: number;
  name: string;
  color: string;
  timeRange: string;
  description: string;
  techniques: string[];
}

export interface IPainPleasureMatrix {
  pains: string[];
  pleasures: string[];
}

export interface IPsycheMapData {
  brainRegions: IBrainRegion[];
  cognitiveProfile: ICognitiveProfile;
  dopamine: IDopamineArchitecture;
  biases: ICognitiveBias[];
  habitLoop: IHabitLoop;
  persuasionStack: IPersuasionStackLayer[];
  painPleasure: IPainPleasureMatrix;
  audiencePosition: { axis: string; insight: string };
}

// --- Sales Playbook ---

export interface IValueEquation {
  dreamOutcome: { score: number; text: string };
  perceivedLikelihood: { score: number; text: string };
  timeDelay: { score: number; text: string };
  effortSacrifice: { score: number; text: string };
}

export interface IAwarenessLevel {
  level: number;
  name: string;
  color: string;
  description: string;
  adStrategy: string;
  exampleHook: string;
  bestFor: string;
  relevance: number;
}

export interface ICialdiniWeapon {
  name: string;
  icon: string;
  color: string;
  description: string;
  application: string;
  scriptExample: string;
  power: number;
}

export interface IStraightLineCertainty {
  product: { score: number; text: string; tactics: string[] };
  seller: { score: number; text: string; tactics: string[] };
  action: { score: number; text: string; tactics: string[] };
}

export interface IHSOFramework {
  hooks: string[];
  stories: string[];
  offers: string[];
}

export interface IRetargetingStage {
  name: string;
  color: string;
  icon: string;
  frequency: string;
  audience: string;
  description: string;
  bestEmotions: string;
  biasStack: string;
  creativeFormat: string;
  example: string;
}

export interface IClosingTechnique {
  name: string;
  source: string;
  book: string;
  description: string;
  scriptExample: string;
}

export interface ISystem12Trigger {
  trigger: string;
  description: string;
  tip: string;
  hidden?: true;
}

export interface INLPTechnique {
  id: string;
  name: string;
  color: string;
  power: number;
  definition: string;
  copyExamples: string[];
  adApplication: string;
  productExample: string; // Personalized by Claude for the specific product
}

export interface INLPStackStep {
  step: number;
  technique: string;
  script: string; // Personalized ad script for this step
  hidden?: true;
}

export interface INLPData {
  techniques: INLPTechnique[];
  stackStrategy: INLPStackStep[];
  keyPrinciple: string;
}

export interface IObjectionEntry {
  objection: string;
  killMechanism: string;
  hookCounter: string;
  bodyCounter: string;
}

export interface IMarketSophistication {
  level: number;        // 1-5 Schwartz scale
  name: string;         // "New Opportunity" | "Enlarged Claim" | "Mechanism" | "Enlarged Mechanism" | "Identity/Experience"
  description: string;  // What this level means for this product
  hookStrategy: string; // How hooks should be structured at this level
  avoidance: string;    // What NOT to do at this level
}

export interface IPurchaseContext {
  priceModel: string;   // "free + IAP" | "subscription" | "one-time" | "freemium"
  pricePoint: string;   // "$0 (free trial)" | "$9.99/mo" etc.
  purchaseType: string; // "impulse" | "considered" | "habitual"
  conversionAction: string; // "download" | "subscribe" | "purchase" | "sign up"
  adIntensity: string;  // "soft" | "medium" | "hard" — how aggressive the CTA/urgency should be
  reasoning: string;    // Why this calibration
}

export interface IDemandTemperature {
  level: "low" | "medium" | "high";
  description: string;    // Why this product is at this demand level
  hookApproach: string;   // How hooks should be structured given this demand
  bridgeWeight: string;   // How much bridge work is needed between hook and body
}

export interface ISalesPlaybookData {
  valueEquation: IValueEquation;
  awarenessLevels: IAwarenessLevel[];
  cialdiniWeapons: ICialdiniWeapon[];
  straightLine: IStraightLineCertainty;
  hso: IHSOFramework;
  retargetingFunnel: IRetargetingStage[];
  closingTechniques: IClosingTechnique[];
  system1Triggers: ISystem12Trigger[];
  system2Triggers: ISystem12Trigger[];
  nlp: INLPData;
  objectionMap: IObjectionEntry[];
  marketSophistication: IMarketSophistication;
  purchaseContext: IPurchaseContext;
  demandTemperature: IDemandTemperature;
}

// --- Research ---

export interface IShadowAvatarStep {
  num: number;
  color: string;
  title: string;
  description: string;
}

export interface ISearchQuery {
  platform: string;
  query: string;
  why: string;
}

export interface IResearchTechnique {
  name: string;
  color: string;
  description: string;
  steps: string[];
}

export interface IAvatarTrait {
  label: string;
  value: string;
}

export interface IAudienceSegment {
  name: string;
  description: string;
  demographics: string;
  psychographics: string;
  predictedROI: "high" | "medium" | "low";
  acquisitionCost: "low" | "medium" | "high";
  lifetimeValue: "high" | "medium" | "low";
  conversionLikelihood: number; // 0-100
  bestAngle: string;
  adStrategy: string;
  color: string;
}

export interface IBenefitExpansion {
  surfaceBenefit: string;
  expandedThreads: string[];
  identityShift: string;
  hidden?: true;
}

export interface IResearchData {
  shadowAvatarSteps: IShadowAvatarStep[];
  searchQueries: ISearchQuery[];
  researchTechniques: IResearchTechnique[];
  avatarTraits: IAvatarTrait[];
  audienceSegments: IAudienceSegment[];
  benefitExpansion?: IBenefitExpansion;
  preCreativeChecklist: string[];
}

// --- Copy Check ---

// AI Deep Review result (qualitative - local scoring is in lib/copy-check.ts)
export interface ICopyCheckResult {
  qualitativeReview?: {
    overallImpression: string;
    emotionalImpact: string;
    targetAlignment: string;
    uniqueness: string;
  };
  issues: { title: string; description: string; fix: string; severity: "high" | "medium" | "low" }[];
  frameworksMatched: string[];
  rewriteSuggestion?: string;
}

// --- Top 5 Creatives ---

export type DeliveryMode =
  | "text-overlay"        // Text on screen only, no voice
  | "voiceover-caption";  // Voice narration + summary caption on screen

// Visual hook styles — known archetypes + "dynamic" for Claude-generated ones
export type VisualHookType =
  | "authority-staging"     // Borrow credibility from a recognizable context (podcast set, news desk, lecture hall)
  | "scenic-interrupt"      // Beautiful/captivating vista that stops the scroll while text lands
  | "category-anchor"       // Show the thing the viewer already has feelings about (bible, food, gym, etc.)
  | "routine-window"        // Place product in a daily moment the viewer recognizes (waking up, commuting, bedtime)
  | "social-curiosity"      // Street interviews, reactions, "what did this person say?" format
  | "narrative-animation"   // Animated/illustrated storytelling that signals "this is a story, not an ad"
  | "ugc-reaction"          // Raw user-generated reaction/testimonial footage
  | "dramatic-reenactment"  // Acted-out relatable scenario (skit, POV, mini-drama)
  | "product-in-context"    // Product being used in its natural environment
  | "dynamic";              // Claude-generated style that doesn't fit known archetypes

export interface IVisualStyle {
  type: VisualHookType;
  name: string;            // Short human-readable name (e.g. "Podcast Set Authority", "Morning Routine Window")
  description: string;     // What footage to source/film — specific enough for a media buyer
}

export type SoraClipDuration = "4s" | "8s" | "12s";

// Where the hook audio comes from — determines Sora2 prompt structure
export type HookAudioSource =
  | "sora2"       // Person speaks on camera — Sora2 generates voice. Prompt INCLUDES dialogue.
  | "elevenlabs"; // No person speaking — ElevenLabs VO laid over silent/ambient Sora2 footage.

export interface IVisualSuggestion {
  idea: string;            // The visual concept (what the viewer sees)
  prompt: string;          // Scene description for Sora2. If audioSource="sora2": INCLUDE dialogue/speech. If "elevenlabs": visual-only.
  clipDuration: SoraClipDuration; // Sora2 clip length: "4s" | "8s" | "12s". Multiple clips stitch to cover hook duration.
  styleTags: string[];     // Sora2 style/mood tags. Drive the visual treatment. E.g. ["ugc", "iphone", "handheld"] or ["cinematic", "sci-fi", "VFX"].
}

export interface IAdSection {
  time: string;
  text: string;
  visual: string;
  deliveryMode?: DeliveryMode;
}

export interface IUGCPromptParams {
  archetype: string;
  emotion: string;
  action: string;
  environment: string;
  appearance: {
    ageRange: string;
    gender: string;
    ethnicity: string;
    build: string;
    style: string;
    hair: string;
    details: string;
  };
}

export interface IHookVariation {
  // --- TEXT LAYER ---
  text: string;           // On-screen caption. Full hook for text-overlay, short summary for VO+caption.
  // --- AUDIO ---
  audioSource?: HookAudioSource; // "sora2" = person speaks in clip. "elevenlabs" = separate VO over footage.
  voiceoverScript?: string; // The spoken words. If sora2: baked into Sora2 prompt. If elevenlabs: separate audio track.
  // --- VISUAL LAYER (Sora2 clips) ---
  visualStyle: IVisualStyle;              // What type of footage (podcast, scenic, street, etc.)
  visualSuggestions: IVisualSuggestion[]; // 2-3 Sora2 clips. Each has clipDuration (4s/8s/12s). Stitched to cover hook duration.
  sora2Prompts?: ISora2Prompt[];         // Extracted Sora2 prompt payloads, 1:1 with visualSuggestions. Stamped on save.
  // --- TIMING ---
  duration: string;       // Total hook duration. Sum of stitched clips.
  // --- METADATA ---
  angle: string;          // Which psychological lever this pulls
  // --- UGC ARCHETYPE (when visual style is UGC-type) ---
  ugcArchetype?: string;              // Which performance archetype was used
  ugcPromptParams?: IUGCPromptParams; // The selected values from each pool
  hidden?: true;
}

export interface IBodyVariation {
  // --- TEXT LAYER ---
  text: string;           // On-screen text: plain feature description
  // --- AUDIO LAYER (ElevenLabs — always separate, never Sora2) ---
  voiceoverScript?: string; // 10-20 words. If hook audioSource="sora2": this is a NEW voice (or none). If "elevenlabs": continues from hook VO.
  // --- VISUAL LAYER (screen recording — NOT Sora2) ---
  visual: string;         // What the screen recording / product footage shows. Always real footage.
  // --- TIMING ---
  duration?: string;      // Total body duration.
}

export interface IAdCreativeBlueprint {
  rank: number;
  name: string;
  sourceAngle?: string;
  sourceFramework?: string;
  templateId?: string;
  templateName?: string;
  emotion: string;
  platform: string;
  format: string;
  scenario: string;
  experienceType: string;
  productionStyle: string;
  deliveryMode: DeliveryMode;
  // Multiple variations for swipeable cards
  hooks: IHookVariation[];
  bodies: IBodyVariation[];
  // Single CTA (overlay bar, not a video section)
  cta: { text: string; deliveryMode?: DeliveryMode };
  // Legacy single hook/body for backward compat with existing data
  hook?: IAdSection;
  body?: IAdSection;
  targetSegment?: string;
  whyThisTemplate?: string;
  whyThisScript?: string;
  isUgcBatch?: boolean;
  hidden?: true;
}

export interface ICreativeFeedback {
  hookIssues?: string[];    // "hooks are too action-narrating", "staccato fragments", etc.
  bodyIssues?: string[];    // "body uses metaphors instead of plain feature description"
  segmentIssues?: string[]; // "over-segmented for broad identity product"
  ctaIssues?: string[];     // "CTAs are slogans not actions"
  generalNotes?: string[];  // freeform feedback
}

export interface ISora2Prompt {
  description: string;
  voiceline_script: string | null;
  duration_seconds: number;
  style_tags: string[];
}

export interface ITopCreativesData {
  creatives: IAdCreativeBlueprint[];
}

// --- Full Generation Result ---

export interface IGenerationResult {
  id: string;
  input: IProjectInput;
  creativeTree: ICreativeTreeData;
  psycheMap: IPsycheMapData;
  salesPlaybook: ISalesPlaybookData;
  research: IResearchData;
  topCreatives: ITopCreativesData;
  createdAt: string;
}

// --- Supabase row ---

export interface IProjectRow {
  id: string;
  scenario: ScenarioType;
  product_name: string;
  product_description: string;
  app_id: string | null;
  feature_name: string | null;
  feature_id: string | null;
  input_data: IProjectInput;
  generation_result: IGenerationResult | null;
  status: "pending" | "generating" | "completed" | "failed";
  created_at: string;
  updated_at: string;
}
