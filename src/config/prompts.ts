// ============================================================
// PROMPTS - Hybrid Architecture
// The FRAMEWORK is hardcoded (user's IP). Claude ONLY personalizes
// content within that framework for the specific product.
// ============================================================

import type { ProjectInput, PsycheMapData, SalesPlaybookData, ResearchData } from "@/types/creative";
import {
  filterRelevantAngles,
  FRAMEWORKS,
  BRAIN_REGIONS,
  filterActiveBrainRegions,
  COGNITIVE_PROFILES,
  detectFeatureTypes,
  COGNITIVE_BIASES,
  DOPAMINE_TYPES,
  HABIT_LOOPS,
  computeValueEquation,
  AWARENESS_LEVELS,
  scoreCialdiniWeapons,
  computeStraightLine,
  PERSUASION_STACK,
  RETARGETING_FUNNEL,
  PLATFORM_FORMATS,
  RESEARCH_TECHNIQUES,
  SHADOW_AVATAR_STEPS,
  AVATAR_TRAIT_LABELS,
  matchPainPleasure,
  NLP_TECHNIQUES,
  NLP_STACK_STRATEGY,
  NLP_KEY_PRINCIPLE,
} from "@/config/framework-data";
import { detectExperienceTypes, matchTemplates, EXPERIENCE_TYPE_LABELS } from "@/config/ad-templates";

function buildContext(input: ProjectInput): string {
  const base = `Product: ${input.productName}\nDescription: ${input.productDescription}`;
  if (input.scenario === "v3") {
    return `${base}\nType: Mobile App\nApp Features: ${input.appFeatures || "N/A"}\nApp Benefits: ${input.appBenefits || "N/A"}\nApp Purpose: ${input.appPurpose || "N/A"}`;
  }
  return `${base}\nTarget Audience: ${input.targetAudience || "N/A"}\nUSP: ${input.uniqueSellingPoint || "N/A"}`;
}

function getProductText(input: ProjectInput): string {
  return [input.productName, input.productDescription, input.appFeatures, input.appBenefits, input.appPurpose, input.targetAudience, input.uniqueSellingPoint]
    .filter(Boolean)
    .join(" ");
}

// ============================================================
// 1. PSYCHE MAP - Generated FIRST
// ============================================================

