import { useState } from 'react'
import { Helmet } from 'react-helmet'
import { Link } from 'react-router-dom'
import { ArrowRight, ArrowLeft, User, Briefcase, GraduationCap, Award, Check } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { getBuilderLayout } from 'src/components/layout'
import { useExtendedResume } from 'src/lib/extended-resume-context'
import { PersonalInfoForm, ExperienceForm, EducationForm, SkillsForm } from 'src/components/resume-forms'
import { MiniPreview } from 'src/components/resume-preview'
import { TemplateSelector } from 'src/components/template-selector'
import { ATSScorePanel } from 'src/components/ats-score-panel'

// Section definitions
const SECTIONS = [
  { id: 'personal', label: 'Personal Info', icon: User, description: 'Your contact details' },
  { id: 'experience', label: 'Experience', icon: Briefcase, description: 'Your work history' },
  { id: 'education', label: 'Education', icon: GraduationCap, description: 'Your qualifications' },
  { id: 'skills', label: 'Skills', icon: Award, description: 'Your expertise' },
] as const

type SectionId = (typeof SECTIONS)[number]['id']

function ResumePage() {
  const [activeSection, setActiveSection] = useState<SectionId>('personal')
  const { isPersonalComplete, isExperienceComplete, isEducationComplete, isSkillsComplete } = useExtendedResume()

  // Map completion status
  const completionStatus: Record<SectionId, boolean> = {
    personal: isPersonalComplete,
    experience: isExperienceComplete,
    education: isEducationComplete,
    skills: isSkillsComplete,
  }

  const currentIndex = SECTIONS.findIndex((s) => s.id === activeSection)
  const canGoNext = currentIndex < SECTIONS.length - 1
  const canGoPrev = currentIndex > 0
  const allComplete = Object.values(completionStatus).every(Boolean)

  const goToNext = () => {
    if (canGoNext) {
      setActiveSection(SECTIONS[currentIndex + 1].id)
    }
  }

  const goToPrev = () => {
    if (canGoPrev) {
      setActiveSection(SECTIONS[currentIndex - 1].id)
    }
  }

  // Render the active form
  const renderForm = () => {
    switch (activeSection) {
      case 'personal':
        return <PersonalInfoForm />
      case 'experience':
        return <ExperienceForm />
      case 'education':
        return <EducationForm />
      case 'skills':
        return <SkillsForm />
      default:
        return null
    }
  }

  const activeInfo = SECTIONS.find((s) => s.id === activeSection)!

  return (
    <>
      <Helmet>
        <title>Build Your Resume — BeatTheATS</title>
        <meta name="description" content="Create your ATS-optimized resume with our guided step-by-step editor." />
      </Helmet>

      <div className="container py-8">
        <div className="grid gap-8 lg:grid-cols-[1fr,380px]">
          {/* Editor Panel */}
          <section aria-label="Resume editor" className="order-2 lg:order-1">
            <div className="shadow-warm-sm rounded-lg border border-border bg-card">
              {/* Section navigation tabs */}
              <nav className="border-b border-border" aria-label="Resume sections">
                <ul className="flex overflow-x-auto">
                  {SECTIONS.map((section, index) => {
                    const isActive = section.id === activeSection
                    const isComplete = completionStatus[section.id]

                    return (
                      <li key={section.id} className="flex-shrink-0">
                        <button
                          type="button"
                          onClick={() => setActiveSection(section.id)}
                          className={`relative flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors ${
                            isActive ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
                          }`}
                          aria-current={isActive ? 'step' : undefined}
                        >
                          <span
                            className={`flex h-6 w-6 items-center justify-center rounded-full text-xs ${
                              isComplete
                                ? 'bg-accent text-accent-foreground'
                                : isActive
                                ? 'bg-primary text-primary-foreground'
                                : 'bg-muted text-muted-foreground'
                            }`}
                          >
                            {isComplete ? <Check className="h-3 w-3" /> : index + 1}
                          </span>
                          <span className="hidden sm:inline">{section.label}</span>
                          {/* Active indicator */}
                          {isActive && (
                            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent" aria-hidden="true" />
                          )}
                        </button>
                      </li>
                    )
                  })}
                </ul>
              </nav>

              {/* Form area */}
              <div className="p-6">
                <header className="mb-6">
                  <h1 className="mb-1 font-display text-xl font-medium text-foreground">{activeInfo.label}</h1>
                  <p className="text-sm text-muted-foreground">{activeInfo.description}</p>
                </header>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeSection}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                  >
                    {renderForm()}
                  </motion.div>
                </AnimatePresence>

                {/* Navigation buttons */}
                <div className="mt-8 flex items-center justify-between border-t border-border pt-6">
                  <button
                    type="button"
                    onClick={goToPrev}
                    disabled={!canGoPrev}
                    className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground disabled:opacity-50"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Previous
                  </button>

                  <div className="flex items-center gap-3">
                    {allComplete && (
                      <Link
                        to="/preview"
                        className="shadow-warm-sm hover:shadow-warm inline-flex h-10 items-center gap-2 rounded-md bg-accent px-6 text-sm font-medium text-accent-foreground transition-all hover:bg-accent/90"
                      >
                        Preview Resume
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    )}
                    {canGoNext ? (
                      <button
                        type="button"
                        onClick={goToNext}
                        className="shadow-warm-sm hover:shadow-warm inline-flex h-10 items-center gap-2 rounded-md bg-primary px-6 text-sm font-medium text-primary-foreground transition-all hover:bg-primary/90"
                      >
                        Next
                        <ArrowRight className="h-4 w-4" />
                      </button>
                    ) : !allComplete ? (
                      <span className="text-sm text-muted-foreground">Complete all sections to preview</span>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Preview Panel */}
          <aside aria-label="Resume preview" className="order-1 lg:sticky lg:top-24 lg:order-2 lg:self-start">
            <div className="shadow-warm overflow-hidden rounded-lg border border-border bg-white">
              <div className="aspect-[1/1.414] overflow-hidden">
                <MiniPreview scale={0.5} />
              </div>
            </div>
            <div className="mt-3 flex items-center justify-between">
              <p className="text-xs text-muted-foreground">Live preview</p>
              {allComplete && (
                <Link to="/preview" className="text-xs font-medium text-accent hover:text-accent/80">
                  Open full preview →
                </Link>
              )}
            </div>

            {/* Compact Template Selector */}
            <div className="mt-6 rounded-lg border border-border bg-card p-4">
              <TemplateSelector compact />
            </div>

            {/* Compact ATS Score */}
            <div className="mt-4">
              <ATSScorePanel compact />
            </div>
          </aside>
        </div>
      </div>
    </>
  )
}

ResumePage.getLayout = getBuilderLayout

export default ResumePage
