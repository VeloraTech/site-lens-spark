import { useRef, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { PanelRight } from "lucide-react";
import { AppHeader } from "@/components/sitelens/AppHeader";
import { ScanForm } from "@/components/sitelens/ScanForm";
import { ResultsView } from "@/components/sitelens/ResultsView";
import { ScanSidebar } from "@/components/sitelens/ScanSidebar";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
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
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const cancelRef = useRef(false);
  const timerRef = useRef<number | null>(null);

  const cancelScan = () => {
    cancelRef.current = true;
    if (timerRef.current) window.clearTimeout(timerRef.current);
    setScanning(false);
    toast("Scan cancelled");
  };

  const runScan = async (input: { kind: "url" | "html" | "file"; source: string; html?: string }) => {
    cancelRef.current = false;
    setScanning(true);
    await new Promise<void>((resolve) => {
      timerRef.current = window.setTimeout(() => resolve(), 350);
    });
    if (cancelRef.current) return;
    const html = input.html ?? syntheticHtmlFromUrl(input.source);
    const result = scanHtml(html, input.source, input.kind);
    addRecent(result);
    setActive(result);
    setScanning(false);
  };

  const isSaved = active ? saved.some((s) => s.id === active.id) : false;

  const handleSelect = (s: ScanResult) => {
    setActive(s);
    setSidebarOpen(false);
  };

  const sidebar = (
    <ScanSidebar
      recent={recent}
      saved={saved}
      activeId={active?.id ?? null}
      highlightOldestId={highlightOldestId}
      onSelect={handleSelect}
      onDeleteSaved={deleteSaved}
      onDeleteRecent={deleteRecent}
      maxSaved={MAX_SAVED}
    />
  );

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <AppHeader
        right={
          <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm" className="lg:hidden">
                <PanelRight className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Scans</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="p-0 w-[85vw] sm:w-80 max-w-sm">
              <SheetTitle className="sr-only">Scan history</SheetTitle>
              {sidebar}
            </SheetContent>
          </Sheet>
        }
      />
      <div className="flex flex-1 min-h-0">
        <main className="flex-1 min-w-0 overflow-y-auto">
          <div className="max-w-4xl mx-auto px-3 sm:px-5 py-4 sm:py-6 space-y-4 sm:space-y-5">
            <div>
              <h1 className="text-lg sm:text-xl font-semibold tracking-tight">
                Pre-deployment site checker
              </h1>
              <p className="text-xs text-muted-foreground mt-1">
                Runs locally in your browser. No data leaves your machine.
              </p>
            </div>

            <ScanForm onScan={runScan} isScanning={scanning} onCancel={cancelScan} />

            <ResultsView scan={active} onSave={saveScan} isSaved={isSaved} isScanning={scanning} />
          </div>
        </main>

        <div className="hidden lg:flex">{sidebar}</div>
      </div>
    </div>
  );
}
