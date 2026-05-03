import type { Issue, ScanResult } from "./types";

let counter = 0;
const uid = () => `${Date.now().toString(36)}-${(counter++).toString(36)}`;

/**
 * Local rule-based scanner. Runs entirely in-browser on raw HTML.
 * No network required — true to SiteLens' offline-first philosophy.
 */
export function scanHtml(html: string, source: string, kind: ScanResult["kind"]): ScanResult {
  const issues: Issue[] = [];
  const doc = new DOMParser().parseFromString(html, "text/html");

  // --- Accessibility ---
  doc.querySelectorAll("img").forEach((img, i) => {
    if (!img.hasAttribute("alt")) {
      issues.push({
        id: uid(),
        category: "Accessibility",
        severity: "high",
        title: `<img> missing alt attribute`,
        short: `Image #${i + 1} has no alt text.`,
        detail:
          "Screen readers announce images without alt text by their filename or skip them entirely, leaving non-sighted users without context for the image's purpose.",
        fix: `Add a descriptive alt attribute, e.g. <img src="..." alt="Team photo from 2024 offsite">. Use alt="" for purely decorative images.`,
        selector: img.getAttribute("src") ?? "img",
      });
    }
  });

  doc.querySelectorAll("a").forEach((a) => {
    const text = (a.textContent ?? "").trim();
    if (!text && !a.querySelector("img[alt]")) {
      issues.push({
        id: uid(),
        category: "Accessibility",
        severity: "medium",
        title: "Link has no accessible name",
        short: "An <a> tag contains no text or labeled image.",
        detail:
          "Links without accessible names are unusable with assistive tech and confusing in tab navigation.",
        fix: "Add visible text inside the link, or an aria-label, or a labeled child icon.",
      });
    }
  });

  doc.querySelectorAll("input,select,textarea").forEach((el) => {
    const id = el.getAttribute("id");
    const hasLabel =
      (id && doc.querySelector(`label[for="${id}"]`)) ||
      el.hasAttribute("aria-label") ||
      el.hasAttribute("aria-labelledby");
    if (!hasLabel && el.getAttribute("type") !== "hidden") {
      issues.push({
        id: uid(),
        category: "Accessibility",
        severity: "high",
        title: "Form control without label",
        short: `<${el.tagName.toLowerCase()}> is not associated with a label.`,
        detail:
          "Unlabeled inputs break screen readers and voice-control flows. Placeholders are not labels.",
        fix: "Wire a <label for=...> to the input's id, or add aria-label.",
      });
    }
  });

  // --- Structure ---
  if (!doc.querySelector("html[lang]")) {
    issues.push({
      id: uid(),
      category: "Accessibility",
      severity: "medium",
      title: "<html> missing lang attribute",
      short: "Document language is not declared.",
      detail:
        "Without lang, screen readers may use the wrong pronunciation rules and translation tools may misdetect the language.",
      fix: `Add a language code: <html lang="en">.`,
    });
  }
  if (!doc.querySelector("title")?.textContent?.trim()) {
    issues.push({
      id: uid(),
      category: "UX",
      severity: "high",
      title: "Missing <title>",
      short: "The document has no title.",
      detail:
        "The title is shown in tabs, bookmarks and search results. It's the single most important SEO and UX signal.",
      fix: "Add <title>Page Name — Site</title> in <head>.",
    });
  }
  if (!doc.querySelector('meta[name="viewport"]')) {
    issues.push({
      id: uid(),
      category: "UX",
      severity: "high",
      title: "Missing viewport meta",
      short: "No responsive viewport declared.",
      detail:
        "Without a viewport meta tag, mobile browsers render at a fixed desktop width and zoom out, breaking touch targets and readability.",
      fix: `Add <meta name="viewport" content="width=device-width, initial-scale=1"> in <head>.`,
    });
  }
  if (!doc.querySelector('meta[name="description"]')) {
    issues.push({
      id: uid(),
      category: "UX",
      severity: "low",
      title: "Missing meta description",
      short: "No description for search engines.",
      detail:
        "The meta description is the snippet shown under your link in search results. Missing it leaves the snippet to chance.",
      fix: `Add <meta name="description" content="Concise 140-char summary of this page.">.`,
    });
  }

  // Headings
  const h1s = doc.querySelectorAll("h1");
  if (h1s.length === 0) {
    issues.push({
      id: uid(),
      category: "UX",
      severity: "medium",
      title: "No <h1> on the page",
      short: "Page has no top-level heading.",
      detail:
        "An H1 anchors document outline for both users and assistive tech. Pages without one feel structureless.",
      fix: "Add a single, descriptive <h1> near the top of the main content.",
    });
  } else if (h1s.length > 1) {
    issues.push({
      id: uid(),
      category: "UX",
      severity: "low",
      title: `Multiple <h1> tags (${h1s.length})`,
      short: "More than one H1 found.",
      detail:
        "Multiple H1s dilute the page's primary topic and confuse outline-based navigation.",
      fix: "Keep one H1 per page; demote the rest to <h2>.",
    });
  }

  // --- CSS / Visual ---
  const inlineStyled = doc.querySelectorAll("[style]");
  if (inlineStyled.length > 5) {
    issues.push({
      id: uid(),
      category: "CSS",
      severity: "low",
      title: `Heavy use of inline styles (${inlineStyled.length})`,
      short: "Many elements use the style attribute.",
      detail:
        "Inline styles can't be cached, overridden by stylesheets, or themed. They're a smell that the design system is being bypassed.",
      fix: "Move repeated styles into CSS classes or design tokens.",
    });
  }

  doc.querySelectorAll("button,a").forEach((el) => {
    const style = el.getAttribute("style") ?? "";
    const m = /font-size:\s*(\d+)px/.exec(style);
    if (m && parseInt(m[1], 10) < 12) {
      issues.push({
        id: uid(),
        category: "Visual",
        severity: "medium",
        title: "Tiny tap target text",
        short: `Interactive element font-size ${m[1]}px is too small.`,
        detail:
          "Text below 12px is hard to read on mobile and shrinks the effective tap target.",
        fix: "Use at least 14px (preferably 16px) for interactive labels.",
      });
    }
  });

  if (doc.querySelectorAll("div").length > 200) {
    issues.push({
      id: uid(),
      category: "CSS",
      severity: "low",
      title: "Div soup detected",
      short: "Page contains a very large number of <div> tags.",
      detail:
        "Heavy div nesting hurts readability, accessibility, and rendering performance. Often a sign that semantic elements (section, article, nav, main) are being skipped.",
      fix: "Replace structural <div>s with semantic HTML5 elements where they apply.",
    });
  }

  if (!doc.querySelector("main")) {
    issues.push({
      id: uid(),
      category: "Accessibility",
      severity: "low",
      title: "No <main> landmark",
      short: "Page has no main content landmark.",
      detail:
        "Landmarks let assistive tech jump straight to primary content, skipping repeated nav.",
      fix: "Wrap the primary content in <main>.",
    });
  }

  // Score: subtract weighted severity, floor at 0
  const weight = { low: 3, medium: 7, high: 12 } as const;
  const penalty = issues.reduce((s, i) => s + weight[i.severity], 0);
  const score = Math.max(0, 100 - penalty);

  return {
    id: uid(),
    source,
    kind,
    createdAt: Date.now(),
    issues,
    score,
  };
}

