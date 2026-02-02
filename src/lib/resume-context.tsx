import React, { createContext, useContext, useReducer, ReactNode } from 'react'

// Types for resume data
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

export interface ResumeData {
  personal: PersonalInfo
  experiences: Experience[]
  education: Education[]
  skills: string[]
}

// Initial state
const initialResumeData: ResumeData = {
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
}

// Action types
type ResumeAction =
  | { type: 'UPDATE_PERSONAL'; payload: Partial<PersonalInfo> }
  | { type: 'ADD_EXPERIENCE'; payload: Experience }
  | { type: 'UPDATE_EXPERIENCE'; payload: { id: string; data: Partial<Experience> } }
  | { type: 'REMOVE_EXPERIENCE'; payload: string }
  | { type: 'ADD_EDUCATION'; payload: Education }
  | { type: 'UPDATE_EDUCATION'; payload: { id: string; data: Partial<Education> } }
  | { type: 'REMOVE_EDUCATION'; payload: string }
  | { type: 'SET_SKILLS'; payload: string[] }
  | { type: 'RESET' }

// Reducer
function resumeReducer(state: ResumeData, action: ResumeAction): ResumeData {
  switch (action.type) {
    case 'UPDATE_PERSONAL':
      return {
        ...state,
        personal: { ...state.personal, ...action.payload },
      }
    case 'ADD_EXPERIENCE':
      return {
        ...state,
        experiences: [...state.experiences, action.payload],
      }
    case 'UPDATE_EXPERIENCE':
      return {
        ...state,
        experiences: state.experiences.map((exp) =>
          exp.id === action.payload.id ? { ...exp, ...action.payload.data } : exp,
        ),
      }
    case 'REMOVE_EXPERIENCE':
      return {
        ...state,
        experiences: state.experiences.filter((exp) => exp.id !== action.payload),
      }
    case 'ADD_EDUCATION':
      return {
        ...state,
        education: [...state.education, action.payload],
      }
    case 'UPDATE_EDUCATION':
      return {
        ...state,
        education: state.education.map((edu) =>
          edu.id === action.payload.id ? { ...edu, ...action.payload.data } : edu,
        ),
      }
    case 'REMOVE_EDUCATION':
      return {
        ...state,
        education: state.education.filter((edu) => edu.id !== action.payload),
      }
    case 'SET_SKILLS':
      return {
        ...state,
        skills: action.payload,
      }
    case 'RESET':
      return initialResumeData
    default:
      return state
  }
}

// Context
interface ResumeContextValue {
  data: ResumeData
  dispatch: React.Dispatch<ResumeAction>
  // Helper functions
  updatePersonal: (data: Partial<PersonalInfo>) => void
  addExperience: (experience: Omit<Experience, 'id'>) => void
  updateExperience: (id: string, data: Partial<Experience>) => void
  removeExperience: (id: string) => void
  addEducation: (education: Omit<Education, 'id'>) => void
  updateEducation: (id: string, data: Partial<Education>) => void
  removeEducation: (id: string) => void
  setSkills: (skills: string[]) => void
  // Completion status
  isPersonalComplete: boolean
  isExperienceComplete: boolean
  isEducationComplete: boolean
  isSkillsComplete: boolean
}

const ResumeContext = createContext<ResumeContextValue | null>(null)

// Generate unique IDs
const generateId = () => Math.random().toString(36).substring(2, 9)

// Provider component
export function ResumeProvider({ children }: { children: ReactNode }) {
  const [data, dispatch] = useReducer(resumeReducer, initialResumeData)

  const updatePersonal = (personalData: Partial<PersonalInfo>) => {
    dispatch({ type: 'UPDATE_PERSONAL', payload: personalData })
  }

  const addExperience = (experience: Omit<Experience, 'id'>) => {
    dispatch({ type: 'ADD_EXPERIENCE', payload: { ...experience, id: generateId() } })
  }

  const updateExperience = (id: string, experienceData: Partial<Experience>) => {
    dispatch({ type: 'UPDATE_EXPERIENCE', payload: { id, data: experienceData } })
  }

  const removeExperience = (id: string) => {
    dispatch({ type: 'REMOVE_EXPERIENCE', payload: id })
  }

  const addEducation = (education: Omit<Education, 'id'>) => {
    dispatch({ type: 'ADD_EDUCATION', payload: { ...education, id: generateId() } })
  }

  const updateEducation = (id: string, educationData: Partial<Education>) => {
    dispatch({ type: 'UPDATE_EDUCATION', payload: { id, data: educationData } })
  }

  const removeEducation = (id: string) => {
    dispatch({ type: 'REMOVE_EDUCATION', payload: id })
  }

  const setSkills = (skills: string[]) => {
    dispatch({ type: 'SET_SKILLS', payload: skills })
  }

  // Completion checks
  const isPersonalComplete =
    data.personal.fullName.trim() !== '' && data.personal.email.trim() !== '' && data.personal.jobTitle.trim() !== ''

  const isExperienceComplete = data.experiences.length > 0

  const isEducationComplete = data.education.length > 0

  const isSkillsComplete = data.skills.length >= 3

  const value: ResumeContextValue = {
    data,
    dispatch,
    updatePersonal,
    addExperience,
    updateExperience,
    removeExperience,
    addEducation,
    updateEducation,
    removeEducation,
    setSkills,
    isPersonalComplete,
    isExperienceComplete,
    isEducationComplete,
    isSkillsComplete,
  }

  return <ResumeContext.Provider value={value}>{children}</ResumeContext.Provider>
}

// Hook to use context
export function useResume() {
  const context = useContext(ResumeContext)
  if (!context) {
    throw new Error('useResume must be used within a ResumeProvider')
  }
  return context
}
