import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
// Local bundled assets — no dependency on Lovable's remote asset proxy, so
// images and video load identically in local dev and in any deployment.
import heroImg from "@/assets/hero.webp";
import heroOgImg from "@/assets/hero.jpg"; // JPEG kept for social/OG previews
import festivalImg from "@/assets/perf-festival.webp";
import galaImg from "@/assets/perf-gala.webp";
import clubImg from "@/assets/perf-club.webp";
import portraitImg from "@/assets/portrait.webp";
import heroVideoUrl from "@/assets/hero-video.mp4";
import reelFestivalUrl from "@/assets/reel-festival.mp4";
import reelGalaUrl from "@/assets/reel-gala.mp4";
import reelClubUrl from "@/assets/reel-club.mp4";
import reelFestivalMobileUrl from "@/assets/reel-festival-m.mp4";
import reelGalaMobileUrl from "@/assets/reel-gala-m.mp4";
import reelClubMobileUrl from "@/assets/reel-club-m.mp4";
import { Hero3D } from "@/components/Hero3D";
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
        content: "Host, MC & Crowd Catalyst. Voice. Rhythm. Presence. Booking 2026–2027.",
      },
      { property: "og:image", content: heroOgImg },
      { property: "og:image:alt", content: "LE H — MC sur scène avec micro, lumières lasers" },
      { property: "og:url", content: "/" },
      { name: "twitter:title", content: "LE H — Master of Ceremonies & Host" },
      { name: "twitter:description", content: "Host, MC & Crowd Catalyst. Booking 2026–2027." },
      { name: "twitter:image", content: heroOgImg },
    ],
    links: [
      { rel: "canonical", href: "/" },
      { rel: "alternate", hreflang: "x-default", href: "/" },
      { rel: "alternate", hreflang: "fr", href: "/?lang=fr" },
      { rel: "alternate", hreflang: "en", href: "/?lang=en" },
      { rel: "alternate", hreflang: "es", href: "/?lang=es" },
    ],
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
          image: heroOgImg,
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

// Respect the OS "reduce motion" setting across all animated pieces.
function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const m = window.matchMedia("(prefers-reduced-motion: reduce)");
    const on = () => setReduced(m.matches);
    on();
    m.addEventListener?.("change", on);
    return () => m.removeEventListener?.("change", on);
  }, []);
  return reduced;
}

// True on phone-sized viewports (used to lighten the page there).
function useIsMobile() {
  const [mobile, setMobile] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(max-width: 768px)").matches,
  );
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 768px)");
    const on = () => setMobile(mq.matches);
    on();
    mq.addEventListener?.("change", on);
    return () => mq.removeEventListener?.("change", on);
  }, []);
  return mobile;
}

// Pointer-driven 3D tilt with real perspective. Children can lift themselves in
// depth with the `depth-layer` utility (translateZ). Disabled on touch / reduced-motion.
function Tilt3D({
  children,
  className = "",
  max = 9,
}: {
  children: React.ReactNode;
  className?: string;
  max?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  useEffect(() => {
    const el = ref.current;
    if (!el || reduced) return;
    if (window.matchMedia("(hover: none)").matches) return; // skip on touch
    let raf = 0;
    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width;
      const py = (e.clientY - r.top) / r.height;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        el.style.setProperty("--rx", `${((0.5 - py) * max).toFixed(2)}deg`);
        el.style.setProperty("--ry", `${((px - 0.5) * max).toFixed(2)}deg`);
        el.style.setProperty("--gx", `${(px * 100).toFixed(1)}%`);
        el.style.setProperty("--gy", `${(py * 100).toFixed(1)}%`);
      });
    };
    const onLeave = () => {
      cancelAnimationFrame(raf);
      el.style.setProperty("--rx", "0deg");
      el.style.setProperty("--ry", "0deg");
    };
    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
      cancelAnimationFrame(raf);
    };
  }, [reduced, max]);
  return (
    <div ref={ref} className={`tilt3d ${className}`}>
      {children}
    </div>
  );
}

