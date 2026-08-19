import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { getPlayground, PLAYGROUNDS } from "@/lib/playgrounds";
import { useI18n, LangSwitcher } from "@/lib/i18n";

const BOOKING_EMAIL = "lehbookingpro@gmail.com";

export const Route = createFileRoute("/playgrounds/$slug")({
  loader: ({ params }) => {
    const pg = getPlayground(params.slug);
    if (!pg) throw notFound();
    return { slug: pg.slug };
  },
  head: ({ params }) => {
    const pg = getPlayground(params.slug);
    if (!pg) {
      return { meta: [{ title: "Playground introuvable — LE H" }, { name: "robots", content: "noindex" }] };
    }
    const title = `${pg.slug === "festivals" ? "Festivals" : pg.slug === "clubs" ? "Clubs" : "Concert & Live"} — LE H, Host & Showman`;
    const description = "Images, vidéos et détails des prestations de LE H, host & showman. Booking : lehbookingpro@gmail.com";
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "article" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  component: PlaygroundPage,
  notFoundComponent: () => (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 bg-background text-foreground">
      <h1 className="font-display text-4xl uppercase">Playground introuvable</h1>
      <Link to="/" className="text-accent uppercase text-xs tracking-[0.3em] font-bold">← Retour</Link>
    </div>
  ),
});

function PlaygroundPage() {
  const { slug } = Route.useLoaderData();
  const { t } = useI18n();
  const pg = getPlayground(slug)!;
  const others = PLAYGROUNDS.filter((p) => p.slug !== pg.slug);

  return (
    <div className="min-h-screen bg-background text-foreground font-sans overflow-x-hidden">
      <nav className="fixed top-0 inset-x-0 z-50 flex justify-between items-center px-6 md:px-12 py-6 mix-blend-difference">
        <Link to="/" className="font-display text-xl tracking-tighter text-white">
          LE H<span className="text-accent animate-flicker">.</span>
        </Link>
        <div className="flex items-center gap-4">
          <LangSwitcher className="hidden sm:inline-flex" />
          <a
            href={`mailto:${BOOKING_EMAIL}`}
            className="text-[11px] font-bold uppercase tracking-[0.2em] bg-accent text-accent-foreground px-4 py-2 rounded-sm hover:bg-white transition-colors"
          >
            {t("nav.booking")}
          </a>
        </div>
      </nav>

      {/* Hero */}
      <header className="relative h-[70vh] min-h-[480px] flex items-end overflow-hidden noise">
        <img src={pg.cover} alt={t(pg.tagKey)} className="absolute inset-0 w-full h-full object-cover scale-105" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-background/30" />
        <div className="relative z-10 px-6 md:px-16 pb-14 w-full max-w-7xl mx-auto animate-fade-up">
          <span className="text-accent font-mono text-[10px] tracking-[0.3em]">{pg.n}</span>
          <p className="mt-4 text-[11px] uppercase tracking-[0.3em] text-accent font-bold">{t(pg.tagKey)}</p>
          <h1 className="font-display text-[12vw] md:text-[6vw] leading-[0.9] uppercase tracking-tighter whitespace-pre-line">
            {t(pg.titleKey)}
          </h1>
        </div>
      </header>

      {/* Details */}
      <section className="px-6 md:px-16 py-20 max-w-4xl mx-auto">
        <p className="text-white/75 text-lg leading-relaxed mb-6">{t(pg.descKey)}</p>
        <p className="text-white/60 leading-relaxed">{t(pg.bodyKey)}</p>
      </section>

      {/* Videos */}
      <section className="px-6 md:px-16 pb-20 max-w-7xl mx-auto">
        <h2 className="font-display text-2xl md:text-4xl uppercase mb-8">{t("pg.videos")}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {pg.videos.map((v) => (
            <div key={v.src} className="relative aspect-[9/16] overflow-hidden border border-white/10 bg-surface">
              <video
                className="w-full h-full object-cover"
                controls
                playsInline
                preload="metadata"
                poster={pg.cover}
                aria-label={`${t(pg.tagKey)} — ${v.tag}`}
              >
                <source src={v.srcMobile} type="video/mp4" media="(max-width: 768px)" />
                <source src={v.src} type="video/mp4" />
              </video>
              <span className="pointer-events-none absolute top-3 left-3 text-[10px] uppercase tracking-[0.25em] text-accent font-bold">
                {v.tag}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Gallery */}
      <section className="px-6 md:px-16 pb-24 max-w-7xl mx-auto">
        <h2 className="font-display text-2xl md:text-4xl uppercase mb-8">{t("pg.gallery")}</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {pg.gallery.map((g, i) => (
            <div key={i} className="group relative aspect-[4/5] overflow-hidden border border-white/10">
              <img
                src={g.src}
                alt={g.alt}
                loading="lazy"
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
              />
            </div>
          ))}
        </div>
      </section>

      {/* Others + CTA */}
      <section className="border-t border-white/10 px-6 md:px-16 py-16 max-w-7xl mx-auto flex flex-wrap gap-6 justify-between items-center">
        <div className="flex flex-wrap gap-4">
          {others.map((o) => (
            <Link
              key={o.slug}
              to="/playgrounds/$slug"
              params={{ slug: o.slug }}
              className="text-[11px] uppercase tracking-[0.25em] font-bold border border-white/15 px-4 py-3 hover:border-accent hover:text-accent transition-colors"
            >
              {t(o.tagKey)} →
            </Link>
          ))}
        </div>
        <div className="flex gap-4 items-center">
          <Link to="/" className="text-[11px] uppercase tracking-[0.25em] text-white/60 hover:text-accent font-bold">
            ← {t("pg.back")}
          </Link>
          <a
            href={`mailto:${BOOKING_EMAIL}`}
            className="px-6 py-3 bg-accent text-accent-foreground text-[11px] uppercase tracking-[0.25em] font-bold hover:bg-white transition-colors"
          >
            {t("cta.book")}
          </a>
        </div>
      </section>
    </div>
  );
}
