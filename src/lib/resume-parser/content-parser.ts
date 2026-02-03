/**
 * Experience Parser
 * Extracts work experience entries from resume text
 */

import { ParsedExperience, ParsedEducation, ParsedProject, ParsedCertification } from './types'
import { parseDate } from './section-detector'

/**
 * Parse experience section into structured entries
 */
export function parseExperiences(content: string): ParsedExperience[] {
  const experiences: ParsedExperience[] = []
  const lines = content
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean)

  // Skip the section header
  let startIndex = 0
  if (/^(professional\s*)?experience|work\s*history|employment/i.test(lines[0])) {
    startIndex = 1
  }

  // Patterns for identifying experience entries
  const dateRangePattern =
    /\b(jan(uary)?|feb(ruary)?|mar(ch)?|apr(il)?|may|jun(e)?|jul(y)?|aug(ust)?|sep(t(ember)?)?|oct(ober)?|nov(ember)?|dec(ember)?|\d{1,2}\/\d{4}|\d{4})\s*[-–—]\s*(present|current|jan(uary)?|feb(ruary)?|mar(ch)?|apr(il)?|may|jun(e)?|jul(y)?|aug(ust)?|sep(t(ember)?)?|oct(ober)?|nov(ember)?|dec(ember)?|\d{1,2}\/\d{4}|\d{4})\b/i

  let currentExp: Partial<ParsedExperience> | null = null
  const bullets: string[] = []

  for (let i = startIndex; i < lines.length; i++) {
    const line = lines[i]
    const dateMatch = line.match(dateRangePattern)

    // Check if this is a new entry (has date range)
    if (dateMatch) {
      // Save previous entry
      if (currentExp && (currentExp.company || currentExp.position)) {
        experiences.push(finalizeExperience(currentExp, bullets))
        bullets.length = 0
      }

      // Parse the date range
      const dateStr = dateMatch[0]
      const [startPart, endPart] = dateStr.split(/\s*[-–—]\s*/)
      const startDate = parseDate(startPart)
      const endDate = parseDate(endPart)
      const current = /present|current/i.test(endPart)

      // The position/company is usually in the same line or previous line
      let position = ''
      let company = ''

      // Check if line has more than just date
      const beforeDate = line.substring(0, dateMatch.index).trim()
      const afterDate = line.substring((dateMatch.index || 0) + dateMatch[0].length).trim()

      if (beforeDate) {
        // Format: "Position at Company | Jan 2020 - Present"
        const parts = beforeDate.split(/\s+at\s+|\s*[|,]\s*/i)
        if (parts.length >= 2) {
          position = parts[0].trim()
          company = parts[1].trim()
        } else {
          position = beforeDate
        }
      }

      if (afterDate && !company) {
        company = afterDate
      }

      // Check previous line for position/company
      if (!position && i > startIndex) {
        const prevLine = lines[i - 1]
        if (!dateRangePattern.test(prevLine) && !/^[•\-*\u2022]/.test(prevLine)) {
          position = prevLine
        }
      }

      currentExp = {
        position,
        company,
        startDate,
        endDate: current ? '' : endDate,
        current,
        description: '',
      }
    } else if (currentExp) {
      // Check for company name if we don't have one yet
      if (!currentExp.company && !line.startsWith('•') && !line.startsWith('-') && !line.startsWith('*')) {
        if (/\b(inc|llc|ltd|corp|company|technologies|solutions|group|services)\b/i.test(line)) {
          currentExp.company = line
          continue
        }
      }

      // This is likely a bullet point or description
      if (/^[•\-*\u2022]\s*/.test(line)) {
        bullets.push(line.replace(/^[•\-*\u2022]\s*/, ''))
      } else if (line.length > 10) {
        // Might be a continuation or description
        if (bullets.length > 0) {
          // Append to last bullet
          bullets[bullets.length - 1] += ' ' + line
        } else {
          bullets.push(line)
        }
      }
    }
  }

  // Don't forget the last entry
  if (currentExp && (currentExp.company || currentExp.position)) {
    experiences.push(finalizeExperience(currentExp, bullets))
  }

  return experiences
}

