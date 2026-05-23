export default function SafetyAlerts({ result }: { result: any }) {
  if (!result) return <div className="p-4 border rounded">No alerts yet.</div>;
  return (
    <div className="p-4 border rounded space-y-2">
      <h3 className="font-semibold">Safety alerts</h3>
      <pre className="whitespace-pre-wrap text-sm">{result.constraintText}</pre>
    </div>
  );
}
