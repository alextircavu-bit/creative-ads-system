# Session Context — Creative Ads System
**Last updated:** 2026-03-18 17:00
**Purpose:** Gives a new Claude Code session full context to continue work. Read this + memory files + CLAUDE.md.

---

## What This System Does

AI-powered ad creative generation platform. User inputs a product/feature, system generates psychology analysis, sales intelligence, research, creative scripts, and production-ready ad blueprints across multiple formats.

**Hybrid architecture:** Framework is HARDCODED (user's IP). Claude ONLY personalizes content within that framework.

---

## Current Output Per Generation (v2.6)

**22 total creatives:**
- **5 regular** — mixed delivery modes (text-overlay + voiceover-caption), mixed visual styles
- **5 UGC text-overlay** — silent face clips, text on screen, 14 performance archetypes
- **3 Sora2 Bleed** — person speaks on camera, voice carries into body over screen recording
- **3 ElevenLabs Full VO** — silent footage (any visual, not just faces), AI narrates everything
- **3 Sora2 → ElevenLabs Handoff** — creator speaks hook, narrator takes body
- **3 Sora2 → Silence** — person speaks hook, body is silent text-only

---

## Generation Pipeline (3 wall-clock steps)

1. **Step 1 (parallel):** Psyche Map (Sonnet, 6K) + Sales Playbook (Sonnet, 8K) + Research (Opus, 5K)
2. **Step 2 (sequential):** Creative Tree (Opus, 12K) — informed by all 3
3. **Step 3a:** Top Creatives — 3 parallel Opus calls (2+2+1) = 5 creatives
4. **Step 3b:** UGC Text-Overlay — 3 parallel Opus calls (2+2+1) = 5 creatives
5. **Step 3c:** 4 Audio Modes — 4 parallel Opus calls (1 per mode, 3 creatives each) = 12 creatives

Steps 3a → 3b → 3c sequenced. Retry logic: 3 attempts with exponential backoff.

---

## Ad Template Structure

- **Hook** (VARIABLE): Creates emotional tension. Up to 5 per creative. Independent swiping.
- **Body** (1-2 NARRATIVE RESOLUTIONS): Bridges hook tension to feature. Independent swiping. ANY hook + ANY body = one coherent ad.
- **CTA** (FIXED): Action verb only.

### Critical Rules:
- Bodies written FIRST, then hooks that bridge to ALL bodies
- Body text is NARRATIVE resolution (5-15 words), NOT product spec
- Product-hook fit check: feature must directly solve the hook's tension
- Hook structures must vary: confession, question, how-to, observation, incomplete thought, challenge, reframe
- VO body scripts end with spoken CTA ("tap below to get it")

---

## 4 Audio Modes (new in this session)

### Mode 1: Sora2 Bleed (`sora2BleedPrompt`)
- Person speaks on camera (Sora2, 8s/12s)
- Voice continues playing over body screen recording
- One continuous script split at visual cut point
- Body VO ends with spoken CTA

### Mode 2: ElevenLabs Full VO (`elevenlabsFullVOPrompt`)
- Silent footage — NOT limited to face clips
- Can be: person doing activity, scene, object, any visual style
- ElevenLabs AI narrates over everything (hook + body)
- Visual sets mood, VO tells story

### Mode 3: Sora2 → ElevenLabs Handoff (`sora2ElevenlabsHandoffPrompt`)
- Creator speaks on camera during hook (Sora2)
- Different ElevenLabs narrator takes body
- Voice change is intentional: creator → narrator
- Both need voiceGender

### Mode 4: Sora2 → Silence (`sora2SilencePrompt`)
- Person speaks on camera during hook (Sora2)
- Body is completely silent, text overlay only
- The silence is intentional and powerful

---

## UGC System

### Performance Archetypes (14)
shock-excited, rant-passionate, chaotic-interrupt, playing-coy, skeptic-converted, bestie-conspiratorial, curious-intrigued, quiet-confidence, vulnerable-soft, caught-guilty, exhausted-done, casual-unbothered, fomo-left-behind, nostalgic-remembering

### Appearance: 80% white attractive, 20% Black/Hispanic. NEVER Indian/ME/Asian.
### Environments: 10 locations (car, bedroom, couch, kitchen, etc.)

### Text-Overlay UGC Rules:
- 4s max clips, frozen emotional STATE
- No speech-implying actions
- iPhone front camera only, raw footage

### Speaking UGC Rules:
- 8s/12s clips (speech anchors coherence)
- Sora2 prompt includes dialogue + vocal delivery
- Max 26 words per clip at 2.2 words/sec

---

## Sora2 Prompt Rules

- **RAW iPHONE FOOTAGE for UGC.** Never cinematic, never studio lighting.
- iPhone front camera, propped/handheld, natural ambient light, imperfect framing
- NEVER: Sony FX3, DSLR, ring lights, key lights, shallow DOF
- 5-8 sentences per prompt
- Non-speaking: describe FEELING, not speech-implying actions
- Speaking: include dialogue, tone, pace in prompt

---

## Songs System (new)

11 songs in `src/config/songs.ts` and `src/public/songs/`. Each hook selects a `songPath` matched by emotion:
- happy: song_1 (Coldplay), song_9 (Charli XCX)
- sad: song_2 (Kanye), song_4 (Jacal)
- nostalgic: song_3 (Goldmund), song_6 (Frank Ocean), song_8 (Laisserai)
- neutral: song_5 (Daniel Caesar), song_10 (GNR)
- excited: song_7 (Outtapocket), song_11 (Looksmaxxing)

`drop_out_second` values are placeholders — user needs to fill manually.

---

## Shared Prompt Helpers (refactored)

Extracted to avoid duplication across 6 prompt functions:
- `buildDeepDiveContext()` — psychology, sales, research, creative tree intelligence
- `buildUGCSection()` — archetypes, appearance pool, environments
- `buildSongsSection()` — song catalog
- `buildCommonCopyRules()` — banned patterns, NLP, platform voice
- `buildFeedbackSection()` — feedback + existing creatives

---

## User's Key Feedback Patterns

1. **UGC must look like UGC.** Raw iPhone footage. Produced = scrolled past.
2. **No staccato.** "Skip devotions. Feel guilty. Repeat." — banned everywhere including VO scripts.
3. **No manufactured numbers.** "47 times" — nobody counted.
4. **Body text = narrative resolution.** Not product spec.
5. **Product-hook fit.** Feature must solve the hook's tension directly.
6. **Demographics.** 80% white/20% Black+Hispanic. Never Indian/ME/Asian.
7. **Shock-excited underused.** "Wait, it does THAT?" — staple for features.
8. **Teach reasoning, not examples.** Don't hardcode text Claude will copy.
9. **Never undermine product.** No "no app needed."
10. **Spar before deciding.** Discuss with user first.
11. **ElevenLabs Full VO isn't just faces.** Can be any natural footage — activities, scenes, objects.
12. **VO scripts sound like real people talking.** Not copywriter cadence.

---

## Creator Brief

Optional freeform input field. User's insider knowledge — winning angles, audience secrets, what excites them. Injected into all prompts as privileged context. Saved to project and restored on Fill.

---

## Input Fields (V3 mobile app form)
- App Name
- Feature Name
- Core Benefit (description)
- Creator Brief (optional)

---

## What's Pending / Open Questions

1. **Speaking UGC needs different archetype system** — current 14 archetypes designed for 4s frozen faces, not 8-12s monologues. Need speaking styles (confession, rant, whisper, casual aside, etc.)
2. **Authority-staging subtypes** — discussed but not built (podcast, news, testimonial, screen-share, quote)
3. **Generation quality testing** — user reviewing latest generation with all v2.5+ changes
4. **Song drop_out_second values** — need manual fill after listening

---

## Tech Stack
- Next.js 15.1 App Router + TypeScript
- `@anthropic-ai/sdk` with `claude-opus-4-20250514`
- `openai` SDK with `gpt-4o` (integrated, available for future use)
- Supabase for persistence
- SWR + useSWRMutation
- Tailwind CSS + ShadCN tokens
- Node.js path: `/c/Program Files/nodejs/`

---

## Key Files
- `src/config/prompts.ts` — All prompt functions (6 creative prompts + shared helpers)
- `src/config/framework-data.ts` — Hardcoded IP
- `src/config/ugc-archetypes.ts` — 14 UGC archetypes + appearance/environment pools
- `src/config/songs.ts` — 11 songs with emotion tags
- `src/config/framework-versions.ts` — Version history / changelog
- `src/app/api/generate/route.ts` — API route with batching + retry
- `src/types/creative.ts` — All TypeScript interfaces
- `src/components/top-creatives/top-creatives-tab.tsx` — Creative display UI
- `src/components/shared/landing-form.tsx` — Input form with Creator Brief
- `scripts/read-latest.mjs` — Utility to read latest generation from Supabase
