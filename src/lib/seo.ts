export type SiteLanguage = "fr" | "en" | "es";
export function resolveLanguage(value: unknown): SiteLanguage {
  return value === "en" || value === "es" ? value : "fr";
}

type PageCopy = { title: string; description: string; h1: string };
const pages: Record<string, Record<SiteLanguage, PageCopy>> = {
  home: {
    fr: { title: "LE H — MC, Host & Showman à Paris | Festivals, Concerts & Clubs", description: "LE H, MC et showman basé à Paris et en Île-de-France : festivals, concerts, clubs et événements de marque. Animation FR/EN/ES, booking en France et à l'international.", h1: "LE H — MC, Host & Showman à Paris" },
    en: { title: "LE H | Festival, Concert & Club MC in Paris, France", description: "Book LE H, MC and live show host based in Paris and Île-de-France, for festivals, concerts and clubs across France and worldwide. Crowd energy in English, French and Spanish.", h1: "LE H — MC, Event Host & Live Showman in Paris" },
    es: { title: "LE H | MC de Festivales, Conciertos y Clubs en París, Francia", description: "Contrata a LE H, MC y presentador de espectáculos en París e Île-de-France, para festivales, conciertos y clubs en Francia y en todo el mundo. Animación en español, francés e inglés.", h1: "LE H — MC y Presentador de Espectáculos en París" },
  },
  festivals: {
    fr: { title: "LE H — MC de Festival à Paris & en France | Showman Live", description: "LE H anime les festivals à Paris, en Île-de-France et partout en France : présentation des artistes, énergie du public et interaction sur scène. Photos, vidéos live et booking.", h1: "LE H — MC de Festival" },
    en: { title: "LE H — Festival MC in Paris & France | Main Stage Host", description: "Discover LE H's festival performances in Paris, Île-de-France and across France: main stage hosting, artist introductions and crowd energy. Watch live videos and book a multilingual festival MC.", h1: "LE H — Festival MC & Host" },
    es: { title: "LE H — MC de Festivales en París y Francia | Showman en Vivo", description: "Descubre a LE H en festivales de París, Île-de-France y toda Francia: presentación de artistas, animación del público y energía en el escenario. Fotos, vídeos y contratación.", h1: "LE H — MC de Festivales" },
  },
  concerts: {
    fr: { title: "LE H — MC de Concert à Paris | Premières Parties & Host Live", description: "LE H chauffe les salles de concert à Paris et en Île-de-France : premières parties, présentation des artistes et interludes. Découvrez ses vidéos et réservez un MC live.", h1: "LE H — MC de Concert" },
    en: { title: "LE H — Concert MC in Paris | Opening Acts & Live Shows", description: "Book LE H for concert warm-ups and opening acts in Paris, Île-de-France and across France. Explore performance videos, artist introductions and crowd interaction on stage.", h1: "LE H — Concert MC & Live Host" },
    es: { title: "LE H — MC de Conciertos en París | Telonero y Espectáculos en Vivo", description: "LE H anima conciertos y primeras partes en París, Île-de-France y toda Francia con energía, interacción con el público y presentación de artistas. Vídeos en vivo y contratación.", h1: "LE H — MC de Conciertos" },
  },
  clubs: {
    fr: { title: "LE H — MC de Club à Paris | Hypeman & Soirées", description: "LE H, MC de club et hypeman à Paris et en Île-de-France : freestyle au micro, énergie du dancefloor et complicité avec le DJ. Vidéos live, after-shows et booking.", h1: "LE H — MC de Club & Hypeman" },
    en: { title: "LE H — Club MC & Hypeman in Paris | Nightlife Host", description: "Book LE H as your club MC and hypeman in Paris and Île-de-France for nightlife events and after-shows. Mic freestyle, crowd interaction and DJ connection.", h1: "LE H — Club MC & Hypeman" },
    es: { title: "LE H — MC de Club y Hypeman en París | Fiestas y After-shows", description: "Contrata a LE H para clubs y fiestas en París e Île-de-France: freestyle al micro, conexión con el DJ y energía en la pista. Descubre sus actuaciones en vivo.", h1: "LE H — MC de Club y Hypeman" },
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
      { name: "geo.region", content: "FR-IDF" },
      { name: "geo.placename", content: "Paris" },
    ],
    links: [
      { rel: "canonical", href: url },
      ...(["fr", "en", "es"] as const).map(language => ({ rel: "alternate", hrefLang: language, href: `${base}?lang=${language}` })),
      { rel: "alternate", hrefLang: "x-default", href: `${base}?lang=fr` },
    ],
  };
}