// ============================================================
// LOCAL COPY CHECK - Deterministic scoring algorithms
// These run client-side, NO AI needed. AI Deep Review is optional.
// Ported from the original HTML system.
// ============================================================

import {
  COPY_BIAS_PATTERNS,
  EMOTION_WORDS,
  POWER_WORDS,
  FRAMEWORK_DETECTION_PATTERNS,
  TREND_CHECK_PATTERNS,
} from "@/config/copy-analysis-patterns";

// --- Syllable Counter ---

function countSyllables(word: string): number {
  const w = word.toLowerCase().replace(/[^a-z]/g, "");
  if (w.length <= 3) return 1;
  let count = w.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, "")
    .replace(/^y/, "")
    .match(/[aeiouy]{1,2}/g);
  return count ? count.length : 1;
}

// --- Flesch Reading Ease ---

export function computeFlesch(text: string): { score: number; grade: string; avgWordsPerSentence: number } {
  const sentences = text.split(/[.!?]+/).filter((s) => s.trim().length > 0);
  const words = text.split(/\s+/).filter((w) => w.length > 0);
  const sentenceCount = sentences.length || 1;
  const wordCount = words.length || 1;
  const totalSyllables = words.reduce((sum, w) => sum + countSyllables(w), 0);

  const flesch = Math.round(206.835 - 1.015 * (wordCount / sentenceCount) - 84.6 * (totalSyllables / wordCount));
  const score = Math.max(0, Math.min(100, flesch));

  let grade: string;
  if (score >= 80) grade = "Very Easy";
  else if (score >= 60) grade = "Easy";
  else if (score >= 40) grade = "Moderate";
  else if (score >= 20) grade = "Hard";
  else grade = "Very Hard";

  return { score, grade, avgWordsPerSentence: Math.round((wordCount / sentenceCount) * 10) / 10 };
}

// --- Grammar Score ---

export interface GrammarIssue {
  type: string;
  description: string;
  position?: number;
}

export function checkGrammar(text: string): { score: number; issues: GrammarIssue[] } {
  const issues: GrammarIssue[] = [];

  // Double spaces
  const doubleSpaces = text.match(/ {2,}/g);
  if (doubleSpaces) {
    issues.push({ type: "spacing", description: `${doubleSpaces.length} double space(s) found` });
  }

  // Missing space after punctuation
  const missingSpace = text.match(/[.!?,;:][A-Za-z]/g);
  if (missingSpace) {
    issues.push({ type: "spacing", description: `${missingSpace.length} missing space(s) after punctuation` });
  }

  // Repeated words
  const repeated = text.match(/\b(\w+)\s+\1\b/gi);
  if (repeated) {
    issues.push({ type: "repetition", description: `Repeated word(s): ${repeated.join(", ")}` });
  }

  // Lowercase after period
  const lowercaseAfterPeriod = text.match(/\.\s+[a-z]/g);
  if (lowercaseAfterPeriod) {
    issues.push({ type: "capitalization", description: `${lowercaseAfterPeriod.length} sentence(s) starting with lowercase` });
  }

  // Missing end punctuation
  const trimmed = text.trim();
  if (trimmed.length > 0 && !/[.!?]$/.test(trimmed)) {
    issues.push({ type: "punctuation", description: "Missing end punctuation" });
  }

  const score = Math.max(0, 100 - issues.length * 12);
  return { score, issues };
}

// --- Persuasion Score ---

