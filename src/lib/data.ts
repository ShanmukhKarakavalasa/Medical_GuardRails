import { AllergyCrossReactivity, Drug, DrugInteraction, Patient } from './types';
import fs from 'node:fs';

export const patients: Patient[] = [
  { id:1,label:'Patient 1',age:65,sex:'male',medications:['Metformin','Glimepiride','Telmisartan','Atorvastatin'],allergies:[{name:'Penicillin',reaction:'ANAPHYLAXIS'}],creatinine:2.1,egfr:31.2 },
  { id:2,label:'Patient 2',age:58,sex:'female',medications:['Enoxaparin','Paracetamol','Tramadol','Pantoprazole'],allergies:[],creatinine:0.9,egfr:82 },
  { id:3,label:'Patient 3',age:78,sex:'male',medications:['Amlodipine','Telmisartan','Metformin','Glimepiride','Atorvastatin','Aspirin','Pantoprazole','Escitalopram','Tamsulosin','Paracetamol','Diclofenac'],allergies:[{name:'Sulfonamide',reaction:'rash'}],creatinine:1.4,egfr:48 },
  { id:4,label:'Patient 4',age:6,sex:'female',medications:['Sodium Valproate'],allergies:[],creatinine:0.4 },
  { id:5,label:'Patient 5',age:62,sex:'male',medications:['Furosemide','Carvedilol','Amlodipine'],allergies:[{name:'ACE inhibitor',reaction:'angioedema'}],creatinine:4.8,egfr:12 },
  { id:6,label:'Patient 6',age:28,sex:'female',medications:['Methyldopa'],allergies:[{name:'Codeine',reaction:'nausea'}],creatinine:0.6 },
  { id:7,label:'Patient 7',age:35,sex:'female',medications:['Meropenem','Enoxaparin','Pantoprazole'],allergies:[{name:'Penicillin',reaction:'rash'}],creatinine:3.2,egfr:18 },
  { id:8,label:'Patient 8',age:68,sex:'male',medications:['Warfarin','Bisoprolol','Ramipril','Atorvastatin','Furosemide','Spironolactone'],allergies:[],creatinine:1.2,egfr:62,conditions:{af:true,hf:true,htn:true,dm:true,tia:true,vascular:false} },
  { id:9,label:'Patient 9',age:55,sex:'male',medications:['Metformin','Empagliflozin','Insulin Glargine','Pregabalin','Duloxetine','Aspirin'],allergies:[{name:'Metoclopramide',reaction:'dystonia'}],creatinine:1.0,egfr:72 },
  { id:10,label:'Patient 10',age:10,sex:'female',medications:['Salbutamol','Fluticasone','Montelukast'],allergies:[{name:'Aspirin',reaction:'bronchospasm'}],creatinine:0.5 }
];

// lightweight local fallback for demo without Supabase network
export const localDrugs: Drug[] = [
  { generic_name:'Clarithromycin', generic_name_normalized:'clarithromycin', drug_class:'macrolide', renal_dosing:{rules:[{maxEgfr:30,recommendation:'reduce 50%'}]} },
  { generic_name:'Atorvastatin', generic_name_normalized:'atorvastatin', drug_class:'statin', renal_dosing:{} },
  { generic_name:'Amlodipine', generic_name_normalized:'amlodipine', drug_class:'ccb', renal_dosing:{} },
  { generic_name:'Amoxicillin-Clavulanate', generic_name_normalized:'amoxicillinclavulanate', drug_class:'penicillin', renal_dosing:{rules:[{maxEgfr:30,recommendation:'reduce frequency'}]} },
  { generic_name:'Gabapentin', generic_name_normalized:'gabapentin', drug_class:'gabapentinoid', renal_dosing:{rules:[{maxEgfr:30,recommendation:'100mg once daily'}]} },
  { generic_name:'Nitrofurantoin', generic_name_normalized:'nitrofurantoin', drug_class:'nitrofuran', renal_dosing:{rules:[{maxEgfr:30,recommendation:'avoid'}]} },
  { generic_name:'Co-trimoxazole', generic_name_normalized:'cotrimoxazole', drug_class:'sulfonamide', renal_dosing:{rules:[{maxEgfr:15,recommendation:'avoid'}]} }
];

export const localInteractions: DrugInteraction[] = [
  { drug_a:'Clarithromycin', drug_b:'Atorvastatin', severity:'SEVERE', mechanism:'CYP3A4', clinical_effect:'4-5x statin levels → rhabdomyolysis', management:'Use Azithromycin instead' },
  { drug_a:'Clarithromycin', drug_b:'Amlodipine', severity:'MODERATE', mechanism:'CYP3A4', clinical_effect:'hypotension risk', management:'Monitor BP, prefer non-interacting antibiotic' },
  { drug_a:'Diclofenac', drug_b:'Telmisartan', severity:'SEVERE', mechanism:'triple whammy', clinical_effect:'AKI/nephrotoxicity', management:'Avoid NSAID' },
  { drug_a:'Fluoxetine', drug_b:'Tramadol', severity:'SEVERE', mechanism:'serotonin', clinical_effect:'serotonin syndrome', management:'Avoid combination' },
  { drug_a:'Clopidogrel', drug_b:'Omeprazole', severity:'MODERATE', mechanism:'CYP2C19', clinical_effect:'reduced antiplatelet effect', management:'Switch to pantoprazole' }
];

export const localCrossRows: AllergyCrossReactivity[] = [
  { allergy_to:'Penicillin', cross_reacts_with:'penicillin', cross_reactivity_pct:'100%', clinical_guidance:'Same class — direct match' },
  { allergy_to:'Penicillin', cross_reacts_with:'cephalosporin_1st', cross_reactivity_pct:'1-2%', clinical_guidance:'Avoid if anaphylaxis' },
  { allergy_to:'Sulfonamide', cross_reacts_with:'Co-trimoxazole', cross_reactivity_pct:'100%', clinical_guidance:'Same class' },
  { allergy_to:'NSAID/Aspirin', cross_reacts_with:'nsaid', cross_reactivity_pct:'variable', clinical_guidance:'Avoid all NSAIDs in aspirin-exacerbated disease' }
];
