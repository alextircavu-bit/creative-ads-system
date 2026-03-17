/**
 * Centralized Constants
 *
 * All application constants should be defined here.
 * Naming convention: UPPER_SNAKE_CASE
 */

/**
 * API endpoints
 */
export const API_ENDPOINTS = {
  BASE: "/api",
  GENERATE: "/api/generate",
  ANALYZE_COPY: "/api/analyze-copy",
  SORA2_BRIEF: "/api/sora2-brief",
} as const;

/**
 * Anthropic Claude model identifiers
 */
export const CLAUDE_MODELS = {
  OPUS: "claude-opus-4-20250514",
  SONNET: "claude-sonnet-4-20250514",
} as const;

/**
 * Database table names
 */
export const DB_TABLES = {
  PROJECTS: "projects",
} as const;

/**
 * Generation default values
 */
export const GENERATION_DEFAULTS = {
  MAX_RETRIES: 3,
  TIMEOUT_MS: 120000,  // 2 minutes
  BATCH_SIZE: 2,
  PARALLEL_SECTIONS: 3,  // psycheMap, salesPlaybook, research run in parallel
} as const;

/**
 * Copy check scoring thresholds
 */
export const COPY_CHECK_THRESHOLDS = {
  READING_EASE: {
    EXCELLENT: 80,
    GOOD: 60,
    FAIR: 40,
  },
  PERSUASION_SCORE: {
    EXCELLENT: 80,
    GOOD: 60,
    FAIR: 40,
  },
  BIAS_SCORE: {
    HIGH: 70,
    MEDIUM: 40,
    LOW: 20,
  },
} as const;

/**
 * UI layout constants
 */
export const UI_CONFIG = {
  MAX_PROJECT_HISTORY: 50,
  DEFAULT_CREATIVES_PER_GENERATION: 5,
  ADDITIONAL_CREATIVES_PER_BATCH: 5,
} as const;

/**
 * Sora2 configuration
 */
export const SORA2_CONFIG = {
  MAX_CLIP_DURATION: 12,  // seconds
  MIN_CLIP_DURATION: 4,   // seconds
  DEFAULT_ASPECT_RATIO: "9:16",
} as const;

/**
 * Animation and timing constants
 */
export const ANIMATION_CONFIG = {
  PROGRESS_BAR_INTERVAL_MS: 100,
  TOAST_DURATION_MS: 3000,
  DEBOUNCE_DELAY_MS: 300,
} as const;
