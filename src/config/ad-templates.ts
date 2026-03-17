// ============================================================
// AD TEMPLATE LIBRARY - 19 Battle-Tested Formats
// Split by product experience type: Apps (8), Physical (8), Universal (6)
// The template must mirror how the user experiences the benefit.
// ============================================================

export type ExperienceType = "in-app" | "physical" | "outcome" | "consumable" | "utility" | "luxury-sensory";

export type TemplateCategory = "app" | "physical" | "universal";

export interface IStoryboardFrame {
  icon: string;
  label: string;
  time: string;
  description: string;
  size?: "sm" | "md" | "lg" | "xl"; // flex sizing
}

export interface IAdTemplate {
  id: string;
  category: TemplateCategory;
  title: string;
  subtitle: string;
  timing: string;
  color: string;           // accent color hex
  proven?: boolean;         // star proven badge
  frames: StoryboardFrame[];
  bestFor: string[];        // tag-best items
  alsoFor: string[];        // regular tags
  whyItWorks: string;
  experienceNote: string;
  experienceTypes: ExperienceType[]; // which experience types this template matches
}

// ============================================================
// EXPERIENCE TYPE DETECTION
// Determines how the user experiences the product benefit
// ============================================================

const EXPERIENCE_KEYWORDS: Record<ExperienceType, RegExp[]> = {
  "in-app": [
    /\bapp\b/i, /\bsoftware\b/i, /\bsaas\b/i, /\bplatform\b/i, /\bdigital\b/i,
    /\bscreen\b/i, /\bdownload\b/i, /\bsubscrib/i, /\bfeature\b/i, /\bui\b/i,
    /\bux\b/i, /\bdashboard\b/i, /\bnotification/i, /\bmobile\b/i, /\bweb\b/i,
    /\bapi\b/i, /\bcloud\b/i, /\bai\b/i, /\bautomation\b/i, /\bworkflow\b/i,
    /\bproductivity\b/i, /\btracker\b/i, /\banalytics\b/i, /\bintegrat/i,
  ],
  physical: [
    /\bwear\b/i, /\bhold\b/i, /\btouch\b/i, /\bfashion\b/i, /\bcloth/i,
    /\bshoes?\b/i, /\bsneaker/i, /\bgadget/i, /\bdevice\b/i, /\btool\b/i,
    /\bhardware\b/i, /\bfurniture\b/i, /\bhome\b/i, /\bkitchen\b/i,
    /\bclean/i, /\bbrush/i, /\bgarden/i, /\bphysical\b/i, /\bship/i,
    /\bdeliver/i, /\bpackag/i, /\bunbox/i,
  ],
  outcome: [
    /\bcourse\b/i, /\bcoach/i, /\bmentor/i, /\bconsult/i, /\bprogram\b/i,
    /\btraining\b/i, /\bcerti/i, /\bskill/i, /\blearn/i, /\bearn/i,
    /\bincome\b/i, /\bwealth\b/i, /\binvest/i, /\bfinance\b/i, /\btransform/i,
    /\bresult/i, /\bachiev/i, /\bgoal\b/i, /\bsuccess/i, /\bfreedom\b/i,
    /\bservice\b/i, /\bagency\b/i,
  ],
  consumable: [
    /\bfood\b/i, /\bdrink/i, /\bbeverage/i, /\bsupplement/i, /\bvitamin/i,
    /\bprotein\b/i, /\benergy\b/i, /\bcoffee\b/i, /\btea\b/i, /\bsnack/i,
    /\bmeal/i, /\brecipe/i, /\bcook/i, /\bingredient/i, /\borganic\b/i,
    /\bnutrition/i, /\bdiet\b/i, /\bpowder\b/i, /\bcapsule/i, /\bgummy/i,
  ],
  utility: [
    /\bvpn\b/i, /\bsecurity\b/i, /\bpassword\b/i, /\bbackup\b/i, /\bprotect/i,
    /\binsurance\b/i, /\bsafe/i, /\bprivacy\b/i, /\bantivirus/i, /\bencrypt/i,
    /\bstorage\b/i, /\bmanager\b/i, /\bscanner\b/i, /\butility\b/i,
  ],
  "luxury-sensory": [
    /\bluxury\b/i, /\bpremium\b/i, /\bcandle/i, /\bfragranc/i, /\bperfume/i,
    /\bskincare\b/i, /\bbeauty\b/i, /\bserum\b/i, /\bcream\b/i, /\bspa\b/i,
    /\bwellness\b/i, /\baroma/i, /\bhandcraft/i, /\bartisan/i, /\bstatione?ry\b/i,
  ],
};

