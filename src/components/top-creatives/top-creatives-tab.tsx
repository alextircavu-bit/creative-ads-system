"use client";

import { useMemo } from "react";
import type { TopCreativesData, AdSection, DeliveryMode } from "@/types/creative";
import {
  calculateAdDuration,
  suggestDeliveryMode,
  DELIVERY_MODE_META,
  type SectionTiming,
} from "@/lib/readability";

interface TopCreativesTabProps {
  data: TopCreativesData;
  productName: string;
}

const MODE_COLORS: Record<string, string> = {
  "text-overlay": "bg-amber-500/10 text-amber-400 border-amber-500/15",
  "voiceover": "bg-blue-500/10 text-blue-400 border-blue-500/15",
  "voiceover-caption": "bg-violet-500/10 text-violet-400 border-violet-500/15",
  "vo-caption-subs": "bg-emerald-500/10 text-emerald-400 border-emerald-500/15",
};

function getDeliveryMode(section: AdSection, sectionType: "hook" | "body" | "cta"): DeliveryMode {
  if (section.deliveryMode) return section.deliveryMode;
  const wordCount = section.text.trim().split(/\s+/).length;
  return suggestDeliveryMode(wordCount, sectionType);
}

export function TopCreativesTab({ data, productName }: TopCreativesTabProps) {
  const creativesWithTiming = useMemo(() => {
    return data.creatives.map((creative) => {
      const hookMode = getDeliveryMode(creative.hook, "hook");
      const bodyMode = getDeliveryMode(creative.body, "body");
      const ctaMode = getDeliveryMode(creative.cta, "cta");

      const duration = calculateAdDuration(
        { text: creative.hook.text, deliveryMode: hookMode },
        { text: creative.body.text, deliveryMode: bodyMode },
        { text: creative.cta.text, deliveryMode: ctaMode },
      );

      return { creative, hookMode, bodyMode, ctaMode, duration };
    });
  }, [data.creatives]);

  return (
    <div className="mb-10">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/20 flex items-center justify-center text-lg shrink-0">
          🎬
        </div>
        <div>
          <div className="text-lg font-black tracking-tight">Top 5 Ad Creatives</div>
          <div className="text-xs text-muted-foreground mt-0.5">
            Ad blueprints for <strong className="text-foreground">{productName}</strong>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-10">
        {creativesWithTiming.map(({ creative, hookMode, bodyMode, ctaMode, duration }) => (
          <div key={creative.rank} className="relative">
            {/* Creative header */}
            <div className="flex items-start gap-3 mb-3">
              <div className="w-7 h-7 rounded-lg bg-violet-500/15 border border-violet-500/20 flex items-center justify-center text-xs font-black text-violet-300 shrink-0">
                {creative.rank}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-extrabold truncate">&quot;{creative.name}&quot;</span>
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-white/[0.05] text-muted-foreground/60 border border-white/[0.06] shrink-0">
                    ~{duration.totalFormatted}
                  </span>
                </div>
                <div className="flex gap-1 flex-wrap">
                  {creative.templateName && (
                    <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/15">
                      {creative.templateName}
                    </span>
                  )}
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-pink-500/10 text-pink-400 border border-pink-500/15">
                    {creative.platform}
                  </span>
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/15">
                    {creative.emotion}
                  </span>
                </div>
              </div>
            </div>

            {/* Scenario - single line */}
            {creative.scenario && (
              <div className="text-[11px] text-muted-foreground/50 mb-3 pl-10">
                {creative.scenario}
              </div>
            )}

            {/* Hook + Body panels side by side */}
            <div className="grid grid-cols-2 gap-3">
              {/* HOOK panel */}
              {(() => {
                const modeMeta = DELIVERY_MODE_META[hookMode];
                const modeColor = MODE_COLORS[hookMode] || MODE_COLORS["voiceover"];
                const t = duration.hookTiming;
                return (
                  <div className="relative rounded-2xl border border-rose-500/15 bg-white/[0.03] backdrop-blur-md overflow-hidden transition-all hover:bg-white/[0.05]">
                    <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-rose-500/40 to-pink-500/40" />
                    <div className="p-4 flex flex-col h-full">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-black tracking-widest uppercase text-rose-300">Hook</span>
                        <div className="flex items-center gap-1.5">
                          <span className={`px-1 py-0.5 rounded text-[8px] font-bold border ${modeColor}`}>{modeMeta.label}</span>
                          <span className="text-[9px] font-mono text-muted-foreground/30">{t.recommendedSec}s</span>
                        </div>
                      </div>
                      <div className="text-sm text-foreground/90 leading-relaxed font-medium mt-2 flex-1">
                        {creative.hook.text}
                      </div>
                      <div className="text-[10px] text-muted-foreground/40 leading-relaxed mt-3 pt-2 border-t border-white/[0.04]">
                        {creative.hook.visual}
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* BODY panel with CTA bar overlay */}
              {(() => {
                const modeMeta = DELIVERY_MODE_META[bodyMode];
                const modeColor = MODE_COLORS[bodyMode] || MODE_COLORS["voiceover"];
                const ctaModeMeta = DELIVERY_MODE_META[ctaMode];
                const t = duration.bodyTiming;
                return (
                  <div className="relative rounded-2xl border border-amber-500/15 bg-white/[0.03] backdrop-blur-md overflow-hidden transition-all hover:bg-white/[0.05]">
                    <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-amber-500/40 to-orange-500/40" />
                    <div className="p-4 flex flex-col h-full">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-black tracking-widest uppercase text-amber-300">Body</span>
                        <div className="flex items-center gap-1.5">
                          <span className={`px-1 py-0.5 rounded text-[8px] font-bold border ${modeColor}`}>{modeMeta.label}</span>
                          <span className="text-[9px] font-mono text-muted-foreground/30">{t.recommendedSec}s</span>
                        </div>
                      </div>
                      <div className="text-sm text-foreground/90 leading-relaxed font-medium mt-2 flex-1">
                        {creative.body.text}
                      </div>
                      <div className="text-[10px] text-muted-foreground/40 leading-relaxed mt-3 pt-2 border-t border-white/[0.04]">
                        {creative.body.visual}
                      </div>

                      {/* Upload experience */}
                      <button
                        type="button"
                        className="mt-3 w-full flex items-center justify-center gap-1.5 py-1.5 rounded-lg border border-dashed border-amber-500/15 bg-amber-500/5 text-amber-400/50 hover:bg-amber-500/10 hover:text-amber-400 transition-all cursor-pointer"
                      >
                        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                          <path d="M12 5v14M5 12h14" />
                        </svg>
                        <span className="text-[9px] font-bold tracking-wider uppercase">Upload Experience</span>
                      </button>

                      {/* CTA overlay bar - like a Premiere Pro text layer */}
                      <div className="mt-3 flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/8 border border-emerald-500/15 relative">
                        {/* Left accent strip */}
                        <div className="absolute left-0 top-0 bottom-0 w-[3px] rounded-l-lg bg-emerald-500/50" />
                        <span className="text-[8px] font-black tracking-[2px] uppercase text-emerald-400/50 shrink-0 pl-1">CTA</span>
                        <span className="text-[11px] text-emerald-300/80 font-semibold flex-1 truncate">{creative.cta.text}</span>
                        <span className="text-[8px] font-mono text-muted-foreground/25 shrink-0">{duration.ctaTiming.recommendedSec}s</span>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
