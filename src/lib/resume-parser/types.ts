/**
 * Resume Parser Types
 * Types for parsed resume data and section detection
 */

export interface ParsedContact {
  email?: string
  phone?: string
  location?: string
  linkedin?: string
  github?: string
  website?: string
}

export interface ParsedExperience {
  company: string
  position: string
  startDate?: string
  endDate?: string
  current?: boolean
  description: string
  bullets: string[]
}

export interface ParsedEducation {
  institution: string
  degree: string
  field?: string
  startDate?: string
  endDate?: string
  description?: string
}

export interface ParsedProject {
  name: string
  role?: string
  url?: string
  startDate?: string
  endDate?: string
  description: string
  technologies?: string[]
}

export interface ParsedCertification {
  name: string
  issuer: string
  issueDate?: string
  expiryDate?: string
  credentialId?: string
  credentialUrl?: string
}

export interface ParsedResume {
  // Personal info
  fullName?: string
  jobTitle?: string
  contact: ParsedContact
  summary?: string

  // Sections
  experiences: ParsedExperience[]
  education: ParsedEducation[]
  skills: string[]
  projects: ParsedProject[]
  certifications: ParsedCertification[]

  // Raw text for debugging
  rawText: string

  // Parser metadata
  parseInfo: {
    source: 'pdf' | 'docx' | 'text'
    fileName: string
    parseDate: string
    confidence: number // 0-100
    warnings: string[]
  }
}

// Section detection patterns
export interface SectionMatch {
  type: SectionType
  startIndex: number
  endIndex: number
  content: string
  confidence: number
}

export type SectionType =
  | 'contact'
  | 'summary'
  | 'experience'
  | 'education'
  | 'skills'
  | 'projects'
  | 'certifications'
  | 'links'
  | 'unknown'

// Import result
export interface ImportResult {
  success: boolean
  data?: ParsedResume
  error?: string
}
