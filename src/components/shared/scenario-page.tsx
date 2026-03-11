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

// Sidebar navigation items
const NAV_MAIN = [
  { id: "dashboard", label: "Dashboard", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0a1 1 0 01-1-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 01-1 1" },
  { id: "templates", label: "Templates", icon: "M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" },
];

const NAV_DEEP_DIVE = [
  { id: "research", label: "TAG Shadow", icon: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" },
  { id: "psyche", label: "Psychology", icon: "M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" },
  { id: "sales", label: "Sales Playbook", icon: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" },
  { id: "creative", label: "Creative Tree", icon: "M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" },
];

const NAV_TOOLS = [
  { id: "copycheck", label: "Copy Check", icon: "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" },
];

type Theme = "light" | "medium" | "dark";

interface ScenarioPageProps {
  scenario: ScenarioType;
}

export function ScenarioPage({ scenario }: ScenarioPageProps) {
  const [input, setInput] = useState<ProjectInput | null>(null);
  const [activeView, setActiveView] = useState("dashboard");
  const [theme, setTheme] = useState<Theme>("dark");
  const [apiKey, setApiKey] = useState("");
  const [showApiInput, setShowApiInput] = useState(false);
  const { generate, progress, currentSection, result, error, isGenerating, steps, totalElapsed } = useProgressiveGeneration();
  const { createProject } = useCreateProject();

  // Apply theme to html element
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const handleSubmit = async (formInput: ProjectInput) => {
    setInput(formInput);
    setActiveView("dashboard");

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
    generate(input);
  };

  const goHome = () => {
    setInput(null);
    setActiveView("dashboard");
  };

  // Landing
  if (!input) {
    return <LandingForm scenario={scenario} onSubmit={handleSubmit} isLoading={isGenerating} />;
  }

  const r = result as Partial<GenerationResult>;

  return (
    <div className="flex h-screen overflow-hidden">
      {/* ===== SIDEBAR ===== */}
      <aside className="w-[220px] flex-shrink-0 flex flex-col border-r border-border/50" style={{ background: "hsl(var(--sidebar))" }}>
        {/* Logo + back */}
        <div className="h-[56px] flex items-center gap-2.5 px-4 border-b border-border/30">
          <button
            className="w-8 h-8 flex items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary/80 transition-all"
            onClick={goHome}
            title="Back to home"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-white text-[10px] font-black shadow-sm shadow-violet-500/20">C</div>
          <span className="text-sm font-bold text-foreground truncate">{input.productName}</span>
        </div>

        {/* Nav sections */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-6">
          {/* Main */}
          <div>
            {NAV_MAIN.map((item) => (
              <SidebarItem
                key={item.id}
                item={item}
                active={activeView === item.id}
                onClick={() => setActiveView(item.id)}
              />
            ))}
          </div>

          {/* Deep Dive */}
          <div>
            <div className="text-[10px] font-bold uppercase tracking-[1.5px] text-muted-foreground/40 px-3 mb-2">Deep Dive</div>
            {NAV_DEEP_DIVE.map((item) => (
              <SidebarItem
                key={item.id}
                item={item}
                active={activeView === item.id}
                onClick={() => setActiveView(item.id)}
              />
            ))}
          </div>

          {/* Tools */}
          <div>
            <div className="text-[10px] font-bold uppercase tracking-[1.5px] text-muted-foreground/40 px-3 mb-2">Tools</div>
            {NAV_TOOLS.map((item) => (
              <SidebarItem
                key={item.id}
                item={item}
                active={activeView === item.id}
                onClick={() => setActiveView(item.id)}
              />
            ))}
          </div>
        </nav>

        {/* Bottom: theme toggle */}
        <div className="p-3 border-t border-border/30">
          <div className="flex items-center gap-1 bg-secondary/50 rounded-lg p-1">
            {(["light", "medium", "dark"] as Theme[]).map((t) => (
              <button
                key={t}
                className={`flex-1 text-[10px] font-semibold py-1.5 rounded-md transition-all capitalize ${
                  theme === t
                    ? "bg-primary/15 text-primary shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                onClick={() => setTheme(t)}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </aside>

      {/* ===== MAIN AREA ===== */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <div className="h-[56px] flex items-center gap-3 px-5 border-b border-border/50 bg-card/50 backdrop-blur-sm flex-shrink-0">
          <div className="flex-1">
            <h1 className="text-base font-bold text-foreground">
              {activeView === "dashboard" && "Your Ad Creatives"}
              {activeView === "templates" && "Template Library"}
              {activeView === "research" && "TAG Shadow Technique"}
              {activeView === "psyche" && "Psychology Analysis"}
              {activeView === "sales" && "Sales Playbook"}
              {activeView === "creative" && "Creative Tree"}
              {activeView === "copycheck" && "Copy Check"}
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5">{input.productName} — {input.productDescription.slice(0, 80)}{input.productDescription.length > 80 ? "..." : ""}</p>
          </div>

          <button
            onClick={handleRefresh}
            disabled={isGenerating}
            title="Regenerate"
            className="w-9 h-9 flex items-center justify-center rounded-lg text-muted-foreground hover:text-violet-400 hover:bg-violet-500/10 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <svg className={`w-4 h-4 ${isGenerating ? "animate-spin" : ""}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 12a9 9 0 1 1-6.22-8.56" />
              <polyline points="21 3 21 9 15 9" />
            </svg>
          </button>

          <div className="w-px h-7 bg-border/30" />

          <button
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              apiKey
                ? "bg-green-500/10 text-green-400 border border-green-500/20"
                : "bg-secondary/50 text-muted-foreground hover:text-foreground border border-border/50"
            }`}
            onClick={() => setShowApiInput(!showApiInput)}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${apiKey ? "bg-green-400 shadow-sm shadow-green-400/50" : "bg-muted-foreground"}`} />
            <span>{apiKey ? "Connected" : "API Key"}</span>
          </button>
          {showApiInput && (
            <input
              type="password"
              className="h-8 px-3 text-xs bg-background/50 border border-border/50 rounded-lg text-foreground placeholder:text-muted-foreground outline-none focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20 transition-all w-[200px]"
              placeholder="sk-..."
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") setShowApiInput(false); }}
            />
          )}
        </div>

        {/* Progress bar */}
        {isGenerating && (
          <GenerationProgress steps={steps} progress={progress} totalElapsed={totalElapsed} error={error} />
        )}

        {/* Error banner */}
        {error && !isGenerating && (
          <div className="mx-5 mt-3 px-4 py-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-medium flex items-center gap-2.5">
            <span>!</span>
            <span>{error}</span>
            <button onClick={handleRefresh} className="ml-auto px-3 py-1 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 text-[11px] font-semibold transition-all">
              Retry
            </button>
          </div>
        )}

        {/* ===== CONTENT ===== */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-5xl mx-auto px-6 py-8">

            {/* DASHBOARD — Ads front and center */}
            {activeView === "dashboard" && (
              <div className="space-y-10">
                {/* Top 5 Creatives */}
                {r.topCreatives ? (
                  <TopCreativesTab data={r.topCreatives} productName={input.productName} />
                ) : (
                  <div className="flex flex-col items-center justify-center py-24 rounded-2xl border border-border/30 bg-card/20">
                    <div className="w-14 h-14 rounded-2xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center mb-5">
                      <div className="w-5 h-5 rounded-full border-2 border-violet-500 border-t-transparent animate-spin" />
                    </div>
                    <div className="text-lg font-semibold text-foreground mb-1">Generating your ads...</div>
                    <div className="text-sm text-muted-foreground/60">Your top creatives will appear here shortly</div>
                  </div>
                )}

                {/* Quick insight cards */}
                {(r.research || r.psycheMap || r.salesPlaybook) && (
                  <div>
                    <h2 className="text-lg font-bold text-foreground mb-4">Quick Insights</h2>
                    <div className="grid grid-cols-3 gap-4">
                      {r.research && r.research.audienceSegments?.length > 0 && (
                        <button onClick={() => setActiveView("research")} className="text-left p-4 rounded-xl border border-border/30 bg-card/30 hover:border-violet-500/30 transition-all group">
                          <div className="text-xs font-bold text-muted-foreground/50 uppercase tracking-wider mb-2">Top Audience</div>
                          <div className="text-sm font-semibold text-foreground mb-1">{r.research.audienceSegments[0].name}</div>
                          <div className="text-xs text-muted-foreground leading-relaxed">{r.research.audienceSegments[0].demographics}</div>
                          <div className="text-[10px] text-violet-400 font-semibold mt-3 group-hover:underline">View TAG Shadow research →</div>
                        </button>
                      )}
                      {r.psycheMap && (
                        <button onClick={() => setActiveView("psyche")} className="text-left p-4 rounded-xl border border-border/30 bg-card/30 hover:border-violet-500/30 transition-all group">
                          <div className="text-xs font-bold text-muted-foreground/50 uppercase tracking-wider mb-2">Psychology</div>
                          <div className="text-sm font-semibold text-foreground mb-1">{r.psycheMap.cognitiveProfile.name}</div>
                          <div className="text-xs text-muted-foreground leading-relaxed">Strongest angle: {[...r.psycheMap.biases].sort((a, b) => b.strength - a.strength)[0]?.name}</div>
                          <div className="text-[10px] text-violet-400 font-semibold mt-3 group-hover:underline">View psychology analysis →</div>
                        </button>
                      )}
                      {r.salesPlaybook && (
                        <button onClick={() => setActiveView("sales")} className="text-left p-4 rounded-xl border border-border/30 bg-card/30 hover:border-violet-500/30 transition-all group">
                          <div className="text-xs font-bold text-muted-foreground/50 uppercase tracking-wider mb-2">Sales Lever</div>
                          <div className="text-sm font-semibold text-foreground mb-1">{[...r.salesPlaybook.cialdiniWeapons].sort((a, b) => b.power - a.power)[0]?.name}</div>
                          <div className="text-xs text-muted-foreground leading-relaxed">{r.salesPlaybook.valueEquation.dreamOutcome.text.slice(0, 60)}...</div>
                          <div className="text-[10px] text-violet-400 font-semibold mt-3 group-hover:underline">View sales playbook →</div>
                        </button>
                      )}
                    </div>
                  </div>
                )}

                {/* Canvas coming soon */}
                <div className="flex items-center justify-center py-10 rounded-2xl border border-dashed border-border/30 bg-card/10">
                  <div className="text-center">
                    <div className="text-sm font-semibold text-muted-foreground/50 mb-0.5">Creative Canvas</div>
                    <div className="text-xs text-muted-foreground/30">AI Video Creator — Coming Soon</div>
                  </div>
                </div>
              </div>
            )}

            {/* TEMPLATES — placeholder for now */}
            {activeView === "templates" && (
              <div className="flex flex-col items-center justify-center py-24">
                <div className="text-center">
                  <div className="text-2xl font-bold text-foreground mb-2">Template Library</div>
                  <div className="text-sm text-muted-foreground mb-6">19 battle-tested ad formats — Apps vs Non-App Products</div>
                  <div className="text-xs text-muted-foreground/50">Coming in the next update</div>
                </div>
              </div>
            )}

            {/* RESEARCH / TAG Shadow */}
            {activeView === "research" && (
              <div>
                {r.research ? (
                  <ResearchTab data={r.research} productName={input.productName} />
                ) : (
                  <LoadingSection label="TAG Shadow Research" />
                )}
              </div>
            )}

            {/* PSYCHOLOGY */}
            {activeView === "psyche" && (
              <div>
                {r.psycheMap ? (
                  <PsycheMapTab data={r.psycheMap} productName={input.productName} />
                ) : (
                  <LoadingSection label="Psychology Analysis" />
                )}
              </div>
            )}

            {/* SALES PLAYBOOK */}
            {activeView === "sales" && (
              <div>
                {r.salesPlaybook ? (
                  <SalesPlaybookTab data={r.salesPlaybook} productName={input.productName} />
                ) : (
                  <LoadingSection label="Sales Playbook" />
                )}
              </div>
            )}

            {/* CREATIVE TREE */}
            {activeView === "creative" && (
              <div>
                {r.creativeTree ? (
                  <CreativeTreeTab data={r.creativeTree} productName={input.productName} />
                ) : (
                  <LoadingSection label="Creative Tree" />
                )}
              </div>
            )}

            {/* COPY CHECK */}
            {activeView === "copycheck" && (
              <CopyCheckTab input={input} />
            )}

          </div>
        </div>
      </div>
    </div>
  );
}

// ===== Sidebar Item =====

function SidebarItem({
  item,
  active,
  onClick,
}: {
  item: { id: string; label: string; icon: string };
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all mb-0.5 ${
        active
          ? "bg-violet-500/10 text-violet-400"
          : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
      }`}
      onClick={onClick}
    >
      <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
        <path d={item.icon} />
      </svg>
      <span className="text-[13px] font-medium">{item.label}</span>
    </button>
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
    <div className="border-b border-border/50 bg-card/30 backdrop-blur-sm flex-shrink-0">
      <div className="h-1 bg-border/30">
        <div
          className="h-full bg-gradient-to-r from-violet-500 to-fuchsia-500 transition-all duration-700 ease-out shadow-sm shadow-violet-500/30"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="px-5 py-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-2 h-2 rounded-full bg-violet-500 animate-pulse shadow-sm shadow-violet-500/50" />
            <span className="text-xs font-bold text-foreground">Generating with Claude</span>
            <span className="text-[11px] text-muted-foreground/70 bg-violet-500/10 px-2 py-0.5 rounded-full">
              {Math.round(progress)}%
            </span>
          </div>
          <div className="flex items-center gap-3 text-[11px] text-muted-foreground/60">
            <span>Elapsed: {formatDuration(liveElapsed)}</span>
            {etaMs > 0 && <span>ETA: ~{formatDuration(etaMs)}</span>}
          </div>
        </div>

        <div className="flex flex-col gap-1">
          {steps.map((step, i) => (
            <StepRow key={step.key} step={step} index={i} />
          ))}
        </div>

        {generatingStep && (
          <div className="mt-3 flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl bg-violet-500/5 border border-violet-500/10">
            <LoadingDots />
            <span className="text-[11px] text-muted-foreground">{generatingStep.description}</span>
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

      <span className={`text-[10px] font-bold w-4 text-center ${
        step.status === "done" ? "text-green-400"
        : step.status === "generating" ? "text-violet-400"
        : step.status === "error" ? "text-rose-400"
        : "text-muted-foreground/40"
      }`}>
        {index + 1}
      </span>

      <span className={`text-xs font-semibold flex-1 ${
        step.status === "done" ? "text-foreground"
        : step.status === "generating" ? "text-foreground"
        : step.status === "error" ? "text-rose-400"
        : "text-muted-foreground/40"
      }`}>
        {step.label}
      </span>

      <span className="text-[10px] text-muted-foreground/50 tabular-nums w-12 text-right">
        {step.status === "done" && step.elapsed != null
          ? formatDuration(step.elapsed)
          : step.status === "generating"
            ? <ElapsedTimer />
            : "\u2014"
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
        <div className="w-12 h-12 rounded-2xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center mx-auto mb-4">
          <div className="w-4 h-4 rounded-full border-2 border-violet-500 border-t-transparent animate-spin" />
        </div>
        <div className="text-base font-semibold text-foreground mb-1">Waiting for {label}</div>
        <div className="text-xs text-muted-foreground/50">This section will appear once generated</div>
      </div>
    </div>
  );
}
