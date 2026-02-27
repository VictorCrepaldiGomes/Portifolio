import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import SectionHeading from "@/components/section-heading";

type TimelineItem = {
  kind: "work" | "education";
  title: string;
  organization: string;
  period: string;
  description: string;
  tags: string[];
  current?: boolean;
};

const timelineItems: TimelineItem[] = [
  {
    kind: "work",
    title: "Desenvolvedor Júnior",
    organization: "AsA Sistemas de Computação",
    period: "Mai 2025 — Presente",
    description:
      "Desenvolvimento de interfaces web com React, TypeScript e Styled-Components. Atuação em projetos internos focando em qualidade de código e experiência do usuário.",
    tags: ["React", "TypeScript", "Styled-Components"],
    current: true,
  },
  {
    kind: "work",
    title: "Analista de Suporte Técnico",
    organization: "AsA Sistemas de Computação",
    period: "Ago 2024 — Mai 2025",
    description:
      "Suporte técnico a clientes, análise e resolução de problemas em sistemas, documentação de processos e atendimento em campo.",
    tags: ["Suporte", "Análise", "Documentação"],
  },
  {
    kind: "work",
    title: "Técnico",
    organization: "TOB Distribuição",
    period: "Jun 2024 — Ago 2024",
    description:
      "Atuação na área técnica com manutenção e suporte a sistemas internos da distribuidora.",
    tags: ["Suporte", "Manutenção"],
  },
  {
    kind: "work",
    title: "Estagiário",
    organization: "FUNDEC",
    period: "Abr 2024",
    description:
      "Estágio curricular com atuação em projetos acadêmicos e suporte ao departamento de TI da instituição.",
    tags: ["Estágio", "TI"],
  },
  {
    kind: "education",
    title: "Análise e Desenvolvimento de Sistemas",
    organization: "FUNDEC",
    period: "2022 — 2024",
    description:
      "Formação superior com foco em desenvolvimento web, banco de dados e fundamentos de engenharia de software.",
    tags: ["ADS", "Banco de Dados", "Engenharia de Software"],
  },
];

export default function Experience() {
  return (
    <section id="experience">
      <SectionHeading
        title="Experiência"
        description="Trajetória profissional e formação na mesma linha do tempo."
      />

      <div className="relative mt-10 space-y-6">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute bottom-2 left-2 top-2 w-px bg-border"
        />

        {timelineItems.map((item, index) => {
          const isEducation = item.kind === "education";

          return (
            <motion.article
              key={`${item.kind}-${item.organization}-${item.period}`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              className="relative pl-8"
            >
              <span
                aria-hidden="true"
                className={`absolute left-0 top-4 flex size-4 items-center justify-center rounded-full border bg-background ${
                  item.current ? "border-foreground" : "border-border"
                }`}
              >
                <span
                  className={`size-1.5 rounded-full ${
                    item.current ? "bg-foreground" : "bg-muted-foreground/70"
                  }`}
                />
              </span>

              <div className="rounded-xl border bg-card/30 p-5 sm:p-6">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
                    {item.period}
                  </span>
                  {item.current && (
                    <Badge variant="secondary" className="text-[10px] uppercase">
                      Atual
                    </Badge>
                  )}
                  {isEducation && (
                    <Badge variant="secondary" className="text-[10px] uppercase">
                      Formação
                    </Badge>
                  )}
                </div>

                <div className="mt-3">
                  <h3 className="font-medium text-foreground">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {item.organization}
                  </p>
                </div>

                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {item.description}
                </p>

                <div className="mt-4 flex flex-wrap gap-1.5">
                  {item.tags.map((tag) => (
                    <Badge key={`${item.period}-${tag}`} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </motion.article>
          );
        })}
      </div>
    </section>
  );
}
