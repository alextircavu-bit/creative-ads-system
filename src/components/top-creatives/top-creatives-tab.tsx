"use client";

import { useState, useCallback } from "react";
import type { TopCreativesData, AdCreativeBlueprint, HookVariation, BodyVariation } from "@/types/creative";
import { calculateSectionTiming } from "@/lib/readability";

interface TopCreativesTabProps {
  data: TopCreativesData;
  productName: string;
}

// Normalize legacy/new formats
function getHooks(c: AdCreativeBlueprint): HookVariation[] {
  if (c.hooks?.length) return c.hooks;
  if (c.hook) return [{ text: c.hook.text, angle: c.emotion }];
  return [{ text: "Hook text", angle: "default" }];
}

function getBodies(c: AdCreativeBlueprint): BodyVariation[] {
  if (c.bodies?.length) return c.bodies;
  if (c.body) return [{ text: c.body.text, visual: c.body.visual }];
  return [{ text: "Body text", visual: "Product experience" }];
}

// --- 9:16 Phone Mockup Card ---

function PhoneMockup({
  section,
  items,
  ctaText,
  renderOverlay,
  accentFrom,
  accentTo,
}: {
  section: "hook" | "body";
  items: { text: string; sub?: string }[];
  ctaText?: string;
  renderOverlay: (item: { text: string; sub?: string }, index: number) => React.ReactNode;
  accentFrom: string;
  accentTo: string;
}) {
  const [current, setCurrent] = useState(0);
  const prev = useCallback(() => setCurrent((c) => (c - 1 + items.length) % items.length), [items.length]);
  const next = useCallback(() => setCurrent((c) => (c + 1) % items.length), [items.length]);

  return (
    <div className="flex flex-col items-center">
      {/* Phone frame - 9:16 aspect ratio */}
      <div
        className="relative w-full rounded-[20px] overflow-hidden border border-white/[0.08]"
        style={{ aspectRatio: "9/16" }}
      >
        {/* Background - dark gradient simulating video content */}
        <div className={`absolute inset-0 bg-gradient-to-br ${accentFrom} ${accentTo}`} />

        {/* Frosted glass card - iOS 26 style, centered */}
        <div className="absolute inset-0 flex flex-col justify-between p-3">
          {/* Top: section label + variation count */}
          <div className="flex items-center justify-between">
            <span className="text-[9px] font-bold tracking-[2px] uppercase text-white/30">
              {section}
            </span>
            {items.length > 1 && (
              <span className="text-[9px] text-white/20 font-mono">
                {current + 1}/{items.length}
              </span>
            )}
          </div>

          {/* Center: text overlay mockup */}
          <div className="flex-1 flex items-center justify-center px-2">
            {renderOverlay(items[current], current)}
          </div>

          {/* Bottom: CTA button mockup (if body) or angle tag (if hook) */}
          <div className="flex flex-col gap-2">
            {section === "body" && ctaText && (
              <div className="mx-auto px-5 py-2 rounded-full bg-white/90 backdrop-blur-sm">
                <span className="text-[11px] font-bold text-black tracking-wide">{ctaText}</span>
              </div>
            )}

            {/* Swipe nav */}
            {items.length > 1 && (
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={prev}
                  className="w-7 h-7 rounded-full bg-white/[0.08] backdrop-blur-sm flex items-center justify-center text-white/40 hover:text-white/70 hover:bg-white/[0.15] transition-all"
                >
                  <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}><path d="M15 18l-6-6 6-6" /></svg>
                </button>
                <div className="flex items-center gap-1.5">
                  {items.map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setCurrent(i)}
                      className={`h-1 rounded-full transition-all ${i === current ? "bg-white/60 w-4" : "bg-white/15 w-1.5"}`}
                    />
                  ))}
                </div>
                <button
                  type="button"
                  onClick={next}
                  className="w-7 h-7 rounded-full bg-white/[0.08] backdrop-blur-sm flex items-center justify-center text-white/40 hover:text-white/70 hover:bg-white/[0.15] transition-all"
                >
                  <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}><path d="M9 18l6-6-6-6" /></svg>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Upload overlay for body */}
        {section === "body" && (
          <button
            type="button"
            className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white/[0.1] backdrop-blur-sm flex items-center justify-center text-white/30 hover:text-white/60 hover:bg-white/[0.2] transition-all"
            title="Upload product experience"
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 5v14M5 12h14" />
            </svg>
          </button>
        )}
      </div>

      {/* Below phone: timing info */}
      {items.length > 0 && (() => {
        const timing = calculateSectionTiming(items[current].text, "text-overlay", section);
        return (
          <div className="flex items-center gap-2 mt-2 text-[9px] text-muted-foreground/30">
            <span className="font-mono">{timing.wordCount}w</span>
            <span className="text-muted-foreground/15">|</span>
            <span className="font-mono">{timing.recommendedSec}s</span>
            {items[current].sub && (
              <>
                <span className="text-muted-foreground/15">|</span>
                <span className="truncate max-w-[120px]">{items[current].sub}</span>
              </>
            )}
          </div>
        );
      })()}
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
            Swipe through variations for <strong className="text-foreground">{productName}</strong>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-12">
        {data.creatives.map((creative) => {
          const hooks = getHooks(creative);
          const bodies = getBodies(creative);

          const hookItems = hooks.map((h) => ({ text: h.text, sub: h.angle }));
          const bodyItems = bodies.map((b) => ({ text: b.text, sub: b.visual }));

          return (
            <div key={creative.rank}>
              {/* Creative header */}
              <div className="flex items-start gap-3 mb-4">
                <div className="w-7 h-7 rounded-lg bg-violet-500/15 border border-violet-500/20 flex items-center justify-center text-xs font-black text-violet-300 shrink-0">
                  {creative.rank}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-extrabold truncate mb-1">&quot;{creative.name}&quot;</div>
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
                  {creative.scenario && (
                    <div className="text-[11px] text-muted-foreground/35 mt-1.5">{creative.scenario}</div>
                  )}
                </div>
              </div>

              {/* Phone mockups side by side */}
              <div className="grid grid-cols-2 gap-4 max-w-xl">
                {/* Hook phone */}
                <PhoneMockup
                  section="hook"
                  items={hookItems}
                  accentFrom="from-black"
                  accentTo="to-neutral-900"
                  renderOverlay={(item) => (
                    <div className="text-center px-3">
                      {/* Glassmorphism text card */}
                      <div className="bg-white/[0.08] backdrop-blur-xl rounded-2xl border border-white/[0.12] px-4 py-5 shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
                        <p className="text-white font-black text-lg leading-tight tracking-tight">
                          {item.text}
                        </p>
                      </div>
                    </div>
                  )}
                />

                {/* Body phone */}
                <PhoneMockup
                  section="body"
                  items={bodyItems}
                  ctaText={creative.cta.text}
                  accentFrom="from-neutral-900"
                  accentTo="to-black"
                  renderOverlay={(item) => (
                    <div className="text-center px-2 flex flex-col gap-3">
                      {/* Body text overlay - lighter glass */}
                      <div className="bg-white/[0.06] backdrop-blur-xl rounded-2xl border border-white/[0.10] px-4 py-4 shadow-[0_8px_32px_rgba(0,0,0,0.25)]">
                        <p className="text-white/90 font-semibold text-sm leading-relaxed">
                          {item.text}
                        </p>
                      </div>
                      {/* Visual direction hint */}
                      {item.sub && (
                        <p className="text-white/20 text-[10px] leading-relaxed px-2">
                          {item.sub}
                        </p>
                      )}
                    </div>
                  )}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
