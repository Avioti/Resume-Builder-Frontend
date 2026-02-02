import { useResume } from 'src/lib/resume-context'

interface MiniPreviewProps {
  scale?: number
}

export function MiniPreview({ scale = 0.4 }: MiniPreviewProps) {
  const { data, isPersonalComplete, isExperienceComplete, isEducationComplete, isSkillsComplete } = useResume()
  const { personal, experiences, education, skills } = data

  const hasContent = isPersonalComplete || isExperienceComplete || isEducationComplete || isSkillsComplete

  // Format date for display
  const formatDate = (dateStr: string, current?: boolean) => {
    if (current) return 'Present'
    if (!dateStr) return ''
    const date = new Date(dateStr + '-01')
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
  }

  if (!hasContent) {
    return (
      <div className="flex h-full flex-col rounded border border-dashed border-gray-200 bg-gray-50/50 p-4">
        <div className="mb-3 border-b border-gray-200 pb-3">
          <div className="mb-1 h-4 w-24 rounded bg-gray-200" />
          <div className="h-2 w-16 rounded bg-gray-100" />
        </div>
        <div className="flex-1 space-y-3">
          <div className="h-2 w-full rounded bg-gray-100" />
          <div className="h-2 w-4/5 rounded bg-gray-100" />
          <div className="h-2 w-3/5 rounded bg-gray-100" />
        </div>
        <p className="mt-auto text-center text-xs text-gray-400">Complete sections to see preview</p>
      </div>
    )
  }

  return (
    <div
      className="origin-top-left bg-white font-sans text-gray-900"
      style={{
        transform: `scale(${scale})`,
        width: `${100 / scale}%`,
        height: `${100 / scale}%`,
      }}
    >
      <div className="p-6">
        {/* Header */}
        {isPersonalComplete && (
          <header className="mb-4 border-b border-gray-200 pb-3">
            <h1 className="font-display text-xl font-semibold text-gray-900">{personal.fullName}</h1>
            <p className="text-sm text-accent">{personal.jobTitle}</p>
            <div className="mt-1 flex flex-wrap gap-x-3 text-xs text-gray-500">
              {personal.email && <span>{personal.email}</span>}
              {personal.phone && <span>{personal.phone}</span>}
              {personal.location && <span>{personal.location}</span>}
            </div>
          </header>
        )}

        {/* Summary */}
        {personal.summary && (
          <section className="mb-4">
            <h2 className="mb-1 text-xs font-semibold uppercase tracking-wide text-gray-600">Summary</h2>
            <p className="text-xs leading-relaxed text-gray-700">{personal.summary}</p>
          </section>
        )}

        {/* Experience */}
        {isExperienceComplete && (
          <section className="mb-4">
            <h2 className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-600">Experience</h2>
            <div className="space-y-2">
              {experiences.map((exp) => (
                <div key={exp.id}>
                  <div className="flex items-baseline justify-between">
                    <h3 className="text-xs font-medium text-gray-900">{exp.position}</h3>
                    <span className="text-[10px] text-gray-500">
                      {formatDate(exp.startDate)} – {formatDate(exp.endDate, exp.current)}
                    </span>
                  </div>
                  <p className="text-[10px] text-accent">{exp.company}</p>
                  {exp.description && (
                    <p className="mt-0.5 text-[10px] leading-relaxed text-gray-600">
                      {exp.description.slice(0, 150)}
                      {exp.description.length > 150 && '...'}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Education */}
        {isEducationComplete && (
          <section className="mb-4">
            <h2 className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-600">Education</h2>
            <div className="space-y-2">
              {education.map((edu) => (
                <div key={edu.id}>
                  <div className="flex items-baseline justify-between">
                    <h3 className="text-xs font-medium text-gray-900">
                      {edu.degree}
                      {edu.field && ` in ${edu.field}`}
                    </h3>
                    <span className="text-[10px] text-gray-500">{formatDate(edu.endDate)}</span>
                  </div>
                  <p className="text-[10px] text-accent">{edu.institution}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Skills */}
        {isSkillsComplete && (
          <section>
            <h2 className="mb-1 text-xs font-semibold uppercase tracking-wide text-gray-600">Skills</h2>
            <div className="flex flex-wrap gap-1">
              {skills.map((skill) => (
                <span key={skill} className="rounded bg-gray-100 px-1.5 py-0.5 text-[10px] text-gray-700">
                  {skill}
                </span>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
