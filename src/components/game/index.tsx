import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Gamepad2, Brain } from "lucide-react";
import SectionHeading from "@/components/section-heading";
import SnakeGame from "./snake";
import MemoryGame from "./memory";

const GAMES = [
  {
    id: "snake",
    label: "Jogo da Cobra",
    icon: Gamepad2,
    description: "Guie a cobra e colete pontos!",
    component: <SnakeGame />,
  },
  {
    id: "memory",
    label: "Memória",
    icon: Brain,
    description: "Repita a sequência de cores!",
    component: <MemoryGame />,
  },
];

const variants = {
  enter: (dir: number) => ({
    x: dir > 0 ? 60 : -60,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
    transition: { duration: 0.3, ease: [0.32, 0.72, 0, 1] as const },
  },
  exit: (dir: number) => ({
    x: dir > 0 ? -60 : 60,
    opacity: 0,
    transition: { duration: 0.2, ease: [0.32, 0.72, 0, 1] as const },
  }),
};

export default function Jogo() {
  const [current, setCurrent] = useState(0);
  const [dir, setDir]         = useState(0);

  const navigate = (delta: number) => {
    setDir(delta);
    setCurrent((prev) => (prev + delta + GAMES.length) % GAMES.length);
  };

  const game = GAMES[current];
  const Icon = game.icon;

  return (
    <section id="game">
      <SectionHeading
        title="Minijogos"
        description="Dê uma pausa e jogue um pouco!"
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
              <Icon className="size-4 text-muted-foreground" />
              <span className="text-sm font-medium text-foreground">{game.label}</span>
              <span className="hidden sm:inline text-xs text-muted-foreground">
                — {game.description}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => navigate(-1)}
                className="size-7 rounded-lg border bg-background flex items-center justify-center hover:bg-accent transition-colors"
                aria-label="Jogo anterior"
              >
                <ChevronLeft className="size-4" />
              </button>

              <div className="flex gap-1.5 items-center">
                {GAMES.map((g, i) => (
                  <button
                    key={g.id}
                    onClick={() => { setDir(i > current ? 1 : -1); setCurrent(i); }}
                    className={[
                      "rounded-full transition-all duration-200",
                      i === current
                        ? "w-4 h-1.5 bg-foreground"
                        : "w-1.5 h-1.5 bg-muted-foreground/40 hover:bg-muted-foreground/70",
                    ].join(" ")}
                    aria-label={`Ir para ${g.label}`}
                  />
                ))}
              </div>

              <button
                onClick={() => navigate(1)}
                className="size-7 rounded-lg border bg-background flex items-center justify-center hover:bg-accent transition-colors"
                aria-label="Próximo jogo"
              >
                <ChevronRight className="size-4" />
              </button>
            </div>
          </div>

          <div className="overflow-hidden">
            <AnimatePresence mode="wait" custom={dir}>
              <motion.div
                key={game.id}
                custom={dir}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
              >
                {game.component}
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