export function psycheMapPrompt(input: ProjectInput): string {
  const productText = getProductText(input);
  const activeRegionIds = filterActiveBrainRegions(productText);
  const featureTypes = detectFeatureTypes(productText);
  const primaryType = featureTypes[0];
  const profile = COGNITIVE_PROFILES.find((p) => p.id === primaryType) || COGNITIVE_PROFILES[COGNITIVE_PROFILES.length - 1];
  const dopamine = DOPAMINE_TYPES[primaryType] || DOPAMINE_TYPES.general;
  const { pains, pleasures } = matchPainPleasure(productText);

  const regionsJSON = BRAIN_REGIONS.map((r) => ({
    id: r.id,
    name: r.name,
    x: r.x,
    y: r.y,
    r: r.r,
    role: r.role,
    color: r.color,
    active: activeRegionIds.includes(r.id),
  }));

  const biasesJSON = COGNITIVE_BIASES
    .filter((b) => b.pattern.test(productText))
    .map((b) => ({ name: b.name, strength: b.strength, color: b.color }));

  // Include all biases but mark detected ones
  const allBiasesForPrompt = COGNITIVE_BIASES.map((b) => ({
    name: b.name,
    strength: b.strength,
    color: b.color,
    detected: b.pattern.test(productText),
  }));

  return `You are a neuromarketing expert. I'm giving you a HARDCODED framework and pre-computed data. Your ONLY job is to write personalized descriptions, ad tips, and insights for THIS specific product. Do NOT change the structure, scores, regions, or framework - only fill in the personalized text fields.

${buildContext(input)}

=== PRE-COMPUTED DATA (DO NOT CHANGE THESE VALUES) ===

Brain Regions (positions, colors, active status are FIXED):
${JSON.stringify(regionsJSON, null, 2)}

Cognitive Profile (FIXED):
Name: ${profile.name}
Mechanism: ${profile.mechanism}
Difficulty: ${profile.difficulty}
Conversion Potential: ${profile.conversionPotential}

Dopamine Architecture (FIXED percentages):
Trigger: ${dopamine.trigger} (${dopamine.triggerPct}%)
Schedule: ${dopamine.schedule} (${dopamine.schedulePct}%)
Anticipation: ${dopamine.anticipation}
Retention: ${dopamine.retention} (${dopamine.retentionPct}%)

Detected Biases (FIXED names, strengths, colors):
${JSON.stringify(biasesJSON, null, 2)}

All Biases Reference:
${JSON.stringify(allBiasesForPrompt, null, 2)}

Pain Points (base): ${JSON.stringify(pains)}
Pleasure Points (base): ${JSON.stringify(pleasures)}

Persuasion Stack Layers (FIXED):
${JSON.stringify(PERSUASION_STACK, null, 2)}

=== YOUR TASK ===

Generate a JSON object using the EXACT structure below. Keep all pre-computed values exactly as given. ONLY fill in the fields marked "PERSONALIZE":

{
  "brainRegions": [
    For EACH region above, keep id/name/x/y/r/role/color/active exactly as given, and ADD:
    - "description": "PERSONALIZE: Why this region fires (or doesn't) for ${input.productName} specifically"
    - "adTip": "PERSONALIZE: Specific ad strategy targeting this brain region for ${input.productName}"
  ],

  "cognitiveProfile": {
    "name": "${profile.name}",
    "emoji": "PERSONALIZE: single emoji",
    "color": "PERSONALIZE: css color matching the profile",
    "description": "PERSONALIZE: Deep explanation of how ${input.productName} exploits the ${profile.mechanism} mechanism",
    "mechanism": "${profile.mechanism}",
    "difficulty": "${profile.difficulty}",
    "conversionPotential": "${profile.conversionPotential}",
    "retentionRisk": "PERSONALIZE: What could cause users to stop using ${input.productName}"
  },

  "dopamine": {
    "trigger": "${dopamine.trigger}",
    "triggerPct": ${dopamine.triggerPct},
    "schedule": "${dopamine.schedule}",
    "schedulePct": ${dopamine.schedulePct},
    "anticipation": "${dopamine.anticipation}",
    "retention": "${dopamine.retention}",
    "retentionPct": ${dopamine.retentionPct}
  },

  "biases": [
    For each DETECTED bias (detected=true), keep name/strength/color and ADD:
    - "description": "PERSONALIZE: How this bias applies to ${input.productName}"
    - "example": "PERSONALIZE: Actual ad copy example exploiting this bias for ${input.productName}"
  ],

  "habitLoop": {
    "cue": "PERSONALIZE: specific daily cue for ${input.productName}",
    "routine": "PERSONALIZE: what the user does with ${input.productName}",
    "reward": "PERSONALIZE: the reward they get"
  },

  "persuasionStack": [
    For EACH layer, keep num/name/timeRange/color/techniques exactly as given, and ADD:
    - "description": "PERSONALIZE: How to apply this layer specifically for ${input.productName}"
  ],

  "painPleasure": {
    "pains": ${JSON.stringify(pains)} (refine these for ${input.productName} specifically - keep the core meaning),
    "pleasures": ${JSON.stringify(pleasures)} (refine these for ${input.productName} specifically - keep the core meaning)
  },

  "audiencePosition": {
    "axis": "PERSONALIZE: where this audience clusters on a psychological axis",
    "insight": "PERSONALIZE: detailed insight about audience bias clustering for ${input.productName}"
  }
}

CRITICAL: Return ONLY valid JSON. No markdown, no code fences. Keep ALL pre-computed values (scores, percentages, coordinates, colors) EXACTLY as provided.`;
}

// ============================================================
// 2. SALES PLAYBOOK - Generated SECOND (receives Psyche Map)
// ============================================================

