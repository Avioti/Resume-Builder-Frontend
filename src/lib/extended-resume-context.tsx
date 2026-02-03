import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react'
import {
  Project,
  Certification,
  ProfileLink,
  ExpertiseArea,
  SectionConfig,
  SectionId,
  DEFAULT_SECTION_ORDER,
  toggleSection,
  reorderSections,
} from './resume-sections'

// ===== CORE TYPES =====
export interface PersonalInfo {
  fullName: string
  jobTitle: string
  email: string
  phone: string
  location: string
  summary: string
}

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

// ===== EXTENDED RESUME DATA =====
export interface ExtendedResumeData {
  personal: PersonalInfo
  experiences: Experience[]
  education: Education[]
  skills: string[]
  // New sections
  projects: Project[]
  certifications: Certification[]
  expertiseAreas: ExpertiseArea[]
  links: ProfileLink[]
  // Section configuration
  sectionConfig: SectionConfig[]
}

// ===== INITIAL STATE =====
const initialResumeData: ExtendedResumeData = {
  personal: {
    fullName: '',
    jobTitle: '',
    email: '',
    phone: '',
    location: '',
    summary: '',
  },
  experiences: [],
  education: [],
  skills: [],
  projects: [],
  certifications: [],
  expertiseAreas: [],
  links: [],
  sectionConfig: DEFAULT_SECTION_ORDER,
}

// ===== ACTION TYPES =====
type ResumeAction =
  // Personal
  | { type: 'UPDATE_PERSONAL'; payload: Partial<PersonalInfo> }
  // Experience
  | { type: 'ADD_EXPERIENCE'; payload: Experience }
  | { type: 'UPDATE_EXPERIENCE'; payload: { id: string; data: Partial<Experience> } }
  | { type: 'REMOVE_EXPERIENCE'; payload: string }
  | { type: 'REORDER_EXPERIENCES'; payload: string[] }
  // Education
  | { type: 'ADD_EDUCATION'; payload: Education }
  | { type: 'UPDATE_EDUCATION'; payload: { id: string; data: Partial<Education> } }
  | { type: 'REMOVE_EDUCATION'; payload: string }
  // Skills
  | { type: 'SET_SKILLS'; payload: string[] }
  // Projects
  | { type: 'ADD_PROJECT'; payload: Project }
  | { type: 'UPDATE_PROJECT'; payload: { id: string; data: Partial<Project> } }
  | { type: 'REMOVE_PROJECT'; payload: string }
  | { type: 'REORDER_PROJECTS'; payload: string[] }
  // Certifications
  | { type: 'ADD_CERTIFICATION'; payload: Certification }
  | { type: 'UPDATE_CERTIFICATION'; payload: { id: string; data: Partial<Certification> } }
  | { type: 'REMOVE_CERTIFICATION'; payload: string }
  // Expertise Areas
  | { type: 'ADD_EXPERTISE_AREA'; payload: ExpertiseArea }
  | { type: 'UPDATE_EXPERTISE_AREA'; payload: { id: string; data: Partial<ExpertiseArea> } }
  | { type: 'REMOVE_EXPERTISE_AREA'; payload: string }
  // Links
  | { type: 'ADD_LINK'; payload: ProfileLink }
  | { type: 'UPDATE_LINK'; payload: { id: string; data: Partial<ProfileLink> } }
  | { type: 'REMOVE_LINK'; payload: string }
  // Section Config
  | { type: 'TOGGLE_SECTION'; payload: SectionId }
  | { type: 'REORDER_SECTION'; payload: { sectionId: SectionId; newOrder: number } }
  | { type: 'SET_SECTION_CONFIG'; payload: SectionConfig[] }
  // Bulk operations
  | { type: 'LOAD_DATA'; payload: ExtendedResumeData }
  | { type: 'IMPORT_DATA'; payload: Partial<ExtendedResumeData> }
  | { type: 'RESET' }

