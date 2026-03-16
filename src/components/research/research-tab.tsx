"use client";

import type { ResearchData } from "@/types/creative";

interface ResearchTabProps {
  data: ResearchData;
  productName: string;
}

export function ResearchTab({ data, productName }: ResearchTabProps) {
  const groupedQueries = data.searchQueries.reduce<Record<string, typeof data.searchQueries>>((acc, q) => {
    (acc[q.platform] ??= []).push(q);
    return acc;
  }, {});

  return (
    <div className="space-y-5">
      {/* Shadow Avatar */}
      <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-2xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-lg shrink-0">👻</div>
          <div>
            <div className="text-base font-extrabold">The Shadow Avatar Technique</div>
            <div className="text-xs text-muted-foreground mt-0.5">The most powerful ad research method</div>
          </div>
        </div>
        <div className="text-xs text-muted-foreground leading-relaxed mb-4 px-4 py-3 bg-background/50 border border-border/30 rounded-xl">
          Before you write a single word of copy, you need to <strong className="text-foreground">become</strong> your target user. Scroll what they scroll. Feel what they feel.
        </div>
        <div className="space-y-1.5">
          {data.shadowAvatarSteps.map((step) => (
            <div key={step.num} className="flex items-stretch gap-0">
              <div className="w-10 flex items-center justify-center text-[10px] font-extrabold text-white shrink-0 rounded-l-xl" style={{ background: step.color }}>{step.num}</div>
              <div className="flex-1 bg-background/50 border border-border/30 border-l-0 rounded-r-xl px-4 py-3.5">
                <div className="text-sm font-bold mb-1">{step.title}</div>
                <div className="text-xs text-muted-foreground leading-relaxed">{step.description}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Search Queries */}
      <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-lg shrink-0">🔍</div>
          <div>
            <div className="text-base font-extrabold">Search Queries for {productName}</div>
            <div className="text-xs text-muted-foreground mt-0.5">What to search on each platform to find raw audience thoughts</div>
          </div>
        </div>
        {Object.entries(groupedQueries).map(([platform, queries]) => (
          <div key={platform} className="mb-4 last:mb-0">
            <div className="text-[10px] font-extrabold uppercase tracking-[1.5px] text-muted-foreground/40 mb-2">{platform}</div>
            <div className="grid grid-cols-2 gap-2">
              {queries.map((q, i) => (
                <div key={i} className="bg-secondary/30 border border-border/30 rounded-xl p-3 hover:border-violet-500/20 transition-all">
                  <div className="text-[10px] uppercase tracking-[1.5px] font-bold text-muted-foreground/40 mb-1">{platform} Search</div>
                  <div className="text-xs text-foreground font-semibold italic">&quot;{q.query}&quot;</div>
                  <div className="text-[10px] text-muted-foreground/50 mt-1.5 leading-snug">{q.why}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Research Techniques */}
      <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-2xl bg-green-500/10 border border-green-500/20 flex items-center justify-center text-lg shrink-0">🧪</div>
          <div>
            <div className="text-base font-extrabold">Research Techniques</div>
            <div className="text-xs text-muted-foreground mt-0.5">Proven methods to extract ad gold from every platform</div>
          </div>
        </div>
        <div className="space-y-2">
          {data.researchTechniques.map((tech) => (
            <div key={tech.name} className="bg-background/50 border border-border/30 rounded-xl p-4 hover:border-green-500/20 transition-all">
              <div className="text-sm font-bold mb-1.5" style={{ color: tech.color }}>{tech.name}</div>
              <div className="text-xs text-muted-foreground leading-relaxed mb-2.5">{tech.description}</div>
              <div className="flex flex-wrap gap-1.5">
                {tech.steps.map((step, i) => (
                  <span key={i} className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-secondary/50 text-muted-foreground/70 border border-border/30">{i + 1}. {step}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Avatar Profile */}
      <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-lg shrink-0">👤</div>
          <div>
            <div className="text-base font-extrabold">Shadow Avatar Profile</div>
            <div className="text-xs text-muted-foreground mt-0.5">Your target user for {productName}</div>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2.5">
          {data.avatarTraits.map((trait) => (
            <div key={trait.label} className="bg-background/50 border border-border/30 rounded-xl p-3.5 text-center hover:border-amber-500/20 transition-all">
              <div className="text-[10px] uppercase tracking-[1.5px] font-bold text-muted-foreground/40 mb-1.5">{trait.label}</div>
              <div className="flex flex-wrap gap-1.5 justify-center">
                {trait.value.split(" / ").map((chip, i) => (
                  <span key={i} className="px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/10 border border-amber-500/20 text-foreground">{chip.trim()}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Audience Segments */}
      {data.audienceSegments && data.audienceSegments.length > 0 && (
        <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-2xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center text-lg shrink-0">🎯</div>
            <div>
              <div className="text-base font-extrabold">Predicted Audience Segments</div>
              <div className="text-xs text-muted-foreground mt-0.5">Ranked by predicted ROI - test all, double down on winners</div>
            </div>
          </div>
          <div className="text-xs text-muted-foreground/50 leading-relaxed mb-4 px-4 py-2.5 bg-background/50 border border-border/30 rounded-xl">
            These are <strong className="text-foreground/70">recommendations to validate through ad testing</strong>. Run campaigns against multiple segments, measure conversion/subscription rates, then shift budget toward the highest-performing groups.
          </div>
          <div className="space-y-3">
            {data.audienceSegments.map((seg, i) => {
              const roiColors = { high: "#22c55e", medium: "#f59e0b", low: "#64748b" };
              const roiColor = roiColors[seg.predictedROI] || "#64748b";
              return (
                <div key={i} className="bg-background/50 border border-border/30 rounded-xl p-4 hover:border-pink-500/20 transition-all" style={{ borderLeft: `3px solid ${seg.color}` }}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2.5">
                      <span className="w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-extrabold text-white shrink-0" style={{ background: seg.color }}>
                        {i + 1}
                      </span>
                      <span className="text-sm font-bold">{seg.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold border" style={{ color: roiColor, borderColor: roiColor + "30", background: roiColor + "10" }}>
                        {seg.predictedROI.toUpperCase()} ROI
                      </span>
                      <span className="text-xs font-black tabular-nums" style={{ color: seg.color }}>
                        {seg.conversionLikelihood}%
                      </span>
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground leading-relaxed mb-3">{seg.description}</div>

                  <div className="grid grid-cols-2 gap-2 mb-3">
                    <div className="bg-secondary/30 border border-border/20 rounded-lg p-2.5">
                      <div className="text-[9px] uppercase tracking-widest font-bold text-muted-foreground/30 mb-1">Demographics</div>
                      <div className="text-[11px] text-muted-foreground leading-relaxed">{seg.demographics}</div>
                    </div>
                    <div className="bg-secondary/30 border border-border/20 rounded-lg p-2.5">
                      <div className="text-[9px] uppercase tracking-widest font-bold text-muted-foreground/30 mb-1">Psychographics</div>
                      <div className="text-[11px] text-muted-foreground leading-relaxed">{seg.psychographics}</div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-3 mb-2.5 text-[10px] text-muted-foreground/50">
                    <span>Acquisition: <strong className="text-foreground/60">{seg.acquisitionCost}</strong></span>
                    <span>Lifetime Value: <strong className="text-foreground/60">{seg.lifetimeValue}</strong></span>
                  </div>

                  <div className="flex items-start gap-2 bg-secondary/20 border border-border/15 rounded-lg p-2.5">
                    <span className="text-[10px] shrink-0 mt-0.5">💡</span>
                    <div className="text-[11px] text-muted-foreground leading-relaxed">
                      <strong className="text-foreground/70">Best angle:</strong> {seg.bestAngle} - <span className="text-muted-foreground/60">{seg.adStrategy}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Pre-Creative Checklist */}
      <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-lg shrink-0">📋</div>
          <div>
            <div className="text-base font-extrabold">Pre-Creative Checklist</div>
            <div className="text-xs text-muted-foreground mt-0.5">Run through this before every ad creation session</div>
          </div>
        </div>
        <div className="bg-background/50 border border-border/30 rounded-xl p-4 space-y-1">
          {data.preCreativeChecklist.map((item, i) => (
            <div key={i} className="text-sm text-muted-foreground leading-loose flex items-center gap-2">
              <span className="w-4 h-4 rounded-md border border-border/50 flex items-center justify-center text-[9px] text-muted-foreground/30 shrink-0">☐</span>
              {item}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
