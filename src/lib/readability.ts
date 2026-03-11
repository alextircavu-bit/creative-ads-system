// ============================================================
// Readability Engine - Hemingway-style analysis + ad timing
// ============================================================

// --- Constants ---

// Words per minute by delivery mode
const WPM_TEXT_OVERLAY = 200; // On-screen reading (25% slower than paper)
const WPM_VOICEOVER_SLOW = 130; // Relaxed, emotional reads
const WPM_VOICEOVER_NORMAL = 150; // Conversational pace
const WPM_VOICEOVER_FAST = 180; // Commercial/energetic pace

// Ad timing constraints (seconds)
const HOOK_MIN = 2;
const HOOK_MAX = 5;
const CTA_MIN = 2;
const CTA_MAX = 4;
const BODY_MIN = 3;
const BODY_MAX = 20;

// Readability thresholds (grade levels above target = Grade 9)
const TARGET_GRADE = 9;
const HARD_THRESHOLD = 4; // 4+ grades above target = hard
const VERY_HARD_THRESHOLD = 6; // 6+ grades above target = very hard

// --- Delivery Modes ---

export type DeliveryMode =
  | "text-overlay"        // Text on screen only, no voice
  | "voiceover"           // Voice narration, no on-screen text
  | "voiceover-caption"   // Voice + summary caption on screen
  | "vo-caption-subs";    // Voice + caption up top + word-for-word subtitles

export const DELIVERY_MODE_META: Record<DeliveryMode, { label: string; description: string; color: string; icon: string }> = {
  "text-overlay": {
    label: "Text Overlay",
    description: "Bold text on screen, no voiceover. Punchy, short copy.",
    color: "amber",
    icon: "T",
  },
  "voiceover": {
    label: "Voiceover",
    description: "Voice narration only. Conversational, longer copy allowed.",
    color: "blue",
    icon: "V",
  },
  "voiceover-caption": {
    label: "VO + Caption",
    description: "Voice narration with a summary caption on screen.",
    color: "violet",
    icon: "VC",
  },
  "vo-caption-subs": {
    label: "VO + Caption + Subs",
    description: "Full package: voiceover, topic caption, word-for-word subtitles.",
    color: "emerald",
    icon: "VCS",
  },
};

// --- Core Readability (ARI - Automated Readability Index) ---

function countCharacters(text: string): number {
  return text.replace(/[^a-zA-Z0-9]/g, "").length;
}

function countWords(text: string): number {
  const words = text.trim().split(/\s+/).filter(Boolean);
  return words.length;
}

function countSentences(text: string): number {
  const sentences = text.split(/[.!?]+/).filter((s) => s.trim().length > 0);
  return Math.max(sentences.length, 1);
}

/**
 * Automated Readability Index (ARI)
 * Used by Hemingway Editor. Character-based, avoids syllable counting issues.
 * Returns a US grade level (1-14+).
 */
export function calculateARI(text: string): number {
  const chars = countCharacters(text);
  const words = countWords(text);
  const sentences = countSentences(text);

  if (words === 0) return 0;

  const ari = 4.71 * (chars / words) + 0.5 * (words / sentences) - 21.43;
  return Math.max(0, Math.round(ari * 10) / 10);
}

/**
 * Flesch Reading Ease (0-100, higher = easier)
 */
export function calculateFleschEase(text: string): number {
  const words = countWords(text);
  const sentences = countSentences(text);
  const syllables = countSyllables(text);

  if (words === 0) return 100;

  const score = 206.835 - 1.015 * (words / sentences) - 84.6 * (syllables / words);
  return Math.max(0, Math.min(100, Math.round(score * 10) / 10));
}

function countSyllables(text: string): number {
  const words = text.toLowerCase().split(/\s+/).filter(Boolean);
  let total = 0;
  for (const word of words) {
    total += countWordSyllables(word);
  }
  return total;
}

function countWordSyllables(word: string): number {
  const clean = word.replace(/[^a-z]/g, "");
  if (clean.length <= 3) return 1;

  let count = 0;
  const vowels = "aeiouy";
  let prevVowel = false;

  for (let i = 0; i < clean.length; i++) {
    const isVowel = vowels.includes(clean[i]);
    if (isVowel && !prevVowel) count++;
    prevVowel = isVowel;
  }

  // Silent e
  if (clean.endsWith("e") && count > 1) count--;
  // -le ending
  if (clean.endsWith("le") && clean.length > 2 && !vowels.includes(clean[clean.length - 3])) count++;

  return Math.max(1, count);
}

