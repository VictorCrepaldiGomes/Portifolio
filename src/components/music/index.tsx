import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  SkipBack,
  SkipForward,
  Music2,
  Link2,
  Check,
  ChevronDown,
  ChevronUp,
  Radio,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import SectionHeading from "@/components/section-heading";

const LOFI_PLAYLIST = [
  {
    id: "jfKfPfyJRdk",
    title: "lofi hip hop radio 💤 beats to sleep/chill to",
    artist: "Lofi Girl",
    tag: "Chill",
  },
  {
    id: "5qap5aO4i9A",
    title: "lofi hip hop radio 📚 beats to relax/study to",
    artist: "Lofi Girl",
    tag: "Study",
  },
  {
    id: "Na0w3Mz46GA",
    title: "Coffee Shop Radio ☕ jazz & bossa nova",
    artist: "Lofi Girl",
    tag: "Jazz",
  },
  {
    id: "kgx4WGK0oNU",
    title: "chillhop essentials — beats to work to",
    artist: "Chillhop Music",
    tag: "Work",
  },
  {
    id: "7NOSDKb0HlU",
    title: "Lofi Beats to Study 🎧 — focus mix",
    artist: "Lofi Beats",
    tag: "Focus",
  },
  {
    id: "lTRiuFIWV54",
    title: "Night Owl Radio 🦉 late night lofi",
    artist: "Lofi Cafe",
    tag: "Night",
  },
  {
    id: "MVPTGNGiI-4",
    title: "Rainy Day Lofi ☔ cozy beats",
    artist: "Ambient Mix",
    tag: "Rainy",
  },
  {
    id: "HuFYqnbVbzY",
    title: "lofi piano 🎹 — calm study beats",
    artist: "Piano Lofi",
    tag: "Piano",
  },
];

function extractYouTubeId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([A-Za-z0-9_-]{11})/,
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  if (/^[A-Za-z0-9_-]{11}$/.test(url.trim())) return url.trim();
  return null;
}

function WaveformBar({ delay }: { delay: number }) {
  return (
    <motion.div
      className="w-1 rounded-full bg-primary/70"
      animate={{ height: ["6px", "20px", "10px", "18px", "6px"] }}
      transition={{
        duration: 1.4,
        repeat: Infinity,
        delay,
        ease: "easeInOut",
      }}
    />
  );
}

function AnimatedWaveform({ isPlaying }: { isPlaying: boolean }) {
  if (!isPlaying) {
    return (
      <div className="flex items-center gap-0.5 h-5">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="w-1 h-1.5 rounded-full bg-muted-foreground/40" />
        ))}
      </div>
    );
  }
  return (
    <div className="flex items-center gap-0.5 h-5">
      {[0, 0.2, 0.1, 0.3, 0.15].map((delay, i) => (
        <WaveformBar key={i} delay={delay} />
      ))}
    </div>
  );
}

