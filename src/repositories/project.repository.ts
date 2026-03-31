import { supabase } from "@/lib/supabase";
import type { IProjectInput, IProjectRow, IGenerationResult } from "@/types/creative";
import { EScenario, EProjectStatus } from "@/config/enums";
import { DB_TABLES } from "@/config/constants";

/**
 * Stamp sora2Prompts on each hook, 1:1 with its visualSuggestions
 */
function buildCombinedPrompt(
  description: string,
  moodArc?: string,
  negativePrompt?: string,
): string {
  // Description already contains scene, audio, color, camera, voiceline, authenticity woven together
  // Only append mood arc and negative prompt if not already in the description
  const parts = [description];
  if (moodArc && !description.toLowerCase().includes("mood arc")) parts.push(`Mood arc: ${moodArc}.`);
  if (negativePrompt && !description.toLowerCase().includes("do not use")) parts.push(`Do not use: ${negativePrompt}.`);
  return parts.join(" ");
}

function stampVisualSuggestion(v: Record<string, unknown>, fallbackVoiceline?: string | null) {
  const description = (v.description || v.prompt || v.idea || "") as string;
  const voiceline = v.voiceline_script !== undefined ? v.voiceline_script as string | null : (fallbackVoiceline ?? null);
  return {
    prompt: buildCombinedPrompt(description, v.mood_arc as string, v.negative_prompt as string),
    description,
    voiceline_script: voiceline,
    duration_seconds: (v.duration_seconds as number) || parseInt(v.clipDuration as string) || 8,
    style_tags: (v.styleTags || []) as string[],
    archetype: v.archetype as string,
    audio_prompt: v.audio_prompt as string,
    color_grade: v.color_grade as string,
    camera: v.camera as string,
    authenticity_tagline: v.authenticity_tagline as string,
    mood_arc: v.mood_arc as string,
    negative_prompt: v.negative_prompt as string,
  };
}

function stampSora2Prompts(result: IGenerationResult): void {
  const creatives = result.topCreatives?.creatives || [];
  for (const creative of creatives) {
    // Short-form: stamp hooks
    const hooks = Array.isArray(creative.hooks) ? creative.hooks : [];
    for (const hook of hooks) {
      const hasSora2Speech = hook.audioSource === "sora2" && !!hook.voiceoverScript;
      const fallback = hasSora2Speech ? (hook.voiceoverScript ?? null) : null;
      hook.sora2Prompts = (hook.visualSuggestions || []).map((v) =>
        stampVisualSuggestion(v as unknown as Record<string, unknown>, fallback)
      );
    }
    // Long-form: stamp scenes
    const scenes = Array.isArray(creative.scenes) ? creative.scenes : [];
    for (const scene of scenes) {
      if (scene.visualSuggestion) {
        const fallback = scene.voiceoverScript ?? null;
        scene.sora2Prompt = stampVisualSuggestion(
          scene.visualSuggestion as unknown as Record<string, unknown>,
          fallback,
        );
      }
    }
  }
}

/**
 * Repository for project CRUD operations
 * Handles Supabase database operations for projects table
 */
class ProjectRepository {
  private static instance: ProjectRepository;

  private constructor() {
    // Private constructor prevents direct instantiation
  }

  public static getInstance(): ProjectRepository {
    if (!ProjectRepository.instance) {
      ProjectRepository.instance = new ProjectRepository();
    }
    return ProjectRepository.instance;
  }

  /**
   * Get all projects, ordered by creation date (newest first)
   */
  public async getAll(): Promise<IProjectRow[]> {
    const { data, error } = await supabase
      .from(DB_TABLES.PROJECTS)
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw new Error(error.message);
    return data ?? [];
  }

  /**
   * Get a single project by ID
   */
  public async getById(id: string): Promise<IProjectRow | null> {
    const { data, error } = await supabase
      .from(DB_TABLES.PROJECTS)
      .select("*")
      .eq("id", id)
      .single();

    if (error && error.code !== "PGRST116") throw new Error(error.message);
    return data;
  }

  /**
   * Get all projects for a specific scenario
   */
  public async getByScenario(scenario: EScenario): Promise<IProjectRow[]> {
    const { data, error } = await supabase
      .from(DB_TABLES.PROJECTS)
      .select("*")
      .eq("scenario", scenario)
      .order("created_at", { ascending: false });

    if (error) throw new Error(error.message);
    return data ?? [];
  }

  /**
   * Create a new project
   */
  public async create(input: IProjectInput): Promise<IProjectRow> {
    // Applovin saves as v3 in the DB (same form/data), but input_data preserves "applovin" for routing
    const dbScenario = input.scenario === "applovin" ? "v3" : input.scenario === "research-dlp" ? "v4" : input.scenario;
    const { data, error } = await supabase
      .from(DB_TABLES.PROJECTS)
      .insert({
        scenario: dbScenario,
        product_name: input.productName,
        product_description: input.productDescription,
        app_id: input.appId || null,
        feature_name: input.featureName || null,
        feature_id: input.featureId || null,
        input_data: input,
        status: EProjectStatus.Pending,
      })
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  }

  /**
   * Update project status
   */
  public async updateStatus(id: string, status: EProjectStatus): Promise<void> {
    const { error } = await supabase
      .from(DB_TABLES.PROJECTS)
      .update({ status, updated_at: new Date().toISOString() })
      .eq("id", id);

    if (error) throw new Error(error.message);
  }

  /**
   * Save generation result to project and mark as completed
   * Automatically stamps hidden fields and sora2Prompts
   */
  public async saveResult(id: string, result: IGenerationResult): Promise<void> {
    // Stamp hidden: true on subsections not rendered in the main UI
    if (result.research?.benefitExpansion) result.research.benefitExpansion.hidden = true;
    if (result.salesPlaybook?.system1Triggers) result.salesPlaybook.system1Triggers.forEach((t) => { t.hidden = true; });
    if (result.salesPlaybook?.system2Triggers) result.salesPlaybook.system2Triggers.forEach((t) => { t.hidden = true; });
    if (result.salesPlaybook?.nlp?.stackStrategy) result.salesPlaybook.nlp.stackStrategy.forEach((s) => { s.hidden = true; });
    if (result.creativeTree?.scripts) {
      for (const scripts of Object.values(result.creativeTree.scripts)) {
        for (const script of scripts) {
          for (const step of script.steps) {
            if (step.type === "full" || step.type === "mechanism") step.hidden = true;
          }
        }
      }
    }
    if (result.topCreatives?.creatives) {
      for (const creative of result.topCreatives.creatives) {
        creative.hidden = true; // whyThisScript, sourceFramework, scenario on this object
        if (Array.isArray(creative.hooks)) {
          for (const hook of creative.hooks) {
            hook.hidden = true; // visualSuggestions on this object
          }
        }
      }
    }

    // Stamp sora2Prompts on each hook (1:1 with visualSuggestions)
    stampSora2Prompts(result);

    const { error } = await supabase
      .from(DB_TABLES.PROJECTS)
      .update({
        generation_result: result,
        status: EProjectStatus.Completed,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id);

    if (error) throw new Error(error.message);
  }

  /**
   * Delete a project
   */
  public async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from(DB_TABLES.PROJECTS)
      .delete()
      .eq("id", id);

    if (error) throw new Error(error.message);
  }
}

// Export singleton instance
export const projectRepository = ProjectRepository.getInstance();
