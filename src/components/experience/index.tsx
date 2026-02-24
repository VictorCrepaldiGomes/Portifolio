import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import SectionHeading from "@/components/section-heading";

const experiences = [
  {
    role: "Desenvolvedor Júnior",
    company: "AsA Sistemas de Computação",
    period: "Mai 2025 — Presente",
    description:
      "Desenvolvimento de interfaces web com React, TypeScript e Styled-Components. Atuação em projetos internos focando em qualidade de código e experiência do usuário.",
    tags: ["React", "TypeScript", "Styled-Components"],
  },
  {
    role: "Analista de Suporte Técnico",
    company: "AsA Sistemas de Computação",
    period: "Ago 2024 — Mai 2025",
    description:
      "Suporte técnico a clientes, análise e resolução de problemas em sistemas, documentação de processos e atendimento em campo.",
    tags: ["Suporte", "Análise", "Documentação"],
  },
  {
    role: "Técnico",
    company: "TOB Distribuição",
    period: "Jun 2024 — Ago 2024",
    description:
      "Atuação na área técnica com manutenção e suporte a sistemas internos da distribuidora.",
    tags: ["Suporte", "Manutenção"],
  },
  {
    role: "Estagiário",
    company: "FUNDEC",
    period: "Abr 2024",
    description:
      "Estágio curricular com atuação em projetos acadêmicos e suporte ao departamento de TI da instituição.",
    tags: ["Estágio", "TI"],
  },
];

const education = [
  {
    degree: "Análise e Desenvolvimento de Sistemas",
    institution: "FUNDEC",
    period: "2022 — 2024",
  },
];

export default function Experience() {
  return (
    <section id="experience">
      <SectionHeading
        title="Experiência"
        description="Trajetória profissional e formação acadêmica."
      />

      <div className="mt-10 space-y-0">
        {experiences.map((exp, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <div className="grid gap-1 py-6 md:grid-cols-[160px_1fr] md:gap-8">
              <span className="text-sm text-muted-foreground">
                {exp.period}
              </span>
              <div className="space-y-3">
                <div>
                  <h3 className="font-medium text-foreground">{exp.role}</h3>
                  <p className="text-sm text-muted-foreground">{exp.company}</p>
                </div>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {exp.description}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {exp.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
            {index < experiences.length - 1 && <Separator />}
          </motion.div>
        ))}
      </div>

      <Separator className="my-10" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <h3 className="mb-6 text-sm font-medium text-foreground">Formação</h3>
        {education.map((edu, index) => (
          <div
            key={index}
            className="grid gap-1 md:grid-cols-[160px_1fr] md:gap-8"
          >
            <span className="text-sm text-muted-foreground">{edu.period}</span>
            <div>
              <h4 className="font-medium text-foreground">{edu.degree}</h4>
              <p className="text-sm text-muted-foreground">{edu.institution}</p>
            </div>
          </div>
        ))}
      </motion.div>
    </section>
  );
}
