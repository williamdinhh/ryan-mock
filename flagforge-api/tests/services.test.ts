import { bucketFor } from '../src/utils/hash';
import { isInRollout } from '../src/services/rolloutService';
import { matchesTargeting } from '../src/services/targetingService';
import { evaluate } from '../src/services/flagService';
import { FeatureFlag } from '../src/models/types';

describe('bucketFor', () => {
  it('is deterministic for the same inputs', () => {
    const a = bucketFor('flag-a', 'user-1');
    const b = bucketFor('flag-a', 'user-1');
    expect(a).toBe(b);
  });

  it('returns a value between 0 and 99', () => {
    const b = bucketFor('flag-a', 'user-1');
    expect(b).toBeGreaterThanOrEqual(0);
    expect(b).toBeLessThan(100);
  });
});

describe('isInRollout', () => {
  it('excludes everyone at 0%', () => {
    expect(isInRollout('flag-a', 'user-1', 0)).toBe(false);
  });

  it('includes everyone at 100%', () => {
    expect(isInRollout('flag-a', 'user-1', 100)).toBe(true);
  });
});

describe('matchesTargeting', () => {
  it('returns false when there are no rules', () => {
    expect(matchesTargeting([], { plan: 'beta' })).toBe(false);
  });

  it('matches an equals rule', () => {
    const rules = [{ attribute: 'plan', operator: 'equals' as const, values: ['beta'] }];
    expect(matchesTargeting(rules, { plan: 'beta' })).toBe(true);
    expect(matchesTargeting(rules, { plan: 'free' })).toBe(false);
  });

  it('matches an in rule', () => {
    const rules = [{ attribute: 'region', operator: 'in' as const, values: ['us', 'ca'] }];
    expect(matchesTargeting(rules, { region: 'us' })).toBe(true);
    expect(matchesTargeting(rules, { region: 'de' })).toBe(false);
  });
});

describe('evaluate', () => {
  const baseFlag: FeatureFlag = {
    key: 'test-flag',
    description: 'test',
    enabled: true,
    rolloutPercentage: 100,
    targetingRules: [],
    updatedAt: Date.now()
  };

  it('returns disabled when the kill switch is off', () => {
    const flag = { ...baseFlag, enabled: false, key: 'kill-switch-flag' };
    const result = evaluate(flag, { userId: 'u1', attributes: {} });
    expect(result.enabled).toBe(false);
    expect(result.reason).toBe('flag disabled');
  });

  it('returns enabled when a targeting rule matches', () => {
    const flag = {
      ...baseFlag,
      key: 'targeting-flag',
      rolloutPercentage: 0,
      targetingRules: [{ attribute: 'plan', operator: 'equals' as const, values: ['beta'] }]
    };
    const result = evaluate(flag, { userId: 'u2', attributes: { plan: 'beta' } });
    expect(result.enabled).toBe(true);
    expect(result.reason).toBe('targeting rule match');
  });

  it('falls back to rollout bucket when no targeting rules match', () => {
    const flag = { ...baseFlag, key: 'rollout-flag', rolloutPercentage: 100 };
    const result = evaluate(flag, { userId: 'u3', attributes: {} });
    expect(result.enabled).toBe(true);
    expect(result.reason).toBe('in rollout bucket');
  });
});
