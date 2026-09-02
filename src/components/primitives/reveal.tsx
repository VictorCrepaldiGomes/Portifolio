import { motion, type HTMLMotionProps } from 'motion/react'

import { cn } from '@/lib/utils'
import { drawLine, revealVariants, staggerItem, staggerVariants, viewport } from '@/lib/motion'

export function Reveal({
  className,
  delay = 0,
  children,
  ...props
}: HTMLMotionProps<'div'> & { delay?: number }) {
  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={viewport}
      variants={revealVariants}
      transition={delay ? { delay } : undefined}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  )
}

export function RevealGroup({
  className,
  stagger = 0.06,
  delayChildren = 0,
  children,
  ...props
}: HTMLMotionProps<'div'> & { stagger?: number; delayChildren?: number }) {
  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={viewport}
      variants={staggerVariants(stagger, delayChildren)}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  )
}

export function RevealItem({ className, children, ...props }: HTMLMotionProps<'div'>) {
  return (
    <motion.div variants={staggerItem} className={className} {...props}>
      {children}
    </motion.div>
  )
}

export function MaskText({
  lines,
  className,
  lineClassName,
  stagger = 0.08,
  as: Tag = 'div',
}: {
  lines: readonly React.ReactNode[]
  className?: string
  lineClassName?: string
  stagger?: number
  as?: 'div' | 'h1' | 'h2' | 'p'
}) {
  const MotionTag = motion[Tag]

  return (
    <MotionTag
      initial="hidden"
      whileInView="show"
      viewport={viewport}
      variants={staggerVariants(stagger)}
      className={className}
    >
      {lines.map((line, index) => (
        <span key={index} className="block overflow-hidden pb-[0.08em]">
          <motion.span
            variants={{
              hidden: { y: '110%' },
              show: {
                y: '0%',
                transition: { duration: 0.85, ease: [0.16, 1, 0.3, 1] },
              },
            }}
            className={cn('block', lineClassName)}
          >
            {line}
          </motion.span>
        </span>
      ))}
    </MotionTag>
  )
}

export function RuleLine({ className }: { className?: string }) {
  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={viewport}
      variants={drawLine}
      className={cn('bg-rule h-px w-full origin-left', className)}
    />
  )
}
