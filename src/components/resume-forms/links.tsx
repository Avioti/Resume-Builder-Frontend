/**
 * Profile Links Form Component
 * GitHub, LinkedIn, Portfolio, and other professional links
 */
import { useState } from 'react'
import { Plus, Trash2, Link as LinkIcon, ExternalLink, AlertCircle } from 'lucide-react'
import { useExtendedResume, ProfileLink } from 'src/lib/extended-resume-context'
import { LinkType } from 'src/lib/resume-sections'

// Predefined link types with icons and placeholders
const LINK_TYPES: Array<{ type: LinkType; label: string; placeholder: string }> = [
  { type: 'linkedin', label: 'LinkedIn', placeholder: 'https://linkedin.com/in/yourname' },
  { type: 'github', label: 'GitHub', placeholder: 'https://github.com/yourname' },
  { type: 'portfolio', label: 'Portfolio', placeholder: 'https://yourportfolio.com' },
  { type: 'twitter', label: 'Twitter/X', placeholder: 'https://twitter.com/yourname' },
  { type: 'other', label: 'Other', placeholder: 'https://...' },
]

// Validate URL format
function isValidUrl(url: string): boolean {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

export function LinksForm() {
  const { data, addLink, updateLink, removeLink } = useExtendedResume()
  const { links } = data

  const [isAdding, setIsAdding] = useState(false)
  const [newLink, setNewLink] = useState<Omit<ProfileLink, 'id'>>({
    type: 'linkedin',
    url: '',
    label: '',
  })
  const [urlError, setUrlError] = useState('')

  const handleAddLink = () => {
    if (!newLink.url.trim()) {
      setUrlError('URL is required')
      return
    }

    if (!isValidUrl(newLink.url)) {
      setUrlError('Please enter a valid URL')
      return
    }

    addLink({
      ...newLink,
      label: newLink.label || getLinkLabel(newLink.type),
    })
    setNewLink({ type: 'linkedin', url: '', label: '' })
    setUrlError('')
    setIsAdding(false)
  }

  const getLinkLabel = (type: LinkType): string => {
    const linkType = LINK_TYPES.find((lt) => lt.type === type)
    return linkType?.label || 'Link'
  }

  const getPlaceholder = (type: LinkType): string => {
    const linkType = LINK_TYPES.find((lt) => lt.type === type)
    return linkType?.placeholder || 'https://...'
  }

  return (
    <div className="space-y-6">
      {/* Info banner */}
      <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
        <div className="flex items-start gap-3">
          <LinkIcon className="mt-0.5 h-5 w-5 text-primary" />
          <div>
            <p className="text-sm font-medium text-foreground">Professional Links</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Add your professional profiles. ATS systems can parse URLs from resumes, and recruiters often check
              LinkedIn and GitHub.
            </p>
          </div>
        </div>
      </div>

      {/* Existing links */}
      {links.length > 0 && (
        <div className="space-y-3">
          {links.map((link) => (
            <LinkCard key={link.id} link={link} onUpdate={updateLink} onRemove={removeLink} />
          ))}
        </div>
      )}

      {/* Add new link form */}
      {isAdding ? (
        <div className="rounded-lg border border-border bg-card p-4 shadow-sm">
          <h3 className="mb-4 font-medium">Add Profile Link</h3>

          <div className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium">Link Type</label>
              <select
                value={newLink.type}
                onChange={(e) => setNewLink({ ...newLink, type: e.target.value as LinkType })}
                className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              >
                {LINK_TYPES.map((type) => (
                  <option key={type.type} value={type.type}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium">URL *</label>
              <input
                type="url"
                value={newLink.url}
                onChange={(e) => {
                  setNewLink({ ...newLink, url: e.target.value })
                  setUrlError('')
                }}
                className={`h-10 w-full rounded-md border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring ${
                  urlError ? 'border-destructive' : 'border-input'
                }`}
                placeholder={getPlaceholder(newLink.type)}
              />
              {urlError && (
                <p className="mt-1 flex items-center gap-1 text-xs text-destructive">
                  <AlertCircle className="h-3 w-3" />
                  {urlError}
                </p>
              )}
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium">Custom Label (optional)</label>
              <input
                type="text"
                value={newLink.label}
                onChange={(e) => setNewLink({ ...newLink, label: e.target.value })}
                className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder={getLinkLabel(newLink.type)}
              />
              <p className="mt-1 text-xs text-muted-foreground">Leave empty to use default label</p>
            </div>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setIsAdding(false)
                  setUrlError('')
                }}
                className="h-9 rounded-md px-4 text-sm font-medium text-muted-foreground hover:text-foreground"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleAddLink}
                className="h-9 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90"
              >
                Add Link
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
          Add Profile Link
        </button>
      )}

      {/* Quick add buttons */}
      {!isAdding && links.length < 5 && (
        <div className="flex flex-wrap gap-2">
          <span className="text-xs text-muted-foreground">Quick add:</span>
          {LINK_TYPES.filter((type) => !links.some((l) => l.type === type.type)).map((type) => (
            <button
              key={type.type}
              type="button"
              onClick={() => {
                setNewLink({ type: type.type, url: '', label: '' })
                setIsAdding(true)
              }}
              className="rounded-full bg-secondary px-2.5 py-1 text-xs font-medium transition-colors hover:bg-secondary/80"
            >
              + {type.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

// Individual link card
function LinkCard({
  link,
  onUpdate,
  onRemove,
}: {
  link: ProfileLink
  onUpdate: (id: string, data: Partial<ProfileLink>) => void
  onRemove: (id: string) => void
}) {
  const [isEditing, setIsEditing] = useState(false)
  const [editUrl, setEditUrl] = useState(link.url)
  const [editLabel, setEditLabel] = useState(link.label)
  const [urlError, setUrlError] = useState('')

  const handleSave = () => {
    if (!isValidUrl(editUrl)) {
      setUrlError('Please enter a valid URL')
      return
    }
    onUpdate(link.id, { url: editUrl, label: editLabel })
    setIsEditing(false)
    setUrlError('')
  }

  const getLinkTypeLabel = (): string => {
    const linkType = LINK_TYPES.find((lt) => lt.type === link.type)
    return linkType?.label || 'Link'
  }

  return (
    <div className="group rounded-lg border border-border bg-card p-4 transition-shadow hover:shadow-sm">
      {isEditing ? (
        <div className="space-y-3">
          <div>
            <label className="mb-1 block text-xs font-medium text-muted-foreground">URL</label>
            <input
              type="url"
              value={editUrl}
              onChange={(e) => {
                setEditUrl(e.target.value)
                setUrlError('')
              }}
              className={`h-9 w-full rounded-md border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring ${
                urlError ? 'border-destructive' : 'border-input'
              }`}
            />
            {urlError && <p className="mt-1 text-xs text-destructive">{urlError}</p>}
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-muted-foreground">Label</label>
            <input
              type="text"
              value={editLabel}
              onChange={(e) => setEditLabel(e.target.value)}
              className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => {
                setIsEditing(false)
                setEditUrl(link.url)
                setEditLabel(link.label)
                setUrlError('')
              }}
              className="h-8 rounded px-3 text-sm text-muted-foreground hover:text-foreground"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="h-8 rounded bg-primary px-3 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              Save
            </button>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 overflow-hidden">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded bg-secondary">
              <LinkIcon className="h-4 w-4 text-muted-foreground" />
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="font-medium">{link.label || getLinkTypeLabel()}</span>
                <span className="rounded bg-muted px-1.5 py-0.5 text-[10px] uppercase text-muted-foreground">
                  {link.type}
                </span>
              </div>
              <a
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 truncate text-sm text-muted-foreground hover:text-primary"
              >
                {link.url}
                <ExternalLink className="h-3 w-3 shrink-0" />
              </a>
            </div>
          </div>
          <div className="flex gap-1">
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="rounded p-1.5 text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              Edit
            </button>
            <button
              type="button"
              onClick={() => onRemove(link.id)}
              className="rounded p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
