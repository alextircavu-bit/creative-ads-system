"use client";

import { useState, useMemo } from "react";
import { useAnalyzeCopy } from "@/hooks/use-generation";
import { runLocalCopyCheck, type CopyCheckLocalResult } from "@/lib/copy-check";
import type { ProjectInput, CopyCheckResult } from "@/types/creative";

interface CopyCheckTabProps {
  input: ProjectInput;
}

export function CopyCheckTab({ input }: CopyCheckTabProps) {
  const [copyText, setCopyText] = useState("");
  const { analyze, result: aiResult, isAnalyzing, error } = useAnalyzeCopy();

  const wordCount = copyText.trim() ? copyText.trim().split(/\s+/).length : 0;

  const localResult = useMemo(() => {
    if (!copyText.trim()) return null;
    return runLocalCopyCheck(copyText);
  }, [copyText]);

  const handleAIReview = () => {
    if (!copyText.trim()) return;
    analyze({ input, copyText });
  };

  return (
    <div className="max-w-[900px] mx-auto">
      {/* Input */}
      <div className="border border-border/50 rounded-lg p-5 mb-5">
        <h2 className="text-sm font-semibold text-foreground mb-0.5">Copy Check</h2>
        <p className="text-xs text-muted-foreground mb-4">
          Paste your ad copy below for instant scoring. AI Deep Review is optional.
        </p>
        <textarea
          className="w-full min-h-[160px] bg-background border border-border/50 rounded-md p-4 text-foreground text-sm leading-loose outline-none resize-y transition-colors focus:border-primary/50 placeholder:text-muted-foreground/30"
          placeholder="Paste your ad copy here..."
          value={copyText}
          onChange={(e) => setCopyText(e.target.value)}
        />
        <div className="flex gap-2 mt-3 items-center flex-wrap">
          <button
            className="px-5 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium transition-colors hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed"
            onClick={handleAIReview}
            disabled={isAnalyzing || !copyText.trim()}
          >
            {isAnalyzing ? "Analyzing..." : "AI Deep Review"}
          </button>
          <span className="text-[11px] text-muted-foreground/50 ml-auto tabular-nums">{wordCount} words / {copyText.length} chars</span>
        </div>
        {error && <div className="text-xs text-destructive mt-2 bg-destructive/10 px-3 py-1.5 rounded-md">{error}</div>}
      </div>

      {localResult && <LocalScoreResults result={localResult} />}
      {aiResult && <AIReviewResults result={aiResult} />}
    </div>
  );
}

