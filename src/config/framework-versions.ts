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
    id: "v2.5",
    date: "2026-03-18",
    time: "14:00",
    label: "Hook-Body Bridge Architecture + Prompt Reasoning Overhaul",
    summary: "Bodies are narrative resolutions written FIRST, hooks bridge to ALL bodies. Removed bodyText from hooks. Taught reasoning not examples. Body text 5-15 words max.",
    changes: [
      { section: "Ad Template", description: "Bodies written FIRST as narrative resolutions, then hooks that bridge to ALL bodies. Any hook + any body = one coherent ad.", type: "changed" },
      { section: "Ad Template", description: "Hooks reduced from forced 5-6 to UP TO 5 — quality gate: only include if it bridges to every body", type: "changed" },
      { section: "Ad Template", description: "Bodies reduced from 2-3 to 1-2. Body text is narrative resolution (5-15 words), NOT product spec", type: "changed" },
      { section: "Ad Template", description: "Removed bodyText field from IHookVariation — bodies stay as their own array with independent swiping", type: "removed" },
      { section: "Prompts", description: "Rewrote instructions to teach REASONING patterns (how to think about bridges) instead of hardcoded example text", type: "changed" },
      { section: "Prompts", description: "Added product-hook fit check as reasoning step: feature must directly solve the hook's tension", type: "added" },
      { section: "Prompts", description: "Added hook structure variety list: confession, question, how-to, observation, incomplete thought, challenge, reframe", type: "added" },
      { section: "Prompts", description: "Explicitly banned 'no app needed' / 'without opening anything' — user MUST download the app", type: "added" },
      { section: "Sora2", description: "Non-speaking UGC clips must describe frozen emotional STATE, not speech-implying actions", type: "changed" },
      { section: "Sora2", description: "Prompt length increased to 5-8 sentences for richer video generation", type: "changed" },
      { section: "UI", description: "Fixed PhoneMockup crash when sliding bodies — added safeIndex bounds guard", type: "fixed" },
      { section: "Input", description: "Creator Brief field now restored from project history on Fill button", type: "fixed" },
      { section: "Input", description: "Previous projects now show generation timestamp", type: "added" },
    ],
  },
  {
    id: "v2.4",
    date: "2026-03-18",
    time: "12:30",
    label: "UGC Realism Overhaul + Audience DNA + Copy Quality",
    summary: "Complete overhaul of Sora2 UGC prompts to enforce raw iPhone footage. Fixed demographics to match buyer profile. Banned AI copy patterns. Boosted shock-excited archetype.",
    changes: [
      { section: "Sora2 Prompts", description: "Rewrote VISUAL PROMPT DEPTH to enforce raw iPhone footage — banned studio lighting, professional cameras, ring lights, cinematic language", type: "changed" },
      { section: "Sora2 Prompts", description: "Added BAD vs GOOD UGC prompt examples showing cinematic trash vs real phone footage", type: "added" },
      { section: "Sora2 Prompts", description: "Style tag instructions now say 'RAW PHONE FOOTAGE' not 'REALISM' — stronger directive", type: "changed" },
      { section: "Audience DNA", description: "Appearance pool: 80% white attractive, 20% Black/Hispanic Christian. NEVER Indian/Middle Eastern/Asian.", type: "changed" },
      { section: "Audience DNA", description: "Ethnicity pool weighted: 4x caucasian, 1x african-american, 1x hispanic. Removed asian, middle-eastern, mixed.", type: "changed" },
      { section: "UGC Archetypes", description: "Promoted shock-excited as staple archetype for app feature discovery — 'wait, it does THAT?' moment", type: "changed" },
      { section: "Copy Quality", description: "Expanded banned AI patterns: staccato fragments, 'No X. No Y. Just Z.', manufactured numbers ('47 times'), news headlines", type: "added" },
      { section: "Copy Quality", description: "Added read-aloud test: 'Does it sound like a person talking to a friend or a copywriter?'", type: "added" },
    ],
  },
  {
    id: "v2.3",
    date: "2026-03-18",
    time: "02:15",
    label: "Hook-Paired Body Text + Creator Brief",
    summary: "Each hook now carries its own bodyText that resolves its specific premise. Added Creator Brief input field for insider knowledge.",
    changes: [
      { section: "Ad Template", description: "Added bodyText field to each hook — resolves that hook's specific premise instead of generic product description", type: "added" },
      { section: "Ad Template", description: "Bodies array is now visual-only (screen recording descriptions). Body copy lives on hooks as bodyText.", type: "changed" },
      { section: "Prompts", description: "Updated topCreativesPrompt + ugcCreativesPrompt JSON schemas with bodyText field + good/bad examples", type: "changed" },
      { section: "Prompts", description: "Body 'text' field in bodies array marked as OPTIONAL fallback — primary copy is bodyText on hooks", type: "changed" },
      { section: "Input", description: "Added Creator Brief — optional freeform field for insider knowledge (winning angles, audience secrets, excitement)", type: "added" },
      { section: "Input", description: "Creator Brief injected into all prompts via buildContext as privileged context that overrides generic AI reasoning", type: "added" },
      { section: "Types", description: "Added creatorBrief?: string to IProjectInput, bodyText?: string to IHookVariation", type: "added" },
    ],
  },
  {
    id: "v2.2",
    date: "2026-03-18",
    time: "01:30",
    label: "V5 GPT Comparison + Face Clip Fix",
    summary: "Added V5 scenario (GPT-4o creatives for side-by-side comparison with Claude). Fixed Sora2 face clip duration rules.",
    changes: [
      { section: "Platform", description: "Added V5 scenario — mobile app form like V3, but Top Creatives + UGC generated by GPT-4o instead of Claude Opus", type: "added" },
      { section: "Platform", description: "Integrated OpenAI SDK (openai package) + callGPT() with same retry logic as callClaude()", type: "added" },
      { section: "Platform", description: "V5 loads V3 project history so user can compare same product across Claude vs GPT", type: "added" },
      { section: "Platform", description: "Added /framework page with full visual map of the system + version timeline", type: "added" },
      { section: "Platform", description: "Added changelog section on homepage", type: "added" },
      { section: "Sora2", description: "Fixed face clip duration rule: 4s for SILENT face clips only. Speaking faces (audioSource=sora2) can use 8s/12s — speech anchors coherence", type: "fixed" },
      { section: "Sora2", description: "Enforced 4s rule at JSON schema level in topCreativesPrompt (not just prose instructions)", type: "fixed" },
    ],
  },
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
