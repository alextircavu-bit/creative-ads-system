"use client";

import { useState } from "react";
import type { ProjectInput, ScenarioType, GenerationResult } from "@/types/creative";
import { useProjectsByScenario } from "@/hooks/use-projects";

const V4_PRESETS: Record<string, { name: string; benefit: string }> = {
  nike: {
    name: "Nike Air Max",
    benefit: "Iconic cushioned sneakers that combine street style with all-day comfort. Air Max visible air unit absorbs impact so your feet feel fresh whether you're running errands or hitting the gym.",
  },
  notion: {
    name: "Notion",
    benefit: "All-in-one workspace that replaces your docs, spreadsheets, and project management tools. Organize everything in one place - notes, tasks, wikis, databases - so your team stays aligned and moves faster.",
  },
  duolingo: {
    name: "Duolingo",
    benefit: "Learn a new language in just 5 minutes a day with bite-sized lessons that feel like a game. Streak system and cute reminders keep you coming back - 40+ languages, completely free.",
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
    benefit: "Replace doomscrolling with Bible verse reels. Same scroll, same swipe - but every piece of content feeds your soul instead of draining it. Community comments, reactions, and shared faith.",
  },
  bcLock: {
    appName: "BibleChat",
    featureName: "Hourly Lockscreen Widget Verse",
    benefit: "You get God's Word, Scripture, Bible verses on your lockscreen, every hour.",
  },
  bcChat: {
    appName: "BibleChat",
    featureName: "AI Chat",
    benefit: "Ask any question and get answers grounded in Scripture. Like having a pastor in your pocket - available 24/7, no judgment, always biblical.",
  },
  bcQuiz: {
    appName: "BibleChat",
    featureName: "Sin Quiz",
    benefit: "Discover which deadly sin is secretly running your life. A 60-second quiz that reveals hidden behavioral patterns with Scripture-based insights and a personalized growth plan.",
  },
  calSnap: {
    appName: "CalSnap",
    featureName: "AI Food Scanner",
    benefit: "Point your phone at any food and instantly see the full macro breakdown. No manual logging, no searching databases. Just snap and know what you're eating.",
  },
};

interface LandingFormProps {
  scenario: ScenarioType;
  onSubmit: (input: ProjectInput) => void;
  onLoadProject?: (project: { input: ProjectInput; result: GenerationResult; id: string }) => void;
  isLoading?: boolean;
}

function toSlug(str: string): string {
  return str.trim().toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_|_$/g, "");
}

