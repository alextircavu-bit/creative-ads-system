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
} from "@/config/framework-data";

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
      For the TOP 6 most relevant territories, generate one script per framework (6 territories x 5 frameworks = 30 scripts).

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

=== THE ONE TEMPLATE (this is the ONLY format we produce) ===

Every ad follows this exact structure. No exceptions. No other formats.

HOOK (text + visual as ONE UNIT — this is where ALL creative variety lives)
The first 1-5 seconds. Text overlay + visual reinforce the SAME emotion.
- The visual sets the emotional context. The text articulates it. They must match.
- Can be a question, reframe, confession, challenge, observation, social proof, or provocation
- Taps into an emotion the viewer RELATES to in connection with this product
- The viewer must think "wait, that's me" or "wait, what?"
- 5-20 words maximum.

BRIDGE (implicit — the psychological WHY)
The connection between hook and body. NOT visible as separate text.
The viewer's brain fills this in: "I feel [hook tension]... oh, THIS is how I fix it [body]"
The product makes the hook's premise LITERAL.

BODY (screen recording of the feature — CONSTANT, reusable across all hooks)
The reveal. Screen recording of the actual product feature in action.
- One plain sentence describing what the feature does, overlaid on the screen recording
- This is NOT sales copy. It's a factual description of the product experience.
- The SAME body pairs with dozens of different hooks. The body NEVER changes.
- This is where the hook's promise becomes real — the viewer sees it working.

CTA (text overlay — action, not a slogan)
"Tap below to get it" / "Download Free" / "Get It Below" / "Try It Free"
An action the viewer takes. Never a tagline.

THE DEFAULT PATTERN (proven, but not the only one):
Emotionally triggering question as hook → screen recording body showing the solution
Example: "Does anyone else open their Bible wanting to feel something and just... stare at the page?" → [screen recording of verse appearing on lockscreen]

OTHER HOOK APPROACHES (use these too — variety is critical):
- Reframe: "What if [mundane thing you already do] was [powerful new meaning]?" → body reveals it's real
- Confession: "I used to [shameful thing] every night before bed" → product as the replacement
- Challenge: "Try this for 3 days and tell me you don't feel different" → product demo
- Social proof: "My friend made me download this and now I can't stop" → product experience
- Founder: "I built this because I couldn't find..." → product as the answer
- Provocation: "Your [routine/habit] is the reason you [negative outcome]" → product as fix

=== PLATFORM VOICE ===

The SAME angle must sound different per platform. The hook's meaning stays, the voice changes.

TikTok (Spark Ads — must sound like a real user posted this, NOT an ad):
- Casual, native, how people actually talk on TikTok
- "ok but why did no one tell me about this app"
- "this app literally puts a verse on your lockscreen every hour"
- "bro I'm not even that religious but this hit different"
- Short, punchy, conversational. Lowercase energy. No polished copywriting.

Meta/Instagram (slightly older audience, more composed):
- Can be more thoughtful, slightly longer, more reflective
- "What if your lockscreen reminded you of God's word every hour?"
- "I stopped scrolling past my faith and started living it"
- Still natural, but can use complete sentences and deeper framing.

Each creative should specify its platform and the hooks MUST match that platform's voice.

=== EMOTIONAL DEPTH ===

The hook emotion must RELATE to the product and be TRIGGERING enough to stop the scroll. The right emotion depends entirely on the product and the person using it:
- A faith app might trigger guilt, longing, or spiritual hunger
- A candy brand might trigger craving, nostalgia, or indulgence
- A book app might trigger curiosity, intellectual ego, or fear of being left behind
- Don't force negative emotions where they don't fit. Don't force positive ones either. Follow the product.

Ask: WHO is this person, and what do they FEEL in relation to this product? Use THAT emotion.

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
2. Write 5-6 HOOK VARIATIONS — same emotional territory, different psychological levers and sentence structures.
   - Each hook must have 2-3 visualSuggestions: the visual that plays BEHIND the hook text. It must convey the SAME emotion as the text — they are one unit.
   - The visual can be UGC (person reacting), scenery/mood, screen content, or anything that serves the hook's emotion.
   - Good: "UGC — person excitedly showing their phone screen" / "Peaceful nature scenery, golden hour light" / "Someone scrolling mindlessly, visibly bored"
   - Bad: Visuals disconnected from the hook text's emotion
3. Write 2-3 BODY VARIATIONS — different ways to plainly describe the SAME product feature.
   - The body resolves the hook's tension. It's factual, not poetic.
   - The visual is the screen recording / product demo. Describe what the viewer sees.
4. One CTA — action verb only.

QUALITY RULES:
- Each creative must target a DIFFERENT emotional territory. No two creatives hitting the same emotion.
- Hooks are NATURAL FLOWING SENTENCES. How a person talks, texts, or thinks internally. NOT staccato fragments. NOT triplet lists. NOT AI-sounding copy.
- Stay in the product's world. Faith app = faith/scripture/God language. Calorie app = food/body/eating language. Don't drift into generic self-improvement.
- NO fake statistics ("97% of people..."). NO quotation-mark emphasis. NO exclamation marks.
- Every hook must pass the "would I actually think this?" test. If it sounds like ad copy, rewrite it.
- NO PROXY EMBARRASSMENT. Never use children, family members, friends, or partners as the source of shame/guilt. "My daughter asked why I never read the Bible" is fabricated — the person scrolling is ALONE. The emotion must come from WITHIN the viewer, not from a fictional third party judging them. The private truth is always more powerful than an invented scene.
- Visual suggestions describe the viewer's PSYCHOLOGICAL STATE, not a physical scene. Abstract enough to inspire a media buyer, specific enough to evoke emotion.
- Use at least 3 different hook STRUCTURES across the 5 creatives (question, reframe, confession, challenge, social proof, founder, provocation)
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
      "scenario": "the specific daily moment this ad intercepts (1 sentence)",
      "productionStyle": "spark ad (TikTok) or polished native (Meta)",
      "targetSegment": "emotional angle name for broad products, segment name for specific buyers",
      "hooks": [
        {
          "text": "the hook text (5-20 words) — MUST match the platform voice",
          "angle": "which psychological lever this pulls",
          "visualSuggestions": ["visual that reinforces the same emotion as the hook text — they are one unit"]
        }
      ],
      "bodies": [
        { "text": "plain feature description (1 sentence — what it does, not why it matters)", "visual": "what the screen recording shows" }
      ],
      "cta": { "text": "Tap Below to Get It" },
      "whyThisScript": "1-2 sentences: why this angle + emotion + hook pattern will convert for this product"
    }
  ]
}

CRITICAL:
1. You are a CREATIVE ENGINE. Generate original concepts using the deep dive intelligence.
2. Each creative must explore a DIFFERENT emotional territory.
3. Hooks must feel like real human thoughts, not advertising copy. TikTok = casual native voice. Meta = composed but still human.
4. ALL creatives use the same format: text hook → screen recording body → text CTA. No other formats.
5. The body is the SAME product feature across all creatives. Only the hook changes.
6. Return ONLY valid JSON. No markdown, no code fences.`;
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
