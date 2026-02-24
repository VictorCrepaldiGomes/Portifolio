import { motion } from "framer-motion";
import { ArrowUpRight, Github, Linkedin, MapPin, Phone } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import SectionHeading from "@/components/section-heading";

const links = [
  {
    label: "GitHub",
    value: "VictorCrepaldiGomes",
    href: "https://github.com/VictorCrepaldiGomes",
    icon: Github,
  },
  {
    label: "LinkedIn",
    value: "Victor Crepaldi Gomes",
    href: "https://linkedin.com/in/victor-gomes-b067a3266",
    icon: Linkedin,
  },
  {
    label: "Telefone",
    value: "+55 (18) 99791-6114",
    href: "tel:+5518997916114",
    icon: Phone,
  },
  {
    label: "Localização",
    value: "Dracena, São Paulo",
    href: "https://maps.google.com/?q=Dracena,SP",
    icon: MapPin,
  },
];

export default function Contact() {
  return (
    <section id="contact">
      <SectionHeading
        title="Contato"
        description="Vamos conversar? Entre em contato por qualquer um dos canais abaixo."
      />

      <div className="mt-10 space-y-0">
        {links.map((link, index) => (
          <motion.div
            key={link.label}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <a
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-between py-4"
            >
              <div className="flex items-center gap-3">
                <link.icon className="size-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {link.label}
                  </p>
                  <p className="text-sm text-muted-foreground">{link.value}</p>
                </div>
              </div>
              <ArrowUpRight className="size-4 text-muted-foreground opacity-0 transition-all group-hover:opacity-100" />
            </a>
            {index < links.length - 1 && <Separator />}
          </motion.div>
        ))}
      </div>
    </section>
  );
}
