# PLAT-2214: Checkout flag toggle seems delayed + need per-customer override

| Field      | Value                                   |
|------------|-----------------------------------------|
| Type       | Bug + Feature request                   |
| Priority   | P2 (customer-reported; demo next sprint) |
| Reporter   | Support (forwarded from Acme)           |
| Component  | flagforge-api (flag evaluation)         |
| Assignee   | You                                     |

## Background

Acme (enterprise customer) reported an issue with the `new-checkout-flow` flag.
Support's summary of the thread:

- Yesterday around **3:00pm**, an Acme admin turned `new-checkout-flow` **off**
  for all their users.
- A few Acme users said they were **still seeing the new checkout as late as
  ~3:10pm**.
- Acme's admin is confident the toggle was saved correctly. They are asking
  whether this is expected behavior, and how long a change takes to take effect.
- Support has not been able to reproduce it themselves, and does not have
  user IDs for the affected users.

## Part A: Delayed toggle

Dig into the evaluation path and work out what is going on. Support needs two
things back from engineering:

1. A root-cause explanation they can relay to Acme.
2. A fix, or a clear statement of what the expected propagation delay is.

Please don't just "make it work": we'd like to be confident it's actually
fixed, and that we haven't broken evaluation for other flags or users.

## Part B: Per-customer override

Sales asked whether we can **force a flag on for specific customers** (for
example, beta partners), regardless of the rollout percentage that would
normally put them in. They want to demo this to a customer **next sprint**.

There is no design yet. The ask is just "can we support it?" Propose and
implement something reasonable. If you have questions about the intended
behavior, ask them.

## Part C (stretch): Explain why a user got a result

Support's follow-up on the Acme thread: even once the delay is fixed, they
can't tell *why* a given user saw a given result, and they want to answer that
without asking engineering each time.

Add a way to ask "why?" for a specific flag and user. The response should show
how the decision was reached, step by step (for example which checks ran, which
one decided the outcome, and what the user's rollout bucket was). It must give
the same answer a real evaluation would give, and must not change any state.

Design the API shape yourself.

## Notes from the team

- The service is small and in-memory. No database is involved.
- Run the app with `npm run dev` and the tests with `npm test`.
- Existing behavior for flags and users not involved in this ticket should
  not change.

## Out of scope

- Persistent storage / a real database
- Authentication and authorization
- UI
