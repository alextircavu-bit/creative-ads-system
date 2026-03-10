// ============================================================
// HARDCODED FRAMEWORK DATA — User's IP from the HTML originals
// Claude NEVER decides what frameworks exist or what angles to use.
// Claude ONLY personalizes descriptions/copy within this structure.
// ============================================================

// --- Emotional Angles (20) ---

export interface EmotionalAngleDef {
  id: string;
  name: string;
  mechanism: string;
  color: string;
  condition: RegExp | null; // null = always relevant
}

export const EMOTIONAL_ANGLES: EmotionalAngleDef[] = [
  { id: "guilt_screen", name: "Screen Time Guilt", mechanism: "Cognitive dissonance between time wasted and values", color: "#f43f5e", condition: /scroll|reel|feed|watch|time|doom|phone|screen/i },
  { id: "fomo_community", name: "Community FOMO", mechanism: "Others are connecting and growing while isolated", color: "#ec4899", condition: /comment|community|share|connect|together|other|join/i },
  { id: "identity", name: "Identity Transformation", mechanism: '"I\'m the kind of person who invests in myself"', color: "#a855f7", condition: null },
  { id: "curiosity", name: "Curiosity / Discovery", mechanism: 'Information gap — "what is this?"', color: "#8b5cf6", condition: null },
  { id: "shame_hiding", name: "Shame / Hiding", mechanism: "Carrying something privately that controls behavior", color: "#6366f1", condition: /quiz|struggle|hidden|secret|pattern|break|shame|guilt/i },
  { id: "hope_transform", name: "Hope / Aspiration", mechanism: "Imagine who you become on the other side", color: "#3b82f6", condition: null },
  { id: "relief", name: "Relief / Weight Lifted", mechanism: "Exhaustion from carrying something — finally put it down", color: "#06b6d4", condition: /peace|calm|anxiety|stress|burden|carry|tired|exhaust/i },
  { id: "belonging", name: "Belonging / Not Alone", mechanism: 'Social proof, shared experience, "everyone\'s doing this"', color: "#14b8a6", condition: /community|comment|share|together|join|million|thousand/i },
  { id: "anger_failed", name: "Righteous Anger", mechanism: "Old solutions failed you — apps, willpower, half-measures — this is different", color: "#f59e0b", condition: /fail|wrong|broken|old|instead|frustrat|tried|nothing\s?work/i },
  { id: "fear_loss", name: "Fear of Loss", mechanism: "Every day you don't act, something gets worse or is lost", color: "#ef4444", condition: /lose|miss|worse|damage|hurt|cost|time/i },
  { id: "contrast_replace", name: "Contrast / Replacement", mechanism: "Direct A/B between bad habit and new habit", color: "#22c55e", condition: /instead|replace|scroll|doom|swap|versus|rather/i },
  { id: "nostalgia", name: "Nostalgia / Lost Fire", mechanism: '"Remember when you were motivated? Before the distractions took over."', color: "#a78bfa", condition: /remember|used\sto|before|motivation|drive|closer|grow|momentum|passion/i },
  { id: "social_proof", name: "Social Proof / Bandwagon", mechanism: 'Millions already switched — numbers, momentum, "you\'re late"', color: "#f97316", condition: null },
  { id: "regret_aversion", name: "Regret Aversion", mechanism: '"A year from now you\'ll wish you started today." Future self framing.', color: "#eab308", condition: null },
  { id: "self_frustration", name: "Self-Frustration / Broken Promise", mechanism: '"You keep saying tomorrow. It\'s been months." Failed commitments.', color: "#84cc16", condition: /daily|read|plan|habit|routine|commit|consistent|goal|start/i },
  { id: "surprise_disrupt", name: "Surprise / Pattern Interrupt", mechanism: '"Wait — THIS exists?? Why does it feel so different?"', color: "#10b981", condition: null },
  { id: "moral_authority", name: "Counter-Culture Pride", mechanism: '"Everyone scrolls trash. Not you." Being above the noise.', color: "#64748b", condition: /scroll|replace|instead|different|better|trash|doom|phone/i },
  { id: "micro_commitment", name: "Micro-Commitment / Low Bar", mechanism: '"Just 5 minutes. One try. That\'s it." Remove all friction.', color: "#0ea5e9", condition: /daily|minute|quick|easy|simple|start|day|try|small/i },
  { id: "parental_instinct", name: "Parental / Family Shield", mechanism: '"What\'s on YOUR kid\'s phone? Give them this instead."', color: "#d946ef", condition: /kid|child|family|parent|teen|young|son|daughter/i },
];

