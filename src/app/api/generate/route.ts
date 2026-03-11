import { NextRequest, NextResponse } from "next/server";
import { anthropic } from "@/lib/anthropic";
import {
  psycheMapPrompt,
  salesPlaybookPrompt,
  researchPrompt,
  creativeTreePrompt,
  topCreativesPrompt,
} from "@/config/prompts";
import type { ProjectInput, GenerationResult, PsycheMapData, SalesPlaybookData, ResearchData } from "@/types/creative";

type Section = "psycheMap" | "salesPlaybook" | "research" | "creativeTree" | "topCreatives" | "all";

// Per-section token limits — trimmed for speed
const SECTION_TOKENS: Record<Exclude<Section, "all">, number> = {
  psycheMap: 6000,
  salesPlaybook: 8000,
  research: 5000,
  creativeTree: 10000,
  topCreatives: 4000,
};

function repairJSON(raw: string): string {
  let s = raw.trim();
  // Strip markdown code fences if present
  s = s.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "");
  // Remove trailing commas before } or ]
  s = s.replace(/,\s*([}\]])/g, "$1");
  return s;
}

async function callClaude(prompt: string, maxTokens: number): Promise<unknown> {
  const message = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
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
      };
    };

    if (!input?.productName || !input?.productDescription) {
      return NextResponse.json({ error: "Missing product name or description" }, { status: 400 });
    }

    // --- Generate ALL sections (2 wall-clock steps) ---
    if (section === "all") {
      // Step 1: Psyche Map + Sales Playbook + Research ALL in parallel
      // Sales/Research barely use Psyche context — fire them all at once
      const [psycheMap, salesPlaybook, research] = await Promise.all([
        callClaude(psycheMapPrompt(input), SECTION_TOKENS.psycheMap) as Promise<PsycheMapData>,
        callClaude(salesPlaybookPrompt(input), SECTION_TOKENS.salesPlaybook) as Promise<SalesPlaybookData>,
        callClaude(researchPrompt(input), SECTION_TOKENS.research) as Promise<ResearchData>,
      ]);

      // Step 2: Creative Tree + Top Creatives in parallel (informed by all 3)
      const [creativeTree, topCreatives] = await Promise.all([
        callClaude(creativeTreePrompt(input, psycheMap, salesPlaybook, research), SECTION_TOKENS.creativeTree),
        callClaude(topCreativesPrompt(input, psycheMap, salesPlaybook, research), SECTION_TOKENS.topCreatives),
      ]);

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
    const maxTokens = SECTION_TOKENS[section] || 8000;

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
      case "topCreatives":
        prompt = topCreativesPrompt(input, context?.psycheMap, context?.salesPlaybook, context?.research);
        break;
      default:
        return NextResponse.json({ error: "Invalid section" }, { status: 400 });
    }

    const data = await callClaude(prompt, maxTokens);
    return NextResponse.json(data);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Generation failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
