"use client";

import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8">
      <h1 className="text-4xl font-black tracking-tight bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
        Creative Ads System
      </h1>
      <p className="text-muted-foreground text-sm mb-12 max-w-md text-center leading-relaxed">
        AI-powered ad creative generation. Choose your scenario to get started.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl">
        <Link
          href="/v4"
          className="group block p-8 rounded-2xl border border-border bg-card hover:border-purple-500/50 transition-all"
        >
          <div className="text-xs font-bold uppercase tracking-widest text-purple-400 mb-3">V4</div>
          <div className="text-lg font-bold mb-2">Any Product</div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Create ads for any product or service. Enter your product details and get a complete ad creative system.
          </p>
        </Link>

        <Link
          href="/v3"
          className="group block p-8 rounded-2xl border border-border bg-card hover:border-blue-500/50 transition-all"
        >
          <div className="text-xs font-bold uppercase tracking-widest text-blue-400 mb-3">V3</div>
          <div className="text-lg font-bold mb-2">Mobile Apps</div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Create ads for mobile app features, benefits, and purpose. Optimized for app install campaigns.
          </p>
        </Link>
      </div>
    </div>
  );
}
