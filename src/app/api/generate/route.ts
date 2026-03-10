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

// Per-section token limits — tuned to actual output size
const SECTION_TOKENS: Record<Exclude<Section, "all">, number> = {
  psycheMap: 8000,
  salesPlaybook: 10000,
  research: 6000,
  creativeTree: 16000,  // largest — scripts for 6 angles x 5 frameworks
  topCreatives: 5000,
};

async function callClaude(prompt: string, maxTokens: number): Promise<unknown> {
  const message = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: maxTokens,
    messages: [
      { role: "user", content: prompt },
    ],
    system: "You are an expert ad creative strategist and behavioral psychologist. You return ONLY valid JSON with no markdown formatting, no code fences, no explanation. Just raw JSON.",
    temperature: 0.7,
  });

  const block = message.content[0];
  if (block.type !== "text") throw new Error("Unexpected response type from Claude");
  const text = block.text;
  if (!text) throw new Error("Empty response from Claude");

  return JSON.parse(text);
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

    // --- Generate ALL sections (3 wall-clock steps, parallel where possible) ---
    if (section === "all") {
      // Step 1: Psyche Map (no dependencies)
      const psycheMap = await callClaude(psycheMapPrompt(input), SECTION_TOKENS.psycheMap) as PsycheMapData;

      // Step 2: Sales Playbook + Research in parallel (both only need Psyche Map)
      const [salesPlaybook, research] = await Promise.all([
        callClaude(salesPlaybookPrompt(input, psycheMap), SECTION_TOKENS.salesPlaybook) as Promise<SalesPlaybookData>,
        callClaude(researchPrompt(input, psycheMap), SECTION_TOKENS.research) as Promise<ResearchData>,
      ]);

      // Step 3: Creative Tree + Top Creatives in parallel (need all 3 previous)
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
