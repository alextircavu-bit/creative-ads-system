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
    <div className="space-y-6">
      {/* Shadow Avatar */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <svg className="w-4 h-4 text-muted-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
          </svg>
          <div>
            <h2 className="text-sm font-semibold text-foreground">The Shadow Avatar Technique</h2>
            <p className="text-xs text-muted-foreground">The most powerful ad research method</p>
          </div>
        </div>
        <div className="text-xs text-muted-foreground leading-relaxed mb-4 px-4 py-3 border border-border/40 rounded-md">
          Before you write a single word of copy, you need to <strong className="text-foreground">become</strong> your target user. Scroll what they scroll. Feel what they feel.
        </div>
        <div className="border border-border/50 rounded-md overflow-hidden">
          {data.shadowAvatarSteps.map((step) => (
            <div key={step.num} className="flex items-stretch border-b border-border/30 last:border-b-0">
              <div className="w-8 flex items-center justify-center text-[10px] font-semibold text-white shrink-0" style={{ background: step.color }}>{step.num}</div>
              <div className="flex-1 px-4 py-3">
                <div className="text-sm font-medium mb-0.5">{step.title}</div>
                <div className="text-xs text-muted-foreground leading-relaxed">{step.description}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Search Queries */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <svg className="w-4 h-4 text-muted-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
          </svg>
          <div>
            <h2 className="text-sm font-semibold text-foreground">Search Queries for {productName}</h2>
            <p className="text-xs text-muted-foreground">What to search on each platform to find raw audience thoughts</p>
          </div>
        </div>
        {Object.entries(groupedQueries).map(([platform, queries]) => (
          <div key={platform} className="mb-4 last:mb-0">
            <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/40 mb-2">{platform}</div>
            <div className="grid grid-cols-2 gap-2">
              {queries.map((q, i) => (
                <div key={i} className="border border-border/40 rounded-md p-3">
                  <div className="text-xs text-foreground font-medium italic mb-1">&quot;{q.query}&quot;</div>
                  <div className="text-[10px] text-muted-foreground/50 leading-snug">{q.why}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </section>

      {/* Research Techniques */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <svg className="w-4 h-4 text-muted-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 3h6v11l-3 3-3-3V3z" /><path d="M6 21h12" /><path d="M9 21v-4" /><path d="M15 21v-4" />
          </svg>
          <div>
            <h2 className="text-sm font-semibold text-foreground">Research Techniques</h2>
            <p className="text-xs text-muted-foreground">Proven methods to extract ad gold from every platform</p>
          </div>
        </div>
        <div className="space-y-2">
          {data.researchTechniques.map((tech) => (
            <div key={tech.name} className="border border-border/50 rounded-md p-4">
              <div className="text-sm font-medium mb-1" style={{ color: tech.color }}>{tech.name}</div>
              <div className="text-xs text-muted-foreground leading-relaxed mb-2.5">{tech.description}</div>
              <div className="flex flex-wrap gap-1.5">
                {tech.steps.map((step, i) => (
                  <span key={i} className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-muted/50 text-muted-foreground/70 border border-border/30">{i + 1}. {step}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Avatar Profile */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <svg className="w-4 h-4 text-muted-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
          <div>
            <h2 className="text-sm font-semibold text-foreground">Shadow Avatar Profile</h2>
            <p className="text-xs text-muted-foreground">Your target user for {productName}</p>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2.5">
          {data.avatarTraits.map((trait) => (
            <div key={trait.label} className="border border-border/50 rounded-md p-3.5 text-center">
              <div className="text-[10px] uppercase tracking-wider font-medium text-muted-foreground/40 mb-2">{trait.label}</div>
              <div className="flex flex-wrap gap-1.5 justify-center">
                {trait.value.split(" / ").map((chip, i) => (
                  <span key={i} className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-muted/50 text-foreground border border-border/40">{chip.trim()}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Audience Segments */}
      {data.audienceSegments && data.audienceSegments.length > 0 && (
        <section>
          <div className="flex items-center gap-2 mb-4">
            <svg className="w-4 h-4 text-muted-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" />
            </svg>
            <div>
              <h2 className="text-sm font-semibold text-foreground">Predicted Audience Segments</h2>
              <p className="text-xs text-muted-foreground">Ranked by predicted ROI — test all, double down on winners</p>
            </div>
          </div>
          <div className="text-xs text-muted-foreground/50 leading-relaxed mb-4 px-4 py-2.5 border border-border/40 rounded-md">
            These are <strong className="text-foreground/70">recommendations to validate through ad testing</strong>. Run campaigns against multiple segments, measure conversion/subscription rates, then shift budget toward the highest-performing groups.
          </div>
          <div className="space-y-2">
            {data.audienceSegments.map((seg, i) => {
              const roiColors = { high: "#22c55e", medium: "#f59e0b", low: "#64748b" };
              const roiColor = roiColors[seg.predictedROI] || "#64748b";
              return (
                <div key={i} className="border border-border/50 rounded-md p-4" style={{ borderLeft: `3px solid ${seg.color}` }}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2.5">
                      <span className="w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-semibold text-white shrink-0" style={{ background: seg.color }}>
                        {i + 1}
                      </span>
                      <span className="text-sm font-medium">{seg.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="px-1.5 py-px rounded-sm text-[10px] font-medium border" style={{ color: roiColor, borderColor: roiColor + "30", background: roiColor + "10" }}>
                        {seg.predictedROI.toUpperCase()} ROI
                      </span>
                      <span className="text-xs font-semibold tabular-nums" style={{ color: seg.color }}>
                        {seg.conversionLikelihood}%
                      </span>
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground leading-relaxed mb-3">{seg.description}</div>

                  <div className="grid grid-cols-2 gap-2 mb-3">
                    <div className="bg-muted/30 border border-border/30 rounded-md p-2.5">
                      <div className="text-[9px] uppercase tracking-wider font-medium text-muted-foreground/30 mb-1">Demographics</div>
                      <div className="text-[11px] text-muted-foreground leading-relaxed">{seg.demographics}</div>
                    </div>
                    <div className="bg-muted/30 border border-border/30 rounded-md p-2.5">
                      <div className="text-[9px] uppercase tracking-wider font-medium text-muted-foreground/30 mb-1">Psychographics</div>
                      <div className="text-[11px] text-muted-foreground leading-relaxed">{seg.psychographics}</div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-3 mb-2.5 text-[10px] text-muted-foreground/50">
                    <span>Acquisition: <strong className="text-foreground/60">{seg.acquisitionCost}</strong></span>
                    <span>Lifetime Value: <strong className="text-foreground/60">{seg.lifetimeValue}</strong></span>
                  </div>

                  <div className="flex items-start gap-2 bg-muted/30 border border-border/30 rounded-md p-2.5">
                    <svg className="w-3 h-3 text-muted-foreground/40 shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 2a5 5 0 0 1 5 5c0 2.38-1.19 4.47-3 5.74V17h-4v-4.26C8.19 11.47 7 9.38 7 7a5 5 0 0 1 5-5z" /><path d="M9 22h6" />
                    </svg>
                    <div className="text-[11px] text-muted-foreground leading-relaxed">
                      <strong className="text-foreground/70">Best angle:</strong> {seg.bestAngle} — <span className="text-muted-foreground/60">{seg.adStrategy}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Pre-Creative Checklist */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <svg className="w-4 h-4 text-muted-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 11l3 3L22 4" /><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
          </svg>
          <div>
            <h2 className="text-sm font-semibold text-foreground">Pre-Creative Checklist</h2>
            <p className="text-xs text-muted-foreground">Run through this before every ad creation session</p>
          </div>
        </div>
        <div className="border border-border/50 rounded-md p-4 space-y-1">
          {data.preCreativeChecklist.map((item, i) => (
            <div key={i} className="text-sm text-muted-foreground leading-loose flex items-center gap-2">
              <span className="w-4 h-4 rounded-md border border-border/50 flex items-center justify-center text-[9px] text-muted-foreground/30 shrink-0">
                <svg className="w-2.5 h-2.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><rect x="3" y="3" width="18" height="18" rx="2" /></svg>
              </span>
              {item}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
