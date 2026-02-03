/**
 * Section Detection Engine
 * Identifies resume sections from raw text using pattern matching
 */

import { SectionMatch, SectionType } from './types'

// Common section header patterns (case-insensitive)
const SECTION_PATTERNS: Record<SectionType, RegExp[]> = {
  contact: [
    /^(contact\s*(info(rmation)?)?|personal\s*(info(rmation)?|details)?)/im,
    /^(address|phone|email|location)/im,
  ],
  summary: [
    /^(professional\s*summary|summary|profile|objective|about\s*me|career\s*objective)/im,
    /^(executive\s*summary|career\s*summary|personal\s*statement)/im,
  ],
  experience: [
    /^(professional\s*experience|work\s*experience|experience|employment(\s*history)?)/im,
    /^(work\s*history|career\s*history|relevant\s*experience)/im,
  ],
  education: [
    /^(education|academic(\s*background)?|educational\s*background)/im,
    /^(qualifications|academic\s*qualifications|degrees?)/im,
  ],
  skills: [
    /^(skills|technical\s*skills|core\s*competencies|competencies)/im,
    /^(areas?\s*of\s*expertise|key\s*skills|proficiencies|technologies)/im,
  ],
  projects: [
    /^(projects?|key\s*projects?|selected\s*projects?|personal\s*projects?)/im,
    /^(portfolio|notable\s*projects?)/im,
  ],
  certifications: [
    /^(certifications?|licenses?|certifications?\s*(&|and)?\s*licenses?)/im,
    /^(professional\s*certifications?|credentials?|accreditations?)/im,
  ],
  links: [
    /^(links?|online\s*profiles?|social\s*media|web\s*presence)/im,
    /^(professional\s*links?|portfolio\s*links?)/im,
  ],
  unknown: [],
}

// Date patterns for detecting experience/education entries
const DATE_PATTERNS = [
  // "Jan 2020 - Present", "January 2020 - Dec 2023"
  /\b(jan(uary)?|feb(ruary)?|mar(ch)?|apr(il)?|may|jun(e)?|jul(y)?|aug(ust)?|sep(t(ember)?)?|oct(ober)?|nov(ember)?|dec(ember)?)\s*\d{4}\s*[-–—]\s*(present|current|\d{4}|(jan(uary)?|feb(ruary)?|mar(ch)?|apr(il)?|may|jun(e)?|jul(y)?|aug(ust)?|sep(t(ember)?)?|oct(ober)?|nov(ember)?|dec(ember)?)\s*\d{4})/gi,
  // "2020 - 2023", "2020 - Present"
  /\b\d{4}\s*[-–—]\s*(present|current|\d{4})\b/gi,
  // "01/2020 - 12/2023"
  /\b\d{1,2}\/\d{4}\s*[-–—]\s*(\d{1,2}\/\d{4}|present|current)\b/gi,
]

// Email pattern
const EMAIL_PATTERN = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g

// Phone patterns (various formats)
const PHONE_PATTERNS = [
  /\b\+?1?[-.\s]?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}\b/g, // US format
  /\b\+?\d{1,3}[-.\s]?\d{2,4}[-.\s]?\d{3,4}[-.\s]?\d{3,4}\b/g, // International
]

// URL patterns
const URL_PATTERN = /https?:\/\/[^\s<>"{}|\\^`[\]]+/gi
const LINKEDIN_PATTERN = /linkedin\.com\/in\/[\w-]+/gi
const GITHUB_PATTERN = /github\.com\/[\w-]+/gi

/**
 * Detect sections in resume text
 */
export function detectSections(text: string): SectionMatch[] {
  const lines = text.split('\n')
  const sections: SectionMatch[] = []
  let currentIndex = 0

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim()
    const lineStart = currentIndex

    // Check each section type
    for (const [sectionType, patterns] of Object.entries(SECTION_PATTERNS)) {
      if (sectionType === 'unknown') continue

      for (const pattern of patterns) {
        if (pattern.test(line)) {
          // Found a section header
          const endIndex = findSectionEnd(lines, i)
          const content = lines.slice(i, endIndex + 1).join('\n')

          sections.push({
            type: sectionType as SectionType,
            startIndex: lineStart,
            endIndex: lineStart + content.length,
            content,
            confidence: calculateConfidence(sectionType as SectionType, content),
          })
          break
        }
      }
    }

    currentIndex += lines[i].length + 1 // +1 for newline
  }

  // Sort by position and resolve overlaps
  sections.sort((a, b) => a.startIndex - b.startIndex)
  return resolveOverlaps(sections)
}

