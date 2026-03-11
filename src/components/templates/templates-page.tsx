"use client";

import { useState } from "react";
import {
  AD_TEMPLATES,
  EXPERIENCE_TYPE_LABELS,
  type AdTemplate,
  type TemplateCategory,
  type ExperienceType,
} from "@/config/ad-templates";

const CATEGORY_LABELS: Record<TemplateCategory, { label: string; color: string; icon: string }> = {
  app: { label: "Apps & Digital", color: "#818cf8", icon: "📱" },
  physical: { label: "Physical Products", color: "#fb923c", icon: "📦" },
  universal: { label: "Universal", color: "#a78bfa", icon: "🔀" },
};

function TemplateCard({ t }: { t: AdTemplate }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className="bg-card border border-border rounded-2xl p-5 hover:border-white/10 transition-all cursor-pointer"
      onClick={() => setExpanded(!expanded)}
    >
      {/* Top row */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          {t.proven && (
            <span
              className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md"
              style={{ background: `${t.color}20`, color: t.color }}
            >
              ★ Proven
            </span>
          )}
          <span
            className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md"
            style={{ background: `${t.color}15`, color: t.color }}
          >
            {CATEGORY_LABELS[t.category].icon} {CATEGORY_LABELS[t.category].label}
          </span>
        </div>
        <span className="text-[11px] font-semibold text-muted-foreground bg-secondary px-2.5 py-1 rounded-lg">
          {t.timing}
        </span>
      </div>

      {/* Title */}
      <h3 className="text-sm font-bold text-foreground mb-1">{t.title}</h3>
      <p className="text-xs text-muted-foreground leading-relaxed mb-3">{t.subtitle}</p>

      {/* Storyboard frames */}
      <div className="flex gap-1 mb-3">
        {t.frames.map((f, i) => {
          const flex = f.size === "xl" ? "flex-[2]" : f.size === "lg" ? "flex-[1.5]" : f.size === "sm" ? "flex-[0.7]" : "flex-1";
          return (
            <div
              key={i}
              className={`${flex} border border-border rounded-lg p-2 text-center bg-background min-h-[70px] flex flex-col items-center justify-center`}
            >
              <span className="text-base mb-0.5">{f.icon}</span>
              <span className="text-[9px] font-bold uppercase tracking-wider" style={{ color: t.color }}>
                {f.label}
              </span>
              <span className="text-[9px] text-muted-foreground">{f.time}</span>
              {expanded && (
                <span className="text-[9px] text-muted-foreground/70 mt-1 leading-tight">{f.description}</span>
              )}
            </div>
          );
        })}
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-1 mb-2">
        {t.bestFor.map((tag) => (
          <span
            key={tag}
            className="text-[10px] font-semibold px-2 py-0.5 rounded-md border"
            style={{ borderColor: `${t.color}40`, color: t.color, background: `${t.color}10` }}
          >
            {tag}
          </span>
        ))}
        {t.alsoFor.map((tag) => (
          <span key={tag} className="text-[10px] font-semibold px-2 py-0.5 rounded-md border border-border text-muted-foreground">
            {tag}
          </span>
        ))}
      </div>

      {/* Expanded: Why it works + experience */}
      {expanded && (
        <div className="mt-3 space-y-2">
          <div
            className="text-[11px] text-muted-foreground leading-relaxed p-3 bg-background rounded-lg border-l-2"
            style={{ borderLeftColor: t.color }}
          >
            <strong className="text-foreground/70">Why it works: </strong>
            {t.whyItWorks}
          </div>
          <div className="flex flex-wrap gap-1.5">
            {t.experienceTypes.map((et) => (
              <span
                key={et}
                className="text-[9px] font-bold px-2 py-0.5 rounded-md"
                style={{ background: `${EXPERIENCE_TYPE_LABELS[et].color}15`, color: EXPERIENCE_TYPE_LABELS[et].color }}
              >
                {EXPERIENCE_TYPE_LABELS[et].name}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export function TemplatesPage() {
  const [filter, setFilter] = useState<TemplateCategory | "all">("all");
  const [expFilter, setExpFilter] = useState<ExperienceType | "all">("all");

  const filtered = AD_TEMPLATES.filter((t) => {
    if (filter !== "all" && t.category !== filter) return false;
    if (expFilter !== "all" && !t.experienceTypes.includes(expFilter)) return false;
    return true;
  });

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-xl font-bold text-foreground mb-1">Ad Template Library</h2>
        <p className="text-xs text-muted-foreground">
          19 battle-tested short-form video ad formats. The template must mirror how the user experiences the benefit.
        </p>
      </div>

      {/* Stats */}
      <div className="flex gap-6 mb-6">
        {[
          { num: "19", label: "Templates" },
          { num: "21-34s", label: "Sweet Spot" },
          { num: "4x", label: "UGC CTR Lift" },
          { num: "9:16", label: "Aspect Ratio" },
        ].map((s) => (
          <div key={s.label} className="text-center">
            <div className="text-lg font-extrabold text-violet-400">{s.num}</div>
            <div className="text-[9px] uppercase tracking-widest text-muted-foreground">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6">
        {/* Category filter */}
        <div className="flex gap-1">
          <button
            onClick={() => setFilter("all")}
            className={`text-[11px] font-semibold px-3 py-1.5 rounded-lg border transition-all ${
              filter === "all"
                ? "border-violet-500/50 bg-violet-500/10 text-violet-400"
                : "border-border text-muted-foreground hover:text-foreground"
            }`}
          >
            All
          </button>
          {(Object.entries(CATEGORY_LABELS) as [TemplateCategory, typeof CATEGORY_LABELS["app"]][]).map(([key, val]) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`text-[11px] font-semibold px-3 py-1.5 rounded-lg border transition-all ${
                filter === key
                  ? "border-violet-500/50 bg-violet-500/10 text-violet-400"
                  : "border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              {val.icon} {val.label}
            </button>
          ))}
        </div>

        {/* Experience type filter */}
        <div className="flex gap-1">
          <button
            onClick={() => setExpFilter("all")}
            className={`text-[11px] font-semibold px-3 py-1.5 rounded-lg border transition-all ${
              expFilter === "all"
                ? "border-violet-500/50 bg-violet-500/10 text-violet-400"
                : "border-border text-muted-foreground hover:text-foreground"
            }`}
          >
            Any Experience
          </button>
          {(Object.entries(EXPERIENCE_TYPE_LABELS) as [ExperienceType, typeof EXPERIENCE_TYPE_LABELS["in-app"]][]).map(([key, val]) => (
            <button
              key={key}
              onClick={() => setExpFilter(key)}
              className={`text-[11px] font-semibold px-3 py-1.5 rounded-lg border transition-all ${
                expFilter === key
                  ? `bg-opacity-10 text-foreground`
                  : "border-border text-muted-foreground hover:text-foreground"
              }`}
              style={expFilter === key ? { borderColor: `${val.color}50`, background: `${val.color}10`, color: val.color } : {}}
            >
              {val.name}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filtered.map((t) => (
          <TemplateCard key={t.id} t={t} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 text-muted-foreground text-sm">
          No templates match the current filters.
        </div>
      )}
    </div>
  );
}
