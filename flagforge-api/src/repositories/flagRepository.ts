import { FeatureFlag } from '../models/types';

const flags = new Map<string, FeatureFlag>();

function seed(): void {
  const now = Date.now();
  const seedFlags: FeatureFlag[] = [
    {
      key: 'new-checkout-flow',
      description: 'Redesigned checkout funnel',
      enabled: true,
      rolloutPercentage: 50,
      targetingRules: [{ attribute: 'plan', operator: 'equals', values: ['beta'] }],
      updatedAt: now
    },
    {
      key: 'dark-mode',
      description: 'Dark theme across the app',
      enabled: true,
      rolloutPercentage: 100,
      targetingRules: [],
      updatedAt: now
    },
    {
      key: 'export-csv',
      description: 'Bulk CSV export for reports',
      enabled: false,
      rolloutPercentage: 0,
      targetingRules: [],
      updatedAt: now
    },
    {
      key: 'ai-suggestions',
      description: 'Inline AI writing suggestions in the editor',
      enabled: true,
      rolloutPercentage: 20,
      targetingRules: [{ attribute: 'region', operator: 'in', values: ['us', 'ca'] }],
      updatedAt: now
    }
  ];
  seedFlags.forEach((f) => flags.set(f.key, f));
}

seed();

export function getAll(): FeatureFlag[] {
  return Array.from(flags.values());
}

export function getByKey(key: string): FeatureFlag | undefined {
  return flags.get(key);
}

export function create(flag: FeatureFlag): FeatureFlag {
  flags.set(flag.key, flag);
  return flag;
}

export function update(key: string, patch: Partial<FeatureFlag>): FeatureFlag | undefined {
  const existing = flags.get(key);
  if (!existing) return undefined;
  const updated: FeatureFlag = {
    ...existing,
    ...patch,
    key: existing.key,
    updatedAt: Date.now()
  };
  flags.set(key, updated);
  return updated;
}

export function reset(): void {
  flags.clear();
  seed();
}
