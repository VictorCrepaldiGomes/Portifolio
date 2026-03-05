import { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { RotateCcw, Play, Pause, Trophy, Gamepad2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import SectionHeading from "@/components/section-heading";

const GRID = 20;
const CELL = 20;
const CANVAS_SIZE = GRID * CELL;

type Point = { x: number; y: number };
type Direction = "UP" | "DOWN" | "LEFT" | "RIGHT";

const INITIAL_SNAKE: Point[] = [
  { x: 10, y: 10 },
  { x: 9, y: 10 },
  { x: 8, y: 10 },
];
const INITIAL_DIR: Direction = "RIGHT";
const TICK_MS = 130;

function randomFood(snake: Point[]): Point {
  let point: Point;
  do {
    point = {
      x: Math.floor(Math.random() * GRID),
      y: Math.floor(Math.random() * GRID),
    };
  } while (snake.some((s) => s.x === point.x && s.y === point.y));
  return point;
}

const DIR_DELTA: Record<Direction, Point> = {
  UP: { x: 0, y: -1 },
  DOWN: { x: 0, y: 1 },
  LEFT: { x: -1, y: 0 },
  RIGHT: { x: 1, y: 0 },
};

const OPPOSITE: Record<Direction, Direction> = {
  UP: "DOWN",
  DOWN: "UP",
  LEFT: "RIGHT",
  RIGHT: "LEFT",
};

export default function Jogo() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const snakeRef = useRef<Point[]>(INITIAL_SNAKE.map((p) => ({ ...p })));
  const dirRef = useRef<Direction>(INITIAL_DIR);
  const nextDirRef = useRef<Direction>(INITIAL_DIR);
  const foodRef = useRef<Point>(randomFood(INITIAL_SNAKE));
  const tickRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const [status, setStatus] = useState<"idle" | "playing" | "paused" | "over">("idle");
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    try {
      return parseInt(localStorage.getItem("snake-hs") ?? "0", 10);
    } catch {
      return 0;
    }
  });

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const isDark = document.documentElement.classList.contains("dark");

    ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

    ctx.strokeStyle = isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)";
    ctx.lineWidth = 0.5;
    for (let i = 0; i <= GRID; i++) {
      ctx.beginPath();
      ctx.moveTo(i * CELL, 0);
      ctx.lineTo(i * CELL, CANVAS_SIZE);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i * CELL);
      ctx.lineTo(CANVAS_SIZE, i * CELL);
      ctx.stroke();
    }

    const food = foodRef.current;
    ctx.fillStyle = isDark ? "#f87171" : "#ef4444";
    ctx.beginPath();
    ctx.roundRect(
      food.x * CELL + 3,
      food.y * CELL + 3,
      CELL - 6,
      CELL - 6,
      4
    );
    ctx.fill();

    const snake = snakeRef.current;
    snake.forEach((seg, i) => {
      const alpha = i === 0 ? 1 : Math.max(0.4, 1 - (i / snake.length) * 0.6);
      ctx.fillStyle = isDark
        ? `rgba(167, 243, 208, ${alpha})`
        : `rgba(16, 185, 129, ${alpha})`;
      ctx.beginPath();
      ctx.roundRect(seg.x * CELL + 1, seg.y * CELL + 1, CELL - 2, CELL - 2, i === 0 ? 5 : 3);
      ctx.fill();
    });

  }, []);

  const step = useCallback(() => {
    const dir = nextDirRef.current;
    dirRef.current = dir;
    const head = snakeRef.current[0];
    const delta = DIR_DELTA[dir];
    const next: Point = {
      x: head.x + delta.x,
      y: head.y + delta.y,
    };

    if (next.x < 0 || next.x >= GRID || next.y < 0 || next.y >= GRID) {
      setStatus("over");
      return;
    }

    if (snakeRef.current.some((s) => s.x === next.x && s.y === next.y)) {
      setStatus("over");
      return;
    }

    const newSnake = [next, ...snakeRef.current];
    const food = foodRef.current;

    if (next.x === food.x && next.y === food.y) {
      foodRef.current = randomFood(newSnake);
      setScore((prev) => {
        const ns = prev + 10;
        setHighScore((hs) => {
          const newHs = Math.max(hs, ns);
          try {
            localStorage.setItem("snake-hs", String(newHs));
          } catch {
            void 0;
          }
          return newHs;
        });
        return ns;
      });
    } else {
      newSnake.pop();
    }

    snakeRef.current = newSnake;
    draw();
  }, [draw]);

  const reset = useCallback(() => {
    if (tickRef.current) clearInterval(tickRef.current);
    snakeRef.current = INITIAL_SNAKE.map((p) => ({ ...p }));
    dirRef.current = INITIAL_DIR;
    nextDirRef.current = INITIAL_DIR;
    foodRef.current = randomFood(INITIAL_SNAKE);
    setScore(0);
    setStatus("idle");
    draw();
  }, [draw]);

  const startGame = useCallback(() => {
    if (tickRef.current) clearInterval(tickRef.current);
    snakeRef.current = INITIAL_SNAKE.map((p) => ({ ...p }));
    dirRef.current = INITIAL_DIR;
    nextDirRef.current = INITIAL_DIR;
    foodRef.current = randomFood(INITIAL_SNAKE);
    setScore(0);
    setStatus("playing");
    draw();
  }, [draw]);

  useEffect(() => {
    if (status === "playing") {
      tickRef.current = setInterval(step, TICK_MS);
    } else {
      if (tickRef.current) clearInterval(tickRef.current);
    }
    return () => {
      if (tickRef.current) clearInterval(tickRef.current);
    };
  }, [status, step]);

  useEffect(() => {
    draw();
  }, [draw]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const map: Record<string, Direction> = {
        ArrowUp: "UP",
        ArrowDown: "DOWN",
        ArrowLeft: "LEFT",
        ArrowRight: "RIGHT",
        w: "UP",
        W: "UP",
        s: "DOWN",
        S: "DOWN",
        a: "LEFT",
        A: "LEFT",
        d: "RIGHT",
        D: "RIGHT",
      };
      const newDir = map[e.key];
      if (newDir && newDir !== OPPOSITE[dirRef.current]) {
        e.preventDefault();
        nextDirRef.current = newDir;
      }
      if (e.key === " ") {
        e.preventDefault();
        setStatus((prev) => {
          if (prev === "playing") return "paused";
          if (prev === "paused") return "playing";
          return prev;
        });
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const touchStartRef = useRef<{ x: number; y: number } | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    const t = e.touches[0];
    touchStartRef.current = { x: t.clientX, y: t.clientY };
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStartRef.current) return;
    const t = e.changedTouches[0];
    const dx = t.clientX - touchStartRef.current.x;
    const dy = t.clientY - touchStartRef.current.y;
    touchStartRef.current = null;
    if (Math.abs(dx) < 10 && Math.abs(dy) < 10) return;
    const dir: Direction =
      Math.abs(dx) > Math.abs(dy)
        ? dx > 0 ? "RIGHT" : "LEFT"
        : dy > 0 ? "DOWN" : "UP";
    if (dir !== OPPOSITE[dirRef.current]) nextDirRef.current = dir;
  };

  const pressDir = (dir: Direction) => {
    if (status !== "playing") return;
    if (dir !== OPPOSITE[dirRef.current]) nextDirRef.current = dir;
  };

  const togglePause = () => {
    setStatus((prev) =>
      prev === "playing" ? "paused" : prev === "paused" ? "playing" : prev
    );
  };

  return (
    <section id="game">
      <SectionHeading
        title="Minijogo"
        description="O clássico jogo da cobrinha, jogue um pouco para relaxar!"
      />

      <div className="mt-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="rounded-2xl border bg-card/40 p-6 md:p-8"
        >
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <Gamepad2 className="size-4 text-muted-foreground" />
              <span className="text-sm font-medium text-foreground">Snake</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <Trophy className="size-3.5 text-amber-500" />
                <span className="text-xs text-muted-foreground font-mono">
                  {String(highScore).padStart(4, "0")}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs text-muted-foreground">Pontos</span>
                <span className="text-xs font-mono font-semibold text-foreground">
                  {String(score).padStart(4, "0")}
                </span>
              </div>
            </div>
          </div>

          <div className="relative mx-auto" style={{ width: CANVAS_SIZE, maxWidth: "100%" }}>
            <canvas
              ref={canvasRef}
              width={CANVAS_SIZE}
              height={CANVAS_SIZE}
              className="rounded-xl border block w-full"
              style={{ imageRendering: "pixelated", maxWidth: "100%" }}
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
            />

            {status !== "playing" && (
              <div className="absolute inset-0 rounded-xl flex flex-col items-center justify-center gap-4 bg-background/75 backdrop-blur-sm">
                {status === "over" && (
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-center"
                  >
                    <p className="text-2xl font-bold text-foreground">Você perdeu!</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Pontuação: <span className="font-semibold text-foreground">{score}</span>
                    </p>
                  </motion.div>
                )}
                {status === "paused" && (
                  <p className="text-xl font-bold text-foreground">Pausado</p>
                )}
                {status === "idle" && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center px-4"
                  >
                    <p className="text-lg font-semibold text-foreground mb-1">Jogo da Cobrinha</p>
                    <p className="text-sm text-muted-foreground">
                      Setas ou WASD para mover · Espaço para pausar
                    </p>
                  </motion.div>
                )}
                <div className="flex gap-2">
                  {(status === "idle" || status === "over") && (
                    <Button size="sm" onClick={startGame} className="gap-1.5">
                      <Play className="size-3.5" />
                      {status === "over" ? "Jogar novamente" : "Começar"}
                    </Button>
                  )}
                  {status === "paused" && (
                    <Button size="sm" onClick={togglePause} className="gap-1.5">
                      <Play className="size-3.5" />
                      Continuar
                    </Button>
                  )}
                  {status === "over" && (
                    <Button variant="outline" size="sm" onClick={reset} className="gap-1.5">
                      <RotateCcw className="size-3.5" />
                      Reset
                    </Button>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="mt-4 flex items-center justify-between">
            <p className="text-xs text-muted-foreground hidden sm:block">
              ↑ ↓ ← → ou WASD · Espaço para pausar
            </p>
            <div className="flex gap-2 ml-auto">
              {status === "playing" && (
                <Button variant="outline" size="sm" onClick={togglePause} className="gap-1.5">
                  <Pause className="size-3.5" />
                  Pausar
                </Button>
              )}
              {status === "paused" && (
                <Button variant="outline" size="sm" onClick={togglePause} className="gap-1.5">
                  <Play className="size-3.5" />
                  Continuar
                </Button>
              )}
              {(status === "playing" || status === "paused") && (
                <Button variant="ghost" size="sm" onClick={reset} className="gap-1.5">
                  <RotateCcw className="size-3.5" />
                  Reiniciar
                </Button>
              )}
            </div>
          </div>

          <div className="mt-5 flex flex-col items-center gap-1 sm:hidden">
            <button
              onPointerDown={(e) => { e.preventDefault(); pressDir("UP"); }}
              className="w-12 h-12 rounded-xl border bg-muted flex items-center justify-center text-lg active:bg-muted/60 select-none touch-none"
            >
              ↑
            </button>
            <div className="flex gap-1">
              <button
                onPointerDown={(e) => { e.preventDefault(); pressDir("LEFT"); }}
                className="w-12 h-12 rounded-xl border bg-muted flex items-center justify-center text-lg active:bg-muted/60 select-none touch-none"
              >
                ←
              </button>
              <button
                onPointerDown={(e) => { e.preventDefault(); pressDir("DOWN"); }}
                className="w-12 h-12 rounded-xl border bg-muted flex items-center justify-center text-lg active:bg-muted/60 select-none touch-none"
              >
                ↓
              </button>
              <button
                onPointerDown={(e) => { e.preventDefault(); pressDir("RIGHT"); }}
                className="w-12 h-12 rounded-xl border bg-muted flex items-center justify-center text-lg active:bg-muted/60 select-none touch-none"
              >
                →
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
