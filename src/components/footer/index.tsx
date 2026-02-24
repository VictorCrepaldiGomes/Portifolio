import { Github, Linkedin, Heart } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

const footerNav = [
  { label: "Início", href: "#hero" },
  { label: "Sobre", href: "#about" },
  { label: "Experiência", href: "#experience" },
  { label: "Projetos", href: "#projects" },
  { label: "Contato", href: "#contact" },
];

const socialLinks = [
  {
    label: "GitHub",
    href: "https://github.com/VictorCrepaldiGomes",
    icon: Github,
  },
  {
    label: "LinkedIn",
    href: "https://linkedin.com/in/victor-gomes-b067a3266",
    icon: Linkedin,
  },
];

export default function Footer() {
  return (
    <footer className="mx-auto max-w-3xl px-6 pb-10 pt-6">
      <Separator className="mb-8" />

      <div className="grid gap-8 sm:grid-cols-[1fr_auto]">
        <div className="space-y-4">
          <a
            href="#hero"
            className="text-sm font-semibold tracking-tight text-foreground"
          >
            vc.
          </a>
          <nav className="flex flex-wrap gap-x-4 gap-y-2">
            {footerNav.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>

        <div className="flex items-start gap-1">
          {socialLinks.map((link) => (
            <Button key={link.label} variant="ghost" size="icon-sm" asChild>
              <a
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={link.label}
              >
                <link.icon className="size-4" />
              </a>
            </Button>
          ))}
        </div>
      </div>

      <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t border-border pt-6 sm:flex-row">
        <span className="text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} Victor Crepaldi Gomes
        </span>
        <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
          Feito com <Heart className="size-3 fill-current" /> usando React,
          Tailwind e shadcn/ui
        </span>
      </div>
    </footer>
  );
}
