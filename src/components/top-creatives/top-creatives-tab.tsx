"use client";

import { useState, useCallback } from "react";
import type { TopCreativesData, AdCreativeBlueprint, HookVariation, BodyVariation, VisualSuggestion } from "@/types/creative";
import { calculateSectionTiming } from "@/lib/readability";

function Sora2CopyButton({ v, hook }: { v: VisualSuggestion; hook: HookVariation }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const hasSora2Speech = hook.audioSource === "sora2" && !!hook.voiceoverScript;
    const json = {
      description: v.prompt || v.idea,
      voiceline_script: hasSora2Speech ? hook.voiceoverScript : null,
      duration_seconds: parseInt(v.clipDuration) || 8,
      style_tags: v.styleTags || [],
    };
    navigator.clipboard.writeText(JSON.stringify(json, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <button
      onClick={handleCopy}
      className={`shrink-0 px-1.5 py-0.5 rounded text-[7px] font-medium border transition-colors cursor-pointer ${
        copied
          ? "text-emerald-400/70 bg-emerald-500/10 border-emerald-500/20"
          : "text-white/30 bg-white/[0.04] border-white/[0.06] hover:bg-white/[0.08] hover:text-white/50"
      }`}
      title="Copy Sora2 prompt filter input"
    >
      {copied ? "Copied" : "Sora2"}
    </button>
  );
}

// Sora2 brief is now generated server-side via /api/sora2-brief (Sonnet call)

interface TopCreativesTabProps {
  data: TopCreativesData;
  productName: string;
  onGenerateMore?: () => void;
  isGeneratingMore?: boolean;
}

function getHooks(c: AdCreativeBlueprint): HookVariation[] {
  if (c.hooks?.length) return c.hooks.map(h => ({ ...h, duration: h.duration || calcDuration(h.voiceoverScript, "3s") }));
  if (c.hook) return [{ text: c.hook.text, duration: c.hook.time || "3s", angle: c.emotion, visualStyle: { type: "dynamic", name: "Legacy", description: "" }, visualSuggestions: [] }];
  return [{ text: "Hook text", duration: "3s", angle: "default", visualStyle: { type: "dynamic", name: "Default", description: "" }, visualSuggestions: [] }];
}

// Hemingway pace: ~2.2 words/sec (accounts for ElevenLabs pauses, breaths, emphasis)
function calcDuration(text?: string, fallback = "5s"): string {
  if (!text) return fallback;
  const words = text.split(/\s+/).length;
  return `${Math.round(words / 2.2)}s`;
}

function getBodies(c: AdCreativeBlueprint): BodyVariation[] {
  const bodies = c.bodies?.length ? c.bodies : c.body ? [{ text: c.body.text, visual: c.body.visual }] : [{ text: "Screen recording of product feature", visual: "Product demo" }];
  // Auto-calculate duration from voiceover script if missing
  return bodies.map(b => ({ ...b, duration: b.duration || calcDuration(b.voiceoverScript, "5s") }));
}

// Normalize visualSuggestions — handles old string[], old {idea,prompt}, and new full format
function normalizeVisuals(vs: HookVariation["visualSuggestions"]): VisualSuggestion[] {
  if (!vs || vs.length === 0) return [];
  // Old format: string[]
  if (typeof vs[0] === "string") {
    return (vs as unknown as string[]).map((s) => ({ idea: s, prompt: "", clipDuration: "8s" as const, styleTags: [] }));
  }
  // Ensure clipDuration and styleTags exist (old format without them)
  return (vs as VisualSuggestion[]).map((v) => ({ ...v, clipDuration: v.clipDuration || "8s", styleTags: v.styleTags || [] }));
}

const DELIVERY_MODE_LABELS: Record<string, string> = {
  "text-overlay": "Text Overlay",
  "voiceover-caption": "VO + Caption",
};

type HookItem = { text: string; sub?: string; visuals: VisualSuggestion[]; voiceoverScript?: string; duration?: string; audioSource?: string };

const VISUAL_STYLE_COLORS: Record<string, string> = {
  "authority-staging": "bg-amber-500/10 text-amber-400 border-amber-500/20",
  "scenic-interrupt": "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  "category-anchor": "bg-blue-500/10 text-blue-400 border-blue-500/20",
  "routine-window": "bg-violet-500/10 text-violet-400 border-violet-500/20",
  "social-curiosity": "bg-pink-500/10 text-pink-400 border-pink-500/20",
  "narrative-animation": "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
  "ugc-reaction": "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
  "dramatic-reenactment": "bg-rose-500/10 text-rose-400 border-rose-500/20",
  "product-in-context": "bg-teal-500/10 text-teal-400 border-teal-500/20",
  "dynamic": "bg-muted/60 text-muted-foreground border-border/40",
};

function PhoneMockup({
  section,
  items,
  ctaText,
  renderOverlay,
  accentFrom,
  accentTo,
}: {
  section: "hook" | "body";
  items: HookItem[];
  ctaText?: string;
  renderOverlay: (item: HookItem, index: number) => React.ReactNode;
  accentFrom: string;
  accentTo: string;
}) {
  const [current, setCurrent] = useState(0);
  // Reset to 0 if items shrink below current index
  const safeIndex = items.length > 0 ? Math.min(current, items.length - 1) : 0;
  const prev = useCallback(() => setCurrent((c) => (c - 1 + items.length) % items.length), [items.length]);
  const next = useCallback(() => setCurrent((c) => (c + 1) % items.length), [items.length]);

  return (
    <div className="flex flex-col items-center">
      <div
        className="relative w-full rounded-[20px] overflow-hidden border border-white/[0.08]"
        style={{ aspectRatio: "9/16" }}
      >
        <div className={`absolute inset-0 bg-gradient-to-br ${accentFrom} ${accentTo}`} />

        <div className="absolute inset-0 flex flex-col justify-between p-3">
          <div className="flex items-center justify-between">
            <span className="text-[9px] font-bold tracking-[2px] uppercase text-white/30">
              {section}
            </span>
            {items.length > 1 && (
              <span className="text-[9px] text-white/20 font-mono">
                {safeIndex + 1}/{items.length}
              </span>
            )}
          </div>

          <div className="flex-1 flex items-center justify-center px-2">
            {items[safeIndex] && renderOverlay(items[safeIndex], safeIndex)}
          </div>

          <div className="flex flex-col gap-2">
            {section === "body" && ctaText && (
              <div className="mx-auto px-5 py-2 rounded-full bg-white/90 backdrop-blur-sm">
                <span className="text-[11px] font-bold text-black tracking-wide">{ctaText}</span>
              </div>
            )}

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
                      className={`h-1 rounded-full transition-all ${i === safeIndex ? "bg-white/60 w-4" : "bg-white/15 w-1.5"}`}
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

      {items.length > 0 && (() => {
        const timing = calculateSectionTiming(items[safeIndex]?.text || "", "text-overlay", section);
        return (
          <div className="flex items-center gap-2 mt-2 text-[9px] text-muted-foreground/30">
            <span className="font-mono">{timing.wordCount}w</span>
            <span className="text-muted-foreground/15">|</span>
            <span className="font-mono">{timing.recommendedSec}s</span>
            {items[safeIndex]?.sub && (
              <>
                <span className="text-muted-foreground/15">|</span>
                <span className="truncate max-w-[120px]">{items[safeIndex]?.sub}</span>
              </>
            )}
          </div>
        );
      })()}
    </div>
  );
}


export function TopCreativesTab({ data, productName, onGenerateMore, isGeneratingMore }: TopCreativesTabProps) {
  const [deliveryFilter, setDeliveryFilter] = useState<string | null>(null);

  const filteredCreatives = deliveryFilter
    ? data.creatives.filter((c) => c.deliveryMode === deliveryFilter)
    : data.creatives;

  // Count creatives per delivery mode
  const modeCounts = data.creatives.reduce<Record<string, number>>((acc, c) => {
    const mode = c.deliveryMode || "text-overlay";
    acc[mode] = (acc[mode] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="mb-10">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-base font-semibold tracking-tight text-foreground">
          Top {data.creatives.length} Ad Creative{data.creatives.length !== 1 ? "s" : ""}
        </h2>
        <p className="text-xs text-muted-foreground mt-1">
          Swipe through variations for <span className="text-foreground font-medium">{productName}</span>
        </p>
      </div>

      {/* Delivery mode filter */}
      <div className="inline-flex items-center rounded-md border border-border/50 bg-muted/30 p-0.5 mb-8">
        <button
          type="button"
          onClick={() => setDeliveryFilter(null)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-[3px] text-[11px] font-medium transition-colors ${
            !deliveryFilter ? "bg-background text-foreground shadow-sm" : "text-muted-foreground/60 hover:text-foreground"
          }`}
        >
          All
          <span className="text-[9px] text-muted-foreground/40 tabular-nums">{data.creatives.length}</span>
        </button>
        {(["text-overlay", "voiceover-caption"] as const).map((mode) => {
          const count = modeCounts[mode] || 0;
          const isActive = deliveryFilter === mode;
          return (
            <button
              key={mode}
              type="button"
              onClick={() => setDeliveryFilter(isActive ? null : mode)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-[3px] text-[11px] font-medium transition-colors ${
                isActive ? "bg-background text-foreground shadow-sm" : "text-muted-foreground/60 hover:text-foreground"
              } ${count === 0 ? "opacity-30" : ""}`}
              disabled={count === 0}
            >
              {mode === "text-overlay" && (
                <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18" />
                  <path d="M7 2v20M17 2v20M2 12h20M2 7h5M2 17h5M17 17h5M17 7h5" />
                </svg>
              )}
              {mode === "voiceover-caption" && (
                <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
              )}
              {DELIVERY_MODE_LABELS[mode]}
              {count > 0 && <span className="text-[9px] text-muted-foreground/40 tabular-nums">{count}</span>}
            </button>
          );
        })}
      </div>

      <div className="flex flex-col gap-10">
        {filteredCreatives.map((creative, idx) => {
          const hooks = getHooks(creative);
          const bodies = getBodies(creative);

          const hookItems = hooks.map((h) => ({
            text: h.text,
            sub: h.angle,
            visuals: normalizeVisuals(h.visualSuggestions),
            voiceoverScript: h.voiceoverScript,
            duration: h.duration,
            audioSource: h.audioSource,
          }));
          const bodyItems = bodies.map((b) => ({
            text: b.text,
            sub: b.visual,
            visuals: [] as VisualSuggestion[],
            voiceoverScript: b.voiceoverScript,
            duration: b.duration,
          }));

          const showBatchSeparator = creative.rank > 5 && (creative.rank - 1) % 5 === 0;
          const deliveryMode = creative.deliveryMode || "text-overlay";

          return (
            <div key={`${creative.rank}-${idx}`}>
              {showBatchSeparator && (
                <div className="flex items-center gap-3 mb-8 -mt-2">
                  <div className="h-px flex-1 bg-border/30" />
                  <span className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground/40">
                    Batch {Math.ceil(creative.rank / 5)}
                  </span>
                  <div className="h-px flex-1 bg-border/30" />
                </div>
              )}
              {/* Creative header */}
              <div className="flex items-center gap-3 mb-3">
                <span className="w-6 h-6 rounded-md bg-muted/50 border border-border/50 flex items-center justify-center text-[11px] font-semibold text-muted-foreground tabular-nums shrink-0">
                  {creative.rank}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-semibold text-foreground truncate">{creative.name}</span>
                    <div className="flex items-center gap-1 flex-wrap">
                      {creative.targetSegment && (
                        <span className="px-1.5 py-px rounded-sm text-[10px] font-medium bg-muted/60 text-muted-foreground border border-border/40">
                          {creative.targetSegment}
                        </span>
                      )}
                      <span className="px-1.5 py-px rounded-sm text-[10px] font-medium bg-muted/60 text-muted-foreground border border-border/40">
                        {creative.platform}
                      </span>
                      <span className="px-1.5 py-px rounded-sm text-[10px] font-medium bg-muted/60 text-muted-foreground border border-border/40">
                        {creative.emotion}
                      </span>
                      {/* Delivery mode tag */}
                      <span className={`px-1.5 py-px rounded-sm text-[10px] font-medium border ${
                        deliveryMode === "voiceover-caption" ? "bg-violet-500/10 text-violet-400 border-violet-500/20" :
                        "bg-muted/60 text-muted-foreground border-border/40"
                      }`}>
                        {DELIVERY_MODE_LABELS[deliveryMode] || deliveryMode}
                      </span>
                      {creative.productionStyle && /ugc|spark|user.generated/i.test(creative.productionStyle) && (
                        <span className="px-1.5 py-px rounded-sm text-[10px] font-medium bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                          UGC
                        </span>
                      )}
                    </div>
                  </div>
                  {creative.scenario && (
                    <p className="text-[11px] text-muted-foreground/40 mt-1 leading-tight">{creative.scenario}</p>
                  )}
                </div>
              </div>

              {/* Phone mockups side by side */}
              <div className="grid grid-cols-2 gap-4 max-w-xl">
                <PhoneMockup
                  section="hook"
                  items={hookItems}
                  accentFrom="from-black"
                  accentTo="to-neutral-900"
                  renderOverlay={(item, index) => {
                    const currentHook = hooks[index] || hooks[0];
                    const vs = currentHook?.visualStyle;
                    const hasVO = !!item.voiceoverScript;

                    return (
                      <div className="text-center px-3 flex flex-col gap-2">
                        <div className="flex justify-center items-center gap-1.5">
                          {vs && vs.name && (
                            <span className={`px-2 py-0.5 rounded-md text-[8px] font-medium border ${VISUAL_STYLE_COLORS[vs.type] || VISUAL_STYLE_COLORS.dynamic}`}>
                              {vs.name}
                            </span>
                          )}
                          {item.duration && (
                            <span className="px-1.5 py-0.5 rounded-md text-[8px] font-medium bg-white/[0.06] text-white/40 border border-white/[0.08]">
                              {item.duration}
                            </span>
                          )}
                        </div>
                        <div className="bg-white/[0.08] backdrop-blur-xl rounded-2xl border border-white/[0.12] px-4 py-5 shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
                          <p className={`text-white leading-tight tracking-tight ${hasVO ? "font-semibold text-sm" : "font-black text-lg"}`}>
                            {item.text}
                          </p>
                        </div>
                        {hasVO && (
                          <div className="bg-white/[0.04] rounded-xl border border-white/[0.06] px-3 py-2.5 text-left">
                            <div className="flex items-center gap-1.5 mb-1.5">
                              <svg className="w-2.5 h-2.5 text-violet-400/60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                                <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
                                <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                              </svg>
                              <span className="text-[8px] font-medium text-violet-400/50 uppercase tracking-wider">
                                {item.audioSource === "sora2" ? "Sora2 Speech" : "ElevenLabs VO"}
                              </span>
                            </div>
                            <p className="text-[10px] text-white/50 leading-relaxed italic">
                              {item.voiceoverScript}
                            </p>
                          </div>
                        )}
                        {item.visuals && item.visuals.length > 0 && (
                          <div className="flex flex-col gap-1.5 px-1">
                            {item.visuals.map((v, vi) => (
                              <div key={vi} className="flex items-start gap-1.5">
                                <span className="px-1 py-px rounded text-[7px] font-mono text-white/25 bg-white/[0.04] shrink-0 mt-px">{v.clipDuration}</span>
                                <span className="text-[9px] text-white/20 text-left leading-tight flex-1">{v.idea}</span>
                                <Sora2CopyButton v={v} hook={currentHook} />
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  }}
                />

                <PhoneMockup
                  section="body"
                  items={bodyItems}
                  ctaText={creative.cta?.text}
                  accentFrom="from-neutral-900"
                  accentTo="to-black"
                  renderOverlay={(item) => (
                    <div className="text-center px-2 flex flex-col gap-3">
                      {item.duration && (
                        <div className="flex justify-center">
                          <span className="px-1.5 py-0.5 rounded-md text-[8px] font-medium bg-white/[0.06] text-white/40 border border-white/[0.08]">
                            {item.duration}
                          </span>
                        </div>
                      )}
                      <div className="bg-white/[0.06] backdrop-blur-xl rounded-2xl border border-white/[0.10] px-4 py-4 shadow-[0_8px_32px_rgba(0,0,0,0.25)]">
                        <p className="text-white/90 font-semibold text-sm leading-relaxed">
                          {item.text}
                        </p>
                      </div>
                      {item.voiceoverScript && (
                        <div className="bg-white/[0.04] rounded-xl border border-white/[0.06] px-3 py-2 text-left">
                          <div className="flex items-center gap-1.5 mb-1">
                            <svg className="w-2.5 h-2.5 text-violet-400/60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                              <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
                              <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                            </svg>
                            <span className="text-[8px] font-medium text-violet-400/50 uppercase tracking-wider">Voiceover</span>
                          </div>
                          <p className="text-[10px] text-white/50 leading-relaxed italic">
                            {item.voiceoverScript}
                          </p>
                        </div>
                      )}
                      {item.sub && !item.voiceoverScript && (
                        <p className="text-white/20 text-[10px] leading-relaxed px-2">
                          {item.sub}
                        </p>
                      )}
                    </div>
                  )}
                />
              </div>

              {/* Total ad duration */}
              {(() => {
                const hookDur = parseInt(hookItems[0]?.duration || "3") || 3;
                const bodyDur = parseInt(bodyItems[0]?.duration || "5") || 5;
                const total = hookDur + bodyDur + 2; // +2s for CTA
                return (
                  <div className="flex items-center justify-center gap-3 mt-1 text-[10px] text-muted-foreground/40">
                    <span>Hook {hookDur}s</span>
                    <span className="text-muted-foreground/20">+</span>
                    <span>Body {bodyDur}s</span>
                    <span className="text-muted-foreground/20">+</span>
                    <span>CTA 2s</span>
                    <span className="text-muted-foreground/20">=</span>
                    <span className="text-muted-foreground/60 font-medium">~{total}s total</span>
                  </div>
                );
              })()}
            </div>
          );
        })}
      </div>

      {/* Generate 5 More button */}
      {onGenerateMore && (
        <div className="flex justify-center mt-10">
          <button
            onClick={onGenerateMore}
            disabled={isGeneratingMore}
            className="group flex items-center gap-2.5 px-5 py-2.5 rounded-lg border border-border/60 bg-background hover:bg-muted/50 hover:border-border transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {isGeneratingMore ? (
              <>
                <svg className="w-4 h-4 text-muted-foreground animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                </svg>
                <span className="text-sm font-medium text-muted-foreground">Generating...</span>
              </>
            ) : (
              <>
                <svg className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 5v14M5 12h14" />
                </svg>
                <span className="text-sm font-medium text-foreground">Generate 5 More</span>
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
