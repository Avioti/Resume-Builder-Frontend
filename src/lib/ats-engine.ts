/**
 * BEATTHEATS - ATS OPTIMIZATION ENGINE
 *
 * Core logic for generating ATS-safe resume content.
 * Ensures clean hierarchy, consistent spacing, and machine-readable structure.
 */

// Characters that commonly break ATS parsers
const ATS_UNSAFE_CHARS = [
  '•', // Use simple dash or asterisk instead
  '→',
  '←',
  '↓',
  '↑',
  '★',
  '☆',
  '■',
  '□',
  '●',
  '○',
  '◆',
  '◇',
  '►',
  '▼',
  '✓',
  '✔',
  '✕',
  '✖',
  '✗',
  '✘',
  '♦',
  '♣',
  '♠',
  '♥',
  '©',
  '®',
  '™',
  '℠',
  '…', // Use ... instead
  '"', // Use straight quotes
  '"',
  '\u2018', // Left single quote
  '\u2019', // Right single quote
  '–', // Use simple hyphen
  '—',
  '×',
  '÷',
]

// Standard ATS-safe section headings (most ATS systems recognize these)
export const ATS_SAFE_HEADINGS = {
  summary: ['Professional Summary', 'Summary', 'Profile', 'Career Summary', 'Executive Summary'],
  experience: ['Professional Experience', 'Work Experience', 'Experience', 'Employment History', 'Work History'],
  education: ['Education', 'Academic Background', 'Educational Background'],
  skills: ['Skills', 'Technical Skills', 'Core Competencies', 'Areas of Expertise', 'Key Skills'],
  projects: ['Projects', 'Key Projects', 'Selected Projects'],
  certifications: ['Certifications', 'Licenses', 'Certifications & Licenses', 'Professional Certifications'],
  links: ['Links', 'Professional Links', 'Online Profiles'],
} as const

// ATS-safe fonts that render consistently across systems
export const ATS_SAFE_FONTS = ['Inter', 'Arial', 'Calibri', 'Helvetica', 'Times New Roman', 'Georgia', 'Garamond']

// ATS-safe bullet characters (ordered by compatibility)
export const ATS_SAFE_BULLETS = ['-', '*', '•'] // hyphen is safest

/**
 * Sanitize text for ATS compatibility
 * Replaces problematic characters with ATS-safe alternatives
 */
export function sanitizeForATS(text: string): string {
  if (!text) return ''

  let sanitized = text

  // Replace smart quotes with straight quotes
  sanitized = sanitized.replace(/[""]/g, '"').replace(/['']/g, "'")

  // Replace em/en dashes with hyphens
  sanitized = sanitized.replace(/[–—]/g, '-')

  // Replace ellipsis with three dots
  sanitized = sanitized.replace(/…/g, '...')

  // Replace fancy bullets with simple hyphens
  sanitized = sanitized.replace(/[•●○◆◇►▼■□★☆♦♣♠♥✓✔✕✖✗✘]/g, '-')

  // Replace arrows with text alternatives
  sanitized = sanitized.replace(/[→]/g, '->')
  sanitized = sanitized.replace(/[←]/g, '<-')

  // Remove other problematic characters
  sanitized = sanitized.replace(/[©®™℠×÷]/g, '')

  // Normalize whitespace (multiple spaces to single)
  sanitized = sanitized.replace(/\s+/g, ' ')

  // Remove leading/trailing whitespace from lines
  sanitized = sanitized
    .split('\n')
    .map((line) => line.trim())
    .join('\n')

  return sanitized.trim()
}

/**
 * Format bullet points for ATS compatibility
 * Ensures consistent bullet character and spacing
 */
export function formatBulletPoints(text: string, bulletChar = '-'): string {
  if (!text) return ''

  // Split by newlines and process each line
  const lines = text.split('\n')

  return lines
    .map((line) => {
      const trimmed = line.trim()
      if (!trimmed) return ''

      // Check if line already starts with a bullet-like character
      const bulletPattern = /^[-*•●○◆►▼]\s*/
      if (bulletPattern.test(trimmed)) {
        // Replace existing bullet with standard one
        return `${bulletChar} ${trimmed.replace(bulletPattern, '')}`
      }

      // If line doesn't start with bullet, add one
      return `${bulletChar} ${trimmed}`
    })
    .filter(Boolean)
    .join('\n')
}