/** Filter angles by product text relevance. Always-relevant angles (condition: null) are always included. */
export function filterRelevantAngles(productText: string): EmotionalAngleDef[] {
  return EMOTIONAL_ANGLES.filter((a) => a.condition === null || a.condition.test(productText));
}

// --- Copywriting Frameworks (5) ---

export interface FrameworkDef {
  id: string;
  name: string;
  abbreviation: string;
  color: string;
  steps: string[]; // Labels for each step
}

export const FRAMEWORKS: FrameworkDef[] = [
  { id: "pas", name: "Problem → Agitate → Solve", abbreviation: "PAS", color: "#f43f5e", steps: ["PROBLEM", "AGITATE", "SOLVE", "CTA"] },
  { id: "aida", name: "Attention → Interest → Desire → Action", abbreviation: "AIDA", color: "#3b82f6", steps: ["ATTENTION", "INTEREST", "DESIRE", "ACTION"] },
  { id: "bab", name: "Before → After → Bridge", abbreviation: "BAB", color: "#22c55e", steps: ["BEFORE", "AFTER", "BRIDGE"] },
  { id: "pppp", name: "Problem → Promise → Proof → Push", abbreviation: "4Ps", color: "#f59e0b", steps: ["PROBLEM", "PROMISE", "PROOF", "PUSH"] },
  { id: "star", name: "Situation → Task → Action → Result", abbreviation: "STAR", color: "#8b5cf6", steps: ["SITUATION", "TASK", "ACTION", "RESULT"] },
];

// --- Brain Regions (10) ---

export interface BrainRegionDef {
  id: string;
  name: string;
  x: number;
  y: number;
  r: number;
  role: string;
  color: string;
  condition: RegExp | null;
}

export const BRAIN_REGIONS: BrainRegionDef[] = [
  { id: "pfc", name: "Prefrontal Cortex", x: 125, y: 155, r: 28, role: "Decision & Self-Control", color: "#3b82f6", condition: null },
  { id: "acc", name: "Anterior Cingulate", x: 205, y: 100, r: 22, role: "Guilt & Conflict Detection", color: "#f43f5e", condition: /guilt|conflict|wrong|should|bad|waste|instead|replace|honest|admit/i },
  { id: "nacc", name: "Nucleus Accumbens", x: 180, y: 218, r: 20, role: "Reward & Dopamine", color: "#22c55e", condition: /scroll|reel|feed|reward|free|discover|new|surprise|quiz|fun|game|explore/i },
  { id: "amyg", name: "Amygdala", x: 248, y: 262, r: 22, role: "Fear, Urgency & FOMO", color: "#f59e0b", condition: /fear|lose|miss|urgent|now|limited|last|danger|enemy|war|battle|fomo|hurry|running\s?out/i },
  { id: "hipp", name: "Hippocampus", x: 340, y: 238, r: 24, role: "Memory & Nostalgia", color: "#a78bfa", condition: /remember|used\s?to|before|past|child|young|nostalg|memory|history|ago|once|grew\s?up/i },
  { id: "ins", name: "Insula", x: 260, y: 185, r: 20, role: "Self-Awareness & Disgust", color: "#ec4899", condition: /quiz|discover|honest|aware|self|assess|reflect|who.{0,4}you|truth|reveal|hidden|feel|gut|real/i },
  { id: "tpj", name: "Temporo-Parietal Junction", x: 418, y: 155, r: 26, role: "Social Cognition & Empathy", color: "#8b5cf6", condition: /community|comment|share|social|friend|together|join|people|testimonial|story|million|thousand|review/i },
  { id: "vmpfc", name: "Ventromedial PFC", x: 138, y: 248, r: 20, role: "Value Judgment", color: "#14b8a6", condition: /free|worth|value|price|cost|invest|try|risk|safe|trust|guarantee|cheap|save|money/i },
  { id: "motor", name: "Motor Cortex", x: 278, y: 48, r: 22, role: "Action Execution", color: "#6366f1", condition: null },
  { id: "vis", name: "Visual Cortex", x: 462, y: 118, r: 24, role: "Visual Processing", color: "#06b6d4", condition: null },
];

