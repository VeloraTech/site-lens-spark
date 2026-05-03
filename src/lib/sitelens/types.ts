export type IssueCategory = "Accessibility" | "UX" | "CSS" | "Visual";
export type IssueSeverity = "low" | "medium" | "high";

export interface Issue {
  id: string;
  category: IssueCategory;
  severity: IssueSeverity;
  title: string;
  short: string;
  detail: string;
  fix: string;
  selector?: string;
}

export interface ScanResult {
  id: string;
  source: string;        // URL or "Pasted HTML" or filename
  kind: "url" | "html" | "file";
  createdAt: number;
  issues: Issue[];
  score: number;         // 0–100
}
