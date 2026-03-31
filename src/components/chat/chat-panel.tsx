"use client";

import { useState, useRef, useEffect } from "react";

const LOADING_WORDS = [
  "doodling", "bamboozling", "overthinking", "spiraling", "manifesting",
  "caffeinating", "procrastinating", "hallucinating", "brainstorming",
  "vibing", "cooking", "marinating", "percolating", "noodling",
  "scheming", "daydreaming", "yapping", "pondering", "riffing",
];

function LoadingBubble() {
  const [wordIndex, setWordIndex] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setWordIndex((i) => (i + 1) % LOADING_WORDS.length);
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex justify-start">
      <div className="bg-white/[0.04] border border-white/[0.06] rounded-2xl px-4 py-3 flex items-center gap-2">
        <div className="flex items-center gap-1">
          <div className="w-1.5 h-1.5 rounded-full bg-white/20 animate-pulse" />
          <div className="w-1.5 h-1.5 rounded-full bg-white/20 animate-pulse" style={{ animationDelay: "0.2s" }} />
          <div className="w-1.5 h-1.5 rounded-full bg-white/20 animate-pulse" style={{ animationDelay: "0.4s" }} />
        </div>
        <span className="text-[10px] text-white/20 italic">{LOADING_WORDS[wordIndex]}...</span>
      </div>
    </div>
  );
}

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

interface AvatarOption {
  id: string;
  name: string;
  chatSystemPrompt: string;
}

interface ChatPanelProps {
  isOpen: boolean;
  onClose: () => void;
  systemContext: string;
  savedMessages?: ChatMessage[];
  onSaveMessages?: (messages: ChatMessage[]) => void;
  alwaysOpen?: boolean;
  synopsis?: string;
  avatars?: AvatarOption[];
}