export const BRAIN_CONNECTIONS: [string, string][] = [
  ["pfc", "acc"], ["acc", "motor"], ["motor", "vis"], ["pfc", "nacc"], ["nacc", "amyg"],
  ["amyg", "hipp"], ["hipp", "tpj"], ["tpj", "vis"], ["ins", "amyg"], ["ins", "acc"],
  ["pfc", "vmpfc"], ["vmpfc", "nacc"], ["nacc", "ins"],
];

export function filterActiveBrainRegions(productText: string): string[] {
  return BRAIN_REGIONS.filter((r) => r.condition === null || r.condition.test(productText)).map((r) => r.id);
}

// --- Cognitive Profiles (9) ---

export interface CognitiveProfileDef {
  id: string;
  name: string;
  mechanism: string;
  difficulty: string;
  conversionPotential: string;
}

export const COGNITIVE_PROFILES: CognitiveProfileDef[] = [
  { id: "habit_replacement", name: "Habit Hijack", mechanism: "Habit Substitution (Duhigg Model)", difficulty: "Low", conversionPotential: "Very High" },
  { id: "self_discovery", name: "Mirror Effect", mechanism: "Barnum Effect + Intrinsic Curiosity Drive", difficulty: "Very Low", conversionPotential: "Extremely High" },
  { id: "passive_exposure", name: "Ambient Integration", mechanism: "Mere Exposure Effect + Default Bias", difficulty: "Extremely Low", conversionPotential: "High" },
  { id: "active_engagement", name: "Investment Escalation", mechanism: "IKEA Effect + Sunk Cost Escalation", difficulty: "Medium", conversionPotential: "Medium" },
  { id: "social_connection", name: "Tribal Gravity", mechanism: "Network Effects + Social Identity Theory", difficulty: "Medium", conversionPotential: "High" },
  { id: "gamification", name: "Variable Reward Engine", mechanism: "Variable Ratio Reinforcement (Skinner)", difficulty: "Low", conversionPotential: "High" },
  { id: "learning", name: "Competence Drive", mechanism: "Self-Determination Theory + Progress Principle", difficulty: "Medium", conversionPotential: "Medium" },
  { id: "wellness", name: "Relief Architecture", mechanism: "Negative Reinforcement + Classical Conditioning", difficulty: "Low", conversionPotential: "Very High" },
  { id: "general", name: "Value Proposition", mechanism: "Expectancy-Value Theory", difficulty: "Medium", conversionPotential: "Medium" },
];

export function detectFeatureTypes(productText: string): string[] {
  const types: string[] = [];
  if (/replace|swap|instead|switch|scroll|feed|doom/i.test(productText)) types.push("habit_replacement");
  if (/quiz|test|discover|assess|score|result|which|what.{0,6}your/i.test(productText)) types.push("self_discovery");
  if (/lock\s?screen|wallpaper|notification|push|auto|passive|always|background/i.test(productText)) types.push("passive_exposure");
  if (/chat|ask|talk|write|create|build|plan|track|read|journal/i.test(productText)) types.push("active_engagement");
  if (/community|comment|share|social|friend|together|join|group/i.test(productText)) types.push("social_connection");
  if (/streak|challenge|reward|point|level|badge|daily|goal/i.test(productText)) types.push("gamification");
  if (/learn|teach|course|lesson|study|practice|skill/i.test(productText)) types.push("learning");
  if (/calm|meditat|relax|sleep|peace|mindful|breath/i.test(productText)) types.push("wellness");
  if (types.length === 0) types.push("general");
  return types;
}

// --- Cognitive Biases (15) ---

export interface CognitiveBiasDef {
  name: string;
  strength: number;
  color: string;
  pattern: RegExp;
}

