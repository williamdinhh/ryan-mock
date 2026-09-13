import { Request, Response } from 'express';
import * as flagRepository from '../repositories/flagRepository';
import { evaluate } from '../services/flagService';

export function listFlags(req: Request, res: Response): void {
  res.json(flagRepository.getAll());
}

export function getFlag(req: Request, res: Response): void {
  const flag = flagRepository.getByKey(req.params.key);
  if (!flag) {
    res.status(404).json({ error: `flag '${req.params.key}' not found` });
    return;
  }
  res.json(flag);
}

export function createFlag(req: Request, res: Response): void {
  const { key, description, enabled, rolloutPercentage, targetingRules } = req.body;

  if (!key || typeof key !== 'string') {
    res.status(400).json({ error: 'key is required' });
    return;
  }
  if (flagRepository.getByKey(key)) {
    res.status(409).json({ error: `flag '${key}' already exists` });
    return;
  }

  const flag = flagRepository.create({
    key,
    description: description ?? '',
    enabled: enabled ?? false,
    rolloutPercentage: rolloutPercentage ?? 0,
    targetingRules: targetingRules ?? [],
    updatedAt: Date.now()
  });

  res.status(201).json(flag);
}

export function updateFlag(req: Request, res: Response): void {
  const updated = flagRepository.update(req.params.key, req.body);
  if (!updated) {
    res.status(404).json({ error: `flag '${req.params.key}' not found` });
    return;
  }
  res.json(updated);
}

export function evaluateFlag(req: Request, res: Response): void {
  const flag = flagRepository.getByKey(req.params.key);
  if (!flag) {
    res.status(404).json({ error: `flag '${req.params.key}' not found` });
    return;
  }

  const { userId, attributes } = req.body;
  if (!userId || typeof userId !== 'string') {
    res.status(400).json({ error: 'userId is required' });
    return;
  }

  const result = evaluate(flag, { userId, attributes: attributes ?? {} });
  res.json(result);
}
