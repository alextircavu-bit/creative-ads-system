import { NextRequest, NextResponse } from "next/server";
import { anthropic } from "@/lib/anthropic";
import {
  psycheMapPrompt,
  salesPlaybookPrompt,
  researchPrompt,
  creativeTreePrompt,
  topCreativesPrompt,
} from "@/config/prompts";
import type { ProjectInput, GenerationResult, PsycheMapData, SalesPlaybookData, ResearchData, CreativeTreeData, CreativeFeedback } from "@/types/creative";

type Section = "psycheMap" | "salesPlaybook" | "research" | "creativeTree" | "topCreatives" | "all";

// Per-section config: token limits + model selection
// Psyche/Sales use Sonnet (structured data). Research/Creative/Top use Opus (creative quality).
const OPUS = "claude-opus-4-20250514";
const SONNET = "claude-sonnet-4-20250514";

const SECTION_CONFIG: Record<Exclude<Section, "all">, { tokens: number; model: string }> = {
  psycheMap:      { tokens: 6000,  model: SONNET },
  salesPlaybook:  { tokens: 8000,  model: SONNET },
  research:       { tokens: 5000,  model: OPUS },
  creativeTree:   { tokens: 12000, model: OPUS },  // trimmed from 20k (18 scripts instead of 30)
  topCreatives:   { tokens: 8000,  model: OPUS },   // per-batch (2-3 creatives each, run in parallel)
};

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
  const message = await anthropic.messages.create({
    model: model || OPUS,
    max_tokens: maxTokens,
    messages: [
      { role: "user", content: prompt },
    ],
    system: "You are an expert ad creative strategist and behavioral psychologist. You return ONLY valid JSON with no markdown formatting, no code fences, no explanation. Just raw JSON.",
    temperature: 0.4,
  });

  const block = message.content[0];
  if (block.type !== "text") throw new Error("Unexpected response type from Claude");
  const text = block.text;
  if (!text) throw new Error("Empty response from Claude");

  const repaired = repairJSON(text);
  return JSON.parse(repaired);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { input, section, context } = body as {
      input: ProjectInput;
      section: Section;
      context?: {
        psycheMap?: PsycheMapData;
        salesPlaybook?: SalesPlaybookData;
        research?: ResearchData;
        creativeTree?: CreativeTreeData;
        feedback?: CreativeFeedback;
        existingCreatives?: { name: string; emotion: string; targetSegment?: string; hookTexts: string[] }[];
      };
    };

    if (!input?.productName || !input?.productDescription) {
      return NextResponse.json({ error: "Missing product name or description" }, { status: 400 });
    }

    // --- Generate ALL sections (3 wall-clock steps) ---
    if (section === "all") {
      // Step 1: Psyche Map (Sonnet) + Sales Playbook (Sonnet) + Research (Opus) in parallel
      const [psycheMap, salesPlaybook, research] = await Promise.all([
        callClaude(psycheMapPrompt(input), SECTION_CONFIG.psycheMap.tokens, SECTION_CONFIG.psycheMap.model) as Promise<PsycheMapData>,
        callClaude(salesPlaybookPrompt(input), SECTION_CONFIG.salesPlaybook.tokens, SECTION_CONFIG.salesPlaybook.model) as Promise<SalesPlaybookData>,
        callClaude(researchPrompt(input), SECTION_CONFIG.research.tokens, SECTION_CONFIG.research.model) as Promise<ResearchData>,
      ]);

      // Step 2: Creative Tree (Opus, informed by all 3)
      const creativeTree = await callClaude(
        creativeTreePrompt(input, psycheMap, salesPlaybook, research),
        SECTION_CONFIG.creativeTree.tokens,
        SECTION_CONFIG.creativeTree.model,
      ) as CreativeTreeData;

      // Step 3: Top Creatives — split into 3 parallel Opus calls (2+2+1 creatives)
      // Each batch generates a subset, then we merge
      const batchPrompt = (batchNum: number, batchSize: number, startRank: number) =>
        topCreativesPrompt(input, psycheMap, salesPlaybook, research, creativeTree)
          .replace(
            "Generate 5 ad creative blueprints.",
            `Generate exactly ${batchSize} ad creative blueprints. Start ranking from ${startRank}. This is batch ${batchNum} of 3 — ensure DIFFERENT emotional territories than other batches would pick. ${batchNum === 1 ? "Pick the 2 strongest angles." : batchNum === 2 ? "Pick 2 unexpected/niche angles." : "Pick 1 bold, unconventional angle."}`
          );

      const [batch1, batch2, batch3] = await Promise.all([
        callClaude(batchPrompt(1, 2, 1), SECTION_CONFIG.topCreatives.tokens, SECTION_CONFIG.topCreatives.model) as Promise<{ creatives: GenerationResult["topCreatives"]["creatives"] }>,
        callClaude(batchPrompt(2, 2, 3), SECTION_CONFIG.topCreatives.tokens, SECTION_CONFIG.topCreatives.model) as Promise<{ creatives: GenerationResult["topCreatives"]["creatives"] }>,
        callClaude(batchPrompt(3, 1, 5), SECTION_CONFIG.topCreatives.tokens, SECTION_CONFIG.topCreatives.model) as Promise<{ creatives: GenerationResult["topCreatives"]["creatives"] }>,
      ]);

      // Merge batches and re-rank
      const allCreatives = [
        ...(batch1.creatives || []),
        ...(batch2.creatives || []),
        ...(batch3.creatives || []),
      ].map((c, i) => ({ ...c, rank: i + 1 }));

      const topCreatives = { creatives: allCreatives };

      const fullResult: GenerationResult = {
        id: crypto.randomUUID(),
        input,
        psycheMap,
        salesPlaybook,
        research,
        creativeTree: creativeTree as GenerationResult["creativeTree"],
        topCreatives: topCreatives as GenerationResult["topCreatives"],
        createdAt: new Date().toISOString(),
      };

      return NextResponse.json(fullResult);
    }

    // --- Individual section generation ---
    let prompt: string;
    const config = SECTION_CONFIG[section] || { tokens: 8000, model: OPUS };

    switch (section) {
      case "psycheMap":
        prompt = psycheMapPrompt(input);
        break;
      case "salesPlaybook":
        prompt = salesPlaybookPrompt(input, context?.psycheMap);
        break;
      case "research":
        prompt = researchPrompt(input, context?.psycheMap, context?.salesPlaybook);
        break;
      case "creativeTree":
        prompt = creativeTreePrompt(input, context?.psycheMap, context?.salesPlaybook, context?.research);
        break;
      case "topCreatives": {
        // "Generate 5 more" — also split into parallel batches for speed
        const basePrompt = topCreativesPrompt(input, context?.psycheMap, context?.salesPlaybook, context?.research, context?.creativeTree, context?.feedback, context?.existingCreatives);
        const batchPrompt = (batchNum: number, batchSize: number, startRank: number) =>
          basePrompt.replace(
            "Generate 5 ad creative blueprints.",
            `Generate exactly ${batchSize} ad creative blueprints. Start ranking from ${startRank}. This is batch ${batchNum} of 3 — ensure DIFFERENT emotional territories than other batches would pick. ${batchNum === 1 ? "Pick the 2 strongest angles." : batchNum === 2 ? "Pick 2 unexpected/niche angles." : "Pick 1 bold, unconventional angle."}`
          );

        const existingCount = context?.existingCreatives?.length || 0;
        const [b1, b2, b3] = await Promise.all([
          callClaude(batchPrompt(1, 2, existingCount + 1), config.tokens, config.model) as Promise<{ creatives: unknown[] }>,
          callClaude(batchPrompt(2, 2, existingCount + 3), config.tokens, config.model) as Promise<{ creatives: unknown[] }>,
          callClaude(batchPrompt(3, 1, existingCount + 5), config.tokens, config.model) as Promise<{ creatives: unknown[] }>,
        ]);

        const merged = [
          ...(b1.creatives || []),
          ...(b2.creatives || []),
          ...(b3.creatives || []),
        ].map((c, i) => ({ ...(c as Record<string, unknown>), rank: existingCount + i + 1 }));

        return NextResponse.json({ creatives: merged });
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