/** Build a small synthetic HTML doc from a URL string for offline demo scanning. */
export function syntheticHtmlFromUrl(url: string): string {
  // Deterministic-ish: vary issues based on URL hash so different URLs yield different reports.
  const h = [...url].reduce((a, c) => a + c.charCodeAt(0), 0);
  const include = (n: number) => h % n === 0;

  return `<!doctype html>
<html${include(2) ? ' lang="en"' : ""}>
<head>
  ${include(3) ? "<title>Demo Page</title>" : ""}
  ${include(2) ? '<meta name="viewport" content="width=device-width,initial-scale=1">' : ""}
  ${include(5) ? '<meta name="description" content="A demo page">' : ""}
</head>
<body>
  <header><a href="/"></a></header>
  ${include(4) ? "<main>" : "<div>"}
    ${include(2) ? "<h1>Welcome</h1>" : ""}
    <h1>Second heading</h1>
    <img src="/hero.png" ${include(3) ? 'alt="Hero"' : ""}>
    <img src="/logo.png">
    <form>
      <input type="text" placeholder="email">
      <input type="password" ${include(2) ? 'aria-label="Password"' : ""}>
      <button style="font-size:10px">Go</button>
    </form>
    <p style="color:red">Inline 1</p>
    <p style="color:red">Inline 2</p>
    <p style="color:red">Inline 3</p>
    <p style="color:red">Inline 4</p>
    <p style="color:red">Inline 5</p>
    <p style="color:red">Inline 6</p>
  ${include(4) ? "</main>" : "</div>"}
</body>
</html>`;
}
