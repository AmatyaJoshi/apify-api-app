export interface Actor {
  id: string;
  name: string;
  title: string;
  description: string;
  username?: string;
  inputSchema?: JsonSchema;
}

export interface JsonSchema {
  type: string;
  title?: string;
  description?: string;
  properties?: Record<string, JsonSchemaProperty>;
  required?: string[];
  [key: string]: unknown;
}

export interface JsonSchemaProperty {
  type: string;
  title?: string;
  description?: string;
  default?: unknown;
  enum?: unknown[];
  items?: JsonSchemaProperty;
  properties?: Record<string, JsonSchemaProperty>;
  required?: string[];
  [key: string]: unknown;
}

export interface ActorRun {
  id: string;
  status: string;
  startedAt: string;
  finishedAt?: string;
  stats?: {
    runTimeSecs?: number;
  };
  defaultDatasetId: string;
}

export interface ExecutionResult {
  runId: string;
  status: string;
  results: Record<string, unknown>[];
  stats: {
    itemCount: number;
    executionTime: number;
  };
}

export interface User {
  id: string;
  username: string;
  email: string;
  profile: {
    name: string;
    bio: string;
    avatarUrl: string;
    website: string;
  };
  plan: string | { id: string; tier: string; [key: string]: unknown };
  usage: {
    monthlyUsageUsd?: number;
    monthlyLimitUsd?: number;
  };
  isEmailVerified: boolean;
}
