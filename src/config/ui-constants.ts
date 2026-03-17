/**
 * UI Constants
 *
 * All UI labels, button text, and user-facing strings.
 * Naming convention: UI_* with UPPER_SNAKE_CASE
 */

/**
 * Button labels
 */
export const UI_BUTTONS = {
  GENERATE_ADS: "Generate Ads",
  GENERATE_MORE: "Generate 5 More",
  SAVE_PROJECT: "Save Project",
  DELETE_PROJECT: "Delete Project",
  LOAD_PROJECT: "Load Project",
  ANALYZE_COPY: "Analyze Copy",
  RUN_AI_REVIEW: "Run AI Deep Review",
  DOWNLOAD_JSON: "Download JSON",
  COPY_TO_CLIPBOARD: "Copy to Clipboard",
  VIEW_TEMPLATE: "View Template",
  GENERATE_SORA_BRIEF: "Generate Sora2 Brief",
  BACK: "Back",
  NEXT: "Next",
  CANCEL: "Cancel",
  CONFIRM: "Confirm",
} as const;

/**
 * Section/Tab labels
 */
export const UI_SECTIONS = {
  DASHBOARD: "Dashboard",
  TEMPLATES: "Templates",
  RESEARCH: "Research",
  PSYCHOLOGY: "Psychology",
  SALES: "Sales",
  SCRIPTS: "Scripts",
  COPY_CHECK: "Copy Check",
  TOP_CREATIVES: "Top Creatives",
} as const;

/**
 * Sub-section labels within tabs
 */
export const UI_SUBSECTIONS = {
  // Psychology
  BRAIN_REGIONS: "Brain Regions",
  COGNITIVE_PROFILE: "Cognitive Profile",
  DOPAMINE_ARCHITECTURE: "Dopamine Architecture",
  COGNITIVE_BIASES: "Cognitive Biases",
  HABIT_LOOP: "Habit Loop",
  PERSUASION_STACK: "Persuasion Stack",
  PAIN_PLEASURE: "Pain/Pleasure Matrix",

  // Sales
  VALUE_EQUATION: "Value Equation (Hormozi)",
  AWARENESS_LEVELS: "Awareness Levels (Schwartz)",
  CIALDINI_WEAPONS: "Cialdini's 6 Weapons",
  STRAIGHT_LINE: "Straight Line Certainty (Belfort)",
  HSO_FRAMEWORK: "Hook-Story-Offer",
  RETARGETING_FUNNEL: "Retargeting Funnel",
  CLOSING_TECHNIQUES: "Closing Techniques",
  SYSTEM_12_TRIGGERS: "System 1/2 Triggers",
  NLP_TECHNIQUES: "NLP Techniques",
  OBJECTION_MAP: "Objection Map",
  MARKET_SOPHISTICATION: "Market Sophistication",
  PURCHASE_CONTEXT: "Purchase Context",
  DEMAND_TEMPERATURE: "Demand Temperature",

  // Research
  SHADOW_AVATAR: "Shadow Avatar",
  SEARCH_QUERIES: "Search Queries",
  RESEARCH_TECHNIQUES: "Research Techniques",
  AVATAR_TRAITS: "Avatar Traits",
  AUDIENCE_SEGMENTS: "Audience Segments",
  BENEFIT_EXPANSION: "Benefit Expansion",

  // Scripts
  PSYCHOLOGICAL_TERRITORIES: "8 Psychological Territories",
  COPYWRITING_FRAMEWORKS: "5 Copywriting Frameworks",
  PLATFORM_FORMATS: "Platform Formats",

  // Copy Check
  LOCAL_SCORING: "Local Scoring",
  AI_DEEP_REVIEW: "AI Deep Review",
} as const;

/**
 * Form field labels
 */
export const UI_FIELDS = {
  // V3 (Mobile Apps)
  APP_NAME: "App Name",
  FEATURE_NAME: "Feature Name",
  APP_ID: "App ID",
  FEATURE_ID: "Feature ID",
  APP_FEATURES: "App Features",
  APP_BENEFITS: "App Benefits",
  APP_PURPOSE: "App Purpose",

  // V4 (Any Product)
  PRODUCT_NAME: "Product Name",
  PRODUCT_DESCRIPTION: "Product Description",
  TARGET_AUDIENCE: "Target Audience",
  UNIQUE_SELLING_POINT: "Unique Selling Point (USP)",

  // Common
  DESCRIPTION: "Description",
  SCENARIO: "Scenario",
  STATUS: "Status",
} as const;

/**
 * Status labels
 */