/**
 * Detects experience types from product text, ranked by match strength.
 * Returns at least one type (defaults to "physical" if nothing matches).
 */
export function detectExperienceTypes(productText: string): ExperienceType[] {
  const scores: Record<ExperienceType, number> = {
    "in-app": 0, physical: 0, outcome: 0, consumable: 0, utility: 0, "luxury-sensory": 0,
  };

  for (const [type, patterns] of Object.entries(EXPERIENCE_KEYWORDS) as [ExperienceType, RegExp[]][]) {
    for (const p of patterns) {
      if (p.test(productText)) scores[type]++;
    }
  }

  const sorted = (Object.entries(scores) as [ExperienceType, number][])
    .filter(([, s]) => s > 0)
    .sort((a, b) => b[1] - a[1])
    .map(([t]) => t);

  return sorted.length > 0 ? sorted : ["physical"];
}

/**
 * Given detected experience types, returns matching templates ranked by relevance.
 * Templates that match the primary experience type come first.
 */
export function matchTemplates(experienceTypes: ExperienceType[]): AdTemplate[] {
  const primary = experienceTypes[0];
  const allTypes = new Set(experienceTypes);

  // Score each template
  const scored = AD_TEMPLATES.map((t) => {
    let score = 0;
    // Primary match = highest priority
    if (t.experienceTypes.includes(primary)) score += 10;
    // Secondary matches
    for (const et of t.experienceTypes) {
      if (allTypes.has(et)) score += 3;
    }
    // Proven templates get a boost
    if (t.proven) score += 5;
    // Universal templates get a small boost (always relevant)
    if (t.category === "universal") score += 2;
    return { template: t, score };
  });

  return scored
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((s) => s.template);
}

// ============================================================
// EXPERIENCE TYPE × TEMPLATE MATRIX (for reference)
// ============================================================
// In-App:        ★ Direct Demo, A2, A3, A5, A7       + U1, U2, U6
// Physical:      P1, P2, P3, P5, P8                   + U1, U2, U3, U6
// Outcome:       -                                     + U4 (VSL), U5, U3, U2
// Consumable:    P7, P4, P5, P3                        + U2, U3, U6
// Utility:       A2, A4, A6                            + U1, U6
// Luxury:        P4, P6, P2                            + U5
// ============================================================

export const EXPERIENCE_TYPE_LABELS: Record<ExperienceType, { name: string; color: string; example: string }> = {
  "in-app":        { name: "In-App",         color: "#818cf8", example: "Meditation, Fitness, Productivity" },
  physical:        { name: "Physical",       color: "#34d399", example: "Toothbrush, Kitchen, Fashion" },
  outcome:         { name: "Outcome",        color: "#fbbf24", example: "Courses, Coaching, Finance" },
  consumable:      { name: "Consumable",     color: "#f43f5e", example: "Energy drinks, Supplements" },
  utility:         { name: "Utility",        color: "#fb923c", example: "Password manager, VPN" },
  "luxury-sensory": { name: "Luxury/Sensory", color: "#94a3b8", example: "Candles, Premium skincare" },
};

// ============================================================
// ALL 19 TEMPLATES
// ============================================================

