// ============================================================
// LOCAL COPY CHECK - Deterministic scoring algorithms
// These run client-side, NO AI needed. AI Deep Review is optional.
// Ported from the original HTML system.
// ============================================================

// --- Local Bias Patterns (for copy text analysis, independent of framework-data) ---

const COPY_BIAS_PATTERNS: { name: string; strength: number; color: string; pattern: RegExp }[] = [
  { name: "Loss Aversion", strength: 90, color: "#f43f5e", pattern: /lose|losing|miss out|missing out|every day without|slip away|running out|before it's too late|gone forever/i },
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

const EMOTION_WORDS: Record<string, string[]> = {
  urgency: ["now", "today", "hurry", "before", "last", "limited", "ends", "deadline", "immediately", "running out"],
  fear: ["lose", "miss", "risk", "danger", "worst", "never", "without", "failing", "losing"],
  desire: ["imagine", "discover", "unlock", "transform", "become", "achieve", "gain", "exclusive", "secret", "revealed"],
  social: ["everyone", "millions", "thousands", "joined", "trending", "popular", "community", "together", "people"],
  authority: ["proven", "research", "expert", "study", "certified", "science", "evidence", "clinical"],
  action: ["download", "try", "start", "get", "join", "click", "grab", "claim", "sign up", "free"],
};

const POWER_WORDS = [
  "you", "your", "free", "new", "because", "instantly", "guaranteed", "proven",
  "secret", "exclusive", "easy", "simple", "fast", "love", "save", "results",
  "amazing", "incredible",
];

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

  const checks: TrendCheck[] = [
    { name: "Conversational Tone", passed: /\byou\b|your|you're|you'll|you've/i.test(text) },
    { name: "Short-Form Optimized", passed: avgWordsPerSentence <= 14 },
    { name: "Question Hook", passed: /^[^.!]*\?/.test(text) },
    { name: "Numeric Specificity", passed: /\d+/.test(text) },
    { name: "Emoji Integration", passed: /[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/u.test(text) },
    { name: "UGC Voice", passed: /I |me |my |I'm|I've|I was|I just/i.test(text) },
    { name: "Low-Friction CTA", passed: /free|no (credit|sign|cost)|one tap|just try|no commitment/i.test(text) },
    { name: "Social Proof", passed: /\d+\s*(million|k|thousand|users|people|reviews|downloads)/i.test(text) },
  ];

  const passed = checks.filter((c) => c.passed).length;
  const score = Math.round((passed / checks.length) * 100);
  return { score, checks };
}

// --- Framework Alignment ---

export function detectFrameworks(text: string): string[] {
  const matched: string[] = [];
  const lower = text.toLowerCase();

  // PAS: problem + agitate + solve pattern
  if (/problem|struggle|pain|frustrated|tired of/i.test(text) && /worse|imagine|what if|keep/i.test(text) && /solution|fix|answer|introducing|finally/i.test(text)) {
    matched.push("PAS");
  }

  // AIDA: attention + interest + desire + action
  if (/\?|stop|wait|imagine|did you know/i.test(text) && /because|here's|the truth|what makes/i.test(text) && /download|try|start|get|click|join/i.test(text)) {
    matched.push("AIDA");
  }

  // BAB: before/after contrast
  if (/before|used to|remember when|without/i.test(text) && /now|after|with|today|finally/i.test(text)) {
    matched.push("BAB");
  }

  // 4Ps: problem + promise + proof + push
  if (/problem|struggle/i.test(text) && /promise|guarantee|will/i.test(text) && /proven|result|testimonial|\d+/i.test(text)) {
    matched.push("4Ps");
  }

  // STAR: situation + task + action + result
  if (/situation|when|story/i.test(text) && /had to|needed|wanted/i.test(text) && /did|used|tried|started/i.test(text) && /result|outcome|now|finally/i.test(text)) {
    matched.push("STAR");
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