// Thin accent bar that tracks reading progress down the page.
function ScrollProgress() {
  const [p, setP] = useState(0);
  useEffect(() => {
    const on = () => {
      const el = document.documentElement;
      const max = el.scrollHeight - el.clientHeight;
      setP(max > 0 ? el.scrollTop / max : 0);
    };
    on();
    window.addEventListener("scroll", on, { passive: true });
    window.addEventListener("resize", on);
    return () => {
      window.removeEventListener("scroll", on);
      window.removeEventListener("resize", on);
    };
  }, []);
  return (
    <div
      className="fixed top-0 left-0 z-[60] h-0.5 bg-accent glow-accent"
      style={{ width: `${(p * 100).toFixed(2)}%` }}
      aria-hidden="true"
    />
  );
}

// Navbar dims when scrolling down, restores at the top / on scroll-up / on hover.
function useNavDim() {
  const [dim, setDim] = useState(false);
  useEffect(() => {
    let last = window.scrollY;
    let raf = 0;
    const on = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const y = window.scrollY;
        if (y < 80) setDim(false);
        else if (y > last + 4) setDim(true);
        else if (y < last - 4) setDim(false);
        last = y;
      });
    };
    window.addEventListener("scroll", on, { passive: true });
    return () => {
      window.removeEventListener("scroll", on);
      cancelAnimationFrame(raf);
    };
  }, []);
  return dim;
}

// Vertical parallax + fade driven by scroll position (no re-render, reduced-motion safe).
function useParallax<T extends HTMLElement>(factor = 0.16) {
  const ref = useRef<T | null>(null);
  const reduced = useReducedMotion();
  useEffect(() => {
    const el = ref.current;
    if (!el || reduced) return;
    let raf = 0;
    const on = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const y = window.scrollY;
        el.style.transform = `translate3d(0, ${(y * factor).toFixed(1)}px, 0)`;
        el.style.opacity = String(Math.max(0, 1 - y / 620));
      });
    };
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => {
      window.removeEventListener("scroll", on);
      cancelAnimationFrame(raf);
    };
  }, [factor, reduced]);
  return ref;
}

// Fires once when the element scrolls into view.
function useInView<T extends HTMLElement>(threshold = 0.4) {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { threshold },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);
  return { ref, inView };
}

// Animated number that counts up from 0 the first time it appears.
// Handles strings like "300+", "50K", "12", "08" (keeps prefix/suffix + zero-pad).
function CountUp({ value, duration = 1400 }: { value: string; duration?: number }) {
  const { ref, inView } = useInView<HTMLSpanElement>(0.5);
  const [display, setDisplay] = useState(value);
  const reduced = useReducedMotion();

  useEffect(() => {
    const m = value.match(/^(\D*)(\d+)(.*)$/);
    if (!m) {
      setDisplay(value);
      return;
    }
    const prefix = m[1];
    const numStr = m[2];
    const suffix = m[3];
    const target = parseInt(numStr, 10);
    const pad = numStr.startsWith("0") ? numStr.length : 0;
    const fmtNum = (n: number) => String(n).padStart(pad, "0");

    if (!inView || reduced) {
      setDisplay(reduced ? value : `${prefix}${fmtNum(0)}${suffix}`);
      if (reduced) return;
    }
    if (!inView) return;

    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay(`${prefix}${fmtNum(Math.round(eased * target))}${suffix}`);
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, value, duration, reduced]);

  return <span ref={ref}>{display}</span>;
}

