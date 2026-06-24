'use client';
import { useMemo, useState } from 'react';
import PatientCard from '@/components/PatientCard';
import SafetyAlerts from '@/components/SafetyAlerts';
import ResponseComparison from '@/components/ResponseComparison';
import { patients } from '@/lib/data';

export default function Page() {
  const [patientId, setPatientId] = useState(1);
  const [newDrug, setNewDrug] = useState('Clarithromycin');
  const [question, setQuestion] = useState('Can I add Clarithromycin 500mg for pneumonia?');
  const [safety, setSafety] = useState<any>(null);
  const [generic, setGeneric] = useState('');
  const [enhanced, setEnhanced] = useState('');

  const patient = useMemo(() => patients.find((p) => p.id === Number(patientId)), [patientId]);

  async function runSafety() {
    const res = await fetch('/api/safety-check', { method: 'POST', headers: { 'content-type':'application/json' }, body: JSON.stringify({ patientId, newDrug }) });
    setSafety(await res.json());
  }

  async function ask(mode: 'generic'|'enhanced') {
    if (!safety) await runSafety();
    const summary = `${patient?.label} | Meds: ${patient?.medications.join(', ')} | Allergies: ${patient?.allergies.map(a=>a.name).join(',') || 'NKDA'}`;
    const res = await fetch('/api/claude', { method:'POST', headers:{'content-type':'application/json'}, body: JSON.stringify({ mode, question, patientSummary: summary, constraints: safety?.constraintText }) });
    const data = await res.json();
    if (mode === 'generic') setGeneric(data.text); else setEnhanced(data.text);
  }

  return (
    <main className="p-6 max-w-6xl mx-auto space-y-4">
      <h1 className="text-2xl font-bold">Drug Safety Engine Demo</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <label>Patient</label>
          <select className="border p-2 w-full" value={patientId} onChange={(e)=>setPatientId(Number(e.target.value))}>
            {patients.map((p)=><option key={p.id} value={p.id}>{p.label}</option>)}
          </select>
          <label>New Drug</label>
          <input className="border p-2 w-full" value={newDrug} onChange={(e)=>setNewDrug(e.target.value)} />
          <label>Doctor Question</label>
          <textarea className="border p-2 w-full" rows={4} value={question} onChange={(e)=>setQuestion(e.target.value)} />
          <div className="flex gap-2 flex-wrap">
            <button className="border px-3 py-2" onClick={runSafety}>Run Safety Check</button>
            <button className="border px-3 py-2" onClick={()=>ask('generic')}>Ask Generic Claude</button>
            <button className="border px-3 py-2" onClick={()=>ask('enhanced')}>Ask Safety-Enhanced Claude</button>
          </div>
        </div>
        <PatientCard patient={patient} />
        <SafetyAlerts result={safety} />
      </div>
      <ResponseComparison generic={generic} enhanced={enhanced} />
    </main>
  );
}
