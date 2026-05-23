# Architecture Notes

1. **Data layer**: Supabase tables store drugs/interactions/cross-reactivity.
2. **Safety layer**: deterministic functions only (no LLM calls).
3. **Constraint layer**: severity-ranked symbols and directives.
4. **LLM layer**: consume constraint text as non-overridable system prefix.

## Performance
- Interaction pairs are pre-indexed in memory as a normalized key map.
- Patient medication check is O(n) lookups after preprocessing.

## Extensibility
- New drug/interaction are data-only inserts.
- Calculators are independent functions and can be registry-driven.
