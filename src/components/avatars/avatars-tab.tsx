"use client";

import { useState } from "react";
import type { IAvatarData } from "@/types/creative";

interface AvatarsTabProps {
  data: IAvatarData;
}

export function AvatarsTab({ data }: AvatarsTabProps) {
  const [expandedId, setExpandedId] = useState<string | null>(data.avatars[0]?.id || null);

  if (!data.avatars?.length) {
    return <div className="text-sm text-muted-foreground/40 text-center py-16">No avatars generated</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-foreground mb-1">Customer Avatars</h2>
        <p className="text-xs text-muted-foreground/60">5 distinct buyers — click to expand. Use the chat dropdown to talk to any avatar.</p>
      </div>

      <div className="grid grid-cols-5 gap-3">
        {data.avatars.map((avatar) => (
          <button
            key={avatar.id}
            onClick={() => setExpandedId(expandedId === avatar.id ? null : avatar.id)}
            className={`rounded-xl border p-4 text-left transition-all ${
              expandedId === avatar.id
                ? "border-amber-500/40 bg-amber-500/[0.04]"
                : "border-white/[0.08] bg-white/[0.02] hover:border-white/[0.15]"
            }`}
          >
            <pre className="text-[7px] leading-[1.1] text-white/30 font-mono mb-2 overflow-hidden">{avatar.ascii}</pre>
            <div className="text-xs font-semibold text-white/80 truncate">{avatar.name}</div>
            <div className="text-[10px] text-white/30 truncate mt-0.5">{avatar.consciousnessLevel}</div>
          </button>
        ))}
      </div>

      {/* Expanded avatar detail */}
      {expandedId && (() => {
        const avatar = data.avatars.find((a) => a.id === expandedId);
        if (!avatar) return null;

        return (
          <div className="rounded-2xl border border-amber-500/20 bg-amber-500/[0.02] p-6 space-y-5">
            <div className="flex gap-6">
              {/* ASCII portrait */}
              <pre className="text-[9px] leading-[1.2] text-amber-400/40 font-mono shrink-0 bg-black/20 rounded-xl p-4">{avatar.ascii}</pre>

              {/* Core info */}
              <div className="flex-1 space-y-3">
                <div>
                  <h3 className="text-lg font-bold text-white">{avatar.name}</h3>
                  <p className="text-sm text-white/50">{avatar.demographics}</p>
                </div>

                <div className="flex gap-2">
                  <span className="text-[10px] px-2 py-1 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
                    {avatar.consciousnessLevel}
                  </span>
                </div>

                <div>
                  <div className="text-[10px] font-bold text-white/30 uppercase tracking-wider mb-1">Why they buy</div>
                  <p className="text-sm text-white/60">{avatar.whyTheyBuy}</p>
                </div>

                <div>
                  <div className="text-[10px] font-bold text-white/30 uppercase tracking-wider mb-1">Purchase trigger</div>
                  <p className="text-sm text-white/60">{avatar.purchaseTrigger}</p>
                </div>
              </div>
            </div>

            {/* Detail grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-xl bg-white/[0.02] border border-white/[0.06] p-4">
                <div className="text-[10px] font-bold text-white/30 uppercase tracking-wider mb-2">Daily Routine</div>
                <p className="text-[11px] text-white/50 leading-relaxed whitespace-pre-wrap">{avatar.dailyRoutine}</p>
              </div>

              <div className="rounded-xl bg-white/[0.02] border border-white/[0.06] p-4">
                <div className="text-[10px] font-bold text-white/30 uppercase tracking-wider mb-2">Scroll Behavior</div>
                <p className="text-[11px] text-white/50 leading-relaxed">{avatar.scrollBehavior}</p>
              </div>

              <div className="rounded-xl bg-white/[0.02] border border-white/[0.06] p-4">
                <div className="text-[10px] font-bold text-white/30 uppercase tracking-wider mb-2">Pain Language (their exact words)</div>
                <div className="flex flex-wrap gap-1.5">
                  {avatar.painLanguage.map((phrase, i) => (
                    <span key={i} className="text-[10px] px-2 py-1 rounded-lg bg-red-500/[0.06] border border-red-500/[0.12] text-red-400/70">
                      &ldquo;{phrase}&rdquo;
                    </span>
                  ))}
                </div>
              </div>

              <div className="rounded-xl bg-white/[0.02] border border-white/[0.06] p-4">
                <div className="text-[10px] font-bold text-white/30 uppercase tracking-wider mb-2">Objections</div>
                <div className="space-y-1">
                  {avatar.objections.map((obj, i) => (
                    <p key={i} className="text-[11px] text-white/50">&bull; {obj}</p>
                  ))}
                </div>
              </div>

              <div className="rounded-xl bg-white/[0.02] border border-white/[0.06] p-4">
                <div className="text-[10px] font-bold text-white/30 uppercase tracking-wider mb-2">Dream State</div>
                <p className="text-[11px] text-white/50 leading-relaxed">{avatar.dreamState}</p>
              </div>

              <div className="rounded-xl bg-white/[0.02] border border-white/[0.06] p-4">
                <div className="text-[10px] font-bold text-white/30 uppercase tracking-wider mb-2">Voice & Vocabulary</div>
                <p className="text-[11px] text-white/40 mb-2">{avatar.voiceTone}</p>
                <div className="flex flex-wrap gap-1.5">
                  {avatar.vocabularySample.map((phrase, i) => (
                    <span key={i} className="text-[10px] px-2 py-1 rounded-lg bg-cyan-500/[0.06] border border-cyan-500/[0.12] text-cyan-400/70">
                      {phrase}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Research Insights Section */}
            <div className="border-t border-white/[0.06] pt-5 space-y-4">
              <h4 className="text-sm font-bold text-amber-400/80">Research Insights</h4>

              <div className="grid grid-cols-3 gap-4">
                {/* Awareness Stage */}
                <div className="rounded-xl bg-white/[0.02] border border-white/[0.06] p-4">
                  <div className="text-[10px] font-bold text-white/30 uppercase tracking-wider mb-2">Awareness Stage</div>
                  <p className="text-[12px] text-white/60 leading-relaxed">{avatar.awarenessStage || "Not generated"}</p>
                </div>

                {/* Emotional Delta */}
                <div className="rounded-xl bg-white/[0.02] border border-white/[0.06] p-4">
                  <div className="text-[10px] font-bold text-white/30 uppercase tracking-wider mb-2">Emotional Delta</div>
                  {avatar.emotionalDelta ? (
                    <div className="space-y-2">
                      <div>
                        <span className="text-[9px] text-red-400/50 uppercase">Now:</span>
                        <p className="text-[11px] text-white/50">{avatar.emotionalDelta.currentState}</p>
                      </div>
                      <div className="text-center text-white/15">↓</div>
                      <div>
                        <span className="text-[9px] text-green-400/50 uppercase">With product:</span>
                        <p className="text-[11px] text-white/50">{avatar.emotionalDelta.elevatedState}</p>
                      </div>
                      <div className="rounded-lg bg-amber-500/[0.06] border border-amber-500/[0.12] px-3 py-2 mt-2">
                        <span className="text-[9px] text-amber-400/60 uppercase">The gap that sells:</span>
                        <p className="text-[11px] text-amber-400/70 font-medium">{avatar.emotionalDelta.gap}</p>
                      </div>
                    </div>
                  ) : (
                    <p className="text-[11px] text-white/30">Not generated</p>
                  )}
                </div>

                {/* Objection Killers */}
                <div className="rounded-xl bg-white/[0.02] border border-white/[0.06] p-4">
                  <div className="text-[10px] font-bold text-white/30 uppercase tracking-wider mb-2">Objection Insights</div>
                  {avatar.objectionKillers?.length ? (
                    <div className="space-y-2">
                      {avatar.objectionKillers.map((ok, i) => (
                        <div key={i}>
                          <p className="text-[10px] text-red-400/60">&ldquo;{ok.objection}&rdquo;</p>
                          <p className="text-[10px] text-green-400/50 mt-0.5">→ {ok.insight}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-[11px] text-white/30">Not generated</p>
                  )}
                </div>
              </div>

              {/* Hook Inspirations */}
              <div className="rounded-xl bg-white/[0.02] border border-white/[0.06] p-4">
                <div className="text-[10px] font-bold text-white/30 uppercase tracking-wider mb-2">Hook Inspirations (angles from this avatar)</div>
                {avatar.hookInspirations?.length ? (
                  <div className="flex flex-wrap gap-2">
                    {avatar.hookInspirations.map((hook, i) => (
                      <span key={i} className="text-[11px] px-3 py-1.5 rounded-lg bg-purple-500/[0.06] border border-purple-500/[0.12] text-purple-400/70">
                        {hook}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-[11px] text-white/30">Not generated</p>
                )}
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
