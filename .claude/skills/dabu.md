# Architecture Skill: dabu

**Purpose:** This skill ensures all code follows proper architectural patterns, maintains type safety, and adheres to consistent conventions. Use this skill when making any architectural changes, refactoring code, or creating new features.

---

## Table of Contents

1. [Before You Code: Reusability Checklist](#before-you-code-reusability-checklist)
2. [Architectural Philosophy](#architectural-philosophy)
3. [Project Structure](#project-structure)
4. [Naming Conventions](#naming-conventions)
5. [Type System & Interfaces](#type-system--interfaces)
6. [Enums & Constants](#enums--constants)
7. [Repository Pattern](#repository-pattern)
8. [Hook Patterns](#hook-patterns)
9. [Component Patterns](#component-patterns)
10. [API Route Patterns](#api-route-patterns)
11. [Configuration Management](#configuration-management)
12. [Error Handling](#error-handling)
13. [Import Organization](#import-organization)
14. [Code Templates](#code-templates)

---

## Before You Code: Reusability Checklist

**STOP!** Before creating ANY new component, hook, type, or function, check if it already exists:

### 1. Check Existing Types (`/src/types/`)
- [ ] Is there an interface for this data structure in `/src/types/creative.ts`?
- [ ] Can I reuse or extend an existing interface?
- [ ] Is there an enum in `/src/config/enums.ts` for this set of values?

### 2. Check Existing Config (`/src/config/`)
- [ ] Is there a constant in `/src/config/constants.ts`?
- [ ] Is there existing framework data in `/src/config/framework-data.ts`?
- [ ] Is there a UI constant in `/src/config/ui-constants.ts`?
- [ ] Is there a system prompt in `/src/config/system-prompts.ts`?

### 3. Check Existing Hooks (`/src/hooks/`)
- [ ] Does `use-generation.ts` or `use-projects.ts` already have this functionality?
- [ ] Can I extend an existing hook instead of creating a new one?

### 4. Check Existing Repositories (`/src/repositories/`)
- [ ] Does a repository method already exist for this data operation?
- [ ] Can I add a method to an existing repository?

### 5. Check Existing Components (`/src/components/`)
- [ ] Is there a similar component I can reuse?
- [ ] Can I make an existing component more generic?

**Golden Rule:** ALWAYS prefer reusing and extending over creating new.

---

## Architectural Philosophy

### Core Principles

1. **Type Safety First**: Every data structure must have a properly typed interface with the "I" prefix
2. **No Magic Strings**: Use enums and constants for all literal values
3. **Single Source of Truth**: Configuration lives in `/src/config/`, never inline
4. **Separation of Concerns**: UI, business logic, and data access are separate layers
5. **Singleton Repositories**: All repositories are class-based singletons
6. **Predictable Patterns**: Same problems solved the same way everywhere

### Layered Architecture

```
┌─────────────────────────────────────────┐
│  Pages (App Router)                     │  ← User-facing routes
│  /src/app/                              │
└─────────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────────┐
│  Components (Presentation Layer)        │  ← UI components
│  /src/components/                       │
└─────────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────────┐
│  Hooks (Business Logic Layer)           │  ← State management, orchestration
│  /src/hooks/                            │
└─────────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────────┐
│  API Routes (Server Layer)              │  ← API endpoints
│  /src/app/api/                          │
└─────────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────────┐
│  Repositories (Data Access Layer)       │  ← Database/API abstraction
│  /src/repositories/                     │
└─────────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────────┐
│  Data Layer (Supabase, Anthropic API)   │  ← External services
└─────────────────────────────────────────┘
```

### Data Flow Rules

- **Components** → call hooks
- **Hooks** → call repositories or API routes (via fetch)
- **API Routes** → call external services (Claude, etc.)
- **Repositories** → call Supabase

**NEVER:**
- Components calling repositories directly
- Components calling API routes directly (use hooks with SWR)
- Repositories calling other repositories (use composition)

---

## Project Structure

```
/src
├── app/                          # Next.js App Router
│   ├── api/                      # API routes
│   │   ├── generate/route.ts     # Main generation endpoint
│   │   ├── analyze-copy/route.ts # Copy analysis endpoint
│   │   └── sora2-brief/route.ts  # Sora2 brief generator
│   ├── v3/page.tsx              # Mobile app scenario page
│   ├── v4/page.tsx              # Generic product scenario page
│   ├── page.tsx                 # Landing page
│   ├── layout.tsx               # Root layout
│   └── globals.css              # Global styles
│
├── components/                   # React components (organized by feature)
│   ├── copy-check/              # Copy check tool components
│   ├── creative-tree/           # Scripts tab components
│   ├── dashboard/               # Dashboard components
│   ├── psyche-map/              # Psychology tab components
│   ├── research/                # Research tab components
│   ├── sales-playbook/          # Sales strategy tab components
│   ├── shared/                  # Shared components (landing form, etc.)
│   ├── templates/               # Template library components
│   └── top-creatives/           # Ad creatives tab components
│
├── config/                      # Configuration & constants (SINGLE SOURCE OF TRUTH)
│   ├── enums.ts                 # All enum definitions
│   ├── constants.ts             # API endpoints, models, DB tables
│   ├── generation-config.ts     # Section configs (tokens, models)
│   ├── ui-constants.ts          # UI labels and strings
│   ├── system-prompts.ts        # AI system prompts
│   ├── copy-analysis-patterns.ts # Copy check patterns
│   ├── framework-data.ts        # Marketing framework data
│   ├── prompts.ts               # AI prompt templates
│   └── ad-templates.ts          # Ad template definitions
│
├── hooks/                       # Custom React hooks (business logic)
│   ├── use-generation.ts        # Generation orchestration
│   └── use-projects.ts          # Project CRUD operations
│
├── lib/                         # Utility libraries
│   ├── anthropic.ts             # Claude client
│   ├── supabase.ts              # Supabase client
│   ├── copy-check.ts            # Copy analysis logic
│   └── utils.ts                 # General utilities
│
├── repositories/                # Data access layer (singletons)
│   ├── generation.repository.ts # Generation API client
│   └── project.repository.ts    # Supabase project operations
│
└── types/                       # TypeScript type definitions
    └── creative.ts              # All interfaces (509 lines)
```

---

## Naming Conventions

### Files & Folders

| Type | Convention | Example |
|------|-----------|---------|
| React Components | `PascalCase.tsx` | `TopCreativesTab.tsx` |
| Pages (App Router) | `lowercase/page.tsx` | `v3/page.tsx` |
| Hooks | `kebab-case.ts` with `use` prefix | `use-generation.ts` |
| Repositories | `kebab-case.repository.ts` | `project.repository.ts` |
| Types/Interfaces | `kebab-case.ts` | `creative.ts` |
| Config Files | `kebab-case.ts` | `framework-data.ts` |
| Utility Files | `kebab-case.ts` | `copy-check.ts` |
| Folders | `kebab-case/` | `copy-check/` |

### Code Entities

| Type | Convention | Example |
|------|-----------|---------|
| Interfaces | `I` prefix + `PascalCase` | `IProjectInput`, `IAdCreative` |
| Types | `PascalCase` | `ScenarioType`, `DeliveryMode` |
| Enums | `E` prefix + `PascalCase` | `EScenario`, `EProjectStatus` |
| Enum Values | `PascalCase` | `EScenario.V3` |
| Constants (objects) | `UPPER_SNAKE_CASE` | `API_ENDPOINTS`, `CLAUDE_MODELS` |
| Constants (primitives) | `UPPER_SNAKE_CASE` | `MAX_RETRIES`, `DEFAULT_TIMEOUT` |
| Functions | `camelCase` | `generateCreatives()`, `analyzeCopy()` |
| React Components | `PascalCase` | `TopCreativesTab`, `LandingForm` |
| Hook Functions | `camelCase` with `use` prefix | `useGeneration()`, `useProjects()` |
| Repository Classes | `PascalCase` + `Repository` | `GenerationRepository` |
| Repository Instances | `camelCase` + `Repository` | `generationRepository` |

### Examples

```typescript
// ✅ CORRECT
export interface IProjectInput { }
export enum EScenario { V3 = "v3", V4 = "v4" }
export const API_ENDPOINTS = { GENERATE: "/api/generate" } as const;
export function useGeneration() { }
export class ProjectRepository { }
export const projectRepository = ProjectRepository.getInstance();

// ❌ WRONG
export interface ProjectInput { }  // Missing "I" prefix
export enum Scenario { }  // Missing "E" prefix
export const apiEndpoints = { }  // Should be UPPER_SNAKE_CASE
export function UseGeneration() { }  // Wrong casing
```

---

## Type System & Interfaces

### Interface Naming Rules

**ALL interfaces MUST use the "I" prefix**

```typescript
// ✅ CORRECT
export interface IUser {
  id: string;
  name: string;
  email: string;
}

export interface IProjectInput {
  scenario: EScenario;
  productName: string;
  productDescription: string;
}

export interface IAdCreativeBlueprint {
  hooks: IHookVariation[];
  body: IBodyVariation[];
  cta: string;
}

// ❌ WRONG
export interface User { }  // Missing "I" prefix
export interface ProjectInput { }  // Missing "I" prefix
export interface AdCreativeBlueprint { }  // Missing "I" prefix
```

### Type Aliases

Use `PascalCase` for type aliases (no prefix):

```typescript
// ✅ CORRECT
export type ScenarioType = EScenario;
export type DeliveryMode = "text-overlay" | "voiceover-caption";
export type FilterValues = {
  status?: EProjectStatus;
  scenario?: EScenario;
};

// ❌ WRONG
export type IScenarioType = EScenario;  // Don't use "I" prefix on types
export type scenarioType = EScenario;  // Wrong casing
```

### When to Use Interface vs Type

| Use Case | Use |
|----------|-----|
| Object shapes | `interface` |
| Function signatures | `type` |
| Union types | `type` |
| Intersection types | `type` or `interface` with `extends` |
| Extending other interfaces | `interface` with `extends` |

### Utility Types

```typescript
// Create input types by omitting auto-generated fields
export type CreateProjectInput = Omit<IProjectRow, "id" | "createdAt" | "updatedAt">;

// Create update types with all fields optional
export type UpdateProjectInput = Partial<CreateProjectInput>;

// Pick specific fields
export type ProjectSummary = Pick<IProjectRow, "id" | "scenario" | "productName">;
```

---

## Enums & Constants

### Enum Naming Rules

**ALL enums MUST use the "E" prefix**

```typescript
// ✅ CORRECT (in /src/config/enums.ts)
export enum EScenario {
  V3 = "v3",
  V4 = "v4",
}

export enum EProjectStatus {
  Pending = "pending",
  Generating = "generating",
  Completed = "completed",
  Failed = "failed",
}

export enum ESectionType {
  PsycheMap = "psycheMap",
  SalesPlaybook = "salesPlaybook",
  Research = "research",
  CreativeTree = "creativeTree",
  TopCreatives = "topCreatives",
  All = "all",
}

// ❌ WRONG
export enum Scenario { }  // Missing "E" prefix
export enum PROJECT_STATUS { }  // Wrong casing (should be PascalCase)
export enum eScenario { }  // Wrong casing ("E" should be uppercase)
```

### When to Use Enums vs String Unions

| Use Case | Use |
|----------|-----|
| Fixed set of values that won't change | Enum |
| Need runtime validation | Enum |
| Need to iterate over values | Enum |
| Values only used for types | String union type |
| Library/API response types | String union type |

### Constants

All constants live in `/src/config/constants.ts`:

```typescript
// ✅ CORRECT
export const API_ENDPOINTS = {
  BASE: "/api",
  GENERATE: "/api/generate",
  ANALYZE_COPY: "/api/analyze-copy",
  SORA2_BRIEF: "/api/sora2-brief",
} as const;

export const CLAUDE_MODELS = {
  OPUS: "claude-opus-4-20250514",
  SONNET: "claude-sonnet-4-20250514",
} as const;

export const DB_TABLES = {
  PROJECTS: "projects",
} as const;

export const GENERATION_DEFAULTS = {
  MAX_RETRIES: 3,
  TIMEOUT_MS: 120000,
  BATCH_SIZE: 2,
} as const;

// ❌ WRONG
const apiBase = "/api";  // Not in constants file, wrong naming
const API_BASE = "/api";  // Not in constants file, not grouped
```

### Usage

```typescript
import { EScenario, EProjectStatus } from "@/config/enums";
import { API_ENDPOINTS, CLAUDE_MODELS } from "@/config/constants";

// ✅ CORRECT
async function generateAds(scenario: EScenario) {
  const response = await fetch(API_ENDPOINTS.GENERATE, {
    method: "POST",
    body: JSON.stringify({ scenario }),
  });
}

// Check enum value
if (project.status === EProjectStatus.Completed) { }

// ❌ WRONG
async function generateAds(scenario: "v3" | "v4") {  // Use enum
  const response = await fetch("/api/generate", {  // Use constant
    // ...
  });
}

if (project.status === "completed") { }  // Use enum
```

---

## Repository Pattern

### Class-Based Singleton Pattern

**ALL repositories MUST be singleton classes**

```typescript
// ✅ CORRECT Pattern

import { IProjectInput, IGenerationResult } from "@/types/creative";
import { ESectionType } from "@/config/enums";
import { API_ENDPOINTS } from "@/config/constants";

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

  private async postJSON<T>(url: string, data: unknown): Promise<T> {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  public async generateSection<T>(
    input: IProjectInput,
    section: ESectionType
  ): Promise<T> {
    return this.postJSON<T>(API_ENDPOINTS.GENERATE, { input, section });
  }

  public async generatePsycheMap(input: IProjectInput): Promise<IPsycheMapData> {
    return this.generateSection<IPsycheMapData>(input, ESectionType.PsycheMap);
  }

  public async generateSalesPlaybook(input: IProjectInput): Promise<ISalesPlaybookData> {
    return this.generateSection<ISalesPlaybookData>(input, ESectionType.SalesPlaybook);
  }

  // ... more methods
}

// Export singleton instance
export const generationRepository = GenerationRepository.getInstance();
```

### Repository Method Naming

| Operation | Pattern | Example |
|-----------|---------|---------|
| Get single | `get{Entity}(id)` | `getProject(id)` |
| Get multiple | `get{Entity}s(filters?)` | `getProjects({ scenario })` |
| Get by field | `get{Entity}By{Field}(value)` | `getProjectsByScenario(scenario)` |
| Create | `create{Entity}(data)` | `createProject(data)` |
| Update | `update{Entity}(id, data)` | `updateProject(id, data)` |
| Delete | `delete{Entity}(id)` | `deleteProject(id)` |
| Custom action | `{verb}{Entity}{Suffix}` | `generateSection(input)` |

### Supabase Repository Example

```typescript
import { supabase } from "@/lib/supabase";
import { IProjectRow } from "@/types/creative";
import { EScenario, EProjectStatus } from "@/config/enums";
import { DB_TABLES } from "@/config/constants";

class ProjectRepository {
  private static instance: ProjectRepository;

  private constructor() {}

  public static getInstance(): ProjectRepository {
    if (!ProjectRepository.instance) {
      ProjectRepository.instance = new ProjectRepository();
    }
    return ProjectRepository.instance;
  }

  public async getProject(id: string): Promise<IProjectRow | null> {
    const { data, error } = await supabase
      .from(DB_TABLES.PROJECTS)
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;
    return data;
  }

  public async getProjectsByScenario(scenario: EScenario): Promise<IProjectRow[]> {
    const { data, error } = await supabase
      .from(DB_TABLES.PROJECTS)
      .select("*")
      .eq("scenario", scenario)
      .eq("status", EProjectStatus.Completed)
      .order("created_at", { ascending: false })
      .limit(50);

    if (error) throw error;
    return data || [];
  }

  public async createProject(data: Omit<IProjectRow, "id" | "created_at">): Promise<string> {
    const { data: project, error } = await supabase
      .from(DB_TABLES.PROJECTS)
      .insert(data)
      .select("id")
      .single();

    if (error) throw error;
    return project.id;
  }

  public async updateProject(
    id: string,
    data: Partial<IProjectRow>
  ): Promise<void> {
    const { error } = await supabase
      .from(DB_TABLES.PROJECTS)
      .update(data)
      .eq("id", id);

    if (error) throw error;
  }

  public async deleteProject(id: string): Promise<void> {
    const { error } = await supabase
      .from(DB_TABLES.PROJECTS)
      .delete()
      .eq("id", id);

    if (error) throw error;
  }
}

export const projectRepository = ProjectRepository.getInstance();
```

---

## Hook Patterns

### Hook for CRUD Operations

```typescript
import { useTransition } from "react";
import { projectRepository } from "@/repositories/project.repository";
import { IProjectRow } from "@/types/creative";
import { EScenario } from "@/config/enums";

export default function useProjectActions() {
  const [isPending, startTransition] = useTransition();

  return {
    isPending,

    getProject: async (id: string) => {
      return await projectRepository.getProject(id);
    },

    createProject: async (data: Omit<IProjectRow, "id" | "created_at">) => {
      return await projectRepository.createProject(data);
    },

    updateProject: async (
      id: string,
      data: Partial<IProjectRow>,
      mutate?: () => Promise<void>
    ) => {
      await projectRepository.updateProject(id, data);
      if (mutate) await mutate();
    },

    deleteProject: async (id: string, mutate?: () => Promise<void>) => {
      await projectRepository.deleteProject(id);
      if (mutate) await mutate();
    },
  };
}
```

### Hook for Data Fetching (SWR)

```typescript
import useSWR from "swr";
import { useMemo } from "react";
import { projectRepository } from "@/repositories/project.repository";
import { IProjectRow } from "@/types/creative";
import { EScenario, EProjectStatus } from "@/config/enums";

interface IProjectFilters {
  scenario?: EScenario;
  status?: EProjectStatus;
}

export function useProjects(filters?: IProjectFilters) {
  const { data, isLoading, isValidating, mutate, error } = useSWR<IProjectRow[]>(
    filters ? `/projects?filters=${JSON.stringify(filters)}` : "/projects",
    () => projectRepository.getProjects(filters),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      dedupingInterval: 5000,
    }
  );

  const processedData = useMemo(() => {
    if (!data) return [];

    // Client-side processing if needed
    return data.filter(p => p.status === EProjectStatus.Completed);
  }, [data]);

  return {
    projects: processedData,
    rawProjects: data,
    isLoading,
    isValidating,
    error,
    mutate,
  };
}
```

### Hook Return Values

Always return an object (never array) for better extensibility:

```typescript
// ✅ CORRECT
export function useGeneration() {
  return {
    sections,
    progress,
    isGenerating,
    error,
    startGeneration,
    cancelGeneration,
  };
}

// ❌ WRONG
export function useGeneration() {
  return [sections, progress, isGenerating, startGeneration];  // Hard to extend
}
```

---

## Component Patterns

### Component Structure

```typescript
import { IAdCreativeBlueprint } from "@/types/creative";
import { EDeliveryMode } from "@/config/enums";
import { UI_LABELS } from "@/config/ui-constants";

interface ICreativeCardProps {
  creative: IAdCreativeBlueprint;
  index: number;
  onSelect?: (creative: IAdCreativeBlueprint) => void;
}

export function CreativeCard({ creative, index, onSelect }: ICreativeCardProps) {
  const handleClick = () => {
    onSelect?.(creative);
  };

  return (
    <div className="creative-card" onClick={handleClick}>
      <h3>{UI_LABELS.CREATIVE_TITLE} #{index + 1}</h3>
      {/* ... */}
    </div>
  );
}
```

### Component File Organization

```typescript
// 1. External imports
import { useState, useEffect } from "react";
import useSWR from "swr";

// 2. Internal imports (types)
import { IProjectInput, IGenerationResult } from "@/types/creative";
import { EScenario, ESectionType } from "@/config/enums";

// 3. Internal imports (hooks, utils)
import { useGeneration } from "@/hooks/use-generation";
import { cn } from "@/lib/utils";

// 4. Internal imports (constants)
import { UI_LABELS } from "@/config/ui-constants";

// 5. Interface definitions
interface IMyComponentProps {
  // ...
}

// 6. Component definition
export function MyComponent({ }: IMyComponentProps) {
  // ...
}
```

---

## API Route Patterns

### Standard API Route Structure

```typescript
import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { IProjectInput, IPsycheMapData } from "@/types/creative";
import { ESectionType } from "@/config/enums";
import { CLAUDE_MODELS } from "@/config/constants";
import { SECTION_CONFIGS } from "@/config/generation-config";
import { SYSTEM_PROMPTS } from "@/config/system-prompts";
import { buildPrompt } from "@/config/prompts";

export async function POST(req: NextRequest) {
  try {
    // 1. Parse and validate request
    const body = await req.json();
    const { input, section } = body as {
      input: IProjectInput;
      section: ESectionType;
    };

    if (!input || !section) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // 2. Get configuration
    const config = SECTION_CONFIGS[section];

    // 3. Build prompt
    const prompt = buildPrompt(section, input);

    // 4. Call AI service
    const anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });

    const response = await anthropic.messages.create({
      model: config.model,
      max_tokens: config.tokens,
      temperature: config.temperature,
      system: SYSTEM_PROMPTS.GENERATION,
      messages: [{ role: "user", content: prompt }],
    });

    // 5. Parse and return response
    const content = response.content[0];
    if (content.type !== "text") {
      throw new Error("Unexpected response type");
    }

    const data = JSON.parse(content.text);
    return NextResponse.json(data);

  } catch (error) {
    console.error("Generation error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Generation failed" },
      { status: 500 }
    );
  }
}
```

### Error Response Pattern

```typescript
// ✅ CORRECT
return NextResponse.json(
  { error: "Detailed error message" },
  { status: 400 }
);

// ❌ WRONG
return NextResponse.json({ message: "Error" });  // No status code
throw new Error("Error");  // Unhandled error
```

---

## Configuration Management

### Configuration File Organization

All configuration lives in `/src/config/`:

1. **`enums.ts`** - All enum definitions
2. **`constants.ts`** - API endpoints, models, DB tables
3. **`generation-config.ts`** - Section configs (tokens, models, temperatures)
4. **`ui-constants.ts`** - All UI labels and strings
5. **`system-prompts.ts`** - AI system prompts
6. **`copy-analysis-patterns.ts`** - Copy check patterns
7. **`framework-data.ts`** - Marketing framework data (brain regions, biases, etc.)
8. **`prompts.ts`** - AI prompt templates
9. **`ad-templates.ts`** - Ad template definitions

### Example: Generation Config

```typescript
// /src/config/generation-config.ts

import { CLAUDE_MODELS } from "./constants";
import { ESectionType } from "./enums";

export interface ISectionConfig {
  tokens: number;
  model: string;
  temperature: number;
}

export const SECTION_CONFIGS: Record<ESectionType, ISectionConfig> = {
  [ESectionType.PsycheMap]: {
    tokens: 6000,
    model: CLAUDE_MODELS.SONNET,
    temperature: 0.4,
  },
  [ESectionType.SalesPlaybook]: {
    tokens: 8000,
    model: CLAUDE_MODELS.SONNET,
    temperature: 0.4,
  },
  [ESectionType.Research]: {
    tokens: 5000,
    model: CLAUDE_MODELS.OPUS,
    temperature: 0.4,
  },
  [ESectionType.CreativeTree]: {
    tokens: 12000,
    model: CLAUDE_MODELS.OPUS,
    temperature: 0.4,
  },
  [ESectionType.TopCreatives]: {
    tokens: 8000,
    model: CLAUDE_MODELS.OPUS,
    temperature: 0.4,
  },
  [ESectionType.All]: {
    tokens: 8000,
    model: CLAUDE_MODELS.OPUS,
    temperature: 0.4,
  },
};
```

### Example: UI Constants

```typescript
// /src/config/ui-constants.ts

export const UI_LABELS = {
  BUTTONS: {
    GENERATE_ADS: "Generate Ads",
    GENERATE_MORE: "Generate 5 More",
    SAVE_PROJECT: "Save Project",
    DELETE_PROJECT: "Delete Project",
    LOAD_PROJECT: "Load Project",
    ANALYZE_COPY: "Analyze Copy",
  },
  SECTIONS: {
    PSYCHOLOGY: "Psychology",
    SALES_STRATEGY: "Sales Strategy",
    RESEARCH: "Research",
    CREATIVE_TREE: "Scripts",
    TOP_CREATIVES: "Ads",
    TEMPLATES: "Templates",
    COPY_CHECK: "Copy Check",
  },
  FIELDS: {
    APP_NAME: "App Name",
    PRODUCT_NAME: "Product Name",
    DESCRIPTION: "Description",
    FEATURE_NAME: "Feature Name",
    TARGET_AUDIENCE: "Target Audience",
  },
  STATUS: {
    PENDING: "Pending",
    GENERATING: "Generating",
    COMPLETED: "Completed",
    FAILED: "Failed",
  },
} as const;

export const UI_MESSAGES = {
  ERRORS: {
    GENERATION_FAILED: "Generation failed. Please try again.",
    SAVE_FAILED: "Failed to save project.",
    LOAD_FAILED: "Failed to load project.",
  },
  SUCCESS: {
    PROJECT_SAVED: "Project saved successfully!",
    PROJECT_DELETED: "Project deleted successfully!",
  },
} as const;
```

---

## Error Handling

### Standard Error Pattern

```typescript
try {
  const result = await repository.getData();
  return result;
} catch (error) {
  console.error("Detailed context:", error);
  throw new Error(
    error instanceof Error
      ? error.message
      : "Operation failed"
  );
}
```

### API Error Responses

```typescript
// Client-side error (400-499)
if (!input.productName) {
  return NextResponse.json(
    { error: "Product name is required" },
    { status: 400 }
  );
}

// Server-side error (500-599)
try {
  const result = await generateContent();
} catch (error) {
  console.error("Generation error:", error);
  return NextResponse.json(
    { error: "Internal server error" },
    { status: 500 }
  );
}
```

---

## Import Organization

### Import Order

```typescript
// 1. External libraries (React, Next, etc.)
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import useSWR from "swr";

// 2. Types and interfaces
import type { IProjectInput, IGenerationResult } from "@/types/creative";

// 3. Enums and constants
import { EScenario, ESectionType } from "@/config/enums";
import { API_ENDPOINTS } from "@/config/constants";

// 4. Hooks and utilities
import { useGeneration } from "@/hooks/use-generation";
import { cn } from "@/lib/utils";

// 5. Components
import { Button } from "@/components/ui/button";
import { CreativeCard } from "@/components/top-creatives/creative-card";

// 6. Styles (if needed)
import "./styles.css";
```

### Path Aliases

Always use `@/` alias for internal imports:

```typescript
// ✅ CORRECT
import { IProjectInput } from "@/types/creative";
import { useGeneration } from "@/hooks/use-generation";

// ❌ WRONG
import { IProjectInput } from "../../types/creative";
import { useGeneration } from "../hooks/use-generation";
```

---

## Code Templates

### New Repository Template

```typescript
import { I{Entity} } from "@/types/creative";
import { E{Enum} } from "@/config/enums";
import { DB_TABLES } from "@/config/constants";

class {Entity}Repository {
  private static instance: {Entity}Repository;

  private constructor() {}

  public static getInstance(): {Entity}Repository {
    if (!{Entity}Repository.instance) {
      {Entity}Repository.instance = new {Entity}Repository();
    }
    return {Entity}Repository.instance;
  }

  public async get{Entity}(id: string): Promise<I{Entity} | null> {
    // Implementation
  }

  public async get{Entity}s(filters?: any): Promise<I{Entity}[]> {
    // Implementation
  }

  public async create{Entity}(data: Omit<I{Entity}, "id">): Promise<string> {
    // Implementation
  }

  public async update{Entity}(id: string, data: Partial<I{Entity}>): Promise<void> {
    // Implementation
  }

  public async delete{Entity}(id: string): Promise<void> {
    // Implementation
  }
}

export const {entity}Repository = {Entity}Repository.getInstance();
```

### New Hook Template

```typescript
import useSWR from "swr";
import { useMemo } from "react";
import { {entity}Repository } from "@/repositories/{entity}.repository";
import { I{Entity} } from "@/types/creative";

export function use{Entity}s(filters?: any) {
  const { data, isLoading, isValidating, mutate, error } = useSWR<I{Entity}[]>(
    filters ? `/api/{entity}?filters=${JSON.stringify(filters)}` : `/api/{entity}`,
    () => {entity}Repository.get{Entity}s(filters),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      dedupingInterval: 5000,
    }
  );

  const processedData = useMemo(() => {
    if (!data) return [];
    // Client-side processing
    return data;
  }, [data]);

  return {
    data: processedData,
    rawData: data,
    isLoading,
    isValidating,
    error,
    mutate,
  };
}
```

### New Component Template

```typescript
import { I{Entity} } from "@/types/creative";
import { UI_LABELS } from "@/config/ui-constants";

interface I{Component}Props {
  // Props
}

export function {Component}({ }: I{Component}Props) {
  return (
    <div>
      {/* Component JSX */}
    </div>
  );
}
```

---

## Refactoring Checklist

When refactoring existing code, follow this order:

### Phase 1: Type System
- [ ] Create `/src/config/enums.ts` with all enums
- [ ] Create `/src/config/constants.ts` with all constants
- [ ] Rename all interfaces to use "I" prefix
- [ ] Update all imports

### Phase 2: Configuration
- [ ] Create `/src/config/generation-config.ts`
- [ ] Create `/src/config/ui-constants.ts`
- [ ] Create `/src/config/system-prompts.ts`
- [ ] Extract hardcoded values to appropriate config files

### Phase 3: Repositories
- [ ] Convert to singleton classes
- [ ] Replace magic strings with enums/constants
- [ ] Standardize error handling

### Phase 4: Hooks & Components
- [ ] Update hooks to use new enums and constants
- [ ] Update components to use UI constants
- [ ] Standardize error handling

### Phase 5: API Routes
- [ ] Update to use config files
- [ ] Replace magic strings with enums/constants
- [ ] Standardize error responses

### Phase 6: Verification
- [ ] Run TypeScript check (`npm run type-check`)
- [ ] Test all functionality
- [ ] Verify no breaking changes

---

## Summary: The dabu Way

1. **Type everything** with "I" prefix interfaces
2. **Use enums** for all fixed value sets (with "E" prefix)
3. **Centralize constants** in `/src/config/`
4. **Singleton repositories** for all data access
5. **SWR hooks** for all data fetching
6. **No magic strings** anywhere in the code
7. **Consistent patterns** across the entire codebase
8. **Check reusability first** before creating anything new

**When in doubt, check this guide. When still in doubt, ask dabu.**

---

Last updated: 2025-03-17
