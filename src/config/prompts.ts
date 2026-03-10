// ============================================================
// PROMPTS — Hybrid Architecture
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
// 1. PSYCHE MAP — Generated FIRST
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

  return `You are a neuromarketing expert. I'm giving you a HARDCODED framework and pre-computed data. Your ONLY job is to write personalized descriptions, ad tips, and insights for THIS specific product. Do NOT change the structure, scores, regions, or framework — only fill in the personalized text fields.

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
    "pains": ${JSON.stringify(pains)} (refine these for ${input.productName} specifically — keep the core meaning),
    "pleasures": ${JSON.stringify(pleasures)} (refine these for ${input.productName} specifically — keep the core meaning)
  },

  "audiencePosition": {
    "axis": "PERSONALIZE: where this audience clusters on a psychological axis",
    "insight": "PERSONALIZE: detailed insight about audience bias clustering for ${input.productName}"
  }
}

CRITICAL: Return ONLY valid JSON. No markdown, no code fences. Keep ALL pre-computed values (scores, percentages, coordinates, colors) EXACTLY as provided.`;
}

// ============================================================
// 2. SALES PLAYBOOK — Generated SECOND (receives Psyche Map)
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

  return `You are a world-class sales strategist. I'm giving you a HARDCODED framework with pre-computed scores. Your ONLY job is to write personalized descriptions, strategies, and ad copy for THIS specific product. Do NOT change the structure or scores — only fill in the personalized text fields.

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

NLP Techniques (FIXED — 5 techniques with power ratings):
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
// 3. RESEARCH — Generated THIRD (receives Psyche Map + Sales)
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

  return `You are an elite ad researcher. I'm giving you a HARDCODED research methodology framework. Your job is to personalize every step for this specific product. Do NOT change the methodology — only personalize the content.

${buildContext(input)}

${previousContext.length > 0 ? `=== PREVIOUS ANALYSIS CONTEXT ===\n${previousContext.join("\n")}\n` : ""}

=== HARDCODED RESEARCH METHODOLOGY ===

This is the user's personal research methodology: "I become the person that needs the product in my imagination, then the needs and emotions come to me after becoming it and I go through multiple scenarios in which the desire of the product may arise and translate them into a hook or an actual ad that might stimulate me emotionally and trigger me."

Shadow Avatar Steps (FIXED structure — personalize descriptions):
${JSON.stringify(SHADOW_AVATAR_STEPS.map((s) => ({ num: s.num, title: s.title, color: s.color })), null, 2)}

Research Techniques (FIXED names — personalize for this product):
${JSON.stringify(RESEARCH_TECHNIQUES.map((t) => ({ name: t.name, color: t.color, baseDescription: t.description })), null, 2)}

Avatar Trait Labels (FIXED): ${JSON.stringify(AVATAR_TRAIT_LABELS)}

=== YOUR TASK ===

Generate a JSON object. Keep all framework structure intact. ONLY personalize content for ${input.productName}:

{
  "shadowAvatarSteps": [
    For EACH step, keep num/title/color exactly, and ADD:
    - "description": "PERSONALIZE: How to do this step specifically for ${input.productName}'s audience. Imagine you ARE the person who needs ${input.productName}. What do you feel? What triggers you?"
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
    - "value": "PERSONALIZE: specific value for ${input.productName}'s ideal customer"
  ],

  "preCreativeChecklist": ["10 checklist items specific to ${input.productName} that must be verified before creating ads"]
}

CRITICAL: Return ONLY valid JSON. No markdown, no code fences. The shadow avatar steps and research techniques represent a real creative methodology — respect its structure.`;
}

// ============================================================
// 4. CREATIVE TREE — Generated LAST (receives ALL previous data)
// This is the OUTPUT — the amalgamation of all psychology,
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
Cognitive Profile: ${psycheMapData.cognitiveProfile.name} — ${psycheMapData.cognitiveProfile.description}
Mechanism: ${psycheMapData.cognitiveProfile.mechanism}
Active Brain Regions: ${psycheMapData.brainRegions.filter((r) => r.active).map((r) => `${r.name} (${r.role})`).join(", ")}
Top Biases: ${psycheMapData.biases.slice(0, 7).map((b) => `${b.name} [${b.strength}] — ${b.description}`).join("\n")}
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
    contextParts.push(`=== RESEARCH DATA ===