/**
 * Parse description text into structured bullet points
 * Splits on common delimiters and formats for ATS
 */
export function parseDescriptionToBullets(description: string): string[] {
  if (!description) return []

  // First sanitize the text
  const sanitized = sanitizeForATS(description)

  // Split by newlines, semicolons, or numbered lists
  const lines = sanitized
    .split(/[\n;]|(?:\d+\.\s)/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0)

  return lines
}

/**
 * Validates if a phone number is ATS-safe format
 * ATS systems prefer consistent formats like (555) 123-4567 or 555-123-4567
 */
export function formatPhoneForATS(phone: string): string {
  if (!phone) return ''

  // Remove all non-numeric characters
  const digits = phone.replace(/\D/g, '')

  // Handle different lengths
  if (digits.length === 10) {
    // US format: (XXX) XXX-XXXX
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`
  } else if (digits.length === 11 && digits.startsWith('1')) {
    // US with country code: +1 (XXX) XXX-XXXX
    return `+1 (${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7)}`
  }

  // Return original if can't parse
  return phone
}

/**
 * Format email for ATS (lowercase, trimmed)
 */
export function formatEmailForATS(email: string): string {
  return email?.toLowerCase().trim() || ''
}

/**
 * Calculate approximate ATS compatibility score (0-100)
 * Based on content analysis
 */
export interface ATSAnalysis {
  score: number
  issues: ATSIssue[]
  suggestions: string[]
}

export interface ATSIssue {
  type: 'error' | 'warning' | 'info'
  field: string
  message: string
}

export function analyzeATSCompatibility(data: {
  personal: {
    fullName: string
    jobTitle: string
    email: string
    phone: string
    location: string
    summary: string
  }
  experiences: Array<{
    position: string
    company: string
    description: string
  }>
  education: Array<{
    degree: string
    institution: string
  }>
  skills: string[]
}): ATSAnalysis {
  const issues: ATSIssue[] = []
  const suggestions: string[] = []
  let score = 100

  // Check for required fields
  if (!data.personal.fullName) {
    issues.push({ type: 'error', field: 'fullName', message: 'Name is required' })
    score -= 20
  }

  if (!data.personal.email) {
    issues.push({ type: 'error', field: 'email', message: 'Email is required for ATS contact info' })
    score -= 15
  }

  if (!data.personal.phone) {
    issues.push({ type: 'warning', field: 'phone', message: 'Phone number helps recruiters contact you' })
    score -= 5
  }

  if (!data.personal.jobTitle) {
    issues.push({ type: 'warning', field: 'jobTitle', message: 'Job title helps ATS categorize your resume' })
    score -= 10
  }

  // Check summary length
  if (!data.personal.summary) {
    suggestions.push('Add a professional summary to improve ATS matching')
    score -= 5
  } else if (data.personal.summary.length < 50) {
    issues.push({ type: 'warning', field: 'summary', message: 'Summary is too short for optimal ATS matching' })
    score -= 5
  } else if (data.personal.summary.length > 500) {
    issues.push({ type: 'info', field: 'summary', message: 'Consider shortening summary for better readability' })
  }

  // Check experience
  if (data.experiences.length === 0) {
    issues.push({ type: 'error', field: 'experience', message: 'Add work experience for ATS to analyze' })
    score -= 15
  } else {
    data.experiences.forEach((exp, index) => {
      if (!exp.description || exp.description.length < 30) {
        issues.push({
          type: 'warning',
          field: `experience.${index}`,
          message: `Add more detail to "${exp.position}" role for better keyword matching`,
        })
        score -= 3
      }

      // Check for unsafe characters
      if (ATS_UNSAFE_CHARS.some((char) => exp.description?.includes(char))) {
        issues.push({
          type: 'warning',
          field: `experience.${index}`,
          message: `"${exp.position}" description contains characters that may not parse correctly`,
        })
        score -= 2
      }
    })
  }

  // Check skills
  if (data.skills.length === 0) {
    issues.push({ type: 'warning', field: 'skills', message: 'Add skills for ATS keyword matching' })
    score -= 10
  } else if (data.skills.length < 5) {
    suggestions.push('Add more skills to improve keyword matching')
    score -= 5
  }

  // Check education
  if (data.education.length === 0) {
    issues.push({ type: 'info', field: 'education', message: 'Education section helps with role requirements' })
    score -= 5
  }

  // Ensure score stays within bounds
  score = Math.max(0, Math.min(100, score))

  return { score, issues, suggestions }
}

/**
 * Check if text contains ATS-unsafe characters
 */
export function hasUnsafeCharacters(text: string): boolean {
  return ATS_UNSAFE_CHARS.some((char) => text.includes(char))
}

/**
 * Get list of unsafe characters found in text
 */
export function getUnsafeCharacters(text: string): string[] {
  return ATS_UNSAFE_CHARS.filter((char) => text.includes(char))
}

/**
 * Generate ATS-optimized plain text version of resume
 * Useful for copy-paste into job application forms
 */
export function generatePlainTextResume(data: {
  personal: {
    fullName: string
    jobTitle: string
    email: string
    phone: string
    location: string
    summary: string
  }
  experiences: Array<{
    position: string
    company: string
    startDate: string
    endDate: string
    current: boolean
    description: string
  }>
  education: Array<{
    degree: string
    field: string
    institution: string
    endDate: string
  }>
  skills: string[]
}): string {
  const lines: string[] = []

  // Header
  lines.push(data.personal.fullName.toUpperCase())
  if (data.personal.jobTitle) lines.push(data.personal.jobTitle)
  lines.push('')

  // Contact
  const contactParts: string[] = []
  if (data.personal.email) contactParts.push(formatEmailForATS(data.personal.email))
  if (data.personal.phone) contactParts.push(formatPhoneForATS(data.personal.phone))
  if (data.personal.location) contactParts.push(data.personal.location)
  if (contactParts.length > 0) {
    lines.push(contactParts.join(' | '))
    lines.push('')
  }

  // Summary
  if (data.personal.summary) {
    lines.push('PROFESSIONAL SUMMARY')
    lines.push('-'.repeat(40))
    lines.push(sanitizeForATS(data.personal.summary))
    lines.push('')
  }

  // Experience
  if (data.experiences.length > 0) {
    lines.push('PROFESSIONAL EXPERIENCE')
    lines.push('-'.repeat(40))
    data.experiences.forEach((exp) => {
      lines.push(`${exp.position}`)
      lines.push(`${exp.company}`)
      const dateRange = exp.current ? `${exp.startDate} - Present` : `${exp.startDate} - ${exp.endDate || 'Present'}`
      lines.push(dateRange)
      if (exp.description) {
        const bullets = parseDescriptionToBullets(exp.description)
        bullets.forEach((bullet) => {
          lines.push(`- ${bullet}`)
        })
      }
      lines.push('')
    })
  }

  // Education
  if (data.education.length > 0) {
    lines.push('EDUCATION')
    lines.push('-'.repeat(40))
    data.education.forEach((edu) => {
      const degree = edu.field ? `${edu.degree} in ${edu.field}` : edu.degree
      lines.push(degree)
      lines.push(edu.institution)
      if (edu.endDate) lines.push(edu.endDate)
      lines.push('')
    })
  }

  // Skills
  if (data.skills.length > 0) {
    lines.push('SKILLS')
    lines.push('-'.repeat(40))
    lines.push(data.skills.join(', '))
  }

  return lines.join('\n')
}

/**
 * Estimate reading time for a resume (recruiters average 6-7 seconds)
 */
export function estimateReadingTime(wordCount: number): number {
  // Average reading speed: 200-250 words per minute
  // For scanning: ~500 words per minute
  const scanningSpeed = 500
  return Math.ceil((wordCount / scanningSpeed) * 60) // returns seconds
}

/**
 * Count words in resume
 */
export function countResumeWords(data: {
  personal: { summary: string }
  experiences: Array<{ description: string; position: string; company: string }>
  education: Array<{ degree: string; institution: string; description?: string }>
  skills: string[]
}): number {
  let wordCount = 0

  // Summary
  if (data.personal.summary) {
    wordCount += data.personal.summary.split(/\s+/).length
  }

  // Experience
  data.experiences.forEach((exp) => {
    wordCount += (exp.position + ' ' + exp.company).split(/\s+/).length
    if (exp.description) {
      wordCount += exp.description.split(/\s+/).length
    }
  })

  // Education
  data.education.forEach((edu) => {
    wordCount += (edu.degree + ' ' + edu.institution).split(/\s+/).length
  })

  // Skills
  wordCount += data.skills.length

  return wordCount
}
