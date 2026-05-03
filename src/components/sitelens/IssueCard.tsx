import { useState } from "react";
import { ChevronDown, Sparkles, ExternalLink, Loader2 } from "lucide-react";
import type { Issue } from "@/lib/sitelens/types";
import { Button } from "@/components/ui/button";
import { fetchAiInsight, type AiInsight } from "@/lib/sitelens/ai";

const sevColor: Record<Issue["severity"], string> = {
  high: "bg-destructive/15 text-destructive border-destructive/30",
  medium: "bg-warning/15 text-warning border-warning/30",
  low: "bg-info/15 text-info border-info/30",
};

export function IssueCard({ issue }: { issue: Issue }) {
  const [open, setOpen] = useState(false);
  const [ai, setAi] = useState<AiInsight | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiOpen, setAiOpen] = useState(false);

  const loadAi = async () => {
    if (ai) {
      setAiOpen((v) => !v);
      return;
    }
    setAiLoading(true);
    try {
      const r = await fetchAiInsight(issue);
      setAi(r);
      setAiOpen(true);
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div className="rounded-md border border-border bg-surface-elevated overflow-hidden">
      <div className="p-3">
        <div className="flex items-start gap-2">
          <span
            className={`mt-0.5 inline-flex items-center rounded px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide border ${sevColor[issue.severity]}`}
          >
            {issue.severity}
          </span>
          <div className="min-w-0 flex-1">
            <h4 className="text-sm font-medium text-foreground leading-snug">{issue.title}</h4>
            <p className="mt-0.5 text-xs text-muted-foreground">{issue.short}</p>
          </div>
          <button
            onClick={() => setOpen((v) => !v)}
            className="text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1"
          >
            More
            <ChevronDown className={`h-3 w-3 transition-transform ${open ? "rotate-180" : ""}`} />
          </button>
        </div>

        {open && (
          <div className="mt-3 space-y-2 border-t border-border pt-3">
            <div>
              <div className="text-[10px] uppercase tracking-wide text-muted-foreground mb-1">
                Why it matters
              </div>
              <p className="text-xs leading-relaxed text-foreground/90">{issue.detail}</p>
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-wide text-muted-foreground mb-1">
                Suggested fix
              </div>
              <p className="text-xs leading-relaxed text-foreground/90 font-mono bg-background/60 rounded px-2 py-1.5 border border-border">
                {issue.fix}
              </p>
            </div>

            <div className="pt-1">
              <button
                onClick={loadAi}
                disabled={aiLoading}
                className="inline-flex items-center gap-1.5 rounded-md border border-ai/40 bg-ai/10 px-2.5 py-1 text-xs text-ai hover:bg-ai/20 transition-colors disabled:opacity-50"
              >
                {aiLoading ? (
                  <Loader2 className="h-3 w-3 animate-spin" />
                ) : (
                  <Sparkles className="h-3 w-3" />
                )}
                {ai ? (aiOpen ? "Hide AI insight" : "Show AI insight") : "✨ Try AI insight"}
              </button>
            </div>

            {ai && aiOpen && (
              <div className="mt-2 rounded-md border border-ai/30 bg-ai/5 p-3 space-y-2">
                <p className="text-xs leading-relaxed text-foreground/90">{ai.summary}</p>
                <div>
                  <div className="text-[10px] uppercase tracking-wide text-ai/80 mb-1">
                    Approach
                  </div>
                  <p className="text-xs leading-relaxed text-foreground/80">{ai.approach}</p>
                </div>
                <div>
                  <div className="text-[10px] uppercase tracking-wide text-ai/80 mb-1">
                    Best practices
                  </div>
                  <ul className="text-xs space-y-0.5 text-foreground/80 list-disc pl-4">
                    {ai.bestPractices.map((b) => (
                      <li key={b}>{b}</li>
                    ))}
                  </ul>
                </div>
                {ai.resources.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-1">
                    {ai.resources.map((r) => (
                      <a
                        key={r.url}
                        href={r.url}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="inline-flex items-center gap-1 text-[11px] text-ai hover:underline"
                      >
                        {r.label} <ExternalLink className="h-3 w-3" />
                      </a>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export function AiBuilderCta() {
  return (
    <div className="mt-6 rounded-md border border-border bg-surface p-4 flex items-center justify-between gap-4">
      <div>
        <div className="text-sm font-medium text-foreground">Need to act on these?</div>
        <p className="text-xs text-muted-foreground mt-0.5">
          Generate fixes and scaffolding with our AI Builder — optional, runs separately from scans.
        </p>
      </div>
      <Button variant="outline" size="sm" className="border-ai/40 text-ai hover:bg-ai/10 hover:text-ai">
        <Sparkles className="h-3.5 w-3.5" />
        Try AI Builder
      </Button>
    </div>
  );
}
