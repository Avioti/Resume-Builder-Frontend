import { useState, KeyboardEvent } from 'react'
import { X, Plus } from 'lucide-react'
import { useExtendedResume } from 'src/lib/extended-resume-context'

const SUGGESTED_SKILLS = [
  'JavaScript',
  'TypeScript',
  'React',
  'Node.js',
  'Python',
  'SQL',
  'AWS',
  'Git',
  'Agile',
  'Communication',
  'Leadership',
  'Problem Solving',
  'Project Management',
  'Data Analysis',
  'UI/UX Design',
]

export function SkillsForm() {
  const { data, setSkills } = useExtendedResume()
  const [inputValue, setInputValue] = useState('')

  const addSkill = (skill: string) => {
    const trimmed = skill.trim()
    if (trimmed && !data.skills.includes(trimmed)) {
      setSkills([...data.skills, trimmed])
    }
    setInputValue('')
  }

  const removeSkill = (skillToRemove: string) => {
    setSkills(data.skills.filter((skill) => skill !== skillToRemove))
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addSkill(inputValue)
    } else if (e.key === 'Backspace' && inputValue === '' && data.skills.length > 0) {
      // Remove last skill if backspace pressed on empty input
      removeSkill(data.skills[data.skills.length - 1])
    }
  }

  const availableSuggestions = SUGGESTED_SKILLS.filter((skill) => !data.skills.includes(skill))

  return (
    <div className="space-y-6">
      {/* Input area */}
      <div>
        <label htmlFor="skill-input" className="mb-1.5 block text-sm font-medium text-foreground">
          Skills <span className="text-muted-foreground">(minimum 3)</span>
        </label>
        <div className="flex min-h-[80px] flex-wrap gap-2 rounded-md border border-input bg-background p-3 focus-within:border-ring focus-within:ring-1 focus-within:ring-ring">
          {data.skills.map((skill) => (
            <span
              key={skill}
              className="inline-flex items-center gap-1 rounded-full bg-secondary px-3 py-1 text-sm text-secondary-foreground"
            >
              {skill}
              <button
                type="button"
                onClick={() => removeSkill(skill)}
                className="ml-0.5 rounded-full p-0.5 hover:bg-foreground/10"
                aria-label={`Remove ${skill}`}
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
          <input
            id="skill-input"
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={data.skills.length === 0 ? 'Type a skill and press Enter...' : ''}
            className="min-w-[150px] flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
          />
        </div>
        <p className="mt-1.5 text-xs text-muted-foreground">
          Press Enter to add a skill, Backspace to remove the last one
        </p>
      </div>

      {/* Suggestions */}
      {availableSuggestions.length > 0 && (
        <div>
          <p className="mb-2 text-sm font-medium text-foreground">Quick add:</p>
          <div className="flex flex-wrap gap-2">
            {availableSuggestions.slice(0, 10).map((skill) => (
              <button
                key={skill}
                type="button"
                onClick={() => addSkill(skill)}
                className="inline-flex items-center gap-1 rounded-full border border-border bg-card px-3 py-1 text-sm text-muted-foreground transition-colors hover:border-accent/50 hover:text-accent"
              >
                <Plus className="h-3 w-3" />
                {skill}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Skill count indicator */}
      <div
        className={`rounded-md p-3 text-sm ${
          data.skills.length >= 3 ? 'bg-success/10 text-success' : 'bg-muted text-muted-foreground'
        }`}
      >
        {data.skills.length >= 3 ? (
          <span>✓ You&apos;ve added {data.skills.length} skills</span>
        ) : (
          <span>
            Add {3 - data.skills.length} more skill{3 - data.skills.length !== 1 ? 's' : ''} to continue
          </span>
        )}
      </div>
    </div>
  )
}
