import { supabase } from "@/lib/supabase";
import type { ProjectInput, ProjectRow, GenerationResult } from "@/types/creative";

export const projectRepository = {
  async getAll(): Promise<ProjectRow[]> {
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw new Error(error.message);
    return data ?? [];
  },

  async getById(id: string): Promise<ProjectRow | null> {
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .eq("id", id)
      .single();

    if (error && error.code !== "PGRST116") throw new Error(error.message);
    return data;
  },

  async getByScenario(scenario: "v3" | "v4"): Promise<ProjectRow[]> {
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .eq("scenario", scenario)
      .order("created_at", { ascending: false });

    if (error) throw new Error(error.message);
    return data ?? [];
  },

  async create(input: ProjectInput): Promise<ProjectRow> {
    const { data, error } = await supabase
      .from("projects")
      .insert({
        scenario: input.scenario,
        product_name: input.productName,
        product_description: input.productDescription,
        input_data: input,
        status: "pending",
      })
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  },

  async updateStatus(id: string, status: ProjectRow["status"]): Promise<void> {
    const { error } = await supabase
      .from("projects")
      .update({ status, updated_at: new Date().toISOString() })
      .eq("id", id);

    if (error) throw new Error(error.message);
  },

  async saveResult(id: string, result: GenerationResult): Promise<void> {
    const { error } = await supabase
      .from("projects")
      .update({
        generation_result: result,
        status: "completed",
        updated_at: new Date().toISOString(),
      })
      .eq("id", id);

    if (error) throw new Error(error.message);
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase.from("projects").delete().eq("id", id);
    if (error) throw new Error(error.message);
  },
};
