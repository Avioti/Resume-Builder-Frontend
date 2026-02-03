/**
 * Projects Form Component
 * Manages project entries with ATS-safe formatting
 */
import { useState } from 'react'
import { Plus, Trash2, ExternalLink, GripVertical } from 'lucide-react'
import { useExtendedResume, Project } from 'src/lib/extended-resume-context'
import { isValidUrl } from 'src/lib/resume-sections'

export function ProjectsForm() {
  const { data, addProject, updateProject, removeProject } = useExtendedResume()
  const { projects } = data

  const [isAdding, setIsAdding] = useState(false)
  const [newProject, setNewProject] = useState<Omit<Project, 'id'>>({
    name: '',
    role: '',
    url: '',
    startDate: '',
    endDate: '',
    current: false,
    description: '',
    technologies: [],
  })
  const [techInput, setTechInput] = useState('')

  const handleAddProject = () => {
    if (newProject.name.trim()) {
      addProject(newProject)
      setNewProject({
        name: '',
        role: '',
        url: '',
        startDate: '',
        endDate: '',
        current: false,
        description: '',
        technologies: [],
      })
      setTechInput('')
      setIsAdding(false)
    }
  }

  const handleAddTech = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && techInput.trim()) {
      e.preventDefault()
      setNewProject({
        ...newProject,
        technologies: [...(newProject.technologies || []), techInput.trim()],
      })
      setTechInput('')
    }
  }

  const handleRemoveTech = (index: number) => {
    setNewProject({
      ...newProject,
      technologies: newProject.technologies?.filter((_, i) => i !== index),
    })
  }

  return (
    <div className="space-y-6">
      {/* Existing projects */}
      {projects.length > 0 && (
        <div className="space-y-4">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} onUpdate={updateProject} onRemove={removeProject} />
          ))}
        </div>
      )}

      {/* Add new project form */}
      {isAdding ? (
        <div className="rounded-lg border border-border bg-card p-4 shadow-sm">
          <h3 className="mb-4 font-medium">Add Project</h3>

          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm font-medium">Project Name *</label>
                <input
                  type="text"
                  value={newProject.name}
                  onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                  className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="e.g., E-commerce Platform"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium">Your Role</label>
                <input
                  type="text"
                  value={newProject.role || ''}
                  onChange={(e) => setNewProject({ ...newProject, role: e.target.value })}
                  className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="e.g., Lead Developer"
                />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium">Project URL</label>
              <input
                type="url"
                value={newProject.url || ''}
                onChange={(e) => setNewProject({ ...newProject, url: e.target.value })}
                className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="https://github.com/username/project"
              />
              {newProject.url && !isValidUrl(newProject.url) && (
                <p className="mt-1 text-xs text-destructive">Please enter a valid URL</p>
              )}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm font-medium">Start Date</label>
                <input
                  type="month"
                  value={newProject.startDate || ''}
                  onChange={(e) => setNewProject({ ...newProject, startDate: e.target.value })}
                  className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium">End Date</label>
                <input
                  type="month"
                  value={newProject.endDate || ''}
                  onChange={(e) => setNewProject({ ...newProject, endDate: e.target.value })}
                  disabled={newProject.current}
                  className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50"
                />
                <label className="mt-2 flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={newProject.current}
                    onChange={(e) => setNewProject({ ...newProject, current: e.target.checked, endDate: '' })}
                    className="h-4 w-4 rounded border-input"
                  />
                  Ongoing project
                </label>
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium">Description</label>
              <textarea
                value={newProject.description}
                onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                rows={3}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="Describe the project, your contributions, and impact..."
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium">Technologies Used</label>
              <input
                type="text"
                value={techInput}
                onChange={(e) => setTechInput(e.target.value)}
                onKeyDown={handleAddTech}
                className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="Type a technology and press Enter"
              />
              {newProject.technologies && newProject.technologies.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {newProject.technologies.map((tech, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-1 rounded-full bg-secondary px-2.5 py-1 text-xs font-medium"
                    >
                      {tech}
                      <button
                        type="button"
                        onClick={() => handleRemoveTech(index)}
                        className="text-muted-foreground hover:text-foreground"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
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
                onClick={handleAddProject}
                disabled={!newProject.name.trim()}
                className="h-9 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
              >
                Add Project
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
          Add Project
        </button>
      )}
    </div>
  )
}

// Individual project card
function ProjectCard({
  project,
  onUpdate,
  onRemove,
}: {
  project: Project
  onUpdate: (id: string, data: Partial<Project>) => void
  onRemove: (id: string) => void
}) {
  const [isEditing, setIsEditing] = useState(false)

  const formatDate = (dateStr: string, current?: boolean) => {
    if (current) return 'Present'
    if (!dateStr) return ''
    const date = new Date(dateStr + '-01')
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
  }

  return (
    <div className="group rounded-lg border border-border bg-card p-4 transition-shadow hover:shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="mt-1 cursor-move text-muted-foreground/50 opacity-0 transition-opacity group-hover:opacity-100">
            <GripVertical className="h-4 w-4" />
          </div>
          <div>
            <h4 className="font-medium">{project.name}</h4>
            {project.role && <p className="text-sm text-muted-foreground">{project.role}</p>}
            {(project.startDate || project.endDate || project.current) && (
              <p className="text-xs text-muted-foreground">
                {formatDate(project.startDate || '')} - {formatDate(project.endDate || '', project.current)}
              </p>
            )}
            {project.url && (
              <a
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1 inline-flex items-center gap-1 text-xs text-primary hover:underline"
              >
                <ExternalLink className="h-3 w-3" />
                View Project
              </a>
            )}
          </div>
        </div>
        <div className="flex gap-1">
          <button
            type="button"
            onClick={() => setIsEditing(!isEditing)}
            className="rounded p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            Edit
          </button>
          <button
            type="button"
            onClick={() => onRemove(project.id)}
            className="rounded p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      {project.description && !isEditing && (
        <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{project.description}</p>
      )}

      {project.technologies && project.technologies.length > 0 && !isEditing && (
        <div className="mt-2 flex flex-wrap gap-1">
          {project.technologies.map((tech, i) => (
            <span key={i} className="rounded bg-secondary px-2 py-0.5 text-xs">
              {tech}
            </span>
          ))}
        </div>
      )}

      {/* Edit mode */}
      {isEditing && (
        <div className="mt-4 space-y-3 border-t border-border pt-4">
          <div>
            <label className="mb-1 block text-xs font-medium">Description</label>
            <textarea
              value={project.description}
              onChange={(e) => onUpdate(project.id, { description: e.target.value })}
              rows={3}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <button
            type="button"
            onClick={() => setIsEditing(false)}
            className="text-sm font-medium text-primary hover:text-primary/80"
          >
            Done
          </button>
        </div>
      )}
    </div>
  )
}
