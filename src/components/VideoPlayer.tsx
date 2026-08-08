import { useEffect, useRef, useState } from "react";

type Caption = { src: string; label: string; srcLang: string; default?: boolean };

type Props = {
  src: string;
  poster?: string;
  captions?: Caption[];
  className?: string;
  loop?: boolean;
  autoPlay?: boolean;
  ariaLabel?: string;
};

function fmt(t: number) {
  if (!isFinite(t) || t < 0) return "0:00";
  const m = Math.floor(t / 60);
  const s = Math.floor(t % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function VideoPlayer({
  src,
  poster,
  captions = [],
  className = "",
  loop = false,
  autoPlay = false,
  ariaLabel = "Lecteur vidéo",
}: Props) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const [playing, setPlaying] = useState(false);
  const [started, setStarted] = useState(false);
  const [muted, setMuted] = useState(autoPlay);
  const [volume, setVolume] = useState(1);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [fullscreen, setFullscreen] = useState(false);
  const [ccOn, setCcOn] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [buffering, setBuffering] = useState(false);
  const [error, setError] = useState(false);

  // Drive UI state from the actual media element events (single source of truth),
  // so external pauses / autoplay blocks / stalls always stay in sync.
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;

    const onPlay = () => {
      setPlaying(true);
      setStarted(true);
      setError(false);
    };
    const onPause = () => setPlaying(false);
    const onTime = () => setProgress(v.currentTime);
    const onDuration = () => {
      setDuration(isFinite(v.duration) ? v.duration : 0);
    };
    const onWaiting = () => setBuffering(true);
    const onPlaying = () => setBuffering(false);
    const onCanPlay = () => {
      setBuffering(false);
      setError(false);
    };
    const onError = () => {
      setBuffering(false);
      setError(true);
    };
    const onVolume = () => {
      setMuted(v.muted);
      setVolume(v.volume);
    };

    v.addEventListener("play", onPlay);
    v.addEventListener("pause", onPause);
    v.addEventListener("timeupdate", onTime);
    v.addEventListener("loadedmetadata", onDuration);
    v.addEventListener("durationchange", onDuration);
    v.addEventListener("waiting", onWaiting);
    v.addEventListener("playing", onPlaying);
    v.addEventListener("canplay", onCanPlay);
    v.addEventListener("error", onError);
    v.addEventListener("volumechange", onVolume);

    // Sync any state the element already has (fast connections fire events early).
    onDuration();
    setMuted(v.muted);

    return () => {
      v.removeEventListener("play", onPlay);
      v.removeEventListener("pause", onPause);
      v.removeEventListener("timeupdate", onTime);
      v.removeEventListener("loadedmetadata", onDuration);
      v.removeEventListener("durationchange", onDuration);
      v.removeEventListener("waiting", onWaiting);
      v.removeEventListener("playing", onPlaying);
      v.removeEventListener("canplay", onCanPlay);
      v.removeEventListener("error", onError);
      v.removeEventListener("volumechange", onVolume);
    };
  }, [src]);

  // Reliable mute control — React's `muted` JSX prop is not applied consistently.
  useEffect(() => {
    const v = videoRef.current;
    if (v) v.muted = muted;
  }, [muted]);

  useEffect(() => {
    const onFs = () => setFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", onFs);
    return () => document.removeEventListener("fullscreenchange", onFs);
  }, []);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const tracks = v.textTracks;
    for (let i = 0; i < tracks.length; i++) {
      tracks[i].mode = ccOn ? "showing" : "hidden";
    }
  }, [ccOn, captions.length]);

  const play = () => {
    const v = videoRef.current;
    if (!v) return;
    // play() returns a promise that rejects when the browser blocks playback
    // (e.g. autoplay policy). Fall back to muted playback instead of silently failing.
    const p = v.play();
    if (p && typeof p.catch === "function") {
      p.catch(() => {
        v.muted = true;
        setMuted(true);
        v.play().catch(() => setError(true));
      });
    }
  };

  const toggle = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) play();
    else v.pause();
  };

  const toggleMute = () => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = !v.muted;
    if (!v.muted && v.volume === 0) v.volume = 1;
  };

  const setVol = (val: number) => {
    const v = videoRef.current;
    if (!v) return;
    v.volume = val;
    v.muted = val === 0;
  };

  const seek = (val: number) => {
    const v = videoRef.current;
    if (!v || !isFinite(val)) return;
    v.currentTime = val;
    setProgress(val);
  };

  const toggleFs = async () => {
    const el = wrapRef.current;
    if (!el) return;
    try {
      if (!document.fullscreenElement) await el.requestFullscreen?.();
      else await document.exitFullscreen?.();
    } catch {
      /* fullscreen can be denied; ignore */
    }
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === " " || e.key === "k") {
      e.preventDefault();
      toggle();
    } else if (e.key === "m") {
      toggleMute();
    } else if (e.key === "f") {
      toggleFs();
    }
  };

  const retry = () => {
    const v = videoRef.current;
    if (!v) return;
    setError(false);
    v.load();
    play();
  };

  return (
    <div
      ref={wrapRef}
      className={`group relative bg-black overflow-hidden outline-none focus-visible:ring-2 focus-visible:ring-accent ${className}`}
      onMouseEnter={() => setShowControls(true)}
      onMouseMove={() => setShowControls(true)}
      onMouseLeave={() => playing && setShowControls(false)}
      onKeyDown={onKeyDown}
      tabIndex={0}
      role="region"
      aria-label={ariaLabel}
    >
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        autoPlay={autoPlay}
        loop={loop}
        playsInline
        preload="metadata"
        onClick={toggle}
        className="w-full h-full object-cover cursor-pointer"
      >
        {captions.map((c) => (
          <track
            key={c.src}
            kind="captions"
            src={c.src}
            srcLang={c.srcLang}
            label={c.label}
            default={c.default}
          />
        ))}
        Votre navigateur ne supporte pas la lecture vidéo HTML5.
      </video>

      {/* Buffering spinner */}
      {buffering && !error && (
        <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center">
          <span className="size-12 rounded-full border-2 border-white/20 border-t-accent animate-spin" />
        </div>
      )}

      {/* Error state with retry */}
      {error && (
        <div className="absolute inset-0 z-30 flex flex-col items-center justify-center gap-4 bg-black/70 text-center px-6">
          <p className="text-white/80 text-sm max-w-xs">
            La vidéo n'a pas pu être chargée.
          </p>
          <button
            type="button"
            onClick={retry}
            className="px-5 py-2 border border-accent text-accent text-xs font-bold uppercase tracking-[0.2em] hover:bg-accent hover:text-accent-foreground transition-colors"
          >
            Réessayer
          </button>
        </div>
      )}

      {/* Center play button when paused (does not block the controls bar below) */}
      {!playing && !buffering && !error && (
        <button
          type="button"
          onClick={toggle}
          aria-label="Lire la vidéo"
          className="absolute inset-x-0 top-0 bottom-16 z-10 flex items-center justify-center bg-black/30 hover:bg-black/20 transition-colors"
        >
          <span className="size-20 rounded-full bg-accent/90 text-accent-foreground flex items-center justify-center shadow-2xl transition-transform group-hover:scale-105">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M8 5v14l11-7z" />
            </svg>
          </span>
        </button>
      )}

      {/* Controls bar */}
      <div
        className={`absolute inset-x-0 bottom-0 z-20 bg-gradient-to-t from-black/90 via-black/60 to-transparent px-4 py-3 transition-opacity ${
          showControls || !playing ? "opacity-100" : "opacity-0"
        }`}
      >
        <input
          type="range"
          min={0}
          max={duration || 0}
          step={0.1}
          value={Math.min(progress, duration || 0)}
          onChange={(e) => seek(parseFloat(e.target.value))}
          aria-label="Progression de la vidéo"
          className="w-full h-1 accent-accent cursor-pointer mb-2"
        />
        <div className="flex items-center gap-3 text-white text-xs">
          <button
            type="button"
            onClick={toggle}
            aria-label={playing ? "Pause" : "Lire"}
            className="hover:text-accent transition-colors"
          >
            {playing ? (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M6 5h4v14H6zM14 5h4v14h-4z"/></svg>
            ) : (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
            )}
          </button>

          <button
            type="button"
            onClick={toggleMute}
            aria-label={muted ? "Activer le son" : "Couper le son"}
            className="hover:text-accent transition-colors"
          >
            {muted || volume === 0 ? (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M16.5 12A4.5 4.5 0 0014 8.05v2.13l2.45 2.45c.03-.21.05-.42.05-.63zM19 12c0 .94-.2 1.82-.54 2.64l1.51 1.51A8.83 8.83 0 0021 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.17v2.06a8.99 8.99 0 003.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/></svg>
            ) : (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3A4.5 4.5 0 0014 8.05v7.9A4.5 4.5 0 0016.5 12zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/></svg>
            )}
          </button>

          <input
            type="range"
            min={0}
            max={1}
            step={0.05}
            value={muted ? 0 : volume}
            onChange={(e) => setVol(parseFloat(e.target.value))}
            aria-label="Volume"
            className="w-20 h-1 accent-accent cursor-pointer hidden sm:block"
          />

          <span className="font-mono tabular-nums text-[11px] text-white/70">
            {fmt(progress)} / {fmt(duration)}
          </span>

          <div className="ml-auto flex items-center gap-3">
            {captions.length > 0 && (
              <button
                type="button"
                onClick={() => setCcOn((v) => !v)}
                aria-label={ccOn ? "Désactiver les sous-titres" : "Activer les sous-titres"}
                aria-pressed={ccOn}
                className={`px-2 py-0.5 border text-[11px] font-bold tracking-wider transition-colors ${
                  ccOn ? "border-accent text-accent" : "border-white/30 text-white/70 hover:text-accent hover:border-accent"
                }`}
              >
                CC
              </button>
            )}
            <button
              type="button"
              onClick={toggleFs}
              aria-label={fullscreen ? "Quitter le plein écran" : "Plein écran"}
              className="hover:text-accent transition-colors"
            >
              {fullscreen ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z"/></svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/></svg>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
