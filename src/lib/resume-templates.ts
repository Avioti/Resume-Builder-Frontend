/**
 * Resume Templates System
 *
 * Defines available resume templates with ATS compatibility ratings.
 * Each template has specific styling characteristics and ATS risk levels.
 */

export type ATSRiskLevel = 'safe' | 'caution' | 'risky'

export interface ResumeTemplate {
  id: string
  name: string
  description: string
  /** ATS compatibility risk level */
  atsRisk: ATSRiskLevel
  /** Explanation of ATS risks or benefits */
  atsNotes: string[]
  /** Preview thumbnail (could be component or image path) */
  thumbnail?: string
  /** Template style configuration */
  style: TemplateStyle
}

export interface TemplateStyle {
  /** Primary color (HSL or hex) */
  accentColor: string
  /** Header style variant */
  headerStyle: 'centered' | 'left-aligned' | 'minimal'
  /** Section heading style */
  sectionStyle: 'underlined' | 'background' | 'simple' | 'border-left'
  /** Font family */
  fontFamily: 'inter' | 'georgia' | 'times'
  /** Spacing density */
  density: 'compact' | 'normal' | 'spacious'
  /** Show icons in contact section */
  showContactIcons: boolean
  /** Show section dividers */
  showDividers: boolean
  /** Border radius for elements */
  borderRadius: 'none' | 'small' | 'medium'
}

// ===== TEMPLATE DEFINITIONS =====

export const RESUME_TEMPLATES: ResumeTemplate[] = [
  {
    id: 'ats-classic',
    name: 'ATS Classic',
    description: 'Maximum ATS compatibility with clean, professional formatting',
    atsRisk: 'safe',
    atsNotes: [
      'Single-column layout parses perfectly',
      'Standard section headings recognized by all ATS',
      'No graphics or icons that could confuse parsers',
      'Times/Inter font family is universally supported',
    ],
    style: {
      accentColor: '222 47% 11%', // Dark gray
      headerStyle: 'left-aligned',
      sectionStyle: 'underlined',
      fontFamily: 'inter',
      density: 'normal',
      showContactIcons: false,
      showDividers: true,
      borderRadius: 'none',
    },
  },
  {
    id: 'modern-professional',
    name: 'Modern Professional',
    description: 'Contemporary design with subtle accent colors, still ATS-safe',
    atsRisk: 'safe',
    atsNotes: [
      'Clean single-column layout',
      'Accent colors are text-based, not graphical',
      'Section headers use standard naming conventions',
      'Modern fonts are ATS-compatible',
    ],
    style: {
      accentColor: '217 91% 60%', // Blue
      headerStyle: 'centered',
      sectionStyle: 'simple',
      fontFamily: 'inter',
      density: 'normal',
      showContactIcons: false,
      showDividers: false,
      borderRadius: 'small',
    },
  },
  {
    id: 'compact-dense',
    name: 'Compact Dense',
    description: 'Fit more content with tighter spacing - great for experienced professionals',
    atsRisk: 'safe',
    atsNotes: [
      'Optimized for maximum content',
      'Still maintains ATS-readable structure',
      'Smaller margins may print differently',
      'Best for 2+ page resumes',
    ],
    style: {
      accentColor: '222 47% 11%',
      headerStyle: 'minimal',
      sectionStyle: 'simple',
      fontFamily: 'inter',
      density: 'compact',
      showContactIcons: false,
      showDividers: false,
      borderRadius: 'none',
    },
  },
  {
    id: 'executive',
    name: 'Executive',
    description: 'Elegant serif typography for senior roles and traditional industries',
    atsRisk: 'safe',
    atsNotes: [
      'Georgia/Times font is highly ATS-compatible',
      'Traditional layout for conservative industries',
      'Works well for finance, law, executive roles',
      'Clean hierarchy with clear section breaks',
    ],
    style: {
      accentColor: '222 47% 20%',
      headerStyle: 'centered',
      sectionStyle: 'underlined',
      fontFamily: 'georgia',
      density: 'spacious',
      showContactIcons: false,
      showDividers: true,
      borderRadius: 'none',
    },
  },
  {
    id: 'tech-modern',
    name: 'Tech Modern',
    description: 'Clean, developer-friendly layout with accent highlights',
    atsRisk: 'caution',
    atsNotes: [
      'Accent colored section headers may not parse in some ATS',
      'Single-column layout is still safe',
      'Recommended for direct applications, not job boards',
      'Great for portfolios and personal websites',
    ],
    style: {
      accentColor: '142 76% 36%', // Green
      headerStyle: 'left-aligned',
      sectionStyle: 'border-left',
      fontFamily: 'inter',
      density: 'normal',
      showContactIcons: true,
      showDividers: false,
      borderRadius: 'small',
    },
  },
  {
    id: 'creative-minimal',
    name: 'Creative Minimal',
    description: 'Bold header with minimalist body - for design-conscious roles',
    atsRisk: 'caution',
    atsNotes: [
      'Contact icons may not be parsed correctly',
      'Some ATS may misread the header layout',
      'Best for creative industries and direct submissions',
      'Not recommended for automated job board applications',
    ],
    style: {
      accentColor: '262 83% 58%', // Purple
      headerStyle: 'centered',
      sectionStyle: 'background',
      fontFamily: 'inter',
      density: 'spacious',
      showContactIcons: true,
      showDividers: false,
      borderRadius: 'medium',
    },
  },
]

// ===== HELPER FUNCTIONS =====

export function getTemplateById(id: string): ResumeTemplate | undefined {
  return RESUME_TEMPLATES.find((t) => t.id === id)
}

export function getDefaultTemplate(): ResumeTemplate {
  return RESUME_TEMPLATES[0] // ATS Classic
}

export function getTemplatesByRisk(risk: ATSRiskLevel): ResumeTemplate[] {
  return RESUME_TEMPLATES.filter((t) => t.atsRisk === risk)
}

export function getSafeTemplates(): ResumeTemplate[] {
  return RESUME_TEMPLATES.filter((t) => t.atsRisk === 'safe')
}

export function getATSRiskLabel(risk: ATSRiskLevel): string {
  switch (risk) {
    case 'safe':
      return 'ATS Safe'
    case 'caution':
      return 'Use with Caution'
    case 'risky':
      return 'Not ATS-Friendly'
    default:
      return 'Unknown'
  }
}

export function getATSRiskColor(risk: ATSRiskLevel): string {
  switch (risk) {
    case 'safe':
      return 'text-green-600 bg-green-50 border-green-200'
    case 'caution':
      return 'text-amber-600 bg-amber-50 border-amber-200'
    case 'risky':
      return 'text-red-600 bg-red-50 border-red-200'
    default:
      return 'text-gray-600 bg-gray-50 border-gray-200'
  }
}

// CSS variable generator for template styles
export function getTemplateCSS(style: TemplateStyle): Record<string, string> {
  const fontFamilies = {
    inter: "'Inter', system-ui, sans-serif",
    georgia: "'Georgia', 'Times New Roman', serif",
    times: "'Times New Roman', Times, serif",
  }

  const densitySpacing = {
    compact: { section: '12px', item: '8px', lineHeight: '1.35' },
    normal: { section: '20px', item: '12px', lineHeight: '1.5' },
    spacious: { section: '28px', item: '16px', lineHeight: '1.6' },
  }

  const spacing = densitySpacing[style.density]

  return {
    '--template-accent': `hsl(${style.accentColor})`,
    '--template-font': fontFamilies[style.fontFamily],
    '--template-section-gap': spacing.section,
    '--template-item-gap': spacing.item,
    '--template-line-height': spacing.lineHeight,
  }
}
