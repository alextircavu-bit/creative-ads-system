import type {
  IProjectInput,
  ICreativeTreeData,
  IPsycheMapData,
  ISalesPlaybookData,
  IResearchData,
  ITopCreativesData,
  ICopyCheckResult,
  IGenerationResult,
  ICreativeFeedback,
} from "@/types/creative";
import { API_ENDPOINTS } from "@/config/constants";
import { ESectionType } from "@/config/enums";

/**
 * Context from previous sections, passed to inform subsequent ones
 */
interface IGenerationContext {
  psycheMap?: IPsycheMapData;
  salesPlaybook?: ISalesPlaybookData;
  research?: IResearchData;
  creativeTree?: ICreativeTreeData;
  feedback?: ICreativeFeedback;
  existingCreatives?: { name: string; emotion: string; targetSegment?: string; hookTexts: string[] }[];
}

/**
 * Repository for generation API operations
 * Handles communication with the /api/generate endpoint
 */
class GenerationRepository {
  private static instance: GenerationRepository;

  private constructor() {
    // Private constructor prevents direct instantiation
  }

  public static getInstance(): GenerationRepository {
    if (!GenerationRepository.instance) {
      GenerationRepository.instance = new GenerationRepository();
    }
    return GenerationRepository.instance;
  }

  /**
   * Generic POST JSON request
   */
  private async postJSON<T>(url: string, body: unknown): Promise<T> {
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

  /**
   * 1. Generate Psyche Map - generated FIRST (no context needed)
   */
  public async generatePsycheMap(input: IProjectInput): Promise<IPsycheMapData> {
    return this.postJSON(API_ENDPOINTS.GENERATE, {
      input,
      section: ESectionType.PsycheMap
    });
  }

  /**
   * 2. Generate Sales Playbook - receives Psyche Map
   */
  public async generateSalesPlaybook(
    input: IProjectInput,
    context?: IGenerationContext
  ): Promise<ISalesPlaybookData> {
    return this.postJSON(API_ENDPOINTS.GENERATE, {
      input,
      section: ESectionType.SalesPlaybook,
      context
    });
  }

  /**
   * 3. Generate Research - receives Psyche Map + Sales Playbook
   */
  public async generateResearch(
    input: IProjectInput,
    context?: IGenerationContext
  ): Promise<IResearchData> {
    return this.postJSON(API_ENDPOINTS.GENERATE, {
      input,
      section: ESectionType.Research,
      context
    });
  }

  /**
   * 4. Generate Creative Tree - receives ALL (generated LAST)
   */
  public async generateCreativeTree(
    input: IProjectInput,
    context?: IGenerationContext
  ): Promise<ICreativeTreeData> {
    return this.postJSON(API_ENDPOINTS.GENERATE, {
      input,
      section: ESectionType.CreativeTree,
      context
    });
  }

  /**
   * 5. Generate Top Creatives - receives ALL
   */
  public async generateTopCreatives(
    input: IProjectInput,
    context?: IGenerationContext
  ): Promise<ITopCreativesData> {
    return this.postJSON(API_ENDPOINTS.GENERATE, {
      input,
      section: ESectionType.TopCreatives,
      context
    });
  }

  /**
   * Full generation (all at once - server handles ordering)
   */
  public async generateAll(input: IProjectInput): Promise<IGenerationResult> {
    return this.postJSON(API_ENDPOINTS.GENERATE, {
      input,
      section: ESectionType.All
    });
  }

  /**
   * Copy Check - AI deep review (local scoring is separate in lib/copy-check.ts)
   */
  public async analyzeCopy(
    input: IProjectInput,
    copyText: string
  ): Promise<ICopyCheckResult> {
    return this.postJSON(API_ENDPOINTS.ANALYZE_COPY, { input, copyText });
  }
}

// Export singleton instance
export const generationRepository = GenerationRepository.getInstance();

// Export types for external use
export type { IGenerationContext };
