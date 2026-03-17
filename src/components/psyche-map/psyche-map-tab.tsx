"use client";

import type { PsycheMapData } from "@/types/creative";

interface PsycheMapTabProps {
  data: PsycheMapData;
  productName: string;
}

export function PsycheMapTab({ data, productName }: PsycheMapTabProps) {
  const activeRegions = data.brainRegions.filter((r) => r.active);
  const p = data.cognitiveProfile;

  return (
    <div className="space-y-6">
      {/* Brain Regions */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <svg className="w-4 h-4 text-muted-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2a7 7 0 0 1 7 7c0 2.38-1.19 4.47-3 5.74V17a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2v-2.26C6.19 13.47 5 11.38 5 9a7 7 0 0 1 7-7z" />
            <path d="M9 22h6M10 2v1M14 2v1" />
          </svg>
          <div>
            <h2 className="text-sm font-semibold text-foreground">Active Brain Regions</h2>
            <p className="text-xs text-muted-foreground">Regions that fire when users encounter {productName}</p>
          </div>
        </div>
        <div className="border border-border/50 rounded-md divide-y divide-border/30">
          {activeRegions.map((r) => (
            <div key={r.id} className="px-4 py-3.5 flex items-start gap-3">
              <div className="w-2 h-2 rounded-full shrink-0 mt-1.5" style={{ background: r.color }} />
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium mb-0.5" style={{ color: r.color }}>{r.name}</div>
                <div className="text-[10px] text-muted-foreground/50 font-medium uppercase tracking-wider mb-1">{r.role}</div>
                <div className="text-xs text-muted-foreground leading-relaxed">{r.description}</div>
                <div className="mt-2 px-3 py-2 bg-muted/30 rounded-md text-xs text-muted-foreground leading-relaxed border-l-2" style={{ borderColor: r.color }}>
                  <strong className="text-foreground/80">Ad strategy:</strong> {r.adTip}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Cognitive Profile */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <div className="w-2.5 h-2.5 rounded-full" style={{ background: p.color }} />
          <div>
            <h2 className="text-sm font-semibold text-foreground">Cognitive Profile: {p.name}</h2>
            <p className="text-xs text-muted-foreground">Behavioral psychology behind what {productName} does to the brain</p>
          </div>
        </div>
        <div className="border border-border/50 rounded-md p-5">
          <div className="text-base font-semibold mb-1.5" style={{ color: p.color }}>{p.name}</div>
          <div className="text-sm text-muted-foreground leading-relaxed mb-4">{p.description}</div>
          <div className="grid grid-cols-3 gap-2">
            <div className="border border-border/40 rounded-md p-3 text-center">
              <div className="text-sm font-semibold mb-0.5" style={{ color: p.color }}>{p.mechanism.split("(")[0].trim()}</div>
              <div className="text-[10px] text-muted-foreground/50 font-medium">Core Mechanism</div>
            </div>
            <div className="border border-border/40 rounded-md p-3 text-center">
              <div className="text-sm font-semibold mb-0.5 text-green-400">{p.difficulty}</div>
              <div className="text-[10px] text-muted-foreground/50 font-medium">Adoption Friction</div>
            </div>
            <div className="border border-border/40 rounded-md p-3 text-center">
              <div className="text-sm font-semibold mb-0.5 text-amber-400">{p.retentionRisk}</div>
              <div className="text-[10px] text-muted-foreground/50 font-medium">Retention Risk</div>
            </div>
          </div>
        </div>
      </section>

      {/* Dopamine Architecture */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <svg className="w-4 h-4 text-muted-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
          </svg>
          <div>
            <h2 className="text-sm font-semibold text-foreground">Dopamine Architecture</h2>
            <p className="text-xs text-muted-foreground">How {productName} creates and sustains dopamine release</p>
          </div>
        </div>
        <div className="border border-border/50 rounded-md divide-y divide-border/30">
          {[
            { title: `Trigger Type: ${data.dopamine.trigger}`, desc: `What initiates the dopamine response when users first encounter ${productName}.`, label: "Power", pct: data.dopamine.triggerPct, color: "#22c55e" },
            { title: `Reward Schedule: ${data.dopamine.schedule}`, desc: "Variable ratio schedules create the strongest dopamine loops. Fixed schedules are predictable and less addictive.", label: "Addictiveness", pct: data.dopamine.schedulePct, color: "#f59e0b" },
            { title: "Anticipation Loop", desc: `${data.dopamine.anticipation} — Dopamine is released during anticipation, not reward delivery.`, label: null, pct: null, color: null },
            { title: `Retention Hook: ${data.dopamine.retention}`, desc: `What keeps users coming back after the initial dopamine spike fades.`, label: "Stickiness", pct: data.dopamine.retentionPct, color: "#8b5cf6" },
          ].map((item, i) => (
            <div key={i} className="px-4 py-3.5">
              <div className="text-sm font-medium mb-1">{item.title}</div>
              <div className="text-xs text-muted-foreground leading-relaxed">{item.desc}</div>
              {item.pct != null && (
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-[10px] text-muted-foreground/50 w-[70px]">{item.label}</span>
                  <div className="flex-1 h-1.5 bg-border/30 rounded-full overflow-hidden max-w-[120px]">
                    <div className="h-full rounded-full" style={{ width: `${item.pct}%`, background: item.color! }} />
                  </div>
                  <span className="text-[10px] font-semibold text-muted-foreground/60">{item.pct}%</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Pain / Pleasure Matrix */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <svg className="w-4 h-4 text-muted-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
            <path d="M14.5 17.5L3 6V3h3l11.5 11.5M13 7l4-4 4 4-4 4M3 11l4-4" />
          </svg>
          <h2 className="text-sm font-semibold text-foreground">Pain / Pleasure Matrix</h2>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="border border-border/50 rounded-md p-4 border-l-2 border-l-rose-500">
            <div className="text-[10px] uppercase tracking-wider font-semibold mb-3 text-rose-400">Pain They Escape</div>
            <div className="space-y-1.5">
              {data.painPleasure.pains.map((pain, i) => (
                <div key={i} className="text-xs text-muted-foreground leading-relaxed flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500/60 shrink-0 mt-[5px]" />
                  {pain}
                </div>
              ))}
            </div>
          </div>
          <div className="border border-border/50 rounded-md p-4 border-l-2 border-l-green-500">
            <div className="text-[10px] uppercase tracking-wider font-semibold mb-3 text-green-400">Pleasure They Gain</div>
            <div className="space-y-1.5">
              {data.painPleasure.pleasures.map((pleasure, i) => (
                <div key={i} className="text-xs text-muted-foreground leading-relaxed flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500/60 shrink-0 mt-[5px]" />
                  {pleasure}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Habit Loop */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <svg className="w-4 h-4 text-muted-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
            <path d="M17 1l4 4-4 4" /><path d="M3 11V9a4 4 0 0 1 4-4h14" />
            <path d="M7 23l-4-4 4-4" /><path d="M21 13v2a4 4 0 0 1-4 4H3" />
          </svg>
          <h2 className="text-sm font-semibold text-foreground">The Habit Loop</h2>
        </div>
        <div className="flex items-center gap-0 flex-wrap">
          {[
            { label: "Cue", value: data.habitLoop.cue, color: "#f43f5e" },
            { label: "Routine", value: data.habitLoop.routine, color: "#f59e0b" },
            { label: "Reward", value: data.habitLoop.reward, color: "#22c55e" },
          ].map((step, i) => (
            <div key={step.label} className="contents">
              <div className="border border-border/50 rounded-md px-4 py-3.5 flex-1 min-w-[140px]" style={{ borderTopColor: step.color, borderTopWidth: 2 }}>
                <div className="text-[10px] uppercase tracking-wider font-semibold mb-1.5" style={{ color: step.color }}>{step.label}</div>
                <div className="text-sm text-muted-foreground leading-relaxed">{step.value}</div>
              </div>
              {i < 2 && (
                <div className="px-2 shrink-0">
                  <svg className="w-4 h-4 text-border/50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Neural Persuasion Stack */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <svg className="w-4 h-4 text-muted-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 7V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v3" />
          </svg>
          <div>
            <h2 className="text-sm font-semibold text-foreground">Neural Persuasion Stack</h2>
            <p className="text-xs text-muted-foreground">5-layer sequence to convert a scroll into a download</p>
          </div>
        </div>
        <div className="border border-border/50 rounded-md overflow-hidden">
          {data.persuasionStack.map((layer) => (
            <div key={layer.num} className="flex items-stretch border-b border-border/30 last:border-b-0">
              <div className="w-8 flex items-center justify-center text-[10px] font-semibold text-white shrink-0" style={{ background: layer.color }}>{layer.num}</div>
              <div className="flex-1 px-4 py-3">
                <div className="text-xs font-medium mb-0.5">{layer.name} <span className="text-[10px] text-muted-foreground/40">{layer.timeRange}</span></div>
                <div className="text-xs text-muted-foreground leading-relaxed">{layer.description}</div>
                <div className="mt-2 flex gap-1 flex-wrap">
                  {layer.techniques.map((t) => <span key={t} className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-muted/50 text-muted-foreground/70 border border-border/30">{t}</span>)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Cognitive Biases */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <svg className="w-4 h-4 text-muted-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" /><path d="M12 16v-4M12 8h.01" />
          </svg>
          <div>
            <h2 className="text-sm font-semibold text-foreground">Cognitive Biases at Play</h2>
            <p className="text-xs text-muted-foreground">{data.biases.length} biases active for this product</p>
          </div>
        </div>
        {data.audiencePosition && (
          <div className="border border-border/50 rounded-md p-4 mb-3 border-l-2 border-l-violet-500">
            <div className="text-sm font-medium mb-1 text-violet-400">Audience Position: {data.audiencePosition.axis}</div>
            <div className="text-xs text-muted-foreground leading-relaxed">{data.audiencePosition.insight}</div>
          </div>
        )}
        <div className="space-y-2">
          {data.biases.map((bias) => (
            <div key={bias.name} className="border border-border/50 rounded-md p-4">
              <div className="text-sm font-medium mb-1 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full" style={{ background: bias.color }} />
                {bias.name}
              </div>
              <div className="text-xs text-muted-foreground leading-relaxed">{bias.description}</div>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-[10px] text-muted-foreground/50 w-[50px]">Impact</span>
                <div className="flex-1 h-1.5 bg-border/30 rounded-full overflow-hidden max-w-[120px]">
                  <div className="h-full rounded-full" style={{ width: `${bias.strength}%`, background: bias.color }} />
                </div>
                <span className="text-[10px] font-semibold text-muted-foreground/60">{bias.strength}%</span>
              </div>
              <div className="mt-2 px-3 py-2 bg-muted/30 rounded-md text-xs text-muted-foreground leading-relaxed border-l-2 border-violet-500">
                <strong className="text-foreground/80">Example:</strong> {bias.example}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
