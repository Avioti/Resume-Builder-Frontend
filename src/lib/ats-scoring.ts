/**
 * ATS Scoring Engine
 * Analyzes resume content for ATS compatibility and keyword matching
 */

import { ExtendedResumeData } from './extended-resume-context'

// ===== TYPES =====
export interface ATSScore {
  overall: number // 0-100
  breakdown: {
    completeness: number // 0-100
    keywords: number // 0-100
    formatting: number // 0-100
    content: number // 0-100
  }
  suggestions: Suggestion[]
  matchedKeywords: string[]
  missingKeywords: string[]
}

export interface Suggestion {
  id: string
  category: 'critical' | 'important' | 'optional'
  section: string
  message: string
  action?: string
}

export interface KeywordAnalysis {
  extracted: string[]
  matched: string[]
  missing: string[]
  matchRate: number
}

// ===== KEYWORD EXTRACTION =====

// Common stop words to filter out
const STOP_WORDS = new Set([
  'a',
  'an',
  'and',
  'are',
  'as',
  'at',
  'be',
  'by',
  'for',
  'from',
  'has',
  'have',
  'in',
  'is',
  'it',
  'of',
  'on',
  'or',
  'that',
  'the',
  'to',
  'was',
  'were',
  'will',
  'with',
  'you',
  'your',
  'we',
  'our',
  'their',
  'they',
  'this',
  'these',
  'those',
  'can',
  'could',
  'would',
  'should',
  'may',
  'might',
  'must',
  'shall',
  'need',
  'about',
  'above',
  'after',
  'before',
  'between',
  'into',
  'through',
  'during',
  'under',
  'again',
  'further',
  'then',
  'once',
  'here',
  'there',
  'when',
  'where',
  'why',
  'how',
  'all',
  'each',
  'few',
  'more',
  'most',
  'other',
  'some',
  'such',
  'no',
  'nor',
  'not',
  'only',
  'own',
  'same',
  'so',
  'than',
  'too',
  'very',
  'just',
  'but',
  'if',
  'because',
  'until',
  'while',
  'also',
  'both',
  'either',
  'neither',
  'experience',
  'work',
  'working',
  'worked',
  'job',
  'position',
  'role',
  'team',
  'company',
  'years',
  'year',
  'etc',
  'including',
  'include',
  'includes',
])

// Common tech skills and keywords to prioritize
const TECH_KEYWORDS = new Set([
  // Programming Languages
  'javascript',
  'typescript',
  'python',
  'java',
  'c++',
  'c#',
  'ruby',
  'go',
  'rust',
  'swift',
  'kotlin',
  'php',
  'scala',
  'r',
  'matlab',
  'sql',
  'html',
  'css',
  'sass',
  // Frameworks & Libraries
  'react',
  'angular',
  'vue',
  'node',
  'express',
  'django',
  'flask',
  'spring',
  'rails',
  'laravel',
  'nextjs',
  'gatsby',
  'nuxt',
  'svelte',
  'jquery',
  'bootstrap',
  'tailwind',
  'redux',
  'graphql',
  'rest',
  'api',
  'microservices',
  // Cloud & DevOps
  'aws',
  'azure',
  'gcp',
  'docker',
  'kubernetes',
  'jenkins',
  'terraform',
  'ansible',
  'ci/cd',
  'devops',
  'linux',
  'unix',
  'git',
  'github',
  'gitlab',
  'bitbucket',
  // Databases
  'mysql',
  'postgresql',
  'mongodb',
  'redis',
  'elasticsearch',
  'dynamodb',
  'oracle',
  'sqlite',
  'cassandra',
  'firebase',
  'supabase',
  // Data & AI
  'machine learning',
  'deep learning',
  'ai',
  'tensorflow',
  'pytorch',
  'pandas',
  'numpy',
  'scikit-learn',
  'nlp',
  'computer vision',
  'data science',
  'analytics',
  // Soft Skills
  'leadership',
  'communication',
  'collaboration',
  'problem-solving',
  'analytical',
  'strategic',
  'agile',
  'scrum',
  'kanban',
  'project management',
  'stakeholder',
])

