import useSWR from "swr";
import useSWRMutation from "swr/mutation";
import { projectRepository } from "@/repositories/project.repository";
import type { IProjectInput, ScenarioType } from "@/types/creative";

// --- Fetchers ---

export function useProjects() {
  const { data, error, isLoading, mutate } = useSWR(
    "projects",
    () => projectRepository.getAll()
  );

  return {
    projects: data ?? [],
    error: error?.message ?? null,
    isLoading,
    refresh: mutate,
  };
}

export function useProjectsByScenario(scenario: ScenarioType) {
  // V5 also loads V3 history for comparison (same mobile app form)
  const fetchScenario = (scenario === "v5" || scenario === "applovin") ? "v3" : scenario === "research-dlp" ? "v4" : scenario;
  const { data, error, isLoading, mutate } = useSWR(
    `projects-${scenario}`,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    () => projectRepository.getByScenario(fetchScenario as any)
  );

  return {
    projects: data ?? [],
    error: error?.message ?? null,
    isLoading,
    refresh: mutate,
  };
}

export function useProject(id: string | null) {
  const { data, error, isLoading, mutate } = useSWR(
    id ? `project-${id}` : null,
    () => projectRepository.getById(id!)
  );

  return {
    project: data ?? null,
    error: error?.message ?? null,
    isLoading,
    refresh: mutate,
  };
}

// --- Mutations ---

export function useCreateProject() {
  const { trigger, isMutating, error } = useSWRMutation(
    "projects",
    async (_key: string, { arg }: { arg: IProjectInput }) => {
      return projectRepository.create(arg);
    }
  );

  return {
    createProject: trigger,
    isCreating: isMutating,
    error: error?.message ?? null,
  };
}

export function useDeleteProject() {
  const { trigger, isMutating, error } = useSWRMutation(
    "projects",
    async (_key: string, { arg }: { arg: string }) => {
      return projectRepository.delete(arg);
    }
  );

  return {
    deleteProject: trigger,
    isDeleting: isMutating,
    error: error?.message ?? null,
  };
}
