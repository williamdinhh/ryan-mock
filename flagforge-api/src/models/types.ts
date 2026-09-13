export interface TargetingRule {
  attribute: string;
  operator: 'equals' | 'in';
  values: string[];
}

export interface FeatureFlag {
  key: string;
  description: string;
  enabled: boolean; // global kill switch
  rolloutPercentage: number; // 0-100, percentage of users in the rollout bucket
  targetingRules: TargetingRule[]; // rules that force a match regardless of bucket
  updatedAt: number; // epoch ms, bumped on every mutation
}

export interface EvaluationContext {
  userId: string;
  attributes: Record<string, string>;
}

export interface EvaluationResult {
  flagKey: string;
  userId: string;
  enabled: boolean;
  reason: string;
}
