import fs from 'node:fs';

export const patients = [
  { id: 1, label: 'Patient 1', age: 65, sex: 'male', meds: ['Metformin','Glimepiride','Telmisartan','Atorvastatin'], allergies:[{name:'Penicillin',reaction:'ANAPHYLAXIS'}], creatinine:2.1, egfr:31.2 },
  { id: 3, label: 'Patient 3', age: 78, sex: 'male', meds: ['Amlodipine','Telmisartan','Metformin','Glimepiride','Atorvastatin','Aspirin','Pantoprazole','Escitalopram','Tamsulosin','Paracetamol','Diclofenac'], allergies:[{name:'Sulfonamide',reaction:'rash'}], creatinine:1.4, egfr:48 },
  { id: 7, label: 'Patient 7', age: 35, sex: 'female', meds: ['Meropenem','Enoxaparin','Pantoprazole'], allergies:[{name:'Penicillin',reaction:'rash'}], creatinine:3.2, egfr:18 },
  { id: 8, label: 'Patient 8', age: 68, sex: 'male', meds: ['Warfarin','Bisoprolol','Ramipril','Atorvastatin','Furosemide','Spironolactone'], allergies:[], creatinine:1.2, egfr:62, conditions:{hf:true,htn:true,dm:true,tia:true,vascular:false,af:true} }
];
export const seedSql = fs.readFileSync('supabase/seed.sql','utf8');
