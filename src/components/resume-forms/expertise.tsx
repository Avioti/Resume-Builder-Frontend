/**
 * Expertise Areas Form Component
 * Keyword clusters for ATS optimization
 */
import { useState } from 'react'
import { Plus, Trash2, Lightbulb } from 'lucide-react'
import { useExtendedResume, ExpertiseArea } from 'src/lib/extended-resume-context'

// Common expertise categories with example keywords
const EXPERTISE_SUGGESTIONS: Record<string, string[]> = {
  'Frontend Development': ['React', 'TypeScript', 'JavaScript', 'HTML5', 'CSS3', 'Tailwind CSS', 'Next.js', 'Vue.js'],
  'Backend Development': ['Node.js', 'Python', 'Java', 'REST APIs', 'GraphQL', 'PostgreSQL', 'MongoDB', 'Redis'],
  'Cloud & DevOps': ['AWS', 'Azure', 'GCP', 'Docker', 'Kubernetes', 'CI/CD', 'Terraform', 'Jenkins'],
  'Data Science': ['Python', 'Machine Learning', 'TensorFlow', 'PyTorch', 'SQL', 'Pandas', 'Data Visualization'],
  'Project Management': ['Agile', 'Scrum', 'Kanban', 'JIRA', 'Stakeholder Management', 'Risk Management'],
  'UI/UX Design': ['Figma', 'Sketch', 'User Research', 'Wireframing', 'Prototyping', 'Design Systems'],
  Leadership: ['Team Leadership', 'Mentoring', 'Strategic Planning', 'Cross-functional Collaboration'],
}

