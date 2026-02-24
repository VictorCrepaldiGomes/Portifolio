import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
import {
  ArrowDown,
  FileText,
  Github,
  GraduationCap,
  Linkedin,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const container: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.3 },
  },
};

const item: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

const line: Variants = {
  hidden: { scaleX: 0 },
  show: { scaleX: 1, transition: { duration: 0.8, ease: "easeOut" as const } },
};

export default function Hero() {
  return (
    <section id="hero" className="relative flex min-h-svh items-center">
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="flex w-full flex-col gap-6"
      >
        {/* Availability */}
        <motion.div variants={item} className="flex items-center gap-2">
          <span className="relative flex size-2">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
          </span>
          <span className="font-mono text-xs text-muted-foreground">
            Disponível para oportunidades
          </span>
        </motion.div>

        {/* Name */}
        <div>
          <motion.h1
            variants={item}
            className="text-5xl font-bold tracking-tighter sm:text-6xl md:text-7xl lg:text-8xl"
          >
            Victor
          </motion.h1>
          <motion.h1
            variants={item}
            className="text-5xl font-bold tracking-tighter text-muted-foreground sm:text-6xl md:text-7xl lg:text-8xl"
          >
            Crepaldi<span className="text-foreground">.</span>
          </motion.h1>
        </div>

        <motion.div
          variants={line}
          className="h-px w-full max-w-50 origin-left bg-border"
        />

        {/* Role + Bio */}
        <motion.div variants={item} className="space-y-3">
          <p className="font-mono text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
            Desenvolvedor Full Stack
          </p>
          <p className="max-w-lg text-base leading-relaxed text-muted-foreground">
            Construindo experiências digitais com atenção aos detalhes,
            performance e design limpo. Atualmente na{" "}
            <span className="text-foreground font-medium">AsA Sistemas</span>.
          </p>
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          variants={item}
          className="flex flex-wrap items-center gap-3"
        >
          <Button asChild>
            <a href="#contact">Entrar em contato</a>
          </Button>
          <Button variant="outline" asChild>
            <a
              href="https://victorgomes.dev.br/diploma"
              target="_blank"
              rel="noopener noreferrer"
            >
              <GraduationCap className="size-4" />
              Diploma
            </a>
          </Button>
          <Button variant="outline" asChild>
            <a href="/curriculo.pdf" target="_blank" rel="noopener noreferrer">
              <FileText className="size-4" />
              Currículo
            </a>
          </Button>
        </motion.div>

        {/* Social */}
        <motion.div variants={item} className="flex items-center gap-1">
          <Button variant="ghost" size="icon-sm" asChild>
            <a
              href="https://github.com/VictorCrepaldiGomes"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
            >
              <Github className="size-4" />
            </a>
          </Button>
          <Button variant="ghost" size="icon-sm" asChild>
            <a
              href="https://linkedin.com/in/victor-gomes-b067a3266"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
            >
              <Linkedin className="size-4" />
            </a>
          </Button>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8, duration: 0.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <a href="#about" className="group" aria-label="Rolar para baixo">
          <ArrowDown className="size-4 animate-bounce text-muted-foreground" />
        </a>
      </motion.div>
    </section>
  );
}
