import { useState } from "react";
import { Trash2, Clock, Bookmark, Globe, FileCode, Upload } from "lucide-react";
import type { ScanResult } from "@/lib/sitelens/types";

const icons = { url: Globe, html: FileCode, file: Upload } as const;

interface Props {
  recent: ScanResult[];
  saved: ScanResult[];
  activeId: string | null;
  highlightOldestId: string | null;
  onSelect: (s: ScanResult) => void;
  onDeleteSaved: (id: string) => void;
  onDeleteRecent: (id: string) => void;
  maxSaved: number;
}

export function ScanSidebar({
  recent,
  saved,
  activeId,
  highlightOldestId,
  onSelect,
  onDeleteSaved,
  onDeleteRecent,
  maxSaved,
}: Props) {
  const [tab, setTab] = useState<"recent" | "saved">("recent");
  const list = tab === "recent" ? recent : saved;

  return (
    <aside className="w-full lg:w-72 h-full shrink-0 border-l border-border bg-sidebar flex flex-col">
      <div className="flex border-b border-border">
        {(["recent", "saved"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 px-3 py-2.5 text-xs font-medium uppercase tracking-wider transition-colors ${
              tab === t
                ? "text-foreground border-b-2 border-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <span className="inline-flex items-center gap-1.5">
              {t === "recent" ? <Clock className="h-3 w-3" /> : <Bookmark className="h-3 w-3" />}
              {t}
              {t === "saved" && (
                <span className="text-[10px] text-muted-foreground/70">
                  {saved.length}/{maxSaved}
                </span>
              )}
            </span>
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto p-2">
        {list.length === 0 ? (
          <div className="px-2 py-8 text-center text-xs text-muted-foreground">
            {tab === "recent" ? "No scans this session" : "No saved scans"}
          </div>
        ) : (
          <ul className="space-y-1">
            {list.map((s) => {
              const Icon = icons[s.kind];
              const active = s.id === activeId;
              const highlight = s.id === highlightOldestId;
              return (
                <li
                  key={s.id}
                  className={`group rounded-md border px-2 py-2 cursor-pointer transition-colors ${
                    highlight
                      ? "border-destructive bg-destructive/10 animate-pulse"
                      : active
                        ? "border-primary/40 bg-primary/5"
                        : "border-transparent hover:bg-accent/50"
                  }`}
                  onClick={() => onSelect(s)}
                >
                  <div className="flex items-center gap-2">
                    <Icon className="h-3 w-3 shrink-0 text-muted-foreground" />
                    <span className="font-mono text-xs truncate flex-1">{s.source}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        tab === "saved" ? onDeleteSaved(s.id) : onDeleteRecent(s.id);
                      }}
                      className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-opacity"
                      aria-label="Delete scan"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                  <div className="mt-1 flex items-center justify-between text-[10px] text-muted-foreground">
                    <span>{s.issues.length} issues</span>
                    <span className="tabular-nums">Score {s.score}</span>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </aside>
  );
}
