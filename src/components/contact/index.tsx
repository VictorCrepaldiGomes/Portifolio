import { motion } from "framer-motion";
import {
  ArrowUpRight,
  Github,
  Linkedin,
  MapPin,
  MessageCircle,
  Phone,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import SectionHeading from "@/components/section-heading";

const links = [
  {
    label: "GitHub",
    value: "VictorCrepaldiGomes",
    href: "https://github.com/VictorCrepaldiGomes",
    icon: Github,
    hint: "Projetos e código",
  },
  {
    label: "LinkedIn",
    value: "Victor Crepaldi Gomes",
    href: "https://linkedin.com/in/victor-gomes-b067a3266",
    icon: Linkedin,
    hint: "Networking e carreira",
  },
  {
    label: "Telefone",
    value: "+55 (18) 99791-6114",
    href: "tel:+5518997916114",
    icon: Phone,
    hint: "Contato direto",
  },
  {
    label: "Localização",
    value: "Dracena, São Paulo",
    href: "https://maps.google.com/?q=Dracena,SP",
    icon: MapPin,
    hint: "Base de atuação",
  },
];

export default function Contact() {
  return (
    <section id="contact">
      <SectionHeading
        title="Contato"
        description="Vamos conversar? Entre em contato por qualquer um dos canais abaixo."
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="mt-10 rounded-xl border bg-card/25 p-5 sm:p-6"
      >
        <p className="text-sm leading-relaxed text-muted-foreground">
          Estou disponível para novas oportunidades e projetos com foco em
          produto, performance e qualidade visual.
        </p>
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <Badge variant="secondary" className="text-[10px] uppercase">
            Resposta rápida
          </Badge>
          <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
            <MessageCircle className="size-3.5" />
            LinkedIn e telefone
          </span>
        </div>
      </motion.div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {links.map((link, index) => (
          <motion.a
            key={link.label}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.08 }}
            href={link.href}
            target={link.href.startsWith("http") ? "_blank" : undefined}
            rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
            className="group rounded-xl border bg-card/20 p-4 hover:bg-card/40"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex min-w-0 items-start gap-3">
                <span className="inline-flex size-8 items-center justify-center rounded-full border bg-background">
                  <link.icon className="size-4 text-muted-foreground" />
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-foreground">
                    {link.label}
                  </p>
                  <p className="text-xs text-muted-foreground">{link.hint}</p>
                  <p className="mt-1 text-sm break-words [overflow-wrap:anywhere] text-foreground">
                    {link.value}
                  </p>
                </div>
              </div>
              <ArrowUpRight className="mt-1 size-4 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </div>
          </motion.a>
        ))}
      </div>
    </section>
  );
}
