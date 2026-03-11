"use client";

import { useState } from "react";
import type { ProjectInput, ScenarioType } from "@/types/creative";
import { useProjectsByScenario } from "@/hooks/use-projects";

const V4_PRESETS: Record<string, { name: string; benefit: string }> = {
  nike: {
    name: "Nike Air Max",
    benefit: "Iconic cushioned sneakers that combine street style with all-day comfort. Air Max visible air unit absorbs impact so your feet feel fresh whether you're running errands or hitting the gym.",
  },
  notion: {
    name: "Notion",
    benefit: "All-in-one workspace that replaces your docs, spreadsheets, and project management tools. Organize everything in one place — notes, tasks, wikis, databases — so your team stays aligned and moves faster.",
  },
  duolingo: {
    name: "Duolingo",
    benefit: "Learn a new language in just 5 minutes a day with bite-sized lessons that feel like a game. Streak system and cute reminders keep you coming back — 40+ languages, completely free.",
  },
  hellofresh: {
    name: "HelloFresh",
    benefit: "Pre-portioned meal kits delivered to your door with easy step-by-step recipes. Skip the grocery store, reduce food waste, and cook restaurant-quality meals at home in 30 minutes or less.",
  },
};

const V3_PRESETS: Record<string, { appName: string; featureName: string; benefit: string }> = {
  bcReels: {
    appName: "BibleChat",
    featureName: "Reels",
    benefit: "Replace doomscrolling with Bible verse reels. Same scroll, same swipe — but every piece of content feeds your soul instead of draining it. Community comments, reactions, and shared faith.",
  },
  bcLock: {
    appName: "BibleChat",
    featureName: "Lock Screen Verses",
    benefit: "A new Bible verse on your lock screen every time you pick up your phone. No app to open, no habit to build — it's just there. Passive spiritual nourishment 50-96 times a day.",
  },
  bcChat: {
    appName: "BibleChat",
    featureName: "AI Chat",
    benefit: "Ask any question and get answers grounded in Scripture. Like having a pastor in your pocket — available 24/7, no judgment, always biblical.",
  },
  bcQuiz: {
    appName: "BibleChat",
    featureName: "Sin Quiz",
    benefit: "Discover which deadly sin is secretly running your life. A 60-second quiz that reveals hidden behavioral patterns with Scripture-based insights and a personalized growth plan.",
  },
};

interface LandingFormProps {
  scenario: ScenarioType;
  onSubmit: (input: ProjectInput) => void;
  isLoading?: boolean;
}

