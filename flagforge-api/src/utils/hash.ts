/**
 * Deterministically buckets a (flagKey, userId) pair into [0, 100).
 * Same inputs always produce the same bucket, so a given user's rollout
 * membership is stable across evaluations for a given flag.
 */
export function bucketFor(flagKey: string, userId: string): number {
  const str = `${flagKey}:${userId}`;
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) + hash + str.charCodeAt(i)) >>> 0;
  }
  return hash % 100;
}
