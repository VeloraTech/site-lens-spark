import { Outlet, Link, createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";
import { Toaster } from "@/components/ui/sonner";

import appCss from "../styles.css?url";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "SiteLens — Local Pre-Deployment Site Checker" },
      { name: "description", content: "SiteLens is a local-first, offline-first developer tool for catching accessibility, UX, CSS and structural issues before you ship." },
      { name: "author", content: "SiteLens" },
      { property: "og:title", content: "SiteLens — Local Pre-Deployment Site Checker" },
      { property: "og:description", content: "SiteLens is a local-first, offline-first developer tool for catching accessibility, UX, CSS and structural issues before you ship." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:site", content: "@Lovable" },
      { name: "twitter:title", content: "SiteLens — Local Pre-Deployment Site Checker" },
      { name: "twitter:description", content: "SiteLens is a local-first, offline-first developer tool for catching accessibility, UX, CSS and structural issues before you ship." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/93944dc4-6fd4-4a14-8b84-3415d60d3d52/id-preview-9afc7614--dac76ec5-742d-4eae-95a2-c426ae45987c.lovable.app-1777781232040.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/93944dc4-6fd4-4a14-8b84-3415d60d3d52/id-preview-9afc7614--dac76ec5-742d-4eae-95a2-c426ae45987c.lovable.app-1777781232040.png" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body className="dark">
        {children}
        <Toaster theme="dark" position="bottom-right" />
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  return <Outlet />;
}