export function salesPlaybookPrompt(input: ProjectInput, psycheMapData?: PsycheMapData): string {
  const productText = getProductText(input);
  const valueEq = computeValueEquation(productText);
  const cialdini = scoreCialdiniWeapons(productText);
  const straightLine = computeStraightLine(productText);

  const psycheContext = psycheMapData
    ? `\n=== PSYCHE MAP CONTEXT (from previous analysis) ===
Cognitive Profile: ${psycheMapData.cognitiveProfile.name} (${psycheMapData.cognitiveProfile.mechanism})
Top Biases: ${psycheMapData.biases.slice(0, 5).map((b) => `${b.name} (${b.strength})`).join(", ")}
Active Brain Regions: ${psycheMapData.brainRegions.filter((r) => r.active).map((r) => r.name).join(", ")}
Pain Points: ${psycheMapData.painPleasure.pains.join("; ")}
Dopamine Trigger: ${psycheMapData.dopamine.trigger}
`
    : "";

  return `You are a world-class sales strategist. I'm giving you a HARDCODED framework with pre-computed scores. Your ONLY job is to write personalized descriptions, strategies, and ad copy for THIS specific product. Do NOT change the structure or scores - only fill in the personalized text fields.

${buildContext(input)}
${psycheContext}
=== PRE-COMPUTED DATA (DO NOT CHANGE THESE VALUES) ===

Hormozi Value Equation (FIXED scores):
- Dream Outcome: ${valueEq.dream}/100
- Perceived Likelihood: ${valueEq.likelihood}/100
- Time Delay: ${valueEq.time}/100 (100 = instant)
- Effort/Sacrifice: ${valueEq.effort}/100 (100 = zero effort)

Awareness Levels (FIXED):
${JSON.stringify(AWARENESS_LEVELS, null, 2)}

Cialdini Weapons (FIXED scores):
${JSON.stringify(cialdini, null, 2)}

Belfort Straight Line (FIXED scores):
- Product Certainty: ${straightLine.product}/100
- Seller Certainty: ${straightLine.seller}/100
- Action Threshold: ${straightLine.action}/100

Retargeting Funnel (FIXED):
${JSON.stringify(RETARGETING_FUNNEL, null, 2)}

NLP Techniques (FIXED - 5 techniques with power ratings):
${JSON.stringify(NLP_TECHNIQUES.map((t) => ({ id: t.id, name: t.name, color: t.color, power: t.power, definition: t.definition, copyExamples: t.copyExamples, adApplication: t.adApplication })), null, 2)}

NLP Stack Strategy (FIXED sequence):
${JSON.stringify(NLP_STACK_STRATEGY, null, 2)}

NLP Key Principle: "${NLP_KEY_PRINCIPLE}"

=== YOUR TASK ===

Generate a JSON object. Keep all pre-computed values exactly as given. ONLY fill in personalized text:

{
  "valueEquation": {
    "dreamOutcome": { "score": ${valueEq.dream}, "text": "PERSONALIZE: analysis for ${input.productName}" },
    "perceivedLikelihood": { "score": ${valueEq.likelihood}, "text": "PERSONALIZE: analysis" },
    "timeDelay": { "score": ${valueEq.time}, "text": "PERSONALIZE: analysis" },
    "effortSacrifice": { "score": ${valueEq.effort}, "text": "PERSONALIZE: analysis" }
  },

  "awarenessLevels": [
    For EACH of the 5 levels, keep level/name/color/strategy as base, and generate:
    - "description": "PERSONALIZE: what this user thinks about ${input.productName}"
    - "adStrategy": "PERSONALIZE: specific strategy for this level"
    - "exampleHook": "PERSONALIZE: actual hook copy"
    - "bestFor": "PERSONALIZE: audience type"
    - "relevance": PERSONALIZE (0-100 based on product fit)
  ],

  "cialdiniWeapons": [
    For EACH weapon, keep name/icon/power and generate:
    - "color": "#hex matching the weapon",
    - "description": "PERSONALIZE: how this principle works",
    - "application": "PERSONALIZE: how to apply for ${input.productName}",
    - "scriptExample": "PERSONALIZE: actual ad script line",
    - "power": (keep the pre-computed score)
  ],

  "straightLine": {
    "product": { "score": ${straightLine.product}, "text": "PERSONALIZE", "tactics": ["4 specific tactics"] },
    "seller": { "score": ${straightLine.seller}, "text": "PERSONALIZE", "tactics": ["4 specific tactics"] },
    "action": { "score": ${straightLine.action}, "text": "PERSONALIZE", "tactics": ["4 specific tactics"] }
  },

  "hso": {
    "hooks": ["PERSONALIZE: 3 hook examples for ${input.productName}"],
    "stories": ["PERSONALIZE: 3 story examples"],
    "offers": ["PERSONALIZE: 3 offer examples"]
  },

  "retargetingFunnel": [
    For EACH stage (Cold/Warm/Hot), keep stage/emoji/frequency/emotions/biases/format from the framework, and generate:
    - "name": the stage name,
    - "color": "#hex",
    - "icon": emoji,
    - "frequency": from framework,
    - "audience": "PERSONALIZE: who this targets for ${input.productName}",
    - "description": "PERSONALIZE",
    - "bestEmotions": comma-separated from framework emotions,
    - "biasStack": comma-separated from framework biases,
    - "creativeFormat": from framework format,
    - "example": "PERSONALIZE: actual ad copy for this stage"
  ],

  "closingTechniques": [
    Generate 4 closing techniques from sales masters (Ziglar, Carnegie, Belfort, Brunson), each with:
    - "name": technique name,
    - "source": author,
    - "book": book title,
    - "description": "how it works",
    - "scriptExample": "PERSONALIZE: actual script for ${input.productName}"
  ],

  "system1Triggers": [
    3 System 1 (fast/intuitive) triggers, each with: "trigger", "description", "tip" personalized for ${input.productName}
  ],

  "system2Triggers": [
    3 System 2 (slow/rational) triggers, each with: "trigger", "description", "tip" personalized for ${input.productName}
  ],

  "nlp": {
    "techniques": [
      For EACH of the 5 NLP techniques, keep id/name/color/power/definition/copyExamples/adApplication exactly from the framework, and ADD:
      - "productExample": "PERSONALIZE: A specific ad copy example applying this NLP technique to ${input.productName}. Must be ready-to-use copy."
    ],
    "stackStrategy": [
      For EACH of the 5 stack steps, keep step/technique, and generate:
      - "script": "PERSONALIZE: The actual ad script line for ${input.productName} that implements this NLP step"
    ],
    "keyPrinciple": "${NLP_KEY_PRINCIPLE}"
  }
}

CRITICAL: Return ONLY valid JSON. No markdown, no code fences. Keep ALL pre-computed scores EXACTLY as provided.`;
}

