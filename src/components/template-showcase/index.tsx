/**
 * Template Showcase Carousel
 *
 * A 3D-style carousel showing live resume previews with spotlight effect.
 * Center template is focused, others are blurred and scaled down.
 */
import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, Shield, AlertTriangle, Pause, Play } from 'lucide-react'
import { RESUME_TEMPLATES, ResumeTemplate, ATSRiskLevel } from 'src/lib/resume-templates'
import { cn } from 'src/lib/utils'

// Sample resume data for preview
const SAMPLE_RESUME = {
  personal: {
    fullName: 'Alex Johnson',
    jobTitle: 'Senior Software Engineer',
    email: 'alex.johnson@email.com',
    phone: '(555) 123-4567',
    location: 'San Francisco, CA',
    summary:
      'Results-driven software engineer with 6+ years of experience building scalable web applications. Led teams of 5+ developers and delivered projects that increased revenue by 40%.',
  },
  experience: [
    {
      company: 'TechCorp Inc.',
      title: 'Senior Software Engineer',
      date: 'Jan 2021 - Present',
      highlights: [
        'Led development of microservices architecture serving 2M+ users',
        'Reduced API latency by 60% through optimization initiatives',
        'Mentored 4 junior developers, improving team velocity by 35%',
      ],
    },
    {
      company: 'StartupXYZ',
      title: 'Software Engineer',
      date: 'Mar 2018 - Dec 2020',
      highlights: [
        'Built React-based dashboard used by 500+ enterprise clients',
        'Implemented CI/CD pipeline reducing deployment time by 70%',
      ],
    },
  ],
  education: [
    {
      school: 'University of California, Berkeley',
      degree: 'B.S. Computer Science',
      date: '2014 - 2018',
    },
  ],
  skills: ['React', 'TypeScript', 'Node.js', 'Python', 'AWS', 'PostgreSQL', 'GraphQL', 'Docker'],
}

// Font family mappings
const FONT_FAMILIES: Record<string, string> = {
  inter: "'Inter', system-ui, sans-serif",
  georgia: "'Georgia', 'Times New Roman', serif",
  times: "'Times New Roman', Times, serif",
}

// Density settings
const DENSITY_CONFIG: Record<string, { sectionGap: string; fontSize: string; lineHeight: number }> = {
  compact: { sectionGap: '8pt', fontSize: '8pt', lineHeight: 1.35 },
  normal: { sectionGap: '10pt', fontSize: '9pt', lineHeight: 1.45 },
  spacious: { sectionGap: '12pt', fontSize: '9.5pt', lineHeight: 1.5 },
}

// ATS badge component
function ATSBadge({ risk }: { risk: ATSRiskLevel }) {
  const config = {
    safe: {
      label: 'ATS Safe',
      icon: Shield,
      className: 'bg-green-100 text-green-700 border-green-200',
    },
    caution: {
      label: 'Use Caution',
      icon: AlertTriangle,
      className: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    },
    risky: {
      label: 'High Risk',
      icon: AlertTriangle,
      className: 'bg-red-100 text-red-700 border-red-200',
    },
  }[risk]

  const Icon = config.icon

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-medium',
        config.className,
      )}
    >
      <Icon className="h-3 w-3" />
      {config.label}
    </span>
  )
}