export function ChatPanel({ isOpen, onClose, systemContext, savedMessages, onSaveMessages, alwaysOpen, synopsis, avatars }: ChatPanelProps) {
  const [selectedAvatar, setSelectedAvatar] = useState<string>("strategist");
  const [messages, setMessages] = useState<ChatMessage[]>(savedMessages || []);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Load saved messages when they change
  useEffect(() => {
    if (savedMessages?.length && messages.length === 0) {
      setMessages(savedMessages);
    }
  }, [savedMessages]);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Focus input when panel opens
  useEffect(() => {
    if (isOpen) setTimeout(() => inputRef.current?.focus(), 300);
  }, [isOpen]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      role: "user",
      content: input.trim(),
      timestamp: new Date().toISOString(),
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);

    try {
      const apiMessages = newMessages.map((m) => ({ role: m.role, content: m.content }));

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: apiMessages,
          systemContext: selectedAvatar !== "strategist" && avatars
            ? (avatars.find(a => a.id === selectedAvatar)?.chatSystemPrompt || systemContext)
            : systemContext,
        }),
      });

      const data = await res.json();

      if (data.error) throw new Error(data.error);

      const assistantMessage: ChatMessage = {
        role: "assistant",
        content: data.reply,
        timestamp: new Date().toISOString(),
      };

      const updated = [...newMessages, assistantMessage];
      setMessages(updated);
      onSaveMessages?.(updated);
    } catch (err) {
      const errorMessage: ChatMessage = {
        role: "assistant",
        content: `Error: ${err instanceof Error ? err.message : "Failed to get response"}`,
        timestamp: new Date().toISOString(),
      };
      const updated = [...newMessages, errorMessage];
      setMessages(updated);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([]);
    onSaveMessages?.([]);
  };

  return (
    <>
      {/* Backdrop — only for non-always-open mode */}
      {isOpen && !alwaysOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-40"
          onClick={onClose}
        />
      )}

      {/* Panel */}
      <div
        className={`${alwaysOpen ? "h-full w-full" : "fixed top-0 right-0 h-full w-[480px] z-50 transition-transform duration-300"} bg-[#0a0a0f] border-l border-white/[0.08] flex flex-col ${
          !alwaysOpen && !isOpen ? "translate-x-full" : ""
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06]">
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-bold text-white">Creative Sparring</h3>
            {avatars && avatars.length > 0 ? (
              <select
                value={selectedAvatar}
                onChange={(e) => setSelectedAvatar(e.target.value)}
                className="mt-1 text-[10px] bg-transparent border border-white/[0.08] rounded-md px-2 py-1 text-white/50 focus:outline-none focus:border-white/[0.2] w-full"
              >
                <option value="strategist" className="bg-[#0a0a0f]">Strategist (deep dive context)</option>
                {avatars.map((a) => (
                  <option key={a.id} value={a.id} className="bg-[#0a0a0f]">Talk to: {a.name}</option>
                ))}
              </select>
            ) : (
              <p className="text-[10px] text-white/30">Opus with full deep dive context</p>
            )}
          </div>
          <div className="flex items-center gap-2">
            {messages.length > 0 && (
              <button
                onClick={clearChat}
                className="text-[10px] text-white/20 hover:text-white/50 transition-colors px-2 py-1"
              >
                Clear
              </button>
            )}
            {!alwaysOpen && (
              <button
                onClick={onClose}
                className="w-7 h-7 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] flex items-center justify-center transition-colors"
              >
                <svg className="w-4 h-4 text-white/40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
          {/* Synopsis context message */}
          {synopsis && (
            <div className="flex justify-start">
              <div className="max-w-[95%] rounded-2xl px-4 py-3 bg-amber-500/[0.06] border border-amber-500/[0.12]">
                <div className="flex items-center gap-1.5 mb-2">
                  <div className="w-2 h-2 rounded-full bg-amber-400/40" />
                  <span className="text-[9px] font-bold text-amber-400/60 uppercase tracking-wider">Deep Dive Synopsis</span>
                </div>
                <p className="text-[12px] text-white/60 leading-relaxed whitespace-pre-wrap">{synopsis}</p>
              </div>
            </div>
          )}

          {/* Suggestion buttons when synopsis present but no messages yet */}
          {synopsis && messages.length === 0 && (
            <div className="flex flex-wrap gap-1.5 justify-center mt-2">
              {[
                "What's the strongest angle here?",
                "Give me 10 hook ideas",
                "How does this audience talk?",
                "What would make them stop scrolling?",
                "What are competitors missing?",
              ].map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => { setInput(suggestion); inputRef.current?.focus(); }}
                  className="text-[10px] px-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/[0.06] text-white/30 hover:text-white/50 hover:bg-white/[0.06] transition-colors"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          )}

          {messages.length === 0 && !synopsis && (
            <div className="text-center py-16">
              <div className="text-white/10 text-4xl mb-4">💬</div>
              <p className="text-sm text-white/20 mb-2">Bounce ideas with Opus</p>
              <p className="text-[11px] text-white/10 max-w-[280px] mx-auto leading-relaxed">
                Full deep dive context loaded. Ask about hooks, angles, audiences, stories — anything about this product.
              </p>
              <div className="flex flex-wrap gap-1.5 justify-center mt-6">
                {[
                  "Give me 5 hook ideas",
                  "What angles haven't we tried?",
                  "How would a zoomer talk about this?",
                  "Strongest emotional territory?",
                ].map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => { setInput(suggestion); inputRef.current?.focus(); }}
                    className="text-[10px] px-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/[0.06] text-white/30 hover:text-white/50 hover:bg-white/[0.06] transition-colors"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                  msg.role === "user"
                    ? "bg-blue-500/15 border border-blue-500/20 text-white/90"
                    : "bg-white/[0.04] border border-white/[0.06] text-white/70"
                }`}
              >
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                <p className="text-[9px] text-white/15 mt-2">
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </p>
              </div>
            </div>
          ))}

          {isLoading && <LoadingBubble />}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="px-4 py-3 border-t border-white/[0.06]">
          <div className="flex gap-2">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage();
                }
              }}
              placeholder="Ask anything about this product..."
              className="flex-1 rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-3 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-white/[0.15] resize-none"
              rows={2}
            />
            <button
              onClick={sendMessage}
              disabled={!input.trim() || isLoading}
              className="self-end px-4 py-3 rounded-xl bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 text-blue-400 text-sm font-medium transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
