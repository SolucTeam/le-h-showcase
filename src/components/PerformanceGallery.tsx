import { useEffect, useRef, useState } from 'react';
import { Link } from '@tanstack/react-router';
import { ArrowUpRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PLAYGROUNDS } from '@/lib/playgrounds';
import { useI18n } from '@/lib/i18n';
import { eventCopy } from '@/lib/event-copy';

export function PerformanceGallery() {
  const { lang } = useI18n();
  const c = eventCopy[lang];
  const [filter, setFilter] = useState('all');
  const [mobile, setMobile] = useState<boolean | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const media = window.matchMedia('(max-width: 768px)');
    const update = () => setMobile(media.matches);
    update();
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);
  const categories = [{ slug: 'all', label: c.all }, { slug: 'festivals', label: c.festival }, { slug: 'concert-live', label: c.concert }, { slug: 'clubs', label: c.club }];
  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => { if (!entry.isIntersecting) (entry.target as HTMLVideoElement).pause(); });
    }, { threshold: 0.2 });
    root.querySelectorAll('video').forEach(video => observer.observe(video));
    return () => observer.disconnect();
  }, [filter, mobile]);
  return <div ref={ref}>
    <div role="group" aria-label={c.videos} className="mb-8 flex flex-wrap gap-2">
      {categories.map(cat => <Button key={cat.slug} variant={filter === cat.slug ? 'default' : 'outline'} aria-pressed={filter === cat.slug} onClick={() => setFilter(cat.slug)} className="min-h-11 h-auto whitespace-normal py-3">{cat.label}</Button>)}
    </div>
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {PLAYGROUNDS.filter(pg => filter === 'all' || pg.slug === filter).map(pg => {
        const video = pg.videos[0];
        const category = categories.find(cat => cat.slug === pg.slug)?.label;
        if (!video) return null;
        return <article key={pg.slug} className="min-w-0">
          <div className="aspect-[9/16] w-full overflow-hidden rounded-md border border-border bg-surface">
            {mobile === null ? <img src={pg.cover} alt={video.tag} loading="lazy" className="h-full w-full object-cover" /> : <video key={String(mobile)} controls playsInline preload="none" poster={pg.cover} aria-label={`${category} — ${video.tag}`} className="h-full w-full object-contain" onPlay={e => { const current = e.currentTarget; ref.current?.querySelectorAll('video').forEach(v => { if (v !== current) v.pause(); }); }}>
              <source src={mobile ? video.srcMobile : video.src} type="video/mp4" />
              <source src={video.webm} type="video/webm" />
            </video>}
          </div>
          <p className="mt-4 text-xs font-bold uppercase text-accent">{category}</p><h3 className="mt-2 font-display text-xl">{video.tag}</h3>
          <Button asChild variant="link" className="mt-2 h-11 px-0"><Link to="/playgrounds/$slug" params={{ slug: pg.slug }}>{c.details}<ArrowUpRight /></Link></Button>
        </article>;
      })}
    </div>
  </div>;
}