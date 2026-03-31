import { NextRequest, NextResponse } from "next/server";
import { anthropic } from "@/lib/anthropic";
import { CLAUDE_MODELS } from "@/config/constants";

export async function POST(request: NextRequest) {
  try {
    const { messages, systemContext } = await request.json() as {
      messages: { role: "user" | "assistant"; content: string }[];
      systemContext: string;
    };

    if (!messages?.length) {
      return NextResponse.json({ error: "No messages" }, { status: 400 });
    }

    const response = await anthropic.messages.create({
      model: CLAUDE_MODELS.OPUS,
      max_tokens: 4000,
      system: `You are a creative strategist helping a media buyer create ads. You have DEEP context about the product from research, psychology, sales analysis, and creative exploration. Use this context to give specific, actionable ideas — not generic advice.

${systemContext}

RULES:
- Be specific to THIS product and THIS audience. Reference the research data.
- When suggesting hooks, write them as real speech — how the target audience actually talks.
- When suggesting stories, describe specific scenes and moments.
- Keep responses concise. The user is brainstorming, not reading essays.
- If the user shares a winning hook or angle, build on it with variations.
- Never use therapy vocabulary, staccato fragments, or copywriter language.`,
      messages,
      temperature: 0.5,
    });

    const block = response.content[0];
    if (block.type !== "text") throw new Error("Unexpected response");

    return NextResponse.json({ reply: block.text });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Chat failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
