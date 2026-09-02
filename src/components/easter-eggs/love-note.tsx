import { motion } from 'motion/react'
import { Heart } from 'lucide-react'

import { useI18n } from '@/lib/i18n'
import { ease } from '@/lib/motion'
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog'

const NOTE = {
  pt: {
    heading: 'Maria Victória, meu amor',
    lines: [
      'Cada linha de código deste projeto — e de todos os outros que eu já construí — existe por causa de uma pessoa incrível que nunca deixou de me apoiar e de acreditar em mim.',
      'Você é minha inspiração diária, minha motivação pra ser melhor a cada dia. Obrigado por acreditar em mim e nos meus sonhos.',
    ],
    signature: 'Com amor, Victor',
  },
  en: {
    heading: 'Maria Victória, my love',
    lines: [
      'Every line of code in this project — and in every other one I have ever built — exists because of an incredible person who never stopped supporting me and believing in me.',
      'You are my daily inspiration, my reason to be better every day. Thank you for believing in me and in my dreams.',
    ],
    signature: 'With love, Victor',
  },
} as const

export function LoveNote({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const { t, lang } = useI18n()
  const note = NOTE[lang]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="overflow-hidden sm:max-w-lg">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 -top-24 h-48 bg-[radial-gradient(ellipse_at_center,--theme(--color-brand/18%),transparent_70%)]"
        />

        <div className="relative space-y-6 py-2">
          <motion.div
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, ease: ease.out }}
            className="flex justify-center"
          >
            <Heart className="text-brand size-7 fill-current" />
          </motion.div>

          <div className="space-y-2 text-center">
            <p className="text-label text-muted-foreground">{t('egg.love.found')}</p>
            <DialogTitle className="text-title">{note.heading}</DialogTitle>
          </div>

          <DialogDescription asChild>
            <div className="space-y-4">
              {note.lines.map((line, index) => (
                <motion.p
                  key={line.slice(0, 20)}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, ease: ease.out, delay: 0.15 + index * 0.12 }}
                  className="text-body text-muted-foreground text-center text-pretty"
                >
                  {line}
                </motion.p>
              ))}
            </div>
          </DialogDescription>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="text-label text-brand text-center"
          >
            {note.signature}
          </motion.p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
