import { computeCha2Ds2Vasc, computeEgfr } from './calculators.js';

const norm = (s) => s.toLowerCase().replace(/[^a-z0-9]/g, '');

export function buildIndexes(drugs, interactions) {
  const drugMap = new Map(drugs.map((d) => [norm(d.generic_name), d]));
  const ddi = new Map();
  for (const i of interactions) ddi.set([norm(i.drug_a), norm(i.drug_b)].sort().join('|'), i);
  return { drugMap, ddi };
}

export function checkDrugInteractions(newDrug, currentMeds, ddi) {
  return currentMeds.map((m) => ddi.get([norm(newDrug), norm(m)].sort().join('|'))).filter(Boolean);
}

export function checkRenalDosing(drug, egfr) {
  const rules = drug?.renal_dosing?.rules || [];
  return rules.filter((r) => r.maxEgfr && egfr <= r.maxEgfr);
}

export function checkAllergyConflicts(newDrug, allergies, drug, crossRows) {
  const hits = [];
  for (const a of allergies) {
    if (norm(a.name) === norm(newDrug) || norm(a.name) === norm(drug?.drug_class)) hits.push({ type: 'direct', severity: 'HARD_BLOCK', detail: `${newDrug} conflicts with ${a.name}` });
    for (const row of crossRows) {
      if (norm(row.allergy_to) === norm(a.name) && (norm(row.cross_reacts_with) === norm(newDrug) || norm(row.cross_reacts_with) === norm(drug?.drug_class))) hits.push({ type: 'cross', severity: row.cross_reactivity_pct === '100%' ? 'HARD_BLOCK' : 'WARNING', detail: row.clinical_guidance });
    }
  }
  return hits;
}

export function generateConstraints(results) {
  const lines = ['Safety constraints (deterministic, non-overridable):'];
  for (const r of results.allergy) lines.push(`⛔ ${r.detail}`);
  for (const r of results.ddi) lines.push(`${r.severity === 'SEVERE' ? '⛔' : '⚠️'} ${r.drug_a}+${r.drug_b}: ${r.clinical_effect}. ${r.management}`);
  for (const r of results.renal) lines.push(`⚠️ Renal: ${r.recommendation}`);
  for (const r of results.scores) lines.push(`ℹ️ ${r}`);
  return lines.join('\n');
}

export function runSafetyEngine(input, db) {
  const egfr = input.patient.egfr ?? computeEgfr({ creatinine: input.patient.creatinine, age: input.patient.age, sex: input.patient.sex });
  const drug = db.drugMap.get(norm(input.newDrug));
  const ddi = checkDrugInteractions(input.newDrug, input.patient.meds, db.ddi);
  const allergy = checkAllergyConflicts(input.newDrug, input.patient.allergies || [], drug, db.crossRows);
  const renal = drug ? checkRenalDosing(drug, egfr) : [{ recommendation: `Drug ${input.newDrug} not found in database` }];
  const scores = [`eGFR = ${egfr}`];
  if (input.patient.conditions?.af) scores.push(`CHA₂DS₂-VASc = ${computeCha2Ds2Vasc({age: input.patient.age, sex: input.patient.sex, ...input.patient.conditions})}`);
  const results = { ddi, allergy, renal, scores };
  return { ...results, constraints: generateConstraints(results) };
}