// --- Sentence Difficulty ---

export type SentenceDifficulty = "ok" | "hard" | "very-hard";

export interface SentenceAnalysis {
  text: string;
  wordCount: number;
  gradeLevel: number;
  difficulty: SentenceDifficulty;
}

export function analyzeSentences(text: string): SentenceAnalysis[] {
  const sentences = text
    .split(/(?<=[.!?])\s+/)
    .filter((s) => s.trim().length > 0);

  return sentences.map((sentence) => {
    const gradeLevel = calculateARI(sentence);
    const diff = gradeLevel - TARGET_GRADE;

    let difficulty: SentenceDifficulty = "ok";
    if (diff >= VERY_HARD_THRESHOLD) difficulty = "very-hard";
    else if (diff >= HARD_THRESHOLD) difficulty = "hard";

    return {
      text: sentence.trim(),
      wordCount: countWords(sentence),
      gradeLevel,
      difficulty,
    };
  });
}

// --- Hemingway-Style Highlights ---

export interface ReadabilityReport {
  gradeLevel: number;
  fleschEase: number;
  wordCount: number;
  sentenceCount: number;
  avgWordsPerSentence: number;
  hardSentences: number;
  veryHardSentences: number;
  adverbCount: number;
  passiveVoiceCount: number;
  complexWordCount: number;
  sentences: SentenceAnalysis[];
}

const ADVERB_PATTERNS = /\b\w+ly\b/gi;
const PASSIVE_PATTERNS = /\b(is|are|was|were|be|been|being)\s+\w+ed\b/gi;
const COMPLEX_WORDS: Record<string, string> = {
  utilize: "use",
  implement: "set up",
  facilitate: "help",
  demonstrate: "show",
  approximately: "about",
  consequently: "so",
  nevertheless: "but",
  furthermore: "also",
  subsequently: "then",
  predominantly: "mainly",
  comprehensive: "full",
  functionality: "feature",
  methodology: "method",
  significantly: "much",
  Additionally: "Also",
};

export function analyzeReadability(text: string): ReadabilityReport {
  const wordCount = countWords(text);
  const sentenceCount = countSentences(text);
  const sentences = analyzeSentences(text);

  const adverbMatches = text.match(ADVERB_PATTERNS) || [];
  // Filter out common non-adverbs
  const nonAdverbs = new Set(["only", "early", "daily", "weekly", "monthly", "yearly", "apply", "supply", "reply", "fly", "July", "family", "really", "finally"]);
  const adverbs = adverbMatches.filter((w) => !nonAdverbs.has(w.toLowerCase()));

  const passiveMatches = text.match(PASSIVE_PATTERNS) || [];

  let complexCount = 0;
  const lowerText = text.toLowerCase();
  for (const word of Object.keys(COMPLEX_WORDS)) {
    if (lowerText.includes(word.toLowerCase())) complexCount++;
  }

  return {
    gradeLevel: calculateARI(text),
    fleschEase: calculateFleschEase(text),
    wordCount,
    sentenceCount,
    avgWordsPerSentence: wordCount / sentenceCount,
    hardSentences: sentences.filter((s) => s.difficulty === "hard").length,
    veryHardSentences: sentences.filter((s) => s.difficulty === "very-hard").length,
    adverbCount: adverbs.length,
    passiveVoiceCount: passiveMatches.length,
    complexWordCount: complexCount,
    sentences,
  };
}

// --- Ad Timing Calculator ---

export interface SectionTiming {
  wordCount: number;
  readingTimeSec: number;   // Time for text overlay (on-screen reading)
  speakingTimeSec: number;  // Time for voiceover delivery
  recommendedSec: number;   // Final duration based on delivery mode
  deliveryMode: DeliveryMode;
  gradeLevel: number;
  isAdFriendly: boolean;    // Grade <= 9 = good for ads
}

/**
 * Calculate timing for an ad section based on delivery mode.
 * Returns seconds needed to read/speak the text.
 */
