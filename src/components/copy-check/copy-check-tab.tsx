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
      <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-6 mb-5">
        <div className="text-base font-extrabold mb-1">Copy Check</div>
        <div className="text-xs text-muted-foreground mb-4">
          Paste your ad copy below. Get instant readability, persuasion, grammar, bias targeting, and framework alignment scores. AI Deep Review is optional.
        </div>
        <textarea
          className="w-full min-h-[160px] bg-background/50 border border-border/30 rounded-xl p-4 text-foreground text-sm leading-loose outline-none resize-y transition-all focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20 placeholder:text-muted-foreground/30"
          placeholder="Paste your ad copy here... hooks, scripts, body copy, CTAs - anything you want analyzed."
          value={copyText}
          onChange={(e) => setCopyText(e.target.value)}
        />
        <div className="flex gap-2 mt-3 items-center flex-wrap">
          <button
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:from-violet-600 hover:to-fuchsia-600 text-white text-sm font-bold transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-violet-500/20"
            onClick={handleAIReview}
            disabled={isAnalyzing || !copyText.trim()}
          >
            {isAnalyzing ? "Analyzing..." : "AI Deep Review"}
          </button>
          <span className="text-[10px] text-muted-foreground/50 ml-auto">{wordCount} words / {copyText.length} chars</span>
        </div>
        {error && <div className="text-xs text-rose-400 mt-2 bg-rose-500/10 px-3 py-1.5 rounded-lg">{error}</div>}
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
      <div className="grid grid-cols-[repeat(auto-fit,minmax(140px,1fr))] gap-3 mb-5">
        {[
          { label: "Overall", value: result.overall },
          { label: "Readability", value: result.flesch.score, sub: result.flesch.grade },
          { label: "Persuasion", value: result.persuasion.score, sub: `${result.persuasion.powerWordCount} power words` },
          { label: "Grammar", value: result.grammar.score, sub: `${result.grammar.issues.length} issue(s)` },
          { label: "Trends", value: result.trends.score, sub: `${result.trends.checks.filter((c) => c.passed).length}/8 passed` },
        ].map((score) => (
          <div key={score.label} className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-4 text-center hover:border-violet-500/20 transition-all">
            <div className="text-3xl font-black mb-0.5" style={{ color: scoreColor(score.value) }}>{score.value}</div>
            <div className="text-[10px] uppercase tracking-[1.5px] text-muted-foreground/40 font-bold">{score.label}</div>
            {score.sub && <div className="text-[10px] text-muted-foreground/40 mt-1">{score.sub}</div>}
          </div>
        ))}
      </div>

      {/* Trend Checks */}
      <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-5 mb-4">
        <div className="text-sm font-bold mb-3">Trend Alignment</div>
        <div className="grid grid-cols-2 gap-2">
          {result.trends.checks.map((check) => (
            <div key={check.name} className="flex items-center gap-2 text-xs py-1">
              <span className={`w-4 h-4 rounded-md flex items-center justify-center text-[10px] ${check.passed ? "bg-green-500/10 text-green-400" : "bg-border/30 text-muted-foreground/30"}`}>
                {check.passed ? "✓" : "✗"}
              </span>
              <span className={check.passed ? "text-foreground" : "text-muted-foreground/40"}>{check.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Grammar Issues */}
      {result.grammar.issues.length > 0 && (
        <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-5 mb-4">
          <div className="text-sm font-bold mb-3">Grammar Issues</div>
          <div className="space-y-2">
            {result.grammar.issues.map((issue, i) => (
              <div key={i} className="flex items-start gap-3 bg-background/50 border border-border/30 rounded-xl p-3">
                <div className="w-2 h-2 rounded-full shrink-0 mt-1.5 bg-amber-500" />
                <div className="text-xs text-muted-foreground">{issue.description}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Biases & Frameworks */}
      <div className="grid grid-cols-2 gap-3 mb-5">
        <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-5">
          <div className="text-sm font-bold mb-3">Biases Detected ({result.biases.length})</div>
          <div className="flex flex-wrap gap-1.5">
            {result.biases.map((b) => (
              <span key={b.name} className="px-2.5 py-1 rounded-lg text-[10px] font-bold border" style={{ background: `${b.color}10`, borderColor: `${b.color}25`, color: b.color }}>
                {b.name} ({b.strength})
              </span>
            ))}
            {result.biases.length === 0 && <span className="text-[10px] text-muted-foreground/40">No biases detected in copy</span>}
          </div>
        </div>
        <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-5">
          <div className="text-sm font-bold mb-3">Frameworks Matched</div>
          <div className="flex flex-wrap gap-1.5">
            {result.frameworks.map((f) => (
              <span key={f} className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-violet-500/10 text-violet-400 border border-violet-500/20">{f}</span>
            ))}
            {result.frameworks.length === 0 && <span className="text-[10px] text-muted-foreground/40">No framework pattern detected</span>}
          </div>
        </div>
      </div>

      {/* Persuasion Breakdown */}
      <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-5 mb-4">
        <div className="text-sm font-bold mb-3">Persuasion Breakdown</div>
        <div className="grid grid-cols-3 gap-2">
          {Object.entries(result.persuasion.emotionBreakdown).map(([cat, count]) => (
            <div key={cat} className="flex items-center justify-between text-xs px-3 py-2 bg-background/50 border border-border/30 rounded-xl">
              <span className="capitalize text-muted-foreground/60">{cat}</span>
              <span className="font-bold text-foreground">{count}</span>
            </div>
          ))}
        </div>
        <div className="flex gap-4 mt-3 text-[10px] text-muted-foreground/40">
          <span className={`flex items-center gap-1 ${result.persuasion.hasQuestion ? "text-green-400" : ""}`}>
            {result.persuasion.hasQuestion ? "✓" : "✗"} Question Hook
          </span>
          <span className={`flex items-center gap-1 ${result.persuasion.hasCTA ? "text-green-400" : ""}`}>
            {result.persuasion.hasCTA ? "✓" : "✗"} CTA Present
          </span>
          <span className={`flex items-center gap-1 ${result.persuasion.hasStats ? "text-green-400" : ""}`}>
            {result.persuasion.hasStats ? "✓" : "✗"} Stats/Numbers
          </span>
        </div>
      </div>
    </div>
  );
}

function AIReviewResults({ result }: { result: CopyCheckResult }) {
  return (
    <div>
      <div className="flex items-center gap-2.5 text-sm font-extrabold mb-4 mt-6">
        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 border border-violet-500/20 flex items-center justify-center text-[10px] font-black text-violet-400 shrink-0">AI</div>
        AI Deep Review
      </div>

      {result.issues.length > 0 && (
        <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-5 mb-4">
          <div className="text-sm font-bold mb-3">Issues Found</div>
          <div className="space-y-2">
            {result.issues.map((issue, i) => {
              const dotColor = issue.severity === "high" ? "#ef4444" : issue.severity === "medium" ? "#f59e0b" : "#3b82f6";
              return (
                <div key={i} className="flex items-start gap-3 bg-background/50 border border-border/30 rounded-xl p-3.5">
                  <div className="w-2 h-2 rounded-full shrink-0 mt-1.5" style={{ background: dotColor }} />
                  <div className="flex-1">
                    <div className="text-xs font-bold mb-0.5">{issue.title}</div>
                    <div className="text-xs text-muted-foreground leading-relaxed">{issue.description}</div>
                    <div className="text-xs text-green-400 mt-1.5 italic">{issue.fix}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {result.rewriteSuggestion && (
        <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-5 mb-4">
          <div className="text-sm font-bold mb-3">AI Rewrite Suggestion</div>
          <div className="bg-background/50 border border-border/30 rounded-xl p-4 text-sm text-foreground leading-relaxed whitespace-pre-wrap">
            {result.rewriteSuggestion}
          </div>
        </div>
      )}
    </div>
  );
}
