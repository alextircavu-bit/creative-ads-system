import { NextRequest, NextResponse } from "next/server";
import { anthropic } from "@/lib/anthropic";
import {
  psycheMapPrompt,
  salesPlaybookPrompt,
  researchPrompt,
  creativeTreePrompt,
  topCreativesPrompt,
  ugcCreativesPrompt,
} from "@/config/prompts";
import type { IProjectInput, IGenerationResult, IPsycheMapData, ISalesPlaybookData, IResearchData, ICreativeTreeData, ICreativeFeedback } from "@/types/creative";
import { ESectionType } from "@/config/enums";
import { CLAUDE_MODELS } from "@/config/constants";
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
      // Step 1: Psyche Map (Sonnet) + Sales Playbook (Sonnet) + Research (Opus) in parallel
      const [psycheMap, salesPlaybook, research] = await Promise.all([
        callClaude(psycheMapPrompt(input), SECTION_CONFIGS[ESectionType.PsycheMap].tokens, SECTION_CONFIGS[ESectionType.PsycheMap].model) as Promise<IPsycheMapData>,
        callClaude(salesPlaybookPrompt(input), SECTION_CONFIGS[ESectionType.SalesPlaybook].tokens, SECTION_CONFIGS[ESectionType.SalesPlaybook].model) as Promise<ISalesPlaybookData>,
        callClaude(researchPrompt(input), SECTION_CONFIGS[ESectionType.Research].tokens, SECTION_CONFIGS[ESectionType.Research].model) as Promise<IResearchData>,
      ]);

      // Step 2: Creative Tree (Opus, informed by all 3)
      const creativeTree = await callClaude(
        creativeTreePrompt(input, psycheMap, salesPlaybook, research),
        SECTION_CONFIGS[ESectionType.CreativeTree].tokens,
        SECTION_CONFIGS[ESectionType.CreativeTree].model,
      ) as ICreativeTreeData;

      // Step 3a: Top Creatives — 3 parallel Opus calls (2+2+1)
      const batchPrompt = (batchNum: number, batchSize: number, startRank: number) =>
        topCreativesPrompt(input, psycheMap, salesPlaybook, research, creativeTree)
          .replace(
            "Generate 5 ad creative blueprints.",
            `Generate exactly ${batchSize} ad creative blueprints. Start ranking from ${startRank}. This is batch ${batchNum} of 3 — ensure DIFFERENT emotional territories than other batches would pick. ${batchNum === 1 ? "Pick the 2 strongest angles." : batchNum === 2 ? "Pick 2 unexpected/niche angles." : "Pick 1 bold, unconventional angle."}`
          );

      const [batch1, batch2, batch3] = await Promise.all([
        callClaude(batchPrompt(1, 2, 1), SECTION_CONFIGS[ESectionType.TopCreatives].tokens, SECTION_CONFIGS[ESectionType.TopCreatives].model) as Promise<{ creatives: IGenerationResult["topCreatives"]["creatives"] }>,
        callClaude(batchPrompt(2, 2, 3), SECTION_CONFIGS[ESectionType.TopCreatives].tokens, SECTION_CONFIGS[ESectionType.TopCreatives].model) as Promise<{ creatives: IGenerationResult["topCreatives"]["creatives"] }>,
        callClaude(batchPrompt(3, 1, 5), SECTION_CONFIGS[ESectionType.TopCreatives].tokens, SECTION_CONFIGS[ESectionType.TopCreatives].model) as Promise<{ creatives: IGenerationResult["topCreatives"]["creatives"] }>,
      ]);

      const regularCreatives = [
        ...(batch1.creatives || []),
        ...(batch2.creatives || []),
        ...(batch3.creatives || []),
      ].map((c, i) => ({ ...c, rank: i + 1 }));

      // Step 3b: UGC Creatives — 3 parallel Opus calls (2+2+1), sequenced after regular to avoid overload
      const ugcBatchPrompt = (batchNum: number, batchSize: number, startRank: number) =>
        ugcCreativesPrompt(input, psycheMap, salesPlaybook, research, creativeTree)
          .replace(
            "Generate 5 UGC text-overlay ad creative blueprints.",
            `Generate exactly ${batchSize} UGC text-overlay ad creative blueprints. Start ranking from ${startRank}. This is batch ${batchNum} of 3 — ensure DIFFERENT emotional territories than other batches would pick. ${batchNum === 1 ? "Pick the 2 strongest angles." : batchNum === 2 ? "Pick 2 unexpected/niche angles." : "Pick 1 bold, unconventional angle."}`
          );

      const [ugcBatch1, ugcBatch2, ugcBatch3] = await Promise.all([
        callClaude(ugcBatchPrompt(1, 2, 1), SECTION_CONFIGS[ESectionType.TopCreatives].tokens, SECTION_CONFIGS[ESectionType.TopCreatives].model) as Promise<{ creatives: IGenerationResult["topCreatives"]["creatives"] }>,
        callClaude(ugcBatchPrompt(2, 2, 3), SECTION_CONFIGS[ESectionType.TopCreatives].tokens, SECTION_CONFIGS[ESectionType.TopCreatives].model) as Promise<{ creatives: IGenerationResult["topCreatives"]["creatives"] }>,
        callClaude(ugcBatchPrompt(3, 1, 5), SECTION_CONFIGS[ESectionType.TopCreatives].tokens, SECTION_CONFIGS[ESectionType.TopCreatives].model) as Promise<{ creatives: IGenerationResult["topCreatives"]["creatives"] }>,
      ]);

      const ugcCreatives = [
        ...(ugcBatch1.creatives || []),
        ...(ugcBatch2.creatives || []),
        ...(ugcBatch3.creatives || []),
      ].map((c, i) => ({ ...c, rank: regularCreatives.length + i + 1, isUgcBatch: true as const }));

      const topCreatives = { creatives: [...regularCreatives, ...ugcCreatives] };

      const fullResult: IGenerationResult = {
        id: crypto.randomUUID(),
        input,
        psycheMap,
        salesPlaybook,
        research,
        creativeTree: creativeTree as IGenerationResult["creativeTree"],
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
        // "Generate 5 more" — regular (2+2+1) + UGC (2+2+1) in parallel
        const basePrompt = topCreativesPrompt(input, context?.psycheMap, context?.salesPlaybook, context?.research, context?.creativeTree, context?.feedback, context?.existingCreatives);
        const tcBatchPrompt = (batchNum: number, batchSize: number, startRank: number) =>
          basePrompt.replace(
            "Generate 5 ad creative blueprints.",
            `Generate exactly ${batchSize} ad creative blueprints. Start ranking from ${startRank}. This is batch ${batchNum} of 3 — ensure DIFFERENT emotional territories than other batches would pick. ${batchNum === 1 ? "Pick the 2 strongest angles." : batchNum === 2 ? "Pick 2 unexpected/niche angles." : "Pick 1 bold, unconventional angle."}`
          );

        const ugcBasePrompt = ugcCreativesPrompt(input, context?.psycheMap, context?.salesPlaybook, context?.research, context?.creativeTree, context?.feedback, context?.existingCreatives);
        const ugcBatchPromptFn = (batchNum: number, batchSize: number, startRank: number) =>
          ugcBasePrompt.replace(
            "Generate 5 UGC text-overlay ad creative blueprints.",
            `Generate exactly ${batchSize} UGC text-overlay ad creative blueprints. Start ranking from ${startRank}. This is batch ${batchNum} of 3 — ensure DIFFERENT emotional territories than other batches would pick. ${batchNum === 1 ? "Pick the 2 strongest angles." : batchNum === 2 ? "Pick 2 unexpected/niche angles." : "Pick 1 bold, unconventional angle."}`
          );

        const existingCount = context?.existingCreatives?.length || 0;

        // Regular batches first
        const [b1, b2, b3] = await Promise.all([
          callClaude(tcBatchPrompt(1, 2, existingCount + 1), config.tokens, config.model) as Promise<{ creatives: unknown[] }>,
          callClaude(tcBatchPrompt(2, 2, existingCount + 3), config.tokens, config.model) as Promise<{ creatives: unknown[] }>,
          callClaude(tcBatchPrompt(3, 1, existingCount + 5), config.tokens, config.model) as Promise<{ creatives: unknown[] }>,
        ]);

        const regularMerged = [
          ...(b1.creatives || []),
          ...(b2.creatives || []),
          ...(b3.creatives || []),
        ].map((c, i) => ({ ...(c as Record<string, unknown>), rank: existingCount + i + 1 }));

        // UGC batches after regular to avoid overload
        const [ub1, ub2, ub3] = await Promise.all([
          callClaude(ugcBatchPromptFn(1, 2, existingCount + 1), config.tokens, config.model) as Promise<{ creatives: unknown[] }>,
          callClaude(ugcBatchPromptFn(2, 2, existingCount + 3), config.tokens, config.model) as Promise<{ creatives: unknown[] }>,
          callClaude(ugcBatchPromptFn(3, 1, existingCount + 5), config.tokens, config.model) as Promise<{ creatives: unknown[] }>,
        ]);

        const ugcMerged = [
          ...(ub1.creatives || []),
          ...(ub2.creatives || []),
          ...(ub3.creatives || []),
        ].map((c, i) => ({ ...(c as Record<string, unknown>), rank: existingCount + regularMerged.length + i + 1, isUgcBatch: true }));

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
