# Doctor BRAHMO Drug Safety Engine

Next.js + TypeScript demo app implementing deterministic pre-LLM medication safety guardrails.

## Project Structure
- `src/app/page.tsx` main demo UI
- `src/app/api/safety-check/route.ts` deterministic safety engine endpoint
- `src/app/api/claude/route.ts` generic vs safety-enhanced LLM endpoint
- `src/lib/supabase.ts`, `src/lib/safety-engine.ts`, `src/lib/calculators.ts`, `src/lib/types.ts`
- `src/components/PatientCard.tsx`, `SafetyAlerts.tsx`, `ResponseComparison.tsx`
- `supabase/schema.sql`, `supabase/seed.sql`
- `docs/architecture.md`

## Run locally (Windows E drive)
```powershell
E:
cd \Medical_GuardRails
npm install
copy .env.local.example .env.local
# fill env values
npm run dev
```

Open `http://localhost:3000`.

## Validation
```bash
npm run check
```