Avatar: ${researchData.avatarTraits.map((t) => `${t.label}: ${t.value}`).join(" | ")}
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

  return `You are an elite ad creative strategist. You have access to COMPLETE psychological, sales, and research analysis from previous sections. Your job is to create the ULTIMATE Creative Tree — ad copy that is mathematically optimized based on all preceding analysis.

${buildContext(input)}

${contextParts.join("\n\n")}

=== HARDCODED FRAMEWORK (DO NOT CHANGE) ===

Emotional Angles (FIXED — these are the angles, ranked by relevance to this product):
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
      For the TOP 6 most relevant angles, generate one script per framework (6 angles x 5 frameworks = 30 scripts):
      {
        "frameworkId": "the framework id",
        "steps": [
          For each step in the framework, generate:
          { "label": "step label from framework", "type": "problem|agitate|solution|cta|before|after|attention|interest|desire|situation|task|action|result", "text": "ACTUAL AD COPY that stacks the biases, triggers dopamine architecture, exploits the correct Cialdini weapons, and targets the awareness level — all personalized for ${input.productName}" }
        ],
        "hooks": ["5 hook lines that combine the emotional angle with the strongest biases and triggers from the psyche map"]
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
// 5. TOP 5 CREATIVES — Generated alongside Creative Tree
// ============================================================

export function topCreativesPrompt(
  input: ProjectInput,
  psycheMapData?: PsycheMapData,
  salesData?: SalesPlaybookData,
  researchData?: ResearchData,
): string {
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

  return `You are a senior creative director at a top performance marketing agency. Create 5 complete ad blueprints that are the BEST possible ads based on the full analysis below.

${buildContext(input)}

${contextParts.length > 0 ? `=== FULL ANALYSIS CONTEXT ===\n${contextParts.join("\n")}\n` : ""}

Available Platforms & Formats:
${JSON.stringify(PLATFORM_FORMATS, null, 2)}

Generate a JSON object:
{
  "creatives": [
    {
      "rank": 1-5,
      "name": "creative concept name",
      "emotion": "primary emotional angle from the framework",
      "platform": "TikTok|Meta/IG|YouTube|Snapchat",
      "format": "specific format from the platform list above",
      "hook": { "time": "0-3s", "text": "exact spoken/text copy", "visual": "detailed visual direction" },
      "body": { "time": "3-15s", "text": "exact spoken/text copy", "visual": "detailed visual direction" },
      "cta": { "time": "15-20s", "text": "exact CTA copy", "visual": "detailed visual direction" }
    }
  ]
}

CRITICAL:
1. Each creative uses a DIFFERENT emotional angle and platform
2. Copy must stack the strongest biases and Cialdini weapons from the analysis
3. Copy is word-for-word ready for a video editor
4. Visual directions are detailed enough for someone who has never seen the product
5. Each creative feels native to its platform
6. Return ONLY valid JSON. No markdown, no code fences.`;
}

// ============================================================
// 6. COPY CHECK — AI Deep Review (optional enhancement)
// Local algorithmic scoring handles the main analysis.
// ============================================================

export function copyCheckPrompt(input: ProjectInput, copyText: string): string {
  return `You are a senior copywriter and conversion optimization expert. Provide a DEEP qualitative review of this ad copy. Note: quantitative scoring (Flesch, grammar, bias detection, trend checks) is handled algorithmically — focus on QUALITATIVE insights only.

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
  "rewriteSuggestion": "a complete rewritten version that scores higher on all metrics — must be genuinely better, not just different"
}

Return ONLY valid JSON. No markdown, no code fences.`;
}
