// ============================================================
// PROMPTS - Hybrid Architecture
// The FRAMEWORK is hardcoded (user's IP). Claude ONLY personalizes
// content within that framework for the specific product.
// ============================================================

import type { ProjectInput, PsycheMapData, SalesPlaybookData, ResearchData, CreativeTreeData, CreativeFeedback } from "@/types/creative";
import {
  EMOTIONAL_ANGLES,
  FRAMEWORKS,
  BRAIN_REGIONS,
  COGNITIVE_PROFILES,
  COGNITIVE_BIASES,
  DOPAMINE_TYPES,
  HABIT_LOOPS,
  AWARENESS_LEVELS,
  CIALDINI_WEAPONS,
  PERSUASION_STACK,
  RETARGETING_FUNNEL,
  PLATFORMS,
  RESEARCH_TECHNIQUES,
  SHADOW_AVATAR_STEPS,
  AVATAR_TRAIT_LABELS,
  PAIN_PLEASURE_MAPPINGS,
  NLP_TECHNIQUES,
  NLP_STACK_STRATEGY,
  NLP_KEY_PRINCIPLE,
  SORA2_STYLE_TAGS,
} from "@/config/framework-data";
import { UGC_ARCHETYPES, UGC_APPEARANCE_POOL, UGC_ENVIRONMENT_POOL } from "@/config/ugc-archetypes";

function buildContext(input: ProjectInput): string {
  const base = `Product: ${input.productName}\nDescription: ${input.productDescription}`;
  if (input.scenario === "v3") {
    return `${base}\nType: Mobile App\nFeature Being Marketed: ${input.featureName || "N/A"}\nApp Features: ${input.appFeatures || "N/A"}\nApp Benefits: ${input.appBenefits || "N/A"}\nApp Purpose: ${input.appPurpose || "N/A"}`;
  }
  return `${base}\nTarget Audience: ${input.targetAudience || "N/A"}\nUSP: ${input.uniqueSellingPoint || "N/A"}`;
}

// ============================================================
// 1. PSYCHE MAP - Generated FIRST
// ============================================================

export function psycheMapPrompt(input: ProjectInput): string {
  const regionsJSON = BRAIN_REGIONS.map((r) => ({
    id: r.id, name: r.name, x: r.x, y: r.y, r: r.r, role: r.role, color: r.color,
  }));

  return `You are a neuromarketing expert. I'm giving you a framework CATALOG — the structure of what to analyze. Your job is to ANALYZE this specific product, SCORE every element for relevance, and PERSONALIZE all content.

${buildContext(input)}

=== FRAMEWORK CATALOG (analyze and score for this product) ===

Brain Regions (positions and colors are FIXED — you decide which are ACTIVE):
${JSON.stringify(regionsJSON, null, 2)}

Cognitive Profiles (pick the BEST FIT for this product):
${JSON.stringify(COGNITIVE_PROFILES, null, 2)}

Dopamine Architecture Templates (pick the best fit or customize):
${JSON.stringify(DOPAMINE_TYPES, null, 2)}

Habit Loop Templates (pick the best fit or customize):
${JSON.stringify(HABIT_LOOPS, null, 2)}

Cognitive Biases (score each for relevance to this product):
${JSON.stringify(COGNITIVE_BIASES, null, 2)}

Pain/Pleasure Reference Categories (use as inspiration — generate product-specific ones):
${JSON.stringify(PAIN_PLEASURE_MAPPINGS, null, 2)}

Persuasion Stack Layers (FIXED structure):
${JSON.stringify(PERSUASION_STACK, null, 2)}

=== YOUR TASK ===

Analyze ${input.productName} deeply. For each element, decide relevance and score based on the actual product — not keyword matching.

{
  "brainRegions": [
    For EACH region, keep id/name/x/y/r/role/color exactly as given. YOU decide:
    - "active": true/false — does this region meaningfully activate for ${input.productName}? Think about the actual user psychology, not surface keywords.
    - "description": "Why this region fires (or doesn't) for ${input.productName}"
    - "adTip": "Specific ad strategy targeting this brain region"
  ],

  "cognitiveProfile": {
    Pick the BEST cognitive profile from the catalog. Keep name/mechanism/difficulty/conversionPotential from your chosen profile. Add:
    "emoji": "single emoji",
    "color": "css color matching the profile",
    "description": "Deep explanation of how ${input.productName} exploits this mechanism",
    "retentionRisk": "What could cause users to stop using ${input.productName}"
  },

  "dopamine": {
    Pick the best dopamine template or customize. Include trigger, triggerPct, schedule, schedulePct, anticipation, retention, retentionPct.
    Adjust the PERCENTAGES if your analysis suggests different values than the template defaults.
  },

  "biases": [
    Score ALL 15 biases for relevance to ${input.productName}. Include the TOP 7-10 most relevant ones (strength > 60). For each:
    - "name": bias name, "strength": 0-100 (YOUR score based on product analysis), "color": from catalog
    - "description": "How this bias applies to ${input.productName}"
    - "example": "Actual ad copy example exploiting this bias"
  ],

  "habitLoop": {
    "cue": "specific daily cue for ${input.productName}",
    "routine": "what the user does",
    "reward": "the reward they get"
  },

  "persuasionStack": [
    For EACH layer, keep num/name/timeRange/color/techniques from catalog. Add:
    - "description": "How to apply this layer specifically for ${input.productName}"
  ],

  "painPleasure": {
    "pains": ["5 product-specific pain points — draw from the reference categories or create new ones based on your analysis"],
    "pleasures": ["5 product-specific pleasure points"]
  },

  "audiencePosition": {
    "axis": "where this audience clusters on a psychological axis",
    "insight": "detailed insight about audience bias clustering"
  }
}

CRITICAL: Return ONLY valid JSON. No markdown, no code fences. Keep layout data (x/y/r/color) from the catalog. All SCORES and ACTIVE flags come from YOUR analysis.`;
}

// ============================================================
// 2. SALES PLAYBOOK - Generated SECOND (receives Psyche Map)
// ============================================================