function LocalScoreResults({ result }: { result: CopyCheckLocalResult }) {
  const scoreColor = (val: number) => val >= 60 ? "#22c55e" : val >= 40 ? "#f59e0b" : "#ef4444";

  return (
    <div>
      {/* Overall + Core Scores */}
      <div className="grid grid-cols-[repeat(auto-fit,minmax(140px,1fr))] gap-2 mb-5">
        {[
          { label: "Overall", value: result.overall },
          { label: "Readability", value: result.flesch.score, sub: result.flesch.grade },
          { label: "Persuasion", value: result.persuasion.score, sub: `${result.persuasion.powerWordCount} power words` },
          { label: "Grammar", value: result.grammar.score, sub: `${result.grammar.issues.length} issue(s)` },
          { label: "Trends", value: result.trends.score, sub: `${result.trends.checks.filter((c) => c.passed).length}/8 passed` },
        ].map((score) => (
          <div key={score.label} className="border border-border/40 rounded-md p-4 text-center">
            <div className="text-2xl font-bold tabular-nums mb-0.5" style={{ color: scoreColor(score.value) }}>{score.value}</div>
            <div className="text-[11px] text-muted-foreground font-medium">{score.label}</div>
            {score.sub && <div className="text-[10px] text-muted-foreground/40 mt-0.5">{score.sub}</div>}
          </div>
        ))}
      </div>

      {/* Trend Checks */}
      <div className="border border-border/40 rounded-md p-4 mb-4">
        <div className="text-xs font-semibold text-foreground mb-3">Trend Alignment</div>
        <div className="grid grid-cols-2 gap-1.5">
          {result.trends.checks.map((check) => (
            <div key={check.name} className="flex items-center gap-2 text-xs py-1">
              <span className={`w-3.5 h-3.5 rounded flex items-center justify-center text-[9px] ${check.passed ? "bg-green-500/15 text-green-400" : "bg-muted/50 text-muted-foreground/30"}`}>
                {check.passed ? "\u2713" : "\u2717"}
              </span>
              <span className={check.passed ? "text-foreground" : "text-muted-foreground/40"}>{check.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Grammar Issues */}
      {result.grammar.issues.length > 0 && (
        <div className="border border-border/40 rounded-md p-4 mb-4">
          <div className="text-xs font-semibold text-foreground mb-3">Grammar Issues</div>
          <div className="space-y-1.5">
            {result.grammar.issues.map((issue, i) => (
              <div key={i} className="flex items-start gap-2.5 text-xs text-muted-foreground py-1.5">
                <div className="w-1.5 h-1.5 rounded-full shrink-0 mt-1.5 bg-amber-500" />
                {issue.description}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Biases & Frameworks */}
      <div className="grid grid-cols-2 gap-3 mb-5">
        <div className="border border-border/40 rounded-md p-4">
          <div className="text-xs font-semibold text-foreground mb-3">Biases Detected ({result.biases.length})</div>
          <div className="flex flex-wrap gap-1">
            {result.biases.map((b) => (
              <span key={b.name} className="px-2 py-0.5 rounded text-[10px] font-medium border border-border/30 text-muted-foreground">
                {b.name} ({b.strength})
              </span>
            ))}
            {result.biases.length === 0 && <span className="text-[10px] text-muted-foreground/40">No biases detected</span>}
          </div>
        </div>
        <div className="border border-border/40 rounded-md p-4">
          <div className="text-xs font-semibold text-foreground mb-3">Frameworks Matched</div>
          <div className="flex flex-wrap gap-1">
            {result.frameworks.map((f) => (
              <span key={f} className="px-2 py-0.5 rounded text-[10px] font-medium bg-primary/10 text-primary border border-primary/20">{f}</span>
            ))}
            {result.frameworks.length === 0 && <span className="text-[10px] text-muted-foreground/40">No framework pattern detected</span>}
          </div>
        </div>
      </div>

      {/* Persuasion Breakdown */}
      <div className="border border-border/40 rounded-md p-4 mb-4">
        <div className="text-xs font-semibold text-foreground mb-3">Persuasion Breakdown</div>
        <div className="grid grid-cols-3 gap-1.5">
          {Object.entries(result.persuasion.emotionBreakdown).map(([cat, count]) => (
            <div key={cat} className="flex items-center justify-between text-xs px-3 py-1.5 bg-muted/30 rounded">
              <span className="capitalize text-muted-foreground">{cat}</span>
              <span className="font-semibold text-foreground tabular-nums">{count}</span>
            </div>
          ))}
        </div>
        <div className="flex gap-4 mt-3 text-[10px] text-muted-foreground/50">
          <span className={`flex items-center gap-1 ${result.persuasion.hasQuestion ? "text-green-400" : ""}`}>
            {result.persuasion.hasQuestion ? "\u2713" : "\u2717"} Question Hook
          </span>
          <span className={`flex items-center gap-1 ${result.persuasion.hasCTA ? "text-green-400" : ""}`}>
            {result.persuasion.hasCTA ? "\u2713" : "\u2717"} CTA Present
          </span>
          <span className={`flex items-center gap-1 ${result.persuasion.hasStats ? "text-green-400" : ""}`}>
            {result.persuasion.hasStats ? "\u2713" : "\u2717"} Stats/Numbers
          </span>
        </div>
      </div>
    </div>
  );
}

function AIReviewResults({ result }: { result: CopyCheckResult }) {
  return (
    <div className="mt-6">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-6 h-6 rounded bg-primary/15 flex items-center justify-center">
          <svg className="w-3.5 h-3.5 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2a5 5 0 015 5v3H7V7a5 5 0 015-5z" />
            <rect x="3" y="10" width="18" height="12" rx="2" />
          </svg>
        </div>
        <span className="text-sm font-semibold text-foreground">AI Deep Review</span>
      </div>

      {result.issues.length > 0 && (
        <div className="border border-border/40 rounded-md p-4 mb-4">
          <div className="text-xs font-semibold text-foreground mb-3">Issues Found</div>
          <div className="space-y-2">
            {result.issues.map((issue, i) => {
              const dotColor = issue.severity === "high" ? "#ef4444" : issue.severity === "medium" ? "#f59e0b" : "#3b82f6";
              return (
                <div key={i} className="flex items-start gap-2.5 py-2 border-b border-border/20 last:border-b-0">
                  <div className="w-1.5 h-1.5 rounded-full shrink-0 mt-1.5" style={{ background: dotColor }} />
                  <div className="flex-1">
                    <div className="text-xs font-medium text-foreground mb-0.5">{issue.title}</div>
                    <div className="text-xs text-muted-foreground leading-relaxed">{issue.description}</div>
                    <div className="text-xs text-green-400 mt-1 italic">{issue.fix}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {result.rewriteSuggestion && (
        <div className="border border-border/40 rounded-md p-4 mb-4">
          <div className="text-xs font-semibold text-foreground mb-3">AI Rewrite Suggestion</div>
          <div className="bg-muted/30 rounded-md p-4 text-sm text-foreground leading-relaxed whitespace-pre-wrap">
            {result.rewriteSuggestion}
          </div>
        </div>
      )}
    </div>
  );
}