export default function Music() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [customUrl, setCustomUrl] = useState("");
  const [urlError, setUrlError] = useState("");
  const [customTrack, setCustomTrack] = useState<null | { id: string; title: string }>(null);
  const [showPlaylist, setShowPlaylist] = useState(false);
  const [urlApplied, setUrlApplied] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const activeTrack = customTrack
    ? { id: customTrack.id, title: customTrack.title, artist: "URL personalizada", tag: "Custom" }
    : LOFI_PLAYLIST[currentIndex];

  const embedSrc = `https://www.youtube.com/embed/${activeTrack.id}?autoplay=1&loop=1&playlist=${activeTrack.id}&controls=1&rel=0&modestbranding=1`;

  const handlePlay = useCallback(() => {
    setIsPlaying((prev) => !prev);
  }, []);

  const handlePrev = () => {
    setCustomTrack(null);
    setIsPlaying(true);
    setCurrentIndex((prev) => (prev - 1 + LOFI_PLAYLIST.length) % LOFI_PLAYLIST.length);
  };

  const handleNext = () => {
    setCustomTrack(null);
    setIsPlaying(true);
    setCurrentIndex((prev) => (prev + 1) % LOFI_PLAYLIST.length);
  };

  const handleSelectPlaylist = (index: number) => {
    setCustomTrack(null);
    setCurrentIndex(index);
    setIsPlaying(true);
    setShowPlaylist(false);
  };

  const handleApplyUrl = () => {
    const trimmed = customUrl.trim();
    if (!trimmed) return;
    const id = extractYouTubeId(trimmed);
    if (!id) {
      setUrlError("URL inválida. Use um link do YouTube ou um ID de vídeo.");
      return;
    }
    setUrlError("");
    setCustomTrack({ id, title: "Vídeo personalizado" });
    setIsPlaying(true);
    setUrlApplied(true);
    setTimeout(() => setUrlApplied(false), 2000);
    setCustomUrl("");
  };

  const tagColors: Record<string, string> = {
    Chill: "bg-blue-500/10 text-blue-500",
    Study: "bg-violet-500/10 text-violet-500",
    Jazz: "bg-amber-500/10 text-amber-500",
    Work: "bg-emerald-500/10 text-emerald-500",
    Focus: "bg-indigo-500/10 text-indigo-500",
    Night: "bg-slate-500/10 text-slate-400",
    Rainy: "bg-cyan-500/10 text-cyan-500",
    Piano: "bg-rose-500/10 text-rose-500",
    Custom: "bg-orange-500/10 text-orange-500",
  };

  return (
    <section id="music">
      <SectionHeading
        title="Música"
        description="Cole uma URL do YouTube ou escolha uma playlist lofi para relaxar enquanto navega pelo meu portfólio."
      />

      <div className="mt-10 space-y-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="rounded-2xl border bg-card/40 p-6 md:p-8"
        >
          <div className="flex items-start justify-between gap-4 mb-5">
            <div className="flex items-center gap-3 min-w-0">
              <div className="shrink-0 flex items-center justify-center w-10 h-10 rounded-xl bg-muted">
                <Music2 className="size-5 text-muted-foreground" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-foreground truncate leading-tight">
                  {activeTrack.title}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {activeTrack.artist}
                </p>
              </div>
            </div>
            <div className="shrink-0 flex items-center gap-2">
              <AnimatedWaveform isPlaying={isPlaying} />
              <span
                className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                  tagColors[activeTrack.tag] ?? "bg-muted text-muted-foreground"
                }`}
              >
                {activeTrack.tag}
              </span>
            </div>
          </div>

          <div className="relative w-full overflow-hidden rounded-xl border bg-muted aspect-video mb-5">
            {isPlaying ? (
              <iframe
                key={`${activeTrack.id}`}
                ref={iframeRef}
                src={embedSrc}
                title={activeTrack.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute inset-0 w-full h-full"
              />
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                <Radio className="size-8 text-muted-foreground/40" />
                <p className="text-xs text-muted-foreground/60">
                  Pressione play para começar a ouvir
                </p>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrev}
              disabled={!!customTrack}
              className="flex items-center gap-1.5"
            >
              <SkipBack className="size-3.5" />
              Anterior
            </Button>

            <Button
              size="sm"
              onClick={handlePlay}
              className="flex-1 max-w-35"
            >
              {isPlaying ? "⏸ Pausar" : "▶ Play"}
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={handleNext}
              disabled={!!customTrack}
              className="flex items-center gap-1.5"
            >
              Próxima
              <SkipForward className="size-3.5" />
            </Button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="rounded-2xl border bg-card/40 p-5"
        >
          <p className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
            <Link2 className="size-4 text-muted-foreground" />
            Adicionar URL do YouTube
          </p>
          <div className="flex gap-2">
            <Input
              placeholder="https://youtube.com/watch?v=..."
              value={customUrl}
              onChange={(e) => {
                setCustomUrl(e.target.value);
                setUrlError("");
              }}
              onKeyDown={(e) => e.key === "Enter" && handleApplyUrl()}
              className="text-sm h-9"
            />
            <Button
              size="sm"
              variant={urlApplied ? "default" : "outline"}
              onClick={handleApplyUrl}
              className="shrink-0 h-9 px-3"
            >
              {urlApplied ? <Check className="size-3.5" /> : "Tocar"}
            </Button>
          </div>
          {urlError && (
            <p className="mt-1.5 text-xs text-destructive">{urlError}</p>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="rounded-2xl border bg-card/40 overflow-hidden"
        >
          <button
            className="w-full flex items-center justify-between px-5 py-4 text-sm font-medium text-foreground hover:bg-muted/30 transition-colors"
            onClick={() => setShowPlaylist((prev) => !prev)}
          >
            <span className="flex items-center gap-2">
              <Music2 className="size-4 text-muted-foreground" />
              Playlists ({LOFI_PLAYLIST.length} músicas)
            </span>
            {showPlaylist ? (
              <ChevronUp className="size-4 text-muted-foreground" />
            ) : (
              <ChevronDown className="size-4 text-muted-foreground" />
            )}
          </button>

          <AnimatePresence>
            {showPlaylist && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="overflow-hidden"
              >
                <div className="border-t">
                  {LOFI_PLAYLIST.map((track, index) => (
                    <button
                      key={track.id}
                      onClick={() => handleSelectPlaylist(index)}
                      className={`w-full flex items-center justify-between px-5 py-3 text-sm transition-colors hover:bg-muted/30 ${
                        !customTrack && currentIndex === index && isPlaying
                          ? "bg-muted/20 text-foreground"
                          : "text-muted-foreground"
                      }`}
                    >
                      <span className="flex items-center gap-3 min-w-0">
                        <span className="text-xs font-mono w-4 text-right shrink-0">
                          {!customTrack && currentIndex === index && isPlaying ? (
                            <span className="text-primary">▶</span>
                          ) : (
                            String(index + 1).padStart(2, "0")
                          )}
                        </span>
                        <span className="truncate">{track.title}</span>
                      </span>
                      <span
                        className={`ml-3 shrink-0 text-[10px] px-1.5 py-0.5 rounded-full ${
                          tagColors[track.tag] ?? "bg-muted text-muted-foreground"
                        }`}
                      >
                        {track.tag}
                      </span>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
