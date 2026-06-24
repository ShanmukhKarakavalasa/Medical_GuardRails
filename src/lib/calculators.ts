export function computeEgfr(creatinine: number, age: number, sex: 'male' | 'female'): number {
  const female = sex === 'female';
  const kappa = female ? 0.7 : 0.9;
  const alpha = female ? -0.241 : -0.302;
  const multiplier = female ? 1.012 : 1;
  const ratio = creatinine / kappa;
  return +(
    142 * Math.pow(Math.min(ratio, 1), alpha) * Math.pow(Math.max(ratio, 1), -1.2) * Math.pow(0.9938, age) * multiplier
  ).toFixed(1);
}

export function computeCha2Ds2Vasc(input: { age: number; sex: 'male' | 'female'; hf?: boolean; htn?: boolean; dm?: boolean; tia?: boolean; vascular?: boolean }): number {
  let score = 0;
  if (input.hf) score += 1;
  if (input.htn) score += 1;
  if (input.age >= 75) score += 2; else if (input.age >= 65) score += 1;
  if (input.dm) score += 1;
  if (input.tia) score += 2;
  if (input.vascular) score += 1;
  if (input.sex === 'female') score += 1;
  return score;
}