export function LandingForm({ scenario, onSubmit, onLoadProject, isLoading }: LandingFormProps) {
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

  // Deduplicate history - only show unique name+description combos
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
      <div className="mb-3 w-10 h-10 rounded-lg bg-primary flex items-center justify-center text-primary-foreground text-base font-bold">
        C
      </div>
      <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground mb-1">
        Creative System
      </h1>
      <p className="text-muted-foreground text-center max-w-md mb-10 text-sm leading-relaxed">
        {scenario === "v3"
          ? "Enter a mobile app feature to generate ad blueprints, psychology analysis, and sales mechanics."
          : "Enter any product to get ready-to-run ad creatives backed by psychology and research."}
      </p>

      {/* Form Card */}
      <div className="w-full max-w-xl border border-border rounded-lg p-6">
        {/* App Name / Product Name */}
        <div className="mb-4">
          <label className="block text-xs font-medium text-foreground mb-1.5">
            {isV3 ? "App Name" : "Product Name"}
          </label>
          <input
            type="text"
            className="w-full rounded-md border border-border bg-background px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-colors"
            placeholder={
              isV3
                ? "e.g. BibleChat, Duolingo, Notion"
                : "e.g. Nike Air Max, Shopify, HelloFresh"
            }
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          />
          {isV3 && productName.trim() && (
            <p className="mt-1 text-[10px] text-muted-foreground/60">
              app_id: <span className="font-mono text-primary">{toSlug(productName)}</span>
            </p>
          )}
        </div>

        {/* Feature Name - V3 only */}
        {isV3 && (
          <div className="mb-4">
            <label className="block text-xs font-medium text-foreground mb-1.5">
              Feature Name
            </label>
            <input
              type="text"
              className="w-full rounded-md border border-border bg-background px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-colors"
              placeholder="e.g. Reels, Lock Screen Verses, AI Chat"
              value={featureName}
              onChange={(e) => setFeatureName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            />
            {featureName.trim() && (
              <p className="mt-1 text-[10px] text-muted-foreground/60">
                feature_id: <span className="font-mono text-primary">{toSlug(featureName)}</span>
              </p>
            )}
          </div>
        )}

        {/* Core Benefit */}
        <div className="mb-5">
          <label className="block text-xs font-medium text-foreground mb-1.5">
            Core Benefit
          </label>
          <textarea
            className="w-full rounded-md border border-border bg-background px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-colors resize-y min-h-[100px]"
            placeholder={
              isV3
                ? "What does this feature do for the user? How does it change their life?"
                : "What does this product do? Why would someone buy it?"
            }
            value={productBenefit}
            onChange={(e) => setProductBenefit(e.target.value)}
          />
          <p className="mt-1.5 text-[11px] text-muted-foreground/60 leading-relaxed">
            The more specific you are, the better every ad and hook will be.
          </p>
        </div>

        <button
          className="w-full rounded-md bg-primary text-primary-foreground font-medium py-2.5 px-6 text-sm transition-colors hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed"
          onClick={handleSubmit}
          disabled={isLoading || !productName.trim() || (isV3 && !featureName.trim())}
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <span className="w-3.5 h-3.5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
              Generating...
            </span>
          ) : (
            "Generate Ads"
          )}
        </button>
      </div>

      {/* Presets */}
      <div className="flex flex-wrap items-center justify-center gap-1.5 mt-6">
        <span className="text-[11px] text-muted-foreground/50 mr-1">Try:</span>
        {Object.entries(isV3 ? V3_PRESETS : V4_PRESETS).map(([key, preset]) => (
          <button
            key={key}
            className="rounded-md border border-border/50 px-3 py-1 text-xs text-muted-foreground hover:text-foreground hover:border-border transition-colors"
            onClick={() => loadPreset(key)}
          >
            {"appName" in preset ? `${preset.appName} — ${preset.featureName}` : preset.name}
          </button>
        ))}
      </div>

      {/* History - deduplicated */}
      {uniqueProjects.length > 0 && (
        <div className="mt-8 w-full max-w-xl">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-px flex-1 bg-border/50" />
            <span className="text-[10px] text-muted-foreground/40 font-medium uppercase tracking-wider">Previous</span>
            <div className="h-px flex-1 bg-border/50" />
          </div>
          <div className="flex flex-col gap-1">
            {uniqueProjects.slice(0, 10).map((p) => {
              const isCompleted = p.status === "completed" && p.generation_result;
              return (
                <div
                  key={p.id}
                  className="w-full rounded-md border border-border/40 px-3.5 py-2.5 hover:border-border transition-colors flex items-center gap-3"
                >
                  <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                    isCompleted ? "bg-green-400" : p.status === "failed" ? "bg-destructive" : "bg-muted-foreground/30"
                  }`} />
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-medium text-foreground truncate">
                      {p.product_name}
                      {p.feature_name && <span className="text-muted-foreground font-normal"> — {p.feature_name}</span>}
                    </div>
                    {p.product_description && (
                      <div className="text-[10px] text-muted-foreground/40 truncate mt-0.5">{p.product_description.slice(0, 80)}</div>
                    )}
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      className="text-[10px] text-muted-foreground/40 hover:text-foreground transition-colors"
                      onClick={() => {
                        loadFromHistory(p);
                        if (isV3 && p.feature_name) setFeatureName(p.feature_name);
                      }}
                    >
                      Fill
                    </button>
                    {isCompleted && onLoadProject && (
                      <>
                        <span className="text-muted-foreground/20">|</span>
                        <button
                          type="button"
                          className="text-[10px] text-muted-foreground/40 hover:text-foreground transition-colors"
                          onClick={() => onLoadProject({ input: p.input_data, result: p.generation_result!, id: p.id })}
                        >
                          Load
                        </button>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
