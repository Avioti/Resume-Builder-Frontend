/**
 * BEATTHEATS - EXTENDED RESUME DATA TYPES
 *
 * Additional section types for dynamic, reorderable resume sections.
 * All sections are optional and can be toggled on/off.
 */

// ===== PROJECT SECTION =====
export interface Project {
  id: string
  name: string
  role?: string // Your role in the project
  url?: string // Link to project (GitHub, live site, etc.)
  startDate?: string // YYYY-MM format
  endDate?: string
  current?: boolean
  description: string
  technologies?: string[] // Tech stack used
}

// ===== CERTIFICATIONS SECTION =====
export interface Certification {
  id: string
  name: string
  issuer: string // Issuing organization
  issueDate?: string // YYYY-MM format
  expiryDate?: string // YYYY-MM format (if applicable)
  credentialId?: string // Credential ID/Number
  credentialUrl?: string // Verification URL
  noExpiry?: boolean // Certification doesn't expire
}

// ===== LINKS SECTION =====
export interface ProfileLink {
  id: string
  type: LinkType
  url: string
  label?: string // Custom label (e.g., "Portfolio", "My GitHub")
}

export type LinkType =
  | 'linkedin'
  | 'github'
  | 'portfolio'
  | 'website'
  | 'twitter'
  | 'dribbble'
  | 'behance'
  | 'medium'
  | 'stackoverflow'
  | 'kaggle'
  | 'other'

// ===== AREAS OF EXPERTISE =====
// Keyword clusters for ATS optimization
export interface ExpertiseArea {
  id: string
  category: string // e.g., "Frontend Development", "Project Management"
  keywords: string[] // Keywords within this category
}

// ===== SECTION CONFIGURATION =====
export interface SectionConfig {
  id: SectionId
  enabled: boolean
  order: number
}

export type SectionId =
  | 'personal'
  | 'summary'
  | 'experience'
  | 'education'
  | 'skills'
  | 'projects'
  | 'certifications'
  | 'expertise'
  | 'links'

// Default section order
export const DEFAULT_SECTION_ORDER: SectionConfig[] = [
  { id: 'personal', enabled: true, order: 0 },
  { id: 'summary', enabled: true, order: 1 },
  { id: 'experience', enabled: true, order: 2 },
  { id: 'education', enabled: true, order: 3 },
  { id: 'skills', enabled: true, order: 4 },
  { id: 'projects', enabled: false, order: 5 },
  { id: 'certifications', enabled: false, order: 6 },
  { id: 'expertise', enabled: false, order: 7 },
  { id: 'links', enabled: false, order: 8 },
]

// Section display names
export const SECTION_LABELS: Record<SectionId, string> = {
  personal: 'Contact Information',
  summary: 'Professional Summary',
  experience: 'Professional Experience',
  education: 'Education',
  skills: 'Skills',
  projects: 'Projects',
  certifications: 'Certifications & Licenses',
  expertise: 'Areas of Expertise',
  links: 'Professional Links',
}

// ATS-safe heading alternatives
export const ATS_SAFE_HEADINGS: Record<SectionId, string[]> = {
  personal: ['Contact Information', 'Contact'],
  summary: ['Professional Summary', 'Summary', 'Profile'],
  experience: ['Professional Experience', 'Work Experience', 'Experience'],
  education: ['Education', 'Academic Background'],
  skills: ['Skills', 'Technical Skills', 'Core Competencies'],
  projects: ['Projects', 'Key Projects', 'Selected Projects'],
  certifications: ['Certifications', 'Certifications & Licenses', 'Licenses'],
  expertise: ['Areas of Expertise', 'Core Competencies', 'Key Competencies'],
  links: ['Professional Links', 'Links', 'Online Profiles'],
}

// ===== EXTENDED RESUME DATA =====
export interface ExtendedResumeData {
  // Core sections (from original)
  personal: {
    fullName: string
    jobTitle: string
    email: string
    phone: string
    location: string
    summary: string
  }
  experiences: Experience[]
  education: Education[]
  skills: string[]

  // Extended sections
  projects: Project[]
  certifications: Certification[]
  expertiseAreas: ExpertiseArea[]
  links: ProfileLink[]

  // Section configuration
  sectionConfig: SectionConfig[]
}

// Re-export core types for convenience
export interface Experience {
  id: string
  company: string
  position: string
  startDate: string
  endDate: string
  current: boolean
  description: string
}

export interface Education {
  id: string
  institution: string
  degree: string
  field: string
  startDate: string
  endDate: string
  description: string
}

// ===== HELPER FUNCTIONS =====

/**
 * Get enabled sections in display order
 */
export function getEnabledSections(config: SectionConfig[]): SectionConfig[] {
  return [...config].filter((s) => s.enabled).sort((a, b) => a.order - b.order)
}

/**
 * Reorder sections (move section to new position)
 */
export function reorderSections(config: SectionConfig[], sectionId: SectionId, newOrder: number): SectionConfig[] {
  const updated = [...config]
  const sectionIndex = updated.findIndex((s) => s.id === sectionId)
  if (sectionIndex === -1) return config

  const section = updated[sectionIndex]
  const oldOrder = section.order

  // Update orders
  updated.forEach((s) => {
    if (s.id === sectionId) {
      s.order = newOrder
    } else if (newOrder < oldOrder) {
      // Moving up: increment orders in between
      if (s.order >= newOrder && s.order < oldOrder) {
        s.order++
      }
    } else {
      // Moving down: decrement orders in between
      if (s.order > oldOrder && s.order <= newOrder) {
        s.order--
      }
    }
  })

  return updated
}

/**
 * Toggle section visibility
 */
export function toggleSection(config: SectionConfig[], sectionId: SectionId): SectionConfig[] {
  return config.map((s) => (s.id === sectionId ? { ...s, enabled: !s.enabled } : s))
}

/**
 * Get link type display name
 */
export function getLinkTypeLabel(type: LinkType): string {
  const labels: Record<LinkType, string> = {
    linkedin: 'LinkedIn',
    github: 'GitHub',
    portfolio: 'Portfolio',
    website: 'Website',
    twitter: 'Twitter/X',
    dribbble: 'Dribbble',
    behance: 'Behance',
    medium: 'Medium',
    stackoverflow: 'Stack Overflow',
    kaggle: 'Kaggle',
    other: 'Other',
  }
  return labels[type] || type
}

/**
 * Validate URL format
 */
export function isValidUrl(url: string): boolean {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

/**
 * Format URL for display (remove protocol, trailing slash)
 */
export function formatUrlForDisplay(url: string): string {
  try {
    const parsed = new URL(url)
    return (parsed.host + parsed.pathname).replace(/\/$/, '')
  } catch {
    return url
  }
}
