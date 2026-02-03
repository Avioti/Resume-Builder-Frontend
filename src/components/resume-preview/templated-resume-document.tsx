/**
 * Templated Resume Document
 *
 * A resume document that adapts its styling based on the selected template.
 * Provides different visual presentations while maintaining ATS compatibility.
 */
import { CSSProperties } from 'react'
import { useExtendedResume } from 'src/lib/extended-resume-context'
import { useTemplate } from 'src/lib/template-context'
import { ResumeTemplate, TemplateStyle } from 'src/lib/resume-templates'
import { sanitizeForATS, formatPhoneForATS, formatEmailForATS } from 'src/lib/ats-engine'
import { Mail, Phone, MapPin, Globe } from 'lucide-react'

interface TemplatedResumeDocumentProps {
  /** Scale factor for preview */
  scale?: number
  /** Override template (for preview) */
  templateOverride?: ResumeTemplate
}

// Font family mappings
const FONT_FAMILIES: Record<TemplateStyle['fontFamily'], string> = {
  inter: "'Inter', system-ui, sans-serif",
  georgia: "'Georgia', 'Times New Roman', serif",
  times: "'Times New Roman', Times, serif",
}

// Density settings
const DENSITY_CONFIG: Record<
  TemplateStyle['density'],
  { sectionGap: string; itemGap: string; lineHeight: number; fontSize: string }
> = {
  compact: { sectionGap: '10pt', itemGap: '6pt', lineHeight: 1.35, fontSize: '9.5pt' },
  normal: { sectionGap: '14pt', itemGap: '10pt', lineHeight: 1.5, fontSize: '10.5pt' },
  spacious: { sectionGap: '18pt', itemGap: '14pt', lineHeight: 1.6, fontSize: '11pt' },
}