export const AD_TEMPLATES: AdTemplate[] = [
  // ─── APPS (A1–A8) ───────────────────────────────────────
  {
    id: "direct-demo",
    category: "app",
    title: "Direct Demo - Hook + Screen Recording + Text CTA",
    subtitle: "The proven baseline for app ads. Hook grabs attention, body shows actual product experience via screen recording, text CTA closes. No fancy production. Simple text overlay. This is what works.",
    timing: "20–25 sec",
    color: "#22c55e",
    proven: true,
    frames: [
      { icon: "🎯", label: "Hook", time: "0–3-5s", description: "Pattern interrupt. Simple text overlay or relatable scenario. Stops the scroll.", size: "md" },
      { icon: "📱", label: "Body - Screen Recording", time: "5–15s", description: "The actual product experience. Screen recording of the app/feature. This IS the ad. Simple text overlays.", size: "xl" },
      { icon: "👆", label: "Text CTA", time: "15–20s", description: "\"Download below\" / \"Tap to get it\" - text overlay only.", size: "sm" },
    ],
    bestFor: ["Mobile Apps", "SaaS", "Spark Ads"],
    alsoFor: ["Productivity", "Fitness Apps", "Finance Apps"],
    whyItWorks: "The product IS the proof. Screen recordings simulate the ownership experience before download. Spark Ads + sophisticated visuals = death.",
    experienceNote: "In-app - the user sees and uses the benefit on their screen",
    experienceTypes: ["in-app"],
  },
  {
    id: "problem-app-demo",
    category: "app",
    title: "Problem → App Demo → Relief",
    subtitle: "Start with the digital frustration, then screen-record the app solving it instantly.",
    timing: "15–25 sec",
    color: "#f43f5e",
    frames: [
      { icon: "😩", label: "Problem", time: "0–3s", description: "Text overlay of relatable digital pain point", size: "md" },
      { icon: "📱", label: "App Demo", time: "3–18s", description: "Screen recording showing the app solving the exact problem. Feature in action.", size: "xl" },
      { icon: "👆", label: "CTA", time: "18–22s", description: "\"Try it free\" text overlay", size: "sm" },
    ],
    bestFor: ["Productivity Apps", "Utility Apps", "SaaS"],
    alsoFor: [],
    whyItWorks: "Loss aversion hooks them, then the screen recording provides instant visual proof the problem is solved.",
    experienceNote: "In-app - the fix happens on-screen",
    experienceTypes: ["in-app", "utility"],
  },
  {
    id: "listicle-features",
    category: "app",
    title: "Listicle - \"X Features You Didn't Know\"",
    subtitle: "Numbered screen recording clips - each showing a different feature. Viewers stay to see all of them.",
    timing: "15–25 sec",
    color: "#60a5fa",
    frames: [
      { icon: "🔢", label: "Hook", time: "0–3s", description: "\"3 features that changed how I work\"", size: "md" },
      { icon: "1️⃣", label: "Feature 1", time: "3–8s", description: "Screen recording of feature A", size: "md" },
      { icon: "2️⃣", label: "Feature 2", time: "8–13s", description: "Screen recording of feature B", size: "md" },
      { icon: "3️⃣", label: "Feature 3", time: "13–18s", description: "Screen recording - best one last", size: "md" },
      { icon: "👆", label: "CTA", time: "18–22s", description: "Text overlay + link", size: "sm" },
    ],
    bestFor: ["Multi-Feature Apps", "SaaS", "Productivity"],
    alsoFor: [],
    whyItWorks: "Numbered structure creates a completion contract. Each feature is a micro-hook that re-engages. Feels educational, not like an ad.",
    experienceNote: "In-app - each feature is a screen recording",
    experienceTypes: ["in-app"],
  },
  {
    id: "app-comparison",
    category: "app",
    title: "App Comparison - Us vs. Competitor",
    subtitle: "Split-screen or sequential screen recordings: their clunky app vs. your smooth experience.",
    timing: "15–25 sec",
    color: "#2dd4bf",
    frames: [
      { icon: "⚔️", label: "Setup", time: "0–3s", description: "\"Why I switched from [competitor]\"", size: "md" },
      { icon: "👎", label: "Their App", time: "3–8s", description: "Screen recording: slow, clunky, confusing UI", size: "md" },
      { icon: "👍", label: "Your App", time: "8–16s", description: "Screen recording: same task, dramatically better UX", size: "lg" },
      { icon: "👆", label: "CTA", time: "16–22s", description: "\"Make the switch\" text", size: "sm" },
    ],
    bestFor: ["App Disruptors", "SaaS", "Fintech"],
    alsoFor: [],
    whyItWorks: "The competitor's screen recording serves as the anchor that makes your app look superior. Both experiences proven on-screen.",
    experienceNote: "In-app - side-by-side screen comparisons",
    experienceTypes: ["in-app", "utility"],
  },
  {
    id: "pov-native",
    category: "app",
    title: "POV - \"When You Finally Find An App That...\"",
    subtitle: "Native TikTok feel. POV text hook, then casual phone-in-hand footage of using the app.",
    timing: "9–20 sec",
    color: "#818cf8",
    frames: [
      { icon: "📱", label: "POV Hook", time: "0–3s", description: "\"POV: the app that replaced my notebook\"", size: "md" },
      { icon: "🤳", label: "Casual Use", time: "3–15s", description: "Phone-in-hand footage scrolling through app. Casual, real, unpolished.", size: "xl" },
      { icon: "💬", label: "Soft CTA", time: "15–20s", description: "\"Link in bio\" - casual, not salesy", size: "sm" },
    ],
    bestFor: ["Any App", "Spark Ads", "TikTok"],
    alsoFor: [],
    whyItWorks: "Brain processes it as peer recommendation, not advertising. Mimics FYP content. Polished app commercials see 50-70% lower engagement.",
    experienceNote: "In-app - phone-in-hand real usage",
    experienceTypes: ["in-app"],
  },
  {
    id: "comment-skeptic",
    category: "app",
    title: "Comment Skeptic - \"This App Is a Scam\"",
    subtitle: "Show a negative comment, then screen-record proof that crushes the objection.",
    timing: "15–25 sec",
    color: "#fbbf24",
    frames: [
      { icon: "💬", label: "Comment", time: "0–3s", description: "\"This app doesn't actually do anything\"", size: "md" },
      { icon: "🤝", label: "Relate", time: "3–5s", description: "\"I get it, I thought so too\"", size: "sm" },
      { icon: "📱", label: "Screen Proof", time: "5–18s", description: "Screen recording that directly disproves the objection", size: "xl" },
      { icon: "😏", label: "CTA", time: "18–22s", description: "\"Try it yourself\"", size: "sm" },
    ],
    bestFor: ["New Apps", "Premium Subscriptions", "\"Too Good To Be True\""],
    alsoFor: [],
    whyItWorks: "Negativity drives engagement. The screen recording proof is undeniable - viewers see the app working with their own eyes.",
    experienceNote: "In-app - screen recording as the objection crusher",
    experienceTypes: ["in-app", "utility"],
  },
  {
    id: "feature-tease",
    category: "app",
    title: "Feature Tease → Reveal",
    subtitle: "Blur or partially show an app feature, build curiosity, then reveal it in a screen recording.",
    timing: "10–20 sec",
    color: "#f472b6",
    frames: [
      { icon: "🫣", label: "Tease", time: "0–5s", description: "Blurred/partial screenshot. \"This feature changed everything\"", size: "lg" },
      { icon: "📱", label: "Reveal Demo", time: "5–15s", description: "Full screen recording of the feature in action", size: "xl" },
      { icon: "👆", label: "CTA", time: "15–20s", description: "\"Download below\"", size: "sm" },
    ],
    bestFor: ["Feature Updates", "New Apps", "AI Apps"],
    alsoFor: [],
    whyItWorks: "Curiosity gap - viewers MUST stay to see the reveal. Blurred screenshots outperform direct screenshots as hooks.",
    experienceNote: "In-app - the reveal is the screen recording",
    experienceTypes: ["in-app"],
  },
  {
    id: "green-screen-react",
    category: "app",
    title: "Green Screen - React to Review / Article",
    subtitle: "Creator green-screens a review or App Store screenshot, then bridges to a quick screen recording demo.",
    timing: "15–25 sec",
    color: "#4ade80",
    frames: [
      { icon: "📸", label: "React", time: "0–3s", description: "Green screen: review, article, or App Store rating", size: "md" },
      { icon: "🗣️", label: "Comment", time: "3–8s", description: "Quick opinion / context on the screenshot", size: "md" },
      { icon: "📱", label: "Demo", time: "8–18s", description: "\"Let me show you\" - screen recording", size: "lg" },
      { icon: "👆", label: "CTA", time: "18–22s", description: "Text overlay + link", size: "sm" },
    ],
    bestFor: ["Trending Apps", "Press Coverage", "Viral Moments"],
    alsoFor: [],
    whyItWorks: "Leverages external social proof (reviews, press) as the hook, then proves it with a screen recording. Native TikTok behavior.",
    experienceNote: "In-app - external proof → screen recording proof",
    experienceTypes: ["in-app"],
  },

  // ─── PHYSICAL PRODUCTS (P1–P8) ──────────────────────────
  {
    id: "before-after",
    category: "physical",
    title: "Before / After Transformation",
    subtitle: "Film the problem state, use the product, reveal the dramatic result. Visual proof bypasses all skepticism.",
    timing: "15–25 sec",
    color: "#a78bfa",
    frames: [
      { icon: "😕", label: "Before", time: "0–7s", description: "Real footage of the problem - dirty teeth, messy room, dull skin", size: "md" },
      { icon: "⚡", label: "Use", time: "7–9s", description: "Product in action - the magic moment", size: "sm" },
      { icon: "🤩", label: "After", time: "9–18s", description: "Dramatic reveal - slow pan, reaction shot, side-by-side", size: "lg" },
      { icon: "🛒", label: "CTA", time: "18–22s", description: "Product + price anchor", size: "sm" },
    ],
    bestFor: ["Beauty", "Fitness", "Cleaning"],
    alsoFor: ["Teeth Whitening", "Home Org"],
    whyItWorks: "Contrast effect - the \"after\" looks even more impressive relative to the \"before.\" Highest completion rates for visible-result products.",
    experienceNote: "Physical / visible result - camera captures the real transformation",
    experienceTypes: ["physical"],
  },
  {
    id: "unboxing",
    category: "physical",
    title: "Unboxing / First Impression",
    subtitle: "Package arrives → slow reveal of the physical product → genuine reaction → first use. Simulates ownership.",
    timing: "15–30 sec",
    color: "#fb7185",
    frames: [
      { icon: "📦", label: "Arrives", time: "0–3s", description: "\"My order finally came!\"", size: "md" },
      { icon: "🎁", label: "Unbox", time: "3–12s", description: "Slow reveal - tactile sounds, close-ups, textures", size: "xl" },
      { icon: "😍", label: "Reaction", time: "12–18s", description: "\"The quality!\" - first use or try-on", size: "lg" },
      { icon: "🔗", label: "CTA", time: "18–25s", description: "\"10/10, link below\"", size: "sm" },
    ],
    bestFor: ["Ecommerce", "Fashion", "Tech Gadgets"],
    alsoFor: ["Subscription Boxes", "Premium"],
    whyItWorks: "Curiosity about \"what's inside\" drives completion. Tactile close-ups trigger endowment effect - viewers feel like they already own it.",
    experienceNote: "Physical - you hold, touch, wear the product",
    experienceTypes: ["physical", "luxury-sensory"],
  },
  {
    id: "vox-pop",
    category: "physical",
    title: "Vox Pop / Street Interview",
    subtitle: "Approach a stranger, hand them the product, film their genuine live reaction. Real skepticism → real conversion.",
    timing: "20–30 sec",
    color: "#34d399",
    frames: [
      { icon: "🎤", label: "Approach", time: "0–3s", description: "\"Can I show you something?\"", size: "md" },
      { icon: "🤨", label: "Skeptic", time: "3–7s", description: "Doubt or current solution", size: "md" },
      { icon: "👀", label: "Live Demo", time: "7–18s", description: "Real-time product trial - they hold it, use it, taste it", size: "xl" },
      { icon: "😱", label: "Reaction", time: "18–25s", description: "\"Where has this been?!\"", size: "md" },
    ],
    bestFor: ["Wow Factor", "Cleaning", "Beauty Tools"],
    alsoFor: ["Food/Taste Tests", "Gadgets"],
    whyItWorks: "Real person, real skepticism, real conversion - all on camera. Viewers identify with the stranger's doubt.",
    experienceNote: "Physical - hands-on demo in real world",
    experienceTypes: ["physical", "consumable"],
  },
  {
    id: "asmr-sensory",
    category: "physical",
    title: "ASMR / Sensory Showcase",
    subtitle: "Extreme close-ups, satisfying sounds, no music. The texture, the pour, the crunch. Let the product's physicality sell itself.",
    timing: "15–30 sec",
    color: "#a3e635",
    frames: [
      { icon: "🔇", label: "Sound", time: "0–3s", description: "Close-up. Satisfying click / pour / crunch. No text.", size: "md" },
      { icon: "🤲", label: "Sensory", time: "3–18s", description: "Texture close-ups, slow movements, unwrapping, application sounds", size: "xl" },
      { icon: "📦", label: "Reveal", time: "18–22s", description: "Pull back - full product + brand", size: "md" },
      { icon: "🔗", label: "CTA", time: "22–25s", description: "Minimal text + link", size: "sm" },
    ],
    bestFor: ["Food/Bev", "Skincare", "Luxury"],
    alsoFor: ["Candles", "Stationery"],
    whyItWorks: "ASMR triggers a pleasurable neurological response. Stands out in a loud, fast feed by being the opposite.",
    experienceNote: "Physical / sensory - you feel, taste, touch the benefit",
    experienceTypes: ["physical", "consumable", "luxury-sensory"],
  },
  {
    id: "grwm",
    category: "physical",
    title: "GRWM / Day-in-the-Life",
    subtitle: "Product appears naturally within a daily routine - morning skincare, gym bag, kitchen prep. Feels like lifestyle inspiration.",
    timing: "20–45 sec",
    color: "#e879f9",
    frames: [
      { icon: "☀️", label: "Routine", time: "0–3s", description: "\"Get ready with me\"", size: "md" },
      { icon: "🪥", label: "Setup", time: "3–10s", description: "Normal morning activities", size: "md" },
      { icon: "✨", label: "Product", time: "10–20s", description: "Product fits naturally - using it in real setting", size: "lg" },
      { icon: "👋", label: "Continue", time: "20–30s", description: "Rest of day, product's effect visible", size: "md" },
    ],
    bestFor: ["Beauty", "Wellness", "Fitness Gear"],
    alsoFor: ["Kitchen", "Fashion"],
    whyItWorks: "Product is contextualized within an aspirational identity. The GRWM format is deeply native to TikTok/IG.",
    experienceNote: "Physical / routine - product integrates into real daily life",
    experienceTypes: ["physical", "consumable"],
  },
  {
    id: "quiet-flex",
    category: "physical",
    title: "Quiet Flex (2026 Trend)",
    subtitle: "Cozy lighting, neutral palettes, clean spaces. Product used slowly, intentionally. Anti-hype. Calm = premium.",
    timing: "15–25 sec",
    color: "#94a3b8",
    frames: [
      { icon: "🕯️", label: "Ambiance", time: "0–5s", description: "Aspirational environment. Soft lighting. No text.", size: "lg" },
      { icon: "✨", label: "Product", time: "5–18s", description: "Product used slowly, intentionally. Beauty shots. Let it breathe.", size: "xl" },
      { icon: "🤫", label: "Soft CTA", time: "18–25s", description: "Minimal text. Product name + link. The vibe sells.", size: "md" },
    ],
    bestFor: ["Luxury", "Wellness", "Candles/Home"],
    alsoFor: ["Premium Skincare", "Premium Fashion"],
    whyItWorks: "Stands out in a feed of loud, fast content by being the opposite. Aspirational lifestyle positioning.",
    experienceNote: "Physical / sensory - premium real-world experience",
    experienceTypes: ["physical", "luxury-sensory"],
  },
  {
    id: "bad-reality-desired",
    category: "physical",
    title: "Bad Reality → Product → Desired Reality",
    subtitle: "For consumables: show the current bad state, use the product, then show the desired state. The product is the bridge.",
    timing: "15–25 sec",
    color: "#f43f5e",
    frames: [
      { icon: "😴", label: "Bad Reality", time: "0–5s", description: "Current state: exhausted, drained, struggling. Relatable footage.", size: "md" },
      { icon: "🥤", label: "Product", time: "5–8s", description: "Consume / take / apply - the transition moment", size: "md" },
      { icon: "⚡", label: "Desired Reality", time: "8–18s", description: "Energized, glowing, crushing it. Taste/design are ornaments.", size: "xl" },
      { icon: "🛒", label: "CTA", time: "18–22s", description: "Product + offer", size: "sm" },
    ],
    bestFor: ["Energy Drinks", "Supplements", "Protein"],
    alsoFor: ["Skincare", "Vitamins"],
    whyItWorks: "Before/after for consumables. The product is the bridge between the current painful reality and the desired outcome.",
    experienceNote: "Consumable - ingest/apply the product, feel the benefit",
    experienceTypes: ["consumable"],
  },
  {
    id: "physical-comparison",
    category: "physical",
    title: "Physical Comparison - Old Way vs. Your Product",
    subtitle: "Side-by-side real-world footage: the old way is slow, messy, frustrating. Your product does the same task dramatically better.",
    timing: "15–25 sec",
    color: "#2dd4bf",
    frames: [
      { icon: "⚔️", label: "Setup", time: "0–3s", description: "\"Watch the difference\"", size: "md" },
      { icon: "👎", label: "Old Way", time: "3–8s", description: "Real footage: slow, messy, manual, annoying", size: "md" },
      { icon: "👍", label: "Your Product", time: "8–16s", description: "Real footage: same task, way faster/better/cleaner", size: "lg" },
      { icon: "📊", label: "CTA", time: "16–22s", description: "Key differentiators + price", size: "sm" },
    ],
    bestFor: ["Kitchen Tools", "Cleaning", "Beauty Tools"],
    alsoFor: ["Home", "Garden"],
    whyItWorks: "Contrast bias - the old way serves as the anchor that makes your product look superior. Both are real footage.",
    experienceNote: "Physical / utility - real-world side-by-side demonstration",
    experienceTypes: ["physical"],
  },

  // ─── UNIVERSAL (U1–U6) ──────────────────────────────────
  {
    id: "solo-skit",
    category: "universal",
    title: "Solo Skit (Multiple Roles)",
    subtitle: "One person plays skeptic + advocate. Pre-handles objections through entertaining dialogue. Body adapts to product type.",
    timing: "15–30 sec",
    color: "#c084fc",
    frames: [
      { icon: "🙄", label: "Skeptic", time: "0–3s", description: "Character A: \"No way that works\"", size: "md" },
      { icon: "😏", label: "Advocate", time: "3–8s", description: "Character B: \"Let me show you\"", size: "md" },
      { icon: "🎬", label: "Demo", time: "8–18s", description: "Apps: screen recording / Products: real-world demo", size: "xl" },
      { icon: "😲", label: "Convert", time: "18–25s", description: "A: \"OK where do I get it?\"", size: "md" },
    ],
    bestFor: ["Any Skepticism", "Supplements", "New Tech/Apps"],
    alsoFor: ["Premium"],
    whyItWorks: "Dialogue keeps viewers watching. Pre-handles objections within the ad. Body just swaps footage type.",
    experienceNote: "Any - the skit structure is person-driven, body adapts",
    experienceTypes: ["in-app", "physical", "consumable", "utility"],
  },
  {
    id: "testimonial-mashup",
    category: "universal",
    title: "Testimonial Mashup",
    subtitle: "Quick-cut compilation of 3-5 real users. Each clip highlights one benefit. Apps: show screens. Products: show hands-on use.",
    timing: "20–30 sec",
    color: "#f472b6",
    frames: [
      { icon: "🔥", label: "Hook", time: "0–3s", description: "Montage flash + \"Everyone's obsessed\"", size: "sm" },
      { icon: "👩", label: "Clip 1", time: "3–6s", description: "Benefit A", size: "md" },
      { icon: "👨", label: "Clip 2", time: "6–9s", description: "Benefit B", size: "md" },
      { icon: "👩‍🦱", label: "Clip 3", time: "9–12s", description: "Benefit C", size: "md" },
      { icon: "🧑", label: "Clip 4", time: "12–18s", description: "Benefit D", size: "md" },
      { icon: "⭐", label: "CTA", time: "18–25s", description: "Rating + offer", size: "sm" },
    ],
    bestFor: ["Broad Audience", "Apps", "Skincare"],
    alsoFor: ["Food", "Supplements"],
    whyItWorks: "Volume of social proof overwhelms skepticism. Diverse faces = bandwagon effect. Each clip reinforces from a different angle.",
    experienceNote: "Any - each clip shows the person's experience",
    experienceTypes: ["in-app", "physical", "outcome", "consumable"],
  },
  {
    id: "drama-setup",
    category: "universal",
    title: "Drama Set-Up",
    subtitle: "Dramatic scene of a relatable struggle → character discovers the product → life improved. Mini movie.",
    timing: "15–30 sec",
    color: "#fb923c",
    frames: [
      { icon: "🎭", label: "Drama", time: "0–5s", description: "Relatable struggle scene - dramatic, emotional", size: "lg" },
      { icon: "💡", label: "Discovery", time: "5–12s", description: "Product revealed", size: "md" },
      { icon: "😌", label: "Resolution", time: "12–25s", description: "Life improved - product in daily use", size: "lg" },
      { icon: "👆", label: "CTA", time: "25–30s", description: "Link + urgency", size: "sm" },
    ],
    bestFor: ["Lifestyle", "Any DTC", "Wellness"],
    alsoFor: ["Apps", "Beauty"],
    whyItWorks: "Narrative transportation lowers defenses. The product feels like a natural resolution, not a pitch.",
    experienceNote: "Any - the drama is about the person, the product fits in",
    experienceTypes: ["physical", "outcome", "consumable"],
  },
  {
    id: "mini-vsl",
    category: "universal",
    title: "Mini-VSL (Video Sales Letter)",
    subtitle: "Bold claim → educate with real value → product as logical conclusion. For complex/premium products. Hormozi formula fits here.",
    timing: "30–60 sec",
    color: "#f97316",
    frames: [
      { icon: "⚡", label: "Claim", time: "0–3s", description: "Bold pattern interrupt", size: "md" },
      { icon: "📊", label: "Credibility", time: "3–10s", description: "Stats, credentials, authority", size: "md" },
      { icon: "🧠", label: "Educate", time: "10–25s", description: "Teach something genuine - the \"aha\" that builds trust", size: "xl" },
      { icon: "🎯", label: "Product", time: "25–35s", description: "Logical conclusion of the education", size: "md" },
      { icon: "💰", label: "Offer", time: "35–45s", description: "Price, guarantee, scarcity", size: "sm" },
    ],
    bestFor: ["Online Courses", "Premium SaaS", "Coaching"],
    alsoFor: ["Supplements", "Finance"],
    whyItWorks: "Reciprocity - giving value first builds trust. By the time the product appears, the viewer already accepted the premise.",
    experienceNote: "Outcome-based - the benefit is a result you achieve",
    experienceTypes: ["outcome"],
  },
  {
    id: "founder-story",
    category: "universal",
    title: "Founder / Brand Story",
    subtitle: "Personal origin story - why this product exists. Works for app founders and physical product makers alike.",
    timing: "25–45 sec",
    color: "#22d3ee",
    frames: [
      { icon: "🗣️", label: "Hook", time: "0–3s", description: "\"I quit my job to build this\"", size: "md" },
      { icon: "📖", label: "Origin", time: "3–20s", description: "The pain, the gap, the obsession. Early footage/photos.", size: "xl" },
      { icon: "📈", label: "Proof", time: "20–25s", description: "\"Now used by 50K people\"", size: "md" },
      { icon: "🤝", label: "CTA", time: "25–30s", description: "\"Join us\" framing", size: "sm" },
    ],
    bestFor: ["Premium DTC", "Mission-Driven", "Indie Apps"],
    alsoFor: ["Wellness", "Skincare"],
    whyItWorks: "Narrative transportation lowers defenses. Founder's personal stakes create emotional investment.",
    experienceNote: "Any - the story is about the creator, product type is secondary",
    experienceTypes: ["outcome", "luxury-sensory", "in-app", "physical"],
  },
  {
    id: "pas-universal",
    category: "universal",
    title: "Problem → Agitate → Solution",
    subtitle: "The classic PAS structure works for anything. Body footage matches product type: screen recording, real demo, or implied result.",
    timing: "15–30 sec",
    color: "#f43f5e",
    frames: [
      { icon: "😩", label: "Problem", time: "0–3s", description: "Specific, relatable pain point", size: "md" },
      { icon: "😤", label: "Agitate", time: "3–10s", description: "Amplify consequences of inaction", size: "lg" },
      { icon: "✅", label: "Solution", time: "10–20s", description: "Screen recording / Product demo / Implied result", size: "lg" },
      { icon: "👆", label: "CTA", time: "20–25s", description: "Urgency + link", size: "sm" },
    ],
    bestFor: ["Utility Apps", "Problem-Solving Products", "Security/VPN"],
    alsoFor: ["Cleaning", "Productivity"],
    whyItWorks: "Loss aversion is universal. Body footage adapts to product type but emotional structure stays the same. 29% higher CTR than undirected testimonials.",
    experienceNote: "Any - the solution footage matches the product type",
    experienceTypes: ["in-app", "physical", "consumable", "utility"],
  },
];