// Mini resume preview with template styling
function MiniResumePreview({ template }: { template: ResumeTemplate }) {
  const { style } = template
  const accentColor = `hsl(${style.accentColor})`
  const fontFamily = FONT_FAMILIES[style.fontFamily]
  const density = DENSITY_CONFIG[style.density]

  // Section heading style
  const getSectionHeadingStyle = (): React.CSSProperties => {
    const base: React.CSSProperties = {
      fontSize: '10pt',
      fontWeight: 600,
      marginBottom: '6pt',
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
    }

    switch (style.sectionStyle) {
      case 'underlined':
        return { ...base, borderBottom: `2px solid ${accentColor}`, paddingBottom: '3pt' }
      case 'background':
        return { ...base, backgroundColor: `hsl(${style.accentColor} / 0.1)`, padding: '4pt 8pt' }
      case 'border-left':
        return { ...base, borderLeft: `3px solid ${accentColor}`, paddingLeft: '8pt' }
      default:
        return { ...base, color: accentColor }
    }
  }

  return (
    <div
      className="h-full w-full overflow-hidden bg-white p-6"
      style={{
        fontFamily,
        fontSize: density.fontSize,
        lineHeight: density.lineHeight,
      }}
    >
      {/* Header */}
      <div
        className={cn('mb-4 pb-3', style.showDividers && 'border-b border-gray-200')}
        style={{ textAlign: style.headerStyle === 'centered' ? 'center' : 'left' }}
      >
        <h1 className="text-lg font-bold text-gray-900" style={{ color: accentColor }}>
          {SAMPLE_RESUME.personal.fullName}
        </h1>
        <p className="text-sm text-gray-600">{SAMPLE_RESUME.personal.jobTitle}</p>
        <div
          className="mt-2 flex flex-wrap gap-3 text-xs text-gray-500"
          style={{ justifyContent: style.headerStyle === 'centered' ? 'center' : 'flex-start' }}
        >
          <span>{SAMPLE_RESUME.personal.email}</span>
          <span>•</span>
          <span>{SAMPLE_RESUME.personal.phone}</span>
        </div>
      </div>

      {/* Summary */}
      <div className="mb-4" style={{ marginBottom: density.sectionGap }}>
        <h2 style={getSectionHeadingStyle()}>Summary</h2>
        <p className="line-clamp-2 text-xs text-gray-600">{SAMPLE_RESUME.personal.summary}</p>
      </div>

      {/* Experience */}
      <div className="mb-4" style={{ marginBottom: density.sectionGap }}>
        <h2 style={getSectionHeadingStyle()}>Experience</h2>
        {SAMPLE_RESUME.experience.slice(0, 1).map((exp, idx) => (
          <div key={idx}>
            <div className="flex items-baseline justify-between">
              <span className="text-sm font-semibold text-gray-800">{exp.title}</span>
              <span className="text-xs text-gray-500">{exp.date}</span>
            </div>
            <p className="text-xs text-gray-600">{exp.company}</p>
            <ul className="mt-1 list-inside list-disc text-xs text-gray-600">
              {exp.highlights.slice(0, 2).map((h, i) => (
                <li key={i} className="truncate">
                  {h}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Skills */}
      <div>
        <h2 style={getSectionHeadingStyle()}>Skills</h2>
        <div className="flex flex-wrap gap-1.5">
          {SAMPLE_RESUME.skills.slice(0, 6).map((skill, idx) => (
            <span
              key={idx}
              className="rounded px-2 py-0.5 text-xs"
              style={{
                backgroundColor: `hsl(${style.accentColor} / 0.1)`,
                color: accentColor,
              }}
            >
              {skill}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

export function TemplateShowcase() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)
  const [direction, setDirection] = useState(0)

  // Only show safe templates for the showcase
  const showcaseTemplates = RESUME_TEMPLATES.filter((t) => t.atsRisk === 'safe' || t.atsRisk === 'caution').slice(0, 5)

  const goToNext = useCallback(() => {
    setDirection(1)
    setActiveIndex((prev) => (prev + 1) % showcaseTemplates.length)
  }, [showcaseTemplates.length])

  const goToPrev = useCallback(() => {
    setDirection(-1)
    setActiveIndex((prev) => (prev - 1 + showcaseTemplates.length) % showcaseTemplates.length)
  }, [showcaseTemplates.length])

  // Auto-cycle every 4 seconds
  useEffect(() => {
    if (!isPlaying) return
    const interval = setInterval(goToNext, 4000)
    return () => clearInterval(interval)
  }, [isPlaying, goToNext])

  // Get visible templates (current, prev, next)
  const getVisibleTemplates = () => {
    const len = showcaseTemplates.length
    const prev2 = (activeIndex - 2 + len) % len
    const prev = (activeIndex - 1 + len) % len
    const next = (activeIndex + 1) % len
    const next2 = (activeIndex + 2) % len
    return [
      { index: prev2, position: -2 },
      { index: prev, position: -1 },
      { index: activeIndex, position: 0 },
      { index: next, position: 1 },
      { index: next2, position: 2 },
    ]
  }

  const activeTemplate = showcaseTemplates[activeIndex]

  return (
    <div className="relative">
      {/* Header */}
      <div className="mb-8 text-center">
        <h2 className="font-display text-display-md text-foreground">Professional Templates</h2>
        <p className="mx-auto mt-2 max-w-lg text-muted-foreground">
          ATS-optimized designs that pass applicant tracking systems and impress recruiters
        </p>
      </div>

      {/* 3D Carousel */}
      <div className="relative mx-auto h-[420px] max-w-5xl overflow-hidden">
        {/* Cards */}
        <div className="absolute inset-0 flex items-center justify-center">
          <AnimatePresence mode="popLayout" initial={false}>
            {getVisibleTemplates().map(({ index, position }) => {
              const template = showcaseTemplates[index]
              const isCenter = position === 0
              const isAdjacent = Math.abs(position) === 1

              return (
                <motion.div
                  key={template.id}
                  className="absolute cursor-pointer"
                  initial={{
                    x: direction > 0 ? 400 : -400,
                    scale: 0.6,
                    opacity: 0,
                  }}
                  animate={{
                    x: position * 220,
                    scale: isCenter ? 1 : isAdjacent ? 0.8 : 0.6,
                    opacity: isCenter ? 1 : isAdjacent ? 0.5 : 0.25,
                    zIndex: isCenter ? 30 : isAdjacent ? 20 : 10,
                    filter: isCenter ? 'blur(0px)' : isAdjacent ? 'blur(3px)' : 'blur(5px)',
                    rotateY: position * -8,
                  }}
                  exit={{
                    x: direction > 0 ? -400 : 400,
                    scale: 0.6,
                    opacity: 0,
                  }}
                  transition={{
                    type: 'spring',
                    stiffness: 300,
                    damping: 30,
                  }}
                  onClick={() => {
                    if (position !== 0) {
                      setDirection(position > 0 ? 1 : -1)
                      setActiveIndex(index)
                    }
                  }}
                  style={{
                    transformStyle: 'preserve-3d',
                    perspective: '1000px',
                  }}
                >
                  <div
                    className={cn(
                      'w-[280px] overflow-hidden rounded-xl border-2 bg-white shadow-2xl transition-shadow',
                      isCenter ? 'border-primary shadow-primary/20' : 'border-border',
                    )}
                  >
                    {/* Preview */}
                    <div className="aspect-[1/1.2] overflow-hidden bg-white">
                      <MiniResumePreview template={template} />
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>

        {/* Navigation arrows */}
        <button
          onClick={() => {
            setIsPlaying(false)
            goToPrev()
          }}
          className="absolute left-4 top-1/2 z-40 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-card/90 text-foreground shadow-lg backdrop-blur-sm transition-all hover:scale-110 hover:bg-card"
          aria-label="Previous template"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
        <button
          onClick={() => {
            setIsPlaying(false)
            goToNext()
          }}
          className="absolute right-4 top-1/2 z-40 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-card/90 text-foreground shadow-lg backdrop-blur-sm transition-all hover:scale-110 hover:bg-card"
          aria-label="Next template"
        >
          <ChevronRight className="h-6 w-6" />
        </button>
      </div>

      {/* Template info */}
      <motion.div
        key={activeTemplate.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="mt-6 text-center"
      >
        <div className="mb-3 flex items-center justify-center gap-3">
          <h3 className="font-display text-xl font-semibold text-foreground">{activeTemplate.name}</h3>
          <ATSBadge risk={activeTemplate.atsRisk} />
        </div>
        <p className="mx-auto max-w-md text-muted-foreground">{activeTemplate.description}</p>
      </motion.div>

      {/* Dots + Play/Pause */}
      <div className="mt-6 flex items-center justify-center gap-4">
        <div className="flex gap-2">
          {showcaseTemplates.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setDirection(index > activeIndex ? 1 : -1)
                setActiveIndex(index)
                setIsPlaying(false)
              }}
              className={cn(
                'h-2 rounded-full transition-all duration-300',
                activeIndex === index ? 'w-8 bg-primary' : 'w-2 bg-border hover:bg-muted-foreground',
              )}
              aria-label={`Go to template ${index + 1}`}
            />
          ))}
        </div>
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="flex h-8 w-8 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          aria-label={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? <Pause className="h-3.5 w-3.5" /> : <Play className="ml-0.5 h-3.5 w-3.5" />}
        </button>
      </div>
    </div>
  )
}

export default TemplateShowcase
