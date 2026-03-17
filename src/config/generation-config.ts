/**
 * Generation Configuration
 *
 * Defines model, token limits, and temperature settings for each generation section.
 */

import { CLAUDE_MODELS } from "./constants";
import { ESectionType } from "./enums";

/**
 * Configuration for a single generation section
 */
export interface ISectionConfig {
  /** Maximum tokens to generate */
  tokens: number;
  /** Claude model to use */
  model: string;
  /** Temperature for generation (0-1, lower = more deterministic) */
  temperature: number;
}

/**
 * Section-specific generation configurations
 *
 * - PsycheMap: Structured psychology analysis (Sonnet for speed + structure)
 * - SalesPlaybook: Structured sales frameworks (Sonnet for speed + structure)
 * - Research: Creative research & avatar (Opus for depth)
 * - CreativeTree: Scripts across 8 territories (Opus for creativity)
 * - TopCreatives: Final ad blueprints (Opus for quality)
 */
export const SECTION_CONFIGS: Record<ESectionType, ISectionConfig> = {
  [ESectionType.PsycheMap]: {
    tokens: 6000,
    model: CLAUDE_MODELS.SONNET,
    temperature: 0.4,
  },
  [ESectionType.SalesPlaybook]: {
    tokens: 8000,
    model: CLAUDE_MODELS.SONNET,
    temperature: 0.4,
  },
  [ESectionType.Research]: {
    tokens: 5000,
    model: CLAUDE_MODELS.OPUS,
    temperature: 0.4,
  },
  [ESectionType.CreativeTree]: {
    tokens: 12000,
    model: CLAUDE_MODELS.OPUS,
    temperature: 0.4,
  },
  [ESectionType.TopCreatives]: {
    tokens: 8000,
    model: CLAUDE_MODELS.OPUS,
    temperature: 0.4,
  },
  [ESectionType.All]: {
    tokens: 8000,
    model: CLAUDE_MODELS.OPUS,
    temperature: 0.4,
  },
};

/**
 * Section generation step definitions for UI display
 */
export interface ISectionStep {
  key: string;
  label: string;
  description: string;
}

/**
 * Ordered list of generation sections with UI labels
 */
export const SECTION_STEPS: ISectionStep[] = [
  {
    key: ESectionType.PsycheMap,
    label: "Psychology",
    description: "Mapping brain regions & cognitive profiles...",
  },
  {
    key: ESectionType.SalesPlaybook,
    label: "Sales Strategy",
    description: "Building value equation & sales frameworks...",
  },
  {
    key: ESectionType.Research,
    label: "Research",
    description: "Creating shadow avatar & audience intel...",
  },
  {
    key: ESectionType.CreativeTree,
    label: "Scripts",
    description: "Generating scripts across 8 psychological territories...",
  },
  {
    key: ESectionType.TopCreatives,
    label: "Ads",
    description: "Crafting 5 complete ad blueprints...",
  },
];
