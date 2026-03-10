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
  const [platformPerAngle, setPlatformPerAngle] = useState<Record<number, string>>({});

  const getActivePlatform = (ei: number) => platformPerAngle[ei] || "tiktok";

  const setPlatform = (ei: number, platform: string) => {
    setPlatformPerAngle((prev) => ({ ...prev, [ei]: platform }));
  };

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
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 border border-violet-500/20 flex items-center justify-center text-lg shrink-0">
          🎨
        </div>
        <div>
          <div className="text-lg font-black tracking-tight">Emotional Angles & Copy</div>
          <div className="text-xs text-muted-foreground mt-0.5">
            {data.emotionalAngles.length} angles × {data.frameworks.length} frameworks — tap to explore scripts
          </div>
        </div>
      </div>

      {data.emotionalAngles.map((angle, ei) => {
        const isAngleOpen = openAngle === ei;
        const scripts = data.scripts[angle.id] || [];
        const activePlatform = getActivePlatform(ei);
        const activePlatformFormats = data.platformFormats.find(
          (pf) => pf.platform.toLowerCase().replace(/[^a-z]/g, "") === activePlatform
        ) || data.platformFormats[0];

        return (
          <div key={angle.id} className="mb-3">
            {/* Emotional Angle Header */}
            <div
              className={`flex items-center gap-3 px-4 py-3.5 bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl cursor-pointer transition-all hover:border-violet-500/30 ${
                isAngleOpen ? "border-violet-500/30 rounded-b-none" : ""
              }`}
              onClick={() => toggleAngle(ei)}
            >
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center text-xs font-extrabold text-white shrink-0 shadow-sm"
                style={{ background: angle.color }}
              >
                {ei + 1}
              </div>
              <div className="text-sm font-bold flex-1">{angle.name}</div>
              <div className="text-xs text-muted-foreground flex-[2] hidden sm:block">{angle.mechanism}</div>
              <svg
                className={`w-4 h-4 text-muted-foreground transition-transform duration-200 ${isAngleOpen ? "rotate-90" : ""}`}
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
              } border border-border/50 border-t-0 rounded-b-2xl bg-card/30 backdrop-blur-sm p-2.5`}
            >
              {/* Frameworks */}
              {data.frameworks.map((fw, fi) => {
                const fwKey = `${ei}-${fi}`;
                const isFwOpen = openFramework === fwKey;
                const script = scripts.find((s) => s.frameworkId === fw.id);

                return (
                  <div key={fw.id}>
                    <div
                      className="flex items-center gap-3 px-3.5 py-2.5 bg-secondary/50 border border-transparent rounded-xl cursor-pointer hover:bg-secondary/80 transition-all"
                      onClick={() => toggleFw(fwKey)}
                    >
                      <div
                        className="w-2 h-2 rounded-full shrink-0"
                        style={{ background: fw.color }}
                      />
                      <span
                        className="px-2 py-0.5 rounded-md text-[10px] font-extrabold tracking-widest shrink-0"
                        style={{ background: fw.color + "15", color: fw.color }}
                      >
                        {fw.abbreviation}
                      </span>
                      <div className="text-xs text-muted-foreground flex-[2]">{fw.name}</div>
                      <svg
                        className={`w-3.5 h-3.5 text-muted-foreground/50 transition-transform duration-200 ${isFwOpen ? "rotate-90" : ""}`}
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path d="M9 18l6-6-6-6" />
                      </svg>
                    </div>

                    <div className={`${isFwOpen ? "block" : "hidden"} pl-7 p-2.5`}>
                      {script && (
                        <div className="space-y-1.5">
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
                              <div key={si} className="bg-background/50 border border-border/30 rounded-xl p-4 pl-[42px] relative">
                                <span
                                  className="absolute left-3 top-4 text-[9px] font-extrabold uppercase tracking-[1.5px] writing-vertical"
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
                <div className="px-2 pt-2">
                  <div className="bg-secondary/30 border border-border/30 rounded-xl p-4">
                    <div className="text-[10px] uppercase tracking-[2px] text-muted-foreground/50 font-bold mb-2.5">
                      Hook Variations ({angle.name})
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {scripts[0].hooks.map((hook, hi) => (
                        <span
                          key={hi}
                          className="inline-block bg-background/50 border border-border/30 rounded-lg px-3 py-1.5 text-xs text-muted-foreground hover:border-violet-500/30 hover:text-foreground transition-all"
                        >
                          {hook}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Platform Formats */}
              <div className="px-2 pt-2 pb-1">
                <div className="bg-secondary/30 border border-border/30 rounded-xl p-4">
                  <div className="flex gap-1.5 items-center mb-3">
                    <span className="text-[10px] uppercase tracking-[2px] text-muted-foreground/50 font-bold mr-1">Platform</span>
                    {platformKeys.map((pk) => (
                      <button
                        key={pk.key}
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-semibold cursor-pointer transition-all ${
                          activePlatform === pk.key
                            ? "bg-violet-500/15 text-violet-400 border border-violet-500/25"
                            : "border border-border/30 bg-background/30 text-muted-foreground/60 hover:text-foreground"
                        }`}
                        onClick={() => setPlatform(ei, pk.key)}
                      >
                        {pk.label}
                      </button>
                    ))}
                  </div>
                  <div className="text-[10px] uppercase tracking-[2px] text-muted-foreground/50 font-bold mb-2">
                    Video Formats ({activePlatformFormats?.platform.toUpperCase() || "TIKTOK"})
                  </div>
                  <div className="space-y-1.5">
                    {(activePlatformFormats?.formats || []).map((fmt, fi) => (
                      <div key={fi} className="flex items-start gap-2.5 py-2 border-b border-border/20 last:border-b-0">
                        <span className="px-2 py-1 rounded-lg text-[10px] font-bold tracking-wide shrink-0 bg-indigo-500/10 text-indigo-400 border border-indigo-500/15">
                          {fmt.type}
                        </span>
                        <span className="text-xs text-muted-foreground leading-relaxed">{fmt.description}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
