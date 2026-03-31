/**
 * Centralized Enum Definitions
 *
 * All enums in the application should be defined here.
 * Naming convention: E{Name} (e.g., EScenario, EProjectStatus)
 */

/**
 * Scenario types for ad generation
 */
export enum EScenario {
  V3 = "v3",  // Mobile Apps
  V4 = "v4",  // Any Product
  V5 = "v5",  // Any Product + GPT Creatives (comparison)
  Applovin = "applovin", // Long-form 45-50s ads
  ResearchDLP = "research-dlp", // Deep dive only + chat, no ad generation
}

/**
 * Project generation and storage status
 */
export enum EProjectStatus {
  Pending = "pending",
  Generating = "generating",
  Completed = "completed",
  Failed = "failed",
}

/**
 * Generation section types
 */
export enum ESectionType {
  PsycheMap = "psycheMap",
  SalesPlaybook = "salesPlaybook",
  Research = "research",
  CreativeTree = "creativeTree",
  TopCreatives = "topCreatives",
  All = "all",
}

/**
 * Section generation status for UI progress tracking
 */
export enum ESectionStatus {
  Pending = "pending",
  Generating = "generating",
  Done = "done",
  Error = "error",
}

/**
 * Ad content delivery modes
 */
export enum EDeliveryMode {
  TextOverlay = "text-overlay",        // Text on screen only, no voice
  VoiceoverCaption = "voiceover-caption",  // Voice narration + summary caption on screen
}

/**
 * Visual hook types for ad creatives
 */
export enum EVisualHookType {
  AuthorityStaging = "authority-staging",
  ScenicInterrupt = "scenic-interrupt",
  CategoryAnchor = "category-anchor",
  RoutineWindow = "routine-window",
  SocialCuriosity = "social-curiosity",
  NarrativeAnimation = "narrative-animation",
  UgcReaction = "ugc-reaction",
  DramaticReenactment = "dramatic-reenactment",
  ProductInContext = "product-in-context",
  Dynamic = "dynamic",
}

/**
 * Sora2 video clip durations
 */
export enum ESoraClipDuration {
  Short = "4s",
  Medium = "8s",
  Long = "12s",
}

/**
 * Audio source for ad hooks
 */
export enum EHookAudioSource {
  Sora2 = "sora2",        // Person speaks on camera
  ElevenLabs = "elevenlabs",  // No person speaking, VO only
}

/**
 * Script step types for copywriting frameworks
 */
export enum EScriptStepType {
  Problem = "problem",
  Agitate = "agitate",
  Solution = "solution",
  CTA = "cta",
  Before = "before",
  After = "after",
  Attention = "attention",
  Interest = "interest",
  Desire = "desire",
  Action = "action",
  Full = "full",
  Mechanism = "mechanism",
}

/**
 * Platform types for ad distribution
 */
export enum EPlatform {
  TikTok = "TikTok",
  MetaIG = "Meta/IG",
  YouTube = "YouTube",
  Snapchat = "Snapchat",
}

/**
 * Ad template categories
 */
export enum ETemplateCategory {
  App = "app",
  Physical = "physical",
  Universal = "universal",
}

/**
 * UGC Performance Archetypes
 */
export enum EUGCArchetype {
  ShockExcited = "shock-excited",
  RantPassionate = "rant-passionate",
  ChaoticInterrupt = "chaotic-interrupt",
  PlayingCoy = "playing-coy",
  SkepticConverted = "skeptic-converted",
  BestieConspiratorial = "bestie-conspiratorial",
  CuriousIntrigued = "curious-intrigued",
  QuietConfidence = "quiet-confidence",
  VulnerableSoft = "vulnerable-soft",
  CaughtGuilty = "caught-guilty",
  ExhaustedDone = "exhausted-done",
  CasualUnbothered = "casual-unbothered",
  FomoLeftBehind = "fomo-left-behind",
  NostalgicRemembering = "nostalgic-remembering",
}

/**
 * Experience types for product categorization
 */
export enum EExperienceType {
  InApp = "in-app",
  Physical = "physical",
  Outcome = "outcome",
  Consumable = "consumable",
  Utility = "utility",
  LuxurySensory = "luxury-sensory",
}