export const COGNITIVE_BIASES: CognitiveBiasDef[] = [
  { name: "Loss Aversion", strength: 90, color: "#f43f5e", pattern: /lose|losing|miss|missing|without|don't|won't|can't|never|every day without/i },
  { name: "Curiosity Gap", strength: 88, color: "#ec4899", pattern: /wait|secret|discover|reveal|find out|did you know|what if|how|why|this is|guess what/i },
  { name: "Framing Effect", strength: 87, color: "#a855f7", pattern: /instead of|not .* but|same .* different|think of it as|it's not .* it's/i },
  { name: "Anchoring", strength: 85, color: "#06b6d4", pattern: /\d+\s*(hours?|minutes?|%|x|times)|\$\d|was \$.*now \$|compare|versus|vs/i },
  { name: "Social Proof", strength: 85, color: "#f59e0b", pattern: /million|thousand|people|everyone|joined|community|trending|popular|\d+\s*(users|people|downloads|reviews)/i },
  { name: "Confirmation Bias", strength: 83, color: "#10b981", pattern: /identity|believ|communit|value|lifestyle|type|kind|who you|are you|be the|self|person/i },
  { name: "Default Effect", strength: 82, color: "#14b8a6", pattern: /lock\s?screen|auto|default|always|every\s?time|background|notif/i },
  { name: "Bandwagon Effect", strength: 80, color: "#f97316", pattern: /everyone|trending|viral|movement|wave|join|switch|people are|millions are/i },
  { name: "Hyperbolic Discounting", strength: 79, color: "#eab308", pattern: /instant|now|today|quick|fast|immediate|minute|second|real.?time|auto|first|right away/i },
  { name: "Endowment Effect", strength: 76, color: "#84cc16", pattern: /free|trial|try|yours|your|keep|personal|custom|plan|result|my\b/i },
  { name: "Status Quo Bias", strength: 75, color: "#3b82f6", pattern: /replace|switch|change|instead|new|swap/i },
  { name: "Authority Bias", strength: 74, color: "#64748b", pattern: /expert|doctor|study|research|proven|science|certified|coach|trainer|professional|clinical|evidence|based/i },
  { name: "Commitment Escalation", strength: 72, color: "#6366f1", pattern: /daily|habit|routine|plan|day|commit|challenge|streak/i },
  { name: "IKEA Effect", strength: 70, color: "#22c55e", pattern: /custom|personal|create|quiz|your|plan|build|choose/i },
  { name: "Scarcity", strength: 68, color: "#f43f5e", pattern: /limited|exclusive|only|last|ends|hurry|running out|spots|left|this week|today only/i },
];

export function detectBiases(text: string): { name: string; strength: number; color: string }[] {
  return COGNITIVE_BIASES.filter((b) => b.pattern.test(text)).map(({ name, strength, color }) => ({ name, strength, color }));
}

// --- Dopamine Architecture ---

export interface DopamineTypeDef {
  trigger: string;
  schedule: string;
  anticipation: string;
  retention: string;
  triggerPct: number;
  schedulePct: number;
  retentionPct: number;
}

export const DOPAMINE_TYPES: Record<string, DopamineTypeDef> = {
  habit_replacement: { trigger: "Novelty + Familiarity Paradox", schedule: "Variable Ratio", anticipation: 'Each scroll could be "the one" that hits', retention: "Content refresh cycle", triggerPct: 85, schedulePct: 90, retentionPct: 70 },
  self_discovery: { trigger: "Self-Relevance Detection", schedule: "Fixed Ratio", anticipation: '"What will my result be?"', retention: "Shareability + identity anchoring", triggerPct: 95, schedulePct: 60, retentionPct: 45 },
  passive_exposure: { trigger: "Environmental Cue", schedule: "Fixed Interval", anticipation: '"What\'s there now?"', retention: "Zero-effort habit loop", triggerPct: 70, schedulePct: 50, retentionPct: 95 },
  active_engagement: { trigger: "Question → Answer Curiosity", schedule: "Variable Ratio", anticipation: '"Will this answer satisfy me?"', retention: "Conversation history = investment", triggerPct: 75, schedulePct: 70, retentionPct: 80 },
  social_connection: { trigger: "Social Validation Need", schedule: "Variable Ratio", anticipation: '"Did anyone respond?"', retention: "Social bonds + identity", triggerPct: 85, schedulePct: 95, retentionPct: 90 },
  gamification: { trigger: "Progress + Competition", schedule: "Variable Ratio", anticipation: '"What do I unlock next?"', retention: "Streak loss aversion", triggerPct: 80, schedulePct: 95, retentionPct: 85 },
  general: { trigger: "Value Expectation", schedule: "Variable", anticipation: "Anticipated benefit", retention: "Perceived value", triggerPct: 65, schedulePct: 60, retentionPct: 55 },
};

// --- Habit Loop Templates ---

export interface HabitLoopDef {
  cue: string;
  routine: string;
  reward: string;
}

export const HABIT_LOOPS: Record<string, HabitLoopDef> = {
  "lock screen": { cue: "Pick up phone (50-96x/day)", routine: "See content on lock screen", reward: "Micro-moment of value + peace" },
  reel: { cue: "Boredom + phone pickup", routine: "Open app, scroll feed", reward: "Discovery + community + dopamine" },
  quiz: { cue: "Curiosity about self", routine: "Take quiz/assessment", reward: "Self-knowledge + personalized plan" },
  chat: { cue: "Question or doubt arises", routine: "Ask/chat with app", reward: "Clarity + relevant answers" },
  default: { cue: "Daily trigger (boredom, habit, notification)", routine: "Engage with app/product", reward: "Value delivery + positive feeling" },
};

// --- Hormozi Value Equation Scoring ---

export function computeValueEquation(productText: string): { dream: number; likelihood: number; time: number; effort: number } {
  const dream = /transform|change|life|heal|grow|peace|closer|better|improve/i.test(productText) ? 90
    : /discover|learn|find|reveal|know|understand/i.test(productText) ? 75 : 65;
  const likelihood = /proven|study|research|data|testimonial|million|thousand/i.test(productText) ? 85
    : /believe|trust|authentic/i.test(productText) ? 75 : 65;
  const time = /instant|immediate|first|day one/i.test(productText) ? 90
    : /daily|minute|quick|easy|fast/i.test(productText) ? 80 : 60;
  const effort = /free|no.*sign|no.*cost|no.*effort|auto|passive|set.*forget/i.test(productText) ? 95
    : /scroll|swipe|browse|tap|simple|easy/i.test(productText) ? 80 : 55;
  return { dream, likelihood, time, effort };
}

// --- Schwartz 5 Awareness Levels ---

export interface AwarenessLevelDef {
  level: number;
  name: string;
  color: string;
  strategy: string;
}

export const AWARENESS_LEVELS: AwarenessLevelDef[] = [
  { level: 1, name: "Unaware", color: "#ef4444", strategy: "Pattern interrupts and shocking stats. Make the invisible problem visible." },
  { level: 2, name: "Problem Aware", color: "#f59e0b", strategy: "Agitate the problem further. Show the cost of status quo." },
  { level: 3, name: "Solution Aware", color: "#eab308", strategy: "Differentiate. Show what makes your solution categorically different." },
  { level: 4, name: "Product Aware", color: "#22c55e", strategy: "Overcome objections. Add urgency. Stack social proof. Show the experience." },
  { level: 5, name: "Most Aware", color: "#3b82f6", strategy: "Simple CTA. Price incentive. The ad can be short because they're already sold." },
];

// --- Cialdini 6 Weapons ---

export interface CialdiniWeaponDef {
  name: string;
  icon: string;
  pattern: RegExp;
  basePower: number;
  matchPower: number;
}

export const CIALDINI_WEAPONS: CialdiniWeaponDef[] = [
  { name: "Reciprocity", icon: "🎁", pattern: /free|give|gift|value|share|help|tip|teach/i, basePower: 70, matchPower: 90 },
  { name: "Commitment & Consistency", icon: "🔗", pattern: /daily|habit|routine|streak|commit|challenge|goal/i, basePower: 65, matchPower: 92 },
  { name: "Social Proof", icon: "👥", pattern: /community|comment|share|million|review|popular|trending/i, basePower: 80, matchPower: 95 },
  { name: "Authority", icon: "👑", pattern: /expert|pastor|doctor|research|science|proven|official/i, basePower: 60, matchPower: 88 },
  { name: "Liking", icon: "❤️", pattern: /community|share|ugc|personal|authentic|real|relate/i, basePower: 72, matchPower: 85 },
  { name: "Scarcity", icon: "⏳", pattern: /limited|exclusive|trial|offer|deal|special|free|ends|only/i, basePower: 55, matchPower: 88 },
];

export function scoreCialdiniWeapons(productText: string): { name: string; icon: string; power: number }[] {
  return CIALDINI_WEAPONS.map((w) => ({
    name: w.name,
    icon: w.icon,
    power: w.pattern.test(productText) ? w.matchPower : w.basePower,
  }));
}

// --- Belfort Straight Line ---

export function computeStraightLine(productText: string): { product: number; seller: number; action: number } {
  const product = /free|proven|million|download|rated|review/i.test(productText) ? 85 : 60;
  const seller = 70;
  const action = /free|no.*card|instant|easy|quick|simple|one.*tap/i.test(productText) ? 90 : 55;
  return { product, seller, action };
}

// --- Neural Persuasion Stack (Kahneman System 1/2) ---

export interface PersuasionStackLayerDef {
  num: number;
  name: string;
  timeRange: string;
  color: string;
  techniques: string[];
}

export const PERSUASION_STACK: PersuasionStackLayerDef[] = [
  { num: 1, name: "Attention Capture", timeRange: "0–3 seconds", color: "#f43f5e", techniques: ["Pattern interrupt", "Curiosity gap", "Bold claim", "Unexpected visual", "Trending audio"] },
  { num: 2, name: "Emotional Engagement", timeRange: "3–10 seconds", color: "#f59e0b", techniques: ["Guilt hook", "Nostalgia trigger", "Fear of loss", "Identity challenge", "Divine framing"] },
  { num: 3, name: "Rational Justification", timeRange: "10–20 seconds", color: "#3b82f6", techniques: ["Social proof numbers", "Feature showcase", "Price anchoring", "Testimonial", "Risk reversal"] },
  { num: 4, name: "Behavioral Trigger", timeRange: "20–30 seconds", color: "#22c55e", techniques: ["Clear CTA", "Urgency layer", "Friction removal", '"Free" emphasis', "One-tap action"] },
  { num: 5, name: "Habit Formation", timeRange: "Day 1–30", color: "#8b5cf6", techniques: ["Immediate value", "Onboarding reward", "Streak initiation", "Push notification loop", "Social discovery"] },
];

// --- Retargeting Funnel ---

export interface RetargetingFunnelDef {
  stage: string;
  emoji: string;
  frequency: string;
  emotions: string[];
  biases: string[];
  format: string;
}

export const RETARGETING_FUNNEL: RetargetingFunnelDef[] = [
  { stage: "Cold — Never Seen", emoji: "❄️", frequency: "1-2x / week", emotions: ["Curiosity", "Surprise", "Screen Guilt", "FOMO"], biases: ["Curiosity Gap", "Social Proof", "Framing Effect"], format: "UGC/POV reactions, shocking stats" },
  { stage: "Warm — Engaged but Didn't Convert", emoji: "🔥", frequency: "3-5x / week", emotions: ["Identity", "Social/Tribe", "Nostalgia", "Anger at Failed Solutions"], biases: ["Bandwagon", "Confirmation Bias", "Anchoring"], format: "Testimonials, before/after, case studies" },
  { stage: "Hot — Almost Converted", emoji: "💥", frequency: "Daily x 7 days", emotions: ["Urgency", "Micro-Commitment", "Self-Frustration", "Relief"], biases: ["Loss Aversion", "Scarcity", "Endowment", "Hyperbolic Discounting"], format: "Direct CTA, limited-time offers" },
];

// --- Platform Formats ---

export interface PlatformFormatDef {
  platform: string;
  formats: string[];
}

export const PLATFORM_FORMATS: PlatformFormatDef[] = [
  { platform: "TikTok", formats: ["Trending Sound", "POV:", "UGC Reaction", "Split Screen", "Green Screen", "Stitch/Duet", '"I\'m bored" Text', "Day-in-my-life"] },
  { platform: "Meta/IG", formats: ["Carousel", "Reel (UGC)", "Static + Copy", "Before/After", "Testimonial Quote", "Video Slideshow"] },
  { platform: "YouTube", formats: ["Pre-roll (6s)", "Pre-roll (15s)", "Shorts", "Creator Integration"] },
  { platform: "Snapchat", formats: ["Snap Ad (10s)", "Collection Ad", "Story Ad", "AR Lens"] },
];

// --- Research Methodology ---

export interface ResearchTechniqueDef {
  name: string;
  color: string;
  description: string;
}

export const RESEARCH_TECHNIQUES: ResearchTechniqueDef[] = [
  { name: "Shadow Scrolling", color: "#f43f5e", description: "Create burner account, follow target audience, calibrate 2-3 days, scroll pre-session to absorb their world" },
  { name: "Competitor Ad Library Audit", color: "#3b82f6", description: "Meta Ad Library, TikTok Creative Center — analyze longest-running ads to find proven patterns" },
  { name: "Reddit Thread Deep Dive", color: "#f59e0b", description: "Comment mining, pain point extraction, copy their exact language verbatim" },
  { name: "Platform-Specific Search", color: "#22c55e", description: "TikTok search, Facebook Groups, Instagram hashtags, YouTube long-form — find where the audience talks" },
  { name: "The 2AM Test", color: "#8b5cf6", description: "Become the avatar. What keeps them up at 2AM? What do they search when nobody's watching?" },
];

// --- Shadow Avatar Steps ---

export interface ShadowAvatarStepDef {
  num: number;
  color: string;
  title: string;
}

export const SHADOW_AVATAR_STEPS: ShadowAvatarStepDef[] = [
  { num: 1, color: "#f43f5e", title: "Become the Avatar" },
  { num: 2, color: "#f59e0b", title: "Map Their Daily Triggers" },
  { num: 3, color: "#3b82f6", title: "Find Their Pain Language" },
  { num: 4, color: "#22c55e", title: "Discover Their Dream State" },
  { num: 5, color: "#8b5cf6", title: "Build the Emotional Bridge" },
];

// --- Avatar Traits ---

export const AVATAR_TRAIT_LABELS = [
  "Age Range",
  "Mindset",
  "Daily Habit",
  "Secret Fear",
  "What They Follow",
  "Purchase Trigger",
] as const;

// --- Pain/Pleasure Keyword Mapping ---

export interface PainPleasureMapping {
  condition: RegExp;
  pains: string[];
  pleasures: string[];
}

export const PAIN_PLEASURE_MAPPINGS: PainPleasureMapping[] = [
  {
    condition: /scroll|doom|feed|phone|screen/i,
    pains: ["Hours lost to meaningless content", "Post-scroll guilt and emptiness", "Feeling controlled by the algorithm"],
    pleasures: ["Guilt-free screen time", "Every scroll delivers real value", "Phone becomes a tool, not a trap"],
  },
  {
    condition: /community|share|alone/i,
    pains: ["Digital isolation despite constant connection", "Feed full of strangers and outrage", "No space for authentic interaction"],
    pleasures: ["Genuine belonging with like-minded people", "Comments that feel like real conversations", "Shared experiences that matter"],
  },
  {
    condition: /sin|struggle|hidden|shame|quiz/i,
    pains: ["Carrying unspoken burdens", "Using phone as numbing agent", "No safe place for self-honesty"],
    pleasures: ["Private, safe self-discovery", "Actionable personal insights", "Breaking cycles with awareness"],
  },
  {
    condition: /learn|teach|skill/i,
    pains: ["Stagnation and wasted potential", "Information overload without direction", "Starting and never finishing"],
    pleasures: ["Tangible skill growth", "Structured progress with clear milestones", "Confidence from competence"],
  },
  {
    condition: /calm|meditat|relax|sleep|peace|mindful|breath|health|fitness|weight|diet/i,
    pains: ["Chronic stress and burnout", "Failed attempts at self-care", "Knowing what to do but not doing it"],
    pleasures: ["Effortless daily wellness", "Feeling in control of your body/mind", "Sustainable habits that stick"],
  },
];

export function matchPainPleasure(productText: string): { pains: string[]; pleasures: string[] } {
  const pains: string[] = [];
  const pleasures: string[] = [];
  let matched = false;
  for (const mapping of PAIN_PLEASURE_MAPPINGS) {
    if (mapping.condition.test(productText)) {
      pains.push(...mapping.pains);
      pleasures.push(...mapping.pleasures);
      matched = true;
    }
  }
  if (!matched) {
    pains.push("Current solutions feel incomplete", "Wasting time on things that don't work", "Frustration with the status quo");
    pleasures.push("A solution that actually delivers", "Time and energy saved", "Confidence in the right choice");
  }
  return { pains: [...new Set(pains)].slice(0, 5), pleasures: [...new Set(pleasures)].slice(0, 5) };
}

// --- Neuro-Linguistic Programming (NLP) Techniques (5) ---

export interface NLPTechniqueDef {
  id: string;
  name: string;
  color: string;
  power: number;
  definition: string;
  copyExamples: string[];
  adApplication: string;
}

export const NLP_TECHNIQUES: NLPTechniqueDef[] = [
  {
    id: "presupposition",
    name: "Presupposition Loading",
    color: "#f43f5e",
    power: 92,
    definition: "Embed conclusions inside questions and statements so the brain accepts them without critical evaluation. The reader processes the embedded assumption as fact while answering the surface question. This bypasses the rational gatekeeper entirely.",
    copyExamples: [
      '"Isn\'t it amazing how [product] changed your daily routine?" — presupposes it\'s amazing AND that it changed their routine',
      '"When did you realize [product] was what you needed?" — presupposes they already realized it',
    ],
    adApplication: '"Ready to see why [product] is replacing [competitor]?" — the reader evaluates "ready" while unconsciously accepting that it IS replacing the competitor.',
  },
  {
    id: "reframing",
    name: "Reframing (Meaning Shift)",
    color: "#f59e0b",
    power: 95,
    definition: 'Take the same event, behavior, or sensation and change what it MEANS. The physical reality stays identical — the emotional response flips completely. This is the core NLP move: control the frame, control the feeling. Allen Carr reframes withdrawal pangs from "suffering" to "the dying gasps of the nicotine monster."',
    copyExamples: [
      'Don\'t say "spend money on [product]" — say "invest in yourself with [product]."',
      'Don\'t say "give up your old routine" — say "escape the trap you\'ve been stuck in." Same action, opposite emotion.',
    ],
    adApplication: "Reframe the cost as freedom. Reframe effort as escape. Reframe change as returning to who you really are. \"[Product] doesn't add something new — it removes what's been holding you back.\"",
  },
  {
    id: "dissociation",
    name: "Dissociation (Third-Person Repositioning)",
    color: "#8b5cf6",
    power: 88,
    definition: "Make the reader observe their OWN behavior from the outside, as if watching a stranger. This breaks the first-person emotional attachment to the current habit or product. From the inside, a habit feels normal. From the outside, it looks absurd. Carr makes smokers watch themselves standing in the rain inhaling poison — suddenly the spell breaks.",
    copyExamples: [
      '"Picture someone paying $X/month for [old solution] and getting [poor result]. That someone is you." Force the third-person view, then snap back to first-person.',
    ],
    adApplication: '"Watch someone scroll for 3 hours and call it relaxing. Watch someone pay twice the price for half the result. Now ask yourself — is that you?" The absurdity only becomes visible from outside the frame.',
  },
  {
    id: "anchoring_stacking",
    name: "Anchoring & Stacking",
    color: "#22c55e",
    power: 90,
    definition: 'Systematically anchor positive emotional words (freedom, escape, joy, relief, control) to your product, and negative emotional words (trap, prison, waste, drain, stuck) to the alternative/status quo. Through repetition, these anchors become automatic — when the reader thinks of your product their brain fires "freedom" before they can think critically.',
    copyExamples: [
      'Every mention of the old way: "trapped, draining, stuck, wasting."',
      'Every mention of [product]: "free, effortless, finally, control." Never mix polarity.',
    ],
    adApplication: 'In a 30s ad, anchor "stuck/trapped/waste" to the first 10s (problem), then anchor "free/easy/finally" to the last 20s ([product]). The emotional contrast does the selling.',
  },
  {
    id: "pattern_interrupt_nested",
    name: "Pattern Interrupt + Nested Loops",
    color: "#06b6d4",
    power: 86,
    definition: "Break the reader's expected thought pattern so their brain shifts from autopilot to active processing. Then open an idea loop (pose a question, start a story) without closing it — the Zeigarnik Effect means the brain holds unfinished thoughts open, making the reader more receptive to everything between the open and close. Carr opens concepts in chapter 3 and doesn't resolve them until chapter 12.",
    copyExamples: [
      '"What I\'m about to tell you about [product] will change how you see [category] forever. But first…" — the loop is open. Everything after this gets heightened attention because the brain needs closure.',
    ],
    adApplication: 'Hook: Open the loop ("There\'s something about [product] nobody\'s talking about.") → Body: Interrupt with social proof, benefits, reframes → CTA: Close the loop ("Download to find out.") The unresolved tension drives the click.',
  },
];

export const NLP_POSITIVE_ANCHORS = ["freedom", "escape", "joy", "relief", "control"];
export const NLP_NEGATIVE_ANCHORS = ["trap", "prison", "waste", "drain", "stuck"];

export interface NLPStackStrategyDef {
  step: number;
  technique: string;
  instruction: string;
}

export const NLP_STACK_STRATEGY: NLPStackStrategyDef[] = [
  { step: 1, technique: "Presupposition", instruction: 'Open with a presupposition: "Ready to see why people are switching?"' },
  { step: 2, technique: "Reframing", instruction: 'Hit with a reframe: "You\'re not spending — you\'re escaping"' },
  { step: 3, technique: "Dissociation", instruction: 'Use dissociation to make the old way look absurd: "Watch someone do X and call it normal"' },
  { step: 4, technique: "Anchoring", instruction: "Anchor [product] to freedom/relief language throughout" },
  { step: 5, technique: "Nested Loop", instruction: "Leave one nested loop unresolved until the CTA forces the click to close it" },
];

export const NLP_KEY_PRINCIPLE = "NLP doesn't use willpower. It dismantles the belief system that makes the old behavior feel rational. By the time the reader reaches your CTA, they don't need convincing — they've already changed their mind.";
