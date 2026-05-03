import { Bookmark, Globe, FileCode, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
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
}

export function ResultsView({ scan, onSave, isSaved }: Props) {
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

  return (
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
  );
}
