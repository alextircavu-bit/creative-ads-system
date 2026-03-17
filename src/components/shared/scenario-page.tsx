"use client";

import { useState, useEffect, useRef } from "react";
import { LandingForm } from "@/components/shared/landing-form";
import { CreativeTreeTab } from "@/components/creative-tree/creative-tree-tab";
import { PsycheMapTab } from "@/components/psyche-map/psyche-map-tab";
import { SalesPlaybookTab } from "@/components/sales-playbook/sales-playbook-tab";
import { ResearchTab } from "@/components/research/research-tab";
import { CopyCheckTab } from "@/components/copy-check/copy-check-tab";
import { TopCreativesTab } from "@/components/top-creatives/top-creatives-tab";
import { TemplatesPage } from "@/components/templates/templates-page";
import { useProgressiveGeneration } from "@/hooks/use-generation";
import type { SectionStep } from "@/hooks/use-generation";
import { useCreateProject, useProjectsByScenario } from "@/hooks/use-projects";
import { generationRepository } from "@/repositories/generation.repository";
import type { ProjectInput, ScenarioType, GenerationResult, AdCreativeBlueprint, ProjectRow } from "@/types/creative";

// Sidebar navigation items
const NAV_MAIN = [
  { id: "dashboard", label: "Dashboard", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0a1 1 0 01-1-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 01-1 1" },
  { id: "templates", label: "Templates", icon: "M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" },
];

const NAV_DEEP_DIVE = [
  { id: "research", label: "Research", icon: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" },
  { id: "psyche", label: "Psychology", icon: "M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" },
  { id: "sales", label: "Sales Strategy", icon: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" },
  { id: "creative", label: "Scripts", icon: "M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" },
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
  const { generate, progress, currentSection, result, error, isGenerating, steps, totalElapsed, setResult: setGenerationResult } = useProgressiveGeneration();
  const { createProject } = useCreateProject();
  const { projects } = useProjectsByScenario(scenario);
  const [isGeneratingMore, setIsGeneratingMore] = useState(false);
  const [allCreatives, setAllCreatives] = useState<AdCreativeBlueprint[]>([]);
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);

  // Apply theme to html element
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  // Sync allCreatives with initial generation result
  useEffect(() => {
    if (result.topCreatives?.creatives?.length) {
      setAllCreatives(result.topCreatives.creatives);
    }
  }, [result.topCreatives]);

  const handleGenerateMore = async () => {
    if (!input || isGeneratingMore || isGenerating) return;
    const r = result as Partial<GenerationResult>;
    if (!r.topCreatives) return;

    setIsGeneratingMore(true);
    try {
      // Build existing creatives summary for the prompt
      const existingCreatives = allCreatives.map((c) => ({
        name: c.name,
        emotion: c.emotion,
        targetSegment: c.targetSegment,
        hookTexts: (c.hooks || []).map((h) => h.text),
      }));

      const newData = await generationRepository.generateTopCreatives(input, {
        psycheMap: r.psycheMap,
        salesPlaybook: r.salesPlaybook,
        research: r.research,
        creativeTree: r.creativeTree,
        existingCreatives,
      });

      if (newData?.creatives?.length) {
        // Re-rank new creatives starting after existing ones
        const reranked = newData.creatives.map((c, i) => ({
          ...c,
          rank: allCreatives.length + i + 1,
        }));
        setAllCreatives((prev) => [...prev, ...reranked]);
      }
    } catch (err) {
      console.error("Generate more failed:", err);
    } finally {
      setIsGeneratingMore(false);
    }
  };

  const handleSubmit = async (formInput: ProjectInput) => {
    setInput(formInput);
    setActiveView("dashboard");
    setAllCreatives([]);

    let projectId: string | undefined;
    try {
      const project = await createProject(formInput);
      projectId = project?.id;
      if (projectId) setActiveProjectId(projectId);
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
    setActiveProjectId(null);
  };

  const loadProject = (project: ProjectRow) => {
    if (!project.generation_result || project.status !== "completed") return;
    const gr = project.generation_result;
    setInput(project.input_data);
    setGenerationResult(gr);
    setActiveProjectId(project.id);
    setActiveView("dashboard");
    if (gr.topCreatives?.creatives?.length) {
      setAllCreatives(gr.topCreatives.creatives);
    }
  };

  // Filter completed projects for the history sidebar
  const completedProjects = projects.filter((p) => p.status === "completed" && p.generation_result);

  const handleLoadProject = (loaded: { input: ProjectInput; result: GenerationResult; id: string }) => {
    setInput(loaded.input);
    setGenerationResult(loaded.result);
    setActiveProjectId(loaded.id);
    setActiveView("dashboard");
    if (loaded.result.topCreatives?.creatives?.length) {
      setAllCreatives(loaded.result.topCreatives.creatives);
    }
  };

  // Landing
  if (!input) {
    return <LandingForm scenario={scenario} onSubmit={handleSubmit} onLoadProject={handleLoadProject} isLoading={isGenerating} />;
  }

  const r = result as Partial<GenerationResult>;

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* ===== SIDEBAR ===== */}
      <aside className="w-[220px] flex-shrink-0 flex flex-col border-r border-border/40 bg-card/50">
        {/* Logo + back */}
        <div className="h-[52px] flex items-center gap-2.5 px-3 border-b border-border/40">
          <button
            className="w-7 h-7 flex items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary/60 transition-colors"
            onClick={goHome}
            title="Back to home"
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
          <div className="w-6 h-6 rounded-md bg-primary flex items-center justify-center text-primary-foreground text-[10px] font-bold">C</div>
          <span className="text-[13px] font-semibold text-foreground truncate">{input.productName}</span>
        </div>

        {/* Nav sections */}
        <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-5">
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
            <div className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground/50 px-2.5 mb-1.5">Deep Dive</div>
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
            <div className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground/50 px-2.5 mb-1.5">Tools</div>
            {NAV_TOOLS.map((item) => (
              <SidebarItem
                key={item.id}
                item={item}
                active={activeView === item.id}
                onClick={() => setActiveView(item.id)}
              />
            ))}
          </div>

          {/* Previous Generations */}
          {completedProjects.length > 0 && (
            <div>
              <div className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground/50 px-2.5 mb-1.5">History</div>
              <div className="space-y-px max-h-[200px] overflow-y-auto">
                {completedProjects.map((p) => (
                  <button
                    key={p.id}
                    className={`w-full text-left px-2.5 py-1.5 rounded-md transition-colors ${
                      activeProjectId === p.id
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:text-foreground hover:bg-secondary/40"
                    }`}
                    onClick={() => loadProject(p)}
                    title={p.product_name}
                  >
                    <div className="text-[12px] font-medium truncate">{p.product_name}</div>
                    <div className="text-[10px] text-muted-foreground/40 truncate">{formatRelativeDate(p.created_at)}</div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </nav>

        {/* Bottom: theme toggle */}
        <div className="p-2.5 border-t border-border/40">
          <div className="flex items-center gap-0.5 bg-secondary/30 rounded-md p-0.5">
            {(["light", "medium", "dark"] as Theme[]).map((t) => (
              <button
                key={t}
                className={`flex-1 text-[10px] font-medium py-1 rounded transition-colors capitalize ${
                  theme === t
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground/60 hover:text-muted-foreground"
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
        <div className="h-[52px] flex items-center gap-3 px-5 border-b border-border/40 bg-background flex-shrink-0">
          <div className="flex-1 min-w-0">
            <h1 className="text-sm font-semibold text-foreground">
              {activeView === "dashboard" && "Ad Creatives"}
              {activeView === "templates" && "Templates"}
              {activeView === "research" && "Research"}
              {activeView === "psyche" && "Psychology"}
              {activeView === "sales" && "Sales Strategy"}
              {activeView === "creative" && "Scripts"}
              {activeView === "copycheck" && "Copy Check"}
            </h1>
            <p className="text-xs text-muted-foreground/60 truncate">{input.productName} — {input.productDescription.slice(0, 80)}{input.productDescription.length > 80 ? "..." : ""}</p>
          </div>

          <button
            onClick={handleRefresh}
            disabled={isGenerating}
            title="Regenerate"
            className="w-8 h-8 flex items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary/60 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <svg className={`w-3.5 h-3.5 ${isGenerating ? "animate-spin" : ""}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 12a9 9 0 1 1-6.22-8.56" />
              <polyline points="21 3 21 9 15 9" />
            </svg>
          </button>

          <div className="w-px h-6 bg-border/30" />

          <button
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
              apiKey
                ? "text-green-400 border border-green-500/20"
                : "text-muted-foreground hover:text-foreground border border-border/40"
            }`}
            onClick={() => setShowApiInput(!showApiInput)}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${apiKey ? "bg-green-400" : "bg-muted-foreground/40"}`} />
            <span>{apiKey ? "Connected" : "API Key"}</span>
          </button>
          {showApiInput && (
            <input
              type="password"
              className="h-7 px-2.5 text-xs bg-background border border-border/50 rounded-md text-foreground placeholder:text-muted-foreground/40 outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-colors w-[200px]"
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
          <div className="mx-5 mt-3 px-4 py-2.5 rounded-md bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-medium flex items-center gap-2">
            <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="15" y1="9" x2="9" y2="15" />
              <line x1="9" y1="9" x2="15" y2="15" />
            </svg>
            <span className="flex-1">{error}</span>
            <button onClick={handleRefresh} className="px-2.5 py-1 rounded-md bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 text-[11px] font-medium transition-colors">
              Retry
            </button>
          </div>
        )}

        {/* ===== CONTENT ===== */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-5xl mx-auto px-6 py-8">

            {/* DASHBOARD - Ads front and center */}
            {activeView === "dashboard" && (
              <div className="space-y-10">
                {/* Top 5 Creatives */}
                {r.topCreatives ? (
                  <TopCreativesTab
                    data={{ creatives: allCreatives.length > 0 ? allCreatives : r.topCreatives.creatives }}
                    productName={input.productName}
                    onGenerateMore={handleGenerateMore}
                    isGeneratingMore={isGeneratingMore}
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center py-24">
                    <div className="w-4 h-4 rounded-full border-2 border-muted-foreground/30 border-t-primary animate-spin mb-5" />
                    <div className="text-sm font-medium text-foreground mb-1">Generating your ads</div>
                    <div className="text-xs text-muted-foreground/50">Your top creatives will appear here shortly</div>
                  </div>
                )}

                {/* Quick insight cards */}
                {(r.research || r.psycheMap || r.salesPlaybook) && (
                  <div>
                    <h2 className="text-sm font-semibold text-foreground mb-3">Quick Insights</h2>
                    <div className="grid grid-cols-3 gap-3">
                      {r.research && r.research.audienceSegments?.length > 0 && (
                        <button onClick={() => setActiveView("research")} className="text-left p-4 rounded-md border-l-2 border-l-violet-500/60 border border-border/30 bg-card/40 hover:bg-card/70 transition-colors group">
                          <div className="text-[10px] font-medium text-muted-foreground/50 uppercase tracking-wide mb-1.5">Top Audience</div>
                          <div className="text-sm font-medium text-foreground mb-1">{r.research.audienceSegments[0].name}</div>
                          <div className="text-xs text-muted-foreground/70 leading-relaxed">{r.research.audienceSegments[0].demographics}</div>
                          <div className="text-[11px] text-muted-foreground/50 font-medium mt-2.5 group-hover:text-foreground transition-colors">View Research
                            <svg className="w-3 h-3 inline ml-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                          </div>
                        </button>
                      )}
                      {r.psycheMap && (
                        <button onClick={() => setActiveView("psyche")} className="text-left p-4 rounded-md border-l-2 border-l-blue-500/60 border border-border/30 bg-card/40 hover:bg-card/70 transition-colors group">
                          <div className="text-[10px] font-medium text-muted-foreground/50 uppercase tracking-wide mb-1.5">Psychology</div>
                          <div className="text-sm font-medium text-foreground mb-1">{r.psycheMap.cognitiveProfile.name}</div>
                          <div className="text-xs text-muted-foreground/70 leading-relaxed">Strongest angle: {[...r.psycheMap.biases].sort((a, b) => b.strength - a.strength)[0]?.name}</div>
                          <div className="text-[11px] text-muted-foreground/50 font-medium mt-2.5 group-hover:text-foreground transition-colors">View Psychology
                            <svg className="w-3 h-3 inline ml-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                          </div>
                        </button>
                      )}
                      {r.salesPlaybook && (
                        <button onClick={() => setActiveView("sales")} className="text-left p-4 rounded-md border-l-2 border-l-emerald-500/60 border border-border/30 bg-card/40 hover:bg-card/70 transition-colors group">
                          <div className="text-[10px] font-medium text-muted-foreground/50 uppercase tracking-wide mb-1.5">Sales Lever</div>
                          <div className="text-sm font-medium text-foreground mb-1">{[...r.salesPlaybook.cialdiniWeapons].sort((a, b) => b.power - a.power)[0]?.name}</div>
                          <div className="text-xs text-muted-foreground/70 leading-relaxed">{r.salesPlaybook.valueEquation.dreamOutcome.text.slice(0, 60)}...</div>
                          <div className="text-[11px] text-muted-foreground/50 font-medium mt-2.5 group-hover:text-foreground transition-colors">View Sales Strategy
                            <svg className="w-3 h-3 inline ml-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                          </div>
                        </button>
                      )}
                    </div>
                  </div>
                )}

                {/* Canvas coming soon */}
                <div className="flex items-center justify-center py-8 rounded-md border border-dashed border-border/30">
                  <div className="text-center">
                    <div className="text-xs font-medium text-muted-foreground/40 mb-0.5">Creative Canvas</div>
                    <div className="text-[11px] text-muted-foreground/25">AI Video Creator - Coming Soon</div>
                  </div>
                </div>
              </div>
            )}

            {/* TEMPLATES */}
            {activeView === "templates" && <TemplatesPage />}

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
      className={`w-full flex items-center gap-2.5 px-2.5 py-[7px] rounded-md text-left transition-colors mb-px ${
        active
          ? "bg-primary/10 text-foreground"
          : "text-muted-foreground/70 hover:text-foreground hover:bg-secondary/40"
      }`}
      onClick={onClick}
    >
      <svg className={`w-4 h-4 shrink-0 ${active ? "text-primary" : ""}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
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
    <div className="border-b border-border/40 bg-background flex-shrink-0">
      {/* Thin progress bar */}
      <div className="h-[2px] bg-border/20">
        <div
          className="h-full bg-primary transition-all duration-700 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="px-5 py-3">
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            <span className="text-xs font-medium text-foreground">Generating</span>
            <span className="text-[11px] text-muted-foreground/60 tabular-nums">
              {Math.round(progress)}%
            </span>
          </div>
          <div className="flex items-center gap-3 text-[11px] text-muted-foreground/50 tabular-nums">
            <span>{formatDuration(liveElapsed)}</span>
            {etaMs > 0 && <span>~{formatDuration(etaMs)} left</span>}
          </div>
        </div>

        <div className="flex flex-col gap-0.5">
          {steps.map((step, i) => (
            <StepRow key={step.key} step={step} index={i} />
          ))}
        </div>

        {generatingStep && (
          <div className="mt-2.5 flex items-center gap-2 px-3 py-2 rounded-md bg-secondary/30">
            <LoadingDots />
            <span className="text-[11px] text-muted-foreground/70">{generatingStep.description}</span>
          </div>
        )}
      </div>
    </div>
  );
}

function StepRow({ step, index }: { step: SectionStep; index: number }) {
  return (
    <div className={`flex items-center gap-2 py-1 px-2 rounded-md transition-colors ${
      step.status === "generating" ? "bg-secondary/20" : ""
    }`}>
      <div className="w-4 h-4 flex items-center justify-center shrink-0">
        {step.status === "done" && (
          <svg className="w-3.5 h-3.5 text-green-400/80" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        )}
        {step.status === "generating" && (
          <div className="w-3 h-3 rounded-full border-[1.5px] border-primary border-t-transparent animate-spin" />
        )}
        {step.status === "pending" && (
          <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground/20" />
        )}
        {step.status === "error" && (
          <svg className="w-3.5 h-3.5 text-rose-400/80" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        )}
      </div>

      <span className={`text-[10px] font-medium w-3 text-center tabular-nums ${
        step.status === "done" ? "text-green-400/70"
        : step.status === "generating" ? "text-primary"
        : step.status === "error" ? "text-rose-400/70"
        : "text-muted-foreground/30"
      }`}>
        {index + 1}
      </span>

      <span className={`text-xs font-medium flex-1 ${
        step.status === "done" ? "text-foreground/80"
        : step.status === "generating" ? "text-foreground"
        : step.status === "error" ? "text-rose-400"
        : "text-muted-foreground/30"
      }`}>
        {step.label}
      </span>

      <span className="text-[10px] text-muted-foreground/40 tabular-nums w-12 text-right">
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

  return <span className="text-primary/70">{formatDuration(elapsed)}</span>;
}

function LoadingDots() {
  return (
    <div className="flex gap-0.5">
      <div className="w-1 h-1 rounded-full bg-muted-foreground/40 animate-bounce" style={{ animationDelay: "0ms" }} />
      <div className="w-1 h-1 rounded-full bg-muted-foreground/40 animate-bounce" style={{ animationDelay: "150ms" }} />
      <div className="w-1 h-1 rounded-full bg-muted-foreground/40 animate-bounce" style={{ animationDelay: "300ms" }} />
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

function formatRelativeDate(isoString: string): string {
  const date = new Date(isoString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function LoadingSection({ label }: { label: string }) {
  return (
    <div className="flex items-center justify-center py-24">
      <div className="text-center">
        <div className="w-4 h-4 rounded-full border-[1.5px] border-muted-foreground/30 border-t-primary animate-spin mx-auto mb-4" />
        <div className="text-sm font-medium text-foreground mb-1">Waiting for {label}</div>
        <div className="text-xs text-muted-foreground/40">This section will appear once generated</div>
      </div>
    </div>
  );
}
