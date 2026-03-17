"use client";

import { useState } from "react";
import { FRAMEWORK_VERSIONS } from "@/config/framework-versions";
import type { IFrameworkVersion } from "@/config/framework-versions";

// ============================================================
// SECTIONS — each renders a piece of the framework
// ============================================================

function PipelineSection() {
  return (
    <div className="space-y-8">
      <SectionTitle title="Generation Pipeline" subtitle="3 wall-clock steps — parallel where possible, sequential where context is needed" />

      {/* Step 1 */}
      <div className="space-y-4">
        <StepBadge step={1} label="PARALLEL" color="green" />
        <div className="grid grid-cols-3 gap-4">
          <PipelineNode name="Psyche Map" model="Sonnet" tokens="6K" color="pink" description="Map buyer psychology for this product" outputs={["Cognitive Profile", "Top 7 Biases", "Pain/Pleasure Points", "Dopamine Trigger", "Habit Loop"]} />
          <PipelineNode name="Sales Playbook" model="Sonnet" tokens="8K" color="orange" description="Map the persuasion landscape" outputs={["Market Sophistication", "Demand Temperature", "Top Cialdini Weapons", "Buyer Objections", "NLP Applications"]} />
          <PipelineNode name="Research" model="Opus" tokens="5K" color="green" description="Become the avatar — who buys this and why" outputs={["5 Audience Segments", "Benefit Expansion", "Identity Shift", "Avatar Traits"]} />
        </div>
      </div>

      {/* Arrow */}
      <FlowArrow label="All three feed into Creative Tree" />

      {/* Step 2 */}
      <div className="space-y-4">
        <StepBadge step={2} label="SEQUENTIAL" color="orange" />
        <div className="max-w-2xl mx-auto">
          <PipelineNode name="Creative Tree" model="Opus" tokens="12K" color="purple" description="Territory exploration engine — score 8 territories, generate 18 scripts across 5 frameworks" outputs={["8 Territories + Relevance Scores", "18 Scripts (native copy → distilled hooks)", "Platform Format Strategies"]} wide />
        </div>
      </div>

      <FlowArrow label="Top scored territories + hooks inspire final creatives" />

      {/* Step 3 */}
      <div className="space-y-4">
        <StepBadge step={3} label="PARALLEL (3a then 3b)" color="cyan" />
        <div className="grid grid-cols-2 gap-4">
          <PipelineNode name="Top Creatives" model="Opus" tokens="10K × 3" color="cyan" description="5 production-ready ad blueprints — mixed delivery modes, mixed visual styles" outputs={["5 Creatives (2+2+1 batching)", "5-6 Hooks each", "2-3 Bodies each", "Sora2 Prompts", "CTA"]} badge="STEP 3a" />
          <PipelineNode name="UGC Creatives" model="Opus" tokens="10K × 3" color="yellow" description="5 UGC-only text-overlay blueprints — all ugc-reaction with performance archetypes" outputs={["5 UGC Creatives (2+2+1)", "All text-overlay", "All ugc-reaction", "14 Archetypes", "4s Face Clips"]} badge="STEP 3b" />
        </div>
      </div>

      <FlowArrow label="" />

      {/* Output */}
      <div className="text-center">
        <div className="inline-block px-10 py-5 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-sm">
          <div className="text-3xl font-black mb-1">10 Production-Ready Ads</div>
          <div className="text-lg text-white/50">5 regular + 5 UGC — each with hooks, bodies, CTAs, Sora2 prompts</div>
        </div>
      </div>
    </div>
  );
}

