import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Trophy, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

type Color = "red" | "blue" | "green" | "yellow";
type Status = "idle" | "showing" | "input" | "wrong" | "win";

const COLORS: Color[] = ["red", "blue", "green", "yellow"];

const COLOR_CONFIG: Record<Color, { bg: string; active: string; label: string }> = {
  red:    { bg: "bg-red-500/30   dark:bg-red-500/25",   active: "bg-red-500   shadow-red-400/60",   label: "Vermelho" },
  blue:   { bg: "bg-blue-500/30  dark:bg-blue-500/25",  active: "bg-blue-500  shadow-blue-400/60",  label: "Azul"     },
  green:  { bg: "bg-green-500/30 dark:bg-green-500/25", active: "bg-green-500 shadow-green-400/60", label: "Verde"    },
  yellow: { bg: "bg-yellow-400/30 dark:bg-yellow-400/25", active: "bg-yellow-400 shadow-yellow-300/60", label: "Amarelo" },
};

function flashInterval(level: number) {
  return Math.max(350, 900 - level * 40);
}

function randomColor(): Color {
  return COLORS[Math.floor(Math.random() * COLORS.length)];
}

export default function MemoryGame() {
  const [status, setStatus]           = useState<Status>("idle");
  const [sequence, setSequence]       = useState<Color[]>([]);
  const [playerIdx, setPlayerIdx]     = useState(0);
  const [activeColor, setActiveColor] = useState<Color | null>(null);
  const [score, setScore]             = useState(0);
  const [highScore, setHighScore]     = useState(() => {
    try { return parseInt(localStorage.getItem("memory-hs") ?? "0", 10); }
    catch { return 0; }
  });
  const [message, setMessage]         = useState("");
  const timeoutsRef                   = useRef<ReturnType<typeof setTimeout>[]>([]);

  const clearTimeouts = useCallback(() => {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
  }, []);

  const flashSequence = useCallback((seq: Color[]) => {
    setStatus("showing");
    setPlayerIdx(0);
    const interval = flashInterval(seq.length);

    seq.forEach((color, i) => {
      const t1 = setTimeout(() => setActiveColor(color), i * (interval + 100));
      const t2 = setTimeout(() => setActiveColor(null),  i * (interval + 100) + interval);
      timeoutsRef.current.push(t1, t2);
    });

    const done = setTimeout(() => {
      setStatus("input");
      setActiveColor(null);
    }, seq.length * (interval + 100) + 200);
    timeoutsRef.current.push(done);
  }, []);

  const startGame = useCallback(() => {
    clearTimeouts();
    const first: Color = randomColor();
    setSequence([first]);
    setScore(0);
    setPlayerIdx(0);
    setActiveColor(null);
    setMessage("Memorize a sequência!");
    setTimeout(() => flashSequence([first]), 600);
  }, [clearTimeouts, flashSequence]);

  const handlePress = useCallback((color: Color) => {
    if (status !== "input") return;

    setActiveColor(color);
    setTimeout(() => setActiveColor(null), 200);

    if (color !== sequence[playerIdx]) {
      setStatus("wrong");
      setMessage("Errou! Tente novamente.");
      clearTimeouts();
      return;
    }

    const next = playerIdx + 1;

    if (next === sequence.length) {
      const newScore = sequence.length;
      setScore(newScore);
      setHighScore((hs) => {
        const updated = Math.max(hs, newScore);
        try { localStorage.setItem("memory-hs", String(updated)); } catch { void 0; }
        return updated;
      });
      const nextSeq = [...sequence, randomColor()];
      setSequence(nextSeq);
      setStatus("showing");
      setMessage(`Ótimo! Nível ${nextSeq.length - 1}`);
      setTimeout(() => {
        setMessage("Memorize a sequência!");
        flashSequence(nextSeq);
      }, 900);
    } else {
      setPlayerIdx(next);
    }
  }, [status, sequence, playerIdx, clearTimeouts, flashSequence]);

  useEffect(() => () => clearTimeouts(), [clearTimeouts]);

  const isShowing = status === "showing";
  const canPress  = status === "input";

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <Trophy className="size-3.5 text-amber-500" />
            <span className="text-xs text-muted-foreground font-mono">
              {String(highScore).padStart(2, "0")}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-muted-foreground">Nível</span>
            <span className="text-xs font-mono font-semibold text-foreground">
              {String(score).padStart(2, "0")}
            </span>
          </div>
        </div>
        {status === "input" && (
          <span className="text-xs text-muted-foreground">
            {playerIdx + 1} / {sequence.length}
          </span>
        )}
      </div>

      <div className="relative mx-auto" style={{ maxWidth: 400 }}>
        <div
          className="grid grid-cols-2 gap-3 select-none"
          style={{ aspectRatio: "1/1" }}
        >
          {COLORS.map((color) => {
            const cfg    = COLOR_CONFIG[color];
            const isActive = activeColor === color;
            return (
              <motion.button
                key={color}
                disabled={!canPress}
                onPointerDown={(e) => { e.preventDefault(); handlePress(color); }}
                className={[
                  "rounded-2xl border transition-colors duration-100 cursor-pointer",
                  "touch-none outline-none",
                  isActive
                    ? `${cfg.active} shadow-lg`
                    : cfg.bg,
                  !canPress && "opacity-70 cursor-default",
                ].join(" ")}
                whileTap={{ scale: 0.95 }}
                animate={isActive ? { scale: [1, 0.93, 1] } : { scale: 1 }}
                transition={{ duration: 0.15 }}
              />
            );
          })}
        </div>

        <AnimatePresence>
          {(status === "idle" || status === "wrong") && (
            <motion.div
              key={status}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 rounded-2xl flex flex-col items-center justify-center gap-4 bg-background/80 backdrop-blur-sm"
            >
              {status === "wrong" && (
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-center"
                >
                  <p className="text-2xl font-bold text-foreground">Errou!</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Você chegou ao nível <span className="font-semibold text-foreground">{score}</span>
                  </p>
                </motion.div>
              )}
              {status === "idle" && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center px-4"
                >
                  <p className="text-lg font-semibold text-foreground mb-1">Memória de Cores</p>
                  <p className="text-sm text-muted-foreground">Repita a sequência de cores que piscar</p>
                </motion.div>
              )}
              <Button size="sm" onClick={startGame} className="gap-1.5">
                <Play className="size-3.5" />
                {status === "wrong" ? "Jogar novamente" : "Começar"}
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="mt-4 flex items-center justify-between min-h-7">
        <AnimatePresence mode="wait">
          {message && (
            <motion.p
              key={message}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="text-xs text-muted-foreground"
            >
              {isShowing ? "👀 " : canPress ? "🎯 " : ""}{message}
            </motion.p>
          )}
        </AnimatePresence>
        {(status === "showing" || status === "input") && (
          <Button
            variant="ghost"
            size="sm"
            className="gap-1.5 ml-auto"
            onClick={() => { clearTimeouts(); setStatus("idle"); setSequence([]); setScore(0); setMessage(""); }}
          >
            <RotateCcw className="size-3.5" />
            Reiniciar
          </Button>
        )}
      </div>
    </div>
  );
}
