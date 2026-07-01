import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import heroAsset from "@/assets/leh-hero.jpg.asset.json";
import festivalAsset from "@/assets/leh-festival.jpg.asset.json";
import galaAsset from "@/assets/leh-gala.jpg.asset.json";
import clubAsset from "@/assets/leh-club.jpg.asset.json";
import portraitAsset from "@/assets/leh-portrait.jpg.asset.json";
import heroVideo from "@/assets/hero-video.mp4.asset.json";
import showreelVideo from "@/assets/showreel.mp4.asset.json";
const heroImg = heroAsset.url;
const festivalImg = festivalAsset.url;
const galaImg = galaAsset.url;
const clubImg = clubAsset.url;
const portraitImg = portraitAsset.url;
import { VideoPlayer } from "@/components/VideoPlayer";
import { LangSwitcher, useI18n } from "@/lib/i18n";

const BOOKING_EMAIL = "lehbookingpro@gmail.com";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "LE H — Master of Ceremonies & Host | Booking MC International" },
      {
        name: "description",
        content:
          "LE H — MC & Host professionnel. Galas, clubs, festivals, événements corporate et lancements. Booking international : lehbookingpro@gmail.com",
      },
      { name: "keywords", content: "MC, host, master of ceremonies, animateur, gala, festival, club, corporate, LE H, booking" },
      { property: "og:title", content: "LE H — Master of Ceremonies & Host" },
      {
        property: "og:description",
        content: "Host, MC & Crowd Catalyst. Voice. Rhythm. Presence. Booking 2024–2025.",
      },
      { property: "og:image", content: heroImg },
      { property: "og:image:alt", content: "LE H — MC sur scène avec micro, lumières lasers" },
      { property: "og:url", content: "/" },
      { name: "twitter:title", content: "LE H — Master of Ceremonies & Host" },
      { name: "twitter:description", content: "Host, MC & Crowd Catalyst. Booking 2024–2025." },
      { name: "twitter:image", content: heroImg },
    ],
    links: [{ rel: "canonical", href: "/" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Person",
          name: "LE H",
          jobTitle: "Master of Ceremonies & Host",
          description: "MC, host et animateur événementiel international.",
          email: `mailto:${BOOKING_EMAIL}`,
          image: heroImg,
          knowsLanguage: ["fr", "en", "es"],
          areaServed: "Worldwide",
        }),
      },
    ],
  }),
  component: Index,
});

function useReveal<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => entry.isIntersecting && setVisible(true),
      { threshold: 0.15 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return { ref, visible };
}

