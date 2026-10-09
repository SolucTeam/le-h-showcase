import festivalImg from "@/assets/perf-festival.webp";
import galaImg from "@/assets/perf-gala.webp";
import clubImg from "@/assets/perf-club.webp";
import heroImg from "@/assets/hero.webp";
import portraitImg from "@/assets/portrait.webp";
import reelFestivalUrl from "@/assets/reel-festival.mp4";
import reelGalaUrl from "@/assets/reel-gala.mp4";
import reelClubUrl from "@/assets/reel-club.mp4";
import reelFestivalMobileUrl from "@/assets/reel-festival-m.mp4";
import reelGalaMobileUrl from "@/assets/reel-gala-m.mp4";
import reelClubMobileUrl from "@/assets/reel-club-m.mp4";

export type Playground = {
  slug: string;
  n: string;
  cover: string;
  /** i18n keys reused from the home page cards */
  tagKey: string;
  titleKey: string;
  descKey: string;
  bodyKey: string;
  gallery: { src: string; alt: string }[];
  videos: { src: string; srcMobile: string; tag: string }[];
};

export const PLAYGROUNDS: Playground[] = [
  {
    slug: "festivals",
    n: "01",
    cover: festivalImg,
    tagKey: "prest.1.tag",
    titleKey: "prest.1.title",
    descKey: "prest.1.desc",
    bodyKey: "pg.1.body",
    gallery: [
      { src: festivalImg, alt: "LE H — mainstage festival" },
      { src: heroImg, alt: "LE H — micro en main sur scène" },
      { src: portraitImg, alt: "LE H — portrait backstage" },
    ],
    videos: [{ src: reelFestivalUrl, srcMobile: reelFestivalMobileUrl, tag: "Fête de la Musique" }],
  },
  {
    slug: "concert-live",
    n: "02",
    cover: galaImg,
    tagKey: "prest.2.tag",
    titleKey: "prest.2.title",
    descKey: "prest.2.desc",
    bodyKey: "pg.2.body",
    gallery: [
      { src: galaImg, alt: "LE H — concert live" },
      { src: heroImg, alt: "LE H — scène et lumières" },
      { src: festivalImg, alt: "LE H — public en feu" },
    ],
    videos: [{ src: reelGalaUrl, srcMobile: reelGalaMobileUrl, tag: "Amapiano" }],
  },
  {
    slug: "clubs",
    n: "03",
    cover: clubImg,
    tagKey: "prest.3.tag",
    titleKey: "prest.3.title",
    descKey: "prest.3.desc",
    bodyKey: "pg.3.body",
    gallery: [
      { src: clubImg, alt: "LE H — club night" },
      { src: portraitImg, alt: "LE H — portrait" },
      { src: heroImg, alt: "LE H — dancefloor" },
    ],
    videos: [{ src: reelClubUrl, srcMobile: reelClubMobileUrl, tag: "Club · Paris" }],
  },
];

export function getPlayground(slug: string) {
  return PLAYGROUNDS.find((p) => p.slug === slug);
}
