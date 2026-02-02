import { motion } from 'framer-motion'
import { cn } from 'src/lib/utils'

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

/**
 * A minimal, elegant loading spinner.
 */
export function Spinner({ size = 'md', className }: SpinnerProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
  }

  return (
    <motion.div
      className={cn('relative', sizeClasses[size], className)}
      animate={{ rotate: 360 }}
      transition={{
        duration: 1,
        repeat: Infinity,
        ease: 'linear',
      }}
    >
      <div className="absolute inset-0 rounded-full border-2 border-muted" />
      <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-accent" />
    </motion.div>
  )
}

interface LoadingOverlayProps {
  message?: string
}

/**
 * Full-page loading overlay with spinner and optional message.
 */
export function LoadingOverlay({ message = 'Loading...' }: LoadingOverlayProps) {
  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <Spinner size="lg" />
      <p className="mt-4 text-sm text-muted-foreground">{message}</p>
    </motion.div>
  )
}

interface ButtonSpinnerProps {
  className?: string
}

/**
 * Inline spinner for buttons - matches button text size.
 */
export function ButtonSpinner({ className }: ButtonSpinnerProps) {
  return (
    <motion.span
      className={cn('inline-block h-4 w-4', className)}
      animate={{ rotate: 360 }}
      transition={{
        duration: 0.8,
        repeat: Infinity,
        ease: 'linear',
      }}
    >
      <svg className="h-full w-full" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" strokeOpacity="0.25" />
        <path d="M12 2C6.477 2 2 6.477 2 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    </motion.span>
  )
}
