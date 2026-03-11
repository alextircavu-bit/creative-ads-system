"use client";

import type { GenerationResult } from "@/types/creative";

interface AdDashboardProps {
  result: Partial<GenerationResult>;
  productName: string;
  isGenerating: boolean;
  onNavigate: (tabId: string) => void;
}

export function AdDashboard({ result, productName, isGenerating, onNavigate }: AdDashboardProps) {
  const r = result;
  const sections = [
    { key: "psycheMap", ready: !!r.psycheMap },
    { key: "salesPlaybook", ready: !!r.salesPlaybook },
    { key: "research", ready: !!r.research },
    { key: "creativeTree", ready: !!r.creativeTree },
    { key: "topCreatives", ready: !!r.topCreatives },
  ];
  const completedCount = sections.filter((s) => s.ready).length;
  const hasAnyData = completedCount > 0;

  return (
    <div className="space-y-4">
      {/* Dashboard Header */}
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-white text-sm font-black shadow-lg shadow-violet-500/25">
          Ad
        </div>
        <div>
          <div className="text-lg font-black tracking-tight">Ad Predictions</div>
          <div className="text-xs text-muted-foreground">
            Based on our framework analysis of <strong className="text-foreground">{productName}</strong>
            {isGenerating && <span className="ml-1.5 text-violet-400 animate-pulse">- analyzing...</span>}
          </div>
        </div>
      </div>

      {/* 4 Summary Panels */}
      <div className="grid grid-cols-2 gap-4">
        {/* Psyche Map Summary */}
        <SummaryPanel
          icon="🧠"
          title="Psychology Profile"
          subtitle="What's likely happening in your user's brain"
          color="#8b5cf6"
          ready={!!r.psycheMap}
          isGenerating={isGenerating}
          onNavigate={() => onNavigate("psyche")}
        >
          {r.psycheMap && (
            <>
              <Insight color="#8b5cf6">
                Predicted cognitive profile: <strong>{r.psycheMap.cognitiveProfile.name}</strong> - {r.psycheMap.cognitiveProfile.mechanism.split("(")[0].trim().toLowerCase()}
              </Insight>
              <Insight color="#22c55e">
                Primary dopamine trigger: <strong>{r.psycheMap.dopamine.trigger}</strong> ({r.psycheMap.dopamine.triggerPct}% power)
              </Insight>
              <Insight color="#f59e0b">
                Reward schedule: <strong>{r.psycheMap.dopamine.schedule}</strong> - {r.psycheMap.dopamine.schedulePct >= 70 ? "high addiction potential" : "moderate engagement"}
              </Insight>
              {r.psycheMap.biases.length > 0 && (
                <Insight color="#f43f5e">
                  Strongest bias: <strong>{r.psycheMap.biases.sort((a, b) => b.strength - a.strength)[0].name}</strong> at {r.psycheMap.biases.sort((a, b) => b.strength - a.strength)[0].strength}% - likely your most exploitable angle
                </Insight>
              )}
              <Insight color="#06b6d4">
                {r.psycheMap.brainRegions.filter((b) => b.active).length} brain regions predicted to activate - habit loop: <strong>{r.psycheMap.habitLoop.cue}</strong> → {r.psycheMap.habitLoop.routine} → reward
              </Insight>
            </>
          )}
        </SummaryPanel>

        {/* Sales Playbook Summary */}
        <SummaryPanel
          icon="📖"
          title="Sales Strategy"
          subtitle="Predicted strongest persuasion angles"
          color="#f97316"
          ready={!!r.salesPlaybook}
          isGenerating={isGenerating}
          onNavigate={() => onNavigate("sales")}
        >
          {r.salesPlaybook && (() => {
            const ve = r.salesPlaybook.valueEquation;
            const topCialdini = [...r.salesPlaybook.cialdiniWeapons].sort((a, b) => b.power - a.power)[0];
            const topNLP = r.salesPlaybook.nlp?.techniques.length
              ? [...r.salesPlaybook.nlp.techniques].sort((a, b) => b.power - a.power)[0]
              : null;
            const topAwareness = [...r.salesPlaybook.awarenessLevels].sort((a, b) => b.relevance - a.relevance)[0];
            const sl = r.salesPlaybook.straightLine;
            const weakest = sl.product.score <= sl.seller.score && sl.product.score <= sl.action.score
              ? { name: "Product Certainty", score: sl.product.score }
              : sl.seller.score <= sl.action.score
                ? { name: "Seller Trust", score: sl.seller.score }
                : { name: "Action Threshold", score: sl.action.score };

            return (
              <>
                <Insight color="#f97316">
                  Value equation: Dream Outcome <strong>{ve.dreamOutcome.score}%</strong>, Likelihood <strong>{ve.perceivedLikelihood.score}%</strong> - {ve.dreamOutcome.score >= 75 ? "strong aspirational pull" : "needs clearer outcome framing"}
                </Insight>
                <Insight color="#3b82f6">
                  Top influence weapon: <strong>{topCialdini.icon} {topCialdini.name}</strong> at {topCialdini.power}% - predicted to be your strongest persuasion lever
                </Insight>
                {topNLP && (
                  <Insight color="#a855f7">
                    Recommended NLP technique: <strong>{topNLP.name}</strong> ({topNLP.power}% power) - most likely to shift beliefs
                  </Insight>
                )}
                <Insight color="#22c55e">
                  Best audience entry point: <strong>Level {topAwareness.level} - {topAwareness.name}</strong> ({topAwareness.relevance}% relevant)
                </Insight>
                <Insight color="#f43f5e">
                  Weakest link: <strong>{weakest.name}</strong> at {weakest.score}% - your ad should address this first
                </Insight>
              </>
            );
          })()}
        </SummaryPanel>

        {/* Research Summary */}
        <SummaryPanel
          icon="🔍"
          title="Audience Intel"
          subtitle="Who your user probably is and where to find them"
          color="#ec4899"
          ready={!!r.research}
          isGenerating={isGenerating}
          onNavigate={() => onNavigate("research")}
        >
          {r.research && (() => {
            const segments = r.research.audienceSegments || [];
            const topSegments = segments.slice(0, 3);
            const highROI = segments.filter((s) => s.predictedROI === "high");
            const platforms = [...new Set(r.research.searchQueries.map((q) => q.platform))];

            return (
              <>
                {topSegments.length > 0 ? (
                  <>
                    <Insight color="#ec4899">
                      <strong>{segments.length} audience segments</strong> predicted - test all, then double down on converters
                    </Insight>
                    {topSegments.map((seg, i) => (
                      <Insight key={i} color={seg.color}>
                        <strong>{seg.name}</strong> ({seg.demographics}) - {seg.predictedROI} ROI, {seg.conversionLikelihood}% conversion likelihood. Best angle: {seg.bestAngle}
                      </Insight>
                    ))}
                    {highROI.length > 0 && (
                      <Insight color="#22c55e">
                        Start with: <strong>{highROI.map((s) => s.name).join(", ")}</strong> - predicted highest return on ad spend
                      </Insight>
                    )}
                  </>
                ) : (
                  <Insight color="#ec4899">
                    {r.research.avatarTraits.length} avatar traits mapped - {r.research.avatarTraits.slice(0, 2).map((t) => `${t.label}: ${t.value}`).join(", ")}
                  </Insight>
                )}
                <Insight color="#8b5cf6">
                  {r.research.searchQueries.length} search queries across {platforms.length} platform{platforms.length !== 1 ? "s" : ""} ({platforms.join(", ")})
                </Insight>
              </>
            );
          })()}
        </SummaryPanel>

        {/* Creative Tree Summary */}
        <SummaryPanel
          icon="🎨"
          title="Creative Strategy"
          subtitle="Predicted strongest angles and ad formats"
          color="#f59e0b"
          ready={!!r.creativeTree}
          isGenerating={isGenerating}
          onNavigate={() => onNavigate("tree")}
        >
          {r.creativeTree && (() => {
            const totalScripts = Object.values(r.creativeTree.scripts).reduce((s, arr) => s + arr.length, 0);
            const topAngles = [...r.creativeTree.emotionalAngles]
              .sort((a, b) => (b.relevanceScore || 0) - (a.relevanceScore || 0))
              .slice(0, 3);
            const totalHooks = Object.values(r.creativeTree.scripts)
              .flat()
              .reduce((s, script) => s + (script.hooks?.length || 0), 0);
            const topCreative = r.topCreatives?.creatives[0];

            return (
              <>
                <Insight color="#f59e0b">
                  {r.creativeTree.emotionalAngles.length} emotional angles × {r.creativeTree.frameworks.length} frameworks = <strong>{totalScripts} unique ad scripts</strong> generated
                </Insight>
                <Insight color="#f43f5e">
                  Predicted top angles: {topAngles.map((a, i) => (
                    <span key={a.id}>
                      {i > 0 && ", "}
                      <strong style={{ color: a.color }}>{a.name}</strong>
                    </span>
                  ))}
                </Insight>
                {totalHooks > 0 && (
                  <Insight color="#8b5cf6">
                    {totalHooks} hook variations ready - test these as your first 3 seconds
                  </Insight>
                )}
                <Insight color="#06b6d4">
                  {r.creativeTree.platformFormats.length} platform{r.creativeTree.platformFormats.length !== 1 ? "s" : ""} covered: {r.creativeTree.platformFormats.map((p) => p.platform).join(", ")}
                </Insight>
                {topCreative && (
                  <Insight color="#22c55e">
                    Top predicted creative: <strong>&quot;{topCreative.name}&quot;</strong> - {topCreative.platform}, {topCreative.emotion.toLowerCase()} angle
                    {topCreative.productionStyle && `. Production: ${topCreative.productionStyle}`}
                  </Insight>
                )}
              </>
            );
          })()}
        </SummaryPanel>
      </div>

      {/* Canvas - AI Video Creator (Coming Soon) */}
      <div className="bg-card/30 backdrop-blur-sm border border-border/30 border-dashed rounded-2xl p-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-500/[0.03] via-transparent to-fuchsia-500/[0.03]" />
        <div className="absolute top-4 right-4">
          <span className="px-2.5 py-1 rounded-lg bg-violet-500/10 text-violet-400 text-[10px] font-bold uppercase tracking-widest border border-violet-500/20">
            Coming Soon
          </span>
        </div>

        <div className="relative">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 border border-violet-500/20 flex items-center justify-center text-lg">
              🎬
            </div>
            <div>
              <div className="text-base font-black tracking-tight">Creative Canvas</div>
              <div className="text-xs text-muted-foreground">AI Video Creator - preview and export your ads</div>
            </div>
          </div>

          <div className="text-xs text-muted-foreground/60 leading-relaxed mb-5 max-w-lg">
            Turn your generated ad scripts into video previews. Select a creative from the Top 5, customize visuals, add voiceover, and export directly to your ad platforms.
          </div>

          {/* Preview mockups */}
          <div className="grid grid-cols-3 gap-3">
            {(result.topCreatives?.creatives || []).slice(0, 3).map((creative, i) => (
              <div
                key={i}
                className="group relative bg-background/30 border border-border/20 rounded-xl p-4 hover:border-violet-500/20 transition-all cursor-not-allowed"
              >
                <div className="aspect-[9/16] bg-gradient-to-b from-border/10 to-border/5 rounded-lg mb-3 flex items-center justify-center overflow-hidden relative">
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center mb-2">
                      <svg className="w-4 h-4 text-white/40 ml-0.5" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                    <span className="text-[10px] text-muted-foreground/30 font-medium">Preview</span>
                  </div>
                  <div className="absolute bottom-2 left-2 right-2">
                    <div className="bg-black/40 backdrop-blur-sm rounded-lg px-2 py-1.5">
                      <div className="text-[9px] text-white/70 font-semibold leading-tight truncate">
                        {(creative.hooks?.[0]?.text || creative.hook?.text || "").slice(0, 60)}...
                      </div>
                    </div>
                  </div>
                </div>
                <div className="text-[10px] font-bold text-foreground/60 truncate mb-0.5">
                  #{creative.rank} {creative.name}
                </div>
                <div className="flex gap-1">
                  <span className="px-1.5 py-0.5 rounded text-[8px] font-bold bg-pink-500/10 text-pink-400/60">{creative.platform}</span>
                  <span className="px-1.5 py-0.5 rounded text-[8px] font-bold bg-violet-500/10 text-violet-400/60">{creative.format}</span>
                </div>
                <div className="absolute inset-0 rounded-xl bg-background/20 backdrop-blur-[1px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="text-center">
                    <svg className="w-5 h-5 text-muted-foreground/40 mx-auto mb-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                      <path d="M7 11V7a5 5 0 0110 0v4" />
                    </svg>
                    <span className="text-[10px] text-muted-foreground/50 font-semibold">Coming Soon</span>
                  </div>
                </div>
              </div>
            ))}

            {(!result.topCreatives || result.topCreatives.creatives.length === 0) && (
              <>
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-background/20 border border-border/10 rounded-xl p-4">
                    <div className="aspect-[9/16] bg-border/5 rounded-lg mb-3 flex items-center justify-center">
                      <div className="w-8 h-8 rounded-full bg-border/10 flex items-center justify-center">
                        <svg className="w-3 h-3 text-muted-foreground/20 ml-0.5" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </div>
                    </div>
                    <div className="h-3 bg-border/10 rounded w-2/3 mb-1" />
                    <div className="h-2 bg-border/5 rounded w-1/3" />
                  </div>
                ))}
              </>
            )}
          </div>

          <div className="flex items-center gap-3 mt-4 pt-4 border-t border-border/20">
            <button disabled className="flex items-center gap-2 px-4 py-2 rounded-xl bg-violet-500/10 text-violet-400/50 text-xs font-semibold border border-violet-500/15 cursor-not-allowed">
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M12 5v14M5 12h14" /></svg>
              Generate Video Preview
            </button>
            <button disabled className="flex items-center gap-2 px-4 py-2 rounded-xl bg-secondary/30 text-muted-foreground/30 text-xs font-semibold border border-border/20 cursor-not-allowed">
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" /></svg>
              Export to Platform
            </button>
            <span className="text-[10px] text-muted-foreground/30 ml-auto">AI video generation powered by your creatives</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- Summary Panel ---

