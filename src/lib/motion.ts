import { Variants } from 'framer-motion'

/**
 * BEATTHEATS MOTION SYSTEM
 * Calm, confident animations that feel intentional — not flashy or gimmicky
 * Timing: 0.3-0.5s for micro, 0.5-0.8s for page transitions
 * Easing: Custom ease-out curves for natural deceleration
 */

// Custom easing curves
export const easings = {
  // Smooth deceleration - feels confident
  easeOut: [0.16, 1, 0.3, 1] as const,
  // Gentle entrance
  easeIn: [0.4, 0, 1, 1] as const,
  // Balanced in-out
  easeInOut: [0.4, 0, 0.2, 1] as const,
  // Soft bounce for delightful moments
  softBounce: [0.34, 1.56, 0.64, 1] as const,
}

/**
 * Fade in from below - primary entrance animation
 */
export const fadeInUp: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: easings.easeOut,
    },
  },
}

/**
 * Simple fade - for subtle elements
 */
export const fadeIn: Variants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.4,
      ease: easings.easeOut,
    },
  },
}

/**
 * Slide in from right - for cards and panels
 */
export const slideInRight: Variants = {
  hidden: {
    opacity: 0,
    x: 20,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.4,
      ease: easings.easeOut,
    },
  },
}

/**
 * Scale up - for modal/popover entrances
 */
export const scaleIn: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.95,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.3,
      ease: easings.easeOut,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    transition: {
      duration: 0.2,
      ease: easings.easeIn,
    },
  },
}

/**
 * Stagger children container - for lists
 */
export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
}

/**
 * Stagger children with faster delay
 */
export const staggerContainerFast: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.05,
    },
  },
}

/**
 * Page transition wrapper
 */
export const pageTransition: Variants = {
  initial: {
    opacity: 0,
    y: 8,
  },
  enter: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: easings.easeOut,
    },
  },
  exit: {
    opacity: 0,
    y: -8,
    transition: {
      duration: 0.2,
      ease: easings.easeIn,
    },
  },
}

/**
 * Hover scale - subtle feedback
 */
export const hoverScale = {
  scale: 1.02,
  transition: { duration: 0.2, ease: easings.easeOut },
}

/**
 * Tap scale - press feedback
 */
export const tapScale = {
  scale: 0.98,
}

/**
 * Card hover effect
 */
export const cardHover: Variants = {
  rest: {
    y: 0,
    boxShadow: '0 2px 4px 0 hsl(30 20% 10% / 4%), 0 4px 12px 0 hsl(30 20% 10% / 8%)',
  },
  hover: {
    y: -2,
    boxShadow: '0 4px 8px 0 hsl(30 20% 10% / 4%), 0 8px 24px 0 hsl(30 20% 10% / 12%)',
    transition: {
      duration: 0.2,
      ease: easings.easeOut,
    },
  },
}

/**
 * Checkmark animation - for completion states
 */
export const checkmark: Variants = {
  hidden: {
    pathLength: 0,
    opacity: 0,
  },
  visible: {
    pathLength: 1,
    opacity: 1,
    transition: {
      pathLength: { duration: 0.3, ease: easings.easeOut },
      opacity: { duration: 0.1 },
    },
  },
}

/**
 * Progress bar fill
 */
export const progressFill: Variants = {
  hidden: { scaleX: 0 },
  visible: (progress: number) => ({
    scaleX: progress,
    transition: {
      duration: 0.5,
      ease: easings.easeOut,
    },
  }),
}

/**
 * Tooltip/popover animation
 */
export const tooltip: Variants = {
  hidden: {
    opacity: 0,
    y: 4,
    scale: 0.98,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.15,
      ease: easings.easeOut,
    },
  },
  exit: {
    opacity: 0,
    y: 4,
    scale: 0.98,
    transition: {
      duration: 0.1,
    },
  },
}

/**
 * Accordion expand/collapse
 */
export const accordion: Variants = {
  collapsed: {
    height: 0,
    opacity: 0,
    transition: {
      height: { duration: 0.3, ease: easings.easeInOut },
      opacity: { duration: 0.2 },
    },
  },
  expanded: {
    height: 'auto',
    opacity: 1,
    transition: {
      height: { duration: 0.3, ease: easings.easeInOut },
      opacity: { duration: 0.2, delay: 0.1 },
    },
  },
}

/**
 * Notification slide in from top
 */
export const notification: Variants = {
  hidden: {
    opacity: 0,
    y: -20,
    scale: 0.95,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.3,
      ease: easings.softBounce,
    },
  },
  exit: {
    opacity: 0,
    y: -10,
    scale: 0.95,
    transition: {
      duration: 0.2,
      ease: easings.easeIn,
    },
  },
}
