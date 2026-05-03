import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import type { ScanResult } from "@/lib/sitelens/types";

const SAVED_KEY = "sitelens.saved.v1";
const MAX_SAVED = 10;

export function useScans() {
  const [recent, setRecent] = useState<ScanResult[]>([]);
  const [saved, setSaved] = useState<ScanResult[]>([]);
  const [highlightOldestId, setHighlightOldestId] = useState<string | null>(null);
  const hydrated = useRef(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(SAVED_KEY);
      if (raw) setSaved(JSON.parse(raw));
    } catch {
      /* ignore */
    }
    hydrated.current = true;
  }, []);

  useEffect(() => {
    if (!hydrated.current) return;
    try {
      localStorage.setItem(SAVED_KEY, JSON.stringify(saved));
    } catch {
      /* ignore */
    }
  }, [saved]);

  const addRecent = (scan: ScanResult) => {
    setRecent((prev) => [scan, ...prev].slice(0, 25));
  };

  const saveScan = (scan: ScanResult) => {
    if (saved.some((s) => s.id === scan.id)) {
      toast("Already saved");
      return;
    }
    if (saved.length >= MAX_SAVED) {
      const oldest = [...saved].sort((a, b) => a.createdAt - b.createdAt)[0];
      setHighlightOldestId(oldest?.id ?? null);
      toast.error(`Limit reached (${MAX_SAVED}). Delete an old scan.`);
      window.setTimeout(() => setHighlightOldestId(null), 2500);
      return;
    }
    setSaved((prev) => [scan, ...prev]);
    toast.success("Scan saved");
  };

  const deleteSaved = (id: string) => {
    setSaved((prev) => prev.filter((s) => s.id !== id));
    toast.success("Scan deleted");
  };

  const deleteRecent = (id: string) => {
    setRecent((prev) => prev.filter((s) => s.id !== id));
  };

  return {
    recent,
    saved,
    addRecent,
    saveScan,
    deleteSaved,
    deleteRecent,
    highlightOldestId,
    MAX_SAVED,
  };
}
