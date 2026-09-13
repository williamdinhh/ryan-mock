import { TargetingRule } from '../models/types';

/**
 * A flag with targeting rules is considered a match only when every rule
 * passes (AND semantics). A flag with no rules never matches on targeting
 * alone -- it falls through to rollout-percentage bucketing instead.
 */
export function matchesTargeting(
  rules: TargetingRule[],
  attributes: Record<string, string>
): boolean {
  if (rules.length === 0) return false;

  return rules.every((rule) => {
    const value = attributes[rule.attribute];
    if (value === undefined) return false;

    switch (rule.operator) {
      case 'equals':
        return rule.values[0] === value;
      case 'in':
        return rule.values.includes(value);
      default:
        return false;
    }
  });
}