/**
 * Find where a section ends (next section header or end of text)
 */
function findSectionEnd(lines: string[], startLine: number): number {
  for (let i = startLine + 1; i < lines.length; i++) {
    const line = lines[i].trim()

    // Check if this line is a new section header
    for (const patterns of Object.values(SECTION_PATTERNS)) {
      for (const pattern of patterns) {
        if (pattern.test(line)) {
          return i - 1
        }
      }
    }
  }
  return lines.length - 1
}

/**
 * Calculate confidence score for section detection
 */
function calculateConfidence(sectionType: SectionType, content: string): number {
  let confidence = 70 // Base confidence for header match

  switch (sectionType) {
    case 'experience':
      // Higher confidence if we find date ranges and company-like patterns
      if (DATE_PATTERNS.some((p) => p.test(content))) confidence += 15
      if (/\b(inc|llc|ltd|corp|company|technologies|solutions)\b/i.test(content)) confidence += 10
      break

    case 'education':
      // Higher confidence for degree keywords
      if (/\b(bachelor|master|phd|mba|bs|ba|ms|ma|degree|university|college|institute)\b/i.test(content)) {
        confidence += 20
      }
      break

    case 'skills':
      // Higher confidence if we find skill-like patterns (comma-separated lists)
      if ((content.match(/,/g) || []).length > 3) confidence += 15
      if (/\b(proficient|experienced|expert|advanced|intermediate)\b/i.test(content)) confidence += 10
      break

    case 'certifications':
      // Look for certification indicators
      if (/\b(certified|certificate|certification|license|credential)\b/i.test(content)) confidence += 20
      break

    case 'projects':
      // Look for project indicators
      if (URL_PATTERN.test(content) || GITHUB_PATTERN.test(content)) confidence += 15
      break

    case 'summary': {
      // Summary sections are usually 1-3 paragraphs
      const wordCount = content.split(/\s+/).length
      if (wordCount > 20 && wordCount < 200) confidence += 15
      break
    }
  }

  return Math.min(confidence, 100)
}

/**
 * Resolve overlapping sections
 */
function resolveOverlaps(sections: SectionMatch[]): SectionMatch[] {
  if (sections.length <= 1) return sections

  const resolved: SectionMatch[] = [sections[0]]

  for (let i = 1; i < sections.length; i++) {
    const current = sections[i]
    const previous = resolved[resolved.length - 1]

    if (current.startIndex > previous.endIndex) {
      // No overlap
      resolved.push(current)
    } else if (current.confidence > previous.confidence) {
      // Current has higher confidence, replace previous
      resolved[resolved.length - 1] = current
    }
    // Otherwise, keep previous (higher confidence)
  }

  return resolved
}

/**
 * Extract contact information from text
 */
export function extractContactInfo(text: string): {
  email?: string
  phone?: string
  linkedin?: string
  github?: string
  website?: string
  location?: string
} {
  const contact: ReturnType<typeof extractContactInfo> = {}

  // Email
  const emailMatch = text.match(EMAIL_PATTERN)
  if (emailMatch) {
    contact.email = emailMatch[0]
  }

  // Phone
  for (const pattern of PHONE_PATTERNS) {
    const phoneMatch = text.match(pattern)
    if (phoneMatch) {
      contact.phone = phoneMatch[0]
      break
    }
  }

  // LinkedIn
  const linkedinMatch = text.match(LINKEDIN_PATTERN)
  if (linkedinMatch) {
    contact.linkedin = `https://${linkedinMatch[0]}`
  }

  // GitHub
  const githubMatch = text.match(GITHUB_PATTERN)
  if (githubMatch) {
    contact.github = `https://${githubMatch[0]}`
  }

  // Other URLs (portfolio/website)
  const urls = text.match(URL_PATTERN) || []
  for (const url of urls) {
    if (!url.includes('linkedin.com') && !url.includes('github.com')) {
      contact.website = url
      break
    }
  }

  // Location (city, state patterns)
  const locationPattern = /\b([A-Z][a-z]+(?:\s[A-Z][a-z]+)*),\s*([A-Z]{2})\b/
  const locationMatch = text.match(locationPattern)
  if (locationMatch) {
    contact.location = locationMatch[0]
  }

  return contact
}

