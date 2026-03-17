/**
 * Copy Analysis Patterns
 *
 * Patterns and word lists used for local copy analysis (deterministic scoring).
 * These run client-side without AI.
 */

/**
 * Copy bias pattern definition
 */
export interface ICopyBiasPattern {
  name: string;
  strength: number;
  color: string;
  pattern: RegExp;
}

/**
 * Bias patterns detected in ad copy
 * Each pattern has a name, strength score (0-100), color for UI, and regex pattern
 */
export const COPY_BIAS_PATTERNS: ICopyBiasPattern[] = [
  {
    name: "Loss Aversion",
    strength: 90,
    color: "#f43f5e",
    pattern: /lose|losing|miss out|missing out|every day without|slip away|running out|before it's too late|gone forever/i,
  },
  {
    name: "Curiosity Gap",
    strength: 88,
    color: "#ec4899",
    pattern: /wait|secret|discover|reveal|find out|did you know|what if|how|why|this is|guess what/i,
  },
  {
    name: "Framing Effect",
    strength: 87,
    color: "#a855f7",
    pattern: /instead of|not .* but|same .* different|think of it as|it's not .* it's/i,
  },
  {
    name: "Anchoring",
    strength: 85,
    color: "#06b6d4",
    pattern: /\d+\s*(hours?|minutes?|%|x|times)|\$\d|was \$.*now \$|compare|versus|vs/i,
  },
  {
    name: "Social Proof",
    strength: 85,
    color: "#f59e0b",
    pattern: /million|thousand|people|everyone|joined|community|trending|popular|\d+\s*(users|people|downloads|reviews)/i,
  },
  {
    name: "Confirmation Bias",
    strength: 83,
    color: "#10b981",
    pattern: /identity|believ|communit|value|lifestyle|type|kind|who you|are you|be the|self|person/i,
  },
  {
    name: "Default Effect",
    strength: 82,
    color: "#14b8a6",
    pattern: /lock\s?screen|auto|default|always|every\s?time|background|notif/i,
  },
  {
    name: "Bandwagon Effect",
    strength: 80,
    color: "#f97316",
    pattern: /everyone|trending|viral|movement|wave|join|switch|people are|millions are/i,
  },
  {
    name: "Hyperbolic Discounting",
    strength: 79,
    color: "#eab308",
    pattern: /instant|now|today|quick|fast|immediate|minute|second|real.?time|auto|first|right away/i,
  },
  {
    name: "Endowment Effect",
    strength: 76,
    color: "#84cc16",
    pattern: /free|trial|try|yours|your|keep|personal|custom|plan|result|my\b/i,
  },
  {
    name: "Status Quo Bias",
    strength: 75,
    color: "#3b82f6",
    pattern: /replace|switch|change|instead|new|swap/i,
  },
  {
    name: "Authority Bias",
    strength: 74,
    color: "#64748b",
    pattern: /expert|doctor|study|research|proven|science|certified|coach|trainer|professional|clinical|evidence|based/i,
  },
  {
    name: "Commitment Escalation",
    strength: 72,
    color: "#6366f1",
    pattern: /daily|habit|routine|plan|day|commit|challenge|streak/i,
  },
  {
    name: "IKEA Effect",
    strength: 70,
    color: "#22c55e",
    pattern: /custom|personal|create|quiz|your|plan|build|choose/i,
  },
  {
    name: "Scarcity",
    strength: 68,
    color: "#f43f5e",
    pattern: /limited|exclusive|only|last|ends|hurry|running out|spots|left|this week|today only/i,
  },
];

/**
 * Emotion trigger words categorized by emotion type
 * Used for persuasion scoring
 */
export const EMOTION_WORDS: Record<string, readonly string[]> = {
  urgency: [
    "now",
    "today",
    "hurry",
    "before",
    "last",
    "limited",
    "ends",
    "deadline",
    "immediately",
    "running out",
  ],
  fear: [
    "lose",
    "miss",
    "risk",
    "danger",
    "worst",
    "never",
    "without",
    "failing",
    "losing",
  ],
  desire: [
    "imagine",
    "discover",
    "unlock",
    "transform",
    "become",
    "achieve",
    "gain",
    "exclusive",
    "secret",
    "revealed",
  ],
  social: [
    "everyone",
    "millions",
    "thousands",
    "joined",
    "trending",
    "popular",
    "community",
    "together",
    "people",
  ],
  authority: [
    "proven",
    "research",
    "expert",
    "study",
    "certified",
    "science",
    "evidence",
    "clinical",
  ],
  action: [
    "download",
    "try",
    "start",
    "get",
    "join",
    "click",
    "grab",
    "claim",
    "sign up",
    "free",
  ],
} as const;