function toSlug(str: string): string {
  return str.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export function LandingForm({ scenario, onSubmit, isLoading }: LandingFormProps) {
  const [productName, setProductName] = useState("");
  const [featureName, setFeatureName] = useState("");
  const [productBenefit, setProductBenefit] = useState("");
  const { projects } = useProjectsByScenario(scenario);
  const isV3 = scenario === "v3";

  const handleSubmit = () => {
    if (!productName.trim()) return;
    if (isV3 && !featureName.trim()) return;
    const base = {
      scenario,
      productName: productName.trim(),
      productDescription: productBenefit.trim(),
    };
    if (isV3) {
      onSubmit({
        ...base,
        featureName: featureName.trim(),
        appId: toSlug(productName),
        featureId: toSlug(featureName),
      });
    } else {
      onSubmit(base);
    }
  };

  const loadPreset = (key: string) => {
    if (isV3) {
      const p = V3_PRESETS[key];
      if (!p) return;
      setProductName(p.appName);
      setFeatureName(p.featureName);
      setProductBenefit(p.benefit);
    } else {
      const p = V4_PRESETS[key];
      if (!p) return;
      setProductName(p.name);
      setProductBenefit(p.benefit);
    }
  };

  const loadFromHistory = (project: { product_name: string; product_description: string }) => {
    setProductName(project.product_name);
    setProductBenefit(project.product_description);
  };

  // Deduplicate history — only show unique name+description combos
  const seen = new Set<string>();
  const uniqueProjects = projects.filter((p) => {
    const key = `${p.product_name}::${p.product_description}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  return (
    <div className="flex flex-col items-center justify-center min-h-[85vh] px-6 py-16">
      {/* Logo / Title */}
      <div className="mb-2 w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-white text-xl font-black shadow-lg shadow-violet-500/20">
        C
      </div>
      <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-foreground mb-1.5">
        Creative System
      </h1>
      <p className="text-muted-foreground text-center max-w-lg mb-10 text-sm leading-relaxed">
        {scenario === "v3"
          ? "Enter any mobile app feature. Get a full creative workbench — ad blueprints, emotional angles, psychology analysis, and sales mechanics."
          : "Enter any product. Get ready-to-run ad creatives backed by psychology, sales frameworks, and audience research."}
      </p>

      {/* Form Card */}
      <div className="w-full max-w-xl bg-card/50 backdrop-blur-sm border border-border rounded-2xl p-6 shadow-xl shadow-black/20">
        {/* App Name / Product Name */}
        <div className="mb-4">
          <label className="block text-xs font-semibold text-foreground mb-1.5 tracking-wide">
            {isV3 ? "App Name" : "Product Name"}
          </label>
          <input
            type="text"
            className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-500/50 transition-all"
            placeholder={
              isV3
                ? "Your app's name (e.g. BibleChat, Duolingo, Notion)"
                : "Product name (e.g. Nike Air Max, Shopify, HelloFresh)"
            }
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          />
          {isV3 && productName.trim() && (
            <p className="mt-1 text-[10px] text-muted-foreground/60">
              app_id: <span className="font-mono text-violet-400">{toSlug(productName)}</span>
            </p>
          )}
        </div>

        {/* Feature Name — V3 only */}
        {isV3 && (
          <div className="mb-4">
            <label className="block text-xs font-semibold text-foreground mb-1.5 tracking-wide">
              Feature Name
            </label>
            <input
              type="text"
              className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-500/50 transition-all"
              placeholder="The specific feature you're advertising (e.g. Reels, Lock Screen Verses, AI Chat)"
              value={featureName}
              onChange={(e) => setFeatureName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            />
            {featureName.trim() && (
              <p className="mt-1 text-[10px] text-muted-foreground/60">
                feature_id: <span className="font-mono text-violet-400">{toSlug(featureName)}</span>
              </p>
            )}
          </div>
        )}

        {/* Core Benefit */}
        <div className="mb-5">
          <label className="block text-xs font-semibold text-foreground mb-1.5 tracking-wide">
            Core Benefit
          </label>
          <textarea
            className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-500/50 transition-all resize-y min-h-[100px]"
            placeholder={
              isV3
                ? "What does this feature do for the user? What's the real benefit — not the feature itself, but how it changes their life, routine, or emotions?"
                : "What does this product do for the user? Why would someone buy it?"
            }
            value={productBenefit}
            onChange={(e) => setProductBenefit(e.target.value)}
          />
          <p className="mt-2 text-[11px] text-muted-foreground leading-relaxed">
            This is the most important field. Describe the real benefit — not what it does, but why someone would care. The AI uses this to extract related sub-benefits, emotional tangents, and ad scenarios you might overlook. The more specific you are, the better every ad, hook, and script will be.
          </p>
        </div>

        <button
          className="w-full rounded-xl bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:from-violet-600 hover:to-fuchsia-600 text-white font-bold py-3.5 px-6 text-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-violet-500/20 hover:shadow-violet-500/30"
          onClick={handleSubmit}
          disabled={isLoading || !productName.trim() || (isV3 && !featureName.trim())}
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Generating...
            </span>
          ) : (
            "Generate Ads"
          )}
        </button>
      </div>

      {/* Presets */}
      <div className="flex flex-wrap items-center justify-center gap-2 mt-8">
        <span className="text-[11px] text-muted-foreground font-medium mr-1">Try:</span>
        {Object.entries(isV3 ? V3_PRESETS : V4_PRESETS).map(([key, preset]) => (
          <button
            key={key}
            className="rounded-lg border border-border bg-card/50 px-3.5 py-1.5 text-xs text-muted-foreground hover:text-foreground hover:border-violet-500/30 hover:bg-violet-500/5 transition-all"
            onClick={() => loadPreset(key)}
          >
            {"appName" in preset ? `${preset.appName} — ${preset.featureName}` : preset.name}
          </button>
        ))}
      </div>

      {/* History — deduplicated */}
      {uniqueProjects.length > 0 && (
        <div className="mt-8 w-full max-w-xl">
          <div className="flex items-center gap-2 mb-3">
            <div className="h-px flex-1 bg-border" />
            <span className="text-[10px] text-muted-foreground font-semibold uppercase tracking-widest">Recent</span>
            <div className="h-px flex-1 bg-border" />
          </div>
          <div className="flex flex-wrap gap-2 justify-center">
            {uniqueProjects.slice(0, 8).map((p) => (
              <button
                key={p.id}
                className="rounded-lg border border-border bg-card/30 px-3.5 py-2 text-xs text-muted-foreground hover:text-foreground hover:border-violet-500/30 transition-all group"
                onClick={() => loadFromHistory(p)}
              >
                <span className="font-semibold">{p.product_name}</span>
                {p.product_description && (
                  <span className="block text-[10px] text-muted-foreground/60 group-hover:text-muted-foreground mt-0.5 max-w-[200px] truncate">
                    {p.product_description}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
