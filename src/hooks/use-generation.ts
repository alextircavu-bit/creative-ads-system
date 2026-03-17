import { useState, useCallback } from "react";
import useSWRMutation from "swr/mutation";
import { generationRepository } from "@/repositories/generation.repository";
import { projectRepository } from "@/repositories/project.repository";
import type {
  ProjectInput,
  GenerationResult,
  CreativeTreeData,
  PsycheMapData,
  SalesPlaybookData,
  ResearchData,
  TopCreativesData,
  CopyCheckResult,
} from "@/types/creative";

// --- Full Generation (all sections at once) ---

export function useGenerateAll() {
  const [result, setResult] = useState<GenerationResult | null>(null);

  const { trigger, isMutating, error } = useSWRMutation(
    "generate-all",
    async (_key: string, { arg }: { arg: { input: ProjectInput; projectId?: string } }) => {
      if (arg.projectId) {
        await projectRepository.updateStatus(arg.projectId, "generating");
      }

      try {
        const res = await generationRepository.generateAll(arg.input);
        setResult(res);

        if (arg.projectId) {
          await projectRepository.saveResult(arg.projectId, res);
        }

        return res;
      } catch (err) {
        if (arg.projectId) {
          await projectRepository.updateStatus(arg.projectId, "failed");
        }
        throw err;
      }
    }
  );

  return {
    generate: trigger,
    result,
    isGenerating: isMutating,
    error: error?.message ?? null,
  };
}

// --- Section-by-section generation ---

export function useGeneratePsycheMap() {
  const [data, setData] = useState<PsycheMapData | null>(null);

  const { trigger, isMutating, error } = useSWRMutation(
    "generate-psyche-map",
    async (_key: string, { arg }: { arg: ProjectInput }) => {
      const res = await generationRepository.generatePsycheMap(arg);
      setData(res);
      return res;
    }
  );

  return { generate: trigger, data, isGenerating: isMutating, error: error?.message ?? null };
}

export function useGenerateSalesPlaybook() {
  const [data, setData] = useState<SalesPlaybookData | null>(null);

  const { trigger, isMutating, error } = useSWRMutation(
    "generate-sales-playbook",
    async (_key: string, { arg }: { arg: { input: ProjectInput; context?: { psycheMap?: PsycheMapData } } }) => {
      const res = await generationRepository.generateSalesPlaybook(arg.input, arg.context);
      setData(res);
      return res;
    }
  );

  return { generate: trigger, data, isGenerating: isMutating, error: error?.message ?? null };
}

export function useGenerateResearch() {
  const [data, setData] = useState<ResearchData | null>(null);

  const { trigger, isMutating, error } = useSWRMutation(
    "generate-research",
    async (_key: string, { arg }: { arg: { input: ProjectInput; context?: { psycheMap?: PsycheMapData; salesPlaybook?: SalesPlaybookData } } }) => {
      const res = await generationRepository.generateResearch(arg.input, arg.context);
      setData(res);
      return res;
    }
  );

  return { generate: trigger, data, isGenerating: isMutating, error: error?.message ?? null };
}

export function useGenerateCreativeTree() {
  const [data, setData] = useState<CreativeTreeData | null>(null);

  const { trigger, isMutating, error } = useSWRMutation(
    "generate-creative-tree",
    async (_key: string, { arg }: { arg: { input: ProjectInput; context?: { psycheMap?: PsycheMapData; salesPlaybook?: SalesPlaybookData; research?: ResearchData } } }) => {
      const res = await generationRepository.generateCreativeTree(arg.input, arg.context);
      setData(res);
      return res;
    }
  );

  return { generate: trigger, data, isGenerating: isMutating, error: error?.message ?? null };
}

export function useGenerateTopCreatives() {
  const [data, setData] = useState<TopCreativesData | null>(null);

  const { trigger, isMutating, error } = useSWRMutation(
    "generate-top-creatives",
    async (_key: string, { arg }: { arg: { input: ProjectInput; context?: { psycheMap?: PsycheMapData; salesPlaybook?: SalesPlaybookData; research?: ResearchData; creativeTree?: CreativeTreeData } } }) => {
      const res = await generationRepository.generateTopCreatives(arg.input, arg.context);
      setData(res);
      return res;
    }
  );

  return { generate: trigger, data, isGenerating: isMutating, error: error?.message ?? null };
}

// --- Copy Check ---

export function useAnalyzeCopy() {
  const [result, setResult] = useState<CopyCheckResult | null>(null);

  const { trigger, isMutating, error } = useSWRMutation(
    "analyze-copy",
    async (_key: string, { arg }: { arg: { input: ProjectInput; copyText: string } }) => {
      const res = await generationRepository.analyzeCopy(arg.input, arg.copyText);
      setResult(res);
      return res;
    }
  );

  return { analyze: trigger, result, isAnalyzing: isMutating, error: error?.message ?? null };
}

// --- Orchestrator: generate sections progressively ---
// ORDER: (Psyche Map + Sales + Research) in parallel → Creative Tree → Top Creatives
// Each section feeds its output to the next as context.
// Top Creatives runs AFTER Creative Tree so it can use the script lab's angle insights.

export type SectionStatus = "pending" | "generating" | "done" | "error";

export interface SectionStep {
  key: string;
  label: string;
  description: string;
  status: SectionStatus;
  elapsed: number | null;  // ms
}

