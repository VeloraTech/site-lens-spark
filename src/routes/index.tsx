import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AppHeader } from "@/components/sitelens/AppHeader";
import { ScanForm } from "@/components/sitelens/ScanForm";
import { ResultsView } from "@/components/sitelens/ResultsView";
import { ScanSidebar } from "@/components/sitelens/ScanSidebar";
import { useScans } from "@/hooks/use-scans";
import { scanHtml, syntheticHtmlFromUrl } from "@/lib/sitelens/scanner";
import type { ScanResult } from "@/lib/sitelens/types";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const {
    recent,
    saved,
    addRecent,
    saveScan,
    deleteSaved,
    deleteRecent,
    highlightOldestId,
    MAX_SAVED,
  } = useScans();

  const [active, setActive] = useState<ScanResult | null>(null);
  const [scanning, setScanning] = useState(false);

  const runScan = async (input: { kind: "url" | "html" | "file"; source: string; html?: string }) => {
    setScanning(true);
    // brief delay so the scanning state is visible
    await new Promise((r) => setTimeout(r, 250));
    const html = input.html ?? syntheticHtmlFromUrl(input.source);
    const result = scanHtml(html, input.source, input.kind);
    addRecent(result);
    setActive(result);
    setScanning(false);
  };

  const isSaved = active ? saved.some((s) => s.id === active.id) : false;

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <AppHeader />
      <div className="flex flex-1 min-h-0">
        <main className="flex-1 min-w-0 overflow-y-auto">
          <div className="max-w-4xl mx-auto px-5 py-6 space-y-5">
            <div>
              <h1 className="text-xl font-semibold tracking-tight">
                Pre-deployment site checker
              </h1>
              <p className="text-xs text-muted-foreground mt-1">
                Runs locally in your browser. No data leaves your machine.
              </p>
            </div>

            <ScanForm onScan={runScan} isScanning={scanning} />

            <ResultsView scan={active} onSave={saveScan} isSaved={isSaved} />
          </div>
        </main>

        <ScanSidebar
          recent={recent}
          saved={saved}
          activeId={active?.id ?? null}
          highlightOldestId={highlightOldestId}
          onSelect={setActive}
          onDeleteSaved={deleteSaved}
          onDeleteRecent={deleteRecent}
          maxSaved={MAX_SAVED}
        />
      </div>
    </div>
  );
}
