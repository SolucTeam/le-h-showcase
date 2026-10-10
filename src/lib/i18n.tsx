import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { resolveLanguage } from "@/lib/seo";

export type Lang = "fr" | "en" | "es";

type Dict = Record<string, string>;

const dictionaries: Record<Lang, Dict> = {
  fr: {
    "nav.prestations": "Prestations",
    "nav.showreel": "Showreel",
    "nav.about": "À propos",
    "nav.contact": "Contact",
    "nav.booking": "Booking",
    "hero.status": "Booking 2026 — 2027",
    "hero.role": "Master of Ceremonies / Host",
    "hero.title1": "Voix.",
    "hero.title2": "Rythme.",
    "hero.title3": "Presence.",
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
    "prest.2.title": "Concert &\nLive",
    "prest.2.desc": "Une conduite de soirée élégante et rythmée, du cocktail jusqu'au bouquet final.",
    "prest.3.tag": "Clubs",
    "prest.3.title": "The\nCatalyst Set",
    "prest.3.desc": "Hype, transitions, freestyle au mic. Une connexion totale avec le dancefloor.",
    "show.eyebrow": "Showreel — 2026",
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
    "marquee.6": "Day parties & Brunchs",
    "about.eyebrow": "Profil — 001",
    "about.title": "LE H, L'HOMME QUI DONNE L'ÉNERGIE",
    "about.intro": "Le H est né d'un aller-retour permanent entre deux mondes : la Côte d'Ivoire pour le sang et l'instinct, Paris pour le terrain de jeu et l'exigence. D'Abidjan, il tient une certaine idée de la fête — celle où l'on ne danse pas devant les gens mais avec eux. De Paris, il tient la vitesse et la confrontation quotidienne avec toutes les scènes d'Europe.\n\nDe ce croisement est né un métier qui n'a pas vraiment de nom. Ni seulement MC, ni seulement danseur, ni seulement animateur : Le H est ce qu'on appelait, dans la grande tradition du spectacle, un SHOWMAN — quelqu'un dont la seule présence transforme un lieu, et dont on parle encore le lendemain matin.",
    "about.vibe.title": "THE VIBES GIVER",
    "about.vibe.p1": "Le surnom ne sort pas d'une réunion marketing. Il vient du public. Parce que c'est exactement ce que fait Le H : il donne. Il arrive avec une énergie brute, immédiate, et il la distribue jusqu'à ce que la salle la lui renvoie. Il lit une foule en quelques secondes et sait précisément quand pousser, quand faire monter, quand laisser respirer un drop, quand descendre dans la fosse.\n\nC'est là que le danseur reprend le dessus sur le MC. Il ne se contente pas de parler dans un micro : il bouge, il occupe l'espace, il danse avec le public. Il ne remplit pas les silences — il installe une atmosphère. Ceux qui l'ont vu travailler parlent d'une AURA : cette capacité rare à faire basculer une salle entière dans son univers, et à y faire régner une bonne énergie qui tient toute la nuit.",
    "about.vibe.quote": "Là où beaucoup de hosts commentent la soirée, lui la fabrique.",
    "about.versatility.title": "LA VERSATILITÉ COMME SIGNATURE",
    "about.versatility.p1": "C'est peut-être son atout le plus précieux pour un programmateur : Le H s'adapte à tout. Un set amapiano sur la Piano People Stage d'Afro Nation, festival qui réunit plus de 50 000 personnes. WECANDANCE, festival électro belge, où le public ne vient pas chercher de l'afro. Une première partie de concert, de l'Accor Arena au Ziggo Dome. Un brunch afrobeats un dimanche midi à Barcelone. Une day party à Abidjan. Un événement sponsorisé par JD Sports ou Salomon. Chaque contexte a ses règles : il les connaît toutes.",
    "about.versatility.p2": "Il anime en français, en anglais et en espagnol. Ce n'est pas une ligne décorative sur un CV : c'est ce qui lui permet de tenir une scène à Amsterdam, à Madrid, à Oslo et à Abidjan avec la même intensité. Sur les événements internationaux, il devient le lien vivant entre un line-up mondial et un public local.\n\nEn deux ans et plus de 200 dates, Le H est passé du statut de nouvelle tête à celui de valeur sûre de la scène afro européenne. Un festival, un club, une première partie, une marque.",
    "about.conclusion": "Donnez-lui un micro et une foule. Le reste, il s'en occupe.",
    "about.tag.1": "Trilingue FR/EN/ES",
    "about.tag.2": "Énergie du public",
    "about.tag.3": "Improvisation",
    "about.tag.4": "Danse & présence scénique",
    "about.tag.5": "Complicité avec le DJ",
    "docs.press": "Dossier presse",
    "docs.contract": "Contrat de booking",
    "docs.press.info": "PDF · Français",
    "docs.contract.info": "PDF · FR/EN · Hors Île-de-France",
    "docs.download": "Télécharger",
    "testi.eyebrow": "Témoignages",
    "testi.title": "On dit de lui.",
    "testi.1.q": "Une énergie qui a soulevé toute la salle. Le timing, la voix, le charisme — parfait.",
    "testi.1.a": "Sophie L. — Corporate Gala 2023",
    "testi.2.q": "Sens du timing parfait. Il a capté 400 invités dès les premières secondes.",
    "testi.2.a": "Marc D. — LuxMedia",
    "testi.3.q": "L'énergie d'un festival concentrée dans une voix. On le rebooke en 2026.",
    "testi.3.a": "Kevin R. — Urban Fest",
    "cta.eyebrow": "Booking",
    "cta.title": "Prêt à mettre le feu ?",
    "cta.desc": "Disponibilités limitées pour la saison 2026–2027. Parlons de votre événement.",
    "cta.book": "Book Now",
    "cta.pdf": "Portfolio PDF",
    "pg.gallery": "Galerie",
    "pg.videos": "Vidéos",
    "pg.back": "Retour",
    "pg.1.body": "Mainstages, scènes urbaines et open airs : annonces artistes, transitions, gestion du timing plateau et montée d'énergie continue avec le public.",
    "pg.2.body": "Concerts et lives : présentation d'artistes, chauffe de salle, interludes et liaison permanente entre la scène, la régie et le public.",
    "pg.3.body": "Clubs et after-shows : hype au micro, freestyle, interaction directe avec le dancefloor et complicité totale avec le DJ.",
    "footer.rights": "© 2026 LE H Performance. Tous droits réservés.",
  },
  en: {
    "nav.prestations": "Services",
    "nav.showreel": "Showreel",
    "nav.about": "About",
    "nav.contact": "Contact",
    "nav.booking": "Booking",
    "hero.status": "Booking 2026 — 2027",
    "hero.role": "Master of Ceremonies / Host",
    "hero.title1": "Voice.",
    "hero.title2": "Rhythm.",
    "hero.title3": "Presence.",
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
    "prest.2.title": "Concert &\nLive",
    "prest.2.desc": "Elegant, tightly-paced hosting from cocktail hour to the final act.",
    "prest.3.tag": "Clubs",
    "prest.3.title": "The\nCatalyst Set",
    "prest.3.desc": "Hype, transitions, mic freestyle. Total connection with the dancefloor.",
    "show.eyebrow": "Showreel — 2026",
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
    "marquee.6": "Day parties & Brunches",
    "about.eyebrow": "Profile — 001",
    "about.title": "LE H, THE MAN WHO BRINGS THE ENERGY",
    "about.intro": "LE H was born from a constant back-and-forth between two worlds: Côte d'Ivoire for blood and instinct, Paris for the playing field and the demand. From Abidjan, he carries a certain idea of celebration — the one where you don't dance in front of people, but with them. From Paris, he carries the speed and daily confrontation with every stage in Europe.\n\nFrom this crossroads came a job that doesn't really have a name. Not just MC, not just dancer, not just host: LE H is what was called, in the grand tradition of show business, a SHOWMAN — someone whose mere presence transforms a place, and who people still talk about the next morning.",
    "about.vibe.title": "THE VIBES GIVER",
    "about.vibe.p1": "The nickname doesn't come from a marketing meeting. It comes from the crowd. Because that's exactly what LE H does: he gives. He arrives with raw, immediate energy, and he distributes it until the room gives it back. He reads a crowd in seconds and knows precisely when to push, when to build, when to let a drop breathe, when to get down into the pit.\n\nThat's where the dancer takes over from the MC. He doesn't just talk into a mic: he moves, he owns the space, he dances with the crowd. He doesn't fill the silences — he creates an atmosphere. Those who've seen him work talk about an AURA: that rare ability to bring an entire room into his universe, and to make good energy reign there all night long.",
    "about.vibe.quote": "Where many hosts comment on the night, he builds it.",
    "about.versatility.title": "VERSATILITY AS A SIGNATURE",
    "about.versatility.p1": "It's perhaps his most valuable asset for a programmer: LE H adapts to everything. An amapiano set on the Piano People Stage at Afro Nation, a festival that brings together over 50,000 people. WECANDANCE, the Belgian electro festival, where the crowd isn't looking for afro. An opening act for a concert, from Accor Arena to Ziggo Dome. An afrobeats brunch on a Sunday noon in Barcelona. A day party in Abidjan. An event sponsored by JD Sports or Salomon. Every context has its rules: he knows them all.",
    "about.versatility.p2": "He hosts in French, English and Spanish. It's not a decorative line on a CV: it's what allows him to hold a stage in Amsterdam, Madrid, Oslo and Abidjan with the same intensity. At international events, he becomes the living link between a global line-up and a local crowd.\n\nIn two years and more than 200 dates, LE H has moved from up-and-comer to a safe bet of the Afro-European scene. A festival, a club, an opening act, a brand.",
    "about.conclusion": "Give him a mic and a crowd. He'll take care of the rest.",
    "about.tag.1": "Trilingual FR/EN/ES",
    "about.tag.2": "Crowd energy",
    "about.tag.3": "Improvisation",
    "about.tag.4": "Dance & stage presence",
    "about.tag.5": "DJ connection",
    "docs.press": "Press kit",
    "docs.contract": "Booking agreement",
    "docs.press.info": "PDF · French",
    "docs.contract.info": "PDF · FR/EN · Outside Île-de-France",
    "docs.download": "Download",
    "testi.eyebrow": "Testimonials",
    "testi.title": "What they say.",
    "testi.1.q": "An energy that lifted the entire room. Timing, voice, charisma — perfect.",
    "testi.1.a": "Sophie L. — Corporate Gala 2023",
    "testi.2.q": "Impeccable timing. He locked in 400 guests in the first seconds.",
    "testi.2.a": "Marc D. — LuxMedia",
    "testi.3.q": "The energy of a festival packed into one voice. Rebooking in 2026.",
    "testi.3.a": "Kevin R. — Urban Fest",
    "cta.eyebrow": "Booking",
    "cta.title": "Ready to set the room on fire?",
    "cta.desc": "Limited availability for the 2026–2027 season. Let's talk about your event.",
    "cta.book": "Book Now",
    "cta.pdf": "Portfolio PDF",
    "pg.gallery": "Gallery",
    "pg.videos": "Videos",
    "pg.back": "Back",
    "pg.1.body": "Mainstages, urban stages and open airs: artist intros, transitions, stage timing and a crowd energy that never drops.",
    "pg.2.body": "Concerts and live shows: artist introductions, warm-up, interludes and a constant link between stage, control room and audience.",
    "pg.3.body": "Clubs and after-shows: mic hype, freestyle, direct interaction with the dancefloor and full sync with the DJ.",
    "footer.rights": "© 2026 LE H Performance. All rights reserved.",
  },
  es: {
    "nav.prestations": "Servicios",
    "nav.showreel": "Showreel",
    "nav.about": "Sobre mí",
    "nav.contact": "Contacto",
    "nav.booking": "Reservas",
    "hero.status": "Reservas 2026 — 2027",
    "hero.role": "Maestro de Ceremonias / Host",
    "hero.title1": "Voz.",
    "hero.title2": "Ritmo.",
    "hero.title3": "Presencia.",
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
    "prest.2.title": "Concert &\nLive",
    "prest.2.desc": "Conducción elegante y ritmada, desde el cóctel hasta el cierre.",
    "prest.3.tag": "Clubs",
    "prest.3.title": "The\nCatalyst Set",
    "prest.3.desc": "Hype, transiciones, freestyle al micro. Conexión total con la pista.",
    "show.eyebrow": "Showreel — 2026",
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
    "marquee.6": "Day parties & Brunches",
    "about.eyebrow": "Perfil — 001",
    "about.title": "LE H, EL HOMBRE QUE DA LA ENERGÍA",
    "about.intro": "LE H nació de un ida y vuelta constante entre dos mundos: Costa de Marfil para la sangre y el instinto, París para el campo de juego y la exigencia. De Abidjan, lleva una cierta idea de fiesta — aquella en la que no se baila delante de la gente, sino con ella. De París, lleva la velocidad y el enfrentamiento diario con todos los escenarios de Europa.\n\nDe este cruce nació un oficio que no tiene nombre propio. Ni solo MC, ni solo bailarín, ni solo animador: LE H es lo que se llamaba, en la gran tradición del espectáculo, un SHOWMAN — alguien cuya sola presencia transforma un lugar, y de quien se sigue hablando a la mañana siguiente.",
    "about.vibe.title": "THE VIBES GIVER",
    "about.vibe.p1": "El apodo no sale de una reunión de marketing. Viene del público. Porque es exactamente lo que hace LE H: da. Llega con una energía bruta, inmediata, y la distribuye hasta que la sala se la devuelve. Lee una multitud en segundos y sabe con precisión cuándo empujar, cuándo hacer subir, cuándo dejar respirar un drop, cuándo bajar a la fosa.\n\nAhí es donde el bailarín toma el relevo del MC. No se contenta con hablar al micrófono: se mueve, ocupa el espacio, baila con el público. No llena los silencios — instala una atmósfera. Quienes lo han visto trabajar hablan de un AURA: esa capacidad rara de hacer bascular toda una sala a su universo, y de hacer reinar allí una buena energía que dura toda la noche.",
    "about.vibe.quote": "Donde muchos hosts comentan la noche, él la construye.",
    "about.versatility.title": "LA VERSATILIDAD COMO FIRMA",
    "about.versatility.p1": "Es quizás su activo más valioso para un programador: LE H se adapta a todo. Un set amapiano en el Piano People Stage de Afro Nation, festival que reúne a más de 50.000 personas. WECANDANCE, festival electro belga, donde el público no viene buscando afro. Una primera parte de concierto, del Accor Arena al Ziggo Dome. Un brunch afrobeats un domingo al mediodía en Barcelona. Una day party en Abidjan. Un evento patrocinado por JD Sports o Salomon. Cada contexto tiene sus reglas: él las conoce todas.",
    "about.versatility.p2": "Anima en francés, inglés y español. No es una línea decorativa en un CV: es lo que le permite sostener un escenario en Ámsterdam, Madrid, Oslo y Abidjan con la misma intensidad. En eventos internacionales, se convierte en el vínculo vivo entre un line-up mundial y un público local.\n\nEn dos años y más de 200 fechas, LE H ha pasado de cara nueva a valor seguro de la escena afro europea. Un festival, un club, una primera parte, una marca.",
    "about.conclusion": "Dale un micrófono y una multitud. El resto, se encarga él.",
    "about.tag.1": "Trilingüe FR/EN/ES",
    "about.tag.2": "Energía del público",
    "about.tag.3": "Improvisación",
    "about.tag.4": "Baile & presencia escénica",
    "about.tag.5": "Conexión con el DJ",
    "docs.press": "Dossier de prensa",
    "docs.contract": "Contrato de booking",
    "docs.press.info": "PDF · Francés",
    "docs.contract.info": "PDF · FR/EN · Fuera de Île-de-France",
    "docs.download": "Descargar",
    "testi.eyebrow": "Testimonios",
    "testi.title": "Lo que dicen.",
    "testi.1.q": "Una energía que levantó toda la sala. Timing, voz, carisma — perfecto.",
    "testi.1.a": "Sophie L. — Gala Corporativa 2023",
    "testi.2.q": "Timing impecable. Enganchó a 400 invitados en los primeros segundos.",
    "testi.2.a": "Marc D. — LuxMedia",
    "testi.3.q": "La energía de un festival concentrada en una voz. Repetimos en 2026.",
    "testi.3.a": "Kevin R. — Urban Fest",
    "cta.eyebrow": "Reservas",
    "cta.title": "¿Listo para prender fuego?",
    "cta.desc": "Disponibilidad limitada para la temporada 2026–2027. Hablemos de tu evento.",
    "cta.book": "Reservar",
    "cta.pdf": "Portfolio PDF",
    "pg.gallery": "Galería",
    "pg.videos": "Vídeos",
    "pg.back": "Volver",
    "pg.1.body": "Mainstages, escenarios urbanos y open airs: presentación de artistas, transiciones, control del timing y energía constante del público.",
    "pg.2.body": "Conciertos y directos: presentación de artistas, calentamiento de sala, interludios y enlace permanente entre escenario, técnica y público.",
    "pg.3.body": "Clubs y after-shows: hype al micro, freestyle, interacción directa con la pista y sintonía total con el DJ.",
    "footer.rights": "© 2026 LE H Performance. Todos los derechos reservados.",
  },
};

