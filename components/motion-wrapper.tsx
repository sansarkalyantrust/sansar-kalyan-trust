'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'

interface MotionProps {
  children: React.ReactNode
  className?: string
  delay?: number
  duration?: number
  once?: boolean
}

export function FadeIn({ children, className, delay = 0, duration = 0.5, once = true }: MotionProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once, margin: '-50px' })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : { opacity: 0 }}
      transition={{ duration, delay }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export function SlideUp({ children, className, delay = 0, duration = 0.5, once = true }: MotionProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once, margin: '-50px' })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ duration, delay, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export function SlideLeft({ children, className, delay = 0, duration = 0.5, once = true }: MotionProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once, margin: '-50px' })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: 40 }}
      animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 40 }}
      transition={{ duration, delay, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export function SlideRight({ children, className, delay = 0, duration = 0.5, once = true }: MotionProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once, margin: '-50px' })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -40 }}
      animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -40 }}
      transition={{ duration, delay, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export function ScaleIn({ children, className, delay = 0, duration = 0.5, once = true }: MotionProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once, margin: '-50px' })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
      transition={{ duration, delay, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export function StaggerChildren({ children, className, staggerDelay = 0.1 }: { children: React.ReactNode; className?: string; staggerDelay?: number }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-50px' })

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={{
        visible: {
          transition: { staggerChildren: staggerDelay },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export function StaggerItem({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export function CountUp({ target, duration = 2, suffix = '' }: { target: number; duration?: number; suffix?: string }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  return (
    <motion.span
      ref={ref}
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : {}}
    >
      {isInView ? (
        <Counter target={target} duration={duration} suffix={suffix} />
      ) : (
        '0' + suffix
      )}
    </motion.span>
  )
}

function Counter({ target, duration, suffix }: { target: number; duration: number; suffix: string }) {
  return (
    <span>
      {target.toLocaleString('en-IN')}{suffix}
    </span>
  )
}
