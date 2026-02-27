import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import SectionHeading from "@/components/section-heading";

const projects = [
  {
    title: "Ignite Call",
    description:
      "Aplicação de agendamento integrada ao Google Calendar com autenticação OAuth, permitindo que usuários definam sua disponibilidade e recebam agendamentos.",
    tags: ["Next.js", "TypeScript", "Prisma", "Google APIs"],
    href: "https://github.com/VictorCrepaldiGomes/Ignite-Call-Rocketseat",
  },
  {
    title: "PizzaShop",
    description:
      "Dashboard de gerenciamento para pizzarias com métricas, pedidos em tempo real e controle de status — construído com React e shadcn/ui.",
    tags: ["React", "TypeScript", "shadcn/ui", "Tailwind CSS"],
    href: "https://github.com/VictorCrepaldiGomes/MyPizza-RocketSeat",
  },
  {
    title: "Mobile Comprar",
    description:
      "Aplicação mobile desenvolvida durante a trilha Rocketseat, focada em fluxo de compra e experiência de navegação em telas pequenas.",
    tags: ["React Native", "TypeScript", "Mobile"],
    href: "https://github.com/VictorCrepaldiGomes/Mobile-ComprarRocketseat",
  },
  {
    title: "Portfólio Pessoal",
    description:
      "Site pessoal construído com Next.js e design minimalista, focado em performance e acessibilidade.",
    tags: ["Next.js", "TypeScript", "Tailwind CSS", "shadcn/ui"],
    href: "https://github.com/VictorCrepaldiGomes/Portifolio2.0",
  },
  {
    title: "Web Scraper",
    description:
      "Ferramenta de web scraping em Python para coleta automatizada de dados de páginas web com parsing inteligente.",
    tags: ["Python", "BeautifulSoup", "Automação"],
    href: "https://github.com/VictorCrepaldiGomes/WebScraping",
  },
];

export default function Projects() {
  return (
    <section id="projects">
      <SectionHeading
        title="Projetos"
        description="Alguns dos projetos que construí."
      />

      <div className="mt-10 space-y-3">
        {projects.map((project, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.08 }}
          >
            <a
              href={project.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group block rounded-xl border bg-card/25 p-5 transition-colors hover:bg-card/40 sm:p-6"
            >
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <h3 className="font-medium text-foreground group-hover:text-muted-foreground">
                    {project.title}
                  </h3>
                  <ArrowUpRight className="size-4 text-muted-foreground opacity-0 transition-all group-hover:opacity-100 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </div>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {project.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </a>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