// ===== REDUCER =====
function resumeReducer(state: ExtendedResumeData, action: ResumeAction): ExtendedResumeData {
  switch (action.type) {
    // Personal
    case 'UPDATE_PERSONAL':
      return { ...state, personal: { ...state.personal, ...action.payload } }

    // Experience
    case 'ADD_EXPERIENCE':
      return { ...state, experiences: [...state.experiences, action.payload] }
    case 'UPDATE_EXPERIENCE':
      return {
        ...state,
        experiences: state.experiences.map((exp) =>
          exp.id === action.payload.id ? { ...exp, ...action.payload.data } : exp,
        ),
      }
    case 'REMOVE_EXPERIENCE':
      return { ...state, experiences: state.experiences.filter((exp) => exp.id !== action.payload) }
    case 'REORDER_EXPERIENCES': {
      const orderedExperiences = action.payload
        .map((id) => state.experiences.find((exp) => exp.id === id))
        .filter(Boolean) as Experience[]
      return { ...state, experiences: orderedExperiences }
    }

    // Education
    case 'ADD_EDUCATION':
      return { ...state, education: [...state.education, action.payload] }
    case 'UPDATE_EDUCATION':
      return {
        ...state,
        education: state.education.map((edu) =>
          edu.id === action.payload.id ? { ...edu, ...action.payload.data } : edu,
        ),
      }
    case 'REMOVE_EDUCATION':
      return { ...state, education: state.education.filter((edu) => edu.id !== action.payload) }

    // Skills
    case 'SET_SKILLS':
      return { ...state, skills: action.payload }

    // Projects
    case 'ADD_PROJECT':
      return { ...state, projects: [...state.projects, action.payload] }
    case 'UPDATE_PROJECT':
      return {
        ...state,
        projects: state.projects.map((proj) =>
          proj.id === action.payload.id ? { ...proj, ...action.payload.data } : proj,
        ),
      }
    case 'REMOVE_PROJECT':
      return { ...state, projects: state.projects.filter((proj) => proj.id !== action.payload) }
    case 'REORDER_PROJECTS': {
      const orderedProjects = action.payload
        .map((id) => state.projects.find((p) => p.id === id))
        .filter(Boolean) as Project[]
      return { ...state, projects: orderedProjects }
    }

    // Certifications
    case 'ADD_CERTIFICATION':
      return { ...state, certifications: [...state.certifications, action.payload] }
    case 'UPDATE_CERTIFICATION':
      return {
        ...state,
        certifications: state.certifications.map((cert) =>
          cert.id === action.payload.id ? { ...cert, ...action.payload.data } : cert,
        ),
      }
    case 'REMOVE_CERTIFICATION':
      return { ...state, certifications: state.certifications.filter((cert) => cert.id !== action.payload) }

    // Expertise Areas
    case 'ADD_EXPERTISE_AREA':
      return { ...state, expertiseAreas: [...state.expertiseAreas, action.payload] }
    case 'UPDATE_EXPERTISE_AREA':
      return {
        ...state,
        expertiseAreas: state.expertiseAreas.map((area) =>
          area.id === action.payload.id ? { ...area, ...action.payload.data } : area,
        ),
      }
    case 'REMOVE_EXPERTISE_AREA':
      return { ...state, expertiseAreas: state.expertiseAreas.filter((area) => area.id !== action.payload) }

    // Links
    case 'ADD_LINK':
      return { ...state, links: [...state.links, action.payload] }
    case 'UPDATE_LINK':
      return {
        ...state,
        links: state.links.map((link) => (link.id === action.payload.id ? { ...link, ...action.payload.data } : link)),
      }
    case 'REMOVE_LINK':
      return { ...state, links: state.links.filter((link) => link.id !== action.payload) }

    // Section Config
    case 'TOGGLE_SECTION':
      return { ...state, sectionConfig: toggleSection(state.sectionConfig, action.payload) }
    case 'REORDER_SECTION':
      return {
        ...state,
        sectionConfig: reorderSections(state.sectionConfig, action.payload.sectionId, action.payload.newOrder),
      }
    case 'SET_SECTION_CONFIG':
      return { ...state, sectionConfig: action.payload }

    // Bulk
    case 'LOAD_DATA':
      return { ...action.payload }
    case 'IMPORT_DATA': {
      // Merge imported data with existing, preserving IDs and structure
      const imported = action.payload
      return {
        ...state,
        personal: imported.personal ? { ...state.personal, ...imported.personal } : state.personal,
        experiences: imported.experiences && imported.experiences.length > 0 ? imported.experiences : state.experiences,
        education: imported.education && imported.education.length > 0 ? imported.education : state.education,
        skills: imported.skills && imported.skills.length > 0 ? imported.skills : state.skills,
        projects: imported.projects && imported.projects.length > 0 ? imported.projects : state.projects,
        certifications:
          imported.certifications && imported.certifications.length > 0
            ? imported.certifications
            : state.certifications,
        links: imported.links && imported.links.length > 0 ? imported.links : state.links,
        // Keep section config as-is
        sectionConfig: state.sectionConfig,
        // Keep expertise areas as-is (rarely parsed from resumes)
        expertiseAreas: state.expertiseAreas,
      }
    }
    case 'RESET':
      return initialResumeData

    default:
      return state
  }
}

// ===== CONTEXT =====
interface ExtendedResumeContextValue {
  data: ExtendedResumeData
  dispatch: React.Dispatch<ResumeAction>

  // Personal
  updatePersonal: (data: Partial<PersonalInfo>) => void

