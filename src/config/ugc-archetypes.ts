// ============================================================
// UGC PERFORMANCE ARCHETYPES
// 14 behavioral energy types for Sora2 UGC clip generation.
// Each archetype has combinatorial property arrays (emotion, action)
// that produce hundreds of unique 4-second clip prompts.
// Appearance and environment use shared global pools.
// ============================================================

// --- Interfaces ---

export interface IUGCArchetypeDef {
  id: string;
  name: string;
  description: string;
  arousal: "high" | "medium" | "low";
  territories: string[];

  // Combinatorial property arrays — pick one from each to build a Sora2 prompt
  emotion: string[];
  action: string[];

  // Overrides (hybrid model) — archetype-specific arrays that REPLACE global defaults
  environmentOverrides?: string[];

  color: string;
}

export interface IUGCAppearancePool {
  ageRange: string[];
  gender: string[];
  ethnicity: string[];
  build: string[];
  style: string[];
  hair: string[];
  details: string[];
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

// --- Global Shared Pools ---

export const UGC_APPEARANCE_POOL: IUGCAppearancePool = {
  ageRange: ["18-24", "25-34", "35-44", "45-54"],
  gender: ["female", "male"],
  ethnicity: ["caucasian", "caucasian", "caucasian", "caucasian", "african-american", "hispanic"],
  build: ["slim", "average", "athletic", "curvy", "stocky"],
  style: ["oversized tee", "casual hoodie", "fitted tank", "work blouse", "gym clothes"],
  hair: ["messy bun", "short crop", "loose natural", "braids", "buzz cut", "long straight", "shoulder-length wavy"],
  details: ["no makeup", "minimal makeup", "tired eyes", "glasses", "stubble", "freckles"],
};

export const UGC_ENVIRONMENT_POOL: string[] = [
  "parked car with phone on dashboard",
  "bedroom with unmade bed, lamp light",
  "couch with blanket, living room clutter",
  "kitchen counter, morning light",
  "bathroom mirror, harsh overhead light",
  "office desk, monitor glow",
  "park bench, overcast",
  "coffee shop table, ambient noise",
  "bed at night, phone screen glow only",
  "gym locker room bench",
];

// --- 14 UGC Performance Archetypes ---

export const UGC_ARCHETYPES: IUGCArchetypeDef[] = [
  // === HIGH AROUSAL ===
  {
    id: "shock-excited",
    name: "Shock Excited",
    description: "Eyes go wide, natural 'oh shit' moment. Genuine surprise that can't be faked — the body reacts before the brain catches up.",
    arousal: "high",
    territories: ["discovery_revelation", "aspiration_gap", "excitement_hype", "pride_flex"],
    emotion: ["surprise", "disbelief", "excitement", "awe", "shock"],
    action: [
      "hand to mouth",
      "eyes widen at phone",
      "freezes mid-scroll",
      "leans back in chair",
      "double-takes at screen",
      "jaw drops slightly",
    ],
    color: "#f43f5e",
  },
  {
    id: "rant-passionate",
    name: "Rant Passionate",
    description: "Fired up, can't hold back, intense energy. Speaking fast, gesturing, the kind of person who pulls you into their conviction.",
    arousal: "high",
    territories: ["identity_tension", "social_positioning", "anger_injustice"],
    emotion: ["frustration", "conviction", "indignation", "urgency", "righteous anger"],
    action: [
      "gestures emphatically",
      "points at camera",
      "leans forward intensely",
      "shakes head in disbelief",
      "counts points on fingers",
      "slaps table for emphasis",
    ],
    color: "#ef4444",
  },
  {
    id: "chaotic-interrupt",
    name: "Chaotic Interrupt",
    description: "Unexpected behavior that breaks the scroll pattern. Something visually jarring or contextually wrong that forces attention.",
    arousal: "high",
    territories: ["habit_architecture", "discovery_revelation", "humor_absurdity"],
    emotion: ["manic energy", "absurdity", "impulsiveness", "chaos", "spontaneity"],
    action: [
      "bursts into frame",
      "drops something suddenly",
      "starts mid-sentence",
      "whips camera around",
      "stands up abruptly",
      "covers camera then reveals",
    ],
    color: "#f97316",
  },

  // === MEDIUM AROUSAL ===
  {
    id: "playing-coy",
    name: "Playing Coy",
    description: "Slight smirk, knows something you don't. Casual energy with an undertone of 'I've got a secret worth hearing.'",
    arousal: "medium",
    territories: ["discovery_revelation", "social_positioning", "humor_absurdity", "belonging_tribe"],
    emotion: ["smugness", "playfulness", "teasing", "knowing confidence", "mischief"],
    action: [
      "slight smirk to camera",
      "raises one eyebrow",
      "tilts head with half-smile",
      "looks away then back",
      "shrugs casually",
      "mouths 'watch this'",
    ],
    color: "#ec4899",
  },
  {
    id: "skeptic-converted",
    name: "Skeptic Converted",
    description: "Reluctant admission. Started doubtful, now can't deny it. The 'ok fine, it actually works' energy that builds instant credibility.",
    arousal: "medium",
    territories: ["identity_tension", "habit_architecture"],
    emotion: ["reluctant surprise", "grudging approval", "cognitive dissonance", "honest admission", "humbled"],
    action: [
      "rolls eyes then pauses",
      "sighs before speaking",
      "holds up hands in surrender",
      "nods slowly, reluctantly",
      "scratches head in disbelief",
      "looks off-camera then back with 'fine'",
    ],
    color: "#8b5cf6",
  },
  {
    id: "bestie-conspiratorial",
    name: "Bestie Conspiratorial",
    description: "Close to camera, 'come here' energy. Whispering a secret to their best friend. Intimate, trust-building, low-key urgent.",
    arousal: "medium",
    territories: ["social_positioning", "discovery_revelation", "belonging_tribe"],
    emotion: ["intimacy", "urgency-whisper", "trust", "conspiratorial excitement", "insider knowledge"],
    action: [
      "leans close to camera",
      "whispers with wide eyes",
      "cups hand near mouth",
      "glances around first",
      "pulls phone closer to face",
      "motions 'come here'",
    ],
    color: "#d946ef",
  },
  {
    id: "curious-intrigued",
    name: "Curious Intrigued",
    description: "Head tilt, eyebrows up, lean forward. Genuinely discovering something in real time. The viewer wants to know what they found.",
    arousal: "medium",
    territories: ["discovery_revelation", "aspiration_gap"],
    emotion: ["curiosity", "intrigue", "wonder", "fascination", "pleasant confusion"],
    action: [
      "tilts head studying screen",
      "eyebrows rise slowly",
      "leans forward squinting",
      "mouths 'wait what'",
      "taps screen then looks up",
      "scrolls slowly, stops, looks closer",
    ],
    color: "#06b6d4",
  },
  {
    id: "quiet-confidence",
    name: "Quiet Confidence",
    description: "Slight smile, direct look, composed. Not trying to sell anything. The calm energy of someone who found something that just works.",
    arousal: "medium",
    territories: ["relief_surrender", "identity_tension", "pride_flex"],
    emotion: ["calm assurance", "settled satisfaction", "groundedness", "quiet pride", "inner peace"],
    action: [
      "slight smile, direct eye contact",
      "nods slowly once",
      "holds phone up casually",
      "sits back relaxed",
      "folds arms with soft smile",
      "glances at product, then at camera",
    ],
    color: "#22c55e",
  },

  // === LOW AROUSAL ===
  {
    id: "vulnerable-soft",
    name: "Vulnerable Soft",
    description: "Looking down, quiet, small. Real vulnerability that creates instant empathy. The viewer sees themselves in this person's honesty.",
    arousal: "low",
    territories: ["identity_tension", "loss_decay"],
    emotion: ["vulnerability", "quiet sadness", "honesty", "tenderness", "exposed"],
    action: [
      "looks down at hands",
      "voice cracks slightly",
      "pauses mid-thought",
      "touches chest or collarbone",
      "wipes corner of eye",
      "speaks barely above a whisper",
    ],
    color: "#a855f7",
  },
  {
    id: "caught-guilty",
    name: "Caught Guilty",
    description: "Phone glow, pause, 'didn't expect to be seen.' The moment of private guilt that every viewer recognizes from their own 2AM scroll.",
    arousal: "low",
    territories: ["displacement", "identity_tension"],
    emotion: ["guilt", "shame", "self-awareness", "caught off-guard", "private embarrassment"],
    action: [
      "freezes with phone in hand",
      "slowly looks up from screen",
      "bites lip",
      "closes eyes briefly",
      "sets phone face-down",
      "stares at ceiling",
    ],
    environmentOverrides: [
      "bed at night, phone screen glow only",
      "bathroom at 2am, harsh light, phone in hand",
      "couch in dark living room, TV off, phone glow on face",
      "parked car at night, dashboard light",
    ],
    color: "#64748b",
  },
  {
    id: "exhausted-done",
    name: "Exhausted Done",
    description: "Tired eyes, rubs face, over it. Not dramatic — just genuinely depleted. The viewer recognizes this feeling in their bones.",
    arousal: "low",
    territories: ["relief_surrender", "displacement"],
    emotion: ["exhaustion", "resignation", "depletion", "fed up", "emotional fatigue"],
    action: [
      "rubs face with both hands",
      "stares blankly at screen",
      "exhales heavily",
      "rests head on hand",
      "closes laptop slowly",
      "drops phone on chest",
    ],
    color: "#94a3b8",
  },
  {
    id: "casual-unbothered",
    name: "Casual Unbothered",
    description: "Just existing. Scrolling, sipping coffee. The person is the anchor — text does the heavy lifting. Low production, high relatability.",
    arousal: "low",
    territories: ["habit_architecture", "relief_surrender"],
    emotion: ["indifference", "contentment", "autopilot", "ease", "background calm"],
    action: [
      "scrolls phone absently",
      "sips coffee without looking up",
      "sits in silence, just existing",
      "fidgets with something nearby",
      "stares out window",
      "picks at food while scrolling",
    ],
    color: "#78716c",
  },

  // === GAP-FILLERS (from territory audit) ===
  {
    id: "fomo-left-behind",
    name: "FOMO Left Behind",
    description: "Looking at phone seeing others succeed, 'why not me' energy. The quiet sting of watching everyone else figure it out.",
    arousal: "low",
    territories: ["displacement", "social_positioning", "aspiration_gap", "craving_desire"],
    emotion: ["envy", "inadequacy", "left out", "self-doubt", "quiet desperation"],
    action: [
      "scrolls through others' posts",
      "puts phone down and stares",
      "watches someone else's success video",
      "compares screen to own situation",
      "sighs while looking at phone",
      "closes app and reopens it",
    ],
    color: "#3b82f6",
  },
  {
    id: "nostalgic-remembering",
    name: "Nostalgic Remembering",
    description: "Distant gaze, touching something meaningful, lost in memory. The ache of something that used to be and isn't anymore.",
    arousal: "low",
    territories: ["loss_decay", "identity_tension", "nostalgia"],
    emotion: ["nostalgia", "longing", "bittersweet", "wistfulness", "gentle grief"],
    action: [
      "gazes into distance",
      "touches an object with meaning",
      "flips through old photos on phone",
      "holds something close",
      "closes eyes remembering",
      "traces finger along surface absently",
    ],
    color: "#f59e0b",
  },
];