export function salesPlaybookPrompt(input: ProjectInput, psycheMapData?: PsycheMapData): string {
  const psycheContext = psycheMapData
    ? `\n=== PSYCHE MAP CONTEXT (from previous analysis) ===
Cognitive Profile: ${psycheMapData.cognitiveProfile.name} (${psycheMapData.cognitiveProfile.mechanism})
Top Biases: ${psycheMapData.biases.slice(0, 5).map((b) => `${b.name} (${b.strength})`).join(", ")}
Active Brain Regions: ${psycheMapData.brainRegions.filter((r) => r.active).map((r) => r.name).join(", ")}
Pain Points: ${psycheMapData.painPleasure.pains.join("; ")}
Dopamine Trigger: ${psycheMapData.dopamine.trigger}
`
    : "";

  return `You are a world-class sales strategist. I'm giving you a framework CATALOG. Your job is to ANALYZE this product, SCORE every element, and PERSONALIZE all content.

${buildContext(input)}
${psycheContext}
=== FRAMEWORK CATALOG (analyze and score for this product) ===

Hormozi Value Equation dimensions:
- Dream Outcome (0-100): How transformative is the promised result?
- Perceived Likelihood (0-100): How believable is it that this delivers?
- Time Delay (0-100, 100 = instant): How fast does the user see results?
- Effort/Sacrifice (0-100, 100 = zero effort): How easy is it to use?

Awareness Levels:
${JSON.stringify(AWARENESS_LEVELS, null, 2)}

Cialdini 6 Weapons:
${JSON.stringify(CIALDINI_WEAPONS, null, 2)}

Belfort Straight Line dimensions:
- Product Certainty (0-100): How confident is the buyer that the product works?
- Seller Certainty (0-100): How much do they trust the brand/seller?
- Action Threshold (0-100): How low is the barrier to take action?

Retargeting Funnel:
${JSON.stringify(RETARGETING_FUNNEL, null, 2)}

NLP Techniques (5 techniques with power ratings):
${JSON.stringify(NLP_TECHNIQUES.map((t) => ({ id: t.id, name: t.name, color: t.color, power: t.power, definition: t.definition, copyExamples: t.copyExamples, adApplication: t.adApplication })), null, 2)}

NLP Stack Strategy:
${JSON.stringify(NLP_STACK_STRATEGY, null, 2)}

NLP Key Principle: "${NLP_KEY_PRINCIPLE}"

Objection Mapping:
Every product has 3-5 core buyer objections that silently kill conversions. These are the reasons someone sees the ad, feels interest, but doesn't act. Your job is to surface these objections and show how hooks/body can preemptively neutralize them.

Market Sophistication (Eugene Schwartz, 5 levels):
1. New Opportunity — market hasn't seen this type of product. Lead with the CLAIM. "This app puts Bible verses on your lockscreen."
2. Enlarged Claim — competitors exist but claims haven't been pushed. Lead with BIGGER/BETTER claim. "Every hour, a new verse. Automatically."
3. Mechanism — claims are exhausted. Lead with HOW it works. "AI-selected verses based on your reading history."
4. Enlarged Mechanism — mechanisms are known. Lead with a UNIQUE mechanism. "The only app that syncs verse themes to your prayer journal."
5. Identity/Experience — market is saturated. Lead with STORY and IDENTITY. "I stopped saying I'd read my Bible and started living it."
The level determines what KIND of hook converts, not just what it says.

Purchase Context:
How the product is sold calibrates ad intensity. A free app download needs soft CTAs ("try it"). A $299 course needs hard conviction-building. Impulse purchases need urgency. Considered purchases need trust. This directly affects hook aggression, CTA wording, and body framing.

Demand Temperature:
How much existing desire/awareness exists for this product in the market. This is NOT about message saturation (that's Market Sophistication) — this is about whether people already WANT what you're selling or if you need to CREATE the want.
- LOW: Nobody's searching for this. You must manufacture desire through relatable scenarios. Hooks CANNOT lead with the product — they lead with emotion/scenario and let the product reveal itself. Heavy bridge work needed. (e.g., lockscreen Bible verses — nobody wakes up wanting this)
- MEDIUM: People know the problem but aren't actively shopping for this solution. Bridge from their existing desire to your product. (e.g., calorie tracker — people want to eat better but aren't comparing apps)
- HIGH: People are actively looking. Product sells itself. Lead with features, social proof, comparisons. Minimal bridge needed. (e.g., iPhone case — people are already searching)

=== YOUR TASK ===

Analyze ${input.productName} and generate a JSON object. YOU decide all scores based on deep analysis of the product — not keyword matching.

{
  "valueEquation": {
    "dreamOutcome": { "score": YOUR_SCORE (0-100), "text": "analysis for ${input.productName}" },
    "perceivedLikelihood": { "score": YOUR_SCORE, "text": "analysis" },
    "timeDelay": { "score": YOUR_SCORE, "text": "analysis" },
    "effortSacrifice": { "score": YOUR_SCORE, "text": "analysis" }
  },

  "awarenessLevels": [
    For EACH of the 5 levels, keep level/name/color/strategy as base, and generate:
    - "description": "what this user thinks about ${input.productName}"
    - "adStrategy": "specific strategy for this level"
    - "exampleHook": "actual hook copy"
    - "bestFor": "audience type"
    - "relevance": YOUR_SCORE (0-100 based on product fit)
  ],

  "cialdiniWeapons": [
    For EACH of the 6 weapons, keep name/icon and generate:
    - "color": "#hex matching the weapon",
    - "description": "how this principle works for ${input.productName}",
    - "application": "how to apply it",
    - "scriptExample": "actual ad script line",
    - "power": YOUR_SCORE (0-100 — how powerful is this weapon for THIS specific product?)
  ],

  "straightLine": {
    "product": { "score": YOUR_SCORE (0-100), "text": "analysis", "tactics": ["4 specific tactics"] },
    "seller": { "score": YOUR_SCORE, "text": "analysis", "tactics": ["4 specific tactics"] },
    "action": { "score": YOUR_SCORE, "text": "analysis", "tactics": ["4 specific tactics"] }
  },

  "hso": {
    "hooks": ["3 hook examples for ${input.productName}"],
    "stories": ["3 story examples"],
    "offers": ["3 offer examples"]
  },

  "retargetingFunnel": [
    For EACH stage (Cold/Warm/Hot), keep stage/emoji/frequency/emotions/biases/format from the framework, and generate:
    - "name": the stage name,
    - "color": "#hex",
    - "icon": emoji,
    - "frequency": from framework,
    - "audience": "who this targets for ${input.productName}",
    - "description": "strategy description",
    - "bestEmotions": comma-separated from framework emotions,
    - "biasStack": comma-separated from framework biases,
    - "creativeFormat": from framework format,
    - "example": "actual ad copy for this stage"
  ],

  "closingTechniques": [
    Generate 4 closing techniques from sales masters (Ziglar, Carnegie, Belfort, Brunson), each with:
    - "name": technique name,
    - "source": author,
    - "book": book title,
    - "description": "how it works",
    - "scriptExample": "actual script for ${input.productName}"
  ],

  "system1Triggers": [
    3 System 1 (fast/intuitive) triggers, each with: "trigger", "description", "tip" personalized for ${input.productName}
  ],

  "system2Triggers": [
    3 System 2 (slow/rational) triggers, each with: "trigger", "description", "tip" personalized for ${input.productName}
  ],

  "nlp": {
    "techniques": [
      For EACH of the 5 NLP techniques, keep id/name/color/power/definition/copyExamples/adApplication from the catalog, and ADD:
      - "productExample": "A specific ad copy example applying this NLP technique to ${input.productName}. Must be ready-to-use copy."
    ],
    "stackStrategy": [
      For EACH of the 5 stack steps, keep step/technique, and generate:
      - "script": "The actual ad script line for ${input.productName} that implements this NLP step"
    ],
    "keyPrinciple": "${NLP_KEY_PRINCIPLE}"
  },

  "objectionMap": [
    Generate 3-5 core buyer objections. These are the silent conversion killers — the reasons someone sees the ad, feels interest, but doesn't act. Each:
    - "objection": "The exact thought in the buyer's head (e.g., 'I'll just forget about it after a week')"
    - "killMechanism": "How this objection kills the sale (e.g., 'delays action until motivation fades')"
    - "hookCounter": "A hook angle that preemptively neutralizes this objection"
    - "bodyCounter": "How the product feature/body can address this"
  ],

  "marketSophistication": {
    "level": YOUR_SCORE (1-5 based on how saturated this market is),
    "name": "the level name from the framework",
    "description": "Why ${input.productName} is at this sophistication level — what has the market already seen?",
    "hookStrategy": "What KIND of hook converts at this level (benefit-led, mechanism-led, story-led, identity-led)",
    "avoidance": "What NOT to do — what the market is tired of seeing"
  },

  "purchaseContext": {
    "priceModel": "how ${input.productName} monetizes (free + IAP, subscription, one-time, freemium)",
    "pricePoint": "approximate price or range",
    "purchaseType": "impulse | considered | habitual",
    "conversionAction": "download | subscribe | purchase | sign up",
    "adIntensity": "soft | medium | hard — how aggressive should the CTA/urgency be?",
    "reasoning": "Why this calibration — e.g., 'Free app download is zero commitment, so hooks should create curiosity not urgency'"
  },

  "demandTemperature": {
    "level": "low | medium | high",
    "description": "Why ${input.productName} is at this demand level — are people actively searching for this or do you need to create the want?",
    "hookApproach": "How hooks should be structured given this demand level (scenario-first for low, bridge for medium, product-first for high)",
    "bridgeWeight": "How much implicit bridge work is needed between hook and body (heavy / moderate / minimal)"
  }
}

CRITICAL: Return ONLY valid JSON. No markdown, no code fences. All SCORES come from YOUR analysis of the product.`;
}

// ============================================================
// 3. RESEARCH - Generated THIRD (receives Psyche Map + Sales)
// User's personal methodology: "I become the person that needs
// the product in my imagination"
// ============================================================

export function researchPrompt(input: ProjectInput, psycheMapData?: PsycheMapData, salesData?: SalesPlaybookData): string {
  const previousContext = [];
  if (psycheMapData) {
    previousContext.push(`Cognitive Profile: ${psycheMapData.cognitiveProfile.name}`);
    previousContext.push(`Top Biases: ${psycheMapData.biases.slice(0, 5).map((b) => b.name).join(", ")}`);
    previousContext.push(`Pain Points: ${psycheMapData.painPleasure.pains.join("; ")}`);
    previousContext.push(`Dopamine Trigger: ${psycheMapData.dopamine.trigger}`);
  }
  if (salesData) {
    previousContext.push(`Dream Outcome Score: ${salesData.valueEquation.dreamOutcome.score}`);
    previousContext.push(`Top Cialdini Weapon: ${salesData.cialdiniWeapons.sort((a, b) => b.power - a.power)[0]?.name}`);
    previousContext.push(`Best Awareness Level: ${salesData.awarenessLevels.sort((a, b) => b.relevance - a.relevance)[0]?.name}`);
  }

  return `You are an elite ad researcher. I'm giving you a HARDCODED research methodology framework. Your job is to personalize every step for this specific product. Do NOT change the methodology - only personalize the content.

${buildContext(input)}

${previousContext.length > 0 ? `=== PREVIOUS ANALYSIS CONTEXT ===\n${previousContext.join("\n")}\n` : ""}

=== HARDCODED RESEARCH METHODOLOGY ===

This is the user's personal research methodology: "I become the person that needs the product in my imagination, then the needs and emotions come to me after becoming it and I go through multiple scenarios in which the desire of the product may arise and translate them into a hook or an actual ad that might stimulate me emotionally and trigger me."

CRITICAL CHANGE: Do NOT lock into a single avatar. The shadow avatar technique must be applied MULTIPLE TIMES - once for each distinct type of person who might want this product. Each person has different daily scenarios, different pain points, different scroll-stopping moments.

Shadow Avatar Steps (FIXED structure - personalize descriptions):
${JSON.stringify(SHADOW_AVATAR_STEPS.map((s) => ({ num: s.num, title: s.title, color: s.color })), null, 2)}

Research Techniques (FIXED names - personalize for this product):
${JSON.stringify(RESEARCH_TECHNIQUES.map((t) => ({ name: t.name, color: t.color, baseDescription: t.description })), null, 2)}

Avatar Trait Labels (FIXED): ${JSON.stringify(AVATAR_TRAIT_LABELS)}

=== BENEFIT EXPANSION ===
The product owner provides a surface-level benefit. Your job is to EXPAND it by reasoning about what the benefit IMPLIES about the person's life:
- What does using this product say about who they are or want to become?
- What daily situations make this benefit urgent or relevant?
- What adjacent benefits does the person gain that they didn't even think about?
- What identity shift happens when someone starts using this?

Example: "Track calories instantly" implies -> freedom to eat anywhere without guessing, taking control of health, becoming someone who's intentional about their body, not being the person who has no idea what they just ate, confidence at restaurants, meal prep efficiency.

Each expanded benefit thread opens up a different audience segment with different hooks.

=== YOUR TASK ===

Generate a JSON object. Keep all framework structure intact. ONLY personalize content for ${input.productName}:

{
  "shadowAvatarSteps": [
    For EACH step, keep num/title/color exactly, and ADD:
    - "description": "PERSONALIZE: How to do this step specifically for ${input.productName}'s audience. Do NOT describe one person - describe the PROCESS of becoming multiple types of people who need this product. What scenarios arise for each?"
  ],

  "searchQueries": [
    Generate 12-16 REAL searchable queries across platforms (TikTok, Facebook, Instagram, YouTube, Reddit) specific to ${input.productName}'s niche. Each with:
    - "platform": platform name
    - "query": exact search query
    - "why": why this query reveals audience insights
  ],

  "researchTechniques": [
    For EACH of the 5 techniques, keep name/color, and generate:
    - "description": "PERSONALIZE: how to apply this for ${input.productName}"
    - "steps": ["5 actionable steps specific to ${input.productName}"]
  ],

  "avatarTraits": [
    For EACH trait label (${AVATAR_TRAIT_LABELS.join(", ")}), generate:
    - "label": the trait label
    - "value": "PERSONALIZE: describe the RANGE across segments, not one person. E.g. Age: '18-24 gym culture / 30-45 health-conscious parents / 50+ doctor-recommended'"
  ],

  "audienceSegments": [
    Generate 5 audience segments as a HIERARCHY from broadest/most obvious to narrowest/most niche.

    START WITH THE OBVIOUS. Ask yourself: what is the #1 most common reason a normal person downloads/buys this product? That's segment 1. It should be the largest, most universal audience. Do NOT skip the obvious to sound clever.

    HIERARCHY ORDER (you MUST follow this structure):
    1. THE OBVIOUS ONE - the biggest, most common reason anyone would want this. The segment that makes you say "duh, obviously." Highest volume, easiest to target. (e.g., for a calorie app = people trying to lose weight)
    2. THE SHAME/PAIN-DRIVEN ONE - the segment motivated by something they're struggling with or ashamed of. These people have the HIGHEST intent because they're in active pain. What private struggle does this product address? (e.g., for a bible app = people fighting temptation; for a calorie app = people who've lost control of their eating)
    3. THE SECOND BIGGEST - the next most common use case after the obvious. Still large, slightly more specific. (e.g., gym/fitness people tracking macros)
    4. THE LIFESTYLE SEGMENT - a medium-sized group defined by a life situation or identity shift. (e.g., busy parents trying to feed their family better)
    5. THE UNEXPECTED ANGLE - a segment most advertisers miss. Could be a goldmine. Think: what weird, non-obvious reason would someone want this? (e.g., people with social anxiety about eating out)

    For ${input.productName}, ground each segment in REAL daily moments. When in their day does the need arise? What are they doing right before they'd want this?

    Each segment:
    - "name": short name reflecting their MOTIVATION, not demographics. Keep it simple and real - not overly creative names.
    - "description": 1-2 sentences: who they are and the daily moment that triggers need. Start with "Recommended #[rank] -"
    - "demographics": age, gender, location patterns
    - "psychographics": values, fears, desires, daily habits
    - "predictedROI": "high" | "medium" | "low"
    - "acquisitionCost": "low" | "medium" | "high"
    - "lifetimeValue": "high" | "medium" | "low"
    - "conversionLikelihood": 0-100
    - "bestAngle": the specific hook angle for THIS segment. Not a category - a real hook direction.
    - "adStrategy": how to reach and convert THIS segment
    - "color": hex color for UI

    These are HYPOTHESES to validate through ad testing. Rank 1 gets tested first because it has the highest predicted volume and conversion.
  ],

  "benefitExpansion": {
    "surfaceBenefit": "the product owner's stated benefit, verbatim from the description",
    "expandedThreads": [
      "PERSONALIZE: 5-7 deeper benefit threads derived from the surface benefit. Each thread is a different implication about the person's life, identity, daily routine, or emotional state. These become the RAW MATERIAL for ad hooks.",
      "Thread 2: what does using this product say about who they want to become?",
      "Thread 3: what daily frustration does this eliminate?",
      "Thread 4: what shame or guilt does this address?",
      "Thread 5: what identity shift happens when they start using this?"
    ],
    "identityShift": "PERSONALIZE: In one sentence, who does this person become after adopting this product? The before→after identity transformation."
  },

  "preCreativeChecklist": ["10 checklist items specific to ${input.productName} that must be verified before creating ads"]
}

CRITICAL: Return ONLY valid JSON. No markdown, no code fences. The shadow avatar steps and research techniques represent a real creative methodology - respect its structure.`;
}

