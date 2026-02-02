import { useState } from 'react'
import { Plus, Trash2, ChevronDown, ChevronUp } from 'lucide-react'
import { useResume, Experience } from 'src/lib/resume-context'
import { Input, Textarea } from './personal-info'

interface ExperienceItemProps {
  experience: Experience
  isOpen: boolean
  onToggle: () => void
}

function ExperienceItem({ experience, isOpen, onToggle }: ExperienceItemProps) {
  const { updateExperience, removeExperience } = useResume()

  return (
    <div className="rounded-lg border border-border bg-background">
      {/* Header - always visible */}
      <button type="button" onClick={onToggle} className="flex w-full items-center justify-between p-4 text-left">
        <div className="min-w-0 flex-1">
          <p className="truncate font-medium text-foreground">{experience.position || 'New Position'}</p>
          <p className="truncate text-sm text-muted-foreground">{experience.company || 'Company Name'}</p>
        </div>
        <div className="ml-4 flex items-center gap-2">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              removeExperience(experience.id)
            }}
            className="rounded p-1 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
            aria-label="Remove experience"
          >
            <Trash2 className="h-4 w-4" />
          </button>
          {isOpen ? (
            <ChevronUp className="h-4 w-4 text-muted-foreground" />
          ) : (
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          )}
        </div>
      </button>

      {/* Form - collapsible */}
      {isOpen && (
        <div className="border-t border-border p-4">
          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                label="Job Title"
                id={`position-${experience.id}`}
                type="text"
                required
                placeholder="Senior Software Engineer"
                value={experience.position}
                onChange={(e) => updateExperience(experience.id, { position: e.target.value })}
              />
              <Input
                label="Company"
                id={`company-${experience.id}`}
                type="text"
                required
                placeholder="Acme Corp"
                value={experience.company}
                onChange={(e) => updateExperience(experience.id, { company: e.target.value })}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                label="Start Date"
                id={`startDate-${experience.id}`}
                type="month"
                required
                value={experience.startDate}
                onChange={(e) => updateExperience(experience.id, { startDate: e.target.value })}
              />
              <div>
                <Input
                  label="End Date"
                  id={`endDate-${experience.id}`}
                  type="month"
                  value={experience.endDate}
                  disabled={experience.current}
                  onChange={(e) => updateExperience(experience.id, { endDate: e.target.value })}
                />
                <label className="mt-2 flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={experience.current}
                    onChange={(e) =>
                      updateExperience(experience.id, {
                        current: e.target.checked,
                        endDate: e.target.checked ? '' : experience.endDate,
                      })
                    }
                    className="h-4 w-4 rounded border-input text-accent focus:ring-accent"
                  />
                  <span className="text-sm text-muted-foreground">I currently work here</span>
                </label>
              </div>
            </div>

            <Textarea
              label="Description"
              id={`description-${experience.id}`}
              placeholder="Describe your responsibilities and achievements. Use action verbs and quantify results when possible..."
              value={experience.description}
              onChange={(e) => updateExperience(experience.id, { description: e.target.value })}
            />
          </div>
        </div>
      )}
    </div>
  )
}

export function ExperienceForm() {
  const { data, addExperience } = useResume()
  const [openId, setOpenId] = useState<string | null>(
    data.experiences.length > 0 ? data.experiences[data.experiences.length - 1].id : null,
  )

  const handleAdd = () => {
    const newExperience = {
      company: '',
      position: '',
      startDate: '',
      endDate: '',
      current: false,
      description: '',
    }
    addExperience(newExperience)
    // Open the new item after a brief delay to allow state to update
    setTimeout(() => {
      const experiences = document.querySelectorAll('[data-experience-id]')
      const lastId = experiences[experiences.length - 1]?.getAttribute('data-experience-id')
      if (lastId) setOpenId(lastId)
    }, 50)
  }

  return (
    <div className="space-y-4">
      {data.experiences.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border bg-muted/30 p-8 text-center">
          <p className="mb-4 text-muted-foreground">No work experience added yet</p>
          <button
            type="button"
            onClick={handleAdd}
            className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            <Plus className="h-4 w-4" />
            Add Experience
          </button>
        </div>
      ) : (
        <>
          <div className="space-y-3">
            {data.experiences.map((exp) => (
              <div key={exp.id} data-experience-id={exp.id}>
                <ExperienceItem
                  experience={exp}
                  isOpen={openId === exp.id}
                  onToggle={() => setOpenId(openId === exp.id ? null : exp.id)}
                />
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={handleAdd}
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-border py-3 text-sm font-medium text-muted-foreground transition-colors hover:border-accent/50 hover:text-accent"
          >
            <Plus className="h-4 w-4" />
            Add Another Position
          </button>
        </>
      )}
    </div>
  )
}
