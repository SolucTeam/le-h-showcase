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
  if (!isFinite(t)) return "0:00";
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
  const [playing, setPlaying] = useState(autoPlay);
  const [muted, setMuted] = useState(autoPlay);
  const [volume, setVolume] = useState(1);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [fullscreen, setFullscreen] = useState(false);
  const [ccOn, setCcOn] = useState(false);
  const [showControls, setShowControls] = useState(true);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const onTime = () => setProgress(v.currentTime);
    const onMeta = () => setDuration(v.duration);
    const onEnd = () => setPlaying(false);
    v.addEventListener("timeupdate", onTime);
    v.addEventListener("loadedmetadata", onMeta);
    v.addEventListener("ended", onEnd);
    return () => {
      v.removeEventListener("timeupdate", onTime);
      v.removeEventListener("loadedmetadata", onMeta);
      v.removeEventListener("ended", onEnd);
    };
  }, []);

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

  const toggle = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      v.play();
      setPlaying(true);
    } else {
      v.pause();
      setPlaying(false);
    }
  };

  const toggleMute = () => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = !v.muted;
    setMuted(v.muted);
    if (!v.muted && v.volume === 0) {
      v.volume = 1;
      setVolume(1);
    }
  };

  const setVol = (val: number) => {
    const v = videoRef.current;
    if (!v) return;
    v.volume = val;
    v.muted = val === 0;
    setVolume(val);
    setMuted(val === 0);
  };

  const seek = (val: number) => {
    const v = videoRef.current;
    if (!v) return;
    v.currentTime = val;
    setProgress(val);
  };

  const toggleFs = async () => {
    const el = wrapRef.current;
    if (!el) return;
    if (!document.fullscreenElement) {
      await el.requestFullscreen?.();
    } else {
      await document.exitFullscreen?.();
    }
  };

  return (
    <div
      ref={wrapRef}
      className={`group relative bg-black overflow-hidden ${className}`}
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => playing && setShowControls(false)}
      role="region"
      aria-label={ariaLabel}
    >
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        autoPlay={autoPlay}
        muted={muted}
        loop={loop}
        playsInline
        preload="metadata"
        crossOrigin="anonymous"
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

      {/* Center play button when paused */}
      {!playing && (
        <button
          type="button"
          onClick={toggle}
          aria-label="Lire la vidéo"
          className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/20 transition-colors"
        >
          <span className="size-20 rounded-full bg-accent/90 text-accent-foreground flex items-center justify-center shadow-2xl">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M8 5v14l11-7z" />
            </svg>
          </span>
        </button>
      )}

      {/* Controls bar */}
      <div
        className={`absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent px-4 py-3 transition-opacity ${
          showControls || !playing ? "opacity-100" : "opacity-0"
        }`}
      >
        {/* Progress */}
        <input
          type="range"
          min={0}
          max={duration || 0}
          step={0.1}
          value={progress}
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
