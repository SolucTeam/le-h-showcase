import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export type Lang = "fr" | "en" | "es";

type Dict = Record<string, string>;

const dictionaries: Record<Lang, Dict> = {
  fr: {
    "nav.prestations": "Prestations",
    "nav.showreel": "Showreel",
    "nav.about": "À propos",
    "nav.contact": "Contact",
    "nav.booking": "Booking",
    "hero.status": "Booking 2024 — 2025",
    "hero.role": "Master of Ceremonies / Host",
    "hero.title1": "Master of",
    "hero.title2": "Energy",
    "hero.desc": "Host, MC & Crowd Catalyst. Je transforme les scènes en expériences partagées — par la voix, le rythme et la présence.",
    "hero.cta.showreel": "Watch Showreel",
    "hero.cta.book": "Réserver",
    "hero.scroll": "Scroll",
    "hero.location": "Paris — Worldwide",
    "prest.eyebrow": "Vibe Check",
    "prest.title": "Live Fragments",
    "prest.intro": "Trois terrains de jeu, une même obsession : transformer un public en une seule respiration.",
    "prest.1.tag": "Festivals",
    "prest.1.title": "Mainstage\nTakeovers",
    "prest.1.desc": "Maîtriser les grandes scènes, annoncer les artistes, tenir l'intensité de la foule.",
    "prest.2.tag": "Galas Corporate",
    "prest.2.title": "Gala &\nAward Nights",
    "prest.2.desc": "Une conduite de soirée élégante et rythmée, du cocktail jusqu'au bouquet final.",
    "prest.3.tag": "Clubs",
    "prest.3.title": "The\nCatalyst Set",
    "prest.3.desc": "Hype, transitions, freestyle au mic. Une connexion totale avec le dancefloor.",
    "show.eyebrow": "Showreel — 2024",
    "show.title1": "Voir, c'est",
    "show.title2": "entendre.",
    "show.live": "Live capture",
    "stats.events": "Événements",
    "stats.countries": "Pays",
    "stats.pax": "PAX cumulés",
    "stats.years": "Années",
    "marquee.1": "Clubs & Festivals",
    "marquee.2": "Galas Corporate",
    "marquee.3": "Lancements Produit",
    "marquee.4": "Cérémonies",
    "marquee.5": "After-shows",
    "marquee.6": "Plateaux TV",
    "about.eyebrow": "Profil — 001",
    "about.title1": "Une voix.",
    "about.title2": "Un public.",
    "about.title3": "Un moment.",
    "about.p1": "Depuis huit ans, LE H traverse les scènes — du club confidentiel au mainstage festival, du gala de prestige au lancement de marque. Sa marque de fabrique : lire une salle en trois secondes et la guider exactement où elle veut aller.",
    "about.p2": "Trilingue, méticuleux, prêt à tout. Du run-of-show au freestyle improvisé quand la musique l'exige.",
    "about.tag.1": "Trilingue FR/EN/ES",
    "about.tag.2": "Run-of-show",
    "about.tag.3": "Improvisation",
    "about.tag.4": "Coord. artistes",
    "about.tag.5": "Plateau TV",
    "testi.eyebrow": "Témoignages",
    "testi.title": "On dit de lui.",
    "testi.1.q": "Une énergie qui a soulevé toute la salle. Le timing, la voix, le charisme — parfait.",
    "testi.1.a": "Sophie L. — Corporate Gala 2023",
    "testi.2.q": "Sens du timing parfait. Il a capté 400 invités dès les premières secondes.",
    "testi.2.a": "Marc D. — LuxMedia",
    "testi.3.q": "L'énergie d'un festival concentrée dans une voix. On le rebooke en 2024.",
    "testi.3.a": "Kevin R. — Urban Fest",
    "cta.eyebrow": "Booking",
    "cta.title1": "Ready to",
    "cta.title2": "amplify?",
    "cta.desc": "Disponibilités limitées pour la saison 2024–2025. Parlons de votre événement.",
    "cta.book": "Book Now",
    "cta.pdf": "Portfolio PDF",
    "footer.rights": "© 2024 LE H Performance. Tous droits réservés.",
  },
  en: {
    "nav.prestations": "Services",
    "nav.showreel": "Showreel",
    "nav.about": "About",
    "nav.contact": "Contact",
    "nav.booking": "Booking",
    "hero.status": "Booking 2024 — 2025",
    "hero.role": "Master of Ceremonies / Host",
    "hero.title1": "Master of",
    "hero.title2": "Energy",
    "hero.desc": "Host, MC & Crowd Catalyst. I turn stages into shared experiences — through voice, rhythm and presence.",
    "hero.cta.showreel": "Watch Showreel",
    "hero.cta.book": "Book Now",
    "hero.scroll": "Scroll",
    "hero.location": "Paris — Worldwide",
    "prest.eyebrow": "Vibe Check",
    "prest.title": "Live Fragments",
    "prest.intro": "Three playgrounds, one obsession: turning a crowd into a single breath.",
    "prest.1.tag": "Festivals",
    "prest.1.title": "Mainstage\nTakeovers",
    "prest.1.desc": "Owning the big stages, announcing artists, holding the crowd's intensity.",
    "prest.2.tag": "Corporate Galas",
    "prest.2.title": "Gala &\nAward Nights",
    "prest.2.desc": "Elegant, tightly-paced hosting from cocktail hour to the final act.",
    "prest.3.tag": "Clubs",
    "prest.3.title": "The\nCatalyst Set",
    "prest.3.desc": "Hype, transitions, mic freestyle. Total connection with the dancefloor.",
    "show.eyebrow": "Showreel — 2024",
    "show.title1": "To see is",
    "show.title2": "to hear.",
    "show.live": "Live capture",
    "stats.events": "Events",
    "stats.countries": "Countries",
    "stats.pax": "Attendees",
    "stats.years": "Years",
    "marquee.1": "Clubs & Festivals",
    "marquee.2": "Corporate Galas",
    "marquee.3": "Product Launches",
    "marquee.4": "Ceremonies",
    "marquee.5": "After-shows",
    "marquee.6": "TV Sets",
    "about.eyebrow": "Profile — 001",
    "about.title1": "One voice.",
    "about.title2": "One crowd.",
    "about.title3": "One moment.",
    "about.p1": "For eight years LE H has walked every kind of stage — from underground clubs to festival mainstages, from prestige galas to brand launches. His signature: reading a room in three seconds and taking it exactly where it wants to go.",
    "about.p2": "Trilingual, meticulous, all-in. From run-of-show precision to on-the-spot freestyle when the music demands it.",
    "about.tag.1": "Trilingual FR/EN/ES",
    "about.tag.2": "Run-of-show",
    "about.tag.3": "Improvisation",
    "about.tag.4": "Artist coordination",
    "about.tag.5": "TV hosting",
    "testi.eyebrow": "Testimonials",
    "testi.title": "What they say.",
    "testi.1.q": "An energy that lifted the entire room. Timing, voice, charisma — perfect.",
    "testi.1.a": "Sophie L. — Corporate Gala 2023",
    "testi.2.q": "Impeccable timing. He locked in 400 guests in the first seconds.",
    "testi.2.a": "Marc D. — LuxMedia",
    "testi.3.q": "The energy of a festival packed into one voice. Rebooking in 2024.",
    "testi.3.a": "Kevin R. — Urban Fest",
    "cta.eyebrow": "Booking",
    "cta.title1": "Ready to",
    "cta.title2": "amplify?",
    "cta.desc": "Limited availability for the 2024–2025 season. Let's talk about your event.",
    "cta.book": "Book Now",
    "cta.pdf": "Portfolio PDF",
    "footer.rights": "© 2024 LE H Performance. All rights reserved.",
  },
  es: {
    "nav.prestations": "Servicios",
    "nav.showreel": "Showreel",
    "nav.about": "Sobre mí",
    "nav.contact": "Contacto",
    "nav.booking": "Reservas",
    "hero.status": "Reservas 2024 — 2025",
    "hero.role": "Maestro de Ceremonias / Host",
    "hero.title1": "Master of",
    "hero.title2": "Energy",
    "hero.desc": "Host, MC & Catalizador de Público. Transformo los escenarios en experiencias compartidas — con voz, ritmo y presencia.",
    "hero.cta.showreel": "Ver Showreel",
    "hero.cta.book": "Reservar",
    "hero.scroll": "Scroll",
    "hero.location": "París — Mundo",
    "prest.eyebrow": "Vibe Check",
    "prest.title": "Live Fragments",
    "prest.intro": "Tres terrenos de juego, una misma obsesión: convertir al público en una sola respiración.",
    "prest.1.tag": "Festivales",
    "prest.1.title": "Mainstage\nTakeovers",
    "prest.1.desc": "Dominar los grandes escenarios, presentar artistas, sostener la intensidad del público.",
    "prest.2.tag": "Galas Corporativas",
    "prest.2.title": "Gala &\nAward Nights",
    "prest.2.desc": "Conducción elegante y ritmada, desde el cóctel hasta el cierre.",
    "prest.3.tag": "Clubs",
    "prest.3.title": "The\nCatalyst Set",
    "prest.3.desc": "Hype, transiciones, freestyle al micro. Conexión total con la pista.",
    "show.eyebrow": "Showreel — 2024",
    "show.title1": "Ver es",
    "show.title2": "escuchar.",
    "show.live": "Captura en vivo",
    "stats.events": "Eventos",
    "stats.countries": "Países",
    "stats.pax": "Asistentes",
    "stats.years": "Años",
    "marquee.1": "Clubs & Festivales",
    "marquee.2": "Galas Corporativas",
    "marquee.3": "Lanzamientos",
    "marquee.4": "Ceremonias",
    "marquee.5": "After-shows",
    "marquee.6": "Programas TV",
    "about.eyebrow": "Perfil — 001",
    "about.title1": "Una voz.",
    "about.title2": "Un público.",
    "about.title3": "Un momento.",
    "about.p1": "Desde hace ocho años, LE H recorre los escenarios — del club íntimo al mainstage de festival, de la gala de prestigio al lanzamiento de marca. Su sello: leer una sala en tres segundos y llevarla exactamente donde quiere ir.",
    "about.p2": "Trilingüe, meticuloso, listo para todo. Del run-of-show al freestyle improvisado cuando la música lo pide.",
    "about.tag.1": "Trilingüe FR/EN/ES",
    "about.tag.2": "Run-of-show",
    "about.tag.3": "Improvisación",
    "about.tag.4": "Coord. artistas",
    "about.tag.5": "Presentación TV",
    "testi.eyebrow": "Testimonios",
    "testi.title": "Lo que dicen.",
    "testi.1.q": "Una energía que levantó toda la sala. Timing, voz, carisma — perfecto.",
    "testi.1.a": "Sophie L. — Gala Corporativa 2023",
    "testi.2.q": "Timing impecable. Enganchó a 400 invitados en los primeros segundos.",
    "testi.2.a": "Marc D. — LuxMedia",
    "testi.3.q": "La energía de un festival concentrada en una voz. Repetimos en 2024.",
    "testi.3.a": "Kevin R. — Urban Fest",
    "cta.eyebrow": "Reservas",
    "cta.title1": "Ready to",
    "cta.title2": "amplify?",
    "cta.desc": "Disponibilidad limitada para la temporada 2024–2025. Hablemos de tu evento.",
    "cta.book": "Reservar",
    "cta.pdf": "Portfolio PDF",
    "footer.rights": "© 2024 LE H Performance. Todos los derechos reservados.",
  },
};