function finalizeExperience(exp: Partial<ParsedExperience>, bullets: string[]): ParsedExperience {
  return {
    company: exp.company || 'Unknown Company',
    position: exp.position || 'Unknown Position',
    startDate: exp.startDate,
    endDate: exp.endDate,
    current: exp.current || false,
    description: bullets.join('\n'),
    bullets: [...bullets],
  }
}

/**
 * Parse education section into structured entries
 */
export function parseEducation(content: string): ParsedEducation[] {
  const education: ParsedEducation[] = []
  const lines = content
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean)

  // Skip section header
  let startIndex = 0
  if (/^education|academic|qualifications/i.test(lines[0])) {
    startIndex = 1
  }

  // Degree keywords
  const degreePattern =
    /\b(bachelor'?s?|master'?s?|ph\.?d\.?|mba|bs|ba|ms|ma|b\.?s\.?|b\.?a\.?|m\.?s\.?|m\.?a\.?|associate'?s?|diploma|certificate)\b/i

  let currentEdu: Partial<ParsedEducation> | null = null

  for (let i = startIndex; i < lines.length; i++) {
    const line = lines[i]

    // Check for degree
    const degreeMatch = line.match(degreePattern)
    if (degreeMatch) {
      // Save previous entry
      if (currentEdu && currentEdu.institution) {
        education.push(finalizeEducation(currentEdu))
      }

      // Parse degree and field
      let degree = ''
      let field = ''

      // Common patterns: "Bachelor of Science in Computer Science"
      const fullDegreeMatch = line.match(
        /\b(bachelor'?s?|master'?s?|ph\.?d\.?|mba|bs|ba|ms|ma|associate'?s?)\s+(of|in)?\s*(\w+(\s+\w+)*)\s*(in\s+(\w+(\s+\w+)*))?/i,
      )
      if (fullDegreeMatch) {
        degree = fullDegreeMatch[1] + (fullDegreeMatch[3] ? ' of ' + fullDegreeMatch[3] : '')
        field = fullDegreeMatch[6] || fullDegreeMatch[3] || ''
      } else {
        degree = degreeMatch[0]
        // Try to find field after degree
        const afterDegree = line.substring((degreeMatch.index || 0) + degreeMatch[0].length)
        const fieldMatch = afterDegree.match(/\s+in\s+(\w+(\s+\w+)*)/i)
        if (fieldMatch) {
          field = fieldMatch[1]
        }
      }

      currentEdu = {
        degree: degree.trim(),
        field: field.trim(),
        institution: '',
        description: '',
      }
    } else if (currentEdu) {
      // Check for institution
      if (!currentEdu.institution && /\b(university|college|institute|school|academy)\b/i.test(line)) {
        currentEdu.institution = line.replace(/\d{4}/, '').trim()

        // Check for graduation date in same line
        const dateMatch = line.match(/\b(\d{4})\b/)
        if (dateMatch) {
          currentEdu.endDate = dateMatch[1] + '-05' // Assume May graduation
        }
      } else if (!currentEdu.endDate) {
        // Check for standalone year
        const dateMatch = line.match(/\b(19|20)\d{2}\b/)
        if (dateMatch) {
          currentEdu.endDate = dateMatch[0] + '-05'
        }
      }
    }
  }

  // Don't forget last entry
  if (currentEdu && (currentEdu.institution || currentEdu.degree)) {
    education.push(finalizeEducation(currentEdu))
  }

  return education
}

function finalizeEducation(edu: Partial<ParsedEducation>): ParsedEducation {
  return {
    institution: edu.institution || 'Unknown Institution',
    degree: edu.degree || 'Degree',
    field: edu.field,
    startDate: edu.startDate,
    endDate: edu.endDate,
    description: edu.description,
  }
}

/**
 * Parse projects section
 */
export function parseProjects(content: string): ParsedProject[] {
  const projects: ParsedProject[] = []
  const lines = content
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean)

  // Skip section header
  let startIndex = 0
  if (/^projects?|portfolio/i.test(lines[0])) {
    startIndex = 1
  }

  // URL pattern
  const urlPattern = /https?:\/\/[^\s]+/i

  let currentProject: Partial<ParsedProject> | null = null
  const description: string[] = []

  for (let i = startIndex; i < lines.length; i++) {
    const line = lines[i]

    // Check if this looks like a project name (short, no bullet, might have URL)
    if (!line.startsWith('•') && !line.startsWith('-') && line.length < 100) {
      // Check for URL in this line
      const urlMatch = line.match(urlPattern)

      // New project if this looks like a title
      if (i === startIndex || (currentProject && description.length > 0)) {
        // Save previous project
        if (currentProject && currentProject.name) {
          currentProject.description = description.join('\n')
          projects.push(currentProject as ParsedProject)
          description.length = 0
        }

        currentProject = {
          name: urlMatch ? line.replace(urlMatch[0], '').trim() : line,
          url: urlMatch ? urlMatch[0] : undefined,
          description: '',
        }
      }
    } else if (currentProject) {
      // Extract URL from bullet if present
      const urlMatch = line.match(urlPattern)
      if (urlMatch && !currentProject.url) {
        currentProject.url = urlMatch[0]
      }

      // Add to description
      const cleanLine = line.replace(/^[•\-*\u2022]\s*/, '')
      if (cleanLine.length > 0) {
        description.push(cleanLine)
      }

      // Extract technologies if mentioned
      if (/\b(built with|technologies|tech stack|using):/i.test(cleanLine)) {
        const techPart = cleanLine.split(/:/)[1]
        if (techPart) {
          currentProject.technologies = techPart
            .split(/[,|]/)
            .map((t) => t.trim())
            .filter(Boolean)
        }
      }
    }
  }

  // Save last project
  if (currentProject && currentProject.name) {
    currentProject.description = description.join('\n')
    projects.push(currentProject as ParsedProject)
  }

  return projects
}

