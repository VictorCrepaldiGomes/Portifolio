import type { Transition, Variants } from 'motion/react'

type Bezier = [number, number, number, number]

export const ease = {
  out: [0.22, 1, 0.36, 1] as Bezier,
  expo: [0.16, 1, 0.3, 1] as Bezier,
  inOut: [0.83, 0, 0.17, 1] as Bezier,
} as const

export const duration = {
  fast: 0.16,
  base: 0.32,
  slow: 0.55,
  slower: 0.85,
} as const

export const spring = {
  soft: { type: 'spring', stiffness: 240, damping: 28, mass: 0.9 },
  snappy: { type: 'spring', stiffness: 420, damping: 36, mass: 0.7 },
  magnetic: { type: 'spring', stiffness: 180, damping: 16, mass: 0.5 },
  layout: { type: 'spring', stiffness: 320, damping: 38, mass: 0.8 },
} satisfies Record<string, Transition>

export const viewport = { once: true, margin: '0px 0px -12% 0px' } as const

export const revealVariants = {
  hidden: { opacity: 0, y: 14 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: duration.slow, ease: ease.out },
  },
} satisfies Variants

export const staggerVariants = (stagger = 0.06, delayChildren = 0) =>
  ({
    hidden: {},
    show: {
      transition: { staggerChildren: stagger, delayChildren },
    },
  }) satisfies Variants

export const staggerItem = {
  hidden: { opacity: 0, y: 12 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: duration.slow, ease: ease.out },
  },
} satisfies Variants

export const maskLine = {
  hidden: { y: '110%' },
  show: {
    y: '0%',
    transition: { duration: duration.slower, ease: ease.expo },
  },
} satisfies Variants

export const drawLine = {
  hidden: { scaleX: 0 },
  show: {
    scaleX: 1,
    transition: { duration: duration.slower, ease: ease.expo },
  },
} satisfies Variants

export const transitions = {
  fast: { duration: duration.fast, ease: ease.out },
  base: { duration: duration.base, ease: ease.out },
  slow: { duration: duration.slow, ease: ease.out },
} satisfies Record<string, Transition>