/**
 * High-impact power words for persuasion
 */
export const POWER_WORDS: readonly string[] = [
  "you",
  "your",
  "free",
  "new",
  "because",
  "instantly",
  "guaranteed",
  "proven",
  "secret",
  "exclusive",
  "easy",
  "simple",
  "fast",
  "love",
  "save",
  "results",
  "amazing",
  "incredible",
] as const;

/**
 * Framework detection patterns
 */
export interface IFrameworkPattern {
  id: string;
  name: string;
  abbreviation: string;
  patterns: {
    step: string;
    pattern: RegExp;
  }[];
}

/**
 * Copywriting framework detection patterns
 */
export const FRAMEWORK_DETECTION_PATTERNS: IFrameworkPattern[] = [
  {
    id: "pas",
    name: "Problem-Agitate-Solution",
    abbreviation: "PAS",
    patterns: [
      { step: "problem", pattern: /problem|struggle|pain|frustrated|tired of/i },
      { step: "agitate", pattern: /worse|imagine|what if|keep/i },
      { step: "solution", pattern: /solution|fix|answer|introducing|finally/i },
    ],
  },
  {
    id: "aida",
    name: "Attention-Interest-Desire-Action",
    abbreviation: "AIDA",
    patterns: [
      { step: "attention", pattern: /\?|stop|wait|imagine|did you know/i },
      { step: "interest", pattern: /because|here's|the truth|what makes/i },
      { step: "action", pattern: /download|try|start|get|click|join/i },
    ],
  },
  {
    id: "bab",
    name: "Before-After-Bridge",
    abbreviation: "BAB",
    patterns: [
      { step: "before", pattern: /before|used to|remember when|without/i },
      { step: "after", pattern: /now|after|with|today|finally/i },
    ],
  },
  {
    id: "4ps",
    name: "Problem-Promise-Proof-Push",
    abbreviation: "4Ps",
    patterns: [
      { step: "problem", pattern: /problem|struggle/i },
      { step: "promise", pattern: /promise|guarantee|will/i },
      { step: "proof", pattern: /proven|result|testimonial|\d+/i },
    ],
  },
  {
    id: "star",
    name: "Situation-Task-Action-Result",
    abbreviation: "STAR",
    patterns: [
      { step: "situation", pattern: /situation|when|story/i },
      { step: "task", pattern: /had to|needed|wanted/i },
      { step: "action", pattern: /did|used|tried|started/i },
      { step: "result", pattern: /result|outcome|now|finally/i },
    ],
  },
];

/**
 * Trend check patterns for modern ad copy
 */
export interface ITrendCheck {
  id: string;
  name: string;
  description: string;
  pattern?: RegExp;
  checkFn?: (text: string) => boolean;
}

/**
 * Modern ad trend checks
 */
export const TREND_CHECK_PATTERNS: ITrendCheck[] = [
  {
    id: "conversational-tone",
    name: "Conversational Tone",
    description: "Uses 'you' language to connect with audience",
    pattern: /\byou\b|your|you're|you'll|you've/i,
  },
  {
    id: "short-form-optimized",
    name: "Short-Form Optimized",
    description: "Average sentence length ≤ 14 words",
    checkFn: (text: string) => {
      const sentences = text.split(/[.!?]+/).filter((s) => s.trim().length > 0);
      const words = text.split(/\s+/).filter((w) => w.length > 0);
      const avgWordsPerSentence = sentences.length > 0 ? words.length / sentences.length : 0;
      return avgWordsPerSentence <= 14;
    },
  },
  {
    id: "question-hook",
    name: "Question Hook",
    description: "Starts with or includes a question",
    pattern: /^[^.!]*\?/,
  },
  {
    id: "numeric-specificity",
    name: "Numeric Specificity",
    description: "Includes specific numbers for credibility",
    pattern: /\d+/,
  },
  {
    id: "emoji-integration",
    name: "Emoji Integration",
    description: "Uses emojis for visual interest",
    pattern: /[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/u,
  },
  {
    id: "ugc-voice",
    name: "UGC Voice",
    description: "First-person perspective (I, me, my)",
    pattern: /I |me |my |I'm|I've|I was|I just/i,
  },
  {
    id: "low-friction-cta",
    name: "Low-Friction CTA",
    description: "Emphasizes ease and no commitment",
    pattern: /free|no (credit|sign|cost)|one tap|just try|no commitment/i,
  },
  {
    id: "social-proof",
    name: "Social Proof",
    description: "Includes user count or social validation",
    pattern: /\d+\s*(million|k|thousand|users|people|reviews|downloads)/i,
  },
];