// ============================================================
// 3. RESEARCH - Generated THIRD (receives Psyche Map + Sales)
// User's personal methodology: "I become the person that needs
// the product in my imagination"
// ============================================================

export function researchPrompt(input: ProjectInput, psycheMapData?: PsycheMapData, salesData?: SalesPlaybookData): string {
  const productText = getProductText(input);

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
    2. THE SECOND BIGGEST - the next most common use case. Still large, slightly more specific. (e.g., gym/fitness people tracking macros)
    3. THE LIFESTYLE SEGMENT - a medium-sized group defined by a life situation, not just interest. (e.g., busy parents trying to feed their family better)
    4. THE HIGH-VALUE NICHE - smaller audience but high intent and willingness to pay. (e.g., athletes, competitors, people with medical dietary needs)
    5. THE UNEXPECTED ANGLE - a segment most advertisers miss. Smaller but could be a goldmine if it hits. This is where creativity matters. (e.g., people with social anxiety about eating out)

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
  const productText = getProductText(input);
  const relevantAngles = filterRelevantAngles(productText);

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

  const anglesJSON = relevantAngles.map((a) => ({
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

  return `You are an elite ad creative strategist. You have access to COMPLETE psychological, sales, and research analysis from previous sections. Your job is to create the ULTIMATE Creative Tree - ad copy that is mathematically optimized based on all preceding analysis.

${buildContext(input)}

${contextParts.join("\n\n")}

=== HARDCODED FRAMEWORK (DO NOT CHANGE) ===

Emotional Angles (FIXED - these are the angles, ranked by relevance to this product):
${JSON.stringify(anglesJSON, null, 2)}

Copywriting Frameworks (FIXED):
${JSON.stringify(frameworksJSON, null, 2)}

Platform Formats (FIXED):
${JSON.stringify(PLATFORM_FORMATS, null, 2)}

=== YOUR TASK ===

Using ALL the data above (biases, dopamine triggers, pain/pleasure points, Cialdini weapons, awareness levels, avatar traits, value equation), generate ad copy that STACKS these psychological factors for maximum impact.

Generate a JSON object:
{
  "emotionalAngles": [
    For EACH angle above, keep id/name/mechanism/color, and ADD:
    - "relevanceScore": 0-100 (score based on how well this angle maps to the psyche map + sales data)
  ],

  "frameworks": [
    For EACH framework, keep id/name/abbreviation/color, and ADD:
    - "description": "PERSONALIZE: how this framework best serves ${input.productName}"
  ],

  "scripts": {
    "<angle.id>": [
      For the TOP 6 most relevant angles, generate one script per framework (6 angles x 5 frameworks = 30 scripts).
      IMPORTANT: Scripts must match the ACTIVE TEMPLATE FORMAT: Hook + Body (text overlay, 10-20 seconds total). Do NOT write long-form ad copy. Each script is a SHORT-FORM ad concept.
      {
        "frameworkId": "the framework id",
        "steps": [
          Adapt the framework steps to SHORT-FORM format. Each step = 1-2 sentences MAX.
          The framework is the STRUCTURE, but the output is a 10-20 second text overlay ad, not a long-form sales letter.
          { "label": "step label from framework", "type": "problem|agitate|solution|cta|before|after|attention|interest|desire|situation|task|action|result", "text": "SHORT text overlay copy for this step - 1-2 sentences max. This appears on screen for 2-5 seconds." }
        ],
        "hooks": ["5 hook lines (5-15 words each) that combine the emotional angle with the strongest biases and triggers from the psyche map. These are scroll-stopping text overlays, not headlines."]
      }
    ]
  },

  "platformFormats": [
    For EACH platform, keep the platform name and formats list, and ADD for each format:
    - "description": "PERSONALIZE: specific format recommendation for ${input.productName} that leverages the research insights"
  ]
}

CRITICAL RULES:
1. Every piece of copy MUST reference the psychological data from previous sections
2. Hooks must exploit the top biases (${psycheMapData ? psycheMapData.biases.slice(0, 3).map((b) => b.name).join(", ") : "detected biases"})
3. Scripts must target the strongest Cialdini weapons
4. Copy must be word-for-word ready for a media buyer
5. Return ONLY valid JSON. No markdown, no code fences.`;
}

// ============================================================
// 5. TOP 5 CREATIVES - Generated alongside Creative Tree
// ============================================================

export function topCreativesPrompt(
  input: ProjectInput,
  psycheMapData?: PsycheMapData,
  salesData?: SalesPlaybookData,
  researchData?: ResearchData,
): string {
  const productText = getProductText(input);
  const contextParts: string[] = [];

  if (psycheMapData) {
    contextParts.push(`Psychology: ${psycheMapData.cognitiveProfile.name} | Biases: ${psycheMapData.biases.slice(0, 5).map((b) => b.name).join(", ")} | Dopamine: ${psycheMapData.dopamine.trigger} | Pains: ${psycheMapData.painPleasure.pains.join(", ")}`);
  }
  if (salesData) {
    contextParts.push(`Sales: Value Eq ${salesData.valueEquation.dreamOutcome.score}/${salesData.valueEquation.perceivedLikelihood.score}/${salesData.valueEquation.timeDelay.score}/${salesData.valueEquation.effortSacrifice.score} | Cialdini: ${salesData.cialdiniWeapons.sort((a, b) => b.power - a.power).slice(0, 3).map((w) => w.name).join(", ")} | HSO Hooks: ${salesData.hso.hooks.join(" | ")}`);
  }
  if (researchData) {
    contextParts.push(`Avatar: ${researchData.avatarTraits.map((t) => `${t.label}: ${t.value}`).join(" | ")}`);
  }

  // Build segment context with full detail for creative mapping
  const segmentContext = researchData?.audienceSegments?.length
    ? researchData.audienceSegments.slice(0, 5).map((s, i) => (
      `Segment ${i + 1}: "${s.name}"
  Who: ${s.description}
  Demographics: ${s.demographics}
  Psychographics: ${s.psychographics}
  Recommended angle: ${s.bestAngle}
  Ad strategy: ${s.adStrategy}
  Predicted ROI: ${s.predictedROI} | Conversion: ${s.conversionLikelihood}%`
    )).join("\n\n")
    : "";

  // === TEMPLATE MATCHING ===
  const experienceTypes = detectExperienceTypes(productText);
  const primaryExp = experienceTypes[0];
  const matchedTemplates = matchTemplates(experienceTypes);
  const top5Templates = matchedTemplates.slice(0, 7);

  const templateContext = top5Templates.map((t, i) => (
    `${i + 1}. [${t.id}] "${t.title}" (${t.timing})
   Category: ${t.category} | Experience: ${t.experienceTypes.join(", ")}${t.proven ? " | PROVEN" : ""}
   Structure: ${t.frames.map((f) => `${f.label} (${f.time})`).join(" > ")}
   Best for: ${t.bestFor.join(", ")}
   Why it works: ${t.whyItWorks}`
  )).join("\n\n");

  // Deep dive psychological tools for hook generation
  const psycheTools: string[] = [];
  if (psycheMapData) {
    psycheMapData.biases.slice(0, 6).forEach((b) => psycheTools.push(`Bias: ${b.name} - ${b.description}`));
    psycheMapData.painPleasure.pains.forEach((p) => psycheTools.push(`Pain: ${p}`));
    psycheMapData.painPleasure.pleasures.forEach((p) => psycheTools.push(`Desire: ${p}`));
    if (psycheMapData.dopamine) psycheTools.push(`Dopamine trigger: ${psycheMapData.dopamine.trigger}`);
    if (psycheMapData.habitLoop) psycheTools.push(`Habit loop: ${psycheMapData.habitLoop.cue} > ${psycheMapData.habitLoop.routine} > ${psycheMapData.habitLoop.reward}`);
  }
  if (salesData) {
    salesData.cialdiniWeapons.sort((a, b) => b.power - a.power).slice(0, 4).forEach((w) => psycheTools.push(`Cialdini: ${w.name} - ${w.application}`));
    salesData.awarenessLevels.sort((a, b) => b.relevance - a.relevance).slice(0, 3).forEach((l) => psycheTools.push(`Awareness: ${l.name} - strategy: ${l.adStrategy}`));
    if (salesData.hso) salesData.hso.hooks.forEach((h) => psycheTools.push(`HSO Hook: ${h}`));
  }

  return `You are a senior creative director. Create 5 ad blueprints for ${input.productName}.
DELIVERY MODE FOR THIS BATCH: text-overlay (bold text on screen, no voiceover).

${buildContext(input)}

${contextParts.length > 0 ? `=== DEEP DIVE ANALYSIS ===\n${contextParts.join("\n")}\n` : ""}

=== AUDIENCE SEGMENT HIERARCHY ===
These segments are ranked by predicted impact. Each creative should target a DIFFERENT segment. The 5 creatives = 5 testable hypotheses across the audience hierarchy.

${segmentContext || "No segments available - generate creatives for broad audience."}

=== PSYCHOLOGICAL TOOLS (from deep dive) ===
Use these to craft hooks. Each tool is a lever - pull a DIFFERENT one for each hook variation:
${psycheTools.join("\n")}

=== EXPERIENCE TYPE ===
Primary: ${EXPERIENCE_TYPE_LABELS[primaryExp].name} (${EXPERIENCE_TYPE_LABELS[primaryExp].example})

=== MATCHED TEMPLATES ===
${templateContext}

=== HOW TO THINK (creative director reasoning) ===

STEP 1: BUYER SPECIFICITY
Before writing anything, reason about WHO buys this product:
- Is the buyer SPECIFIC? (diapers = parents, pet food = pet owners) Then you CAN laser-target in the creative.
- Is the buyer BROAD within an identity? (bible app = anyone of faith, meditation app = anyone stressed) Then hooks should speak to the SHARED IDENTITY, not narrow demographic slices.
- Don't waste creative slots on micro-segments (e.g. "seniors learning phones", "college students away from home church") when the product serves an entire identity group. Let the ad platform's algorithm find sub-segments - that's what it's built for.
- Vary hooks by EMOTIONAL ANGLE (guilt, comfort, routine, identity, curiosity) not by demographic slice (parents, students, retirees).

STEP 2: HOOK WRITING
The hook must pass ONE test: would a real person scrolling TikTok actually think or say this?
- Use the product's lexical field (words that signal the world: for a bible app = "verse", "scripture", "faith", "God"; for a calorie app = "macros", "food", "plate")
- The hook should feel like catching someone mid-thought. Not a headline, not a tagline, not a slogan.
- It can be an incomplete thought that the body resolves ("opened my Bible 0 times this week but..." -> body resolves with the product)
- Good: "0 verses this week. 847 reels." / "my work food doesn't have macro details but..."
- Bad: "Track Your Macros Easily" / "The Ultimate Food Scanner" / "my grandkids taught me to use this phone. God taught me what to do with it."

STEP 3: BODY WRITING
Body = what the feature actually IS. One simple sentence. Not clever, not poetic, not metaphorical.
- Good: "an hourly bible verse widget. tap below to download." / "point your phone at any plate. instant macros."
- Bad: "church in your pocket when you can't get to church" (metaphor, clunky repetition, doesn't describe the actual feature)
- Bad: "no typing. no searching. verses just appear." (this is AI triplet pattern writing. Real people don't structure sentences like this.)
- The body can complete an incomplete hook.

STEP 4: CTA
CTA = an ACTION. Tell the person what to DO.
- Good: "Download Free", "Get It Below", "Tap to Install"
- Bad: "Never Alone", "Start Your Journey", "Find Peace" (these are slogans, not actions)

STEP 5: WRITING QUALITY
Read your output out loud. Does it sound like a real person or like AI?
- Avoid the AI triplet pattern: "no X. no Y. Z just happens." This is the #1 giveaway of AI-generated copy.
- Avoid greeting card sentiments: "God taught me what to do with it" - nobody actually thinks this.
- Avoid forced poetry or metaphors in ads. Simple > clever.
- If a sentence sounds clunky or has awkward repetition, rewrite it. Have taste.
- The ad should feel NATIVE to the platform. Like organic content, not like an ad.

=== YOUR TASK ===

Create 5 creatives. Template: Hook + Body (text overlay, 10-20 sec total).

FIRST: Decide your targeting approach based on buyer specificity (from Step 1 above).
- If the buyer is BROAD (shared identity group), your 5 creatives should vary by EMOTIONAL ANGLE, not by demographic segment. Each creative hits the same broad audience from a different emotional direction.
- If the buyer is SPECIFIC, each creative can target a different segment.

For each creative:
- 5-6 HOOK VARIATIONS, each pulling a different psychological lever from the deep dive
- Each hook MUST include 2-3 VIDEO SCENE SUGGESTIONS: ambiguous, varied visual scenarios for what's happening behind the text overlay (e.g., "girl sitting in her car", "someone scrolling in bed at night", "hand picking up phone from nightstand"). Keep them short and open.
- 2-3 BODY VARIATIONS: simple feature descriptions. What the product does in plain words.
- 1 CTA: an action verb (download, get, tap, install). NOT a slogan.

JSON:
{
  "creatives": [
    {
      "rank": 1-5,
      "name": "simple, descriptive concept name - not clever, not abstract",
      "templateId": "from matched list",
      "templateName": "template title",
      "emotion": "primary emotion",
      "platform": "TikTok|Meta/IG|YouTube|Snapchat",
      "format": "9:16 vertical",
      "scenario": "the specific real daily moment for this segment (1 sentence)",
      "experienceType": "${primaryExp}",
      "productionStyle": "production approach",
      "targetSegment": "segment name from hierarchy",
      "hooks": [
        {
          "text": "scroll-stopping hook text",
          "angle": "which psychological lever",
          "visualSuggestions": ["person in specific relatable setting", "alternative scene idea", "third option"]
        }
      ],
      "bodies": [
        { "text": "simple feature description", "visual": "what viewer sees on screen" }
      ],
      "cta": { "text": "Download Free" },
      "whyThisTemplate": "1 sentence"
    }
  ]
}

CRITICAL:
1. Read every hook out loud. If it sounds like AI wrote it, rewrite it. If it sounds like a greeting card, rewrite it.
2. Body describes the ACTUAL FEATURE in simple words. No metaphors, no poetry.
3. CTA is an action (download, get, tap) not a slogan (never alone, find peace).
4. Each hook has 2-3 visualSuggestions - short, ambiguous video scene ideas.
5. Don't over-segment when the product serves a broad identity group. Vary by emotion, not demographics.
6. No AI triplet patterns ("no X. no Y. Z just happens.")
7. Every creative must pass: "would this actually work as a real ad on TikTok/Meta?"
8. Return ONLY valid JSON. No markdown, no code fences.`;
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
