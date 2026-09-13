# flagforge-api

A small in-memory feature flag evaluation service. It lets you register flags,
update their rollout rules, and evaluate whether a given flag is on for a
given user.

## Running it

```bash
npm install
npm run dev      # starts the server on http://localhost:3000
```

No database or external services are required — flag data lives in memory
and is seeded on startup (see `src/repositories/flagRepository.ts`).

## Running the tests

```bash
npm test
```

## Project layout

```
src/
  index.ts                     # process entrypoint, starts the HTTP server
  app.ts                       # express app wiring (middleware + routes)
  models/
    types.ts                   # shared TypeScript interfaces
  routes/
    flags.routes.ts            # route -> controller mapping
  controllers/
    flags.controller.ts        # request/response handling, input validation
  services/
    flagService.ts             # orchestrates a single flag evaluation
    targetingService.ts        # attribute-based targeting rule matching
    rolloutService.ts          # percentage-rollout bucketing
    evaluationCache.ts         # short-lived cache for evaluation results
  repositories/
    flagRepository.ts          # in-memory flag storage + seed data
  middleware/
    errorHandler.ts            # centralized error handling
  utils/
    hash.ts                    # deterministic string hashing for bucketing
tests/
  services.test.ts             # unit tests for the service layer
  flags.routes.test.ts         # integration tests against the HTTP API
```

## API

| Method | Path                        | Description                              |
|--------|-----------------------------|-------------------------------------------|
| GET    | `/api/flags`                 | List all flags                            |
| GET    | `/api/flags/:key`            | Get a single flag                         |
| POST   | `/api/flags`                 | Create a flag                             |
| PATCH  | `/api/flags/:key`            | Update a flag (partial update)            |
| POST   | `/api/flags/:key/evaluate`   | Evaluate a flag for a user                |

### Evaluating a flag

```bash
curl -X POST http://localhost:3000/api/flags/new-checkout-flow/evaluate \
  -H 'Content-Type: application/json' \
  -d '{"userId": "user-123", "attributes": {"plan": "beta"}}'
```

Evaluation order is: global kill switch → targeting rules → rollout
percentage bucket. Every flag/user evaluation is deterministic — the same
flag configuration and user will always land in the same rollout bucket.

### Seeded flags

- `new-checkout-flow` — 50% rollout, plus a targeting rule for `plan: beta`
- `dark-mode` — 100% rollout
- `export-csv` — off
- `ai-suggestions` — 20% rollout, targeting `region: us|ca`