// ============================================================
// 4. CREATIVE TREE - Generated LAST (receives ALL previous data)
// This is the OUTPUT - the amalgamation of all psychology,
// sales, and research insights for maximum ad performance.
// ============================================================

export function creativeTreePrompt(
  input: ProjectInput,
  psycheMapData?: PsycheMapData,
  salesData?: SalesPlaybookData,
  researchData?: ResearchData,
): string {
  // Build rich context from ALL previous sections
  const contextParts: string[] = [];

  if (psycheMapData) {
    contextParts.push(`=== PSYCHE MAP DATA ===
Cognitive Profile: ${psycheMapData.cognitiveProfile.name} - ${psycheMapData.cognitiveProfile.description}
Mechanism: ${psycheMapData.cognitiveProfile.mechanism}
Active Brain Regions: ${psycheMapData.brainRegions.filter((r) => r.active).map((r) => `${r.name} (${r.role})`).join(", ")}
Top Biases: ${psycheMapData.biases.slice(0, 7).map((b) => `${b.name} [${b.strength}] - ${b.description}`).join("\n")}
Dopamine: ${psycheMapData.dopamine.trigger} (${psycheMapData.dopamine.triggerPct}%) | Schedule: ${psycheMapData.dopamine.schedule} (${psycheMapData.dopamine.schedulePct}%)
Pain Points: ${psycheMapData.painPleasure.pains.join(" | ")}
Pleasure Points: ${psycheMapData.painPleasure.pleasures.join(" | ")}
Habit Loop: Cue: ${psycheMapData.habitLoop.cue} → Routine: ${psycheMapData.habitLoop.routine} → Reward: ${psycheMapData.habitLoop.reward}`);
  }

  if (salesData) {
    contextParts.push(`=== SALES PLAYBOOK DATA ===
Value Equation: Dream ${salesData.valueEquation.dreamOutcome.score} | Likelihood ${salesData.valueEquation.perceivedLikelihood.score} | Time ${salesData.valueEquation.timeDelay.score} | Effort ${salesData.valueEquation.effortSacrifice.score}
Top Cialdini Weapons: ${salesData.cialdiniWeapons.sort((a, b) => b.power - a.power).slice(0, 3).map((w) => `${w.name} [${w.power}]`).join(", ")}
Straight Line: Product ${salesData.straightLine.product.score} | Seller ${salesData.straightLine.seller.score} | Action ${salesData.straightLine.action.score}
Best Awareness Levels: ${salesData.awarenessLevels.sort((a, b) => b.relevance - a.relevance).slice(0, 2).map((l) => `${l.name} (${l.relevance})`).join(", ")}
HSO Hooks: ${salesData.hso.hooks.join(" | ")}
System 1 Triggers: ${salesData.system1Triggers.map((t) => t.trigger).join(", ")}
Closing Techniques: ${salesData.closingTechniques.map((t) => t.name).join(", ")}`);
  }

  if (researchData) {
    const segmentContext = researchData.audienceSegments?.length
      ? `\nAudience Segments (ranked by predicted ROI):\n${researchData.audienceSegments.map((s, i) => `${i + 1}. ${s.name} (${s.demographics}) - ${s.predictedROI} ROI, ${s.conversionLikelihood}% conversion, best angle: ${s.bestAngle}`).join("\n")}`
      : "";
    contextParts.push(`=== RESEARCH DATA ===
Avatar: ${researchData.avatarTraits.map((t) => `${t.label}: ${t.value}`).join(" | ")}${segmentContext}
Key Insights: ${researchData.shadowAvatarSteps.map((s) => s.description).join(" → ")}
Pre-Creative Checklist: ${researchData.preCreativeChecklist.slice(0, 5).join("; ")}`);
  }

  const anglesJSON = EMOTIONAL_ANGLES.map((a) => ({
    id: a.id,
    name: a.name,
    mechanism: a.mechanism,
    color: a.color,
  }));

  const frameworksJSON = FRAMEWORKS.map((f) => ({
    id: f.id,
    name: f.name,
    abbreviation: f.abbreviation,
    color: f.color,
    steps: f.steps,
  }));

  return `You are an elite ad creative strategist. You have access to COMPLETE psychological, sales, and research analysis from previous sections. Your job is to EXPLORE psychological territories and produce ad copy that is deeply informed by all preceding analysis.

${buildContext(input)}

${contextParts.join("\n\n")}

=== PSYCHOLOGICAL TERRITORIES (broad spaces to explore) ===

These are NOT conclusions — they are TERRITORIES. Each territory contains many possible angles, hooks, and emotional directions. Your job is to explore what each territory MEANS for this specific product and its audience.

${JSON.stringify(anglesJSON, null, 2)}

Example: "Identity Tension" for a faith app could produce:
- "I used to be someone who prayed every morning"
- "I keep calling myself a Christian but my screen time says otherwise"
- "The person I want to be reads Scripture. The person I am scrolls TikTok."
One territory, three completely different hooks — because it's a SPACE, not a conclusion.

Copywriting Frameworks (tools, not rigid columns):
${JSON.stringify(frameworksJSON, null, 2)}

Platforms: ${PLATFORMS.join(", ")}

=== YOUR TASK ===

Using ALL the data above (biases, dopamine triggers, pain/pleasure points, Cialdini weapons, awareness levels, avatar traits, value equation), EXPLORE each territory for this product and generate copy that stacks psychological factors.

Generate a JSON object:
{
  "emotionalAngles": [
    For EACH territory above, keep id/name/mechanism/color, and ADD:
    - "relevanceScore": 0-100 (how rich is this territory for ${input.productName}? A territory with many possible angles scores high.)
  ],

  "frameworks": [
    For EACH framework, keep id/name/abbreviation/color, and ADD:
    - "description": "PERSONALIZE: how this framework best serves ${input.productName}"
  ],

  "scripts": {
    "<territory.id>": [
      For the TOP 3 most relevant territories, generate one script per framework (3 territories x 5 frameworks = 15 scripts). Then for the NEXT 3 territories, generate just ONE script each using the best-fit framework (3 more = 18 total).

      TWO-PHASE PROCESS for each script:

      PHASE 1 — TERRITORY EXPLORATION: Pick a specific ANGLE within this territory that fits the framework. Then write the script as the framework NATIVELY works. PAS as a real PAS (problem, agitate, solution — full copy). AIDA as real AIDA. Don't constrain to any ad format yet. Write it as if it were a sales letter, landing page, email — whatever the framework was designed for. This is the RAW copywriting.

      PHASE 2 — DISTILLATION: Extract the CORE PSYCHOLOGICAL EFFECT. What does this script DO to the reader? What emotion does it trigger? What tension does it create? Distill that into a hook (5-20 words) and a body (one plain sentence describing the feature).

      IMPORTANT: Each script within the SAME territory should explore a DIFFERENT angle of that territory. Don't repeat the same hook direction across frameworks — the frameworks are tools to approach the territory from different psychological angles.

      {
        "frameworkId": "the framework id",
        "steps": [
          { "label": "native", "type": "full", "text": "PHASE 1: The full native copywriting execution. Name the specific angle within the territory you're exploring. 3-6 sentences." },
          { "label": "effect", "type": "mechanism", "text": "PHASE 2: The core psychological effect — what emotion, tension, or reframe does this create? One sentence." },
          { "label": "hook", "type": "attention|problem|before|situation", "text": "The distilled hook — 5-20 words. This is what stops the scroll." },
          { "label": "body", "type": "solution|after|desire|result", "text": "The product resolution (one sentence). Plainly describes the feature." }
        ],
        "hooks": ["5 alternative hook lines — each explores a DIFFERENT angle within this same territory. Natural flowing sentences, not fragments."]
      }
    ]
  },

  "platformFormats": [
    For EACH platform (${PLATFORMS.join(", ")}), generate 4-6 format recommendations that make sense for THIS specific product and audience. Don't use generic trend names ("Oh no audio", "trending sound") — describe production STRUCTURES that serve this product's emotional territory.
    {
      "platform": "platform name",
      "formats": [
        { "type": "short format name (2-4 words)", "description": "How to execute this format for ${input.productName} — specific enough for a media buyer to produce" }
      ]
    }
  ]
}

CRITICAL RULES:
1. Territories are SPACES to explore, not conclusions to state. Each territory should produce varied, surprising angles.
2. Hooks must exploit the top biases (${psycheMapData ? psycheMapData.biases.slice(0, 3).map((b) => b.name).join(", ") : "detected biases"})
3. Every piece of copy must be informed by the psychological + sales + research data above
4. Copy must be word-for-word ready for a media buyer
5. The 5 alternative hooks per script should each explore a DIFFERENT direction within the territory — not 5 rewrites of the same idea
6. Return ONLY valid JSON. No markdown, no code fences.`;
}

