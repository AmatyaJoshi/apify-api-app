export interface Actor {
  id: string;
  name: string;
  title: string;
  description: string;
  username?: string;
  inputSchema?: any;
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
  results: any[];
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
  plan: string | { id: string; tier: string; [key: string]: any };
  usage: {
    monthlyUsageUsd?: number;
    monthlyLimitUsd?: number;
  };
  isEmailVerified: boolean;
}
