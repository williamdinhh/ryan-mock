import { EvaluationResult } from '../models/types';

interface CacheEntry {
  result: EvaluationResult;
  expiresAt: number;
}

const TTL_MS = 5 * 60 * 1000; // 5 minutes

const cache = new Map<string, CacheEntry>();

function cacheKey(flagKey: string, userId: string): string {
  return `${flagKey}::${userId}`;
}

export function getCached(flagKey: string, userId: string): EvaluationResult | undefined {
  const entry = cache.get(cacheKey(flagKey, userId));
  if (!entry) return undefined;

  if (Date.now() > entry.expiresAt) {
    cache.delete(cacheKey(flagKey, userId));
    return undefined;
  }

  return entry.result;
}

export function setCached(flagKey: string, userId: string, result: EvaluationResult): void {
  cache.set(cacheKey(flagKey, userId), {
    result,
    expiresAt: Date.now() + TTL_MS
  });
}
