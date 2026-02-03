/**
 * ATS Score Panel Component
 * Displays ATS compatibility score with breakdown and suggestions
 */
import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Target,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  AlertTriangle,
  Info,
  CheckCircle2,
  Sparkles,
  FileText,
} from 'lucide-react'
import { ATSScore, calculateATSScore, getScoreColor, getScoreLabel, Suggestion } from 'src/lib/ats-scoring'
import { useExtendedResume } from 'src/lib/extended-resume-context'
import { cn } from 'src/lib/utils'

interface ATSScorePanelProps {
  className?: string
  compact?: boolean
}

export function ATSScorePanel({ className, compact = false }: ATSScorePanelProps) {
  const { data } = useExtendedResume()
  const [jobDescription, setJobDescription] = useState('')
  const [showDetails, setShowDetails] = useState(!compact)
  const [showSuggestions, setShowSuggestions] = useState(true)

  // Calculate score
  const score = useMemo<ATSScore>(() => {
    return calculateATSScore(data, jobDescription)
  }, [data, jobDescription])

  // Score circle progress
  const circumference = 2 * Math.PI * 45
  const strokeDashoffset = circumference - (score.overall / 100) * circumference

  if (compact) {
    return <CompactScorePanel score={score} className={className} onExpand={() => setShowDetails(true)} />
  }

  return (
    <div className={cn('rounded-lg border border-border bg-card', className)}>
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border p-4">
        <div className="flex items-center gap-2">
          <Target className="h-5 w-5 text-primary" />
          <h3 className="font-display font-semibold">ATS Score</h3>
        </div>
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="rounded p-1 hover:bg-muted"
          aria-label={showDetails ? 'Collapse' : 'Expand'}
        >
          {showDetails ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>
      </div>

      <AnimatePresence>
        {showDetails && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="p-4">
              {/* Score Circle */}
              <div className="mb-6 flex justify-center">
                <div className="relative">
                  <svg className="h-32 w-32 -rotate-90 transform">
                    {/* Background circle */}
                    <circle
                      cx="64"
                      cy="64"
                      r="45"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="none"
                      className="text-muted"
                    />
                    {/* Progress circle */}
                    <motion.circle
                      cx="64"
                      cy="64"
                      r="45"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="none"
                      strokeLinecap="round"
                      className={getScoreColor(score.overall)}
                      strokeDasharray={circumference}
                      initial={{ strokeDashoffset: circumference }}
                      animate={{ strokeDashoffset }}
                      transition={{ duration: 1, ease: 'easeOut' }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className={cn('text-3xl font-bold', getScoreColor(score.overall))}>{score.overall}</span>
                    <span className="text-xs text-muted-foreground">{getScoreLabel(score.overall)}</span>
                  </div>
                </div>
              </div>

              {/* Score Breakdown */}
              <div className="mb-6 space-y-3">
                <ScoreBar label="Completeness" value={score.breakdown.completeness} />
                <ScoreBar label="Keywords" value={score.breakdown.keywords} />
                <ScoreBar label="Formatting" value={score.breakdown.formatting} />
                <ScoreBar label="Content" value={score.breakdown.content} />
              </div>

              {/* Job Description Input */}
              <div className="mb-4">
                <label className="mb-2 flex items-center gap-2 text-sm font-medium">
                  <FileText className="h-4 w-4" />
                  Job Description (Optional)
                </label>
                <textarea
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="Paste a job description to analyze keyword match..."
                  className="h-24 w-full resize-none rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                />
                {jobDescription && (
                  <p className="mt-1 text-xs text-muted-foreground">
                    Analyzing {score.matchedKeywords.length + score.missingKeywords.length} keywords
                  </p>
                )}
              </div>

              {/* Keyword Match */}
              {jobDescription && (
                <KeywordMatchSection matched={score.matchedKeywords} missing={score.missingKeywords} />
              )}

              {/* Suggestions */}
              {score.suggestions.length > 0 && (
                <div className="border-t border-border pt-4">
                  <button
                    onClick={() => setShowSuggestions(!showSuggestions)}
                    className="mb-3 flex w-full items-center justify-between text-sm font-medium"
                  >
                    <span className="flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-accent" />
                      Suggestions ({score.suggestions.length})
                    </span>
                    {showSuggestions ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </button>

                  <AnimatePresence>
                    {showSuggestions && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="space-y-2 overflow-hidden"
                      >
                        {score.suggestions.slice(0, 5).map((suggestion) => (
                          <SuggestionCard key={suggestion.id} suggestion={suggestion} />
                        ))}
                        {score.suggestions.length > 5 && (
                          <p className="text-center text-xs text-muted-foreground">
                            +{score.suggestions.length - 5} more suggestions
                          </p>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ===== SUB-COMPONENTS =====

interface ScoreBarProps {
  label: string
  value: number
}

function ScoreBar({ label, value }: ScoreBarProps) {
  return (
    <div>
      <div className="mb-1 flex justify-between text-xs">
        <span className="text-muted-foreground">{label}</span>
        <span className={cn('font-medium', getScoreColor(value))}>{value}%</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-muted">
        <motion.div
          className={cn(
            'h-full rounded-full',
            value >= 80 ? 'bg-accent' : value >= 60 ? 'bg-yellow-500' : 'bg-destructive',
          )}
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
      </div>
    </div>
  )
}

interface SuggestionCardProps {
  suggestion: Suggestion
}

function SuggestionCard({ suggestion }: SuggestionCardProps) {
  const Icon =
    suggestion.category === 'critical' ? AlertCircle : suggestion.category === 'important' ? AlertTriangle : Info

  const bgColor =
    suggestion.category === 'critical'
      ? 'bg-destructive/10 border-destructive/20'
      : suggestion.category === 'important'
      ? 'bg-yellow-500/10 border-yellow-500/20'
      : 'bg-primary/10 border-primary/20'

  const iconColor =
    suggestion.category === 'critical'
      ? 'text-destructive'
      : suggestion.category === 'important'
      ? 'text-yellow-600'
      : 'text-primary'

  return (
    <div className={cn('rounded-md border p-3', bgColor)}>
      <div className="flex gap-2">
        <Icon className={cn('mt-0.5 h-4 w-4 flex-shrink-0', iconColor)} />
        <div>
          <p className="text-sm font-medium">{suggestion.message}</p>
          {suggestion.action && <p className="mt-1 text-xs text-muted-foreground">{suggestion.action}</p>}
        </div>
      </div>
    </div>
  )
}

interface KeywordMatchSectionProps {
  matched: string[]
  missing: string[]
}

function KeywordMatchSection({ matched, missing }: KeywordMatchSectionProps) {
  const [showAll, setShowAll] = useState(false)
  const displayMatched = showAll ? matched : matched.slice(0, 10)
  const displayMissing = showAll ? missing : missing.slice(0, 10)

  return (
    <div className="mb-4 space-y-3">
      {/* Matched Keywords */}
      {matched.length > 0 && (
        <div>
          <p className="mb-2 flex items-center gap-1 text-xs font-medium text-accent">
            <CheckCircle2 className="h-3 w-3" />
            Matched Keywords ({matched.length})
          </p>
          <div className="flex flex-wrap gap-1">
            {displayMatched.map((keyword) => (
              <span key={keyword} className="rounded bg-accent/10 px-2 py-0.5 text-xs text-accent">
                {keyword}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Missing Keywords */}
      {missing.length > 0 && (
        <div>
          <p className="mb-2 flex items-center gap-1 text-xs font-medium text-destructive">
            <AlertCircle className="h-3 w-3" />
            Missing Keywords ({missing.length})
          </p>
          <div className="flex flex-wrap gap-1">
            {displayMissing.map((keyword) => (
              <span key={keyword} className="rounded bg-destructive/10 px-2 py-0.5 text-xs text-destructive">
                {keyword}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Show More */}
      {(matched.length > 10 || missing.length > 10) && (
        <button onClick={() => setShowAll(!showAll)} className="text-xs font-medium text-primary hover:underline">
          {showAll ? 'Show less' : 'Show all keywords'}
        </button>
      )}
    </div>
  )
}

interface CompactScorePanelProps {
  score: ATSScore
  className?: string
  onExpand?: () => void
}

function CompactScorePanel({ score, className, onExpand }: CompactScorePanelProps) {
  return (
    <button
      onClick={onExpand}
      className={cn(
        'flex items-center gap-3 rounded-lg border border-border bg-card p-3 transition-colors hover:bg-muted/50',
        className,
      )}
    >
      <div className="relative h-12 w-12">
        <svg className="h-12 w-12 -rotate-90 transform">
          <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="4" fill="none" className="text-muted" />
          <circle
            cx="24"
            cy="24"
            r="20"
            stroke="currentColor"
            strokeWidth="4"
            fill="none"
            strokeLinecap="round"
            className={getScoreColor(score.overall)}
            strokeDasharray={2 * Math.PI * 20}
            strokeDashoffset={2 * Math.PI * 20 * (1 - score.overall / 100)}
          />
        </svg>
        <span
          className={cn(
            'absolute inset-0 flex items-center justify-center text-sm font-bold',
            getScoreColor(score.overall),
          )}
        >
          {score.overall}
        </span>
      </div>
      <div className="text-left">
        <p className="text-sm font-medium">ATS Score</p>
        <p className="text-xs text-muted-foreground">{getScoreLabel(score.overall)}</p>
      </div>
    </button>
  )
}

export { CompactScorePanel }
