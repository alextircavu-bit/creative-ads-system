"use client";

import Link from "next/link";
import { FRAMEWORK_VERSIONS } from "@/config/framework-versions";

const TYPE_STYLES: Record<string, string> = {
  added: "bg-green-500/15 text-green-400",
  changed: "bg-blue-500/15 text-blue-400",
  removed: "bg-red-500/15 text-red-400",
  fixed: "bg-yellow-500/15 text-yellow-400",
};

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col items-center p-8 pt-16">
      <h1 className="text-4xl font-black tracking-tight bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
        Creative Ads System
      </h1>
      <p className="text-muted-foreground text-sm mb-12 max-w-md text-center leading-relaxed">
        AI-powered ad creative generation. Choose your scenario to get started.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
        <Link
          href="/v4"
          className="group block p-8 rounded-2xl border border-border bg-card hover:border-purple-500/50 transition-all"
        >
          <div className="text-xs font-bold uppercase tracking-widest text-purple-400 mb-3">V4</div>
          <div className="text-lg font-bold mb-2">Any Product</div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Create ads for any product or service. Claude Opus for all sections.
          </p>
        </Link>

<Link
          href="/v3"
          className="group block p-8 rounded-2xl border border-border bg-card hover:border-blue-500/50 transition-all"
        >
          <div className="text-xs font-bold uppercase tracking-widest text-blue-400 mb-3">V3</div>
          <div className="text-lg font-bold mb-2">Mobile Apps</div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Mobile app features, benefits, and purpose. Optimized for app install campaigns.
          </p>
        </Link>
      </div>

      {/* Framework + Changelog row */}
      <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-6 w-full max-w-4xl mt-8">
        <Link
          href="/framework"
          className="block p-6 rounded-2xl border border-border bg-card hover:border-cyan-500/50 transition-all"
        >
          <div className="text-xs font-bold uppercase tracking-widest text-cyan-400 mb-2">Reference</div>
          <div className="text-lg font-bold mb-1">Framework Overview</div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Visual map of the pipeline, ad template, copy rules, UGC archetypes, and version history.
          </p>
        </Link>

        {/* Changelog */}
        <div className="rounded-2xl border border-border bg-card p-6 max-h-[420px] overflow-y-auto">
          <div className="text-xs font-bold uppercase tracking-widest text-orange-400 mb-4">Changelog</div>
          <div className="space-y-6">
            {FRAMEWORK_VERSIONS.map((version) => (
              <div key={version.id}>
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-sm font-bold">{version.id}</span>
                  <span className="text-xs text-muted-foreground">{version.date} {version.time}</span>
                  <span className="text-xs font-medium text-foreground/70">{version.label}</span>
                </div>
                <div className="space-y-1 pl-1">
                  {version.changes.map((change, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs">
                      <span className={`shrink-0 px-1.5 py-0.5 rounded font-bold ${TYPE_STYLES[change.type] || ""}`} style={{ fontSize: "9px" }}>
                        {change.type.toUpperCase()}
                      </span>
                      <span className="text-muted-foreground/50 shrink-0 w-24 truncate">{change.section}</span>
                      <span className="text-muted-foreground leading-relaxed">{change.description}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