function TemplateSection() {
  return (
    <div className="space-y-8">
      <SectionTitle title="Ad Template Structure" subtitle="Hook creates tension → Body resolves it through the product → CTA" />

      <div className="grid grid-cols-4 gap-3">
        <TemplateCard
          label="HOOK"
          nature="VARIABLE"
          natureColor="orange"
          borderColor="border-pink-500/30"
          bgColor="bg-pink-500/[0.04]"
          glowColor="shadow-pink-500/10"
          items={[
            { label: "Visual", value: "Person, scene, setting — NOT the product" },
            { label: "Text", value: "5-20 words — creates UNRESOLVED tension" },
            { label: "Duration", value: "3-5s (text) / 7-14s (VO)" },
          ]}
          note="This is where ALL creative variety lives"
          noteColor="text-pink-400"
        />
        <TemplateCard
          label="BRIDGE"
          nature="IMPLICIT"
          natureColor="purple"
          borderColor="border-purple-500/30"
          bgColor="bg-purple-500/[0.04]"
          glowColor="shadow-purple-500/10"
          items={[
            { label: "Text-overlay", value: "Lives in body text — answers WHY" },
            { label: "VO+caption", value: "Lives in voiceover transition" },
          ]}
          note="Without it, hook + body feel like two different ads"
          noteColor="text-purple-400"
        />
        <TemplateCard
          label="BODY"
          nature="CONSTANT VIDEO · VARIABLE TEXT"
          natureColor="cyan"
          borderColor="border-cyan-500/30"
          bgColor="bg-cyan-500/[0.04]"
          glowColor="shadow-cyan-500/10"
          items={[
            { label: "Visual", value: "Screen recording / product demo (real footage)" },
            { label: "Text", value: "Resolves the hook's premise — product reveals through resolution" },
            { label: "Duration", value: "5s" },
          ]}
          note="NOT a product description. Completes the hook's thought."
          noteColor="text-red-400"
        />
        <TemplateCard
          label="CTA"
          nature="FIXED"
          natureColor="green"
          borderColor="border-green-500/30"
          bgColor="bg-green-500/[0.04]"
          glowColor="shadow-green-500/10"
          items={[
            { label: "Text", value: "Action verb only" },
            { label: "Duration", value: "2-3s" },
          ]}
          note=""
          noteColor=""
        />
      </div>

      {/* Good vs Bad */}
      <div className="space-y-5 mt-6">
        <div>
          <div className="text-sm font-bold text-red-400 mb-3 tracking-wide">HOW IT GOES WRONG</div>
          <AdExample
            hookText="VBS prep used to take 20 hours. this year? 2 hours. done."
            hookNote="Creates tension: HOW?"
            bodyText="Bible Netflix that kids beg to watch. Works on any device."
            bodyNote="Generic product description. Doesn't answer HOW."
            bad
          />
        </div>
        <div>
          <div className="text-sm font-bold text-green-400 mb-3 tracking-wide">HOW IT SHOULD WORK</div>
          <AdExample
            hookText="VBS prep used to take 20 hours. this year? 2 hours. done."
            hookNote="Creates tension: HOW?"
            bodyText="One app. Every VBS episode queued up. Kids sit down, hit play."
            bodyNote="Resolves the premise. Product emerges through the answer."
          />
        </div>
        <div>
          <AdExample
            hookText="my kids know every Marvel character but can't name a single apostle"
            hookNote="Identity tension: I'm failing as a parent"
            bodyText="now they binge Bible stories the same way — and actually remember them"
            bodyNote="Resolves: kids engage with faith like entertainment"
          />
        </div>
      </div>
    </div>
  );
}

