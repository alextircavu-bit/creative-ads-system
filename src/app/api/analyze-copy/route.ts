import { NextRequest, NextResponse } from "next/server";
import { anthropic } from "@/lib/anthropic";
import { copyCheckPrompt } from "@/config/prompts";
import type { ProjectInput } from "@/types/creative";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { input, copyText } = body as { input: ProjectInput; copyText: string };

    if (!copyText?.trim()) {
      return NextResponse.json({ error: "No copy text provided" }, { status: 400 });
    }

    const prompt = copyCheckPrompt(input, copyText);

    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 4000,
      messages: [
        { role: "user", content: prompt },
      ],
      system: "You are a senior copywriter and conversion optimization expert. Return ONLY valid JSON, no markdown.",
      temperature: 0.5,
    });

    const block = message.content[0];
    if (block.type !== "text") throw new Error("Unexpected response type from Claude");
    const text = block.text;
    if (!text) throw new Error("Empty response from Claude");

    const result = JSON.parse(text);
    return NextResponse.json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Analysis failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
