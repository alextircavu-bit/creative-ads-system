"use client";

import { useState, useEffect, useRef } from "react";
import { LandingForm } from "@/components/shared/landing-form";
import { CreativeTreeTab } from "@/components/creative-tree/creative-tree-tab";
import { PsycheMapTab } from "@/components/psyche-map/psyche-map-tab";
import { SalesPlaybookTab } from "@/components/sales-playbook/sales-playbook-tab";
import { ResearchTab } from "@/components/research/research-tab";
import { CopyCheckTab } from "@/components/copy-check/copy-check-tab";
import { TopCreativesTab } from "@/components/top-creatives/top-creatives-tab";
import { useProgressiveGeneration } from "@/hooks/use-generation";
import type { SectionStep } from "@/hooks/use-generation";
import { useCreateProject } from "@/hooks/use-projects";
import type { ProjectInput, ScenarioType, GenerationResult } from "@/types/creative";

const TABS = [
  { id: "tree", label: "Creative Tree", icon: "🎨" },
  { id: "psyche", label: "Psyche Map", icon: "🧠" },
  { id: "sales", label: "Sales Playbook", icon: "📖" },
  { id: "research", label: "Research", icon: "🔍" },
  { id: "copycheck", label: "Copy Check", icon: "✍️" },
];

interface ScenarioPageProps {
  scenario: ScenarioType;
}

