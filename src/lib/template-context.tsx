/**
 * Template Context
 *
 * Global state management for the selected resume template.
 * Persists selection to localStorage.
 */
import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { ResumeTemplate, getTemplateById, getDefaultTemplate, RESUME_TEMPLATES } from './resume-templates'

interface TemplateContextValue {
  /** Currently selected template */
  template: ResumeTemplate
  /** Template ID for quick access */
  templateId: string
  /** Select a template by ID */
  setTemplateId: (id: string) => void
  /** All available templates */
  templates: ResumeTemplate[]
  /** Check if using default template */
  isDefault: boolean
}

const TemplateContext = createContext<TemplateContextValue | null>(null)

const STORAGE_KEY = 'beattheats-template-id'

export function TemplateProvider({ children }: { children: ReactNode }) {
  const [templateId, setTemplateIdState] = useState<string>(() => {
    // Initialize from localStorage
    if (typeof window === 'undefined') return getDefaultTemplate().id
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored && getTemplateById(stored)) {
        return stored
      }
    } catch (e) {
      console.warn('Failed to load template from localStorage:', e)
    }
    return getDefaultTemplate().id
  })

  // Persist to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, templateId)
    } catch (e) {
      console.warn('Failed to save template to localStorage:', e)
    }
  }, [templateId])

  const setTemplateId = (id: string) => {
    if (getTemplateById(id)) {
      setTemplateIdState(id)
    }
  }

  const template = getTemplateById(templateId) || getDefaultTemplate()
  const isDefault = templateId === getDefaultTemplate().id

  const value: TemplateContextValue = {
    template,
    templateId,
    setTemplateId,
    templates: RESUME_TEMPLATES,
    isDefault,
  }

  return <TemplateContext.Provider value={value}>{children}</TemplateContext.Provider>
}

export function useTemplate() {
  const context = useContext(TemplateContext)
  if (!context) {
    throw new Error('useTemplate must be used within a TemplateProvider')
  }
  return context
}

// Re-export types for convenience
export type { ResumeTemplate } from './resume-templates'