function SummaryPanel({
  icon,
  title,
  subtitle,
  color,
  ready,
  isGenerating,
  onNavigate,
  children,
}: {
  icon: string;
  title: string;
  subtitle: string;
  color: string;
  ready: boolean;
  isGenerating: boolean;
  onNavigate: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-5 flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-2.5 mb-3">
        <div
          className="w-8 h-8 rounded-xl flex items-center justify-center text-sm shrink-0 border"
          style={{ background: color + "10", borderColor: color + "20" }}
        >
          {icon}
        </div>
        <div className="min-w-0">
          <div className="text-sm font-bold truncate">{title}</div>
          <div className="text-[10px] text-muted-foreground/50">{subtitle}</div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 min-h-0">
        {ready ? (
          <div className="space-y-2">
            {children}
          </div>
        ) : isGenerating ? (
          <div className="flex items-center gap-2 py-6 justify-center">
            <div className="w-3 h-3 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: color, borderTopColor: "transparent" }} />
            <span className="text-[10px] text-muted-foreground/40">Analyzing...</span>
          </div>
        ) : (
          <div className="py-6 text-center">
            <span className="text-[10px] text-muted-foreground/30">Waiting for generation</span>
          </div>
        )}
      </div>

      {/* Navigate arrow */}
      {ready && (
        <button
          onClick={onNavigate}
          className="group flex items-center gap-2 mt-4 pt-3 border-t border-border/30 text-xs font-semibold transition-all hover:gap-3"
          style={{ color }}
        >
          Explore full analysis
          <svg
            className="w-4 h-4 transition-transform group-hover:translate-x-1"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M5 12h14" />
            <path d="M12 5l7 7-7 7" />
          </svg>
        </button>
      )}
    </div>
  );
}

// --- Insight line ---

function Insight({ color, children }: { color: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-2">
      <div className="w-1.5 h-1.5 rounded-full shrink-0 mt-[5px]" style={{ background: color }} />
      <div className="text-xs text-muted-foreground leading-relaxed">{children}</div>
    </div>
  );
}
