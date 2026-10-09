import { useState, type FormEvent } from 'react';
import { useServerFn } from '@tanstack/react-start';
import { ArrowUpRight, LoaderCircle, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useI18n } from '@/lib/i18n';
import { eventCopy } from '@/lib/event-copy';
import { bookingHref, type EventBrief } from '@/lib/event-brief';
import { recommendEvent } from '@/lib/event-recommendation.functions';

export function EventRecommendation() {
  const { lang } = useI18n();
  const c = eventCopy[lang];
  const call = useServerFn(recommendEvent);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<{ text: string; brief: EventBrief } | null>(null);
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (busy) return;
    const form = new FormData(e.currentTarget);
    const brief: EventBrief = { type: String(form.get('type')), date: String(form.get('date')), location: String(form.get('location')), audience: String(form.get('audience')), atmosphere: String(form.get('atmosphere')), lang };
    setBusy(true); setError(''); setResult(null);
    try {
      const response = await call({ data: brief });
      if (response.error) setError(response.error);
      else setResult({ text: response.text, brief });
    } catch { setError(c.failed); }
    finally { setBusy(false); }
  }
  return <section id="event-match" className="border-y border-border bg-surface/40 px-6 py-20 md:px-12 md:py-28">
    <div className="mx-auto max-w-5xl">
      <p className="mb-3 text-xs font-bold uppercase text-accent">{c.eyebrow}</p>
      <h2 className="mb-10 font-display text-3xl uppercase md:text-5xl">{c.title}</h2>
      <form onSubmit={submit} className="grid min-w-0 grid-cols-1 gap-6 sm:grid-cols-2">
        <label className="space-y-2 text-sm">{c.type}<select name="type" required disabled={busy} className="mt-2 h-12 w-full rounded-md border border-input bg-background px-3 text-base text-foreground">
          <option value="festival">{c.festival}</option><option value="concert">{c.concert}</option><option value="club">{c.club}</option><option value="other">{c.other}</option>
        </select></label>
        <label className="space-y-2 text-sm">{c.date}<Input name="date" type="date" required disabled={busy} className="mt-2 h-12 min-w-0 bg-background text-base" /></label>
        <label className="space-y-2 text-sm">{c.location}<Input name="location" required maxLength={200} disabled={busy} placeholder={c.locationHint} className="mt-2 h-12 bg-background text-base" /></label>
        <label className="space-y-2 text-sm">{c.audience}<Input name="audience" required maxLength={600} disabled={busy} placeholder={c.audienceHint} className="mt-2 h-12 bg-background text-base" /></label>
        <label className="space-y-2 text-sm sm:col-span-2">{c.atmosphere}<Textarea name="atmosphere" required maxLength={1000} disabled={busy} placeholder={c.atmosphereHint} className="mt-2 min-h-28 bg-background text-base" /></label>
        <div className="sm:col-span-2"><Button type="submit" disabled={busy} className="h-auto min-h-12 w-full whitespace-normal px-6 py-3 sm:w-auto">{busy ? <LoaderCircle className="animate-spin" /> : <Sparkles />}{busy ? c.loading : c.submit}</Button><p className="mt-4 max-w-2xl text-xs leading-relaxed text-muted-foreground">{c.privacy}</p></div>
      </form>
      <div aria-live="polite" aria-busy={busy}>
        {error && <p role="alert" className="mt-8 border-l-2 border-destructive pl-4 text-sm text-foreground">{error}</p>}
        {result && <div className="mt-10 border-t border-border pt-8">
          <h3 className="mb-5 font-display text-xl text-accent">{c.result}</h3>
          <p className="max-w-3xl whitespace-pre-line text-base leading-7 text-foreground/85">{result.text}</p>
          <p className="my-5 text-xs text-muted-foreground">{eventCopy[result.brief.lang].notice}</p>
          <Button asChild className="h-12"><a href={bookingHref(result.brief, result.text)}>{c.book}<ArrowUpRight /></a></Button>
        </div>}
      </div>
    </div>
  </section>;
}