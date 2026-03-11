"use client";

import type { TopCreativesData } from "@/types/creative";

interface TopCreativesTabProps {
  data: TopCreativesData;
  productName: string;
}

export function TopCreativesTab({ data, productName }: TopCreativesTabProps) {
  return (
    <div className="mb-10">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/20 flex items-center justify-center text-lg shrink-0">
          🎬
        </div>
        <div>
          <div className="text-lg font-black tracking-tight">Top 5 Ad Creatives</div>
          <div className="text-xs text-muted-foreground mt-0.5">
            Complete ad blueprints for <strong className="text-foreground">{productName}</strong> - ready for production
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-10">
        {data.creatives.map((creative) => (
          <div key={creative.rank} className="relative">
            {/* Creative header */}
            <div className="flex items-start gap-3 mb-4">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-500/20 to-purple-500/20 border border-violet-500/20 flex items-center justify-center text-sm font-black text-violet-300 shrink-0">
                {creative.rank}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-base font-extrabold mb-1.5 truncate">&quot;{creative.name}&quot;</div>
                <div className="flex gap-1.5 flex-wrap">
                  {creative.templateName && (
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold tracking-wide bg-emerald-500/10 text-emerald-400 border border-emerald-500/15">
                      {creative.templateName}
                    </span>
                  )}
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-bold tracking-wide bg-pink-500/10 text-pink-400 border border-pink-500/15">
                    {creative.platform}
                  </span>
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-bold tracking-wide bg-amber-500/10 text-amber-400 border border-amber-500/15">
                    {creative.emotion}
                  </span>
                  {creative.experienceType && (
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold tracking-wide bg-cyan-500/10 text-cyan-400 border border-cyan-500/15">
                      {creative.experienceType}
                    </span>
                  )}
                  {creative.targetSegment && (
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold tracking-wide bg-green-500/10 text-green-400 border border-green-500/15">
                      {creative.targetSegment}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Template rationale */}
            {creative.whyThisTemplate && (
              <div className="text-[11px] text-muted-foreground/70 mb-4 px-3 py-2 bg-emerald-500/5 border border-emerald-500/10 rounded-lg">
                <span className="font-bold text-emerald-400/60">Template: </span>{creative.whyThisTemplate}
              </div>
            )}

            {/* Scenario + Production - compact row */}
            {(creative.scenario || creative.productionStyle) && (
              <div className="grid grid-cols-2 gap-2 mb-4">
                {creative.scenario && (
                  <div className="bg-rose-500/5 border border-rose-500/10 rounded-xl p-2.5">
                    <div className="text-[9px] uppercase tracking-widest font-bold text-rose-400/60 mb-0.5">Scenario</div>
                    <div className="text-[11px] text-muted-foreground leading-relaxed">{creative.scenario}</div>
                  </div>
                )}
                {creative.productionStyle && (
                  <div className="bg-violet-500/5 border border-violet-500/10 rounded-xl p-2.5">
                    <div className="text-[9px] uppercase tracking-widest font-bold text-violet-400/60 mb-0.5">Production Style</div>
                    <div className="text-[11px] text-muted-foreground leading-relaxed">{creative.productionStyle}</div>
                  </div>
                )}
              </div>
            )}

            {/* Glass panels - Hook / Body / CTA horizontal */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: "Hook", data: creative.hook, accent: "from-rose-500/40 to-pink-500/40", textColor: "text-rose-300", borderColor: "border-rose-500/20", showUpload: false },
                { label: "Body", data: creative.body, accent: "from-amber-500/40 to-orange-500/40", textColor: "text-amber-300", borderColor: "border-amber-500/20", showUpload: true },
                { label: "CTA", data: creative.cta, accent: "from-emerald-500/40 to-green-500/40", textColor: "text-emerald-300", borderColor: "border-emerald-500/20", showUpload: false },
              ].map((panel) => (
                <div
                  key={panel.label}
                  className={`relative group rounded-2xl border ${panel.borderColor} bg-white/[0.03] backdrop-blur-md overflow-hidden transition-all hover:bg-white/[0.06] hover:border-violet-500/25`}
                >
                  {/* Top gradient edge */}
                  <div className={`absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r ${panel.accent}`} />

                  {/* Panel content */}
                  <div className="p-4 flex flex-col h-full">
                    {/* Label + time */}
                    <div className="flex items-center justify-between mb-3">
                      <span className={`text-xs font-black tracking-widest uppercase ${panel.textColor}`}>
                        {panel.label}
                      </span>
                      <span className="text-[10px] text-muted-foreground/40 font-mono">
                        {panel.data.time}
                      </span>
                    </div>

                    {/* Script text */}
                    <div className="text-sm text-foreground/90 leading-relaxed font-medium mb-3 flex-1">
                      {panel.data.text}
                    </div>

                    {/* Visual direction */}
                    <div className="text-[11px] text-muted-foreground/60 leading-relaxed p-2.5 rounded-lg bg-white/[0.03] border border-white/[0.04]">
                      <div className="text-[9px] font-bold tracking-widest uppercase text-muted-foreground/30 mb-1">Visual</div>
                      {panel.data.visual}
                    </div>

                    {/* Upload indicator on Body panel */}
                    {panel.showUpload && (
                      <button
                        type="button"
                        className="mt-3 w-full flex items-center justify-center gap-2 py-2 rounded-lg border border-dashed border-amber-500/20 bg-amber-500/5 text-amber-400/60 hover:bg-amber-500/10 hover:text-amber-400 hover:border-amber-500/30 transition-all cursor-pointer"
                      >
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                          <path d="M12 5v14M5 12h14" />
                        </svg>
                        <span className="text-[10px] font-bold tracking-wider uppercase">Upload Experience</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
