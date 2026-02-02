import { useResume } from 'src/lib/resume-context'
import { Mail, Phone, MapPin } from 'lucide-react'

interface ResumeDocumentProps {
  /** Scale factor for displaying in preview (1 = full size for print) */
  scale?: number
}

/**
 * A print-safe, ATS-friendly resume document component.
 * Designed for A4 paper (210mm × 297mm) with professional typography.
 */
export function ResumeDocument({ scale = 1 }: ResumeDocumentProps) {
  const { data } = useResume()
  const { personal, experiences, education, skills } = data

  // Format date for display (e.g., "Jan 2024")
  const formatDate = (dateStr: string, current?: boolean) => {
    if (current) return 'Present'
    if (!dateStr) return ''
    const date = new Date(dateStr + '-01')
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
  }

  // Format date range
  const formatDateRange = (start: string, end: string, current?: boolean) => {
    const startFormatted = formatDate(start)
    const endFormatted = formatDate(end, current)
    if (!startFormatted && !endFormatted) return ''
    if (!startFormatted) return endFormatted
    return `${startFormatted} – ${endFormatted}`
  }

  // Check if sections have content
  const hasPersonal = personal.fullName || personal.jobTitle
  const hasContact = personal.email || personal.phone || personal.location
  const hasSummary = personal.summary
  const hasExperience = experiences.length > 0
  const hasEducation = education.length > 0
  const hasSkills = skills.length > 0
  const hasAnyContent = hasPersonal || hasExperience || hasEducation || hasSkills

  return (
    <div
      className="resume-document origin-top bg-white font-sans text-gray-900"
      style={{
        transform: scale !== 1 ? `scale(${scale})` : undefined,
        transformOrigin: 'top center',
        width: scale !== 1 ? `${100 / scale}%` : undefined,
      }}
    >
      {/* A4 paper simulation with print-safe margins */}
      <article
        className="mx-auto bg-white"
        style={{
          width: '210mm',
          minHeight: '297mm',
          padding: '20mm 20mm 25mm 20mm',
        }}
      >
        {!hasAnyContent ? (
          /* Empty state */
          <div className="flex h-full min-h-[250mm] flex-col items-center justify-center text-center">
            <div className="mb-4 h-16 w-16 rounded-full bg-gray-100" />
            <h2 className="mb-2 font-display text-xl font-medium text-gray-400">Your resume is empty</h2>
            <p className="max-w-xs text-sm text-gray-400">
              Go back to the editor and fill in your details to see your resume here.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* ===== HEADER ===== */}
            {hasPersonal && (
              <header className="border-b-2 border-gray-900 pb-4">
                <h1
                  className="font-display text-3xl font-bold tracking-tight text-gray-900"
                  style={{ fontSize: '28pt', lineHeight: 1.1 }}
                >
                  {personal.fullName || 'Your Name'}
                </h1>
                {personal.jobTitle && (
                  <p className="mt-1 font-medium text-gray-700" style={{ fontSize: '13pt' }}>
                    {personal.jobTitle}
                  </p>
                )}

                {/* Contact info row */}
                {hasContact && (
                  <div
                    className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-gray-600"
                    style={{ fontSize: '10pt' }}
                  >
                    {personal.email && (
                      <span className="inline-flex items-center gap-1.5">
                        <Mail className="h-3.5 w-3.5" aria-hidden="true" />
                        <a href={`mailto:${personal.email}`} className="hover:text-gray-900">
                          {personal.email}
                        </a>
                      </span>
                    )}
                    {personal.phone && (
                      <span className="inline-flex items-center gap-1.5">
                        <Phone className="h-3.5 w-3.5" aria-hidden="true" />
                        <a href={`tel:${personal.phone.replace(/\s/g, '')}`} className="hover:text-gray-900">
                          {personal.phone}
                        </a>
                      </span>
                    )}
                    {personal.location && (
                      <span className="inline-flex items-center gap-1.5">
                        <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
                        {personal.location}
                      </span>
                    )}
                  </div>
                )}
              </header>
            )}

            {/* ===== PROFESSIONAL SUMMARY ===== */}
            {hasSummary && (
              <section aria-labelledby="summary-heading">
                <h2
                  id="summary-heading"
                  className="mb-2 font-display text-xs font-bold uppercase tracking-widest text-gray-900"
                  style={{ fontSize: '10pt', letterSpacing: '0.1em' }}
                >
                  Professional Summary
                </h2>
                <p className="leading-relaxed text-gray-700" style={{ fontSize: '10.5pt', lineHeight: 1.5 }}>
                  {personal.summary}
                </p>
              </section>
            )}

            {/* ===== EXPERIENCE ===== */}
            {hasExperience && (
              <section aria-labelledby="experience-heading">
                <h2
                  id="experience-heading"
                  className="mb-3 border-b border-gray-300 pb-1 font-display text-xs font-bold uppercase tracking-widest text-gray-900"
                  style={{ fontSize: '10pt', letterSpacing: '0.1em' }}
                >
                  Professional Experience
                </h2>
                <div className="space-y-4">
                  {experiences.map((exp, index) => (
                    <article key={exp.id} className={index > 0 ? 'pt-2' : ''}>
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h3 className="font-semibold text-gray-900" style={{ fontSize: '11pt' }}>
                            {exp.position}
                          </h3>
                          <p className="font-medium text-gray-700" style={{ fontSize: '10.5pt' }}>
                            {exp.company}
                          </p>
                        </div>
                        <span className="shrink-0 text-right text-gray-600" style={{ fontSize: '10pt' }}>
                          {formatDateRange(exp.startDate, exp.endDate, exp.current)}
                        </span>
                      </div>
                      {exp.description && (
                        <div
                          className="mt-2 whitespace-pre-wrap text-gray-700"
                          style={{ fontSize: '10pt', lineHeight: 1.5 }}
                        >
                          {exp.description}
                        </div>
                      )}
                    </article>
                  ))}
                </div>
              </section>
            )}

            {/* ===== EDUCATION ===== */}
            {hasEducation && (
              <section aria-labelledby="education-heading">
                <h2
                  id="education-heading"
                  className="mb-3 border-b border-gray-300 pb-1 font-display text-xs font-bold uppercase tracking-widest text-gray-900"
                  style={{ fontSize: '10pt', letterSpacing: '0.1em' }}
                >
                  Education
                </h2>
                <div className="space-y-3">
                  {education.map((edu) => (
                    <article key={edu.id}>
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h3 className="font-semibold text-gray-900" style={{ fontSize: '11pt' }}>
                            {edu.degree}
                            {edu.field && ` in ${edu.field}`}
                          </h3>
                          <p className="text-gray-700" style={{ fontSize: '10.5pt' }}>
                            {edu.institution}
                          </p>
                        </div>
                        <span className="shrink-0 text-right text-gray-600" style={{ fontSize: '10pt' }}>
                          {formatDate(edu.endDate)}
                        </span>
                      </div>
                      {edu.description && (
                        <p className="mt-1 text-gray-600" style={{ fontSize: '10pt', lineHeight: 1.4 }}>
                          {edu.description}
                        </p>
                      )}
                    </article>
                  ))}
                </div>
              </section>
            )}

            {/* ===== SKILLS ===== */}
            {hasSkills && (
              <section aria-labelledby="skills-heading">
                <h2
                  id="skills-heading"
                  className="mb-2 border-b border-gray-300 pb-1 font-display text-xs font-bold uppercase tracking-widest text-gray-900"
                  style={{ fontSize: '10pt', letterSpacing: '0.1em' }}
                >
                  Skills
                </h2>
                <p className="text-gray-700" style={{ fontSize: '10.5pt', lineHeight: 1.6 }}>
                  {skills.join(' • ')}
                </p>
              </section>
            )}
          </div>
        )}
      </article>

      {/* Print styles */}
      <style>{`
        @media print {
          .resume-document {
            transform: none !important;
            width: 100% !important;
          }
          .resume-document article {
            padding: 0 !important;
            width: 100% !important;
            min-height: auto !important;
          }
          @page {
            size: A4;
            margin: 20mm 15mm 25mm 15mm;
          }
        }
      `}</style>
    </div>
  )
}
