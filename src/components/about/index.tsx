import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
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

export default function About() {
  return (
    <section id="about">
      <SectionHeading title="Sobre" />

      <div className="mt-10 grid gap-10 md:grid-cols-[2fr_1fr]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="space-y-4"
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
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="space-y-4"
        >
          <h3 className="text-sm font-medium text-foreground">Detalhes</h3>
          <dl className="space-y-3 text-sm">
            <div>
              <dt className="text-muted-foreground">Localização</dt>
              <dd className="text-foreground">Dracena, São Paulo</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Formação</dt>
              <dd className="text-foreground">ADS — FUNDEC</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Foco</dt>
              <dd className="text-foreground">Full Stack</dd>
            </div>
          </dl>
        </motion.div>
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
          <div key={group.label}>
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