/**
 * Extract keywords from text
 */
export function extractKeywords(text: string): string[] {
  if (!text) return []

  // Normalize and tokenize
  const normalized = text
    .toLowerCase()
    .replace(/[^\w\s\-/+#.]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

  const words = normalized.split(' ')
  const keywords: Set<string> = new Set()

  // Single words
  words.forEach((word) => {
    if (word.length >= 2 && !STOP_WORDS.has(word)) {
      keywords.add(word)
    }
  })

  // Bi-grams (two-word phrases)
  for (let i = 0; i < words.length - 1; i++) {
    const bigram = `${words[i]} ${words[i + 1]}`
    if (TECH_KEYWORDS.has(bigram)) {
      keywords.add(bigram)
    }
  }

  // Prioritize tech keywords
  const prioritized = Array.from(keywords).sort((a, b) => {
    const aIsTech = TECH_KEYWORDS.has(a) ? 1 : 0
    const bIsTech = TECH_KEYWORDS.has(b) ? 1 : 0
    return bIsTech - aIsTech
  })

  return prioritized
}

/**
 * Extract keywords from job description
 */
export function extractJobKeywords(jobDescription: string): string[] {
  const keywords = extractKeywords(jobDescription)

  // Weight keywords by frequency
  const frequency: Map<string, number> = new Map()
  const words = jobDescription.toLowerCase().split(/\s+/)

  keywords.forEach((keyword) => {
    let count = 0
    words.forEach((word) => {
      if (word.includes(keyword) || keyword.includes(word)) {
        count++
      }
    })
    frequency.set(keyword, count)
  })

  // Sort by frequency and tech relevance
  return keywords
    .sort((a, b) => {
      const aFreq = frequency.get(a) || 0
      const bFreq = frequency.get(b) || 0
      const aIsTech = TECH_KEYWORDS.has(a) ? 10 : 0
      const bIsTech = TECH_KEYWORDS.has(b) ? 10 : 0
      return bFreq + bIsTech - (aFreq + aIsTech)
    })
    .slice(0, 50) // Top 50 keywords
}

// ===== RESUME TEXT EXTRACTION =====

/**
 * Extract all text content from resume
 */
function extractResumeText(resume: ExtendedResumeData): string {
  const parts: string[] = []

  // Personal info
  parts.push(resume.personal.fullName)
  parts.push(resume.personal.jobTitle)
  parts.push(resume.personal.summary)

  // Experience
  resume.experiences.forEach((exp) => {
    parts.push(exp.company)
    parts.push(exp.position)
    parts.push(exp.description)
  })

  // Education
  resume.education.forEach((edu) => {
    parts.push(edu.institution)
    parts.push(edu.degree)
    parts.push(edu.field)
    parts.push(edu.description)
  })

  // Skills
  parts.push(resume.skills.join(' '))

  // Projects
  resume.projects.forEach((proj) => {
    parts.push(proj.name)
    parts.push(proj.description)
    if (proj.technologies) parts.push(proj.technologies.join(' '))
  })

  // Certifications
  resume.certifications.forEach((cert) => {
    parts.push(cert.name)
    parts.push(cert.issuer)
  })

  // Expertise areas
  resume.expertiseAreas.forEach((area) => {
    parts.push(area.category)
    parts.push(area.keywords.join(' '))
  })

  return parts.filter(Boolean).join(' ')
}

// ===== SCORING FUNCTIONS =====

/**
 * Calculate completeness score
 */
function calculateCompletenessScore(resume: ExtendedResumeData): { score: number; suggestions: Suggestion[] } {
  const suggestions: Suggestion[] = []
  let score = 0
  const maxScore = 100

  // Personal Info (30 points)
  const personal = resume.personal
  if (personal.fullName) score += 5
  else
    suggestions.push({
      id: 'personal-name',
      category: 'critical',
      section: 'Personal Info',
      message: 'Add your full name',
      action: 'Go to Personal Info section',
    })

  if (personal.email) score += 5
  else
    suggestions.push({
      id: 'personal-email',
      category: 'critical',
      section: 'Personal Info',
      message: 'Add your email address',
      action: 'Go to Personal Info section',
    })

  if (personal.phone) score += 5
  else
    suggestions.push({
      id: 'personal-phone',
      category: 'important',
      section: 'Personal Info',
      message: 'Add your phone number',
      action: 'Go to Personal Info section',
    })

  if (personal.location) score += 5
  else
    suggestions.push({
      id: 'personal-location',
      category: 'optional',
      section: 'Personal Info',
      message: 'Add your location (city/state)',
      action: 'Go to Personal Info section',
    })

  if (personal.jobTitle) score += 5
  else
    suggestions.push({
      id: 'personal-title',
      category: 'important',
      section: 'Personal Info',
      message: 'Add your job title',
      action: 'Go to Personal Info section',
    })

  if (personal.summary && personal.summary.length >= 50) score += 5
  else if (personal.summary) {
    score += 2
    suggestions.push({
      id: 'personal-summary-short',
      category: 'important',
      section: 'Personal Info',
      message: 'Expand your professional summary (aim for 50+ characters)',
      action: 'Go to Personal Info section',
    })
  } else {
    suggestions.push({
      id: 'personal-summary',
      category: 'important',
      section: 'Personal Info',
      message: 'Add a professional summary',
      action: 'Go to Personal Info section',
    })
  }

  // Experience (30 points)
  if (resume.experiences.length >= 2) score += 15
  else if (resume.experiences.length === 1) {
    score += 8
    suggestions.push({
      id: 'experience-more',
      category: 'optional',
      section: 'Experience',
      message: 'Consider adding more work experience',
      action: 'Go to Experience section',
    })
  } else {
    suggestions.push({
      id: 'experience-none',
      category: 'critical',
      section: 'Experience',
      message: 'Add at least one work experience',
      action: 'Go to Experience section',
    })
  }

  // Check experience descriptions
  const expWithDescriptions = resume.experiences.filter((exp) => exp.description && exp.description.length >= 50)
  if (expWithDescriptions.length === resume.experiences.length && resume.experiences.length > 0) {
    score += 15
  } else if (expWithDescriptions.length > 0) {
    score += 8
    suggestions.push({
      id: 'experience-descriptions',
      category: 'important',
      section: 'Experience',
      message: 'Add detailed descriptions to all work experiences',
      action: 'Include achievements and quantified results',
    })
  }

  // Education (15 points)
  if (resume.education.length >= 1) score += 15
  else
    suggestions.push({
      id: 'education-none',
      category: 'important',
      section: 'Education',
      message: 'Add your education history',
      action: 'Go to Education section',
    })

  // Skills (25 points)
  if (resume.skills.length >= 8) score += 25
  else if (resume.skills.length >= 5) {
    score += 18
    suggestions.push({
      id: 'skills-more',
      category: 'optional',
      section: 'Skills',
      message: 'Add more relevant skills (aim for 8+)',
      action: 'Go to Skills section',
    })
  } else if (resume.skills.length >= 1) {
    score += 10
    suggestions.push({
      id: 'skills-few',
      category: 'important',
      section: 'Skills',
      message: 'Add more skills to showcase your expertise',
      action: 'Go to Skills section',
    })
  } else {
    suggestions.push({
      id: 'skills-none',
      category: 'critical',
      section: 'Skills',
      message: 'Add your technical and soft skills',
      action: 'Go to Skills section',
    })
  }

  return { score: Math.min(score, maxScore), suggestions }
}

/**
 * Calculate formatting score
 */
function calculateFormattingScore(resume: ExtendedResumeData): { score: number; suggestions: Suggestion[] } {
  const suggestions: Suggestion[] = []
  let score = 100

  // Check summary length
  if (resume.personal.summary && resume.personal.summary.length > 500) {
    score -= 10
    suggestions.push({
      id: 'format-summary-long',
      category: 'optional',
      section: 'Formatting',
      message: 'Consider shortening your summary (recommended: 200-500 characters)',
    })
  }

  // Check for bullet points in descriptions (looking for line breaks or bullet indicators)
  const hasGoodFormatting = resume.experiences.some(
    (exp) => exp.description.includes('\n') || exp.description.includes('•') || exp.description.includes('-'),
  )
  if (!hasGoodFormatting && resume.experiences.length > 0) {
    score -= 15
    suggestions.push({
      id: 'format-bullets',
      category: 'important',
      section: 'Formatting',
      message: 'Use bullet points in experience descriptions for better readability',
      action: 'Start each achievement on a new line',
    })
  }

  // Check for quantified achievements (numbers in descriptions)
  const hasNumbers = resume.experiences.some((exp) => /\d+%?/.test(exp.description))
  if (!hasNumbers && resume.experiences.length > 0) {
    score -= 20
    suggestions.push({
      id: 'format-quantify',
      category: 'important',
      section: 'Content',
      message: 'Add quantified achievements (e.g., "increased sales by 25%")',
      action: 'Include metrics and numbers in your experience descriptions',
    })
  }

  // Check for action verbs
  const actionVerbs = [
    'led',
    'managed',
    'developed',
    'created',
    'implemented',
    'designed',
    'built',
    'improved',
    'increased',
    'reduced',
    'achieved',
    'launched',
    'delivered',
    'drove',
    'spearheaded',
    'orchestrated',
    'streamlined',
    'optimized',
  ]

  const resumeText = extractResumeText(resume).toLowerCase()
  const hasActionVerbs = actionVerbs.some((verb) => resumeText.includes(verb))

  if (!hasActionVerbs && resume.experiences.length > 0) {
    score -= 15
    suggestions.push({
      id: 'format-action-verbs',
      category: 'important',
      section: 'Content',
      message: 'Start bullet points with strong action verbs',
      action: 'Use words like "Led", "Developed", "Achieved", "Implemented"',
    })
  }

  return { score: Math.max(score, 0), suggestions }
}

/**
 * Calculate content quality score
 */
function calculateContentScore(resume: ExtendedResumeData): { score: number; suggestions: Suggestion[] } {
  const suggestions: Suggestion[] = []
  let score = 100

  // Check for detailed descriptions
  const avgDescLength =
    resume.experiences.reduce((acc, exp) => acc + exp.description.length, 0) / Math.max(resume.experiences.length, 1)

  if (avgDescLength < 100 && resume.experiences.length > 0) {
    score -= 20
    suggestions.push({
      id: 'content-short-desc',
      category: 'important',
      section: 'Experience',
      message: 'Expand your job descriptions with more detail',
      action: 'Include 3-5 bullet points per role highlighting achievements',
    })
  }

  // Check for variety in skills
  if (resume.skills.length > 0 && resume.skills.length === new Set(resume.skills.map((s) => s.toLowerCase())).size) {
    // Good - no duplicates
  } else if (resume.skills.length > 0) {
    score -= 10
    suggestions.push({
      id: 'content-duplicate-skills',
      category: 'optional',
      section: 'Skills',
      message: 'Remove duplicate skills',
    })
  }

  // Check for projects or certifications (bonus content)
  if (resume.projects.length === 0 && resume.certifications.length === 0) {
    score -= 10
    suggestions.push({
      id: 'content-extras',
      category: 'optional',
      section: 'General',
      message: 'Consider adding projects or certifications to stand out',
      action: 'Add relevant side projects or professional certifications',
    })
  }

  return { score: Math.max(score, 0), suggestions }
}

/**
 * Analyze keywords against job description
 */
export function analyzeKeywords(resume: ExtendedResumeData, jobDescription: string): KeywordAnalysis {
  if (!jobDescription.trim()) {
    return {
      extracted: [],
      matched: [],
      missing: [],
      matchRate: 0,
    }
  }

  const jobKeywords = extractJobKeywords(jobDescription)
  const resumeText = extractResumeText(resume).toLowerCase()
  const resumeKeywords = new Set(extractKeywords(resumeText))

  const matched: string[] = []
  const missing: string[] = []

  jobKeywords.forEach((keyword) => {
    if (resumeText.includes(keyword) || resumeKeywords.has(keyword)) {
      matched.push(keyword)
    } else {
      missing.push(keyword)
    }
  })

  const matchRate = jobKeywords.length > 0 ? Math.round((matched.length / jobKeywords.length) * 100) : 0

  return {
    extracted: jobKeywords,
    matched,
    missing: missing.slice(0, 20), // Top 20 missing keywords
    matchRate,
  }
}

// ===== MAIN SCORING FUNCTION =====

/**
 * Calculate complete ATS score for a resume
 */
export function calculateATSScore(resume: ExtendedResumeData, jobDescription?: string): ATSScore {
  // Calculate component scores
  const completeness = calculateCompletenessScore(resume)
  const formatting = calculateFormattingScore(resume)
  const content = calculateContentScore(resume)

  // Keyword analysis
  let keywordScore = 70 // Default when no job description
  let matchedKeywords: string[] = []
  let missingKeywords: string[] = []
  const keywordSuggestions: Suggestion[] = []

  if (jobDescription && jobDescription.trim()) {
    const analysis = analyzeKeywords(resume, jobDescription)
    keywordScore = analysis.matchRate
    matchedKeywords = analysis.matched
    missingKeywords = analysis.missing

    if (analysis.matchRate < 50) {
      keywordSuggestions.push({
        id: 'keywords-low',
        category: 'critical',
        section: 'Keywords',
        message: `Low keyword match (${analysis.matchRate}%) - Add more relevant skills and terms`,
        action: `Consider adding: ${analysis.missing.slice(0, 5).join(', ')}`,
      })
    } else if (analysis.matchRate < 70) {
      keywordSuggestions.push({
        id: 'keywords-medium',
        category: 'important',
        section: 'Keywords',
        message: `Moderate keyword match (${analysis.matchRate}%) - Room for improvement`,
        action: `Missing keywords: ${analysis.missing.slice(0, 3).join(', ')}`,
      })
    }
  }

  // Calculate overall score (weighted average)
  const overall = Math.round(
    completeness.score * 0.35 + keywordScore * 0.3 + formatting.score * 0.2 + content.score * 0.15,
  )

  // Combine all suggestions and sort by priority
  const allSuggestions = [
    ...completeness.suggestions,
    ...formatting.suggestions,
    ...content.suggestions,
    ...keywordSuggestions,
  ].sort((a, b) => {
    const priority = { critical: 0, important: 1, optional: 2 }
    return priority[a.category] - priority[b.category]
  })

  return {
    overall,
    breakdown: {
      completeness: completeness.score,
      keywords: keywordScore,
      formatting: formatting.score,
      content: content.score,
    },
    suggestions: allSuggestions,
    matchedKeywords,
    missingKeywords,
  }
}

/**
 * Get score color based on value
 */
export function getScoreColor(score: number): string {
  if (score >= 80) return 'text-accent'
  if (score >= 60) return 'text-yellow-500'
  return 'text-destructive'
}

/**
 * Get score label based on value
 */
export function getScoreLabel(score: number): string {
  if (score >= 90) return 'Excellent'
  if (score >= 80) return 'Very Good'
  if (score >= 70) return 'Good'
  if (score >= 60) return 'Fair'
  if (score >= 50) return 'Needs Work'
  return 'Poor'
}
