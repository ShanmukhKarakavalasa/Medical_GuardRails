# Medical GuardRails - Drug Safety Engine

Deterministic pre-LLM safety layer for clinical prompts.

## Features
- Database-driven DDI lookup, allergy conflict logic, renal dose checks, calculators.
- Constraint text generator for LLM system prompt injection.
- Includes schema + seed SQL for 50 drugs and 30 interactions.

## Quick start
```bash
npm install
npm run check
```

## Files
- `supabase/schema.sql` / `supabase/seed.sql`
- `src/lib/safety-engine.js`
- `src/lib/calculators.js`
- `test/safety.test.mjs`
