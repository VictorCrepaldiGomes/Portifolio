import { motion } from "framer-motion";
import {
  ArrowUpRight,
  BriefcaseBusiness,
  GraduationCap,
  MapPin,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import SectionHeading from "@/components/section-heading";

const skillGroups = [
  {
    label: "Frontend",
    skills: [
      "React",
      "Next.js",
      "TypeScript",
      "JavaScript",
      "Tailwind CSS",
      "Styled-Components",
    ],
  },
  {
    label: "Backend",
    skills: ["Node.js", "Prisma", "MongoDB", "Firebase", "REST APIs"],
  },
  {
    label: "Ferramentas",
    skills: ["Git", "Docker", "Python", "Vite"],
  },
];

const profileDetails = [
  {
    label: "Localização",
    value: "Dracena, São Paulo",
    icon: MapPin,
  },
  {
    label: "Formação",
    value: "ADS — FUNDEC",
    icon: GraduationCap,
  },
  {
    label: "Atuação",
    value: "Desenvolvedor Júnior",
    icon: BriefcaseBusiness,
  },
];

export default function About() {
  return (
    <section id="about">
      <SectionHeading
        title="Sobre"
        description="Uma visão rápida sobre minha trajetória, foco e stack principal."
      />

      <div className="mt-10 grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        <motion.article
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="space-y-4 rounded-2xl border bg-card/40 p-6 md:p-8"
        >
          <p className="leading-relaxed text-muted-foreground">
            Tenho 22 anos e sou formado em Análise e Desenvolvimento de Sistemas
            pela FUNDEC. Atualmente atuo como Desenvolvedor Júnior na AsA
            Sistemas de Computação, trabalhando com React, TypeScript e
            Styled-Components.
          </p>
          <p className="leading-relaxed text-muted-foreground">
            Minha trajetória inclui experiências com suporte técnico, estágios e
            projetos pessoais que me deram uma visão completa do desenvolvimento
            de software — do frontend ao backend. Busco sempre entregar
            experiências limpas, rápidas e bem pensadas.
          </p>
          <div className="grid gap-3 pt-2 md:grid-cols-3">
            {profileDetails.map((item) => (
              <div
                key={item.label}
                className="min-w-0 rounded-xl border bg-background/60 p-3"
              >
                <item.icon className="size-4 text-muted-foreground" />
                <p className="mt-2 text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
                  {item.label}
                </p>
                <p className="text-sm leading-snug break-words [overflow-wrap:anywhere] text-foreground">
                  {item.value}
                </p>
              </div>
            ))}
          </div>
        </motion.article>

        <motion.aside
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="rounded-2xl border bg-card/40 px-6 py-6"
        >
          <div className="space-y-5">
            <Avatar className="size-24 border border-border/80 shadow-sm">
              <AvatarImage
                src="https://github.com/VictorCrepaldiGomes.png?size=240"
                alt="Foto de Victor Crepaldi Gomes"
              />
              <AvatarFallback className="text-base font-semibold tracking-wide">
                VC
              </AvatarFallback>
            </Avatar>

            <div className="space-y-1">
              <h3 className="text-base font-semibold tracking-tight text-foreground">
                Victor Crepaldi Gomes
              </h3>
              <p className="text-sm text-muted-foreground">
                Desenvolvedor Full Stack
              </p>
            </div>

            <div className="space-y-3">
              {profileDetails.map((item) => (
                <div
                  key={`profile-${item.label}`}
                  className="min-w-0 flex items-start gap-3 text-sm"
                >
                  <item.icon className="mt-0.5 size-4 text-muted-foreground" />
                  <div className="min-w-0">
                    <p className="text-muted-foreground">{item.label}</p>
                    <p className="leading-snug break-words [overflow-wrap:anywhere] text-foreground">
                      {item.value}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-2 pt-1">
              <Button size="sm" asChild>
                <a href="#contact">Falar comigo</a>
              </Button>
              <Button size="sm" variant="outline" asChild>
                <a
                  href="/curriculo.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(event) => {
                    event.preventDefault();
                    window.open("/curriculo.pdf", "_blank", "noopener,noreferrer");
                  }}
                  className="inline-flex items-center gap-1.5"
                >
                  Currículo
                  <ArrowUpRight className="size-3.5" />
                </a>
              </Button>
            </div>
          </div>
        </motion.aside>
      </div>

      <Separator className="my-10" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="space-y-6"
      >
        <h3 className="text-sm font-medium text-foreground">Tecnologias</h3>
        {skillGroups.map((group) => (
          <div
            key={group.label}
            className="rounded-xl border bg-card/30 px-4 py-4 sm:px-5"
          >
            <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
              {group.label}
            </p>
            <div className="flex flex-wrap gap-2">
              {group.skills.map((skill) => (
                <Badge key={skill} variant="secondary">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
        ))}
      </motion.div>
    </section>
  );
}
