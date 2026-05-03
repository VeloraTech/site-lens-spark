import { Bookmark, Globe, FileCode, Upload, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import type { ScanResult, IssueCategory } from "@/lib/sitelens/types";
import { IssueCard, AiBuilderCta } from "./IssueCard";

const CATEGORIES: IssueCategory[] = ["Accessibility", "UX", "CSS", "Visual"];

const kindIcon = {
  url: Globe,
  html: FileCode,
  file: Upload,
} as const;

interface Props {
  scan: ScanResult | null;
  onSave: (s: ScanResult) => void;
  isSaved: boolean;
  isScanning: boolean;
}

export function ResultsView({ scan, onSave, isSaved, isScanning }: Props) {
  if (isScanning) {
    return (
      <div className="rounded-lg border border-border bg-surface p-6 space-y-4">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Loader2 className="h-3.5 w-3.5 animate-spin text-primary" />
          Running local scan…
        </div>
        <Skeleton className="h-8 w-24" />
        <div className="space-y-2">
          <Skeleton className="h-14 w-full" />
          <Skeleton className="h-14 w-full" />
          <Skeleton className="h-14 w-full" />
        </div>
      </div>
    );
  }

  if (!scan) {
    return (
      <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed border-border bg-surface/40 p-12 text-center">
        <div className="max-w-sm">
          <div className="text-sm font-medium text-foreground mb-1">No scan yet</div>
          <p className="text-xs text-muted-foreground">
            Enter a URL, drop an HTML file, or paste source above to run a local scan.
          </p>
        </div>
      </div>
    );
  }

  const Icon = kindIcon[scan.kind];
  const grouped = CATEGORIES.map((c) => ({
    cat: c,
    items: scan.issues.filter((i) => i.category === c),
  }));

  const scoreColor =
    scan.score >= 80 ? "text-success" : scan.score >= 50 ? "text-warning" : "text-destructive";

  const high = scan.issues.filter((i) => i.severity === "high").length;
  const med = scan.issues.filter((i) => i.severity === "medium").length;
  const low = scan.issues.filter((i) => i.severity === "low").length;
  const status =
    scan.issues.length === 0
      ? { label: "Clean", color: "text-success bg-success/10 border-success/30" }
      : high > 0
      ? { label: "Needs attention", color: "text-destructive bg-destructive/10 border-destructive/30" }
      : { label: "Minor issues", color: "text-warning bg-warning/10 border-warning/30" };
  const duration =
    scan.durationMs < 1000 ? `${scan.durationMs} ms` : `${(scan.durationMs / 1000).toFixed(2)} s`;

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-center gap-2 text-[11px] text-muted-foreground px-1">
        <span
          className={`inline-flex items-center rounded border px-1.5 py-0.5 font-medium uppercase tracking-wide ${status.color}`}
        >
          {status.label}
        </span>
        <span>
          Scanned in <span className="font-mono text-foreground/80">{duration}</span>
        </span>
        <span aria-hidden>·</span>
        <span>
          <span className="text-destructive">{high} high</span>,{" "}
          <span className="text-warning">{med} medium</span>,{" "}
          <span className="text-info">{low} low</span>
        </span>
      </div>
      <div className="rounded-lg border border-border bg-surface">
      <div className="flex items-start justify-between gap-4 border-b border-border p-4">
        <div className="min-w-0">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Icon className="h-3.5 w-3.5" />
            <span className="font-mono truncate">{scan.source}</span>
          </div>
          <div className="mt-2 flex items-baseline gap-3">
            <div className={`text-3xl font-semibold tabular-nums ${scoreColor}`}>{scan.score}</div>
            <div className="text-xs text-muted-foreground">
              {scan.issues.length} {scan.issues.length === 1 ? "issue" : "issues"} found
            </div>
          </div>
        </div>
        <Button
          size="sm"
          variant="outline"
          onClick={() => onSave(scan)}
          disabled={isSaved}
          className="shrink-0"
        >
          <Bookmark className={`h-3.5 w-3.5 ${isSaved ? "fill-current" : ""}`} />
          {isSaved ? "Saved" : "Save"}
        </Button>
      </div>

      <div className="p-4 space-y-5">
        {grouped.map(({ cat, items }) => (
          <section key={cat}>
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {cat}
              </h3>
              <span className="text-[10px] text-muted-foreground">({items.length})</span>
              <div className="flex-1 h-px bg-border" />
            </div>
            {items.length === 0 ? (
              <p className="text-xs text-muted-foreground italic px-1">No issues. Clean.</p>
            ) : (
              <div className="space-y-2">
                {items.map((i) => (
                  <IssueCard key={i.id} issue={i} />
                ))}
              </div>
            )}
          </section>
        ))}

        <AiBuilderCta />
      </div>
    </div>
    </div>
  );
}
