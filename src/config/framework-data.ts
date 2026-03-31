// ============================================================
// HARDCODED FRAMEWORK DATA - User's IP from the HTML originals
// This is the STRUCTURE — what to analyze, what categories exist.
// Claude decides all SCORES and RELEVANCE per product.
// ============================================================

// --- Psychological Territories (8) ---

export interface IEmotionalAngleDef {
  id: string;
  name: string;
  mechanism: string;
  color: string;
}

// Broad psychological spaces that fragment into many specific angles.
// Claude scores relevance per product.
export const EMOTIONAL_ANGLES: EmotionalAngleDef[] = [
  { id: "identity_tension", name: "Identity Tension", mechanism: "Gap between who you are and who you want to be. The discomfort of not living up to your own standards.", color: "#f43f5e" },
  { id: "displacement", name: "Displacement Anxiety", mechanism: "Something valuable in your life is being consumed by the wrong thing. Time, attention, energy going to waste.", color: "#ec4899" },
  { id: "loss_decay", name: "Loss & Decay", mechanism: "Something good is slipping away — motivation, connection, health, identity — and you can feel it happening.", color: "#a855f7" },
  { id: "social_positioning", name: "Social Positioning", mechanism: "Where you stand relative to others. Being behind, being different, being part of something, or being left out.", color: "#3b82f6" },
  { id: "aspiration_gap", name: "Aspiration Gap", mechanism: "The life you imagine vs the life you have. The person you could be vs the person you are right now.", color: "#06b6d4" },
  { id: "habit_architecture", name: "Habit Architecture", mechanism: "The invisible systems running your daily behavior. Replacing bad loops with good ones. Friction, triggers, rewards.", color: "#22c55e" },
  { id: "discovery_revelation", name: "Discovery & Revelation", mechanism: "Uncovering something hidden about yourself, your patterns, or your potential. The pull of self-knowledge.", color: "#f59e0b" },
  { id: "relief_surrender", name: "Relief & Surrender", mechanism: "Exhaustion from carrying something — finally being able to put it down. The appeal of effortlessness.", color: "#14b8a6" },
  { id: "humor_absurdity", name: "Humor & Absurdity", mechanism: "Comedy as a scroll-stopper. Memes, exaggeration, self-deprecation, brand humor, absurd visuals. The viewer laughs first, then learns about the product.", color: "#fbbf24" },
  { id: "pride_flex", name: "Pride & Flex", mechanism: "Look what happened. Look what I did. Showing off a result, a transformation, a win. The viewer wants that same feeling of accomplishment or possession.", color: "#f97316" },
  { id: "craving_desire", name: "Craving & Desire", mechanism: "Raw want. Not an aspiration gap — just pure desire for a thing, an experience, a sensation. Food, luxury, pleasure, satisfaction. The product IS the craving.", color: "#ef4444" },
  { id: "anger_injustice", name: "Anger & Injustice", mechanism: "Righteous anger. Something is unfair, overpriced, broken, or a scam. The viewer is being ripped off and this product fixes it. The most shareable emotion on social.", color: "#dc2626" },
  { id: "nostalgia", name: "Nostalgia", mechanism: "Bittersweet ache for the past. Not loss — warmth. Remembering who you used to be, what things used to feel like. The product reconnects you to that feeling.", color: "#d946ef" },
  { id: "excitement_hype", name: "Excitement & Hype", mechanism: "Pure high energy. Something amazing just happened or is about to happen. Urgency, buzz, can't-contain-it energy. The product is the source of the excitement.", color: "#10b981" },
  { id: "belonging_tribe", name: "Belonging & Tribe", mechanism: "I found my people. Not comparison or status — the warm feeling of being part of something. Community, shared identity, insider knowledge. The product connects you to your group.", color: "#6366f1" },
];

// --- Copywriting Frameworks (5) ---

