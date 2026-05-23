import test from 'node:test';
import assert from 'node:assert/strict';
import { runSafetyEngine, buildIndexes } from '../src/lib/safety-engine.js';
import { computeEgfr, computeCha2Ds2Vasc } from '../src/lib/calculators.js';

const drugs = [
  { generic_name: 'Clarithromycin', drug_class: 'macrolide', renal_dosing: { rules: [{ maxEgfr: 30, recommendation: 'reduce 50%' }] } },
  { generic_name: 'Atorvastatin', drug_class: 'statin', renal_dosing: { rules: [] } },
  { generic_name: 'Amoxicillin-Clavulanate', drug_class: 'penicillin', renal_dosing: { rules: [{ maxEgfr: 30, recommendation: 'reduce frequency' }] } },
  { generic_name: 'Gabapentin', drug_class: 'gabapentinoid', renal_dosing: { rules: [{ maxEgfr: 30, recommendation: '100mg OD' }] } }
];
const interactions = [{ drug_a:'Clarithromycin', drug_b:'Atorvastatin', severity:'SEVERE', clinical_effect:'rhabdomyolysis', management:'avoid', mechanism:'CYP3A4' }];
const crossRows = [{ allergy_to:'Penicillin', cross_reacts_with:'penicillin', cross_reactivity_pct:'100%', clinical_guidance:'Same class - direct match' }];
const db = { ...buildIndexes(drugs, interactions), crossRows };

test('eGFR calculator', () => assert.equal(computeEgfr({ creatinine: 3.2, age: 35, sex: 'female' }), 18.7));
test('CHA2DS2-VASc', () => assert.equal(computeCha2Ds2Vasc({ age: 68, sex: 'male', hf:true, htn:true, dm:true, tia:true, vascular:false }), 6));
test('scenario catches severe interaction', () => {
  const r = runSafetyEngine({ newDrug:'Clarithromycin', patient:{ age:78, sex:'male', creatinine:1.4, meds:['Atorvastatin'], allergies:[] } }, db);
  assert.equal(r.ddi.length, 1);
});
test('anaphylaxis block', () => {
  const r = runSafetyEngine({ newDrug:'Amoxicillin-Clavulanate', patient:{ age:65, sex:'male', creatinine:2.1, meds:[], allergies:[{name:'Penicillin', reaction:'ANAPHYLAXIS'}] } }, db);
  assert.equal(r.allergy[0].severity, 'HARD_BLOCK');
});