/**
 * Extract name from the beginning of resume text
 * Names are typically at the top, in larger text or standalone
 */
export function extractName(text: string): string | undefined {
  const lines = text
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean)

  // First non-empty line is often the name
  if (lines.length > 0) {
    const firstLine = lines[0]

    // Check if it looks like a name (2-4 words, capitalized, no special chars)
    if (/^[A-Z][a-z]+(\s+[A-Z][a-z]+){1,3}$/.test(firstLine)) {
      return firstLine
    }

    // Check for "Name: John Doe" pattern
    const nameMatch = firstLine.match(/^name:\s*(.+)$/i)
    if (nameMatch) {
      return nameMatch[1].trim()
    }
  }

  return undefined
}

/**
 * Extract job title - usually right after name
 */
export function extractJobTitle(text: string, name?: string): string | undefined {
  const lines = text
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean)

  // Common job title keywords
  const titleKeywords = [
    'engineer',
    'developer',
    'manager',
    'designer',
    'analyst',
    'consultant',
    'specialist',
    'lead',
    'director',
    'architect',
    'administrator',
    'coordinator',
    'executive',
  ]

  // Find name index
  let startIndex = 0
  if (name) {
    startIndex = lines.findIndex((l) => l.toLowerCase().includes(name.toLowerCase()))
    if (startIndex >= 0) startIndex += 1
  }

  // Check next few lines for job title
  for (let i = startIndex; i < Math.min(startIndex + 3, lines.length); i++) {
    const line = lines[i].toLowerCase()
    if (titleKeywords.some((kw) => line.includes(kw))) {
      return lines[i]
    }
  }

  return undefined
}

/**
 * Parse skills from a skills section
 */
export function parseSkills(content: string): string[] {
  const skills: string[] = []

  // Try different delimiters
  const delimiters = [',', '|', '•', '·', '\n', ';']

  for (const delimiter of delimiters) {
    if (content.includes(delimiter)) {
      const items = content
        .split(delimiter)
        .map((s) => s.trim())
        .filter(Boolean)
      // Filter out section headers and very long items
      const validItems = items.filter((item) => {
        return item.length > 1 && item.length < 50 && !/^(skills|technical|core|areas)/i.test(item)
      })
      if (validItems.length > skills.length) {
        skills.length = 0
        skills.push(...validItems)
      }
    }
  }

  // Deduplicate
  return [...new Set(skills)]
}

/**
 * Parse date string to YYYY-MM format
 */
export function parseDate(dateStr: string): string | undefined {
  if (!dateStr) return undefined

  const str = dateStr.toLowerCase().trim()

  // Handle "present" or "current"
  if (str === 'present' || str === 'current') {
    return undefined // Will be marked as current
  }

  // Month name + year: "January 2024", "Jan 2024"
  const monthYearMatch = str.match(
    /(jan(uary)?|feb(ruary)?|mar(ch)?|apr(il)?|may|jun(e)?|jul(y)?|aug(ust)?|sep(t(ember)?)?|oct(ober)?|nov(ember)?|dec(ember)?)\s*(\d{4})/i,
  )
  if (monthYearMatch) {
    const month = monthYearMatch[1].substring(0, 3).toLowerCase()
    const monthMap: Record<string, string> = {
      jan: '01',
      feb: '02',
      mar: '03',
      apr: '04',
      may: '05',
      jun: '06',
      jul: '07',
      aug: '08',
      sep: '09',
      oct: '10',
      nov: '11',
      dec: '12',
    }
    const year = monthYearMatch[monthYearMatch.length - 1]
    return `${year}-${monthMap[month]}`
  }

  // Just year: "2024"
  const yearMatch = str.match(/\b(\d{4})\b/)
  if (yearMatch) {
    return `${yearMatch[1]}-01`
  }

  // MM/YYYY: "01/2024"
  const mmyyyyMatch = str.match(/(\d{1,2})\/(\d{4})/)
  if (mmyyyyMatch) {
    const month = mmyyyyMatch[1].padStart(2, '0')
    return `${mmyyyyMatch[2]}-${month}`
  }

  return undefined
}
