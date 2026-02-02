import { Link, useLocation } from 'react-router-dom'
import { FileText } from 'lucide-react'

// Progress steps for the resume builder flow
const BUILDER_STEPS = [
  { path: '/start', label: 'Start' },
  { path: '/resume', label: 'Build' },
  { path: '/preview', label: 'Preview' },
]

function ProgressIndicator() {
  const location = useLocation()
  const currentStepIndex = BUILDER_STEPS.findIndex((step) => location.pathname.startsWith(step.path))

  // Only show progress indicator on builder pages
  if (currentStepIndex === -1) return null

  return (
    <nav aria-label="Resume builder progress" className="hidden items-center gap-1 sm:flex">
      {BUILDER_STEPS.map((step, index) => {
        const isComplete = index < currentStepIndex
        const isCurrent = index === currentStepIndex
        const isAccessible = index <= currentStepIndex

        return (
          <div key={step.path} className="flex items-center">
            {index > 0 && (
              <div
                className={`mx-2 h-px w-6 transition-colors ${isComplete ? 'bg-accent' : 'bg-border'}`}
                aria-hidden="true"
              />
            )}
            {isAccessible ? (
              <Link
                to={step.path}
                className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                  isCurrent
                    ? 'bg-secondary text-foreground'
                    : isComplete
                    ? 'text-accent hover:text-accent/80'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
                aria-current={isCurrent ? 'step' : undefined}
              >
                {step.label}
              </Link>
            ) : (
              <span className="px-3 py-1.5 text-sm text-muted-foreground/50">{step.label}</span>
            )}
          </div>
        )
      })}
    </nav>
  )
}

export function Header() {
  const location = useLocation()
  const isLanding = location.pathname === '/'

  return (
    <header
      className={`fixed left-0 top-0 z-50 w-full transition-colors ${
        isLanding ? 'bg-transparent' : 'border-b border-border/50 bg-background/95 backdrop-blur-sm'
      }`}
    >
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 text-foreground transition-opacity hover:opacity-80">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary">
            <FileText className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="font-display text-lg font-semibold tracking-tight">Craftfolio</span>
        </Link>

        {/* Center: Progress indicator (only in builder flow) */}
        <ProgressIndicator />

        {/* Right side: CTA or auth */}
        <div className="flex items-center gap-3">
          {isLanding ? (
            <Link
              to="/start"
              className="shadow-warm-sm hover:shadow-warm inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition-all hover:bg-primary/90"
            >
              Start Building
            </Link>
          ) : (
            <Link
              to="/signup"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Save Progress
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}