// ============================================================
// 5. TOP CREATIVES - Creative Engine
// Uses ALL deep dive data as intelligence. Creative Tree provides
// angle relevance scores and psychological mapping, but Top Creatives
// generates its own ad concepts from scratch using that intelligence.
// ============================================================

export function topCreativesPrompt(
  input: ProjectInput,
  psycheMapData?: PsycheMapData,
  salesData?: SalesPlaybookData,
  researchData?: ResearchData,
  creativeTreeData?: CreativeTreeData,
  feedback?: CreativeFeedback,
  existingCreatives?: { name: string; emotion: string; targetSegment?: string; hookTexts: string[] }[],
): string {
  // === DEEP DIVE INTELLIGENCE ===
  const contextParts: string[] = [];

  if (psycheMapData) {
    contextParts.push(`=== PSYCHOLOGY ===
Profile: ${psycheMapData.cognitiveProfile.name} — ${psycheMapData.cognitiveProfile.description || psycheMapData.cognitiveProfile.mechanism}
Biases (ranked): ${psycheMapData.biases.slice(0, 7).map((b) => `${b.name} [${b.strength}]${b.description ? ` — ${b.description}` : ""}`).join("\n  ")}
Pain points: ${psycheMapData.painPleasure.pains.join(" | ")}
Pleasure points: ${psycheMapData.painPleasure.pleasures.join(" | ")}
Dopamine: ${psycheMapData.dopamine.trigger} (${psycheMapData.dopamine.triggerPct}%) → ${psycheMapData.dopamine.schedule}
Habit loop: ${psycheMapData.habitLoop.cue} → ${psycheMapData.habitLoop.routine} → ${psycheMapData.habitLoop.reward}`);
  }

  if (salesData) {
    const topCialdini = salesData.cialdiniWeapons.sort((a, b) => b.power - a.power).slice(0, 3);
    const topAwareness = salesData.awarenessLevels.sort((a, b) => b.relevance - a.relevance).slice(0, 2);
    const objections = salesData.objectionMap?.map((o) => `"${o.objection}" → counter: ${o.hookCounter}`).join("\n  ") || "N/A";
    const sophLevel = salesData.marketSophistication;
    const purchCtx = salesData.purchaseContext;
    contextParts.push(`=== SALES INTELLIGENCE ===
Value Equation: Dream ${salesData.valueEquation.dreamOutcome.score} | Likelihood ${salesData.valueEquation.perceivedLikelihood.score} | Speed ${salesData.valueEquation.timeDelay.score} | Effort ${salesData.valueEquation.effortSacrifice.score}
Top Cialdini: ${topCialdini.map((w) => `${w.name} [${w.power}] — ${w.application || ""}`).join("\n  ")}
Best awareness levels: ${topAwareness.map((l) => `${l.name}: ${l.adStrategy}`).join("\n  ")}
HSO hooks: ${salesData.hso.hooks.join(" | ")}
System 1 triggers: ${salesData.system1Triggers.map((t) => t.trigger).join(", ")}
NLP techniques: ${salesData.nlp?.techniques?.map((t) => `${t.name} [${t.power}] — ${t.productExample || t.adApplication}`).join("\n  ") || "N/A"}
${sophLevel ? `Market Sophistication: Level ${sophLevel.level} "${sophLevel.name}" — ${sophLevel.hookStrategy}\n  Avoid: ${sophLevel.avoidance}` : ""}
${purchCtx ? `Purchase Context: ${purchCtx.priceModel} (${purchCtx.pricePoint}) | ${purchCtx.purchaseType} purchase | Ad intensity: ${purchCtx.adIntensity}\n  ${purchCtx.reasoning}` : ""}
${salesData.demandTemperature ? `Demand Temperature: ${salesData.demandTemperature.level.toUpperCase()} — ${salesData.demandTemperature.hookApproach}\n  Bridge weight: ${salesData.demandTemperature.bridgeWeight}` : ""}
${salesData.objectionMap?.length ? `Buyer Objections to Neutralize:\n  ${objections}` : ""}`);
  }

  if (researchData) {
    const segments = researchData.audienceSegments?.slice(0, 5) || [];
    contextParts.push(`=== RESEARCH ===
Avatar: ${researchData.avatarTraits.map((t) => `${t.label}: ${t.value}`).join(" | ")}
${segments.length > 0 ? `Segments (ranked):\n${segments.map((s, i) => `  ${i + 1}. "${s.name}" — ${s.description}\n     Best angle: ${s.bestAngle} | ROI: ${s.predictedROI} | Conv: ${s.conversionLikelihood}%`).join("\n")}` : ""}
${researchData.benefitExpansion ? `Benefit expansion:\n  Surface: ${researchData.benefitExpansion.surfaceBenefit}\n  Threads: ${researchData.benefitExpansion.expandedThreads.join("\n  ")}\n  Identity shift: ${researchData.benefitExpansion.identityShift}` : ""}`);
  }

  // === CREATIVE TREE INTELLIGENCE (angles + relevance, NOT scripts to copy) ===
  if (creativeTreeData) {
    const sortedAngles = [...creativeTreeData.emotionalAngles].sort((a, b) => b.relevanceScore - a.relevanceScore);
    const topAngles = sortedAngles.slice(0, 8);
    contextParts.push(`=== CREATIVE TREE INTELLIGENCE ===
Top emotional angles (by relevance):
${topAngles.map((a) => `  ${a.name} [${a.relevanceScore}] — ${a.mechanism}`).join("\n")}
Use these angles as INSPIRATION. You are NOT limited to them — if you see a stronger angle from the psychology/research data, use it.`);
  }

  return `You are an elite performance creative strategist who creates ads that stop thumbs and convert. You have DEEP psychological intelligence about this product's audience. Use it ALL.

${buildContext(input)}

${contextParts.join("\n\n")}

=== AD STRUCTURE ===

Every ad has 3 visual parts + CTA:

HOOK (the person / scene — this is where ALL creative variety lives)
- VISUAL: A person on camera, a scene, a setting. NOT the product yet.
  Text-overlay: scenic vista, category anchor, dramatic footage.
  VO+caption: talking head, podcast set, street interview, confession to camera, reaction.
- COPY: Text on screen (text-overlay) OR voiceover + caption (VO+caption).
- PURPOSE: Stop the scroll. The viewer thinks "wait, that's me" or "wait, what?"
- 5-20 words for text. VO scripts: 15-30 words.

BRIDGE (the psychological WHY — connects hook tension to product resolution)
- The bridge is NOT a separate visual section. It lives in the TRANSITION between hook and body.
- For VO+caption: the bridge is in the voiceover script. The last sentence of the hook VO or first sentence of the body VO must EXPLICITLY connect the emotional tension to the product.
- For text-overlay: the bridge is in the body text — it must answer WHY the product resolves the hook's tension.
- WITHOUT a bridge, the hook and body feel like two unrelated ads stitched together.

THE BRIDGE TEST: Read the hook, then read the body. Does the viewer understand WHY this product solves the problem the hook raised? If not, the bridge is missing.

Examples of GOOD bridges:
  Hook: "My kids think this is normal" (parent worried about generational faith loss)
  BAD body: "Scripture appears on your lockscreen every hour" (how does a lockscreen verse fix my kids not praying?)
  GOOD bridge via VO: "...so I started putting Scripture where I couldn't ignore it. Now my kids see me reading God's word — not just talking about it."
  The bridge connects "kids think this is normal" → "I need to model faith" → "this makes Scripture visible in my daily life" → "my kids see it too."

  Hook: "I used to set my alarm early to read my Bible"
  Bridge: "Then I found this thing that meets me where I already am."
  Body: "It puts a verse on your lockscreen every hour."
  The bridge connects "I tried and failed at discipline" → "this removes the effort" → "here's how."

Different hooks need different bridges because different emotional tensions resolve differently:
  - Guilt hook → bridge must show how the product removes the source of guilt
  - Curiosity hook → bridge must deliver the reveal
  - Identity hook → bridge must show the identity shift the product enables
  - Fear hook → bridge must show how the product eliminates the threat

BODY (the product experience — CONSTANT, reusable across all hooks)
- VISUAL: Screen recording / product demo / app in action. The visual CUTS from the person/scene to the product.
  This is always the product being used. The viewer sees the feature working.
- COPY: One plain sentence describing what the feature does.
  VO+caption: voiceover CONTINUES over the product footage (same speaker, same breath).
  The narrator describes what the viewer is seeing on screen. The VO must include the bridge — it can't just jump to "here's the feature."
- PURPOSE: Resolve the hook's tension THROUGH the bridge. The viewer thinks: "I feel [hook emotion]... oh, THAT'S why this fixes it... and here's how it works."

CTA — action verb only. "Tap below to get it" / "Download Free" / "Try It Free"

THE VISUAL CUT is what makes ads work:
  Hook: person talking to camera about their struggle → Bridge in VO → Body: cut to app showing the solution
  Hook: scenic vista with text question → Body text bridges to feature → Screen recording of the feature
  The voiceover (when present) is ONE CONTINUOUS FLOW across this visual cut. The bridge lives in the flow.

=== DELIVERY MODES ===

Each creative must specify ONE delivery mode. MIX these across the 5 creatives:

"text-overlay" — Text appears on screen only. No speaking voice. Silent scroll format.
  Best for: scenic visuals, screen recordings, dramatic footage, category anchors.
  Hook "text" = the full on-screen hook (5-20 words). No voiceoverScript needed.

"voiceover-caption" — A person SPEAKS the copy + a short caption appears on screen.
  Best for: UGC reactions, street interviews, authority staging, talking head, confessions, story-driven hooks.
  This is where COPYWRITING FRAMEWORKS COME ALIVE. The voiceoverScript is ONE CONTINUOUS NARRATION across hook + body. It covers the ENTIRE ad.

  TOTAL AD DURATION: 15-30 seconds. This is the sweet spot. Never exceed 30s.

  TIMING MATH (Hemingway method — short sentences, natural pauses):
  - Speaking pace: ~2.2 words/second (NOT 2.5 — account for ElevenLabs pauses, breaths, emphasis)
  - Hook VO: 15-30 words = 7-14 seconds. This is the emotional setup.
  - Body VO: 10-20 words = 5-9 seconds. This narrates over the product demo.
  - CTA: 2-3 seconds.
  - TOTAL WORD COUNT for entire VO (hook + body): 25-50 words MAX. Count your words.

  Hook "voiceoverScript" = what the person says during the hook (15-30 words). Short, punchy, conversational. Every word earns its place.
  Hook "text" = short caption summary on screen (5-15 words, the distilled punch).
  Body "voiceoverScript" = what the narrator says over the product demo (10-20 words). Continues naturally from hook VO.
  Body "text" = short on-screen text describing the feature.

  Example (BibleChat, confession framework, ~32 words total = ~15s):
    Hook voiceoverScript: "I used to set my alarm early to read my Bible. Every morning I'd scroll instead. Then I found something that meets me where I already am." (bridge: "meets me where I already am" connects failure→effortless solution)
    Hook text: "I set my alarm to read Scripture. I scrolled instead."
    Body voiceoverScript: "Now a verse just appears on my lockscreen every hour. I don't even have to try." (resolves: no discipline needed)
    Body text: "Scripture appears on your lockscreen automatically"
    Notice: the bridge lives in the last hook sentence + first body sentence. The transition is seamless.

Choose the delivery mode that SERVES the visual hook style. A street interview is voiceover-caption. A scenic vista with text is text-overlay. A person confessing to camera is voiceover-caption. A talking head reacting is voiceover-caption.

=== VISUAL HOOK STYLES ===

The visual hook is what STOPS THE SCROLL before the text even registers. Think like a clip farmer: what footage would you source or film for this product?

For each hook, choose a visual style that makes sense for THIS product and THIS emotion. Here are known archetypes — but you are NOT limited to these. If you invent a style that doesn't fit these categories, use type "dynamic".

KNOWN VISUAL HOOK TYPES:
- "authority-staging": Borrow credibility from a recognizable context. Podcast set (implies someone important is speaking), news desk, lecture hall, professional setting. The viewer assumes authority before reading a word. Works for: products that need credibility, expert-adjacent positioning.
- "scenic-interrupt": A beautiful or captivating vista that stops the thumb. Mountain, ocean, golden hour, rain on glass. The beauty earns 2 seconds of attention while the text hook lands. Works for: reflective/spiritual products, lifestyle brands, aspiration hooks.
- "category-anchor": Show the THING the viewer already has feelings about. A bible for a faith app. Food close-up for a calorie tracker. A gym for a fitness app. The visual triggers existing associations. Works for: products tied to a physical object or activity the audience cares about.
- "routine-window": Place the product in a daily moment the viewer recognizes as theirs. Waking up and checking phone. Commuting on the train. Getting into bed. Lunch break scroll. The viewer sees their own life. Works for: habit-forming products, low-demand products that need to CREATE need by showing integration.
- "social-curiosity": Street interviews, reactions, "what did this person say?" format. The viewer wants to hear the answer. Works for: products with social proof, surprising benefits, or polarizing hooks.
- "narrative-animation": Animated or illustrated storytelling. Signals "this is a story, not an ad." Lowers ad resistance. Works for: complex products, story-driven hooks, abstract concepts.
- "ugc-reaction": A real person on camera with a specific behavioral energy. The person IS the hook — their face, their reaction, their moment.
  HOW TO THINK ABOUT UGC: Take the product's core benefit or feature → imagine the MOMENT a real person experiences it → what does their face do? What do they say? That reaction IS the ad.
  Examples: Calorie tracker → person scans their work lunch, eyes widen: "wait, there's 40g of protein in this?" (shock-excited). Bible app → person caught scrolling at 2am, pauses, sees a verse appear on lockscreen (caught-guilty → relief). Fitness app → person steps on scale after 2 weeks, slow nod, quiet smile (skeptic-converted).
  UGC is NOT limited to "wow" products. Every product has a moment where the user FEELS something — surprise, guilt, relief, curiosity, calm. That feeling is the archetype. See UGC PERFORMANCE ARCHETYPES below for 14 specific behavioral energies.
  Works for: literally any product. The question is never "does UGC fit?" — it's "which human moment fits?"
- "dramatic-reenactment": Acted-out relatable scenario. Skit, POV, mini-drama. Person in the situation the hook describes. Works for: relatable pain points, confession hooks, challenge hooks.
- "product-in-context": Product being used in its natural environment. Works for: physical products, consumables, utility products.
- "dynamic": A style you invented that doesn't fit the above. Name it and describe it.

HOW TO REASON ABOUT VISUAL HOOK STYLE:
1. What does THIS audience scroll past every day? What would make THEM stop?
2. What visual context makes the hook text MORE believable or MORE emotional?
3. What footage would a media buyer actually source or film for this?
4. The visual and text/voice must convey the SAME emotion — they are one unit.
5. For VO+Caption: the visual and voiceover script are TIGHTLY COUPLED. What the person says must sync with what the viewer sees. "I used to set my alarm early to read my Bible" plays over footage of someone hitting snooze. "I found this app" plays over the person picking up their phone. Think of it as a storyboard — each beat of the script has a matching visual beat.
6. VARY styles across hooks. Don't use the same visual style for every hook in a creative.
7. Before choosing a visual style for each hook, you MUST mentally evaluate ALL 10 types against this specific hook's emotion and delivery mode. Ask for each: "Would this style make the hook more believable and stop the scroll?" Then pick the one that scores highest. Don't skip styles because they feel unconventional — a podcast set or street interview might outperform a scenic vista for the right hook. The visual style must SERVE the hook's psychological mechanism.

=== PLATFORM VOICE ===

The SAME angle must sound different per platform. The hook's meaning stays, the voice changes.

TikTok (Spark Ads — must sound like a real user posted this, NOT an ad):
- How people ACTUALLY talk on TikTok. Not how a copywriter thinks they talk.
- "ok but why did no one tell me about this"
- "I literally have three Bible apps and don't open any of them"
- "bro I set my alarm to pray and hit snooze every single time"
- "this is the only thing that actually made me read Scripture again"
- Short, specific, confessional. Real details, not abstract concepts. Lowercase energy.

Meta/Instagram (slightly older audience, more composed):
- More thoughtful, slightly longer, but STILL concrete and specific. No metaphors.
- "I kept saying I'd start reading my Bible again. It's been two years."
- "My daughter asked me why we don't pray anymore. I didn't have an answer."
- "I used to read a chapter every morning. Now I can't get through a verse."
- Complete sentences, real situations, specific details. NOT poetic reframing.

Each creative should specify its platform and the hooks MUST match that platform's voice.

=== EMOTIONAL DEPTH ===

The hook emotion must RELATE to the product and be TRIGGERING enough to stop the scroll. The right emotion depends entirely on the product and the person using it:
- A faith app might trigger guilt, longing, or spiritual hunger
- A candy brand might trigger craving, nostalgia, or indulgence
- A book app might trigger curiosity, intellectual ego, or fear of being left behind
- Don't force negative emotions where they don't fit. Don't force positive ones either. Follow the product.

DEPTH is what matters — regardless of whether the emotion is positive or negative:
- SHALLOW (bad): "Want to read more books?" — generic, nobody stops for this
- MEDIUM: "I keep adding books to my list and never opening them" — specific, relatable
- DEEP (good): "I used to be the person who always had something interesting to say" — identity loss, visceral

PLATFORM AD POLICIES — you CAN use negative emotions and uncomfortable truths:
- Banned/flagged words: "porn", "lust", "sex", "addiction", "addict", "suicide", "kill"
- The CONCEPTS behind those words are your most powerful tools. Use implication.
- "That thing you do every night that you promised yourself you'd stop" = powerful AND policy-safe
- "I" perspective ("I can't stop...") is safer than "you" accusations ("You're addicted to...")

=== NLP IN COPY ===

Weave these into hooks naturally (don't label them, just USE them):
- PRESUPPOSITION: "When did you stop feeling close to God?" (presupposes they did feel close)
- REFRAMING: Transform the product from "app" to "daily anchor" or "morning reset"
- PATTERN INTERRUPT: Break expected scroll patterns with unexpected framing
- ANCHORING: Link the product to an emotion they already have ("that peace you felt as a kid")
- DISSOCIATION: "The version of you that [does the bad thing] vs the version that [uses product]"

=== BUYER SPECIFICITY ===

For BROAD IDENTITY products (faith, wellness, self-improvement):
→ Vary creatives by EMOTIONAL ANGLE, not demographics. Same person, different pain points.
→ Don't over-segment. A faith app user could be 18 or 65. The EMOTION is the targeting.

For SPECIFIC BUYER products (B2B, niche tools, professional software):
→ Vary creatives by AUDIENCE SEGMENT. Different people, different use cases.

${(() => {
    if (!feedback) return "";
    const parts: string[] = ["=== FEEDBACK (do NOT repeat these issues) ==="];
    if (feedback.hookIssues?.length) parts.push(`Hooks: ${feedback.hookIssues.join("; ")}`);
    if (feedback.bodyIssues?.length) parts.push(`Bodies: ${feedback.bodyIssues.join("; ")}`);
    if (feedback.segmentIssues?.length) parts.push(`Segments: ${feedback.segmentIssues.join("; ")}`);
    if (feedback.ctaIssues?.length) parts.push(`CTAs: ${feedback.ctaIssues.join("; ")}`);
    if (feedback.generalNotes?.length) parts.push(`General: ${feedback.generalNotes.join("; ")}`);
    return parts.join("\n") + "\n";
  })()}
${(() => {
    if (!existingCreatives?.length) return "";
    const lines = existingCreatives.map((c, i) =>
      `${i + 1}. "${c.name}" — ${c.emotion}, ${c.targetSegment || "n/a"}: ${c.hookTexts.slice(0, 2).map((h) => `"${h}"`).join(", ")}`
    );
    return `=== ALREADY GENERATED (create DIFFERENT ones) ===
${lines.join("\n")}
Start ranking from ${existingCreatives.length + 1}. Use different angles, emotions, and hook structures than those listed above.
`;
  })()}
=== YOUR TASK ===

Generate 5 ad creative blueprints. Each is a COMPLETE, production-ready ad concept.

FOR EACH CREATIVE:
1. Choose an emotional angle informed by the intelligence above (you can combine angles or find new ones the data implies).
2. Choose a DELIVERY MODE (text-overlay or voiceover-caption). Mix across creatives.
3. Write 5-6 HOOK VARIATIONS — same emotional territory, different psychological levers, sentence structures, AND visual styles.
   - Each hook MUST have a visualStyle with type, name, and description (what footage to source/film).
   - Each hook MUST have 2-3 visualSuggestions. These are SORA2 CLIPS that get stitched together.
     IMPORTANT — each visualSuggestion must include:
     • "idea": what the viewer sees in this clip (1 sentence summary)
     • "prompt": RICH Sora2 scene description (see VISUAL PROMPT DEPTH below)
     • "clipDuration": "4s" | "8s" | "12s" (Sora2 only generates these lengths)
     The clips stitch together to cover the hook duration. E.g., a 12s hook = one 12s clip OR one 8s + one 4s clip.
   - The visual style and hook text must convey the SAME emotion. They are one unit.
   - VARY visual styles across hooks. Don't use the same visual style for every hook.
   - The visual style must make sense with the bridge to the body.
4. Write 2-3 BODY VARIATIONS — different ways to plainly describe the SAME product feature.
   - Body visual is ALWAYS real screen recording / product footage. NOT Sora2 generated.
   - For VO+caption: the voiceover continues from the hook (same speaker). It narrates what the viewer sees on screen.
5. One CTA — action verb only.

=== PRODUCTION PIPELINE ===

Every ad is assembled from 3 layers: visual, audio, text.

AUDIO SOURCE depends on the hook's visual style — set "audioSource" per hook:

"sora2" — Person speaks ON CAMERA in the Sora2 clip.
  Use when: authority-staging (podcast), social-curiosity (street interview), ugc-reaction, dramatic-reenactment — any style where a person is visibly talking.
  Sora2 prompt MUST include the dialogue/speech (it generates the person's voice).
  The voiceoverScript = what the person says in the Sora2 clip.
  Body: screen recording. Body VO is either a DIFFERENT ElevenLabs voice narrating the product, or NO voiceover (just text overlay on the screen recording).

"elevenlabs" — No person speaking on camera. ElevenLabs VO covers the entire ad.
  Use when: scenic-interrupt, category-anchor, routine-window, narrative-animation, product-in-context — any style where there's no visible speaker.
  Sora2 prompt is VISUAL ONLY (no dialogue/speech).
  The voiceoverScript = ElevenLabs audio track, laid over the footage.
  Body: screen recording + ElevenLabs VO continues (same speaker, same breath).

VISUAL LAYER: Sora2 clips (hook) + screen recording (body, always real footage).
TEXT LAYER: Caption overlay, burned onto video.

=== SORA2 STYLE TAG CATALOG ===
Pick 3-6 tags per visual suggestion. These tell Sora2 HOW to render the footage.
THE GOAL IS REALISM. Every clip must look indistinguishable from real footage — like someone actually filmed it on their phone, in a real studio, on a real street. NOT AI showcase material. No fireworks, no impossible camera moves, no hyperreal lighting. The viewer should never think "this looks AI generated."
The video DESCRIPTION is king — it conveys the emotion and message. The style tags just ensure the rendering looks real and matches how this scene would actually be captured in the real world.
${SORA2_STYLE_TAGS.map(c => `${c.category.toUpperCase()}: ${c.tags.join(", ")}`).join("\n")}

=== UGC PERFORMANCE ARCHETYPES ===

For ugc-reaction hooks, you MUST select a performance archetype. Each defines specific behavioral energy — not just "UGC reaction" but a precise emotional state + physical behavior for Sora2.

ARCHETYPES (pick one per UGC hook, select one emotion + one action from its arrays):
${UGC_ARCHETYPES.map(a => `${a.id} [${a.arousal}] — ${a.description} | emotions: ${a.emotion.join(", ")} | actions: ${a.action.join(", ")}${a.environmentOverrides ? ` | env-override: ${a.environmentOverrides.join("; ")}` : ""}`).join("\n")}

APPEARANCE (match to Research audience DNA when available, otherwise vary):
${Object.entries(UGC_APPEARANCE_POOL).map(([k, v]) => `${k}: ${v.join(", ")}`).join(" | ")}

ENVIRONMENTS (random from pool, or use archetype env-override if listed):
${UGC_ENVIRONMENT_POOL.join(" | ")}

For each UGC hook, output "ugcArchetype" (the ID) and "ugcPromptParams": { archetype, emotion, action, environment, appearance: { ageRange, gender, ethnicity, build, style, hair, details } }. Use these params to write the rich Sora2 scene description below.

=== VISUAL PROMPT DEPTH ===

The "prompt" field on each visualSuggestion is the most important field. It becomes the direct input to Sora2 video generation. BLAND PROMPTS = BLAND VIDEO.

Think like a cinematographer writing shot notes. Every prompt must answer:
1. WHO — specific person description (age range, build, skin tone, hair, expression, wardrobe). Real people, not models. Bags under eyes, messy hair, wrinkled clothes.
2. WHERE — specific environment with LIVED-IN details (background clutter, worn surfaces, mixed lighting, real objects). Not a set.
3. HOW IT'S CAPTURED — exact camera/device (iPhone 15 Pro front camera, Sony FX3 with 35mm, webcam), camera behavior (handheld micro-shake, locked tripod, slow breathing drift), focus behavior.
4. LIGHT — primary source, secondary source, imperfections (mixed color temps, uneven coverage, hot spots, blown highlights).
5. MOTION — what the subject does physically (micro-behaviors: adjusting position, glancing away, half-smile, rubbing neck). Subtle, realistic. Not posed.
6. MOOD — the emotional register the footage carries. How it FEELS, not just what it shows.

If audioSource is "sora2" (person speaks on camera): INCLUDE the dialogue in the prompt. Describe vocal delivery (tone, pace, emotion). Time visual action to dialogue.
If audioSource is "elevenlabs": NO dialogue in the prompt. Visual only. The footage is SILENT — ElevenLabs VO is laid over in post.

UGC FACE CLIP RULES (critical for Sora2 realism):
- MAXIMUM 4s per clip with a SILENT face (text-overlay UGC where the person is NOT speaking). Sora2 cannot maintain a static expression beyond 4 seconds — it morphs, eyes drift, looks AI-generated. If the person SPEAKS on camera (audioSource="sora2"), 8s and 12s are fine — continuous speech movement anchors facial coherence.
- ONE expression per clip. Describe a single emotional state, not a transition. "She looks guilty" not "she shifts from guilt to relief." Expression transitions cause uncanny morphing.
- ONE gaze direction with one natural micro-variation. Describe a primary eye anchor with one organic break: "eyes on camera, briefly glances down." NOT fixed robot stare, NOT random wandering. One anchor + one small movement.
- Phone glow is NEVER the sole light source. Even in dark/night environments, always describe a stronger ambient source (bedside lamp, window moonlight, hallway light). Phone glow can exist but must be secondary. Without ambient fill, faces light from below = horror movie.
- Do NOT show the phone screen display in frame. Phone can be in hand but angled away, face-down, below frame, or just out of shot. Visible screens cause hand and display artifacts.
- Camera setup = how a real TikTok creator would film this. Think from the creator's perspective: propped on a nightstand for a bedroom confession, dashboard mount in the car, handheld at arm's length walking, on a tripod for a planned reaction. The setup should feel natural for the scenario — not always handheld, not always tripod. Whatever a real person would do.

PROMPT LENGTH: 3-6 sentences minimum. Each sentence adds a layer of visual specificity.

BAD prompt: "A woman sitting in bed looking at her phone at night"
GOOD prompt: "A woman in her late 20s, dark hair in a loose bun, wearing an oversized faded grey t-shirt, sitting cross-legged on an unmade bed with crumpled white sheets. Warm light from a bedside lamp on the nightstand, soft shadows across her face. Phone propped on the nightstand filming her — she looks up from her lap toward the camera with tired eyes, slight pause, a quiet look of recognition. Shot on iPhone 13 propped at eye level, slightly grainy low-light sensor noise, shallow depth of field blurring the cluttered background."

BAD prompt: "Person on a podcast set talking"
GOOD prompt: "A man in his mid-30s, short beard, wearing a navy crewneck sweater, sits behind a podcast desk with a Shure SM7B microphone on a boom arm. Warm studio lighting from a key light camera-left, soft fill from an LED panel behind. Background shows acoustic foam panels, a bookshelf with worn spines, and a half-empty coffee mug. Shot on Sony FX3 with 35mm f/1.4, shallow depth of field softening the background. He leans slightly forward, speaking directly to camera with quiet intensity — measured pace, occasional pauses between thoughts."

QUALITY RULES:
- Each creative must target a DIFFERENT emotional territory. No two creatives hitting the same emotion.
- Hooks are NATURAL FLOWING SENTENCES. How a person talks, texts, or thinks internally. NOT staccato fragments. NOT triplet lists. NOT AI-sounding copy.
- NO METAPHORS. NO POETRY. NO LITERARY LANGUAGE. Real people don't say "spiritually starving in a feast" or "drowning in a sea of distraction." They say "I own three Bibles and haven't opened one in six months" or "I set my alarm to pray and hit snooze every single time." Write how the TARGET AUDIENCE actually talks — their vocabulary, their sentence structure, their level of articulation. A 22-year-old on TikTok talks differently than a 45-year-old mom on Instagram. Match the real person, not the poet.
  BAD: "you ever realize you're spiritually starving while sitting in front of a feast?"
  GOOD: "I have every Bible app on my phone and I still don't read Scripture"
  BAD: "lost in the noise of modern life"
  GOOD: "I scroll for two hours every night and then wonder why I feel empty"
- Stay in the product's world. Faith app = faith/scripture/God language. Calorie app = food/body/eating language. Don't drift into generic self-improvement.
- NO fake statistics ("97% of people..."). NO quotation-mark emphasis. NO exclamation marks.
- Every hook must pass the "would a real person say this out loud to a friend?" test. If it sounds like a sermon, a poem, or ad copy, rewrite it in plain language.
- NO PROXY EMBARRASSMENT. Never use children, family members, friends, or partners as the source of shame/guilt. The emotion must come from WITHIN the viewer, not from a fictional third party judging them.
- NEVER imply the viewer doesn't need the app. Phrases like "no app needed", "without any app", "you don't even need to open an app" are FORBIDDEN. If the product has a widget or feature that works outside the main app (lockscreen, widget, notification), it's still PART of the app being sold. The viewer MUST download the app to get the feature. Don't undermine the product you're advertising.
- NEVER use the word "AI" or "artificial intelligence" in hooks or body copy unless the product's core value proposition IS its AI. For most products, "AI" is an implementation detail, not a selling point. Sell the OUTCOME, not the technology.
- Use at least 3 different hook STRUCTURES across the 5 creatives (question, reframe, confession, challenge, social proof, founder, provocation)
- Use at least 3 different VISUAL HOOK STYLES across the 5 creatives. Don't default to the same visual approach for every creative.
- TikTok hooks MUST sound like a real person posted it. Meta hooks can be more composed. Match the platform voice.

JSON:
{
  "creatives": [
    {
      "rank": 1,
      "name": "short concept name (2-4 words)",
      "sourceAngle": "emotional territory this targets",
      "sourceFramework": "primary psychological mechanism used (NLP technique, bias, Cialdini, etc.)",
      "emotion": "primary emotion (guilt, shame, fear, curiosity, frustration, longing, wonder, etc.)",
      "platform": "TikTok or Meta/IG (hooks MUST match platform voice)",
      "format": "9:16 vertical",
      "deliveryMode": "text-overlay | voiceover-caption",
      "scenario": "the specific daily moment this ad intercepts (1 sentence)",
      "productionStyle": "spark ad / polished native / UGC / studio — describe the production approach",
      "targetSegment": "emotional angle name for broad products, segment name for specific buyers",
      "hooks": [
        {
          "text": "on-screen text: full hook for text-overlay (5-20 words), OR short caption for VO+caption (5-15 words)",
          "audioSource": "sora2 | elevenlabs — see PRODUCTION PIPELINE above. Determines how Sora2 prompt is structured.",
          "voiceoverScript": "VO+caption ONLY (15-30 words). If sora2: what the person SAYS on camera (include in Sora2 prompt too). If elevenlabs: separate VO track. Omit for text-overlay.",
          "duration": "realistic duration. Text-overlay: '3s'. VO+caption: calculate at ~2.2 words/sec with pauses (15 words = '7s', 25 words = '11s'). Must match word count.",
          "angle": "which psychological lever this pulls",
          "ugcArchetype": "REQUIRED for ugc-reaction hooks. The archetype ID from the UGC PERFORMANCE ARCHETYPES catalog (e.g. 'shock-excited', 'caught-guilty'). Omit for non-UGC hooks.",
          "ugcPromptParams": "REQUIRED for ugc-reaction hooks. { archetype, emotion, action, environment, appearance: { ageRange, gender, ethnicity, build, style, hair, details } } — all selected from the archetype's arrays and global pools. Omit for non-UGC hooks.",
          "visualStyle": {
            "type": "authority-staging | scenic-interrupt | category-anchor | routine-window | social-curiosity | narrative-animation | ugc-reaction | dramatic-reenactment | product-in-context | dynamic",
            "name": "short human-readable name (e.g. 'Podcast Set Authority', 'Morning Routine Window')",
            "description": "what footage to source/film — specific enough for a media buyer to produce. For VO+caption: describe what's VISUALLY HAPPENING as the person speaks — the visual and script are tightly coupled."
          },
          "visualSuggestions": [
            {
              "idea": "what the viewer sees in this clip segment",
              "prompt": "RICH scene description for Sora2 (3-6 sentences). Follow VISUAL PROMPT DEPTH rules above. Must include: specific person details, environment with lived-in texture, exact camera/device, lighting sources with imperfections, physical micro-behaviors, mood. If audioSource='sora2': INCLUDE dialogue and vocal delivery. If 'elevenlabs': visual only, no speech.",
              "clipDuration": "4s | 8s | 12s (Sora2 lengths only). Clips stitch to cover hook duration. FACE RULE: If this is a SILENT face clip (text-overlay UGC where person is NOT speaking), clipDuration MUST be '4s'. If the person SPEAKS on camera (audioSource='sora2'), 8s and 12s are fine — speech anchors facial coherence.",
              "styleTags": ["Pick 3-6 tags from the SORA2 STYLE TAG CATALOG below. Choose tags that match THIS specific clip's creative intent."]
            }
          ]
        }
      ],
      "bodies": [
        {
          "text": "on-screen text: plain feature description (1 sentence)",
          "voiceoverScript": "VO+caption ONLY (10-20 words). MUST bridge from hook emotion to product — don't just describe the feature, explain WHY it resolves the hook's tension. If hook audioSource='sora2': this is a DIFFERENT ElevenLabs narrator (or omit for text-only body). If 'elevenlabs': SAME speaker continues. Omit for text-overlay.",
          "duration": "realistic duration. Text-overlay: '5s'. VO+caption: calculate at ~2.2 words/sec (10 words = '5s', 20 words = '9s').",
          "visual": "what the screen recording / product footage shows"
        }
      ],
      "cta": { "text": "Tap Below to Get It" },
      "whyThisScript": "1-2 sentences: why this angle + emotion + visual style + delivery mode will convert for this product"
    }
  ]
}

CRITICAL:
1. You are a CREATIVE ENGINE. Generate original concepts using the deep dive intelligence.
2. Each creative must explore a DIFFERENT emotional territory.
3. Hooks must feel like real human thoughts, not advertising copy. TikTok = casual native voice. Meta = composed but still human.
4. MIX delivery modes across creatives. Not everything is text-overlay. Voiceover hooks feel different from text hooks — write them accordingly.
5. MIX visual hook styles. The visual is what stops the scroll. Reason about what footage THIS audience would stop for.
6. The body is the SAME product feature across all creatives. Only the hook changes.
7. EVERY creative MUST include: hooks (5-6), bodies (2-3), and cta. Do NOT skip bodies — they are required.
8. Return ONLY valid JSON. No markdown, no code fences.`;
}

