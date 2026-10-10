export type SiteLanguage = "fr" | "en" | "es";
export function resolveLanguage(value: unknown): SiteLanguage {
  return value === "en" || value === "es" ? value : "fr";
}

type PageCopy = { title: string; description: string; h1: string };
const pages: Record<string, Record<SiteLanguage, PageCopy>> = {
  home: {
    fr: { title: "LE H — MC, Host & Showman | Festivals et Concerts", description: "Découvrez LE H, MC et showman basé à Paris : festivals, concerts, clubs et événements de marque. Animation FR/EN/ES et booking international.", h1: "LE H — MC, Host & Showman" },
    en: { title: "LE H | Festival & Concert MC, Event Host in Paris", description: "Book LE H, Paris-based MC, hypeman and live show host for festivals, concerts and clubs worldwide. Crowd energy in English, French and Spanish.", h1: "LE H — MC, Event Host & Live Showman" },
    es: { title: "LE H | MC y Presentador de Festivales y Conciertos", description: "Contrata a LE H, MC y presentador de espectáculos en París, para festivales, conciertos y clubs. Animación en español, francés e inglés en todo el mundo.", h1: "LE H — MC y Presentador de Espectáculos en Vivo" },
  },
  festivals: {
    fr: { title: "LE H — MC et Host de Festival | Showman Live", description: "LE H anime les festivals : présentation des artistes, énergie du public et interaction sur scène. Photos, vidéos live et booking international.", h1: "LE H — MC de Festival" },
    en: { title: "LE H — Festival MC & Main Stage Host | Live Showman", description: "Discover LE H's festival performances: main stage hosting, artist introductions and crowd energy. Watch live videos and book a multilingual festival MC.", h1: "LE H — Festival MC & Host" },
    es: { title: "LE H — MC y Presentador de Festivales | Showman en Vivo", description: "Descubre a LE H en festivales: presentación de artistas, animación del público y energía en el escenario. Fotos, vídeos y contratación internacional.", h1: "LE H — MC de Festivales" },
  },
  concerts: {
    fr: { title: "LE H — MC de Concert et Première Partie | Host Live", description: "LE H chauffe la salle et accompagne les concerts : premières parties, présentation des artistes et interludes. Découvrez ses vidéos et réservez un MC live.", h1: "LE H — MC de Concert" },
    en: { title: "LE H — Concert MC & Opening Act Host | Live Shows", description: "Book LE H for concert warm-ups, opening acts and live show hosting. Explore performance videos, artist introductions and crowd interaction on stage.", h1: "LE H — Concert MC & Live Host" },
    es: { title: "LE H — MC de Conciertos y Telonero | Espectáculos en Vivo", description: "LE H anima conciertos y primeras partes con energía, interacción con el público y presentación de artistas. Vídeos en vivo y contratación de MC.", h1: "LE H — MC de Conciertos" },
  },
  clubs: {
    fr: { title: "LE H — MC de Club et Soirée | Hypeman & Showman", description: "LE H, MC de club et hypeman : freestyle au micro, énergie du dancefloor et complicité avec le DJ. Vidéos live, after-shows et booking international.", h1: "LE H — MC de Club & Hypeman" },
    en: { title: "LE H — Club MC & Hypeman | Nightlife Event Host", description: "Book LE H as your club MC and hypeman for nightlife events and after-shows. Mic freestyle, crowd interaction and DJ connection. Explore live performances.", h1: "LE H — Club MC & Hypeman" },
    es: { title: "LE H — MC de Club y Hypeman | Animador de Fiestas", description: "Contrata a LE H para clubs, fiestas y after-shows: freestyle al micro, conexión con el DJ y energía en la pista. Descubre sus actuaciones en vivo.", h1: "LE H — MC de Club y Hypeman" },
  },
};

export function getPageCopy(page: string, lang: SiteLanguage): PageCopy {
  return (pages[page] ?? pages.home)[lang];
}

export function localizedHead(page: string, path: string, lang: SiteLanguage) {
  const copy = getPageCopy(page, lang);
  const base = `https://le-h-showcase.lovable.app${path}`;
  const url = `${base}?lang=${lang}`;
  return {
    meta: [
      { title: copy.title },
      { name: "description", content: copy.description },
      { property: "og:title", content: copy.title },
      { property: "og:description", content: copy.description },
      { property: "og:type", content: page === "home" ? "website" : "article" },
      { property: "og:url", content: url },
      { property: "og:locale", content: { fr: "fr_FR", en: "en_GB", es: "es_ES" }[lang] },
      { name: "twitter:title", content: copy.title },
      { name: "twitter:description", content: copy.description },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "canonical", href: url },
      ...(["fr", "en", "es"] as const).map(language => ({ rel: "alternate", hrefLang: language, href: `${base}?lang=${language}` })),
      { rel: "alternate", hrefLang: "x-default", href: `${base}?lang=fr` },
    ],
  };
}