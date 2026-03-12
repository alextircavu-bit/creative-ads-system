import type {
  ProjectInput,
  CreativeTreeData,
  PsycheMapData,
  SalesPlaybookData,
  ResearchData,
  TopCreativesData,
  CopyCheckResult,
  GenerationResult,
  CreativeFeedback,
} from "@/types/creative";

const API_BASE = "/api";

async function postJSON<T>(url: string, body: unknown): Promise<T> {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || "API request failed");
  }

  return res.json();
}

// Context from previous sections, passed to inform subsequent ones
interface GenerationContext {
  psycheMap?: PsycheMapData;
  salesPlaybook?: SalesPlaybookData;
  research?: ResearchData;
  creativeTree?: CreativeTreeData;
  feedback?: CreativeFeedback;
  existingCreatives?: { name: string; emotion: string; targetSegment?: string; hookTexts: string[] }[];
}

export const generationRepository = {
  // 1. Psyche Map - generated FIRST (no context needed)
  async generatePsycheMap(input: ProjectInput): Promise<PsycheMapData> {
    return postJSON(`${API_BASE}/generate`, { input, section: "psycheMap" });
  },

  // 2. Sales Playbook - receives Psyche Map
  async generateSalesPlaybook(input: ProjectInput, context?: GenerationContext): Promise<SalesPlaybookData> {
    return postJSON(`${API_BASE}/generate`, { input, section: "salesPlaybook", context });
  },

  // 3. Research - receives Psyche Map + Sales Playbook
  async generateResearch(input: ProjectInput, context?: GenerationContext): Promise<ResearchData> {
    return postJSON(`${API_BASE}/generate`, { input, section: "research", context });
  },

  // 4. Creative Tree - receives ALL (generated LAST)
  async generateCreativeTree(input: ProjectInput, context?: GenerationContext): Promise<CreativeTreeData> {
    return postJSON(`${API_BASE}/generate`, { input, section: "creativeTree", context });
  },

  // 5. Top Creatives - receives ALL
  async generateTopCreatives(input: ProjectInput, context?: GenerationContext): Promise<TopCreativesData> {
    return postJSON(`${API_BASE}/generate`, { input, section: "topCreatives", context });
  },

  // Full generation (all at once - server handles ordering)
  async generateAll(input: ProjectInput): Promise<GenerationResult> {
    return postJSON(`${API_BASE}/generate`, { input, section: "all" });
  },

  // Copy Check - AI deep review (local scoring is separate in lib/copy-check.ts)
  async analyzeCopy(input: ProjectInput, copyText: string): Promise<CopyCheckResult> {
    return postJSON(`${API_BASE}/analyze-copy`, { input, copyText });
  },
};
