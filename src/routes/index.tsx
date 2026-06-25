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

const BOOKING_EMAIL = "lehbookingpro@gmail.com";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "LE H — Master of Ceremonies & Host | Booking MC International" },
      {
        name: "description",
        content:
          "LE H — MC & Host professionnel. Mariages, galas, clubs, festivals et événements corporate. Booking international 2024–2025 : lehbookingpro@gmail.com",
      },
      { name: "keywords", content: "MC, host, master of ceremonies, animateur, mariage, gala, festival, club, événementiel, LE H, booking" },
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

const PRESTATIONS = [
  {
    n: "01",
    tag: "Festivals",
    title: "Mainstage\nTakeovers",
    desc: "Maîtriser les grandes scènes, annoncer les artistes, tenir l'intensité de la foule.",
    img: festivalImg,
    offset: "",
  },
  {
    n: "02",
    tag: "Galas & Mariages",
    title: "Gala &\nAward Nights",
    desc: "Une conduite de soirée élégante et rythmée, du cocktail jusqu'au bouquet final.",
    img: galaImg,
    offset: "md:mt-24",
  },
  {
    n: "03",
    tag: "Clubs",
    title: "The\nCatalyst Set",
    desc: "Hype, transitions, freestyle au mic. Une connexion totale avec le dancefloor.",
    img: clubImg,
    offset: "",
  },
] as const;

const STATS = [
  { v: "300+", l: "Événements" },
  { v: "12", l: "Pays" },
  { v: "50K", l: "PAX cumulés" },
  { v: "08", l: "Années" },
];

const TESTIMONIALS = [
  {
    q: "Le H a transformé notre soirée en moment magique. Un vrai chef d'orchestre de l'ambiance.",
    a: "Sophie & Thomas — Mariage, Juillet 2023",
  },
  {
    q: "Sens du timing parfait. Il a capté 400 invités dès les premières secondes.",
    a: "Marc D. — LuxMedia",
  },
  {
    q: "L'énergie d'un festival concentrée dans une voix. On le rebooke en 2024.",
    a: "Kevin R. — Urban Fest",
  },
];

