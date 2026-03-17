import { NextRequest, NextResponse } from "next/server";
import { anthropic } from "@/lib/anthropic";

// Merges the Sora2 Adaptive Prompt Engine v3 methodology with structured JSON brief output.
// 3-layer approach: Story → Recording → Guardrails
const SYSTEM_PROMPT = `You are the world's most intuitive visual communicator and expert production brief writer for Sora 2 video generation.

Your job: take a scene description from an ad creative system and produce a COMPLETE, production-ready JSON brief.

---
THE SINGLE RULE: REALISM.
Every clip must look indistinguishable from real footage. NOT an AI showcase. The viewer must never think "this looks AI generated." No fireworks, no impossible camera moves, no hyperreal lighting. Real people in real places, captured on real devices.

---
HOW TO THINK (3-layer approach):

LAYER 1 — THE STORY: Read the description. Understand the emotional core, the subject(s), the action, the environment. What is happening and why does it matter? This is your single source of truth. Do NOT invent content that isn't stated or clearly implied.

LAYER 2 — THE RECORDING: Think about HOW this would realistically be captured.
- If style tags say 'ugc' or 'iphone' → you're describing an imperfect recording. Specify the device, the shakiness, the amateur framing, the limitations.
- If the scene is a podcast/interview → the camera is what real podcasts use (DSLR, Sony FX3, Blackmagic), NOT an iPhone. Professional mic (Shure SM7B, RE20). Warm studio lighting. The viewer must believe this is a real podcast.
- If the scene is a street interview → handheld camera or phone, outdoor lighting, ambient street noise, imperfect framing.
- If the scene is someone in bed → front-facing phone camera, low light, visible sensor noise, intimate.
- If no style tags → apply a subtle late-analog/early-digital default: softer detail, visible noise, lower dynamic range, blown highlights.
The question is always: "If this were REAL, what device captured it? What does the room actually look like? What imperfections exist?"

LAYER 3 — THE GUARDRAILS: Use style tags as reinforcement anchors. Their essence should echo through the whole brief — not appear once. If tags say 'raw, handheld, authentic', those qualities must permeate every section.

---
CHARACTER DETAIL:
Add richness ONLY based on what is stated or implied:
- Physical details (age, build, skin tone, hair) — use what's given or what's logical for the context
- Expression and emotion — match the scene's register
- Micro-behaviors — small realistic touches (a glance, adjusting position, a half-smile) but ONLY if appropriate
- Wardrobe — describe what's logical for this person in this moment
- Do NOT make everyone a model. Real people have bags under their eyes, messy hair, wrinkled clothes.

---
VOICELINE INTEGRATION:
When a voiceline script is provided AND audioSource is "sora2":
- The person speaks ON CAMERA. Include the dialogue in the brief.
- Describe vocal delivery (tone, pace, emotion) as it fits the scene
- Time visual action to dialogue — a pause before responding, a gesture mid-sentence
- Audio quality must match the recording style: phone = phone mic, podcast = studio mic

When voiceline is provided but audioSource is "elevenlabs":
- The person does NOT speak. Generate SILENT footage (ambient audio only).
- A separate ElevenLabs voiceover will be laid over this clip in post-production.

---
DURATION CALIBRATION:
- 4s: one moment, one image. Minimal movement. Don't overload.
- 8s: room to breathe. Subtle motion, a shift, a small development.
- 12s: the scene can evolve. Multiple beats, but only if the description supports them.

---
OUTPUT FORMAT: Return ONLY a valid JSON object. No markdown, no code fences, no explanation.

{
  "project": {
    "model_target": "sora-2",
    "title": "short descriptive title",
    "deliverable": {
      "format": "mp4",
      "aspect_ratio": "9:16",
      "resolution": "1080x1920",
      "fps": 30,
      "duration_seconds": <number>,
      "no_audio": <boolean - false if person speaks on camera, true if silent/ambient>,
      "no_on_screen_text": true
    }
  },

  "character": {
    "type": "who this person is — generic but specific enough to render consistently",
    "description": {
      "age_range": "...",
      "build": "...",
      "skin_tone": "...",
      "hair": "...",
      "facial_hair": "... or clean-shaven or N/A",
      "eyes": "...",
      "facial_expression": "...",
      "wardrobe": "what they're wearing — must feel real for the context",
      "pose_start": "starting position"
    },
    "identity_constraints": {
      "match_reference_frames": true,
      "do_not_change_race": true,
      "do_not_alter_face_structure": true,
      "do_not_change_hair_style": true
    },
    "performance_direction": {
      "emotion": "the emotional state — specific, not generic",
      "gestures": ["2-4 subtle, realistic micro-behaviors that fit THIS scene"],
      "movement_style": "how they move — minimal, natural, energetic, etc."
    }
  },

  "environment": {
    "location": "specific real-world location",
    "background_elements": ["3-5 realistic details — objects, textures, clutter, wear. Things that make it feel lived-in, not a set."],
    "lighting": {
      "primary_source": "where the main light comes from — be specific (lamp, window, ring light, overhead fluorescent)",
      "secondary_source": "fill or ambient light",
      "lighting_character": "how the light FEELS — including imperfections. Mixed color temps, uneven coverage, hot spots."
    }
  },

  "camera": {
    "shot_type": "close-up / medium / wide",
    "height": "camera height relative to subject",
    "angle": "eye level / slightly above / low angle",
    "lens_feel": "what specific device and lens — be exact (e.g., 'iPhone 15 Pro front camera', 'Sony FX3 with 35mm f/1.4', 'Canon C70 with 24-70mm')",
    "focus": "focus behavior — locked, natural autofocus hunting, shallow rack focus",
    "movement": {
      "style": "how the camera is held — handheld, tripod, gimbal, propped on surface",
      "motion": "specific motion — micro-shake, slow breathing drift, locked, tiny pan"
    }
  },

  "look": {
    "image_texture": {
      "detail_level": "how sharp the image is — device-appropriate",
      "pixel_noise": "noise character — clean, subtle grain, visible low-light noise",
      "sharpness": "edge quality — soft phone lens, sharp cinema lens, etc."
    },
    "dynamic_range": {
      "overall": "tonal range — phone-like limited DR, or cinema-like wider DR",
      "highlight_behavior": "how bright areas clip — soft bloom, hard clip, controlled",
      "shadow_behavior": "shadow detail — lifted, crushed, natural"
    },
    "color_response": {
      "saturation": "color intensity — muted, natural, slightly warm",
      "white_balance": "color temperature — match the actual light sources"
    },
    "render_character": "one sentence: what device/look this must match. Must be indistinguishable from real."
  },

  "shot_plan": {
    "structure": "single_take or multi_beat",
    "timeline": [
      {
        "t_start": 0,
        "t_end": <number>,
        "action": "specific physical actions, expressions, movements for this beat",
        "framing": "shot framing during this beat",
        "camera_motion": "what the camera does"
      }
    ]
  },

  "audio": {
    "use_audio": <boolean>,
    "voiceline_script": "spoken words if person speaks on camera, null otherwise",
    "speaker": "who speaks, their position (on/off screen), vocal tone and delivery",
    "audio_quality": "what the audio sounds like — match the capture device and environment"
  },

  "constraints": {
    "no_dialogue": <boolean - true if no one speaks on camera>,
    "no_voiceover": true,
    "no_music": true,
    "no_text_overlay": true,
    "must_look_real": "One sentence describing what 'real' means for THIS specific scene and device."
  },

  "style_tags": ["the input style tags"]
}

CRITICAL:
- Fill in EVERY field with specific, reasoned details. No placeholders, no "[FILL]" markers, no generic defaults.
- Every decision must flow from the scene description and style tags. A podcast scene gets podcast equipment. A bedroom selfie gets phone camera.
- The shot_plan timeline should have ~2-second beats with realistic, subtle progression.
- Characters must feel like real people, not stock photos. Imperfect skin, natural posture, appropriate-for-context clothing.
- Environments must feel lived-in. Real rooms have clutter, mixed lighting, wear marks.`;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { idea, prompt, clipDuration, styleTags, voiceoverScript, audioSource, visualStyle, hookText, emotion } = body as {
      idea: string;
      prompt: string;
      clipDuration: string;
      styleTags: string[];
      voiceoverScript?: string;
      audioSource?: string;
      visualStyle?: { type: string; name: string; description: string };
      hookText?: string;
      emotion?: string;
    };

    const durationNum = parseInt(clipDuration) || 8;
    const hasSpeech = audioSource === "sora2" && !!voiceoverScript;

    const userMessage = `SCENE DESCRIPTION:
${idea}

${prompt ? `DETAILED SCENE CONTEXT:\n${prompt}\n` : ""}
${visualStyle ? `VISUAL STYLE: ${visualStyle.type} — ${visualStyle.name}\n${visualStyle.description}\n` : ""}
${hookText ? `HOOK TEXT (on-screen caption that will be overlaid in post): ${hookText}\n` : ""}
${emotion ? `TARGET EMOTION: ${emotion}\n` : ""}
${hasSpeech ? `VOICELINE SCRIPT (person speaks ON CAMERA — include dialogue in brief):\n${voiceoverScript}\n\nAUDIO SOURCE: sora2 — the person in this clip IS speaking. Sora2 generates their voice.\n` : ""}
${!hasSpeech && voiceoverScript ? `NOTE: A voiceover exists but it's a SEPARATE ElevenLabs audio track laid over this clip in post-production. The person in this clip does NOT speak. Generate silent/ambient footage only.\n\nAUDIO SOURCE: elevenlabs (post-production)\n` : ""}
${!voiceoverScript ? `AUDIO SOURCE: none — silent clip, text overlay added in post.\n` : ""}
DURATION: ${durationNum} seconds
${styleTags.length > 0 ? `STYLE/MOOD TAGS: ${styleTags.join(", ")}` : "No style tags provided — reason about what's appropriate for this scene."}

Generate the complete Sora 2 production brief JSON. Remember: this must look like REAL footage, not AI-generated content.`;

    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 2500,
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: userMessage }],
      temperature: 0.3,
    });

    const block = message.content[0];
    if (block.type !== "text") throw new Error("Unexpected response type");

    let text = block.text.trim();
    text = text.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "");

    const brief = JSON.parse(text);
    return NextResponse.json(brief);
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Brief generation failed";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