// ============================================================
// 5b. UGC TEXT-OVERLAY CREATIVES
// Dedicated batch: ALL text-overlay, ALL ugc-reaction visual style,
// ALL must pick a performance archetype. Same deep-dive intelligence.
// ============================================================

export function ugcCreativesPrompt(
  input: ProjectInput,
  psycheMapData?: PsycheMapData,
  salesData?: SalesPlaybookData,
  researchData?: ResearchData,
  creativeTreeData?: CreativeTreeData,
  feedback?: CreativeFeedback,
  existingCreatives?: { name: string; emotion: string; targetSegment?: string; hookTexts: string[] }[],
): string {
  // === DEEP DIVE INTELLIGENCE (reuse same context builder as topCreativesPrompt) ===
  const contextParts: string[] = [];

  if (psycheMapData) {
    contextParts.push(`=== PSYCHOLOGY ===
Profile: ${psycheMapData.cognitiveProfile.name} — ${psycheMapData.cognitiveProfile.description || psycheMapData.cognitiveProfile.mechanism}
Biases (ranked): ${psycheMapData.biases.slice(0, 7).map((b) => `${b.name} [${b.strength}]${b.description ? ` — ${b.description}` : ""}`).join("\n  ")}
Pain points: ${psycheMapData.painPleasure.pains.join(" | ")}
Pleasure points: ${psycheMapData.painPleasure.pleasures.join(" | ")}
Dopamine: ${psycheMapData.dopamine.trigger} (${psycheMapData.dopamine.triggerPct}%) → ${psycheMapData.dopamine.schedule}
Habit loop: ${psycheMapData.habitLoop.cue} → ${psycheMapData.habitLoop.routine} → ${psycheMapData.habitLoop.reward}`);
  }

  if (salesData) {
    const topCialdini = salesData.cialdiniWeapons.sort((a, b) => b.power - a.power).slice(0, 3);
    const topAwareness = salesData.awarenessLevels.sort((a, b) => b.relevance - a.relevance).slice(0, 2);
    const objections = salesData.objectionMap?.map((o) => `"${o.objection}" → counter: ${o.hookCounter}`).join("\n  ") || "N/A";
    const sophLevel = salesData.marketSophistication;
    const purchCtx = salesData.purchaseContext;
    contextParts.push(`=== SALES INTELLIGENCE ===
Value Equation: Dream ${salesData.valueEquation.dreamOutcome.score} | Likelihood ${salesData.valueEquation.perceivedLikelihood.score} | Speed ${salesData.valueEquation.timeDelay.score} | Effort ${salesData.valueEquation.effortSacrifice.score}
Top Cialdini: ${topCialdini.map((w) => `${w.name} [${w.power}] — ${w.application || ""}`).join("\n  ")}
Best awareness levels: ${topAwareness.map((l) => `${l.name}: ${l.adStrategy}`).join("\n  ")}
HSO hooks: ${salesData.hso.hooks.join(" | ")}
System 1 triggers: ${salesData.system1Triggers.map((t) => t.trigger).join(", ")}
NLP techniques: ${salesData.nlp?.techniques?.map((t) => `${t.name} [${t.power}] — ${t.productExample || t.adApplication}`).join("\n  ") || "N/A"}
${sophLevel ? `Market Sophistication: Level ${sophLevel.level} "${sophLevel.name}" — ${sophLevel.hookStrategy}\n  Avoid: ${sophLevel.avoidance}` : ""}
${purchCtx ? `Purchase Context: ${purchCtx.priceModel} (${purchCtx.pricePoint}) | ${purchCtx.purchaseType} purchase | Ad intensity: ${purchCtx.adIntensity}\n  ${purchCtx.reasoning}` : ""}
${salesData.demandTemperature ? `Demand Temperature: ${salesData.demandTemperature.level.toUpperCase()} — ${salesData.demandTemperature.hookApproach}\n  Bridge weight: ${salesData.demandTemperature.bridgeWeight}` : ""}
${salesData.objectionMap?.length ? `Buyer Objections to Neutralize:\n  ${objections}` : ""}`);
  }

  if (researchData) {
    const segments = researchData.audienceSegments?.slice(0, 5) || [];
    contextParts.push(`=== RESEARCH ===
Avatar: ${researchData.avatarTraits.map((t) => `${t.label}: ${t.value}`).join(" | ")}
${segments.length > 0 ? `Segments (ranked):\n${segments.map((s, i) => `  ${i + 1}. "${s.name}" — ${s.description}\n     Best angle: ${s.bestAngle} | ROI: ${s.predictedROI} | Conv: ${s.conversionLikelihood}%`).join("\n")}` : ""}
${researchData.benefitExpansion ? `Benefit expansion:\n  Surface: ${researchData.benefitExpansion.surfaceBenefit}\n  Threads: ${researchData.benefitExpansion.expandedThreads.join("\n  ")}\n  Identity shift: ${researchData.benefitExpansion.identityShift}` : ""}`);
  }

  if (creativeTreeData) {
    const sortedAngles = [...creativeTreeData.emotionalAngles].sort((a, b) => b.relevanceScore - a.relevanceScore);
    const topAngles = sortedAngles.slice(0, 8);
    contextParts.push(`=== CREATIVE TREE INTELLIGENCE ===
Top emotional angles (by relevance):
${topAngles.map((a) => `  ${a.name} [${a.relevanceScore}] — ${a.mechanism}`).join("\n")}
Use these angles as INSPIRATION. You are NOT limited to them — if you see a stronger angle from the psychology/research data, use it.`);
  }

  return `You are an elite UGC performance creative strategist. You create text-overlay ads featuring raw, authentic UGC-reaction footage. Every creative you produce uses a real person's face and reaction as the scroll-stopper.

${buildContext(input)}

${contextParts.join("\n\n")}

=== UGC-ONLY BATCH CONSTRAINTS ===

This is a DEDICATED UGC batch. Every creative MUST follow these rules:
1. deliveryMode = "text-overlay" (NO voiceover-caption in this batch)
2. ALL hooks MUST use visualStyle.type = "ugc-reaction" (NO scenic, authority, etc.)
3. EVERY hook MUST select a performance archetype and output ugcArchetype + ugcPromptParams
4. audioSource is NEVER needed (text-overlay = silent footage + text on screen)
5. voiceoverScript fields should be omitted

=== AD STRUCTURE (UGC TEXT-OVERLAY) ===

HOOK: A person on camera in a specific emotional state. Text overlaid on their footage.
- VISUAL: UGC face clip. The person IS the hook — their expression, posture, micro-behavior.
- COPY: Text on screen (5-20 words). The text and the person's expression convey the SAME emotion.
- PURPOSE: Stop the scroll. The viewer sees a real person feeling something they recognize.

BRIDGE: Lives in the body text. Must connect hook emotion to product resolution.

BODY: Screen recording of the product feature. Text overlay describes what it does.
- Always real footage. NOT Sora2 generated.
- Body text must bridge from the hook's emotional tension to the product.

CTA: Action verb only. "Tap below to get it" / "Download Free" / "Try It Free"

=== UGC PERFORMANCE ARCHETYPES ===

For EVERY hook, pick one archetype. Select one emotion + one action from its arrays. Vary archetypes across hooks and creatives.

ARCHETYPES:
${UGC_ARCHETYPES.map(a => `${a.id} [${a.arousal}] — ${a.description} | emotions: ${a.emotion.join(", ")} | actions: ${a.action.join(", ")}${a.environmentOverrides ? ` | env-override: ${a.environmentOverrides.join("; ")}` : ""}`).join("\n")}

APPEARANCE (match to Research audience DNA when available, otherwise vary):
${Object.entries(UGC_APPEARANCE_POOL).map(([k, v]) => `${k}: ${v.join(", ")}`).join(" | ")}

ENVIRONMENTS (random from pool, or use archetype env-override if listed):
${UGC_ENVIRONMENT_POOL.join(" | ")}

=== SORA2 STYLE TAG CATALOG ===
Pick 3-6 tags per visual suggestion. Goal is REALISM — indistinguishable from real phone footage.
${SORA2_STYLE_TAGS.map(c => `${c.category.toUpperCase()}: ${c.tags.join(", ")}`).join("\n")}

=== UGC FACE CLIP RULES (critical for Sora2 realism) ===
- MAXIMUM 4s per clip with a face. Sora2 cannot maintain facial coherence beyond 4 seconds.
- ONE expression per clip. Single emotional state, not a transition.
- ONE gaze direction with one natural micro-variation. One anchor + one small movement.
- Phone glow is NEVER the sole light source. Always describe a stronger ambient source.
- Do NOT show the phone screen display in frame. Phone can be in hand but angled away.
- Camera setup = how a real TikTok creator would film this. Propped on nightstand, dashboard mount, handheld at arm's length.

=== VISUAL PROMPT DEPTH ===

The "prompt" field is the direct input to Sora2. BLAND PROMPTS = BLAND VIDEO.
Every prompt must answer:
1. WHO — specific person (age, build, skin tone, hair, expression, wardrobe). Real people, not models.
2. WHERE — specific environment with LIVED-IN details (clutter, worn surfaces, mixed lighting).
3. HOW IT'S CAPTURED — exact camera/device, camera behavior, focus behavior.
4. LIGHT — primary source, secondary source, imperfections.
5. MOTION — physical micro-behaviors. Subtle, realistic. Not posed.
6. MOOD — the emotional register.
No dialogue in prompts (text-overlay = silent footage).

PROMPT LENGTH: 3-6 sentences minimum.

=== PLATFORM VOICE ===

TikTok: "ok but why did no one tell me about this" — short, confessional, lowercase energy.
Meta/IG: "I kept saying I'd start reading my Bible again. It's been two years." — composed but concrete.

=== EMOTIONAL DEPTH ===

Hook emotions must RELATE to the product and be TRIGGERING enough to stop the scroll. Follow the product's emotional world — don't force negative or positive.

DEPTH matters:
- SHALLOW (bad): "Want to read more books?" — generic
- DEEP (good): "I used to be the person who always had something interesting to say" — identity loss

=== NLP IN COPY ===

Weave naturally: presupposition, reframing, pattern interrupt, anchoring, dissociation.

${(() => {
    if (!feedback) return "";
    const parts: string[] = ["=== FEEDBACK (do NOT repeat these issues) ==="];
    if (feedback.hookIssues?.length) parts.push(`Hooks: ${feedback.hookIssues.join("; ")}`);
    if (feedback.bodyIssues?.length) parts.push(`Bodies: ${feedback.bodyIssues.join("; ")}`);
    if (feedback.segmentIssues?.length) parts.push(`Segments: ${feedback.segmentIssues.join("; ")}`);
    if (feedback.ctaIssues?.length) parts.push(`CTAs: ${feedback.ctaIssues.join("; ")}`);
    if (feedback.generalNotes?.length) parts.push(`General: ${feedback.generalNotes.join("; ")}`);
    return parts.join("\n") + "\n";
  })()}
${(() => {
    if (!existingCreatives?.length) return "";
    const lines = existingCreatives.map((c, i) =>
      `${i + 1}. "${c.name}" — ${c.emotion}, ${c.targetSegment || "n/a"}: ${c.hookTexts.slice(0, 2).map((h) => `"${h}"`).join(", ")}`
    );
    return `=== ALREADY GENERATED (create DIFFERENT ones) ===
${lines.join("\n")}
Use different angles, emotions, and archetypes than those listed above.
`;
  })()}
=== YOUR TASK ===

Generate 5 UGC text-overlay ad creative blueprints. Each is a COMPLETE, production-ready ad concept.

FOR EACH CREATIVE:
1. Choose an emotional angle informed by the intelligence above.
2. deliveryMode is ALWAYS "text-overlay". productionStyle is ALWAYS "ugc-text-overlay".
3. Write 5-6 HOOK VARIATIONS — same emotional territory, different archetypes, expressions, and text angles.
   - EVERY hook: visualStyle.type = "ugc-reaction"
   - EVERY hook: ugcArchetype (archetype ID) + ugcPromptParams (full params object)
   - EVERY hook: 2-3 visualSuggestions with clipDuration "4s" ONLY (face clips)
   - EVERY hook: rich Sora2 prompts following VISUAL PROMPT DEPTH + FACE CLIP RULES
   - VARY archetypes across hooks. Don't use the same archetype for every hook.
4. Write 2-3 BODY VARIATIONS — different ways to plainly describe the SAME product feature.
   - Body visual is ALWAYS real screen recording. NOT Sora2.
   - No voiceoverScript (text-overlay mode).
5. One CTA — action verb only.

JSON:
{
  "creatives": [
    {
      "rank": 1,
      "name": "short concept name (2-4 words)",
      "sourceAngle": "emotional territory this targets",
      "sourceFramework": "primary psychological mechanism used",
      "emotion": "primary emotion",
      "platform": "TikTok or Meta/IG",
      "format": "9:16 vertical",
      "deliveryMode": "text-overlay",
      "scenario": "the specific daily moment this ad intercepts",
      "productionStyle": "ugc-text-overlay",
      "targetSegment": "emotional angle name for broad products, segment name for specific buyers",
      "hooks": [
        {
          "text": "on-screen text (5-20 words)",
          "duration": "3s (text-overlay timing)",
          "angle": "which psychological lever this pulls",
          "ugcArchetype": "archetype ID from catalog (REQUIRED)",
          "ugcPromptParams": {
            "archetype": "archetype ID",
            "emotion": "selected emotion from archetype array",
            "action": "selected action from archetype array",
            "environment": "from pool or archetype override",
            "appearance": { "ageRange": "", "gender": "", "ethnicity": "", "build": "", "style": "", "hair": "", "details": "" }
          },
          "visualStyle": {
            "type": "ugc-reaction",
            "name": "short name describing the UGC moment",
            "description": "what the UGC footage shows — specific enough for production"
          },
          "visualSuggestions": [
            {
              "idea": "what the viewer sees",
              "prompt": "RICH Sora2 scene description (3-6 sentences). NO dialogue. Follow face clip rules.",
              "clipDuration": "4s",
              "styleTags": ["3-6 tags from catalog"]
            }
          ]
        }
      ],
      "bodies": [
        {
          "text": "on-screen text: plain feature description",
          "duration": "5s",
          "visual": "what the screen recording shows"
        }
      ],
      "cta": { "text": "Tap Below to Get It" },
      "whyThisScript": "1-2 sentences: why this angle + archetype + emotion will convert"
    }
  ]
}

CRITICAL:
1. EVERY creative is text-overlay + ugc-reaction. No exceptions.
2. EVERY hook has ugcArchetype + ugcPromptParams. No exceptions.
3. Each creative must explore a DIFFERENT emotional territory.
4. Hooks must feel like real human thoughts. TikTok = casual native voice. Meta = composed but human.
5. VARY archetypes across the 5 creatives. Use at least 4 different archetypes.
6. The body is the SAME product feature across all creatives. Only the hook changes.
7. ALL Sora2 clips are 4s (face clip rule). No 8s or 12s.
8. NO metaphors, NO poetry, NO literary language. Real talk only.
9. Return ONLY valid JSON. No markdown, no code fences.`;
}