/**
 * Parse certifications section
 */
export function parseCertifications(content: string): ParsedCertification[] {
  const certifications: ParsedCertification[] = []
  const lines = content
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean)

  // Skip section header
  let startIndex = 0
  if (/^certifications?|licenses?|credentials?/i.test(lines[0])) {
    startIndex = 1
  }

  for (let i = startIndex; i < lines.length; i++) {
    const line = lines[i].replace(/^[•\-*\u2022]\s*/, '')

    if (line.length < 5) continue

    // Try to parse "Certification Name - Issuer (Date)"
    const cert: Partial<ParsedCertification> = {}

    // Check for issuer patterns
    const issuerPatterns = [
      /\s*[-–—]\s*(.+)$/, // "Cert - Issuer"
      /\s*\((.+)\)\s*$/, // "Cert (Issuer)"
      /\s+by\s+(.+)$/i, // "Cert by Issuer"
      /\s+from\s+(.+)$/i, // "Cert from Issuer"
    ]

    let certName = line
    for (const pattern of issuerPatterns) {
      const match = line.match(pattern)
      if (match) {
        cert.issuer = match[1].trim()
        certName = line.substring(0, match.index).trim()
        break
      }
    }

    cert.name = certName

    // Try to extract date
    const dateMatch = line.match(
      /\b(jan(uary)?|feb(ruary)?|mar(ch)?|apr(il)?|may|jun(e)?|jul(y)?|aug(ust)?|sep(t(ember)?)?|oct(ober)?|nov(ember)?|dec(ember)?)\s*\d{4}|\b\d{4}\b/i,
    )
    if (dateMatch) {
      cert.issueDate = parseDate(dateMatch[0])
    }

    // Check for credential ID
    const credentialMatch = line.match(/\b(credential|id|#)\s*:?\s*([A-Z0-9-]+)/i)
    if (credentialMatch) {
      cert.credentialId = credentialMatch[2]
    }

    // Check for URL
    const urlMatch = line.match(/https?:\/\/[^\s]+/i)
    if (urlMatch) {
      cert.credentialUrl = urlMatch[0]
    }

    if (cert.name) {
      certifications.push({
        name: cert.name,
        issuer: cert.issuer || 'Unknown Issuer',
        issueDate: cert.issueDate,
        expiryDate: cert.expiryDate,
        credentialId: cert.credentialId,
        credentialUrl: cert.credentialUrl,
      })
    }
  }

  return certifications
}