export const UI_STATUS = {
  PENDING: "Pending",
  GENERATING: "Generating",
  COMPLETED: "Completed",
  FAILED: "Failed",
  LOADING: "Loading",
  SAVED: "Saved",
} as const;

/**
 * Error messages
 */
export const UI_ERRORS = {
  GENERATION_FAILED: "Generation failed. Please try again.",
  SAVE_FAILED: "Failed to save project.",
  LOAD_FAILED: "Failed to load project.",
  DELETE_FAILED: "Failed to delete project.",
  COPY_ANALYSIS_FAILED: "Copy analysis failed.",
  INVALID_INPUT: "Please fill in all required fields.",
  NETWORK_ERROR: "Network error. Please check your connection.",
  UNKNOWN_ERROR: "An unexpected error occurred.",
} as const;

/**
 * Success messages
 */
export const UI_SUCCESS = {
  PROJECT_SAVED: "Project saved successfully!",
  PROJECT_DELETED: "Project deleted successfully!",
  PROJECT_LOADED: "Project loaded successfully!",
  COPIED_TO_CLIPBOARD: "Copied to clipboard!",
  GENERATION_COMPLETE: "Generation complete!",
} as const;

/**
 * Info messages
 */
export const UI_INFO = {
  NO_PROJECTS: "No projects found.",
  EMPTY_HISTORY: "Your project history will appear here.",
  GENERATING: "Generating your ad creatives...",
  SELECT_SCENARIO: "Select a scenario to begin.",
} as const;

/**
 * Placeholder text
 */
export const UI_PLACEHOLDERS = {
  APP_NAME: "e.g., MeditateNow",
  FEATURE_NAME: "e.g., 10-Minute Guided Sessions",
  PRODUCT_NAME: "e.g., Electric Toothbrush Pro",
  PRODUCT_DESCRIPTION: "Describe your product, its benefits, and what makes it unique...",
  TARGET_AUDIENCE: "e.g., Health-conscious millennials aged 25-40",
  USP: "e.g., 3x better cleaning with AI-powered brush patterns",
  PASTE_COPY_HERE: "Paste your ad copy here for analysis...",
} as const;

/**
 * Scenario descriptions
 */
export const UI_SCENARIOS = {
  V3: {
    TITLE: "Mobile App",
    DESCRIPTION: "Generate ads for app install campaigns, focusing on features and user benefits.",
  },
  V4: {
    TITLE: "Any Product",
    DESCRIPTION: "Generate ads for physical products, services, courses, or any other offering.",
  },
} as const;

/**
 * Template categories
 */
export const UI_TEMPLATE_CATEGORIES = {
  APP: "Apps",
  PHYSICAL: "Physical Products",
  UNIVERSAL: "Universal",
} as const;

/**
 * Copy check score labels
 */
export const UI_COPY_CHECK = {
  READING_EASE: "Reading Ease",
  GRAMMAR: "Grammar",
  PERSUASION: "Persuasion Score",
  BIAS_SCORE: "Bias Score",
  TREND_ALIGNMENT: "Trend Alignment",
  FRAMEWORK_DETECTION: "Framework Detection",
} as const;

/**
 * Visual hook types labels
 */
export const UI_VISUAL_HOOK_TYPES = {
  "authority-staging": "Authority Staging",
  "scenic-interrupt": "Scenic Interrupt",
  "category-anchor": "Category Anchor",
  "routine-window": "Routine Window",
  "social-curiosity": "Social Curiosity",
  "narrative-animation": "Narrative Animation",
  "ugc-reaction": "UGC Reaction",
  "dramatic-reenactment": "Dramatic Reenactment",
  "product-in-context": "Product in Context",
  "dynamic": "Dynamic",
} as const;

/**
 * Platform names for display
 */
export const UI_PLATFORMS = {
  TIKTOK: "TikTok",
  META_IG: "Meta/Instagram",
  YOUTUBE: "YouTube",
  SNAPCHAT: "Snapchat",
} as const;

/**
 * Psychological territory names for display
 */
export const UI_PSYCHOLOGICAL_TERRITORIES = {
  IDENTITY_TENSION: "Identity Tension",
  DISPLACEMENT_ANXIETY: "Displacement Anxiety",
  LOSS_DECAY: "Loss & Decay",
  SOCIAL_POSITIONING: "Social Positioning",
  ASPIRATION_GAP: "Aspiration Gap",
  HABIT_ARCHITECTURE: "Habit Architecture",
  DISCOVERY_REVELATION: "Discovery & Revelation",
  RELIEF_SURRENDER: "Relief & Surrender",
} as const;
