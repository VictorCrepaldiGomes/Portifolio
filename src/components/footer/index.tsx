import { useState } from "react";
import { ArrowUpRight, Github, Heart, Linkedin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";

const footerNav = [
  { label: "Início", href: "#hero" },
  { label: "Música", href: "#music" },
  { label: "Sobre", href: "#about" },
  { label: "Experiência", href: "#experience" },
  { label: "Projetos", href: "#projects" },
  { label: "Jogo", href: "#game" },
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
  const [, setHeartClicks] = useState(0);
  const [isLoveDialogOpen, setIsLoveDialogOpen] = useState(false);

  const handleHeartClick = () => {
    setHeartClicks((previousClicks) => {
      const nextClicks = previousClicks + 1;

      if (nextClicks >= 5) {
        setIsLoveDialogOpen(true);
        return 0;
      }

      return nextClicks;
    });
  };

  return (
    <footer className="mx-auto max-w-3xl px-6 pb-10 pt-6">
      <Separator className="mb-8" />

      <div className="rounded-2xl border bg-card/40 p-6 sm:p-7">
        <div className="grid gap-8 sm:grid-cols-[1fr_auto]">
          <div className="space-y-4">
            <a
              href="#hero"
              className="inline-flex items-center text-sm font-semibold tracking-tight text-foreground"
            >
              vc.
            </a>

            <p className="max-w-md text-sm leading-relaxed text-muted-foreground">
              Desenvolvedor Full Stack focado em interfaces limpas, rápidas e
              consistentes da primeira dobra ao último detalhe.
            </p>

            <nav className="flex flex-wrap gap-2">
              {footerNav.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="rounded-full border border-border/70 px-3 py-1 text-xs text-muted-foreground hover:border-border hover:text-foreground"
                >
                  {link.label}
                </a>
              ))}
            </nav>
          </div>

          <div className="space-y-4">
            <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
              Redes
            </p>

            <div className="flex flex-wrap items-center gap-2">
              {socialLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={link.label}
                  className="inline-flex items-center gap-1.5 rounded-full border border-border/70 px-3 py-1.5 text-xs text-foreground hover:bg-accent"
                >
                  <link.icon className="size-3.5" />
                  {link.label}
                </a>
              ))}
            </div>

            <Badge variant="secondary" className="text-[11px] font-medium">
              Disponível para novas oportunidades
            </Badge>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-3 border-t border-border/80 pt-5 sm:flex-row sm:items-center sm:justify-between">
          <span className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} Victor Crepaldi Gomes
          </span>

          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
              Feito com
              <button
                type="button"
                onClick={handleHeartClick}
                className="inline-flex items-center justify-center rounded-sm p-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                aria-label="Coração secreto"
              >
                <Heart className="heart-easter-egg size-3.5" />
              </button>
              React, Tailwind e shadcn/ui
            </span>

            <a
              href="#hero"
              className="inline-flex items-center gap-1 text-xs text-foreground hover:text-muted-foreground"
            >
              Topo
              <ArrowUpRight className="size-3.5" />
            </a>
          </div>
        </div>
      </div>

      <Dialog open={isLoveDialogOpen} onOpenChange={setIsLoveDialogOpen}>
        <DialogContent className="max-w-[calc(100%-3rem)] sm:max-w-xl">
          <DialogHeader className="text-left">
            <DialogTitle className="text-xl leading-tight font-semibold sm:text-3xl">
              Então você me encontrou!
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-5 text-sm leading-relaxed text-muted-foreground sm:text-lg">
            <p>
              Se você encontrou isso, é porque estava explorando meu portfólio
              com muita atenção!
            </p>

            <p>
              Cada linha de código nesse projeto e em todos os outros que
              desenvolvi é graças a uma pessoa incrível que nunca deixou de me
              apoiar e acreditar em mim.
            </p>

            <p>
              Você é minha inspiração diária, minha motivação para ser melhor a
              cada dia. Obrigado por acreditar em mim e nos meus sonhos!
            </p>

            <p className="font-semibold text-foreground">Te amo para sempre!</p>

            <p>
              Maria Victória, meu amor! <span aria-hidden="true">❤️</span>
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </footer>
  );
}
