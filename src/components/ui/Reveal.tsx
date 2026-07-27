import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { usePrefersReducedMotion } from '../../lib/hooks';
import { cn } from '../../lib/cn';

interface RevealProps {
  children: ReactNode;
  /** Seconds. Used to stagger list items by ~0.06 each. */
  delay?: number;
  // Written as `| undefined` because exactOptionalPropertyTypes is on and this is
  // forwarded from callers that may not set it.
  className?: string | undefined;
}

/**
 * Scroll reveal, used with restraint: opacity and an 18px rise, once, nothing else.
 *
 * Under `prefers-reduced-motion` the element is rendered plainly rather than
 * animated to its final state — no transform is ever applied, so there is nothing
 * to snap.
 */
export function Reveal({ children, delay = 0, className }: RevealProps) {
  const reducedMotion = usePrefersReducedMotion();

  if (reducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}

interface RevealListProps {
  children: ReactNode[];
  className?: string | undefined;
  itemClassName?: string | undefined;
  /** Seconds between each item. Kept at 60ms so a four-item row finishes fast. */
  step?: number;
}

/** Staggers a set of siblings without repeating delay maths at every call site. */
export function RevealList({
  children,
  className,
  itemClassName,
  step = 0.06,
}: RevealListProps) {
  return (
    <div className={cn(className)}>
      {children.map((child, index) => (
        <Reveal key={index} delay={index * step} className={itemClassName}>
          {child}
        </Reveal>
      ))}
    </div>
  );
}