// Button/link that is subtly pulled toward the cursor (magnetic effect).
function Magnetic({
  children,
  className = "",
  strength = 0.35,
}: {
  children: React.ReactNode;
  className?: string;
  strength?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduced = useReducedMotion();
  useEffect(() => {
    const el = ref.current;
    if (!el || reduced) return;
    if (window.matchMedia("(hover: none)").matches) return;
    let raf = 0;
    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - (r.left + r.width / 2)) * strength;
      const y = (e.clientY - (r.top + r.height / 2)) * strength;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        el.style.transform = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px)`;
      });
    };
    const onLeave = () => {
      cancelAnimationFrame(raf);
      el.style.transform = "translate(0px, 0px)";
    };
    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
      cancelAnimationFrame(raf);
    };
  }, [reduced, strength]);
  return (
    <span ref={ref} className={`inline-block will-change-transform transition-transform duration-300 ${className}`}>
      {children}
    </span>
  );
}

// One vertical reel tile. Playback is driven by the parent ReelGrid: only the
// "active" tile plays; when its video ends the parent hands off to the next tile.
// Tap the video (or the speaker) to toggle sound for the whole relay.
function ReelCard({
  src,
  tag,
  n,
  active,
  muted,
  preload,
  onEnded,
  onToggleMute,
}: {
  src: string;
  tag: string;
  n: string;
  active: boolean;
  muted: boolean;
  preload: "auto" | "metadata" | "none";
  onEnded: () => void;
  onToggleMute: () => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [progress, setProgress] = useState(0);

  // Play / restart when this tile becomes active; pause + rewind otherwise.
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (active) {
      try {
        v.currentTime = 0;
      } catch {
        /* ignore */
      }
      v.play().catch(() => {});
    } else {
      v.pause();
      try {
        v.currentTime = 0;
      } catch {
        /* ignore */
      }
      setProgress(0);
    }
  }, [active]);

  useEffect(() => {
    const v = videoRef.current;
    if (v) v.muted = muted;
  }, [muted]);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const onTime = () => setProgress(v.duration ? v.currentTime / v.duration : 0);
    const onEnd = () => onEnded();
    v.addEventListener("timeupdate", onTime);
    v.addEventListener("ended", onEnd);
    return () => {
      v.removeEventListener("timeupdate", onTime);
      v.removeEventListener("ended", onEnd);
    };
  }, [onEnded]);

  return (
    <Tilt3D max={10}>
      <div
        className={`group relative overflow-hidden bg-surface border transition-all duration-500 ${
          active ? "border-accent glow-accent" : "border-white/10"
        }`}
      >
        <div className="relative aspect-[9/16] w-full overflow-hidden">
          <video
            ref={videoRef}
            src={src}
            playsInline
            preload={preload}
            onClick={onToggleMute}
            className={`w-full h-full object-cover cursor-pointer scale-105 transition-all duration-700 ${
              active ? "grayscale-0" : "grayscale opacity-60 group-hover:opacity-90"
            }`}
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background via-background/25 to-transparent" />
          <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-t from-accent/25 via-transparent to-transparent mix-blend-overlay" />
          <span className="pointer-events-none absolute top-4 left-4 size-3 border-t border-l border-accent" />
          <span className="pointer-events-none absolute top-4 right-4 size-3 border-t border-r border-accent opacity-60" />
          <span className="pointer-events-none absolute top-4 right-4 text-[10px] text-accent font-mono pr-5">{n}</span>

          {/* Now-playing / paused pill */}
          <span className="pointer-events-none absolute top-4 left-9 flex items-center gap-1.5 text-[9px] uppercase tracking-[0.25em] text-white/70">
            <span className={`size-1.5 rounded-full bg-accent ${active ? "animate-pulse-dot" : "opacity-40"}`} />
            {active ? "On Air" : "Reel"}
          </span>

          {/* Mute / unmute */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleMute();
            }}
            aria-label={muted ? "Activer le son" : "Couper le son"}
            className="absolute bottom-5 right-4 z-10 size-10 rounded-full bg-black/50 backdrop-blur border border-white/20 text-white flex items-center justify-center hover:bg-accent hover:text-accent-foreground hover:border-accent transition-colors"
          >
            {muted ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M16.5 12A4.5 4.5 0 0014 8.05v2.13l2.45 2.45c.03-.21.05-.42.05-.63zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.17v2.06a8.99 8.99 0 003.69-1.81L19.73 21 21 19.73 4.27 3zM12 4L9.91 6.09 12 8.18V4z"/></svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3A4.5 4.5 0 0014 8.05v7.9A4.5 4.5 0 0016.5 12zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/></svg>
            )}
          </button>

          {/* Playback progress (active tile only) */}
          <div className="pointer-events-none absolute bottom-0 inset-x-0 h-1 bg-white/10">
            <div className="h-full bg-accent transition-[width] duration-150" style={{ width: `${(active ? progress : 0) * 100}%` }} />
          </div>
        </div>

        <div className="pointer-events-none absolute inset-x-0 bottom-0 p-6 pb-4 depth-layer">
          <span className="text-accent text-[10px] font-bold uppercase tracking-[0.3em] mb-2 block">{tag}</span>
          <h3 className="font-display text-xl md:text-2xl uppercase leading-none">Live Cut</h3>
        </div>
      </div>
    </Tilt3D>
  );
}

// Coordinates the reel relay: one tile plays at a time, and each `ended` event
// advances to the next tile, looping. Only runs while the grid is on-screen.
function ReelGrid({ reels }: { reels: { n: string; src: string; srcMobile?: string; tag: string }[] }) {
  const [active, setActive] = useState(0);
  const [muted, setMuted] = useState(true);
  const [inView, setInView] = useState(false);
  // Resolved synchronously so phones never begin fetching the heavy desktop clip.
  const [mobile] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(max-width: 768px)").matches,
  );
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.25 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const advance = () => setActive((i) => (i + 1) % reels.length);
  const toggleMute = () => setMuted((m) => !m);

  return (
    <div ref={wrapRef} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {reels.map((r, i) => (
        <Reveal key={r.n} delay={i * 120}>
          <ReelCard
            src={mobile && r.srcMobile ? r.srcMobile : r.src}
            tag={r.tag}
            n={r.n}
            active={i === active && inView}
            muted={muted}
            preload={i === active ? "auto" : "none"}
            onEnded={advance}
            onToggleMute={toggleMute}
          />
        </Reveal>
      ))}
    </div>
  );
}

function Index() {
  const { t } = useI18n();
  const spotRef = useSpotlight<HTMLDivElement>();
  const navDim = useNavDim();
  const isMobile = useIsMobile();
  const heroTitleRef = useParallax<HTMLHeadingElement>(0.18);

  const PRESTATIONS = [
    { n: "01", tag: t("prest.1.tag"), title: t("prest.1.title"), desc: t("prest.1.desc"), img: festivalImg, offset: "" },
    { n: "02", tag: t("prest.2.tag"), title: t("prest.2.title"), desc: t("prest.2.desc"), img: galaImg, offset: "md:mt-24" },
    { n: "03", tag: t("prest.3.tag"), title: t("prest.3.title"), desc: t("prest.3.desc"), img: clubImg, offset: "" },
  ];

  const REELS = [
    { n: "01", src: reelFestivalUrl, srcMobile: reelFestivalMobileUrl, tag: "Fête de la Musique" },
    { n: "02", src: reelGalaUrl, srcMobile: reelGalaMobileUrl, tag: "Amapiano" },
    { n: "03", src: reelClubUrl, srcMobile: reelClubMobileUrl, tag: "Club · Paris" },
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
      <ScrollProgress />
      {/* ====== Navigation ====== */}
      <nav
        className={`fixed top-0 inset-x-0 z-50 flex justify-between items-center px-6 md:px-12 py-6 mix-blend-difference transition-all duration-500 ${
          navDim ? "opacity-25 -translate-y-1 hover:opacity-100 hover:translate-y-0" : "opacity-100 translate-y-0"
        }`}
      >
        <a href="#" className="font-display text-xl tracking-tighter text-white">
          LE H<span className="text-accent animate-flicker">.</span>
        </a>
        <div className="hidden md:flex gap-8 text-[11px] font-bold uppercase tracking-[0.2em] text-white absolute left-1/2 -translate-x-1/2">
          <a href="#prestations" className="nav-link hover:text-accent transition-colors">{t("nav.prestations")}</a>
          <a href="#showreel" className="nav-link hover:text-accent transition-colors">{t("nav.showreel")}</a>
          <a href="#about" className="nav-link hover:text-accent transition-colors">{t("nav.about")}</a>
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
            src={heroVideoUrl}
            poster={heroImg}
            autoPlay={!isMobile}
            muted
            loop
            playsInline
            preload={isMobile ? "none" : "metadata"}
            tabIndex={-1}
            className="w-full h-full object-cover opacity-55 animate-drift"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-background/30" />
          <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-transparent to-background/40" />
        </div>

        {/* 3D WebGL layer (Three.js) — glows over the video via screen blend */}
        <Hero3D className="pointer-events-none absolute inset-0 z-[2] mix-blend-screen opacity-90" />

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
                <textPath href="#circ">LE H • LIVE • BOOKING • 2026 • </textPath>
              </text>
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-accent text-xl">✦</span>
          </div>
        </div>

        <div className="relative z-10 max-w-6xl animate-fade-up">
          <p className="text-[11px] uppercase tracking-[0.3em] text-accent font-bold mb-6">
            {t("hero.role")}
          </p>
          <h1
            ref={heroTitleRef}
            className="font-display text-[18vw] md:text-[12vw] leading-[0.85] tracking-tighter uppercase will-change-transform"
          >
            <span className="glitch" data-text={t("hero.title1")}>{t("hero.title1")}</span>
            <br />
            <span className="shimmer-text italic animate-glow">{t("hero.title2")}</span>
          </h1>

          <div className="mt-10 flex flex-col md:flex-row md:items-end justify-between gap-8">
            <p className="max-w-md text-white/70 text-base md:text-lg leading-relaxed">
              {t("hero.desc")}
            </p>
            <div className="flex flex-wrap gap-4">
              <Magnetic>
                <a href="#showreel" className="group relative cursor-pointer block">
                  <div className="absolute -inset-1 bg-accent opacity-30 group-hover:opacity-70 blur-md transition-opacity animate-pulse-dot" />
                  <div className="relative px-8 py-4 bg-background border border-accent/60 text-accent font-bold uppercase tracking-[0.2em] text-xs flex items-center gap-3">
                    <span className="size-2 rounded-full bg-accent animate-pulse-dot" />
                    {t("hero.cta.showreel")}
                  </div>
                </a>
              </Magnetic>
              <Magnetic>
                <a
                  href={`mailto:${BOOKING_EMAIL}`}
                  className="block px-8 py-4 border border-white/15 text-white font-bold uppercase tracking-[0.2em] text-xs hover:bg-accent hover:text-accent-foreground hover:border-accent transition-colors"
                >
                  {t("hero.cta.book")}
                </a>
              </Magnetic>
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
      <div className="border-y border-white/10 py-6 overflow-hidden bg-background marquee-mask">
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
                <Tilt3D max={10} className={p.offset}>
                <div className="group relative overflow-hidden bg-surface">
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
                  <div className="absolute inset-x-0 bottom-0 p-6 md:p-8 depth-layer">
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
                </Tilt3D>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

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
            <Tilt3D max={8}>
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
            </Tilt3D>
          </Reveal>
        </div>
      </section>

      {/* ====== Showreel ====== */}
      <section id="showreel" className="relative py-24 md:py-32 overflow-hidden">
        <div className="aurora-bg" aria-hidden="true" style={{ opacity: 0.25 }} />
        <Hero3D variant="wave" className="pointer-events-none absolute inset-0 z-0 mix-blend-screen opacity-60" />
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

          <ReelGrid reels={REELS} />

          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 border-y border-white/10 divide-x divide-white/10">
            {STATS.map((s, i) => (
              <Reveal key={s.l} delay={i * 80}>
                <div className="px-6 py-8 md:py-10 group">
                  <div className="font-display text-4xl md:text-6xl text-accent glow-text group-hover:animate-glow">
                    <CountUp value={s.v} />
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
      <div className="border-y border-white/10 py-5 overflow-hidden bg-surface/40 marquee-mask">
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
        <Hero3D variant="rings" className="pointer-events-none absolute inset-0 z-[1] mix-blend-screen opacity-70" />
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
              <Magnetic strength={0.45}>
                <a
                  href={`mailto:${BOOKING_EMAIL}`}
                  className="group relative block px-10 py-5 bg-accent text-accent-foreground font-display text-base md:text-lg uppercase tracking-tighter hover:bg-white transition-colors"
                >
                  <span className="absolute -inset-1 bg-accent opacity-40 blur-lg group-hover:opacity-80 transition-opacity" aria-hidden="true" />
                  <span className="relative">{t("cta.book")}</span>
                </a>
              </Magnetic>
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