export interface IFrameworkDef {
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

export interface IBrainRegionDef {
  id: string;
  name: string;
  x: number;
  y: number;
  r: number;
  role: string;
  color: string;
}

export const BRAIN_REGIONS: BrainRegionDef[] = [
  { id: "pfc", name: "Prefrontal Cortex", x: 125, y: 155, r: 28, role: "Decision & Self-Control", color: "#3b82f6" },
  { id: "acc", name: "Anterior Cingulate", x: 205, y: 100, r: 22, role: "Guilt & Conflict Detection", color: "#f43f5e" },
  { id: "nacc", name: "Nucleus Accumbens", x: 180, y: 218, r: 20, role: "Reward & Dopamine", color: "#22c55e" },
  { id: "amyg", name: "Amygdala", x: 248, y: 262, r: 22, role: "Fear, Urgency & FOMO", color: "#f59e0b" },
  { id: "hipp", name: "Hippocampus", x: 340, y: 238, r: 24, role: "Memory & Nostalgia", color: "#a78bfa" },
  { id: "ins", name: "Insula", x: 260, y: 185, r: 20, role: "Self-Awareness & Disgust", color: "#ec4899" },
  { id: "tpj", name: "Temporo-Parietal Junction", x: 418, y: 155, r: 26, role: "Social Cognition & Empathy", color: "#8b5cf6" },
  { id: "vmpfc", name: "Ventromedial PFC", x: 138, y: 248, r: 20, role: "Value Judgment", color: "#14b8a6" },
  { id: "motor", name: "Motor Cortex", x: 278, y: 48, r: 22, role: "Action Execution", color: "#6366f1" },
  { id: "vis", name: "Visual Cortex", x: 462, y: 118, r: 24, role: "Visual Processing", color: "#06b6d4" },
];

export const BRAIN_CONNECTIONS: [string, string][] = [
  ["pfc", "acc"], ["acc", "motor"], ["motor", "vis"], ["pfc", "nacc"], ["nacc", "amyg"],
  ["amyg", "hipp"], ["hipp", "tpj"], ["tpj", "vis"], ["ins", "amyg"], ["ins", "acc"],
  ["pfc", "vmpfc"], ["vmpfc", "nacc"], ["nacc", "ins"],
];

// --- Cognitive Profiles (9) ---

export interface ICognitiveProfileDef {
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

// --- Cognitive Biases (15) ---

export interface ICognitiveBiasDef {
  name: string;
  color: string;
}

export const COGNITIVE_BIASES: CognitiveBiasDef[] = [
  { name: "Loss Aversion", color: "#f43f5e" },
  { name: "Curiosity Gap", color: "#ec4899" },
  { name: "Framing Effect", color: "#a855f7" },
  { name: "Anchoring", color: "#06b6d4" },
  { name: "Social Proof", color: "#f59e0b" },
  { name: "Confirmation Bias", color: "#10b981" },
  { name: "Default Effect", color: "#14b8a6" },
  { name: "Bandwagon Effect", color: "#f97316" },
  { name: "Hyperbolic Discounting", color: "#eab308" },
  { name: "Endowment Effect", color: "#84cc16" },
  { name: "Status Quo Bias", color: "#3b82f6" },
  { name: "Authority Bias", color: "#64748b" },
  { name: "Commitment Escalation", color: "#6366f1" },
  { name: "IKEA Effect", color: "#22c55e" },
  { name: "Scarcity", color: "#f43f5e" },
];

// --- Dopamine Architecture ---

export interface IDopamineTypeDef {
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

export interface IHabitLoopDef {
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

// --- Schwartz 5 Awareness Levels ---

export interface IAwarenessLevelDef {
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

export interface ICialdiniWeaponDef {
  name: string;
  icon: string;
}

export const CIALDINI_WEAPONS: CialdiniWeaponDef[] = [
  { name: "Reciprocity", icon: "🎁" },
  { name: "Commitment & Consistency", icon: "🔗" },
  { name: "Social Proof", icon: "👥" },
  { name: "Authority", icon: "👑" },
  { name: "Liking", icon: "❤️" },
  { name: "Scarcity", icon: "⏳" },
];

// --- Neural Persuasion Stack (Kahneman System 1/2) ---

export interface IPersuasionStackLayerDef {
  num: number;
  name: string;
  timeRange: string;
  color: string;
  techniques: string[];
}

export const PERSUASION_STACK: PersuasionStackLayerDef[] = [
  { num: 1, name: "Attention Capture", timeRange: "0–3 seconds", color: "#f43f5e", techniques: ["Pattern interrupt", "Curiosity gap", "Unexpected claim", "Visual disruption", "Audio hook"] },
  { num: 2, name: "Emotional Engagement", timeRange: "3–10 seconds", color: "#f59e0b", techniques: ["Core emotion trigger", "Identity challenge", "Nostalgia / memory", "Loss framing", "Aspiration pull"] },
  { num: 3, name: "Rational Justification", timeRange: "10–20 seconds", color: "#3b82f6", techniques: ["Social proof", "Feature demonstration", "Value comparison", "Testimonial evidence", "Risk reversal"] },
  { num: 4, name: "Behavioral Trigger", timeRange: "20–30 seconds", color: "#22c55e", techniques: ["Clear CTA", "Urgency layer", "Friction removal", "Free emphasis", "One-tap action"] },
  { num: 5, name: "Habit Formation", timeRange: "Day 1–30", color: "#8b5cf6", techniques: ["Immediate value delivery", "Onboarding reward", "Routine initiation", "Re-engagement loop", "Social discovery"] },
];

// --- Retargeting Funnel ---

export interface IRetargetingFunnelDef {
  stage: string;
  emoji: string;
  frequency: string;
  emotions: string[];
  biases: string[];
  format: string;
}

export const RETARGETING_FUNNEL: RetargetingFunnelDef[] = [
  { stage: "Cold - Never Seen", emoji: "❄️", frequency: "1-2x / week", emotions: ["Curiosity", "Surprise", "Screen Guilt", "FOMO"], biases: ["Curiosity Gap", "Social Proof", "Framing Effect"], format: "UGC/POV reactions, shocking stats" },
  { stage: "Warm - Engaged but Didn't Convert", emoji: "🔥", frequency: "3-5x / week", emotions: ["Identity", "Social/Tribe", "Nostalgia", "Anger at Failed Solutions"], biases: ["Bandwagon", "Confirmation Bias", "Anchoring"], format: "Testimonials, before/after, case studies" },
  { stage: "Hot - Almost Converted", emoji: "💥", frequency: "Daily x 7 days", emotions: ["Urgency", "Micro-Commitment", "Self-Frustration", "Relief"], biases: ["Loss Aversion", "Scarcity", "Endowment", "Hyperbolic Discounting"], format: "Direct CTA, limited-time offers" },
];

// --- Platforms (format recommendations are AI-generated per product) ---

export const PLATFORMS = ["TikTok", "Meta/IG", "YouTube", "Snapchat"] as const;

// --- Research Methodology ---

export interface IResearchTechniqueDef {
  name: string;
  color: string;
  description: string;
}

export const RESEARCH_TECHNIQUES: ResearchTechniqueDef[] = [
  { name: "Shadow Scrolling", color: "#f43f5e", description: "Create burner account, follow target audience, calibrate 2-3 days, scroll pre-session to absorb their world" },
  { name: "Competitor Ad Library Audit", color: "#3b82f6", description: "Meta Ad Library, TikTok Creative Center - analyze longest-running ads to find proven patterns" },
  { name: "Reddit Thread Deep Dive", color: "#f59e0b", description: "Comment mining, pain point extraction, copy their exact language verbatim" },
  { name: "Platform-Specific Search", color: "#22c55e", description: "TikTok search, Facebook Groups, Instagram hashtags, YouTube long-form - find where the audience talks" },
  { name: "The Scroll-Stop State", color: "#8b5cf6", description: "Understand the emotional state your target audience is in when scrolling. Not a specific time of day — the emotional temperature when they encounter your ad. Bored? Anxious? Curious? Procrastinating? That state determines which hook energy works." },
];

// --- Shadow Avatar Steps ---

export interface IShadowAvatarStepDef {
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

// --- Pain/Pleasure Reference Categories ---

export interface IPainPleasureMapping {
  category: string;
  pains: string[];
  pleasures: string[];
}

export const PAIN_PLEASURE_MAPPINGS: PainPleasureMapping[] = [
  {
    category: "Screen Time & Digital Consumption",
    pains: ["Hours lost to meaningless content", "Post-scroll guilt and emptiness", "Feeling controlled by the algorithm"],
    pleasures: ["Guilt-free screen time", "Every scroll delivers real value", "Phone becomes a tool, not a trap"],
  },
  {
    category: "Community & Social Connection",
    pains: ["Digital isolation despite constant connection", "Feed full of strangers and outrage", "No space for authentic interaction"],
    pleasures: ["Genuine belonging with like-minded people", "Comments that feel like real conversations", "Shared experiences that matter"],
  },
  {
    category: "Shame, Struggle & Self-Discovery",
    pains: ["Carrying unspoken burdens", "Using phone as numbing agent", "No safe place for self-honesty"],
    pleasures: ["Private, safe self-discovery", "Actionable personal insights", "Breaking cycles with awareness"],
  },
  {
    category: "Learning & Skill Development",
    pains: ["Stagnation and wasted potential", "Information overload without direction", "Starting and never finishing"],
    pleasures: ["Tangible skill growth", "Structured progress with clear milestones", "Confidence from competence"],
  },
  {
    category: "Wellness, Health & Mindfulness",
    pains: ["Chronic stress and burnout", "Failed attempts at self-care", "Knowing what to do but not doing it"],
    pleasures: ["Effortless daily wellness", "Feeling in control of your body/mind", "Sustainable habits that stick"],
  },
];

// --- Neuro-Linguistic Programming (NLP) Techniques (5) ---

export interface INLPTechniqueDef {
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
      '"Isn\'t it amazing how [product] changed your daily routine?" - presupposes it\'s amazing AND that it changed their routine',
      '"When did you realize [product] was what you needed?" - presupposes they already realized it',
    ],
    adApplication: '"Ready to see why [product] is replacing [competitor]?" - the reader evaluates "ready" while unconsciously accepting that it IS replacing the competitor.',
  },
  {
    id: "reframing",
    name: "Reframing (Meaning Shift)",
    color: "#f59e0b",
    power: 95,
    definition: 'Take the same event, behavior, or sensation and change what it MEANS. The physical reality stays identical - the emotional response flips completely. This is the core NLP move: control the frame, control the feeling. Allen Carr reframes withdrawal pangs from "suffering" to "the dying gasps of the nicotine monster."',
    copyExamples: [
      'Don\'t say "spend money on [product]" - say "invest in yourself with [product]."',
      'Don\'t say "give up your old routine" - say "escape the trap you\'ve been stuck in." Same action, opposite emotion.',
    ],
    adApplication: "Reframe the cost as freedom. Reframe effort as escape. Reframe change as returning to who you really are. \"[Product] doesn't add something new - it removes what's been holding you back.\"",
  },
  {
    id: "dissociation",
    name: "Dissociation (Third-Person Repositioning)",
    color: "#8b5cf6",
    power: 88,
    definition: "Make the reader observe their OWN behavior from the outside, as if watching a stranger. This breaks the first-person emotional attachment to the current habit or product. From the inside, a habit feels normal. From the outside, it looks absurd. Carr makes smokers watch themselves standing in the rain inhaling poison - suddenly the spell breaks.",
    copyExamples: [
      '"Picture someone paying $X/month for [old solution] and getting [poor result]. That someone is you." Force the third-person view, then snap back to first-person.',
    ],
    adApplication: '"Watch someone scroll for 3 hours and call it relaxing. Watch someone pay twice the price for half the result. Now ask yourself - is that you?" The absurdity only becomes visible from outside the frame.',
  },
  {
    id: "anchoring_stacking",
    name: "Anchoring & Stacking",
    color: "#22c55e",
    power: 90,
    definition: 'Systematically anchor positive emotional words (freedom, escape, joy, relief, control) to your product, and negative emotional words (trap, prison, waste, drain, stuck) to the alternative/status quo. Through repetition, these anchors become automatic - when the reader thinks of your product their brain fires "freedom" before they can think critically.',
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
    definition: "Break the reader's expected thought pattern so their brain shifts from autopilot to active processing. Then open an idea loop (pose a question, start a story) without closing it - the Zeigarnik Effect means the brain holds unfinished thoughts open, making the reader more receptive to everything between the open and close. Carr opens concepts in chapter 3 and doesn't resolve them until chapter 12.",
    copyExamples: [
      '"What I\'m about to tell you about [product] will change how you see [category] forever. But first…" - the loop is open. Everything after this gets heightened attention because the brain needs closure.',
    ],
    adApplication: 'Hook: Open the loop ("There\'s something about [product] nobody\'s talking about.") → Body: Interrupt with social proof, benefits, reframes → CTA: Close the loop ("Download to find out.") The unresolved tension drives the click.',
  },
];

export const NLP_POSITIVE_ANCHORS = ["freedom", "escape", "joy", "relief", "control"];
export const NLP_NEGATIVE_ANCHORS = ["trap", "prison", "waste", "drain", "stuck"];

export interface INLPStackStrategyDef {
  step: number;
  technique: string;
  instruction: string;
}

export const NLP_STACK_STRATEGY: NLPStackStrategyDef[] = [
  { step: 1, technique: "Presupposition", instruction: 'Open with a presupposition: "Ready to see why people are switching?"' },
  { step: 2, technique: "Reframing", instruction: 'Hit with a reframe: "You\'re not spending - you\'re escaping"' },
  { step: 3, technique: "Dissociation", instruction: 'Use dissociation to make the old way look absurd: "Watch someone do X and call it normal"' },
  { step: 4, technique: "Anchoring", instruction: "Anchor [product] to freedom/relief language throughout" },
  { step: 5, technique: "Nested Loop", instruction: "Leave one nested loop unresolved until the CTA forces the click to close it" },
];

export const NLP_KEY_PRINCIPLE = "NLP doesn't use willpower. It dismantles the belief system that makes the old behavior feel rational. By the time the reader reaches your CTA, they don't need convincing - they've already changed their mind.";

// --- Sora2 Style Tags Catalog ---
// Claude picks 3-6 tags per visual suggestion from this catalog.
// Tags drive the visual treatment in the Sora2 prompt filter.
// Add new tags here anytime — they'll automatically be available to Claude.

export interface IStyleTagCategory {
  category: string;
  tags: string[];
}

export const SORA2_STYLE_TAGS: StyleTagCategory[] = [
  {
    category: "capture device",
    tags: ["iphone 15 pro", "iphone 13", "dslr", "gopro", "webcam"],
  },
  {
    category: "camera behavior",
    tags: ["handheld", "static tripod", "slow pan", "locked off", "POV first person", "selfie angle", "slightly shaky"],
  },
  {
    category: "lighting",
    tags: ["natural lighting", "golden hour", "warm studio lighting", "harsh overhead", "overcast soft", "ring light", "low light", "lamp light", "window light"],
  },
  {
    category: "production style",
    tags: ["ugc", "podcast setup", "vlog", "interview", "documentary", "livestream"],
  },
  {
    category: "mood / tone",
    tags: ["raw", "authentic", "casual", "intimate", "contemplative", "tense", "nostalgic", "quiet", "vulnerable"],
  },
  {
    category: "visual treatment",
    tags: ["shallow depth of field", "film grain", "clean digital", "slightly overexposed", "desaturated", "warm tones", "cool tones"],
  },
  {
    category: "audio character",
    tags: ["phone mic quality", "studio audio", "ambient only", "room tone", "slightly compressed"],
  },
  {
    category: "environment",
    tags: ["indoor domestic", "outdoor urban", "outdoor nature", "studio / set", "car interior", "office", "gym", "bedroom", "kitchen", "street", "coffee shop", "church", "park bench"],
  },
  {
    category: "realism cues",
    tags: ["imperfect framing", "not perfectly lit", "real skin texture", "background clutter", "ambient noise", "natural pauses", "micro-expressions"],
  },
];
