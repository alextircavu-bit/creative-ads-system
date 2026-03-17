"use client";

import { useState } from "react";
import type { CreativeTreeData } from "@/types/creative";

interface CreativeTreeTabProps {
  data: CreativeTreeData;
  productName: string;
}

export function CreativeTreeTab({ data, productName }: CreativeTreeTabProps) {
  const [openAngle, setOpenAngle] = useState<number | null>(null);
  const [openFramework, setOpenFramework] = useState<string | null>(null);
  const [globalPlatform, setGlobalPlatform] = useState("tiktok");

  const toggleAngle = (ei: number) => {
    setOpenAngle(openAngle === ei ? null : ei);
  };

  const toggleFw = (key: string) => {
    setOpenFramework(openFramework === key ? null : key);
  };

  const platformKeys = data.platformFormats.map((pf) => ({
    key: pf.platform.toLowerCase().replace(/[^a-z]/g, ""),
    label: pf.platform,
    formats: pf.formats,
  }));

  return (
    <div>
      {/* Section header */}
      <div className="mb-5">
        <h2 className="text-sm font-semibold tracking-tight text-foreground">Emotional Angles & Copy</h2>
        <p className="text-xs text-muted-foreground mt-0.5">
          {data.emotionalAngles.length} angles / {data.frameworks.length} frameworks
        </p>
      </div>

      <div className="flex gap-6">
      {/* Left — Emotional Angles */}
      <div className="flex-[3] min-w-0">
      {data.emotionalAngles.map((angle, ei) => {
        const isAngleOpen = openAngle === ei;
        const scripts = data.scripts[angle.id] || [];

        return (
          <div key={angle.id} className="border-b border-border/40 last:border-b-0">
            {/* Emotional Angle Header */}
            <div
              className={`flex items-center gap-3 px-3 py-2.5 cursor-pointer transition-colors hover:bg-muted/50 ${
                isAngleOpen ? "bg-muted/30" : ""
              }`}
              onClick={() => toggleAngle(ei)}
            >
              <div
                className="w-5 h-5 rounded flex items-center justify-center text-[10px] font-semibold text-white shrink-0"
                style={{ background: angle.color }}
              >
                {ei + 1}
              </div>
              <div className="text-sm font-medium flex-1 text-foreground">{angle.name}</div>
              <div className="text-xs text-muted-foreground flex-[2] hidden sm:block">{angle.mechanism}</div>
              <svg
                className={`w-3.5 h-3.5 text-muted-foreground/60 transition-transform duration-150 ${isAngleOpen ? "rotate-90" : ""}`}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M9 18l6-6-6-6" />
              </svg>
            </div>

            {/* Expanded Panel */}
            <div
              className={`${
                isAngleOpen ? "block" : "hidden"
              } border-t border-border/30 bg-muted/20 pl-8 pr-3 py-2`}
            >
              {/* Frameworks */}
              {scripts.length === 0 && (
                <div className="px-3 py-5 text-center text-xs text-muted-foreground/50">
                  No scripts generated for this territory — it scored lower in relevance for this product.
                </div>
              )}
              {scripts.length > 0 && data.frameworks.map((fw, fi) => {
                const fwKey = `${ei}-${fi}`;
                const isFwOpen = openFramework === fwKey;
                const script = scripts.find((s) => s.frameworkId === fw.id);

                return (
                  <div key={fw.id} className="border-b border-border/20 last:border-b-0">
                    <div
                      className="flex items-center gap-2.5 px-2 py-2 cursor-pointer transition-colors hover:bg-muted/40"
                      onClick={() => toggleFw(fwKey)}
                    >
                      <div
                        className="w-1.5 h-1.5 rounded-full shrink-0"
                        style={{ background: fw.color }}
                      />
                      <span
                        className="px-1.5 py-px rounded text-[10px] font-bold tracking-wider shrink-0"
                        style={{ background: fw.color + "12", color: fw.color }}
                      >
                        {fw.abbreviation}
                      </span>
                      <div className="text-xs text-muted-foreground flex-[2]">{fw.name}</div>
                      <svg
                        className={`w-3 h-3 text-muted-foreground/40 transition-transform duration-150 ${isFwOpen ? "rotate-90" : ""}`}
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path d="M9 18l6-6-6-6" />
                      </svg>
                    </div>

                    <div className={`${isFwOpen ? "block" : "hidden"} pl-5 pb-2.5 pt-1`}>
                      {script && (
                        <div className="space-y-px">
                          {script.steps.map((step, si) => {
                            const stepColorMap: Record<string, string> = {
                              problem: "#f43f5e", agitate: "#f59e0b",
                              solution: "#22c55e", cta: "#3b82f6",
                              before: "#f43f5e", after: "#22c55e",
                              attention: "#f43f5e", interest: "#f59e0b",
                              desire: "#22c55e",
                            };
                            const stepColor = stepColorMap[step.type] || "#64748b";
                            return (
                              <div key={si} className="flex gap-3 py-2 border-b border-border/10 last:border-b-0">
                                <span
                                  className="text-[9px] font-bold uppercase tracking-[1px] w-16 shrink-0 pt-0.5 text-right"
                                  style={{ color: stepColor }}
                                >
                                  {step.label}
                                </span>
                                <div className="text-sm text-muted-foreground leading-relaxed">{step.text}</div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}

              {/* Hooks Section */}
              {scripts.length > 0 && scripts[0]?.hooks?.length > 0 && (
                <div className="pt-2 pb-1">
                  <div className="text-[10px] uppercase tracking-[1.5px] text-muted-foreground/40 font-semibold mb-2">
                    Hook Variations
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {scripts[0].hooks.map((hook, hi) => (
                      <span
                        key={hi}
                        className="inline-block border border-border/30 rounded px-2 py-1 text-xs text-muted-foreground hover:text-foreground hover:border-violet-500/30 transition-colors"
                      >
                        {hook}
                      </span>
                    ))}
                  </div>
                </div>
              )}

            </div>
          </div>
        );
      })}
      </div>

      {/* Right — Platform Video Formats (sticky) */}
      {data.platformFormats?.length > 0 && (
        <div className="flex-[2] min-w-[260px]">
          <div className="sticky top-4">
            <div className="mb-3">
              <div className="flex items-center gap-2 mb-0.5">
                <svg className="w-3.5 h-3.5 text-muted-foreground/60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="3" width="20" height="14" rx="2" />
                  <path d="M8 21h8" />
                  <path d="M12 17v4" />
                </svg>
                <span className="text-sm font-semibold text-foreground">Video Formats</span>
              </div>
              <p className="text-[10px] text-muted-foreground ml-5.5">Per platform</p>
            </div>

            <div className="border border-border/40 rounded-md p-3">
              <div className="flex gap-1 mb-3 border-b border-border/30 pb-2">
                {platformKeys.map((pk) => (
                  <button
                    key={pk.key}
                    className={`px-2 py-0.5 text-[11px] font-medium cursor-pointer transition-colors rounded-sm ${
                      globalPlatform === pk.key
                        ? "text-violet-400 bg-violet-500/10"
                        : "text-muted-foreground/50 hover:text-foreground"
                    }`}
                    onClick={() => setGlobalPlatform(pk.key)}
                  >
                    {pk.label}
                  </button>
                ))}
              </div>

              <div className="space-y-0">
                {(data.platformFormats.find(
                  (pf) => pf.platform.toLowerCase().replace(/[^a-z]/g, "") === globalPlatform
                ) || data.platformFormats[0])?.formats.map((fmt, fi) => (
                  <div key={fi} className="py-2 border-b border-border/15 last:border-b-0">
                    <span
                      className="inline-block text-[9px] font-semibold tracking-wide text-indigo-400/80 uppercase mb-0.5"
                    >
                      {fmt.type}
                    </span>
                    <div className="text-[11px] text-muted-foreground leading-relaxed">{fmt.description}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
}
