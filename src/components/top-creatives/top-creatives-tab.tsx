"use client";

import type { TopCreativesData } from "@/types/creative";

interface TopCreativesTabProps {
  data: TopCreativesData;
  productName: string;
}

export function TopCreativesTab({ data, productName }: TopCreativesTabProps) {
  return (
    <div className="mb-10">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/20 flex items-center justify-center text-lg shrink-0">
          🎬
        </div>
        <div>
          <div className="text-lg font-black tracking-tight">Top 5 Ad Creatives</div>
          <div className="text-xs text-muted-foreground mt-0.5">
            Complete step-by-step ad blueprints for <strong className="text-foreground">{productName}</strong> — ready for your video editors
          </div>
        </div>
      </div>

      <div className="grid gap-4">
        {data.creatives.map((creative) => (
          <div
            key={creative.rank}
            className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-5 pb-4 relative overflow-hidden hover:border-violet-500/20 transition-all"
          >
            <div className="absolute top-3 right-4 text-5xl font-black text-border/30 leading-none select-none">
              #{creative.rank}
            </div>
            <div className="text-base font-extrabold mb-1.5">&quot;{creative.name}&quot;</div>
            <div className="flex gap-1.5 flex-wrap mb-3">
              <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold tracking-wide bg-pink-500/10 text-pink-400 border border-pink-500/15">
                {creative.platform}
              </span>
              <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold tracking-wide bg-violet-500/10 text-violet-400 border border-violet-500/15">
                {creative.format}
              </span>
              <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold tracking-wide bg-amber-500/10 text-amber-400 border border-amber-500/15">
                {creative.emotion}
              </span>
              {creative.experienceType && (
                <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold tracking-wide bg-cyan-500/10 text-cyan-400 border border-cyan-500/15">
                  {creative.experienceType}
                </span>
              )}
              {creative.targetSegment && (
                <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold tracking-wide bg-green-500/10 text-green-400 border border-green-500/15">
                  {creative.targetSegment}
                </span>
              )}
            </div>

            {/* Scenario + Production */}
            {(creative.scenario || creative.productionStyle) && (
              <div className="grid grid-cols-2 gap-2 mb-4">
                {creative.scenario && (
                  <div className="bg-rose-500/5 border border-rose-500/10 rounded-xl p-3">
                    <div className="text-[9px] uppercase tracking-widest font-bold text-rose-400/60 mb-1">Scenario</div>
                    <div className="text-xs text-muted-foreground leading-relaxed">{creative.scenario}</div>
                  </div>
                )}
                {creative.productionStyle && (
                  <div className="bg-violet-500/5 border border-violet-500/10 rounded-xl p-3">
                    <div className="text-[9px] uppercase tracking-widest font-bold text-violet-400/60 mb-1">Production Style</div>
                    <div className="text-xs text-muted-foreground leading-relaxed">{creative.productionStyle}</div>
                  </div>
                )}
              </div>
            )}

            {[
              { label: "HOOK", data: creative.hook, color: "#f43f5e", gradient: "from-rose-500 to-red-500" },
              { label: "BODY", data: creative.body, color: "#f59e0b", gradient: "from-amber-500 to-orange-500" },
              { label: "CTA", data: creative.cta, color: "#22c55e", gradient: "from-green-500 to-emerald-500" },
            ].map((part, i) => (
              <div key={part.label}>
                <div className="flex gap-0 mb-1.5 items-stretch">
                  <div
                    className={`w-[54px] flex items-center justify-center text-[10px] font-extrabold tracking-[1.5px] uppercase text-white shrink-0 rounded-l-xl bg-gradient-to-b ${part.gradient}`}
                  >
                    {part.label}
                  </div>
                  <div className="flex-1 bg-background/50 border border-border/50 border-l-0 rounded-r-xl px-4 py-3.5">
                    <div className="text-[10px] text-muted-foreground/50 font-bold tracking-widest uppercase mb-1">{part.data.time}</div>
                    <div className="text-sm text-foreground leading-relaxed font-semibold mb-2">{part.data.text}</div>
                    <div className="text-xs text-muted-foreground leading-relaxed p-3 bg-secondary/50 rounded-lg border-l-2" style={{ borderLeftColor: part.color }}>
                      <div className="text-[10px] font-extrabold tracking-[1.5px] text-muted-foreground/50 mb-1">VISUAL DIRECTION</div>
                      {part.data.visual}
                    </div>
                  </div>
                </div>
                {i < 2 && (
                  <div className="flex items-center justify-center pl-7 h-3">
                    <svg className="w-3 h-3 text-border/50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                      <path d="M12 5v14M5 12l7 7 7-7" />
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
