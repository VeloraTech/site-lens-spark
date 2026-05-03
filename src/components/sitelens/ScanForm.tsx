import { useCallback, useRef, useState } from "react";
import { Upload, Link2, FileCode, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

interface Props {
  onScan: (input: { kind: "url" | "html" | "file"; source: string; html?: string }) => void;
  isScanning: boolean;
  onCancel: () => void;
}

export function ScanForm({ onScan, isScanning, onCancel }: Props) {
  const [url, setUrl] = useState("");
  const [pasted, setPasted] = useState("");
  const [file, setFile] = useState<{ name: string; content: string } | null>(null);
  const [drag, setDrag] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);

  const readFile = useCallback((f: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      setFile({ name: f.name, content: String(reader.result ?? "") });
      setUrl("");
    };
    reader.readAsText(f);
  }, []);

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDrag(false);
    const f = e.dataTransfer.files?.[0];
    if (f) readFile(f);
  };

  const handleUrlChange = (v: string) => {
    setUrl(v);
    if (v) setFile(null);
  };

  const submit = () => {
    if (file) {
      onScan({ kind: "file", source: file.name, html: file.content });
      setFile(null);
    } else if (pasted.trim()) {
      onScan({ kind: "html", source: "Pasted HTML", html: pasted });
      setPasted("");
    } else if (url.trim()) {
      onScan({ kind: "url", source: url.trim() });
      setUrl("");
    }
    if (fileInput.current) fileInput.current.value = "";
  };

  const canScan = !isScanning && (file || url.trim() || pasted.trim());

  return (
    <div className="rounded-lg border border-border bg-surface p-4">
      <div className="flex items-center gap-2 mb-3">
        <Input
          placeholder="https://example.com"
          value={url}
          onChange={(e) => handleUrlChange(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && canScan && submit()}
          className="font-mono text-sm bg-background border-border"
        />
        {isScanning ? (
          <Button variant="outline" onClick={onCancel}>
            <X className="h-3.5 w-3.5" />
            Cancel
          </Button>
        ) : (
          <Button onClick={submit} disabled={!canScan}>
            Scan
          </Button>
        )}
      </div>

      <Tabs defaultValue="upload" className="w-full">
        <TabsList className="bg-background/60 border border-border">
          <TabsTrigger value="upload" className="text-xs gap-1.5">
            <Upload className="h-3.5 w-3.5" /> Upload
          </TabsTrigger>
          <TabsTrigger value="paste" className="text-xs gap-1.5">
            <FileCode className="h-3.5 w-3.5" /> Paste HTML
          </TabsTrigger>
          <TabsTrigger value="hint" className="text-xs gap-1.5">
            <Link2 className="h-3.5 w-3.5" /> URL tips
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upload" className="mt-3">
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDrag(true);
            }}
            onDragLeave={() => setDrag(false)}
            onDrop={onDrop}
            onClick={() => fileInput.current?.click()}
            className={`cursor-pointer rounded-md border border-dashed px-4 py-6 text-center text-sm transition-colors ${
              drag ? "border-primary bg-primary/5" : "border-border bg-background/40 hover:bg-background/70"
            }`}
          >
            {file ? (
              <div className="flex items-center justify-between gap-2">
                <span className="font-mono text-xs truncate">{file.name}</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setFile(null);
                  }}
                  className="text-muted-foreground hover:text-foreground"
                  aria-label="Remove file"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <span className="text-muted-foreground">
                Drop an .html file here, or click to browse
              </span>
            )}
            <input
              ref={fileInput}
              type="file"
              accept=".html,.htm,text/html"
              hidden
              onChange={(e) => e.target.files?.[0] && readFile(e.target.files[0])}
            />
          </div>
        </TabsContent>

        <TabsContent value="paste" className="mt-3">
          <Textarea
            value={pasted}
            onChange={(e) => setPasted(e.target.value)}
            placeholder="<html>…</html>"
            className="font-mono text-xs h-32 bg-background border-border resize-y"
          />
        </TabsContent>

        <TabsContent value="hint" className="mt-3">
          <p className="text-xs text-muted-foreground leading-relaxed">
            URL scans run locally in your browser using a synthetic snapshot — no network calls leave
            your machine. For real DOM analysis, paste the page source or upload the HTML file.
          </p>
        </TabsContent>
      </Tabs>
    </div>
  );
}
