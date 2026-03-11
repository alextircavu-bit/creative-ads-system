"use client";

import { useMemo, useState, useCallback } from "react";
import type { TopCreativesData, AdCreativeBlueprint, HookVariation, BodyVariation } from "@/types/creative";
import {
  calculateSectionTiming,
  DELIVERY_MODE_META,
} from "@/lib/readability";

interface TopCreativesTabProps {
  data: TopCreativesData;
  productName: string;
}

// Normalize: support both new (hooks[]) and legacy (hook{}) formats
function getHooks(creative: AdCreativeBlueprint): HookVariation[] {
  if (creative.hooks?.length) return creative.hooks;
  if (creative.hook) return [{ text: creative.hook.text, angle: creative.emotion }];
  return [{ text: "Hook text", angle: "default" }];
}

function getBodies(creative: AdCreativeBlueprint): BodyVariation[] {
  if (creative.bodies?.length) return creative.bodies;
  if (creative.body) return [{ text: creative.body.text, visual: creative.body.visual }];
  return [{ text: "Body text", visual: "Product experience" }];
}

function SwipeCards<T>({
  items,
  renderItem,
  label,
}: {
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  label: string;
}) {
  const [current, setCurrent] = useState(0);

  const prev = useCallback(() => setCurrent((c) => (c - 1 + items.length) % items.length), [items.length]);
  const next = useCallback(() => setCurrent((c) => (c + 1) % items.length), [items.length]);

  if (items.length === 0) return null;

  return (
    <div className="relative">
      {/* Card */}
      {renderItem(items[current], current)}

      {/* Navigation - only show if multiple items */}
      {items.length > 1 && (
        <div className="flex items-center justify-between mt-2">
          <button
            type="button"
            onClick={prev}
            className="w-6 h-6 rounded-md bg-white/[0.05] border border-white/[0.08] flex items-center justify-center text-muted-foreground/40 hover:text-foreground/70 hover:bg-white/[0.1] transition-all"
          >
            <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}><path d="M15 18l-6-6 6-6" /></svg>
          </button>
          <div className="flex items-center gap-1">
            {items.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setCurrent(i)}
                className={`w-1.5 h-1.5 rounded-full transition-all ${i === current ? "bg-foreground/50 w-3" : "bg-white/[0.12]"}`}
              />
            ))}
          </div>
          <button
            type="button"
            onClick={next}
            className="w-6 h-6 rounded-md bg-white/[0.05] border border-white/[0.08] flex items-center justify-center text-muted-foreground/40 hover:text-foreground/70 hover:bg-white/[0.1] transition-all"
          >
            <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}><path d="M9 18l6-6-6-6" /></svg>
          </button>
        </div>
      )}
    </div>
  );
}

export function TopCreativesTab({ data, productName }: TopCreativesTabProps) {
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
            Swipe through hook and body variations for <strong className="text-foreground">{productName}</strong>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-10">
        {data.creatives.map((creative) => {
          const hooks = getHooks(creative);
          const bodies = getBodies(creative);

          return (
            <div key={creative.rank} className="relative">
              {/* Creative header */}
              <div className="flex items-start gap-3 mb-3">
                <div className="w-7 h-7 rounded-lg bg-violet-500/15 border border-violet-500/20 flex items-center justify-center text-xs font-black text-violet-300 shrink-0">
                  {creative.rank}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-extrabold truncate">&quot;{creative.name}&quot;</span>
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

              {/* Scenario */}
              {creative.scenario && (
                <div className="text-[11px] text-muted-foreground/40 mb-3 pl-10">{creative.scenario}</div>
              )}

              {/* Hook + Body panels */}
              <div className="grid grid-cols-2 gap-3">
                {/* HOOKS - swipeable */}
                <div className="relative rounded-2xl border border-rose-500/15 bg-white/[0.03] backdrop-blur-md overflow-hidden">
                  <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-rose-500/40 to-pink-500/40" />
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-black tracking-widest uppercase text-rose-300">Hook</span>
                      <span className="text-[9px] text-muted-foreground/30">{hooks.length} variations</span>
                    </div>

                    <SwipeCards
                      items={hooks}
                      label="hook"
                      renderItem={(hook, idx) => {
                        const timing = calculateSectionTiming(hook.text, "text-overlay", "hook");
                        return (
                          <div className="min-h-[80px] flex flex-col">
                            {/* Hook text */}
                            <div className="text-base font-bold text-foreground/90 leading-snug flex-1">
                              {hook.text}
                            </div>
                            {/* Angle tag + timing */}
                            <div className="flex items-center justify-between mt-3">
                              <span className="text-[9px] text-rose-400/40 font-medium truncate max-w-[70%]">
                                {hook.angle}
                              </span>
                              <span className="text-[9px] font-mono text-muted-foreground/25">
                                {timing.wordCount}w / {timing.recommendedSec}s
                              </span>
                            </div>
                          </div>
                        );
                      }}
                    />
                  </div>
                </div>

                {/* BODY - swipeable + CTA bar */}
                <div className="relative rounded-2xl border border-amber-500/15 bg-white/[0.03] backdrop-blur-md overflow-hidden">
                  <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-amber-500/40 to-orange-500/40" />
                  <div className="p-4 flex flex-col">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-black tracking-widest uppercase text-amber-300">Body</span>
                      <span className="text-[9px] text-muted-foreground/30">{bodies.length} variations</span>
                    </div>

                    <SwipeCards
                      items={bodies}
                      label="body"
                      renderItem={(body, idx) => {
                        const timing = calculateSectionTiming(body.text, "text-overlay", "body");
                        return (
                          <div className="min-h-[80px] flex flex-col">
                            {/* Body text */}
                            <div className="text-sm text-foreground/90 leading-relaxed font-medium flex-1">
                              {body.text}
                            </div>
                            {/* Visual + timing */}
                            <div className="text-[10px] text-muted-foreground/30 mt-2 leading-relaxed">
                              {body.visual}
                            </div>
                            <div className="flex items-center justify-end mt-1">
                              <span className="text-[9px] font-mono text-muted-foreground/25">
                                {timing.wordCount}w / {timing.recommendedSec}s
                              </span>
                            </div>
                          </div>
                        );
                      }}
                    />

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

                    {/* CTA bar - Premiere Pro style */}
                    <div className="mt-3 flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/8 border border-emerald-500/15 relative">
                      <div className="absolute left-0 top-0 bottom-0 w-[3px] rounded-l-lg bg-emerald-500/50" />
                      <span className="text-[8px] font-black tracking-[2px] uppercase text-emerald-400/50 shrink-0 pl-1">CTA</span>
                      <span className="text-[11px] text-emerald-300/80 font-semibold flex-1 truncate">{creative.cta.text}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
