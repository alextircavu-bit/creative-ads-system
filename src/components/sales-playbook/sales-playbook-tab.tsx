"use client";

import type { SalesPlaybookData } from "@/types/creative";

interface SalesPlaybookTabProps {
  data: SalesPlaybookData;
  productName: string;
}

export function SalesPlaybookTab({ data, productName }: SalesPlaybookTabProps) {
  const ve = data.valueEquation;

  return (
    <div className="space-y-6">
      {/* Demand Temperature */}
      {data.demandTemperature && (
        <section>
          <div className="flex items-center gap-2 mb-4">
            <svg className="w-4 h-4 text-muted-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z" />
            </svg>
            <div>
              <h2 className="text-sm font-semibold text-foreground">Demand Temperature</h2>
              <p className="text-xs text-muted-foreground">How much the market already wants this</p>
            </div>
          </div>
          <div className="border border-border/50 rounded-md p-4">
            <div className="flex items-center gap-3 mb-2">
              <span className={`px-2 py-0.5 rounded-md text-[11px] font-semibold ${
                data.demandTemperature.level === "high" ? "bg-green-500/10 text-green-400 border border-green-500/20" :
                data.demandTemperature.level === "medium" ? "bg-amber-500/10 text-amber-400 border border-amber-500/20" :
                "bg-blue-500/10 text-blue-400 border border-blue-500/20"
              }`}>
                {data.demandTemperature.level.toUpperCase()}
              </span>
            </div>
            <div className="text-xs text-muted-foreground leading-relaxed mb-2">{data.demandTemperature.description}</div>
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-muted/30 border border-border/30 rounded-md p-2.5">
                <div className="text-[9px] uppercase tracking-wider font-medium text-muted-foreground/30 mb-1">Hook Approach</div>
                <div className="text-[11px] text-muted-foreground leading-relaxed">{data.demandTemperature.hookApproach}</div>
              </div>
              <div className="bg-muted/30 border border-border/30 rounded-md p-2.5">
                <div className="text-[9px] uppercase tracking-wider font-medium text-muted-foreground/30 mb-1">Bridge Weight</div>
                <div className="text-[11px] text-muted-foreground leading-relaxed">{data.demandTemperature.bridgeWeight}</div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Market Sophistication */}
      {data.marketSophistication && (
        <section>
          <div className="flex items-center gap-2 mb-4">
            <svg className="w-4 h-4 text-muted-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
              <path d="M2 20h20M5 20V10M9 20V4M13 20v-6M17 20V8M21 20v-4" />
            </svg>
            <div>
              <h2 className="text-sm font-semibold text-foreground">Market Sophistication</h2>
              <p className="text-xs text-muted-foreground">Eugene Schwartz — determines hook strategy</p>
            </div>
          </div>
          <div className="border border-border/50 rounded-md p-4">
            <div className="flex items-center gap-3 mb-2">
              <span className="w-7 h-7 rounded-md bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-xs font-semibold text-violet-400">{data.marketSophistication.level}</span>
              <span className="text-sm font-medium text-foreground">{data.marketSophistication.name}</span>
            </div>
            <div className="text-xs text-muted-foreground leading-relaxed mb-2">{data.marketSophistication.description}</div>
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-muted/30 border border-border/30 rounded-md p-2.5">
                <div className="text-[9px] uppercase tracking-wider font-medium text-muted-foreground/30 mb-1">Hook Strategy</div>
                <div className="text-[11px] text-muted-foreground leading-relaxed">{data.marketSophistication.hookStrategy}</div>
              </div>
              <div className="bg-muted/30 border border-border/30 rounded-md p-2.5">
                <div className="text-[9px] uppercase tracking-wider font-medium text-muted-foreground/30 mb-1">Avoid</div>
                <div className="text-[11px] text-muted-foreground leading-relaxed">{data.marketSophistication.avoidance}</div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Purchase Context */}
      {data.purchaseContext && (
        <section>
          <div className="flex items-center gap-2 mb-4">
            <svg className="w-4 h-4 text-muted-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
              <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" /><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
            </svg>
            <div>
              <h2 className="text-sm font-semibold text-foreground">Purchase Context</h2>
              <p className="text-xs text-muted-foreground">How the buying decision works</p>
            </div>
          </div>
          <div className="border border-border/50 rounded-md p-4">
            <div className="grid grid-cols-4 gap-2 mb-3">
              {[
                { label: "Price Model", value: data.purchaseContext.priceModel },
                { label: "Price Point", value: data.purchaseContext.pricePoint },
                { label: "Purchase Type", value: data.purchaseContext.purchaseType },
                { label: "Ad Intensity", value: data.purchaseContext.adIntensity },
              ].map((item) => (
                <div key={item.label} className="text-center border border-border/30 rounded-md p-2.5">
                  <div className="text-[9px] uppercase tracking-wider font-medium text-muted-foreground/30 mb-1">{item.label}</div>
                  <div className="text-xs font-medium text-foreground">{item.value}</div>
                </div>
              ))}
            </div>
            <div className="text-xs text-muted-foreground leading-relaxed">{data.purchaseContext.reasoning}</div>
          </div>
        </section>
      )}

      {/* Objection Map */}
      {data.objectionMap && data.objectionMap.length > 0 && (
        <section>
          <div className="flex items-center gap-2 mb-4">
            <svg className="w-4 h-4 text-muted-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 9v4M12 17h.01M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
            </svg>
            <div>
              <h2 className="text-sm font-semibold text-foreground">Objection Map</h2>
              <p className="text-xs text-muted-foreground">{data.objectionMap.length} buyer objections to neutralize</p>
            </div>
          </div>
          <div className="border border-border/50 rounded-md divide-y divide-border/30">
            {data.objectionMap.map((obj, i) => (
              <div key={i} className="px-4 py-3.5">
                <div className="text-sm font-medium text-foreground mb-1">&ldquo;{obj.objection}&rdquo;</div>
                <div className="text-xs text-muted-foreground leading-relaxed mb-2">{obj.killMechanism}</div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-muted/30 border border-border/30 rounded-md p-2">
                    <div className="text-[9px] uppercase tracking-wider font-medium text-rose-400/60 mb-0.5">Hook Counter</div>
                    <div className="text-[11px] text-muted-foreground leading-relaxed">{obj.hookCounter}</div>
                  </div>
                  <div className="bg-muted/30 border border-border/30 rounded-md p-2">
                    <div className="text-[9px] uppercase tracking-wider font-medium text-green-400/60 mb-0.5">Body Counter</div>
                    <div className="text-[11px] text-muted-foreground leading-relaxed">{obj.bodyCounter}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Hormozi Value Equation */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <svg className="w-4 h-4 text-muted-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
          </svg>
          <div>
            <h2 className="text-sm font-semibold text-foreground">The Value Equation</h2>
            <p className="text-xs text-muted-foreground">Alex Hormozi — $100M Offers</p>
          </div>
        </div>
        <div className="text-xs text-muted-foreground leading-relaxed mb-3 px-4 py-2.5 border border-border/40 rounded-md">
          <strong className="text-foreground">Value = (Dream Outcome x Perceived Likelihood) / (Time Delay x Effort)</strong>. Increase the top, decrease the bottom. Here&apos;s how {productName} scores:
        </div>
        <div className="grid grid-cols-2 gap-2">
          {[
            { label: "Dream Outcome", data: ve.dreamOutcome, positive: true },
            { label: "Perceived Likelihood", data: ve.perceivedLikelihood, positive: true },
            { label: "Time Delay", data: ve.timeDelay, positive: false },
            { label: "Effort & Sacrifice", data: ve.effortSacrifice, positive: false },
          ].map((item) => {
            const displayScore = item.positive ? item.data.score : 100 - item.data.score;
            const barColor = item.positive ? "#22c55e" : (item.data.score > 75 ? "#22c55e" : "#f59e0b");
            return (
              <div key={item.label} className={`border border-border/50 rounded-md p-4 border-t-2 ${item.positive ? "border-t-green-500" : "border-t-rose-500"}`}>
                <div className="text-[10px] uppercase tracking-wider font-medium text-muted-foreground/40 mb-1.5">{item.label}</div>
                <div className="text-2xl font-semibold tabular-nums mb-2">{displayScore}%</div>
                <div className="h-1.5 bg-border/30 rounded-full overflow-hidden max-w-[120px] mb-2.5">
                  <div className="h-full rounded-full" style={{ width: `${displayScore}%`, background: barColor }} />
                </div>
                <div className="text-xs text-muted-foreground leading-relaxed">{item.data.text}</div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 5 Levels of Awareness */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <svg className="w-4 h-4 text-muted-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" /><path d="M12 16v-4M12 8h.01" />
          </svg>
          <div>
            <h2 className="text-sm font-semibold text-foreground">5 Levels of Awareness</h2>
            <p className="text-xs text-muted-foreground">Eugene Schwartz — Breakthrough Advertising</p>
          </div>
        </div>
        <div className="space-y-2">
          {data.awarenessLevels.map((l) => (
            <div key={l.level} className="border border-border/50 rounded-md px-4 py-3.5" style={{ borderLeft: `3px solid ${l.color}` }}>
              <div className="flex items-center gap-2.5 mb-2 flex-wrap">
                <span className="w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-semibold text-white shrink-0" style={{ background: l.color }}>{l.level}</span>
                <span className="text-sm font-medium">{l.name}</span>
                <span className="text-[10px] font-semibold ml-auto" style={{ color: l.color }}>{l.relevance}%</span>
                <span className="text-[10px] px-1.5 py-px rounded-sm bg-muted/50 text-muted-foreground/60 font-medium">{l.bestFor}</span>
              </div>
              <div className="text-xs text-muted-foreground leading-relaxed mb-1.5">{l.description}</div>
              <div className="text-xs text-muted-foreground leading-relaxed mb-1"><strong className="text-foreground/80">Ad strategy:</strong> {l.adStrategy}</div>
              <div className="text-xs text-muted-foreground/60 leading-relaxed"><strong>Example hook:</strong> <em>{l.exampleHook}</em></div>
            </div>
          ))}
        </div>
      </section>

      {/* Retargeting Funnel */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <svg className="w-4 h-4 text-muted-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
          </svg>
          <div>
            <h2 className="text-sm font-semibold text-foreground">Retargeting Funnel</h2>
            <p className="text-xs text-muted-foreground">Funnel-stage messaging x emotional angle mapping</p>
          </div>
        </div>
        <div className="space-y-2">
          {data.retargetingFunnel.map((stage) => (
            <div key={stage.name} className="border border-border/50 rounded-md px-4 py-3.5" style={{ borderLeft: `3px solid ${stage.color}` }}>
              <div className="flex items-center gap-2.5 mb-2 flex-wrap">
                <span className="text-sm font-medium">{stage.name}</span>
                <span className="text-[10px] font-semibold ml-auto" style={{ color: stage.color }}>{stage.frequency}</span>
                <span className="text-[10px] px-1.5 py-px rounded-sm bg-muted/50 text-muted-foreground/60 font-medium">{stage.audience}</span>
              </div>
              <div className="text-xs text-muted-foreground leading-relaxed mb-1.5">{stage.description}</div>
              <div className="text-xs text-muted-foreground leading-relaxed mb-1"><strong className="text-foreground/80">Best emotions:</strong> {stage.bestEmotions}</div>
              <div className="text-xs text-muted-foreground leading-relaxed mb-1"><strong className="text-foreground/80">Bias stack:</strong> {stage.biasStack}</div>
              <div className="text-xs text-muted-foreground/60 leading-relaxed"><strong>Creative format:</strong> {stage.creativeFormat}</div>
              <div className="text-xs text-muted-foreground/50 leading-relaxed italic mt-1">{stage.example}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Cialdini 6 Weapons */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <svg className="w-4 h-4 text-muted-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
            <path d="M14.5 17.5L3 6V3h3l11.5 11.5M13 7l4-4 4 4-4 4M3 11l4-4" />
          </svg>
          <div>
            <h2 className="text-sm font-semibold text-foreground">The 6 Weapons of Influence</h2>
            <p className="text-xs text-muted-foreground">Robert Cialdini — Influence</p>
          </div>
        </div>
        <div className="space-y-2">
          {data.cialdiniWeapons.map((w) => (
            <div key={w.name} className="border border-border/50 rounded-md p-4">
              <div className="flex items-center gap-2.5 mb-2">
                <span className="text-sm font-medium">{w.name}</span>
                <div className="flex-1 h-1.5 bg-border/30 rounded-full overflow-hidden max-w-[120px]">
                  <div className="h-full rounded-full" style={{ width: `${w.power}%`, background: w.color }} />
                </div>
                <span className="text-[10px] font-semibold text-muted-foreground/60">{w.power}%</span>
              </div>
              <div className="text-xs text-muted-foreground leading-relaxed mb-2">{w.description}</div>
              <div className="text-xs text-muted-foreground leading-relaxed mb-2 px-3 py-2 bg-muted/30 rounded-md"><strong className="text-foreground/80">For {productName}:</strong> {w.application}</div>
              <div className="bg-muted/30 rounded-md px-3 py-2 text-xs text-muted-foreground leading-relaxed italic border-l-2 border-l-amber-500">{w.scriptExample}</div>
            </div>
          ))}
        </div>
      </section>

      {/* System 1 vs System 2 */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <svg className="w-4 h-4 text-muted-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
          </svg>
          <div>
            <h2 className="text-sm font-semibold text-foreground">System 1 vs System 2 Targeting</h2>
            <p className="text-xs text-muted-foreground">Daniel Kahneman — Thinking, Fast and Slow</p>
          </div>
        </div>
        <div className="text-xs text-muted-foreground leading-relaxed mb-3 px-4 py-2.5 border border-border/40 rounded-md">System 1 is fast, emotional, automatic. System 2 is slow, rational, deliberate. Hook System 1 first, then give System 2 permission to agree.</div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <div className="text-xs font-semibold mb-1 text-rose-400">System 1 — Fast Brain</div>
            <div className="text-[10px] text-muted-foreground/40 mb-2">Amygdala, Nucleus Accumbens, Visual Cortex</div>
            <div className="space-y-2">
              {data.system1Triggers.map((t) => (
                <div key={t.trigger} className="border border-rose-500/15 rounded-md p-3">
                  <div className="text-xs font-medium mb-1">{t.trigger}</div>
                  <div className="text-xs text-muted-foreground leading-relaxed mb-1">{t.description}</div>
                  <div className="text-[10px] text-muted-foreground/50 leading-relaxed"><strong className="text-foreground/60">Tip:</strong> {t.tip}</div>
                </div>
              ))}
            </div>
          </div>
          <div>
            <div className="text-xs font-semibold mb-1 text-blue-400">System 2 — Slow Brain</div>
            <div className="text-[10px] text-muted-foreground/40 mb-2">Prefrontal Cortex, Ventromedial PFC</div>
            <div className="space-y-2">
              {data.system2Triggers.map((t) => (
                <div key={t.trigger} className="border border-blue-500/15 rounded-md p-3">
                  <div className="text-xs font-medium mb-1">{t.trigger}</div>
                  <div className="text-xs text-muted-foreground leading-relaxed mb-1">{t.description}</div>
                  <div className="text-[10px] text-muted-foreground/50 leading-relaxed"><strong className="text-foreground/60">Tip:</strong> {t.tip}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Hook > Story > Offer */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <svg className="w-4 h-4 text-muted-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" />
          </svg>
          <div>
            <h2 className="text-sm font-semibold text-foreground">Hook &gt; Story &gt; Offer</h2>
            <p className="text-xs text-muted-foreground">Russell Brunson — DotCom Secrets</p>
          </div>
        </div>
        <div className="border border-border/50 rounded-md overflow-hidden">
          {[
            { num: 1, title: "The Hook", items: data.hso.hooks, color: "#f43f5e", desc: "The pattern interrupt that stops the scroll." },
            { num: 2, title: "The Story", items: data.hso.stories, color: "#f59e0b", desc: "The narrative that builds connection." },
            { num: 3, title: "The Offer", items: data.hso.offers, color: "#22c55e", desc: "Make the offer so good they feel stupid saying no." },
          ].map((s) => (
            <div key={s.num} className="flex items-stretch border-b border-border/30 last:border-b-0">
              <div className="w-8 flex items-center justify-center text-xs font-semibold text-white shrink-0" style={{ background: s.color }}>{s.num}</div>
              <div className="flex-1 px-4 py-3.5">
                <div className="text-sm font-medium mb-0.5">{s.title}</div>
                <div className="text-xs text-muted-foreground leading-relaxed mb-2.5">{s.desc}</div>
                <div className="space-y-1">
                  {s.items.map((item, i) => (
                    <div key={i} className="text-xs text-muted-foreground/70 leading-relaxed px-3 py-1.5 bg-muted/30 rounded-md italic border-l-2" style={{ borderLeftColor: s.color + "40" }}>{item}</div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Straight Line */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <svg className="w-4 h-4 text-muted-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14" /><path d="M12 5l7 7-7 7" />
          </svg>
          <div>
            <h2 className="text-sm font-semibold text-foreground">The Straight Line</h2>
            <p className="text-xs text-muted-foreground">Jordan Belfort — Way of the Wolf</p>
          </div>
        </div>
        <div className="text-xs text-muted-foreground leading-relaxed mb-3 px-4 py-2.5 border border-border/40 rounded-md">Every sale requires 3 certainties to reach 10/10. If any is low, the sale dies:</div>
        <div className="grid grid-cols-3 gap-2">
          {[
            { label: "Product Certainty", ...data.straightLine.product },
            { label: "Seller Certainty", ...data.straightLine.seller },
            { label: "Action Threshold", ...data.straightLine.action },
          ].map((item) => (
            <div key={item.label} className="border border-border/50 rounded-md p-4">
              <div className="text-[10px] uppercase tracking-wider font-medium text-muted-foreground/40 mb-1.5">{item.label}</div>
              <div className="text-2xl font-semibold tabular-nums mb-2" style={{ color: item.score > 75 ? "#22c55e" : "#f59e0b" }}>{item.score}/100</div>
              <div className="h-1.5 bg-border/30 rounded-full overflow-hidden max-w-[120px] mb-2.5">
                <div className="h-full rounded-full" style={{ width: `${item.score}%`, background: item.score > 75 ? "#22c55e" : "#f59e0b" }} />
              </div>
              <div className="text-xs text-muted-foreground leading-relaxed mb-2">{item.text}</div>
              <div className="flex flex-wrap gap-1">
                {item.tactics.map((t) => <span key={t} className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-muted/50 text-muted-foreground/70 border border-border/30">{t}</span>)}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Closing Techniques */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <svg className="w-4 h-4 text-muted-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
          <div>
            <h2 className="text-sm font-semibold text-foreground">The Art of the Close</h2>
            <p className="text-xs text-muted-foreground">Zig Ziglar, Dale Carnegie, Jordan Belfort</p>
          </div>
        </div>
        <div className="space-y-2">
          {data.closingTechniques.map((c) => (
            <div key={c.name} className="border border-border/50 rounded-md p-4">
              <div className="flex items-center gap-2.5 mb-2 flex-wrap">
                <span className="text-sm font-medium">{c.name}</span>
                <span className="text-[10px] text-muted-foreground/50">{c.source} — <em>{c.book}</em></span>
              </div>
              <div className="text-xs text-muted-foreground leading-relaxed mb-2">{c.description}</div>
              <div className="bg-muted/30 rounded-md px-3 py-2 text-xs text-muted-foreground leading-relaxed italic border-l-2 border-l-amber-500">{c.scriptExample}</div>
            </div>
          ))}
        </div>
      </section>

      {/* NLP */}
      {data.nlp && (
        <section>
          <div className="flex items-center gap-2 mb-4">
            <svg className="w-4 h-4 text-muted-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
            <div>
              <h2 className="text-sm font-semibold text-foreground">Neuro-Linguistic Programming</h2>
              <p className="text-xs text-muted-foreground">Allen Carr, Richard Bandler — Belief System Dismantling</p>
            </div>
          </div>
          <div className="text-xs text-muted-foreground leading-relaxed mb-4 px-4 py-2.5 border border-border/40 rounded-md">{data.nlp.keyPrinciple}</div>

          <div className="space-y-2 mb-5">
            {data.nlp.techniques.map((t) => (
              <div key={t.id} className="border border-border/50 rounded-md p-4" style={{ borderLeft: `3px solid ${t.color}` }}>
                <div className="flex items-center gap-2.5 mb-2">
                  <span className="text-sm font-medium">{t.name}</span>
                  <div className="flex-1 h-1.5 bg-border/30 rounded-full overflow-hidden max-w-[100px]">
                    <div className="h-full rounded-full" style={{ width: `${t.power}%`, background: t.color }} />
                  </div>
                  <span className="text-[10px] font-semibold" style={{ color: t.color }}>{t.power}%</span>
                </div>
                <div className="text-xs text-muted-foreground leading-relaxed mb-3">{t.definition}</div>

                <div className="mb-3">
                  <div className="text-[10px] uppercase tracking-wider font-medium text-muted-foreground/40 mb-1.5">Copy Patterns</div>
                  <div className="space-y-1">
                    {t.copyExamples.map((ex, i) => (
                      <div key={i} className="text-xs text-muted-foreground leading-relaxed px-3 py-1.5 bg-muted/30 rounded-md border-l-2" style={{ borderLeftColor: t.color }}>{ex}</div>
                    ))}
                  </div>
                </div>

                <div className="mb-3">
                  <div className="text-[10px] uppercase tracking-wider font-medium text-muted-foreground/40 mb-1.5">Ad Application</div>
                  <div className="text-xs text-muted-foreground leading-relaxed px-3 py-1.5 bg-muted/30 rounded-md border-l-2 border-l-violet-500/30">{t.adApplication}</div>
                </div>

                <div>
                  <div className="text-[10px] uppercase tracking-wider font-medium mb-1.5" style={{ color: t.color }}>For {productName}</div>
                  <div className="bg-muted/30 rounded-md px-3 py-2 text-xs text-muted-foreground leading-relaxed italic border-l-2 border-l-amber-500">{t.productExample}</div>
                </div>
              </div>
            ))}
          </div>

          {/* NLP Stack Strategy */}
          <div className="border border-border/50 rounded-md p-5">
            <div className="flex items-center gap-2 mb-3">
              <svg className="w-3.5 h-3.5 text-muted-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" />
              </svg>
              <span className="text-sm font-semibold">NLP Stack Strategy for {productName}</span>
            </div>
            <div className="text-xs text-muted-foreground leading-relaxed mb-3">Maximum impact sequence — layer these in order:</div>
            <div className="border border-border/40 rounded-md overflow-hidden">
              {data.nlp.stackStrategy.map((s) => {
                const techniqueColors: Record<string, string> = {
                  Presupposition: "#f43f5e",
                  Reframing: "#f59e0b",
                  Dissociation: "#8b5cf6",
                  Anchoring: "#22c55e",
                  "Nested Loop": "#06b6d4",
                };
                const color = techniqueColors[s.technique] || "#8b5cf6";
                return (
                  <div key={s.step} className="flex items-stretch border-b border-border/30 last:border-b-0">
                    <div className="w-7 flex items-center justify-center text-[10px] font-semibold text-white shrink-0" style={{ background: color }}>{s.step}</div>
                    <div className="flex-1 px-3 py-2.5">
                      <div className="text-[10px] uppercase tracking-wider font-medium mb-0.5" style={{ color }}>{s.technique}</div>
                      <div className="text-xs text-muted-foreground leading-relaxed italic">{s.script}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
