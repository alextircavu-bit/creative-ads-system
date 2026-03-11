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
    <div className="space-y-5">
      {/* Brain Regions */}
      <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-6">
        <div className="text-base font-extrabold mb-1 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-sm shrink-0">🧠</div>
          Active Brain Regions
        </div>
        <div className="text-xs text-muted-foreground mb-5 ml-12 leading-relaxed">Why these specific regions fire when users encounter <strong className="text-foreground">{productName}</strong></div>
        <div className="space-y-2">
          {activeRegions.map((r) => (
            <div key={r.id} className="flex items-start gap-3 bg-background/50 border border-border/30 rounded-xl px-4 py-3.5 hover:border-violet-500/20 transition-all">
              <div className="w-2.5 h-2.5 rounded-full shrink-0 mt-1" style={{ background: r.color, boxShadow: `0 0 10px ${r.color}40` }} />
              <div className="flex-1 min-w-0">
                <div className="text-sm font-bold mb-0.5" style={{ color: r.color }}>{r.name}</div>
                <div className="text-[10px] text-muted-foreground/50 font-semibold uppercase tracking-wider mb-1">{r.role}</div>
                <div className="text-xs text-muted-foreground leading-relaxed">{r.description}</div>
                <div className="mt-2.5 p-3 bg-secondary/30 rounded-lg text-xs text-muted-foreground leading-relaxed border-l-2" style={{ borderColor: r.color }}>
                  <strong className="text-foreground/80">Ad strategy:</strong> {r.adTip}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Cognitive Profile */}
      <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-6">
        <div className="text-base font-extrabold mb-1 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center text-sm shrink-0 border" style={{ background: p.color + "10", borderColor: p.color + "20" }}>{p.emoji}</div>
          Cognitive Profile: {p.name}
        </div>
        <div className="text-xs text-muted-foreground mb-5 ml-12 leading-relaxed">The behavioral psychology behind what {productName} actually does to the brain</div>
        <div className="bg-gradient-to-br from-background/80 to-secondary/30 border border-border/30 rounded-2xl p-5 mb-4">
          <div className="text-lg font-black mb-1.5 tracking-tight" style={{ color: p.color }}>{p.name}</div>
          <div className="text-sm text-muted-foreground leading-relaxed mb-4">{p.description}</div>
          <div className="grid grid-cols-3 gap-2.5">
            <div className="bg-card/50 border border-border/30 rounded-xl p-3 text-center">
              <div className="text-base font-extrabold mb-0.5" style={{ color: p.color }}>{p.mechanism.split("(")[0].trim()}</div>
              <div className="text-[10px] uppercase tracking-widest text-muted-foreground/50 font-semibold">Core Mechanism</div>
            </div>
            <div className="bg-card/50 border border-border/30 rounded-xl p-3 text-center">
              <div className="text-base font-extrabold mb-0.5 text-green-400">{p.difficulty}</div>
              <div className="text-[10px] uppercase tracking-widest text-muted-foreground/50 font-semibold">Adoption Friction</div>
            </div>
            <div className="bg-card/50 border border-border/30 rounded-xl p-3 text-center">
              <div className="text-base font-extrabold mb-0.5 text-amber-400">{p.retentionRisk}</div>
              <div className="text-[10px] uppercase tracking-widest text-muted-foreground/50 font-semibold">Retention Risk</div>
            </div>
          </div>
        </div>
      </div>

      {/* Dopamine Architecture */}
      <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-6">
        <div className="text-base font-extrabold mb-1 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center justify-center text-sm shrink-0">⚡</div>
          Dopamine Architecture
        </div>
        <div className="text-xs text-muted-foreground mb-5 ml-12 leading-relaxed">How {productName} creates, sustains, and escalates dopamine release</div>
        <div className="space-y-2">
          {[
            { icon: "💥", title: `Trigger Type: ${data.dopamine.trigger}`, desc: `What initiates the dopamine response when users first encounter ${productName}.`, label: "Power", pct: data.dopamine.triggerPct, color: "#22c55e" },
            { icon: "🎰", title: `Reward Schedule: ${data.dopamine.schedule}`, desc: "Variable ratio schedules create the strongest dopamine loops. Fixed schedules are predictable and less addictive.", label: "Addictiveness", pct: data.dopamine.schedulePct, color: "#f59e0b" },
            { icon: "🔮", title: "Anticipation Loop", desc: `${data.dopamine.anticipation} - Dopamine is released during ANTICIPATION, not reward delivery.`, label: null, pct: null, color: null },
            { icon: "🔗", title: `Retention Hook: ${data.dopamine.retention}`, desc: `What keeps users coming back after the initial dopamine spike fades.`, label: "Stickiness", pct: data.dopamine.retentionPct, color: "#8b5cf6" },
          ].map((item, i) => (
            <div key={i} className="bg-background/50 border border-border/30 rounded-xl p-4 hover:border-green-500/20 transition-all">
              <div className="text-sm font-bold mb-1.5 flex items-center gap-2">{item.icon} {item.title}</div>
              <div className="text-xs text-muted-foreground leading-relaxed">{item.desc}</div>
              {item.pct != null && (
                <div className="flex items-center gap-2 mt-2.5">
                  <span className="text-[10px] text-muted-foreground/50 w-[70px]">{item.label}</span>
                  <div className="flex-1 h-1.5 bg-border/30 rounded-full overflow-hidden max-w-[120px]">
                    <div className="h-full rounded-full" style={{ width: `${item.pct}%`, background: item.color! }} />
                  </div>
                  <span className="text-[10px] font-bold text-muted-foreground/60">{item.pct}%</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Pain / Pleasure Matrix */}
      <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-6">
        <div className="text-base font-extrabold mb-4 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-sm shrink-0">⚔</div>
          Pain / Pleasure Matrix
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-background/50 border border-border/30 rounded-xl p-4 border-l-2 border-l-rose-500">
            <div className="text-[10px] uppercase tracking-[2px] font-bold mb-3 text-rose-400">Pain They Escape</div>
            <div className="space-y-1.5">
              {data.painPleasure.pains.map((pain, i) => (
                <div key={i} className="text-xs text-muted-foreground leading-relaxed pl-3 flex items-start gap-2">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-rose-500/60 shrink-0 mt-[5px]" />
                  {pain}
                </div>
              ))}
            </div>
          </div>
          <div className="bg-background/50 border border-border/30 rounded-xl p-4 border-l-2 border-l-green-500">
            <div className="text-[10px] uppercase tracking-[2px] font-bold mb-3 text-green-400">Pleasure They Gain</div>
            <div className="space-y-1.5">
              {data.painPleasure.pleasures.map((pleasure, i) => (
                <div key={i} className="text-xs text-muted-foreground leading-relaxed pl-3 flex items-start gap-2">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-500/60 shrink-0 mt-[5px]" />
                  {pleasure}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Habit Loop */}
      <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-6">
        <div className="text-base font-extrabold mb-4 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-sm shrink-0">🔄</div>
          The Habit Loop
        </div>
        <div className="flex items-center gap-0 my-3 flex-wrap">
          {[
            { label: "CUE", value: data.habitLoop.cue, color: "#f43f5e", textColor: "text-rose-400" },
            { label: "ROUTINE", value: data.habitLoop.routine, color: "#f59e0b", textColor: "text-amber-400" },
            { label: "REWARD", value: data.habitLoop.reward, color: "#22c55e", textColor: "text-green-400" },
          ].map((step, i) => (
            <div key={step.label} className="contents">
              <div className="bg-background/50 border border-border/30 rounded-xl px-5 py-4 flex-1 min-w-[140px] text-center" style={{ borderTopColor: step.color, borderTopWidth: 2 }}>
                <div className={`text-[10px] uppercase tracking-[2px] font-bold mb-2 ${step.textColor}`}>{step.label}</div>
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
      </div>

      {/* Neural Persuasion Stack */}
      <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-6">
        <div className="text-base font-extrabold mb-1 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-sm shrink-0">🧬</div>
          Neural Persuasion Stack
        </div>
        <div className="text-xs text-muted-foreground mb-5 ml-12 leading-relaxed">The 5-layer sequence your ad must execute to convert a scroll into a download</div>
        <div className="space-y-1">
          {data.persuasionStack.map((layer) => (
            <div key={layer.num} className="flex items-stretch gap-0">
              <div className="w-9 flex items-center justify-center text-[10px] font-extrabold text-white shrink-0 rounded-l-xl" style={{ background: layer.color }}>{layer.num}</div>
              <div className="flex-1 bg-background/50 border border-border/30 border-l-0 rounded-r-xl px-4 py-3">
                <div className="text-xs font-bold mb-0.5">{layer.name} <span className="text-[10px] text-muted-foreground/40 font-medium">{layer.timeRange}</span></div>
                <div className="text-xs text-muted-foreground leading-relaxed">{layer.description}</div>
                <div className="mt-2 flex gap-1 flex-wrap">
                  {layer.techniques.map((t) => <span key={t} className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-secondary/50 text-muted-foreground/70 border border-border/30">{t}</span>)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Cognitive Biases */}
      <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-6">
        <div className="text-base font-extrabold mb-1 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-sm shrink-0">🔬</div>
          Cognitive Biases at Play
        </div>
        <div className="text-xs text-muted-foreground mb-5 ml-12 leading-relaxed">{data.biases.length} biases active for this product</div>
        {data.audiencePosition && (
          <div className="bg-background/50 border border-border/30 rounded-xl p-4 mb-4 hover:border-violet-500/20 transition-all border-l-2 border-l-violet-500">
            <div className="text-sm font-bold mb-1.5 flex items-center gap-2 text-violet-400">📍 Audience Position: {data.audiencePosition.axis}</div>
            <div className="text-xs text-muted-foreground leading-relaxed">{data.audiencePosition.insight}</div>
          </div>
        )}
        <div className="space-y-2">
          {data.biases.map((bias) => (
            <div key={bias.name} className="bg-background/50 border border-border/30 rounded-xl p-4 hover:border-violet-500/20 transition-all">
              <div className="text-sm font-bold mb-1.5 flex items-center gap-2"><span className="text-base" style={{ color: bias.color }}>●</span> {bias.name}</div>
              <div className="text-xs text-muted-foreground leading-relaxed">{bias.description}</div>
              <div className="flex items-center gap-2 mt-2.5">
                <span className="text-[10px] text-muted-foreground/50 w-[50px]">Impact</span>
                <div className="flex-1 h-1.5 bg-border/30 rounded-full overflow-hidden max-w-[120px]">
                  <div className="h-full rounded-full" style={{ width: `${bias.strength}%`, background: bias.color }} />
                </div>
                <span className="text-[10px] font-bold text-muted-foreground/60">{bias.strength}%</span>
              </div>
              <div className="mt-2.5 p-3 bg-secondary/30 rounded-lg text-xs text-muted-foreground leading-relaxed border-l-2 border-violet-500">
                <strong className="text-foreground/80">Example:</strong> {bias.example}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
