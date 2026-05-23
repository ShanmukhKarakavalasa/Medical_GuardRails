import { Patient } from '@/lib/types';

export default function PatientCard({ patient }: { patient: Patient | undefined }) {
  if (!patient) return <div className="p-4 border rounded">Select a patient</div>;
  return (
    <div className="p-4 border rounded space-y-2">
      <h3 className="font-semibold">{patient.label}</h3>
      <p>Age/Sex: {patient.age} / {patient.sex}</p>
      <p>Creatinine: {patient.creatinine} mg/dL</p>
      <p>Meds: {patient.medications.join(', ')}</p>
      <p>Allergies: {patient.allergies.length ? patient.allergies.map(a=>`${a.name} (${a.reaction})`).join(', ') : 'NKDA'}</p>
    </div>
  );
}
