import { useState, useCallback } from "react";
import useSWRMutation from "swr/mutation";
import { generationRepository } from "@/repositories/generation.repository";
import { projectRepository } from "@/repositories/project.repository";
import type {
  IProjectInput,
  IGenerationResult,
  ICreativeTreeData,
  IPsycheMapData,
  ISalesPlaybookData,
  IResearchData,
  ITopCreativesData,
  ICopyCheckResult,
} from "@/types/creative";
import { EProjectStatus, ESectionStatus } from "@/config/enums";
import { SECTION_STEPS, type ISectionStep } from "@/config/generation-config";

// --- Full Generation (all sections at once) ---

export function useGenerateAll() {
  const [result, setResult] = useState<IGenerationResult | null>(null);

  const { trigger, isMutating, error } = useSWRMutation(
    "generate-all",
    async (_key: string, { arg }: { arg: { input: IProjectInput; projectId?: string } }) => {
      if (arg.projectId) {
        await projectRepository.updateStatus(arg.projectId, EProjectStatus.Generating);
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
          await projectRepository.updateStatus(arg.projectId, EProjectStatus.Failed);
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
  const [data, setData] = useState<IPsycheMapData | null>(null);

  const { trigger, isMutating, error } = useSWRMutation(
    "generate-psyche-map",
    async (_key: string, { arg }: { arg: IProjectInput }) => {
      const res = await generationRepository.generatePsycheMap(arg);
      setData(res);
      return res;
    }
  );

  return { generate: trigger, data, isGenerating: isMutating, error: error?.message ?? null };
}

export function useGenerateSalesPlaybook() {
  const [data, setData] = useState<ISalesPlaybookData | null>(null);

  const { trigger, isMutating, error } = useSWRMutation(
    "generate-sales-playbook",
    async (_key: string, { arg }: { arg: { input: IProjectInput; context?: { psycheMap?: IPsycheMapData } } }) => {
      const res = await generationRepository.generateSalesPlaybook(arg.input, arg.context);
      setData(res);
      return res;
    }
  );

  return { generate: trigger, data, isGenerating: isMutating, error: error?.message ?? null };
}

export function useGenerateResearch() {
  const [data, setData] = useState<IResearchData | null>(null);

  const { trigger, isMutating, error } = useSWRMutation(
    "generate-research",
    async (_key: string, { arg }: { arg: { input: IProjectInput; context?: { psycheMap?: IPsycheMapData; salesPlaybook?: ISalesPlaybookData } } }) => {
      const res = await generationRepository.generateResearch(arg.input, arg.context);
      setData(res);
      return res;
    }
  );

  return { generate: trigger, data, isGenerating: isMutating, error: error?.message ?? null };
}

export function useGenerateCreativeTree() {
  const [data, setData] = useState<ICreativeTreeData | null>(null);

  const { trigger, isMutating, error } = useSWRMutation(
    "generate-creative-tree",
    async (_key: string, { arg }: { arg: { input: IProjectInput; context?: { psycheMap?: IPsycheMapData; salesPlaybook?: ISalesPlaybookData; research?: IResearchData } } }) => {
      const res = await generationRepository.generateCreativeTree(arg.input, arg.context);
      setData(res);
      return res;
    }
  );

  return { generate: trigger, data, isGenerating: isMutating, error: error?.message ?? null };
}

export function useGenerateTopCreatives() {
  const [data, setData] = useState<ITopCreativesData | null>(null);

  const { trigger, isMutating, error } = useSWRMutation(
    "generate-top-creatives",
    async (_key: string, { arg }: { arg: { input: IProjectInput; context?: { psycheMap?: IPsycheMapData; salesPlaybook?: ISalesPlaybookData; research?: IResearchData; creativeTree?: ICreativeTreeData } } }) => {
      const res = await generationRepository.generateTopCreatives(arg.input, arg.context);
      setData(res);
      return res;
    }
  );

  return { generate: trigger, data, isGenerating: isMutating, error: error?.message ?? null };
}

// --- Copy Check ---

export function useAnalyzeCopy() {
  const [result, setResult] = useState<ICopyCheckResult | null>(null);

  const { trigger, isMutating, error } = useSWRMutation(
    "analyze-copy",
    async (_key: string, { arg }: { arg: { input: IProjectInput; copyText: string } }) => {
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

/**
 * Section step with status tracking
 * Extends the base ISectionStep with status and elapsed time
 */
export interface ISectionStepWithStatus extends ISectionStep {
  status: ESectionStatus;
  elapsed: number | null;  // ms
}

// Re-export types for convenience
export type { ISectionStep };
export { ESectionStatus };

export function useProgressiveGeneration() {
  const [progress, setProgress] = useState(0);
  const [currentSection, setCurrentSection] = useState<string | null>(null);
  const [result, setResult] = useState<Partial<IGenerationResult>>({});
  const [error, setError] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [steps, setSteps] = useState<ISectionStepWithStatus[]>(() =>
    SECTION_STEPS.map((d) => ({ ...d, status: ESectionStatus.Pending, elapsed: null }))
  );
  const [totalElapsed, setTotalElapsed] = useState(0);

  const generate = useCallback(async (input: IProjectInput, projectId?: string) => {
    setIsGenerating(true);
    setError(null);
    setProgress(0);
    setResult({});
    setTotalElapsed(0);
    setSteps(SECTION_STEPS.map((d) => ({ ...d, status: ESectionStatus.Pending, elapsed: null })));

    if (projectId) {
      await projectRepository.updateStatus(projectId, EProjectStatus.Generating).catch(() => {});
    }

    const accumulated: Record<string, unknown> = {};
    const globalStart = Date.now();

    // Helper to run a sequential section
    const runSection = async (index: number, key: string, label: string, fn: () => Promise<unknown>) => {
      setCurrentSection(label);
      setSteps((prev) => prev.map((s, idx) => (idx === index ? { ...s, status: ESectionStatus.Generating } : s)));

      const sectionStart = Date.now();
      try {
        const data = await fn();
        const elapsed = Date.now() - sectionStart;
        accumulated[key] = data;
        setResult((prev) => ({ ...prev, [key]: data }));
        setTotalElapsed(Date.now() - globalStart);
        setSteps((prev) => prev.map((s, idx) => (idx === index ? { ...s, status: ESectionStatus.Done, elapsed } : s)));
        return data;
      } catch (err) {
        const elapsed = Date.now() - sectionStart;
        const msg = err instanceof Error ? err.message : "Generation failed";
        setTotalElapsed(Date.now() - globalStart);
        setSteps((prev) => prev.map((s, idx) => (idx === index ? { ...s, status: ESectionStatus.Error, elapsed } : s)));
        throw new Error(`Failed at ${label}: ${msg}`);
      }
    };

    try {
      // === STEP 1: Psyche Map + Sales Playbook + Research ALL IN PARALLEL ===
      // Sales/Research barely use Psyche context - fire everything at once
      setCurrentSection("Psychology + Sales Strategy + Research");
      setSteps((prev) => prev.map((s, idx) => (idx <= 2 ? { ...s, status: ESectionStatus.Generating } : s)));

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
      setSteps((prev) => prev.map((s, idx) => (idx <= 2 ? { ...s, status: ESectionStatus.Done, elapsed: step1Elapsed } : s)));
      setProgress(50);
      setTotalElapsed(Date.now() - globalStart);

      // === STEP 2: Creative Tree (informed by all 3) ===
      const baseContext = {
        psycheMap: accumulated.psycheMap as IPsycheMapData,
        salesPlaybook: accumulated.salesPlaybook as ISalesPlaybookData,
        research: accumulated.research as IResearchData,
      };

      const creativeTreeData = await runSection(3, "creativeTree", "Scripts", () =>
        generationRepository.generateCreativeTree(input, baseContext)
      ) as ICreativeTreeData;
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
        await projectRepository.updateStatus(projectId, EProjectStatus.Failed).catch(() => {});
      }

      setIsGenerating(false);
      return null;
    }

    // Success - build full result
    const fullResult: IGenerationResult = {
      id: projectId || crypto.randomUUID(),
      input,
      psycheMap: accumulated.psycheMap as IGenerationResult["psycheMap"],
      salesPlaybook: accumulated.salesPlaybook as IGenerationResult["salesPlaybook"],
      research: accumulated.research as IGenerationResult["research"],
      creativeTree: accumulated.creativeTree as IGenerationResult["creativeTree"],
      topCreatives: accumulated.topCreatives as IGenerationResult["topCreatives"],
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