export function ExpertiseForm() {
  const { data, addExpertiseArea, updateExpertiseArea, removeExpertiseArea } = useExtendedResume()
  const { expertiseAreas } = data

  const [isAdding, setIsAdding] = useState(false)
  const [newArea, setNewArea] = useState<Omit<ExpertiseArea, 'id'>>({
    category: '',
    keywords: [],
  })
  const [keywordInput, setKeywordInput] = useState('')
  const [showSuggestions, setShowSuggestions] = useState(false)

  const handleAddArea = () => {
    if (newArea.category.trim() && newArea.keywords.length > 0) {
      addExpertiseArea(newArea)
      setNewArea({ category: '', keywords: [] })
      setKeywordInput('')
      setIsAdding(false)
    }
  }

  const handleAddKeyword = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && keywordInput.trim()) {
      e.preventDefault()
      if (!newArea.keywords.includes(keywordInput.trim())) {
        setNewArea({
          ...newArea,
          keywords: [...newArea.keywords, keywordInput.trim()],
        })
      }
      setKeywordInput('')
    }
  }

  const handleRemoveKeyword = (index: number) => {
    setNewArea({
      ...newArea,
      keywords: newArea.keywords.filter((_, i) => i !== index),
    })
  }

  const handleUseSuggestion = (category: string, keywords: string[]) => {
    setNewArea({ category, keywords: [...keywords] })
    setShowSuggestions(false)
  }

  return (
    <div className="space-y-6">
      {/* Info banner */}
      <div className="rounded-lg border border-accent/20 bg-accent/5 p-4">
        <div className="flex items-start gap-3">
          <Lightbulb className="mt-0.5 h-5 w-5 text-accent" />
          <div>
            <p className="text-sm font-medium text-foreground">ATS Keyword Optimization</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Group related skills into categories. ATS systems often look for skill clusters that match job
              requirements.
            </p>
          </div>
        </div>
      </div>

      {/* Existing expertise areas */}
      {expertiseAreas.length > 0 && (
        <div className="space-y-3">
          {expertiseAreas.map((area) => (
            <ExpertiseCard key={area.id} area={area} onUpdate={updateExpertiseArea} onRemove={removeExpertiseArea} />
          ))}
        </div>
      )}

      {/* Add new expertise area form */}
      {isAdding ? (
        <div className="rounded-lg border border-border bg-card p-4 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-medium">Add Expertise Area</h3>
            <button
              type="button"
              onClick={() => setShowSuggestions(!showSuggestions)}
              className="text-sm text-primary hover:text-primary/80"
            >
              {showSuggestions ? 'Hide Suggestions' : 'Show Suggestions'}
            </button>
          </div>

          {/* Suggestions dropdown */}
          {showSuggestions && (
            <div className="mb-4 rounded-lg border border-border bg-muted/50 p-3">
              <p className="mb-2 text-xs font-medium text-muted-foreground">Quick Add Templates</p>
              <div className="flex flex-wrap gap-2">
                {Object.entries(EXPERTISE_SUGGESTIONS).map(([category, keywords]) => (
                  <button
                    key={category}
                    type="button"
                    onClick={() => handleUseSuggestion(category, keywords)}
                    className="rounded-full bg-secondary px-3 py-1 text-xs font-medium transition-colors hover:bg-secondary/80"
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium">Category Name *</label>
              <input
                type="text"
                value={newArea.category}
                onChange={(e) => setNewArea({ ...newArea, category: e.target.value })}
                className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="e.g., Frontend Development"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium">Keywords *</label>
              <input
                type="text"
                value={keywordInput}
                onChange={(e) => setKeywordInput(e.target.value)}
                onKeyDown={handleAddKeyword}
                className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="Type a keyword and press Enter"
              />
              {newArea.keywords.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {newArea.keywords.map((keyword, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary"
                    >
                      {keyword}
                      <button
                        type="button"
                        onClick={() => handleRemoveKeyword(index)}
                        className="text-primary/60 hover:text-primary"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
              <p className="mt-1 text-xs text-muted-foreground">Added: {newArea.keywords.length} keywords</p>
            </div>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="h-9 rounded-md px-4 text-sm font-medium text-muted-foreground hover:text-foreground"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleAddArea}
                disabled={!newArea.category.trim() || newArea.keywords.length === 0}
                className="h-9 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
              >
                Add Expertise Area
              </button>
            </div>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setIsAdding(true)}
          className="flex w-full items-center justify-center gap-2 rounded-lg border-2 border-dashed border-border py-4 text-sm font-medium text-muted-foreground transition-colors hover:border-primary hover:text-primary"
        >
          <Plus className="h-4 w-4" />
          Add Expertise Area
        </button>
      )}
    </div>
  )
}

// Individual expertise area card
function ExpertiseCard({
  area,
  onUpdate,
  onRemove,
}: {
  area: ExpertiseArea
  onUpdate: (id: string, data: Partial<ExpertiseArea>) => void
  onRemove: (id: string) => void
}) {
  const [isEditing, setIsEditing] = useState(false)
  const [keywordInput, setKeywordInput] = useState('')

  const handleAddKeyword = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && keywordInput.trim()) {
      e.preventDefault()
      if (!area.keywords.includes(keywordInput.trim())) {
        onUpdate(area.id, { keywords: [...area.keywords, keywordInput.trim()] })
      }
      setKeywordInput('')
    }
  }

  const handleRemoveKeyword = (index: number) => {
    onUpdate(area.id, { keywords: area.keywords.filter((_, i) => i !== index) })
  }

  return (
    <div className="group rounded-lg border border-border bg-card p-4 transition-shadow hover:shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h4 className="font-medium">{area.category}</h4>
            <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
              {area.keywords.length} keywords
            </span>
          </div>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {area.keywords.map((keyword, index) => (
              <span
                key={index}
                className="group/tag inline-flex items-center gap-1 rounded bg-secondary px-2 py-0.5 text-xs"
              >
                {keyword}
                {isEditing && (
                  <button
                    type="button"
                    onClick={() => handleRemoveKeyword(index)}
                    className="text-muted-foreground hover:text-destructive"
                  >
                    ×
                  </button>
                )}
              </span>
            ))}
          </div>
        </div>
        <div className="flex gap-1">
          <button
            type="button"
            onClick={() => setIsEditing(!isEditing)}
            className="rounded p-1.5 text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            {isEditing ? 'Done' : 'Edit'}
          </button>
          <button
            type="button"
            onClick={() => onRemove(area.id)}
            className="rounded p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Edit mode */}
      {isEditing && (
        <div className="mt-3 border-t border-border pt-3">
          <input
            type="text"
            value={keywordInput}
            onChange={(e) => setKeywordInput(e.target.value)}
            onKeyDown={handleAddKeyword}
            className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            placeholder="Add more keywords..."
          />
        </div>
      )}
    </div>
  )
}
