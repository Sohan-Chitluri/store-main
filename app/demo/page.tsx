export default function DemoPage() {
  return (
    <div className="flex flex-col space-y-6 py-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">HardwareScout Demo</h1>
        <p className="text-muted-foreground">
          Engineering procurement workspace powered by WebMCP.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="col-span-2 space-y-6">
          <section id="search-section" className="border rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Hardware Search</h2>
            <div className="text-sm text-muted-foreground italic">Search panel placeholder</div>
          </section>

          <section id="results-section" className="border rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Candidates</h2>
            <div className="text-sm text-muted-foreground italic">Results table placeholder</div>
          </section>
          
          <section id="comparison-section" className="border rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Comparison Matrix</h2>
            <div className="text-sm text-muted-foreground italic">Comparison matrix placeholder</div>
          </section>
        </div>

        <div className="space-y-6">
          <section id="evaluation-section" className="border rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Evaluation</h2>
            <div className="text-sm text-muted-foreground italic">Evaluation panel placeholder</div>
          </section>

          <section id="procurement-section" className="border rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Procurement List</h2>
            <div className="text-sm text-muted-foreground italic">Procurement sidebar placeholder</div>
          </section>
        </div>
      </div>

      <section id="trace-panel-section" className="border rounded-lg p-6 bg-slate-50 dark:bg-slate-900 mt-8">
        <h2 className="text-xl font-semibold mb-4">WebMCP Trace</h2>
        <div className="text-sm text-muted-foreground italic">Trace panel placeholder</div>
      </section>
    </div>
  );
}
