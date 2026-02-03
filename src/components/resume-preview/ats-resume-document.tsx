import { sanitizeForATS, formatPhoneForATS, formatEmailForATS } from 'src/lib/ats-engine'
import { ExtendedResumeData, useExtendedResume } from 'src/lib/extended-resume-context'

interface ResumeDocumentProps {
  /** Scale factor for displaying in preview (1 = full size for print) */
  scale?: number
  /** Use extended resume data (new sections) */
  extendedData?: ExtendedResumeData
  /** Show ATS-safe formatting (no icons, plain text) */
  atsMode?: boolean
}

/**
 * ATS-OPTIMIZED RESUME DOCUMENT
 *
 * A print-safe, ATS-friendly resume document component.
 * Designed for A4 paper (210mm × 297mm) with professional typography.
 *
 * ATS Rules Applied:
 * - No icons/graphics in resume body (only text)
 * - Single-column layout
 * - Standard section headings
 * - ATS-safe fonts (Inter)
 * - Clean hierarchy with proper heading levels
 * - No tables or complex formatting
 * - Plain text bullet points
 */
export function ResumeDocument({ scale = 1, extendedData }: ResumeDocumentProps) {
  const { data: contextData } = useExtendedResume()

  // Priority: extendedData prop > context data
  const data = extendedData || contextData
  const { personal, experiences, education, skills } = data

  // Extended sections
  const projects = data.projects || []
  const certifications = data.certifications || []
  const expertiseAreas = data.expertiseAreas || []
  const links = data.links || []
  const sectionConfig = data.sectionConfig || []

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
    return `${startFormatted} - ${endFormatted}`
  }

  // Format description as bullet points
  const formatDescription = (description: string): string[] => {
    if (!description) return []
    const sanitized = sanitizeForATS(description)
    // Split by newlines and filter empty
    return sanitized
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line.length > 0)
  }

  // Check if sections have content
  const hasPersonal = personal.fullName || personal.jobTitle
  const hasContact = personal.email || personal.phone || personal.location
  const hasSummary = personal.summary
  const hasExperience = experiences.length > 0
  const hasEducation = education.length > 0
  const hasSkills = skills.length > 0
  const hasProjects = projects.length > 0
  const hasCertifications = certifications.length > 0
  const hasExpertise = expertiseAreas.length > 0
  const hasLinks = links.length > 0
  const hasAnyContent =
    hasPersonal ||
    hasExperience ||
    hasEducation ||
    hasSkills ||
    hasProjects ||
    hasCertifications ||
    hasExpertise ||
    hasLinks

  // ATS-safe contact separator
  const contactSeparator = ' | '

  // Check if a section is enabled
  const isSectionEnabled = (sectionId: string): boolean => {
    if (sectionConfig.length === 0) return true // Default to enabled if no config
    const config = sectionConfig.find((s) => s.id === sectionId)
    return config ? config.enabled : true
  }

  return (
    <div
      className="resume-document print-area origin-top bg-white"
      style={{
        transform: scale !== 1 ? `scale(${scale})` : undefined,
        transformOrigin: 'top center',
        width: scale !== 1 ? `${100 / scale}%` : undefined,
        fontFamily: "'Inter', Arial, Calibri, sans-serif",
      }}
    >
      {/* A4 paper simulation with print-safe margins */}
      <article
        className="mx-auto bg-white text-gray-900"
        style={{
          width: '210mm',
          minHeight: '297mm',
          padding: '18mm 20mm 22mm 20mm',
          fontSize: '10.5pt',
          lineHeight: '1.4',
        }}
      >
        {!hasAnyContent ? (
          /* Empty state */
          <div className="flex h-full min-h-[250mm] flex-col items-center justify-center text-center">
            <div
              className="mb-4 rounded-full bg-gray-100"
              style={{ width: '64px', height: '64px' }}
              aria-hidden="true"
            />
            <h2 className="mb-2 text-xl font-medium text-gray-400">Your resume is empty</h2>
            <p className="max-w-xs text-sm text-gray-400">
              Go back to the editor and fill in your details to see your resume here.
            </p>
          </div>
        ) : (
          <div>
            {/* ===== HEADER (Name & Title) ===== */}
            {hasPersonal && (
              <header style={{ marginBottom: '12pt', borderBottom: '2pt solid #111827', paddingBottom: '10pt' }}>
                <h1
                  style={{
                    fontSize: '24pt',
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
                      color: '#374151',
                    }}
                  >
                    {sanitizeForATS(personal.jobTitle)}
                  </p>
                )}

                {/* Contact info - plain text, no icons for ATS */}
                {hasContact && (
                  <p
                    style={{
                      fontSize: '10pt',
                      marginTop: '8pt',
                      color: '#4B5563',
                    }}
                  >
                    {[
                      personal.email && formatEmailForATS(personal.email),
                      personal.phone && formatPhoneForATS(personal.phone),
                      personal.location && sanitizeForATS(personal.location),
                    ]
                      .filter(Boolean)
                      .join(contactSeparator)}
                  </p>
                )}
              </header>
            )}

            {/* ===== PROFESSIONAL SUMMARY ===== */}
            {hasSummary && (
              <section style={{ marginBottom: '14pt' }}>
                <h2
                  style={{
                    fontSize: '10pt',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    marginBottom: '6pt',
                    color: '#111827',
                  }}
                >
                  Professional Summary
                </h2>
                <p
                  style={{
                    fontSize: '10.5pt',
                    lineHeight: 1.5,
                    color: '#374151',
                    margin: 0,
                  }}
                >
                  {sanitizeForATS(personal.summary)}
                </p>
              </section>
            )}

            {/* ===== PROFESSIONAL EXPERIENCE ===== */}
            {hasExperience && (
              <section style={{ marginBottom: '14pt' }}>
                <h2
                  style={{
                    fontSize: '10pt',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    marginBottom: '8pt',
                    paddingBottom: '4pt',
                    borderBottom: '1pt solid #D1D5DB',
                    color: '#111827',
                  }}
                >
                  Professional Experience
                </h2>
                <div>
                  {experiences.map((exp, index) => {
                    const bullets = formatDescription(exp.description)
                    return (
                      <article
                        key={exp.id}
                        style={{
                          marginBottom: index < experiences.length - 1 ? '12pt' : 0,
                        }}
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
                            <h3
                              style={{
                                fontSize: '11pt',
                                fontWeight: 600,
                                margin: 0,
                                color: '#111827',
                              }}
                            >
                              {sanitizeForATS(exp.position)}
                            </h3>
                            <p
                              style={{
                                fontSize: '10.5pt',
                                fontWeight: 500,
                                margin: 0,
                                color: '#374151',
                              }}
                            >
                              {sanitizeForATS(exp.company)}
                            </p>
                          </div>
                          <span
                            style={{
                              fontSize: '10pt',
                              color: '#6B7280',
                              whiteSpace: 'nowrap',
                              flexShrink: 0,
                            }}
                          >
                            {formatDateRange(exp.startDate, exp.endDate, exp.current)}
                          </span>
                        </div>

                        {/* Bullet points */}
                        {bullets.length > 0 && (
                          <ul
                            style={{
                              marginTop: '6pt',
                              marginBottom: 0,
                              paddingLeft: '16pt',
                              listStyleType: 'disc',
                            }}
                          >
                            {bullets.map((bullet, bulletIndex) => (
                              <li
                                key={bulletIndex}
                                style={{
                                  fontSize: '10pt',
                                  lineHeight: 1.5,
                                  color: '#374151',
                                  marginBottom: bulletIndex < bullets.length - 1 ? '2pt' : 0,
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
              <section style={{ marginBottom: '14pt' }}>
                <h2
                  style={{
                    fontSize: '10pt',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    marginBottom: '8pt',
                    paddingBottom: '4pt',
                    borderBottom: '1pt solid #D1D5DB',
                    color: '#111827',
                  }}
                >
                  Education
                </h2>
                <div>
                  {education.map((edu, index) => (
                    <article
                      key={edu.id}
                      style={{
                        marginBottom: index < education.length - 1 ? '10pt' : 0,
                      }}
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
                          <h3
                            style={{
                              fontSize: '11pt',
                              fontWeight: 600,
                              margin: 0,
                              color: '#111827',
                            }}
                          >
                            {sanitizeForATS(edu.degree)}
                            {edu.field && ` in ${sanitizeForATS(edu.field)}`}
                          </h3>
                          <p
                            style={{
                              fontSize: '10.5pt',
                              margin: 0,
                              color: '#374151',
                            }}
                          >
                            {sanitizeForATS(edu.institution)}
                          </p>
                        </div>
                        <span
                          style={{
                            fontSize: '10pt',
                            color: '#6B7280',
                            whiteSpace: 'nowrap',
                            flexShrink: 0,
                          }}
                        >
                          {formatDate(edu.endDate)}
                        </span>
                      </div>
                      {edu.description && (
                        <p
                          style={{
                            fontSize: '10pt',
                            lineHeight: 1.4,
                            marginTop: '4pt',
                            color: '#4B5563',
                          }}
                        >
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
              <section style={{ marginBottom: '14pt' }}>
                <h2
                  style={{
                    fontSize: '10pt',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    marginBottom: '6pt',
                    paddingBottom: '4pt',
                    borderBottom: '1pt solid #D1D5DB',
                    color: '#111827',
                  }}
                >
                  Skills
                </h2>
                <p
                  style={{
                    fontSize: '10.5pt',
                    lineHeight: 1.6,
                    color: '#374151',
                    margin: 0,
                  }}
                >
                  {skills.map((skill) => sanitizeForATS(skill)).join(' | ')}
                </p>
              </section>
            )}

            {/* ===== PROJECTS ===== */}
            {hasProjects && isSectionEnabled('projects') && (
              <section style={{ marginBottom: '14pt' }}>
                <h2
                  style={{
                    fontSize: '10pt',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    marginBottom: '8pt',
                    paddingBottom: '4pt',
                    borderBottom: '1pt solid #D1D5DB',
                    color: '#111827',
                  }}
                >
                  Projects
                </h2>
                <div>
                  {projects.map((project, index) => {
                    const bullets = formatDescription(project.description)
                    return (
                      <article
                        key={project.id}
                        style={{
                          marginBottom: index < projects.length - 1 ? '10pt' : 0,
                        }}
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
                            <h3
                              style={{
                                fontSize: '11pt',
                                fontWeight: 600,
                                margin: 0,
                                color: '#111827',
                              }}
                            >
                              {sanitizeForATS(project.name)}
                              {project.role && (
                                <span style={{ fontWeight: 400, color: '#4B5563' }}>
                                  {' — '}
                                  {sanitizeForATS(project.role)}
                                </span>
                              )}
                            </h3>
                            {project.url && (
                              <p
                                style={{
                                  fontSize: '10pt',
                                  margin: 0,
                                  color: '#6B7280',
                                }}
                              >
                                {sanitizeForATS(project.url)}
                              </p>
                            )}
                          </div>
                          {(project.startDate || project.endDate) && (
                            <span
                              style={{
                                fontSize: '10pt',
                                color: '#6B7280',
                                whiteSpace: 'nowrap',
                                flexShrink: 0,
                              }}
                            >
                              {formatDateRange(project.startDate || '', project.endDate || '', project.current)}
                            </span>
                          )}
                        </div>

                        {/* Technologies */}
                        {project.technologies && project.technologies.length > 0 && (
                          <p
                            style={{
                              fontSize: '10pt',
                              marginTop: '4pt',
                              color: '#4B5563',
                            }}
                          >
                            <strong>Technologies:</strong>{' '}
                            {project.technologies.map((t) => sanitizeForATS(t)).join(', ')}
                          </p>
                        )}

                        {/* Bullet points */}
                        {bullets.length > 0 && (
                          <ul
                            style={{
                              marginTop: '4pt',
                              marginBottom: 0,
                              paddingLeft: '16pt',
                              listStyleType: 'disc',
                            }}
                          >
                            {bullets.map((bullet, bulletIndex) => (
                              <li
                                key={bulletIndex}
                                style={{
                                  fontSize: '10pt',
                                  lineHeight: 1.5,
                                  color: '#374151',
                                  marginBottom: bulletIndex < bullets.length - 1 ? '2pt' : 0,
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
              <section style={{ marginBottom: '14pt' }}>
                <h2
                  style={{
                    fontSize: '10pt',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    marginBottom: '8pt',
                    paddingBottom: '4pt',
                    borderBottom: '1pt solid #D1D5DB',
                    color: '#111827',
                  }}
                >
                  Certifications
                </h2>
                <div>
                  {certifications.map((cert, index) => (
                    <article
                      key={cert.id}
                      style={{
                        marginBottom: index < certifications.length - 1 ? '8pt' : 0,
                      }}
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
                          <h3
                            style={{
                              fontSize: '11pt',
                              fontWeight: 600,
                              margin: 0,
                              color: '#111827',
                            }}
                          >
                            {sanitizeForATS(cert.name)}
                          </h3>
                          <p
                            style={{
                              fontSize: '10.5pt',
                              margin: 0,
                              color: '#374151',
                            }}
                          >
                            {sanitizeForATS(cert.issuer)}
                            {cert.credentialId && (
                              <span style={{ color: '#6B7280' }}> — ID: {sanitizeForATS(cert.credentialId)}</span>
                            )}
                          </p>
                        </div>
                        <span
                          style={{
                            fontSize: '10pt',
                            color: '#6B7280',
                            whiteSpace: 'nowrap',
                            flexShrink: 0,
                          }}
                        >
                          {cert.issueDate && formatDate(cert.issueDate)}
                          {cert.expiryDate && !cert.noExpiry && ` - ${formatDate(cert.expiryDate)}`}
                          {cert.noExpiry && ' (No Expiry)'}
                        </span>
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            )}

            {/* ===== AREAS OF EXPERTISE ===== */}
            {hasExpertise && isSectionEnabled('expertise') && (
              <section style={{ marginBottom: '14pt' }}>
                <h2
                  style={{
                    fontSize: '10pt',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    marginBottom: '6pt',
                    paddingBottom: '4pt',
                    borderBottom: '1pt solid #D1D5DB',
                    color: '#111827',
                  }}
                >
                  Areas of Expertise
                </h2>
                <div>
                  {expertiseAreas.map((area, index) => (
                    <p
                      key={area.id}
                      style={{
                        fontSize: '10.5pt',
                        lineHeight: 1.6,
                        color: '#374151',
                        marginBottom: index < expertiseAreas.length - 1 ? '4pt' : 0,
                      }}
                    >
                      <strong>{sanitizeForATS(area.category)}:</strong>{' '}
                      {area.keywords.map((k) => sanitizeForATS(k)).join(', ')}
                    </p>
                  ))}
                </div>
              </section>
            )}

            {/* ===== PROFESSIONAL LINKS ===== */}
            {hasLinks && isSectionEnabled('links') && (
              <section>
                <h2
                  style={{
                    fontSize: '10pt',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    marginBottom: '6pt',
                    paddingBottom: '4pt',
                    borderBottom: '1pt solid #D1D5DB',
                    color: '#111827',
                  }}
                >
                  Professional Links
                </h2>
                <p
                  style={{
                    fontSize: '10.5pt',
                    lineHeight: 1.6,
                    color: '#374151',
                    margin: 0,
                  }}
                >
                  {links.map((link, index) => (
                    <span key={link.id}>
                      {link.label || link.type}: {sanitizeForATS(link.url)}
                      {index < links.length - 1 && ' | '}
                    </span>
                  ))}
                </p>
              </section>
            )}
          </div>
        )}
      </article>

      {/* Print styles for accurate PDF output */}
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
            size: A4 portrait;
            margin: 18mm 20mm 22mm 20mm;
          }
          /* Ensure no page breaks inside entries */
          .resume-document article article {
            page-break-inside: avoid;
          }
          .resume-document section {
            page-break-inside: avoid;
          }
        }
        /* ATS-safe fonts fallback */
        .resume-document {
          font-family: 'Inter', Arial, Calibri, Helvetica, sans-serif !important;
        }
        .resume-document h1,
        .resume-document h2,
        .resume-document h3 {
          font-family: 'Inter', Arial, Calibri, Helvetica, sans-serif !important;
        }
      `}</style>
    </div>
  )
}
