import { NextRequest, NextResponse } from "next/server";
import { anthropic } from "@/lib/anthropic";
import { openai } from "@/lib/openai";
import {
  psycheMapPrompt,
  salesPlaybookPrompt,
  researchPrompt,
  creativeTreePrompt,
  creativeSynthesisPrompt,
  topCreativesPrompt,
  ugcCreativesPrompt,
  sora2BleedPrompt,
  elevenlabsFullVOPrompt,
  sora2ElevenlabsHandoffPrompt,
  sora2SilencePrompt,
} from "@/config/prompts";
import type { IProjectInput, IGenerationResult, IPsycheMapData, ISalesPlaybookData, IResearchData, ICreativeTreeData, ICreativeFeedback, ICreativeSynthesis } from "@/types/creative";
import { ESectionType } from "@/config/enums";
import { CLAUDE_MODELS, GPT_MODELS } from "@/config/constants";
import { SECTION_CONFIGS } from "@/config/generation-config";
import { SYSTEM_PROMPTS } from "@/config/system-prompts";

function repairJSON(raw: string): string {
  let s = raw.trim();
  // Strip markdown code fences if present
  s = s.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "");
  // Remove trailing commas before } or ]
  s = s.replace(/,\s*([}\]])/g, "$1");

  // Fix truncated JSON - close unterminated strings and brackets
  // Count open brackets/braces to detect truncation
  let inString = false;
  let escape = false;
  const stack: string[] = [];
  for (let i = 0; i < s.length; i++) {
    const c = s[i];
    if (escape) { escape = false; continue; }
    if (c === "\\") { escape = true; continue; }
    if (c === '"') { inString = !inString; continue; }
    if (inString) continue;
    if (c === "{" || c === "[") stack.push(c);
    if (c === "}") { if (stack.length && stack[stack.length - 1] === "{") stack.pop(); }
    if (c === "]") { if (stack.length && stack[stack.length - 1] === "[") stack.pop(); }
  }

  // If we ended inside a string, close it
  if (inString) s += '"';
  // Close any remaining open brackets/braces
  while (stack.length) {
    const open = stack.pop();
    s += open === "{" ? "}" : "]";
  }
  // Clean trailing commas again after repair
  s = s.replace(/,\s*([}\]])/g, "$1");

  return s;
}

async function callClaude(prompt: string, maxTokens: number, model?: string): Promise<unknown> {
  const maxRetries = 3;
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const message = await anthropic.messages.create({
        model: model || CLAUDE_MODELS.OPUS,
        max_tokens: maxTokens,
        messages: [
          { role: "user", content: prompt },
        ],
        system: SYSTEM_PROMPTS.GENERATION,
        temperature: 0.4,
      });

      const block = message.content[0];
      if (block.type !== "text") throw new Error("Unexpected response type from Claude");
      const text = block.text;
      if (!text) throw new Error("Empty response from Claude");

      const repaired = repairJSON(text);
      return JSON.parse(repaired);
    } catch (err: unknown) {
      const isRetryable =
        err instanceof Error &&
        (err.message.includes("Internal server error") ||
         err.message.includes("overloaded") ||
         err.message.includes("rate_limit") ||
         err.message.includes("529") ||
         err.message.includes("500"));

      if (isRetryable && attempt < maxRetries) {
        const delay = 1000 * Math.pow(2, attempt - 1); // 1s, 2s, 4s
        await new Promise((r) => setTimeout(r, delay));
        continue;
      }
      throw err;
    }
  }
  throw new Error("callClaude: max retries exceeded");
}

