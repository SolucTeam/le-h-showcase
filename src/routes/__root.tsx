import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import heroImg from "@/assets/hero.webp";
import { LangProvider } from "@/lib/i18n";
import { resolveLanguage } from "@/lib/seo";
import { Hero3D } from "@/components/Hero3D";

import { reportLovableError } from "../lib/lovable-error-reporting";

// Rotating "LE H" badge reused on the status pages.
function SpinBadge() {
  return (
    <div className="relative size-24 animate-spin-slow" aria-hidden="true">
      <svg viewBox="0 0 100 100" className="w-full h-full text-accent">
        <defs>
          <path id="badgecirc" d="M50,50 m-38,0 a38,38 0 1,1 76,0 a38,38 0 1,1 -76,0" />
        </defs>
        <text fontSize="9" letterSpacing="3" fill="currentColor" fontFamily="var(--font-display)">
          <textPath href="#badgecirc">LE H • LE H • LE H • LE H • </textPath>
        </text>
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-accent text-xl">✦</span>
    </div>
  );
}

function StatusShell({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-background text-foreground px-6 noise">
      <div className="aurora-bg" aria-hidden="true" />
      <div className="absolute inset-0 z-0 opacity-20" aria-hidden="true">
        <img src={heroImg} alt="" className="w-full h-full object-cover grayscale" />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/85 to-background" />
      </div>
      {/* Real 3D WebGL layer behind the status content */}
      <Hero3D variant="knot" className="pointer-events-none absolute inset-0 z-[1] mix-blend-screen opacity-80" />
      <div className="absolute top-8 left-6 md:left-12 z-10 font-display text-xl tracking-tighter text-white">
        LE H<span className="text-accent animate-flicker">.</span>
      </div>
      <div className="relative z-10 w-full max-w-3xl text-center animate-fade-up">{children}</div>
    </div>
  );
}

function NotFoundComponent() {
  return (
    <StatusShell>
      <div className="flex justify-center mb-6">
        <SpinBadge />
      </div>
      <p className="text-[11px] uppercase tracking-[0.35em] text-accent font-bold mb-6">
        Erreur — Page introuvable
      </p>
      <h1 className="font-display text-[32vw] md:text-[18rem] leading-[0.8] tracking-tighter uppercase glow-text">
        <span className="glitch" data-text="404">404</span>
      </h1>
      <p className="mt-6 text-white/60 max-w-md mx-auto leading-relaxed">
        Cette scène n'existe pas — ou elle a quitté le plateau. Revenons là où le show commence.
      </p>
      <div className="mt-10 flex flex-wrap justify-center gap-4">
        <Link
          to="/"
          className="group relative px-9 py-4 bg-accent text-accent-foreground font-display text-sm uppercase tracking-tighter hover:bg-white transition-colors"
        >
          <span className="absolute -inset-1 bg-accent opacity-40 blur-lg group-hover:opacity-80 transition-opacity" aria-hidden="true" />
          <span className="relative">Retour à l'accueil</span>
        </Link>
      </div>
    </StatusShell>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <StatusShell>
      <div className="flex justify-center mb-6">
        <SpinBadge />
      </div>
      <p className="text-[11px] uppercase tracking-[0.35em] text-accent font-bold mb-6">
        Coupure de courant
      </p>
      <h1 className="font-display text-6xl md:text-[9rem] leading-[0.85] tracking-tighter uppercase">
        <span className="glitch" data-text="OOPS">OOPS</span>
        <br />
        <span className="shimmer-text italic animate-glow">quelque chose a lâché.</span>
      </h1>
      <p className="mt-6 text-white/60 max-w-md mx-auto leading-relaxed">
        Un pépin technique de notre côté. Tu peux relancer, ou revenir à l'accueil.
      </p>
      <div className="mt-10 flex flex-wrap justify-center gap-4">
        <button
          onClick={() => {
            router.invalidate();
            reset();
          }}
          className="group relative px-9 py-4 bg-accent text-accent-foreground font-display text-sm uppercase tracking-tighter hover:bg-white transition-colors"
        >
          <span className="absolute -inset-1 bg-accent opacity-40 blur-lg group-hover:opacity-80 transition-opacity" aria-hidden="true" />
          <span className="relative">Réessayer</span>
        </button>
        <a
          href="/"
          className="px-9 py-4 border border-white/20 text-white font-bold uppercase tracking-[0.2em] text-xs hover:border-accent hover:text-accent transition-colors"
        >
          Accueil
        </a>
      </div>
    </StatusShell>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  validateSearch: (search: Record<string, unknown>): { lang?: string } => ({
    lang: typeof search.lang === "string" ? search.lang : undefined,
  }),
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { name: "theme-color", content: "#0a0a0a" },
      { name: "robots", content: "index, follow" },
      { property: "og:site_name", content: "LE H" },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "fr_FR" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@400;500;600;700&display=swap" },
      { rel: "preload", as: "image", href: heroImg, fetchPriority: "high" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  const { lang } = Route.useSearch();
  return (
    <html lang={resolveLanguage(lang)}>
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <LangProvider>
        {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
        <Outlet />
      </LangProvider>
    </QueryClientProvider>
  );
}