type Ctx = { lang: Lang; setLang: (l: Lang) => void; t: (key: string) => string };
const LangContext = createContext<Ctx | null>(null);

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("fr");
  useEffect(() => {
    try {
      const saved = localStorage.getItem("leh_lang") as Lang | null;
      if (saved && ["fr", "en", "es"].includes(saved)) setLangState(saved);
    } catch {}
  }, []);
  const setLang = (l: Lang) => {
    setLangState(l);
    try { localStorage.setItem("leh_lang", l); } catch {}
    if (typeof document !== "undefined") document.documentElement.lang = l;
  };
  const value = useMemo<Ctx>(() => ({
    lang,
    setLang,
    t: (key: string) => dictionaries[lang][key] ?? dictionaries.fr[key] ?? key,
  }), [lang]);
  return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error("useI18n must be used within LangProvider");
  return ctx;
}

export function LangSwitcher({ className = "" }: { className?: string }) {
  const { lang, setLang } = useI18n();
  const langs: Lang[] = ["fr", "en", "es"];
  return (
    <div className={`inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-[0.2em] ${className}`}>
      {langs.map((l, i) => (
        <span key={l} className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setLang(l)}
            className={`px-1.5 py-1 transition-colors cursor-pointer ${
              lang === l ? "text-accent" : "text-white/50 hover:text-white"
            }`}
            aria-label={`Switch language to ${l.toUpperCase()}`}
            aria-pressed={lang === l}
          >
            {l.toUpperCase()}
          </button>
          {i < langs.length - 1 && <span className="text-white/20">/</span>}
        </span>
      ))}
    </div>
  );
}