async function callGPT(prompt: string, maxTokens: number): Promise<unknown> {
  const maxRetries = 3;
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const response = await openai.chat.completions.create({
        model: GPT_MODELS.GPT4O,
        max_tokens: maxTokens,
        messages: [
          { role: "system", content: SYSTEM_PROMPTS.GENERATION },
          { role: "user", content: prompt },
        ],
        temperature: 0.4,
      });

      const text = response.choices[0]?.message?.content;
      if (!text) throw new Error("Empty response from GPT");

      const repaired = repairJSON(text);
      return JSON.parse(repaired);
    } catch (err: unknown) {
      const isRetryable =
        err instanceof Error &&
        (err.message.includes("Internal server error") ||
         err.message.includes("overloaded") ||
         err.message.includes("rate_limit") ||
         err.message.includes("429") ||
         err.message.includes("500"));

      if (isRetryable && attempt < maxRetries) {
        const delay = 1000 * Math.pow(2, attempt - 1);
        await new Promise((r) => setTimeout(r, delay));
        continue;
      }
      throw err;
    }
  }
  throw new Error("callGPT: max retries exceeded");
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { input, section, context } = body as {
      input: IProjectInput;
      section: ESectionType;
      context?: {
        psycheMap?: IPsycheMapData;
        salesPlaybook?: ISalesPlaybookData;
        research?: IResearchData;
        creativeTree?: ICreativeTreeData;
        feedback?: ICreativeFeedback;
        existingCreatives?: { name: string; emotion: string; targetSegment?: string; hookTexts: string[] }[];
      };
    };

    if (!input?.productName || !input?.productDescription) {
      return NextResponse.json({ error: "Missing product name or description" }, { status: 400 });
    }

    // --- Generate ALL sections (3 wall-clock steps) ---
    if (section === ESectionType.All) {
      // V5 uses GPT for creative generation (Steps 3a/3b), Claude for deep dive (Steps 1/2)
      const useGPT = input.scenario === "v5";
      const callCreativeModel = useGPT
        ? (prompt: string, tokens: number) => callGPT(prompt, tokens)
        : (prompt: string, tokens: number) => callClaude(prompt, tokens, SECTION_CONFIGS[ESectionType.TopCreatives].model);

      // Step 1: Psyche Map (Sonnet) + Sales Playbook (Sonnet) + Research (Opus) in parallel — always Claude
      const [psycheMap, salesPlaybook, research] = await Promise.all([
        callClaude(psycheMapPrompt(input), SECTION_CONFIGS[ESectionType.PsycheMap].tokens, SECTION_CONFIGS[ESectionType.PsycheMap].model) as Promise<IPsycheMapData>,
        callClaude(salesPlaybookPrompt(input), SECTION_CONFIGS[ESectionType.SalesPlaybook].tokens, SECTION_CONFIGS[ESectionType.SalesPlaybook].model) as Promise<ISalesPlaybookData>,
        callClaude(researchPrompt(input), SECTION_CONFIGS[ESectionType.Research].tokens, SECTION_CONFIGS[ESectionType.Research].model) as Promise<IResearchData>,
      ]);

      // Step 2: Creative Tree (Opus, informed by all 3) — always Claude
      const creativeTree = await callClaude(
        creativeTreePrompt(input, psycheMap, salesPlaybook, research),
        SECTION_CONFIGS[ESectionType.CreativeTree].tokens,
        SECTION_CONFIGS[ESectionType.CreativeTree].model,
      ) as ICreativeTreeData;

      // Step 2.5: Creative Synthesis — distills deep dive into actionable brief (Sonnet, cheap)
      const synthesis = await callClaude(
        creativeSynthesisPrompt(input, psycheMap, salesPlaybook, research, creativeTree),
        4000,
        CLAUDE_MODELS.SONNET,
      ) as ICreativeSynthesis;

      // Step 3: ALL creatives in parallel — each gets the synthesis brief, NOT raw deep dive
      const [topCreativesResult, ugcResult, sora2Bleed, elevenlabsFull, handoff, sora2Silence] = await Promise.all([
        // 3a: Top Creatives — single call, 5 creatives
        callCreativeModel(topCreativesPrompt(input, psycheMap, salesPlaybook, research, creativeTree, undefined, undefined, synthesis), SECTION_CONFIGS[ESectionType.TopCreatives].tokens) as Promise<{ creatives: IGenerationResult["topCreatives"]["creatives"] }>,
        // 3b: UGC Text-Overlay — single call, 5 creatives
        callCreativeModel(ugcCreativesPrompt(input, psycheMap, salesPlaybook, research, creativeTree, undefined, undefined, synthesis), SECTION_CONFIGS[ESectionType.TopCreatives].tokens) as Promise<{ creatives: IGenerationResult["topCreatives"]["creatives"] }>,
        // 3c: Audio Modes — 4 calls, 3 creatives each
        callCreativeModel(sora2BleedPrompt(input, psycheMap, salesPlaybook, research, creativeTree, undefined, undefined, synthesis), SECTION_CONFIGS[ESectionType.TopCreatives].tokens) as Promise<{ creatives: IGenerationResult["topCreatives"]["creatives"] }>,
        callCreativeModel(elevenlabsFullVOPrompt(input, psycheMap, salesPlaybook, research, creativeTree, undefined, undefined, synthesis), SECTION_CONFIGS[ESectionType.TopCreatives].tokens) as Promise<{ creatives: IGenerationResult["topCreatives"]["creatives"] }>,
        callCreativeModel(sora2ElevenlabsHandoffPrompt(input, psycheMap, salesPlaybook, research, creativeTree, undefined, undefined, synthesis), SECTION_CONFIGS[ESectionType.TopCreatives].tokens) as Promise<{ creatives: IGenerationResult["topCreatives"]["creatives"] }>,
        callCreativeModel(sora2SilencePrompt(input, psycheMap, salesPlaybook, research, creativeTree, undefined, undefined, synthesis), SECTION_CONFIGS[ESectionType.TopCreatives].tokens) as Promise<{ creatives: IGenerationResult["topCreatives"]["creatives"] }>,
      ]);

      const regularCreatives = (topCreativesResult.creatives || []).map((c, i) => ({ ...c, rank: i + 1 }));
      const ugcCreatives = (ugcResult.creatives || []).map((c, i) => ({ ...c, rank: regularCreatives.length + i + 1, isUgcBatch: true as const }));

      const audioModeCreatives = [
        ...(sora2Bleed.creatives || []).map((c) => ({ ...c, audioMode: "sora2-bleed" as const })),
        ...(elevenlabsFull.creatives || []).map((c) => ({ ...c, audioMode: "elevenlabs-full-vo" as const })),
        ...(handoff.creatives || []).map((c) => ({ ...c, audioMode: "sora2-elevenlabs-handoff" as const })),
        ...(sora2Silence.creatives || []).map((c) => ({ ...c, audioMode: "sora2-silence" as const })),
      ].map((c, i) => ({ ...c, rank: regularCreatives.length + ugcCreatives.length + i + 1 }));

      const topCreatives = { creatives: [...regularCreatives, ...ugcCreatives, ...audioModeCreatives] };

      const fullResult: IGenerationResult = {
        id: crypto.randomUUID(),
        input,
        psycheMap,
        salesPlaybook,
        research,
        creativeTree: creativeTree as IGenerationResult["creativeTree"],
        synthesis,
        topCreatives: topCreatives as IGenerationResult["topCreatives"],
        createdAt: new Date().toISOString(),
      };

      return NextResponse.json(fullResult);
    }

    // --- Individual section generation ---
    let prompt: string;
    const config = SECTION_CONFIGS[section] || { tokens: 8000, model: CLAUDE_MODELS.OPUS, temperature: 0.4 };

    switch (section) {
      case ESectionType.PsycheMap:
        prompt = psycheMapPrompt(input);
        break;
      case ESectionType.SalesPlaybook:
        prompt = salesPlaybookPrompt(input, context?.psycheMap);
        break;
      case ESectionType.Research:
        prompt = researchPrompt(input, context?.psycheMap, context?.salesPlaybook);
        break;
      case ESectionType.CreativeTree:
        prompt = creativeTreePrompt(input, context?.psycheMap, context?.salesPlaybook, context?.research);
        break;
      case ESectionType.TopCreatives: {
        // "Generate 5 more" — single call each for regular + UGC
        const useGPTForMore = input.scenario === "v5";
        const callMore = useGPTForMore
          ? (p: string, t: number) => callGPT(p, t)
          : (p: string, t: number) => callClaude(p, t, config.model);

        const existingCount = context?.existingCreatives?.length || 0;

        const basePrompt = topCreativesPrompt(input, context?.psycheMap, context?.salesPlaybook, context?.research, context?.creativeTree, context?.feedback, context?.existingCreatives);
        const ugcBasePrompt = ugcCreativesPrompt(input, context?.psycheMap, context?.salesPlaybook, context?.research, context?.creativeTree, context?.feedback, context?.existingCreatives);

        // Regular + UGC in parallel, single call each
        const [regularResult, ugcResult] = await Promise.all([
          callMore(basePrompt, config.tokens) as Promise<{ creatives: unknown[] }>,
          callMore(ugcBasePrompt, config.tokens) as Promise<{ creatives: unknown[] }>,
        ]);

        const regularMerged = (regularResult.creatives || [])
          .map((c, i) => ({ ...(c as Record<string, unknown>), rank: existingCount + i + 1 }));

        const ugcMerged = (ugcResult.creatives || [])
          .map((c, i) => ({ ...(c as Record<string, unknown>), rank: existingCount + regularMerged.length + i + 1, isUgcBatch: true }));

        return NextResponse.json({ creatives: [...regularMerged, ...ugcMerged] });
      }
      default:
        return NextResponse.json({ error: "Invalid section" }, { status: 400 });
    }

    const data = await callClaude(prompt, config.tokens, config.model);
    return NextResponse.json(data);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Generation failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
