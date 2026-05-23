# Architecture

## Layers
1. **Database layer** (Supabase): `drugs`, `drug_interactions`, `allergy_cross_reactivity`.
2. **Deterministic engine layer**: interaction lookup, allergy matching, renal rules, calculators.
3. **Constraint generation layer**: converts safety findings into non-overridable prompt text.
4. **LLM layer**: two modes (generic/enhanced) for side-by-side comparison.
5. **UI layer**: patient selector, safety alerts, response comparison.

## Extensibility
- Add a drug/interaction with one row insert; logic auto-picks it up.
- DDI pairs pre-indexed in memory map for fast O(n) checks per medication list.
- New calculators can be added as independent functions and included in route orchestration.
