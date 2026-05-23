export default function ResponseComparison({ generic, enhanced }: { generic: string; enhanced: string }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="p-4 border rounded"><h4 className="font-semibold mb-2">Generic AI</h4><pre className="whitespace-pre-wrap text-sm">{generic || '-'}</pre></div>
      <div className="p-4 border rounded"><h4 className="font-semibold mb-2">Safety-Enhanced AI</h4><pre className="whitespace-pre-wrap text-sm">{enhanced || '-'}</pre></div>
    </div>
  );
}
