# Session Context — Creative Ads System
**Last updated:** 2026-03-18 14:30
**Purpose:** Gives a new Claude Code session full context to continue work. Read this + memory files + CLAUDE.md.

---

## What This System Does

AI-powered ad creative generation platform. User inputs a product/feature, system generates psychology analysis, sales intelligence, research, creative scripts, and 10 production-ready ad blueprints (5 regular + 5 UGC text-overlay).

**Hybrid architecture:** Framework is HARDCODED (user's IP). Claude ONLY personalizes content within that framework.

---

## Current Architecture State (v2.5)

### Generation Pipeline (3 wall-clock steps)
1. **Step 1 (parallel):** Psyche Map (Sonnet, 6K) + Sales Playbook (Sonnet, 8K) + Research (Opus, 5K)
2. **Step 2 (sequential):** Creative Tree (Opus, 12K) — informed by all 3
3. **Step 3a:** Top Creatives — 3 parallel Opus calls (2+2+1 batching) = 5 creatives
4. **Step 3b:** UGC Creatives — 3 parallel Opus calls (2+2+1) = 5 UGC text-overlay creatives
- Step 3b is sequenced AFTER 3a to avoid API overload
- Retry logic: 3 attempts with exponential backoff (1s, 2s, 4s)

### Ad Template Structure
- **Hook** (VARIABLE): Creates emotional tension. Up to 5 per creative. Independent swiping.
- **Body** (1-2 NARRATIVE RESOLUTIONS): Bridges hook tension to feature functionality. Independent swiping. ANY hook + ANY body in the same creative must make sense together.
- **CTA** (FIXED): Action verb only.

### Critical Rule: How Hooks and Bodies Connect
- Bodies are written FIRST as narrative resolutions for the emotional territory
- Hooks are written AFTER — only included if they bridge to ALL bodies
- Body text is NOT a product spec ("Bible verses on your lockscreen every hour")
- Body text IS a narrative ("now Scripture finds you first")
- 5-15 words max for body text
- The feature functionality is the CONSTANT. The narrative around it is what Claude generates.

### UGC System
- 14 performance archetypes (shock-excited, caught-guilty, vulnerable-soft, etc.)
- Appearance pool weighted: 80% white attractive, 20% Black/Hispanic. NEVER Indian/ME/Asian.
- Environment pool: 10 locations (car, bedroom, couch, kitchen, etc.)
- Non-speaking clips (text-overlay): 4s max, frozen emotional STATE, no speech-implying actions
- Speaking clips (VO+caption): 8s/12s fine, speech anchors facial coherence

### Sora2 Prompt Rules
- **RAW iPHONE FOOTAGE ONLY for UGC.** Never cinematic, never studio lighting, never professional cameras.
- iPhone front camera, propped or handheld, natural ambient light, imperfect framing
- NEVER: Sony FX3, DSLR, ring lights, key lights, shallow DOF
- 5-8 sentences per prompt. Each adds: person, environment, objects, light, camera, expression, texture.
- Non-speaking mode: describe what they FEEL, not what they're about to SAY

---

## All Changes Made Today (2026-03-18)

### v2.1 — UGC Batch + Body Text Fix (from previous session, 2026-03-17)
- Added dedicated UGC batch (5+5=10 creatives per generation)
- New `ugcCreativesPrompt()` function
- Sequenced UGC after regular (3+3 not 6 parallel)
- Added retry logic to `callClaude`
- Added `isUgcBatch` flag to `IAdCreativeBlueprint`

### v2.2 — V5 GPT Comparison + Face Clip Fix
- Added V5 scenario (GPT-4o for creatives, Claude for deep dive) — LATER DELETED by user request
- OpenAI SDK integrated, `callGPT()` with same retry logic
- Fixed face clip duration: 4s for silent only, 8s/12s for speaking
- Added `/framework` page with visual map + version timeline
- Added changelog on homepage

### v2.3 — Hook-Paired Body Text + Creator Brief
- Added `bodyText` field to hooks (LATER REMOVED in v2.5)
- Added Creator Brief input field — freeform insider knowledge from creator
- Creator Brief injected into all prompts as privileged context

### v2.4 — UGC Realism Overhaul + Audience DNA + Copy Quality
- Rewrote VISUAL PROMPT DEPTH to enforce raw iPhone footage
- Banned studio lighting, professional cameras, cinematic language in Sora2 prompts
- Appearance pool weighted 80/20 white/minority. Never Indian/ME/Asian.
- Promoted shock-excited as staple archetype for app feature discovery
- Expanded banned AI copy patterns: staccato, "No X. No Y. Just Z.", manufactured numbers, news headlines
- Added read-aloud test for hooks

### v2.5 — Hook-Body Bridge Architecture + Reasoning Overhaul
- Bodies written FIRST as narrative resolutions, hooks bridge to ALL bodies
- Hooks reduced to UP TO 5 (quality-gated by bridge fit)
- Bodies reduced to 1-2 (narrative resolution, 5-15 words)
- Removed `bodyText` from `IHookVariation` — bodies are their own array
- Prompts teach REASONING patterns, not hardcoded example text
- Product-hook fit check: feature must directly solve hook's tension
- Hook structure variety: confession, question, how-to, observation, incomplete thought, challenge, reframe
- Banned "no app needed" / "without opening anything"
- Non-speaking UGC clips describe frozen emotional state, not speech-implying actions
- Sora2 prompt length increased to 5-8 sentences
- Fixed PhoneMockup crash (safeIndex bounds guard)
- Creator Brief restored from history on Fill button
- Previous projects show generation timestamp

---

## User's Key Feedback Patterns (critical for next session)

1. **UGC must look like UGC.** Raw iPhone footage. The moment it looks produced, it gets scrolled past. This is the #1 complaint.
2. **No staccato AI cadence.** "Skip devotions. Feel guilty. Repeat." — banned. Real humans don't talk like that. One flowing thought.
3. **No manufactured numbers.** "Deleted my history 47 times" — nobody counted. Only numbers a person would actually know.
4. **No product spec as body text.** "Bible verses appear on your lockscreen every hour automatically" is a feature sheet. The body is NARRATIVE.
5. **Product-hook fit.** A lockscreen verse doesn't fix your kid's Bible knowledge. The hook's tension must be solvable by the specific feature.
6. **Demographics matter.** 80% white attractive / 20% Black+Hispanic Christian. Never Indian/ME/Asian. This is a Christian American audience.
7. **Shock-excited archetype is underused.** "Wait, it does THAT?" — staple for app features, should appear frequently.
8. **Don't hardcode conclusions, teach reasoning.** Don't give Claude example text to copy. Teach it HOW to think about bridges.
9. **Never undermine the product.** "No app needed" kills the conversion. The user MUST download the app.
10. **Spar before deciding.** Don't make premature decisions — discuss with user first.
11. **Body text is narrative, not description.** The feature functionality is the constant. The body text is the story that connects tension to feature.

---

## Current File State

### Key Files Modified Today
- `src/config/prompts.ts` — Major rewrite of topCreativesPrompt + ugcCreativesPrompt (body-first logic, bridge architecture, UGC realism, demographics, copy quality rules)
- `src/config/ugc-archetypes.ts` — Appearance pool weighted 80/20
- `src/types/creative.ts` — Added `creatorBrief` to IProjectInput, added `isUgcBatch` to IAdCreativeBlueprint, `bodyText` added then REMOVED from IHookVariation
- `src/app/api/generate/route.ts` — UGC batch generation, retry logic, GPT integration (callGPT stays for future use)
- `src/components/top-creatives/top-creatives-tab.tsx` — safeIndex fix for PhoneMockup crash
- `src/components/shared/landing-form.tsx` — Creator Brief field, timestamp on history, Fill loads creatorBrief
- `src/app/page.tsx` — Changelog section from framework-versions.ts
- `src/app/framework/page.tsx` — Visual framework map with version timeline
- `src/config/framework-versions.ts` — Version history (v2.1 through v2.5)
- `src/lib/openai.ts` — OpenAI client (for future GPT comparison)

### Files NOT to touch without reading first
- `src/config/framework-data.ts` — Hardcoded IP (angles, frameworks, biases, etc.)
- `src/hooks/use-generation.ts` — Progressive generation orchestration
- `src/repositories/project.repository.ts` — Supabase persistence + sora2 stamping
- `src/components/shared/scenario-page.tsx` — Main app wrapper, sidebar, state management

---

## What's Pending / In Progress

1. **Generation quality testing** — User needs to run a new generation with all v2.5 prompt changes to see if bridges, demographics, UGC realism, and copy quality are improved. No generation has been run with the full v2.5 changes yet.
2. **Framework overview page** needs updating to reflect v2.5 architecture (bodies-first, bridge logic).
3. **Memory files** should be reviewed — some may reference outdated approaches (bodyText on hooks was added then removed).

---

## Tech Stack
- Next.js 15.1 App Router + TypeScript
- `@anthropic-ai/sdk` with `claude-opus-4-20250514`
- `openai` SDK with `gpt-4o` (integrated, used if scenario is v5)
- Supabase for persistence
- SWR + useSWRMutation for data fetching
- Tailwind CSS + ShadCN tokens
- Node.js path: `/c/Program Files/nodejs/`
- Windows bash: no `head`, `tail`, `findstr` — use `npx tsc --noEmit` for type checking
