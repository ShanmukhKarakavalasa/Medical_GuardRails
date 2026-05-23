import { computeCha2Ds2Vasc, computeEgfr } from './calculators';
import { AllergyCrossReactivity, Drug, DrugInteraction, Patient } from './types';

const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, '');

export function buildDdiIndex(interactions: DrugInteraction[]): Map<string, DrugInteraction> {
  const m = new Map<string, DrugInteraction>();
  for (const i of interactions) m.set([norm(i.drug_a), norm(i.drug_b)].sort().join('|'), i);
  return m;
}

export function checkDrugInteractions(newDrug: string, currentMeds: string[], ddiIndex: Map<string, DrugInteraction>) {
  return currentMeds.map((m) => ddiIndex.get([norm(newDrug), norm(m)].sort().join('|'))).filter(Boolean) as DrugInteraction[];
}

export function checkAllergyConflicts(newDrug: Drug | undefined, allergies: Patient['allergies'], crossRows: AllergyCrossReactivity[]) {
  if (!newDrug) return [{ icon: '⚠️', severity: 'UNKNOWN', message: 'Drug not present in local formulary.' }];
  const alerts: { icon: string; severity: string; message: string }[] = [];
  for (const a of allergies) {
    const an = norm(a.name);
    if (an === norm(newDrug.generic_name) || an === norm(newDrug.drug_class)) alerts.push({ icon: '⛔', severity: 'HARD_BLOCK', message: `${newDrug.generic_name} conflicts with allergy ${a.name} (${a.reaction}).` });
    for (const row of crossRows) {
      if (norm(row.allergy_to) === an && (norm(row.cross_reacts_with) === norm(newDrug.generic_name) || norm(row.cross_reacts_with) === norm(newDrug.drug_class))) {
        alerts.push({ icon: row.cross_reactivity_pct === '100%' ? '⛔' : '⚠️', severity: row.cross_reactivity_pct === '100%' ? 'HARD_BLOCK' : 'WARNING', message: `${a.name} cross-reacts with ${newDrug.generic_name}: ${row.clinical_guidance} (${row.cross_reactivity_pct}).` });
      }
    }
  }
  return alerts;
}

export function checkRenalDosing(newDrug: Drug | undefined, egfr: number) {
  if (!newDrug) return [];
  const rules = newDrug.renal_dosing?.rules ?? [];
  return rules
    .filter((r) => typeof r.maxEgfr === 'number' ? egfr <= r.maxEgfr : !!r.note)
    .map((r) => ({ icon: '⚠️', severity: 'RENAL', message: r.recommendation ? `${newDrug.generic_name}: eGFR ${egfr} => ${r.recommendation}.` : `${newDrug.generic_name}: ${r.note}` }));
}

export function runSafetyChecks(input: { newDrug: string; patient: Patient; drugs: Drug[]; interactions: DrugInteraction[]; crossRows: AllergyCrossReactivity[]; }) {
  const drugMap = new Map(input.drugs.map((d) => [norm(d.generic_name), d]));
  const ddiIndex = buildDdiIndex(input.interactions);
  const egfr = input.patient.egfr ?? computeEgfr(input.patient.creatinine, input.patient.age, input.patient.sex);
  const newDrug = drugMap.get(norm(input.newDrug));
  const ddi = checkDrugInteractions(input.newDrug, input.patient.medications, ddiIndex);
  const allergy = checkAllergyConflicts(newDrug, input.patient.allergies, input.crossRows);
  const renal = checkRenalDosing(newDrug, egfr);
  const score = input.patient.conditions?.af
    ? computeCha2Ds2Vasc({ age: input.patient.age, sex: input.patient.sex, ...input.patient.conditions })
    : undefined;
  const scoreAlerts = [`ℹ️ eGFR (CKD-EPI 2021): ${egfr}`];
  if (typeof score === 'number') scoreAlerts.push(`ℹ️ CHA₂DS₂-VASc: ${score}`);

  return { ddi, allergy, renal, egfr, cha2ds2vasc: score, constraintText: createConstraintText({ ddi, allergy, renal, scoreAlerts }) };
}

function createConstraintText(parts: { ddi: DrugInteraction[]; allergy: { icon: string; message: string }[]; renal: { icon: string; message: string }[]; scoreAlerts: string[] }) {
  const lines = ['Deterministic Safety Constraints (non-overridable):'];
  for (const a of parts.allergy) lines.push(`${a.icon} ${a.message}`);
  for (const d of parts.ddi) lines.push(`${d.severity === 'SEVERE' ? '⛔' : '⚠️'} ${d.drug_a} + ${d.drug_b}: ${d.clinical_effect}. Management: ${d.management}`);
  for (const r of parts.renal) lines.push(`${r.icon} ${r.message}`);
  lines.push(...parts.scoreAlerts);
  return lines.join('\n');
}
