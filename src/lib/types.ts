export type Severity = 'CONTRAINDICATED' | 'SEVERE' | 'MODERATE' | 'MINOR';

export interface Drug {
  id?: string;
  generic_name: string;
  generic_name_normalized: string;
  drug_class: string;
  renal_dosing: { rules?: { maxEgfr?: number; recommendation?: string; note?: string }[] };
}

export interface DrugInteraction {
  drug_a: string;
  drug_b: string;
  severity: Severity;
  mechanism: string;
  clinical_effect: string;
  management: string;
}

export interface AllergyCrossReactivity {
  allergy_to: string;
  cross_reacts_with: string;
  cross_reactivity_pct: string;
  clinical_guidance: string;
}

export interface AllergyRecord { name: string; reaction: string; }
export interface Patient {
  id: number;
  label: string;
  age: number;
  sex: 'male' | 'female';
  medications: string[];
  allergies: AllergyRecord[];
  creatinine: number;
  egfr?: number;
  conditions?: { af?: boolean; hf?: boolean; htn?: boolean; dm?: boolean; tia?: boolean; vascular?: boolean };
  notes?: string;
}