function Index() {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans overflow-x-hidden">
      {/* ====== Navigation ====== */}
      <nav className="fixed top-0 inset-x-0 z-50 flex justify-between items-center px-6 md:px-12 py-6 mix-blend-difference">
        <a href="#" className="font-display text-xl tracking-tighter text-white">
          LE H<span className="text-accent">.</span>
        </a>
        <div className="hidden md:flex gap-8 text-[11px] font-bold uppercase tracking-[0.2em] text-white">
          <a href="#prestations" className="hover:text-accent transition-colors">Prestations</a>
          <a href="#showreel" className="hover:text-accent transition-colors">Showreel</a>
          <a href="#about" className="hover:text-accent transition-colors">À propos</a>
          <a href="#contact" className="hover:text-accent transition-colors">Contact</a>
        </div>
        <a
          href="#contact"
          className="text-[11px] font-bold uppercase tracking-[0.2em] bg-accent text-accent-foreground px-4 py-2 rounded-sm hover:bg-white transition-colors"
        >
          Booking
        </a>
      </nav>

      {/* ====== Hero ====== */}
      <section className="relative h-screen min-h-[700px] flex flex-col justify-end p-6 md:p-16 overflow-hidden noise">
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

        {/* Scanline accent */}
        <div className="absolute inset-y-0 left-0 w-px bg-gradient-to-b from-transparent via-accent/40 to-transparent" />

        {/* Top meta */}
        <div className="absolute top-24 md:top-32 left-6 md:left-16 z-10 flex items-center gap-3 text-[10px] uppercase tracking-[0.3em] text-white/70 animate-fade-up">
          <span className="size-2 rounded-full bg-accent animate-pulse-dot" />
          Booking 2024 — 2025
        </div>

        <div className="relative z-10 max-w-6xl animate-fade-up">
          <p className="text-[11px] uppercase tracking-[0.3em] text-accent font-bold mb-6">
            Master of Ceremonies / Host
          </p>
          <h1 className="font-display text-[18vw] md:text-[12vw] leading-[0.85] tracking-tighter uppercase">
            Master of
            <br />
            <span className="text-accent glow-text italic">Energy</span>
          </h1>

          <div className="mt-10 flex flex-col md:flex-row md:items-end justify-between gap-8">
            <p className="max-w-md text-white/70 text-base md:text-lg leading-relaxed">
              Host, MC & Crowd Catalyst. Je transforme les scènes en expériences
              partagées — par la voix, le rythme et la présence.
            </p>
            <div className="flex flex-wrap gap-4">
              <a
                href="#showreel"
                className="group relative cursor-pointer"
              >
                <div className="absolute -inset-1 bg-accent opacity-30 group-hover:opacity-60 blur-md transition-opacity" />
                <div className="relative px-8 py-4 bg-background border border-accent/60 text-accent font-bold uppercase tracking-[0.2em] text-xs flex items-center gap-3">
                  <span className="size-2 rounded-full bg-accent animate-pulse-dot" />
                  Watch Showreel
                </div>
              </a>
              <a
                href="#contact"
                className="px-8 py-4 border border-white/15 text-white font-bold uppercase tracking-[0.2em] text-xs hover:bg-white/5 transition-colors"
              >
                Réserver
              </a>
            </div>
          </div>
        </div>

        {/* Bottom strip */}
        <div className="absolute bottom-0 inset-x-0 border-t border-white/5 px-6 md:px-16 py-4 flex justify-between items-center text-[10px] uppercase tracking-[0.3em] text-white/40 z-10">
          <span>Scroll</span>
          <span>FR / EN / ES</span>
          <span className="hidden md:block">Paris — Worldwide</span>
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
      <section id="prestations" className="py-24 md:py-40 px-6 md:px-8">
        <div className="max-w-7xl mx-auto">
          <Reveal>
            <div className="flex justify-between items-end mb-16 flex-wrap gap-6">
              <div>
                <span className="text-accent font-bold uppercase tracking-[0.3em] text-[10px] block mb-4">
                  Vibe Check
                </span>
                <h2 className="font-display text-3xl md:text-5xl uppercase">
                  Live Fragments
                </h2>
              </div>
              <div className="hidden md:block h-px flex-1 bg-white/10 mx-12 mb-4" />
              <p className="text-white/50 text-sm max-w-xs">
                Trois terrains de jeu, une même obsession : transformer un public
                en une seule respiration.
              </p>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {PRESTATIONS.map((p, i) => (
              <Reveal key={p.n} delay={i * 120}>
                <div
                  className={`group relative overflow-hidden bg-surface ${p.offset}`}
                >
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
                    {/* Corner ticks */}
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
        <div className="px-6 md:px-16 max-w-7xl mx-auto">
          <Reveal>
            <div className="mb-12 flex items-end justify-between flex-wrap gap-6">
              <div>
                <span className="text-accent font-bold uppercase tracking-[0.3em] text-[10px] block mb-4">
                  Showreel — 2024
                </span>
                <h2 className="font-display text-3xl md:text-6xl uppercase">
                  Voir, c'est<br />
                  <span className="text-accent italic">entendre.</span>
                </h2>
              </div>
              <div className="flex items-center gap-3 text-[10px] uppercase tracking-[0.3em] text-white/50">
                <span className="size-2 rounded-full bg-accent animate-pulse-dot" />
                Live capture
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
                  {
                    src: "/captions/showreel.fr.vtt",
                    label: "Français",
                    srcLang: "fr",
                    default: true,
                  },
                ]}
              />
              {/* Corner brackets */}
              <span className="pointer-events-none absolute top-4 left-4 size-6 border-t-2 border-l-2 border-accent" />
              <span className="pointer-events-none absolute top-4 right-4 size-6 border-t-2 border-r-2 border-accent" />
              <span className="pointer-events-none absolute bottom-4 left-4 size-6 border-b-2 border-l-2 border-accent" />
              <span className="pointer-events-none absolute bottom-4 right-4 size-6 border-b-2 border-r-2 border-accent" />
            </div>

          </Reveal>

          {/* Stats strip */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 border-y border-white/10 divide-x divide-white/10">
            {STATS.map((s, i) => (
              <Reveal key={s.l} delay={i * 80}>
                <div className="px-6 py-8 md:py-10">
                  <div className="font-display text-4xl md:text-6xl text-accent glow-text">
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
              <span>Mariages</span><span className="text-accent">/</span>
              <span>Clubs & Festivals</span><span className="text-accent">/</span>
              <span>Galas Corporate</span><span className="text-accent">/</span>
              <span>Lancements Produit</span><span className="text-accent">/</span>
              <span>Cérémonies</span><span className="text-accent">/</span>
              <span>After-shows</span><span className="text-accent">/</span>
            </div>
          ))}
        </div>
      </div>

      {/* ====== About ====== */}
      <section id="about" className="py-24 md:py-40 px-6 md:px-16">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
          <Reveal className="md:col-span-7">
            <span className="text-accent font-bold uppercase tracking-[0.3em] text-[10px] block mb-6">
              Profil — 001
            </span>
            <h2 className="font-display text-4xl md:text-7xl uppercase leading-[0.95] mb-8">
              Une voix.<br />
              <span className="text-accent">Un public.</span><br />
              Un moment.
            </h2>
            <p className="text-white/65 leading-relaxed max-w-xl mb-6">
              Depuis huit ans, LE H traverse les scènes — du club confidentiel au
              mainstage festival, du gala de prestige au mariage le plus intime.
              Sa marque de fabrique : lire une salle en trois secondes et la
              guider exactement où elle veut aller.
            </p>
            <p className="text-white/65 leading-relaxed max-w-xl">
              Trilingue, méticuleux, prêt à tout. Du run-of-show au freestyle
              improvisé quand la musique l'exige.
            </p>
            <div className="mt-10 flex flex-wrap gap-2 text-[10px] uppercase tracking-[0.2em] font-bold">
              {["Bilingue FR/EN", "Run-of-show", "Improvisation", "Coord. artistes", "Plateau TV"].map(
                (t) => (
                  <span
                    key={t}
                    className="border border-white/15 px-3 py-1.5 text-white/70 hover:border-accent hover:text-accent transition-colors"
                  >
                    {t}
                  </span>
                ),
              )}
            </div>
          </Reveal>

          <Reveal delay={200} className="md:col-span-5">
            <div className="relative aspect-[4/5] overflow-hidden border border-white/10 noise">
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
              Témoignages
            </span>
            <h2 className="font-display text-3xl md:text-5xl uppercase mb-16 max-w-2xl">
              On dit de lui.
            </h2>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-white/10">
            {TESTIMONIALS.map((t, i) => (
              <Reveal key={i} delay={i * 100}>
                <div className="bg-background h-full p-8 md:p-10 flex flex-col justify-between min-h-[260px]">
                  <p className="font-display text-3xl text-accent leading-none mb-4">"</p>
                  <p className="text-white/75 text-base leading-relaxed flex-1">
                    {t.q}
                  </p>
                  <p className="mt-6 text-[10px] uppercase tracking-[0.25em] text-white/45 font-bold">
                    {t.a}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ====== CTA / Contact ====== */}
      <section id="contact" className="relative py-32 md:py-48 px-6 md:px-16 overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-30">
          <img src={heroImg} alt="" className="w-full h-full object-cover grayscale" loading="lazy" />
          <div className="absolute inset-0 bg-gradient-to-b from-background via-background/80 to-background" />
        </div>
        <div className="relative z-10 max-w-5xl mx-auto text-center">
          <Reveal>
            <span className="text-accent font-bold uppercase tracking-[0.3em] text-[10px] block mb-8">
              Booking
            </span>
            <h2 className="font-display text-5xl md:text-[10rem] leading-[0.85] uppercase mb-12">
              Ready to<br />
              <span className="text-accent italic glow-text">amplify?</span>
            </h2>
            <p className="text-white/65 max-w-xl mx-auto mb-12">
              Disponibilités limitées pour la saison 2024–2025. Parlons de votre
              événement.
            </p>
          </Reveal>
          <Reveal delay={150}>
            <div className="flex flex-wrap justify-center gap-4 mb-12">
              <a
                href="mailto:booking@leh.com"
                className="group relative px-10 py-5 bg-accent text-accent-foreground font-display text-base md:text-lg uppercase tracking-tighter hover:bg-white transition-colors"
              >
                Book Now
              </a>
              <a
                href="#"
                className="px-10 py-5 border border-white/20 text-white font-display text-base md:text-lg uppercase tracking-tighter hover:bg-white/5 transition-colors"
              >
                Portfolio PDF
              </a>
            </div>
            <div className="flex flex-wrap justify-center gap-8 text-[11px] uppercase tracking-[0.3em] text-white/60 font-bold">
              <a href="mailto:booking@leh.com" className="hover:text-accent transition-colors">
                booking@leh.com
              </a>
              <span className="text-white/20">/</span>
              <a href="tel:+33000000000" className="hover:text-accent transition-colors">
                +33 6 00 00 00 00
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ====== Footer ====== */}
      <footer className="border-t border-white/10 px-6 md:px-16 py-10 flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] uppercase tracking-[0.3em] text-white/40">
        <p>© 2024 LE H Performance. Tous droits réservés.</p>
        <div className="font-display text-2xl text-white tracking-tighter">
          LE H<span className="text-accent">.</span>
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