export function ScenarioPage({ scenario }: ScenarioPageProps) {
  const [input, setInput] = useState<ProjectInput | null>(null);
  const [activeTab, setActiveTab] = useState("tree");
  const [apiKey, setApiKey] = useState("");
  const [showApiInput, setShowApiInput] = useState(false);
  const { generate, progress, currentSection, result, error, isGenerating, steps, totalElapsed } = useProgressiveGeneration();
  const { createProject } = useCreateProject();

  const handleSubmit = async (formInput: ProjectInput) => {
    setInput(formInput);
    setActiveTab("tree");

    let projectId: string | undefined;
    try {
      const project = await createProject(formInput);
      projectId = project?.id;
    } catch {
      // Supabase may not be configured yet
    }

    generate(formInput, projectId);
  };

  const handleRefresh = () => {
    if (!input || isGenerating) return;
    setActiveTab("tree");
    generate(input);
  };

  const goHome = () => {
    setInput(null);
    setActiveTab("tree");
  };

  // Landing
  if (!input) {
    return <LandingForm scenario={scenario} onSubmit={handleSubmit} isLoading={isGenerating} />;
  }

  const r = result as Partial<GenerationResult>;

  // Extract tag words from benefit
  const tagWords = ["scroll", "community", "comment", "quiz", "heal", "lock screen", "daily", "AI", "reels", "stories", "habit", "replace", "meditation", "fitness", "wellness", "learn", "streak", "challenge", "social", "track", "goal"];
  const tags = tagWords.filter((w) => input.productDescription.toLowerCase().includes(w.toLowerCase()));

  // Check if contrast bar should show
  const showContrast = /instead|replace|scroll|doom|swap/i.test(input.productDescription);

  return (
    <div>
      {/* ===== TOPBAR ===== */}
      <div className="sticky top-0 z-50 bg-card/80 backdrop-blur-xl border-b border-border/50">
        <div className="h-[56px] flex items-center gap-0 px-4">
          <button
            className="flex-shrink-0 w-9 h-9 flex items-center justify-center rounded-xl text-muted-foreground hover:text-foreground hover:bg-secondary/80 transition-all"
            onClick={goHome}
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
          <div className="w-px h-7 bg-border/50 mx-3 flex-shrink-0" />
          <div className="flex items-center gap-2.5 flex-shrink-0 max-w-[220px]">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-white text-[10px] font-black shadow-sm shadow-violet-500/20">C</div>
            <div className="text-sm font-bold text-foreground truncate">{input.productName}</div>
          </div>
          <button
            onClick={handleRefresh}
            disabled={isGenerating}
            title="Regenerate all sections"
            className="flex-shrink-0 ml-2.5 w-8 h-8 flex items-center justify-center rounded-lg text-muted-foreground hover:text-violet-400 hover:bg-violet-500/10 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <svg
              className={`w-3.5 h-3.5 ${isGenerating ? "animate-spin" : ""}`}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2.5}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 12a9 9 0 1 1-6.22-8.56" />
              <polyline points="21 3 21 9 15 9" />
            </svg>
          </button>
          <div className="w-px h-7 bg-border/50 mx-3 flex-shrink-0" />
          <div className="flex items-center gap-0.5 overflow-x-auto hide-scrollbar flex-1 min-w-0">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                className={`flex-shrink-0 flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${
                  activeTab === tab.id
                    ? "bg-violet-500/10 text-violet-400"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                }`}
                onClick={() => setActiveTab(tab.id)}
              >
                <span className="text-[11px]">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2 ml-auto flex-shrink-0">
            <button
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                apiKey
                  ? "bg-green-500/10 text-green-400 border border-green-500/20"
                  : "bg-secondary/50 text-muted-foreground hover:text-foreground border border-border/50"
              }`}
              onClick={() => setShowApiInput(!showApiInput)}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  apiKey ? "bg-green-400 shadow-sm shadow-green-400/50" : "bg-muted-foreground"
                }`}
              />
              <span>{apiKey ? "Connected" : "API Key"}</span>
            </button>
            {showApiInput && (
              <input
                type="password"
                className="h-8 px-3 text-xs bg-background/50 border border-border/50 rounded-lg text-foreground placeholder:text-dim outline-none focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20 transition-all w-[200px]"
                placeholder="sk-..."
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") setShowApiInput(false);
                }}
              />
            )}
          </div>
        </div>
      </div>

      {/* ===== PROGRESS BAR (during generation) ===== */}
      {isGenerating && (
        <GenerationProgress
          steps={steps}
          progress={progress}
          totalElapsed={totalElapsed}
          error={error}
        />
      )}

      {/* ===== ERROR BANNER ===== */}
      {error && !isGenerating && (
        <div className="mx-4 mt-3 px-4 py-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-medium flex items-center gap-2.5 backdrop-blur-sm">
          <div className="w-5 h-5 rounded-full bg-rose-500/20 flex items-center justify-center shrink-0">
            <span className="text-[10px]">!</span>
          </div>
          <span>{error}</span>
          <button
            onClick={handleRefresh}
            className="ml-auto px-3 py-1 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 hover:text-rose-100 text-[11px] font-semibold transition-all"
          >
            Retry
          </button>
        </div>
      )}

      {/* ===== MAIN CONTENT ===== */}
      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* TAB 1: Creative Tree */}
        <div className={activeTab === "tree" ? "block" : "hidden"}>
          {/* Hero */}
          <div className="mb-8 text-center">
            <div className="text-2xl font-bold text-foreground mb-2">{input.productName}</div>
            <div className="text-base text-muted-foreground max-w-xl mx-auto leading-relaxed">
              {input.productDescription}
            </div>
            {tags.length > 0 && (
              <div className="flex flex-wrap justify-center gap-2 mt-4">
                {tags.map((t) => (
                  <span
                    key={t}
                    className="px-2.5 py-1 text-[10px] uppercase tracking-widest font-semibold text-primary bg-primary/10 rounded-full border border-primary/20"
                  >
                    {t.toUpperCase()}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Contrast Bar */}
          {showContrast && (
            <div className="flex items-stretch rounded-xl border border-border overflow-hidden mb-8">
              <div className="flex-1 p-5 bg-card">
                <div className="text-xs uppercase tracking-wider font-semibold text-rose-500 mb-2">
                  Without {input.productName}
                </div>
                <div className="text-sm text-muted-foreground leading-relaxed">
                  Doomscrolling. Empty content. Hours lost. Guilt. No progress.
                </div>
              </div>
              <div className="flex items-center justify-center px-4 text-xs font-bold text-dim bg-secondary">
                VS
              </div>
              <div className="flex-1 p-5 bg-card">
                <div className="text-xs uppercase tracking-wider font-semibold text-green-500 mb-2">
                  With {input.productName}
                </div>
                <div className="text-sm text-muted-foreground leading-relaxed">
                  {input.productDescription}
                </div>
              </div>
            </div>
          )}

          {/* Top 5 Creatives — first, the deliverable */}
          {r.topCreatives && (
            <TopCreativesTab data={r.topCreatives} productName={input.productName} />
          )}

          {/* Creative Tree — emotional angles + frameworks */}
          {r.creativeTree ? (
            <CreativeTreeTab data={r.creativeTree} productName={input.productName} />
          ) : (
            !isGenerating && <LoadingSection label="Creative Tree" />
          )}
        </div>

        {/* TAB 2: Psyche Map */}
        <div className={activeTab === "psyche" ? "block" : "hidden"}>
          {r.psycheMap ? (
            <PsycheMapTab data={r.psycheMap} productName={input.productName} />
          ) : (
            !isGenerating && <LoadingSection label="Psyche Map" />
          )}
        </div>

        {/* TAB 3: Sales Playbook */}
        <div className={activeTab === "sales" ? "block" : "hidden"}>
          {r.salesPlaybook ? (
            <SalesPlaybookTab data={r.salesPlaybook} productName={input.productName} />
          ) : (
            !isGenerating && <LoadingSection label="Sales Playbook" />
          )}
        </div>

        {/* TAB 4: Research */}
        <div className={activeTab === "research" ? "block" : "hidden"}>
          {r.research ? (
            <ResearchTab data={r.research} productName={input.productName} />
          ) : (
            !isGenerating && <LoadingSection label="Research" />
          )}
        </div>

        {/* TAB 5: Copy Check */}
        <div className={activeTab === "copycheck" ? "block" : "hidden"}>
          <CopyCheckTab input={input} />
        </div>
      </div>
    </div>
  );
}

// ===== Progress Panel =====

function GenerationProgress({
  steps,
  progress,
  totalElapsed,
  error,
}: {
  steps: SectionStep[];
  progress: number;
  totalElapsed: number;
  error: string | null;
}) {
  const [liveElapsed, setLiveElapsed] = useState(0);
  const startRef = useRef(Date.now());

  // Live timer that ticks every second
  useEffect(() => {
    startRef.current = Date.now();
    setLiveElapsed(0);
    const interval = setInterval(() => {
      setLiveElapsed(Date.now() - startRef.current);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const doneSections = steps.filter((s) => s.status === "done");
  const avgTime = doneSections.length > 0
    ? doneSections.reduce((sum, s) => sum + (s.elapsed || 0), 0) / doneSections.length
    : 0;
  const remaining = steps.filter((s) => s.status === "pending" || s.status === "generating");
  const generatingStep = steps.find((s) => s.status === "generating");
  const etaMs = avgTime > 0 ? avgTime * remaining.length : 0;

  return (
    <div className="border-b border-border/50 bg-card/30 backdrop-blur-sm">
      {/* Main progress bar */}
      <div className="h-1 bg-border/30">
        <div
          className="h-full bg-gradient-to-r from-violet-500 to-fuchsia-500 transition-all duration-700 ease-out shadow-sm shadow-violet-500/30"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="max-w-4xl mx-auto px-4 py-4">
        {/* Header row */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-2 h-2 rounded-full bg-violet-500 animate-pulse shadow-sm shadow-violet-500/50" />
            <span className="text-xs font-bold text-foreground">
              Generating with Claude
            </span>
            <span className="text-[11px] text-muted-foreground/70 bg-violet-500/10 px-2 py-0.5 rounded-full">
              {Math.round(progress)}%
            </span>
          </div>
          <div className="flex items-center gap-3 text-[11px] text-muted-foreground/60">
            <span>Elapsed: {formatDuration(liveElapsed)}</span>
            {etaMs > 0 && (
              <span>ETA: ~{formatDuration(etaMs)}</span>
            )}
          </div>
        </div>

        {/* Steps */}
        <div className="flex flex-col gap-1">
          {steps.map((step, i) => (
            <StepRow key={step.key} step={step} index={i} />
          ))}
        </div>

        {/* Currently doing */}
        {generatingStep && (
          <div className="mt-3 flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl bg-violet-500/5 border border-violet-500/10">
            <LoadingDots />
            <span className="text-[11px] text-muted-foreground">
              {generatingStep.description}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

function StepRow({ step, index }: { step: SectionStep; index: number }) {
  return (
    <div className={`flex items-center gap-2.5 py-1.5 px-2 rounded-lg transition-all ${
      step.status === "generating" ? "bg-violet-500/5" : ""
    }`}>
      {/* Status icon */}
      <div className="w-5 h-5 flex items-center justify-center shrink-0">
        {step.status === "done" && (
          <div className="w-4 h-4 rounded-full bg-green-500/15 flex items-center justify-center">
            <svg className="w-2.5 h-2.5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
        )}
        {step.status === "generating" && (
          <div className="w-4 h-4 rounded-full border-2 border-violet-500 border-t-transparent animate-spin" />
        )}
        {step.status === "pending" && (
          <div className="w-2 h-2 rounded-full bg-border/60" />
        )}
        {step.status === "error" && (
          <div className="w-4 h-4 rounded-full bg-rose-500/15 flex items-center justify-center">
            <svg className="w-2.5 h-2.5 text-rose-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </div>
        )}
      </div>

      {/* Step number */}
      <span className={`text-[10px] font-bold w-4 text-center ${
        step.status === "done" ? "text-green-400"
        : step.status === "generating" ? "text-violet-400"
        : step.status === "error" ? "text-rose-400"
        : "text-muted-foreground/40"
      }`}>
        {index + 1}
      </span>

      {/* Label */}
      <span className={`text-xs font-semibold flex-1 ${
        step.status === "done" ? "text-foreground"
        : step.status === "generating" ? "text-foreground"
        : step.status === "error" ? "text-rose-400"
        : "text-muted-foreground/40"
      }`}>
        {step.label}
      </span>

      {/* Timing */}
      <span className="text-[10px] text-muted-foreground/50 tabular-nums w-12 text-right">
        {step.status === "done" && step.elapsed != null
          ? formatDuration(step.elapsed)
          : step.status === "generating"
            ? <ElapsedTimer />
            : "—"
        }
      </span>
    </div>
  );
}

function ElapsedTimer() {
  const [elapsed, setElapsed] = useState(0);
  const startRef = useRef(Date.now());

  useEffect(() => {
    startRef.current = Date.now();
    const interval = setInterval(() => {
      setElapsed(Date.now() - startRef.current);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return <span className="text-primary">{formatDuration(elapsed)}</span>;
}

function LoadingDots() {
  return (
    <div className="flex gap-0.5">
      <div className="w-1 h-1 rounded-full bg-primary animate-bounce" style={{ animationDelay: "0ms" }} />
      <div className="w-1 h-1 rounded-full bg-primary animate-bounce" style={{ animationDelay: "150ms" }} />
      <div className="w-1 h-1 rounded-full bg-primary animate-bounce" style={{ animationDelay: "300ms" }} />
    </div>
  );
}

function formatDuration(ms: number): string {
  const totalSec = Math.floor(ms / 1000);
  const min = Math.floor(totalSec / 60);
  const sec = totalSec % 60;
  if (min > 0) return `${min}m ${sec}s`;
  return `${sec}s`;
}

function LoadingSection({ label }: { label: string }) {
  return (
    <div className="flex items-center justify-center py-24">
      <div className="text-center">
        <div className="w-10 h-10 rounded-2xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center mx-auto mb-4">
          <div className="w-3 h-3 rounded-full border-2 border-violet-500 border-t-transparent animate-spin" />
        </div>
        <div className="text-sm font-semibold text-foreground mb-1">Waiting for {label}</div>
        <div className="text-xs text-muted-foreground/50">This section will appear once generated</div>
      </div>
    </div>
  );
}
