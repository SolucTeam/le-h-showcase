// Public portfolio content mirrored for MCP tools (same data the website shows).

export type Lang = "fr" | "en" | "es";

export const profile = {
  name: "LE H",
  role: "Master of Ceremonies / Host",
  basedIn: "Paris — Worldwide",
  languages: ["Français", "English", "Español"],
  bookingEmail: "lehbookingpro@gmail.com",
  bio: {
    fr: "Depuis huit ans, LE H traverse les scènes — du club confidentiel au mainstage festival, du gala de prestige au lancement de marque. Trilingue, méticuleux : il lit une salle en trois secondes et la guide exactement où elle veut aller.",
    en: "For eight years LE H has worked stages worldwide — from intimate clubs to festival mainstages, prestige galas to brand launches. Trilingual and meticulous: he reads a room in three seconds and takes it where it wants to go.",
    es: "Desde hace ocho años, LE H recorre los escenarios — del club íntimo al mainstage de festival, de la gala de prestigio al lanzamiento de marca. Trilingüe y meticuloso: lee una sala en tres segundos y la lleva justo donde quiere ir.",
  },
  skills: ["Run-of-show", "Improvisation", "Coordination artistes", "Plateau TV", "Trilingue FR/EN/ES"],
} as const;

export const stats = [
  { key: "events", value: "300+", label: { fr: "Événements", en: "Events", es: "Eventos" } },
  { key: "countries", value: "12", label: { fr: "Pays", en: "Countries", es: "Países" } },
  { key: "attendees", value: "50K", label: { fr: "PAX cumulés", en: "Attendees", es: "Asistentes" } },
  { key: "years", value: "8", label: { fr: "Années", en: "Years", es: "Años" } },
] as const;

export const services = [
  {
    id: "festivals",
    name: { fr: "Festivals — Mainstage Takeovers", en: "Festivals — Mainstage Takeovers", es: "Festivales — Mainstage Takeovers" },
    description: {
      fr: "Maîtriser les grandes scènes, annoncer les artistes, tenir l'intensité de la foule.",
      en: "Owning big stages, introducing artists, holding the crowd's intensity.",
      es: "Dominar los grandes escenarios, presentar a los artistas y sostener la intensidad del público.",
    },
  },
  {
    id: "corporate-galas",
    name: { fr: "Galas Corporate & Award Nights", en: "Corporate Galas & Award Nights", es: "Galas Corporativas y Premios" },
    description: {
      fr: "Une conduite de soirée élégante et rythmée, du cocktail jusqu'au bouquet final.",
      en: "An elegant, well-paced evening from cocktail hour to the grand finale.",
      es: "Una conducción elegante y rítmica, del cóctel al gran final.",
    },
  },
  {
    id: "clubs",
    name: { fr: "Clubs & After-shows — The Catalyst Set", en: "Clubs & After-shows — The Catalyst Set", es: "Clubes y After-shows — The Catalyst Set" },
    description: {
      fr: "Hype, transitions, freestyle au mic. Une connexion totale avec le dancefloor.",
      en: "Hype, transitions, freestyle on the mic. Total connection with the dancefloor.",
      es: "Hype, transiciones, freestyle al micro. Conexión total con la pista.",
    },
  },
] as const;

export const otherFormats = [
  "Lancements produit",
  "Cérémonies",
  "Plateaux TV",
] as const;

export const testimonials = [
  { quote: "Une énergie qui a soulevé toute la salle. Le timing, la voix, le charisme — parfait.", author: "Sophie L. — Corporate Gala 2023" },
  { quote: "Sens du timing parfait. Il a capté 400 invités dès les premières secondes.", author: "Marc D. — LuxMedia" },
  { quote: "L'énergie d'un festival concentrée dans une voix. On le rebooke en 2024.", author: "Kevin R. — Urban Fest" },
] as const;

export function pickLang(lang: string | undefined): Lang {
  return lang === "en" || lang === "es" ? lang : "fr";
}
