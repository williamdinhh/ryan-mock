import { EvaluationContext, EvaluationResult, FeatureFlag } from '../models/types';
import { getCached, setCached } from './evaluationCache';
import { matchesTargeting } from './targetingService';
import { isInRollout } from './rolloutService';

/**
 * Evaluates a flag for a given user. Evaluation order:
 *   1. Global kill switch
 *   2. Targeting rules
 *   3. Rollout percentage bucket
 * Results are cached per (flag, user) to keep evaluate() cheap under load.
 */
export function evaluate(flag: FeatureFlag, ctx: EvaluationContext): EvaluationResult {
  const cached = getCached(flag.key, ctx.userId);
  if (cached) return cached;

  let result: EvaluationResult;

  if (!flag.enabled) {
    result = { flagKey: flag.key, userId: ctx.userId, enabled: false, reason: 'flag disabled' };
  } else if (matchesTargeting(flag.targetingRules, ctx.attributes)) {
    result = { flagKey: flag.key, userId: ctx.userId, enabled: true, reason: 'targeting rule match' };
  } else {
    const inRollout = isInRollout(flag.key, ctx.userId, flag.rolloutPercentage);
    result = {
      flagKey: flag.key,
      userId: ctx.userId,
      enabled: inRollout,
      reason: inRollout ? 'in rollout bucket' : 'outside rollout bucket'
    };
  }

  setCached(flag.key, ctx.userId, result);
  return result;
}