export function TemplatedResumeDocument({ scale = 1, templateOverride }: TemplatedResumeDocumentProps) {
  // Get data and template
  const { data } = useExtendedResume()
  const { template: contextTemplate } = useTemplate()
  const template = templateOverride || contextTemplate
  const { style } = template
  const density = DENSITY_CONFIG[style.density]

  // Extract data
  const { personal, experiences, education, skills, projects, certifications, links, sectionConfig } = data

  // Compute styles based on template
  const accentColor = `hsl(${style.accentColor})`
  const fontFamily = FONT_FAMILIES[style.fontFamily]

  // Format helpers
  const formatDate = (dateStr: string, current?: boolean) => {
    if (current) return 'Present'
    if (!dateStr) return ''
    const date = new Date(dateStr + '-01')
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
  }

  const formatDateRange = (start: string, end: string, current?: boolean) => {
    const startFormatted = formatDate(start)
    const endFormatted = formatDate(end, current)
    if (!startFormatted && !endFormatted) return ''
    if (!startFormatted) return endFormatted
    return `${startFormatted} - ${endFormatted}`
  }

  const formatDescription = (description: string): string[] => {
    if (!description) return []
    const sanitized = sanitizeForATS(description)
    return sanitized
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line.length > 0)
  }

  // Section enabled check
  const isSectionEnabled = (sectionId: string): boolean => {
    if (sectionConfig.length === 0) return true
    const config = sectionConfig.find((s) => s.id === sectionId)
    return config ? config.enabled : true
  }

  // Content checks
  const hasPersonal = personal.fullName || personal.jobTitle
  const hasContact = personal.email || personal.phone || personal.location
  const hasSummary = personal.summary
  const hasExperience = experiences.length > 0
  const hasEducation = education.length > 0
  const hasSkills = skills.length > 0
  const hasProjects = projects.length > 0
  const hasCertifications = certifications.length > 0
  const hasLinks = links.length > 0
  const hasAnyContent =
    hasPersonal || hasExperience || hasEducation || hasSkills || hasProjects || hasCertifications || hasLinks

  // Section heading style generator
  const getSectionHeadingStyle = (): CSSProperties => {
    const base: CSSProperties = {
      fontSize: '10pt',
      fontWeight: 700,
      textTransform: 'uppercase',
      letterSpacing: '0.08em',
      marginBottom: '6pt',
      color: '#111827',
    }

    switch (style.sectionStyle) {
      case 'underlined':
        return { ...base, paddingBottom: '4pt', borderBottom: '1pt solid #D1D5DB' }
      case 'background':
        return {
          ...base,
          backgroundColor: `hsl(${style.accentColor} / 0.1)`,
          color: accentColor,
          padding: '4pt 8pt',
          marginLeft: '-8pt',
          marginRight: '-8pt',
        }
      case 'border-left':
        return { ...base, borderLeft: `3pt solid ${accentColor}`, paddingLeft: '8pt' }
      case 'simple':
      default:
        return { ...base, color: accentColor }
    }
  }

  // Header style generator
  const getHeaderStyle = (): CSSProperties => {
    const base: CSSProperties = {
      marginBottom: '12pt',
      paddingBottom: '10pt',
    }

    switch (style.headerStyle) {
      case 'centered':
        return { ...base, textAlign: 'center', borderBottom: 'none' }
      case 'minimal':
        return { ...base, borderBottom: 'none' }
      case 'left-aligned':
      default:
        return { ...base, borderBottom: style.showDividers ? `2pt solid ${accentColor}` : 'none' }
    }
  }

  // Contact icon component (only shown when template allows)
  const ContactIcon = ({ type }: { type: 'email' | 'phone' | 'location' | 'website' }) => {
    if (!style.showContactIcons) return null

    const iconProps = { className: 'inline-block mr-1', style: { width: '10pt', height: '10pt', color: accentColor } }

    switch (type) {
      case 'email':
        return <Mail {...iconProps} />
      case 'phone':
        return <Phone {...iconProps} />
      case 'location':
        return <MapPin {...iconProps} />
      case 'website':
        return <Globe {...iconProps} />
      default:
        return null
    }
  }

  const sectionHeadingStyle = getSectionHeadingStyle()
  const headerStyle = getHeaderStyle()

  return (
    <div
      className="resume-document print-area bg-white"
      style={{
        transformOrigin: 'top left',
        transform: scale !== 1 ? `scale(${scale})` : undefined,
        width: '210mm',
        minHeight: '297mm',
        fontFamily,
      }}
    >
      <article
        className="mx-auto bg-white text-gray-900"
        style={{
          width: '210mm',
          minHeight: '297mm',
          padding: style.density === 'compact' ? '15mm 18mm 18mm 18mm' : '18mm 20mm 22mm 20mm',
          fontSize: density.fontSize,
          lineHeight: density.lineHeight,
        }}
      >
        {!hasAnyContent ? (
          <div className="flex h-full min-h-[250mm] flex-col items-center justify-center text-center">
            <div className="mb-4 h-16 w-16 rounded-full bg-gray-100" aria-hidden="true" />
            <h2 className="mb-2 text-xl font-medium text-gray-400">Your resume is empty</h2>
            <p className="max-w-xs text-sm text-gray-400">
              Go back to the editor and fill in your details to see your resume here.
            </p>
          </div>
        ) : (
          <div>
            {/* ===== HEADER ===== */}
            {hasPersonal && (
              <header style={headerStyle}>
                <h1
                  style={{
                    fontSize: style.headerStyle === 'minimal' ? '20pt' : '24pt',
                    fontWeight: 700,
                    letterSpacing: '-0.02em',
                    lineHeight: 1.1,
                    margin: 0,
                    color: '#111827',
                  }}
                >
                  {sanitizeForATS(personal.fullName) || 'Your Name'}
                </h1>
                {personal.jobTitle && (
                  <p
                    style={{
                      fontSize: '12pt',
                      fontWeight: 500,
                      marginTop: '4pt',
                      color: style.headerStyle === 'centered' ? accentColor : '#374151',
                    }}
                  >
                    {sanitizeForATS(personal.jobTitle)}
                  </p>
                )}

                {hasContact && (
                  <p
                    style={{
                      fontSize: '10pt',
                      marginTop: '8pt',
                      color: '#4B5563',
                    }}
                  >
                    {personal.email && (
                      <span>
                        <ContactIcon type="email" />
                        {formatEmailForATS(personal.email)}
                      </span>
                    )}
                    {personal.email && personal.phone && ' | '}
                    {personal.phone && (
                      <span>
                        <ContactIcon type="phone" />
                        {formatPhoneForATS(personal.phone)}
                      </span>
                    )}
                    {(personal.email || personal.phone) && personal.location && ' | '}
                    {personal.location && (
                      <span>
                        <ContactIcon type="location" />
                        {sanitizeForATS(personal.location)}
                      </span>
                    )}
                  </p>
                )}
              </header>
            )}

            {/* ===== PROFESSIONAL SUMMARY ===== */}
            {hasSummary && (
              <section style={{ marginBottom: density.sectionGap }}>
                <h2 style={sectionHeadingStyle}>Professional Summary</h2>
                <p style={{ fontSize: density.fontSize, lineHeight: density.lineHeight, color: '#374151', margin: 0 }}>
                  {sanitizeForATS(personal.summary)}
                </p>
              </section>
            )}

            {/* ===== PROFESSIONAL EXPERIENCE ===== */}
            {hasExperience && (
              <section style={{ marginBottom: density.sectionGap }}>
                <h2 style={sectionHeadingStyle}>Professional Experience</h2>
                <div>
                  {experiences.map((exp, index) => {
                    const bullets = formatDescription(exp.description)
                    return (
                      <article
                        key={exp.id}
                        style={{ marginBottom: index < experiences.length - 1 ? density.itemGap : 0 }}
                      >
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'flex-start',
                            gap: '12pt',
                          }}
                        >
                          <div>
                            <h3 style={{ fontSize: '11pt', fontWeight: 600, margin: 0, color: '#111827' }}>
                              {sanitizeForATS(exp.position)}
                            </h3>
                            <p style={{ fontSize: density.fontSize, fontWeight: 500, margin: 0, color: '#374151' }}>
                              {sanitizeForATS(exp.company)}
                            </p>
                          </div>
                          <span style={{ fontSize: '10pt', color: '#6B7280', whiteSpace: 'nowrap', flexShrink: 0 }}>
                            {formatDateRange(exp.startDate, exp.endDate, exp.current)}
                          </span>
                        </div>
                        {bullets.length > 0 && (
                          <ul style={{ marginTop: '6pt', marginBottom: 0, paddingLeft: '16pt', listStyleType: 'disc' }}>
                            {bullets.map((bullet, bi) => (
                              <li
                                key={bi}
                                style={{
                                  fontSize: '10pt',
                                  lineHeight: 1.5,
                                  color: '#374151',
                                  marginBottom: bi < bullets.length - 1 ? '2pt' : 0,
                                }}
                              >
                                {bullet}
                              </li>
                            ))}
                          </ul>
                        )}
                      </article>
                    )
                  })}
                </div>
              </section>
            )}

            {/* ===== EDUCATION ===== */}
            {hasEducation && (
              <section style={{ marginBottom: density.sectionGap }}>
                <h2 style={sectionHeadingStyle}>Education</h2>
                <div>
                  {education.map((edu, index) => (
                    <article key={edu.id} style={{ marginBottom: index < education.length - 1 ? density.itemGap : 0 }}>
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'flex-start',
                          gap: '12pt',
                        }}
                      >
                        <div>
                          <h3 style={{ fontSize: '11pt', fontWeight: 600, margin: 0, color: '#111827' }}>
                            {sanitizeForATS(edu.degree)}
                            {edu.field && ` in ${sanitizeForATS(edu.field)}`}
                          </h3>
                          <p style={{ fontSize: density.fontSize, margin: 0, color: '#374151' }}>
                            {sanitizeForATS(edu.institution)}
                          </p>
                        </div>
                        <span style={{ fontSize: '10pt', color: '#6B7280', whiteSpace: 'nowrap', flexShrink: 0 }}>
                          {formatDate(edu.endDate)}
                        </span>
                      </div>
                      {edu.description && (
                        <p style={{ fontSize: '10pt', lineHeight: 1.4, marginTop: '4pt', color: '#4B5563' }}>
                          {sanitizeForATS(edu.description)}
                        </p>
                      )}
                    </article>
                  ))}
                </div>
              </section>
            )}

            {/* ===== SKILLS ===== */}
            {hasSkills && isSectionEnabled('skills') && (
              <section style={{ marginBottom: density.sectionGap }}>
                <h2 style={sectionHeadingStyle}>Skills</h2>
                <p style={{ fontSize: density.fontSize, lineHeight: 1.6, color: '#374151', margin: 0 }}>
                  {skills.map((skill) => sanitizeForATS(skill)).join(' | ')}
                </p>
              </section>
            )}

            {/* ===== PROJECTS ===== */}
            {hasProjects && isSectionEnabled('projects') && (
              <section style={{ marginBottom: density.sectionGap }}>
                <h2 style={sectionHeadingStyle}>Projects</h2>
                <div>
                  {projects.map((project, index) => {
                    const bullets = formatDescription(project.description)
                    return (
                      <article
                        key={project.id}
                        style={{ marginBottom: index < projects.length - 1 ? density.itemGap : 0 }}
                      >
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'flex-start',
                            gap: '12pt',
                          }}
                        >
                          <div>
                            <h3 style={{ fontSize: '11pt', fontWeight: 600, margin: 0, color: '#111827' }}>
                              {sanitizeForATS(project.name)}
                              {project.role && (
                                <span style={{ fontWeight: 400, color: '#4B5563' }}>
                                  {' '}
                                  — {sanitizeForATS(project.role)}
                                </span>
                              )}
                            </h3>
                            {project.url && (
                              <p style={{ fontSize: '10pt', margin: 0, color: '#6B7280' }}>
                                {sanitizeForATS(project.url)}
                              </p>
                            )}
                          </div>
                          {(project.startDate || project.endDate) && (
                            <span style={{ fontSize: '10pt', color: '#6B7280', whiteSpace: 'nowrap', flexShrink: 0 }}>
                              {formatDateRange(project.startDate || '', project.endDate || '', project.current)}
                            </span>
                          )}
                        </div>
                        {project.technologies && project.technologies.length > 0 && (
                          <p style={{ fontSize: '10pt', marginTop: '4pt', color: '#4B5563' }}>
                            <strong>Technologies:</strong>{' '}
                            {project.technologies.map((t) => sanitizeForATS(t)).join(', ')}
                          </p>
                        )}
                        {bullets.length > 0 && (
                          <ul style={{ marginTop: '4pt', marginBottom: 0, paddingLeft: '16pt', listStyleType: 'disc' }}>
                            {bullets.map((bullet, bi) => (
                              <li
                                key={bi}
                                style={{
                                  fontSize: '10pt',
                                  lineHeight: 1.5,
                                  color: '#374151',
                                  marginBottom: bi < bullets.length - 1 ? '2pt' : 0,
                                }}
                              >
                                {bullet}
                              </li>
                            ))}
                          </ul>
                        )}
                      </article>
                    )
                  })}
                </div>
              </section>
            )}

            {/* ===== CERTIFICATIONS ===== */}
            {hasCertifications && isSectionEnabled('certifications') && (
              <section style={{ marginBottom: density.sectionGap }}>
                <h2 style={sectionHeadingStyle}>Certifications</h2>
                <div>
                  {certifications.map((cert, index) => (
                    <article key={cert.id} style={{ marginBottom: index < certifications.length - 1 ? '8pt' : 0 }}>
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'flex-start',
                          gap: '12pt',
                        }}
                      >
                        <div>
                          <h3 style={{ fontSize: '11pt', fontWeight: 600, margin: 0, color: '#111827' }}>
                            {sanitizeForATS(cert.name)}
                          </h3>
                          <p style={{ fontSize: density.fontSize, margin: 0, color: '#374151' }}>
                            {sanitizeForATS(cert.issuer)}
                            {cert.credentialId && (
                              <span style={{ color: '#6B7280' }}> — ID: {sanitizeForATS(cert.credentialId)}</span>
                            )}
                          </p>
                        </div>
                        {cert.issueDate && (
                          <span style={{ fontSize: '10pt', color: '#6B7280', whiteSpace: 'nowrap', flexShrink: 0 }}>
                            {formatDate(cert.issueDate)}
                            {cert.expiryDate && ` - ${formatDate(cert.expiryDate)}`}
                          </span>
                        )}
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            )}

            {/* ===== LINKS ===== */}
            {hasLinks && isSectionEnabled('links') && (
              <section style={{ marginBottom: density.sectionGap }}>
                <h2 style={sectionHeadingStyle}>Links</h2>
                <p style={{ fontSize: density.fontSize, lineHeight: 1.6, color: '#374151', margin: 0 }}>
                  {links.map((link, i) => (
                    <span key={link.id}>
                      {i > 0 && ' | '}
                      {link.label}: {sanitizeForATS(link.url)}
                    </span>
                  ))}
                </p>
              </section>
            )}
          </div>
        )}
      </article>
    </div>
  )
}
