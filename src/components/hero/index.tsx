import { motion, type Variants } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import {
  ArrowDown,
  FileText,
  Github,
  GraduationCap,
  Linkedin,
  Code,
  Database,
  Server,
  Terminal,
  Zap,
  GitBranch,
  Cloud,
} from "lucide-react";

import { Button } from "@/components/ui/button";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: "easeOut" },
  },
};

const lineVariants: Variants = {
  hidden: { scaleX: 0 },
  show: {
    scaleX: 1,
    transition: { duration: 0.8, ease: "easeOut" },
  },
};

const techs = [
  "React",
  "TypeScript",
  "Next.js",
  "Tailwind CSS",
  "Node.js",
  "Prisma",
  "Docker",
  "Python",
  "Git",
] as const;

type TechName = (typeof techs)[number];

const techIconMap: Record<TechName, LucideIcon> = {
  React: Code,
  TypeScript: Code,
  "Next.js": Cloud,
  "Tailwind CSS": Zap,
  "Node.js": Server,
  Prisma: Database,
  Docker: GitBranch,
  Python: Terminal,
  Git: GitBranch,
};

function AvailabilityBadge() {
  return (
    <motion.div variants={itemVariants} className="flex items-center gap-2">
      <span className="relative flex size-2" aria-hidden="true">
        <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-75" />
        <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
      </span>

      <span className="font-mono text-[11px] text-muted-foreground sm:text-xs">
        Disponível
      </span>
    </motion.div>
  );
}

function TechMarquee() {
  const marqueeItems = [...techs, ...techs];

  return (
    <motion.div variants={itemVariants} className="mt-2 sm:mt-4">
      <div
        className="tech-marquee"
        aria-label="Tecnologias que utilizo"
        role="list"
      >
        <div className="tech-track">
          {marqueeItems.map((tech, index) => {
            const Icon = techIconMap[tech];

            return (
              <span
                key={`${tech}-${index}`}
                className="tech-item"
                role="listitem"
                aria-hidden={index >= techs.length ? "true" : undefined}
              >
                <Icon className="tech-icon size-4" />
                {tech}
              </span>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}

function HeroActions() {
  return (
    <motion.div
      variants={itemVariants}
      className="mt-2 flex w-full flex-col gap-3 lg:flex-row lg:items-center"
    >
      <div className="flex w-full flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
        <Button className="w-full sm:w-auto" asChild>
          <a
            href="#contact"
            className="flex items-center justify-center"
            aria-label="Ir para seção de contato"
          >
            Entrar em contato
          </a>
        </Button>

        <Button className="w-full sm:w-auto" variant="outline" asChild>
          <a
            href="https://victorgomes.dev.br/diploma"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2"
          >
            <GraduationCap className="size-4" />
            Diploma
          </a>
        </Button>

        <Button className="w-full sm:w-auto" variant="outline" asChild>
          <a
            href="/curriculo.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2"
          >
            <FileText className="size-4" />
            Currículo
          </a>
        </Button>
      </div>

      <div className="flex items-center justify-center gap-2 sm:justify-start">
        <Button variant="ghost" size="icon-sm" asChild>
          <a
            href="https://github.com/VictorCrepaldiGomes"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Abrir GitHub de Victor Crepaldi Gomes"
          >
            <Github className="size-4" />
          </a>
        </Button>

        <Button variant="ghost" size="icon-sm" asChild>
          <a
            href="https://linkedin.com/in/victor-gomes-b067a3266"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Abrir LinkedIn de Victor Crepaldi Gomes"
          >
            <Linkedin className="size-4" />
          </a>
        </Button>
      </div>
    </motion.div>
  );
}

export default function Hero() {
  return (
    <section
      id="hero"
      className="relative flex min-h-svh items-center py-20 sm:py-24 lg:py-28"
      aria-label="Seção principal"
    >
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="flex w-full max-w-4xl flex-col gap-5 sm:gap-6"
      >
        <AvailabilityBadge />

        <div className="space-y-0">
          <motion.h1
            variants={itemVariants}
            className="text-5xl font-bold tracking-tighter sm:text-6xl md:text-7xl lg:text-8xl"
          >
            Victor
          </motion.h1>

          <motion.h1
            variants={itemVariants}
            className="text-5xl font-bold tracking-tighter text-muted-foreground sm:text-6xl md:text-7xl lg:text-8xl"
          >
            Crepaldi Gomes<span className="text-foreground">.</span>
          </motion.h1>
        </div>

        <motion.div
          variants={lineVariants}
          className="h-px w-full max-w-32 origin-left bg-border sm:max-w-40 md:max-w-52"
        />

        <motion.div variants={itemVariants} className="space-y-2 sm:space-y-3">
          <p className="font-mono text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground sm:text-xs">
            Desenvolvedor Full Stack
          </p>

          <p className="max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
            Construindo experiências digitais com atenção aos detalhes,
            performance e design limpo. Atualmente na{" "}
            <span className="font-medium text-foreground">AsA Sistemas</span>.
          </p>
        </motion.div>

        <TechMarquee />

        <HeroActions />
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="pointer-events-none absolute bottom-6 left-1/2 -translate-x-1/2 sm:bottom-8"
      >
        <a
          href="#about"
          className="pointer-events-auto inline-flex items-center justify-center group"
          aria-label="Rolar para a seção Sobre"
        >
          <ArrowDown className="size-4 animate-bounce text-muted-foreground transition-transform duration-200 group-hover:translate-y-0.5" />
        </a>
      </motion.div>
    </section>
  );
}
