// ============================================================
// Core Types — All data is AI-generated, these are the shapes
// ============================================================

export type ScenarioType = "v3" | "v4";

// V3 = mobile app ads (features, benefits, purpose)
// V4 = any product ads (generic)

export interface ProjectInput {
  scenario: ScenarioType;
  productName: string;
  productDescription: string;
  // V3-specific
  appFeatures?: string;
  appBenefits?: string;
  appPurpose?: string;
  // V4-specific
  targetAudience?: string;
  uniqueSellingPoint?: string;
}

// --- Creative Tree ---

export interface EmotionalAngle {
  id: string;
  name: string;
  mechanism: string;
  color: string;
  relevanceScore: number;
}

export interface Framework {
  id: string;
  name: string;
  abbreviation: string;
  color: string;
  description: string;
}

export interface AdScript {
  frameworkId: string;
  steps: ScriptStep[];
  hooks: string[];
}

export interface ScriptStep {
  label: string;
  type: "problem" | "agitate" | "solution" | "cta" | "before" | "after" | "attention" | "interest" | "desire";
  text: string;
}

export interface PlatformFormat {
  platform: string;
  formats: { type: string; description: string }[];
}

export interface CreativeTreeData {
  emotionalAngles: EmotionalAngle[];
  frameworks: Framework[];
  scripts: Record<string, AdScript[]>; // keyed by emotionalAngle.id
  platformFormats: PlatformFormat[];
}

// --- Psyche Map ---

export interface BrainRegion {
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

export interface CognitiveProfile {
  name: string;
  emoji: string;
  color: string;
  description: string;
  mechanism: string;
  difficulty: string;
  conversionPotential: string;
  retentionRisk: string;
}

export interface DopamineArchitecture {
  trigger: string;
  triggerPct: number;
  schedule: string;
  schedulePct: number;
  anticipation: string;
  retention: string;
  retentionPct: number;
}

export interface CognitiveBias {
  name: string;
  strength: number;
  color: string;
  description: string;
  example: string;
}

export interface HabitLoop {
  cue: string;
  routine: string;
  reward: string;
}

export interface PersuasionStackLayer {
  num: number;
  name: string;
  color: string;
  timeRange: string;
  description: string;
  techniques: string[];
}

export interface PainPleasureMatrix {
  pains: string[];
  pleasures: string[];
}

export interface PsycheMapData {
  brainRegions: BrainRegion[];
  cognitiveProfile: CognitiveProfile;
  dopamine: DopamineArchitecture;
  biases: CognitiveBias[];
  habitLoop: HabitLoop;
  persuasionStack: PersuasionStackLayer[];
  painPleasure: PainPleasureMatrix;
  audiencePosition: { axis: string; insight: string };
}

// --- Sales Playbook ---

export interface ValueEquation {
  dreamOutcome: { score: number; text: string };
  perceivedLikelihood: { score: number; text: string };
  timeDelay: { score: number; text: string };
  effortSacrifice: { score: number; text: string };
}

export interface AwarenessLevel {
  level: number;
  name: string;
  color: string;
  description: string;
  adStrategy: string;
  exampleHook: string;
  bestFor: string;
  relevance: number;
}

export interface CialdiniWeapon {
  name: string;
  icon: string;
  color: string;
  description: string;
  application: string;
  scriptExample: string;
  power: number;
}

export interface StraightLineCertainty {
  product: { score: number; text: string; tactics: string[] };
  seller: { score: number; text: string; tactics: string[] };
  action: { score: number; text: string; tactics: string[] };
}

export interface HSOFramework {
  hooks: string[];
  stories: string[];
  offers: string[];
}

export interface RetargetingStage {
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

export interface ClosingTechnique {
  name: string;
  source: string;
  book: string;
  description: string;
  scriptExample: string;
}

export interface System12Trigger {
  trigger: string;
  description: string;
  tip: string;
}

export interface NLPTechnique {
  id: string;
  name: string;
  color: string;
  power: number;
  definition: string;
  copyExamples: string[];
  adApplication: string;
  productExample: string; // Personalized by Claude for the specific product
}

export interface NLPStackStep {
  step: number;
  technique: string;
  script: string; // Personalized ad script for this step
}

export interface NLPData {
  techniques: NLPTechnique[];
  stackStrategy: NLPStackStep[];
  keyPrinciple: string;
}

export interface SalesPlaybookData {
  valueEquation: ValueEquation;
  awarenessLevels: AwarenessLevel[];
  cialdiniWeapons: CialdiniWeapon[];
  straightLine: StraightLineCertainty;
  hso: HSOFramework;
  retargetingFunnel: RetargetingStage[];
  closingTechniques: ClosingTechnique[];
  system1Triggers: System12Trigger[];
  system2Triggers: System12Trigger[];
  nlp: NLPData;
}

// --- Research ---

export interface ShadowAvatarStep {
  num: number;
  color: string;
  title: string;
  description: string;
}

export interface SearchQuery {
  platform: string;
  query: string;
  why: string;
}

export interface ResearchTechnique {
  name: string;
  color: string;
  description: string;
  steps: string[];
}

export interface AvatarTrait {
  label: string;
  value: string;
}

export interface ResearchData {
  shadowAvatarSteps: ShadowAvatarStep[];
  searchQueries: SearchQuery[];
  researchTechniques: ResearchTechnique[];
  avatarTraits: AvatarTrait[];
  preCreativeChecklist: string[];
}

// --- Copy Check ---

// AI Deep Review result (qualitative — local scoring is in lib/copy-check.ts)
export interface CopyCheckResult {
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

export interface AdCreativeBlueprint {
  rank: number;
  name: string;
  emotion: string;
  platform: string;
  format: string;
  hook: { time: string; text: string; visual: string };
  body: { time: string; text: string; visual: string };
  cta: { time: string; text: string; visual: string };
}

export interface TopCreativesData {
  creatives: AdCreativeBlueprint[];
}

// --- Full Generation Result ---

export interface GenerationResult {
  id: string;
  input: ProjectInput;
  creativeTree: CreativeTreeData;
  psycheMap: PsycheMapData;
  salesPlaybook: SalesPlaybookData;
  research: ResearchData;
  topCreatives: TopCreativesData;
  createdAt: string;
}

// --- Supabase row ---

export interface ProjectRow {
  id: string;
  scenario: ScenarioType;
  product_name: string;
  product_description: string;
  input_data: ProjectInput;
  generation_result: GenerationResult | null;
  status: "pending" | "generating" | "completed" | "failed";
  created_at: string;
  updated_at: string;
}