const SECTION_DEFS = [
  { key: "psycheMap", label: "Psychology", description: "Mapping brain regions, cognitive biases, dopamine architecture, and habit loops" },
  { key: "salesPlaybook", label: "Sales Strategy", description: "Building value equation, awareness levels, Cialdini weapons, NLP techniques, and closing techniques" },
  { key: "research", label: "Research", description: "Creating shadow avatar, audience segments, search queries, and pre-creative checklist" },
  { key: "creativeTree", label: "Scripts", description: "Generating emotional angles, frameworks, ad scripts, hooks, and platform formats" },
  { key: "topCreatives", label: "Ads", description: "Crafting 5 ad blueprints in parallel batches" },
] as const;

export function useProgressiveGeneration() {
  const [progress, setProgress] = useState(0);
  const [currentSection, setCurrentSection] = useState<string | null>(null);
  const [result, setResult] = useState<Partial<GenerationResult>>({});
  const [error, setError] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [steps, setSteps] = useState<SectionStep[]>(() =>
    SECTION_DEFS.map((d) => ({ ...d, status: "pending", elapsed: null }))
  );
  const [totalElapsed, setTotalElapsed] = useState(0);

  const generate = useCallback(async (input: ProjectInput, projectId?: string) => {
    setIsGenerating(true);
    setError(null);
    setProgress(0);
    setResult({});
    setTotalElapsed(0);
    setSteps(SECTION_DEFS.map((d) => ({ ...d, status: "pending", elapsed: null })));

    if (projectId) {
      await projectRepository.updateStatus(projectId, "generating").catch(() => {});
    }

    const accumulated: Record<string, unknown> = {};
    const globalStart = Date.now();

    // Helper to run a sequential section
    const runSection = async (index: number, key: string, label: string, fn: () => Promise<unknown>) => {
      setCurrentSection(label);
      setSteps((prev) => prev.map((s, idx) => (idx === index ? { ...s, status: "generating" } : s)));

      const sectionStart = Date.now();
      try {
        const data = await fn();
        const elapsed = Date.now() - sectionStart;
        accumulated[key] = data;
        setResult((prev) => ({ ...prev, [key]: data }));
        setTotalElapsed(Date.now() - globalStart);
        setSteps((prev) => prev.map((s, idx) => (idx === index ? { ...s, status: "done", elapsed } : s)));
        return data;
      } catch (err) {
        const elapsed = Date.now() - sectionStart;
        const msg = err instanceof Error ? err.message : "Generation failed";
        setTotalElapsed(Date.now() - globalStart);
        setSteps((prev) => prev.map((s, idx) => (idx === index ? { ...s, status: "error", elapsed } : s)));
        throw new Error(`Failed at ${label}: ${msg}`);
      }
    };

    try {
      // === STEP 1: Psyche Map + Sales Playbook + Research ALL IN PARALLEL ===
      // Sales/Research barely use Psyche context - fire everything at once
      setCurrentSection("Psychology + Sales Strategy + Research");
      setSteps((prev) => prev.map((s, idx) => (idx <= 2 ? { ...s, status: "generating" } : s)));

      const step1Start = Date.now();

      const [psycheData, salesData, researchData] = await Promise.all([
        generationRepository.generatePsycheMap(input),
        generationRepository.generateSalesPlaybook(input),
        generationRepository.generateResearch(input),
      ]);

      const step1Elapsed = Date.now() - step1Start;

      accumulated.psycheMap = psycheData;
      accumulated.salesPlaybook = salesData;
      accumulated.research = researchData;
      setResult((prev) => ({ ...prev, psycheMap: psycheData, salesPlaybook: salesData, research: researchData }));
      setSteps((prev) => prev.map((s, idx) => (idx <= 2 ? { ...s, status: "done", elapsed: step1Elapsed } : s)));
      setProgress(50);
      setTotalElapsed(Date.now() - globalStart);

      // === STEP 2: Creative Tree (informed by all 3) ===
      const baseContext = {
        psycheMap: accumulated.psycheMap as PsycheMapData,
        salesPlaybook: accumulated.salesPlaybook as SalesPlaybookData,
        research: accumulated.research as ResearchData,
      };

      const creativeTreeData = await runSection(3, "creativeTree", "Scripts", () =>
        generationRepository.generateCreativeTree(input, baseContext)
      ) as CreativeTreeData;
      setProgress(75);

      // === STEP 3: Top Creatives (informed by all 3 + Creative Tree) ===
      const fullContext = {
        ...baseContext,
        creativeTree: creativeTreeData,
      };

      const topCreativesData = await runSection(4, "topCreatives", "Top Creatives", () =>
        generationRepository.generateTopCreatives(input, fullContext)
      );
      setProgress(100);
      setTotalElapsed(Date.now() - globalStart);

    } catch (err) {
      const msg = err instanceof Error ? err.message : "Generation failed";
      setError(msg);
      setTotalElapsed(Date.now() - globalStart);

      if (projectId) {
        await projectRepository.updateStatus(projectId, "failed").catch(() => {});
      }

      setIsGenerating(false);
      return null;
    }

    // Success - build full result
    const fullResult: GenerationResult = {
      id: projectId || crypto.randomUUID(),
      input,
      psycheMap: accumulated.psycheMap as GenerationResult["psycheMap"],
      salesPlaybook: accumulated.salesPlaybook as GenerationResult["salesPlaybook"],
      research: accumulated.research as GenerationResult["research"],
      creativeTree: accumulated.creativeTree as GenerationResult["creativeTree"],
      topCreatives: accumulated.topCreatives as GenerationResult["topCreatives"],
      createdAt: new Date().toISOString(),
    };

    if (projectId) {
      await projectRepository.saveResult(projectId, fullResult).catch(() => {});
    }

    setCurrentSection(null);
    setIsGenerating(false);
    return fullResult;
  }, []);

  return { generate, progress, currentSection, result, error, isGenerating, steps, totalElapsed, setResult };
}
