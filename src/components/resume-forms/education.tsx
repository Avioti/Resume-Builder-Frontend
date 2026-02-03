import { useState } from 'react'
import { Plus, Trash2, ChevronDown, ChevronUp } from 'lucide-react'
import { useExtendedResume, Education } from 'src/lib/extended-resume-context'
import { Input, Textarea } from './personal-info'

interface EducationItemProps {
  education: Education
  isOpen: boolean
  onToggle: () => void
}

function EducationItem({ education, isOpen, onToggle }: EducationItemProps) {
  const { updateEducation, removeEducation } = useExtendedResume()

  return (
    <div className="rounded-lg border border-border bg-background">
      {/* Header - always visible */}
      <button type="button" onClick={onToggle} className="flex w-full items-center justify-between p-4 text-left">
        <div className="min-w-0 flex-1">
          <p className="truncate font-medium text-foreground">{education.degree || 'New Degree'}</p>
          <p className="truncate text-sm text-muted-foreground">{education.institution || 'Institution Name'}</p>
        </div>
        <div className="ml-4 flex items-center gap-2">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              removeEducation(education.id)
            }}
            className="rounded p-1 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
            aria-label="Remove education"
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
                label="Institution"
                id={`institution-${education.id}`}
                type="text"
                required
                placeholder="Stanford University"
                value={education.institution}
                onChange={(e) => updateEducation(education.id, { institution: e.target.value })}
              />
              <Input
                label="Degree"
                id={`degree-${education.id}`}
                type="text"
                required
                placeholder="Bachelor of Science"
                value={education.degree}
                onChange={(e) => updateEducation(education.id, { degree: e.target.value })}
              />
            </div>

            <Input
              label="Field of Study"
              id={`field-${education.id}`}
              type="text"
              placeholder="Computer Science"
              value={education.field}
              onChange={(e) => updateEducation(education.id, { field: e.target.value })}
            />

            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                label="Start Date"
                id={`eduStartDate-${education.id}`}
                type="month"
                value={education.startDate}
                onChange={(e) => updateEducation(education.id, { startDate: e.target.value })}
              />
              <Input
                label="End Date (or Expected)"
                id={`eduEndDate-${education.id}`}
                type="month"
                value={education.endDate}
                onChange={(e) => updateEducation(education.id, { endDate: e.target.value })}
              />
            </div>

            <Textarea
              label="Additional Details (Optional)"
              id={`eduDescription-${education.id}`}
              placeholder="Honors, relevant coursework, GPA, activities..."
              value={education.description}
              onChange={(e) => updateEducation(education.id, { description: e.target.value })}
            />
          </div>
        </div>
      )}
    </div>
  )
}

export function EducationForm() {
  const { data, addEducation } = useExtendedResume()
  const [openId, setOpenId] = useState<string | null>(
    data.education.length > 0 ? data.education[data.education.length - 1].id : null,
  )

  const handleAdd = () => {
    const newEducation = {
      institution: '',
      degree: '',
      field: '',
      startDate: '',
      endDate: '',
      description: '',
    }
    addEducation(newEducation)
    setTimeout(() => {
      const items = document.querySelectorAll('[data-education-id]')
      const lastId = items[items.length - 1]?.getAttribute('data-education-id')
      if (lastId) setOpenId(lastId)
    }, 50)
  }

  return (
    <div className="space-y-4">
      {data.education.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border bg-muted/30 p-8 text-center">
          <p className="mb-4 text-muted-foreground">No education added yet</p>
          <button
            type="button"
            onClick={handleAdd}
            className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            <Plus className="h-4 w-4" />
            Add Education
          </button>
        </div>
      ) : (
        <>
          <div className="space-y-3">
            {data.education.map((edu) => (
              <div key={edu.id} data-education-id={edu.id}>
                <EducationItem
                  education={edu}
                  isOpen={openId === edu.id}
                  onToggle={() => setOpenId(openId === edu.id ? null : edu.id)}
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
            Add Another Education
          </button>
        </>
      )}
    </div>
  )
}