  // Experience
  addExperience: (experience: Omit<Experience, 'id'>) => void
  updateExperience: (id: string, data: Partial<Experience>) => void
  removeExperience: (id: string) => void
  reorderExperiences: (orderedIds: string[]) => void

  // Education
  addEducation: (education: Omit<Education, 'id'>) => void
  updateEducation: (id: string, data: Partial<Education>) => void
  removeEducation: (id: string) => void

  // Skills
  setSkills: (skills: string[]) => void

  // Projects
  addProject: (project: Omit<Project, 'id'>) => void
  updateProject: (id: string, data: Partial<Project>) => void
  removeProject: (id: string) => void
  reorderProjects: (orderedIds: string[]) => void

  // Certifications
  addCertification: (certification: Omit<Certification, 'id'>) => void
  updateCertification: (id: string, data: Partial<Certification>) => void
  removeCertification: (id: string) => void

  // Expertise Areas
  addExpertiseArea: (area: Omit<ExpertiseArea, 'id'>) => void
  updateExpertiseArea: (id: string, data: Partial<ExpertiseArea>) => void
  removeExpertiseArea: (id: string) => void

  // Links
  addLink: (link: Omit<ProfileLink, 'id'>) => void
  updateLink: (id: string, data: Partial<ProfileLink>) => void
  removeLink: (id: string) => void

  // Section Config
  toggleSection: (sectionId: SectionId) => void
  reorderSection: (sectionId: SectionId, newOrder: number) => void
  isSectionEnabled: (sectionId: SectionId) => boolean

  // Bulk
  loadData: (data: ExtendedResumeData) => void
  importData: (data: Partial<ExtendedResumeData>) => void
  reset: () => void

  // Completion status
  isPersonalComplete: boolean
  isExperienceComplete: boolean
  isEducationComplete: boolean
  isSkillsComplete: boolean
  isProjectsComplete: boolean
  isCertificationsComplete: boolean
  isExpertiseComplete: boolean
  isLinksComplete: boolean
}

const ExtendedResumeContext = createContext<ExtendedResumeContextValue | null>(null)

// Generate unique IDs
const generateId = () => Math.random().toString(36).substring(2, 9)

// Local storage key
const STORAGE_KEY = 'beattheats-resume-data'

