import { bucketFor } from '../utils/hash';

/**
 * Determines whether a user falls inside a flag's rollout percentage.
 * Bucketing is deterministic, so a user's membership only changes if the
 * percentage itself changes.
 */
export function isInRollout(flagKey: string, userId: string, percentage: number): boolean {
  if (percentage >= 100) return true;
  if (percentage <= 0) return false;
  return bucketFor(flagKey, userId) < percentage;
}