function DeliveryModesSection() {
  return (
    <div className="space-y-8">
      <SectionTitle title="Delivery Modes" subtitle="Each creative picks one — mix across the batch" />

      <div className="grid grid-cols-2 gap-5">
        <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-7 space-y-4">
          <div className="text-2xl font-bold">Text Overlay</div>
          <div className="text-base text-white/40">Silent video — text on screen only</div>
          <p className="text-base text-white/60 leading-relaxed">The text IS the entire ad. Copywriting carries everything. The visual sets emotional context, the text does the selling.</p>
          <div className="text-sm text-white/40"><strong className="text-white/70">Best for:</strong> scenic, screen recordings, dramatic footage, category anchors, UGC reactions</div>
          <div className="rounded-xl bg-white/[0.03] p-4 space-y-2 text-base">
            <TimingRow label="Hook" value="3s" />
            <TimingRow label="Body" value="5s" />
            <TimingRow label="CTA" value="2s" />
            <div className="border-t border-white/10 pt-2 mt-2">
              <TimingRow label="Total" value="~10s" bold />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-7 space-y-4">
          <div className="text-2xl font-bold">Voiceover + Caption</div>
          <div className="text-base text-white/40">Person speaks — caption on screen</div>
          <p className="text-base text-white/60 leading-relaxed">ONE CONTINUOUS NARRATION across hook + body. Bridge lives in the VO flow — last hook sentence connects to first body sentence.</p>
          <div className="text-sm text-white/40"><strong className="text-white/70">Best for:</strong> talking head, street interviews, confessions, authority staging, story-driven</div>
          <div className="rounded-xl bg-white/[0.03] p-4 space-y-2 text-base">
            <TimingRow label="Speaking pace" value="~2.2 words/sec" />
            <TimingRow label="Hook VO (15-30 words)" value="7-14s" />
            <TimingRow label="Body VO (10-20 words)" value="5-9s" />
            <TimingRow label="CTA" value="2-3s" />
            <div className="border-t border-white/10 pt-2 mt-2">
              <TimingRow label="Total VO words" value="25-50 max" bold />
              <TimingRow label="Total duration" value="15-30s" bold />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function VisualStylesSection() {
  const styles = [
    { name: "Authority Staging", color: "text-purple-400", desc: "Podcast set, news desk, lecture hall. Borrow credibility." },
    { name: "Scenic Interrupt", color: "text-cyan-400", desc: "Beautiful vista that stops the thumb." },
    { name: "Category Anchor", color: "text-orange-400", desc: "Show the THING they feel about. Bible, food, gym." },
    { name: "Routine Window", color: "text-green-400", desc: "Daily moment they recognize. Waking up, commuting." },
    { name: "Social Curiosity", color: "text-pink-400", desc: "Street interviews, reactions, 'what did they say?'" },
    { name: "Narrative Animation", color: "text-yellow-400", desc: "Animated storytelling. Signals 'story, not ad.'" },
    { name: "UGC Reaction", color: "text-yellow-300", desc: "Real person on camera. Their face IS the hook." },
    { name: "Dramatic Reenactment", color: "text-red-400", desc: "Acted-out relatable scenario. Skit, POV." },
    { name: "Product in Context", color: "text-teal-400", desc: "Product in its natural environment." },
    { name: "Dynamic", color: "text-white/50", desc: "Claude-invented style outside archetypes." },
  ];

  return (
    <div className="space-y-6">
      <SectionTitle title="10 Visual Hook Styles" subtitle="The visual stops the scroll before the text registers — choose what makes the hook MORE believable" />
      <div className="grid grid-cols-5 gap-3">
        {styles.map((s) => (
          <div key={s.name} className="rounded-xl border border-white/10 bg-white/[0.02] p-5 hover:bg-white/[0.04] transition-colors">
            <div className={`text-sm font-bold mb-2 ${s.color}`}>{s.name}</div>
            <div className="text-sm text-white/40 leading-relaxed">{s.desc}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function UGCSection() {
  const archetypes = [
    { name: "Shock Excited", arousal: "HIGH", color: "border-t-red-500", aColor: "text-red-400", desc: "Eyes wide, natural 'oh shit' moment" },
    { name: "Rant Passionate", arousal: "HIGH", color: "border-t-red-500", aColor: "text-red-400", desc: "Fired up, can't hold back, gesturing" },
    { name: "Chaotic Interrupt", arousal: "HIGH", color: "border-t-orange-500", aColor: "text-red-400", desc: "Unexpected behavior, breaks scroll pattern" },
    { name: "Playing Coy", arousal: "MED", color: "border-t-pink-500", aColor: "text-purple-400", desc: "Slight smirk, knows something you don't" },
    { name: "Skeptic Converted", arousal: "MED", color: "border-t-purple-500", aColor: "text-purple-400", desc: "Reluctant admission: 'ok fine, it works'" },
    { name: "Bestie Conspiratorial", arousal: "MED", color: "border-t-fuchsia-500", aColor: "text-purple-400", desc: "Close to camera, whispering a secret" },
    { name: "Curious Intrigued", arousal: "MED", color: "border-t-cyan-500", aColor: "text-purple-400", desc: "Head tilt, discovering in real time" },
    { name: "Quiet Confidence", arousal: "MED", color: "border-t-green-500", aColor: "text-purple-400", desc: "Slight smile, calm, found the answer" },
    { name: "Vulnerable Soft", arousal: "LOW", color: "border-t-violet-500", aColor: "text-cyan-400", desc: "Looking down, quiet, real vulnerability" },
    { name: "Caught Guilty", arousal: "LOW", color: "border-t-slate-500", aColor: "text-cyan-400", desc: "Phone glow, pause, private guilt moment" },
    { name: "Exhausted Done", arousal: "LOW", color: "border-t-slate-400", aColor: "text-cyan-400", desc: "Tired eyes, rubs face, genuinely depleted" },
    { name: "Casual Unbothered", arousal: "LOW", color: "border-t-stone-500", aColor: "text-cyan-400", desc: "Just existing. Person anchors, text sells" },
    { name: "FOMO Left Behind", arousal: "LOW", color: "border-t-blue-500", aColor: "text-cyan-400", desc: "Watching others succeed, 'why not me'" },
    { name: "Nostalgic Remembering", arousal: "LOW", color: "border-t-amber-500", aColor: "text-cyan-400", desc: "Distant gaze, lost in memory, ache" },
  ];

  return (
    <div className="space-y-6">
      <SectionTitle title="14 UGC Performance Archetypes" subtitle="Each = specific behavioral energy for Sora2. Pick emotion + action from arrays, appearance from global pool." />

      <div className="grid grid-cols-4 gap-3">
        {archetypes.map((a) => (
          <div key={a.name} className={`rounded-xl border border-white/10 bg-white/[0.02] p-5 border-t-2 ${a.color} hover:bg-white/[0.04] transition-colors`}>
            <div className="text-sm font-bold mb-1">{a.name}</div>
            <div className={`text-xs font-bold mb-2 ${a.aColor}`}>{a.arousal} AROUSAL</div>
            <div className="text-sm text-white/40 leading-relaxed">{a.desc}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-4 mt-4">
        <div className="rounded-xl bg-white/[0.02] border border-white/10 p-5">
          <div className="text-sm font-bold mb-3 text-cyan-400">Appearance Pool</div>
          <div className="space-y-1 text-sm text-white/50">
            <div><span className="text-white/70">Age:</span> 18-24, 25-34, 35-44, 45-54</div>
            <div><span className="text-white/70">Gender:</span> female, male</div>
            <div><span className="text-white/70">Ethnicity:</span> caucasian, african-american, hispanic, asian, middle-eastern, mixed</div>
            <div><span className="text-white/70">Build:</span> slim, average, athletic, curvy, stocky</div>
            <div><span className="text-white/70">Style:</span> oversized tee, casual hoodie, fitted tank, work blouse, gym clothes</div>
            <div><span className="text-white/70">Hair:</span> messy bun, short crop, loose natural, braids, buzz cut</div>
            <div><span className="text-white/70">Details:</span> no makeup, minimal makeup, tired eyes, glasses, stubble, freckles</div>
          </div>
        </div>
        <div className="space-y-4">
          <div className="rounded-xl bg-white/[0.02] border border-white/10 p-5">
            <div className="text-sm font-bold mb-3 text-cyan-400">Environment Pool (10)</div>
            <div className="flex flex-wrap gap-2">
              {["parked car", "bedroom, lamp light", "couch, living room", "kitchen, morning light", "bathroom mirror", "office desk", "park bench", "coffee shop", "bed at night", "gym locker room"].map((e) => (
                <span key={e} className="text-xs px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.06] text-white/50">{e}</span>
              ))}
            </div>
          </div>
          <div className="rounded-xl bg-red-500/[0.05] border border-red-500/20 p-5">
            <div className="text-sm font-bold mb-2 text-red-400">Sora2 Face Clip Rules</div>
            <div className="space-y-1 text-sm text-white/50">
              <div><strong className="text-white/70">MAX 4s</strong> per face clip</div>
              <div><strong className="text-white/70">ONE expression</strong> per clip — no transitions</div>
              <div><strong className="text-white/70">ONE gaze</strong> + one micro-variation</div>
              <div><strong className="text-white/70">Phone glow</strong> never sole light source</div>
              <div><strong className="text-white/70">No phone screen</strong> visible in frame</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function CopyRulesSection() {
  const rules = [
    { title: "Hooks create TENSION, not resolution", body: "Leave something unresolved — guilt, curiosity, identity gap. If tension is resolved in the hook, no reason to keep watching.", bad: '"screen time guilt is gone when they\'re watching this"', good: '"my kids know every Marvel character but can\'t name a single apostle"' },
    { title: "Body resolves the hook's SPECIFIC premise", body: "Body text is the second beat of the copy, not a product card. It answers the question the hook created.", bad: '"Bible Netflix - unlimited shows"', good: '"now they binge Bible stories the same way — and actually remember them"' },
    { title: "Natural flowing sentences ONLY", body: 'Must pass: "would a real person say this to a friend?"', bad: '"No fluff. No filler. Just results." (AI staccato)', good: '"I have every Bible app on my phone and I still don\'t read Scripture"' },
    { title: "NO metaphors, NO poetry, NO literary language", body: "Specific, concrete, plain language. Real people don't talk in literary constructs.", bad: '"spiritually starving while sitting in front of a feast"', good: '"I scroll for two hours every night and then wonder why I feel empty"' },
    { title: "Emotion follows the product", body: "Faith = guilt, longing. Candy = craving, nostalgia. Book app = curiosity, intellectual ego. Don't force direction — follow the product." },
    { title: "Platform voice matters", body: "TikTok: casual, confessional, lowercase energy. Meta/IG: composed but concrete, specific details." },
    { title: "NO proxy embarrassment", body: "Never use children, family, friends as the shame source. Emotion comes from WITHIN the viewer." },
    { title: "Hook text + visual = ONE UNIT", body: "Visual sets emotional context, text articulates it. Same emotion. Never text on disconnected background." },
  ];

  return (
    <div className="space-y-6">
      <SectionTitle title="Copy Quality Rules" subtitle="Every piece of copy must pass these checks" />
      <div className="grid grid-cols-2 gap-4">
        {rules.map((r) => (
          <div key={r.title} className="rounded-xl border border-white/10 bg-white/[0.02] p-5">
            <div className="text-base font-bold mb-2">{r.title}</div>
            <div className="text-sm text-white/50 leading-relaxed mb-2">{r.body}</div>
            {r.bad && <div className="text-sm text-red-400/80">BAD: {r.bad}</div>}
            {r.good && <div className="text-sm text-green-400/80">GOOD: {r.good}</div>}
          </div>
        ))}
      </div>
    </div>
  );
}

function AIBlindspotsSection() {
  const blindspots = [
    { title: "Sanitizes by default", body: "Skips shame, temptation, guilt. These are the highest-intent segments. Use implication, not banned words." },
    { title: "Thinks in abstract categories", body: 'Outputs "guilt" as a label instead of "I set my alarm to pray and hit snooze every single time."' },
    { title: "Avoids negative emotion", body: "Leans aspirational when pain converts harder. Jumps to the AFTER instead of sitting in the BEFORE." },
    { title: "Hooks resolve instead of creating tension", body: '"Screen time guilt is gone" states the resolution in the hook. Nothing left for the body.' },
    { title: "Body defaults to product description", body: 'Produces "Netflix for Bible content" (TV commercial) instead of resolving the hook\'s premise.' },
    { title: "Staccato AI fragment pattern", body: '"No fluff. No filler. Just results." — most recognizable AI cadence. Instantly breaks authenticity.' },
    { title: "Over-intellectualizes", body: "Adds framework complexity where raw simplicity wins. A hook doesn't need to be clever, it needs to be true." },
  ];

  return (
    <div className="space-y-6">
      <SectionTitle title="Known AI Blindspots" subtitle="Patterns where Claude consistently fails without explicit correction" />
      <div className="space-y-3">
        {blindspots.map((b) => (
          <div key={b.title} className="rounded-xl border border-white/10 border-l-4 border-l-red-500/60 bg-white/[0.02] px-6 py-4">
            <div className="text-base font-bold mb-1">{b.title}</div>
            <div className="text-sm text-white/50 leading-relaxed">{b.body}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function HardcodedDataSection() {
  const groups = [
    { title: "Psychological Territories", count: 8, items: ["Identity Tension", "Displacement Anxiety", "Loss & Decay", "Social Positioning", "Aspiration Gap", "Habit Architecture", "Discovery & Revelation", "Relief & Surrender"] },
    { title: "Copywriting Frameworks", count: 5, items: ["PAS", "AIDA", "BAB", "4Ps", "STAR"] },
    { title: "Brain Regions", count: 10, items: ["Prefrontal Cortex", "Anterior Cingulate", "Nucleus Accumbens", "Amygdala", "Hippocampus", "Insula", "TPJ", "vmPFC", "Motor Cortex", "Visual Cortex"] },
    { title: "Cognitive Profiles", count: 9, items: ["Habit Hijack", "Mirror Effect", "Ambient Integration", "Investment Escalation", "Tribal Gravity", "Variable Reward", "Competence Drive", "Relief Architecture", "Value Proposition"] },
    { title: "Cognitive Biases", count: 15, items: ["Loss Aversion", "Curiosity Gap", "Framing", "Anchoring", "Social Proof", "Confirmation", "Default Effect", "Bandwagon", "Hyperbolic Discounting", "Endowment", "Status Quo", "Authority", "Commitment", "IKEA Effect", "Scarcity"] },
    { title: "Sales Frameworks", items: ["Hormozi Value Equation", "5 Awareness Levels (Schwartz)", "6 Cialdini Weapons", "Belfort Straight Line", "5 NLP Techniques", "Market Sophistication (1-5)", "3-Stage Retargeting Funnel"] },
    { title: "Persuasion Stack", count: 5, items: ["L1: Attention Capture (0-3s)", "L2: Emotional Engagement (3-10s)", "L3: Rational Justification (10-20s)", "L4: Behavioral Trigger (20-30s)", "L5: Habit Formation (Day 1-30)"] },
    { title: "Production", items: ["14 UGC Archetypes", "Appearance Pool (7 dims)", "Environment Pool (10)", "Sora2 Style Tags (9 cats)", "Face Clip Rules"] },
  ];

  return (
    <div className="space-y-6">
      <SectionTitle title="Hardcoded Framework Data" subtitle="User's IP — sent to Claude as fixed structure, Claude only personalizes within it" />
      <div className="grid grid-cols-3 gap-4">
        {groups.map((g) => (
          <div key={g.title} className="rounded-xl border border-white/10 bg-white/[0.02] p-5">
            <div className="text-sm font-bold mb-3 flex items-center gap-2">
              {g.title}
              {g.count && <span className="text-xs px-2 py-0.5 rounded-full bg-white/[0.06] text-white/40">{g.count}</span>}
            </div>
            <div className="flex flex-wrap gap-1.5">
              {g.items.map((item) => (
                <span key={item} className="text-xs px-2.5 py-1 rounded-md bg-white/[0.04] border border-white/[0.06] text-white/50">{item}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function TechSection() {
  return (
    <div className="space-y-6">
      <SectionTitle title="Technical Details" subtitle="" />
      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-xl border border-white/10 bg-white/[0.02] p-5">
          <div className="text-sm font-bold mb-3 text-cyan-400">Stack</div>
          <div className="space-y-1.5 text-sm text-white/50">
            <div>Next.js 15.1 App Router + TypeScript</div>
            <div>@anthropic-ai/sdk (claude-opus-4-20250514)</div>
            <div>Supabase for persistence</div>
            <div>SWR + useSWRMutation</div>
            <div>Tailwind CSS + ShadCN tokens</div>
          </div>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/[0.02] p-5">
          <div className="text-sm font-bold mb-3 text-cyan-400">Generation Config</div>
          <div className="space-y-1.5 text-sm text-white/50">
            <div>Psyche Map: <span className="text-cyan-400">Sonnet</span> · 6K tokens</div>
            <div>Sales Playbook: <span className="text-cyan-400">Sonnet</span> · 8K tokens</div>
            <div>Research: <span className="text-purple-400">Opus</span> · 5K tokens</div>
            <div>Creative Tree: <span className="text-purple-400">Opus</span> · 12K tokens</div>
            <div>Top Creatives: <span className="text-purple-400">Opus</span> · 10K × 3 batches</div>
            <div>UGC Creatives: <span className="text-purple-400">Opus</span> · 10K × 3 batches</div>
            <div>Temperature: 0.4 · Retry: 3 attempts (1s, 2s, 4s backoff)</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// SHARED COMPONENTS
// ============================================================

function SectionTitle({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="mb-2">
      <h2 className="text-2xl font-bold">{title}</h2>
      {subtitle && <p className="text-base text-white/40 mt-1">{subtitle}</p>}
    </div>
  );
}

function StepBadge({ step, label, color }: { step: number; label: string; color: string }) {
  const colors: Record<string, string> = {
    green: "bg-green-500/15 text-green-400 border-green-500/30",
    orange: "bg-orange-500/15 text-orange-400 border-orange-500/30",
    cyan: "bg-cyan-500/15 text-cyan-400 border-cyan-500/30",
  };
  return (
    <div className="flex items-center gap-3">
      <span className="text-sm font-bold text-white/30">STEP {step}</span>
      <span className={`text-xs font-bold px-3 py-1 rounded-full border ${colors[color]}`}>{label}</span>
    </div>
  );
}

function PipelineNode({ name, model, tokens, color, description, outputs, wide, badge }: {
  name: string; model: string; tokens: string; color: string; description: string; outputs: string[]; wide?: boolean; badge?: string;
}) {
  const borderColors: Record<string, string> = {
    pink: "border-pink-500/30", orange: "border-orange-500/30", green: "border-green-500/30",
    purple: "border-purple-500/30", cyan: "border-cyan-500/30", yellow: "border-yellow-500/30",
  };
  const nameColors: Record<string, string> = {
    pink: "text-pink-400", orange: "text-orange-400", green: "text-green-400",
    purple: "text-purple-400", cyan: "text-cyan-400", yellow: "text-yellow-400",
  };
  const modelTag = model === "Opus"
    ? "bg-purple-500/15 text-purple-400"
    : "bg-cyan-500/15 text-cyan-400";

  return (
    <div className={`rounded-xl border ${borderColors[color]} bg-white/[0.02] p-5 ${wide ? "" : ""}`}>
      <div className="flex items-center justify-between mb-2">
        <div className={`text-lg font-bold ${nameColors[color]}`}>{name}</div>
        <div className="flex gap-2">
          {badge && <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-white/[0.06] text-white/40">{badge}</span>}
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${modelTag}`}>{model}</span>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-white/[0.06] text-white/40">{tokens}</span>
        </div>
      </div>
      <div className="text-sm text-white/50 mb-3">{description}</div>
      <div className="flex flex-wrap gap-1.5">
        {outputs.map((o) => (
          <span key={o} className="text-xs px-2.5 py-1 rounded-md bg-white/[0.05] border border-white/[0.08] text-white/60">{o}</span>
        ))}
      </div>
    </div>
  );
}

function FlowArrow({ label }: { label: string }) {
  return (
    <div className="flex flex-col items-center gap-1 py-2">
      <div className="text-2xl text-white/20">↓</div>
      {label && <div className="text-xs text-white/30 italic">{label}</div>}
    </div>
  );
}

function TemplateCard({ label, nature, natureColor, borderColor, bgColor, glowColor, items, note, noteColor }: {
  label: string; nature: string; natureColor: string; borderColor: string; bgColor: string; glowColor: string;
  items: { label: string; value: string }[]; note: string; noteColor: string;
}) {
  const nColors: Record<string, string> = {
    orange: "bg-orange-500/15 text-orange-400",
    purple: "bg-purple-500/15 text-purple-400",
    cyan: "bg-cyan-500/15 text-cyan-400",
    green: "bg-green-500/15 text-green-400",
  };
  return (
    <div className={`rounded-xl border ${borderColor} ${bgColor} p-5 shadow-lg ${glowColor}`}>
      <div className="text-xs font-black tracking-[2px] text-white/60 mb-2">{label}</div>
      <div className={`text-[10px] font-bold px-2 py-0.5 rounded inline-block mb-3 ${nColors[natureColor]}`}>{nature}</div>
      <div className="space-y-2">
        {items.map((item) => (
          <div key={item.label} className="text-sm rounded-lg bg-white/[0.03] px-3 py-2">
            <span className="text-white/70 font-medium">{item.label}:</span>{" "}
            <span className="text-white/45">{item.value}</span>
          </div>
        ))}
      </div>
      {note && <div className={`text-xs mt-3 font-medium ${noteColor}`}>{note}</div>}
    </div>
  );
}

function AdExample({ hookText, hookNote, bodyText, bodyNote, bad }: {
  hookText: string; hookNote: string; bodyText: string; bodyNote: string; bad?: boolean;
}) {
  return (
    <div className="flex gap-3 items-stretch">
      <div className="flex-1 rounded-xl bg-pink-500/[0.05] border border-pink-500/20 p-5">
        <div className="text-[10px] font-black tracking-[2px] text-pink-400/60 mb-2">HOOK</div>
        <div className="text-base font-bold leading-snug">&ldquo;{hookText}&rdquo;</div>
        <div className="text-xs text-white/40 mt-2 italic">{hookNote}</div>
      </div>
      <div className="flex items-center text-xl text-white/20">→</div>
      <div className={`flex-1 rounded-xl p-5 ${bad ? "bg-red-500/[0.05] border border-red-500/20" : "bg-cyan-500/[0.05] border border-cyan-500/20"}`}>
        <div className={`text-[10px] font-black tracking-[2px] mb-2 ${bad ? "text-red-400/60" : "text-cyan-400/60"}`}>BODY {bad ? "(BAD)" : "(GOOD)"}</div>
        <div className="text-base font-bold leading-snug">&ldquo;{bodyText}&rdquo;</div>
        <div className="text-xs text-white/40 mt-2 italic">{bodyNote}</div>
      </div>
    </div>
  );
}

function TimingRow({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-white/40">{label}</span>
      <span className={bold ? "text-white font-bold" : "text-white/70"}>{value}</span>
    </div>
  );
}

// ============================================================
// VERSION HISTORY PANEL
// ============================================================

function VersionTimeline({ versions, selected, onSelect }: {
  versions: IFrameworkVersion[]; selected: string; onSelect: (id: string) => void;
}) {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      {versions.map((v, i) => (
        <button
          key={v.id}
          onClick={() => onSelect(v.id)}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition-all border ${
            selected === v.id
              ? "bg-white/10 border-white/20 text-white"
              : "bg-white/[0.02] border-white/[0.06] text-white/40 hover:bg-white/[0.05] hover:text-white/60"
          }`}
        >
          <span className="font-bold">{v.id}</span>
          <span className="text-white/30 mx-2">|</span>
          <span>{v.date} {v.time}</span>
          {i === 0 && <span className="ml-2 text-[10px] font-bold px-1.5 py-0.5 rounded bg-green-500/15 text-green-400">CURRENT</span>}
        </button>
      ))}
    </div>
  );
}

function VersionChangelog({ version }: { version: IFrameworkVersion }) {
  const typeColors: Record<string, string> = {
    added: "bg-green-500/15 text-green-400",
    changed: "bg-blue-500/15 text-blue-400",
    removed: "bg-red-500/15 text-red-400",
    fixed: "bg-yellow-500/15 text-yellow-400",
  };

  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.02] p-6">
      <div className="flex items-center gap-4 mb-4">
        <div className="text-xl font-bold">{version.label}</div>
        <div className="text-sm text-white/40">{version.date} at {version.time}</div>
      </div>
      <div className="text-sm text-white/50 mb-4">{version.summary}</div>
      <div className="space-y-2">
        {version.changes.map((c, i) => (
          <div key={i} className="flex items-start gap-3 text-sm">
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded mt-0.5 shrink-0 ${typeColors[c.type]}`}>{c.type.toUpperCase()}</span>
            <span className="text-white/30 shrink-0 w-32">{c.section}</span>
            <span className="text-white/60">{c.description}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================================
// MAIN PAGE
// ============================================================

export default function FrameworkPage() {
  const [selectedVersion, setSelectedVersion] = useState(FRAMEWORK_VERSIONS[0]?.id || "");
  const currentVersion = FRAMEWORK_VERSIONS.find((v) => v.id === selectedVersion) || FRAMEWORK_VERSIONS[0];

  return (
    <div className="min-h-screen bg-[#09090b] text-white">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-[#09090b]/80 backdrop-blur-xl border-b border-white/[0.06]">
        <div className="max-w-[1400px] mx-auto px-8 py-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h1 className="text-3xl font-black tracking-tight bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Framework Overview
              </h1>
              <p className="text-sm text-white/30 mt-1">Hybrid Architecture — Framework is hardcoded, Claude personalizes content</p>
            </div>
            <a href="/" className="text-sm text-white/30 hover:text-white/60 transition-colors px-4 py-2 rounded-lg border border-white/10 hover:border-white/20">
              Back to Home
            </a>
          </div>
          <VersionTimeline versions={FRAMEWORK_VERSIONS} selected={selectedVersion} onSelect={setSelectedVersion} />
        </div>
      </div>

      {/* Content */}
      <div className="max-w-[1400px] mx-auto px-8 py-10 space-y-16">
        {/* Version Changelog */}
        {currentVersion && <VersionChangelog version={currentVersion} />}

        {/* All Sections */}
        <PipelineSection />
        <div className="border-t border-white/[0.06]" />
        <TemplateSection />
        <div className="border-t border-white/[0.06]" />
        <DeliveryModesSection />
        <div className="border-t border-white/[0.06]" />
        <VisualStylesSection />
        <div className="border-t border-white/[0.06]" />
        <UGCSection />
        <div className="border-t border-white/[0.06]" />
        <CopyRulesSection />
        <div className="border-t border-white/[0.06]" />
        <AIBlindspotsSection />
        <div className="border-t border-white/[0.06]" />
        <HardcodedDataSection />
        <div className="border-t border-white/[0.06]" />
        <TechSection />
      </div>
    </div>
  );
}
