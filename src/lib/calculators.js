export function computeEgfr({creatinine, age, sex}) {
  const female = sex === 'female';
  const k = female ? 0.7 : 0.9;
  const alpha = female ? -0.241 : -0.302;
  const mult = female ? 1.012 : 1;
  const ratio = creatinine / k;
  return +(142 * Math.pow(Math.min(ratio, 1), alpha) * Math.pow(Math.max(ratio, 1), -1.2) * Math.pow(0.9938, age) * mult).toFixed(1);
}
export function computeCha2Ds2Vasc({age, sex, hf, htn, dm, tia, vascular}) {
  let score = 0;
  if (hf) score += 1;
  if (htn) score += 1;
  if (age >= 75) score += 2; else if (age >= 65) score += 1;
  if (dm) score += 1;
  if (tia) score += 2;
  if (vascular) score += 1;
  if (sex === 'female') score += 1;
  return score;
}
