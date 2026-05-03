import type { Issue } from "./types";

export interface AiInsight {
  summary: string;
  approach: string;
  bestPractices: string[];
  resources: { label: string; url: string }[];
}

/**
 * Simulated AI insight generator.
 * Real backend can replace this without changing the UI.
 */
export async function fetchAiInsight(issue: Issue): Promise<AiInsight> {
  // Simulate latency
  await new Promise((r) => setTimeout(r, 650 + Math.random() * 500));

  const tone: Record<string, AiInsight> = {
    Accessibility: {
      summary: `This might be quietly hurting screen-reader users. ${issue.title.toLowerCase()} is one of those small things that compounds — fix it once and a whole class of users gets a smoother ride.`,
      approach:
        "Walk through the page with a screen reader (VoiceOver, NVDA) for 30 seconds. You'll feel the gap immediately. Then patch the markup so the element announces itself meaningfully.",
      bestPractices: [
        "Treat alt text as a 1-sentence caption, not a keyword dump.",
        "Every interactive element should have an accessible name in any rendering mode.",
        "Prefer native semantic elements over ARIA when possible.",
      ],
      resources: [
        { label: "WAI-ARIA Authoring Practices", url: "https://www.w3.org/WAI/ARIA/apg/" },
        { label: "MDN: Accessibility", url: "https://developer.mozilla.org/en-US/docs/Web/Accessibility" },
      ],
    },
    UX: {
      summary: `Small UX gap, but visitors notice. ${issue.title} usually shows up as people bouncing or mis-tapping without ever telling you why.`,
      approach:
        "Open the page on a real phone, not just devtools. If anything feels off in the first three seconds, that's your real bug.",
      bestPractices: [
        "Always declare a viewport for responsive layout.",
        "Title and description are the page's elevator pitch — write them like one.",
        "One H1, then a clean heading outline beneath it.",
      ],
      resources: [
        { label: "Web.dev: Content best practices", url: "https://web.dev/learn/" },
      ],
    },
    CSS: {
      summary: `Not breaking anything today, but it's the kind of thing that gets expensive in six months. ${issue.title} signals that the design system is leaking.`,
      approach:
        "Lift repeated style attributes into utility classes or tokens. Future-you will thank present-you the first time a designer changes the brand color.",
      bestPractices: [
        "Inline styles override your design system silently.",
        "Prefer semantic HTML before reaching for divs.",
        "Token everything that appears more than twice.",
      ],
      resources: [
        { label: "CSS Guidelines", url: "https://cssguidelin.es/" },
      ],
    },
    Visual: {
      summary: `Visually subtle, behaviorally loud. ${issue.title} shrinks the user's effective hit-area or trust in the interface.`,
      approach:
        "Bump the size, recheck contrast, then shrink the browser to mobile width and try the flow with a thumb.",
      bestPractices: [
        "14–16px minimum for body and interactive labels.",
        "Tap targets should be ~44×44px.",
        "Visual hierarchy beats decoration.",
      ],
      resources: [
        { label: "Apple HIG: Touch targets", url: "https://developer.apple.com/design/human-interface-guidelines/" },
      ],
    },
  };

  return tone[issue.category];
}
