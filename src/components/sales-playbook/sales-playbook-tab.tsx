"use client";

import type { SalesPlaybookData } from "@/types/creative";

interface SalesPlaybookTabProps {
  data: SalesPlaybookData;
  productName: string;
}

export function SalesPlaybookTab({ data, productName }: SalesPlaybookTabProps) {
  const ve = data.valueEquation;

  return (
    <div className="space-y-5">
      {/* Hormozi Value Equation */}
      <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-lg shrink-0">📖</div>
          <div>
            <div className="text-base font-extrabold">The Value Equation</div>
            <div className="text-xs text-muted-foreground mt-0.5">Alex Hormozi - <em>$100M Offers</em></div>
          </div>
        </div>
        <div className="text-xs text-muted-foreground leading-relaxed mb-4 px-4 py-3 bg-background/50 border border-border/30 rounded-xl">
          <strong className="text-foreground">Value = (Dream Outcome × Perceived Likelihood) ÷ (Time Delay × Effort)</strong>. Increase the top, decrease the bottom. Here&apos;s how {productName} scores:
        </div>
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: "Dream Outcome", data: ve.dreamOutcome, positive: true },
            { label: "Perceived Likelihood", data: ve.perceivedLikelihood, positive: true },
            { label: "Time Delay", data: ve.timeDelay, positive: false },
            { label: "Effort & Sacrifice", data: ve.effortSacrifice, positive: false },
          ].map((item) => {
            const displayScore = item.positive ? item.data.score : 100 - item.data.score;
            const barColor = item.positive ? "#22c55e" : (item.data.score > 75 ? "#22c55e" : "#f59e0b");
            return (
              <div key={item.label} className={`bg-background/50 border border-border/30 rounded-xl p-4 border-t-2 ${item.positive ? "border-t-green-500" : "border-t-rose-500"}`}>
                <div className="text-[10px] uppercase tracking-[1.5px] font-bold text-muted-foreground/40 mb-1.5">{item.label}</div>
                <div className="text-2xl font-black mb-2">{displayScore}%</div>
                <div className="h-1.5 bg-border/30 rounded-full overflow-hidden max-w-[120px] mb-2.5">
                  <div className="h-full rounded-full transition-all" style={{ width: `${displayScore}%`, background: barColor }} />
                </div>
                <div className="text-xs text-muted-foreground leading-relaxed">{item.data.text}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 5 Levels of Awareness */}
      <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-2xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-lg shrink-0">🧠</div>
          <div>
            <div className="text-base font-extrabold">5 Levels of Awareness</div>
            <div className="text-xs text-muted-foreground mt-0.5">Eugene Schwartz - <em>Breakthrough Advertising</em></div>
          </div>
        </div>
        <div className="text-xs text-muted-foreground leading-relaxed mb-4 px-4 py-3 bg-background/50 border border-border/30 rounded-xl">Every user sits at a different awareness level. Match your message to where they are:</div>
        <div className="space-y-2">
          {data.awarenessLevels.map((l) => (
            <div key={l.level} className="bg-background/50 border border-border/30 rounded-xl px-4 py-3.5 hover:border-violet-500/20 transition-all" style={{ borderLeft: `3px solid ${l.color}` }}>
              <div className="flex items-center gap-2.5 mb-2 flex-wrap">
                <span className="w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-extrabold text-white shrink-0" style={{ background: l.color }}>{l.level}</span>
                <span className="text-sm font-bold">{l.name}</span>
                <span className="text-[10px] font-bold ml-auto" style={{ color: l.color }}>{l.relevance}% relevant</span>
                <span className="text-[10px] px-2 py-0.5 rounded-md bg-secondary/50 text-muted-foreground/60 font-semibold">{l.bestFor}</span>
              </div>
              <div className="text-xs text-muted-foreground leading-relaxed mb-1.5">{l.description}</div>
              <div className="text-xs text-muted-foreground leading-relaxed mb-1"><strong className="text-foreground/80">Ad strategy:</strong> {l.adStrategy}</div>
              <div className="text-xs text-muted-foreground/60 leading-relaxed"><strong>Example hook:</strong> <em>{l.exampleHook}</em></div>
            </div>
          ))}
        </div>
      </div>

      {/* Retargeting Funnel */}
      <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-lg shrink-0">🎯</div>
          <div>
            <div className="text-base font-extrabold">Retargeting Funnel</div>
            <div className="text-xs text-muted-foreground mt-0.5">Funnel-Stage Messaging × Emotional Angle Mapping</div>
          </div>
        </div>
        <div className="text-xs text-muted-foreground leading-relaxed mb-4 px-4 py-3 bg-background/50 border border-border/30 rounded-xl">Different funnel stages need different emotional triggers, creative angles, and frequency windows.</div>
        <div className="space-y-2">
          {data.retargetingFunnel.map((stage) => (
            <div key={stage.name} className="bg-background/50 border border-border/30 rounded-xl px-4 py-3.5 hover:border-cyan-500/20 transition-all" style={{ borderLeft: `3px solid ${stage.color}` }}>
              <div className="flex items-center gap-2.5 mb-2 flex-wrap">
                <span className="w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-extrabold text-white shrink-0" style={{ background: stage.color }}>{stage.icon}</span>
                <span className="text-sm font-bold">{stage.name}</span>
                <span className="text-[10px] font-bold ml-auto" style={{ color: stage.color }}>{stage.frequency}</span>
                <span className="text-[10px] px-2 py-0.5 rounded-md bg-secondary/50 text-muted-foreground/60 font-semibold">{stage.audience}</span>
              </div>
              <div className="text-xs text-muted-foreground leading-relaxed mb-1.5">{stage.description}</div>
              <div className="text-xs text-muted-foreground leading-relaxed mb-1"><strong className="text-foreground/80">Best emotions:</strong> {stage.bestEmotions}</div>
              <div className="text-xs text-muted-foreground leading-relaxed mb-1"><strong className="text-foreground/80">Bias stack:</strong> {stage.biasStack}</div>
              <div className="text-xs text-muted-foreground/60 leading-relaxed"><strong>Creative format:</strong> {stage.creativeFormat}</div>
              <div className="text-xs text-muted-foreground/50 leading-relaxed italic">{stage.example}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Cialdini 6 Weapons */}
      <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-lg shrink-0">⚔️</div>
          <div>
            <div className="text-base font-extrabold">The 6 Weapons of Influence</div>
            <div className="text-xs text-muted-foreground mt-0.5">Robert Cialdini - <em>Influence: The Psychology of Persuasion</em></div>
          </div>
        </div>
        <div className="text-xs text-muted-foreground leading-relaxed mb-4 px-4 py-3 bg-background/50 border border-border/30 rounded-xl">Cialdini identified 6 universal principles that drive human compliance. Ranked by relevance to {productName}:</div>
        <div className="space-y-2">
          {data.cialdiniWeapons.map((w) => (
            <div key={w.name} className="bg-background/50 border border-border/30 rounded-xl p-4 hover:border-blue-500/20 transition-all">
              <div className="flex items-center gap-2.5 mb-2">
                <span className="text-lg">{w.icon}</span>
                <span className="text-sm font-bold">{w.name}</span>
                <div className="flex-1 h-1.5 bg-border/30 rounded-full overflow-hidden max-w-[120px]">
                  <div className="h-full rounded-full" style={{ width: `${w.power}%`, background: w.color }} />
                </div>
                <span className="text-[10px] font-bold text-muted-foreground/60">{w.power}%</span>
              </div>
              <div className="text-xs text-muted-foreground leading-relaxed mb-2">{w.description}</div>
              <div className="text-xs text-muted-foreground leading-relaxed mb-2 p-3 bg-secondary/30 rounded-lg"><strong className="text-foreground/80">For {productName}:</strong> {w.application}</div>
              <div className="bg-secondary/30 rounded-xl px-4 py-3 text-xs text-muted-foreground leading-relaxed italic border-l-2 border-l-amber-500">{w.scriptExample}</div>
            </div>
          ))}
        </div>
      </div>

      {/* System 1 vs System 2 */}
      <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-2xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center text-lg shrink-0">⚡</div>
          <div>
            <div className="text-base font-extrabold">System 1 vs System 2 Targeting</div>
            <div className="text-xs text-muted-foreground mt-0.5">Daniel Kahneman - <em>Thinking, Fast and Slow</em></div>
          </div>
        </div>
        <div className="text-xs text-muted-foreground leading-relaxed mb-4 px-4 py-3 bg-background/50 border border-border/30 rounded-xl">System 1 is fast, emotional, automatic. System 2 is slow, rational, deliberate. Hook System 1 FIRST, then give System 2 permission to agree.</div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-xs font-extrabold mb-1 text-rose-400">SYSTEM 1 - Fast Brain</div>
            <div className="text-[10px] text-muted-foreground/40 mb-2">Amygdala, Nucleus Accumbens, Visual Cortex</div>
            <div className="space-y-2">
              {data.system1Triggers.map((t) => (
                <div key={t.trigger} className="bg-background/50 border border-rose-500/15 rounded-xl p-3 hover:border-rose-500/30 transition-all">
                  <div className="text-xs font-bold mb-1">{t.trigger}</div>
                  <div className="text-xs text-muted-foreground leading-relaxed mb-1">{t.description}</div>
                  <div className="text-[10px] text-muted-foreground/50 leading-relaxed"><strong className="text-foreground/60">Tip:</strong> {t.tip}</div>
                </div>
              ))}
            </div>
          </div>
          <div>
            <div className="text-xs font-extrabold mb-1 text-blue-400">SYSTEM 2 - Slow Brain</div>
            <div className="text-[10px] text-muted-foreground/40 mb-2">Prefrontal Cortex, Ventromedial PFC</div>
            <div className="space-y-2">
              {data.system2Triggers.map((t) => (
                <div key={t.trigger} className="bg-background/50 border border-blue-500/15 rounded-xl p-3 hover:border-blue-500/30 transition-all">
                  <div className="text-xs font-bold mb-1">{t.trigger}</div>
                  <div className="text-xs text-muted-foreground leading-relaxed mb-1">{t.description}</div>
                  <div className="text-[10px] text-muted-foreground/50 leading-relaxed"><strong className="text-foreground/60">Tip:</strong> {t.tip}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Hook → Story → Offer */}
      <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-2xl bg-green-500/10 border border-green-500/20 flex items-center justify-center text-lg shrink-0">🎯</div>
          <div>
            <div className="text-base font-extrabold">Hook → Story → Offer</div>
            <div className="text-xs text-muted-foreground mt-0.5">Russell Brunson - <em>DotCom Secrets</em></div>
          </div>
        </div>
        <div className="text-xs text-muted-foreground leading-relaxed mb-4 px-4 py-3 bg-background/50 border border-border/30 rounded-xl">Every converting ad follows a 3-part structure.</div>
        <div className="space-y-1">
          {[
            { num: 1, title: "The Hook", items: data.hso.hooks, color: "#f43f5e", desc: "The pattern interrupt that stops the scroll." },
            { num: 2, title: "The Story", items: data.hso.stories, color: "#f59e0b", desc: "The narrative that builds connection." },
            { num: 3, title: "The Offer", items: data.hso.offers, color: "#22c55e", desc: "Make the offer so good they feel stupid saying no." },
          ].map((s) => (
            <div key={s.num} className="flex items-stretch gap-0">
              <div className="w-10 flex items-center justify-center text-xs font-extrabold text-white shrink-0 rounded-l-xl" style={{ background: s.color }}>{s.num}</div>
              <div className="flex-1 bg-background/50 border border-border/30 border-l-0 rounded-r-xl px-4 py-3.5">
                <div className="text-sm font-bold mb-1">{s.title}</div>
                <div className="text-xs text-muted-foreground leading-relaxed mb-2.5">{s.desc}</div>
                <div className="space-y-1">
                  {s.items.map((item, i) => (
                    <div key={i} className="text-xs text-muted-foreground/70 leading-relaxed px-3 py-1.5 bg-secondary/30 rounded-lg italic border-l-2" style={{ borderLeftColor: s.color + "40" }}>{item}</div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Straight Line */}
      <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-lg shrink-0">📐</div>
          <div>
            <div className="text-base font-extrabold">The Straight Line</div>
            <div className="text-xs text-muted-foreground mt-0.5">Jordan Belfort - <em>Way of the Wolf</em></div>
          </div>
        </div>
        <div className="text-xs text-muted-foreground leading-relaxed mb-4 px-4 py-3 bg-background/50 border border-border/30 rounded-xl">Every sale requires 3 certainties to reach 10/10. If ANY is low, the sale dies:</div>
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "Product Certainty", ...data.straightLine.product },
            { label: "Seller Certainty", ...data.straightLine.seller },
            { label: "Action Threshold", ...data.straightLine.action },
          ].map((item) => (
            <div key={item.label} className="bg-background/50 border border-border/30 rounded-xl p-4">
              <div className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground/40 mb-1.5">{item.label}</div>
              <div className="text-2xl font-black mb-2" style={{ color: item.score > 75 ? "#22c55e" : "#f59e0b" }}>{item.score}/100</div>
              <div className="h-1.5 bg-border/30 rounded-full overflow-hidden max-w-[120px] mb-2.5">
                <div className="h-full rounded-full" style={{ width: `${item.score}%`, background: item.score > 75 ? "#22c55e" : "#f59e0b" }} />
              </div>
              <div className="text-xs text-muted-foreground leading-relaxed mb-2">{item.text}</div>
              <div className="flex flex-wrap gap-1">
                {item.tactics.map((t) => <span key={t} className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-secondary/50 text-muted-foreground/70 border border-border/30">{t}</span>)}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Closing Techniques */}
      <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-2xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-lg shrink-0">🤝</div>
          <div>
            <div className="text-base font-extrabold">The Art of the Close</div>
            <div className="text-xs text-muted-foreground mt-0.5">Zig Ziglar, Dale Carnegie, Jordan Belfort</div>
          </div>
        </div>
        <div className="text-xs text-muted-foreground leading-relaxed mb-4 px-4 py-3 bg-background/50 border border-border/30 rounded-xl">The close isn&apos;t a moment - it&apos;s the inevitable conclusion of a well-built narrative:</div>
        <div className="space-y-2">
          {data.closingTechniques.map((c) => (
            <div key={c.name} className="bg-background/50 border border-border/30 rounded-xl p-4 hover:border-teal-500/20 transition-all">
              <div className="flex items-center gap-2.5 mb-2 flex-wrap">
                <span className="text-sm font-bold">{c.name}</span>
                <span className="text-[10px] text-muted-foreground/50">{c.source} - <em>{c.book}</em></span>
              </div>
              <div className="text-xs text-muted-foreground leading-relaxed mb-2">{c.description}</div>
              <div className="bg-secondary/30 rounded-xl px-4 py-3 text-xs text-muted-foreground leading-relaxed italic border-l-2 border-l-amber-500">{c.scriptExample}</div>
            </div>
          ))}
        </div>
      </div>

      {/* NLP - Neuro-Linguistic Programming */}
      {data.nlp && (
        <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-lg shrink-0">🧬</div>
            <div>
              <div className="text-base font-extrabold">Neuro-Linguistic Programming</div>
              <div className="text-xs text-muted-foreground mt-0.5">Allen Carr, Richard Bandler - <em>Belief System Dismantling</em></div>
            </div>
          </div>
          <div className="text-xs text-muted-foreground leading-relaxed mb-5 px-4 py-3 bg-background/50 border border-border/30 rounded-xl">{data.nlp.keyPrinciple}</div>

          {/* 5 NLP Techniques */}
          <div className="space-y-3 mb-5">
            {data.nlp.techniques.map((t) => (
              <div key={t.id} className="bg-background/50 border border-border/30 rounded-xl p-4 hover:border-purple-500/20 transition-all" style={{ borderLeft: `3px solid ${t.color}` }}>
                <div className="flex items-center gap-2.5 mb-2">
                  <span className="text-sm font-bold">{t.name}</span>
                  <div className="flex-1 h-1.5 bg-border/30 rounded-full overflow-hidden max-w-[100px]">
                    <div className="h-full rounded-full" style={{ width: `${t.power}%`, background: t.color }} />
                  </div>
                  <span className="text-[10px] font-bold" style={{ color: t.color }}>{t.power}%</span>
                </div>
                <div className="text-xs text-muted-foreground leading-relaxed mb-3">{t.definition}</div>

                {/* Copy Examples */}
                <div className="mb-3">
                  <div className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground/40 mb-1.5">Copy Patterns</div>
                  <div className="space-y-1">
                    {t.copyExamples.map((ex, i) => (
                      <div key={i} className="text-xs text-muted-foreground leading-relaxed px-3 py-1.5 bg-secondary/30 rounded-lg border-l-2" style={{ borderLeftColor: t.color }}>{ex}</div>
                    ))}
                  </div>
                </div>

                {/* Ad Application */}
                <div className="mb-3">
                  <div className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground/40 mb-1.5">Ad Application</div>
                  <div className="text-xs text-muted-foreground leading-relaxed px-3 py-1.5 bg-secondary/30 rounded-lg border-l-2 border-l-violet-500/30">{t.adApplication}</div>
                </div>

                {/* Product-specific example */}
                <div>
                  <div className="text-[10px] uppercase tracking-widest font-bold mb-1.5" style={{ color: t.color }}>For {productName}</div>
                  <div className="bg-secondary/30 rounded-xl px-4 py-3 text-xs text-muted-foreground leading-relaxed italic border-l-2 border-l-amber-500">{t.productExample}</div>
                </div>
              </div>
            ))}
          </div>

          {/* NLP Stack Strategy */}
          <div className="bg-background/50 border border-border/30 rounded-xl p-5">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-sm">🎯</span>
              <span className="text-sm font-extrabold">NLP Stack Strategy for {productName}</span>
            </div>
            <div className="text-xs text-muted-foreground leading-relaxed mb-3">Maximum impact sequence - layer these in order:</div>
            <div className="space-y-1.5">
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
                  <div key={s.step} className="flex items-stretch gap-0">
                    <div className="w-8 flex items-center justify-center text-[10px] font-extrabold text-white shrink-0 rounded-l-lg" style={{ background: color }}>{s.step}</div>
                    <div className="flex-1 bg-secondary/30 border border-border/30 border-l-0 rounded-r-lg px-3 py-2.5">
                      <div className="text-[10px] uppercase tracking-widest font-bold mb-0.5" style={{ color }}>{s.technique}</div>
                      <div className="text-xs text-muted-foreground leading-relaxed italic">{s.script}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