export function computePersuasion(text: string): {
  score: number;
  powerWordCount: number;
  emotionBreakdown: Record<string, number>;
  hasQuestion: boolean;
  hasCTA: boolean;
  hasStats: boolean;
} {
  const lower = text.toLowerCase();
  const words = lower.split(/\s+/);

  // Power words
  const powerWordCount = POWER_WORDS.filter((pw) => lower.includes(pw)).length;

  // Emotion breakdown
  const emotionBreakdown: Record<string, number> = {};
  for (const [category, triggers] of Object.entries(EMOTION_WORDS)) {
    emotionBreakdown[category] = triggers.filter((t) => lower.includes(t)).length;
  }

  const totalEmotionHits = Object.values(emotionBreakdown).reduce((a, b) => a + b, 0);
  const hasQuestion = /\?/.test(text);
  const hasCTA = /download|try|start|get|join|click|grab|claim|sign up|buy|order|subscribe/i.test(text);
  const hasStats = /\d+\s*(million|k|thousand|%|users|people|downloads|reviews|x)/i.test(text);

  // Short sentences bonus
  const sentences = text.split(/[.!?]+/).filter((s) => s.trim().length > 0);
  const shortSentences = sentences.filter((s) => s.trim().split(/\s+/).length <= 8).length;
  const shortSentenceRatio = sentences.length > 0 ? shortSentences / sentences.length : 0;

  // Score calculation
  let score = 0;
  score += Math.min(30, powerWordCount * 4);         // max 30
  score += Math.min(25, totalEmotionHits * 3);        // max 25
  score += hasQuestion ? 10 : 0;
  score += hasCTA ? 15 : 0;
  score += hasStats ? 10 : 0;
  score += Math.round(shortSentenceRatio * 10);       // max 10

  return { score: Math.min(100, score), powerWordCount, emotionBreakdown, hasQuestion, hasCTA, hasStats };
}

// --- Bias Detection ---

export function detectBiasesInCopy(text: string): { name: string; strength: number; color: string }[] {
  return COPY_BIAS_PATTERNS
    .filter((b) => b.pattern.test(text))
    .map(({ name, strength, color }) => ({ name, strength, color }));
}

// --- Trend Score (8 trends) ---

export interface TrendCheck {
  name: string;
  passed: boolean;
}

export function computeTrends(text: string): { score: number; checks: TrendCheck[] } {
  const sentences = text.split(/[.!?]+/).filter((s) => s.trim().length > 0);
  const words = text.split(/\s+/).filter((w) => w.length > 0);
  const avgWordsPerSentence = sentences.length > 0 ? words.length / sentences.length : 0;

  const checks: TrendCheck[] = TREND_CHECK_PATTERNS.map((trendPattern) => {
    let passed = false;

    if (trendPattern.checkFn) {
      passed = trendPattern.checkFn(text);
    } else if (trendPattern.pattern) {
      passed = trendPattern.pattern.test(text);
    }

    // Special handling for short-form-optimized (already handled by checkFn, but keeping for clarity)
    if (trendPattern.id === "short-form-optimized") {
      passed = avgWordsPerSentence <= 14;
    }

    return {
      name: trendPattern.name,
      passed,
    };
  });

  const passed = checks.filter((c) => c.passed).length;
  const score = Math.round((passed / checks.length) * 100);
  return { score, checks };
}

// --- Framework Alignment ---

export function detectFrameworks(text: string): string[] {
  const matched: string[] = [];

  for (const framework of FRAMEWORK_DETECTION_PATTERNS) {
    // Check if all patterns for this framework match
    const allPatternsMatch = framework.patterns.every(({ pattern }) => pattern.test(text));

    if (allPatternsMatch) {
      matched.push(framework.abbreviation);
    }
  }

  return matched;
}

// --- Overall Score ---

export interface CopyCheckLocalResult {
  overall: number;
  flesch: { score: number; grade: string; avgWordsPerSentence: number };
  grammar: { score: number; issues: GrammarIssue[] };
  persuasion: ReturnType<typeof computePersuasion>;
  biases: { name: string; strength: number; color: string }[];
  trends: { score: number; checks: TrendCheck[] };
  frameworks: string[];
}

export function runLocalCopyCheck(text: string): CopyCheckLocalResult {
  const flesch = computeFlesch(text);
  const grammar = checkGrammar(text);
  const persuasion = computePersuasion(text);
  const biases = detectBiasesInCopy(text);
  const trends = computeTrends(text);
  const frameworks = detectFrameworks(text);

  // Weighted overall: Flesch 20% + Persuasion 30% + Grammar 20% + Trends 15% + Biases 15%
  const biasScore = Math.min(100, biases.length * 15);
  const overall = Math.round(
    flesch.score * 0.2 +
    persuasion.score * 0.3 +
    grammar.score * 0.2 +
    trends.score * 0.15 +
    biasScore * 0.15
  );

  return { overall, flesch, grammar, persuasion, biases, trends, frameworks };
}