// ===== PROVIDER =====
export function ExtendedResumeProvider({ children }: { children: ReactNode }) {
  // Initialize from localStorage if available
  const [data, dispatch] = useReducer(resumeReducer, initialResumeData, (initial) => {
    if (typeof window === 'undefined') return initial
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored)
        // Merge with initial to handle new fields
        return {
          ...initial,
          ...parsed,
          sectionConfig: parsed.sectionConfig || initial.sectionConfig,
        }
      }
    } catch (e) {
      console.warn('Failed to load resume data from localStorage:', e)
    }
    return initial
  })

  // Persist to localStorage on changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
    } catch (e) {
      console.warn('Failed to save resume data to localStorage:', e)
    }
  }, [data])

  // ===== HELPER FUNCTIONS =====

  // Personal
  const updatePersonal = (personalData: Partial<PersonalInfo>) => {
    dispatch({ type: 'UPDATE_PERSONAL', payload: personalData })
  }

  // Experience
  const addExperience = (experience: Omit<Experience, 'id'>) => {
    dispatch({ type: 'ADD_EXPERIENCE', payload: { ...experience, id: generateId() } })
  }
  const updateExperience = (id: string, experienceData: Partial<Experience>) => {
    dispatch({ type: 'UPDATE_EXPERIENCE', payload: { id, data: experienceData } })
  }
  const removeExperience = (id: string) => {
    dispatch({ type: 'REMOVE_EXPERIENCE', payload: id })
  }
  const reorderExperiences = (orderedIds: string[]) => {
    dispatch({ type: 'REORDER_EXPERIENCES', payload: orderedIds })
  }

  // Education
  const addEducation = (education: Omit<Education, 'id'>) => {
    dispatch({ type: 'ADD_EDUCATION', payload: { ...education, id: generateId() } })
  }
  const updateEducation = (id: string, educationData: Partial<Education>) => {
    dispatch({ type: 'UPDATE_EDUCATION', payload: { id, data: educationData } })
  }
  const removeEducation = (id: string) => {
    dispatch({ type: 'REMOVE_EDUCATION', payload: id })
  }

  // Skills
  const setSkills = (skills: string[]) => {
    dispatch({ type: 'SET_SKILLS', payload: skills })
  }

  // Projects
  const addProject = (project: Omit<Project, 'id'>) => {
    dispatch({ type: 'ADD_PROJECT', payload: { ...project, id: generateId() } })
  }
  const updateProject = (id: string, projectData: Partial<Project>) => {
    dispatch({ type: 'UPDATE_PROJECT', payload: { id, data: projectData } })
  }
  const removeProject = (id: string) => {
    dispatch({ type: 'REMOVE_PROJECT', payload: id })
  }
  const reorderProjects = (orderedIds: string[]) => {
    dispatch({ type: 'REORDER_PROJECTS', payload: orderedIds })
  }

  // Certifications
  const addCertification = (certification: Omit<Certification, 'id'>) => {
    dispatch({ type: 'ADD_CERTIFICATION', payload: { ...certification, id: generateId() } })
  }
  const updateCertification = (id: string, certData: Partial<Certification>) => {
    dispatch({ type: 'UPDATE_CERTIFICATION', payload: { id, data: certData } })
  }
  const removeCertification = (id: string) => {
    dispatch({ type: 'REMOVE_CERTIFICATION', payload: id })
  }

  // Expertise Areas
  const addExpertiseArea = (area: Omit<ExpertiseArea, 'id'>) => {
    dispatch({ type: 'ADD_EXPERTISE_AREA', payload: { ...area, id: generateId() } })
  }
  const updateExpertiseArea = (id: string, areaData: Partial<ExpertiseArea>) => {
    dispatch({ type: 'UPDATE_EXPERTISE_AREA', payload: { id, data: areaData } })
  }
  const removeExpertiseArea = (id: string) => {
    dispatch({ type: 'REMOVE_EXPERTISE_AREA', payload: id })
  }

  // Links
  const addLink = (link: Omit<ProfileLink, 'id'>) => {
    dispatch({ type: 'ADD_LINK', payload: { ...link, id: generateId() } })
  }
  const updateLink = (id: string, linkData: Partial<ProfileLink>) => {
    dispatch({ type: 'UPDATE_LINK', payload: { id, data: linkData } })
  }
  const removeLink = (id: string) => {
    dispatch({ type: 'REMOVE_LINK', payload: id })
  }

  // Section Config
  const handleToggleSection = (sectionId: SectionId) => {
    dispatch({ type: 'TOGGLE_SECTION', payload: sectionId })
  }
  const reorderSection = (sectionId: SectionId, newOrder: number) => {
    dispatch({ type: 'REORDER_SECTION', payload: { sectionId, newOrder } })
  }
  const isSectionEnabled = (sectionId: SectionId) => {
    const section = data.sectionConfig.find((s) => s.id === sectionId)
    return section?.enabled ?? false
  }

  // Bulk
  const loadData = (resumeData: ExtendedResumeData) => {
    dispatch({ type: 'LOAD_DATA', payload: resumeData })
  }
  const importData = (resumeData: Partial<ExtendedResumeData>) => {
    dispatch({ type: 'IMPORT_DATA', payload: resumeData })
  }
  const reset = () => {
    dispatch({ type: 'RESET' })
  }

  // ===== COMPLETION CHECKS =====
  const isPersonalComplete =
    data.personal.fullName.trim() !== '' && data.personal.email.trim() !== '' && data.personal.jobTitle.trim() !== ''
  const isExperienceComplete = data.experiences.length > 0
  const isEducationComplete = data.education.length > 0
  const isSkillsComplete = data.skills.length >= 3
  const isProjectsComplete = data.projects.length > 0
  const isCertificationsComplete = data.certifications.length > 0
  const isExpertiseComplete = data.expertiseAreas.length > 0
  const isLinksComplete = data.links.length > 0

  const value: ExtendedResumeContextValue = {
    data,
    dispatch,
    updatePersonal,
    addExperience,
    updateExperience,
    removeExperience,
    reorderExperiences,
    addEducation,
    updateEducation,
    removeEducation,
    setSkills,
    addProject,
    updateProject,
    removeProject,
    reorderProjects,
    addCertification,
    updateCertification,
    removeCertification,
    addExpertiseArea,
    updateExpertiseArea,
    removeExpertiseArea,
    addLink,
    updateLink,
    removeLink,
    toggleSection: handleToggleSection,
    reorderSection,
    isSectionEnabled,
    loadData,
    importData,
    reset,
    isPersonalComplete,
    isExperienceComplete,
    isEducationComplete,
    isSkillsComplete,
    isProjectsComplete,
    isCertificationsComplete,
    isExpertiseComplete,
    isLinksComplete,
  }

  return <ExtendedResumeContext.Provider value={value}>{children}</ExtendedResumeContext.Provider>
}

// ===== HOOK =====
export function useExtendedResume() {
  const context = useContext(ExtendedResumeContext)
  if (!context) {
    throw new Error('useExtendedResume must be used within an ExtendedResumeProvider')
  }
  return context
}

// Re-export types
export type { Project, Certification, ProfileLink, ExpertiseArea, SectionConfig, SectionId }
