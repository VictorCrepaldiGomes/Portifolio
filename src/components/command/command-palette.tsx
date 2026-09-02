import { useCallback } from 'react'
import {
  ArrowUp,
  Check,
  Copy,
  FileText,
  Gamepad2,
  Languages,
  Mail,
  Monitor,
  Moon,
  Music,
  Sun,
} from 'lucide-react'

import { navigation, profile } from '@/content/profile'
import { projects } from '@/content/projects'
import { useI18n } from '@/lib/i18n'
import { useSelectedProject } from '@/lib/url-state'
import { useTheme } from '@/hooks/use-theme'
import { useClipboard, useScrollToSection } from '@/hooks/use-interactions'
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from '@/components/ui/command'
import { GithubIcon, LinkedinIcon } from '@/components/primitives/brand-icons'
import { useEggs } from '@/components/easter-eggs/egg-context'
import { useMusic } from '@/components/music/music-context'
import { useCommandPalette } from './command-context'

export function CommandPalette() {
  const { open, setOpen } = useCommandPalette()
  const { t, tx, lang, setLang } = useI18n()
  const { theme, setTheme } = useTheme()
  const scrollToSection = useScrollToSection()
  const [, setSelectedProject] = useSelectedProject()
  const { copied, copy } = useClipboard()
  const { setSnakeOpen } = useEggs()
  const { setOpen: setMusicOpen } = useMusic()

  const run = useCallback(
    (action: () => void) => {
      setOpen(false)
      requestAnimationFrame(action)
    },
    [setOpen],
  )

  return (
    <CommandDialog
      open={open}
      onOpenChange={setOpen}
      title={t('a11y.openCommand')}
      description={t('cmd.placeholder')}
      className="top-[12vh] translate-y-0 sm:max-w-[560px]"
    >
      <CommandInput placeholder={t('cmd.placeholder')} />
      <CommandList className="max-h-[min(60vh,420px)]">
        <CommandEmpty>{t('cmd.empty')}</CommandEmpty>

        <CommandGroup heading={t('cmd.nav')}>
          {navigation.map((item) => (
            <CommandItem
              key={item.id}
              value={`${tx(item.label)} ${item.id}`}
              onSelect={() => run(() => scrollToSection(item.id))}
            >
              <span className="text-index text-muted-foreground w-5">{item.index}</span>
              <span>{tx(item.label)}</span>
            </CommandItem>
          ))}
          <CommandItem
            value="top inicio home topo"
            onSelect={() => run(() => window.scrollTo({ top: 0, behavior: 'smooth' }))}
          >
            <ArrowUp />
            <span>{t('cmd.top')}</span>
          </CommandItem>
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading={t('cmd.projects')}>
          {projects.map((project) => (
            <CommandItem
              key={project.slug}
              value={`${project.title} ${project.stack.join(' ')}`}
              onSelect={() =>
                run(() => {
                  void setSelectedProject(project.slug)
                })
              }
            >
              <span className="text-muted-foreground nums-tabular w-9 text-[11px]">
                {project.year}
              </span>
              <span>{project.title}</span>
              <CommandShortcut className="truncate">{project.stack[0]}</CommandShortcut>
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading={t('cmd.actions')}>
          <CommandItem
            value="copiar email copy mail contato"
            onSelect={() => {
              void copy(profile.email)
            }}
          >
            {copied ? <Check className="text-brand" /> : <Copy />}
            <span>{copied ? t('contact.copied') : t('cmd.copyEmail')}</span>
            <CommandShortcut>{profile.email}</CommandShortcut>
          </CommandItem>

          <CommandItem
            value="musica music youtube lofi tocar play"
            onSelect={() => run(() => setMusicOpen(true))}
          >
            <Music />
            <span>{t('cmd.music')}</span>
          </CommandItem>

          <CommandItem
            value="curriculo resume cv"
            onSelect={() => run(() => window.open(profile.resume, '_blank', 'noopener,noreferrer'))}
          >
            <FileText />
            <span>{t('cmd.resume')}</span>
          </CommandItem>

          <CommandItem
            value="tema claro light theme"
            onSelect={() => setTheme('light')}
          >
            <Sun />
            <span>{t('cmd.theme.light')}</span>
            {theme === 'light' && <Check className="text-brand ml-auto size-4" />}
          </CommandItem>
          <CommandItem value="tema escuro dark theme" onSelect={() => setTheme('dark')}>
            <Moon />
            <span>{t('cmd.theme.dark')}</span>
            {theme === 'dark' && <Check className="text-brand ml-auto size-4" />}
          </CommandItem>
          <CommandItem value="tema sistema system theme" onSelect={() => setTheme('system')}>
            <Monitor />
            <span>{t('cmd.theme.system')}</span>
            {theme === 'system' && <Check className="text-brand ml-auto size-4" />}
          </CommandItem>

          <CommandItem
            value="idioma language portugues english"
            onSelect={() => setLang(lang === 'pt' ? 'en' : 'pt')}
          >
            <Languages />
            <span>{lang === 'pt' ? t('cmd.lang.en') : t('cmd.lang.pt')}</span>
          </CommandItem>
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading={t('cmd.links')}>
          <CommandItem
            value="github codigo"
            onSelect={() => run(() => window.open(profile.github, '_blank', 'noopener,noreferrer'))}
          >
            <GithubIcon className="size-4" />
            <span>GitHub</span>
          </CommandItem>
          <CommandItem
            value="linkedin carreira"
            onSelect={() =>
              run(() => window.open(profile.linkedin, '_blank', 'noopener,noreferrer'))
            }
          >
            <LinkedinIcon className="size-4" />
            <span>LinkedIn</span>
          </CommandItem>
          <CommandItem
            value="email contato"
            onSelect={() => run(() => window.open(`mailto:${profile.email}`, '_self'))}
          >
            <Mail />
            <span>{profile.email}</span>
          </CommandItem>
        </CommandGroup>

        <CommandGroup>
          <CommandItem
            value="snake jogo game secret"
            onSelect={() => run(() => setSnakeOpen(true))}
          >
            <Gamepad2 />
            <span>{t('egg.snake.title')}</span>
            <CommandShortcut>↑↑↓↓←→←→BA</CommandShortcut>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  )
}
