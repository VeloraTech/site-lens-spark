import { ScanLine } from "lucide-react";

export function AppHeader() {
  return (
    <header className="border-b border-border bg-surface/60 backdrop-blur">
      <div className="px-5 h-14 flex items-center gap-3">
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-md bg-primary/15 border border-primary/30 flex items-center justify-center">
            <ScanLine className="h-4 w-4 text-primary" />
          </div>
          <div>
            <div className="text-sm font-semibold tracking-tight leading-none">SiteLens</div>
            <div className="text-[10px] text-muted-foreground font-mono mt-0.5">
              local · offline · pre-deploy
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