function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const { ref, visible } = useReveal<HTMLDivElement>();
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(28px)",
        transition: `opacity 0.9s cubic-bezier(0.16,1,0.3,1) ${delay}ms, transform 0.9s cubic-bezier(0.16,1,0.3,1) ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

// Cursor-tracking spotlight
function useSpotlight<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const handle = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      el.style.setProperty("--mx", `${e.clientX - rect.left}px`);
      el.style.setProperty("--my", `${e.clientY - rect.top}px`);
    };
    el.addEventListener("mousemove", handle);
    return () => el.removeEventListener("mousemove", handle);
  }, []);
  return ref;
}

function Index() {
  const { t } = useI18n();
  const spotRef = useSpotlight<HTMLDivElement>();

  const PRESTATIONS = [
    { n: "01", tag: t("prest.1.tag"), title: t("prest.1.title"), desc: t("prest.1.desc"), img: festivalImg, offset: "" },
    { n: "02", tag: t("prest.2.tag"), title: t("prest.2.title"), desc: t("prest.2.desc"), img: galaImg, offset: "md:mt-24" },
    { n: "03", tag: t("prest.3.tag"), title: t("prest.3.title"), desc: t("prest.3.desc"), img: clubImg, offset: "" },
  ];

  const STATS = [
    { v: "300+", l: t("stats.events") },
    { v: "12", l: t("stats.countries") },
    { v: "50K", l: t("stats.pax") },
    { v: "08", l: t("stats.years") },
  ];

  const TESTIMONIALS = [
    { q: t("testi.1.q"), a: t("testi.1.a") },
    { q: t("testi.2.q"), a: t("testi.2.a") },
    { q: t("testi.3.q"), a: t("testi.3.a") },
  ];

  const marqueeWords = [t("marquee.1"), t("marquee.2"), t("marquee.3"), t("marquee.4"), t("marquee.5"), t("marquee.6")];

  return (
    <div className="min-h-screen bg-background text-foreground font-sans overflow-x-hidden">
      {/* ====== Navigation ====== */}
      <nav className="fixed top-0 inset-x-0 z-50 flex justify-between items-center px-6 md:px-12 py-6 mix-blend-difference">
        <a href="#" className="font-display text-xl tracking-tighter text-white">
          LE H<span className="text-accent animate-flicker">.</span>
        </a>
        <div className="hidden md:flex gap-8 text-[11px] font-bold uppercase tracking-[0.2em] text-white">
          <a href="#prestations" className="hover:text-accent transition-colors">{t("nav.prestations")}</a>
          <a href="#showreel" className="hover:text-accent transition-colors">{t("nav.showreel")}</a>
          <a href="#about" className="hover:text-accent transition-colors">{t("nav.about")}</a>
          <a href={`mailto:${BOOKING_EMAIL}`} className="hover:text-accent transition-colors">{t("nav.contact")}</a>
        </div>
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

      {/* ====== Hero ====== */}
      <section
        ref={spotRef}
        className="relative h-screen min-h-[700px] flex flex-col justify-end p-6 md:p-16 overflow-hidden noise"
        style={{ ["--mx" as string]: "50%", ["--my" as string]: "50%" } as React.CSSProperties}
      >
        {/* Aurora warm background */}
        <div className="aurora-bg" aria-hidden="true" />

        {/* Video background */}
        <div className="absolute inset-0 z-0" aria-hidden="true">
          <video
            src={heroVideo.url}
            poster={heroImg}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            tabIndex={-1}
            className="w-full h-full object-cover opacity-55 animate-drift"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-background/30" />
          <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-transparent to-background/40" />
        </div>

        {/* Cursor spotlight */}
        <div
          className="pointer-events-none absolute inset-0 z-[1] opacity-70 transition-opacity duration-500"
          style={{
            background:
              "radial-gradient(400px circle at var(--mx) var(--my), color-mix(in oklab, var(--accent) 25%, transparent), transparent 70%)",
          }}
          aria-hidden="true"
        />

        {/* Scanline accent */}
        <div className="absolute inset-y-0 left-0 w-px bg-gradient-to-b from-transparent via-accent/40 to-transparent" />

        {/* Top meta */}
        <div className="absolute top-24 md:top-32 left-6 md:left-16 z-10 flex items-center gap-3 text-[10px] uppercase tracking-[0.3em] text-white/70 animate-fade-up">
          <span className="size-2 rounded-full bg-accent animate-pulse-dot" />
          {t("hero.status")}
        </div>

        {/* Rotating badge top-right */}
        <div className="hidden md:block absolute top-28 right-16 z-10">
          <div className="relative size-24 animate-spin-slow">
            <svg viewBox="0 0 100 100" className="w-full h-full text-accent">
              <defs>
                <path id="circ" d="M50,50 m-38,0 a38,38 0 1,1 76,0 a38,38 0 1,1 -76,0" />
              </defs>
              <text fontSize="9" letterSpacing="3" fill="currentColor" fontFamily="var(--font-display)">
                <textPath href="#circ">LE H • LIVE • BOOKING • 2024 • </textPath>
              </text>
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-accent text-xl">✦</span>
          </div>
        </div>

        <div className="relative z-10 max-w-6xl animate-fade-up">
          <p className="text-[11px] uppercase tracking-[0.3em] text-accent font-bold mb-6">
            {t("hero.role")}
          </p>
          <h1 className="font-display text-[18vw] md:text-[12vw] leading-[0.85] tracking-tighter uppercase">
            {t("hero.title1")}
            <br />
            <span className="shimmer-text italic animate-glow">{t("hero.title2")}</span>
          </h1>

          <div className="mt-10 flex flex-col md:flex-row md:items-end justify-between gap-8">
            <p className="max-w-md text-white/70 text-base md:text-lg leading-relaxed">
              {t("hero.desc")}
            </p>
            <div className="flex flex-wrap gap-4">
              <a href="#showreel" className="group relative cursor-pointer">
                <div className="absolute -inset-1 bg-accent opacity-30 group-hover:opacity-70 blur-md transition-opacity animate-pulse-dot" />
                <div className="relative px-8 py-4 bg-background border border-accent/60 text-accent font-bold uppercase tracking-[0.2em] text-xs flex items-center gap-3">
                  <span className="size-2 rounded-full bg-accent animate-pulse-dot" />
                  {t("hero.cta.showreel")}
                </div>
              </a>
              <a
                href={`mailto:${BOOKING_EMAIL}`}
                className="px-8 py-4 border border-white/15 text-white font-bold uppercase tracking-[0.2em] text-xs hover:bg-accent hover:text-accent-foreground hover:border-accent transition-colors"
              >
                {t("hero.cta.book")}
              </a>
            </div>
          </div>
        </div>

        {/* Bottom strip */}
        <div className="absolute bottom-0 inset-x-0 border-t border-white/5 px-6 md:px-16 py-4 flex justify-between items-center text-[10px] uppercase tracking-[0.3em] text-white/40 z-10">
          <span className="animate-float">↓ {t("hero.scroll")}</span>
          <LangSwitcher />
          <span className="hidden md:block">{t("hero.location")}</span>
        </div>
      </section>

      {/* ====== Marquee ====== */}
      <div className="border-y border-white/10 py-6 overflow-hidden bg-background">
        <div className="animate-marquee flex whitespace-nowrap gap-12 items-center">
          {Array.from({ length: 2 }).map((_, k) => (
            <div key={k} className="flex items-center gap-12 pr-12">
              {["LE H", "THE VOICE", "LE H", "THE VIBE", "LE H", "THE ENERGY", "LE H", "THE HOST"].map(
                (w, i) => (
                  <span
                    key={i}
                    className={`font-display text-3xl md:text-5xl uppercase ${
                      i % 2 === 0 ? "text-white/15" : "text-accent"
                    }`}
                  >
                    {w}
                  </span>
                ),
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ====== Prestations ====== */}
      <section id="prestations" className="py-24 md:py-40 px-6 md:px-8 relative">
        <div className="max-w-7xl mx-auto">
          <Reveal>
            <div className="flex justify-between items-end mb-16 flex-wrap gap-6">
              <div>
                <span className="text-accent font-bold uppercase tracking-[0.3em] text-[10px] block mb-4">
                  {t("prest.eyebrow")}
                </span>
                <h2 className="font-display text-3xl md:text-5xl uppercase">
                  {t("prest.title")}
                </h2>
              </div>
              <div className="hidden md:block h-px flex-1 bg-white/10 mx-12 mb-4" />
              <p className="text-white/50 text-sm max-w-xs">
                {t("prest.intro")}
              </p>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {PRESTATIONS.map((p, i) => (
              <Reveal key={p.n} delay={i * 120}>
                <div className={`group relative overflow-hidden bg-surface hover-tilt ${p.offset}`}>
                  <div className="relative aspect-[9/16] w-full overflow-hidden">
                    <img
                      src={p.img}
                      alt={p.tag}
                      loading="lazy"
                      width={1024}
                      height={1536}
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 scale-105 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-t from-accent/30 via-transparent to-transparent mix-blend-overlay" />
                    <span className="absolute top-4 left-4 size-3 border-t border-l border-accent" />
                    <span className="absolute top-4 right-4 size-3 border-t border-r border-accent opacity-60" />
                    <span className="absolute top-4 right-4 text-[10px] text-accent font-mono pr-5">{p.n}</span>
                  </div>
                  <div className="absolute inset-x-0 bottom-0 p-6 md:p-8">
                    <span className="text-accent text-[10px] font-bold uppercase tracking-[0.3em] mb-3 block">
                      {p.tag}
                    </span>
                    <h3 className="font-display text-2xl md:text-3xl uppercase leading-[0.95] whitespace-pre-line mb-4">
                      {p.title}
                    </h3>
                    <p className="text-white/55 text-sm leading-relaxed max-w-[28ch]">
                      {p.desc}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ====== Showreel ====== */}
      <section id="showreel" className="relative py-24 md:py-32 overflow-hidden">
        <div className="aurora-bg" aria-hidden="true" style={{ opacity: 0.25 }} />
        <div className="px-6 md:px-16 max-w-7xl mx-auto relative">
          <Reveal>
            <div className="mb-12 flex items-end justify-between flex-wrap gap-6">
              <div>
                <span className="text-accent font-bold uppercase tracking-[0.3em] text-[10px] block mb-4">
                  {t("show.eyebrow")}
                </span>
                <h2 className="font-display text-3xl md:text-6xl uppercase">
                  {t("show.title1")}<br />
                  <span className="shimmer-text italic">{t("show.title2")}</span>
                </h2>
              </div>
              <div className="flex items-center gap-3 text-[10px] uppercase tracking-[0.3em] text-white/50">
                <span className="size-2 rounded-full bg-accent animate-pulse-dot" />
                {t("show.live")}
              </div>
            </div>
          </Reveal>

          <Reveal delay={150}>
            <div className="relative group overflow-hidden border border-white/10 glow-accent">
              <VideoPlayer
                src={showreelVideo.url}
                poster={heroImg}
                loop
                ariaLabel="Showreel LE H 2024"
                className="aspect-video"
                captions={[
                  { src: "/captions/showreel.fr.vtt", label: "Français", srcLang: "fr", default: true },
                ]}
              />
              <span className="pointer-events-none absolute top-4 left-4 size-6 border-t-2 border-l-2 border-accent" />
              <span className="pointer-events-none absolute top-4 right-4 size-6 border-t-2 border-r-2 border-accent" />
              <span className="pointer-events-none absolute bottom-4 left-4 size-6 border-b-2 border-l-2 border-accent" />
              <span className="pointer-events-none absolute bottom-4 right-4 size-6 border-b-2 border-r-2 border-accent" />
            </div>
          </Reveal>

          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 border-y border-white/10 divide-x divide-white/10">
            {STATS.map((s, i) => (
              <Reveal key={s.l} delay={i * 80}>
                <div className="px-6 py-8 md:py-10 group">
                  <div className="font-display text-4xl md:text-6xl text-accent glow-text group-hover:animate-glow">
                    {s.v}
                  </div>
                  <div className="mt-2 text-[10px] uppercase tracking-[0.3em] text-white/50">
                    {s.l}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ====== Reverse Marquee ====== */}
      <div className="border-y border-white/10 py-5 overflow-hidden bg-surface/40">
        <div className="animate-marquee-reverse flex whitespace-nowrap gap-10 items-center text-white/40">
          {Array.from({ length: 2 }).map((_, k) => (
            <div key={k} className="flex items-center gap-10 pr-10 text-[11px] uppercase tracking-[0.3em] font-bold">
              {marqueeWords.map((w, i) => (
                <span key={i} className="flex items-center gap-10">
                  <span>{w}</span>
                  <span className="text-accent">/</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* ====== About ====== */}
      <section id="about" className="py-24 md:py-40 px-6 md:px-16">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
          <Reveal className="md:col-span-7">
            <span className="text-accent font-bold uppercase tracking-[0.3em] text-[10px] block mb-6">
              {t("about.eyebrow")}
            </span>
            <h2 className="font-display text-4xl md:text-7xl uppercase leading-[0.95] mb-8">
              {t("about.title1")}<br />
              <span className="text-accent">{t("about.title2")}</span><br />
              {t("about.title3")}
            </h2>
            <p className="text-white/65 leading-relaxed max-w-xl mb-6">
              {t("about.p1")}
            </p>
            <p className="text-white/65 leading-relaxed max-w-xl">
              {t("about.p2")}
            </p>
            <div className="mt-10 flex flex-wrap gap-2 text-[10px] uppercase tracking-[0.2em] font-bold">
              {[t("about.tag.1"), t("about.tag.2"), t("about.tag.3"), t("about.tag.4"), t("about.tag.5")].map((tag) => (
                <span
                  key={tag}
                  className="border border-white/15 px-3 py-1.5 text-white/70 hover:border-accent hover:text-accent hover:-translate-y-0.5 transition-all duration-300"
                >
                  {tag}
                </span>
              ))}
            </div>
          </Reveal>

          <Reveal delay={200} className="md:col-span-5">
            <div className="relative aspect-[4/5] overflow-hidden border border-white/10 noise hover-tilt">
              <img
                src={portraitImg}
                alt="LE H portrait"
                loading="lazy"
                width={1024}
                height={1536}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/70 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end text-[10px] uppercase tracking-[0.25em] font-mono">
                <span className="text-accent">// LE H</span>
                <span className="text-white/50">Paris, FR</span>
              </div>
              <span className="absolute top-6 left-6 size-4 border-t-2 border-l-2 border-accent" />
              <span className="absolute top-6 right-6 size-4 border-t-2 border-r-2 border-accent" />
            </div>
          </Reveal>
        </div>
      </section>

      {/* ====== Testimonials ====== */}
      <section className="py-24 px-6 md:px-16 border-t border-white/10">
        <div className="max-w-7xl mx-auto">
          <Reveal>
            <span className="text-accent font-bold uppercase tracking-[0.3em] text-[10px] block mb-4">
              {t("testi.eyebrow")}
            </span>
            <h2 className="font-display text-3xl md:text-5xl uppercase mb-16 max-w-2xl">
              {t("testi.title")}
            </h2>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-white/10">
            {TESTIMONIALS.map((tItem, i) => (
              <Reveal key={i} delay={i * 100}>
                <div className="bg-background h-full p-8 md:p-10 flex flex-col justify-between min-h-[260px] group hover:bg-surface transition-colors">
                  <p className="font-display text-3xl text-accent leading-none mb-4 group-hover:animate-glow">"</p>
                  <p className="text-white/75 text-base leading-relaxed flex-1">
                    {tItem.q}
                  </p>
                  <p className="mt-6 text-[10px] uppercase tracking-[0.25em] text-white/45 font-bold">
                    {tItem.a}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ====== CTA / Contact ====== */}
      <section id="contact" className="relative py-32 md:py-48 px-6 md:px-16 overflow-hidden">
        <div className="aurora-bg" aria-hidden="true" />
        <div className="absolute inset-0 z-0 opacity-30">
          <img src={heroImg} alt="" className="w-full h-full object-cover grayscale" loading="lazy" />
          <div className="absolute inset-0 bg-gradient-to-b from-background via-background/80 to-background" />
        </div>
        <div className="relative z-10 max-w-5xl mx-auto text-center">
          <Reveal>
            <span className="text-accent font-bold uppercase tracking-[0.3em] text-[10px] block mb-8">
              {t("cta.eyebrow")}
            </span>
            <h2 className="font-display text-5xl md:text-[10rem] leading-[0.85] uppercase mb-12">
              {t("cta.title1")}<br />
              <span className="shimmer-text italic animate-glow">{t("cta.title2")}</span>
            </h2>
            <p className="text-white/65 max-w-xl mx-auto mb-12">
              {t("cta.desc")}
            </p>
          </Reveal>
          <Reveal delay={150}>
            <div className="flex flex-wrap justify-center gap-4 mb-12">
              <a
                href={`mailto:${BOOKING_EMAIL}`}
                className="group relative px-10 py-5 bg-accent text-accent-foreground font-display text-base md:text-lg uppercase tracking-tighter hover:bg-white transition-colors"
              >
                <span className="absolute -inset-1 bg-accent opacity-40 blur-lg group-hover:opacity-80 transition-opacity" aria-hidden="true" />
                <span className="relative">{t("cta.book")}</span>
              </a>
            </div>
            <div className="flex flex-wrap justify-center gap-8 text-[11px] uppercase tracking-[0.3em] text-white/60 font-bold">
              <a href={`mailto:${BOOKING_EMAIL}`} className="hover:text-accent transition-colors">
                {BOOKING_EMAIL}
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ====== Footer ====== */}
      <footer className="border-t border-white/10 px-6 md:px-16 py-10 flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] uppercase tracking-[0.3em] text-white/40">
        <p>{t("footer.rights")}</p>
        <div className="font-display text-2xl text-white tracking-tighter">
          LE H<span className="text-accent animate-flicker">.</span>
        </div>
        <div className="flex gap-8">
          <a href="#" className="hover:text-accent transition-colors">Instagram</a>
          <a href="#" className="hover:text-accent transition-colors">YouTube</a>
          <a href="#" className="hover:text-accent transition-colors">LinkedIn</a>
        </div>
      </footer>
    </div>
  );
}