// ============================================================
// 6. COPY CHECK - AI Deep Review (optional enhancement)
// Local algorithmic scoring handles the main analysis.
// ============================================================

export function copyCheckPrompt(input: ProjectInput, copyText: string): string {
  return `You are a senior copywriter and conversion optimization expert. Provide a DEEP qualitative review of this ad copy. Note: quantitative scoring (Flesch, grammar, bias detection, trend checks) is handled algorithmically - focus on QUALITATIVE insights only.

COPY TO ANALYZE:
"""
${copyText}
"""

PRODUCT CONTEXT:
${buildContext(input)}

Generate a JSON object:
{
  "qualitativeReview": {
    "overallImpression": "1-2 sentence expert opinion",
    "emotionalImpact": "how well does this copy trigger emotional response (1-2 sentences)",
    "targetAlignment": "how well does this speak to the target audience (1-2 sentences)",
    "uniqueness": "how differentiated is this from typical ads (1-2 sentences)"
  },
  "issues": [
    { "title": "issue name", "description": "what's wrong", "fix": "specific rewrite suggestion", "severity": "high|medium|low" }
  ],
  "frameworksMatched": ["frameworks this copy follows (PAS, AIDA, BAB, 4Ps, STAR)"],
  "rewriteSuggestion": "a complete rewritten version that scores higher on all metrics - must be genuinely better, not just different"
}

Return ONLY valid JSON. No markdown, no code fences.`;
}
