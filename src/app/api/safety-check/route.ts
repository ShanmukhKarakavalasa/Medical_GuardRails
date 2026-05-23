import { NextRequest, NextResponse } from 'next/server';
import { runSafetyChecks } from '@/lib/safety-engine';
import { localCrossRows, localDrugs, localInteractions, patients } from '@/lib/data';
import { supabase } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  const { patientId, newDrug } = await req.json();
  const patient = patients.find((p) => p.id === Number(patientId));
  if (!patient) return NextResponse.json({ error: 'Patient not found' }, { status: 404 });

  let drugs = localDrugs;
  let interactions = localInteractions;
  let crossRows = localCrossRows;

  if (supabase) {
    const [d, i, c] = await Promise.all([
      supabase.from('drugs').select('*'),
      supabase.from('drug_interactions').select('*'),
      supabase.from('allergy_cross_reactivity').select('*')
    ]);
    if (!d.error && d.data?.length) drugs = d.data as any;
    if (!i.error && i.data?.length) interactions = i.data as any;
    if (!c.error && c.data?.length) crossRows = c.data as any;
  }

  return NextResponse.json(runSafetyChecks({ newDrug, patient, drugs, interactions, crossRows }));
}