type Ctx = { lang: Lang; setLang: (l: Lang) => void; t: (key: string) => string };
const LangContext = createContext<Ctx | null>(null);

function syncLangSideEffects(l: Lang) {
  if (typeof document === "undefined") return;
  document.documentElement.lang = l;
}

export function LangProvider({ children }: { children: ReactNode }) {
  const search = useSearch({ strict: false });
  const navigate = useNavigate();
  const lang = resolveLanguage(search.lang);
  useEffect(() => {
    let initial: Lang | null = null;
    try {
      const url = new URL(window.location.href);
      const q = url.searchParams.get("lang") as Lang | null;
      if (q && ["fr", "en", "es"].includes(q)) initial = q;
      if (!initial) {
        const saved = localStorage.getItem("leh_lang") as Lang | null;
        if (saved && ["fr", "en", "es"].includes(saved)) initial = saved;
      }
      if (!initial) {
        const nav = (navigator.language || "fr").slice(0, 2).toLowerCase() as Lang;
        if (["fr", "en", "es"].includes(nav)) initial = nav;
      }
    } catch {}
    const resolved: Lang = initial ?? "fr";
    if (!search.lang) void navigate({ search: previous => ({ ...previous, lang: resolved }), replace: true });
    syncLangSideEffects(resolved);
  }, []);
  useEffect(() => { syncLangSideEffects(lang); }, [lang]);
  const setLang = (l: Lang) => {
    void navigate({ search: previous => ({ ...previous, lang: l }), replace: true });
    try { localStorage.setItem("leh_lang", l); } catch {}
    syncLangSideEffects(l);
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
