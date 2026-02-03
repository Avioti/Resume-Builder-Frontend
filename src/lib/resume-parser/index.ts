/**
 * Resume Parser - Main Entry Point
 * Orchestrates PDF/DOCX parsing and section detection
 */

import { ParsedResume, ImportResult } from './types'
import { parsePDF, isPDF } from './pdf-parser'
import { parseDOCX, isDOCX, isLegacyDOC } from './docx-parser'
import { detectSections, extractContactInfo, extractName, extractJobTitle, parseSkills } from './section-detector'
import { parseExperiences, parseEducation, parseProjects, parseCertifications } from './content-parser'

/**
 * Parse a resume file (PDF or DOCX)
 */
export async function parseResumeFile(file: File): Promise<ImportResult> {
  const warnings: string[] = []

  try {
    // Check file type
    if (isLegacyDOC(file)) {
      return {
        success: false,
        error: 'Legacy .doc format is not supported. Please convert to .docx or .pdf',
      }
    }

    if (!isPDF(file) && !isDOCX(file)) {
      return {
        success: false,
        error: 'Unsupported file format. Please upload a PDF or DOCX file.',
      }
    }

    // Extract text based on file type
    let rawText: string
    let source: 'pdf' | 'docx'

    if (isPDF(file)) {
      const pdfResult = await parsePDF(file)
      rawText = pdfResult.text
      source = 'pdf'

      if (pdfResult.pages > 3) {
        warnings.push('Resume has more than 3 pages. Consider condensing to 1-2 pages for ATS.')
      }
    } else {
      const docxResult = await parseDOCX(file)
      rawText = docxResult.text
      source = 'docx'

      if (docxResult.messages.length > 0) {
        warnings.push(...docxResult.messages)
      }
    }

    // Check for empty content
    if (!rawText || rawText.trim().length < 50) {
      return {
        success: false,
        error: 'Could not extract text from file. The file may be empty, corrupted, or image-based.',
      }
    }

    // Parse the resume content
    const parsed = parseResumeText(rawText, source, file.name, warnings)

    return {
      success: true,
      data: parsed,
    }
  } catch (error) {
    console.error('Resume parsing error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unexpected error occurred while parsing the resume.',
    }
  }
}

/**
 * Parse resume from raw text
 */
export function parseResumeText(
  rawText: string,
  source: 'pdf' | 'docx' | 'text',
  fileName: string,
  warnings: string[] = [],
): ParsedResume {
  // Detect sections
  const sections = detectSections(rawText)

  // Extract basic info from the beginning (usually before any section header)
  const headerText = rawText.substring(0, Math.min(500, rawText.length))
  const fullName = extractName(headerText)
  const jobTitle = extractJobTitle(headerText, fullName)
  const contact = extractContactInfo(headerText)

  // Process each section
  let summary: string | undefined
  let experiences: ParsedResume['experiences'] = []
  let education: ParsedResume['education'] = []
  let skills: string[] = []
  let projects: ParsedResume['projects'] = []
  let certifications: ParsedResume['certifications'] = []

  for (const section of sections) {
    switch (section.type) {
      case 'summary': {
        // Extract summary text (skip header line)
        const summaryLines = section.content.split('\n').slice(1).join('\n').trim()
        summary = summaryLines
        break
      }

      case 'experience':
        experiences = parseExperiences(section.content)
        break

      case 'education':
        education = parseEducation(section.content)
        break

      case 'skills':
        skills = parseSkills(section.content)
        break

      case 'projects':
        projects = parseProjects(section.content)
        break

      case 'certifications':
        certifications = parseCertifications(section.content)
        break
    }
  }

  // Calculate confidence score
  let confidence = 50 // Base confidence

  if (fullName) confidence += 10
  if (jobTitle) confidence += 5
  if (contact.email) confidence += 10
  if (experiences.length > 0) confidence += 15
  if (education.length > 0) confidence += 10

  // Add warnings for missing sections
  if (!fullName) warnings.push('Could not detect name. Please verify personal information.')
  if (!contact.email) warnings.push('No email address found.')
  if (experiences.length === 0) warnings.push('No work experience detected. Check section headers.')
  if (skills.length === 0) warnings.push('No skills section detected.')

  return {
    fullName,
    jobTitle,
    contact,
    summary,
    experiences,
    education,
    skills,
    projects,
    certifications,
    rawText,
    parseInfo: {
      source,
      fileName,
      parseDate: new Date().toISOString(),
      confidence: Math.min(confidence, 100),
      warnings,
    },
  }
}

/**
 * Convert parsed resume to the app's resume data format
 */
export function convertToResumeData(parsed: ParsedResume) {
  return {
    personal: {
      fullName: parsed.fullName || '',
      jobTitle: parsed.jobTitle || '',
      email: parsed.contact.email || '',
      phone: parsed.contact.phone || '',
      location: parsed.contact.location || '',
      summary: parsed.summary || '',
    },
    experiences: parsed.experiences.map((exp, index) => ({
      id: `imported-exp-${index}`,
      company: exp.company,
      position: exp.position,
      startDate: exp.startDate || '',
      endDate: exp.endDate || '',
      current: exp.current || false,
      description: exp.description,
    })),
    education: parsed.education.map((edu, index) => ({
      id: `imported-edu-${index}`,
      institution: edu.institution,
      degree: edu.degree,
      field: edu.field || '',
      startDate: edu.startDate || '',
      endDate: edu.endDate || '',
      description: edu.description || '',
    })),
    skills: parsed.skills,
    projects: parsed.projects.map((proj, index) => ({
      id: `imported-proj-${index}`,
      name: proj.name,
      role: proj.role,
      url: proj.url,
      startDate: proj.startDate,
      endDate: proj.endDate,
      description: proj.description,
      technologies: proj.technologies,
    })),
    certifications: parsed.certifications.map((cert, index) => ({
      id: `imported-cert-${index}`,
      name: cert.name,
      issuer: cert.issuer,
      issueDate: cert.issueDate,
      expiryDate: cert.expiryDate,
      credentialId: cert.credentialId,
      credentialUrl: cert.credentialUrl,
    })),
    links: [
      parsed.contact.linkedin && {
        id: 'imported-link-linkedin',
        type: 'linkedin' as const,
        url: parsed.contact.linkedin,
        label: 'LinkedIn',
      },
      parsed.contact.github && {
        id: 'imported-link-github',
        type: 'github' as const,
        url: parsed.contact.github,
        label: 'GitHub',
      },
      parsed.contact.website && {
        id: 'imported-link-website',
        type: 'portfolio' as const,
        url: parsed.contact.website,
        label: 'Portfolio',
      },
    ].filter(Boolean) as Array<{
      id: string
      type: 'linkedin' | 'github' | 'portfolio'
      url: string
      label: string
    }>,
  }
}

// Re-export types
export type { ParsedResume, ImportResult } from './types'