export function calculateSectionTiming(
  text: string,
  deliveryMode: DeliveryMode,
  section: "hook" | "body" | "cta"
): SectionTiming {
  const wordCount = countWords(text);
  const gradeLevel = calculateARI(text);

  // Reading time (text overlay): on-screen reading speed
  const readingTimeSec = (wordCount / WPM_TEXT_OVERLAY) * 60;

  // Speaking time (voiceover): conversational pace
  const speakingTimeSec = (wordCount / WPM_VOICEOVER_NORMAL) * 60;

  // Recommended duration based on delivery mode
  let rawDuration: number;
  switch (deliveryMode) {
    case "text-overlay":
      // On-screen text needs time to read + 0.5s buffer for visual processing
      rawDuration = readingTimeSec + 0.5;
      break;
    case "voiceover":
      rawDuration = speakingTimeSec;
      break;
    case "voiceover-caption":
      // Voice pace + slight buffer for caption reading
      rawDuration = speakingTimeSec + 0.3;
      break;
    case "vo-caption-subs":
      // Voice pace dominates, subtitles follow along
      rawDuration = speakingTimeSec + 0.2;
      break;
  }

  // Clamp to section constraints
  const limits = section === "hook"
    ? { min: HOOK_MIN, max: HOOK_MAX }
    : section === "cta"
      ? { min: CTA_MIN, max: CTA_MAX }
      : { min: BODY_MIN, max: BODY_MAX };

  const recommendedSec = Math.round(Math.max(limits.min, Math.min(limits.max, rawDuration)) * 10) / 10;

  return {
    wordCount,
    readingTimeSec: Math.round(readingTimeSec * 10) / 10,
    speakingTimeSec: Math.round(speakingTimeSec * 10) / 10,
    recommendedSec,
    deliveryMode,
    gradeLevel,
    isAdFriendly: gradeLevel <= TARGET_GRADE,
  };
}

/**
 * Calculate total ad duration from all sections.
 */
export function calculateAdDuration(
  hook: { text: string; deliveryMode: DeliveryMode },
  body: { text: string; deliveryMode: DeliveryMode },
  cta: { text: string; deliveryMode: DeliveryMode }
): {
  hookTiming: SectionTiming;
  bodyTiming: SectionTiming;
  ctaTiming: SectionTiming;
  totalSec: number;
  totalFormatted: string;
} {
  const hookTiming = calculateSectionTiming(hook.text, hook.deliveryMode, "hook");
  const bodyTiming = calculateSectionTiming(body.text, body.deliveryMode, "body");
  const ctaTiming = calculateSectionTiming(cta.text, cta.deliveryMode, "cta");

  const totalSec = hookTiming.recommendedSec + bodyTiming.recommendedSec + ctaTiming.recommendedSec;

  return {
    hookTiming,
    bodyTiming,
    ctaTiming,
    totalSec: Math.round(totalSec * 10) / 10,
    totalFormatted: `${Math.round(totalSec)}s`,
  };
}

/**
 * Suggest the best delivery mode for a section based on word count and section type.
 */
export function suggestDeliveryMode(
  wordCount: number,
  section: "hook" | "body" | "cta"
): DeliveryMode {
  if (section === "hook") {
    // Short hooks (< 8 words) work great as text overlay
    if (wordCount <= 8) return "text-overlay";
    // Medium hooks can use voiceover + caption
    if (wordCount <= 15) return "voiceover-caption";
    return "voiceover";
  }

  if (section === "cta") {
    // CTAs are usually short and punchy
    if (wordCount <= 6) return "text-overlay";
    return "voiceover-caption";
  }

  // Body - longer content
  if (wordCount <= 12) return "text-overlay";
  if (wordCount <= 25) return "voiceover-caption";
  return "vo-caption-subs";
}

/**
 * Get max recommended word count per section per delivery mode.
 * Useful for prompts to constrain Claude's output.
 */
export function getWordLimits(deliveryMode: DeliveryMode, section: "hook" | "body" | "cta"): { min: number; max: number } {
  const limits: Record<DeliveryMode, Record<string, { min: number; max: number }>> = {
    "text-overlay": {
      hook: { min: 3, max: 8 },
      body: { min: 5, max: 15 },
      cta: { min: 2, max: 6 },
    },
    "voiceover": {
      hook: { min: 5, max: 15 },
      body: { min: 10, max: 45 },
      cta: { min: 3, max: 10 },
    },
    "voiceover-caption": {
      hook: { min: 5, max: 12 },
      body: { min: 8, max: 35 },
      cta: { min: 3, max: 8 },
    },
    "vo-caption-subs": {
      hook: { min: 5, max: 15 },
      body: { min: 10, max: 45 },
      cta: { min: 3, max: 10 },
    },
  };

  return limits[deliveryMode][section];
}
