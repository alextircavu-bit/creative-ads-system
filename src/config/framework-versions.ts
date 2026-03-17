// ============================================================
// FRAMEWORK VERSION HISTORY
// Each entry records a snapshot of the framework state at a point in time.
// Add new entries at the TOP (most recent first).
// ============================================================

export interface IFrameworkChange {
  section: string;
  description: string;
  type: "added" | "changed" | "removed" | "fixed";
}

export interface IFrameworkVersion {
  id: string;
  date: string;       // ISO date
  time: string;       // HH:MM
  label: string;      // Short version label
  summary: string;    // One-line summary
  changes: IFrameworkChange[];
}

export const FRAMEWORK_VERSIONS: IFrameworkVersion[] = [
  {
    id: "v2.1",
    date: "2026-03-17",
    time: "15:30",
    label: "UGC Batch + Body Text Fix",
    summary: "Added dedicated UGC text-overlay batch (5+5=10 creatives). Identified body text and hook tension issues.",
    changes: [
      { section: "Generation Pipeline", description: "Added UGC creative batch (Step 3b): 3 parallel Opus calls producing 5 UGC-only text-overlay creatives", type: "added" },
      { section: "Generation Pipeline", description: "Sequenced UGC after regular (3+3 not 6 parallel) to avoid API overload", type: "changed" },
      { section: "Generation Pipeline", description: "Added retry logic to callClaude: 3 attempts with exponential backoff for transient API errors", type: "added" },
      { section: "Ad Template", description: "Identified: body text must resolve hook premise, not be generic product description (TV commercial style)", type: "fixed" },
      { section: "Ad Template", description: "Identified: hooks must create UNRESOLVED tension, not state positive outcomes (resolved-state hooks)", type: "fixed" },
      { section: "Copy Quality", description: "Ban staccato AI fragment pattern: 'No X. No Y. Just Z.' — ChatGPT signature cadence", type: "added" },
      { section: "Types", description: "Added isUgcBatch?: boolean to IAdCreativeBlueprint for UI filtering", type: "added" },
      { section: "Prompts", description: "New ugcCreativesPrompt() — constrained to text-overlay, ugc-reaction, performance archetypes only", type: "added" },
    ],
  },
  {
    id: "v2.0",
    date: "2026-03-12",
    time: "00:00",
    label: "Territory Rework",
    summary: "Replaced 20 narrow emotional angles with 8 broad psychological territories. Rethought Creative Tree as exploration engine.",
    changes: [
      { section: "Territories", description: "Replaced 20 narrow emotional angles with 8 universal psychological territories (Identity Tension, Displacement Anxiety, Loss & Decay, Social Positioning, Aspiration Gap, Habit Architecture, Discovery & Revelation, Relief & Surrender)", type: "changed" },
      { section: "Creative Tree", description: "Rethought as territory EXPLORATION — each territory produces varied angles, not mechanical framework x angle matrix", type: "changed" },
      { section: "Persuasion Stack", description: "Removed product-specific techniques (Divine framing, Bold claim, Guilt hook). Now uses generic categories", type: "changed" },
      { section: "Research", description: "2AM Test reframed to 2AM State — scroll-interrupt emotional state understanding", type: "changed" },
      { section: "Context", description: "buildContext now includes featureName for V3 scenarios (product vs feature distinction)", type: "added" },
      { section: "Copy Check", description: "Tightened Loss Aversion bias regex (removed don't/won't/can't which fired on everything)", type: "fixed" },
      { section: "Territories", description: "Removed parental_instinct angle entirely (was a conclusion, not a territory)", type: "removed" },
    ],
  },
];
